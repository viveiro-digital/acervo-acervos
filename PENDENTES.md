# Pendências

## O que precisa de você (técnico)

1. **`pnpm install`** no Mac, para o lockfile refletir `typescript >=5.9 <7`
   (o `astro check` não suporta TS 7). Sem isso, o CI com `--frozen-lockfile`
   falha.
2. **`git restore .github`** (ou `git checkout -- .github`): o workflow de CI
   está no commit, mas o macOS bloqueou a escrita dessa pasta pelas
   ferramentas remotas.
3. **`pnpm validate`**: roda a suíte `tests/e2e/` de verdade (o agente rodou
   verificações equivalentes, mas não a suíte em si).
4. **`pnpm build && pnpm preview`** e, em outra aba, **`pnpm audit:lighthouse`**:
   anote os números em `docs/VALIDACAO.md`.
5. Teste com **VoiceOver** (Safari): painel, filtros e uma página de registro.
6. Publicar o repositório em `github.com/viveiro-digital/acervo-acervos`. O
   link de correções e o de código do site apontam para lá.
7. Decidir domínio (`SITE_URL`) e hospedagem (ADR 0007, status proposed).
8. Preservação (detalhes em `docs/PRESERVACAO.md`): o push do passo 6 cria a
   segunda cópia (NDSA nível 1 em armazenamento). Depois: proteger `main`,
   ter duas pessoas administradoras na organização (plano de sucessão),
   anexar `pnpm export` a uma release e capturar o site no Internet Archive
   quando ele estiver no ar.

# Registros não verificados ou pendentes

Atualizado em 21/11/2026. A lista viva está em `/revisao/` (rodando `pnpm dev`)
e em `pnpm review list`.

## Todos os registros

Todos os 16 registros têm `review_flag: true`, porque a primeira verificação foi
feita por agente de IA e precisa de revisão humana. Prioridade alta:

| Registro | Motivo |
| --- | --- |
| `biblioteca-de-zines` | Conflito de interesse declarado: a pessoa que mantém o projeto também contribui com a Biblioteca. Precisa de revisão independente antes de ser destacado. |
| `museu-kuahi` | Confirmar quem mantém o museu e se há protocolo comunitário para objetos rituais publicados no acervo. |
| `xingu-entangled` | O vídeo de introdução não carregou; ler créditos e parcerias (participação Kuikuro). |

## Rascunhos (não publicados)

| Registro | Situação | O que falta |
| --- | --- | --- |
| `acervo-bajuba` | Site sem navegação por itens; Instagram abre parcialmente sem login. A amostra atual é um post institucional. | Encontrar post, destaque ou coleção com itens do acervo. |
| `arquivo-lesbico-brasileiro` | Acervo em área restrita, com cadastro e reprodução vedada. | Alguém da curadoria se cadastrar e confirmar uma amostra, respeitando as regras. |
| `armazem-memoria` | O leitor de documentos abriu, mas nenhuma página foi exibida. | Abrir um documento e registrar a amostra. |
| `mutha` | Coleções listadas; nenhum item aberto. | Abrir uma coleção e registrar a amostra. |

## Publicados com lacunas relevantes

- `tipomap-latam`: `catalogo_sem_midia_confirmada`; verificar se a Galería tem espécimes.
- `acervo-da-laje`: sem ficha individual por obra identificada na galeria virtual.
- `irohin`, `diseno-nacional`, `cartel-mexico`, `grafica-latina`, `mexico-disena`: mantenedor não identificado.
- `archivo-memoria-trans`: originais digitais não públicos (cópia sob pedido); política de imagens de pessoas não lida.

## Imagens

Só 2 registros publicados têm imagem (CASCA, CC0; Diseño Nacional, CC BY-NC).
Para os demais, o caminho é pedir autorização a cada iniciativa ou encontrar
itens com licença declarada. Não use hotlink.

## Fora do catálogo (verificados e não incluídos)

- Centro de Documentação de Línguas e Culturas Indígenas: repositório anunciado para o futuro.
- Queer Zine Archive Project: fora do recorte geográfico, até onde sabemos; não verificado.

## Referências do planejamento ainda não verificadas

Museu Afro Digital (UFBA), Casa Sueli Carneiro, MUMA (Museo de Mujeres
Artistas), Arquigrafia e outras iniciativas latino-americanas citadas no Guia.
