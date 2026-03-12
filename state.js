// --- Location / travel state ---
let currentLocation     = localStorage.getItem('typoria_location')       || 'forest';
let travelDest          = localStorage.getItem('typoria_travel_dest')    || '';
let travelStepsDone     = parseInt(localStorage.getItem('typoria_travel_steps') || '0');
let travelStepsRequired = parseInt(localStorage.getItem('typoria_travel_req')   || '0');
let travelStoryIndex    = parseInt(localStorage.getItem('typoria_story_idx')    || '0');



let gameMode = travelDest ? 'travel' : 'skill';

if (!travelDest && LOCATIONS[currentLocation]) {
  localStorage.setItem('typoria_scene', LOCATIONS[currentLocation].scene);
}

// --- Scene state ---
let currentScene = LOCATIONS[currentLocation]
  ? LOCATIONS[currentLocation].scene
  : (localStorage.getItem('typoria_scene') || 'woodcutting');

let xp = 0;





// --- Inventory ---
// inventorySlots:   ordered array of 24 slot IDs (null = empty)
// inventorySlotQty: parallel array — qty stored in each slot index
// inventoryData:    { id: totalQty } — summed total, used by the rest of the code
const INVENTORY_SIZE = 24;
const MAX_STACK = 50;
let inventorySlots    = new Array(INVENTORY_SIZE).fill(null);
let inventorySlotQty  = new Array(INVENTORY_SIZE).fill(0);
let inventoryData     = {};
let discoveredItems = new Set(JSON.parse(localStorage.getItem('typoria_discovered') || '[]'));

function purgeEmptySlots() {
  let changed = false;
  for (let i = 0; i < INVENTORY_SIZE; i++) {
    if (inventorySlots[i] !== null && inventorySlotQty[i] <= 0) {
      inventorySlots[i]   = null;
      inventorySlotQty[i] = 0;
      changed = true;
    }
  }
  if (changed) { _rebuildInventoryData(); saveInventory(); }
}

// Recompute inventoryData totals from the slot arrays
function _rebuildInventoryData() {
  inventoryData = {};
  for (let i = 0; i < INVENTORY_SIZE; i++) {
    const id = inventorySlots[i];
    if (id) inventoryData[id] = (inventoryData[id] || 0) + inventorySlotQty[i];
  }
}

function loadInventory() {
  const saved      = localStorage.getItem('typoria_inventory');
  const savedSlots = localStorage.getItem('typoria_inv_slots');
  const savedQtys  = localStorage.getItem('typoria_inv_slot_qty');

  if (saved) {
    inventoryData = JSON.parse(saved);
  } else {
    inventoryData = {};
    const oldLogs  = localStorage.getItem('typoria_items_woodcutting');
    const oldRocks = localStorage.getItem('typoria_items_mining');
    if (oldLogs)  inventoryData['logs']  = parseInt(oldLogs);
    if (oldRocks) inventoryData['rocks'] = parseInt(oldRocks);
  }

  if (savedSlots) {
    inventorySlots = JSON.parse(savedSlots);
    while (inventorySlots.length < INVENTORY_SIZE) inventorySlots.push(null);
    inventorySlots = inventorySlots.slice(0, INVENTORY_SIZE);
  } else {
    inventorySlots = new Array(INVENTORY_SIZE).fill(null);
    let slotIdx = 0;
    Object.keys(inventoryData).forEach(id => {
      if (slotIdx < INVENTORY_SIZE) inventorySlots[slotIdx++] = id;
    });
  }

  if (savedQtys) {
    inventorySlotQty = JSON.parse(savedQtys);
    while (inventorySlotQty.length < INVENTORY_SIZE) inventorySlotQty.push(0);
    inventorySlotQty = inventorySlotQty.slice(0, INVENTORY_SIZE);
  } else {
    // Migrate: distribute existing totals across MAX_STACK-capped slots
    inventorySlotQty = new Array(INVENTORY_SIZE).fill(0);
    // First pass: assign qtys to the slots we already placed above
    for (let i = 0; i < INVENTORY_SIZE; i++) {
      const id = inventorySlots[i];
      if (id && inventoryData[id]) {
        inventorySlotQty[i] = Math.min(inventoryData[id], MAX_STACK);
      }
    }
    // If any item had qty > MAX_STACK, distribute overflow into new slots
    Object.keys(inventoryData).forEach(id => {
      let remaining = inventoryData[id];
      for (let i = 0; i < INVENTORY_SIZE; i++) {
        if (inventorySlots[i] === id) { remaining -= inventorySlotQty[i]; }
      }
      while (remaining > 0) {
        const freeSlot = inventorySlots.indexOf(null);
        if (freeSlot === -1) break;
        const toAdd = Math.min(remaining, MAX_STACK);
        inventorySlots[freeSlot]   = id;
        inventorySlotQty[freeSlot] = toAdd;
        remaining -= toAdd;
      }
    });
  }

  // Prune slots whose item no longer has any data
  purgeEmptySlots();
  _rebuildInventoryData();

  Object.keys(inventoryData).forEach(id => discoveredItems.add(id));
  localStorage.setItem('typoria_discovered', JSON.stringify([...discoveredItems]));
}

function saveInventory() {
  _rebuildInventoryData();
  localStorage.setItem('typoria_inventory',      JSON.stringify(inventoryData));
  localStorage.setItem('typoria_inv_slots',      JSON.stringify(inventorySlots));
  localStorage.setItem('typoria_inv_slot_qty',   JSON.stringify(inventorySlotQty));
}

// Returns true on success, false if no free slot available for overflow
function awardItem(id, qty = 1) {
  let remaining = qty;

  while (remaining > 0) {
    // Find an existing non-full slot for this item
    let targetSlot = -1;
    for (let i = 0; i < INVENTORY_SIZE; i++) {
      if (inventorySlots[i] === id && inventorySlotQty[i] < MAX_STACK) {
        targetSlot = i;
        break;
      }
    }

    if (targetSlot !== -1) {
      const room  = MAX_STACK - inventorySlotQty[targetSlot];
      const toAdd = Math.min(remaining, room);
      inventorySlotQty[targetSlot] += toAdd;
      remaining -= toAdd;
    } else {
      // Open a new slot
      const freeSlot = inventorySlots.indexOf(null);
      if (freeSlot === -1) {
        // Inventory full — sync data for whatever was partially awarded, then bail
        _rebuildInventoryData();
        saveInventory();
        updateInventoryBar();
        return false;
      }
      const toAdd = Math.min(remaining, MAX_STACK);
      inventorySlots[freeSlot]   = id;
      inventorySlotQty[freeSlot] = toAdd;
      remaining -= toAdd;
    }
  }

  if (!discoveredItems.has(id)) {
    discoveredItems.add(id);
    localStorage.setItem('typoria_discovered', JSON.stringify([...discoveredItems]));
  }

  _rebuildInventoryData();
  saveInventory();
  trackGlobalItemCounts(id, qty);
  updateInventoryBar();
  return true;
}

// Remove qty of an item; drains from the last slot of that id first
function removeItem(id, qty = 1) {
  let remaining = qty;
  // Drain from last matching slot first (keeps earlier slots full)
  for (let i = INVENTORY_SIZE - 1; i >= 0 && remaining > 0; i--) {
    if (inventorySlots[i] !== id) continue;
    const toDrain = Math.min(remaining, inventorySlotQty[i]);
    inventorySlotQty[i] -= toDrain;
    remaining -= toDrain;
    if (inventorySlotQty[i] <= 0) {
      inventorySlots[i]   = null;
      inventorySlotQty[i] = 0;
    }
  }
  _rebuildInventoryData();
  saveInventory();
  updateInventoryBar();
}

function getItemQty(id) {
  return inventoryData[id] || 0;
}

// Returns the qty stored in a specific slot index (used by inventory UI)
function getSlotQty(slotIndex) {
  return inventorySlotQty[slotIndex] || 0;
}

function getUsedSlots() {
  return inventorySlots.filter(Boolean).length;
}

function isInventoryFull() {
  return inventorySlots.indexOf(null) === -1;
}

// Sidebar inventory bar
function updateInventoryBar() {
  const used  = getUsedSlots();
  const fill  = document.getElementById('invBarFill');
  const label = document.getElementById('invBarLabel');
  if (!fill || !label) return;
  fill.style.width = (used / INVENTORY_SIZE * 100) + '%';
  fill.classList.toggle('inv-bar-full',    used >= INVENTORY_SIZE);
  fill.classList.toggle('inv-bar-warning', used >= INVENTORY_SIZE - 4 && used < INVENTORY_SIZE);
  label.textContent = `${used} / ${INVENTORY_SIZE}`;
}

// Durability State //

let durabilityState = JSON.parse(localStorage.getItem('typoria_durability') || '{}');

function saveDurability() {
  localStorage.setItem('typoria_durability', JSON.stringify(durabilityState));
}

function useDurability(id) {
const item = getItem(id);
if (!item || !item.maxDurability) return;
if (!durabilityState[id] || durabilityState[id] <= 0) {
durabilityState[id] = item.maxDurability;
}
durabilityState[id]--;
if (durabilityState[id] <= 0) {
removeItem(id, 1);
durabilityState[id] = getItemQty(id) > 0 ? item.maxDurability : 0;
}
saveDurability();
}

function getDurabilityPct(id) {
  const item = getItem(id);
  if (!item || !item.maxDurability) return 100;
  if (!durabilityState[id]) return 100;
  return (durabilityState[id] / item.maxDurability) * 100;
}

function loadSceneState() {
  xp = parseInt(localStorage.getItem(`typoria_xp_${currentScene}`) || '0');

  // Migrate old single-scene XP key
  if (currentScene === 'woodcutting') {
    const oldXp = localStorage.getItem('typoria_xp');
    if (oldXp !== null && !localStorage.getItem('typoria_xp_woodcutting')) {
      xp = parseInt(oldXp);
    }
  }
}

function saveState() {
  localStorage.setItem(`typoria_xp_${currentScene}`, xp);
}



loadInventory();
loadSceneState();
// updateInventoryBar() will be called once DOM is ready
document.addEventListener('DOMContentLoaded', updateInventoryBar);

let currentWordIndex = 0;