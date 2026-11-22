import type { APIRoute } from 'astro';
import { getPublished, recordPath } from '../lib/acervos';

/** Só páginas públicas canônicas. Revisão, comparação e 404 ficam de fora. */
export const GET: APIRoute = async ({ site }) => {
  const records = await getPublished();
  const pages: { path: string; lastmod?: string }[] = [
    { path: '/' },
    { path: '/explorar/' },
    { path: '/sobre/' },
    { path: '/contribuir/' },
    ...records.map((r) => ({ path: recordPath(r.id), lastmod: r.updated_at })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) =>
      `  <url><loc>${new URL(p.path, site).href}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}</url>`,
  )
  .join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
