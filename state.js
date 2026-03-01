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
// Single shared inventory object across all scenes
let inventoryData = {};

function loadInventory() {
  const saved = localStorage.getItem('typoria_inventory');
  if (saved) {
    inventoryData = JSON.parse(saved);
  } else {
    // Migrate old per-scene item counts
    inventoryData = {};
    const oldLogs  = localStorage.getItem('typoria_items_woodcutting');
    const oldRocks = localStorage.getItem('typoria_items_mining');
    if (oldLogs)  inventoryData['logs']  = parseInt(oldLogs);
    if (oldRocks) inventoryData['rocks'] = parseInt(oldRocks);
  }
}

function saveInventory() {
  localStorage.setItem('typoria_inventory', JSON.stringify(inventoryData));
}

function awardItem(id, qty = 1) {
  inventoryData[id] = (inventoryData[id] || 0) + qty;
  saveInventory();
}

function getItemQty(id) {
  return inventoryData[id] || 0;
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

let currentWordIndex = 0;