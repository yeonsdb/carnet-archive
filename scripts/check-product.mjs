// PRODUCT interaction + responsive checks (local Edge via playwright-core).
// Usage: node scripts/check-product.mjs
import { chromium } from 'playwright-core';

const base = process.env.BASE_URL ?? 'http://localhost:5173';
const path = '/product/paper-crustacean-padded-short-bomber-jacket';
const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });
const settle = async (p) => { let last = -1; for (let i = 0; i < 40; i++) { const y = await p.evaluate(() => window.scrollY); if (y === last) return; last = y; await p.waitForTimeout(150); } };

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(base + path, { waitUntil: 'networkidle' });

const height = () => page.evaluate(() => document.documentElement.scrollHeight);
check('desktop page height = 11639 (Figma)', (await height()) === 11639, `${await height()}`);

// P-1 / P-2 gallery
const activeId = () => page.locator('.pgallery__item.is-active img').getAttribute('alt');
const prev = page.getByRole('button', { name: '이전 이미지' });
const next = page.getByRole('button', { name: '다음 이미지' });
check('P-1 gallery starts on 05 (enlarged)', (await activeId())?.startsWith('05'), await activeId());
const activeBox = await page.locator('.pgallery__item.is-active').boundingBox();
check('P-1 active 05 at Figma box (728, 137, 436 × 889)', Math.abs(activeBox.x - 728) < 1 && Math.abs(activeBox.y - 137) < 1 && Math.abs(activeBox.width - 436) < 1 && Math.abs(activeBox.height - 889) < 1, JSON.stringify(activeBox));
await next.click(); await page.waitForTimeout(500);
const after06 = await activeId();
const box06 = await page.locator('.pgallery__item.is-active').boundingBox();
check('P-2 next → 06 enlarged and centred on the active slot', after06?.startsWith('06') && Math.abs(box06.x + box06.width / 2 - 946) < 1, `${after06} centre ${box06.x + box06.width / 2}`);
for (let i = 0; i < 8; i++) if (await next.isEnabled()) { await next.click(); await page.waitForTimeout(450); }
check('P-2 next disabled on 08', (await activeId())?.startsWith('08') && !(await next.isEnabled()));
for (let i = 0; i < 8; i++) if (await prev.isEnabled()) { await prev.click(); await page.waitForTimeout(450); }
check('P-2 previous disabled on 01', (await activeId())?.startsWith('01') && !(await prev.isEnabled()));

// buttons never overlap an image, in every gallery state (desktop / mobile)
const overlaps = () => page.evaluate(() => {
  const hit = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
  const btns = [...document.querySelectorAll('.pgallery__btn')].map((e) => e.getBoundingClientRect());
  const imgs = [...document.querySelectorAll('.pgallery__item')].map((e) => e.getBoundingClientRect());
  return btns.some((b) => imgs.some((i) => hit(b, i)));
});
async function sweepOverlap() {
  const bad = [];
  for (let i = 0; i < 8; i++) if (await prev.isEnabled()) { await prev.click(); await page.waitForTimeout(450); }
  for (let i = 0; i < 8; i++) {
    if (await overlaps()) bad.push(await activeId());
    if (await next.isEnabled()) { await next.click(); await page.waitForTimeout(450); }
  }
  for (let i = 0; i < 3; i++) { await prev.click(); await page.waitForTimeout(450); } // back to 05
  return bad;
}
const badD = await sweepOverlap();
check('gallery buttons never overlap an image (desktop, 01–08)', badD.length === 0, badD.join(','));
// buttons stay at their Figma boxes in every state (images move instead)
const btnX = async () => page.evaluate(() => [...document.querySelectorAll('.pgallery__btn')].map((b) => Math.round(b.getBoundingClientRect().x)).join(','));
const btnStart = await btnX();
await next.click(); await page.waitForTimeout(450); await next.click(); await page.waitForTimeout(450);
const btnAfter = await btnX();
await prev.click(); await page.waitForTimeout(450); await prev.click(); await page.waitForTimeout(450);
check('gallery buttons stay fixed (Previous 636, Next 1235)', btnStart === '636,1235' && btnAfter === btnStart, `${btnStart} / ${btnAfter}`);

// tab labels centred in their tabs
const offCentre = await page.evaluate(() => [...document.querySelectorAll('.ptabs__tab')].map((t) => {
  const a = t.getBoundingClientRect(), b = t.querySelector('.ptabs__label').getBoundingClientRect();
  return Math.abs((a.left + a.right) / 2 - (b.left + b.right) / 2);
}).filter((d) => d > 1));
check('tab labels are horizontally centred', offCentre.length === 0, offCentre.join(','));

// quantity / total (on screen only)
const total = () => page.locator('output').filter({ hasText: '원' }).first().textContent();
const minus = page.getByRole('button', { name: '수량 줄이기' });
const plus = page.getByRole('button', { name: '수량 늘리기' });
check('quantity starts at 1, minus disabled', !(await minus.isEnabled()) && (await total()) === '870,000원', await total());
await plus.click(); await plus.click();
check('quantity + → 3, TOTAL 2,610,000원', (await total()) === '2,610,000원', await total());
const totalRight = await page.locator('output').filter({ hasText: '원' }).first().evaluate((el) => Math.round(el.getBoundingClientRect().right));
check('TOTAL amount right-aligned at 1824 (grows to the left)', Math.abs(totalRight - 1824) <= 1, `right=${totalRight}`);
await minus.click();
check('quantity − → 2, TOTAL 1,740,000원', (await total()) === '1,740,000원', await total());

// size option updates the selected line
await page.getByRole('radio', { name: 'L' }).first().click();
const line = await page.locator('p.t', { hasText: '/ CHARCOAL' }).first().textContent();
check('size L updates selected item line', line?.endsWith('CHARCOAL (L)'), line);
const sel = await page.evaluate(() => [...document.querySelectorAll('.pp-size')].map((e) => {
  const r = e.getBoundingClientRect(), s = getComputedStyle(e);
  return `${e.textContent}:${e.classList.contains('is-selected')}:${s.borderTopColor}:${Math.round(r.left)},${Math.round(r.width)}`;
}));
check('selected size shows the black 19×19 box (L), M plain', sel[0] === 'M:false:rgba(0, 0, 0, 0):190,19' && sel[1] === 'L:true:rgb(0, 0, 0):215,19', sel.join(' | '));

// BUY IT NOW / CART: no gap between the two at scaled widths
for (const w of [1600, 1366]) {
  await page.setViewportSize({ width: w, height: 1000 });
  const s = await page.evaluate(() => { const [b, c] = [...document.querySelectorAll('.pp-btn')].map((e) => e.getBoundingClientRect()); return { gap: c.left - b.right }; });
  check(`BUY IT NOW / CART touch without a gap at ${w}px`, s.gap <= 0, `gap ${s.gap.toFixed(2)}px`);
}
await page.setViewportSize({ width: 1920, height: 1000 });

// Q&A filter chips
const rowsD = () => page.locator('.pq-row').count();
const chip = (name) => page.getByRole('group', { name: '문의 유형' }).getByRole('button', { name, exact: true });
await chip('사이즈 문의').click();
const nSize = await rowsD();
const sizeCats = await page.locator('.pq-row .pq-badge').allTextContents();
await chip('배송 문의').click();
const nShip = await rowsD();
await chip('상품 문의').click();
const nNone = await rowsD();
const empty = await page.getByText('등록된 문의가 없습니다.').first().isVisible();
await chip('ALL').click();
const nAll = await rowsD();
const allTops = await page.evaluate(() => [...document.querySelectorAll('.pq-row')].map((r) => Math.round(r.getBoundingClientRect().top + scrollY)).join(','));
check('Q&A filters: 사이즈 4 / 배송 1 / 상품 0 (empty message) / ALL 5',
  nSize === 4 && sizeCats.every((c) => c === '사이즈 문의') && nShip === 1 && nNone === 0 && empty && nAll === 5, `${nSize}/${nShip}/${nNone}/${nAll} empty=${empty}`);
check('Q&A ALL keeps the Figma row positions', allTops === '8556,8733,8896,9057,9220', allTops);
check('Q&A selected chip is black (aria-pressed)', (await chip('ALL').getAttribute('aria-pressed')) === 'true');

// BUY IT NOW visual only; CART opens the 장바구니 window with the current selection (size L, quantity 2 here)
const url0 = page.url();
await page.getByRole('button', { name: 'BUY IT NOW' }).click({ force: true });
check('BUY IT NOW is visual only (no navigation, no window)', page.url() === url0 && (await page.getByRole('dialog').count()) === 0);
await page.getByRole('button', { name: 'CART' }).click();
const cart = page.getByRole('dialog', { name: '장바구니 담기' });
const cartBox = await cart.boundingBox();
const cartText = (await cart.textContent()).replace(/\s+/g, ' ');
check('CART opens the 944 x 707 cart window', Math.round(cartBox.width) === 944 && Math.round(cartBox.height) === 707, JSON.stringify(cartBox));
check('cart shows the selected option, quantity and line total', cartText.includes('총 2개') && cartText.includes('[옵션] CHARCOAL (L) / 2개') && cartText.includes('1,740,000원'), cartText.slice(0, 120));
const row = await cart.locator('.cart__btn').evaluateAll((bs) => bs.map((b) => b.getBoundingClientRect()).map((r) => [r.left, r.right, r.top, r.bottom]));
const frameR = await cart.evaluate((e) => { const r = e.getBoundingClientRect(); return [r.left, r.right, r.bottom]; });
const seams = [row[1][0] - row[0][1], row[2][0] - row[1][1]];
check('cart buttons: one row, no gaps, flush with the frame edges',
  seams.every((s) => s <= 0.01 && s >= -1.01) && Math.abs(row[0][0] - frameR[0]) < 0.5 && Math.abs(row[2][1] - frameR[1]) < 0.5 && row.every((r) => Math.abs(r[3] - frameR[2]) < 0.5 && Math.abs(r[2] - row[0][2]) < 0.5),
  JSON.stringify({ seams, row, frameR }));
await cart.getByRole('button', { name: '쇼핑 계속하기' }).click();
check('쇼핑 계속하기 closes the cart window', (await page.getByRole('dialog').count()) === 0 && page.url() === url0);
await page.getByRole('button', { name: 'CART' }).click();
await page.keyboard.press('Escape');
check('Escape closes the cart window', (await page.getByRole('dialog').count()) === 0);

// Breadcrumb (desktop): HOME / SHOP / OUTER links + current product
const crumbs = await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link').evaluateAll((as) => as.map((a) => a.textContent + '>' + a.getAttribute('href')));
const crumbTop = await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'HOME' }).evaluate((e) => Math.round(e.getBoundingClientRect().top + scrollY));
check('breadcrumb HOME / SHOP / OUTER at y 101', crumbs.join(' ') === 'HOME>/ SHOP>/shop OUTER>/shop' && crumbTop === 101, crumbs.join(' ') + ' y' + crumbTop);

// tabs → anchor scroll
for (const [label, id] of [['SIZE GUIDE', 'size-guide'], ['상품 문의', 'product-inquiry'], ['구매안내', 'purchase-guide'], ['상품 상세정보', 'product-info']]) {
  await page.locator('#product-info').getByRole('button', { name: label }).click();
  await settle(page);
  const top = await page.locator(`#${id}`).evaluate((el) => el.getBoundingClientRect().top);
  check(`tab "${label}" scrolls its section tab bar to the top`, Math.abs(top) < 2, `top=${top}`);
}

// every slug shows the same detail; unknown slug → /shop
await page.goto(base + '/product/rider-denim-jacket', { waitUntil: 'networkidle' });
check('other product slug shows the PAPER CRUSTACEAN detail', (await page.locator('h1').first().textContent()) === 'PAPER CRUSTACEAN PADDED SHORT BOMBER JACKET');
await page.goto(base + '/product/does-not-exist', { waitUntil: 'networkidle' });
check('unknown slug redirects to /shop', page.url().endsWith('/shop'), page.url());

// mobile
await page.setViewportSize({ width: 393, height: 900 });
await page.goto(base + path, { waitUntil: 'networkidle' });
check('mobile page height = 4704 (Figma)', (await height()) === 4704, `${await height()}`);
const mBox = await page.locator('.pgallery__item.is-active').boundingBox();
check('mobile active 05 at Figma box (96.11, 78, 186.57 × 380.42)', Math.abs(mBox.x - 96.11) < 1 && Math.abs(mBox.y - 78) < 1 && Math.abs(mBox.width - 186.57) < 1, JSON.stringify(mBox));
const badM = await sweepOverlap();
check('gallery buttons never overlap an image (mobile, 01–08)', badM.length === 0, badM.join(','));
await page.locator('#product-info').getByRole('button', { name: '상품 문의' }).click();
await settle(page);
check('mobile tab scroll (상품 문의)', Math.abs(await page.locator('#product-inquiry').evaluate((el) => el.getBoundingClientRect().top)) < 2);

for (const w of [1920, 1440, 1280, 1279, 1024, 768, 393, 360]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(base + path, { waitUntil: 'networkidle' });
  const m = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
    broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
  }));
  check(`responsive ${w}px no horizontal overflow, no broken images`, m.sw <= m.cw && m.broken === 0, `${m.sw}/${m.cw} broken ${m.broken}`);
}

check('no runtime errors', errors.length === 0, errors.join(' | '));
await browser.close();
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
process.exitCode = results.every((r) => r.ok) ? 0 : 1;
