# 0003 — Dados em YAML por registro, schema editorial local e exportações interoperáveis

- **Status:** accepted
- **Data:** 2026-11-21

## Contexto e restrições
Edição à mão, diffs legíveis no Git, evidências aninhadas, histórico
append-only, validação no build e nenhum banco de dados.

## Decisão
- Um YAML por registro em `src/content/acervos/`, validado por Zod
  (`src/content.config.ts`, `SCHEMA_VERSION = 2`).
- O schema editorial é próprio. A interoperabilidade é feita por
  **exportação**: `pnpm export` gera JSON, CSV e `acervos.dcterms.json`
  (mapeamento parcial para DCMI Terms, sem inventar campos).
- Nas páginas, JSON-LD schema.org: `WebPage` com `about: Collection` e
  `BreadcrumbList` nos registros, `WebSite` com `SearchAction` na home.

## Alternativas consideradas
- **CSV**: não acomoda evidências e histórico aninhados sem colunas frágeis.
- **Markdown com frontmatter**: o corpo em Markdown não seria usado.
- **SKOS para os vocabulários**: o vocabulário ainda é pequeno; os termos
  originais ficam nos campos `*_original`. Reavaliar se houver interesse em
  publicar o vocabulário.
- **Rights Statements / Creative Commons**: usados só como texto e link quando
  a fonte os declara (ex. CC0 do CASCA). Nunca atribuídos por nós.
- **OAI-PMH / protocolo catalográfico próprio**: fora de escopo.

## Consequências
O registro é uma descrição *sobre* o acervo, não um substituto dos metadados
da comunidade. Identificadores externos (Wikidata etc.) não são incluídos sem
verificação.
