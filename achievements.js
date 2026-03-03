const SCENE_BACKGROUNDS = {
  woodcutting: "url('assets/img/trunk.png')",
  mining:      "url('assets/img/stone.jpg')",
  fishing:     "url('assets/img/plank.png')",
  cooking:     "url('assets/img/dirt.jpg')",
  travel:      "url('assets/img/path.png')",
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
    achievementToastActive = false;
    setTimeout(processAchievementQueue, 2000);
  }, 5000);
}

const itemCounters = JSON.parse(localStorage.getItem('typoria_itemCounters')) || {};

// Used for Item Count Achievements
function trackGlobalItemCounts(id, qty) {
  itemCounters[id] = (itemCounters[id] || 0) + qty;
  if (id === "logs" && itemCounters[id] >= 10) {
    unlockAchievement("Chop 10 logs!");
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

function checkAccuracyAchievements(wordErrorCount) {
    if (wordErrorCount === 0) { // 0 errors after quote completed
        unlockAchievement("Type a quote without making a single mistake!");
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
}

function checkTravelAchievements(locationId) {
  if (locationId === 'mine') unlockAchievement('Visit the Mine!');
  if (locationId === 'lake') unlockAchievement('Visit the Lake!');
  if (locationId === 'campsite') unlockAchievement('Visit the Campsite!');
  if (unlockedAchievements['Visit the Mine!'] &&
    unlockedAchievements['Visit the Lake!'] &&
    unlockedAchievements['Visit the Campsite!']
  ) {
    unlockAchievement('Discover all locations!')
  }
}

function checkWpmAchievements(wpm) {
  if (wpm >= 40)  unlockAchievement('Type at 40 WPM!');
  if (wpm >= 60)  unlockAchievement('Type at 60 WPM!');
  if (wpm >= 80)  unlockAchievement('Type at 80 WPM!');
  if (wpm >= 100) unlockAchievement('Type at 100 WPM!');
  if (wpm >= 120) unlockAchievement('Type at 120 WPM!');
}