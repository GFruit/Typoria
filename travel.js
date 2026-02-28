// Sequential story shown while traveling. Loops if exhausted before arrival.
const travelStory = [
  "The crunch of crystalline snow beneath Elias's boots was the only sound in the sub-zero silence. High in the Andes, the air was a thin, hungry ghost, stealing the warmth from his lungs. He wasn't just hiking; he was ascending into a realm where the sky touched the jagged teeth of the earth.",
  "Deep in the bioluminescent glades of Xylos-4, the moss pulsed with a soft, rhythmic violet light. Every step Captain Miller took released a cloud of shimmering spores that floated like tiny embers. The 'nature' here wasn't green, but it was alive, breathing in sync with her heavy spacesuit respirators.",
  "The old trail was buried under a decade of rot and brambles. Silas used his machete not just to clear a path, but to vent his frustration. He wasn't looking for a scenic view; he was looking for the cabin his grandfather had mentioned in those fevered journals. The woods felt like they were watching.",
  "Sunlight filtered through the redwood canopy in dusty, golden cathedrals. Clara felt small, not in a way that diminished her, but in a way that offered relief. Surrounded by giants that had stood for a thousand years, her modern anxieties felt like temporary flickers of static against a backdrop of eternal green.",
  "The desert is a deceptive host. It offers vast, golden beauty while quietly plotting your dehydration. Marcus watched the heat waves dance off the canyon floor. He adjusted his pack, the weight of the water bottles more precious than gold. Here, survival was the most intense form of meditation he had ever known.",
  "Through the misty Scottish Highlands, the heather was a purple bruise across the landscape. Fiona walked until her legs burned, chasing the ghosts of clan battles and ancient songs. The rain wasn't an inconvenience; it was a baptism, washing away the city soot until she felt as raw and rugged as the granite peaks.",
  "Detective Aris followed the muddy prints into the heart of the marsh. This wasn't a recreational stroll. The cypress knees rose from the black water like gnarled fingers. Every splash of a distant alligator made him grip his flashlight tighter. Nature wasn't a sanctuary today; it was a crime scene hiding its secrets.",
  "The toddler's first hike was less of a trek and more of a series of fascinations. To him, a single beetle on a leaf was a dragon guarding a castle. Every pebble was a gem. His mother watched, realizing she had forgotten how to see the forest for the trees, while he was busy seeing the universe in a blade of grass.",
  "In the year 2142, 'nature' was a holographic simulation in a steel bunker. Leo walked the virtual trail, feeling the haptic feedback of simulated wind on his face. He knew the pine scent was a chemical aerosol, but as he reached the digital summit, his heart raced with a longing for a world he had never actually touched.",
  "The autumn leaves were a riot of carnage—vivid reds, dying oranges, and brittle browns. Samantha walked the ridge, the wind whipping her hair into a frenzy. She thought about how nature prepares for death by putting on its most beautiful clothes. It made her own transition, her own goodbye, feel a little more like a celebration.",
  "Scaling the volcanic rim was like walking on the crust of a primordial soup. The sulfurous steam hissed from vents in the rock, smelling of the earth's deep, dark gut. Below, the lava glowed a dull, angry crimson. One misstep meant melting; one right step meant witnessing the very moment the world creates itself.",
  "The Appalachian Trail is a long conversation with yourself. By mile five hundred, Ben had run out of things to say. He just walked. His rhythm became mechanical, his thoughts drifting into a wordless flow. He wasn't a man walking through the woods anymore; he was just another moving part of the ecosystem, lean and hungry.",
  "They hiked by moonlight, the silver glow turning the forest into a monochrome dreamscape. No headlamps were allowed; they wanted to see the world as the owls did. Shadows stretched into long, spindly limbs, and the rustle of a nocturnal fox sounded like a landslide in the heavy, quiet air of the midnight woods.",
  "The jungle was a wall of noise—screaming macaques, buzzing insects, and the heavy drip of humidity. Elena hacked through the vines, her skin slick with sweat and insect repellent. She was searching for the ruins of a temple lost to the greenery, a place where stone and root had become a single, suffocating entity.",
  "A gentle stroll through the wildflower meadow was exactly what the doctor ordered. The bees hummed a low, drowsy cello note. Butterflies danced in chaotic zig-zags. For a woman who spent her life staring at spreadsheets, the simple act of crushing wild mint under her sneakers felt like a revolutionary act of defiance.",
  "The ridge line was narrow, a tightrope of shale with a thousand-foot drop on either side. Gravity felt like a physical tug on his backpack. Every placement of his trekking pole was a calculated risk. Up here, there was no room for ego, only the cold, hard reality of physics and the screaming wind that tried to push him off.",
  "In the heart of the bamboo forest, the world turned a translucent, watery green. The tall stalks swayed and creaked like the masts of a ghost ship. It was a vertical labyrinth. Kenji walked the stone path, the rhythmic 'tack-tack' of his wooden staff echoing against the hollow wood, seeking a zen that always felt one turn away.",
  "The prairie stretched forever, a sea of tallgrass waving under a bruised storm sky. Hiking here wasn't about elevation; it was about horizon. You could see the rain coming from twenty miles away, a gray curtain draped over the earth. It made you feel exposed, a tiny speck of dust under the giant, watchful eye of the storm.",
  "Deep in the limestone caverns, the hike went vertical. Descending into the belly of the earth, the stalactites hung like frozen tears. The air was still and tasted of damp stone and ancient minerals. Without his headlamp, the darkness was so thick it felt like a physical weight against his eyes, a total absence of the world.",
  "The coastal path smelled of salt spray and rotting kelp. The Pacific crashed against the cliffs with a rhythmic violence that shook the ground. Sarah walked the edge, watching the gray whales breach in the distance. The scale of the ocean made her problems feel like grains of sand, easily swept away by the incoming tide.",
  "He wore his best suit to hike the hill behind his childhood home. It was a ridiculous sight, but he didn't care. He reached the summit where the old oak stood, the one they used to climb before the world got complicated. He sat in the dirt, ruined his trousers, and finally let himself cry into the rough, unforgiving bark.",
  "The swamp was a cathedral of rot. Spanish moss draped from the trees like tattered funeral veils. Every step into the muck was a gamble with the unknown. It wasn't 'pretty' nature, but it was fertile and fierce. The hiker moved slowly, respecting the prehistoric stillness of the snapping turtles and the silent, drifting lilies.",
  "Winter hiking is an exercise in endurance. The trail was gone, buried under three feet of fresh powder. Every step required a high-kneed lunge, a brutal workout for the quads. But when he reached the frozen waterfall, a giant blue fang of ice hanging from the cliff, the sheer, frozen majesty of it made the pain vanish.",
  "The suburban 'nature trail' was a paved loop between two housing developments. It wasn't the wilderness, but for the elderly man with the walker, it was a mountain. He noted the arrival of the first robins and the budding of the maples with the precision of a scientist. To him, this half-mile was a grand, heroic expedition.",
  "The canyon was a red-rock wound in the earth, layered with millions of years of history. Walking down into it was like traveling backward through time. Each layer of sediment was a different era, a different climate. By the time he reached the river at the bottom, he felt like he had walked through the biography of the planet."
];

// --- Arrival guard ---
let arriving = false;

// --- Agility skill ---
let agilityXp        = parseInt(localStorage.getItem('typoria_xp_agility')    || '0');
let agilityLastLevel = 1;

function updateAgilityUI() {
  const { level, currentXp, neededXp } = getLevelInfo(agilityXp);
  const el = document.getElementById('agilLevel');
  el.textContent = level;
  if (level > agilityLastLevel) {
    el.classList.remove('level-up');
    void el.offsetWidth;
    el.classList.add('level-up');
    agilityLastLevel = level;
  }
  const pct = level < MAX_LEVEL ? (currentXp / neededXp) * 100 : 100;
  document.getElementById('agilBar').style.width = pct + '%';
  document.getElementById('agilXpLabel').textContent =
    level < MAX_LEVEL ? `${currentXp} / ${neededXp} XP` : 'MAX LEVEL';
}

function saveAgilityState() {
  localStorage.setItem('typoria_xp_agility', agilityXp);
}

// --- Travel state persistence ---
function saveTravelState() {
  localStorage.setItem('typoria_location',     currentLocation);
  localStorage.setItem('typoria_travel_dest',  travelDest);
  localStorage.setItem('typoria_travel_steps', travelStepsDone);
  localStorage.setItem('typoria_travel_req',   travelStepsRequired);
  localStorage.setItem('typoria_story_idx',    travelStoryIndex);
}

// --- Travel progress bar ---
function updateTravelProgressBar() {
  const pct = travelStepsRequired > 0
    ? Math.min(travelStepsDone / travelStepsRequired * 100, 100)
    : 0;
  document.getElementById('travelProgressFill').style.width = pct + '%';
  document.getElementById('travelProgressText').textContent =
    `${travelStepsDone} / ${travelStepsRequired} steps`;
  const dest = LOCATIONS[travelDest];
  if (dest) {
    document.getElementById('travelToName').textContent  = dest.name + ' ' + dest.icon;
    document.getElementById('travelDestName').textContent = dest.name;
    document.getElementById('travelStepsDisplay').textContent = travelStepsDone;
  }
  document.getElementById('travelFromName').textContent =
    LOCATIONS[currentLocation] ? LOCATIONS[currentLocation].name : '';
}

// --- Start traveling ---
function startTravel(destId) {
  const route = getRoute(currentLocation, destId);
  if (!route) return;

  travelDest          = destId;
  travelStepsDone     = 0;
  travelStepsRequired = route.steps;
  travelStoryIndex    = 0;
  gameMode            = 'travel';

  saveTravelState();
  enterTravelMode();
}

// --- Enter / exit travel mode ---
function enterTravelMode() {
  gameMode = 'travel';
  document.body.className = 'mode-travel scene-' +
    (LOCATIONS[travelDest] ? LOCATIONS[travelDest].scene : currentScene);

  agilityLastLevel = getLevelInfo(agilityXp).level;
  updateAgilityUI();
  updateTravelProgressBar();

  rebuildQuotePool();
  buildQuote(getNextQuote());
  typingInput.focus();
}

function exitTravelMode() {
  gameMode = 'skill';
}

// --- Arrive at destination ---
function arriveAtDestination() {
  if (arriving) return; // prevent double-fire from fast typing
  if (!travelDest || !LOCATIONS[travelDest]) return; // safety check
  arriving = true;
  typingInput.disabled = true;

  const destId = travelDest; // capture before clearing

  const overlay = document.getElementById('transitionOverlay');
  const fromEl  = document.getElementById('transitionFrom');
  const toEl    = document.getElementById('transitionTo');

  const bgMap = {
    woodcutting: "url('forest.png')",
    mining:      "url('mine.png')",
  };
  const destScene = LOCATIONS[destId].scene;
  fromEl.style.backgroundImage = "url('travel.png')";
  toEl.style.backgroundImage   = bgMap[destScene] || "url('forest.png')";

  overlay.classList.add('active');
  fromEl.classList.add('fading');

  setTimeout(() => {
    currentLocation     = destId;
    travelDest          = '';
    travelStepsDone     = 0;
    travelStepsRequired = 0;
    travelStoryIndex    = 0;
    saveTravelState();

    currentScene = LOCATIONS[currentLocation].scene;
    localStorage.setItem('typoria_scene', currentScene);
    loadSceneState();

    exitTravelMode();
    updateSceneUI();
    updateStreakUI();
    rebuildQuotePool();
    buildQuote(getNextQuote());
    showArrivalBanner(LOCATIONS[currentLocation].name);

    overlay.classList.remove('active');
    fromEl.classList.remove('fading');
    arriving = false;
    typingInput.disabled = false;
    typingInput.focus();
  }, 3000);
}

function showArrivalBanner(locationName) {
  const banner = document.getElementById('arrivalBanner');
  banner.textContent = `You have arrived at ${locationName}!`;
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 3500);
}

// --- Travel quote (sequential, not shuffled) ---
function getNextTravelQuote() {
  const idx = travelStoryIndex % travelStory.length;
  travelStoryIndex++;
  localStorage.setItem('typoria_story_idx', travelStoryIndex);
  return travelStory[idx];
}