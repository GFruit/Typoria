// --- Cooking / Fireplace System ---

const FLINT_MAX_USES = 50;

const SLOT_VALID_ITEMS = {
  flint: ['flint'],
  logs:  ITEM_REGISTRY.filter(i => i.skill === 'woodcutting').map(i => i.id),
  food:  ITEM_REGISTRY.filter(i => i.skill === 'fishing').map(i => i.id),
};

const COOK_MAP = Object.fromEntries(
  ITEM_REGISTRY
    .filter(i => i.cookedVersion)
    .map(i => [i.id, i.cookedVersion])
);


// Helper to set a slot icon — handles both emoji and url() image paths
function setSlotIcon(el, item) {
  if (!el) return;
  if (item && item.image) {
    el.textContent = '';
    el.style.backgroundImage = `url('${item.image}')`;
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundPosition = 'center';
  } else {
    el.style.backgroundImage = '';
    el.textContent = item ? item.icon : '+';
  }
}

// Fireplace state (persisted)
let fireplaceState = JSON.parse(localStorage.getItem('typoria_fireplace') || 'null') || {
  flintEquipped:     false,
  logCount:          0,
  logBurnRemaining:  0,  // words remaining before current log is consumed
  logItemId:         null,
  foodItemId:        null,
  lastCookedItemId: null,
  sessionCooked:     {},
};

// Migrate old flintDurability key
if (fireplaceState.flintDurability !== undefined) {
  fireplaceState.flintTotalUses = fireplaceState.flintDurability;
  delete fireplaceState.flintDurability;
}

if (!fireplaceState.sessionCooked) {
  fireplaceState.sessionCooked = {};
}

let _pendingSlot = null;

function saveCookingState() {
  localStorage.setItem('typoria_fireplace', JSON.stringify(fireplaceState));
}

function isFire() {
  return (
    fireplaceState.flintEquipped &&
    getItemQty('flint') > 0 &&
    fireplaceState.logCount > 0 || fireplaceState.logBurnRemaining > 0);
}

// Call when arriving at campsite — resets session
function startCookingSession() {
  fireplaceState.sessionCooked = {};
  updateFireplaceUI();
}

// Call when leaving campsite
function endCookingSession() {
  fireplaceState.flintEquipped = false;
  fireplaceState.logCount         = 0;
  fireplaceState.logBurnRemaining = 0;
  fireplaceState.logItemId        = null;
  fireplaceState.foodItemId       = null;
  fireplaceState.foodSlotQty      = 0;
  fireplaceState.flintEquipped = false;
  fireplaceState.sessionCooked = {};
  fireplaceState.lastCookedItemId = null;
  saveCookingState();
}

// --- UI updates ---
function updateFireplaceUI() {
  // Tool slot (flint, top-right of screen)
  const toolContent = document.getElementById('toolSlotContent');
  const toolCount   = document.getElementById('toolSlotCount');
  const toolBarFill = document.getElementById('toolSlotBarFill');
  if (toolContent) {
    const qty = getItemQty('flint');
    if (fireplaceState.flintEquipped && qty > 0) {
      const pct = getDurabilityPct('flint');
      setSlotIcon(toolContent, getItem('flint'));
      toolCount.textContent = `×${qty}`;
      if (toolBarFill) toolBarFill.style.width = pct + '%';
    } else {
      setSlotIcon(toolContent, null);
      toolCount.textContent = '';
      if (toolBarFill) toolBarFill.style.width = '0%';
    }
  }

  // Logs slot
  const logsContent  = document.getElementById('slotLogsContent');
  const logsCount    = document.getElementById('slotLogsCount');
  const logsBarFill  = document.getElementById('logsSlotBarFill');
  const logsSlot     = document.getElementById('slotLogs');
  if (logsContent) {
    if (fireplaceState.logCount > 0 || fireplaceState.logBurnRemaining > 0) {
      const logItem    = getItem(fireplaceState.logItemId || 'logs');
      const burnDur    = logItem ? (logItem.burnDuration || 1) : 1;
      const isMulti    = burnDur > 1;
      setSlotIcon(logsContent, logItem);
      logsCount.textContent   = `×${fireplaceState.logCount}`;
      if (logsSlot) logsSlot.title = logItem ? logItem.name : 'Logs';
      const logsBar = document.getElementById('logsSlotBar');
      if (isMulti && fireplaceState.logBurnRemaining > 0) {
        const pct = (fireplaceState.logBurnRemaining / burnDur) * 100;
        if (logsBar)    logsBar.style.visibility    = 'visible';
        if (logsBarFill) logsBarFill.style.display   = '';
        if (logsBarFill) logsBarFill.style.width = pct + '%';
      } else {
        if (logsBar)    logsBar.style.visibility    = 'hidden';
      }
    } else {
      setSlotIcon(logsContent, null);
      logsCount.textContent   = '';
      if (logsSlot) logsSlot.title = 'Add logs';
      if (logsBarFill) logsBarFill.style.display = 'none';
    }
  }

  // Output (cooked) slot
  const cookedContent = document.getElementById('slotCookedContent');
  const cookedCount   = document.getElementById('slotCookedCount');
  if (cookedContent) {
    const cookedId = fireplaceState.lastCookedItemId;
    if (cookedId) {
      const cookedItem = getItem(cookedId);
      const cookedQty  = getItemQty(cookedId);
      setSlotIcon(cookedContent, cookedItem);
      if (cookedCount) cookedCount.textContent = cookedQty > 0 ? `×${cookedQty}` : '';
    } else {
      cookedContent.textContent = '—';
      cookedContent.style.backgroundImage = '';
      if (cookedCount) cookedCount.textContent = '';
    }
  }

  // Food slot
  const foodContent = document.getElementById('slotFoodContent');
  const foodCount   = document.getElementById('slotFoodCount');
  const foodSlot    = document.getElementById('slotFood');
  if (foodContent) {
    if (fireplaceState.foodItemId) {
      const item = getItem(fireplaceState.foodItemId);
      const qty  = getItemQty(fireplaceState.foodItemId);
      setSlotIcon(foodContent, item);
      foodCount.textContent   = qty > 0 ? `×${qty}` : '×0';
      if (foodSlot) foodSlot.title = item ? item.name : 'Food';
      if (qty <= 0) fireplaceState.foodItemId = null;
    } else {
      setSlotIcon(foodContent, null);
      foodCount.textContent   = '';
      if (foodSlot) foodSlot.title = 'Add food';
    }
  }
}

// --- Slot Picker ---
function openSlotPicker(slotId) {
  _pendingSlot = slotId;
  const validIds = SLOT_VALID_ITEMS[slotId] || [];

  const grid  = document.getElementById('slotPickerGrid');
  const title = document.getElementById('slotPickerTitle');
  grid.innerHTML = '';

  const labels = { flint: 'Equip Flint', logs: 'Add Fuel', food: 'Choose Food' };
  title.textContent = labels[slotId] || 'Select Item';

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
    `;
    card.addEventListener('click', () => placeItemInSlot(slotId, itemId));
    grid.appendChild(card);
  });

  if (!hasAny) {
    grid.innerHTML = '<div class="picker-empty">No items available</div>';
  }

  document.getElementById('slotPickerModal').classList.add('open');
}

function closeSlotPicker() {
  document.getElementById('slotPickerModal').classList.remove('open');
  _pendingSlot = null;
}

function placeItemInSlot(slotId, itemId) {
  const qty = getItemQty(itemId);
  if (qty <= 0) return;

  if (slotId === 'flint') {
    fireplaceState.flintEquipped = true;
  } else if (slotId === 'logs') {
    const logItem2 = getItem(itemId);
    const burnDur2 = logItem2 ? (logItem2.burnDuration || 1) : 1;
    fireplaceState.logItemId = itemId;
    fireplaceState.logCount  = getItemQty(itemId);
    if (fireplaceState.logBurnRemaining <= 0) {
      fireplaceState.logBurnRemaining = burnDur2;
    }
  } else if (slotId === 'food') {
    fireplaceState.foodItemId = itemId;

    // When food is switched, show the cooked version in the output slot
    const potentialCookedId = COOK_MAP[itemId];
    if (potentialCookedId) {
      fireplaceState.lastCookedItemId = potentialCookedId;
    }
  }

  saveCookingState();
  updateFireplaceUI();
  closeSlotPicker();
}

// --- Word handler ---
function onCookingWord(hadError, targetWord, mult) {
  const hasFire = isFire();
  const hasFood = fireplaceState.foodItemId && getItemQty(fireplaceState.foodItemId) > 0;
  let xpGain = 0;

  if (hasFire && hasFood) {
    const _logItem = getItem(fireplaceState.logItemId || 'logs');
    const _burnDur = _logItem ? (_logItem.burnDuration || 1) : 1;

    fireplaceState.logBurnRemaining--;
    if (fireplaceState.logBurnRemaining <= 0) {
      removeItem(fireplaceState.logItemId, 1);
      const remaining = getItemQty(fireplaceState.logItemId);
      if (remaining > 0) {
        fireplaceState.logCount         = remaining;
        fireplaceState.logBurnRemaining = _burnDur;
      } else {
        fireplaceState.logCount         = 0;
        fireplaceState.logBurnRemaining = 0;
      }
    }

    useDurability('flint');
    if (fireplaceState.flintTotalUses % FLINT_MAX_USES === 0) {
      // One flint used up — decrement inventory
      removeItem('flint', 1);
      // Reload total from remaining inventory
      fireplaceState.flintTotalUses = getItemQty('flint') * FLINT_MAX_USES;
    }

    removeItem(fireplaceState.foodItemId, 1);

    if (!hadError) {
        const cookedId = COOK_MAP[fireplaceState.foodItemId];
        if (cookedId) {
        fireplaceState.lastCookedItemId = cookedId;
        const awarded = awardItem(cookedId);
        if (!awarded) { showInventoryFullWarning(); return; }
        fireplaceState.sessionCooked[cookedId] = (fireplaceState.sessionCooked[cookedId] || 0) + 1;
        playDropSound([cookedId]);
        const cooked = getItem(cookedId);
        xpGain = cooked ? Math.round(cooked.xp * mult) : Math.round(targetWord.length * mult);
      }
    }

    if (getItemQty(fireplaceState.foodItemId) <= 0) {
      fireplaceState.foodItemId = null;
    }

    saveCookingState();
    updateFireplaceUI();

  } else {
    xpGain = 0;
  }

  if (xpGain > 0) {
    xp += xpGain;
    saveState();
    xpBar.innerHTML = `${xp} <span class="side-unit">XP</span>`;
    updateLevelUI();
    spawnXpDrop(xpGain, mult);
  }
}

// --- Init ---
function initCooking() {
  const toolSlot = document.getElementById('toolSlot');
  if (toolSlot) toolSlot.addEventListener('click', () => openSlotPicker('flint'));

  ['logs', 'food'].forEach(slotId => {
    const el = document.getElementById(`slot${slotId.charAt(0).toUpperCase() + slotId.slice(1)}`);
    if (el) el.addEventListener('click', () => openSlotPicker(slotId));
  });

  const closeBtn = document.getElementById('slotPickerClose');
  if (closeBtn) closeBtn.addEventListener('click', closeSlotPicker);

  const modal = document.getElementById('slotPickerModal');
  if (modal) modal.addEventListener('click', e => {
    if (e.target === modal) closeSlotPicker();
  });

  updateFireplaceUI();
}

document.addEventListener('DOMContentLoaded', initCooking);