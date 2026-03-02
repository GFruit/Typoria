// --- Location definitions ---
const LOCATIONS = {
  forest: {
    id:    'forest',
    name:  'Forest',
    icon:  '🌲',
    scene: 'woodcutting',
    x: 25,
    y: 80,
  },
  mine: {
    id:    'mine',
    name:  'The Mine',
    icon:  '⛏️',
    scene: 'mining',
    x: 74,
    y: 35,
  },
  lake: {
    id:    'lake',
    name:  'The Lake',
    icon:  '🎣',
    scene: 'fishing',
    x: 18,
    y: 20,
  },
  campsite: {
    id: 'campsite',
    name: 'Campsite',
    icon: '🔥',
    scene: 'cooking',
    x: 50,
    y: 72,
  },
};


const ROUTES = [
  { from: 'forest', to: 'mine',  quotes: 1, name: 'Mountain Path' },
  { from: 'forest', to: 'lake',  quotes: 1, name: 'Lakeside Trail' },
  { from: 'mine',   to: 'lake',  quotes: 1, name: 'Rocky Descent'  },
    { from: 'forest',   to: 'campsite', quotes: 1, name: 'Forest Path'    },
  { from: 'lake',     to: 'campsite', quotes: 1, name: 'Lakeshore Walk' },
  { from: 'mine',     to: 'campsite', quotes: 1, name: 'Miners Trail'   },
];

function getRoute(a, b) {
  return ROUTES.find(r =>
    (r.from === a && r.to === b) || (r.from === b && r.to === a)
  ) || null;
}