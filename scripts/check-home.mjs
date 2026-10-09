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
const anim = await page.evaluate(() => [...document.querySelectorAll('.glitch-group__main')].map((el) => ({
  name: getComputedStyle(el).animationName,
  parts: [...el.children].filter((c) => !c.classList.contains('glitch-group__layer')).map((c) => c.textContent || 'line'),
})));
check('H-1 one glitch reveal for the whole wordmark (CARNET + line + ARCHIVE)',
  anim.length === 1 && anim[0].name === 'glitch-reveal' && anim[0].parts.join('|') === 'CARNET|line|ARCHIVE', JSON.stringify(anim));

// H-2 gallery: opens at the Figma composition, wheel scrolls horizontally, page scroll resumes at the end
const g = page.locator('.hgallery');
await g.scrollIntoViewIfNeeded();
const start = await g.evaluate((el) => el.scrollLeft);
check('H-2 gallery initial offset (≈365.8 design px)', Math.abs(start - 365.8) < 2, `scrollLeft=${start}`);
const box = await g.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
const pageY0 = await page.evaluate(() => scrollY);
await page.mouse.wheel(0, 300);
await page.waitForTimeout(300);
const afterWheel = await g.evaluate((el) => el.scrollLeft);
const pageY1 = await page.evaluate(() => scrollY);
check('H-2 wheel scrolls gallery horizontally', afterWheel > start && pageY1 === pageY0, `scrollLeft ${start}→${afterWheel}, pageY ${pageY0}→${pageY1}`);
for (let i = 0; i < 15; i++) await page.mouse.wheel(0, 400);
await page.waitForTimeout(300);
const pageY2 = await page.evaluate(() => scrollY);
check('H-2 page scrolls once gallery reaches its end', pageY2 > pageY1, `pageY ${pageY1}→${pageY2}`);

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
