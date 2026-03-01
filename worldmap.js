// --- World Map Modal ---
let selectedMapNode = null;

function openMap() {
  selectedMapNode = null;
  renderMapNodes();
  updateMapFooter();
  document.getElementById('mapModal').classList.add('open');
}

function closeMap() {
  document.getElementById('mapModal').classList.remove('open');
}

function renderMapNodes() {
  const mapArea = document.getElementById('mapArea');

  // Remove old nodes
  mapArea.querySelectorAll('.map-node').forEach(n => n.remove());

  // Draw SVG paths
  const svg = document.getElementById('mapPaths');
  svg.innerHTML = '';
  ROUTES.forEach(route => {
    const a = LOCATIONS[route.from];
    const b = LOCATIONS[route.to];

    // Dashed path line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', a.x + '%');
    line.setAttribute('y1', a.y + '%');
    line.setAttribute('x2', b.x + '%');
    line.setAttribute('y2', b.y + '%');
    line.setAttribute('class', 'map-path');
    svg.appendChild(line);

    // Route label at midpoint
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', midX + '%');
    text.setAttribute('y', midY + '%');
    text.setAttribute('class', 'map-path-label');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dy', '-6');
    text.textContent = route.name;
    svg.appendChild(text);
  });

  // Draw location nodes
  Object.values(LOCATIONS).forEach(loc => {
    const node = document.createElement('div');
    node.className = 'map-node';
    node.dataset.locId = loc.id;

    if (loc.id === currentLocation)          node.classList.add('current');
    if (loc.id === travelDest)               node.classList.add('destination');
    if (loc.id === selectedMapNode)          node.classList.add('selected');

    node.innerHTML = `<div class="node-icon">${loc.icon}</div><div class="node-name">${loc.name}</div>`;
    node.style.left = loc.x + '%';
    node.style.top  = loc.y + '%';

    node.addEventListener('click', () => {
      if (loc.id === currentLocation) return;
      if (gameMode === 'travel') return;
      selectedMapNode = loc.id;
      document.querySelectorAll('.map-node').forEach(n => n.classList.remove('selected'));
      node.classList.add('selected');
      updateMapFooter();
    });

    mapArea.appendChild(node);
  });
}

function updateMapFooter() {
  const btn  = document.getElementById('mapTravelBtn');
  const info = document.getElementById('mapTravelInfo');

  if (gameMode === 'travel') {
    const dest = LOCATIONS[travelDest];
    const pct  = travelStepsRequired > 0
      ? Math.floor(travelStepsDone / travelStepsRequired * 100)
      : 0;
    btn.disabled     = true;
    btn.textContent  = `Already traveling... (${pct}%)`;
    info.textContent = `En route to ${dest ? dest.name : '?'}`;
    return;
  }

  const currentLoc = LOCATIONS[currentLocation];
  if (!selectedMapNode) {
    btn.disabled     = true;
    btn.textContent  = 'Select a destination';
    info.textContent = currentLoc ? `You are at: ${currentLoc.name}` : '';
    return;
  }

  const route = getRoute(currentLocation, selectedMapNode);
  const dest  = LOCATIONS[selectedMapNode];
  if (!dest) {
    btn.disabled     = true;
    btn.textContent  = 'Select a destination';
    info.textContent = currentLoc ? `You are at: ${currentLoc.name}` : '';
    return;
  }
  btn.disabled     = false;
  btn.textContent  = `Travel to ${dest.name}`;
  info.textContent = route
    ? route.name
    : 'No route found';
}

document.getElementById('mapTravelBtn').addEventListener('click', () => {
  if (!selectedMapNode || gameMode === 'travel') return;
  startTravel(selectedMapNode);
  closeMap();
});

document.getElementById('mapCloseBtn').addEventListener('click', closeMap);

// Close on backdrop click
document.getElementById('mapModal').addEventListener('click', e => {
  if (e.target === document.getElementById('mapModal')) closeMap();
});