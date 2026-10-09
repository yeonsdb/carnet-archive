// Full-page captures for design comparison (uses the locally installed Edge; no browser download).
// Usage: node scripts/capture.mjs [path=/] [widths=1920,393] [outDir=.captures]
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const [path = '/', widthsArg = '1920,393', outDir = '.captures'] = process.argv.slice(2);
const base = process.env.BASE_URL ?? 'http://localhost:5173';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge' });
for (const w of widthsArg.split(',').map(Number)) {
  // scrollbar-free viewport so 1 design px == 1 CSS px at 1920 / 393
  const ctx = await browser.newContext({ viewport: { width: w, height: 1000 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'html{scrollbar-width:none} ::-webkit-scrollbar{display:none} *{animation:none!important;transition:none!important}' });
  await page.evaluate(async () => { await document.fonts.ready; });
  // load lazy images
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 800) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(60); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForLoadState('networkidle');
  const metrics = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.scrollHeight,
    scrollWidth: document.documentElement.scrollWidth,
    brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
  }));
  const file = `${outDir}/${path === '/' ? 'home' : path.replace(/\W+/g, '-')}-${w}.png`;
  // grow the viewport to the page height first (fullPage capture resizes mid-shot, which resets inner scrollers)
  await page.setViewportSize({ width: w, height: metrics.height });
  await page.waitForTimeout(400);
  await page.screenshot({ path: file });
  console.log(JSON.stringify({ file, ...metrics }));
  await ctx.close();
}
await browser.close();
