# Decisões técnicas: ferramentas avaliadas

Índice e resumo. A fonte de verdade das decisões são os ADRs em
[`docs/adr/`](adr/README.md).

Legenda da coluna v1: **agora** = integrado; **exportação** = só como padrão
de exportação ou documentação; **depois** = adiado; **não** = rejeitado.

| Necessidade | Escolha (v1) | Alternativas | Custo | Privacidade | v1 | ADR |
| --- | --- | --- | --- | --- | --- | --- |
| Gerador do site | Astro 7.4.13, estático | Eleventy, Hugo, Next.js | R$ 0 | GA4 no site público | agora | [0001](adr/0001-site-estatico-astro.md) |
| Validação de dados | Content Collections + Zod; `scripts/check-data.mjs` | JSON Schema avulso | R$ 0 | — | agora | [0003](adr/0003-dados-yaml-e-interoperabilidade.md) |
| Navegação entre fichas | Links para as páginas dos acervos e para as fontes externas | Painel contextual | R$ 0 | destino original medido em produção | agora | [0002 (histórico)](adr/0002-navegacao-painel-contextual.md) |
| Imagens | `astro:assets` (`<Picture>`, AVIF/WebP, dimensões) | hotlink, CDN de imagens paga | R$ 0 | sem requisições a terceiros | agora | [0004](adr/0004-imagens-e-licenciamento.md) |
| Sitemap | endpoint próprio | `@astrojs/sitemap` | R$ 0 | — | agora | [0001](adr/0001-site-estatico-astro.md) |
| Metadados web | JSON-LD schema.org (`WebPage`, `Collection`, `BreadcrumbList`, `WebSite`) | microdata | R$ 0 | — | agora | [0003](adr/0003-dados-yaml-e-interoperabilidade.md) |
| Interoperabilidade | DCMI Terms (`export/acervos.dcterms.json`), JSON, CSV | OAI-PMH, MODS | R$ 0 | — | exportação | [0003](adr/0003-dados-yaml-e-interoperabilidade.md) |
| Vocabulário | lista controlada + termos originais | SKOS | R$ 0 | — | depois | [0003](adr/0003-dados-yaml-e-interoperabilidade.md) |
| Direitos | texto e link da licença *declarada pela fonte* (CC) | RightsStatements.org | R$ 0 | — | agora (só quando declarado) | [0004](adr/0004-imagens-e-licenciamento.md) |
| Protocolos comunitários | só citar os publicados pela fonte | Local Contexts / TK Labels | — | — | não atribuir | METODOLOGIA |
| Preservação do catálogo | Git + export + SHA-256 | BagIt | R$ 0 | — | agora | [0005](adr/0005-preservacao-do-catalogo.md) |
| Preservação de acervos externos | — (só links e evidência) | Archivematica, arquivamento web | — | — | não | [0005](adr/0005-preservacao-do-catalogo.md) |
| Busca | filtro no cliente sobre o HTML | Pagefind, Algolia | R$ 0 | termos não saem do navegador | agora; Pagefind depois | [0006](adr/0006-busca-e-filtros-no-cliente.md) |
| Testes | Playwright + axe-core, `astro check` | Cypress, pa11y | R$ 0 | — | agora | [0008](adr/0008-observabilidade-com-privacidade.md) |
| Desempenho | Lighthouse local + medição com throttling | PageSpeed Insights (só com URL pública) | R$ 0 | — | agora (local) | [0008](adr/0008-observabilidade-com-privacidade.md) |
| Hospedagem | GitHub Pages, com fluxo de publicação separado do código-fonte | Cloudflare Workers static assets | R$ 0 | — | em produção | [Publicação](https://github.com/viveiro-digital/acervos-digitais-colecao) |
| Analytics | GA4 com visualizações e cliques escolhidos pelo catálogo | — | R$ 0 | sem termos de busca nos eventos atuais | em produção | [Observabilidade](OBSERVABILIDADE.md) |
| Ambiente | Node 26 LTS (nvm), pnpm 10.27 | npm, Volta | R$ 0 | — | agora | [0009](adr/0009-ambiente-node-pnpm.md) |
| CI e publicação | GitHub Actions | — | gratuito em repo público | — | agora | [0008](adr/0008-observabilidade-com-privacidade.md) |
