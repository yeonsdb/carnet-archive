// Converts original PNG exports (assets-src/images/**) to WebP in public/images/**.
// Geometry is unchanged (only downscaled when larger than MAX), so Figma crop percentages stay valid.
// Usage: node scripts/optimize-images.mjs
import { readdir, mkdir, stat } from 'node:fs/promises';
import { join, dirname, relative, extname } from 'node:path';
import sharp from 'sharp';

const SRC = 'assets-src/images';
const OUT = 'public/images';
const MAX = 3000;

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (extname(p).toLowerCase() === '.png') yield p;
  }
}

for await (const file of walk(SRC)) {
  const out = join(OUT, relative(SRC, file)).replace(/\.png$/i, '.webp');
  await mkdir(dirname(out), { recursive: true });
  const img = sharp(file);
  const { width = 0, height = 0 } = await img.metadata();
  const pipeline = Math.max(width, height) > MAX
    ? img.resize({ width: width >= height ? MAX : undefined, height: height > width ? MAX : undefined })
    : img;
  await pipeline.webp({ quality: 84, alphaQuality: 90, effort: 5 }).toFile(out);
  const before = (await stat(file)).size, after = (await stat(out)).size;
  console.log(`${relative(SRC, file)}\t${width}x${height}\t${(before / 1e6).toFixed(2)}MB -> ${(after / 1e6).toFixed(2)}MB`);
}
