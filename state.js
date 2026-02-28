// --- Location / travel state (loaded before scene state) ---
let currentLocation     = localStorage.getItem('typoria_location')       || 'forest';
let travelDest          = localStorage.getItem('typoria_travel_dest')    || '';
let travelStepsDone     = parseInt(localStorage.getItem('typoria_travel_steps') || '0');
let travelStepsRequired = parseInt(localStorage.getItem('typoria_travel_req')   || '0');
let travelStoryIndex    = parseInt(localStorage.getItem('typoria_story_idx')    || '0');

// gameMode: 'skill' | 'travel'
let gameMode = travelDest ? 'travel' : 'skill';

// If not traveling, sync scene from location
if (!travelDest && LOCATIONS[currentLocation]) {
  const locScene = LOCATIONS[currentLocation].scene;
  localStorage.setItem('typoria_scene', locScene);
}

// --- Scene state ---
let currentScene = LOCATIONS[currentLocation]
  ? LOCATIONS[currentLocation].scene
  : (localStorage.getItem('typoria_scene') || 'woodcutting');

let xp    = 0;
let items = 0;

function loadSceneState() {
  xp    = parseInt(localStorage.getItem(`typoria_xp_${currentScene}`)    || '0');
  items = parseInt(localStorage.getItem(`typoria_items_${currentScene}`) || '0');

  // Migrate old single-scene keys on first run of new version
  if (currentScene === 'woodcutting') {
    const oldXp   = localStorage.getItem('typoria_xp');
    const oldLogs = localStorage.getItem('typoria_logs');
    if (oldXp   !== null && !localStorage.getItem('typoria_xp_woodcutting'))   xp    = parseInt(oldXp);
    if (oldLogs !== null && !localStorage.getItem('typoria_items_woodcutting')) items = parseInt(oldLogs);
  }
}

function saveState() {
  localStorage.setItem(`typoria_xp_${currentScene}`,    xp);
  localStorage.setItem(`typoria_items_${currentScene}`, items);
}

loadSceneState();

let currentWordIndex = 0;