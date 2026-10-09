// Site-wide checks: navigation between pages, link inventory, every page × width, scroll reset, fallbacks.
// Usage: node scripts/check-site.mjs   (BASE_URL=http://localhost:4173 to test the production build via `vite preview`)
import { chromium } from 'playwright-core';

const base = process.env.BASE_URL ?? 'http://localhost:5173';
const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });
const settle = async (p) => { let last = -1; for (let i = 0; i < 40; i++) { const y = await p.evaluate(() => window.scrollY); if (y === last) return; last = y; await p.waitForTimeout(150); } };

const PAGES = [
  { path: '/', name: 'HOME', h: { 1920: 8812, 393: 4028 } },
  { path: '/shop', name: 'SHOP', h: { 1920: 6376, 393: 4097 } },
  { path: '/product/paper-crustacean-padded-short-bomber-jacket', name: 'PRODUCT', h: { 1920: 11639, 393: 4704 } },
];
const WIDTHS = [1920, 1440, 1280, 1279, 1024, 768, 393, 360];

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`${page.url()} ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errors.push(`${page.url()} ${m.text()}`); });
page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });

// 1. link inventory: only the agreed links exist (logo → /, NEW IN → /shop, product cards → /product/:slug)
const allowed = (href) => href === '/' || href === '/shop' || /^\/product\/[a-z0-9-]+$/.test(href);
for (const pg of PAGES) {
  await page.goto(base + pg.path, { waitUntil: 'networkidle' });
  const hrefs = await page.evaluate(() => [...document.querySelectorAll('a')].map((a) => a.getAttribute('href')));
  const bad = hrefs.filter((h) => !h || !allowed(h));
  check(`${pg.name}: only agreed link targets`, bad.length === 0, bad.length ? bad.join(', ') : `${hrefs.length} links`);
}

// 2. navigation flow HOME → NEW IN → SHOP → card → PRODUCT → logo → HOME, scroll resets on each route
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.getByRole('link', { name: '1ST DROP NEW IN — SHOP' }).click();
await page.waitForURL('**/shop'); await settle(page);
check('HOME NEW IN → SHOP, scrolled to top', (await page.evaluate(() => window.scrollY)) === 0, page.url());
await page.locator('.shop .pcard.abs .pcard__media').nth(3).click();
await page.waitForURL('**/product/**'); await settle(page);
check('SHOP card → PRODUCT, scrolled to top', (await page.evaluate(() => window.scrollY)) === 0, page.url());
await page.goBack(); await page.waitForURL('**/shop');
check('browser Back returns to SHOP', page.url().endsWith('/shop'));
await page.goForward(); await page.waitForURL('**/product/**');
await page.getByRole('link', { name: 'CARNET-ARCHIVE 홈' }).click();
await page.waitForURL(base + '/'); await settle(page);
check('header logo → HOME, scrolled to top', (await page.evaluate(() => window.scrollY)) === 0);

// 3. every product card opens a product page with the shared detail content
await page.goto(base + '/shop', { waitUntil: 'networkidle' });
const slugs = await page.locator('.shop .pcard.abs .pcard__media').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
let okCount = 0;
for (const s of slugs) {
  await page.goto(base + s, { waitUntil: 'domcontentloaded' });
  if ((await page.locator('h1').first().textContent()) === 'PAPER CRUSTACEAN PADDED SHORT BOMBER JACKET') okCount++;
}
check('all 10 product links open the detail page', slugs.length === 10 && okCount === 10, `${okCount}/${slugs.length}`);

// 4. fallbacks
await page.goto(base + '/does/not/exist', { waitUntil: 'networkidle' });
check('unknown path → HOME', new URL(page.url()).pathname === '/', page.url());

// 5. inert controls really do nothing (no navigation, no error)
await page.goto(base + '/', { waitUntil: 'networkidle' });
const before = page.url();
for (const el of await page.locator('.site-header .glyph:visible').all()) await el.click({ force: true });
check('header menu / account / cart are inert (no target design)', page.url() === before);

// 6. every page × width: no horizontal overflow, no broken images, Figma height at 1920 / 393
for (const pg of PAGES) {
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(base + pg.path, { waitUntil: 'networkidle' });
    const m = await page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
      await new Promise((r) => setTimeout(r, 300));
      return {
        sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h,
        broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
        unloaded: [...document.images].filter((i) => !i.complete).length,
      };
    });
    const target = pg.h[w];
    // SHOP mobile: Figma card images vary in height (≤ 4px drift, see check-shop)
    const hOk = target === undefined || Math.abs(m.h - target) <= (pg.name === 'SHOP' ? 4 : 0);
    check(`${pg.name} ${w}px: no overflow, images ok${target ? `, height ${target}` : ''}`,
      m.sw <= m.cw && m.broken.length === 0 && hOk,
      `${m.sw}/${m.cw} h${m.h} broken ${m.broken.length} pending ${m.unloaded}`);
  }
}

check('no runtime errors / failed requests', errors.length === 0, errors.slice(0, 5).join(' | '));
await browser.close();
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
process.exitCode = results.every((r) => r.ok) ? 0 : 1;
