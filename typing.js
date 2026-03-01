// --- DOM refs ---
const quoteInner  = document.getElementById('quoteInner');
const xpBar       = document.getElementById('xpBar');
const typingInput = document.getElementById('typingInput');
const nextBtn     = document.getElementById('nextBtn');

xpBar.innerHTML = `${xp} <span class="side-unit">XP</span>`;

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
  const lastLineIdx = getWordLineIndex(wordElements[wordElements.length - 1]);
  const isLastLine = lineIdx >= lastLineIdx;
  const scrollLine = Math.max(0, isLastLine ? lineIdx - 2 : lineIdx - 1);
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
  if (wordHadError) {
    streak = 0;
    updateStreakUI();
  }
  wordHadError = false;
  wpmOnQuoteStart(quote);

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
  // Double rAF ensures layout is complete before measuring line positions
  requestAnimationFrame(() => requestAnimationFrame(scrollToCurrentLine));
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

  if (wordHadError) {
    streak = 0;
  } else {
    streak++;
  }
  wordHadError = false;
  updateStreakUI();

  const mult   = getMultiplier(streak);
  const xpGain = targetWord.length * mult;

  if (gameMode === 'travel') {
    // --- Travel mode ---
    spawnXpDrop(xpGain, mult);
    onTravelWordComplete(xpGain, mult, currentWordIndex, wordElements.length);

  } else {
    // --- Skill mode ---
    xp += xpGain;
    saveState();
    xpBar.innerHTML = `${xp} <span class="side-unit">XP</span>`;
    updateLevelUI();
    spawnXpDrop(xpGain, mult);

    // Roll drops for current skill level
    const scene      = getScene();
    const skillLevel = getLevelInfo(xp).level;
    const dropped    = rollDrops(scene.skill, skillLevel);

    dropped.forEach(id => awardItem(id));
    updateLastDropDisplay(dropped);
    playDropSound(dropped);
  }

  currentWordIndex++;

  if (currentWordIndex < wordElements.length) {
    wordElements[currentWordIndex].classList.add("current-word");
    updateCaret(getSlots(currentWordIndex), 0);
    scrollToCurrentLine();
  } else {
    caretEl.remove();
    typingInput.disabled = true;
    nextBtn.classList.add('glow');
    if (gameMode !== 'travel') wpmOnQuoteComplete();

  }

  typingInput.value = "";
  clearSelection();
}

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

typingInput.addEventListener("input", () => {
  wpmOnFirstKey();
  if (selectionActive) clearSelection();
  rerenderTyped();
});