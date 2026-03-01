// --- Location definitions ---
const LOCATIONS = {
  forest: {
    id:    'forest',
    name:  'Forest',
    icon:  '🌲',
    scene: 'woodcutting',
    x: 22,
    y: 63,
  },
  mine: {
    id:    'mine',
    name:  'The Mine',
    icon:  '⛏️',
    scene: 'mining',
    x: 74,
    y: 26,
  },
};

// quotes = how many quotes you must complete to finish the journey
const ROUTES = [
  { from: 'forest', to: 'mine', quotes: 1, name: 'Mountain Path' },
];

function getRoute(a, b) {
  return ROUTES.find(r =>
    (r.from === a && r.to === b) || (r.from === b && r.to === a)
  ) || null;
}