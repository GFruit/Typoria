// --- Settings modal ---

const settingsModal = document.getElementById('settingsModal');

document.getElementById('settingsBtn').addEventListener('click', () => {
  settingsModal.classList.add('open');
});

document.getElementById('settingsCloseBtn').addEventListener('click', () => {
  settingsModal.classList.remove('open');
});

settingsModal.addEventListener('click', e => {
  if (e.target === settingsModal) settingsModal.classList.remove('open');
});

// --- Audio button labels ---
// Keeps Music / SFX button text in sync with muted state,
// which is toggled elsewhere by music.js / sounds.js.

function syncAudioBtnLabels() {
  const mBtn = document.getElementById('musicBtn');
  const sBtn = document.getElementById('sfxBtn');
  if (mBtn) mBtn.textContent = mBtn.classList.contains('muted') ? '🎵 Off' : '🎵 On';
  if (sBtn) sBtn.textContent = sBtn.classList.contains('muted') ? '🔊 Off' : '🔊 On';
}

const audioObserver = new MutationObserver(syncAudioBtnLabels);
['musicBtn', 'sfxBtn'].forEach(id => {
  const el = document.getElementById(id);
  if (el) audioObserver.observe(el, { attributes: true, attributeFilter: ['class'] });
});

syncAudioBtnLabels();

// --- XP Drops toggle ---
let xpDropsEnabled = localStorage.getItem('typoria_xp_drops') !== 'off';

function syncXpDropsBtn() {
  const btn = document.getElementById('xpDropsBtn');
  if (!btn) return;
  btn.textContent = xpDropsEnabled ? '✨ On' : '✨ Off';
  btn.classList.toggle('muted', !xpDropsEnabled);
}

document.getElementById('xpDropsBtn').addEventListener('click', () => {
  xpDropsEnabled = !xpDropsEnabled;
  localStorage.setItem('typoria_xp_drops', xpDropsEnabled ? 'on' : 'off');
  syncXpDropsBtn();
});

syncXpDropsBtn();
// --- Streak HUD toggle ---
let streakHudEnabled = localStorage.getItem('typoria_streak_hud') !== 'off';

function syncStreakHudBtn() {
  const btn = document.getElementById('streakHudBtn');
  if (!btn) return;
  btn.textContent = streakHudEnabled ? '🔥 On' : '🔥 Off';
  btn.classList.toggle('muted', !streakHudEnabled);
  const hud = document.getElementById('streakHud');
  if (hud) hud.style.display = streakHudEnabled ? '' : 'none';
}

document.getElementById('streakHudBtn').addEventListener('click', () => {
  streakHudEnabled = !streakHudEnabled;
  localStorage.setItem('typoria_streak_hud', streakHudEnabled ? 'on' : 'off');
  syncStreakHudBtn();
});

syncStreakHudBtn();