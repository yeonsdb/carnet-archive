// SHOP interaction + responsive checks (local Edge via playwright-core).
// Usage: node scripts/check-shop.mjs
import { chromium } from 'playwright-core';

const base = process.env.BASE_URL ?? 'http://localhost:5173';
const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(base + '/shop', { waitUntil: 'networkidle' });

const desktopCards = page.locator('.shop .pcard.abs');
check('desktop shows 10 products', (await desktopCards.count()) === 10);

// S-3 image swap on hover and back
const card = desktopCards.first();
const media = card.locator('.pcard__media');
const op = () => card.locator('.pcard__cutout').evaluate((el) => getComputedStyle(el).opacity);
const before = await op();
await media.hover(); await page.waitForTimeout(400);
const during = await op();
const modelHidden = await card.locator('.pcard__model').evaluate((el) => getComputedStyle(el).opacity);
await page.mouse.move(5, 5); await page.waitForTimeout(400);
const after = await op();
check('S-3 model → cut-out on hover, back on leave', before === '0' && during === '1' && modelHidden === '0' && after === '0', `${before}→${during}→${after}`);
const filters = await page.evaluate(() => [...document.querySelectorAll('.pcard__layer')].map((e) => getComputedStyle(e).filter).filter((f) => f !== 'none'));
check('no CSS filters on product images', filters.length === 0, filters.join(','));

// S-1 categories: OUTERWEAR selected (all products); ALL / BOTTOMS / TOPS / ACC not clickable, colour-only hover
const outer = page.getByRole('button', { name: 'OUTERWEAR' });
check('OUTERWEAR selected, lists all products', (await outer.getAttribute('aria-pressed')) === 'true' && (await desktopCards.count()) === 10);
check('ALL/BOTTOMS/TOPS/ACC are not buttons', (await page.locator('.catlink.is-inert button').count()) === 0 && (await page.locator('.catlink.is-inert').count()) === 4
  && (await page.locator('.catlink.is-inert .catlink__label').first().textContent()) === 'ALL');
for (const name of ['ALL', 'BOTTOMS']) {
  const inert = page.locator('.catlink.is-inert').filter({ hasText: name });
  const label = inert.locator('.catlink__label');
  await page.mouse.move(5, 5); await page.waitForTimeout(350);
  const c0 = await label.evaluate((el) => `${getComputedStyle(el).color} ${getComputedStyle(el).fontWeight}`);
  await inert.hover(); await page.waitForTimeout(400);
  const c1 = await label.evaluate((el) => `${getComputedStyle(el).color} ${getComputedStyle(el).fontWeight}`);
  const outerWhileHover = await outer.locator('.catlink__label').evaluate((el) => getComputedStyle(el).color);
  check(`hovering ${name}: selected OUTERWEAR label turns black`, outerWhileHover === 'rgb(0, 0, 0)', outerWhileHover);
  await inert.click({ force: true });
  const stillOuter = (await outer.getAttribute('aria-pressed')) === 'true' && (await desktopCards.count()) === 10;
  check(`inert ${name}: colour changes, weight unchanged, click ignored`, c0 === 'rgb(0, 0, 0) 700' && c1 === 'rgb(131, 26, 31) 700' && stillOuter, `${c0} -> ${c1}`);
}
await page.mouse.move(5, 5); await page.waitForTimeout(400);
const outerRest = await outer.locator('.catlink__label').evaluate((el) => getComputedStyle(el).color);
check('cursor away: OUTERWEAR label red again', outerRest === 'rgb(131, 26, 31)', outerRest);

// Sort dropdown
await page.getByRole('button', { name: 'FILTER' }).click();
const opened = await page.locator('.sort.is-open').count();
await page.getByRole('option', { name: '낮은 가격순' }).click();
const firstName = await desktopCards.first().locator('.pcard__name-d').textContent();
check('sort opens and orders by price (asc)', opened === 1 && firstName === 'RIDER DENIM JACKET', `first=${firstName}`);
await page.getByRole('button', { name: 'FILTER' }).click();
await page.getByRole('option', { name: '후기순' }).click({ force: true });
check('disabled sort option does nothing', (await page.locator('.sort.is-open').count()) === 1);
await page.keyboard.press('Escape');
check('Escape closes the sort menu', (await page.locator('.sort.is-open').count()) === 0);

// S-4 typewriter + cursor timing
await page.goto(base + '/shop', { waitUntil: 'networkidle' });
const tw = page.locator('.typewriter');
await tw.scrollIntoViewIfNeeded();
await page.waitForFunction(() => document.querySelector('.typewriter')?.textContent?.endsWith('RECONSTRUCTION...'), null, { timeout: 8000 });
const typed = await tw.textContent();
const cursorEarly = await page.locator('.typewriter__cursor').evaluate((el) => getComputedStyle(el).visibility);
await page.waitForTimeout(1200);
const cursorVis = await page.locator('.typewriter__cursor').evaluate((el) => getComputedStyle(el).visibility);
check('S-4 typewriter completes, cursor hidden until +1000ms then shown', typed?.endsWith('RECONSTRUCTION...') && cursorEarly === 'hidden' && cursorVis === 'visible', `${cursorEarly} → ${cursorVis}`);

// card → product route
await desktopCards.first().locator('.pcard__media').click();
await page.waitForURL('**/product/**');
check('card links to /product/:slug', /\/product\/[a-z0-9-]+$/.test(page.url()), page.url());

// Narrow layout: 6 cards, 1 column by default, grid toggle → 2 columns
await page.setViewportSize({ width: 393, height: 900 });
await page.goto(base + '/shop', { waitUntil: 'networkidle' });
const items = page.locator('.shop__item');
const n = await items.count();
const cols = async () => page.locator('.shop__grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
const c1col = await cols();
await page.getByRole('button', { name: '2열로 보기' }).click();
const c2col = await cols();
await page.getByRole('button', { name: '1열로 보기' }).click();
const c1back = await cols();
check('mobile: 6 cards, 1 col → 2 col → 1 col', n === 6 && c1col === 1 && c2col === 2 && c1back === 1, `${n} cards, ${c1col}/${c2col}/${c1back}`);
const h = await page.evaluate(() => document.documentElement.scrollHeight);
// Figma card images vary between 481.5 and 482.3 high, the implementation uses the exact 3:4 ratio → ≤ 4px drift
check('mobile page height ≈ 4097 (Figma)', Math.abs(h - 4097) <= 4, `${h}`);

for (const w of [1920, 1440, 1280, 1279, 1024, 768, 393, 360]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(base + '/shop', { waitUntil: 'networkidle' });
  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  check(`responsive ${w}px no horizontal overflow`, m.sw <= m.cw, `${m.sw}/${m.cw}`);
}

check('no runtime errors', errors.length === 0, errors.join(' | '));
await browser.close();
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
process.exitCode = results.every((r) => r.ok) ? 0 : 1;
