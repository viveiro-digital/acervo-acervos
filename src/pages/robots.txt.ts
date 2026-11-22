import type { APIRoute } from 'astro';
import { isIndexable } from '../site.config';

/** Fora de produção (preview, local), nada é indexado. */
export const GET: APIRoute = ({ site }) => {
  const body = isIndexable
    ? `User-agent: *\nAllow: /\nDisallow: /revisao/\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`
    : `# Ambiente sem DEPLOY_ENV=production: indexação bloqueada.\nUser-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
