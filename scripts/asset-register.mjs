#!/usr/bin/env node
// Registro de ativos digitais (digital asset register / manifesto verificável).
//
// Gera src/assets/acervos/MANIFESTO.csv com, para cada arquivo guardado
// localmente: nome, tamanho, SHA-256, formato (MIME + PUID do PRONOM quando
// identificável pelo cabeçalho), dimensões, origem, licença e registro.
// Segue a recomendação do DPC Handbook de manter uma "verifiable file list"
// com nomes, locais, tamanhos, formatos e checksums.
//
// Uso: pnpm register        (gera/atualiza o manifesto)
//      pnpm check:data       (confere arquivos contra o manifesto)
//
// Identificação de formato: lemos a assinatura do arquivo (SOI + marcador
// JFIF e versão). Não é o DROID; para formatos novos, rode o DROID e
// preencha `puid` manualmente.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, basename, resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { YAML } from './_yaml.mjs';

const ASSETS = 'src/assets/acervos';
const DIR = 'src/content/acervos';
export const MANIFEST = join(ASSETS, 'MANIFESTO.csv');
export const COLUMNS = [
  'arquivo', 'bytes', 'sha256', 'mime', 'puid', 'formato', 'largura', 'altura',
  'registro', 'origem_url', 'pagina_url', 'licenca', 'checksum_da_fonte', 'obtido_em',
];

/** Identifica JPEG/JFIF e PNG pela assinatura. Retorna dimensões quando possível. */
export function identify(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    const i = buf.indexOf(Buffer.from('JFIF\0'));
    const v = i > 0 ? `${buf[i + 5]}.${String(buf[i + 6]).padStart(2, '0')}` : null;
    const puid = { '1.00': 'fmt/42', '1.01': 'fmt/43', '1.02': 'fmt/44' }[v] ?? '';
    // dimensões: procura o marcador SOFn
    let w = '', h = '';
    for (let p = 2; p < buf.length - 9; ) {
      if (buf[p] !== 0xff) { p++; continue; }
      const m = buf[p + 1];
      const len = buf.readUInt16BE(p + 2);
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(m)) {
        h = buf.readUInt16BE(p + 5);
        w = buf.readUInt16BE(p + 7);
        break;
      }
      p += 2 + len;
    }
    return { mime: 'image/jpeg', puid, formato: v ? `JPEG File Interchange Format ${v}` : 'JPEG (sem marcador JFIF)', largura: w, altura: h };
  }
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { mime: 'image/png', puid: '', formato: 'PNG (versão não identificada: rode o DROID)', largura: buf.readUInt32BE(16), altura: buf.readUInt32BE(20) };
  }
  return { mime: 'application/octet-stream', puid: '', formato: 'não identificado (rode o DROID)', largura: '', altura: '' };
}

export const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

const csvCell = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
};

function build() {
  const rows = [];
  for (const f of readdirSync(DIR).filter((x) => x.endsWith('.yaml')).sort()) {
    const file = join(DIR, f);
    const r = YAML.parse(readFileSync(file, 'utf8'));
    for (const m of r.media ?? []) {
      const path = resolve(dirname(file), m.local_asset);
      const buf = readFileSync(path);
      const id = identify(buf);
      rows.push({
        arquivo: basename(path),
        bytes: buf.length,
        sha256: sha256(buf),
        ...id,
        registro: r.id,
        origem_url: m.source_url,
        pagina_url: m.page_url,
        licenca: m.license_or_permission,
        checksum_da_fonte: m.source_checksum ?? 'não fornecido',
        obtido_em: m.retrieved_at ?? m.rights_checked_at,
      });
    }
  }
  return rows.sort((a, b) => a.arquivo.localeCompare(b.arquivo));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const rows = build();
  const csv = [COLUMNS.join(','), ...rows.map((r) => COLUMNS.map((c) => csvCell(r[c])).join(','))].join('\n') + '\n';
  writeFileSync(MANIFEST, csv);
  // SHA256SUMS continua existindo no formato do `shasum -a 256 -c`.
  writeFileSync(join(ASSETS, 'SHA256SUMS'), rows.map((r) => `${r.sha256}  ${r.arquivo}`).join('\n') + '\n');
  console.log(`${rows.length} arquivo(s) no manifesto: ${MANIFEST}`);
  for (const r of rows) console.log(`  ${r.arquivo}  ${r.bytes} B  ${r.mime}  ${r.puid || '(sem PUID)'}  ${r.largura}×${r.altura}`);
}
