# 0004 — Imagens só com licença declarada pela fonte, guardadas localmente

- **Status:** accepted
- **Data:** 2026-11-21

## Contexto e restrições
O design é image-first, mas nenhuma obra pode ser exibida sem base legítima,
cortada ou alterada, e não se pode usar imagem gerada por IA nem baixar em
massa.

## Decisão
- Uma imagem entra no campo `media` somente quando a ficha da fonte declara
  licença ou permissão que autoriza exibir (hoje: CASCA #7647, CC0; Diseño
  Nacional, CC BY-NC, compatível com o uso não comercial deste projeto).
- O download é manual e único (`scripts/setup-mac.sh`), com SHA-256 em
  `src/assets/acervos/SHA256SUMS`, conferido por `pnpm check:data`.
- As imagens de obras em `media` são evidência preservada no repositório.
  O build do site não publica esses arquivos. As notas descrevem o que foi
  consultado e remetem à amostra na fonte.
- A imagem de compartilhamento (OG) usa as prévias de coleção do projeto.

## Prévias da página inicial

A grade inicial usa a imagem social indicada pela própria fonte, uma imagem
publicada na página da coleção ou uma captura da interface pública. O manifesto
`src/data/collection-previews.json` registra a origem de cada prévia. A prévia
abre a página correspondente.

## Alternativas consideradas
- **Hotlink das imagens das fontes**: depende da política de cada site, expõe
  quem visita a terceiros e não garante o direito de exibição.
- **Pedir autorização a cada acervo**: é o caminho para ampliar o conjunto,
  mas fica para depois do v1.
