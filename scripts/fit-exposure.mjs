// Estimates a CSS brightness factor that reproduces a Figma image adjustment:
// crops the original like Figma (imageTransform), flattens it on white, and compares opaque pixels with the Figma render.
// Usage: node scripts/fit-exposure.mjs <original.png> <render.png> <a> <tx> <d> <ty>
import sharp from 'sharp';

const [orig, render, a, tx, d, ty] = process.argv.slice(2);
const R = await sharp(render).raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = R.info;
const meta = await sharp(orig).metadata();
const iw = meta.width, ih = meta.height;
const crop = { left: Math.round(Number(tx) * iw), top: Math.round(Number(ty) * ih), width: Math.round(Number(a) * iw), height: Math.round(Number(d) * ih) };
const O = await sharp(orig).extract(crop).resize(W, H, { fit: 'fill' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

let so = [0, 0, 0], sr = [0, 0, 0], n = 0;
for (let i = 0; i < W * H; i++) {
  const al = O.data[i * 4 + 3];
  if (al < 250) continue;
  for (let c = 0; c < 3; c++) { so[c] += O.data[i * 4 + c]; sr[c] += R.data[i * R.info.channels + c]; }
  n++;
}
const ratio = so.map((v, c) => sr[c] / v);
console.log(JSON.stringify({ opaquePixels: n, meanOriginal: so.map((v) => +(v / n).toFixed(1)), meanRender: sr.map((v) => +(v / n).toFixed(1)), ratio: ratio.map((r) => +r.toFixed(3)) }));
