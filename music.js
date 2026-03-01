// --- Background Music ---
// Add your music files to the PLAYLIST array below.
// Songs play in order and loop forever.

const PLAYLIST = [
  'assets/sfx/music.mp3',       // add more filenames here, e.g. 'music2.mp3'
  'assets/sfx/music2.mp3'
];

const FADE_DURATION = 4.0;  // seconds to fade in at start and out at end
const MUSIC_VOLUME  = 0.4;  // max volume (0.0 - 1.0)

let _music        = null;
let _musicEnabled = localStorage.getItem('typoria_music') !== 'false';
let _fadeInterval = null;
let _trackIndex   = 0;
let _musicStarted = false;
let _fadingOut    = false;

function loadTrack(index) {
  if (_music) {
    _music.pause();
    _music.removeEventListener('ended',      _onEnded);
    _music.removeEventListener('timeupdate', _onTimeUpdate);
  }

  _fadingOut    = false;
  _trackIndex   = index % PLAYLIST.length;
  _music        = new Audio(PLAYLIST[_trackIndex]);
  _music.preload = 'auto';
  _music.volume  = 0;

  _music.addEventListener('ended',      _onEnded);
  _music.addEventListener('timeupdate', _onTimeUpdate);
}

function _onEnded() {
  // Advance to next track and fade in
  loadTrack(_trackIndex + 1);
  if (_musicEnabled) fadeIn();
}

function _onTimeUpdate() {
  if (!_music.duration || _fadingOut) return;
  const remaining = _music.duration - _music.currentTime;
  if (remaining <= FADE_DURATION && remaining > 0.1 && _musicEnabled) {
    _fadingOut = true;
    fadeOut(null, FADE_DURATION * 1000); // slow fade matches remaining time
  }
}

function fadeIn() {
  clearInterval(_fadeInterval);
  _music.currentTime = 0;
  _music.volume = 0;
  _music.play().catch(() => {});

  const steps    = 60;
  const interval = (FADE_DURATION * 1000) / steps;
  let   step     = 0;

  _fadeInterval = setInterval(() => {
    step++;
    _music.volume = Math.min(MUSIC_VOLUME, (step / steps) * MUSIC_VOLUME);
    if (step >= steps) clearInterval(_fadeInterval);
  }, interval);
}

function fadeOut(onDone, durationMs = 600) {
  clearInterval(_fadeInterval);
  const startVol = _music.volume || MUSIC_VOLUME;
  const steps    = 30;
  const interval = durationMs / steps;
  let   step     = 0;

  _fadeInterval = setInterval(() => {
    step++;
    _music.volume = Math.max(0, startVol * (1 - step / steps));
    if (step >= steps) {
      clearInterval(_fadeInterval);
      if (onDone) onDone();
    }
  }, interval);
}

function startMusic() {
  _musicEnabled = true;
  localStorage.setItem('typoria_music', 'true');
  fadeIn();
  updateMusicBtn();
}

function stopMusic() {
  _musicEnabled = false;
  localStorage.setItem('typoria_music', 'false');
  fadeOut(() => _music.pause());
  updateMusicBtn();
}

function toggleMusic() {
  if (_musicEnabled) {
    stopMusic();
  } else {
    startMusic();
  }
}

function updateMusicBtn() {
  const btn = document.getElementById('musicBtn');
  if (!btn) return;
  btn.textContent = _musicEnabled ? '🔊' : '🔇';
  btn.title       = _musicEnabled ? 'Mute music' : 'Play music';
  btn.classList.toggle('muted', !_musicEnabled);
}

function tryStartMusic() {
  if (_musicStarted || !_musicEnabled) return;
  _musicStarted = true;
  fadeIn();
}

// Init: load first track and set up button
loadTrack(0);
updateMusicBtn();

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('musicBtn');
  if (btn) btn.addEventListener('click', toggleMusic);
});