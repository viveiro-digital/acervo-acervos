# 0010. Padrões de preservação e descrição

- Status: accepted
- Data: 2026-11-22
- Complementa: 0003, 0004, 0005

## Contexto

O catálogo foi construído com cuidado de evidência, mas sem conferência
explícita com referências de preservação digital e descrição arquivística.
Uma revisão contra NDSA Levels v2.1, DPC RAM v3, DPC Handbook, ISAD(G), DCMI
Terms, PRONOM, convenções de nomes de Harvard e orientações de arquivabilidade
encontrou quatro problemas: (1) a exportação Dublin Core usava
`dcterms:type` com o nosso vocabulário, `dcterms:source` com sentido errado e
datas da ficha como se fossem do acervo; (2) as imagens não tinham registro de
ativos com formato e tamanho, nem data de obtenção; (3) a amostra não dizia em
que nível de descrição estava; (4) não havia política escrita, papéis nem
plano de sucessão.

## Decisão

- Corrigir a exportação DCMI (tipo DCMI `Collection` + tipos dos formatos,
  MIME em `format`, EDTF em `temporal`, datas da ficha separadas).
- Criar `scripts/asset-register.mjs` e `MANIFESTO.csv` (manifesto verificável,
  com PUID quando identificável pela assinatura) e conferir no `check:data`.
- Adicionar `sample.level_of_description` (ISAD(G) + dois valores próprios) e
  `media[].retrieved_at`/`source_checksum`. `SCHEMA_VERSION` passa a 3.
- Escrever `docs/PRESERVACAO.md` com autoavaliações, política, convenção de
  nomes, LGPD, arquivabilidade e sucessão.

## Alternativas consideradas

- **Adotar METS/PREMIS ou BagIt já.** Desproporcional para 16 fichas e 2
  imagens; o Git já verifica integridade. A exportação pode virar bag depois.
- **Rodar DROID na ingestão.** Exige Java e não acrescenta nada para JPEG;
  fica como passo manual para formatos novos.
- **Usar ISAD(G) completa nas fichas.** Não descrevemos os acervos como
  arquivistas da instituição; só registramos o nível da amostra.

## Consequências

- Exportação mais útil para agregadores; quem lia `dcterms:type` antigo
  precisa ler `ficha.tipo_de_iniciativa`.
- Uma imagem nova exige `pnpm register`, senão `check:data` falha.
- As metas de NDSA nível 1–2 dependem de ações humanas (push, release,
  segunda pessoa administradora), listadas em `PENDENTES.md`.
