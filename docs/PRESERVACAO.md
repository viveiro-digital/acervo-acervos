# Preservação, catalogação e política de acervo

Este documento confere Acervo Acervos com referências da comunidade de
preservação digital e de descrição arquivística. Diz o que já atendemos, o que
falta e o que decidimos não fazer. Revisar a cada seis meses ou quando o
catálogo mudar de escala (ver "Ciclo de revisão").

O que preservamos aqui é pequeno: **o catálogo** (fichas YAML, código, decisões)
e **duas imagens licenciadas** guardadas localmente. Os acervos descritos não
são nossos e não são copiados. A preservação deles cabe a quem os mantém; a
nossa parte é registrar com precisão onde estão, o que mostram e quando
verificamos.

## Referências consultadas

| Referência | Para quê | Link |
|---|---|---|
| NDSA Levels of Digital Preservation v2.1 (2026) | autoavaliação por área: armazenamento, integridade, controle, metadados, conteúdo | https://www.ndsa.org/publications/levels-of-digital-preservation/ |
| DPC Rapid Assessment Model (RAM) v3 (2024) | maturidade organizacional, níveis 0–4 | https://www.dpconline.org/digipres/implement-digipres/dpc-ram |
| DPC Digital Preservation Handbook | fixidez, aquisição, manifesto verificável | https://www.dpconline.org/handbook |
| DPC "Novice to Know-How" / "Just One Thing" | dez passos pequenos para quem começa | https://www.dpconline.org/digipres/train-your-staff/n2kh-online-training |
| DCMI Metadata Terms e DCMI Type Vocabulary | exportação interoperável | https://www.dublincore.org/specifications/dublin-core/dcmi-terms/ |
| ISAD(G), 2ª ed. (ICA) | níveis de descrição (fundo, série, dossiê, item) | https://www.ica.org/resource/isadg-general-international-standard-archival-description-second-edition/ |
| The National Archives (UK): elementos de política de acervo | política de coleta e de informação | https://www.nationalarchives.gov.uk/archives-sector/projects-and-programmes/plan-your-collections/ |
| PRONOM / DROID (TNA) | identificação de formato por assinatura (PUID) | https://www.nationalarchives.gov.uk/PRONOM/ |
| Harvard Data Management: convenções de nomes de arquivo | nomes estáveis e legíveis | https://datamanagement.hms.harvard.edu/plan-design/file-naming-conventions |
| BagIt, RFC 8493 | formato de pacote com manifesto de checksums | https://www.rfc-editor.org/rfc/rfc8493 |
| Columbia University Libraries: guidelines for preservable websites | arquivabilidade do próprio site | https://library.columbia.edu/collections/web-archives/guidelines.html |
| Internet Archive: Save Page Now | captura do próprio site | https://help.archive.org/help/save-pages-in-the-wayback-machine/ |
| Lei 13.709/2018 (LGPD) | dados pessoais nas fichas | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm |

A página de arquivabilidade da Stanford (citada na lista original) não
carregou durante a revisão; usamos a da Columbia, que cobre os mesmos pontos.
O guia da comunidade da DRI foi localizado apenas pelo anúncio; não o citamos
como fonte de regras.

## Autoavaliação NDSA Levels v2.1

Nível atingido = todas as ações daquele nível cumpridas. "Parcial" quer dizer
que parte do nível seguinte já existe.

| Área | Nível | O que temos | O que falta para o próximo |
|---|---|---|---|
| Armazenamento | **0 → 1 ao publicar** | Hoje: uma cópia no Mac + histórico Git local. | Nível 1: duas cópias completas em locais separados. Basta fazer push para `viveiro-digital/acervo-acervos` no GitHub (cópia 2). Nível 2: terceira cópia em outro lugar geográfico, por exemplo um espelho em Codeberg ou GitLab, ou um disco externo atualizado mensalmente; documentar onde estão. |
| Integridade | **1, parcial 2** | SHA-256 gerado no recebimento das imagens (`SHA256SUMS`, `MANIFESTO.csv`) e conferido a cada `pnpm check:data`; a exportação gera `export/SHA256SUMS`; o Git verifica a integridade de cada objeto. As fontes não publicam checksums, então registramos `checksum_da_fonte: não fornecido`. | Nível 2: checksums guardados também fora do repositório (vão junto ao anexar a exportação a uma release). Não fazemos varredura de vírus: imagens são baixadas de sites conhecidos por URL direta; anotar isso como risco aceito. |
| Controle | **1** | Quem lê/escreve: só quem mantém o repositório (por enquanto, uma pessoa). | Nível 2: documentar papéis (ver "Papéis e sucessão") e proteger a branch `main` no GitHub. Nível 3: o histórico Git e os logs do GitHub servem de registro de ações. |
| Metadados | **1, parcial 2** | Inventário completo: as fichas YAML + `MANIFESTO.csv` (arquivo, tamanho, formato, origem, licença, registro). Metadados descritivos (schema), de proveniência (`change_log`, `evidence`), técnicos das imagens (manifesto). | Nível 2: cópia do inventário fora do repositório (exportação anexada à release). Nível 3: padrões escolhidos e lacunas mapeadas (este documento + DCMI na exportação). |
| Conteúdo | **1** | Formatos documentados: YAML/Markdown/TS (texto UTF-8), duas imagens JFIF 1.01 (`fmt/43`), identificadas pela assinatura do arquivo. | Nível 2: confirmar com DROID ao adicionar formatos novos. Nível 3: acompanhar obsolescência (baixo risco: só texto e JPEG). |

## Autoavaliação DPC RAM v3

Nível 0 = sem consciência; 1 = consciência; 2 = básico; 3 = gerenciado;
4 = otimizado. Meta realista para um projeto voluntário de uma pessoa: nível 2
em tudo, nível 3 onde é barato.

| Capacidade | Atual | Meta | Comentário |
|---|---|---|---|
| A. Viabilidade organizacional | 1 | 2 | Projeto pessoal sob o guarda-chuva do Viveiro Digital, sem orçamento. Meta: registrar o vínculo e o plano de sucessão. |
| B. Política e estratégia | 1 → 2 | 2 | Este documento é a primeira política escrita. |
| C. Questões legais | 2 | 2 | Licenças conferidas imagem a imagem; nota de LGPD abaixo; canal de remoção em cada ficha. |
| D. Gestão de TI | 2 | 2 | Site estático, sem servidor, dependências fixadas em lockfile. |
| E. Melhoria contínua | 1 | 2 | Ciclo de revisão definido abaixo. |
| F. Comunidade | 1 | 2 | Correções públicas via issues; falta divulgar o projeto à comunidade de arquivos. |
| G. Aquisição, transferência e ingestão | 2 | 2 | Ingestão das imagens com checksum, licença, data e origem registrados (ver "Fixidez"). |
| H. Preservação de bitstream | 1 → 2 | 2 | Registro de ativos + checksums; falta a segunda cópia (push). |
| I. Preservação de conteúdo | 1 | 1 | Formatos estáveis; sem migrações previstas. |
| J. Gestão de metadados | 2 | 3 | Vocabulários controlados, identificadores que não são reutilizados (`previous_ids`), DCMI na exportação. Falta: URIs persistentes (depende do domínio). |
| K. Descoberta e acesso | 2 | 3 | Site acessível, sem rastreamento; notas de conteúdo sensível e protocolos comunitários nas fichas. |

## Política de acervo (curta)

Baseada nos elementos de política de coleta da The National Archives (UK).

- **Por que nós.** Ninguém mantém hoje um índice comparável, em português, de
  acervos digitais latino-americanos de cultura visual, memória comunitária e
  design, lido a partir do que cada acervo efetivamente mostra.
- **O que entra.** Iniciativas que publicam conteúdo próprio na web, com uma
  amostra específica verificável (ver `METODOLOGIA.md`). Recorte geográfico:
  Brasil e América Latina, incluindo iniciativas da diáspora com acervo sobre a
  região. Recorte temporal: qualquer período do conteúdo; a iniciativa precisa
  estar acessível quando verificada.
- **O que não entra.** Repositórios genéricos sem recorte, agregadores que
  apenas repetem outros catálogos, páginas sem conteúdo consultável, acervos
  cujo acesso exige burlar login ou paywall. Casos de fronteira vão para
  `fora-do-catalogo` com o motivo.
- **O que guardamos.** Fichas descritivas e, só com licença explícita,
  imagens de amostra. Nunca copiamos acervos.
- **Saída (desincorporação).** Uma ficha sai quando a iniciativa pede, quando
  some de vez (fica como `inativo_ou_indisponivel`, com a última verificação) ou
  quando descobrimos erro de escopo. O identificador nunca é reutilizado; uma
  ficha renomeada guarda o id antigo em `previous_ids` e gera redirecionamento.

### Política de informação sobre o catálogo

- Cada ficha tem um identificador estável igual ao nome do arquivo.
- Mudanças relevantes vão para `change_log` com data, campo, motivo e fonte.
- Cada afirmação factual tem `evidence` com URL, data de acesso e grau de certeza.
- O nível de descrição da amostra segue a ISAD(G) (`sample.level_of_description`),
  marcando se o nível é o declarado pela fonte ou atribuído por nós.

## Fixidez e ingestão

O DPC Handbook recomenda verificar a fixidez na entrada quando a fonte fornece
checksums e gerá-los quando não fornece, e receber com um manifesto
verificável (nomes, tamanhos, formatos, checksums, declaração de direitos).

Nosso fluxo para cada imagem:

1. Conferir a licença na página da fonte e registrar `license_or_permission`,
   `license_url` e `rights_checked_at` na ficha.
2. Baixar pela URL direta (`scripts/setup-mac.sh`) para `src/assets/acervos/`,
   com nome na convenção abaixo. Registrar `retrieved_at`.
3. Se a fonte publicar checksum, anotá-lo em `source_checksum` e conferir.
4. `pnpm register` gera `MANIFESTO.csv` e `SHA256SUMS`, identificando formato e
   versão pela assinatura (JFIF 1.01 → PRONOM `fmt/43`). Para formatos que o
   script não reconhece, rodar o DROID e anotar o PUID.
5. `pnpm check:data` falha se um arquivo mudar, faltar no manifesto ou fugir
   da convenção de nomes.

Estado atual do manifesto (gerado em 2026-11-22):

| Arquivo | Bytes | Formato | PUID | Dimensões |
|---|---|---|---|---|
| `casca-7647.jpg` | 37 232 | JPEG File Interchange Format 1.01 | fmt/43 | 619 × 800 |
| `diseno-nacional-todo-hombre.jpg` | 297 101 | JPEG File Interchange Format 1.01 | fmt/43 | 946 × 1291 |

Não empacotamos em BagIt: o repositório Git já guarda conteúdo e manifesto
juntos e verifica cada objeto. Se o catálogo for depositado em um repositório
institucional, a exportação (`export/` + `SHA256SUMS`) pode virar uma bag com
`bagit.txt` e `manifest-sha256.txt` sem retrabalho.

## Convenção de nomes de arquivo

Seguindo a orientação de Harvard: nomes curtos, legíveis e estáveis.

- Minúsculas, números e hífens; sem espaços, acentos ou caracteres especiais.
- No máximo 64 caracteres.
- Imagens: `<id-da-ficha>-<identificador-ou-descricao-curta>.<ext>`
  (ex.: `casca-7647.jpg`, onde 7647 é o número do item na fonte).
- Fichas: `<id>.yaml`, com `id` igual ao nome do arquivo.
- Datas, quando entrarem em nomes: `AAAA-MM-DD`.

`pnpm check:data` confere os nomes das imagens.

## Exportação Dublin Core

`pnpm export` gera `export/acervos.dcterms.json` só com fichas publicadas.
Decisões do mapeamento, conferidas com as recomendações do DCMI:

- O recurso descrito é **a coleção digital**, então `dcterms:identifier` é a
  URL da coleção e `dcterms:type` inclui `dcmitype:Collection`, mais os tipos
  DCMI dos formatos (`StillImage`, `Text`, `Sound`, `MovingImage`,
  `PhysicalObject`, `InteractiveResource`). O nosso tipo de iniciativa
  ("arquivo", "museu"…) não é um tipo DCMI e fica em `ficha`.
- `dcterms:format` só recebe tipos MIME (hoje, `application/pdf`).
- `dcterms:temporal` usa intervalo EDTF: `1950/..`, `1840/2000`, `../2026`.
- `dcterms:language` usa códigos BCP 47 (`pt`, `es`).
- A página da amostra vai em `dcterms:hasPart`; a página institucional, quando
  diferente da coleção, em `dcterms:isPartOf`; quem mantém, em `dcterms:publisher`.
- As datas da nossa ficha (criação, atualização, verificação) vão no bloco
  `ficha`, para não serem lidas como datas do acervo.
- Não usamos `dcterms:source`: ele indica um recurso do qual o descrito
  deriva, o que não é o caso.

## Dados pessoais (LGPD)

*Nota de trabalho, não é parecer jurídico.*

- As fichas tratam sobretudo de instituições. Quando citam pessoas
  (fundadoras, produtoras, quem mantém um acervo), usamos o que a própria
  iniciativa tornou público. A LGPD dispensa consentimento para dados tornados
  manifestamente públicos pela pessoa titular, desde que respeitados os seus
  direitos e os princípios da lei (art. 7º, § 4º).
- Minimização (art. 6º, III): não repetimos nomes de pessoas quando a ficha
  funciona sem eles. Em 2026-11-22 tiramos do resumo da amostra do Archivo de
  la Memoria Trans o nome de uma produtora; o nome continua na fonte.
- Dados sensíveis (art. 5º, II, e art. 11): acervos sobre identidade de gênero,
  orientação sexual ou origem étnica não autorizam inferir nada sobre pessoas
  individuais. Não registramos esse tipo de dado sobre ninguém.
- Cada ficha tem `removal_or_contact_url`; pedidos de correção ou remoção são
  atendidos pelo canal público de issues.

## Arquivabilidade do próprio site

Conferido com as orientações da Columbia:

- Todos os links são `<a href>` comuns; o painel de leitura é aprimoramento e
  cada ficha tem página própria funcionando sem JavaScript.
- `robots.txt` não bloqueia CSS nem imagens; `sitemap.xml` lista todas as páginas.
- URLs estáveis com barra final; ids renomeados geram páginas de redirecionamento.
- Codificação UTF-8 declarada na página; sem fontes, scripts ou mídia de terceiros.

Depois de publicar: capturar a página inicial, `/explorar/` e cada ficha no
Internet Archive (Save Page Now, em https://web.archive.org/save) e repetir a
cada versão. Também se pode indicar o site às iniciativas nacionais de
arquivamento da web.

## Papéis e sucessão

| Papel | Quem | Responsabilidade |
|---|---|---|
| Mantenedora | quem mantém o repositório | aceitar mudanças, revisar fichas, rodar `pnpm validate` |
| Curadoria | mantenedora + colaboradoras | propor e revisar fichas segundo `METODOLOGIA.md` |
| Guarda institucional | Viveiro Digital | hospedar o repositório na organização e assumir o projeto se a mantenedora sair |

**Plano de sucessão (uma página).** Se a mantenedora não puder continuar:
(1) o repositório fica na organização Viveiro Digital, com pelo menos duas
pessoas administradoras; (2) a última exportação com checksums é anexada a uma
release; (3) o site pode ser congelado como está (é estático e não depende de
servidor); (4) se ninguém assumir, publicar uma nota no README dizendo a data
da última verificação, para que o catálogo seja lido como registro histórico.

## Ciclo de revisão

- **A cada versão publicada:** `pnpm validate`, `pnpm export`, `pnpm register`,
  captura no Internet Archive.
- **A cada seis meses:** reverificar amostras e links (`last_verified_at`),
  refazer esta autoavaliação, conferir se as licenças das imagens mudaram.
- **Quando passar de ~50 fichas ou de ~20 imagens:** reavaliar armazenamento
  (terceira cópia), varredura de vírus na ingestão e adoção de DROID no fluxo.
