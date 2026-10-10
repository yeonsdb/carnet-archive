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
// + footer contact directory: mailto: addresses and the Instagram profile
const allowed = (href) => href === '/' || href === '/shop' || /^\/product\/[a-z0-9-]+$/.test(href)
  || /^mailto:[A-Z]+@CARNETARCHIVE\.COM$/.test(href) || href === 'https://www.instagram.com/carnetarchive/';
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

// Desktop Header + Hero span the browser width: menu icon 60px from the left, cart 60px from the right, logo centred,
// hero image full width (y 60–1080: right under the header, height 1020 × scale), wordmark CARNET 60 left / separator centred / ARCHIVE 60 right
for (const w of [2560, 1920, 1440]) {
  await page.setViewportSize({ width: w, height: 1100 });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForSelector('.glitch-group.is-done', { timeout: 6000 });
  const g = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth, u = Math.min(vw, 1920) / 1920;
    const R = (e) => e.getBoundingClientRect();
    const vis = (s) => [...document.querySelectorAll(s)].find((e) => R(e).width > 0);
    const glyphs = [...document.querySelectorAll('.site-header .glyph')].filter((e) => R(e).width > 0).map(R);
    const ink = (e) => { const r = document.createRange(); r.selectNodeContents(e); return r.getBoundingClientRect(); };
    const logo = R(document.querySelector('.site-header__logo')), hero = R(vis('.hero__img')), sep = R(vis('.hero__sep'));
    return {
      menuL: glyphs[0].left, cartR: vw - glyphs[2].right, gap: glyphs[2].left - glyphs[1].right, gapDesign: 21 * u,
      logoC: logo.left + logo.width / 2 - vw / 2, header: R(document.querySelector('.site-header .section')).width - vw,
      heroL: hero.left, heroW: hero.width - vw, heroH: hero.height - 1020 * u, heroT: hero.top - 60 * u,
      carnetL: R(vis('.hero__carnet')).left - 60 * u, sepC: sep.left + sep.width / 2 - vw / 2,
      archiveL: R(vis('.hero__archive')).left - (vw - 817 * u), sw: document.documentElement.scrollWidth - vw,
    };
  });
  const near = (v) => Math.abs(v) < 0.6;
  check(`desktop ${w}: header full width, menu 60px / cart 60px from the edges, logo centred, icon gap as designed`,
    near(g.header) && near(g.menuL - 60) && near(g.cartR - 60) && near(g.logoC) && near(g.gap - g.gapDesign), JSON.stringify(g));
  check(`desktop ${w}: hero image full width (height as designed), wordmark 60 / centre / 60, no horizontal scroll`,
    near(g.heroL) && near(g.heroW) && near(g.heroH) && near(g.heroT) && near(g.carnetL) && near(g.sepC) && near(g.archiveL) && g.sw === 0, JSON.stringify(g));
}

// Hero photo: desktop hero.webp, mobile (narrow) hero-m.webp; each width shows and downloads only its own photo
for (const w of [1920, 393]) {
  const p2 = await browser.newPage({ viewport: { width: w, height: 900 } });
  const got = [];
  p2.on('request', (r) => { const m = r.url().match(/\/images\/home\/(hero(?:-m)?\.webp)/); if (m) got.push(m[1]); });
  await p2.goto(base + '/', { waitUntil: 'networkidle' });
  const shown = await p2.evaluate(() => [...document.querySelectorAll('img')].filter((i) => /\/hero(-m)?\.webp/.test(i.src) && i.getBoundingClientRect().width > 0 && i.complete && i.naturalWidth > 0).map((i) => i.src.split('/').pop()));
  const want = w === 1920 ? 'hero.webp' : 'hero-m.webp';
  check(`hero ${w}px: shows ${want} only, the other photo is not downloaded`, shown.join() === want && [...new Set(got)].join() === want, `shown ${shown} / requested ${[...new Set(got)]}`);
  await p2.close();
}

check('no runtime errors / failed requests', errors.length === 0, errors.slice(0, 5).join(' | '));
await browser.close();
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
process.exitCode = results.every((r) => r.ok) ? 0 : 1;
