# Observabilidade

Três coisas diferentes, que não devem ser confundidas:

1. **Build e qualidade**: sinais gerados por comandos, localmente e no CI.
2. **Site em produção**: hoje não há instrumentação (não há produção).
3. **Telemetria da CLI do Astro**: dados de uso da ferramenta enviados ao time
   do Astro. Não monitora visitantes nem erros do site. Para desligar:
   `pnpm astro telemetry disable`.

## Sinais monitorados

| Sinal | Comando | Onde ver |
| --- | --- | --- |
| Schema, consistência dos dados e checksums das imagens | `pnpm check:data` | terminal (erros com arquivo e campo) |
| Tipos (`.astro` e `.ts`) | `pnpm check` | terminal |
| Build | `pnpm build` | terminal; falha em erro de schema |
| Navegação, painel, sem JS, imagens, SEO | `pnpm test:e2e` | terminal e `reports/playwright/` |
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
- **Teste de painel falhou**: rode `pnpm exec playwright test navegacao
  --headed` e abra `reports/playwright/index.html`.
- **Link externo morto**: não marque como inativo por uma falha só. Reabra
  depois e registre a evidência e a data antes de mudar o `content_status`.

## Produção (quando houver)

- **GitHub Pages**: não há métricas de tráfego. Os sinais são os testes
  sintéticos e a aba Actions.
- **Cloudflare**: o Web Analytics mede Core Web Vitals sem cookies, mas
  carrega um script externo. Só ligue por decisão registrada em ADR e informe
  na página Sobre.
- **Nunca registrar** termos de busca, IPs ou identificadores persistentes.

## O que não está coberto

- Desempenho real de visitantes (RUM).
- Disponibilidade dos links externos (não há monitoramento periódico).
- Leitor de tela real: axe cobre só regras automáticas.
- Safari e Firefox (os testes usam Chromium).
