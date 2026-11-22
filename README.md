# Acervo Acervos

**Explore o que iniciativas e arquivos compartilham online.**

Acervo Acervos é um catálogo editorial estático, local-first, de iniciativas e
arquivos do Brasil e da América Latina que publicam conteúdo digital
consultável. Cada registro aponta para a iniciativa de origem e diz **o que foi
visto, quando, como e o que ainda não se sabe**. Não é diretório exaustivo,
selo de qualidade nem substituto dos catálogos das próprias iniciativas.

- Método e critérios: [`METODOLOGIA.md`](METODOLOGIA.md), também visível em `/sobre/`
- Registros pendentes: [`PENDENTES.md`](PENDENTES.md)
- Identidade visual: [`docs/IDENTIDADE.md`](docs/IDENTIDADE.md)

## Rodar localmente

Requer Node ≥ 22.23 e pnpm 10.

```sh
pnpm install
pnpm dev          # http://localhost:4321
pnpm check        # consistência dos dados + schema (astro sync)
pnpm build        # gera dist/ (falha se algum registro não seguir o schema)
pnpm preview      # serve dist/ localmente para revisão
```

Outros comandos:

```sh
pnpm review list                                   # registros sinalizados
pnpm review resolve <id> --motivo "..." [--fonte URL]
pnpm review flag <id> --motivo "..." [--prioridade alta|media|baixa]
pnpm export       # export/acervos.json + export/acervos.csv + SHA256SUMS
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
  content/acervos/*.yaml     um arquivo por registro — os dados
  content/fora-do-catalogo/  iniciativas verificadas e deixadas de fora (com motivo)
  data/vocabulario.ts        vocabulários controlados e rótulos
  lib/acervos.ts             consultas, facetas, relações (sem UI)
  layouts/ components/       apresentação
  pages/                     início, explorar, registro, comparar, sobre,
                             contribuir, revisão (noindex), sitemap, robots
  site.config.ts             nome, subtítulo, canal de contato, indexação
scripts/                     check-data, review, export, make-og
design/                      fontes editáveis da identidade (SVG)
public/marca/                marca em SVG para uso fora do site
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

- **Astro 7, saída estática, sem backend.** Conteúdo e metadados essenciais
  estão no HTML inicial. JavaScript é usado só em filtros e comparação, que têm
  fallback textual sem JS.
- **YAML por registro** em vez de CSV: aceita listas, textos longos, evidências
  aninhadas e histórico, e continua editável à mão e legível em diffs do Git.
- **Validação no build** (Zod via Content Collections) e regras extras em
  `scripts/check-data.mjs`. Nenhuma URL é acessada durante o build.
- **Sem dependências além do Astro.** Sitemap e robots são endpoints próprios.
  Os scripts reaproveitam `yaml` e `sharp`, que já vêm com o Astro.
- **Sem rastreadores, cookies, fontes remotas ou scripts de terceiros.** Links
  externos usam `rel="noopener noreferrer external"`.
- **Sem imagens de obras** dos acervos: o projeto descreve e aponta, não copia.
  A imagem de compartilhamento é a do próprio projeto.
- **Facetas na URL** (`/explorar/?pais=BR&tema=...`), com parâmetros em ordem
  fixa. As combinações não viram páginas indexáveis: há uma só URL canônica,
  `/explorar/`. Páginas por tema ou território não foram geradas porque o
  catálogo ainda é pequeno demais para elas terem conteúdo próprio.

## SEO e compartilhamento

Cada página tem título, descrição, canonical absoluto, Open Graph e Twitter
Card. `sitemap.xml` lista só as páginas públicas canônicas (início, explorar,
sobre, contribuir e registros publicados). Revisão, comparação, 404 e
rascunhos ficam de fora; `/revisao/` sempre sai com `noindex`. Para conferir,
rode `pnpm build` e veja `dist/sitemap.xml`, `dist/robots.txt` e o `<head>` de
qualquer `dist/acervos/*/index.html`.

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

## Limitações conhecidas

- Primeira rodada de verificações feita por agente de IA em 21/11/2026; **todos
  os registros estão marcados para revisão humana**.
- Catálogo pequeno: 12 publicados, 4 rascunhos e 2 deixados de fora.
- Interface só em português; os campos `es`/`en` existem mas estão vazios.
- Canal público de contato ainda não definido (`siteConfig.contactUrl = null`).
- Acessibilidade conferida em parte: navegação por teclado, foco visível,
  contraste das cores principais (≥ 5,2:1), funcionamento sem JS e layout em
  390 px foram testados. Não houve auditoria com leitor de tela nem com
  ferramenta automática como axe.
- O Guia (PDF) foi lido e é citado com páginas; o projeto não reproduz trechos
  longos dele.

## Referência

BEIGUELMAN, Giselle (org.). *Guia dos Arquivos que não Existem: acervos
digitais contra-hegemônicos*. São Paulo: FAU-USP, 2026. DOI
[10.11606/9788580891874](https://doi.org/10.11606/9788580891874).
