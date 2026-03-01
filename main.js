// --- Quote pool ---

/*
let quotePool  = [];
let usedQuotes = [];

function rebuildQuotePool() {
  if (gameMode === 'travel') {
    quotePool  = [];
    usedQuotes = [];
    return; // travel uses getNextTravelQuote()
  }
  quotePool  = [...getScene().quotes()];
  usedQuotes = [];
}
  */

let _lastQuote = null;

function getNextQuote() {
  if (gameMode === 'travel') return getNextTravelQuote();
  const pool = getScene().quotes();
  let quote;
  do {
    quote = pool[Math.floor(Math.random() * pool.length)];
  } while (quote === _lastQuote && pool.length > 1);
  _lastQuote = quote;
  return quote;
}

// --- Global keydown ---
document.addEventListener("keydown", (e) => {
  primeSounds(); // prime audio on first keypress
  tryStartMusic();
  if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
    e.preventDefault();
    if (typingInput.value.length > 0) applySelection();
    return;
  }

  if (selectionActive) {
    if (e.key === "Backspace") {
      e.preventDefault();
      clearSelection();
      typingInput.value = "";
      rerenderTyped();
      return;
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      clearSelection();
      typingInput.value = e.key;
      rerenderTyped();
      return;
    }
    const modifierKeys = ["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab"];
    if (!modifierKeys.includes(e.key)) clearSelection();
  }

  if (e.key === "Enter") {
    nextBtn.classList.remove('glow');
    buildQuote(getNextQuote());
    typingInput.focus();
    return;
  }

  if (!typingInput.disabled) typingInput.focus();
});

document.addEventListener("click", () => {
  if (selectionActive) clearSelection();
});

// --- Map button ---
document.getElementById('mapBtn').addEventListener('click', openMap);

// --- Next button ---
nextBtn.addEventListener("click", () => {
  nextBtn.classList.remove('glow');
  buildQuote(getNextQuote());
  typingInput.focus();
});

// --- Init ---
/*
rebuildQuotePool();
*/

if (gameMode === 'travel') {
  agilityLastLevel = getLevelInfo(agilityXp).level;
  enterTravelMode();
} else {
  updateSceneUI();
}

updateStreakUI();

if (gameMode !== 'travel') {
  buildQuote(getNextQuote());
}