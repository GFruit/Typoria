// --- WPM Tracker ---
// Timing: starts on first keypress, stops on last word.
// WPM formula: (total characters including spaces / 5) / minutes elapsed
// Stores { pb, recent: [last 25 scores] } per quote.

const WPM_WINDOW = 25; // number of recent scores to average over

let _quoteStartTime = null;
let _quoteText      = null;
let _quoteStarted   = false;

// Scores stored as { [quoteText]: { pb, recent: [...] } }
let _wpmScores = JSON.parse(localStorage.getItem('typoria_wpm_scores') || '{}');

// Migrate old formats
(function migrate() {
  let changed = false;
  const oldPBs = localStorage.getItem('typoria_wpm_pbs');
  if (oldPBs) {
    const pbs = JSON.parse(oldPBs);
    for (const [quote, pb] of Object.entries(pbs)) {
      if (!_wpmScores[quote]) {
        _wpmScores[quote] = { pb, recent: [pb] };
        changed = true;
      }
    }
    localStorage.removeItem('typoria_wpm_pbs');
  }
  for (const [quote, val] of Object.entries(_wpmScores)) {
    if (Array.isArray(val)) {
      _wpmScores[quote] = { pb: Math.max(...val), recent: val.slice(-WPM_WINDOW) };
      changed = true;
    } else if (typeof val.sum !== 'undefined') {
      // migrate old { pb, count, sum } format
      _wpmScores[quote] = { pb: val.pb, recent: [Math.round(val.sum / val.count)] };
      changed = true;
    }
  }
  if (changed) localStorage.setItem('typoria_wpm_scores', JSON.stringify(_wpmScores));
})();

function avg(arr) {
  return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
}

function wpmOnQuoteStart(quoteText) {
  _quoteText      = quoteText;
  _quoteStarted   = false;
  _quoteStartTime = null;
  ['wpmDisplay', 'wpmLabel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('visible'); el.innerHTML = ''; }
  });
}

function wpmOnFirstKey() {
  if (_quoteStarted) return;
  const input = document.getElementById('typingInput');
  if (!input || input.value.length === 0) return;
  _quoteStarted   = true;
  _quoteStartTime = Date.now();
}

function wpmOnQuoteComplete() {
  if (!_quoteStartTime || !_quoteText) return;

  const elapsedMinutes = (Date.now() - _quoteStartTime) / 60000;
  const wpm            = Math.round((_quoteText.length / 5) / elapsedMinutes);

  const prev       = _wpmScores[_quoteText] || null;
  const isFirst    = prev === null;
  const prevPB     = isFirst ? null : prev.pb;
  const prevRecent = isFirst ? [] : prev.recent;
  const prevAvg    = isFirst ? null : avg(prevRecent);
  const isPB       = !isFirst && wpm > prevPB;
  const isAboveAvg = !isFirst && !isPB && prevRecent.length > 0 && wpm > prevAvg;

  // Compute new average after adding this score (capped window)
  const newRecent = [...prevRecent, wpm].slice(-WPM_WINDOW);
  const newAvg    = avg(newRecent);

  // Save
  _wpmScores[_quoteText] = {
    pb:     isPB ? wpm : (prevPB ?? wpm),
    recent: newRecent,
  };
  localStorage.setItem('typoria_wpm_scores', JSON.stringify(_wpmScores));

  showWpmDisplay(wpm, { isFirst, isPB, isAboveAvg, prevPB, prevAvg, newAvg });
}

function showWpmDisplay(wpm, { isFirst, isPB, isAboveAvg, prevPB, prevAvg, newAvg }) {
  const el    = document.getElementById('wpmDisplay');
  const label = document.getElementById('wpmLabel');
  if (!el) return;

  el.innerHTML    = `${wpm} <span class="wpm-unit">wpm</span>`;
  label.innerHTML = '';

  if (isFirst) {
    const sceneQuotes = gameMode !== 'travel' ? getScene().quotes() : [];
    const total = sceneQuotes.length;
    const found = sceneQuotes.filter(q => _wpmScores[q]).length;
    label.innerHTML = `<span class="wpm-new">New Quote!${gameMode !== 'travel' ? ` (${found} / ${total} Found)` : ''}</span>`;
  } else if (isPB) {
    const diff = wpm - prevPB;
    label.innerHTML = `<span class="wpm-pb">Personal Best! +${diff}</span>`;
  } else if (isAboveAvg) {
    const diff = (newAvg - prevAvg).toFixed(1);
    label.innerHTML = `<span class="wpm-avg">+${diff} avg (last 25 Quotes)</span>`;
  }

  el.classList.remove('visible'); label.classList.remove('visible');
  void el.offsetWidth;
  el.classList.add('visible'); label.classList.add('visible');
}