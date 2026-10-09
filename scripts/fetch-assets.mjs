// Downloads Figma MCP asset URLs listed in a manifest into public/images.
// Usage: node scripts/fetch-assets.mjs scripts/assets-home.json
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';

const manifest = JSON.parse(await readFile(process.argv[2], 'utf8'));
const seen = new Map();
for (const [rel, url] of Object.entries(manifest)) {
  const res = await fetch(url);
  if (!res.ok) { console.error(`FAIL ${res.status} ${rel}`); process.exitCode = 1; continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  const out = join('public/images', rel);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, buf);
  const hash = createHash('sha1').update(buf).digest('hex').slice(0, 10);
  const dup = seen.get(hash);
  seen.set(hash, dup ?? rel);
  console.log(`${rel}\t${buf.length}\t${hash}${dup ? `\t= ${dup}` : ''}`);
}
