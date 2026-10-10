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
// duration: --motion-glitch-duration 1800ms (the production CSS minifier writes it as 1.8s — must still play ~1.8 s)
await page.addInitScript(() => {
  const g = (window.__glitch = {});
  new MutationObserver(() => {
    const el = document.querySelector('.glitch-group');
    if (!el) return;
    if (el.classList.contains('is-playing') && !g.play) g.play = performance.now();
    if (el.classList.contains('is-done') && !g.done) g.done = performance.now();
  }).observe(document, { subtree: true, childList: true, attributes: true });
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('.glitch-group.is-done', { timeout: 6000 });
const gl = await page.evaluate(() => window.__glitch);
const glMs = Math.round(gl.done - gl.play);
check('H-1 reveal plays ~1.8 s (also in the production build)', glMs >= 1500 && glMs <= 2600, glMs + 'ms');

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
// the star is drawn by <SiteCursor> (follows the mouse), the system cursor is hidden
const starAt = async (loc) => { await loc.hover({ force: true }); await page.waitForTimeout(60); return page.locator('.site-cursor').evaluate((c) => c.dataset.visible + ':' + c.dataset.variant); };
await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
const vMenu = await starAt(page.locator('.site-header__menu')), vLogo = await starAt(page.locator('.site-header__logo'));
const vH2 = await starAt(page.locator('h2').first()), vPhoto = await starAt(page.locator('.hgallery__item').nth(4));
const vStock = await starAt(page.locator('.stockist').first()), vLabel = await starAt(page.locator('.hover-group--link .hover-accent').first());
const sysCursor = await page.evaluate(() => getComputedStyle(document.querySelector('h2')).cursor);
const img = await page.locator('.site-cursor').evaluate((c) => [...c.querySelectorAll('img')].map((i) => i.getAttribute('src') + ' ' + i.getBoundingClientRect().width).join(','));
check('cursor: #831A1F star over header menu icon and logo (top edge of the window)', vMenu === 'true:red' && vLogo === 'true:red', vMenu + ' | ' + vLogo);
check('cursor: #831A1F star over photos, category labels and hover-colour stockists; black elsewhere', vPhoto === 'true:red' && vLabel === 'true:red' && vStock === 'true:red' && vH2 === 'true:black', [vPhoto, vLabel, vStock, vH2].join(' | '));
check('cursor: Figma stars 84px, system cursor hidden', img === '/images/ui/cursor.svg 84,/images/ui/cursor-image.svg 84' && sysCursor === 'none', img + ' | ' + sysCursor);
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
  const b0 = await brushAt(colTop - 1100); // section still below the screen: not painted
  await brushAt(colTop - 300);              // in view → the paint starts
  await page.waitForTimeout(700);
  const read = () => page.evaluate(() => { const s = getComputedStyle([...document.querySelectorAll('section.band')].find((b) => b.getAttribute('aria-label') === 'Collections').querySelector('.section')); return [parseFloat(s.getPropertyValue('--brush')), parseFloat(s.getPropertyValue('--brush-2'))]; });
  const mid = await read();
  await page.waitForTimeout(2600);
  const fin = await read();
  check('COLLECTIONS brush paints in over ~1.6s once in view (0 -> partial -> 1)', b0 === 0 && mid[0] > 0 && mid[0] < 1 && mid[1] < mid[0] && fin[0] === 1 && fin[1] === 1, `${b0} / ${mid} / ${fin}`);
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
  return { fs: getComputedStyle(t).fontSize, dy: Math.abs((r.top + r.bottom) / 2 - (cell.top + cell.bottom) / 2), dx: Math.abs((r.left + r.right) / 2 - (cell.left + cell.right) / 2) };
});
check('narrow layout: VIEW ALL 14px, centred in its black cell', va.fs === '14px' && va.dy < 1.5 && va.dx < 1.5, JSON.stringify(va));
const navArrows = await page.evaluate(() => {
  const nav = document.querySelector('.col__nav').getBoundingClientRect();
  const mid = (nav.top + nav.bottom) / 2;
  return [...document.querySelectorAll('span.abs')].filter((s) => s.querySelector('svg') && s.offsetParent && Math.abs(s.getBoundingClientRect().top - nav.top) < nav.height)
    .map((s) => { const r = s.getBoundingClientRect(); return +((r.top + r.bottom) / 2 - mid).toFixed(1); });
});
check('narrow layout: both COLLECTIONS arrows vertically centred in the bar', navArrows.length === 2 && navArrows.every((d) => Math.abs(d) < 1.5), JSON.stringify(navArrows));
await page.setViewportSize({ width: 1920, height: 1000 });

// Menu (Figma 메뉴1 / 메뉴2)
await page.setViewportSize({ width: 1920, height: 1000 });
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: '메뉴 열기' }).click();
const menuRows = () => page.locator('.site-menu__row').allTextContents();
const m1 = await menuRows();
check('menu 1: BRAND INFO / AW26 / SHOP / COLLECTIONS / STOCKISTS', m1.join('|') === 'BRAND INFO|AW26|SHOP|COLLECTIONS|STOCKISTS', m1.join('|'));
const menuBox = await page.locator('.site-menu').boundingBox();
check('menu 1 panel 338 x 446 (with logo) at the top-left', Math.round(menuBox.width) === 338 && Math.round(menuBox.height) === 446 && menuBox.x === 0 && menuBox.y === 0, JSON.stringify(menuBox));
await page.getByRole('button', { name: 'SHOP', exact: true }).click();
const m2 = await menuRows();
const shopBg = await page.locator('.site-menu__row.is-active').evaluate((e) => getComputedStyle(e).backgroundColor);
const menuBox2 = await page.locator('.site-menu').boundingBox();
await page.waitForTimeout(1200);
const shopTop = await page.evaluate(() => ({ hash: location.hash, top: Math.round(document.getElementById('shop').getBoundingClientRect().top) }));
check('menu SHOP scrolls HOME to its SHOP section', shopTop.hash === '#shop' && Math.abs(shopTop.top) < 2, JSON.stringify(shopTop));
const logo = await page.locator('.site-menu__logo').boundingBox();
check('menu logo 35 x 35 at the bottom right (x 281)', Math.round(logo.width) === 35 && Math.round(logo.x) === 281 && Math.round(logo.y) === 647, JSON.stringify(logo));
check('menu 2: SHOP opens its sub-menu on a #831A1F box, panel 701 high',
  m2.join('|') === 'BRAND INFO|AW26|SHOP|ALL|OUTERWEAR|TOPS|BOTTOMS|ACC|COLLECTIONS|STOCKISTS' && shopBg === ACCENT && Math.round(menuBox2.height) === 701, m2.join('|') + ' ' + shopBg + ' ' + menuBox2.height);
const allRow = page.locator('.site-menu__row', { hasText: /^ALL$/ });
await page.mouse.move(1500, 900); await page.waitForTimeout(350);
const allC0 = await allRow.locator('.site-menu__text').evaluate((e) => getComputedStyle(e).color);
await allRow.hover(); await page.waitForTimeout(400);
const allC1 = await allRow.locator('.site-menu__text').evaluate((e) => getComputedStyle(e).color);
check('menu ALL: white, #831A1F on hover', allC0 === 'rgb(255, 255, 255)' && allC1 === ACCENT, allC0 + ' -> ' + allC1);
const topsRow = page.locator('.site-menu__row', { hasText: /^TOPS$/ });
await page.mouse.move(1500, 900); await page.waitForTimeout(350);
const t0 = await topsRow.locator('.site-menu__text').evaluate((e) => getComputedStyle(e).color);
await topsRow.hover(); await page.waitForTimeout(400);
const t1 = await topsRow.locator('.site-menu__text').evaluate((e) => getComputedStyle(e).color);
check('menu text hover: white -> #831A1F', t0 === 'rgb(255, 255, 255)' && t1 === ACCENT, t0 + ' -> ' + t1);
await page.getByRole('button', { name: 'STOCKISTS', exact: true }).click();
await page.waitForTimeout(1500);
const st = await page.evaluate(() => ({ hash: location.hash, top: Math.round(document.getElementById('stockists').getBoundingClientRect().top),
  active: document.querySelector('.site-menu__row.is-active')?.textContent }));
check('menu STOCKISTS: box #831A1F, page scrolls to the section', st.hash === '#stockists' && Math.abs(st.top) < 2 && st.active === 'STOCKISTS', JSON.stringify(st));
await page.getByRole('button', { name: 'CLOSE' }).click();
check('menu CLOSE closes the panel', (await page.locator('.site-menu').count()) === 0);
await page.getByRole('button', { name: '메뉴 열기' }).click();
await page.getByRole('button', { name: 'SHOP', exact: true }).click();
await page.getByRole('button', { name: 'OUTERWEAR', exact: true }).click();
await page.waitForURL('**/shop');
check('menu sub-item opens SHOP and closes the menu', page.url().endsWith('/shop') && (await page.locator('.site-menu').count()) === 0, page.url());

// Brand statement: typed row by row (35 ms / character) once in view
await page.goto(base + '/', { waitUntil: 'networkidle' });
const typed = () => page.evaluate(() => [...document.querySelectorAll('.bp__typed')].filter((e) => e.offsetParent).map((e) => e.textContent).join('|'));
const typedBefore = await typed();
await page.evaluate(() => document.getElementById('brand-info').scrollIntoView({ block: 'center' }));
await page.waitForTimeout(800);
const typedMid = await typed();
await page.waitForTimeout(8000);
const typedEnd = await typed();
check('statement types in reading order and completes',
  typedBefore.replace(/\|/g, '') === '' && typedMid.replace(/\|/g, '').length > 0 && typedMid.length < typedEnd.length
  && typedEnd.startsWith('THOUGH  IT  MAY  APPEAR  UNFINISHED  AT|FIRST  GLANCE,|THE  CLOSER') && typedEnd.endsWith('CORE OF THE DESIGN.'),
  'mid "' + typedMid.slice(0, 40) + '" end "' + typedEnd.slice(-30) + '"');

// LOOK frames: clicking a look opens its frame
await page.evaluate(() => document.getElementById('aw26').scrollIntoView());
for (const id of ['00', '04', '08']) {
  await page.getByRole('button', { name: 'Look ' + id, exact: true }).click({ force: true });
  const dlg = page.getByRole('dialog');
  const name = await dlg.getAttribute('aria-label');
  const box = await dlg.boundingBox();
  await page.waitForFunction(() => [...document.querySelectorAll('.modal img')].every((i) => i.complete), null, { timeout: 8000 }).catch(() => {});
  const imgsOk = await dlg.locator('img').evaluateAll((im) => im.filter((i) => i.src.includes('look-modal')).every((i) => i.complete && i.naturalWidth > 0));
  const outline = await page.locator('.look.modal__frame').evaluate((e) => { const s = getComputedStyle(e, '::after'); return s.borderTopWidth + ' ' + s.borderTopStyle + ' ' + s.borderTopColor; });
  check('LOOK ' + id + ': 1px black outline', outline === '1px solid rgb(0, 0, 0)', outline);
  check('LOOK ' + id + ': frame 714 x 964 with its photos', name === 'AW26:[UNEARTH: FILE-2711] LOOK ' + id && Math.round(box.width) === 714 && Math.round(box.height) === 964 && imgsOk, name + ' ' + box.width + 'x' + box.height);
  await page.keyboard.press('Escape');
  check('LOOK ' + id + ': Escape closes', (await page.getByRole('dialog').count()) === 0);
}
const gb = await page.locator('.hgallery').boundingBox();
await page.mouse.move(gb.x + 900, gb.y + 400); await page.mouse.down(); await page.mouse.move(gb.x + 700, gb.y + 400, { steps: 6 }); await page.mouse.up();
await page.waitForTimeout(200);
check('dragging the gallery does not open a LOOK frame', (await page.getByRole('dialog').count()) === 0);

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
