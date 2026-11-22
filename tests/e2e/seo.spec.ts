import { test, expect } from '@playwright/test';

test('registro: canonical, Open Graph e JSON-LD no HTML inicial', async ({ request }) => {
  const html = await (await request.get('/acervos/diseno-nacional/')).text();
  expect(html).toMatch(/<link rel="canonical" href="[^"]+\/acervos\/diseno-nacional\/">/);
  expect(html).toContain('property="og:title"');
  expect(html).toContain('application/ld+json');
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)![1]);
  expect(ld[0].about['@type']).toBe('Collection');
});

test('sitemap só com páginas públicas', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).toContain('/acervos/casca/');
  expect(xml).not.toContain('/revisao/');
  expect(xml).toContain('/acervos/acervo-bajuba/');
  expect(xml).not.toContain('/acervos/arquivo-lesbico-brasileiro/'); // rascunho
  expect(xml).not.toContain('/acervos/nova-cartografia-social/'); // rascunho
});

test('fora de produção, robots bloqueia e as páginas têm noindex', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  if (!process.env.DEPLOY_ENV) expect(robots).toContain('Disallow: /');
});
