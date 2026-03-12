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
    achievement: "Visit the Mine!"
  },
  lake: {
    id:    'lake',
    name:  'The Lake',
    icon:  '🎣',
    scene: 'fishing',
    x: 18,
    y: 20,
    achievement: "Visit the Lake!"
  },
  campsite: {
    id: 'campsite',
    name: 'Campsite',
    icon: '🔥',
    scene: 'cooking',
    x: 55,  //higher number = move right
    y: 90, //higher number = move down
    achievement: "Visit the Campsite!"
  },
  dungeon:  {
    id: 'dungeon',
    name: 'The Dungeon',
    icon: '💀',
    scene: 'combat',
    x: 48,
    y: 20,
    achievement: "Enter the Dungeon!"
  },
  forge: {
    id:          'forge',
    name:        'The Forge',
    icon:        '🔨',
    scene:       'forge',
    x:           63,
    y:           55,
    achievement: 'Visit the Forge!',
    },
    bank: {
    id:          'bank',
    name:        'The Bank',
    icon:        '🏦',
    scene:       'bank',
    x:           38,
    y:           55,
    achievement: 'Visit the Bank!',
    },
};


const ROUTES = [
  { from: 'forest', to: 'mine',  quotes: 1, name: '' },
  { from: 'forest', to: 'lake',  quotes: 1, name: '' },
  { from: 'mine',   to: 'lake',  quotes: 1, name: ''  },
    { from: 'forest',   to: 'campsite', quotes: 1, name: ''    },
  { from: 'lake',     to: 'campsite', quotes: 1, name: '' },
  { from: 'mine',     to: 'campsite', quotes: 1, name: ''   },
    { from: 'mine',     to: 'dungeon',  quotes: 1, name: '' },
  { from: 'campsite', to: 'dungeon',  quotes: 1, name: '' },
  { from: 'lake',     to: 'dungeon',  quotes: 1, name: '' },
  { from: 'forest', to: 'dungeon',  quotes: 1, name: '' },
  { from: 'mine',     to: 'forge', quotes: 1, name: '' },
{ from: 'dungeon',  to: 'forge', quotes: 1, name: '' },
{ from: 'campsite', to: 'forge', quotes: 1, name: '' },
{ from: 'forest', to: 'forge', quotes: 1, name: '' },
{ from: 'lake',   to: 'forge', quotes: 1, name: '' },
{ from: 'forest',   to: 'bank', quotes: 1, name: '' },
{ from: 'mine',     to: 'bank', quotes: 1, name: '' },
{ from: 'lake',     to: 'bank', quotes: 1, name: '' },
{ from: 'campsite', to: 'bank', quotes: 1, name: '' },
{ from: 'forge',    to: 'bank', quotes: 1, name: '' },
{ from: 'dungeon',  to: 'bank', quotes: 1, name: '' },
];

function getRoute(a, b) {
  return ROUTES.find(r =>
    (r.from === a && r.to === b) || (r.from === b && r.to === a)
  ) || null;
}