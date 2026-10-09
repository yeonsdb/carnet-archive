// Bakes a per-channel multiplier (measured with fit-exposure.mjs) into an original image, keeping its alpha.
// Used for transparent cut-outs whose Figma image adjustments cannot be exported with transparency.
// Usage: node scripts/bake-adjust.mjs <in.png> <out.png> <r> <g> <b>
import sharp from 'sharp';

const [input, output, r, g, b] = process.argv.slice(2);
const { info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const alpha = await sharp(input).ensureAlpha().extractChannel(3).raw().toBuffer();
const rgb = await sharp(input).removeAlpha().linear([Number(r), Number(g), Number(b)], [0, 0, 0]).raw().toBuffer();
await sharp(rgb, { raw: { width: info.width, height: info.height, channels: 3 } })
  .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
  .png()
  .toFile(output);
console.log(`baked ${output}`);
