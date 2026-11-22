# 0006 — Busca e filtros no cliente, sobre o HTML pré-renderizado

- **Status:** accepted
- **Data:** 2026-11-21

## Contexto e restrições
Poucos registros, nenhum serviço pago, conteúdo indexável sem JS e URLs de
filtro copiáveis, mas não indexáveis.

## Decisão
Todos os registros publicados estão no HTML de `/explorar/`, com atributos
`data-*`. O script filtra e ordena no próprio DOM: busca sem acento, facetas
combináveis, parâmetros em ordem fixa na URL e `replaceState`. Só existe uma
URL canônica, `/explorar/`.

## Alternativas consideradas
- **Pagefind**: busca estática excelente para muitos documentos. Reavaliar
  acima de algumas centenas de registros.
- **Algolia e similares**: SaaS, custo e envio de termos de busca a
  terceiros. Rejeitados.

## Consequências
O HTML do explorar cresce linearmente, com ~50 KB para 12 registros. Paginação
fica para quando passar de ~150 registros.
