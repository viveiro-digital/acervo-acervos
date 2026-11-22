#!/usr/bin/env node
// Exporta o catálogo para export/acervos.json e export/acervos.csv
// (backup legível e portabilidade). Uso: pnpm export
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { YAML } from './_yaml.mjs';

// rótulos legíveis para dcterms:accessRights (espelha src/data/vocabulario.ts)
const ACCESS = {
  'abre-direto': 'Abre direto', 'exige-cadastro': 'Exige cadastro', 'acesso-parcial': 'Acesso parcial',
  'so-metadados': 'Só metadados', 'player-externo': 'Requer player externo', restrito: 'Restrito',
  'midia-quebrada': 'Mídia quebrada', 'nao-validado': 'Ainda não validado',
};

const DIR = 'src/content/acervos';
const records = readdirSync(DIR)
  .filter((f) => f.endsWith('.yaml'))
  .sort()
  .map((f) => YAML.parse(readFileSync(join(DIR, f), 'utf8')));

mkdirSync('export', { recursive: true });
const json = JSON.stringify({ schema_version: 4, exported_at: new Date().toISOString(), records }, null, 2);
writeFileSync('export/acervos.json', json);

const cols = [
  'id', 'name', 'record_status', 'content_status', 'initiative_type', 'country',
  'initiative_url', 'digital_collection_url', 'sample_content_url', 'access_level',
  'stewardship_or_host.type', 'community_evidence.kind', 'platform.software', 'last_verified_at', 'updated_at',
];
const get = (o, p) => p.split('.').reduce((a, k) => a?.[k], o);
const cell = (v) => {
  const s = Array.isArray(v) ? v.join('|') : v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
};
const csv = [cols.join(','), ...records.map((r) => cols.map((c) => cell(get(r, c))).join(','))].join('\n') + '\n';
writeFileSync('export/acervos.csv', csv);

// Mapeamento para DCMI Metadata Terms (https://www.dublincore.org/specifications/dublin-core/dcmi-terms/).
// É um padrão de EXPORTAÇÃO, não o schema editorial: campos sem equivalente
// ficam de fora e nada é inventado. Cada registro descreve a COLEÇÃO digital
// (o recurso), não a nossa ficha; as datas da ficha vão em `ficha` à parte,
// para não confundir dcterms:created/modified do recurso com as nossas.
const DCMITYPE = 'http://purl.org/dc/dcmitype/';
// formato editorial -> tipo DCMI (https://www.dublincore.org/specifications/dublin-core/dcmi-type-vocabulary/)
const FORMAT_TO_DCMITYPE = {
  imagem: 'StillImage', texto: 'Text', pdf: 'Text', audio: 'Sound', video: 'MovingImage',
  'objeto-fisico-documentado': 'PhysicalObject', 'website-emulado': 'InteractiveResource',
  visualizacao: 'InteractiveResource',
};
// formatos que correspondem a um tipo MIME (dcterms:format pede MIME)
const FORMAT_TO_MIME = { pdf: 'application/pdf' };
// intervalo EDTF nível 1 (ISO 8601-2): "1950/..", "1840/2000", "../2026"
const edtf = (d) => {
  if (!d || (d.start == null && d.end == null)) return undefined;
  return `${d.start ?? '..'}/${d.end ?? '..'}`;
};
const uniq = (a) => {
  const u = [...new Set(a.filter(Boolean))];
  return u.length ? u : undefined;
};

const dc = records
  .filter((r) => r.record_status === 'publicado')
  .map((r) => ({
    'dcterms:identifier': r.digital_collection_url,
    'dcterms:title': r.name,
    'dcterms:alternative': r.alternative_names?.length ? r.alternative_names : undefined,
    'dcterms:description': r.description?.pt,
    'dcterms:type': uniq([`${DCMITYPE}Collection`, ...(r.formats ?? []).map((f) => FORMAT_TO_DCMITYPE[f] && DCMITYPE + FORMAT_TO_DCMITYPE[f])]),
    'dcterms:format': uniq((r.formats ?? []).map((f) => FORMAT_TO_MIME[f])),
    'dcterms:publisher': r.stewardship_or_host?.name || undefined,
    'dcterms:isPartOf': r.initiative_url !== r.digital_collection_url ? r.initiative_url : undefined,
    'dcterms:hasPart': r.sample_content_url,
    'dcterms:spatial': uniq([...(r.country ?? []), r.region, r.city]),
    'dcterms:temporal': edtf(r.date_range),
    'dcterms:language': r.languages,
    'dcterms:subject': uniq([...(r.themes ?? []), ...(r.themes_original ?? [])]),
    'dcterms:rights': r.rights_and_reuse?.statement,
    'dcterms:accessRights': [ACCESS[r.access_level] ?? r.access_level, r.access_requirements].filter(Boolean).join('. ') || undefined,
    'dcterms:provenance': r.provenance_note,
    'dcterms:extent': uniq((r.holdings_extent ?? []).map((e) => `${e.statement} (${e.scope}; ${e.basis}, ${e.accessed_at})`)),
    // Metadados sobre a nossa ficha (não sobre o acervo).
    ficha: {
      id: `acervo-acervos:${r.id}`,
      tipo_de_iniciativa: r.initiative_type,
      nivel_de_descricao_da_amostra: r.sample?.level_of_description?.value,
      plataforma: r.platform?.software,
      acesso_por_maquina: (r.machine_access ?? []).map((m) => ({ tipo: m.kind, url: m.url, status: m.status, verificado_em: m.checked_at })),
      criada_em: r.created_at,
      atualizada_em: r.updated_at,
      verificada_em: r.last_verified_at,
      status_do_conteudo: r.content_status,
    },
  }));
const dcJson = JSON.stringify({ '@context': { dcterms: 'http://purl.org/dc/terms/', dcmitype: DCMITYPE }, records: dc }, null, 2);
writeFileSync('export/acervos.dcterms.json', dcJson);

const sum = (s) => createHash('sha256').update(s).digest('hex');
writeFileSync('export/SHA256SUMS', `${sum(json)}  acervos.json\n${sum(csv)}  acervos.csv\n${sum(dcJson)}  acervos.dcterms.json\n`);
console.log(`${records.length} registros exportados em export/ (JSON, CSV, DCMI Terms e SHA256SUMS)`);
