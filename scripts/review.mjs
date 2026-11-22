#!/usr/bin/env node
// Fluxo de revisão editorial local, sem backend.
//
//   pnpm review list
//   pnpm review resolve <id> --motivo "o que foi conferido" [--fonte URL]
//   pnpm review flag <id> --motivo "o que conferir" [--prioridade alta|media|baixa]
//
// Edita o YAML do registro e acrescenta uma entrada ao change_log.
// Nada é publicado: revise o diff com `git diff` e faça o commit.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { YAML } from './_yaml.mjs';

const DIR = 'src/content/acervos';
const [cmd, id, ...rest] = process.argv.slice(2);
const opt = (name) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : undefined;
};
// Data local (fuso da máquina), no formato AAAA-MM-DD.
const today = new Date().toLocaleDateString('sv-SE');

function usage(msg) {
  if (msg) console.error(msg);
  console.error('Uso: pnpm review list | resolve <id> --motivo "..." [--fonte URL] | flag <id> --motivo "..." [--prioridade alta|media|baixa]');
  process.exit(1);
}

if (cmd === 'list' || !cmd) {
  for (const f of readdirSync(DIR).filter((f) => f.endsWith('.yaml')).sort()) {
    const r = YAML.parse(readFileSync(join(DIR, f), 'utf8'));
    if (r.review_flag)
      console.log(`[${r.review_priority ?? '—'}] ${r.id} (${r.record_status}, ${r.content_status})\n    ${String(r.review_reason).trim()}`);
  }
  process.exit(0);
}

if (!['resolve', 'flag'].includes(cmd)) usage(`Comando desconhecido: ${cmd}`);
if (!id) usage('Informe o id do registro.');
const motivo = opt('motivo');
if (!motivo) usage('Informe --motivo.');

const file = join(DIR, `${id}.yaml`);
let text;
try {
  text = readFileSync(file, 'utf8');
} catch {
  usage(`Registro não encontrado: ${file}`);
}

// Edição cirúrgica: localiza os nós com o parser e troca só os trechos
// necessários, preservando o resto do arquivo (estilo, quebras, comentários).
const doc = YAML.parseDocument(text);
const top = doc.contents;
const pair = (key) => top.items.find((p) => p.key?.value === key);
const q = (v) => JSON.stringify(String(v));
const edits = []; // [início, fim, texto]
/** Avança até o início da próxima linha. */
const lineEnd = (pos) => (text[pos - 1] === '\n' ? pos : (text.indexOf('\n', pos) + 1 || text.length));

function replaceValue(key, value) {
  const p = pair(key);
  if (p?.value?.range) edits.push([p.value.range[0], p.value.range[1], value]);
  else edits.push([text.length, text.length, `${key}: ${value}\n`]);
}
function removeKey(key) {
  const p = pair(key);
  if (!p) return;
  edits.push([p.key.range[0], lineEnd(p.value.range[1]), '']);
}

const prevFlag = String(doc.get('review_flag') ?? false);
const prevReason = doc.get('review_reason') ? String(doc.get('review_reason')).trim() : null;
if (cmd === 'resolve') {
  replaceValue('review_flag', 'false');
  removeKey('review_reason');
  removeKey('review_priority');
} else {
  const prioridade = opt('prioridade') ?? 'media';
  if (!['alta', 'media', 'baixa'].includes(prioridade)) usage('Prioridade inválida.');
  replaceValue('review_flag', 'true');
  // Remove motivo/prioridade antigos e escreve os novos logo após review_flag.
  removeKey('review_reason');
  removeKey('review_priority');
  const after = lineEnd(pair('review_flag').value.range[1]);
  edits.push([after, after, `review_reason: ${q(motivo)}\nreview_priority: ${prioridade}\n`]);
}
replaceValue('updated_at', q(today));

const fonte = opt('fonte');
const entry =
  `  - date: ${q(today)}\n` +
  `    field: ${cmd === 'resolve' ? 'review_flag' : 'review_flag, review_reason'}\n` +
  `    from: ${q(cmd === 'resolve' || !prevReason ? prevFlag : `${prevFlag}; ${prevReason}`)}\n` +
  `    to: ${q(cmd === 'resolve' ? 'false' : `true; ${motivo}`)}\n` +
  `    reason: ${q(motivo)}\n` +
  (fonte ? `    source: ${q(fonte)}\n` : '');
const log = pair('change_log');
if (!log) usage('Registro sem change_log.');
const at = log.value.range[1];
const prefix = text[at - 1] === '\n' ? '' : '\n';
edits.push([at, at, prefix + entry]);

edits.sort((a, b) => b[0] - a[0] || b[1] - a[1]); // remoções antes de inserções no mesmo ponto
for (const [s, e, t] of edits) text = text.slice(0, s) + t + text.slice(e);

// Garante que o resultado ainda é YAML válido antes de gravar.
YAML.parse(text);
writeFileSync(file, text);
console.log(`${cmd === 'resolve' ? 'Resolvido' : 'Sinalizado'}: ${file}\nConfira com: git diff ${file}`);
