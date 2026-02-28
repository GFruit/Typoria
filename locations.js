// --- Location definitions ---
const LOCATIONS = {
  forest: {
    id:    'forest',
    name:  'Forest',
    icon:  '🌲',
    scene: 'woodcutting',
    x: 22,   // % position on map canvas
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

// Routes are bidirectional. steps = how many steps to complete the journey.
const ROUTES = [
  { from: 'forest', to: 'mine', steps: 500, name: 'Mountain Path' },
];

function getRoute(a, b) {
  return ROUTES.find(r =>
    (r.from === a && r.to === b) || (r.from === b && r.to === a)
  ) || null;
}