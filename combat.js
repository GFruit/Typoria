// --- Combat System ---

// Enemy definitions
// attackRate : seconds between each attack attempt
// dmgMin/Max : damage range per hit
// accuracy   : 0–1 chance the attack lands

const ENEMIES = [
  { id: 'skeleton', name: 'Skeleton', hp: 50,  xp: 5,  img: 'assets/img/skeleton.png',
    attackRate: 3, dmgMin: 3,  dmgMax: 8,  accuracy: 0.6,
    drops: [
      { itemId: 'silver_coin', chance: 1 },
    ]
  },
  { id: 'goblin', name: 'Goblin', hp: 50, xp: 10, img: 'assets/img/goblin.png',
    attackRate: 2, dmgMin: 5,  dmgMax: 6, accuracy: 0.7,
    drops: [
      { itemId: 'silver_coin', chance: 1 },
    ]
  },
  { id: 'orc', name: 'Orc', hp: 50, xp: 20, img: 'assets/img/orc.png',
    attackRate: 4, dmgMin: 1, dmgMax: 1, accuracy: 0.75,
    drops: [
      { itemId: 'silver_coin', chance: 1.0 },
    ]
  },
  { id: 'dragon', name: 'Dragon', hp: 50, xp: 60, img: 'assets/img/dragon.png',
    attackRate: 2, dmgMin: 1, dmgMax: 2, accuracy: 0.8,
    drops: [
      { itemId: 'gold_coin', chance: 1.0 },
    ]
  },
];
/*
const ENEMIES = [
  { id: 'skeleton', name: 'Skeleton', hp: 80,  xp: 5,  img: 'assets/img/skeleton.png',
    attackRate: 3, dmgMin: 3,  dmgMax: 8,  accuracy: 0.6,
    drops: [
      { itemId: 'gold_coin', chance: 0.3 },
    ]
  },
  { id: 'goblin', name: 'Goblin', hp: 130, xp: 10, img: 'assets/img/goblin.png',
    attackRate: 2, dmgMin: 5,  dmgMax: 12, accuracy: 0.7,
    drops: [
      { itemId: 'gold_coin', chance: 0.6 },
    ]
  },
  { id: 'orc', name: 'Orc', hp: 220, xp: 20, img: 'assets/img/orc.png',
    attackRate: 4, dmgMin: 10, dmgMax: 17, accuracy: 0.75,
    drops: [
      { itemId: 'gold_coin', chance: 0.8 },
    ]
  },
  { id: 'dragon', name: 'Dragon', hp: 500, xp: 60, img: 'assets/img/dragon.png',
    attackRate: 2, dmgMin: 15, dmgMax: 25, accuracy: 0.8,
    drops: [
      { itemId: 'gold_coin', chance: 1.0 },
    ]
  },
];*/


// --- State ---
let enemyHp    = 0;
let enemyMaxHp = 0;
let currentEnemy = null;

const PLAYER_MAX_HP  = 100;
let playerHp    = parseInt(localStorage.getItem('typoria_combat_hp') || PLAYER_MAX_HP);
let _attackTimer     = null;
let equippedFoodId   = null;

// --- Session Loot ---
let sessionLoot = JSON.parse(localStorage.getItem('typoria_combat_loot') || '{}');

let savedEnemyId = localStorage.getItem('typoria_combat_enemy');
let savedEnemyHp = parseInt(localStorage.getItem('typoria_combat_enemy_hp') || '0');

function saveCombatState() {
  localStorage.setItem('typoria_combat_loot', JSON.stringify(sessionLoot));
  localStorage.setItem('typoria_combat_hp', playerHp);
  if (currentEnemy) {
    localStorage.setItem('typoria_combat_enemy', currentEnemy.id);
    localStorage.setItem('typoria_combat_enemy_hp', enemyHp);
  }
}

// Persist combat XP separately (uses the shared xp var via loadSceneState)
// No extra state file needed — combat XP is stored as typoria_xp_combat

// --- Spawn a random enemy ---
function spawnEnemy() {
  _enemyDying = false;
  const saved = savedEnemyId ? ENEMIES.find(e => e.id === savedEnemyId) : null;
  const def = saved || ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
  currentEnemy = def;
  enemyMaxHp   = def.hp;
  enemyHp      = saved ? savedEnemyHp : def.hp;
  savedEnemyId = null; // clear so next spawn is random
  savedEnemyHp = 0;
  document.getElementById('enemyImg').src = def.img;
  updateEnemyUI();
  startEnemyAttackTimer();
}

// --- Enemy attack timer ---
function startEnemyAttackTimer() {
  if (_attackTimer) clearInterval(_attackTimer);
  if (!currentEnemy) return;
  _attackTimer = setInterval(() => {
    if (!currentEnemy || enemyHp <= 0) return;
    const hits = Math.random() < currentEnemy.accuracy;
    if (hits) {
      const dmg = Math.floor(
        Math.random() * (currentEnemy.dmgMax - currentEnemy.dmgMin + 1)
        + currentEnemy.dmgMin
      );
      playerHp = Math.max(0, playerHp - dmg);
      updatePlayerUI();
      if (playerHp <= 0) onPlayerDefeated();
    }
  }, currentEnemy.attackRate * 1000);
}

function stopEnemyAttackTimer() {
  if (_attackTimer) { clearInterval(_attackTimer); _attackTimer = null; }
}

// --- Player defeated ---
function onPlayerDefeated() {
  if (typingInput.disabled) return;
  stopEnemyAttackTimer();
  
  
  typingInput.disabled = true;

  showDeathToast();

  setTimeout(() => {
    const overlay = document.getElementById('transitionOverlay');
    const fromEl  = document.getElementById('transitionFrom');
    const toEl    = document.getElementById('transitionTo');

    const bgMap = {
      woodcutting: "url('assets/img/forest.png')",
      mining:      "url('assets/img/mine.png')",
      fishing:     "url('assets/img/lake.png')",
      cooking:     "url('assets/img/campsite.jpg')",
      combat:      "url('assets/img/dungeon.png')",
    };

    const prevScene = previousLocation ? LOCATIONS[previousLocation]?.scene : null;
    fromEl.style.backgroundImage = "url('assets/img/dungeon.png')";
    toEl.style.backgroundImage   = bgMap[prevScene] || "url('assets/img/forest.png')";

    overlay.classList.add('active');
    fromEl.classList.add('fading');

    setTimeout(() => {
      currentLocation = previousLocation && LOCATIONS[previousLocation]
        ? previousLocation
        : currentLocation;
      currentScene = LOCATIONS[currentLocation].scene;
      localStorage.setItem('typoria_scene', currentScene);
      localStorage.setItem('typoria_location', currentLocation);
      loadSceneState();

      stopEnemyAttackTimer();
      currentEnemy = null;
      playerHp = PLAYER_MAX_HP;
      isEatingMode = false;

      document.body.classList.remove('arrived', 'eating-mode');

      clearSessionLoot();

      updateSceneUI();
      updateStreakUI();
      buildQuote(getNextQuote());
      updatePlayerUI();

      overlay.classList.remove('active');
      fromEl.classList.remove('fading');
      typingInput.disabled = false;
      typingInput.focus();
    }, 3000);
  }, 3000);
}

// --- Update player HP UI ---
function updatePlayerUI() {
  saveCombatState()
  const pct = (playerHp / PLAYER_MAX_HP) * 100;

  const sideBar = document.getElementById('playerHpBar');
  const hudBar  = document.getElementById('combatHudPlayerBar');
  const curEl   = document.getElementById('playerHpCurrent');
  const maxEl   = document.getElementById('playerHpMax');

  if (sideBar) sideBar.style.width = pct + '%';
  if (hudBar)  hudBar.style.width  = pct + '%';
  if (curEl)   curEl.textContent   = playerHp;
  if (maxEl)   maxEl.textContent   = PLAYER_MAX_HP;

}

function updateFoodSlotUI() {
  const iconEl  = document.getElementById('combatFoodIcon');
  const countEl = document.getElementById('combatFoodCount');
  if (!iconEl) return;
  if (equippedFoodId) {
    const item = getItem(equippedFoodId);
    const qty  = getItemQty(equippedFoodId);
    if (item && item.image) {
      iconEl.style.backgroundImage = `url('${item.image}')`;
      iconEl.textContent = '';
    } else {
      iconEl.style.backgroundImage = '';
      iconEl.textContent = item ? item.icon : '+';
    }
    countEl.textContent = qty > 0 ? `×${qty}` : '—';
    if (qty <= 0) equippedFoodId = null;
  } else {
    iconEl.style.backgroundImage = '';
    iconEl.textContent = '+';
    countEl.textContent = '';
  }
}

function openFoodPicker() {
  // Reuse the existing slot picker with cooking items that have healAmount
  const validIds = ITEM_REGISTRY
    .filter(i => i.healAmount && getItemQty(i.id) > 0)
    .map(i => i.id);

  const grid  = document.getElementById('slotPickerGrid');
  const title = document.getElementById('slotPickerTitle');
  grid.innerHTML = '';
  title.textContent = 'Select Food';

  let hasAny = false;
  validIds.forEach(itemId => {
    const item = getItem(itemId);
    const qty  = getItemQty(itemId);
    if (!item || qty <= 0) return;
    hasAny = true;
    const card = document.createElement('div');
    card.className = 'picker-card';
    const iconHtml = item.image
      ? `<div class="picker-icon" style="background-image:url('${item.image}');background-size:contain;background-repeat:no-repeat;background-position:center;width:2rem;height:2rem;"></div>`
      : `<div class="picker-icon">${item.icon}</div>`;
    card.innerHTML = `
      ${iconHtml}
      <div class="picker-name">${item.name}</div>
      <div class="picker-qty">×${qty}</div>
      <div class="picker-name" style="color:#a6e3a1">+${item.healAmount}hp</div>
    `;
    card.addEventListener('click', () => {
      equippedFoodId = itemId;
      updateFoodSlotUI();
      closeSlotPicker();
    });
    grid.appendChild(card);
  });

  if (!hasAny) {
    grid.innerHTML = '<div class="picker-empty">No food in inventory</div>';
  }
  document.getElementById('slotPickerModal').classList.add('open');
}

let _enemyDying = false;

// --- Deal damage equal to xpGain (same tick as XP gain) ---
function damageEnemy(amount) {
  if (!currentEnemy || _enemyDying) return;
  enemyHp = Math.max(0, enemyHp - amount);
  updateEnemyUI();
  if (enemyHp <= 0) {
    _enemyDying = true;
    onEnemyDefeated();
  }
}

// --- Update sidebar HP bar + text ---
function updateEnemyUI() {
  saveCombatState();
  const cur    = document.getElementById('enemyHpCurrent');
  const bar    = document.getElementById('enemyHpBar');
  const hudBar = document.getElementById('combatHudEnemyBar'); 
  if (!cur || !bar) return;

  cur.textContent = enemyHp;
  document.getElementById('enemyHpMax').textContent = enemyMaxHp;

  const pct = enemyMaxHp > 0 ? (enemyHp / enemyMaxHp) * 100 : 100;
  bar.style.width = pct + '%';
  if (hudBar) hudBar.style.width = pct + '%';

  bar.classList.remove('hp-mid', 'hp-low');
  if      (pct <= 25) bar.classList.add('hp-low');
  else if (pct <= 50) bar.classList.add('hp-mid');
}

// --- Enemy defeated ---
function onEnemyDefeated() {
  stopEnemyAttackTimer();
  rollCombatLoot();
  setTimeout(() => {
    spawnEnemy();
  }, 800);
}

// --- Called from typing.js submitWord ---
function onCombatWord(hadError, targetWord, mult) {
  const dmg    = hadError ? 0 : targetWord.length * mult;
  const xpGain = dmg;

  if (xpGain > 0) {
    damageEnemy(xpGain);
    xp += xpGain;
    saveState();
    xpBar.innerHTML = `${xp} <span class="side-unit">XP</span>`;
    updateLevelUI();
    spawnDamageDrop(xpGain, mult);
  }
}

// --- Eating Mode ---
let isEatingMode = false;

function toggleEatingMode() {
  if (!equippedFoodId || getItemQty(equippedFoodId) <= 0) return;
  isEatingMode = !isEatingMode;
  document.body.classList.toggle('eating-mode', isEatingMode);
}

function onEatingWord(hadError) {
  if (!equippedFoodId) { isEatingMode = false; document.body.classList.remove('eating-mode'); return; }
  const item = getItem(equippedFoodId);
  const qty  = getItemQty(equippedFoodId);
  if (!item || qty <= 0) {
    isEatingMode = false;
    document.body.classList.remove('eating-mode');
    updateFoodSlotUI();
    return;
  }

  // Always consume one food per word
  inventoryData[equippedFoodId] = qty - 1;
  saveInventory();

  // Only heal on correct words
  if (!hadError && item.healAmount) {
    const actualHeal = Math.min(item.healAmount, PLAYER_MAX_HP - playerHp);
    playerHp = playerHp + actualHeal;
    spawnHealDrop(actualHeal);
  }

  updatePlayerUI();
  updateFoodSlotUI();

  // Auto-exit eating mode when food runs out
  if (getItemQty(equippedFoodId) <= 0) {
    isEatingMode = false;
    document.body.classList.remove('eating-mode');
  }
}

function spawnDamageDrop(amount, mult) {
  const container = document.getElementById('xpDropContainer');
  const el = document.createElement('div');
  el.className = 'xp-drop';
  el.innerHTML = `${amount}${mult > 1 ? ` ×${mult}` : ''} <img src="assets/img/sword.png" style="width:1rem;height:1rem;vertical-align:middle;margin-right:2px;">`;
  const rect = document.getElementById('quoteDisplay').getBoundingClientRect();
  el.style.left = (rect.left + rect.width / 2) + 'px';
  el.style.top  = (rect.top - 10) + 'px';
  container.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

function spawnHealDrop(amount) {
  const container = document.getElementById('xpDropContainer');
  const el = document.createElement('div');
  el.className = 'xp-drop';
  el.style.color = '#f38ba8';
  el.textContent = `+${amount} ❤️`;
  const rect = document.getElementById('quoteDisplay').getBoundingClientRect();
  el.style.left = (rect.left + rect.width / 2) + 'px';
  el.style.top  = (rect.top - 10) + 'px';
  container.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

function showDeathToast() {
  const toast    = document.getElementById('achievementToast');
  const bg = "url('assets/img/dungeon-sidebar.png')"
  const label    = document.getElementById('achievementToastLabel');
  const name     = document.getElementById('achievementToastName');
  const enemy    = currentEnemy ? currentEnemy.name : 'the enemy';
  

  toast.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), ${bg}`;

  label.textContent = 'Defeated!';
  const article = /^[aeiou]/i.test(enemy) ? 'an' : 'a';
  console.log(article);
  name.textContent = `You were slain by ${article} ${enemy}`;

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}


function rollCombatLoot() {
  if (!currentEnemy || !currentEnemy.drops) return;
  const dropped = [];
  currentEnemy.drops.forEach(({ itemId, chance }) => {
    if (Math.random() < chance) dropped.push(itemId);
  });
  dropped.forEach(id => {
    sessionLoot[id] = (sessionLoot[id] || 0) + 1;
  });
  if (dropped.length > 0) {
    saveCombatState();
    updateLootUI(dropped);
  }
}

function updateLootUI(newIds = []) {
  const el = document.getElementById('combatLootGrid');
  if (!el) return;

  const ids = Object.keys(sessionLoot);
  if (ids.length === 0) {
    el.innerHTML = '—';
    return;
  }

  // Remove placeholder text if present
  if (el.textContent === '—') el.innerHTML = '';

  ids.forEach(id => {
    const item = getItem(id);
    if (!item) return;
    const qty = sessionLoot[id];

    // Update existing card if already in grid
    const existing = el.querySelector(`[data-loot-id="${id}"]`);
    if (existing) {
      existing.querySelector('.loot-icon-qty').textContent = `×${qty}`;
      if (newIds.includes(id)) {
        const img = existing.querySelector('.loot-icon-img, .loot-icon-emoji');
        img.classList.remove('pop');
        void img.offsetWidth;
        img.classList.add('pop');
      }
      return;
    }

    // Create new card
    const wrap = document.createElement('div');
    wrap.className = 'loot-icon';
    wrap.dataset.lootId = id;
    wrap.title = `${item.name} ×${qty}`;

    if (item.image) {
      const img = document.createElement('img');
      img.className = newIds.includes(id) ? 'loot-icon-img pop' : 'loot-icon-img';
      img.src = item.image;
      img.onerror = () => {
        const emoji = document.createElement('span');
        emoji.className = newIds.includes(id) ? 'loot-icon-emoji pop' : 'loot-icon-emoji';
        emoji.textContent = item.icon;
        img.replaceWith(emoji);
      };
      wrap.appendChild(img);
    } else {
      const emoji = document.createElement('span');
      emoji.className = newIds.includes(id) ? 'loot-icon-emoji pop' : 'loot-icon-emoji';
      emoji.textContent = item.icon;
      wrap.appendChild(emoji);
    }

    const qtyEl = document.createElement('span');
    qtyEl.className = 'loot-icon-qty';
    qtyEl.textContent = `×${qty}`;
    wrap.appendChild(qtyEl);
    el.appendChild(wrap);
  });
}

function collectSessionLoot() {
  Object.entries(sessionLoot).forEach(([id, qty]) => awardItem(id, qty));
  sessionLoot = {};
  updateLootUI();
}

function clearSessionLoot() {
  sessionLoot = {};
  localStorage.removeItem('typoria_combat_loot');
  localStorage.removeItem('typoria_combat_enemy');
  localStorage.removeItem('typoria_combat_enemy_hp');
  updateLootUI();
}

// --- Init ---
function initCombat() {
  equippedFoodId = null;
  updatePlayerUI();
  updateFoodSlotUI();
  updateLootUI();
  spawnEnemy();

  const foodSlot = document.getElementById('combatFoodSlot');
  if (foodSlot) foodSlot.addEventListener('click', openFoodPicker);
}