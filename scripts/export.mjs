#!/usr/bin/env node
// Exporta o catálogo para export/acervos.json e export/acervos.csv
// (backup legível e portabilidade). Uso: pnpm export
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { YAML } from './_yaml.mjs';

const DIR = 'src/content/acervos';
const records = readdirSync(DIR)
  .filter((f) => f.endsWith('.yaml'))
  .sort()
  .map((f) => YAML.parse(readFileSync(join(DIR, f), 'utf8')));

mkdirSync('export', { recursive: true });
const json = JSON.stringify({ schema_version: 1, exported_at: new Date().toISOString(), records }, null, 2);
writeFileSync('export/acervos.json', json);

const cols = [
  'id', 'name', 'record_status', 'content_status', 'initiative_type', 'country',
  'initiative_url', 'digital_collection_url', 'sample_content_url', 'access_level',
  'stewardship_or_host.type', 'community_evidence.kind', 'last_verified_at', 'updated_at',
];
const get = (o, p) => p.split('.').reduce((a, k) => a?.[k], o);
const cell = (v) => {
  const s = Array.isArray(v) ? v.join('|') : v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
};
const csv = [cols.join(','), ...records.map((r) => cols.map((c) => cell(get(r, c))).join(','))].join('\n') + '\n';
writeFileSync('export/acervos.csv', csv);

const sum = (s) => createHash('sha256').update(s).digest('hex');
writeFileSync('export/SHA256SUMS', `${sum(json)}  acervos.json\n${sum(csv)}  acervos.csv\n`);
console.log(`${records.length} registros exportados em export/ (com SHA256SUMS)`);
