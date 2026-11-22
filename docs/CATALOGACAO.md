# Catalogação: o modelo de dados e a ISDIAH

Cada ficha de Acervo Acervos descreve uma **iniciativa que mantém um acervo
digital**. A norma do Conselho Internacional de Arquivos para esse tipo de
descrição é a **ISDIAH** (*International Standard for Describing Institutions
with Archival Holdings*, 1ª ed., 2008), a mesma usada no modelo de instituições
do AtoM. Ela é a referência principal da nossa catalogação; a ISAD(G) entra só
para o nível de descrição da amostra, e o Dublin Core só na exportação.

Fonte: ICA, ISDIAH 1ª ed. (cópia em https://www.archives.go.jp/thinktank/pdf/ISDIAH_EN.pdf;
página do CIA em https://www.ica.org/en/isdiah-international-standard-describing-institutions-archival-holdings).
O CIA prepara o RiC-CM (*Records in Context*) para substituir as quatro normas;
quando houver versão estável, revisar este mapeamento.

## Mapeamento

Obrigatórios na ISDIAH (seção 4.7): 5.1.1, 5.1.2 e 5.2.1. Atendemos os três.

| ISDIAH | Elemento | Campo em Acervo Acervos | Situação |
|---|---|---|---|
| 5.1.1 | Identificador | `id` (nunca reutilizado; `previous_ids`) | atende, com identificador nosso |
| 5.1.2 | Forma autorizada do nome | `name` | atende |
| 5.1.3 | Formas paralelas | `preferred_name`, `alternative_names` | atende |
| 5.1.4 | Outras formas | `alternative_names` | atende |
| 5.1.5 | Tipo de instituição | `initiative_type` (vocabulário controlado) | atende |
| 5.2.1 | Localização e endereço | `country`, `region`, `city`, `territory_note`, `initiative_url` | atende (endereço web; endereço físico não registramos) |
| 5.2.2 | Telefone, e-mail | `removal_or_contact_url` | parcial, de propósito |
| 5.2.3 | Pessoas de contato | — | não registramos (minimização, LGPD) |
| 5.3.1 | História | `description`, `self_description` | parcial |
| 5.3.2 | Contexto geográfico e cultural | `geographic_scope`, `territory_note`, `community_evidence` | atende |
| 5.3.3 | Mandato / fontes de autoridade | `stewardship_or_host` | parcial |
| 5.3.4 | Estrutura administrativa | `stewardship_or_host.note` | parcial |
| 5.3.5 | Políticas de gestão e de coleta | `curatorial_reason`, `provenance_note` | parcial |
| 5.3.6 | Edifício(s) | — | fora do escopo (acervos digitais) |
| 5.3.7 | Acervos | `collection_types`, `formats`, `themes`, `date_range`, **`holdings_extent`** | atende desde o schema v4 |
| 5.3.8 | Instrumentos de pesquisa, guias, publicações | **`platform`**, **`machine_access`**, `sample` | atende desde o schema v4 |
| 5.4.1 | Horário | — | fora do escopo |
| 5.4.2 | Condições de acesso e uso | `access_level`, `access_requirements`, `rights_and_reuse`, `community_protocol` | atende |
| 5.4.3 | Acessibilidade | `access_notes` | parcial |
| 5.5.x | Serviços | — | fora do escopo |
| 5.6.1 | Identificador da descrição | `acervo-acervos:<id>` na exportação | atende |
| 5.6.2 | Identificador da instituição | — | pendente (ISIL ou Wikidata, quando verificados) |
| 5.6.3 | Regras ou convenções | constante do site, exibida em cada registro | atende |
| 5.6.4 | Status | `record_status`, `content_status` | atende |
| 5.6.5 | Nível de detalhe | calculado (`levelOfDetail` em `src/lib/acervos.ts`) | atende |
| 5.6.6 | Datas de criação e revisão | `created_at`, `updated_at`, `last_verified_at` | atende |
| 5.6.7 | Língua e escrita | constante: português, alfabeto latino | atende |
| 5.6.8 | Fontes | `evidence` (URL + data de consulta) | atende |
| 5.6.9 | Notas de manutenção | `change_log` | atende |

## O que os campos novos registram

**`holdings_extent`** — quanto o acervo tem, sempre com a base:
`declarado-pela-fonte` (a frase do site, entre aspas quando citada),
`contado-via-api` (número que a API pública da fonte informa) ou
`contado-na-pagina` (contagem nossa, por exemplo no sitemap). Extensões não são
comparáveis entre fontes (itens, páginas, documentos, posts) e o site diz isso.

**`platform`** — o software que publica o acervo e como foi identificado:
`meta-generator` (a página declara), `api-da-plataforma` (a API informa),
`caminhos-de-arquivos` (pastas típicas do software) ou `canal-declarado`
(rede social). Serve para quem pesquisa saber se dá para coletar metadados e
quais limites esperar.

**`machine_access`** — pontos de acesso por máquina que testamos: OAI-PMH,
API REST, exportação Dublin Core ou JSON, sitemap. O status diz se devolveu
registros, se respondeu sem registros ou se só está oferecido na página.

## Verificação de 22/11/2026

Feita no navegador, com requisições ao próprio domínio de cada site:
`meta[name=generator]`, caminhos de arquivos, `/wp-json/`,
`/wp-json/tainacan/v2/collections` e `/oai`, `/api/site` do Omeka e os
caminhos padrão de OAI-PMH.

| Registro | Plataforma | Acesso por máquina | Extensão |
|---|---|---|---|
| CASCA | Omeka Classic 3.2 | API REST; Dublin Core oferecido | 8.185 itens (declarado); Cordel: 6.365 (API) |
| Diseño Nacional | WordPress | API do WordPress | 4.615 posts; 62 em carteles políticos (API) |
| Ìrohìn | WordPress + Tainacan | OAI-PMH responde sem registros | — |
| Museu Kuahí | WordPress + Tainacan | OAI-PMH (1.541) e API | 429 itens no acervo etnográfico (declarado na página) |
| Acervo da Laje | Wix | — | 300 + 311 obras arroladas (declarado) |
| Biblioteca de Zines | Next.js | sitemap | 364 zines no sitemap (contado) |
| Cartel México | WordPress 6.6 | — | — |
| Gráfica Latina | Readymag | — | — |
| México Diseña | WordPress | API com tipos próprios | 8 publicações, 4 pessoas, 3 coleções, 2 projetos (API) |
| TipoMap Latam | sistema próprio | — | 924 fichas no nó BR (declarado) |
| Xingu Entangled | wanderer, em GitHub Pages | — | — |
| Archivo de la Memoria Trans | AtoM | OAI-PMH não encontrado | mais de 15.000 documentos (declarado) |
| Arquivo Lésbico Brasileiro (rascunho) | WordPress + Tainacan | API | — |
| MUTHA (rascunho) | WordPress + Tainacan | OAI-PMH (397) e API | — |
| Armazém Memória (rascunho) | WordPress (Divi) | — | 30 conjuntos com contagem de páginas (declarado) |
| Acervo Bajubá (rascunho) | Instagram | — | — |

"—" quer dizer que não encontramos, não que não exista.

## Como preencher numa ficha nova

1. Abra o site e procure o software (rodapé, `generator`, pastas `wp-content`,
   `/api/site` no Omeka, `tainacan` no WordPress, `arDominion` no AtoM).
2. Teste o OAI-PMH e a API no próprio domínio. Registre só o que respondeu.
3. Procure uma frase da fonte sobre o tamanho do acervo. Se não houver e a API
   informar um total, registre como `contado-via-api` com a URL usada.
4. Nunca some contagens de conjuntos diferentes para criar um total.
