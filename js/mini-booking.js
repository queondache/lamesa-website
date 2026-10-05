/** Calendario compatto clase suelta: v2 per default, Mesana solo con config approvata. */
(function (global) {
  'use strict';

  var V2_API = 'https://la-mesa-v2-backend.onrender.com/bookings/public-slots?service=suelta&days=90';
  var BOOK_URL = 'https://app.lamesabcn.com/book.html';
  var WA = 'https://wa.me/34711552030';
  var LANGS = ['es', 'en', 'ca', 'pt'];
  var COPY = {
    es: { mesaNote: '2 horas · todos los niveles', tornoNote: '2 horas · clase particular, hasta 2 personas', per: 'por persona', date: 'Elige tu fecha', time: 'Elige la hora', seats: 'plazas', seat: 'plaza', book: 'Continuar a la reserva', loading: 'Buscando fechas…', empty: 'No hay fechas este mes.', next: 'Ver el mes siguiente', none: 'Ahora mismo no hay fechas online.', error: 'No se pudieron cargar las fechas.', retry: 'Volver a intentar', wa: '¿Dudas? Escríbenos por WhatsApp', prev: 'Mes anterior', nextM: 'Mes siguiente', available: 'disponible', unavailable: 'no disponible', pay: 'Pago seguro con tarjeta · sin crear una cuenta', people: 'Personas', total: 'Total', less: 'Una persona menos', more: 'Una persona más', name: 'Tu nombre', email: 'Email de confirmación', checkout: 'Continuar al pago', busy: 'Preparando el pago…', invalid: 'Revisa tu nombre y email.', capacity: 'Esas plazas ya no están disponibles. Elige otro horario.', rate: 'Demasiados intentos. Espera un momento y vuelve a probar.', provider: 'No se pudo abrir el pago. Vuelve a intentar.' },
    en: { mesaNote: '2 hours · all levels', tornoNote: '2 hours · private class, up to 2 people', per: 'per person', date: 'Choose your date', time: 'Choose the time', seats: 'places', seat: 'place', book: 'Continue to booking', loading: 'Looking for dates…', empty: 'No dates this month.', next: 'See next month', none: 'No online dates right now.', error: 'Unable to load the dates.', retry: 'Try again', wa: 'Questions? Message us on WhatsApp', prev: 'Previous month', nextM: 'Next month', available: 'available', unavailable: 'unavailable', pay: 'Secure card payment · no account needed', people: 'People', total: 'Total', less: 'One person fewer', more: 'One more person', name: 'Your name', email: 'Confirmation email', checkout: 'Continue to payment', busy: 'Preparing payment…', invalid: 'Check your name and email.', capacity: 'Those places are no longer available. Choose another time.', rate: 'Too many attempts. Wait a moment and try again.', provider: 'Unable to open payment. Please retry.' },
    ca: { mesaNote: '2 hores · tots els nivells', tornoNote: '2 hores · classe particular, fins a 2 persones', per: 'per persona', date: 'Tria la data', time: 'Tria l’hora', seats: 'places', seat: 'plaça', book: 'Continua a la reserva', loading: 'Buscant dates…', empty: 'No hi ha dates aquest mes.', next: 'Veure el mes següent', none: 'Ara mateix no hi ha dates en línia.', error: 'No s’han pogut carregar les dates.', retry: 'Torna-ho a provar', wa: 'Dubtes? Escriu-nos per WhatsApp', prev: 'Mes anterior', nextM: 'Mes següent', available: 'disponible', unavailable: 'no disponible', pay: 'Pagament segur amb targeta · sense crear un compte', people: 'Persones', total: 'Total', less: 'Una persona menys', more: 'Una persona més', name: 'El teu nom', email: 'Email de confirmació', checkout: 'Continua al pagament', busy: 'Preparant el pagament…', invalid: 'Revisa el nom i l’email.', capacity: 'Aquestes places ja no estan disponibles. Tria un altre horari.', rate: 'Massa intents. Espera un moment i torna-ho a provar.', provider: 'No s’ha pogut obrir el pagament. Torna-ho a provar.' },
    pt: { mesaNote: '2 horas · todos os níveis', tornoNote: '2 horas · aula particular, até 2 pessoas', per: 'por pessoa', date: 'Escolha a sua data', time: 'Escolha o horário', seats: 'vagas', seat: 'vaga', book: 'Continuar para a reserva', loading: 'Procurando datas…', empty: 'Não há datas este mês.', next: 'Ver o mês seguinte', none: 'No momento não há datas online.', error: 'Não foi possível carregar as datas.', retry: 'Tentar de novo', wa: 'Dúvidas? Escreva para nós no WhatsApp', prev: 'Mês anterior', nextM: 'Mês seguinte', available: 'disponível', unavailable: 'indisponível', pay: 'Pagamento seguro com cartão · sem criar conta', people: 'Pessoas', total: 'Total', less: 'Uma pessoa a menos', more: 'Mais uma pessoa', name: 'O seu nome', email: 'Email de confirmação', checkout: 'Continuar para o pagamento', busy: 'Preparando o pagamento…', invalid: 'Verifique o nome e o email.', capacity: 'Essas vagas já não estão disponíveis. Escolha outro horário.', rate: 'Muitas tentativas. Aguarde um momento e tente novamente.', provider: 'Não foi possível abrir o pagamento. Tente novamente.' }
  };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }
  function todayIso() {
    var date = new Date();
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }
  function addDays(iso, number) {
    var date = new Date(iso + 'T12:00:00Z');
    date.setUTCDate(date.getUTCDate() + number);
    return date.toISOString().slice(0, 10);
  }
  function addMonth(month, number) {
    var parts = month.split('-').map(Number);
    return new Date(Date.UTC(parts[0], parts[1] - 1 + number, 1)).toISOString().slice(0, 7);
  }
  function kindOf(slot) {
    var category = (slot.serviceCategory || '').toLowerCase();
    if (category === 'torno') return 'torno';
    if (category === 'ceramica') return 'mesa';
    return (slot.serviceName || '').toLowerCase().indexOf('torno') >= 0 ? 'torno' : 'mesa';
  }
  function requested(raw) { return !!(raw && raw.enabled === true && raw.releaseApproved === true); }
  function bookingMode(raw, location) {
    if (!requested(raw) || !raw.apiBase || !Array.isArray(raw.allowedApiOrigins)) return 'v2';
    try { return raw.allowedApiOrigins.indexOf(new URL(raw.apiBase, location.href).origin) >= 0 ? 'mesana' : 'v2'; } catch (error) { return 'v2'; }
  }

  function MiniBooking(root, options) {
    options = options || {};
    this.root = root;
    this.body = root.querySelector('.mini-booking__body');
    this.tabs = Array.prototype.slice.call(root.querySelectorAll('[data-kind]'));
    this.location = options.location || global.location;
    this.fetcher = options.fetcher || function () { return global.fetch.apply(global, arguments); };
    this.storage = options.storage || (typeof global.sessionStorage === 'undefined' ? null : global.sessionStorage);
    this.lang = (options.lang || (typeof document === 'undefined' ? 'es' : document.documentElement.lang) || 'es').slice(0, 2).toLowerCase();
    if (LANGS.indexOf(this.lang) < 0) this.lang = 'es';
    this.t = COPY[this.lang];
    this.rawConfig = Object.prototype.hasOwnProperty.call(options, 'config') ? options.config : (global.LA_MESA_GUEST_BOOKING || null);
    this.mode = requested(this.rawConfig) ? 'pending' : 'v2';
    this.modules = options.modules || null;
    this.config = null;
    this.api = null;
    this.store = null;
    var hash = (this.location.hash || '').replace('#', '');
    this.kind = hash === 'torno' ? 'torno' : (root.getAttribute('data-default') || 'mesa');
    this.slots = { mesa: [], torno: [] };
    this.month = todayIso().slice(0, 7);
    this.date = '';
    this.selectedId = '';
    this.quantity = 1;
    this.error = '';
    this.loading = false;
    Object.defineProperty(this, 'slotId', { get: function () { return this.selectedId; }, set: function (value) { this.selectedId = value; } });
    var self = this;
    this.tabs.forEach(function (button) { button.addEventListener('click', function () { self.setKind(button.getAttribute('data-kind')); }); });
  }

  MiniBooking.prototype.ensureMode = async function () {
    if (this.mode !== 'pending') return;
    try {
      var modules = this.modules || await import('./experience-booking.js');
      var config = modules.validateConfig(this.rawConfig, this.location);
      if (!config || this.rawConfig.releaseApproved !== true) throw new Error('invalid_config');
      this.modules = modules;
      this.config = config;
      this.api = new modules.GuestApi(config, this.fetcher);
      this.store = this.storage ? new modules.BookingStorage(this.storage) : null;
      this.mode = 'mesana';
    } catch (error) {
      console.error('[mini-booking] configurazione Mesana non valida; uso gestionale v2', error);
      this.mode = 'v2';
      this.config = null;
      this.api = null;
    }
  };
  MiniBooking.prototype.setKind = function (kind) { this.kind = kind; this.date = ''; this.selectedId = ''; this.quantity = 1; this.month = this.firstMonth(); this.render(); };
  MiniBooking.prototype.list = function () { return this.slots[this.kind] || []; };
  MiniBooking.prototype.selected = function () { var id = this.selectedId; return this.list().find(function (slot) { return slot.id === id; }); };
  MiniBooking.prototype.firstMonth = function () { var list = this.list(); return list.length ? list[0].date.slice(0, 7) : todayIso().slice(0, 7); };
  MiniBooking.prototype.money = function (value) {
    if (this.mode === 'v2') return this.lang === 'en' ? '€' + Number(value).toFixed(0) : Number(value).toFixed(0) + ' €';
    return new Intl.NumberFormat(this.lang, { style: 'currency', currency: 'EUR' }).format(Number(value) / 100);
  };
  MiniBooking.prototype.time = function (slot) {
    if (this.mode === 'v2') return (slot.startTime || '').slice(0, 5);
    return new Intl.DateTimeFormat(this.lang, { hour: '2-digit', minute: '2-digit', timeZone: slot.timezone }).format(new Date(slot.startAt));
  };
  MiniBooking.prototype.load = async function () {
    var self = this;
    this.loading = true;
    this.body.innerHTML = '<p class="mini-booking__status" role="status">' + this.t.loading + '</p>';
    try {
      await this.ensureMode();
      if (this.mode === 'mesana') {
        var from = todayIso();
        var data = await this.api.sessions(from, addDays(from, 89));
        function normalize(session) { return Object.assign({}, session, { date: self.modules.civilDate(session.startAt, session.timezone), available: session.remainingSeats, price: session.unitPriceCents, startTime: self.time(session) }); }
        this.slots = {
          mesa: this.modules.sessionsFor(data.sessions, this.config.experiences.modelado.classTypeIds).filter(function (session) { return session.remainingSeats > 0; }).map(normalize),
          torno: this.modules.sessionsFor(data.sessions, this.config.experiences.torno.classTypeIds).filter(function (session) { return session.remainingSeats > 0; }).map(normalize)
        };
      } else {
        var response = await this.fetcher(V2_API);
        if (!response.ok) throw new Error('http_' + response.status);
        var json = await response.json();
        var slots = (json && json.data && json.data.slots) || [];
        var today = todayIso();
        this.slots = { mesa: [], torno: [] };
        slots.forEach(function (slot) { if (slot.date >= today && Number(slot.available) > 0) self.slots[kindOf(slot)].push(slot); });
      }
      ['mesa', 'torno'].forEach(function (kind) { self.slots[kind].sort(function (a, b) { return (a.date + (a.startTime || '')).localeCompare(b.date + (b.startTime || '')); }); });
      if (this.mode === 'mesana' && (!this.selected() || Number(this.selected().available) <= 0)) { this.selectedId = ''; this.quantity = 1; }
      this.month = this.firstMonth();
      this.loading = false;
      this.render();
    } catch (error) {
      this.loading = false;
      console.error('[mini-booking] caricamento date fallito:', error);
      this.body.innerHTML = '<p class="mini-booking__status" role="alert">' + this.t.error + '</p><button type="button" class="mini-booking__cta" data-action="retry">' + this.t.retry + '</button>' + this.waLink();
      var retry = this.body.querySelector('[data-action="retry"]');
      if (retry) retry.onclick = function () { self.load(); };
    }
  };
  MiniBooking.prototype.waLink = function () { return '<p class="mini-booking__note"><a href="' + WA + '" target="_blank" rel="noopener noreferrer">' + this.t.wa + '</a></p>'; };
  MiniBooking.prototype.message = function (code) { return { insufficient_seats: this.t.capacity, session_unavailable: this.t.capacity, rate_limited: this.t.rate, provider_unavailable: this.t.provider, booking_page_unavailable: this.t.provider, guest_checkout_disabled: this.t.provider, invalid_request: this.t.invalid }[code] || this.t.error; };
  MiniBooking.prototype.checkout = async function (name, email) {
    var selected = this.selected();
    if (this.mode !== 'mesana' || !selected) throw new Error('session_unavailable');
    name = String(name || '').trim(); email = String(email || '').trim().toLowerCase();
    if (!name || !email) throw new Error('invalid_request');
    var locale = this.lang === 'pt' ? 'en' : this.lang;
    this.store.intent({ experience: this.kind === 'mesa' ? 'modelado' : 'torno', sessionId: selected.id, quantity: this.quantity, date: selected.date, locale: locale });
    var input = { sessionId: selected.id, quantity: this.quantity, name: name, email: email, locale: locale };
    input.idempotencyKey = await this.store.key(input);
    try {
      var attempt = this.modules.validAttempt(await this.api.start(input));
      if (attempt.session.id !== input.sessionId || attempt.quantity !== input.quantity) throw new Error('invalid_response');
      this.store.attempt(attempt);
      this.location.assign(this.modules.paymentUrl(attempt.checkoutUrl, this.config));
      return attempt;
    } catch (error) {
      this.error = this.message(error.message);
      if (['insufficient_seats', 'session_unavailable'].indexOf(error.message) >= 0) { this.store.clearAttempt(); await this.load(); this.error = this.message(error.message); }
      this.render();
      throw error;
    }
  };

  MiniBooking.prototype.render = function () {
    var self = this;
    var list = this.list();
    var kind = this.kind;
    var t = this.t;
    this.tabs.forEach(function (button) { button.setAttribute('aria-pressed', button.getAttribute('data-kind') === kind ? 'true' : 'false'); });
    if (this.loading && this.mode !== 'v2') { this.body.innerHTML = '<p class="mini-booking__status" role="status">' + t.loading + '</p>'; return; }
    var selected = this.selected();
    var price = this.mode === 'v2' ? (list.length ? list[0].price : this.root.getAttribute('data-price-' + kind)) : (selected ? selected.price : (list.length ? list[0].price : this.root.getAttribute('data-price-' + kind)));
    var displayPrice = price ? (this.mode === 'mesana' && !list.length ? (this.lang === 'en' ? '€' + Number(price).toFixed(0) : Number(price).toFixed(0) + ' €') : this.money(price)) : '—';
    var head = '<div class="mini-booking__price">' + displayPrice + '<small>' + t.per + ' · ' + (kind === 'torno' ? t.tornoNote : t.mesaNote) + '</small></div>';
    if (!list.length) { this.body.innerHTML = head + '<p class="mini-booking__status" role="status">' + t.none + '</p>' + this.waLink(); return; }
    var month = this.month;
    var parts = month.split('-').map(Number);
    var days = new Date(Date.UTC(parts[0], parts[1], 0)).getUTCDate();
    var offset = (new Date(Date.UTC(parts[0], parts[1] - 1, 1)).getUTCDay() + 6) % 7;
    var byDate = {};
    list.forEach(function (slot) { if (!byDate[slot.date]) byDate[slot.date] = []; byDate[slot.date].push(slot); });
    var cells = '';
    var index;
    for (index = 0; index < 7; index++) cells += '<span class="mini-booking__weekday">' + new Intl.DateTimeFormat(this.lang, { weekday: 'narrow', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 0, 5 + index))) + '</span>';
    for (index = 0; index < offset; index++) cells += '<span></span>';
    var monthHas = false;
    for (var day = 1; day <= days; day++) {
      var iso = month + '-' + String(day).padStart(2, '0');
      var available = !!byDate[iso];
      if (available) monthHas = true;
      var label = new Intl.DateTimeFormat(this.lang, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(iso + 'T12:00:00Z'));
      cells += '<button type="button" class="mini-booking__day' + (iso === this.date ? ' is-selected' : '') + '" data-date="' + iso + '"' + (available ? '' : ' disabled') + ' aria-pressed="' + (iso === this.date) + '" aria-label="' + esc(label) + ' · ' + (available ? t.available : t.unavailable) + '">' + day + '</button>';
    }
    var firstMonth = list[0].date.slice(0, 7);
    var lastMonth = list[list.length - 1].date.slice(0, 7);
    var monthLabel = new Intl.DateTimeFormat(this.lang, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(month + '-01T12:00:00Z'));
    monthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
    var html = head + '<h2 class="mini-booking__title">' + t.date + '</h2><div class="mini-booking__month"><strong>' + esc(monthLabel) + '</strong><div><button type="button" data-month="-1" aria-label="' + t.prev + '"' + (month <= firstMonth ? ' disabled' : '') + '>‹</button><button type="button" data-month="1" aria-label="' + t.nextM + '"' + (month >= lastMonth ? ' disabled' : '') + '>›</button></div></div><div class="mini-booking__calendar" role="group" aria-label="' + t.date + '">' + cells + '</div>';
    if (!monthHas) html += '<p class="mini-booking__status" role="status">' + t.empty + '</p>' + (month < lastMonth ? '<button type="button" class="mini-booking__secondary" data-month="1">' + t.next + ' ›</button>' : '');
    if (this.date && byDate[this.date]) {
      html += '<div class="mini-booking__field">' + t.time + '</div><div class="mini-booking__times" role="group" aria-label="' + t.time + '">';
      byDate[this.date].forEach(function (slot) {
        var seats = Number(slot.available);
        var timeLabel = self.time(slot);
        var mesanaLabel = self.mode === 'mesana' ? ' aria-label="' + esc((slot.title ? slot.title + ' ' : '') + timeLabel) + '"' : '';
        html += '<button type="button" class="mini-booking__time' + (slot.id === self.selectedId ? ' is-selected' : '') + '" data-slot="' + esc(slot.id) + '" aria-pressed="' + (slot.id === self.selectedId) + '"' + mesanaLabel + '>' + esc(timeLabel) + '<small>' + seats + ' ' + (seats === 1 ? t.seat : t.seats) + '</small></button>';
      });
      html += '</div>';
    }
    if (this.mode === 'v2' && this.slotId) html += '<a class="mini-booking__cta" href="' + BOOK_URL + '?slot_id=' + encodeURIComponent(this.slotId) + '" data-action="book">' + t.book + ' →</a><p class="mini-booking__note">' + t.pay + '</p>';
    selected = this.selected();
    if (this.mode === 'mesana' && selected) {
      var max = Math.min(100, selected.remainingSeats);
      html += '<div class="mini-booking__people"><span>' + t.people + '</span><div><button type="button" data-qty="-1" aria-label="' + t.less + '"' + (this.quantity <= 1 ? ' disabled' : '') + '>−</button><output>' + this.quantity + '</output><button type="button" data-qty="1" aria-label="' + t.more + '"' + (this.quantity >= max ? ' disabled' : '') + '>+</button></div></div><div class="mini-booking__total"><span>' + t.total + '<small>' + this.quantity + ' × ' + this.money(selected.unitPriceCents) + '</small></span><strong>' + this.money(selected.unitPriceCents * this.quantity) + '</strong></div><form class="mini-booking__form"><label>' + t.name + '<input name="name" autocomplete="name" required maxlength="80"></label><label>' + t.email + '<input name="email" type="email" autocomplete="email" required maxlength="150"></label><button type="submit" class="mini-booking__cta">' + t.checkout + ' →</button></form><p class="mini-booking__note">' + t.pay + '</p>';
    }
    if (this.error) html += '<p class="mini-booking__status" role="alert">' + esc(this.error) + '</p>';
    this.body.innerHTML = html;
    Array.prototype.forEach.call(this.body.querySelectorAll('[data-month]'), function (button) { button.onclick = function () { self.month = addMonth(self.month, Number(button.getAttribute('data-month'))); self.date = ''; self.selectedId = ''; self.render(); }; });
    Array.prototype.forEach.call(this.body.querySelectorAll('[data-date]:not(:disabled)'), function (button) { button.onclick = function () { self.date = button.getAttribute('data-date'); var candidates = byDate[self.date]; self.selectedId = candidates && candidates.length === 1 ? candidates[0].id : ''; self.quantity = 1; self.error = ''; self.render(); var next = self.body.querySelector(self.slotId ? '.mini-booking__cta' : '.mini-booking__time'); if (next) next.focus({ preventScroll: false }); }; });
    Array.prototype.forEach.call(this.body.querySelectorAll('[data-slot]'), function (button) { button.onclick = function () { self.selectedId = button.getAttribute('data-slot'); self.quantity = 1; self.error = ''; self.render(); var next = self.body.querySelector(self.mode === 'v2' ? '.mini-booking__cta' : '.mini-booking__people button'); if (next) next.focus(); }; });
    Array.prototype.forEach.call(this.body.querySelectorAll('[data-qty]'), function (button) { button.onclick = function () { self.quantity = Math.max(1, Math.min(selected.remainingSeats, self.quantity + Number(button.getAttribute('data-qty')))); self.render(); }; });
    var form = this.body.querySelector('.mini-booking__form');
    if (form) form.onsubmit = async function (event) { event.preventDefault(); if (!form.reportValidity()) return; var button = form.querySelector('button[type="submit"]'); button.disabled = true; button.textContent = t.busy; try { await self.checkout(form.elements.name.value, form.elements.email.value); } catch (error) { button.disabled = false; button.textContent = t.checkout; } };
    var cta = this.body.querySelector('[data-action="book"]');
    if (cta) cta.addEventListener('click', function () { if (typeof global.gtag === 'function') global.gtag('event', 'click_cta', { event_category: 'conversion', event_label: 'clase_suelta_' + kind }); if (typeof global.fbq === 'function') global.fbq('track', 'Lead', { content_name: 'clase_suelta' }); });
  };

  function boot() { Array.prototype.forEach.call(document.querySelectorAll('.mini-booking'), function (element) { var widget = new MiniBooking(element); widget.load(); }); }
  global.MiniBookingTestHooks = { MiniBooking: MiniBooking, bookingMode: bookingMode };
  if (typeof document !== 'undefined') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot(); }
})(typeof globalThis === 'undefined' ? window : globalThis);
