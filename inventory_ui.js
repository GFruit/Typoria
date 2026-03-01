// Renders an item icon into a container element.
// Uses image if defined, falls back to emoji.
// discovered: if false, applies greyscale filter for undiscovered state.
function renderItemIcon(container, item, discovered = true) {
  container.innerHTML = '';
  if (item.image) {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.className = 'item-img-icon';
    if (!discovered) img.classList.add('undiscovered-img');
    container.appendChild(img);
  } else {
    container.textContent = item.icon;
    if (!discovered) container.style.filter = 'grayscale(1) brightness(0.25)';
  }
}

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
      const qty = getItemQty(item.id);
      const found = qty > 0;

      const card = document.createElement('div');
      card.className = 'inv-card' + (found ? ' found' : ' undiscovered');
      card.title = found ? `${item.name}: ${qty}` : '???';

      const iconEl = document.createElement('div');
      iconEl.className = 'inv-card-icon';

      renderItemIcon(iconEl, item, found);

      const nameEl = document.createElement('div');
      nameEl.className = 'inv-card-name';
      nameEl.textContent = found ? item.name : '???';

      const qtyEl = document.createElement('div');
      qtyEl.className = 'inv-card-qty';
      qtyEl.textContent = found ? qty.toLocaleString() : '';

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
    renderItemIcon(span, item, true);
    span.title = item.name;
    // Pop animation
    span.classList.add('pop');
    el.appendChild(span);
  });
}