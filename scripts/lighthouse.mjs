#!/usr/bin/env node
// Auditoria Lighthouse local (Performance, Acessibilidade, Boas práticas, SEO).
// Pré-requisitos: `pnpm build` e `pnpm preview` rodando em outra aba
// (http://localhost:4321). Usa o Chromium instalado pelo Playwright.
// Resultados: reports/lighthouse/<pagina>.html e resumo.json
import { mkdirSync, writeFileSync } from 'node:fs';
import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const pages = ['/', '/explorar/', '/acervos/casca/', '/acervos/irohin/', '/sobre/'];
mkdirSync('reports/lighthouse', { recursive: true });

const PORT = 9333;
const browser = await chromium.launch({ args: [`--remote-debugging-port=${PORT}`] });
const resumo = {};
for (const p of pages) {
  const r = await lighthouse(`${BASE}${p}`, {
    port: PORT,
    output: 'html',
    formFactor: 'mobile',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  });
  const name = p === '/' ? 'inicio' : p.replaceAll('/', '-').replace(/^-|-$/g, '');
  writeFileSync(`reports/lighthouse/${name}.html`, r.report);
  resumo[p] = Object.fromEntries(
    Object.entries(r.lhr.categories).map(([k, v]) => [k, Math.round(v.score * 100)]),
  );
  console.log(p, resumo[p]);
}
await browser.close();
writeFileSync('reports/lighthouse/resumo.json', JSON.stringify({ data: new Date().toISOString(), resumo }, null, 2));
console.log('\nObs.: SEO tende a cair fora de produção porque as páginas saem com noindex de propósito.');
