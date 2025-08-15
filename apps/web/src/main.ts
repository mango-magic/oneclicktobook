type Slot = { start: string; end: string };

const $ = (id: string) => document.getElementById(id)!;

const connectBtn = $('connect') as HTMLButtonElement;
const providerSel = $('provider') as HTMLSelectElement;
const icalInput = $('icalUrl') as HTMLInputElement;
const authStatus = $('authStatus');
const slotsEl = $('slots');
const selectedEl = $('selected');
const progressEl = $('progress');
const barEl = $('bar');
const actionsEl = $('actions');
const confirmBtn = $('confirm') as HTMLButtonElement;
const cancelBtn = $('cancel') as HTMLButtonElement;

let selectedSlot: Slot | null = null;
let countdownTimer: number | null = null;
const autoBookMs = 12000;

function formatSlot(slot: Slot) {
  const start = new Date(slot.start);
  const end = new Date(slot.end);
  const formatter = new Intl.DateTimeFormat([], {
    weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  });
  return `${formatter.format(start)} – ${end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
}

function renderSlots(available: Slot[]) {
  slotsEl.innerHTML = '';
  available.forEach((slot) => {
    const div = document.createElement('button');
    div.className = 'slot';
    div.textContent = formatSlot(slot);
    div.onclick = () => selectSlot(slot, true);
    slotsEl.appendChild(div);
  });
}

function selectSlot(slot: Slot, userInitiated = false) {
  selectedSlot = slot;
  ;(Array.from(slotsEl.children) as HTMLElement[]).forEach((el) => {
    el.classList.toggle('selected', el.textContent === formatSlot(slot));
  });
  selectedEl.style.display = 'block';
  selectedEl.textContent = `Selected: ${formatSlot(slot)}`;
  actionsEl.style.display = 'flex';
  startProgress(userInitiated);
}

function startProgress(restart = false) {
  progressEl.style.display = 'block';
  const start = performance.now();
  const end = start + autoBookMs;
  if (restart && countdownTimer) {
    window.clearInterval(countdownTimer);
  }
  countdownTimer = window.setInterval(() => {
    const now = performance.now();
    const pct = Math.max(0, Math.min(1, (now - start) / (end - start)));
    barEl.style.width = `${Math.floor(pct * 100)}%`;
    if (pct >= 1) {
      window.clearInterval(countdownTimer!);
      countdownTimer = null;
      autoBook();
    }
  }, 100);
}

function cancelAuto() {
  if (countdownTimer) {
    window.clearInterval(countdownTimer);
    countdownTimer = null;
  }
  barEl.style.width = '0%';
  progressEl.style.display = 'none';
}

async function autoBook() {
  if (!selectedSlot) return;
  confirmBtn.disabled = true;
  try {
    // TODO: include link token and invitee source; this is a stub to show UX
    const res = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot: selectedSlot })
    });
    if (!res.ok) throw new Error('Book failed');
    selectedEl.textContent = 'Booked! Check your calendar.';
    actionsEl.style.display = 'none';
  } catch (e) {
    selectedEl.textContent = 'Failed to book. Please try again.';
    confirmBtn.disabled = false;
  }
}

confirmBtn.onclick = () => {
  cancelAuto();
  autoBook();
};

cancelBtn.onclick = () => {
  cancelAuto();
};

providerSel.onchange = () => {
  icalInput.style.display = providerSel.value === 'icloud' ? 'inline-block' : 'none';
};

connectBtn.onclick = async () => {
  connectBtn.disabled = true;
  authStatus.textContent = 'Connecting...';
  const provider = providerSel.value;
  const icalUrl = provider === 'icloud' ? icalInput.value : undefined;
  if (provider === 'icloud') {
    try {
      const res = await fetch('/api/auth/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, icalUrl })
      });
      if (!res.ok) throw new Error('Connect failed');
      authStatus.textContent = `${provider} connected`;
    } catch (e) {
      authStatus.textContent = 'Connection failed';
      connectBtn.disabled = false;
      return;
    }
  } else {
    // Start OAuth in same tab
    window.location.href = `/api/auth/${provider}/start`;
    return;
  }

  // Fetch availability from API
  try {
    const res = await fetch('/api/availability', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to load availability');
    const data: { slots: Slot[] } = await res.json();
    if (!data.slots?.length) {
      selectedEl.style.display = 'block';
      selectedEl.textContent = 'No available times found.';
      return;
    }
    renderSlots(data.slots);
    // Auto-select first slot and start countdown
    selectSlot(data.slots[0]);
  } catch (e) {
    selectedEl.style.display = 'block';
    selectedEl.textContent = 'Could not load availability.';
  }
};


