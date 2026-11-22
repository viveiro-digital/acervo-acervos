// Gera a imagem de compartilhamento de public/ a partir de design/ e das prévias do catálogo.
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

const previews = ['diseno-nacional.jpg', 'irohin.jpg', 'museu-kuahi.jpg'];
const layers = await Promise.all(previews.map(async (file, index) => ({
  input: await sharp(fileURLToPath(new URL(`../public/colecoes/${file}`, import.meta.url)))
    .resize(340, 256, { fit: 'contain', background: '#f5f5f5' })
    .png()
    .toBuffer(),
  left: 66 + index * 364,
  top: 268,
})));

const src = fileURLToPath(new URL('../design/og-default.svg', import.meta.url));
const out = fileURLToPath(new URL('../public/og-default.png', import.meta.url));
await sharp(src).composite(layers).png({ compressionLevel: 9 }).toFile(out);
console.log('ok:', out);
