// --- Sound Effects ---
// Uses new Audio() so it works on file:// without a server.
// Solves the cold-start cutoff by silently priming all sounds
// on the first user keypress — after that everything is pre-decoded.

const _audioCache = {};
let _primed = false;

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
  const rarestId = getRarestItem(droppedIds);
  if (!rarestId) return;
  const item = getItem(rarestId);
  if (!item || !item.sound) return;
  const audio = _audioCache[item.sound];
  if (!audio) return;
  const clone = audio.cloneNode();
  clone.volume = 0.1;
  clone.play().catch(() => {});
}

const LEVELUP_SOUND = 'assets/sfx/levelup.mp3'; // change filename to match yours

function primeLevelUpSound() {
  const audio = new Audio(LEVELUP_SOUND);
  audio.preload = 'auto';
  _audioCache[LEVELUP_SOUND] = audio;
}

function playLevelUpSound() {
  const audio = _audioCache[LEVELUP_SOUND];
  if (!audio) return;
  const clone = audio.cloneNode();
  clone.volume = 0.4;
  clone.play().catch(() => {});
}

preloadSounds();
primeLevelUpSound();