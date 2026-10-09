// HOME interaction + responsive checks (local Edge via playwright-core).
// Usage: node scripts/check-home.mjs
import { chromium } from 'playwright-core';

const base = process.env.BASE_URL ?? 'http://localhost:5173';
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); };

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(base + '/', { waitUntil: 'networkidle' });

// H-1 glitch reveal runs on the wordmark
// one block-dither reveal for the whole wordmark; ends with the real DOM text visible
await page.waitForSelector('.glitch-group.is-done', { timeout: 6000 });
const anim = await page.evaluate(() => {
  const main = document.querySelector('.glitch-group__main');
  return {
    groups: document.querySelectorAll('.glitch-group').length,
    parts: [...main.children].map((c) => c.textContent || 'line').join('|'),
    visible: getComputedStyle(main).visibility,
    canvas: getComputedStyle(document.querySelector('.glitch-group__canvas')).display,
  };
});
check('H-1 one dither reveal for the whole wordmark (CARNET + line + ARCHIVE), DOM text shown at the end',
  anim.groups === 1 && anim.parts === 'CARNET|line|ARCHIVE' && anim.visible === 'visible' && anim.canvas === 'none', JSON.stringify(anim));

// H-2 gallery: opens at the Figma composition; mouse drag scrolls it; the wheel scrolls the page (not the gallery)
const g = page.locator('.hgallery');
await g.scrollIntoViewIfNeeded();
const start = await g.evaluate((el) => el.scrollLeft);
check('H-2 gallery initial offset (≈365.8 design px)', Math.abs(start - 365.8) < 2, `scrollLeft=${start}`);
const box = await g.boundingBox();
const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
await page.mouse.move(cx, cy);
await page.mouse.down(); await page.mouse.move(cx - 150, cy, { steps: 6 }); await page.mouse.move(cx - 300, cy, { steps: 6 }); await page.mouse.up();
const afterDrag = await g.evaluate((el) => el.scrollLeft);
check('H-2 dragging left scrolls the gallery right by the drag distance', Math.abs(afterDrag - start - 300) < 2, `scrollLeft ${start}→${afterDrag}`);
const cursor = await g.evaluate((el) => getComputedStyle(el).cursor);
check('H-2 grab cursor over the gallery', cursor === 'grab', cursor);
const pageY0 = await page.evaluate(() => scrollY);
await page.mouse.wheel(0, 300);
await page.waitForTimeout(400);
const pageY1 = await page.evaluate(() => scrollY);
const afterWheel = await g.evaluate((el) => el.scrollLeft);
check('H-2 wheel over the gallery scrolls the page, not the gallery', pageY1 > pageY0 && afterWheel === afterDrag, `pageY ${pageY0}→${pageY1}, scrollLeft ${afterDrag}→${afterWheel}`);

// H-3 look hover enlarges
const look = page.locator('.hgallery__item').nth(4);
await look.scrollIntoViewIfNeeded();
await look.hover();
await page.waitForTimeout(400);
const lookT = await look.evaluate((el) => getComputedStyle(el).transform);
check('H-3 hovered look enlarges', lookT !== 'none', lookT);

// H-4 category hover swap (mouse only)
const hit = page.locator('.swap__hit').first();
await hit.scrollIntoViewIfNeeded();
const hoverImg = page.locator('.swap__hover').first();
const op0 = await hoverImg.evaluate((el) => getComputedStyle(el).opacity);
await hit.hover();
await page.waitForTimeout(400);
const op1 = await hoverImg.evaluate((el) => getComputedStyle(el).opacity);
await page.mouse.move(5, 5);
await page.waitForTimeout(400);
const op2 = await hoverImg.evaluate((el) => getComputedStyle(el).opacity);
check('H-4 category image swaps on hover and back', op0 === '0' && op1 === '1' && op2 === '0', `${op0} → ${op1} → ${op2}`);

// H-6 collection switch SS26 ↔ AW26
const toAW = page.getByRole('button', { name: 'AW26 컬렉션 보기' });
await toAW.scrollIntoViewIfNeeded();
await toAW.click();
const aw = await page.getByText('SS27: BRUTALIST').isVisible();
const back = page.getByRole('button', { name: 'SS26 컬렉션으로 돌아가기' });
await back.click();
const ss = await page.getByText("AW25: AW25 LAMB'S HEAD AND THE SHELL").isVisible();
check('H-6 SS26 → AW26 → SS26 switch', aw && ss, `aw26=${aw} ss26=${ss}`);

// H-5 collection image hover
const colImg = page.locator('.col__img').nth(1);
await colImg.hover();
await page.waitForTimeout(400);
check('H-5 collection image enlarges on hover', (await colImg.evaluate((el) => getComputedStyle(el).transform)) !== 'none');

// H-8 stockist hover
const row = page.locator('.stockist').first();
await row.scrollIntoViewIfNeeded();
await row.hover();
await page.waitForTimeout(400);
const nameStyle = await row.locator('.stockist__name').evaluate((el) => `${getComputedStyle(el).color} ${getComputedStyle(el).fontWeight}`);
check('H-8 stockist hover → #831A1F SemiBold', nameStyle === 'rgb(131, 26, 31) 600', nameStyle);

// Hover colour #831A1F: category label while its image is hovered; season nav (name + arrow); VIEW ALL; footer links
await page.setViewportSize({ width: 1920, height: 1000 });
await page.goto(base + '/', { waitUntil: 'networkidle' });
const ACCENT = 'rgb(131, 26, 31)';
const colorOf = (loc) => loc.evaluate((el) => getComputedStyle(el).color);
const hoverColor = async (target, part) => {
  await page.mouse.move(5, 5); await page.waitForTimeout(350);
  const before = await colorOf(part);
  await target.hover({ force: true }); await page.waitForTimeout(400);
  return [before, await colorOf(part)];
};
for (const name of ['ALL', 'OUTERWEAR', 'BOTTOMS', 'TOPS', 'ACC']) {
  const group = page.locator('.hover-group').filter({ has: page.locator('.hover-accent', { hasText: new RegExp(`^${name}$`) }) }).first();
  const [b, a] = await hoverColor(group.locator('.swap__hit'), group.locator('.hover-accent', { hasText: new RegExp(`^${name}$`) }));
  check(`SHOP category ${name}: label turns #831A1F while its image is hovered`, b !== ACCENT && a === ACCENT, `${b} -> ${a}`);
}
const navNext = page.locator('.hover-group').filter({ hasText: 'AW26: [UNEARTH: FILE-2711]' });
let [b1, a1] = await hoverColor(navNext.locator('.col__switch'), navNext.locator('.t'));
const arrowNext = await colorOf(navNext.locator('span.hover-accent').first());
check('COLLECTIONS next season: name + arrow turn #831A1F on hover', b1 !== ACCENT && a1 === ACCENT && arrowNext === ACCENT, `${b1} -> ${a1}, arrow ${arrowNext}`);
const navPrev = page.locator('.hover-group').filter({ hasText: "AW25: AW25 LAMB'S HEAD AND THE SHELL" });
[b1, a1] = await hoverColor(navPrev.locator('.t'), navPrev.locator('.t'));
check('COLLECTIONS previous season (no design): colour-only hover', b1 !== ACCENT && a1 === ACCENT, `${b1} -> ${a1}`);
const viewAll = page.locator('.hover-group').filter({ hasText: 'VIEW ALL' }).first();
[b1, a1] = await hoverColor(viewAll.locator('.media'), viewAll.locator('.t'));
check('COLLECTIONS VIEW ALL: text turns #831A1F on hover', b1 !== ACCENT && a1 === ACCENT, `${b1} -> ${a1}`);
const mail = page.locator('footer a[href^="mailto:"]');
const ig = page.locator('footer a[href*="instagram.com"]');
check('footer contact addresses are links (4 mailto + Instagram)', (await mail.count()) === 4 && (await ig.count()) === 1 && (await ig.getAttribute('target')) === '_blank');
[b1, a1] = await hoverColor(mail.first(), mail.first());
check('footer contact link hover #831A1F', a1 === ACCENT, `${b1} -> ${a1}`);

// COLLECTIONS brush strokes paint in with scrolling (0 before the section, 1 once it is up)
{
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const colTop = await page.evaluate(() => [...document.querySelectorAll('section.band')].find((b) => b.getAttribute('aria-label') === 'Collections').getBoundingClientRect().top + scrollY);
  const brushAt = async (y) => { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(200);
    return page.evaluate(() => parseFloat(getComputedStyle([...document.querySelectorAll('section.band')].find((b) => b.getAttribute('aria-label') === 'Collections').querySelector('.section')).getPropertyValue('--brush'))); };
  const b0 = await brushAt(colTop - 1100), b1 = await brushAt(colTop - 500), b2 = await brushAt(colTop);
  check('COLLECTIONS brush reveals with scroll (0 -> partial -> 1)', b0 === 0 && b1 > 0 && b1 < 1 && b2 === 1, `${b0} / ${b1} / ${b2}`);
}

// SHOP category cards: image and label both open /shop
for (const [name, part] of [['ALL', 'image'], ['TOPS', 'label'], ['ACC', 'image'], ['BOTTOMS', 'label']]) {
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const group = page.locator('.hover-group').filter({ has: page.locator('.hover-accent', { hasText: new RegExp(`^${name}$`) }) }).first();
  const target = part === 'image' ? group.locator('a.swap__hit') : group.locator('.hover-accent', { hasText: new RegExp(`^${name}$`) });
  await target.scrollIntoViewIfNeeded();
  await target.click({ force: true });
  await page.waitForURL('**/shop', { timeout: 5000 }).catch(() => {});
  check(`SHOP category ${name}: clicking the ${part} opens /shop`, page.url().endsWith('/shop'), page.url());
}

// narrow layout: VIEW ALL is 12px, centred in its cell
await page.setViewportSize({ width: 600, height: 900 });
await page.goto(base + '/', { waitUntil: 'networkidle' });
const va = await page.evaluate(() => {
  const t = [...document.querySelectorAll('.col__viewall-text')].find((e) => e.offsetParent);
  const cell = document.querySelector('.col__nav-viewall').getBoundingClientRect();
  const r = t.getBoundingClientRect();
  return { fs: getComputedStyle(t).fontSize, dy: Math.abs((r.top + r.bottom) / 2 - (cell.top + cell.bottom) / 2) };
});
check('narrow layout: VIEW ALL 12px, vertically centred in its cell', va.fs === '12px' && va.dy < 1.5, JSON.stringify(va));
await page.setViewportSize({ width: 1920, height: 1000 });

// NEW IN → /shop
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.getByRole('link', { name: /1ST DROP NEW IN/ }).click();
await page.waitForURL('**/shop');
check('NEW IN navigates to /shop', page.url().endsWith('/shop'), page.url());

// Responsive: no horizontal overflow, page height follows the frame ratio
for (const w of [1920, 1600, 1440, 1280, 1279, 1024, 768, 393, 360]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.documentElement.scrollHeight }));
  check(`responsive ${w}px no horizontal overflow`, m.sw <= m.cw, `scrollWidth ${m.sw} / clientWidth ${m.cw}, height ${m.h}`);
}

check('no runtime errors', errors.length === 0, errors.join(' | '));
await browser.close();

for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
process.exitCode = results.every((r) => r.ok) ? 0 : 1;
