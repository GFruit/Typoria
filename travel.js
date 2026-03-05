// --- Travel state ---
let arriving     = false;
let transitioning = false;
let sceneBeforeTravel = null;

let travelLettersDone = 0;

let previousLocation = localStorage.getItem('typoria_prev_location') || 'forest';

// --- Agility skill ---
let agilityXp        = parseInt(localStorage.getItem('typoria_xp_agility') || '0');
let agilityLastLevel = 1;

function updateAgilityUI() {
  const { level, currentXp, neededXp } = getLevelInfo(agilityXp);
  const el = document.getElementById('agilLevel');
  el.textContent = `${level} / ${MAX_LEVEL}`;

  if (level > agilityLastLevel) {
    el.classList.remove('level-up');
    void el.offsetWidth;
    el.classList.add('level-up');
    agilityLastLevel = level;
    playLevelUpSound();
  }

  const pct = level < MAX_LEVEL ? (currentXp / neededXp) * 100 : 100;
  document.getElementById('agilBar').style.width     = pct + '%';
  document.getElementById('agilXpLabel').textContent =
    level < MAX_LEVEL ? `${currentXp} / ${neededXp} XP` : 'MAX LEVEL';
}

function saveAgilityState() {
  localStorage.setItem('typoria_xp_agility', agilityXp);
}

// --- Travel state persistence ---
function saveTravelState() {
  localStorage.setItem('typoria_location',     currentLocation);
  localStorage.setItem('typoria_travel_dest',  travelDest);
  localStorage.setItem('typoria_travel_steps', travelStepsDone);
  localStorage.setItem('typoria_travel_req',   travelStepsRequired);
}

// --- Travel progress bar ---
function updateTravelProgressBar(wordIndex, totalWords) {
  const pct = totalWords > 0 ? Math.min((wordIndex / totalWords) * 100, 100) : 0;
  document.getElementById('travelProgressFill').style.width = pct + '%';
  document.getElementById('travelProgressText').textContent = `${wordIndex} / ${totalWords} words`;

  const dest = LOCATIONS[travelDest];
  if (dest) {
    document.getElementById('travelToName').textContent       = dest.name + ' ' + dest.icon;
    document.getElementById('travelDestName').textContent     = dest.name;
    document.getElementById('travelStepsDisplay').textContent = travelLettersDone;
  }
  document.getElementById('travelFromName').textContent =
    LOCATIONS[currentLocation]?.name || '';
}

// Called by typing.js on every completed word while in the travel scene
function onTravelWordComplete(xpGain, mult, wordIndex, totalWords) {
  playSound(['assets/sfx/walk.ogg', 'assets/sfx/walk2.mp3', 'assets/sfx/walk3.mp3'], 0.5, 1);
  agilityXp         += xpGain;
  travelLettersDone += xpGain;
  saveAgilityState();
  updateAgilityUI();
  updateTravelProgressBar(wordIndex + 1, totalWords);

  // Arrive when the last word of the quote is typed
  if (wordIndex + 1 >= totalWords) {
    travelStepsDone = 1;
    saveTravelState();
    transitioning = true;
    document.getElementById("nextBtn").style.pointerEvents = 'none';
    setTimeout(arriveAtDestination, 2000);
  }
}

// --- Start traveling ---
function startTravel(destId) {
  const route = getRoute(currentLocation, destId);
  if (!route) return;

  if (currentScene === 'combat') {
    collectSessionLoot();
    playerHp = PLAYER_MAX_HP;
    localStorage.removeItem('typoria_combat_loot');
    localStorage.removeItem('typoria_combat_hp');
    localStorage.removeItem('typoria_combat_enemy');
    localStorage.removeItem('typoria_combat_enemy_hp');
  }

  travelDest          = destId;
  travelStepsDone     = 0;
  travelStepsRequired = route.quotes;
  travelLettersDone   = 0;

  saveTravelState();
  enterTravelMode();
}

// --- Enter / exit travel mode ---
function enterTravelMode() {
  sceneBeforeTravel = currentScene;
  stopEnemyAttackTimer();
  currentScene = 'travel';
  gameMode     = 'travel';
  document.body.className = 'mode-travel scene-' +
    (LOCATIONS[travelDest]?.scene ?? currentScene);

  _setCookingVisible(false);

  agilityLastLevel = getLevelInfo(agilityXp).level;
  updateAgilityUI();
  updateTravelProgressBar(0, 1);

  buildQuote(getNextQuote());
  updateTravelProgressBar(0, wordElements.length);
  typingInput.focus();
}

function exitTravelMode() {
  gameMode = 'skill';
}

// --- Arrive at destination ---
function arriveAtDestination() {
  if (arriving) return;
  if (!travelDest || !LOCATIONS[travelDest]) return;

  typingInput.disabled = true;

  // Pause immediately so no new toasts start
  achievementQueuePaused = true;

  // Wait for any active achievement toast before transitioning
  if (achievementToastActive) {
    setTimeout(arriveAtDestination, 100);
    return;
  }

  arriving = true;

  const destId  = travelDest;
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

  fromEl.style.backgroundImage = "url('assets/img/travel.png')";
  toEl.style.backgroundImage   = bgMap[LOCATIONS[destId].scene] || "url('assets/img/forest.png')";

  overlay.classList.add('active');
  fromEl.classList.add('fading');

  setTimeout(() => {
    previousLocation = currentLocation;
    localStorage.setItem('typoria_prev_location', previousLocation);

    currentLocation     = destId;
    travelDest          = '';
    travelStepsDone     = 0;
    travelStepsRequired = 0;
    travelLettersDone   = 0;
    saveTravelState();

    if (sceneBeforeTravel === 'cooking') endCookingSession();
    sceneBeforeTravel = null;

    currentScene = LOCATIONS[currentLocation].scene;
    localStorage.setItem('typoria_scene', currentScene);
    loadSceneState();

    exitTravelMode();
    updateSceneUI();
    updateStreakUI();
    buildQuote(getNextQuote());

    overlay.classList.remove('active');
    fromEl.classList.remove('fading');
    arriving             = false;
    transitioning        = false;
    typingInput.disabled = false;
    typingInput.focus();
    document.getElementById("nextBtn").style.pointerEvents = '';

    achievementQueuePaused = false;
    if (achievementQueue.length > 0) processAchievementQueue();
    checkTravelAchievements(destId);
  }, 3000);
}

function showArrivalBanner(locationName) {
  const banner = document.getElementById('arrivalBanner');
  banner.textContent = `You have arrived at ${locationName}!`;
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 3500);
}