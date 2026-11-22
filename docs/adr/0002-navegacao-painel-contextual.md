# 0002 — Navegação contextual com painel `<dialog>` aprimorado progressivamente

- **Status:** substituído pela navegação em página inteira
- **Data:** 2026-11-21

## Contexto e restrições
Abrir um acervo sem perder busca, filtros e rolagem, mantendo uma URL canônica
por registro, HTML próprio, acesso sem JavaScript, voltar/avançar coerentes e
`prefers-reduced-motion`. Não pode virar SPA obrigatória.

## Decisão
No explorar, o link do registro é um `<a href="/acervos/<id>/">` comum. Com JS,
o clique carrega a página canônica, extrai o `<article data-record>` e o
mostra num `<dialog>` modal nativo:
- `history.pushState` troca a URL pela do registro (link copiável);
- voltar e Esc fecham o painel; avançar o reabre;
- anterior e próximo seguem os resultados filtrados (`replaceState`);
- o foco vai para o título do registro e volta ao link de origem ao fechar;
- a animação só roda com `prefers-reduced-motion: no-preference`.

## Alternativas consideradas
- **`ClientRouter` (View Transitions do Astro)**: transição entre páginas
  inteiras com rolagem restaurada, mas exige um roteador global e a
  reinicialização dos scripts da exploração a cada navegação, e o contexto da
  lista some durante a leitura.
- **Drawer não modal**: deixaria a lista interativa ao fundo, mas complica o
  foco e o leitor de tela.
- **Prefetch**: não adotado. Em dados móveis baixaria páginas que talvez nem
  sejam abertas, e as páginas de registro têm 35–65 KB transferidos.

## Consequências
Os estilos da página do registro precisam ser globais (estão em
`global.css`, sob `.record`). Navegadores sem `<dialog>` seguem o link
normalmente.

## Custo operacional e reversibilidade
Cerca de 120 linhas de TypeScript em `src/pages/explorar.astro`. Remover o
script devolve a navegação comum, sem mudar URLs.
