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
    x: 55,  //higher number = move right
    y: 90, //higher number = move down
  },
};


const ROUTES = [
  { from: 'forest', to: 'mine',  quotes: 1, name: '' },
  { from: 'forest', to: 'lake',  quotes: 1, name: '' },
  { from: 'mine',   to: 'lake',  quotes: 1, name: ''  },
    { from: 'forest',   to: 'campsite', quotes: 1, name: ''    },
  { from: 'lake',     to: 'campsite', quotes: 1, name: '' },
  { from: 'mine',     to: 'campsite', quotes: 1, name: ''   },
];

function getRoute(a, b) {
  return ROUTES.find(r =>
    (r.from === a && r.to === b) || (r.from === b && r.to === a)
  ) || null;
}