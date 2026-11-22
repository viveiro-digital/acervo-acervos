#!/usr/bin/env bash
# Acervo Acervos — preparação do ambiente no macOS.
#
# Rode na raiz do projeto:  bash scripts/setup-mac.sh
#
# 1. Audita o ambiente (Node, npm, pnpm, nvm, git, arquitetura) e grava
#    o resultado em docs/ambiente-macos.txt.
# 2. Atualiza o Astro para a versão estável mais recente do registry.
# 3. Instala as ferramentas de qualidade (astro check, Playwright, axe, Lighthouse).
# 4. Baixa SOMENTE as imagens de acervos cuja fonte declara licença que permite
#    exibição (lista em MEDIA abaixo) e grava os checksums SHA-256.
#
# Não apaga nada, não usa sudo e não instala nada globalmente.

set -u
cd "$(dirname "$0")/.."
mkdir -p docs src/assets/acervos
OUT=docs/ambiente-macos.txt

# nvm é uma função de shell: carrega se existir.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

v() { "$@" 2>&1 | head -1; }

{
  echo "# Auditoria do ambiente macOS — $(date '+%Y-%m-%d %H:%M %Z')"
  echo "arquitetura (uname -m): $(uname -m)"
  echo "macOS: $(sw_vers -productVersion 2>/dev/null || echo '?')"
  echo "node: $(v node --version)"
  echo "npm: $(v npm --version)"
  echo "pnpm: $(v pnpm --version)"
  echo "nvm: $(command -v nvm >/dev/null 2>&1 && nvm --version || echo 'não encontrado')"
  echo "git: $(v git --version)"
  echo "astro instalado antes: $(node -p "require('./node_modules/astro/package.json').version" 2>/dev/null || echo 'nenhum')"
  echo "astro latest no registry: $(v pnpm view astro version)"
  echo "astro engines.node (latest): $(v pnpm view astro engines.node)"
} | tee "$OUT"

echo
echo "== Node compatível? =="
REQ=$(pnpm view astro engines.node 2>/dev/null | sed 's/[^0-9.]//g')
NODE_V=$(node --version | sed 's/^v//')
if [ -n "$REQ" ] && [ "$(printf '%s\n%s\n' "$REQ" "$NODE_V" | sort -V | head -1)" = "$REQ" ]; then
  echo "ok: node $NODE_V >= $REQ" | tee -a "$OUT"
  [ -f .nvmrc ] || echo "$NODE_V" > .nvmrc
else
  echo "ATENÇÃO: node $NODE_V não atende $REQ. Use nvm: nvm install --lts && nvm use --lts" | tee -a "$OUT"
  echo "Parando antes de instalar dependências." | tee -a "$OUT"
  exit 1
fi

echo
echo "== Astro (versão estável mais recente) =="
pnpm add astro@latest || { echo "falha ao atualizar o astro" | tee -a "$OUT"; exit 1; }

echo
echo "== Ferramentas de qualidade (devDependencies) =="
pnpm add -D @astrojs/check typescript @playwright/test @axe-core/playwright lighthouse \
  || { echo "falha ao instalar devDependencies" | tee -a "$OUT"; exit 1; }
pnpm exec playwright install chromium

echo
echo "== Imagens com licença declarada pela fonte =="
# formato: arquivo-local|url|página-de-origem
MEDIA=(
  "casca-7647.jpg|https://casca-archive.org/files/fullsize/32/7647/item_0445.jpg|https://casca-archive.org/items/show/7647"
  "diseno-nacional-todo-hombre.jpg|https://www.disenonacional.cl/slides/wp-content/uploads/2023/04/todo_hombre_derecho_1-946x1291.jpg|https://www.disenonacional.cl/todo-hombre-tiene-derecho-a-ser-persona-2/"
)
for m in "${MEDIA[@]}"; do
  IFS='|' read -r file url page <<<"$m"
  if [ -f "src/assets/acervos/$file" ]; then
    echo "já existe: $file"
  else
    curl -fsSL --max-time 60 -A "AcervoAcervos/0.1 (catalogo editorial; contato manual)" \
      -o "src/assets/acervos/$file" "$url" && echo "baixado: $file  ($page)" || echo "FALHOU: $url"
  fi
done
# Fixidez: se já há checksums registrados, CONFERE (não regenera, para não
# aceitar em silêncio um arquivo alterado). Arquivo novo: rode `pnpm register`
# e revise o MANIFESTO.csv antes de commitar (docs/PRESERVACAO.md).
if [ -f src/assets/acervos/SHA256SUMS ]; then
  (cd src/assets/acervos && shasum -a 256 -c SHA256SUMS) || echo "ATENÇÃO: checksum não confere; não substitua o SHA256SUMS sem investigar."
else
  pnpm register
fi

{
  echo
  echo "## Depois da instalação"
  echo "astro: $(node -p "require('./node_modules/astro/package.json').version")"
  echo "@astrojs/check: $(node -p "require('./node_modules/@astrojs/check/package.json').version" 2>/dev/null)"
  echo "typescript: $(node -p "require('./node_modules/typescript/package.json').version" 2>/dev/null)"
  echo "@playwright/test: $(node -p "require('./node_modules/@playwright/test/package.json').version" 2>/dev/null)"
  echo "lighthouse: $(node -p "require('./node_modules/lighthouse/package.json').version" 2>/dev/null)"
  echo ".nvmrc: $(cat .nvmrc 2>/dev/null)"
} | tee -a "$OUT"

echo
echo "Pronto. Pode deixar o resto com o agente."
