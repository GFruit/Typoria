// --- Item Registry ---
const ITEM_REGISTRY = [
  // === WOODCUTTING ===
  {
    id: 'logs', name: 'Logs', icon: '🪵', category: 'Woodcutting', skill: 'woodcutting',
    xp: 12, burnDuration: 1, sound: 'assets/sfx/chop.m4a', image: 'assets/img/logs.png', volume: 0.4,
    drops: [{ minLevel: 1, chance: 0.4 }],
  },
  {
    id: 'oak_logs', name: 'Oak Logs', icon: '🌳', category: 'Woodcutting', skill: 'woodcutting',
    xp: 45, burnDuration: 3, sound: 'assets/sfx/chop.m4a', image: 'assets/img/oak_logs.png', volume: 0.4,
    drops: [
      { minLevel: 15, chance: 0.15 },
      { minLevel: 40, chance: 0.25 },
    ],
  },

  // === MINING ===
  {
    id: 'rocks', name: 'Rocks', icon: '🪨', category: 'Mining', skill: 'mining',
    xp: 10, sound: 'assets/sfx/mine.mp3', image: "assets/img/rocks.png",
    drops: [{ minLevel: 1, chance: 0.45 }],
  },
  {
    id: 'flint', name: 'Flint', icon: '🔥', category: 'Mining', skill: 'mining',
    xp: 10, sound: 'assets/sfx/mine.mp3', image: "assets/img/flint.png",
    drops: [
      { minLevel: 1,  chance: 0.01 },
      { minLevel: 10, chance: 0.02 },
      { minLevel: 25, chance: 0.04 },
    ],
  },
  {
    id: 'coal', name: 'Coal', icon: '⚫', category: 'Mining', skill: 'mining',
    xp: 45, sound: 'assets/sfx/mine.mp3', image: "assets/img/coal.png",
    drops: [
      { minLevel: 10, chance: 0.12 },
      { minLevel: 30, chance: 0.22 },
    ],
  },
  {
    id: 'iron_ore', name: 'Iron Ore', icon: '🔩', category: 'Mining', skill: 'mining',
    xp: 80, sound: 'assets/sfx/mine.mp3', image: "assets/img/iron_ore.png",
    drops: [
      { minLevel: 25, chance: 0.08 },
      { minLevel: 50, chance: 0.18 },
    ],
  },
  {
    id: 'gold_ore', name: 'Gold Ore', icon: '✨', category: 'Mining', skill: 'mining',
    xp: 180, sound: 'assets/sfx/mine.mp3', image: 'assets/img/gold_ore.png',
    drops: [
      { minLevel: 55, chance: 0.06 },
      { minLevel: 80, chance: 0.12 },
    ],
  },
  {
    id: 'diamond_ore', name: 'Diamonds', icon: '💎', category: 'Mining', skill: 'mining',
    xp: 450, sound: 'assets/sfx/diamonds.mp3', image: 'assets/img/diamonds.png',
    drops: [
      { minLevel: 85, chance: 0.03 },
      { minLevel: 99, chance: 0.06 },
    ],
  },

  // === FISHING ===
  {
    id: 'shrimp', name: 'Shrimp', icon: '🦐', category: 'Fishing', skill: 'fishing',
    xp: 15, sound: 'assets/sfx/fish.m4a', image: 'assets/img/shrimp_raw.png',
    drops: [{ minLevel: 1, chance: 0.4 }],
  },
  {
    id: 'trout', name: 'Trout', icon: '🐟', category: 'Fishing', skill: 'fishing',
    xp: 60, sound: 'assets/sfx/fish.m4a', image: 'assets/img/trout_raw.png',
    drops: [
      { minLevel: 20, chance: 0.10 },
      { minLevel: 40, chance: 0.18 },
      { minLevel: 60, chance: 0.28 },
    ],
  },
  {
    id: 'salmon', name: 'Salmon', icon: '🐡', category: 'Fishing', skill: 'fishing',
    xp: 220, sound: 'assets/sfx/fish.m4a', image: 'assets/img/salmon_raw.png',
    drops: [
      { minLevel: 50, chance: 0.10 },
      { minLevel: 80, chance: 0.20 },
    ],
  },

  // === COOKING (produced by cooking, not dropped) ===
  {
    id: 'cooked_shrimp', name: 'Cooked Shrimp', icon: '🍤', category: 'Cooking', skill: 'cooking',
    xp: 40, drops: [], sound: 'assets/sfx/cook.mp3', image: 'assets/img/shrimp_cooked.png'
  },
  {
    id: 'cooked_trout', name: 'Cooked Trout', icon: '🍣', category: 'Cooking', skill: 'cooking',
    xp: 120, drops: [], sound: 'assets/sfx/cook.mp3', image: 'assets/img/trout_cooked.png'
  },
  {
    id: 'cooked_salmon', name: 'Cooked Salmon', icon: '🐠', category: 'Cooking', skill: 'cooking',
    xp: 550, drops: [], sound: 'assets/sfx/cook.mp3', image: 'assets/img/salmon_cooked.png'
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
  // Sort most-common first
  dropped.sort((a, b) => {
    const maxChance = id => {
      const it = getItem(id);
      return it && it.drops ? Math.max(...it.drops.map(t => t.chance)) : 0;
    };
    return maxChance(b) - maxChance(a);
  });
  return dropped;
}