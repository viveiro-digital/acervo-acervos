import { prepareSearch, queryTerms, rankSearch } from './search';

const PARAMS = ['q', 'ordem', 'pais', 'tema', 'tipo', 'formato', 'lingua', 'periodo', 'acesso', 'status', 'relacao', 'host'];
const FACETS = PARAMS.filter((p) => p !== 'q' && p !== 'ordem');

const form = document.getElementById('filtros') as HTMLFormElement;
const list = document.getElementById('lista') as HTMLUListElement;
const items = Array.from(list.querySelectorAll<HTMLLIElement>(':scope > li'));
const count = document.getElementById('contagem')!;
const empty = document.getElementById('vazio')!;
const chips = document.getElementById('chips')!;

const searchIndex = new Map(items.map((item) => [item, prepareSearch(JSON.parse(item.dataset.search ?? '[]'))]));

function readUrl() {
  const u = new URLSearchParams(location.search);
  for (const p of PARAMS) {
    const el = form.elements.namedItem(p) as HTMLInputElement | HTMLSelectElement | null;
    if (!el) continue;
    const v = u.get(p) ?? '';
    if (el instanceof HTMLSelectElement && v && !Array.from(el.options).some((o) => o.value === v)) {
      el.value = '';
    } else {
      el.value = v;
    }
  }
}

function state() {
  const s: Record<string, string> = {};
  for (const p of PARAMS) {
    const el = form.elements.namedItem(p) as HTMLInputElement | HTMLSelectElement | null;
    if (el && el.value.trim()) s[p] = el.value.trim();
  }
  return s;
}

function writeUrl(s: Record<string, string>) {
  const u = new URLSearchParams();
  // ordem determinística dos parâmetros
  for (const p of PARAMS) if (s[p]) u.set(p, s[p]);
  const qs = u.toString();
  const path = location.pathname + (qs ? `?${qs}` : '') + location.hash;
  if (path !== location.pathname + location.search + location.hash) history.replaceState(null, '', path);
}

let searchTimer: number | undefined;

function apply() {
  clearTimeout(searchTimer);
  const s = state();
  const terms = queryTerms(s.q ?? '');
  const candidates = items.filter((item) =>
    FACETS.every((facet) => !s[facet] || (item.dataset[facet] ?? '').split(' ').includes(s[facet])),
  );
  const scored = new Map<HTMLLIElement, number>();
  const rank = (allowTypos: boolean) => {
    for (const item of candidates) {
      const score = rankSearch(searchIndex.get(item) ?? [], terms, allowTypos);
      if (score >= 0) scored.set(item, score);
    }
  };
  rank(false);
  if (terms.length && !scored.size) rank(true);
  for (const item of items) item.hidden = !scored.has(item);
  const ordem = s.ordem ?? (s.q ? 'relevancia' : FACETS.some((facet) => s[facet]) ? 'nome' : 'destaques');
  const byName = (a: HTMLLIElement, b: HTMLLIElement) => (a.dataset.name ?? '').localeCompare(b.dataset.name ?? '', 'pt');
  const sorted = ordem === 'destaques' ? items : [...items].sort((a, b) => {
    if (ordem === 'atualizacao') return (b.dataset.updated ?? '').localeCompare(a.dataset.updated ?? '') || byName(a, b);
    if (ordem === 'inclusao') return (b.dataset.created ?? '').localeCompare(a.dataset.created ?? '') || byName(a, b);
    if (ordem === 'relevancia') {
      const sa = scored.get(a) ?? -1;
      const sb = scored.get(b) ?? -1;
      return sb - sa || byName(a, b);
    }
    return byName(a, b);
  });
  let n = 0;
  for (const li of sorted) {
    list.appendChild(li);
    if (!li.hidden) n++;
  }
  const total = items.length;
  count.textContent = n === total ? `${total} acervos` : `${n} de ${total} acervos`;
  empty.hidden = n !== 0;
  renderChips(s);
  const nAtivos = FACETS.filter((f) => s[f]).length;
  document.getElementById('n-filtros')!.textContent = nAtivos ? `(${nAtivos} ativo${nAtivos > 1 ? 's' : ''})` : '';
  writeUrl(s);
}

let lastChips = '';
function renderChips(s: Record<string, string>) {
  // Não recria os botões se nada mudou: um "change" disparado pelo blur da
  // busca no meio de um clique apagaria o botão clicado.
  const sig = JSON.stringify(PARAMS.filter((p) => p !== 'ordem').map((p) => s[p] ?? ''));
  if (sig === lastChips) return;
  lastChips = sig;
  chips.replaceChildren();
  for (const p of PARAMS) {
    if (p === 'ordem' || !s[p]) continue;
    const el = form.elements.namedItem(p) as HTMLInputElement | HTMLSelectElement;
    const labelEl = form.querySelector(`label[for="${el.id}"]`);
    const valueLabel = el instanceof HTMLSelectElement ? el.selectedOptions[0]?.textContent?.replace(/\s*\(\d+\)$/, '') : `“${s[p]}”`;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = `${labelEl?.textContent ?? p}: ${valueLabel} ✕`;
    b.setAttribute('aria-label', `Remover filtro ${labelEl?.textContent ?? p}: ${valueLabel}`);
    b.addEventListener('click', () => {
      el.value = '';
      apply();
      (form.elements.namedItem('q') as HTMLInputElement).focus();
    });
    chips.appendChild(b);
  }
}

const more = document.getElementById('mais-filtros') as HTMLButtonElement;
const fields = document.getElementById('campos-filtros')!;
function showFilters(open: boolean) {
  more.setAttribute('aria-expanded', String(open));
  fields.hidden = !open;
}
more.hidden = false;
more.addEventListener('click', () => showFilters(fields.hasAttribute('hidden')));
const params = new URLSearchParams(location.search);
showFilters(params.has('ordem') || FACETS.some((facet) => params.has(facet)));

readUrl();
apply();
form.addEventListener('submit', (e) => {
  e.preventDefault();
  apply();
});
form.addEventListener('change', apply);
(form.elements.namedItem('q') as HTMLInputElement).addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = window.setTimeout(apply, 200);
});
document.getElementById('limpar')!.addEventListener('click', (e) => {
  e.preventDefault();
  form.reset();
  for (const p of PARAMS) {
    const el = form.elements.namedItem(p) as HTMLInputElement | HTMLSelectElement | null;
    if (el) el.value = '';
  }
  apply();
});
window.addEventListener('popstate', () => {
  readUrl();
  apply();
});
