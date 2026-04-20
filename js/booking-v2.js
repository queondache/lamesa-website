/**
 * booking-v2.js — La Mesa Booking Frontend (v2 gestionale).
 * Fetcha slot Clase Suelta dal gestionale e redirige a book.html per checkout.
 * Sostituisce chiamate al GAS; mantiene UI card mesa/torno già presenti.
 */
(function () {
  'use strict';

  var API_BASE = 'https://la-mesa-v2-backend.onrender.com';
  var BOOK_URL = 'https://app.lamesabcn.com/book.html';
  var WA_FALLBACK = 'https://wa.me/34711552030?text=Hola!%20Quiero%20reservar%20una%20Clase%20Suelta';

  var LANG = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
  if (LANG !== 'en' && LANG !== 'ca') LANG = 'es';

  var L = {
    es: {
      loading: 'Cargando fechas disponibles…',
      choose: 'Elige una fecha',
      spots: '{n} plazas',
      spot1: '1 plaza',
      book: 'Reservar →',
      empty: 'Sin fechas disponibles ahora mismo.',
      whatsapp: 'Escríbenos por WhatsApp →',
      error: 'Error al cargar. <a href="' + WA_FALLBACK + '" target="_blank" rel="noopener">Escríbenos por WhatsApp</a>.',
    },
    en: {
      loading: 'Loading available dates…',
      choose: 'Choose a date',
      spots: '{n} spots',
      spot1: '1 spot',
      book: 'Book →',
      empty: 'No dates available right now.',
      whatsapp: 'Message us on WhatsApp →',
      error: 'Loading error. <a href="' + WA_FALLBACK + '" target="_blank" rel="noopener">Message us on WhatsApp</a>.',
    },
    ca: {
      loading: 'Carregant dates disponibles…',
      choose: 'Tria una data',
      spots: '{n} places',
      spot1: '1 plaça',
      book: 'Reserva →',
      empty: "Sense dates disponibles ara mateix.",
      whatsapp: 'Escriu-nos per WhatsApp →',
      error: 'Error al carregar. <a href="' + WA_FALLBACK + '" target="_blank" rel="noopener">Escriu-nos per WhatsApp</a>.',
    },
  };
  var t = L[LANG];

  var DAYS = {
    es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ca: ['Dg', 'Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds'],
  };
  var MONTHS = {
    es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ca: ['gen', 'feb', 'març', 'abr', 'maig', 'juny', 'jul', 'ag', 'set', 'oct', 'nov', 'des'],
  };

  function fmtDate(iso) {
    if (!iso) return '';
    var parts = iso.split('-').map(Number);
    var d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    var day = DAYS[LANG][d.getUTCDay()];
    var month = MONTHS[LANG][d.getUTCMonth()];
    return day + ' ' + parts[2] + ' ' + month;
  }
  function fmtTime(t) { return (t || '').slice(0, 5); }
  function fmtSpots(n) {
    if (n === 1) return L[LANG].spot1;
    return L[LANG].spots.replace('{n}', n);
  }
  function fmtPrice(p) { return p ? Number(p).toFixed(0) + '€' : ''; }

  function classify(slot) {
    var cat = (slot.serviceCategory || '').toLowerCase();
    if (cat === 'torno') return 'torno';
    if (cat === 'ceramica') return 'mesa';
    var name = (slot.serviceName || '').toLowerCase();
    return name.indexOf('torno') >= 0 ? 'torno' : 'mesa';
  }

  function renderCard(cardEl, slots) {
    var body = cardEl.querySelector('.suelta-card__body');
    var cta = cardEl.querySelector('.suelta-card__cta');
    if (!body || !cta) return;

    var listEl = document.createElement('div');
    listEl.className = 'suelta-slots';
    listEl.style.cssText = 'display:flex; flex-direction:column; gap:8px; margin-top:12px;';

    if (!slots.length) {
      listEl.innerHTML =
        '<p style="color:#555; font-size:0.9rem; margin:0;">' + t.empty + '</p>' +
        '<a class="btn btn--dark" href="' + WA_FALLBACK + '" target="_blank" rel="noopener noreferrer" style="margin-top:8px;">' +
        t.whatsapp + '</a>';
    } else {
      slots.forEach(function (s) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'suelta-slot-btn';
        btn.style.cssText =
          'display:flex; justify-content:space-between; align-items:center; gap:12px;' +
          'min-height:52px; width:100%; padding:12px 16px;' +
          'background:rgba(255,255,255,0.12); border:1.5px solid rgba(255,255,255,0.35);' +
          'border-radius:12px; color:inherit; font:inherit; font-weight:600;' +
          'cursor:pointer; text-align:left;';
        btn.innerHTML =
          '<span>' + fmtDate(s.date) + ' · ' + fmtTime(s.startTime) + 'h</span>' +
          '<span style="font-size:0.85rem; font-weight:700;">' + fmtSpots(s.available) +
          (s.price ? ' · ' + fmtPrice(s.price) : '') + '</span>';
        btn.addEventListener('click', function () {
          if (typeof gtag === 'function') gtag('event', 'click_cta', { event_category: 'conversion', event_label: 'clase_suelta' });
          if (typeof fbq === 'function') fbq('track', 'Lead', { content_name: 'clase_suelta' });
          window.location.href = BOOK_URL + '?slot_id=' + encodeURIComponent(s.id);
        });
        listEl.appendChild(btn);
      });
    }

    body.innerHTML = '';
    body.appendChild(listEl);
    body.classList.add('suelta-card__body--open');

    cta.textContent = t.choose;
    cta.setAttribute('aria-expanded', 'true');
  }

  function initialStates(cards) {
    cards.forEach(function (c) {
      var cta = c.querySelector('.suelta-card__cta');
      if (cta) {
        cta.addEventListener('click', function (ev) {
          ev.preventDefault();
          var body = c.querySelector('.suelta-card__body');
          if (!body) return;
          body.classList.toggle('suelta-card__body--open');
        });
      }
    });
  }

  function renderError(cards) {
    cards.forEach(function (c) {
      var body = c.querySelector('.suelta-card__body');
      if (body) body.innerHTML = '<p style="color:#555; font-size:0.9rem; padding:8px 0;">' + t.error + '</p>';
    });
  }

  async function load() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.suelta-card'));
    if (!cards.length) return;

    initialStates(cards);

    try {
      var res = await fetch(API_BASE + '/bookings/public-slots?service=suelta&days=60');
      if (!res.ok) throw new Error('http_' + res.status);
      var json = await res.json();
      var slots = (json && json.data && json.data.slots) || [];

      var byRisorsa = { mesa: [], torno: [] };
      slots.forEach(function (s) {
        var r = classify(s);
        if (byRisorsa[r]) byRisorsa[r].push(s);
      });

      cards.forEach(function (c) {
        var risorsa = c.getAttribute('data-risorsa');
        renderCard(c, byRisorsa[risorsa] || []);
      });
    } catch (e) {
      console.error('[booking-v2] fetch failed:', e);
      renderError(cards);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
