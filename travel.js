
// --- Arrival guard ---
let arriving = false;
let transitioning = false;

let sceneBeforeTravel = null;

// Letter counter (shown in sidebar Journey section)
let travelLettersDone = 0;

// --- Agility skill ---
let agilityXp        = parseInt(localStorage.getItem('typoria_xp_agility') || '0');
let agilityLastLevel = 1;

let previousLocation = localStorage.getItem('typoria_prev_location') || 'forest'; // used for going back to previous location after death in combat


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
  // Progress bar fills based on word position within the quote
  const pct = totalWords > 0
    ? Math.min((wordIndex / totalWords) * 100, 100)
    : 0;
  document.getElementById('travelProgressFill').style.width   = pct + '%';
  document.getElementById('travelProgressText').textContent = `${wordIndex} / ${totalWords} words`;

  const dest = LOCATIONS[travelDest];
  if (dest) {
    document.getElementById('travelToName').textContent       = dest.name + ' ' + dest.icon;
    document.getElementById('travelDestName').textContent     = dest.name;
    document.getElementById('travelStepsDisplay').textContent = travelLettersDone;
  }
  document.getElementById('travelFromName').textContent =
    LOCATIONS[currentLocation] ? LOCATIONS[currentLocation].name : '';
}

// Called by typing.js on every completed word while traveling
function onTravelWordComplete(xpGain, mult, wordIndex, totalWords) {
  playSound(['assets/sfx/walk.ogg', 'assets/sfx/walk2.mp3', 'assets/sfx/walk3.mp3'], 0.5, 1) //play Sound
  agilityXp        += xpGain;
  travelLettersDone += xpGain; // xpGain = word length × multiplier = letters typed
  saveAgilityState();
  updateAgilityUI();
  updateTravelProgressBar(wordIndex + 1, totalWords);

  // Arrive when last word of the quote is typed
  if (wordIndex + 1 >= totalWords) {
    travelStepsDone = 1;
    saveTravelState();
    wpmOnQuoteComplete();
    typingInput.disabled = true;
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
    localStorage.removeItem('typoria_combat_enemy');    // ← add
    localStorage.removeItem('typoria_combat_enemy_hp'); // ← add
  }
  travelDest          = destId;
  travelStepsDone     = 0;
  travelStepsRequired = route.quotes;
  travelLettersDone   = 0;
  gameMode            = 'travel';

  saveTravelState();
  enterTravelMode();
}

// --- Enter / exit travel mode ---
function enterTravelMode() {
  sceneBeforeTravel = currentScene;
  stopEnemyAttackTimer();
  gameMode = 'travel';
  currentScene = 'travel';
  document.body.className = 'mode-travel scene-' +
    (LOCATIONS[travelDest] ? LOCATIONS[travelDest].scene : currentScene);

  _setCookingVisible(false);  // ← add this

  agilityLastLevel = getLevelInfo(agilityXp).level;
  updateAgilityUI();
  updateTravelProgressBar(0, 1);

  //rebuildQuotePool();
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

  // Only wait for the currently showing toast, not the whole queue
  if (achievementToastActive) {
    setTimeout(arriveAtDestination, 100);
    return;
  }

  // Pause queue so no new toasts fire during transition
  achievementQueuePaused = true;

  arriving = true;

  const destId = travelDest;

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
  const destScene = LOCATIONS[destId].scene;
  fromEl.style.backgroundImage = "url('assets/img/travel.png')";
  toEl.style.backgroundImage   = bgMap[destScene] || "url('assets/img/forest.png')";

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

    currentScene = LOCATIONS[currentLocation].scene;
    if (sceneBeforeTravel === 'cooking') {
      endCookingSession();
    }
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
    arriving = false;
    typingInput.disabled = false;
    typingInput.focus();
    document.getElementById("nextBtn").style.pointerEvents = '';
    transitioning = false;
    achievementQueuePaused = false;
    if (achievementQueue.length > 0) processAchievementQueue();
    checkTravelAchievements(destId); //e.g. Travel to Mine, Travel to Campsite, etc.
  }, 3000);
}

function showArrivalBanner(locationName) {
  const banner = document.getElementById('arrivalBanner');
  banner.textContent = `You have arrived at ${locationName}!`;
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 3500);
}