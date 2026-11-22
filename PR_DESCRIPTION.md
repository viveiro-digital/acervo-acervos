# Acervo Acervos v1

Branch `feat/v1` → `main`. Um projeto do Viveiro Digital. Para publicar e
abrir o PR:

```sh
git restore .github               # o CI está no commit; o macOS bloqueou a cópia
pnpm install                      # atualiza o lockfile (typescript >=5.9 <7)
git add pnpm-lock.yaml && git commit -m "chore: lockfile com TypeScript 6"
git remote add origin git@github.com:viveiro-digital/acervo-acervos.git
git push -u origin main feat/v1
gh pr create --base main --head feat/v1 --title "Acervo Acervos v1" --body-file PR_DESCRIPTION.md
```

## O que entra

- **Site estático em Astro 7.4.13** (versão estável mais recente no registry
  em 21/11/2026), com Node 26 LTS via nvm (`.nvmrc`), pnpm 10.27 e nenhum
  backend.
- **Exploração image-first** (proposta A de `docs/COMPOSICAO.md`): imagens
  inteiras na proporção original quando há licença; prancha tipográfica
  honesta quando não há.
- **Painel contextual**: o explorar abre o registro num `<dialog>` com a URL
  canônica (link copiável), Esc/voltar fecham, anterior/próximo seguem os
  resultados filtrados, filtros e rolagem são preservados, e sem JS é um link
  comum (ADR 0002).
- **Páginas**: início, explorar, registro (imagem dominante, breadcrumbs,
  evidências, relações, histórico), comparar (2–4, sem ranking), `/sobre`
  curto, `/metodologia` completa, contribuir, revisão (noindex), sitemap e
  robots.
- **Footer enxuto**: "Um projeto do Viveiro Digital" (link provisório para
  `github.com/viveiro-digital/docs`), metodologia, correções via issues,
  direitos das imagens e data de atualização.
- **Dados (schema v2)**: 16 registros verificados em 21/11/2026 (12
  publicados, 4 rascunhos) e 2 iniciativas fora do catálogo com motivo. Mídia
  só com licença declarada: CASCA (CC0) e Diseño Nacional (CC BY-NC), com
  SHA-256.
- **SEO**: canonical, Open Graph e JSON-LD schema.org; `noindex` fora de
  produção.
- **Qualidade**: `pnpm check` (dados, checksums, `astro check`),
  `tests/e2e/` (Playwright + axe), `pnpm audit:lighthouse` e CI gratuito.
- **Exportação**: JSON, CSV e DCMI Terms com SHA-256.
- **Documentação**: README (setup macOS), METODOLOGIA, PENDENTES,
  CONTRIBUTING (com Definition of Done), `docs/DECISOES_TECNICAS.md`, 9 ADRs,
  OBSERVABILIDADE, VALIDACAO, COMPOSICAO e IDENTIDADE.

## Validação (detalhes em `docs/VALIDACAO.md`)

- `astro check`: 0 erros. `check:data`: 0 erros. Build: 20 páginas.
- axe (WCAG 2.2 AA + best-practice): **0 violações** em 12 páginas e no painel.
- Sem JS, mobile 390 px, zoom 200% e imagens extremas: ok.
- LCP sintético (rede lenta, CPU 4×): 0,58–0,70 s; CLS 0.
- **Não executados**: a suíte `tests/e2e/` como está (verificações
  equivalentes foram rodadas com scripts próprios), Lighthouse, leitor de
  tela, Safari e Firefox.

## Precisa de revisão humana

Todos os registros estão com `review_flag: true`. Prioridade alta:
`biblioteca-de-zines` (conflito de interesse declarado), `museu-kuahi`
(mantenedor; objetos rituais) e `xingu-entangled` (vídeo não carregou).
Lista completa em `PENDENTES.md`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01Bhdm3VuiMnnhTpWESRnYtv
