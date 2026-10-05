/**
 * mini-booking.js — calendario compatto della clase suelta (stile del widget di Codex).
 *
 * Selettore modelado/torno → mese → giorno → orario → book.html del gestionale v2.
 * Le date e i prezzi arrivano da GET /bookings/public-slots: il prezzo mostrato è
 * quello che il checkout addebita.
 */
(function () {
  'use strict';

  var API = 'https://la-mesa-v2-backend.onrender.com/bookings/public-slots?service=suelta&days=90';
  var BOOK_URL = 'https://app.lamesabcn.com/book.html';
  var WA = 'https://wa.me/34711552030';

  var LANG = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
  if (['es', 'en', 'ca', 'pt'].indexOf(LANG) < 0) LANG = 'es';

  var T = {
    es: { mesa: 'Modelado', torno: 'Torno', mesaNote: '2 horas · todos los niveles', tornoNote: '2 horas · clase particular, hasta 2 personas',
      per: 'por persona', date: 'Elige tu fecha', time: 'Elige la hora', seats: 'plazas', seat: 'plaza', book: 'Continuar a la reserva',
      loading: 'Buscando fechas…', empty: 'No hay fechas este mes.', next: 'Ver el mes siguiente', none: 'Ahora mismo no hay fechas online.',
      error: 'No se pudieron cargar las fechas.', retry: 'Volver a intentar', wa: '¿Dudas? Escríbenos por WhatsApp',
      prev: 'Mes anterior', nextM: 'Mes siguiente', available: 'disponible', unavailable: 'no disponible', pay: 'Pago seguro con tarjeta · sin crear una cuenta' },
    en: { mesa: 'Hand-building', torno: 'Pottery wheel', mesaNote: '2 hours · all levels', tornoNote: '2 hours · private class, up to 2 people',
      per: 'per person', date: 'Choose your date', time: 'Choose the time', seats: 'places', seat: 'place', book: 'Continue to booking',
      loading: 'Looking for dates…', empty: 'No dates this month.', next: 'See next month', none: 'No online dates right now.',
      error: 'Unable to load the dates.', retry: 'Try again', wa: 'Questions? Message us on WhatsApp',
      prev: 'Previous month', nextM: 'Next month', available: 'available', unavailable: 'unavailable', pay: 'Secure card payment · no account needed' },
    ca: { mesa: 'Modelat', torno: 'Torn', mesaNote: '2 hores · tots els nivells', tornoNote: '2 hores · classe particular, fins a 2 persones',
      per: 'per persona', date: 'Tria la data', time: 'Tria l’hora', seats: 'places', seat: 'plaça', book: 'Continua a la reserva',
      loading: 'Buscant dates…', empty: 'No hi ha dates aquest mes.', next: 'Veure el mes següent', none: 'Ara mateix no hi ha dates en línia.',
      error: 'No s’han pogut carregar les dates.', retry: 'Torna-ho a provar', wa: 'Dubtes? Escriu-nos per WhatsApp',
      prev: 'Mes anterior', nextM: 'Mes següent', available: 'disponible', unavailable: 'no disponible', pay: 'Pagament segur amb targeta · sense crear un compte' },
    pt: { mesa: 'Modelagem', torno: 'Torno', mesaNote: '2 horas · todos os níveis', tornoNote: '2 horas · aula particular, até 2 pessoas',
      per: 'por pessoa', date: 'Escolha a sua data', time: 'Escolha o horário', seats: 'vagas', seat: 'vaga', book: 'Continuar para a reserva',
      loading: 'Procurando datas…', empty: 'Não há datas este mês.', next: 'Ver o mês seguinte', none: 'No momento não há datas online.',
      error: 'Não foi possível carregar as datas.', retry: 'Tentar de novo', wa: 'Dúvidas? Escreva para nós no WhatsApp',
      prev: 'Mês anterior', nextM: 'Mês seguinte', available: 'disponível', unavailable: 'indisponível', pay: 'Pagamento seguro com cartão · sem criar conta' }
  };
  var t = T[LANG];

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function kindOf(slot) {
    var cat = (slot.serviceCategory || '').toLowerCase();
    if (cat === 'torno') return 'torno';
    if (cat === 'ceramica') return 'mesa';
    return (slot.serviceName || '').toLowerCase().indexOf('torno') >= 0 ? 'torno' : 'mesa';
  }
  function money(p) {
    var n = Number(p);
    return LANG === 'en' ? '€' + n.toFixed(0) : n.toFixed(0) + ' €';
  }
  function todayIso() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function addMonth(month, n) {
    var p = month.split('-').map(Number);
    var d = new Date(Date.UTC(p[0], p[1] - 1 + n, 1));
    return d.toISOString().slice(0, 7);
  }

  function MiniBooking(root) {
    this.root = root;
    this.body = root.querySelector('.mini-booking__body');
    this.tabs = Array.prototype.slice.call(root.querySelectorAll('[data-kind]'));
    var hash = (location.hash || '').replace('#', '');
    this.kind = hash === 'torno' ? 'torno' : (root.getAttribute('data-default') || 'mesa');
    this.slots = { mesa: [], torno: [] };
    this.month = todayIso().slice(0, 7);
    this.date = '';
    this.slotId = '';
    var self = this;
    this.tabs.forEach(function (b) {
      b.addEventListener('click', function () { self.setKind(b.getAttribute('data-kind')); });
    });
    this.load();
  }

  MiniBooking.prototype.setKind = function (kind) {
    this.kind = kind;
    this.date = '';
    this.slotId = '';
    this.month = this.firstMonth();
    this.render();
  };

  MiniBooking.prototype.list = function () { return this.slots[this.kind] || []; };

  MiniBooking.prototype.firstMonth = function () {
    var l = this.list();
    return l.length ? l[0].date.slice(0, 7) : todayIso().slice(0, 7);
  };

  MiniBooking.prototype.load = function () {
    var self = this;
    this.body.innerHTML = '<p class="mini-booking__status" role="status">' + t.loading + '</p>';
    fetch(API)
      .then(function (r) { if (!r.ok) throw new Error('http_' + r.status); return r.json(); })
      .then(function (json) {
        var slots = (json && json.data && json.data.slots) || [];
        var today = todayIso();
        self.slots = { mesa: [], torno: [] };
        slots.forEach(function (s) {
          if (s.date >= today && Number(s.available) > 0) self.slots[kindOf(s)].push(s);
        });
        ['mesa', 'torno'].forEach(function (k) {
          self.slots[k].sort(function (a, b) { return (a.date + a.startTime).localeCompare(b.date + b.startTime); });
        });
        self.month = self.firstMonth();
        self.render();
      })
      .catch(function (e) {
        console.error('[mini-booking] caricamento date fallito:', e);
        self.body.innerHTML = '<p class="mini-booking__status" role="alert">' + t.error + '</p>' +
          '<button type="button" class="mini-booking__cta" data-action="retry">' + t.retry + '</button>' + self.waLink();
        self.body.querySelector('[data-action="retry"]').onclick = function () { self.load(); };
      });
  };

  MiniBooking.prototype.waLink = function () {
    return '<p class="mini-booking__note"><a href="' + WA + '" target="_blank" rel="noopener noreferrer">' + t.wa + '</a></p>';
  };

  MiniBooking.prototype.render = function () {
    var self = this;
    var kind = this.kind;
    var list = this.list();
    this.tabs.forEach(function (b) {
      var on = b.getAttribute('data-kind') === kind;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    var price = list.length ? list[0].price : this.root.getAttribute('data-price-' + kind);
    var head = '<div class="mini-booking__price">' + (price ? money(price) : '—') + '<small>' + t.per + ' · ' + (kind === 'torno' ? t.tornoNote : t.mesaNote) + '</small></div>';

    if (!list.length) {
      this.body.innerHTML = head + '<p class="mini-booking__status" role="status">' + t.none + '</p>' + this.waLink();
      return;
    }

    var month = this.month;
    var p = month.split('-').map(Number);
    var days = new Date(Date.UTC(p[0], p[1], 0)).getUTCDate();
    var offset = (new Date(Date.UTC(p[0], p[1] - 1, 1)).getUTCDay() + 6) % 7;
    var byDate = {};
    list.forEach(function (s) { (byDate[s.date] = byDate[s.date] || []).push(s); });

    var cells = '';
    for (var i = 0; i < 7; i++) {
      cells += '<span class="mini-booking__weekday">' + new Intl.DateTimeFormat(LANG, { weekday: 'narrow', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 0, 5 + i))) + '</span>';
    }
    for (var o = 0; o < offset; o++) cells += '<span></span>';
    var monthHas = false;
    for (var d = 1; d <= days; d++) {
      var iso = month + '-' + String(d).padStart(2, '0');
      var ok = !!byDate[iso];
      if (ok) monthHas = true;
      var label = new Intl.DateTimeFormat(LANG, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(iso + 'T12:00:00Z'));
      cells += '<button type="button" class="mini-booking__day' + (iso === this.date ? ' is-selected' : '') + '" data-date="' + iso + '"' +
        (ok ? '' : ' disabled') + ' aria-pressed="' + (iso === this.date) + '" aria-label="' + esc(label) + ' · ' + (ok ? t.available : t.unavailable) + '">' + d + '</button>';
    }

    var firstM = list[0].date.slice(0, 7);
    var lastM = list[list.length - 1].date.slice(0, 7);
    var monthLabel = new Intl.DateTimeFormat(LANG, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(month + '-01T12:00:00Z'));
    monthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

    var html = head +
      '<h2 class="mini-booking__title">' + t.date + '</h2>' +
      '<div class="mini-booking__month"><strong>' + esc(monthLabel) + '</strong><div>' +
      '<button type="button" data-month="-1" aria-label="' + t.prev + '"' + (month <= firstM ? ' disabled' : '') + '>‹</button>' +
      '<button type="button" data-month="1" aria-label="' + t.nextM + '"' + (month >= lastM ? ' disabled' : '') + '>›</button></div></div>' +
      '<div class="mini-booking__calendar" role="group" aria-label="' + t.date + '">' + cells + '</div>';

    if (!monthHas) {
      html += '<p class="mini-booking__status" role="status">' + t.empty + '</p>' +
        (month < lastM ? '<button type="button" class="mini-booking__secondary" data-month="1">' + t.next + ' ›</button>' : '');
    }

    if (this.date && byDate[this.date]) {
      html += '<div class="mini-booking__field">' + t.time + '</div><div class="mini-booking__times" role="group" aria-label="' + t.time + '">';
      byDate[this.date].forEach(function (s) {
        var n = Number(s.available);
        html += '<button type="button" class="mini-booking__time' + (s.id === self.slotId ? ' is-selected' : '') + '" data-slot="' + esc(s.id) + '" aria-pressed="' + (s.id === self.slotId) + '">' +
          esc((s.startTime || '').slice(0, 5)) + '<small>' + n + ' ' + (n === 1 ? t.seat : t.seats) + '</small></button>';
      });
      html += '</div>';
    }

    if (this.slotId) {
      html += '<a class="mini-booking__cta" href="' + BOOK_URL + '?slot_id=' + encodeURIComponent(this.slotId) + '" data-action="book">' + t.book + ' →</a>' +
        '<p class="mini-booking__note">' + t.pay + '</p>';
    }
    this.body.innerHTML = html;

    Array.prototype.forEach.call(this.body.querySelectorAll('[data-month]'), function (b) {
      b.onclick = function () {
        self.month = addMonth(self.month, Number(b.getAttribute('data-month')));
        self.date = '';
        self.slotId = '';
        self.render();
      };
    });
    Array.prototype.forEach.call(this.body.querySelectorAll('[data-date]:not(:disabled)'), function (b) {
      b.onclick = function () {
        self.date = b.getAttribute('data-date');
        var only = byDate[self.date];
        self.slotId = only && only.length === 1 ? only[0].id : '';
        self.render();
        var next = self.body.querySelector(self.slotId ? '.mini-booking__cta' : '.mini-booking__time');
        if (next) next.focus({ preventScroll: false });
      };
    });
    Array.prototype.forEach.call(this.body.querySelectorAll('[data-slot]'), function (b) {
      b.onclick = function () {
        self.slotId = b.getAttribute('data-slot');
        self.render();
        var cta = self.body.querySelector('.mini-booking__cta');
        if (cta) cta.focus();
      };
    });
    var cta = this.body.querySelector('[data-action="book"]');
    if (cta) {
      cta.addEventListener('click', function () {
        if (typeof gtag === 'function') gtag('event', 'click_cta', { event_category: 'conversion', event_label: 'clase_suelta_' + kind });
        if (typeof fbq === 'function') fbq('track', 'Lead', { content_name: 'clase_suelta' });
      });
    }
  };

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('.mini-booking'), function (el) { new MiniBooking(el); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
