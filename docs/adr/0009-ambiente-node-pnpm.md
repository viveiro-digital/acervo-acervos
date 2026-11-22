# 0009 — Node 26 LTS via nvm e pnpm 10

- **Status:** accepted
- **Data:** 2026-11-21

## Contexto
A auditoria do Mac (docs/ambiente-macos.txt) encontrou Node 22.22.0, abaixo do
`>=22.23.4` exigido pelo Astro 7.4.13. O pnpm global do Node novo era o 9.4,
incompatível com o `node_modules` instalado pelo pnpm 10.

## Decisão
- `nvm use --lts` (Node 26.13.0), registrado em `.nvmrc`.
- `pnpm@10.27.0` (`packageManager`), o gerenciador já presente no repositório e
  nos demais projetos da mantenedora, no lugar do npm sugerido para
  repositório novo.
- `pnpm.supportedArchitectures` inclui linux/arm64 e glibc além da máquina
  atual, para o mesmo `node_modules` rodar em CI e containers Linux.
- `typescript` restrito a `>=5.9 <7` porque o `astro check` ainda não
  suporta TypeScript 7.

## Consequências
Depois de mudar o `package.json` é preciso rodar `pnpm install` para o
lockfile refletir o TypeScript 6 (ver PENDENTES.md).
