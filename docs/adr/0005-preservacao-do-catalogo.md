# 0005 — Preservação: do catálogo sim, dos acervos externos não

- **Status:** accepted
- **Data:** 2026-11-21

## Contexto e restrições
É preciso distinguir a preservação dos dados deste projeto da preservação dos
acervos de origem, sem afirmar preservação de longo prazo sem processo e
evidência.

## Decisão
- **Catálogo**: formatos legíveis (YAML, JSON, CSV), schema versionado,
  histórico Git, `pnpm export` com SHA-256 e checagem de integridade das
  imagens próprias no `check:data`.
- **Acervos externos**: só links, contexto e evidência datada. Sem captura,
  espelhamento ou fixidez.

## Alternativas consideradas
- **BagIt**: adequado para empacotar remessas de arquivos com manifestos, mas o
  v1 não guarda obras. Os `SHA256SUMS` já cobrem os 2 arquivos próprios.
  Reavaliar se houver guarda autorizada de objetos.
- **Archivematica**: sistema completo de preservação, desproporcional sem
  acervo próprio sob guarda.
- **Serviços de arquivo da web (ex. Internet Archive)**: só com direitos,
  consentimento e protocolos compatíveis. Não usados.

## Consequências
Backup e restauração: o repositório Git é a fonte, e o `export/` serve de
cópia legível. O site não sugere que monitorar um link preserve o acervo.
