# 0007 — Hospedagem estática gratuita (recomendação, sem deploy)

- **Status:** proposed — aguarda decisão de quem publica; nenhum deploy feito
- **Data:** 2026-11-21

## Contexto e restrições
Teto de R$ 0/mês, site 100% estático (~2 MB hoje), redirects para slugs
antigos, cabeçalhos de segurança e observabilidade sem rastreamento.

## Comparação (limites consultados em 21/11/2026)

| | GitHub Pages | Cloudflare (Workers com static assets) |
| --- | --- | --- |
| Custo | Gratuito em repositório público | Requisições a assets estáticos gratuitas e ilimitadas |
| Tamanho | Site publicado de até 1 GB; repositório recomendado até 1 GB | Até 20.000 arquivos por versão (plano gratuito), 25 MiB por arquivo |
| Banda | Limite *soft* de 100 GB/mês | Sem limite para assets estáticos |
| Redirects / headers | Sem arquivo de regras: redirects via páginas `meta refresh` (já geradas pelo build) | Arquivos `_redirects` e `_headers` |
| Previews | Não nativos (exigiriam outro workflow) | Versões e previews por deploy |
| Observabilidade gratuita | Nenhuma de tráfego | Web Analytics sem cookies (beacon externo; ver ADR 0008) |
| Lock-in | Baixo | Baixo (o `dist/` é portátil) |

## Recomendação
**GitHub Pages** para começar: o código já vai para o GitHub do Viveiro
Digital, não exige outra conta e cabe com folga nos limites. **Cloudflare** é
a alternativa se forem necessários headers de segurança (CSP), redirects
reais ou previews por PR.

## Fontes
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
- https://developers.cloudflare.com/workers/static-assets/redirects/
- https://developers.cloudflare.com/workers/static-assets/headers/
