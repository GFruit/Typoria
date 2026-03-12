// --- Chronicles ---

const CHRONICLE_SCENES = [
  { id: 'woodcutting', icon: '🌲', color: '#a6e3a1' },
  { id: 'mining',      icon: '⛏️', color: '#e0a96d' },
  { id: 'fishing',     icon: '🎣', color: '#89dceb' },
  { id: 'cooking',     icon: '🔥', color: '#fab387' },
  { id: 'combat',      icon: '⚔️', color: '#ffc042' },
  { id: 'travel',      icon: '🏃', color: '#89b4fa' },
  { id: 'forge',       icon: '🔨', color: '#cba6f7' },
];

let _chronTab     = 'woodcutting';
let _chronSortCol = 'attempts';
let _chronSortDir = -1;

function openChronicles() {
  _renderChroniclesTabs();
  _renderChroniclesTable(_chronTab);
  document.getElementById('chroniclesModal').classList.add('open');

}

function closeChronicles() {
  document.getElementById('chroniclesModal').classList.remove('open');
}

function _renderChroniclesTabs() {
  const tabs = document.getElementById('chroniclesTabs');
  tabs.innerHTML = '';
  CHRONICLE_SCENES.forEach(({ id, icon, color }) => {
    const btn = document.createElement('button');
    btn.className = 'chron-tab' + (id === _chronTab ? ' active' : '');
    btn.dataset.scene = id;
    btn.style.setProperty('--tab-color', color);
    btn.title = SCENES[id] ? SCENES[id].name : id;
    btn.innerHTML = `<span class="chron-tab-icon">${icon}</span><span class="chron-tab-name">${SCENES[id] ? SCENES[id].name : id}</span>`;
    btn.addEventListener('click', () => {
      _chronTab = id;
      document.querySelectorAll('.chron-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      _renderChroniclesTable(id);
    });
    tabs.appendChild(btn);
  });
}

function _renderChroniclesTable(sceneId) {
  const scene = SCENES[sceneId];
  if (!scene) return;

  const quotes = scene.quotes();
  const scores = JSON.parse(localStorage.getItem('typoria_wpm_scores') || '{}');
  const sceneColor = CHRONICLE_SCENES.find(s => s.id === sceneId)?.color || '#cdd6f4';

  document.getElementById('chroniclesModal').style.setProperty('--chron-accent', sceneColor);

  const searchVal = (document.getElementById('chroniclesSearch')?.value || '').toLowerCase().trim();

  // Only show discovered quotes (those with a scores entry)
  let rows = quotes
    .filter(quote => scores[quote] !== undefined)
    .map(quote => {
      const data = scores[quote];
      const recent = data.recent || [];
      const avgWpm = recent.length > 0
        ? Math.round(recent.reduce((a, b) => a + b, 0) / recent.length)
        : 0;
      return {
        quote,
        attempts: data.count || recent.length,
        avgWpm,
        pb: data.pb || 0,
      };
    });

  // Apply search filter
  if (searchVal) {
    rows = rows.filter(r => r.quote.toLowerCase().includes(searchVal));
  }

  // Sort
  rows.sort((a, b) => {
    if (_chronSortCol === 'quote') return _chronSortDir * a.quote.localeCompare(b.quote);
    return _chronSortDir * ((b[_chronSortCol] || 0) - (a[_chronSortCol] || 0));
  });

  // Update sort indicators
  document.querySelectorAll('.chron-th[data-col]').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
    if (th.dataset.col === _chronSortCol) {
      th.classList.add(_chronSortDir === -1 ? 'sort-desc' : 'sort-asc');
    }
  });

  const tbody = document.getElementById('chroniclesBody');
  tbody.innerHTML = '';

  const totalDiscovered = quotes.filter(q => scores[q] !== undefined).length;
  document.getElementById('chroniclesCount').textContent =
    `${totalDiscovered} / ${quotes.length} Quotes Discovered`;

  if (rows.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="4" style="text-align:center;color:#45475a;padding:2rem;font-size:0.7rem;">${searchVal ? 'No quotes match your search.' : 'No quotes discovered yet.'}</td>`;
    tbody.appendChild(tr);
    return;
  }

  rows.forEach(row => {
    const tr = document.createElement('tr');
    tr.className = 'chron-row typed';

    tr.innerHTML = `
      <td class="chron-quote-cell">
        <div class="chron-quote-inner">
          <div class="chron-preview">${escapeHtml(row.quote)}</div>
          <div class="chron-full hidden">${escapeHtml(row.quote)}</div>
          <span class="chron-expand-hint">click to expand</span>
        </div>
      </td>
      <td class="chron-num">${row.attempts}</td>
      <td class="chron-num chron-avg"><span class="chron-num-inner">${row.avgWpm > 0 ? row.avgWpm + '<span class="chron-unit">wpm</span>' : '—'}</span></td>
      <td class="chron-num chron-pb-cell"><span class="chron-num-inner">${row.pb > 0 ? row.pb + '<span class="chron-unit">wpm</span>' : '—'}</span></td>
    `;

    tr.querySelector('.chron-quote-cell').addEventListener('click', () => {
      const preview = tr.querySelector('.chron-preview');
      const full    = tr.querySelector('.chron-full');
      const hint    = tr.querySelector('.chron-expand-hint');
      const isOpen  = !full.classList.contains('hidden');
      preview.classList.toggle('hidden', !isOpen);
      full.classList.toggle('hidden', isOpen);
      hint.textContent = isOpen ? 'click to expand' : 'click to collapse';
      tr.classList.toggle('expanded', !isOpen);
    });

    tbody.appendChild(tr);
  });
}

function _setSortCol(col) {
  if (_chronSortCol === col) {
    _chronSortDir *= -1;
  } else {
    _chronSortCol = col;
    _chronSortDir = -1;
  }
  _renderChroniclesTable(_chronTab);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('chroniclesBtn');
  if (btn) btn.addEventListener('click', openChronicles);

  const closeBtn = document.getElementById('chroniclesCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeChronicles);

  const modal = document.getElementById('chroniclesModal');
  if (modal) modal.addEventListener('click', e => {
    if (e.target === modal) closeChronicles();
  });

  document.querySelectorAll('.chron-th[data-col]').forEach(th => {
    th.addEventListener('click', () => _setSortCol(th.dataset.col));
  });

  const search = document.getElementById('chroniclesSearch');
  if (search) search.addEventListener('input', () => _renderChroniclesTable(_chronTab));
});