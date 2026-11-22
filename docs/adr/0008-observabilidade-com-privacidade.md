# 0008 — Observabilidade sem rastrear pessoas

- **Status:** accepted
- **Data:** 2026-11-21

## Contexto e restrições
São necessários sinais de qualidade e desempenho sem cookies, sem
identificadores e sem scripts de terceiros adicionados automaticamente.

## Decisão
- **Build e qualidade**: `pnpm check` (dados, checksums, tipos), `pnpm build`,
  `pnpm test:e2e` (Playwright + axe) e `pnpm audit:lighthouse`, todos locais e
  no CI gratuito.
- **Produção**: nenhum script de analytics no v1. Se a hospedagem for
  Cloudflare, o Web Analytics (sem cookies, só métricas de desempenho) pode ser
  ligado por decisão explícita, documentada em `docs/OBSERVABILIDADE.md`.
- **Telemetria da CLI do Astro**: não monitora o site. Pode ser desligada com
  `pnpm astro telemetry disable`.

## Alternativas rejeitadas
Google Analytics, PostHog e Sentry (cookies e/ou SaaS), e registro de termos
de busca.
