// --- Scene definitions ---
const SCENES = {
  woodcutting: {
    id:        'woodcutting',
    name:      'Woodcutting',
    skill:     'woodcutting',   // matches item.skill in ITEM_REGISTRY
    skillIcon: '🌲',
    bodyClass: 'scene-woodcutting',
    quotes:    () => quotes,
  },
  mining: {
    id:        'mining',
    name:      'Mining',
    skill:     'mining',
    skillIcon: '⛏️',
    bodyClass: 'scene-mining',
    quotes:    () => miningQuotes,
  },
};

function getScene() {
  return SCENES[currentScene];
}

function updateSceneUI() {
  if (gameMode === 'travel') {
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
  xpBar.innerHTML = `${xp} <span class="side-unit">XP</span>`;

  // Clear last drop display on scene switch
  document.getElementById('lastDropIcons').textContent = '—';

  _lastLevel = getLevelInfo(xp).level;
  updateLevelUI();
}