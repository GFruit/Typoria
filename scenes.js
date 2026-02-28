// --- Scene definitions ---
const SCENES = {
  woodcutting: {
    id:        'woodcutting',
    name:      'Woodcutting',
    skillIcon: '🌲',
    itemName:  'Logs',
    itemIcon:  '🪵',
    bodyClass: 'scene-woodcutting',
    quotes:    () => quotes,
  },
  mining: {
    id:        'mining',
    name:      'Mining',
    skillIcon: '⛏️',
    itemName:  'Rocks',
    itemIcon:  '🪨',
    bodyClass: 'scene-mining',
    quotes:    () => miningQuotes,
  },
};

function getScene() {
  return SCENES[currentScene];
}

function updateSceneUI() {
  if (gameMode === 'travel') {
    // Body class reflects destination scene for color theming
    const destScene = travelDest && LOCATIONS[travelDest]
      ? LOCATIONS[travelDest].scene
      : currentScene;
    document.body.className = 'mode-travel scene-' + destScene;
    return;
  }

  const scene = getScene();
  document.body.className = 'mode-skill ' + scene.bodyClass;

  document.getElementById('wcIcon').textContent     = scene.skillIcon;
  document.getElementById('skillLabel').textContent = scene.name;
  document.getElementById('itemIcon').textContent   = scene.itemIcon;
  document.getElementById('itemName').textContent   = scene.itemName;
  document.getElementById('itemsCount').textContent = items;
  xpBar.innerHTML = `${xp} <span class="side-unit">XP</span>`;

  _lastLevel = getLevelInfo(xp).level;
  updateLevelUI();
}