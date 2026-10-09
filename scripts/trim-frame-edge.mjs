// Trims Figma node renders at the frame's right edge. Node exports include the area outside the frame, which Figma
// fills with grey; where the page clips the image at the layout edge that grey shows as a thin vertical line.
// Keeps the untouched export as <file>.png.orig. Prints the new design width for the Pic box.
// Usage: node scripts/trim-frame-edge.mjs   (then npm run images)
import sharp from 'sharp';
import { copyFile, access } from 'node:fs/promises';

// [render, box x, box width, frame right edge] (design px, page coordinates)
const RENDERS = [
  ['home/r-sweep-small', 1351.85, 651.65, 1920],
  ['home/r-sweep-large', 525, 1617, 1920],
  ['home/r-sweep-small-m', 220.32, 236.36, 393],
  ['home/r-sweep-large-m', 36.15, 472.06, 393],
];

for (const [name, x0, w0, edge] of RENDERS) {
  const file = `assets-src/images/${name}.png`, orig = `${file}.orig`;
  try { await access(orig); } catch { await copyFile(file, orig); }
  const src = sharp(orig);
  const { width, height } = await src.metadata();
  const { data, info } = await src.clone().raw().toBuffer({ resolveWithObject: true });
  const k = width / w0;
  const avg = (c) => { let s = 0; for (let y = 0; y < height; y++) { const i = (y * width + c) * info.channels; s += (data[i] + data[i + 1] + data[i + 2]) / 3; } return s / height; };
  // first column (near the expected edge) whose average drops to the grey fill
  let col = Math.round((edge - x0) * k) - 4;
  while (col < width && avg(col) > 200) col++;
  await sharp(orig).extract({ left: 0, top: 0, width: col, height }).png().toFile(file);
  console.log(`${name}: ${width} → ${col} px, design width ${(col / k).toFixed(2)} (frame edge at ${(edge - x0).toFixed(2)})`);
}
