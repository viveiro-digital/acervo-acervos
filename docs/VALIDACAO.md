# Relatório de validação

## Estado em 22/11/2026

- Navegação, filtros e acessibilidade automática: 62 testes Playwright passaram em Chromium, com perfis de desktop e celular, após a troca do painel por páginas completas.
- Após a integração do Analytics: `pnpm check` e build de produção passaram. O teste no site publicado confirmou o envio de visualização e clique no acervo.
- Em produção, foi conferido que a capa abre a ficha, o ícone abre o acervo em outra aba e o formulário abre sem login. A confirmação de uma resposta no formulário e o teste com Safari e VoiceOver continuam pendentes.

As seções abaixo registram as rodadas anteriores.

## Rodada 1 — 21/11/2026

**Quem executou:** agente de IA, sem revisão humana dos resultados.

**Ambiente:**
- Build: Linux arm64 (Node 22.23.5), sobre o mesmo `node_modules` instalado no
  Mac (Node 26.13.0, pnpm 10.27.0). O `node_modules` traz binários linux-arm64
  pelo `supportedArchitectures`.
- Navegador: Chromium headless em container Linux.

**Como reproduzir:** os comandos estão em `docs/OBSERVABILIDADE.md`. Os testes
equivalentes estão versionados em `tests/e2e/`.

> **Importante:** a suíte `tests/e2e/` **não foi executada como está**, porque o
> ambiente do agente não tinha o runner `@playwright/test`. O agente rodou as
> mesmas verificações com scripts próprios (Playwright + axe-core 4.14.1),
> descritas abaixo. Rode `pnpm validate` no Mac para confirmar.

### Build e dados

| Verificação | Resultado |
| --- | --- |
| `pnpm check:data` | 16 registros, 0 erros, 1 aviso (URL `http` no contato do Diseño Nacional) |
| Checksums das imagens (`SHA256SUMS`) | 2/2 conferem |
| `astro check` | 0 erros, 0 avisos, 0 dicas (35 arquivos). Rodado com TypeScript 5.9.3, porque o `astro check` ainda não suporta TS 7 |
| `astro build` | 20 páginas; 2,3 MB, 50 arquivos em `dist/` (incluindo variantes AVIF/WebP/JPEG) |
| `pnpm export` | JSON, CSV, DCMI Terms e SHA256SUMS gerados |

### Navegação e estados

| Caso | Resultado |
| --- | --- |
| Filtro por país via URL (`?pais=AR`) | 1 de 12, URL determinística |
| Busca sem acento (`amapa`) | encontra o Museu Kuahí |
| Remover chip com a busca focada | filtro removido (bug corrigido nesta rodada) |
| Painel: abrir | URL `/acervos/irohin/`, foco no título, "4 de 7 nos resultados" |
| Painel: próximo | `/acervos/museu-kuahi/` |
| Painel: Esc | fecha; URL volta a `/explorar/?pais=BR`; foco no último item visto |
| Painel: voltar / avançar | voltar fecha, avançar reabre; filtros preservados |
| Registro por URL direta | 200, `h1` único |
| Comparar com 5 ids | limitado a 4 |
| **Sem JavaScript** | explorar lista os 12; o link abre a página canônica; a home mostra as 2 imagens |
| Erros de console | nenhum |

### Imagens

| Caso | Resultado |
| --- | --- |
| Proporção preservada (CASCA 619×800, Diseño 946×1291) | sim, sem recorte (`object-fit: contain`) |
| Alt | CASCA: texto da fonte; Diseño: escrito pela curadoria e marcado assim |
| Placeholder neutro 300×3000 (cartaz extremo) | 77×765 px, proporção mantida, cabe em 85% da altura |
| Placeholder neutro 3000×300 (panorâmica) | 708×71 px, proporção mantida. Em resposta, imagens reais com proporção > 1,4 passaram a ocupar a largura toda da página do registro. Não há imagem real panorâmica no catálogo para medir esse caminho |
| Sem imagem autorizada | prancha tipográfica com o motivo; nenhuma `<img>` no `main` |
| CLS | 0 em todas as páginas medidas |

### Acessibilidade

| Caso | Resultado |
| --- | --- |
| axe-core 4.14.1 (wcag2a/aa, 2.1, 2.2aa, best-practice) em 12 páginas | **0 violações** |
| axe no painel aberto | 0 violações |
| Primeiro Tab | "Pular para o conteúdo" |
| Zoom 200% (viewport 640 px) | sem rolagem horizontal |
| Mobile 390 px | sem rolagem horizontal; painel em tela cheia; imagem com 358 px; filtros recolhidos em "Filtros e ordenação (n ativos)", com o 1º registro visível na primeira tela (corrigido nesta rodada: antes os filtros ocupavam a tela inteira) |
| Contraste das cores de texto | ≥ 5,6:1 (tinta 14,9; cinza 6,4; vermelho 5,6; azul 7,6) |

**Não verificado:** leitor de tela real (VoiceOver/NVDA), Safari e Firefox, e
áreas de toque medidas uma a uma.

### Desempenho (sintético, não é Lighthouse)

Chromium mobile (412×823) com rede de ~1,6 Mbps, 150 ms de RTT e CPU 4×
mais lenta, servido localmente:

| Página | LCP | CLS | Transferido | Scripts |
| --- | --- | --- | --- | --- |
| `/` | 704 ms | 0 | 78 KB | 0 |
| `/explorar/` | 624 ms | 0 | 85 KB | 1 |
| `/acervos/diseno-nacional/` | 704 ms | 0 | 64 KB | 0 |
| `/acervos/irohin/` | 584 ms | 0 | 36 KB | 0 |

**Lighthouse não foi executado** (o ambiente do agente não tem o pacote
instalado). Rode `pnpm audit:lighthouse` e registre os números aqui. A meta
acordada é ≥ 90 em Performance, Acessibilidade e SEO. Fora de produção, SEO
cai de propósito, porque as páginas saem com `noindex`.

### SEO e metadados (build de produção simulado)

Feito com `SITE_URL=https://acervos-digitais.example DEPLOY_ENV=production`:
- canonical absoluto e `index, follow` em home e registros;
- JSON-LD: `WebSite` + `SearchAction` na home, `WebPage` (com `about:
  Collection`) + `BreadcrumbList` nos registros, e `primaryImageOfPage` quando
  há imagem licenciada;
- sitemap com 17 URLs, sem `/revisao/`, rascunhos nem comparação;
- `robots.txt` libera a indexação e bloqueia `/revisao/`;
- fora de produção: `noindex, nofollow` em tudo e `Disallow: /`.

### Critérios de aceitação visual (docs/COMPOSICAO.md)

1. Mídia como maior área quando existe: **sim**. 3/5 na página e na home, 2/5
   no índice.
2. Sem recorte nem distorção: **sim** (medido).
3. Crédito, licença e fonte legíveis: **sim**, em texto logo abaixo da imagem.
4. Sem imagem, o registro continua navegável e pesquisável: **sim**.
5. Teclado, zoom e conexão lenta: **sim** nos casos acima. Leitor de tela real
   não foi testado.
