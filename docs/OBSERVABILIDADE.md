# Observabilidade

Três coisas diferentes, que não devem ser confundidas:

1. **Build e qualidade**: sinais gerados por comandos, localmente e no CI.
2. **Site em produção**: visualizações e cliques registrados no Google Analytics.
3. **Telemetria da CLI do Astro**: dados de uso da ferramenta enviados ao time
   do Astro. Não monitora visitantes nem erros do site. Para desligar:
   `pnpm astro telemetry disable`.

## Sinais monitorados

| Sinal | Comando | Onde ver |
| --- | --- | --- |
| Schema, consistência dos dados e checksums das imagens | `pnpm check:data` | terminal (erros com arquivo e campo) |
| Tipos (`.astro` e `.ts`) | `pnpm check` | terminal |
| Build | `pnpm build` | terminal; falha em erro de schema |
| Navegação, sem JS, imagens, SEO | `pnpm test:e2e` | terminal e `reports/playwright/` |
| Acessibilidade automática (axe, WCAG 2.2 AA) | `pnpm test:e2e` | idem |
| Lighthouse (Performance, A11y, Boas práticas, SEO) | `pnpm build && pnpm preview` e, em outra aba, `pnpm audit:lighthouse` | `reports/lighthouse/` |
| CI | GitHub Actions (`.github/workflows/ci.yml`) | aba Actions; artefato `relatorio-playwright` |

Histórico de resultados: o primeiro relatório está em `docs/VALIDACAO.md`.
Para novos registros, acrescente uma seção datada em vez de sobrescrever.

## Como investigar uma falha

- **Build quebrou**: leia a primeira mensagem do Zod. Ela traz o arquivo YAML e
  o caminho do campo. Rode `pnpm check:data` para regras extras.
- **Checksum não confere**: a imagem em `src/assets/acervos/` mudou. Restaure
  pelo Git ou baixe de novo pela fonte e atualize `SHA256SUMS` de forma
  consciente, registrando no `change_log`.
- **Teste de navegação falhou**: rode `pnpm exec playwright test navegacao
  --headed` e abra `reports/playwright/index.html`.
- **Link externo morto**: não marque como inativo por uma falha só. Reabra
  depois e registre a evidência e a data antes de mudar o `content_status`.

## Produção

Use a propriedade [Coleção de Acervos Digitais](https://analytics.google.com/analytics/web/#/p565456946/reports/intelligenthome).
Em **Relatórios → Tempo real**, confira a chegada de visualizações. No relatório **Eventos**, consulte:

| Evento | O que conta |
| --- | --- |
| `page_view` | Abertura de uma página pública do catálogo |
| `archive_open` | Clique no ícone do card ou no botão que abre o acervo original |
| `file_download` | Clique em um link para baixar um arquivo hospedado no catálogo |

A medição só roda no endereço público principal. Os eventos usam o caminho da
página sem os parâmetros de busca. A medição otimizada, os sinais para publicidade
e a personalização de anúncios estão desativados. Os cookies do catálogo duram
até o fim da sessão do navegador. Downloads feitos em outros sites ficam fora dos
relatórios.

## O que não está coberto

- Desempenho real de visitantes (RUM).
- Disponibilidade dos links externos (não há monitoramento periódico).
- Leitor de tela real: axe cobre só regras automáticas.
- Safari e Firefox (os testes usam Chromium).
