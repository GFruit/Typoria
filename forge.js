// ─────────────────────────────────────────────────────────────
//  forge.js  —  Forge / Smithing System
//  Depends on: items.js, state.js, leveling.js, sounds.js
// ─────────────────────────────────────────────────────────────

// ── Recipe definitions ────────────────────────────────────────
// Coal appears as an *ingredient* for iron+ (not as fuel).
// Fuel is always logs, managed via burnDuration (same as cooking).
const FORGE_RECIPES = [
  {
    id: 'tin_bar',    name: 'Tin Bar',
    icon: '🔩', image: 'assets/img/tin_bar.png',
    level: 1,  xp: 15,  wordsRequired: 2,
    inputs: [{ id: 'tin_ore',    qty: 1 }],
  },
  {
    id: 'copper_bar', name: 'Copper Bar',
    icon: '🔩', image: 'assets/img/copper_bar.png',
    level: 5,  xp: 25,  wordsRequired: 2,
    inputs: [{ id: 'copper_ore', qty: 1 }],
  },
  {
    id: 'bronze_bar', name: 'Bronze Bar',
    icon: '🔩', image: 'assets/img/bronze_bar.png',
    level: 10, xp: 55,  wordsRequired: 4,
    inputs: [{ id: 'tin_ore', qty: 1 }, { id: 'copper_ore', qty: 1 }],
  },
  {
    id: 'iron_bar',   name: 'Iron Bar',
    icon: '⚙️', image: 'assets/img/iron_bar.png',
    level: 20, xp: 100, wordsRequired: 6,
    inputs: [{ id: 'iron_ore', qty: 1 }, { id: 'coal', qty: 1 }],
  },
  {
    id: 'silver_bar', name: 'Silver Bar',
    icon: '🥈', image: 'assets/img/silver_bar.png',
    level: 30, xp: 190, wordsRequired: 8,
    inputs: [{ id: 'silver_ore', qty: 1 }, { id: 'coal', qty: 1 }],
  },
  {
    id: 'gold_bar',   name: 'Gold Bar',
    icon: '🥇', image: 'assets/img/gold_bar.png',
    level: 40, xp: 400, wordsRequired: 12,
    inputs: [{ id: 'gold_ore', qty: 1 }, { id: 'coal', qty: 2 }],
  },
];

function getRecipe(id) {
  return FORGE_RECIPES.find(r => r.id === id) || null;
}

// ── Persisted state ───────────────────────────────────────────
let forgeState = JSON.parse(localStorage.getItem('typoria_forge') || 'null') || {
  selectedRecipeId:  null,
  logItemId:         null,  // which log type is in the fuel slot
  logBurnRemaining:  0,     // smelts remaining from the current log
  wordsProgress:     0,     // words typed toward the current smelt
  sessionSmelted:    {},    // { barId: count } — resets on arrival
  lastSmeltedId:     null,
};

if (!forgeState.sessionSmelted) forgeState.sessionSmelted = {};

function saveForgeState() {
  localStorage.setItem('typoria_forge', JSON.stringify(forgeState));
}

// Called when leaving the forge (mirrors endCookingSession)
function endForgeSession() {
  forgeState.sessionSmelted   = {};
  forgeState.wordsProgress    = 0;
  forgeState.lastSmeltedId    = null;
  saveForgeState();
}

// ── Helpers ───────────────────────────────────────────────────
function _smithingLevel() {
  return getLevelInfo(xp).level;
}

function _forgeFuelAvailable() {
  if (!forgeState.logItemId) return false;
  return forgeState.logBurnRemaining > 0 || getItemQty(forgeState.logItemId) > 0;
}

function canSmeltRecipe(recipe) {
  if (!recipe) return false;
  if (_smithingLevel() < recipe.level) return false;
  if (!_forgeFuelAvailable())          return false;
  for (const { id, qty } of recipe.inputs) {
    if (getItemQty(id) < qty) return false;
  }
  return true;
}

// ── Main word handler (called from typing.js submitWord) ──────
function onForgeWord(hadError, targetWord, mult) {
  const recipe = getRecipe(forgeState.selectedRecipeId);

  // Nothing to do without a recipe or ingredients
  if (!recipe || !canSmeltRecipe(recipe)) {
    updateForgeUI();
    return;
  }

  // Errors pause smelt progress but don't reset it
  if (hadError) return;

  // ── Deplete fuel by 1 word ────────────────────────────────
  forgeState.logBurnRemaining--;
  if (forgeState.logBurnRemaining <= 0) {
    inventoryData[forgeState.logItemId] =
      Math.max(0, (inventoryData[forgeState.logItemId] || 0) - 1);
    saveInventory();
    if (getItemQty(forgeState.logItemId) > 0) {
      const logItem = getItem(forgeState.logItemId);
      forgeState.logBurnRemaining = logItem?.burnDuration || 1;
    } else {
      forgeState.logItemId        = null;
      forgeState.logBurnRemaining = 0;
    }
  }

  forgeState.wordsProgress++;
  saveForgeState();
  updateForgeUI();

  // ── Smelt complete ────────────────────────────────────────
  if (forgeState.wordsProgress >= recipe.wordsRequired) {

    // Consume ore / coal inputs
    for (const { id, qty } of recipe.inputs) {
      inventoryData[id] = Math.max(0, (inventoryData[id] || 0) - qty);
    }

    // Award bar
    awardItem(recipe.id, 1);
    forgeState.lastSmeltedId          = recipe.id;
    forgeState.sessionSmelted[recipe.id] =
      (forgeState.sessionSmelted[recipe.id] || 0) + 1;
    forgeState.wordsProgress = 0;

    // XP — full amount on smelt completion
    const xpGain = Math.round(recipe.xp * mult);
    if (xpGain > 0) {
      xp += xpGain;
      saveState();
      xpBar.innerHTML = `${xp} <span class="side-unit">XP</span>`;
      updateLevelUI();
      spawnXpDrop(xpGain, mult);
    }

    // Sound — reuse cook sound or swap for a dedicated forge sfx
    playSound('assets/sfx/cook.mp3', 0.45);

    saveInventory();
    checkForgeAchievements(recipe.id);
    saveForgeState();
    updateForgeUI();
  }
}

// ── Forge UI update ───────────────────────────────────────────
function updateForgeUI() {
  const recipe = getRecipe(forgeState.selectedRecipeId);
  const activeIcon = document.getElementById('forgeActiveIcon');
  if (activeIcon) _applyIconToEl(activeIcon, recipe);


  // ─ Ingredient icon row ────────────────────────────────────
  const ingIcons = document.getElementById('forgeIngIcons');
  if (ingIcons) {
    ingIcons.innerHTML = '';
    if (recipe) {
      recipe.inputs.forEach(({ id, qty }) => {
        const item = getItem(id);
        const have = getItemQty(id);
        const ok   = have >= qty;

        const chip = document.createElement('div');
        chip.className = 'forge-ing-chip ' + (ok ? 'forge-ing-ok' : 'forge-ing-bad');
        chip.title = `${item?.name || id}: need ${qty}, have ${have}`;

        const iconEl = document.createElement('div');
        iconEl.className = 'forge-ing-icon';
        if (item?.image) {
          iconEl.style.backgroundImage    = `url('${item.image}')`;
          iconEl.style.backgroundSize     = 'contain';
          iconEl.style.backgroundRepeat   = 'no-repeat';
          iconEl.style.backgroundPosition = 'center';
        } else {
          iconEl.textContent = item?.icon || '?';
        }

        const qtyEl = document.createElement('div');
        qtyEl.className   = 'forge-ing-qty';
        qtyEl.textContent = `${have}/${qty}`;

        chip.appendChild(iconEl);
        chip.appendChild(qtyEl);
        ingIcons.appendChild(chip);
      });
    }
  }

  // ─ Fuel slot ───────────────────────────────────────────────
  const fuelContent = document.getElementById('forgeFuelContent');
  const fuelCount   = document.getElementById('forgeFuelCount');
  const fuelBar     = document.getElementById('forgeFuelBar');
  const fuelBarFill = document.getElementById('forgeFuelBarFill');
  if (fuelContent) {
    if (forgeState.logItemId && getItemQty(forgeState.logItemId) > 0) {
      const logItem = getItem(forgeState.logItemId);
      _applyIconToEl(fuelContent, logItem);
      if (fuelCount) fuelCount.textContent = `×${getItemQty(forgeState.logItemId)}`;
      if (fuelBar && fuelBarFill) {
        const burnDur = logItem?.burnDuration || 1;
        const pct = (forgeState.logBurnRemaining / burnDur) * 100;
        fuelBar.style.visibility = 'visible';
        fuelBarFill.style.width  = pct + '%';
      }
    } else {
      fuelContent.style.backgroundImage = '';
      fuelContent.textContent = '+';
      if (fuelCount) fuelCount.textContent = '';
      if (fuelBar)   fuelBar.style.visibility = 'hidden';
    }
  }

  // ─ Smelt progress bar ──────────────────────────────────────
  const progFill = document.getElementById('forgeProg');
  const progText = document.getElementById('forgeProgText');
  if (progFill) {
    if (recipe) {
      const needed = recipe.wordsRequired;
      const done   = forgeState.wordsProgress;
      const pct    = needed > 0 ? Math.min((done / needed) * 100, 100) : 0;
      progFill.style.width = pct + '%';
      progFill.classList.toggle('forge-prog-ready', done >= needed);
      if (progText) progText.textContent = `${done} / ${needed} words`;
    } else {
      progFill.style.width = '0%';
      if (progText) progText.textContent = '—';
    }
  }

  // ─ Output / session count ──────────────────────────────────
  const outIcon   = document.getElementById('forgeOutIcon');
  const sessCount = document.getElementById('forgeSessionSmelted');
  if (outIcon) {
    const lastR = getRecipe(forgeState.lastSmeltedId);
    _applyIconToEl(outIcon, lastR);
    const sessQty = forgeState.lastSmeltedId
      ? (forgeState.sessionSmelted[forgeState.lastSmeltedId] || 0)
      : 0;
    if (sessCount) sessCount.textContent = sessQty > 0 ? `×${sessQty}` : '';
  }
}

// Shared helper: set an element's icon (image or emoji)
function _applyIconToEl(el, item) {
  if (!el) return;
  if (item?.image) {
    el.style.backgroundImage    = `url('${item.image}')`;
    el.style.backgroundSize     = 'contain';
    el.style.backgroundRepeat   = 'no-repeat';
    el.style.backgroundPosition = 'center';
    el.textContent = '';
  } else {
    el.style.backgroundImage = '';
    el.textContent = item?.icon || '';
  }
}

// ── Recipe Picker Modal ───────────────────────────────────────
function openForgePicker() {
  _renderForgePickerCards();
  document.getElementById('forgePickerModal').classList.add('open');
}

function closeForgePicker() {
  document.getElementById('forgePickerModal').classList.remove('open');
}

function _renderForgePickerCards() {
  const grid  = document.getElementById('forgePickerGrid');
  const level = _smithingLevel();
  grid.innerHTML = '';

  FORGE_RECIPES.forEach(recipe => {
    const levelOk   = level >= recipe.level;
    const hasInputs = recipe.inputs.every(({ id, qty }) => getItemQty(id) >= qty);
    const hasFuel   = _forgeFuelAvailable();
    const ready     = levelOk && hasInputs && hasFuel;
    const selected  = forgeState.selectedRecipeId === recipe.id;

    const card = document.createElement('div');
    card.className = [
      'forge-picker-card',
      ready    ? 'fp-ready'    : '',
      !levelOk ? 'fp-locked'   : !hasInputs ? 'fp-missing-ore' : !hasFuel ? 'fp-missing-fuel' : '',
      selected ? 'fp-selected' : '',
    ].filter(Boolean).join(' ');

    // Output icon
    const outIconHtml = recipe.image
      ? `<div class="fp-out-icon" style="background-image:url('${recipe.image}')"></div>`
      : `<div class="fp-out-icon fp-out-emoji">${recipe.icon}</div>`;

    // Input ingredient chips
    const ingrHtml = recipe.inputs.map(({ id, qty }) => {
      const it = getItem(id);
      const have = getItemQty(id);
      const ok = have >= qty;
      const icHtml = it?.image
        ? `<span class="fp-ing-icon" style="background-image:url('${it.image}')"></span>`
        : `<span class="fp-ing-icon fp-ing-emoji">${it?.icon || '?'}</span>`;
      return `<span class="fp-ing-chip${ok ? '' : ' fp-ing-chip-bad'}">${icHtml}<span>×${qty}</span><span class="fp-ing-have">${have}</span></span>`;
    }).join('<span class="fp-sep">+</span>');

    // Status badge
    let badgeText, badgeClass;
    if (!levelOk)     { badgeText = `Lv.${recipe.level}`;  badgeClass = 'fp-badge-locked'; }
    else if (!hasFuel){ badgeText = 'No fuel';              badgeClass = 'fp-badge-warn'; }
    else if (!hasInputs){ badgeText = 'Missing ore';        badgeClass = 'fp-badge-warn'; }
    else              { badgeText = `${recipe.wordsRequired} words`; badgeClass = 'fp-badge-ready'; }

    card.innerHTML = `
      <div class="fp-out-wrap">${outIconHtml}</div>
      <div class="fp-recipe-body">
        <div class="fp-recipe-name">${recipe.name}</div>
        <div class="fp-ing-row">${ingrHtml}</div>
        <div class="fp-recipe-xp">${recipe.xp} XP · ${recipe.wordsRequired} words</div>
      </div>
      <div class="fp-badge ${badgeClass}">${badgeText}</div>
    `;

    if (levelOk) {
      card.addEventListener('click', () => {
        forgeState.selectedRecipeId = recipe.id;
        forgeState.wordsProgress    = 0;
        saveForgeState();
        updateForgeUI();
        closeForgePicker();
      });
    }

    grid.appendChild(card);
  });
}

// ── Fuel Picker (reuses the existing slotPickerModal) ─────────
function openForgeFuelPicker() {
  const logIds = ITEM_REGISTRY
    .filter(i => i.skill === 'woodcutting' && getItemQty(i.id) > 0);

  const grid  = document.getElementById('slotPickerGrid');
  const title = document.getElementById('slotPickerTitle');
  grid.innerHTML = '';
  title.textContent = 'Select Fuel (Logs)';

  let hasAny = false;
  logIds.forEach(item => {
    const qty = getItemQty(item.id);
    if (qty <= 0) return;
    hasAny = true;

    const card = document.createElement('div');
    card.className = 'picker-card';
    const iconHtml = item.image
      ? `<div class="picker-icon" style="background-image:url('${item.image}');background-size:contain;background-repeat:no-repeat;background-position:center;width:2rem;height:2rem;"></div>`
      : `<div class="picker-icon">${item.icon}</div>`;
    const dur = item.burnDuration || 1;
    card.innerHTML = `
      ${iconHtml}
      <div class="picker-name">${item.name}</div>
      <div class="picker-qty">×${qty}</div>
      <div class="picker-qty" style="font-size:0.45rem;color:#6c7086">${dur} smelt${dur !== 1 ? 's' : ''}/log</div>
    `;
    card.addEventListener('click', () => {
      forgeState.logItemId = item.id;
      // Only reset burn counter if switching log type or it's empty
      if (forgeState.logBurnRemaining <= 0) {
        forgeState.logBurnRemaining = item.burnDuration || 1;
      }
      saveForgeState();
      updateForgeUI();
      document.getElementById('slotPickerModal').classList.remove('open');
    });
    grid.appendChild(card);
  });

  if (!hasAny) {
    grid.innerHTML = '<div class="picker-empty">No logs in inventory — chop some wood first!</div>';
  }

  document.getElementById('slotPickerModal').classList.add('open');
}

// ── Achievements ──────────────────────────────────────────────
function checkForgeAchievements(recipeId) {
  const total = Object.values(forgeState.sessionSmelted).reduce((a, b) => a + b, 0);
  if (total >= 1)  unlockAchievement('Smelt your first bar!');
  if (total >= 10) unlockAchievement('Smelt 10 bars!');
  if (total >= 50) unlockAchievement('Smelt 50 bars!');
  if (recipeId === 'bronze_bar') unlockAchievement('Smelt a Bronze Bar!');
  if (recipeId === 'gold_bar')   unlockAchievement('Smelt a Gold Bar!');
}

// ── Init ──────────────────────────────────────────────────────
function initForge() {
  document.getElementById('forgeSelectBtn')
    ?.addEventListener('click', openForgePicker);

  document.getElementById('forgeFuelEl')
    ?.addEventListener('click', openForgeFuelPicker);

  document.getElementById('forgePickerClose')
    ?.addEventListener('click', closeForgePicker);

  const modal = document.getElementById('forgePickerModal');
  modal?.addEventListener('click', e => {
    if (e.target === modal) closeForgePicker();
  });
}

document.addEventListener('DOMContentLoaded', initForge);