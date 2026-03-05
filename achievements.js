const SCENE_BACKGROUNDS = {
  woodcutting: "url('assets/img/trunk.png')",
  mining:      "url('assets/img/stone.jpg')",
  fishing:     "url('assets/img/plank.png')",
  cooking:     "url('assets/img/dirt.jpg')",
  travel:      "url('assets/img/path.png')",
  combat:      "url('assets/img/dungeon-sidebar.png')",
};

const unlockedAchievements = JSON.parse(localStorage.getItem('typoria_achievements')) || {};

const achievementQueue = [];
let achievementToastActive = false;
let achievementQueuePaused = false;

function unlockAchievement(id) {
  if (unlockedAchievements[id]) return;

  unlockedAchievements[id] = true;
  localStorage.setItem('typoria_achievements', JSON.stringify(unlockedAchievements));

  achievementQueue.push(id);
  if (!achievementToastActive) processAchievementQueue();
}

function processAchievementQueue() {
  if (achievementQueuePaused) return;

  if (achievementQueue.length === 0) {
    achievementToastActive = false;
    return;
  }

  achievementToastActive = true;
  const id = achievementQueue.shift();

  const toast = document.getElementById('achievementToast');
  const name  = document.getElementById('achievementToastName');

  const sceneKey = gameMode === 'travel' ? 'travel' : currentScene;
    // Set background based on current scene
  const bg = SCENE_BACKGROUNDS[sceneKey] || SCENE_BACKGROUNDS['woodcutting'];
  toast.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), ${bg}`;

  name.textContent = id;
  toast.classList.add('show');

  // Show for 5s, fade out, wait 2s, then show next
  setTimeout(() => {
    toast.classList.remove('show');
    // keep achievementToastActive = true during the gap!
    setTimeout(() => {
      achievementToastActive = false;
      processAchievementQueue();
    }, 2000);
  }, 5000);
}

const itemCounters = JSON.parse(localStorage.getItem('typoria_itemCounters')) || {};

// Used for Item Count Achievements
function trackGlobalItemCounts(id, qty) {
  itemCounters[id] = (itemCounters[id] || 0) + qty;
  if (id === "pine_logs" && itemCounters[id] >= 10) {
    unlockAchievement("Chop 10 pine logs!");
  }

  localStorage.setItem('typoria_itemCounters', JSON.stringify(itemCounters));
}

// Used for Streak Achievements
function checkStreakAchievements(streak) {
    if (streak >= 10) {
        unlockAchievement("Reach a streak of 10!");
    }
    if (streak >= 25) {
        unlockAchievement("Reach a streak of 25!");
    }
}

function checkAccuracyAchievements(quoteStreak) {
    console.log(`[achievements] checkAccuracyAchievements called, quoteStreak=${quoteStreak}`);
    if (quoteStreak === 1) { // 0 errors after quote completed
        unlockAchievement("Type a quote without making a single mistake!");
    }
    if (quoteStreak === 3) {
      unlockAchievement("Type 3 quotes in a row without making a single mistake!")
    }
}

// Used for Level Achievements
function checkLevelAchievements(skill, level) {
  if (skill === 'woodcutting') {
    if (level >= 10)  unlockAchievement('Reach Level 10 Woodcutting!');
    if (level >= 50)  unlockAchievement('Reach Level 50 Woodcutting!');
    if (level >= 99)  unlockAchievement('Reach Level 99 Woodcutting!');
  }
  if (skill === 'mining') {
    if (level >= 10)  unlockAchievement('Reach Level 10 Mining!');
    if (level >= 50)  unlockAchievement('Reach Level 50 Mining!');
    if (level >= 99)  unlockAchievement('Reach Level 99 Mining!');
  }
  if (skill === 'fishing') {
    if (level >= 10)  unlockAchievement('Reach Level 10 Fishing!');
    if (level >= 50)  unlockAchievement('Reach Level 50 Fishing!');
    if (level >= 99)  unlockAchievement('Reach Level 99 Fishing!');
  }
  if (skill === 'cooking') {
    if (level >= 10)  unlockAchievement('Reach Level 10 Cooking!');
    if (level >= 50)  unlockAchievement('Reach Level 50 Cooking!');
    if (level >= 99)  unlockAchievement('Reach Level 99 Cooking!');
  }
  if (skill === 'combat') {
    if (level >= 10)  unlockAchievement('Reach Level 10 Combat!');
    if (level >= 50)  unlockAchievement('Reach Level 50 Combat!');
    if (level >= 99)  unlockAchievement('Reach Level 99 Combat!');
  }
}

function checkTravelAchievements(locationId) {
  const loc = LOCATIONS[locationId];
  if (loc?.achievement) unlockAchievement(loc.achievement);

  // Check if all locations with achievements have been visited
  const all = Object.values(LOCATIONS).filter(l => l.achievement);
  if (all.every(l => unlockedAchievements[l.achievement])) {
    unlockAchievement('Discover all locations!');
  }
}

function checkWpmAchievements(wpm) {
  if (wpm >= 40)  unlockAchievement('Type at 40 WPM!');
  if (wpm >= 60)  unlockAchievement('Type at 60 WPM!');
  if (wpm >= 80)  unlockAchievement('Type at 80 WPM!');
  if (wpm >= 100) unlockAchievement('Type at 100 WPM!');
  if (wpm >= 120) unlockAchievement('Type at 120 WPM!');
}