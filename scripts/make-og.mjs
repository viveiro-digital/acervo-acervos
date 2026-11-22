// Gera public/og-default.png a partir de design/og-default.svg.
// Usa o sharp que já vem como dependência do Astro. Rode: pnpm og
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let sharp;
try {
  const astroReq = createRequire(require.resolve('astro/package.json'));
  sharp = astroReq('sharp');
} catch {
  console.error('sharp não encontrado. Rode `pnpm install` primeiro.');
  process.exit(1);
}
const src = fileURLToPath(new URL('../design/og-default.svg', import.meta.url));
const out = fileURLToPath(new URL('../public/og-default.png', import.meta.url));
await sharp(src).png({ compressionLevel: 9 }).toFile(out);
console.log('ok:', out);
