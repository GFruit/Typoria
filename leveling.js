// --- Leveling ---
const MAX_LEVEL = 99;
let _lastLevel = 1;

function xpForLevel(level) {
  return Math.floor(4 * Math.pow(level, 1.5));
}

function getLevelInfo(totalXp) {
  let level = 1, remaining = totalXp;
  while (level < MAX_LEVEL) {
    const needed = xpForLevel(level);
    if (remaining < needed) break;
    remaining -= needed;
    level++;
  }
  const neededXp = level < MAX_LEVEL ? xpForLevel(level) : xpForLevel(MAX_LEVEL);
  return { level, currentXp: remaining, neededXp };
}

function updateLevelUI() {
  const { level, currentXp, neededXp } = getLevelInfo(xp);
  const wcLevelEl = document.getElementById('wcLevel');
  wcLevelEl.textContent = level;
  if (level > _lastLevel) {
    wcLevelEl.classList.remove('level-up');
    void wcLevelEl.offsetWidth;
    wcLevelEl.classList.add('level-up');
    _lastLevel = level;
  }
  const pct = level < MAX_LEVEL ? (currentXp / neededXp) * 100 : 100;
  document.getElementById('wcBar').style.width = pct + '%';
  document.getElementById('wcXpLabel').textContent =
    level < MAX_LEVEL ? `${currentXp} / ${neededXp} XP` : 'MAX LEVEL';
}