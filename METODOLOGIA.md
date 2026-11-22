# Metodologia — Acervo Acervos

Versão pública e navegável em `/metodologia/` (o `/sobre/` é o resumo curto). Este arquivo é a referência para quem
edita os dados.

## Posição

Acervo Acervos é uma interface de descoberta, não um diretório neutro nem um selo.
Toma como lente as três ações propostas por Giselle Beiguelman na introdução do
*Guia dos Arquivos que não Existem* (FAU-USP, 2026, p. 6–9): **fazer aparecer,
fazer ler e fazer relacionar**. Na interface, isso vira:

| Ação | Decisão concreta |
| --- | --- |
| Fazer aparecer | Registrar iniciativas com conteúdo real, inclusive fora de site próprio (Instagram, Google Drive), e deixar visíveis lacunas, pendentes e exclusões com motivo. |
| Fazer ler | Exigir uma amostra específica descrita pela curadoria; separar autodescrição (citada, na língua original) do texto editorial; manter termos originais ao lado do vocabulário de busca. |
| Fazer relacionar | Filtros combináveis, comparação sem ranking e relações entre registros com o motivo explícito (país, tema, tipo de acervo), sem sugerir causalidade. |

O Guia é lido como lente crítica: suas categorias não são aplicadas como
classificação universal.

## Critérios de inclusão

Um registro só é **publicado** quando tem:

1. URL da iniciativa, URL da coleção ou canal, e **URL de uma amostra específica**;
2. resumo do que foi observado na amostra e do que exatamente carregou;
3. regime de acesso, data e método da verificação;
4. quem mantém o acervo, relação documentada com comunidades (ou "desconhecida"),
   direitos segundo a fonte (ou "desconhecido");
5. pelo menos uma evidência com fonte e data.

Fica como **rascunho** (não publicado) quando falta a amostra, quando o
conteúdo está atrás de cadastro ainda não consultado, ou quando só há página
institucional ou post promocional.

Vai para **fora do catálogo** (`src/content/fora-do-catalogo/`) quando foi
verificado e não atende ao recorte ou ao critério de conteúdo, por exemplo um
repositório anunciado para o futuro.

Não é preciso ser independente ou comunitário: é preciso relevância digital e
uma descrição honesta da relação com comunidades e instituições.

## Estados de verificação (`content_status`)

| Estado | Quando usar |
| --- | --- |
| `conteudo_confirmado` | A página individual e o objeto digital foram abertos. `sample.confirmed_media` diz o que foi confirmado (imagem, PDF, player…). |
| `conteudo_parcial` | Há conteúdo acessível, mas a coleção, a mídia ou o acesso é incompleto (miniaturas, original restrito, sem ficha por item, mídia que não carregou). |
| `catalogo_sem_midia_confirmada` | Há metadados, mas nenhuma mídia foi vista. |
| `revisao_pendente` | Promissor, mas precisa de checagem humana. Nunca combinado com `record_status: publicado`. |
| `inativo_ou_indisponivel` | Indisponível com evidência e data. Uma falha temporária não basta; o registro não é apagado. |

## Como verificar uma amostra

1. Abra a página do item em um navegador comum, sem login, salvo quando o
   registro indicar que exige cadastro.
2. Confirme se a mídia **carregou de fato**: imagem decodificada, PDF exibido,
   player tocando. Não basta a página citar um arquivo.
3. Anote o que viu em `sample.observed`, com o que a fonte informa (título,
   data, autoria, direitos, texto alternativo).
4. Registre a evidência: afirmação, URL, data, tipo (`declarado`, `observado`,
   `interpretacao`, `terceiros`) e certeza.
5. Não baixe nem armazene a obra. Não contorne login, paywall ou bloqueio.

Na rodada de 21/11/2026, as verificações foram feitas por um agente de IA, que
abriu as páginas em navegador e conferiu dimensões das imagens e players pelo
DOM. Por isso todos os registros têm `review_flag: true`: **a última revisão
precisa ser humana**.

## Imagens

- Uma imagem só entra (`media`) quando a ficha da fonte declara licença ou
  permissão que autoriza exibir. Registre a licença como texto da fonte, o
  link oficial da licença quando houver, o crédito, a data da checagem e a
  relação com o registro (amostra verificada ou outro item do acervo).
- O arquivo fica em `src/assets/acervos/`, baixado uma vez, sem
  redimensionar, com SHA-256 em `SHA256SUMS`.
- Nada de recorte, ampliação além do tamanho publicado, colagem, capa
  inventada ou imagem gerada por IA.
- Alt: use o da fonte. Se não houver, a curadoria descreve só o que é visível
  e marca `alt_source: curadoria`.
- Material ritual, sagrado, pessoal ou de pessoas identificáveis não vira
  imagem aqui, mesmo com licença, sem protocolo da comunidade ou consentimento.
- Sem imagem, `media_note` explica por quê, e o site mostra uma prancha
  tipográfica.
- Na entrada: registre `retrieved_at` e, se a fonte publicar, `source_checksum`;
  nomeie o arquivo na convenção (minúsculas, hífens, ≤ 64 caracteres) e rode
  `pnpm register`. Fluxo completo em `docs/PRESERVACAO.md`.

## Catalogação (ISDIAH)

A ficha segue a ISDIAH, norma do CIA para descrever instituições com acervos.
Além do que já pedíamos, registre `platform` (software e como foi
identificado), `machine_access` (OAI-PMH, API, exportações que responderam) e
`holdings_extent` (tamanho do acervo, dizendo se foi declarado pela fonte ou
contado por nós). Mapeamento completo e passo a passo em `docs/CATALOGACAO.md`.

## Nível de descrição da amostra

`sample.level_of_description` usa os níveis da ISAD(G): `fundo`, `serie`,
`dossie`, `item`; e dois valores nossos, `pagina-agregada` (página que reúne
vários itens sem ficha própria) e `nao-se-aplica` (a amostra é a página de uma
coleção). `declared_by_source: true` só quando a fonte diz o nível, como em
sistemas AtoM; caso contrário é atribuição da curadoria.

## Linguagem e cuidado

- "Comunitário", "independente", "dissidente", "contra-hegemônico" e "decolonial"
  não são sinônimos. Use só com evidência.
- `stewardship_or_host` (quem mantém) e `community_evidence` (relação com
  comunidades) são campos separados. Uma instituição não é "comunitária" por
  abrigar conteúdo de uma comunidade.
- Não atribua TK Labels ou protocolos em nome de povos. Cite protocolos
  publicados pela fonte em `community_protocol`.
- Material sensível, sagrado, pessoal ou restrito não é reproduzido. Escolha
  amostras que não exponham pessoas ou objetos rituais e descreva o cuidado em
  `sensitive_content_note`.
- Digitalização, acesso público, permissão de reuso e preservação são
  dimensões separadas. Nenhuma é presumida.
- Vínculo da curadoria com uma iniciativa vai em `relationship_disclosure`.
  Esses registros não são destacados na página inicial até passarem por
  revisão independente.
- Registros com `sensitive_content_note` também não entram nos destaques da
  página inicial.
- Iniciativas podem contestar a descrição. A correção entra no `change_log`
  com motivo e fonte, sem identificar quem pediu.

## Atualização e monitoramento

Não há monitoramento automático nesta versão. Se for criado, deve ser local,
respeitar os limites dos sites, não baixar obras e só **gerar um relatório**
(candidatos e estado de URLs) para revisão humana. Ele nunca publica nem altera
registros sozinho.

## Fontes

- BEIGUELMAN, Giselle (org.). *Guia dos Arquivos que não Existem: acervos
  digitais contra-hegemônicos*. São Paulo: FAU-USP, 2026. 131 p. e-ISBN
  978-85-8089-187-4. DOI 10.11606/9788580891874. PDF lido integralmente na
  preparação; páginas citadas nos registros: introdução (p. 6–9), "Decoloniais"
  (p. 45–46), "Queer" (p. 49, 56–57, 60), "Design de interface" (p. 85–86).
