# Acervo Acervos v1: catálogo editorial estático em Astro

Branch `feat/v1` → `main`. Para abrir o PR depois do push para o viveiro:

```sh
git remote add origin <url-do-repo-no-viveiro>
git push -u origin main feat/v1
gh pr create --base main --head feat/v1 --title "Acervo Acervos v1" --body-file PR_DESCRIPTION.md
```

## O que entra

- **App Astro 7, estática, sem backend**: início, explorar (filtros combináveis
  com estado na URL e fallback sem JS), registro individual, comparar (2–4,
  sem ranking), sobre/método, contribuir, revisão editorial (noindex), 404,
  `sitemap.xml` e `robots.txt`.
- **Schema v1** em `src/content.config.ts` (Zod, validado no build) e um YAML
  por registro em `src/content/acervos/`. A autodescrição fica separada do
  texto editorial; quem mantém fica separado da relação comunitária; cada
  afirmação importante tem fonte, data, tipo e certeza; o `change_log` é
  append-only.
- **16 registros**, sem nenhum inventado:
  - 12 publicados: 7 com conteúdo confirmado, 4 parciais e 1 catálogo sem
    mídia confirmada;
  - 4 rascunhos (Acervo Bajubá, Arquivo Lésbico Brasileiro, Armazém Memória e
    MUTHA), que não aparecem no site público;
  - 2 iniciativas verificadas e deixadas de fora, com motivo.
- **Identidade visual**: marca tipográfica com reimpressão deslocada,
  monograma SVG, paleta papel, tinta, vermelho e azul (contraste ≥ 5,2:1),
  pilhas de fontes do sistema e imagem OG própria. Detalhes em
  `docs/IDENTIDADE.md`.
- **Scripts sem dependências novas**: `pnpm check`, `pnpm review
  list|resolve|flag`, `pnpm export` (JSON, CSV e SHA256SUMS) e `pnpm og`.
- **Documentação**: `README.md`, `METODOLOGIA.md`, `PENDENTES.md` e
  `docs/IDENTIDADE.md`.

## Como as verificações foram feitas

Em 21/11/2026, um agente de IA abriu cada amostra no navegador e conferiu pelo
DOM se a mídia carregou: dimensões da imagem decodificada, PDF no player ou só
metadados. Nada foi baixado nem copiado. O *Guia dos Arquivos que não Existem*
(PDF) foi lido e é citado com páginas.

**Todos os registros estão com `review_flag: true`**: a revisão humana é
obrigatória antes de considerar qualquer verificação concluída. Prioridades
altas:

- `biblioteca-de-zines`: **conflito de interesse declarado** (a pessoa que
  mantém o projeto também contribui com a Biblioteca). Precisa de revisão por
  outra pessoa. Não aparece nos destaques da página inicial.
- `museu-kuahi`: confirmar quem mantém o museu e se há protocolo para objetos
  rituais publicados no acervo. A amostra escolhida foi uma rede de dormir, não
  um objeto ritual.
- `xingu-entangled`: o vídeo de introdução não carregou; faltam créditos e
  parcerias.

## Como testar

```sh
pnpm install && pnpm check && pnpm build && pnpm preview
```

- `/explorar/?pais=AR` mostra só o Archivo de la Memoria Trans; buscar
  `amapa` (sem acento) encontra o Museu Kuahí.
- `/comparar/?ids=casca,irohin,museu-kuahi` mostra 3 colunas; um quinto id
  é ignorado.
- Com JavaScript desligado, o explorar lista os 12 registros.
- Com `SITE_URL=https://exemplo DEPLOY_ENV=production pnpm build`, o
  `robots.txt` libera a indexação, o canonical é absoluto e o sitemap lista só
  páginas públicas.

## O que foi verificado e o que não foi

| Verificado | Não verificado |
| --- | --- |
| Build e schema (19 páginas) | Auditoria com leitor de tela |
| Filtros, busca, chips, URL e comparação (Playwright) | Ferramenta automática de a11y (axe, Lighthouse) |
| Navegação por teclado (skip link) e foco visível | Type-check (`@astrojs/check` não instalado) |
| Layout em 390 px e 1280 px | Safari / Firefox |
| Funcionamento sem JS | Fontes condensadas em todos os sistemas |
| Metadados, canonical, sitemap e robots | Deploy (nenhum foi feito) |
| `pnpm review` em uma cópia descartável | |

## Pendências e decisões para você

- Definir o canal público de contato (`contactUrl` em `src/site.config.ts`).
  Hoje a página Contribuir diz que ele ainda não existe.
- Definir o domínio (`SITE_URL`) e onde hospedar.
- Revisar os 16 registros, começando pelos de prioridade alta.
- As fontes condensadas dependem do sistema. Se quiser uma tipografia fixa,
  dá para adicionar uma fonte livre (OFL) em `public/` sem depender de serviço
  externo.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01Bhdm3VuiMnnhTpWESRnYtv
