// --- Inventory Overlay ---

function openInventory() {
  renderInventoryGrid();
  document.getElementById('inventoryModal').classList.add('open');
}

function closeInventory() {
  document.getElementById('inventoryModal').classList.remove('open');
}

function renderInventoryGrid() {
  const grid = document.getElementById('inventoryGrid');
  grid.innerHTML = '';

  // Group by category
  const categories = [...new Set(ITEM_REGISTRY.map(i => i.category))];

  categories.forEach(cat => {
    const items = ITEM_REGISTRY.filter(i => i.category === cat);

    const header = document.createElement('div');
    header.className = 'inv-category-header';
    header.textContent = cat;
    grid.appendChild(header);

    const row = document.createElement('div');
    row.className = 'inv-grid-row';

    items.forEach(item => {
      const qty        = getItemQty(item.id);
      const discovered = discoveredItems.has(item.id);

      const card = document.createElement('div');
      card.className = 'inv-card' + (discovered ? ' found' : ' undiscovered');
      card.title = discovered ? `${item.name}: ${qty}` : '???';

      const iconEl = document.createElement('div');
      iconEl.className = 'inv-card-icon';

      if (item.image) {
        iconEl.style.backgroundImage = `url('${item.image}')`;
        iconEl.style.backgroundSize = 'contain';
        iconEl.style.backgroundRepeat = 'no-repeat';
        iconEl.style.backgroundPosition = 'center';
        if (!discovered) iconEl.style.filter = 'brightness(0)';
      } else {
        iconEl.textContent = item.icon;
      }

      const nameEl = document.createElement('div');
      nameEl.className = 'inv-card-name';
      nameEl.textContent = discovered ? item.name : '???';

      const qtyEl = document.createElement('div');
      qtyEl.className = 'inv-card-qty';
      qtyEl.textContent = discovered ? qty.toLocaleString() : '';

      card.appendChild(iconEl);
      card.appendChild(nameEl);
      card.appendChild(qtyEl);
      row.appendChild(card);
    });

    grid.appendChild(row);
  });
}

document.getElementById('inventoryCloseBtn').addEventListener('click', closeInventory);
document.getElementById('inventoryModal').addEventListener('click', e => {
  if (e.target === document.getElementById('inventoryModal')) closeInventory();
});
document.getElementById('inventoryBtn').addEventListener('click', openInventory);

// --- Last Drop sidebar display ---
function updateLastDropDisplay(droppedIds) {
  const el = document.getElementById('lastDropIcons');
  if (!droppedIds || droppedIds.length === 0) {
    el.textContent = '—';
    return;
  }
  el.innerHTML = '';
  droppedIds.forEach(id => {
    const item = getItem(id);
    if (!item) return;
    const span = document.createElement('span');
    span.className = 'last-drop-icon';
    span.title = item.name;
    if (item.image) {
      span.style.backgroundImage = `url('${item.image}')`;
      span.style.backgroundSize = 'contain';
      span.style.backgroundRepeat = 'no-repeat';
      span.style.backgroundPosition = 'center';
      span.style.display = 'inline-block';
      span.style.width = '1.5rem';
      span.style.height = '1.5rem';
    } else {
      span.textContent = item.icon;
    }
    // Pop animation
    span.classList.add('pop');
    el.appendChild(span);
  });
}