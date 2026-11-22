// Carrega a biblioteca `yaml` que já vem com o Astro, sem nova dependência.
// Se um dia a resolução falhar, rode `pnpm add -D yaml` e troque por
// `import YAML from 'yaml'`.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);

async function load() {
  const tries = [
    () => require.resolve('yaml'),
    () => createRequire(require.resolve('astro/package.json')).resolve('yaml'),
    () => {
      const helpers = createRequire(require.resolve('astro/package.json')).resolve(
        '@astrojs/internal-helpers/package.json',
      );
      return createRequire(helpers).resolve('yaml');
    },
  ];
  for (const t of tries) {
    try {
      const p = t();
      const mod = await import(pathToFileURL(p).href);
      return mod.default ?? mod;
    } catch {}
  }
  console.error('Não foi possível carregar a biblioteca yaml. Rode `pnpm install` (ou `pnpm add -D yaml`).');
  process.exit(1);
}

export const YAML = await load();
