// Fetches Figma "rawImages" URLs (download_assets) and keeps only files whose SHA-1 matches a wanted
// Figma image hash (Figma image hashes are the SHA-1 of the original bytes). Saves to assets-src/images.
// Usage: node scripts/fetch-originals.mjs scripts/originals-home.json
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';

const { wanted, urls } = JSON.parse(await readFile(process.argv[2], 'utf8'));
const found = new Set();
for (const id of urls) {
  const res = await fetch(`https://www.figma.com/api/mcp/asset/${id}`);
  if (!res.ok) { console.error(`FAIL ${res.status} ${id}`); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  const hash = createHash('sha1').update(buf).digest('hex');
  const key = Object.keys(wanted).find((h) => hash.startsWith(h));
  if (!key || found.has(key)) continue;
  const out = join('assets-src/images', wanted[key]);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, buf);
  found.add(key);
  console.log(`OK ${wanted[key]} (${key}, ${buf.length} bytes)`);
}
for (const [h, name] of Object.entries(wanted)) if (!found.has(h)) console.log(`MISSING ${name} (${h})`);
