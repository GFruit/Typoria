// --- Scene definitions ---
const SCENES = {
  woodcutting: {
    id:        'woodcutting',
    name:      'Woodcutting',
    skill:     'woodcutting',
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
  fishing: {
    id:        'fishing',
    name:      'Fishing',
    skill:     'fishing',
    skillIcon: '🎣',
    bodyClass: 'scene-fishing',
    quotes:    () => fishingQuotes,
  },
  cooking: {
    id:        'cooking',
    name:      'Cooking',
    skill:     'cooking',
    skillIcon: '🍳',
    bodyClass: 'scene-cooking',
    quotes:    () => cookingQuotes,
  },
  combat: {
    id:        'combat',
    name:      'Combat',
    skill:     'combat',
    skillIcon: '⚔️',
    bodyClass: 'scene-combat',
    quotes:    () => combatQuotes,
  },
  travel: {
  id:        'travel',
  name:      'Travel',
  skill:     'agility',
  skillIcon: '🏃',
  bodyClass: 'mode-travel',
  quotes:    () => travelQuotes,
},
};

function getScene() {
  return SCENES[currentScene];
}

function _setCookingVisible(visible) {
  document.querySelectorAll('.cooking-only').forEach(el => {
    el.style.display = visible ? '' : 'none';
  });
  const toolSlot = document.getElementById('toolSlot');
  if (toolSlot) toolSlot.style.display = visible ? 'flex' : 'none';
}

function updateSceneUI() {
  if (gameMode === 'travel') {
    const destScene = travelDest && LOCATIONS[travelDest]
      ? LOCATIONS[travelDest].scene : currentScene;
    document.body.className = 'mode-travel scene-' + destScene;
    _setCookingVisible(false);
    return;
  }

  const scene = getScene();

  if (scene.id !== 'combat') stopEnemyAttackTimer();
  if (scene.id === 'combat') initCombat();

  const isCooking = scene.id === 'cooking';

  document.body.className = 'mode-skill ' + scene.bodyClass;
  document.getElementById('wcIcon').textContent     = scene.skillIcon;
  document.getElementById('skillLabel').textContent = scene.name;
  xpBar.innerHTML = `${xp} <span class="side-unit">XP</span>`;
  document.getElementById('lastDropIcons').textContent = '';

  _setCookingVisible(isCooking);
  if (isCooking) updateFireplaceUI();

  _lastLevel = getLevelInfo(xp).level;
  updateLevelUI();
}