// --- Drag manager ---
// Tracks drag state via body class, and suppresses the browser's
// no-drop shield everywhere by explicitly setting dropEffect = 'move'.
// Individual slot handlers override this with their own dropEffect as needed.

document.addEventListener('dragstart', () => document.body.classList.add('is-dragging'));
document.addEventListener('dragend',   () => document.body.classList.remove('is-dragging'));
document.addEventListener('dragover',  e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
});
document.addEventListener('drop', e => e.preventDefault());