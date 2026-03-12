// --- Streak ---
let streak = 0;
let wordHadError = false;

const STREAK_TIERS = [
  { threshold: 25, mult: 3 },
  { threshold: 10, mult: 2 },
];

function getMultiplier(s) {
  for (const tier of STREAK_TIERS) {
    if (s >= tier.threshold) return tier.mult;
  }
  return 1;
}

function updateStreakUI() {
  const countEl = document.getElementById('streakCount');
  const multEl  = document.getElementById('streakMult');
  const mult    = getMultiplier(streak);

  const flameEl = document.getElementById('streakFlame');
  flameEl.style.opacity = streak > 0 ? '1' : '0.3';
  flameEl.src = mult === 3 ? 'assets/img/flame_purple.png'
              : mult === 2 ? 'assets/img/flame_red.png'
              : 'assets/img/flame_green.png';

  countEl.textContent = streak;
  countEl.classList.remove('mult-2', 'mult-3');
  multEl.classList.remove('mult-2', 'mult-3');

  if (mult > 1) {
    multEl.textContent = `×${mult}`;
    countEl.classList.add(`mult-${mult}`);
    multEl.classList.add(`mult-${mult}`);
  } else {
    multEl.textContent = '';
  }

  document.getElementById('streakFlame').style.opacity = streak > 0 ? '1' : '0.3';

  const topStreak = parseInt(localStorage.getItem('typoria_top_streak') || '0');
  if (streak > topStreak) {
    localStorage.setItem('typoria_top_streak', streak);
    checkStreakAchievements(streak);
  }
  document.getElementById('streakTop').textContent = `Top: ${Math.max(streak, topStreak)}`;
}

// --- XP drops ---
function spawnXpDrop(amount, multiplier) {
  if (typeof xpDropsEnabled !== 'undefined' && !xpDropsEnabled) return;
  const container = document.getElementById('xpDropContainer');
  const el = document.createElement('div');
  el.className = 'xp-drop';
  if (multiplier >= 3) el.classList.add('mult-3');
  else if (multiplier === 2) el.classList.add('mult-2');

  const multLabel = multiplier > 1
    ? `<span class="xp-drop-mult"> ×${multiplier}</span>`
    : '';
  el.innerHTML = `+${amount} XP${multLabel}`;

  const rect = document.getElementById('quoteDisplay').getBoundingClientRect();
  el.style.left = (rect.left + rect.width / 2) + 'px';
  el.style.top  = (rect.top - 10) + 'px';
  container.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}