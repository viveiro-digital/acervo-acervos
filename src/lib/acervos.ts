import { getCollection, type CollectionEntry } from 'astro:content';
import * as V from '../data/vocabulario';

export type Acervo = CollectionEntry<'acervos'>['data'];

/** Todos os registros, inclusive rascunhos (uso interno: revisão). */
export async function getAll(): Promise<Acervo[]> {
  const entries = await getCollection('acervos');
  return entries.map((e) => e.data).sort((a, b) => a.name.localeCompare(b.name, 'pt'));
}

/** Somente registros publicados e não demonstrativos. */
export async function getPublished(): Promise<Acervo[]> {
  return (await getAll()).filter((r) => r.record_status === 'publicado' && !r.demo);
}

/**
 * Amostras que podem ser destacadas na página inicial: conteúdo confirmado,
 * sem nota de conteúdo sensível e sem conflito de interesse declarado.
 */
export function isFeaturable(r: Acervo): boolean {
  return (
    r.content_status === 'conteudo_confirmado' &&
    !r.sensitive_content_note &&
    !r.relationship_disclosure
  );
}

/** Data ISO mais recente entre os registros (para "atualizado em"). */
export function lastUpdate(records: Acervo[]): string {
  return records.map((r) => r.updated_at).sort().at(-1) ?? '';
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Faixas de período usadas no filtro. */
export const periodBuckets = [
  { key: 'ate-1899', label: 'Até 1899', from: -Infinity, to: 1899 },
  { key: '1900-1949', label: '1900–1949', from: 1900, to: 1949 },
  { key: '1950-1999', label: '1950–1999', from: 1950, to: 1999 },
  { key: '2000-hoje', label: '2000 até hoje', from: 2000, to: Infinity },
  { key: 'nao-informado', label: 'Não informado', from: NaN, to: NaN },
] as const;

export function periodKeys(r: Acervo): string[] {
  const { start, end } = r.date_range;
  if (start === null && end === null) return ['nao-informado'];
  const s = start ?? -Infinity;
  const e = end ?? Infinity;
  return periodBuckets
    .filter((b) => b.key !== 'nao-informado' && s <= b.to && e >= b.from)
    .map((b) => b.key);
}

/** Texto normalizado para busca (sem acento, minúsculo). */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function searchText(r: Acervo): string {
  return normalize(
    [
      r.name,
      r.preferred_name,
      ...r.alternative_names,
      r.description.pt,
      r.self_description?.text,
      r.region,
      r.city,
      r.territory_note,
      ...r.country.map((c) => V.label(V.countries, c)),
      ...r.themes.map((t) => V.label(V.themes, t)),
      ...r.themes_original,
      ...r.collection_types.map((t) => V.label(V.collectionTypes, t)),
      ...r.collection_types_original,
      r.sample.title,
      r.platform?.software,
      ...r.machine_access.map((m) => m.kind),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

export interface Relation {
  record: Acervo;
  reasons: string[];
}

/**
 * Registros relacionados por território, tema, tipo de acervo ou formato.
 * Cada vínculo explicita a razão; nenhuma causalidade é sugerida.
 */
export function related(r: Acervo, all: Acervo[], max = 4): Relation[] {
  const out: (Relation & { score: number })[] = [];
  for (const o of all) {
    if (o.id === r.id) continue;
    const reasons: string[] = [];
    let score = 0;
    const sharedCountries = o.country.filter((c) => r.country.includes(c) && c !== 'LATAM');
    if (sharedCountries.length) {
      reasons.push(`mesmo país: ${sharedCountries.map((c) => V.label(V.countries, c)).join(', ')}`);
      score += 1;
    }
    const sharedThemes = o.themes.filter((t) => r.themes.includes(t));
    if (sharedThemes.length) {
      reasons.push(`tema em comum: ${sharedThemes.map((t) => V.label(V.themes, t)).join(', ')}`);
      score += 2 * sharedThemes.length;
    }
    const sharedTypes = o.collection_types.filter((t) => r.collection_types.includes(t));
    if (sharedTypes.length) {
      reasons.push(
        `tipo de acervo em comum: ${sharedTypes.map((t) => V.label(V.collectionTypes, t)).join(', ')}`,
      );
      score += 2 * sharedTypes.length;
    }
    if (score >= 2) out.push({ record: o, reasons, score });
  }
  return out
    .sort((a, b) => b.score - a.score || a.record.name.localeCompare(b.record.name, 'pt'))
    .slice(0, max)
    .map(({ record, reasons }) => ({ record, reasons }));
}

/** Contagem de valores de uma faceta entre os registros. */
export function facetCounts(
  records: Acervo[],
  pick: (r: Acervo) => string[],
): Map<string, number> {
  const m = new Map<string, number>();
  for (const r of records) for (const k of new Set(pick(r))) m.set(k, (m.get(k) ?? 0) + 1);
  return m;
}

export function recordPath(id: string): string {
  return `/acervos/${id}/`;
}

/**
 * Controle da descrição (ISDIAH 5.6). Regras e idioma valem para todo o
 * catálogo; o nível de detalhe (5.6.5) é calculado a partir dos campos
 * preenchidos, para não depender de alguém lembrar de atualizá-lo.
 */
export const descriptionControl = {
  rules:
    'ISDIAH (CIA, 1ª ed., 2008), adaptada; nível da amostra pela ISAD(G) 2ª ed.; datas em ISO 8601 e EDTF; línguas em BCP 47; método em /metodologia/.',
  language: 'Português (por-Latn)',
} as const;

export type LevelOfDetail = 'minimo' | 'parcial' | 'completo';
export const levelOfDetailLabels: Record<LevelOfDetail, string> = {
  minimo: 'Mínimo',
  parcial: 'Parcial',
  completo: 'Completo',
};

/** O que falta para a descrição ser "completa" no nosso recorte da ISDIAH. */
export function missingForFull(r: Acervo): string[] {
  const miss: string[] = [];
  if (!r.platform) miss.push('plataforma');
  if (r.holdings_extent.length === 0) miss.push('extensão do acervo');
  if (!r.stewardship_or_host.name) miss.push('quem mantém');
  if (r.rights_and_reuse.statement === 'desconhecido') miss.push('direitos e reuso');
  if (r.date_range.start == null && r.date_range.end == null) miss.push('período');
  if (r.evidence.length < 3) miss.push('ao menos três evidências');
  return miss;
}

export function levelOfDetail(r: Acervo): LevelOfDetail {
  // Mínimo ISDIAH (4.7): identificador, nome autorizado e localização.
  const base = Boolean(r.id && r.name && r.country.length);
  if (!base) return 'minimo';
  return missingForFull(r).length === 0 ? 'completo' : 'parcial';
}

export const extentBasisLabels: Record<Acervo['holdings_extent'][number]['basis'], string> = {
  'declarado-pela-fonte': 'declarado pela fonte',
  'contado-via-api': 'contado por nós na API da fonte',
  'contado-na-pagina': 'contado por nós na página da fonte',
};
export const machineAccessLabels: Record<Acervo['machine_access'][number]['kind'], string> = {
  'oai-pmh': 'OAI-PMH',
  'api-rest': 'API REST',
  'exportacao-dublin-core': 'Exportação Dublin Core',
  'exportacao-json': 'Exportação JSON',
  sitemap: 'Sitemap',
};
export const machineStatusLabels: Record<Acervo['machine_access'][number]['status'], string> = {
  'testado-com-registros': 'testado, devolve registros',
  'testado-sem-registros': 'responde, mas sem registros públicos',
  'oferecido-nao-testado': 'oferecido pelo site, não testado',
};
