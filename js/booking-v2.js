/**
 * booking-v2.js — La Mesa Booking Frontend (v2 gestionale).
 *
 * Gestisce due flussi pubblici:
 *   • Clase Suelta → GET /public-slots → click slot → book.html
 *   • Taller Semanal → GET /public-slots-semanal → card template
 *     → pick date → form inline → POST /checkout-semanal → Stripe Checkout
 */
(function () {
  'use strict';

  var API_BASE = 'https://la-mesa-v2-backend.onrender.com';
  var BOOK_URL = 'https://app.lamesabcn.com/book.html';
  var WA_FALLBACK = 'https://wa.me/34711552030?text=Hola!%20Quiero%20reservar%20una%20clase%20en%20La%20Mesa';

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
      semanalAvailable: 'Disponible',
      semanalFull: 'Completo por ahora',
      semanalStartLabel: 'Empieza el',
      semanalPick: 'Elige tu primera fecha',
      semanalBook: 'Pagar y reservar →',
      formName: 'Nombre y apellido',
      formEmail: 'Email',
      formPhone: 'Teléfono (opcional)',
      formLoading: 'Redirigiendo al pago…',
      formError: 'No se pudo continuar. Inténtalo de nuevo o escríbenos por WhatsApp.',
      semanalFourSessions: '4 sesiones consecutivas',
      waNoTime: 'Escríbenos por WhatsApp si ningún horario te viene bien.',
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
      semanalAvailable: 'Available',
      semanalFull: 'Full for now',
      semanalStartLabel: 'Start on',
      semanalPick: 'Pick your first date',
      semanalBook: 'Pay and book →',
      formName: 'Name and surname',
      formEmail: 'Email',
      formPhone: 'Phone (optional)',
      formLoading: 'Redirecting to payment…',
      formError: 'Could not proceed. Try again or message us on WhatsApp.',
      semanalFourSessions: '4 consecutive sessions',
      waNoTime: 'Message us on WhatsApp if no slot fits you.',
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
      semanalAvailable: 'Disponible',
      semanalFull: 'Complet ara mateix',
      semanalStartLabel: 'Comença el',
      semanalPick: 'Tria la teva primera data',
      semanalBook: 'Paga i reserva →',
      formName: 'Nom i cognom',
      formEmail: 'Correu',
      formPhone: 'Telèfon (opcional)',
      formLoading: 'Redirigint al pagament…',
      formError: 'No hem pogut continuar. Torna-ho a provar o escriu-nos per WhatsApp.',
      semanalFourSessions: '4 sessions consecutives',
      waNoTime: 'Escriu-nos per WhatsApp si cap horari t\u2019encaixa.',
    },
  };
  var t = L[LANG];

  var DAYS = {
    es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ca: ['Dg', 'Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds'],
  };
  var DAYS_LONG = {
    es: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    ca: ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'],
  };
  var MONTHS = {
    es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ca: ['gen', 'feb', 'març', 'abr', 'maig', 'juny', 'jul', 'ag', 'set', 'oct', 'nov', 'des'],
  };

  function parseIso(iso) {
    var p = (iso || '').split('-').map(Number);
    if (p.length !== 3) return null;
    return new Date(Date.UTC(p[0], p[1] - 1, p[2]));
  }
  function fmtDate(iso) {
    var d = parseIso(iso); if (!d) return iso || '';
    return DAYS[LANG][d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MONTHS[LANG][d.getUTCMonth()];
  }
  function fmtDateLong(iso) {
    var d = parseIso(iso); if (!d) return iso || '';
    return DAYS_LONG[LANG][d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MONTHS[LANG][d.getUTCMonth()];
  }
  function fmtTime(tm) { return (tm || '').slice(0, 5); }
  function fmtSpots(n) {
    if (n === 1) return t.spot1;
    return t.spots.replace('{n}', n);
  }
  function fmtPrice(p) { return p ? Number(p).toFixed(0) + '€' : ''; }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function classify(slot) {
    var cat = (slot.serviceCategory || '').toLowerCase();
    if (cat === 'torno') return 'torno';
    if (cat === 'ceramica') return 'mesa';
    var name = (slot.serviceName || '').toLowerCase();
    return name.indexOf('torno') >= 0 ? 'torno' : 'mesa';
  }

  /* ============================================================
     CLASE SUELTA — flow esistente (invariato)
     ============================================================ */
  function renderSueltaCard(cardEl, slots) {
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

  function initSueltaStates(cards) {
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

  function renderSueltaError(cards) {
    cards.forEach(function (c) {
      var body = c.querySelector('.suelta-card__body');
      if (body) body.innerHTML = '<p style="color:#555; font-size:0.9rem; padding:8px 0;">' + t.error + '</p>';
    });
  }

  function loadSuelta(cards) {
    initSueltaStates(cards);
    fetch(API_BASE + '/bookings/public-slots?service=suelta&days=60')
      .then(function (r) { if (!r.ok) throw new Error('http_' + r.status); return r.json(); })
      .then(function (json) {
        var slots = (json && json.data && json.data.slots) || [];
        var byRisorsa = { mesa: [], torno: [] };
        slots.forEach(function (s) {
          var r = classify(s);
          if (byRisorsa[r]) byRisorsa[r].push(s);
        });
        cards.forEach(function (c) {
          var risorsa = c.getAttribute('data-risorsa');
          renderSueltaCard(c, byRisorsa[risorsa] || []);
        });
      })
      .catch(function (e) {
        console.error('[booking-v2] suelta fetch failed:', e);
        renderSueltaError(cards);
      });
  }

  /* ============================================================
     TALLER SEMANAL — nuovo flow con checkout diretto
     ============================================================ */
  function semanalCategoryFor(risorsa) {
    // grid data-risorsa="mesa" → categoria ceramica (modelado); "torno" → torno
    return risorsa === 'torno' ? 'torno' : 'ceramica';
  }

  function renderSemanalGrid(gridEl, templates, risorsa) {
    gridEl.innerHTML = '';
    if (!templates.length) {
      gridEl.innerHTML =
        '<div style="grid-column:1/-1; text-align:center; padding:32px 16px;">' +
        '<p style="color:#555; margin:0 0 12px 0;">' + t.empty + '</p>' +
        '<a class="btn btn--dark" href="' + WA_FALLBACK + '" target="_blank" rel="noopener">' + t.whatsapp + '</a>' +
        '</div>';
      return;
    }

    templates.forEach(function (tpl) {
      var card = document.createElement('article');
      card.className = 'turno-card fade-in visible ' + (risorsa === 'torno' ? 'turno-card--torno' : 'turno-card--modelado');

      var dayLong = DAYS_LONG[LANG][tpl.dayOfWeek] || '';
      var available = (tpl.validStartDates || []).length > 0;
      var pillStyle = 'display:inline-block; padding:4px 10px; border-radius:999px; font-size:0.78rem; font-weight:700; letter-spacing:0.04em; text-transform:uppercase;';
      var pillClass = available
        ? 'background:rgba(34,160,90,0.18); color:#1B7A3E;'
        : 'background:rgba(136,136,136,0.25); color:#444;';

      card.innerHTML =
        '<div class="turno-card__day">' + esc(dayLong.charAt(0).toUpperCase() + dayLong.slice(1)) + '</div>' +
        '<div class="turno-card__title">' + fmtTime(tpl.startTime) + '–' + fmtTime(tpl.endTime) + 'h</div>' +
        '<div class="turno-card__details">' + esc(t.semanalFourSessions) + '</div>' +
        '<div class="turno-card__price">' + fmtPrice(tpl.price) + '</div>' +
        '<div style="margin-top:8px;"><span style="' + pillStyle + pillClass + '">' +
          esc(available ? t.semanalAvailable : t.semanalFull) +
        '</span></div>' +
        '<div class="semanal-picker" style="margin-top:12px;"></div>' +
        '<button type="button" class="btn btn--dark semanal-open" ' +
          (available ? '' : 'disabled style="opacity:0.45; cursor:not-allowed;"') + '>' +
          esc(available ? t.semanalPick : t.semanalFull) +
        '</button>';

      var openBtn = card.querySelector('.semanal-open');
      var picker = card.querySelector('.semanal-picker');
      if (available && openBtn && picker) {
        openBtn.addEventListener('click', function () {
          if (picker.childNodes.length === 0) {
            mountSemanalPicker(picker, tpl, risorsa);
            openBtn.style.display = 'none';
          }
        });
      }

      gridEl.appendChild(card);
    });
  }

  function findSlotIdFor(template, startDate, allSlots) {
    // allSlots is the raw semanal slots list fetched for the category
    for (var i = 0; i < allSlots.length; i++) {
      var s = allSlots[i];
      if (
        s.serviceId === template.serviceId &&
        s.date === startDate &&
        s.startTime === template.startTime
      ) {
        return s.id;
      }
    }
    return null;
  }

  function mountSemanalPicker(mountEl, template, risorsa) {
    var dates = template.validStartDates || [];
    var max = Math.min(dates.length, 6);

    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex; flex-direction:column; gap:10px;';

    var label = document.createElement('div');
    label.style.cssText = 'font-weight:700; font-size:0.92rem; opacity:0.85;';
    label.textContent = t.semanalPick;
    wrap.appendChild(label);

    var pillsWrap = document.createElement('div');
    pillsWrap.style.cssText = 'display:flex; flex-wrap:wrap; gap:8px;';
    var selectedDate = null;
    var selectedBtn = null;

    for (var i = 0; i < max; i++) {
      (function (iso) {
        var pill = document.createElement('button');
        pill.type = 'button';
        pill.style.cssText =
          'min-height:44px; padding:8px 14px; border-radius:999px; cursor:pointer;' +
          'font:inherit; font-size:0.88rem; font-weight:600;' +
          (risorsa === 'torno'
            ? 'background:rgba(255,255,255,0.15); border:1.5px solid rgba(255,255,255,0.4); color:var(--cream);'
            : 'background:rgba(0,0,0,0.08); border:1.5px solid rgba(0,0,0,0.2); color:var(--black);');
        pill.textContent = t.semanalStartLabel + ' ' + fmtDateLong(iso);
        pill.addEventListener('click', function () {
          selectedDate = iso;
          if (selectedBtn) selectedBtn.style.transform = '';
          selectedBtn = pill;
          pill.style.transform = 'scale(1.02)';
          // highlight selection — use background swap
          Array.prototype.forEach.call(pillsWrap.children, function (b) {
            b.setAttribute('data-sel', '0');
            b.style.outline = '';
          });
          pill.setAttribute('data-sel', '1');
          pill.style.outline = '3px solid var(--yellow)';
          form.style.display = 'flex';
        });
        pillsWrap.appendChild(pill);
      })(dates[i]);
    }
    wrap.appendChild(pillsWrap);

    var form = document.createElement('form');
    form.className = 'booking-form';
    form.style.cssText = 'display:none; flex-direction:column; gap:8px; margin-top:10px;';
    form.innerHTML =
      '<input type="text" name="name" autocomplete="name" required placeholder="' + esc(t.formName) + '" />' +
      '<input type="email" name="email" autocomplete="email" required placeholder="' + esc(t.formEmail) + '" />' +
      '<input type="tel" name="phone" autocomplete="tel" placeholder="' + esc(t.formPhone) + '" />' +
      '<button type="submit" class="btn btn--primary" style="margin-top:6px;">' + esc(t.semanalBook) + '</button>' +
      '<p class="form-status" style="margin:6px 0 0 0; font-size:0.85rem; color:inherit; opacity:0.85;"></p>';
    wrap.appendChild(form);

    mountEl.appendChild(wrap);

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!selectedDate) return;
      var statusEl = form.querySelector('.form-status');
      statusEl.textContent = t.formLoading;
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      // need slot_id — fetch fresh slots list for this category to map date→id
      fetch(API_BASE + '/bookings/public-slots?service=semanal&days=60')
        .then(function (r) { if (!r.ok) throw new Error('http_' + r.status); return r.json(); })
        .then(function (json) {
          var allSlots = (json && json.data && json.data.slots) || [];
          var slotId = findSlotIdFor(template, selectedDate, allSlots);
          if (!slotId) throw new Error('slot_not_found');

          var payload = {
            first_slot_id: slotId,
            customer_name: form.name.value.trim(),
            customer_email: form.email.value.trim(),
            customer_phone: form.phone.value.trim() || null,
            cancel_url: window.location.href,
          };

          if (typeof gtag === 'function') gtag('event', 'click_cta', { event_category: 'conversion', event_label: 'taller_semanal' });
          if (typeof fbq === 'function') fbq('track', 'Lead', { content_name: 'taller_semanal' });

          return fetch(API_BASE + '/bookings/checkout-semanal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, json: j }; }); })
        .then(function (res) {
          if (!res.ok || !res.json.data || !res.json.data.checkout_url) {
            throw new Error((res.json.error && res.json.error.code) || 'checkout_failed');
          }
          window.location.href = res.json.data.checkout_url;
        })
        .catch(function (e) {
          console.error('[booking-v2] semanal checkout failed:', e);
          statusEl.textContent = t.formError;
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  function renderSemanalError(gridEl) {
    gridEl.innerHTML =
      '<div style="grid-column:1/-1; text-align:center; padding:24px 16px;">' +
      '<p style="color:#555;">' + t.error + '</p></div>';
  }

  function loadSemanal(gridEl) {
    var risorsa = gridEl.getAttribute('data-risorsa') || 'mesa';
    var wantCategory = semanalCategoryFor(risorsa);
    gridEl.innerHTML =
      '<div style="grid-column:1/-1; text-align:center; padding:24px 16px; color:#555;">' +
      t.loading + '</div>';

    fetch(API_BASE + '/bookings/public-slots-semanal')
      .then(function (r) { if (!r.ok) throw new Error('http_' + r.status); return r.json(); })
      .then(function (json) {
        var templates = (json && json.data && json.data.templates) || [];
        var filtered = templates.filter(function (tpl) {
          return (tpl.serviceCategory || '').toLowerCase() === wantCategory;
        });
        renderSemanalGrid(gridEl, filtered, risorsa);
      })
      .catch(function (e) {
        console.error('[booking-v2] semanal fetch failed:', e);
        renderSemanalError(gridEl);
      });
  }

  /* ============================================================
     ROUTER: rileva il tipo di pagina
     ============================================================ */
  function init() {
    // Suelta: .suelta-card elements on suelta.html
    var sueltaCards = Array.prototype.slice.call(document.querySelectorAll('.suelta-card'));
    if (sueltaCards.length) loadSuelta(sueltaCards);

    // Semanal: a grid with data-tipo="semanal"
    var semanalGrid = document.querySelector('[data-tipo="semanal"]');
    if (semanalGrid) loadSemanal(semanalGrid);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
