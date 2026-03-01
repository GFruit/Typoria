// --- Item Registry ---
// Each item has:
//   id       : unique string key
//   name     : display name
//   icon     : emoji or "url('file.png')"
//   category : groups items in the inventory panel
//   skill    : which skill's level to check ('woodcutting', 'mining')
//   sound    : (optional) audio filename to play when this is the rarest drop
//              e.g. 'chop.mp3' — put the file in your project folder
//   drops    : array of { minLevel, chance } thresholds
//              - the highest minLevel that is <= current level is used
//              - chance is 0.0–1.0  (e.g. 0.1 = 10%)
//              - omit drops to never drop (placeholder items)

const ITEM_REGISTRY = [
  {
    id: 'logs', name: 'Logs', icon: '🪵', category: 'Woodcutting', skill: 'woodcutting',
    image: 'assets/img/logs.png',
    //sound: 'assets/sfx/chop.mp3',       // plays on every word (it's the only/most common drop at low level)
    drops: [
      { minLevel: 1, chance: 1.0 },
    ],
  },
  {
    id: 'oak_logs', name: 'Oak Logs', icon: '🌳', category: 'Woodcutting', skill: 'woodcutting',
    image: 'assets/img/oak_logs.png',
    //sound: 'assets/sfx/oak_chop.mp3',   // distinct sound for rarer wood
    drops: [
      { minLevel: 15, chance: 0.08 },
      { minLevel: 30, chance: 0.15 },
      { minLevel: 60, chance: 0.25 },
    ],
  },
  {
    id: 'rocks', name: 'Rocks', icon: '🪨', category: 'Mining', skill: 'mining',
    image: 'assets/img/rocks.png',
    sound: 'assets/sfx/mine.mp3',
    drops: [
      { minLevel: 1, chance: 1.0 },
    ],
  },
  {
    id: 'coal', name: 'Coal', icon: '⚫', category: 'Mining', skill: 'mining',
    image: 'assets/img/coal.png',
    //sound: 'assets/sfx/coal.mp3',
    drops: [
      { minLevel: 10, chance: 0.10 },
      { minLevel: 20, chance: 0.18 },
      { minLevel: 40, chance: 0.28 },
    ],
  },
  {
    id: 'iron_ore', name: 'Iron Ore', icon: '🔩', category: 'Mining', skill: 'mining',
    image: 'assets/img/iron_ore.png',
    //sound: 'assets/sfx/iron.mp3',
    drops: [
      { minLevel: 20, chance: 0.06 },
      { minLevel: 40, chance: 0.12 },
      { minLevel: 60, chance: 0.20 },
    ],
  },
  {
    id: 'gold_ore', name: 'Gold Ore', icon: '✨', category: 'Mining', skill: 'mining',
    image: 'assets/img/gold_ore.png',
    sound: 'assets/sfx/gold.mp3',       // your most exciting sound effect
    drops: [
      { minLevel: 40, chance: 0.005 },
      { minLevel: 60, chance: 0.01 },
      { minLevel: 80, chance: 0.02 },
    ],
  },
];

function getItem(id) {
  return ITEM_REGISTRY.find(i => i.id === id) || null;
}

function getDropChance(item, skillLevel) {
  if (!item.drops || item.drops.length === 0) return 0;
  const applicable = item.drops
    .filter(t => skillLevel >= t.minLevel)
    .sort((a, b) => b.minLevel - a.minLevel);
  return applicable.length > 0 ? applicable[0].chance : 0;
}

function rollDrops(skillId, skillLevel) {
  const dropped = [];
  for (const item of ITEM_REGISTRY) {
    if (item.skill !== skillId) continue;
    const chance = getDropChance(item, skillLevel);
    if (chance <= 0) continue;
    if (Math.random() < chance) dropped.push(item.id);
  }
  // Sort most-common first for the Last Drop display
  dropped.sort((a, b) => {
    const maxChance = id => {
      const it = getItem(id);
      return it && it.drops ? Math.max(...it.drops.map(t => t.chance)) : 0;
    };
    return maxChance(b) - maxChance(a);
  });
  return dropped;
}