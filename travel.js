// Sequential story shown while traveling.
const travelStory = [
  "Adventure is worthwhile.",
  "Travel is the only thing you buy that makes you richer.",
  "I haven't been everywhere, but it's on my list.",
  "Not all those who wander are lost.",
  "To travel is to live.",
  "Jobs fill your pocket, but adventures fill your soul.",
  "Dare to live the life you've always wanted.",
  "The world is a book and those who do not travel read only one page.",
  "Travel far enough, you meet yourself.",
  "Go fly, roam, travel, voyage, explore, journey, discover, adventure.",
  "Life is short and the world is wide.",
  "Don't listen to what they say. Go see.",
  "A journey of a thousand miles begins with a single step.",
  "Travel makes one modest. You see what a tiny place you occupy in the world.",
  "Take only memories, leave only footprints.",
  "Better to see something once than to hear about it a thousand times.",
  "I'm in love with cities I've never been to and people I've never met.",
  "Work, Travel, Save, Repeat.",
  "The goal is to die with memories, not dreams.",
  "Life is either a daring adventure or nothing at all.",
  "Of all the books in the world, the best stories are found between the pages of a passport.",
  "I follow my heart and it leads me to the airport.",
  "Traveling - it leaves you speechless, then turns you into a storyteller.",
  "A change in latitude helps the attitude.",
  "The tan will fade, but the memories will last forever.",
  "Collect moments, not things.",
  "Wander often, wonder always.",
  "Travel is an investment in yourself.",
  "Jet lag is for amateurs.",
  "Life begins at the end of your comfort zone.",
  "I am not the same, having seen the moon shine on the other side of the world.",
  "He who would travel happily must travel light.",
  "Paris is always a good idea.",
  "Once a year, go someplace you've never been before.",
  "To awaken quite alone in a strange town is one of the pleasantest sensations in the world.",
  "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.",
  "Travel is never a matter of money but of courage.",
  "Live your life by a compass, not a clock.",
  "My favorite thing to do is go where I've never been.",
  "Two roads diverged in a wood and I - I took the one less traveled by.",
  "If you think adventure is dangerous, try routine; it is lethal.",
  "We travel for romance, we travel for architecture, and we travel to be lost.",
  "Blessed are the curious for they shall have adventures.",
  "Great things never came from comfort zones.",
  "A mind that is stretched by a new experience can never go back to its old dimensions.",
  "The gladdest moment in human life is a departure into unknown lands.",
  "Travel is glamorous only in retrospect.",
  "Actually, the best gift you could have given her was a lifetime of adventures.",
  "There is no time to be bored in a world as beautiful as this.",
  "And then I realized adventures are the best way to learn.",
  "Breaking news this evening: local officials have finally reopened the mountain pass after a record-breaking blizzard left hundreds of travelers stranded in their vehicles for over forty-eight hours.",
  "Look, I know we said we'd just 'wing it,' but we have been walking in circles for twenty minutes and I am ninety-nine percent sure that goat back there is mocking us. Can we please just use the GPS?",
  "Excuse me, Professor? I was reading the syllabus and I noticed that the study abroad trip to Florence overlaps with my final exams. Is there any way I can take the test early or perhaps remotely?",
  "I don't want to just go to a beach and sit there, Sarah. I want to go somewhere where I don't speak the language, where the food is unrecognizable, and where my phone doesn't have a single bar of service.",
  "Ladies and gentlemen, as we begin our final descent into Tokyo, please ensure your seatbacks and tray tables are in their full upright and locked positions. We thank you for flying with us today.",
  "Honestly, the best part of the entire trip wasn't the Eiffel Tower or the museums. It was that tiny, nameless bakery we found at three in the morning that served the best croissants I have ever tasted.",
  "If you look to your left, you will see the ruins of the ancient aqueduct. It was built over two thousand years ago and yet it stands more sturdy than most of the apartment buildings in my neighborhood.",
  "I've spent twenty years acting in front of green screens in Hollywood, but standing here at the edge of the Grand Canyon is the first time in a long time I've felt like I wasn't just following a script.",
  "So, I was thinking... I have two tickets to that immersive art exhibit in the city this weekend. I know it's not exactly a trip to Italy, but would you maybe want to go with me and grab some dinner after?",
  "The thing about backpacking through Europe is that you eventually stop caring about how you smell and start caring deeply about exactly how many grams of weight are currently sitting on your lower back.",
  "Mom, I promise I'll call you as soon as I land. Yes, I have my passport. Yes, I have my portable charger. No, I am not going to talk to strangers unless they are extremely nice and offering me free food.",
  "Welcome back to 'Global Treks.' Today we are exploring the hidden alleyways of Marrakech, where the scent of cumin and turmeric fills the air and every corner holds a secret waiting to be discovered by us.",
  "I'm not saying the hotel was bad, I'm just saying that the 'ocean view' they advertised was actually just a framed picture of a dolphin taped to the window of a dark basement across the street.",
  "Wait, did you remember to pack the universal power adapter? Because if we get to London and I can't charge my laptop to finish this report, I am going to have a very stressful conversation with my boss.",
  "Listen to me carefully: if the map says it is a twenty-minute hike, you should probably assume it will take us an hour because you insist on stopping to take a photo of every single blade of grass we pass.",
  "In today's lesson, we will be discussing the socio-economic impacts of mass tourism on coastal Mediterranean villages. Please open your textbooks to page one hundred and forty-two and look at the graph.",
  "I never understood why people enjoy cruises. You're basically trapped on a giant floating shopping mall with three thousand strangers and an unlimited supply of lukewarm shrimp cocktail. It's bizarre.",
  "There is a certain kind of magic that happens when you're sitting in a train station in a foreign country, watching people live out their entire lives while you're just passing through for a few hours.",
  "I've been a travel agent for thirty years and let me tell you, the people who plan every single second of their vacation are usually the ones who end up having the least amount of actual fun.",
  "Hey, do you think if we just keep driving north we'll eventually hit the snow? I've never actually seen a white Christmas before and I feel like this old van has at least one more good road trip left in it.",
  "The protagonist's journey in this novel isn't just about the physical distance traveled, but rather the internal psychological shift that occurs when she is forced to confront her past in a new environment.",
  "Attention all passengers on Flight 4B: due to a mechanical issue with the incoming aircraft, your departure has been delayed by approximately three hours. We apologize for any inconvenience this may cause.",
  "Is it just me, or does every airport gift shop sell the exact same brand of overpriced bottled water and those weird neck pillows that never actually feel comfortable no matter how you position them?",
  "I read somewhere that the human brain processes time differently when you're in a new environment, which explains why a week-long vacation feels like a month, but a week at the office feels like a single day.",
  "Can you imagine what it was like for the early explorers? No satellite imagery, no weather apps, just a wooden boat and a very strong hope that they wouldn't accidentally sail right off the edge of the earth.",
  "I don't care if it's raining in Seattle. It's always raining in Seattle. That's part of the aesthetic! Grab your raincoat and let's go find that record store everyone has been talking about on the forums.",
  "The documentary filmmaker spent six months living with the nomadic tribes of the Sahara to capture the footage you are about to see, often going days without access to clean water or electricity.",
  "If we miss this bus, the next one doesn't come until Tuesday. I am not joking. I am looking at the schedule right now and it literally says 'Tuesday or whenever the driver feels like showing up.' Move your feet!",
  "You know you've been traveling too long when you wake up in a hotel room and have to spend a full thirty seconds trying to remember which country you are in and what the currency is called.",
  "I think the true test of any relationship is trying to navigate a crowded foreign subway system together while carrying heavy luggage and suffering from a severe lack of caffeine and sleep.",
  "Sir, I'm going to need you to step aside for additional screening. It appears you have a large metallic object in your carry-on bag that is obstructing our view of the rest of your belongings.",
  "The sunset over the Santorini caldera was so beautiful that for a moment, I actually forgot that my feet were covered in blisters and that I had spent the last four hours dodging aggressive donkeys.",
  "Why is it that whenever you try to take a shortcut in a foreign city, you always end up in a residential neighborhood where everyone stares at you like you just dropped out of a literal spaceship?",
  "I'm not lost, I am just exploring the scenic route. Although, I will admit that the scenic route currently involves a lot of muddy fields and a very confused-looking cow standing in the middle of the road.",
  "Could you please tell the driver that we need to stop at the next pharmacy? My motion sickness is kicking in and these winding mountain roads are starting to make me feel like I'm on a very bad carnival ride.",
  "They say that travel broadens the mind, but in my experience, it mostly just broadens your appreciation for a toilet that actually flushes and a bed that doesn't feel like it was carved out of solid granite.",
  "The actress turned to the camera, her eyes welling with tears as she delivered the final line: 'I came here looking for a new beginning, but I realized that I brought all my old problems with me in my suitcase.'",
  "Is it possible to be homesick for a place you've only spent three days in? Because I am currently sitting in my living room and all I can think about is that little coffee shop in Copenhagen.",
  "We are currently flying at an altitude of thirty-five thousand feet. If you look out the window on the right side of the aircraft, you might be able to catch a glimpse of the Northern Lights dancing across the sky.",
  "I've decided that my official retirement plan is to move to a small village in the south of France, learn how to bake bread, and never look at a computer screen or a spreadsheet ever again for the rest of my life.",
  "Do you ever feel like you're just a background character in someone else's vacation? Like, we're in all these people's photos of the Trevi Fountain and they'll never even know our names or where we're from.",
  "I'm sorry, but did that sign just say the bridge is out? Because the map clearly shows a road going straight across the river, and I really don't feel like swimming to the other side with a twenty-pound pack.",
  "The history of the Silk Road is a fascinating tapestry of trade, culture, and conflict that shaped the modern world in ways that we are still trying to fully comprehend in our history classes today.",
  "I'm telling you, the secret to a happy life is a valid passport and a pair of shoes that are comfortable enough to walk ten miles in. Everything else is just extra noise that you don't really need.",
  "Wait, stop the car! Is that a roadside stand selling homemade peach cobbler? Because if it is, I am officially declaring a mandatory ten-minute break for the purposes of cultural research and snacking.",
  "I once spent an entire night in a bus station in Peru talking to a man who didn't speak a word of English about the best way to cook potatoes. It was the most profound conversation of my entire life.",
  "The local guide explained that the patterns on the traditional weavings were actually a form of visual language, telling the story of the village's ancestors and their journey across the high mountain plains.",
  "I'm not saying I'm addicted to traveling, but I did spend my entire lunch break today looking at flights to Iceland even though I know perfectly well that I have exactly twelve dollars in my savings account.",
  "You haven't truly lived until you've tried to explain to a confused Italian grandmother that you are allergic to gluten while she is actively trying to serve you a third helping of homemade lasagna.",
  "As the sun dipped below the horizon, painting the sky in shades of violet and gold, I realized that no matter how far I traveled, the most important journey was always the one that led me back to you."
];
// Track which quotes have been used so we don't repeat until all are exhausted
let _travelQuotePool = [];

function getNextTravelQuote() {
  if (_travelQuotePool.length === 0) {
    _travelQuotePool = travelStory.map((_, i) => i);
  }
  const pick = Math.floor(Math.random() * _travelQuotePool.length);
  const idx  = _travelQuotePool.splice(pick, 1)[0];
  return travelStory[idx];
}

// --- Arrival guard ---
let arriving = false;

// Letter counter (shown in sidebar Journey section)
let travelLettersDone = 0;

// --- Agility skill ---
let agilityXp        = parseInt(localStorage.getItem('typoria_xp_agility') || '0');
let agilityLastLevel = 1;

function updateAgilityUI() {
  const { level, currentXp, neededXp } = getLevelInfo(agilityXp);
  const el = document.getElementById('agilLevel');
  el.textContent = `${level} / ${MAX_LEVEL}`;
  if (level > agilityLastLevel) {
    el.classList.remove('level-up');
    void el.offsetWidth;
    el.classList.add('level-up');
    agilityLastLevel = level;
    playLevelUpSound();
  }
  const pct = level < MAX_LEVEL ? (currentXp / neededXp) * 100 : 100;
  document.getElementById('agilBar').style.width     = pct + '%';
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
}

// --- Travel progress bar ---
function updateTravelProgressBar(wordIndex, totalWords) {
  // Progress bar fills based on word position within the quote
  const pct = totalWords > 0
    ? Math.min((wordIndex / totalWords) * 100, 100)
    : 0;
  document.getElementById('travelProgressFill').style.width   = pct + '%';
  document.getElementById('travelProgressText').textContent = `${wordIndex} / ${totalWords} words`;

  const dest = LOCATIONS[travelDest];
  if (dest) {
    document.getElementById('travelToName').textContent       = dest.name + ' ' + dest.icon;
    document.getElementById('travelDestName').textContent     = dest.name;
    document.getElementById('travelStepsDisplay').textContent = travelLettersDone;
  }
  document.getElementById('travelFromName').textContent =
    LOCATIONS[currentLocation] ? LOCATIONS[currentLocation].name : '';
}

// Called by typing.js on every completed word while traveling
function onTravelWordComplete(xpGain, mult, wordIndex, totalWords) {
  playSound(['assets/sfx/walk.ogg', 'assets/sfx/walk2.mp3', 'assets/sfx/walk3.mp3'], 0.5, 1) //play Sound
  agilityXp        += xpGain;
  travelLettersDone += xpGain; // xpGain = word length × multiplier = letters typed
  saveAgilityState();
  updateAgilityUI();
  updateTravelProgressBar(wordIndex + 1, totalWords);

  // Arrive when last word of the quote is typed
  if (wordIndex + 1 >= totalWords) {
    travelStepsDone = 1;
    saveTravelState();
    wpmOnQuoteComplete();
    setTimeout(arriveAtDestination, 2000);
  }
}

// --- Start traveling ---
function startTravel(destId) {
  const route = getRoute(currentLocation, destId);
  if (!route) return;

  travelDest          = destId;
  travelStepsDone     = 0;
  travelStepsRequired = route.quotes;
  travelLettersDone   = 0;
  _travelQuotePool    = [];
  gameMode            = 'travel';

  saveTravelState();
  enterTravelMode();
}

// --- Enter / exit travel mode ---
function enterTravelMode() {
  gameMode = 'travel';
  document.body.className = 'mode-travel scene-' +
    (LOCATIONS[travelDest] ? LOCATIONS[travelDest].scene : currentScene);

  _setCookingVisible(false);  // ← add this

  agilityLastLevel = getLevelInfo(agilityXp).level;
  updateAgilityUI();
  updateTravelProgressBar(0, 1);

  //rebuildQuotePool();
  buildQuote(getNextQuote());
  updateTravelProgressBar(0, wordElements.length);
  typingInput.focus();
}

function exitTravelMode() {
  gameMode = 'skill';
}

// --- Arrive at destination ---
function arriveAtDestination() {
  if (arriving) return;
  if (!travelDest || !LOCATIONS[travelDest]) return;
  arriving = true;
  typingInput.disabled = true;

  const toast = document.getElementById('achievementToast');
  if (achievementToastActive || achievementQueue.length > 0 || toast.classList.contains('show')) {
    arriving = false;
    typingInput.disabled = false;
    setTimeout(arriveAtDestination, 100);
    return;
  }

  const destId = travelDest;

  const overlay = document.getElementById('transitionOverlay');
  const fromEl  = document.getElementById('transitionFrom');
  const toEl    = document.getElementById('transitionTo');

  const bgMap = {
    woodcutting: "url('assets/img/forest.png')",
    mining:      "url('assets/img/mine.png')",
    fishing:     "url('assets/img/lake.png')",
    cooking:     "url('assets/img/campsite.jpg')",
  };
  const destScene = LOCATIONS[destId].scene;
  fromEl.style.backgroundImage = "url('assets/img/travel.png')";
  toEl.style.backgroundImage   = bgMap[destScene] || "url('assets/img/forest.png')";

  overlay.classList.add('active');
  fromEl.classList.add('fading');

 

  setTimeout(() => {
    currentLocation     = destId;
    travelDest          = '';
    travelStepsDone     = 0;
    travelStepsRequired = 0;
    travelLettersDone   = 0;
    saveTravelState();

    const prevScene = currentScene;
    currentScene = LOCATIONS[currentLocation].scene;
    if (prevScene === 'cooking') {
      endCookingSession();
    }
    currentScene = LOCATIONS[currentLocation].scene;
    localStorage.setItem('typoria_scene', currentScene);
    loadSceneState();

    exitTravelMode();
    updateSceneUI();
    updateStreakUI();
    buildQuote(getNextQuote());

    overlay.classList.remove('active');
    fromEl.classList.remove('fading');
    arriving = false;
    typingInput.disabled = false;
    typingInput.focus();
    console.log(destId);
    checkTravelAchievements(destId); //e.g. Travel to Mine, Travel to Campsite, etc.
  }, 3000);
}

function showArrivalBanner(locationName) {
  const banner = document.getElementById('arrivalBanner');
  banner.textContent = `You have arrived at ${locationName}!`;
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 3500);
}