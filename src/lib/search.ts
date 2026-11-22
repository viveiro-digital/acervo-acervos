const stopWords = new Set([
  'a', 'as', 'o', 'os', 'e', 'de', 'da', 'do', 'das', 'dos', 'em', 'no', 'na',
  'com', 'por', 'para', 'sobre', 'um', 'uma', 'el', 'la', 'los', 'las', 'del',
  'en', 'y', 'con', 'un', 'una',
]);

const equivalentWords = [
  ['cartaz', 'cartazes', 'cartel', 'carteles', 'poster', 'posteres', 'posters'],
  ['fotografia', 'fotografias', 'foto', 'fotos'],
  ['design', 'desenho', 'diseno'],
  ['jornal', 'jornais', 'periodico', 'periodicos'],
  ['arquivo', 'arquivos', 'archivo', 'archivos'],
  ['colecao', 'colecoes', 'coleccion', 'colecciones'],
  ['etnografico', 'etnografica', 'etnograficos', 'etnograficas'],
  ['indigena', 'indigenas'],
];
const equivalents = new Map(equivalentWords.flatMap((group) => group.map((word) => [word, group[0]] as const)));

export function tokenize(text: string): string[] {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}

export function queryTerms(text: string): string[] {
  const words = tokenize(text);
  const meaningful = words.filter((word) => !stopWords.has(word));
  return [...new Set(meaningful.length ? meaningful : words)];
}

interface SearchField {
  weight: number;
  words: Set<string>;
  phrase: string;
}

export function prepareSearch(fields: [number, string][]): SearchField[] {
  return fields.map(([weight, text]) => {
    const words = tokenize(text);
    return { weight, words: new Set(words), phrase: words.join(' ') };
  });
}

function oneEditApart(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let start = 0;
  while (start < a.length && a[start] === b[start]) start++;
  if (a.length === b.length) {
    return a.slice(start + 1) === b.slice(start + 1) ||
      (a[start] === b[start + 1] && a[start + 1] === b[start] &&
        a.slice(start + 2) === b.slice(start + 2));
  }
  const [shorter, longer] = a.length < b.length ? [a, b] : [b, a];
  return shorter.slice(start) === longer.slice(start + 1);
}

export function rankSearch(fields: SearchField[], terms: string[], allowTypos = false): number {
  const phrase = terms.join(' ');
  let score = 0;
  for (const term of terms) {
    let best = 0;
    for (const { weight, words } of fields) {
      if (words.has(term)) {
        best = Math.max(best, 100 + weight);
        continue;
      }
      if (/^\d+$/.test(term)) continue;
      const canonical = equivalents.get(term);
      for (const word of words) {
        if (canonical && equivalents.get(word) === canonical) best = Math.max(best, 70 + weight);
        else if (term.length >= 3 && word.startsWith(term)) best = Math.max(best, 50 + weight);
        else if (allowTypos && term.length >= 5 && word.length >= 4 && oneEditApart(term, word)) {
          best = Math.max(best, 20 + weight);
        }
      }
    }
    if (best === 0) return -1;
    score += best;
  }
  if (terms.length > 1) {
    for (const field of fields) {
      if (field.phrase === phrase) return score + 40 + field.weight;
    }
  }
  return score;
}
