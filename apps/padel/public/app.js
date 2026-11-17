// Padel Club front end: plain JavaScript, no build step.
// Every screen is a view of what the API returns.
(function () {
  const $ = (id) => document.getElementById(id);
  const TOKEN_KEY = 'padel_token';
  const USER_KEY = 'padel_user';
  let courts = [];
  let pending = null; // the slot the booking dialog is open for

  const time = (hour) => String(hour).padStart(2, '0') + ':00';
  const today = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const courtName = (id) => (courts.find((c) => c.id === id) || { name: id }).name;

  async function api(path, options = {}) {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = 'Bearer ' + token;
    const response = await fetch(path, { ...options, headers });
    if (response.status === 401 && path !== '/api/login') {
      signOut();
      throw new Error('Please sign in again.');
    }
    return response;
  }

  function show(el, visible) { el.hidden = !visible; }
  function notice(text) { $('message').textContent = text; show($('message'), Boolean(text)); }

  // ---------- Sign in and out ----------
  function showApp() {
    show($('login-view'), false);
    show($('app-view'), true);
    show($('session'), true);
    $('who').textContent = 'Signed in as ' + (localStorage.getItem(USER_KEY) || 'player');
    openTab('book');
  }
  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    show($('app-view'), false);
    show($('session'), false);
    show($('login-view'), true);
  }
  $('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    show($('login-error'), false);
    const response = await api('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username: form.get('username'), password: form.get('password') }),
    });
    if (!response.ok) {
      $('login-error').textContent = 'Wrong username or password.';
      show($('login-error'), true);
      return;
    }
    const { token } = await response.json();
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, form.get('username'));
    event.target.reset();
    showApp();
  });
  $('sign-out').addEventListener('click', signOut);

  // ---------- Tabs ----------
  function openTab(name) {
    notice('');
    $('tab-book').setAttribute('aria-pressed', String(name === 'book'));
    $('tab-mine').setAttribute('aria-pressed', String(name === 'mine'));
    show($('book-view'), name === 'book');
    show($('mine-view'), name === 'mine');
    if (name === 'book') loadSlots(); else loadMine();
  }
  $('tab-book').addEventListener('click', () => openTab('book'));
  $('tab-mine').addEventListener('click', () => openTab('mine'));

  // ---------- Slots board ----------
  async function loadSlots() {
    const date = $('date').value;
    const table = $('slots');
    $('slots-state').textContent = 'Loading slots…';
    table.setAttribute('aria-busy', 'true');
    try {
      if (!courts.length) courts = await (await api('/api/courts')).json();
      const response = await api('/api/slots?date=' + encodeURIComponent(date));
      if (!response.ok) throw new Error('Could not load slots. Try again.');
      const slots = await response.json();
      const hours = [...new Set(slots.map((s) => s.hour))].sort((a, b) => a - b);
      let html = '<thead><tr><th scope="col">Time</th>' + courts.map((c) => '<th scope="col">' + c.name + '</th>').join('') + '</tr></thead><tbody>';
      for (const hour of hours) {
        html += '<tr><th scope="row">' + time(hour) + '</th>';
        for (const court of courts) {
          const slot = slots.find((s) => s.courtId === court.id && s.hour === hour);
          html += slot && slot.available
            ? '<td><button type="button" data-court="' + court.id + '" data-hour="' + hour + '" aria-label="Book ' + court.name + ' at ' + time(hour) + '">Book</button></td>'
            : '<td class="taken">Taken</td>';
        }
        html += '</tr>';
      }
      table.innerHTML = html + '</tbody>';
      $('slots-state').textContent = '';
    } catch (error) {
      table.innerHTML = '';
      $('slots-state').textContent = error.message;
    } finally {
      table.removeAttribute('aria-busy');
    }
  }
  $('date').addEventListener('change', loadSlots);
  $('slots').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-court]');
    if (button) openDialog(button.dataset.court, Number(button.dataset.hour));
  });

  // ---------- Booking dialog ----------
  const dialog = $('booking-dialog');
  const form = $('booking-form');
  function updatePrice() {
    const court = courts.find((c) => c.id === pending.courtId);
    $('price').textContent = String((court.pricePerHour * Number(form.duration.value)) / 60);
  }
  function openDialog(courtId, hour) {
    pending = { courtId, hour, date: $('date').value };
    form.reset();
    show($('dialog-error'), false);
    $('dialog-title').textContent = 'Book ' + courtName(courtId);
    $('dialog-when').textContent = pending.date + ' at ' + time(hour);
    updatePrice();
    dialog.showModal();
  }
  form.duration.addEventListener('change', updatePrice);
  $('dialog-close').addEventListener('click', () => dialog.close());
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    show($('dialog-error'), false);
    const response = await api('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        courtId: pending.courtId, date: pending.date, hour: pending.hour,
        durationMinutes: Number(form.duration.value), players: Number(form.players.value),
      }),
    });
    if (response.status === 201) {
      const booking = await response.json();
      dialog.close();
      notice('Booked ' + courtName(booking.courtId) + ' on ' + booking.date + ' at ' + time(booking.hour) + '. Price: ' + booking.price + '.');
      loadSlots();
      return;
    }
    const problem = await response.json().catch(() => ({}));
    $('dialog-error').textContent = response.status === 409
      ? 'That slot was just taken. Close this window and pick another one.'
      : 'Could not book: ' + (problem.error || 'unexpected error') + '.';
    show($('dialog-error'), true);
    if (response.status === 409) loadSlots();
  });

  // ---------- My bookings ----------
  async function loadMine() {
    if (!courts.length) courts = await (await api('/api/courts')).json();
    const bookings = await (await api('/api/bookings')).json();
    const body = $('mine').tBodies[0];
    body.innerHTML = '';
    for (const b of bookings) {
      const row = body.insertRow();
      for (const text of [courtName(b.courtId), b.date, time(b.hour), b.durationMinutes + ' minutes', String(b.players), String(b.price)]) {
        row.insertCell().textContent = text;
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'danger';
      button.textContent = 'Cancel booking';
      button.setAttribute('aria-label', 'Cancel booking of ' + courtName(b.courtId) + ' on ' + b.date + ' at ' + time(b.hour));
      button.addEventListener('click', async () => {
        const response = await api('/api/bookings/' + b.id, { method: 'DELETE' });
        notice(response.status === 204 ? 'Booking cancelled.' : 'Could not cancel the booking.');
        loadMine();
      });
      row.insertCell().appendChild(button);
    }
    show($('mine'), bookings.length > 0);
    show($('mine-empty'), bookings.length === 0);
  }

  // ---------- Start ----------
  $('date').value = today();
  if (localStorage.getItem(TOKEN_KEY)) showApp();
})();
