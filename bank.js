// ─────────────────────────────────────────────────────────────
//  bank.js  —  Bank scene: tabbed storage, deposit/withdraw
// ─────────────────────────────────────────────────────────────

const BANK_TABS     = 8;
const BANK_TAB_SIZE = 32; // 4 rows × 8 cols

// ── Data ──────────────────────────────────────────────────────
let bankTabData   = null;
let activeBankTab = parseInt(localStorage.getItem('typoria_bank_active_tab') || '0');

function _emptyTab() {
  return { slots: new Array(BANK_TAB_SIZE).fill(null), qtys: new Array(BANK_TAB_SIZE).fill(0), iconItemId: null };
}

function _loadBank() {
  const saved = localStorage.getItem('typoria_bank_v2');
  if (saved) {
    bankTabData = JSON.parse(saved);
    while (bankTabData.length < BANK_TABS) bankTabData.push(_emptyTab());
    bankTabData = bankTabData.slice(0, BANK_TABS);
    bankTabData.forEach(tab => {
      while (tab.slots.length < BANK_TAB_SIZE) { tab.slots.push(null); tab.qtys.push(0); }
      tab.slots = tab.slots.slice(0, BANK_TAB_SIZE);
      tab.qtys  = tab.qtys.slice(0, BANK_TAB_SIZE);
      if (!tab.iconItemId) tab.iconItemId = null;
    });
    return;
  }
  // Migrate old bankData / bankSlots → tab 0
  bankTabData = Array.from({ length: BANK_TABS }, _emptyTab);
  const oldData  = JSON.parse(localStorage.getItem('typoria_bank')       || '{}');
  const oldSlots = JSON.parse(localStorage.getItem('typoria_bank_slots') || '[]');
  let si = 0;
  oldSlots.forEach(id => {
    const qty = oldData[id] || 0;
    if (qty > 0 && si < BANK_TAB_SIZE) {
      bankTabData[0].slots[si] = id;
      bankTabData[0].qtys[si]  = qty;
      si++;
    }
  });
}

// Load immediately so renderBankScene() works on first call
_loadBank();

function saveBank() {
  localStorage.setItem('typoria_bank_v2',         JSON.stringify(bankTabData));
  localStorage.setItem('typoria_bank_active_tab', activeBankTab);
}

// ── Helpers ───────────────────────────────────────────────────
function getBankQty(id) {
  let total = 0;
  bankTabData.forEach(tab => tab.slots.forEach((slotId, i) => { if (slotId === id) total += tab.qtys[i]; }));
  return total;
}

function _getTab(t) { return bankTabData[t !== undefined ? t : activeBankTab]; }

// ── Deposit ───────────────────────────────────────────────────
function depositItem(id) {
  const qty = getItemQty(id);
  if (qty <= 0) return;
  if (!_depositIntoTab(id, qty)) { _showBankTabFullWarning(); return; }
  removeItem(id, qty);
  saveBank();
  renderBankScene();
}

function depositAll() {
  const ids = [...new Set(inventorySlots.filter(Boolean))];
  ids.forEach(id => {
    const qty = getItemQty(id);
    if (qty <= 0) return;
    if (!_depositIntoTab(id, qty)) { _showBankTabFullWarning(); return; }
    removeItem(id, qty);
  });
  saveBank();
  renderBankScene();
}

function _depositIntoTab(id, qty, tabIdx) {
  if (tabIdx === undefined) tabIdx = activeBankTab;
  const tab = bankTabData[tabIdx];
  let remaining = qty;
  for (let i = 0; i < BANK_TAB_SIZE && remaining > 0; i++) {
    if (tab.slots[i] === id) { tab.qtys[i] += remaining; remaining = 0; }
  }
  for (let i = 0; i < BANK_TAB_SIZE && remaining > 0; i++) {
    if (tab.slots[i] === null) { tab.slots[i] = id; tab.qtys[i] = remaining; remaining = 0; }
  }
  return remaining === 0;
}

// ── Withdraw ──────────────────────────────────────────────────
function withdrawItem(tabIdx, slotIdx, qty) {
  if (qty === undefined) qty = 1;
  const tab    = bankTabData[tabIdx];
  const id     = tab.slots[slotIdx];
  const inSlot = tab.qtys[slotIdx];
  if (!id || inSlot <= 0) return;

  let canFit = 0;
  for (let i = 0; i < INVENTORY_SIZE; i++) {
    if (inventorySlots[i] === id)   canFit += MAX_STACK - inventorySlotQty[i];
    if (inventorySlots[i] === null) canFit += MAX_STACK;
  }

  const toWithdraw = Math.min(qty, inSlot, canFit);
  if (toWithdraw <= 0) { showInventoryFullWarning(); return; }

  awardItem(id, toWithdraw);
  tab.qtys[slotIdx] -= toWithdraw;
  if (tab.qtys[slotIdx] <= 0) { tab.slots[slotIdx] = null; tab.qtys[slotIdx] = 0; }
  saveBank();
  renderBankScene();
}

let _bankWithdrawMode = 1;

// ── Render ────────────────────────────────────────────────────
function renderBankScene() {
  _renderBankTabs();
  _renderBankSideInv();
  _renderBankStorage();
}

// ── Tab row ───────────────────────────────────────────────────
function _renderBankTabs() {
  const row = document.getElementById('bankTabsRow');
  if (!row) return;
  row.innerHTML = '';

  bankTabData.forEach((tab, t) => {
    const btn  = document.createElement('button');
    btn.className = 'bank-tab-btn' + (t === activeBankTab ? ' active' : '');
    btn.title     = 'Tab ' + (t + 1) + ' — right-click to set icon';

    const used = tab.slots.filter(Boolean).length;

    if (tab.iconItemId) {
      const item = getItem(tab.iconItemId);
      if (item && item.image) {
        btn.style.backgroundImage    = "url('" + item.image + "')";
        btn.style.backgroundSize     = '60%';
        btn.style.backgroundRepeat   = 'no-repeat';
        btn.style.backgroundPosition = 'center 40%';
      } else if (item && item.icon) {
        const iconSpan = document.createElement('span');
        iconSpan.className   = 'bank-tab-icon-label';
        iconSpan.textContent = item.icon;
        btn.appendChild(iconSpan);
      } else {
        btn.textContent = t + 1;
      }
    } else {
      btn.textContent = t + 1;
    }

    btn.addEventListener('click', () => { activeBankTab = t; saveBank(); renderBankScene(); });
    btn.addEventListener('contextmenu', e => { e.preventDefault(); _openTabIconPicker(t); });

    btn.draggable = true;
    btn.addEventListener('dragstart', e => {
      e.stopPropagation();
      _tabDragSrc = t;
      e.dataTransfer.effectAllowed = 'move';
      btn.classList.add('dragging');
    });
    btn.addEventListener('dragend', () => { btn.classList.remove('dragging'); _tabDragSrc = null; });

    btn.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
    btn.addEventListener('drop', e => {
      e.preventDefault();
      e.stopPropagation();

      // Tab reorder drop
      if (_tabDragSrc !== null && _tabDragSrc !== t) {
        const tmp = bankTabData[_tabDragSrc];
        bankTabData[_tabDragSrc] = bankTabData[t];
        bankTabData[t] = tmp;
        if (activeBankTab === _tabDragSrc) activeBankTab = t;
        else if (activeBankTab === t) activeBankTab = _tabDragSrc;
        saveBank();
        renderBankScene();
        return;
      }

      // Item drop from storage grid into another tab
      if (_storeDragSrc === null || t === activeBankTab) return;
      const srcTab  = _getTab(activeBankTab);
      const destTab = _getTab(t);
      const id      = srcTab.slots[_storeDragSrc];
      const qty     = srcTab.qtys[_storeDragSrc];
      if (!id) return;
      if (!_depositIntoTab(id, qty, t)) { _showBankTabFullWarning(); return; }
      srcTab.slots[_storeDragSrc] = null;
      srcTab.qtys[_storeDragSrc]  = 0;
      if (destTab.iconItemId === null) destTab.iconItemId = id;
      saveBank();
      renderBankScene();
    });

    row.appendChild(btn);
  });
}

// ── Tab icon picker ───────────────────────────────────────────
let _pendingIconTab = null;

function _openTabIconPicker(tabIdx) {
  _pendingIconTab = tabIdx;
  const grid  = document.getElementById('slotPickerGrid');
  const title = document.getElementById('slotPickerTitle');
  grid.innerHTML    = '';
  title.textContent = 'Set Tab ' + (tabIdx + 1) + ' Icon';

  const items = [...discoveredItems].map(id => getItem(id)).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));

  const noneCard = document.createElement('div');
  noneCard.className = 'picker-card';
  noneCard.innerHTML = '<div class="picker-icon">✕</div><div class="picker-name">None</div>';
  noneCard.addEventListener('click', () => {
    bankTabData[_pendingIconTab].iconItemId = null;
    saveBank();
    document.getElementById('slotPickerModal').classList.remove('open');
    _renderBankTabs();
  });
  grid.appendChild(noneCard);

  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className   = 'picker-empty';
    empty.textContent = 'No discovered items yet.';
    grid.appendChild(empty);
  } else {
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'picker-card';
      const iconHtml = item.image
        ? '<div class="picker-icon" style="background-image:url(\'' + item.image + '\');background-size:contain;background-repeat:no-repeat;background-position:center;width:2rem;height:2rem;"></div>'
        : '<div class="picker-icon">' + (item.icon || '?') + '</div>';
      card.innerHTML = iconHtml + '<div class="picker-name">' + item.name + '</div>';
      card.addEventListener('click', () => {
        bankTabData[_pendingIconTab].iconItemId = item.id;
        saveBank();
        document.getElementById('slotPickerModal').classList.remove('open');
        _renderBankTabs();
      });
      grid.appendChild(card);
    });
  }

  document.getElementById('slotPickerModal').classList.add('open');
}

// ── Storage grid ──────────────────────────────────────────────
function _renderBankStorage() {
  const grid = document.getElementById('bankStorageGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const tab   = _getTab();
  const used  = tab.slots.filter(Boolean).length;
  const total = bankTabData.reduce((sum, t) => sum + t.slots.filter(Boolean).length, 0);

  for (let i = 0; i < BANK_TAB_SIZE; i++) {
    const id   = tab.slots[i];
    const qty  = tab.qtys[i];
    const item = id ? getItem(id) : null;

    const slot = document.createElement('div');
    slot.className     = 'bank-storage-slot' + (item ? '' : ' bank-slot-empty');
    slot.dataset.index = i;
    slot.draggable     = !!item;

    if (item) {
      const wQty = _bankWithdrawMode === 'all' ? qty : Math.min(_bankWithdrawMode, qty);
      slot.title = item.name + ' \u00d7' + qty.toLocaleString() + ' \u2014 click to withdraw ' + (wQty === qty ? 'all' : '\u00d7' + wQty);

      const icon = document.createElement('div');
      icon.className = 'bank-storage-icon';
      if (item.image) {
        icon.style.backgroundImage    = "url('" + item.image + "')";
        icon.style.backgroundSize     = 'contain';
        icon.style.backgroundRepeat   = 'no-repeat';
        icon.style.backgroundPosition = 'center';
      } else { icon.textContent = item.icon; }

      const q = document.createElement('div');
      q.className   = 'bank-storage-qty';
      q.textContent = qty >= 1000000 ? (qty / 1000000).toFixed(1) + 'm' : qty >= 1000 ? Math.floor(qty / 1000) + 'k' : qty;

      slot.appendChild(icon);
      slot.appendChild(q);
      slot.addEventListener('click', () => {
        const w = _bankWithdrawMode === 'all' ? qty : Math.min(_bankWithdrawMode, qty);
        withdrawItem(activeBankTab, i, w);
      });
      slot.addEventListener('dragstart', _onStoreDragStart);
      slot.addEventListener('dragend',   _onStoreDragEnd);
    }

    slot.addEventListener('dragover', _onStoreDragOver);
    slot.addEventListener('drop',     _onStoreDrop);
    grid.appendChild(slot);
  }
}

// ── Sidebar inventory ─────────────────────────────────────────
function _renderBankSideInv() {
  const grid = document.getElementById('bankSideInvGrid');
  if (!grid) return;
  grid.innerHTML = '';

  for (let i = 0; i < INVENTORY_SIZE; i++) {
    const id   = inventorySlots[i];
    const item = id ? getItem(id) : null;
    const qty  = id ? getSlotQty(i) : 0;

    const slot = document.createElement('div');
    slot.className     = 'bsi-slot' + (item ? ' bsi-filled' : '');
    slot.dataset.index = i;

    if (item) {
      const icon = document.createElement('div');
      icon.className = 'bsi-icon';
      if (item.image) {
        icon.style.backgroundImage    = "url('" + item.image + "')";
        icon.style.backgroundSize     = 'contain';
        icon.style.backgroundRepeat   = 'no-repeat';
        icon.style.backgroundPosition = 'center';
      } else { icon.textContent = item.icon; }

      const q = document.createElement('div');
      q.className   = 'bsi-qty';
      q.textContent = qty >= 1000 ? Math.floor(qty / 1000) + 'k' : qty;

      slot.title     = item.name + ' \u00d7' + qty + ' \u2014 click to deposit';
      slot.draggable = true;
      slot.appendChild(icon);
      slot.appendChild(q);
      slot.addEventListener('click',     () => depositItem(id));
      slot.addEventListener('dragstart', _onInvDragStart);
      slot.addEventListener('dragend',   _onInvDragEnd);
    }
    slot.addEventListener('dragover', _onInvDragOver);
    slot.addEventListener('drop',     _onInvDrop);
    grid.appendChild(slot);
  }

  const cnt = document.getElementById('bankSideInvCount');
  if (cnt) cnt.textContent = getUsedSlots() + ' / ' + INVENTORY_SIZE;
}

// ── Drag — storage ────────────────────────────────────────────
let _storeDragSrc = null;
let _tabDragSrc   = null;
function _onStoreDragStart(e) { _storeDragSrc = parseInt(e.currentTarget.dataset.index); e.dataTransfer.effectAllowed = 'move'; e.currentTarget.classList.add('dragging'); }
function _onStoreDragEnd(e)   { e.currentTarget.classList.remove('dragging'); _storeDragSrc = null; }
function _onStoreDragOver(e)  { e.preventDefault(); }
function _onStoreDrop(e) {
  e.preventDefault();
  if (_storeDragSrc === null) return;
  const dest = parseInt(e.currentTarget.dataset.index);
  if (_storeDragSrc === dest) return;
  const tab = _getTab();
  const tmpId  = tab.slots[_storeDragSrc]; tab.slots[_storeDragSrc] = tab.slots[dest]; tab.slots[dest] = tmpId;
  const tmpQty = tab.qtys[_storeDragSrc];  tab.qtys[_storeDragSrc]  = tab.qtys[dest];  tab.qtys[dest]  = tmpQty;
  saveBank();
  _renderBankStorage();
}

// ── Drag — sidebar ────────────────────────────────────────────
let _invDragSrc = null;
function _onInvDragStart(e) { _invDragSrc = parseInt(e.currentTarget.dataset.index); e.dataTransfer.effectAllowed = 'move'; e.currentTarget.classList.add('dragging'); }
function _onInvDragEnd(e)   { e.currentTarget.classList.remove('dragging'); _invDragSrc = null; }
function _onInvDragOver(e)  { e.preventDefault(); }
function _onInvDrop(e) {
  e.preventDefault();
  if (_invDragSrc === null) return;
  const dest = parseInt(e.currentTarget.dataset.index);
  if (_invDragSrc === dest) return;
  const tmpId  = inventorySlots[_invDragSrc]; inventorySlots[_invDragSrc] = inventorySlots[dest]; inventorySlots[dest] = tmpId;
  const tmpQty = inventorySlotQty[_invDragSrc]; inventorySlotQty[_invDragSrc] = inventorySlotQty[dest]; inventorySlotQty[dest] = tmpQty;
  saveInventory();
  _renderBankSideInv();
}

// ── Warning ───────────────────────────────────────────────────
function _showBankTabFullWarning() {
  const el = document.getElementById('invFullWarning');
  if (!el) return;
  el.textContent = 'Bank tab is full!';
  el.classList.add('show');
  clearTimeout(el._hideTimer);
  el._hideTimer = setTimeout(() => { el.classList.remove('show'); el.textContent = 'Inventory full!'; }, 2500);
}

// ── Init ──────────────────────────────────────────────────────
function initBank() {

  document.addEventListener('click', e => {
    const btn = e.target.closest('.bank-withdraw-btn');
    if (!btn) return;
    _bankWithdrawMode = btn.dataset.qty === 'all' ? 'all' : parseInt(btn.dataset.qty);
    document.querySelectorAll('.bank-withdraw-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _renderBankStorage();
  });

  document.getElementById('bankDepositAllBtn')?.addEventListener('click', depositAll);
}

document.addEventListener('DOMContentLoaded', initBank);