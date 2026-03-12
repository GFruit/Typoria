// --- Sound Effects ---
// Uses new Audio() so it works on file:// without a server.
// Solves the cold-start cutoff by silently priming all sounds
// on the first user keypress — after that everything is pre-decoded.

const _audioCache = {};
let _primed = false;

// Shared AudioContext — browsers suspend it when another app holds audio focus.
// We resume it on every user interaction so sounds work alongside Spotify etc.
const _audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function _resumeAudioCtx() {
  if (_audioCtx.state === 'suspended') _audioCtx.resume().catch(() => {});
}

function preloadSounds() {
  const filenames = [...new Set(
    ITEM_REGISTRY.map(i => i.sound).filter(Boolean)
  )];
  filenames.forEach(filename => {
    const audio = new Audio(filename);
    audio.preload = 'auto';
    _audioCache[filename] = audio;
  });
}

// Play every sound once at volume 0 to force the browser to fully
// decode and buffer them. Called on first keypress.
function primeSounds() {
  if (_primed) return;
  _primed = true;
  _resumeAudioCtx();
  Object.values(_audioCache).forEach(audio => {
    audio.volume = 0;
    const p = audio.play();
    if (p) p.then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0.5;
    }).catch(() => {});
  });
}

function getRarestItem(droppedIds) {
  if (!droppedIds || droppedIds.length === 0) return null;
  return droppedIds.reduce((rarest, id) => {
    const item = getItem(id);
    if (!item || !item.drops) return rarest;
    const maxChance = Math.max(...item.drops.map(t => t.chance));
    const rarestItem = getItem(rarest);
    if (!rarestItem || !rarestItem.drops) return id;
    const rarestChance = Math.max(...rarestItem.drops.map(t => t.chance));
    return maxChance < rarestChance ? id : rarest;
  }, droppedIds[0]);
}

function playDropSound(droppedIds) {
  if (!_sfxEnabled) return;
  _resumeAudioCtx();
  const rarestId = getRarestItem(droppedIds);
  if (!rarestId) return;
  const item = getItem(rarestId);
  if (!item || !item.sound) return;
  const audio = _audioCache[item.sound];
  if (!audio) return;
  const clone = audio.cloneNode();
  clone.volume = item.volume ?? 0.1;
  clone.play().catch(() => {});
}

const _soundCooldowns = {}; // url -> timestamp of last play

function playSound(urls, volume = 0.5, cooldown = 0) {
  if (!_sfxEnabled) return;
  _resumeAudioCtx();
  const url = Array.isArray(urls)
    ? urls[Math.floor(Math.random() * urls.length)]
    : urls;
  if (cooldown > 0) {
    const lastPlayed = _soundCooldowns[url] || 0;
    if (Date.now() - lastPlayed < cooldown * 1000) return;
    _soundCooldowns[url] = Date.now();
  }
  const audio = _audioCache[url] || new Audio(url);
  const clone = audio.cloneNode();
  clone.volume = volume;
  clone.play().catch(() => {});
}

const LEVELUP_SOUND = 'assets/sfx/levelup.mp3'; // change filename to match yours

function primeLevelUpSound() {
  const audio = new Audio(LEVELUP_SOUND);
  audio.preload = 'auto';
  _audioCache[LEVELUP_SOUND] = audio;
}

function playLevelUpSound() {
  if (!_sfxEnabled) return;
  const audio = _audioCache[LEVELUP_SOUND];
  if (!audio) return;
  const clone = audio.cloneNode();
  clone.volume = 0.2;
  clone.play().catch(() => {});
}

preloadSounds();
primeLevelUpSound();