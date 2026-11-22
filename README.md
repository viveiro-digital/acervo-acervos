# Coleção de Acervos Digitais

[Catálogo público](https://viveiro-digital.github.io/acervos-digitais-colecao/) · [Publicação](https://github.com/viveiro-digital/acervos-digitais-colecao)

**Explore o que iniciativas e arquivos compartilham online.**

Coleção de Acervos Digitais é um catálogo editorial estático, local-first, de iniciativas e
arquivos do Brasil e da América Latina que publicam conteúdo digital
consultável. Cada registro aponta para a iniciativa de origem e diz **o que foi
visto, quando, como e o que ainda não se sabe**. Não é diretório exaustivo,
selo de qualidade nem substituto dos catálogos das próprias iniciativas.

Um projeto do [Viveiro Digital](https://github.com/viveiro-digital/docs).

- Método e critérios: [`METODOLOGIA.md`](METODOLOGIA.md) e `/metodologia/` no site
- Registros pendentes: [`PENDENTES.md`](PENDENTES.md)
- Decisões técnicas: [`docs/DECISOES_TECNICAS.md`](docs/DECISOES_TECNICAS.md) e [ADRs](docs/adr/README.md)
- Validação: [`docs/VALIDACAO.md`](docs/VALIDACAO.md) · Observabilidade: [`docs/OBSERVABILIDADE.md`](docs/OBSERVABILIDADE.md)
- Composição visual: [`docs/COMPOSICAO.md`](docs/COMPOSICAO.md) · Identidade: [`docs/IDENTIDADE.md`](docs/IDENTIDADE.md)
- Como contribuir e Definition of Done: [`CONTRIBUTING.md`](CONTRIBUTING.md)

## Setup no macOS

Ambiente auditado em 21/11/2026 (`docs/ambiente-macos.txt`): Apple Silicon
(arm64), macOS 15.5, nvm 0.39.1, git 2.45.2. O Node 22.22.0 do sistema não
atendia ao `>=22.23.4` do Astro 7.4.13, então o projeto usa **Node 26.13.0
(LTS) via nvm** (`.nvmrc`) e **pnpm 10.27.0**.

```sh
cd ~/www/acervo-acervos
nvm install && nvm use              # lê .nvmrc
npm install -g pnpm@10.27.0         # o pnpm global do Node 26 vinha na 9.4
pnpm install
pnpm exec playwright install chromium   # para os testes
```

Também dá para auditar e preparar tudo com `bash scripts/setup-mac.sh`. O
script não apaga nada e não usa sudo.

## Rodar localmente

```sh
pnpm dev          # http://localhost:4321
pnpm check        # dados + checksums das imagens + astro check (tipos)
pnpm build        # gera dist/ (falha se algum registro não seguir o schema)
pnpm preview      # serve dist/ localmente para revisão
pnpm test:e2e     # Playwright + axe (sobe o preview sozinho)
pnpm validate     # check + build + test:e2e
```

Outros comandos:

```sh
pnpm review list                                   # registros sinalizados
pnpm review resolve <id> --motivo "..." [--fonte URL]
pnpm review flag <id> --motivo "..." [--prioridade alta|media|baixa]
pnpm export       # export/: JSON, CSV, DCMI Terms e SHA256SUMS
pnpm audit:lighthouse   # com `pnpm preview` rodando em outra aba
pnpm og           # regenera public/og-default.png a partir de design/og-default.svg
```

### Variáveis de ambiente

Veja `.env.example`. Sem elas o site funciona localmente, mas **todas as páginas
saem com `noindex` e o `robots.txt` bloqueia tudo**.

| Variável | Uso |
| --- | --- |
| `SITE_URL` | Origem pública canônica (ex.: `https://acervoacervos.org`). Usada em canonical, Open Graph e sitemap. |
| `DEPLOY_ENV` | Só `production` libera a indexação. Nunca defina em previews. |

## Estrutura

```
src/
  content.config.ts          schema dos registros (Zod, validado no build)
  content/acervos/*.yaml     um arquivo por registro: os dados
  content/fora-do-catalogo/  iniciativas verificadas e deixadas de fora (com motivo)
  assets/acervos/            imagens com licença declarada + SHA256SUMS
  data/vocabulario.ts        vocabulários controlados e rótulos
  lib/acervos.ts             consultas, facetas, relações (sem UI)
  components/                CollectionCover (prévia do catálogo), Footer…
  layouts/Base.astro         head (SEO, OG, JSON-LD), header e footer
  pages/                     início, explorar (+ painel), registro, comparar,
                             sobre, metodologia, contribuir, revisão (noindex),
                             sitemap, robots
  site.config.ts             nome, Viveiro Digital, canal de correções, indexação
scripts/                     setup-mac, check-data, review, export, lighthouse, make-og
tests/e2e/                   Playwright + axe
docs/                        ADRs, decisões, observabilidade, validação, composição
design/                      fontes editáveis da identidade (SVG)
.github/workflows/ci.yml     CI gratuito (sem deploy)
```

Os dados ficam separados da apresentação: os componentes só leem
`src/lib/acervos.ts`, que lê a coleção `acervos`.

## Modelo de dados

Cada registro é um YAML em `src/content/acervos/<id>.yaml`. O **nome do arquivo
é o `id`** (estável, minúsculas e hífens) e define a URL pública
`/acervos/<id>/`. O schema completo, com comentários, está em
`src/content.config.ts`. Os grupos de campos são:

- **Identidade e contexto**: `id`, `name`, `preferred_name`, `alternative_names`,
  `initiative_type`, `self_description` (citação da fonte, com língua e URL),
  `description` (texto editorial nosso, `pt` obrigatório e `es`/`en` opcionais),
  `initiative_url`, `digital_collection_url`, `sample_content_url`,
  `access_channel` (quando o conteúdo está em plataforma de terceiros),
  `country`, `region`, `city`, `geographic_scope`, `territory_note`, `languages`.
- **Conteúdo**: `collection_types` (+ `_original`), `themes` (+ `_original`),
  `formats`, `date_range` (início, fim, precisão e rótulo legível),
  `design_dimensions`.
- **Amostra**: `sample.title`, `sample.observed` (o que vimos),
  `sample.confirmed_media`, autoria e data da fonte, `alt_from_source`, direitos.
- **Governança e cuidado**: `stewardship_or_host` (quem mantém) separado de
  `community_evidence` (relação documentada com comunidades),
  `curatorial_reason`, `evidence[]` (afirmação, fonte, data, tipo
  declarado/observado/interpretação/terceiros, certeza), `provenance_note`,
  `access_level`, `rights_and_reuse`, `sensitive_content_note`,
  `community_protocol`, `removal_or_contact_url`, `relationship_disclosure`,
  `gaps[]`.
- **Mídia** (schema v2): `media[]` só com imagem de licença declarada pela
  fonte, com `local_asset`, `source_url`, `page_url`, `relation`, `credit`,
  `license_or_permission`, `license_url`, `alt`, `alt_source` (fonte ou
  curadoria), `caption`, `rights_checked_at` e `order`; `media_note` explica
  a ausência.
- **Verificação e histórico**: `last_verified_at`, `verification_method`,
  `link_status`, `content_status`, `review_flag`/`review_reason`/`review_priority`,
  `record_status` (`rascunho` | `publicado` | `arquivado`), `demo`,
  `created_at`, `updated_at`, `previous_ids`, `change_log[]` (append-only).

### Convenções

- Datas: ISO `AAAA-MM-DD`, entre aspas no YAML.
- Chaves de vocabulário: minúsculas, sem acento, hífen como separador. Para
  criar uma nova, adicione em `src/data/vocabulario.ts` (chave e rótulo).
- Termos usados pela fonte vão nos campos `*_original`, sem tradução.
- Países: ISO 3166-1 alfa-2, mais `LATAM` para vários países.
- Línguas: ISO 639-1. Para línguas indígenas, use ISO 639-3 confirmado na fonte.
- Contagens de acervo (ex.: "429 itens") só vão em `evidence`, com data, e não
  aparecem na interface principal.

## Adicionar, revisar, arquivar

1. **Adicionar**: copie um registro parecido, renomeie o arquivo para o novo
   `id` e preencha. Abra a amostra e descreva só o que viu. Sem amostra
   confirmada, use `content_status: revisao_pendente` e `record_status: rascunho`
   (rascunhos não são publicados). Entrada inicial no `change_log` é obrigatória.
2. **Validar**: `pnpm check` e depois `pnpm build`. Os erros apontam arquivo e
   campo.
3. **Revisar**: veja `/revisao/` no `pnpm dev` ou `pnpm review list`. Depois de
   conferir, rode `pnpm review resolve <id> --motivo "..."`, que atualiza o
   YAML e o `change_log`. Revise com `git diff` e faça o commit.
4. **Corrigir**: mude o campo, atualize `updated_at` e acrescente ao `change_log`
   o valor anterior, o novo, o motivo e a fonte. Não apague entradas antigas.
5. **Arquivar ou indisponibilizar**: nunca apague o arquivo. Use
   `content_status: inativo_ou_indisponivel` (com evidência e data; uma falha
   temporária não basta) ou `record_status: arquivado`, e registre no
   `change_log`. Pedidos de remoção da própria iniciativa: `record_status:
   arquivado` e motivo no log.
6. **Mudar o `id`**: renomeie o arquivo, coloque o id antigo em `previous_ids`.
   O build gera uma página que redireciona do endereço antigo.

## Decisões de arquitetura

Resumo; os detalhes e as alternativas estão nos [ADRs](docs/adr/README.md).

- **Astro 7, saída estática, sem backend** (ADR 0001). JavaScript só no
  explorar (filtros e painel) e no comparar, com alternativa sem JS.
- **Painel contextual** com a página canônica do registro, URL copiável e
  voltar/Esc coerentes (ADR 0002).
- **YAML por registro**, schema validado no build e exportação DCMI Terms
  (ADR 0003).
- **Prévias de coleção** na interface. Imagens de obras registradas no campo
  `media` ficam no repositório, com checksum, e não entram no site (schema v5,
  ADR 0004).
- **Sem dependências de runtime além do Astro.** As devDependencies são as
  ferramentas de qualidade (astro check, Playwright, axe, Lighthouse).
- **Sem rastreadores, cookies, fontes remotas ou scripts de terceiros**
  (ADR 0008). Links externos usam `rel="noopener noreferrer external"`.
- **Facetas na URL** com uma única URL canônica, a página inicial (`/`) (ADR 0006).

## SEO e compartilhamento

Cada página tem título, descrição, canonical absoluto, Open Graph, Twitter
Card e JSON-LD schema.org (`WebSite` na home; `WebPage` + `Collection` +
`BreadcrumbList` nos registros). O `sitemap.xml` lista só as páginas públicas
canônicas: início, explorar, sobre, metodologia, contribuir e registros
publicados. Revisão, comparação, 404 e rascunhos ficam de fora, e `/revisao/`
sempre sai com `noindex`. O teste `tests/e2e/seo.spec.ts` confere esses pontos
no HTML gerado.

**Preview**: sem provedor de hospedagem configurado, o preview é local
(`pnpm build && pnpm preview`). Se um provedor gerar URLs de preview, não defina
`DEPLOY_ENV=production` nelas: assim continuam com `noindex`, e o canonical
aponta para `SITE_URL`, não para o preview.

## Preservação dos dados do projeto

- Dados em texto (YAML), schema versionado (`SCHEMA_VERSION` em
  `src/content.config.ts`) e histórico no Git.
- `pnpm export` gera JSON e CSV com `SHA256SUMS` para backup. Para restaurar,
  os YAML no Git são a fonte; o JSON exportado contém os mesmos registros.
- Isso preserva **o catálogo**, não os acervos externos. Um link monitorado não
  garante a continuidade da iniciativa de origem.
- `pnpm register` gera `src/assets/acervos/MANIFESTO.csv` (registro de ativos:
  tamanho, SHA-256, MIME, PUID do PRONOM, dimensões, origem, licença) e
  `SHA256SUMS`; `pnpm check:data` confere os arquivos contra eles.
- Autoavaliação NDSA Levels v2.1 e DPC RAM v3, política de acervo, convenção de
  nomes, mapeamento Dublin Core, LGPD, arquivabilidade e plano de sucessão:
  [`docs/PRESERVACAO.md`](docs/PRESERVACAO.md) e ADR 0010.
- Catalogação pela ISDIAH, com mapeamento campo a campo:
  [`docs/CATALOGACAO.md`](docs/CATALOGACAO.md) e ADR 0011.

## Limitações conhecidas

- Primeira rodada de verificações feita por agente de IA em 21/11/2026; **todos
  os registros estão marcados para revisão humana**.
- Catálogo pequeno: 18 publicados, 4 rascunhos e 2 deixados de fora. A interface usa prévias das coleções e remete às obras na fonte.
- Interface só em português; os campos `es`/`en` existem, mas estão vazios.
- O canal de correções e o link do código apontam para
  `github.com/viveiro-digital/acervo-acervos`, que só existe depois do push.
- O Viveiro Digital aparece com o link provisório do repositório de
  documentação, porque não há site público verificado.
- Validação: ver `docs/VALIDACAO.md`. Lighthouse, leitor de tela real, Safari
  e Firefox não foram testados.

## Referência

BEIGUELMAN, Giselle (org.). *Guia dos Arquivos que não Existem: acervos
digitais contra-hegemônicos*. São Paulo: FAU-USP, 2026. DOI
[10.11606/9788580891874](https://doi.org/10.11606/9788580891874).
