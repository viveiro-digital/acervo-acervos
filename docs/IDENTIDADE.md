# Identidade visual — Acervo Acervos

**Ideia:** um acervo de acervos é uma reimpressão. A marca repete a palavra:
"ACERVO" em tinta preta e "ACERVOS" em vermelho, deslocado como num segundo
passe de impressão fora de registro (risografia, serigrafia, offset popular).
A referência é a cultura gráfica impressa, a mesma de muitos acervos do
catálogo, sem citar motivos regionais ou étnicos específicos.

## Cor

| Nome | Hex | Uso |
| --- | --- | --- |
| Papel | `#f3ede2` | Fundo. |
| Papel 2 | `#e9e0cf` | Caixas de destaque. |
| Tinta | `#1c1a17` | Texto e fios (14,9:1 sobre papel). |
| Cinza | `#5a544b` | Texto secundário (6,4:1). |
| Vermelho | `#a8361a` | Marca, numeração e alertas (5,6:1). |
| Azul | `#2340a6` | Foco, notas marginais e marcas de registro (7,6:1). |

A cor nunca é o único sinal: os estados de verificação combinam texto, borda
(cheia, tracejada, pontilhada) e forma do marcador.

## Tipografia

Sem fontes remotas. Pilhas do sistema, nesta ordem:

- **Display** (títulos, navegação, marca): condensada em caixa alta, como
  Avenir Next Condensed, Roboto Condensed ou Arial Narrow.
- **Texto**: serifada de leitura, como Iowan Old Style, Palatino ou Georgia.
- **Ficha / metadados**: monoespaçada, como `ui-monospace`, SF Mono ou Menlo.

Em sistemas sem condensada, a marca cai para uma sans regular. É aceitável,
porque a forma da marca vem da repetição e do deslocamento, não do desenho
das letras.

## Composição

- Página como publicação: fios pretos de 2 px separando seções, listas
  numeradas como sumário (Nº 01, 02…) em vez de grade de cards, e uma coluna de
  ficha à direita no desktop.
- Notas marginais com fio azul para método e contexto.
- Marcas de registro (`+` azul) nos cantos de caixas de amostra.
- Textura de papel feita só com gradientes CSS, sem imagem.

## Imagens

- Não usamos imagens geradas por IA nem imagens de obras dos acervos. O projeto
  descreve e aponta para a fonte.
- Quando a fonte fornece texto alternativo, ele é citado. Quando não fornece,
  o registro diz "descrição ainda não fornecida".
- A imagem de compartilhamento padrão (`public/og-default.png`) é gerada a
  partir de `design/og-default.svg` com `pnpm og`.

## Arquivos

- `public/marca/monograma.svg`: monograma (dois "A" sobrepostos), também usado
  como favicon.
- `design/og-default.svg`: fonte editável da imagem de compartilhamento.
- A marca tipográfica do site é texto vivo (`src/components/Wordmark.astro`),
  acessível e pesquisável.
