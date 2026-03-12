// =============================================================
//  ACHIEVEMENTS MODAL  —  achievements_modal.js
//  Depends on: achievements.js (unlockedAchievements), state.js
// =============================================================

// ─── Registry ─────────────────────────────────────────────────
const ACHIEVEMENTS_REGISTRY = [

  // === SKILLING: Woodcutting ===
  { id: 'Chop 10 pine logs!',              category: 'Skilling', sub: 'Woodcutting', icon: '🪵', desc: 'Chop 10 pine logs total' },
  { id: 'Reach Level 10 Woodcutting!',category: 'Skilling', sub: 'Woodcutting', icon: '🌲', desc: 'Reach Level 10 in Woodcutting' },
  { id: 'Reach Level 50 Woodcutting!',category: 'Skilling', sub: 'Woodcutting', icon: '🌲', desc: 'Reach Level 50 in Woodcutting' },
  { id: 'Reach Level 99 Woodcutting!',category: 'Skilling', sub: 'Woodcutting', icon: '🌲', desc: 'Reach Level 99 in Woodcutting — MAX LEVEL!' },

  // === SKILLING: Mining ===
  { id: 'Reach Level 10 Mining!',     category: 'Skilling', sub: 'Mining', icon: '⛏️', desc: 'Reach Level 10 in Mining' },
  { id: 'Reach Level 50 Mining!',     category: 'Skilling', sub: 'Mining', icon: '⛏️', desc: 'Reach Level 50 in Mining' },
  { id: 'Reach Level 99 Mining!',     category: 'Skilling', sub: 'Mining', icon: '⛏️', desc: 'Reach Level 99 in Mining — MAX LEVEL!' },

  // === SKILLING: Fishing ===
  { id: 'Reach Level 10 Fishing!',    category: 'Skilling', sub: 'Fishing', icon: '🎣', desc: 'Reach Level 10 in Fishing' },
  { id: 'Reach Level 50 Fishing!',    category: 'Skilling', sub: 'Fishing', icon: '🎣', desc: 'Reach Level 50 in Fishing' },
  { id: 'Reach Level 99 Fishing!',    category: 'Skilling', sub: 'Fishing', icon: '🎣', desc: 'Reach Level 99 in Fishing — MAX LEVEL!' },

  // === SKILLING: Cooking ===
  { id: 'Reach Level 10 Cooking!',    category: 'Skilling', sub: 'Cooking', icon: '🔥', desc: 'Reach Level 10 in Cooking' },
  { id: 'Reach Level 50 Cooking!',    category: 'Skilling', sub: 'Cooking', icon: '🔥', desc: 'Reach Level 50 in Cooking' },
  { id: 'Reach Level 99 Cooking!',    category: 'Skilling', sub: 'Cooking', icon: '🔥', desc: 'Reach Level 99 in Cooking — MAX LEVEL!' },

  // === SKILLING: Combat ===
  { id: 'Reach Level 10 Combat!',     category: 'Skilling', sub: 'Combat', icon: '⚔️', desc: 'Reach Level 10 in Combat' },
  { id: 'Reach Level 50 Combat!',     category: 'Skilling', sub: 'Combat', icon: '⚔️', desc: 'Reach Level 50 in Combat' },
  { id: 'Reach Level 99 Combat!',     category: 'Skilling', sub: 'Combat', icon: '⚔️', desc: 'Reach Level 99 in Combat — MAX LEVEL!' },

  // === EXPLORATION ===
  { id: 'Visit the Mine!',            category: 'Exploration', sub: null, icon: '⛏️', desc: 'Travel to the Mine' },
  { id: 'Visit the Lake!',            category: 'Exploration', sub: null, icon: '🎣', desc: 'Travel to the Lake' },
  { id: 'Visit the Campsite!',        category: 'Exploration', sub: null, icon: '🔥', desc: 'Travel to the Campsite' },
  { id: 'Enter the Dungeon!',         category: 'Exploration', sub: null, icon: '💀', desc: 'Brave the Dungeon' },
  { id: 'Visit the Bank!',            category: 'Exploration', sub: null, icon: '🏦', desc: 'Visit the Bank!' },
  { id: 'Discover all locations!',    category: 'Exploration', sub: null, icon: '🗺️', desc: 'Visit every location in Typoria' },

  // === ACCURACY ===
  { id: 'Type a quote without making a single mistake!',          category: 'Accuracy', sub: null, icon: '✍️', desc: 'Complete a quote with zero errors' },
  { id: 'Type 3 quotes in a row without making a single mistake!',category: 'Accuracy', sub: null, icon: '🏆', desc: 'Complete 3 consecutive quotes perfectly' },

  // === STREAKS ===
  { id: 'Reach a streak of 10!',  category: 'Streaks', sub: null, icon: '🔥', desc: 'Build a word streak of 10 (×2 multiplier!)' },
  { id: 'Reach a streak of 25!',  category: 'Streaks', sub: null, icon: '🔥', desc: 'Build a word streak of 25 (×3 multiplier!)' },

  // === SPEED ===
  { id: 'Type at 40 WPM!',  category: 'Speed', sub: null, icon: '⚡', desc: 'Complete a quote at 40 WPM or faster' },
  { id: 'Type at 60 WPM!',  category: 'Speed', sub: null, icon: '⚡', desc: 'Complete a quote at 60 WPM or faster' },
  { id: 'Type at 80 WPM!',  category: 'Speed', sub: null, icon: '⚡', desc: 'Complete a quote at 80 WPM or faster' },
  { id: 'Type at 100 WPM!', category: 'Speed', sub: null, icon: '⚡', desc: 'Complete a quote at 100 WPM or faster' },
  { id: 'Type at 120 WPM!', category: 'Speed', sub: null, icon: '⚡', desc: 'Complete a quote at 120 WPM or faster' },

    { id: 'Smelt your first bar!',  category: 'Skilling', sub: 'Smithing', icon: '🔩', desc: 'Complete your first smelt at the Forge' },
    { id: 'Smelt 10 bars!',         category: 'Skilling', sub: 'Smithing', icon: '🔩', desc: 'Smelt 10 bars total in one session' },
    { id: 'Smelt 50 bars!',         category: 'Skilling', sub: 'Smithing', icon: '🔩', desc: 'Smelt 50 bars total in one session' },
    { id: 'Smelt a Bronze Bar!',    category: 'Skilling', sub: 'Smithing', icon: '🔩', desc: 'Combine Tin and Copper into Bronze' },
    { id: 'Smelt a Gold Bar!',      category: 'Skilling', sub: 'Smithing', icon: '🥇', desc: 'Reach the pinnacle of Smithing' },
    { id: 'Visit the Forge!',       category: 'Exploration', sub: null,      icon: '🔨', desc: 'Travel to the Forge' },
    { id: 'Reach Level 10 Smithing!', category: 'Skilling', sub: 'Smithing', icon: '🔨', desc: 'Reach Level 10 in Smithing' },
    { id: 'Reach Level 50 Smithing!', category: 'Skilling', sub: 'Smithing', icon: '🔨', desc: 'Reach Level 50 in Smithing' },
    { id: 'Reach Level 99 Smithing!', category: 'Skilling', sub: 'Smithing', icon: '🔨', desc: 'Reach Level 99 Smithing — MAX LEVEL!' },


];


const ACHIEVEMENT_TABS = [
  { id: 'Skilling',    icon: '🎯', color: '#a6e3a1' },
  { id: 'Exploration', icon: '🗺️', color: '#89b4fa' },
  { id: 'Accuracy',    icon: '✍️', color: '#f9e2af' },
  { id: 'Streaks',     icon: '🔥', color: '#fab387' },
  { id: 'Speed',       icon: '⚡', color: '#cba6f7' },
];

const SKILLING_SUBS = [
  { id: 'Woodcutting', icon: '🌲', color: '#a6e3a1' },
  { id: 'Mining',      icon: '⛏️', color: '#e0a96d' },
  { id: 'Fishing',     icon: '🎣', color: '#89dceb' },
  { id: 'Cooking',     icon: '🔥', color: '#fab387' },
  { id: 'Combat',      icon: '⚔️', color: '#f38ba8' },
  { id: 'Smithing',    icon: '🔨', color: '#e0a96d' },
];

// ─── State ────────────────────────────────────────────────────
let _achTab    = 'Skilling';
let _achFilter = 'all'; // 'all' | 'completed' | 'incomplete'

// ─── Open / Close ─────────────────────────────────────────────
function openAchievements() {
  _achFilter = 'all';
  _renderAchievementsTabs();
  _renderAchievementsContent(_achTab);
  document.getElementById('achievementsModal').classList.add('open');
}

function closeAchievements() {
  document.getElementById('achievementsModal').classList.remove('open');
}

// ─── Overall progress ─────────────────────────────────────────
function _getOverallCompletion() {
  const total     = ACHIEVEMENTS_REGISTRY.length;
  const completed = ACHIEVEMENTS_REGISTRY.filter(a => unlockedAchievements[a.id]).length;
  return { total, completed };
}

// ─── Tabs ─────────────────────────────────────────────────────
function _renderAchievementsTabs() {
  const tabsEl = document.getElementById('achTabs');
  tabsEl.innerHTML = '';

  ACHIEVEMENT_TABS.forEach(({ id, icon, color }) => {
    const all  = ACHIEVEMENTS_REGISTRY.filter(a => a.category === id);
    const done = all.filter(a => unlockedAchievements[a.id]).length;
    const pct  = all.length > 0 ? Math.round((done / all.length) * 100) : 0;

    const btn = document.createElement('button');
    btn.className = 'chron-tab ach-tab' + (id === _achTab ? ' active' : '');
    btn.dataset.cat = id;
    btn.style.setProperty('--tab-color', color);
    btn.innerHTML = `
      <span class="chron-tab-icon">${icon}</span>
      <span class="chron-tab-name">${id}</span>
      <span class="ach-tab-pct">${pct}%</span>
    `;
    btn.addEventListener('click', () => {
      _achTab = id;
      document.querySelectorAll('.ach-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      _renderAchievementsContent(id);
    });
    tabsEl.appendChild(btn);
  });

  // Overall progress bar
  const { total, completed } = _getOverallCompletion();
  const overallPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  document.getElementById('achOverallText').textContent = `${completed} / ${total}  Achievements Unlocked`;
  document.getElementById('achOverallFill').style.width = overallPct + '%';
  document.getElementById('achOverallPct').textContent  = overallPct + '%';
}

// ─── Content area ─────────────────────────────────────────────
function _renderAchievementsContent(category) {
  const wrap = document.getElementById('achContentWrap');
  wrap.innerHTML = '';

  // Accent colour for active tab
  const tabDef = ACHIEVEMENT_TABS.find(t => t.id === category);
  document.getElementById('achievementsModal')
    .style.setProperty('--ach-accent', tabDef?.color || '#a6e3a1');

  // Category-level progress bar
  const allInCat  = ACHIEVEMENTS_REGISTRY.filter(a => a.category === category);
  const doneInCat = allInCat.filter(a => unlockedAchievements[a.id]).length;
  const catPct    = allInCat.length > 0 ? Math.round((doneInCat / allInCat.length) * 100) : 0;

  const catHeader = document.createElement('div');
  catHeader.className = 'ach-cat-header';
  catHeader.innerHTML = `
    <div class="ach-cat-progress-row">
      <span class="ach-cat-count">${doneInCat} / ${allInCat.length} unlocked</span>
      <div class="ach-cat-bar-wrap">
        <div class="ach-cat-bar-fill" style="width:${catPct}%"></div>
      </div>
      <span class="ach-cat-pct">${catPct}%</span>
    </div>
  `;
  wrap.appendChild(catHeader);

  // Filter bar
  const allCount        = allInCat.length;
  const completedCount  = allInCat.filter(a =>  unlockedAchievements[a.id]).length;
  const incompleteCount = allInCat.filter(a => !unlockedAchievements[a.id]).length;

  const filterBar = document.createElement('div');
  filterBar.className = 'ach-filter-bar';
  [
    { id: 'all',        label: `All`,             count: allCount },
    { id: 'completed',  label: `✓ Completed`,     count: completedCount },
    { id: 'incomplete', label: `○ In Progress`,   count: incompleteCount },
  ].forEach(({ id, label, count }) => {
    const btn = document.createElement('button');
    btn.className = 'ach-filter-btn' + (_achFilter === id ? ' active' : '');
    btn.innerHTML = `${label} <span class="ach-filter-count">${count}</span>`;
    btn.addEventListener('click', () => {
      _achFilter = id;
      filterBar.querySelectorAll('.ach-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Remove old sections and re-render
      wrap.querySelectorAll('.ach-section, .ach-empty').forEach(el => el.remove());
      _renderSections(wrap, category);
    });
    filterBar.appendChild(btn);
  });
  wrap.appendChild(filterBar);

  _renderSections(wrap, category);
}

// ─── Sections ─────────────────────────────────────────────────
function _renderSections(wrap, category) {
  if (category === 'Skilling') {
    let anyVisible = false;
    SKILLING_SUBS.forEach(({ id: sub, icon, color }) => {
      const allItems      = ACHIEVEMENTS_REGISTRY.filter(a => a.category === 'Skilling' && a.sub === sub);
      const filteredItems = _applyFilter(allItems);
      if (filteredItems.length === 0) return;
      anyVisible = true;
      wrap.appendChild(_buildSection(sub, icon, color, filteredItems, allItems));
    });
    if (!anyVisible) wrap.appendChild(_emptyState());
  } else {
    const allItems      = ACHIEVEMENTS_REGISTRY.filter(a => a.category === category);
    const filteredItems = _applyFilter(allItems);
    if (filteredItems.length === 0) {
      wrap.appendChild(_emptyState());
    } else {
      // No sub-header needed for single-group categories
      wrap.appendChild(_buildSection(null, null, null, filteredItems, allItems));
    }
  }
}

function _applyFilter(list) {
  if (_achFilter === 'completed')  return list.filter(a =>  unlockedAchievements[a.id]);
  if (_achFilter === 'incomplete') return list.filter(a => !unlockedAchievements[a.id]);
  return list;
}

function _emptyState() {
  const el = document.createElement('div');
  el.className = 'ach-empty';
  el.textContent = _achFilter === 'completed'
    ? 'None unlocked here yet. Keep playing!'
    : _achFilter === 'incomplete'
    ? 'All done in this category — great work!'
    : 'No achievements found.';
  return el;
}

// ─── Build a section block ─────────────────────────────────────
// filteredItems = what to display in the grid (respects filter)
// allItems      = used for the header count (always full set)
function _buildSection(title, icon, color, filteredItems, allItems) {
  const section = document.createElement('div');
  section.className = 'ach-section';

  if (title) {
    const doneCount  = allItems.filter(a => unlockedAchievements[a.id]).length;
    const totalCount = allItems.length;
    const secPct     = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

    const header = document.createElement('div');
    header.className = 'ach-section-header';
    header.innerHTML = `
      <span class="ach-section-icon">${icon}</span>
      <span class="ach-section-title" style="color:${color}">${title}</span>
      <span class="ach-section-done">${doneCount} / ${totalCount}</span>
      <div class="ach-section-bar-wrap">
        <div class="ach-section-bar-fill" style="width:${secPct}%; background:${color}66"></div>
      </div>
    `;
    section.appendChild(header);
  }

  const grid = document.createElement('div');
  grid.className = 'ach-grid';

  filteredItems.forEach(ach => {
    const done = !!unlockedAchievements[ach.id];
    const card = document.createElement('div');
    card.className = 'ach-card' + (done ? ' ach-done' : ' ach-pending');
    card.title = ach.desc;

    card.innerHTML = `
      <div class="ach-card-icon">${ach.icon}</div>
      <div class="ach-card-body">
        <div class="ach-card-name">${ach.id}</div>
        <div class="ach-card-desc">${ach.desc}</div>
      </div>
      <div class="ach-card-badge${done ? ' done' : ''}">${done ? '✓' : '○'}</div>
    `;
    grid.appendChild(card);
  });

  section.appendChild(grid);
  return section;
}

// ─── Listeners ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('achievementsBtn')
    ?.addEventListener('click', openAchievements);
  document.getElementById('achievementsCloseBtn')
    ?.addEventListener('click', closeAchievements);

  const modal = document.getElementById('achievementsModal');
  modal?.addEventListener('click', e => {
    if (e.target === modal) closeAchievements();
  });
});