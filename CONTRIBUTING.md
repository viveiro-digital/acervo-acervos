# Contribuindo com Acervo Acervos

## Preparar o Mac

```sh
nvm install && nvm use            # lê .nvmrc (Node 26.13.0)
npm install -g pnpm@10.27.0       # mesma versão do packageManager
pnpm install
pnpm exec playwright install chromium
```

O `scripts/setup-mac.sh` faz a auditoria do ambiente e grava o resultado em
`docs/ambiente-macos.txt`.

## Comandos de qualidade

```sh
pnpm check        # dados, checksums e tipos
pnpm build
pnpm test:e2e     # Playwright + axe (sobe o preview sozinho)
pnpm validate     # os três acima, em sequência
pnpm audit:lighthouse   # com `pnpm preview` rodando em outra aba
```

## Propor ou revisar um registro

1. Siga "Adicionar, revisar, arquivar" no README e os critérios em `METODOLOGIA.md`.
2. Abra uma amostra específica e descreva só o que viu, com data e fonte.
3. Imagem só com licença declarada pela fonte: guarde em `src/assets/acervos/`,
   acrescente a linha em `SHA256SUMS` (`shasum -a 256 arquivo`) e preencha
   todos os campos de `media`.
4. Revisão: `pnpm review resolve <id> --motivo "..."`.

## Correções, direitos e remoção

Pedidos de correção ou remoção chegam pelas issues do repositório. Remoção
pedida pela iniciativa tem prioridade: `record_status: arquivado` e motivo
no `change_log`. O nome de quem pediu não vai para o registro público.

## Commits e PRs

Mensagens curtas no imperativo, com prefixos como `feat(dados):`, `fix(site):`
ou `docs:`. Um PR por assunto. Os dados e o código podem andar juntos quando a
mudança de schema exigir.

## Propor um ADR

Copie `docs/adr/0000-template.md` quando a decisão tiver consequência
duradoura (stack, dados, imagens, hospedagem, privacidade). Não é preciso
ADR para CSS, correções pequenas ou curadoria.

## Definition of Done

- [ ] `pnpm check` e `pnpm build` sem erros.
- [ ] Cada afirmação nova tem fonte, data e tipo de evidência.
- [ ] Imagens novas têm licença declarada pela fonte, crédito, alt (e origem do
      alt), `retrieved_at`, nome na convenção e entrada no `MANIFESTO.csv`
      (`pnpm register`).
- [ ] Páginas novas têm `h1` único, título, descrição, canonical e funcionam
      com teclado e sem JavaScript.
- [ ] `pnpm test:e2e` passa (incluindo axe).
- [ ] Se uma decisão arquitetural mudou, há ADR novo ou atualizado.
- [ ] README, METODOLOGIA ou PENDENTES atualizados quando o comportamento ou
      a curadoria mudaram.
- [ ] Decisões que envolvem comunidades, autoria, licenças ou remoção tiveram
      revisão humana registrada.
