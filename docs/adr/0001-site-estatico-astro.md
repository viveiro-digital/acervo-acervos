# 0001 — Site estático em Astro, sem backend

- **Status:** accepted
- **Data:** 2026-11-21

## Contexto e restrições
Catálogo editorial pequeno, com teto de hospedagem de R$ 0/mês, sem dados
pessoais, com revisão local antes de publicar e preferência por tecnologia
portável e de baixa manutenção.

## Decisão
Astro 7.4.13 (a versão estável mais recente no registry em 21/11/2026), com
saída estática (`output: static`), Content Collections para os dados e páginas
pré-renderizadas por registro. Nenhum framework de UI (React, Vue), nenhum
backend e nenhuma integração além do próprio Astro.

## Alternativas consideradas
- **Eleventy / Hugo**: também estáticos, mas sem validação de schema integrada
  nem o pipeline `astro:assets`, que gera AVIF/WebP com dimensões.
- **Next.js / SvelteKit**: mais JavaScript no cliente e hospedagem que tende ao
  servidor; desproporcional ao escopo.
- **`@astrojs/sitemap`**: integração oficial, mas o endpoint próprio
  (`src/pages/sitemap.xml.ts`) tem menos de 30 linhas, inclui `lastmod` dos
  registros e exclui rascunhos sem configuração extra. Reavaliar se o site
  passar de algumas centenas de páginas.

## Consequências
HTML completo sem JavaScript. JS só no explorar (filtros e painel) e no
comparar. O build valida o schema e falha com o arquivo e o campo do erro.

## Custo operacional e reversibilidade
Baixo. O conteúdo é YAML independente do Astro, e trocar de gerador não exige
migrar dados.

## Fontes
`node_modules/astro/package.json` (engines `node >=22.23.4`) e a auditoria em
`docs/ambiente-macos.txt`.
