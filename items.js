// --- Item Registry ---
const ITEM_REGISTRY = [
  // === WOODCUTTING ===
  {
    id: 'pine_logs', name: 'Pine Logs', icon: '🪵', category: 'Woodcutting', skill: 'woodcutting',
    xp: 20, burnDuration: 1, sound: 'assets/sfx/chop.m4a', image: 'assets/img/pine_logs.png', volume: 0.4,
    drops: [{ minLevel: 1, chance: 0.4 }]
  },
  {
    id: 'birch_logs', name: 'Birch Logs', icon: '🌳', category: 'Woodcutting', skill: 'woodcutting',
    xp: 50, burnDuration: 3, sound: 'assets/sfx/chop.m4a', image: 'assets/img/birch_logs.png', volume: 0.4,
    drops: [
      { minLevel: 15, chance: 0.14 },
    ],
  },
  {
    id: 'spruce_logs', name: 'Spruce Logs', icon: '🌳', category: 'Woodcutting', skill: 'woodcutting',
    xp: 50, burnDuration: 5, sound: 'assets/sfx/chop.m4a', image: 'assets/img/spruce_logs.png', volume: 0.4,
    drops: [
      { minLevel: 30, chance: 0.14 },
    ],
  },
  {
    id: 'Cedar_logs', name: 'Cedar Logs', icon: '🌳', category: 'Woodcutting', skill: 'woodcutting',
    xp: 200, burnDuration: 7, sound: 'assets/sfx/chop.m4a', image: 'assets/img/cedar_logs.png', volume: 0.4,
    drops: [
      { minLevel: 45, chance: 0.04 },
    ],
  },
  {
    id: 'teak_logs', name: 'Teak Logs', icon: '🌳', category: 'Woodcutting', skill: 'woodcutting',
    xp: 450, burnDuration: 9, sound: 'assets/sfx/chop.m4a', image: 'assets/img/teak_logs.png', volume: 0.4,
    drops: [
      { minLevel: 65, chance: 0.01 },
    ],
  },
  {
    id: 'mahogany_logs', name: 'Mahogany Logs', icon: '🌳', category: 'Woodcutting', skill: 'woodcutting',
    xp: 900, burnDuration: 12, sound: 'assets/sfx/chop.m4a', image: 'assets/img/mahogany_logs.png', volume: 0.4,
    drops: [
      { minLevel: 80, chance: 0.005 },
    ],
  },
  {
    id: 'redwood_logs', name: 'Redwood Logs', icon: '🌳', category: 'Woodcutting', skill: 'woodcutting',
    xp: 1200, burnDuration: 20, sound: 'assets/sfx/chop.m4a', image: 'assets/img/redwood_logs.png', volume: 0.4,
    drops: [
      { minLevel: 90, chance: 0.001 },
    ],
  },

  // === MINING ===
  {
    id: 'rocks', name: 'Rocks', icon: '🪨', category: 'Mining', skill: 'mining',
    xp: 10, sound: 'assets/sfx/mine.mp3', image: "assets/img/rocks.png",
    drops: [{ minLevel: 1, chance: 0.512 }],
  },
  {
    id: 'flint', name: 'Flint', icon: '', category: 'Mining', skill: 'mining',
    xp: 15, maxDurability: 50, sound: 'assets/sfx/mine.mp3', image: "assets/img/flint.png",
    drops: [
      { minLevel: 15,  chance: 0.256 },
    ],
  },
  {
    id: 'tin_ore', name: 'Tin Ore', icon: '', category: 'Mining', skill: 'mining',
    xp: 40, sound: 'assets/sfx/mine.mp3', image: "assets/img/tin_ore.png",
    drops: [
      { minLevel: 25, chance: 0.128 },
    ],
  },
  {
    id: 'copper_ore', name: 'Copper Ore', icon: '', category: 'Mining', skill: 'mining',
    xp: 85, sound: 'assets/sfx/mine.mp3', image: "assets/img/copper_ore.png",
    drops: [
      { minLevel: 35, chance: 0.064 },
    ],
  },
  {
    id: 'coal', name: 'Coal', icon: '', category: 'Mining', skill: 'mining',
    xp: 120, sound: 'assets/sfx/mine.mp3', image: 'assets/img/coal.png',
    drops: [
      { minLevel: 45, chance: 0.032 },
    ],
  },
  {
    id: 'iron_ore', name: 'Iron Ore', icon: '', category: 'Mining', skill: 'mining',
    xp: 150, sound: 'assets/sfx/mine.mp3', image: 'assets/img/iron_ore.png',
    drops: [
      { minLevel: 55, chance: 0.016 },
    ],
  },
  {
    id: 'silver_ore', name: 'Silver Ore', icon: '', category: 'Mining', skill: 'mining',
    xp: 350, sound: 'assets/sfx/mine.mp3', image: 'assets/img/silver_ore.png',
    drops: [
      { minLevel: 65, chance: 0.015 },
    ],
  },
  {
    id: 'gold_ore', name: 'Gold Ore', icon: '', category: 'Mining', skill: 'mining',
    xp: 900, sound: 'assets/sfx/mine.mp3', image: 'assets/img/gold_ore.png',
    drops: [
      { minLevel: 75, chance: 0.012 },
    ],
  },
  {
    id: 'obsidian_shards', name: 'Obsidian', icon: '', category: 'Mining', skill: 'mining',
    xp: 1400, sound: 'assets/sfx/mine.mp3', image: 'assets/img/obsidian.png',
    drops: [
      { minLevel: 85, chance: 0.008 },
    ],
  },
  {
    id: 'meteorite_ore', name: 'Meteorite', icon: '', category: 'Mining', skill: 'mining',
    xp: 5000, sound: 'assets/sfx/mine.mp3', image: 'assets/img/meteorite.png',
    drops: [
      { minLevel: 95, chance: 0.004 },
    ],
  },

  // === FISHING ===
  {
    id: 'shrimp', name: 'Shrimp', icon: '🦐', category: 'Fishing', skill: 'fishing',
    xp: 25, sound: 'assets/sfx/fish.m4a', image: 'assets/img/shrimp_raw.png', cookedVersion: 'cooked_shrimp',
    drops: [{ minLevel: 1, chance: 0.35 }],
  },
  {
    id: 'sardine', name: 'Sardine', icon: '🍤', category: 'Fishing', skill: 'fishing',
    xp: 60, sound: 'assets/sfx/fish.m4a', image: 'assets/img/sardine_raw.png', cookedVersion: 'cooked_sardine',
    drops: [{ minLevel: 15, chance: 0.12 }],
  },
  {
    id: 'trout', name: 'Trout', icon: '🐟', category: 'Fishing', skill: 'fishing',
    xp: 90, sound: 'assets/sfx/fish.m4a', image: 'assets/img/trout_raw.png', cookedVersion: 'cooked_trout',
    drops: [
      { minLevel: 30, chance: 0.09 },
    ],
  },
  {
    id: 'salmon', name: 'Salmon', icon: '🐡', category: 'Fishing', skill: 'fishing',
    xp: 200, sound: 'assets/sfx/fish.m4a', image: 'assets/img/salmon_raw.png', cookedVersion: 'cooked_salmon',
    drops: [
      { minLevel: 45, chance: 0.04 }
    ],
  },
  {
    id: 'tuna', name: 'Tuna', icon: '🍣', category: 'Fishing', skill: 'fishing',
    xp: 450, sound: 'assets/sfx/fish.m4a', image: 'assets/img/tuna_raw.png', cookedVersion: 'cooked_tuna',
    drops: [
      { minLevel: 65, chance: 0.01 }
    ],
  },
  {
    id: 'lobster', name: 'Lobster', icon: '🦞', category: 'Fishing', skill: 'fishing',
    xp: 750, sound: 'assets/sfx/fish.m4a', image: 'assets/img/lobster_raw.png', cookedVersion: 'cooked_lobster',
    drops: [
      { minLevel: 75, chance: 0.004 }
    ],
  },
  {
    id: 'shark', name: 'Shark', icon: '🦈', category: 'Fishing', skill: 'fishing',
    xp: 1400, sound: 'assets/sfx/fish.m4a', image: 'assets/img/shark_raw.png', cookedVersion: 'cooked_shark',
    drops: [
      { minLevel: 90, chance: 0.001 }
    ],
  },

  // === COOKING (produced by cooking, not dropped) ===
  {
    id: 'cooked_shrimp', name: 'Cooked Shrimp', icon: '🦐', category: 'Cooking', skill: 'cooking',
    xp: 10, sound: 'assets/sfx/cook.mp3', image: 'assets/img/shrimp_cooked.png',
    drops: [{ minLevel: 1, chance: 0.35 }], healAmount: 10,
  },
  {
    id: 'cooked_sardine', name: 'Cooked Sardine', icon: '🍤', category: 'Cooking', skill: 'cooking',
    xp: 10, sound: 'assets/sfx/cook.mp3', image: 'assets/img/sardine_cooked.png',
    drops: [{ minLevel: 5, chance: 0.12 }], healAmount: 14,
  },
  {
    id: 'cooked_trout', name: 'Cooked Trout', icon: '🐟', category: 'Cooking', skill: 'cooking',
    xp: 35, sound: 'assets/sfx/cook.mp3', image: 'assets/img/trout_cooked.png',
    drops: [
      { minLevel: 25, chance: 0.09 },
    ], healAmount: 20,
  },
  {
    id: 'cooked_salmon', name: 'Cooked Salmon', icon: '🐡', category: 'Cooking', skill: 'cooking',
    xp: 120, sound: 'assets/sfx/cook.mp3', image: 'assets/img/salmon_cooked.png',
    drops: [
      { minLevel: 40, chance: 0.04 }
    ], healAmount: 28,
  },
  {
    id: 'cooked_tuna', name: 'Cooked Tuna', icon: '🍣', category: 'Cooking', skill: 'cooking',
    xp: 300, sound: 'assets/sfx/cook.mp3', image: 'assets/img/tuna_cooked.png',
    drops: [
      { minLevel: 55, chance: 0.01 }
    ], healAmount: 38,
  },
  {
    id: 'cooked_lobster', name: 'Cooked Lobster', icon: '🦞', category: 'Cooking', skill: 'cooking',
    xp: 450, sound: 'assets/sfx/cook.mp3', image: 'assets/img/lobster_cooked.png',
    drops: [
      { minLevel: 70, chance: 0.004 }
    ], healAmount: 50,
  },
  {
    id: 'cooked_shark', name: 'Cooked Shark', icon: '🦈', category: 'Cooking', skill: 'cooking',
    xp: 650, sound: 'assets/sfx/cook.mp3', image: 'assets/img/shark_cooked.png',
    drops: [
      { minLevel: 90, chance: 0.001 }
    ], healAmount: 70,
  },
  // === COMBAT ===
  { id: 'silver_coin', name: 'Silver Coin', icon: '', category: 'Combat', xp: 0, image: 'assets/img/silver_coin.png' },
  { id: 'gold_coin', name: 'Gold Coin', icon: '🪙', category: 'Combat', xp: 0, image: 'assets/img/gold_coin.png'},
  
]

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