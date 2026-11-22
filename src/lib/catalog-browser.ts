import { sitePath } from './site-path';
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
  if (history.state?.panel) return;
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
window.addEventListener('popstate', (e) => {
  if (e.state?.panel) return; // tratado pelo painel
  readUrl();
  apply();
});


// ── Painel contextual ───────────────────────────────────────────────
// Aprimoramento progressivo: sem JS, o link abre a página canônica do
// registro. Com JS, a mesma página é carregada num <dialog> nativo (foco
// preso, Esc), a URL vira a do registro (link copiável; voltar fecha o
// painel) e a lista mantém filtros e rolagem.
const dialog = document.getElementById('painel') as HTMLDialogElement;
const panelBody = document.getElementById('painel-corpo')!;
const panelPos = document.getElementById('painel-pos')!;
const panelLink = document.getElementById('painel-link') as HTMLAnchorElement;
const prevBtn = dialog.querySelector('[data-panel="prev"]') as HTMLButtonElement;
const nextBtn = dialog.querySelector('[data-panel="next"]') as HTMLButtonElement;
const listTitle = document.title;
const cache = new Map<string, string>();
let currentId: string | null = null;
let opener: HTMLElement | null = null;

const visibleIds = () => Array.from(list.querySelectorAll<HTMLLIElement>(':scope > li:not([hidden])'), (li) => li.dataset.id!);

async function fetchRecord(id: string): Promise<string> {
  if (cache.has(id)) return cache.get(id)!;
  const res = await fetch(sitePath(`/acervos/${id}/`));
  if (!res.ok) throw new Error(String(res.status));
  const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
  const art = doc.querySelector('article[data-record]');
  if (!art) throw new Error('sem conteúdo');
  const h1 = art.querySelector('h1');
  if (h1) {
    const h2 = doc.createElement('h2');
    h2.innerHTML = h1.innerHTML;
    h2.id = 'painel-titulo';
    h2.tabIndex = -1;
    h2.className = h1.className;
    h1.replaceWith(h2);
  }
  const html = art.outerHTML;
  cache.set(id, html);
  return html;
}

async function openPanel(id: string, mode: 'push' | 'replace' | 'none') {
  currentId = id;
  const url = sitePath(`/acervos/${id}/`);
  panelLink.href = url;
  if (!dialog.open) {
    document.documentElement.classList.add('panel-open');
    dialog.showModal();
  }
  panelBody.setAttribute('aria-busy', 'true');
  panelBody.innerHTML = '<p class="meta panel-loading">Carregando acervo…</p>';
  if (mode === 'push') history.pushState({ panel: id }, '', url);
  if (mode === 'replace') history.replaceState({ panel: id }, '', url);
  const ids = visibleIds();
  const pos = ids.indexOf(id);
  panelPos.textContent = pos >= 0 ? `${pos + 1} de ${ids.length} nos resultados` : '';
  prevBtn.disabled = pos <= 0;
  nextBtn.disabled = pos < 0 || pos >= ids.length - 1;
  try {
    panelBody.innerHTML = await fetchRecord(id);
    const title = panelBody.querySelector('#painel-titulo') as HTMLElement | null;
    document.title = `${title?.textContent ?? id} — Acervo Acervos`;
    title?.focus();
  } catch {
    panelBody.innerHTML = `<p class="callout">A prévia está indisponível. <a href="${url}">Abrir a página do acervo</a>.</p>`;
  } finally {
    panelBody.removeAttribute('aria-busy');
    panelBody.scrollTop = 0;
  }
}

function requestClose() {
  if (history.state?.panel) history.back();
  else dialog.close();
}

dialog.addEventListener('close', () => {
  document.documentElement.classList.remove('panel-open');
  document.title = listTitle;
  currentId = null;
  opener?.focus();
});
dialog.addEventListener('cancel', (e) => {
  e.preventDefault(); // Esc: fecha pelo histórico, para manter voltar/avançar coerentes
  requestClose();
});
dialog.querySelector('[data-panel="close"]')!.addEventListener('click', requestClose);
// clique no fundo escurecido fecha
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) requestClose();
});
function step(delta: number) {
  const ids = visibleIds();
  const next = ids[ids.indexOf(currentId!) + delta];
  if (next) {
    opener = items.find((li) => li.dataset.id === next)?.querySelector('a[data-open]') ?? opener;
    openPanel(next, 'replace');
  }
}
prevBtn.addEventListener('click', () => step(-1));
nextBtn.addEventListener('click', () => step(1));

list.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest('a[data-open]') as HTMLAnchorElement | null;
  if (!a) return;
  const me = e as MouseEvent;
  if (me.button !== 0 || me.metaKey || me.ctrlKey || me.shiftKey || me.altKey) return; // nova aba etc.
  if (typeof dialog.showModal !== 'function') return; // navegador sem <dialog>: segue o link
  e.preventDefault();
  opener = a;
  openPanel(a.dataset.open!, 'push');
});

window.addEventListener('popstate', (e) => {
  if (e.state?.panel) openPanel(e.state.panel, 'none');
  else if (dialog.open) dialog.close();
});
