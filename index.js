// --- Quote shuffling ---
let quotePool = [];
let usedQuotes = [];

function getNextQuote() {
  if (quotePool.length === 0) {
    quotePool = [...usedQuotes];
    usedQuotes = [];
  }
  const idx = Math.floor(Math.random() * quotePool.length);
  const quote = quotePool.splice(idx, 1)[0];
  usedQuotes.push(quote);
  return quote;
}

quotePool = [...quotes];

// --- Persistent state ---
let currentWordIndex = 0;
let xp   = parseInt(localStorage.getItem('typoria_xp')   || '0');
let logs = parseInt(localStorage.getItem('typoria_logs') || '0');

function saveState() {
  localStorage.setItem('typoria_xp',   xp);
  localStorage.setItem('typoria_logs', logs);
}

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

// --- DOM refs ---
const quoteInner  = document.getElementById('quoteInner');
const xpBar       = document.getElementById('xpBar');
const typingInput = document.getElementById('typingInput');
const nextBtn     = document.getElementById('nextBtn');
const logsCount   = document.getElementById('logsCount');

xpBar.innerHTML       = `${xp} <span class="side-unit">XP</span>`;
logsCount.textContent = logs;

let wordElements  = [];
let spaceElements = [];
const caretEl = document.createElement("caret");

// --- Selection ---
let selectionActive = false;

function applySelection() {
  const typed = typingInput.value;
  const slots = getSlots(currentWordIndex);
  slots.forEach((slot, i) => {
    slot.el.classList.toggle("selected", i < typed.length);
  });
  selectionActive = true;
}

function clearSelection() {
  quoteInner.querySelectorAll(".selected").forEach(el =>
    el.classList.remove("selected")
  );
  selectionActive = false;
}

// --- Line scrolling ---
function getLineHeight() {
  return parseFloat(getComputedStyle(quoteInner).lineHeight);
}

function getWordLineIndex(wordEl) {
  return Math.round(wordEl.offsetTop / getLineHeight());
}

function scrollToCurrentLine() {
  if (currentWordIndex >= wordElements.length) return;
  const lineIdx    = getWordLineIndex(wordElements[currentWordIndex]);
  const scrollLine = Math.max(0, lineIdx - 1);
  quoteInner.style.transform = `translateY(-${scrollLine * getLineHeight()}px)`;
}

// --- Build quote ---
function buildQuote(quote) {
  quoteInner.innerHTML = "";
  quoteInner.style.transform = "translateY(0)";
  wordElements  = [];
  spaceElements = [];
  currentWordIndex = 0;
  typingInput.value    = "";
  typingInput.disabled = false;
  caretEl.remove();
  nextBtn.classList.remove('glow');
  clearSelection();
  wordHadError = false;

  const words = quote.split(" ");

  words.forEach((word, wordIndex) => {
    const wordEl = document.createElement("word");
    wordEl.dataset.word = word;

    word.split("").forEach(ch => {
      const lEl = document.createElement("letter");
      lEl.textContent = ch;
      lEl.classList.add("untyped");
      wordEl.appendChild(lEl);
    });

    if (wordIndex < words.length - 1) {
      const spEl = document.createElement("space");
      spEl.textContent = " ";
      wordEl.appendChild(spEl);
      spaceElements.push(spEl);
    }

    quoteInner.appendChild(wordEl);
    wordElements.push(wordEl);
  });

  wordElements[0].classList.add("current-word");
  updateCaret(getSlots(0), 0);
  requestAnimationFrame(scrollToCurrentLine);
}

// --- Slots ---
function getSlots(fromWordIndex) {
  const slots = [];
  for (let wi = fromWordIndex; wi < wordElements.length; wi++) {
    wordElements[wi].querySelectorAll("letter").forEach(el =>
      slots.push({ el, expected: el.textContent, type: 'letter' })
    );
    const spEl = wordElements[wi].querySelector("space");
    if (spEl) slots.push({ el: spEl, expected: ' ', type: 'space' });
  }
  return slots;
}

// --- Caret ---
function updateCaret(slots, typedLength) {
  caretEl.remove();
  if (typedLength < slots.length) {
    slots[typedLength].el.parentNode.insertBefore(caretEl, slots[typedLength].el);
  } else if (slots.length > 0) {
    const last = slots[slots.length - 1].el;
    last.parentNode.insertBefore(caretEl, last.nextSibling);
  }
}

// --- Rerender typed state ---
function rerenderTyped() {
  const typed = typingInput.value;
  const slots = getSlots(currentWordIndex);

  let firstError = -1;
  for (let i = 0; i < typed.length; i++) {
    if (i >= slots.length || typed[i] !== slots[i].expected) { firstError = i; break; }
  }

  if (firstError !== -1) wordHadError = true;

  slots.forEach(slot => {
    slot.el.classList.remove("correct", "incorrect", "untyped", "selected");
    slot.el.classList.add("untyped");
    if (slot.type === 'space') slot.el.textContent = " ";
  });

  for (let i = 0; i < typed.length && i < slots.length; i++) {
    const slot = slots[i];
    slot.el.classList.remove("untyped");
    const isIncorrect = firstError !== -1 && i >= firstError;
    slot.el.classList.add(isIncorrect ? "incorrect" : "correct");
    if (slot.type === 'space') slot.el.textContent = isIncorrect ? "⋅" : " ";
  }

  updateCaret(slots, typed.length);

  const targetWord = wordElements[currentWordIndex].dataset.word;
  const isLastWord  = currentWordIndex === wordElements.length - 1;
  if (typed === targetWord + " " || (isLastWord && typed === targetWord)) {
    submitWord(targetWord);
  }
}

// --- Submit word ---
function submitWord(targetWord) {
  const currentWord = wordElements[currentWordIndex];
  currentWord.classList.remove("current-word");
  currentWord.classList.add("locked");

  const spEl = currentWord.querySelector("space");
  if (spEl) {
    spEl.classList.remove("correct", "incorrect", "untyped");
    spEl.textContent = " ";
  }

  // Streak
  if (wordHadError) {
    streak = 0;
  } else {
    streak++;
  }
  wordHadError = false;
  updateStreakUI();

  const mult   = getMultiplier(streak);
  const xpGain = targetWord.length * mult;

  xp   += xpGain;
  logs += 1;
  saveState();

  xpBar.innerHTML       = `${xp} <span class="side-unit">XP</span>`;
  logsCount.textContent = logs;
  updateLevelUI();

  spawnXpDrop(xpGain, mult);

  const logIcon = document.getElementById('logIcon');
  logIcon.classList.remove('pop');
  void logIcon.offsetWidth;
  logIcon.classList.add('pop');

  currentWordIndex++;

  if (currentWordIndex < wordElements.length) {
    wordElements[currentWordIndex].classList.add("current-word");
    updateCaret(getSlots(currentWordIndex), 0);
    scrollToCurrentLine();
  } else {
    caretEl.remove();
    typingInput.disabled = true;
    nextBtn.classList.add('glow');
  }

  typingInput.value = "";
  clearSelection();
}

// --- Global keydown ---
document.addEventListener("keydown", (e) => {
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
    if (!modifierKeys.includes(e.key)) {
      clearSelection();
    }
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

// --- Error blocking ---
const MAX_ERRORS = 10;

function countIncorrectTail(typed, slots) {
  let firstError = -1;
  for (let i = 0; i < typed.length; i++) {
    if (i >= slots.length || typed[i] !== slots[i].expected) { firstError = i; break; }
  }
  if (firstError === -1) return 0;
  return typed.length - firstError;
}

typingInput.addEventListener("keydown", (e) => {
  if (e.key === "Backspace") return;
  const slots = getSlots(currentWordIndex);
  if (countIncorrectTail(typingInput.value, slots) >= MAX_ERRORS) e.preventDefault();
});

// --- Input handler ---
typingInput.addEventListener("input", () => {
  if (selectionActive) clearSelection();
  rerenderTyped();
});

// --- Next button ---
nextBtn.addEventListener("click", () => {
  nextBtn.classList.remove('glow');
  buildQuote(getNextQuote());
  typingInput.focus();
});

// --- Init ---
_lastLevel = getLevelInfo(xp).level;
updateLevelUI();
updateStreakUI();
buildQuote(getNextQuote());