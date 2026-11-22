# 0011. Catalogação pela ISDIAH

- Status: accepted
- Data: 2026-11-22
- Complementa: 0003, 0010

## Contexto

As fichas descrevem iniciativas que mantêm acervos, mas o modelo foi
desenhado sem uma norma de descrição de instituições. A ISDIAH (CIA, 2008) é
essa norma. Comparando campo a campo, faltavam a extensão do acervo (5.3.7),
os instrumentos de pesquisa e o acesso por máquina (5.3.8) e a área de
controle da descrição (5.6: regras, nível de detalhe, língua).

## Decisão

- Usar a ISDIAH como referência da catalogação, documentada em
  `docs/CATALOGACAO.md` com o mapeamento elemento a elemento.
- Schema v4: `platform`, `machine_access` e `holdings_extent`, sempre com data
  e base (declarado pela fonte ou contado por nós).
- Área de controle exibida em cada registro: regras, língua e nível de
  detalhe calculado a partir dos campos preenchidos.
- Não registrar pessoas de contato, endereço físico, horários nem serviços
  presenciais: fora do escopo de acervos digitais e contra a minimização.

## Alternativas consideradas

- **Adotar o RiC-CM.** Ainda sem implementação estável nas ferramentas usadas
  pelos acervos que descrevemos (AtoM, Tainacan, Omeka).
- **Gravar o nível de detalhe na ficha.** Ficaria desatualizado; calcular é
  mais confiável.
- **Somar contagens para um total por acervo.** Seria um número que nenhuma
  fonte afirma.

## Consequências

- Pesquisadoras sabem que plataforma cada acervo usa e se há OAI-PMH ou API.
- Extensões e plataformas mudam: entram na reverificação semestral.
- Falta o identificador externo da instituição (5.6.2); fica em pendências.
