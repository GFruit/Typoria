// --- Streak ---
let streak = 0;
let wordHadError = false;

function getMultiplier(s) {
  if (s >= 25) return 3;
  if (s >= 10) return 2;
  return 1;
}

function updateStreakUI() {
  document.getElementById('streakCount').textContent = streak;
  const mult = getMultiplier(streak);
  document.getElementById('streakMult').textContent = mult > 1 ? `×${mult}` : '';
  document.getElementById('streakFlame').style.opacity = streak > 0 ? '1' : '0.3';
}

// --- XP drops ---
function spawnXpDrop(amount, multiplier) {
  const container = document.getElementById('xpDropContainer');
  const el = document.createElement('div');
  el.className = 'xp-drop';
  el.textContent = multiplier > 1 ? `+${amount} XP ×${multiplier}` : `+${amount} XP`;
  const rect = document.getElementById('quoteDisplay').getBoundingClientRect();
  el.style.left = (rect.left + rect.width / 2) + 'px';
  el.style.top  = (rect.top - 10) + 'px';
  container.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}