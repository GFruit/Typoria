// --- Inventory UI ---

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

  for (let i = 0; i < INVENTORY_SIZE; i++) {
    const id   = inventorySlots[i];
    const item = id ? getItem(id) : null;
    const qty  = id ? getSlotQty(i) : 0;

    const slot = document.createElement('div');
    slot.className = 'inv-slot' + (item ? ' inv-slot-filled' : ' inv-slot-empty');
    slot.dataset.slotIndex = i;
    slot.draggable = !!item;

    if (item) {
      const iconEl = document.createElement('div');
      iconEl.className = 'inv-slot-icon';
      if (item.image) {
        iconEl.style.backgroundImage    = `url('${item.image}')`;
        iconEl.style.backgroundSize     = 'contain';
        iconEl.style.backgroundRepeat   = 'no-repeat';
        iconEl.style.backgroundPosition = 'center';
      } else {
        iconEl.textContent = item.icon;
      }

      const qtyEl = document.createElement('div');
      qtyEl.className   = 'inv-slot-qty';
      qtyEl.textContent = qty >= 1000 ? Math.floor(qty / 1000) + 'k' : qty;

      slot.title = `${item.name} (${qty.toLocaleString()})`;
      slot.appendChild(iconEl);
      slot.appendChild(qtyEl);

      // Drag to reorder
      slot.addEventListener('dragstart', onSlotDragStart);
      slot.addEventListener('dragover',  onSlotDragOver);
      slot.addEventListener('drop',      onSlotDrop);
      slot.addEventListener('dragend',   onSlotDragEnd);
    } else {
      slot.addEventListener('dragover', onSlotDragOver);
      slot.addEventListener('drop',     onSlotDrop);
    }

    grid.appendChild(slot);
  }
}

// --- Drag to reorder ---
let _dragSrcIdx = null;

function onSlotDragStart(e) {
  _dragSrcIdx = parseInt(e.currentTarget.dataset.slotIndex);
  e.dataTransfer.effectAllowed = 'move';
  e.currentTarget.classList.add('dragging');
}

function onSlotDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function onSlotDrop(e) {
  e.preventDefault();
  const destIdx = parseInt(e.currentTarget.dataset.slotIndex);
  if (_dragSrcIdx === null || _dragSrcIdx === destIdx) return;

  // Swap slots and their quantities
  const tmp = inventorySlots[_dragSrcIdx];
  inventorySlots[_dragSrcIdx] = inventorySlots[destIdx];
  inventorySlots[destIdx]     = tmp;

  const tmpQty = inventorySlotQty[_dragSrcIdx];
  inventorySlotQty[_dragSrcIdx] = inventorySlotQty[destIdx];
  inventorySlotQty[destIdx]     = tmpQty;

  saveInventory();
  renderInventoryGrid();
}

function onSlotDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  _dragSrcIdx = null;
}

document.getElementById('inventoryCloseBtn').addEventListener('click', closeInventory);
document.getElementById('inventoryModal').addEventListener('click', e => {
  if (e.target === document.getElementById('inventoryModal')) closeInventory();
});
document.getElementById('inventoryBtn').addEventListener('click', openInventory);

// --- Last Drop sidebar display ---
function updateLastDropDisplay(droppedIds) {
  const el = document.getElementById('lastDropIcons');
  if (!droppedIds || droppedIds.length === 0) return;
  el.innerHTML = '';
  droppedIds.forEach(id => {
    const item = getItem(id);
    if (!item) return;
    const span = document.createElement('span');
    span.className = 'last-drop-icon';
    span.title = item.name;
    if (item.image) {
      span.style.backgroundImage    = `url('${item.image}')`;
      span.style.backgroundSize     = 'contain';
      span.style.backgroundRepeat   = 'no-repeat';
      span.style.backgroundPosition = 'center';
      span.style.display   = 'inline-block';
      span.style.width     = '1.5rem';
      span.style.height    = '1.5rem';
    } else {
      span.textContent = item.icon;
    }
    span.classList.add('pop');
    el.appendChild(span);
  });
}

// --- Inventory full warning ---
function showInventoryFullWarning() {
  const el = document.getElementById('invFullWarning');
  if (!el) return;
  el.classList.add('show');
  clearTimeout(el._hideTimer);
  el._hideTimer = setTimeout(() => el.classList.remove('show'), 2500);
}