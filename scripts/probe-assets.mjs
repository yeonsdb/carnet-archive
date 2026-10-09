// Prints SHA-1 prefix, byte size and pixel size of Figma MCP asset URLs (no files kept).
// Usage: node scripts/probe-assets.mjs <file with one URL or asset id per line>
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const lines = (await readFile(process.argv[2], 'utf8')).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
for (const line of lines) {
  const [name, ref] = line.includes(' ') ? line.split(/\s+/) : [line, line];
  const url = ref.startsWith('http') ? ref : `https://www.figma.com/api/mcp/asset/${ref}`;
  const res = await fetch(url);
  if (!res.ok) { console.log(`${name}\tFAIL ${res.status}`); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  const hash = createHash('sha1').update(buf).digest('hex').slice(0, 10);
  let dims = '';
  try { const m = await sharp(buf).metadata(); dims = `${m.width}x${m.height} ${m.format}`; } catch { dims = 'n/a'; }
  console.log(`${name}\t${hash}\t${buf.length}\t${dims}`);
}
