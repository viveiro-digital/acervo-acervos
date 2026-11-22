// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Origem pública do site.
 * - SITE_URL: endereço canônico definitivo (ex.: https://acervoacervos.org).
 *   Sem ela, usamos localhost e TODAS as páginas saem com noindex.
 * - DEPLOY_ENV=production: só neste caso o robots.txt libera indexação.
 * Previews nunca devem receber DEPLOY_ENV=production.
 */
const site = process.env.SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site,
  base: process.env.SITE_BASE || '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Sem integrações externas: sitemap e robots são endpoints em src/pages.
});
