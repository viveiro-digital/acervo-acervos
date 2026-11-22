# Composição da exploração: duas propostas e a decisão

Data: 21/11/2026. As duas propostas usam pranchas neutras (retângulos rotulados),
sem obras inventadas. Arquivos: `docs/composicao/proposta-a-indice-visual.svg` e
`docs/composicao/proposta-b-mosaico.svg`.

## Proposta A: índice visual editorial

Uma entrada por linha. À esquerda fica a imagem licenciada, na proporção
original, ou uma prancha tipográfica quando não há imagem autorizada. À direita
ficam o nome, o território, a descrição e o estado da verificação. Os filtros
ficam numa coluna lateral, recolhida abaixo do conteúdo no celular. O título
abre o registro num painel lateral.

## Proposta B: mosaico com destaques

Colunas em alvenaria, com as imagens em destaque e o contexto escondido até
abrir o item. Os filtros ficam numa barra horizontal.

## Comparação

| Critério | A · índice visual | B · mosaico |
| --- | --- | --- |
| Descoberta | Nome, território, estado e acesso ficam visíveis sem abrir o item, e a busca textual continua útil. | Favorece "passear" pelas imagens, mas o contexto só aparece ao abrir. |
| Legibilidade | Leitura linear, previsível no teclado e no leitor de tela. | A ordem visual difere da ordem do DOM entre as colunas, o que confunde teclado e leitor de tela. |
| Direitos | Com 2 imagens licenciadas entre 12 registros, a prancha tipográfica explica a ausência ao lado do texto. | Com poucas imagens, vira um mosaico de pranchas vazias e pode sugerir que a falta de imagem é falta de conteúdo. |
| Desempenho | Poucas imagens, com `loading="lazy"` fora da dobra e dimensões explícitas (sem CLS). | Alvenaria pede JS ou CSS de colunas, com reflow quando as imagens carregam e risco maior de CLS. |
| Imagens extremas | Altura limitada (`max-height`) sem recorte. Cartaz muito alto ou panorâmica continuam inteiros. | Panorâmicas ficam minúsculas em colunas estreitas, e cartazes altos dominam a coluna. |
| Celular | Uma coluna natural, com a imagem primeiro e o texto logo abaixo. | Uma coluna também, mas sem o contexto. |

## Decisão

**Implementada: A.** Ela mantém a obra como protagonista quando há imagem e
continua honesta quando não há, que é o caso da maioria dos registros hoje. Se o
número de imagens licenciadas crescer muito, B pode virar uma vista
alternativa ("ver como mosaico") sem mudar os dados.

## Navegação contextual: painel ou navegação aprimorada

| Opção | Prós | Contras |
| --- | --- | --- |
| **Painel `<dialog>` com a página canônica** (implementado) | Filtros e rolagem ficam intactos. O `<dialog>` nativo cuida do foco e do Esc. A URL vira a do registro (link copiável), e voltar fecha o painel. Anterior e próximo seguem os resultados filtrados. Sem JS, o link abre a página normal. | Faz um `fetch` da página do registro (HTML pequeno, em cache). Exige CSS global para a página do registro. |
| `ClientRouter` (View Transitions do Astro) | Transição suave entre páginas inteiras e rolagem restaurada ao voltar. | Roteador global em todas as páginas; os scripts da exploração precisariam ser reinicializados a cada navegação; o contexto da lista some durante a leitura do registro. |

Decisão registrada no ADR 0002.

## Critérios de aceitação visual (verificáveis)

1. Com imagem, a mídia ocupa a maior área da entrada: 3/5 da largura na página
   do registro e na home, 2/5 no índice (≥ 40 rem).
2. Nenhuma imagem é recortada nem distorcida (`object-fit: contain`,
   proporção original, `width`/`height` explícitos).
3. Legenda, crédito, licença e link da fonte ficam logo abaixo da imagem, em
   texto.
4. Sem imagem, o registro mantém título, amostra, motivo da ausência e link,
   e continua navegável e pesquisável.
5. A interface funciona com teclado, zoom de 200% e sem JavaScript; as imagens
   abaixo da dobra são carregadas de forma preguiçosa.

Os resultados de cada critério estão em `docs/VALIDACAO.md`.
