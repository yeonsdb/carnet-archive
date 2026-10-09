// Side-by-side comparison strips: Figma render (left) vs. implementation capture (right).
// Usage: node scripts/compare.mjs <figma.png> <capture.png> <frameOffsetX> <frameWidth> <outPrefix> <sliceHeight> [scale]
import sharp from 'sharp';

const [figmaPath, capturePath, offX, frameW, outPrefix, sliceArg = '1080', scaleArg = '0.5'] = process.argv.slice(2);
const ox = Number(offX), fw = Number(frameW), slice = Number(sliceArg), scale = Number(scaleArg);

const cap = sharp(capturePath);
const { height: ch = 0 } = await cap.metadata();
const fig = await sharp(figmaPath).extract({ left: ox, top: 0, width: fw, height: ch }).png().toBuffer();
const capBuf = await sharp(capturePath).png().toBuffer();

const gap = 16;
for (let y = 0, i = 0; y < ch; y += slice, i++) {
  const h = Math.min(slice, ch - y);
  const a = await sharp(fig).extract({ left: 0, top: y, width: fw, height: h }).toBuffer();
  const b = await sharp(capBuf).extract({ left: 0, top: y, width: fw, height: h }).toBuffer();
  const out = `${outPrefix}-${String(i).padStart(2, '0')}.png`;
  const joined = await sharp({ create: { width: fw * 2 + gap, height: h, channels: 4, background: '#ff00ff' } })
    .composite([{ input: a, left: 0, top: 0 }, { input: b, left: fw + gap, top: 0 }])
    .png()
    .toBuffer();
  await sharp(joined).resize({ width: Math.round((fw * 2 + gap) * scale) }).png().toFile(out);
  console.log(out, `y ${y}-${y + h}`);
}
