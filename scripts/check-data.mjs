#!/usr/bin/env node
// Verificações de consistência que o schema (src/content.config.ts) não cobre.
// Não acessa a rede: valida apenas a sintaxe das URLs.
// Uso: pnpm check:data   (o schema completo é validado por `pnpm build`)
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, basename, resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { YAML } from './_yaml.mjs';

const DIR = 'src/content/acervos';
const today = new Date().toLocaleDateString('sv-SE'); // data local AAAA-MM-DD
const errors = [];
const warnings = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warnings.push(`${f}: ${m}`);

const files = readdirSync(DIR).filter((f) => f.endsWith('.yaml'));

// Checksums das imagens guardadas localmente (integridade dos arquivos próprios).
const SUMS = 'src/assets/acervos/SHA256SUMS';
const sums = new Map(
  existsSync(SUMS)
    ? readFileSync(SUMS, 'utf8').trim().split('\n').filter(Boolean).map((l) => {
        const [hash, name] = l.trim().split(/\s+/);
        return [name, hash];
      })
    : [],
);
const ids = new Map();
const oldIds = new Map();

function urls(obj, path = '') {
  const out = [];
  if (typeof obj === 'string' && /^(https?:|mailto:)/.test(obj)) out.push([path, obj]);
  else if (obj && typeof obj === 'object')
    for (const [k, v] of Object.entries(obj)) out.push(...urls(v, path ? `${path}.${k}` : k));
  return out;
}

for (const f of files) {
  const file = join(DIR, f);
  let r;
  try {
    r = YAML.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    err(file, `YAML inválido — ${e.message.split('\n')[0]}`);
    continue;
  }
  const stem = basename(f, '.yaml');
  if (r.id !== stem) err(file, `id "${r.id}" deve ser igual ao nome do arquivo "${stem}"`);
  if (ids.has(r.id)) err(file, `id duplicado (também em ${ids.get(r.id)})`);
  ids.set(r.id, file);
  for (const o of r.previous_ids ?? []) oldIds.set(o, file);

  for (const [i, m] of (r.media ?? []).entries()) {
    const asset = resolve(dirname(file), m.local_asset ?? '');
    if (!m.local_asset || !existsSync(asset)) {
      err(file, `media[${i}].local_asset não encontrado: ${m.local_asset}`);
      continue;
    }
    const expected = sums.get(basename(asset));
    const actual = createHash('sha256').update(readFileSync(asset)).digest('hex');
    if (!expected) err(file, `media[${i}]: ${basename(asset)} sem checksum em ${SUMS}`);
    else if (expected !== actual) err(file, `media[${i}]: checksum de ${basename(asset)} não confere (arquivo alterado?)`);
    if (!m.license_or_permission) err(file, `media[${i}]: falta license_or_permission`);
  }

  for (const [p, u] of urls(r)) {
    if (u.startsWith('mailto:')) continue;
    try {
      new URL(u);
    } catch {
      err(file, `URL inválida em ${p}: ${u}`);
    }
    if (u.startsWith('http://')) warn(file, `URL sem https em ${p}: ${u}`);
  }

  for (const d of ['created_at', 'updated_at', 'last_verified_at']) {
    if (r[d] && r[d] > today) err(file, `${d} está no futuro (${r[d]})`);
  }
  if (r.record_status === 'publicado') {
    if (r.content_status === 'revisao_pendente')
      err(file, 'registro publicado não pode estar em revisao_pendente; use record_status: rascunho');
    if (r.sample_content_url === r.initiative_url)
      warn(file, 'a amostra é a própria página inicial; prefira um item específico');
  }
  if (r.demo && !String(r.name).startsWith('[DEMO]'))
    err(file, 'registros de demonstração precisam de nome iniciado por "[DEMO]"');
  const log = r.change_log ?? [];
  for (let i = 1; i < log.length; i++)
    if (log[i].date < log[i - 1].date) err(file, 'change_log deve estar em ordem cronológica (append-only)');
  if (log.length && r.updated_at < log.at(-1).date)
    warn(file, 'updated_at é anterior à última entrada do change_log');
}

for (const [o, file] of oldIds)
  if (ids.has(o)) err(file, `previous_ids contém "${o}", que é o id de outro registro`);

for (const w of warnings) console.warn('aviso  ', w);
for (const e of errors) console.error('ERRO   ', e);
console.log(`\n${files.length} registros · ${errors.length} erro(s) · ${warnings.length} aviso(s)`);
process.exit(errors.length ? 1 : 0);
