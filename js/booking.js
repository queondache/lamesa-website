/**
 * booking.js — La Mesa Booking Frontend
 * Calendar UI for suelta, improved cards for semanal.
 */
(function() {
  'use strict';

  var BOOKING_API = 'https://script.google.com/macros/s/AKfycbzo26tz9qK4nN-6IdCcaI2bxccvKJL08nUaVWZs1ozSpNMetAdh5z2gkw-GeCvOtGsK/exec';

  var WA = {
    es: 'https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20La%20Mesa',
    en: 'https://wa.me/34711552030?text=Hi!%20I\'d%20like%20to%20know%20more%20about%20La%20Mesa',
    ca: 'https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa'
  };

  /* ── i18n ── */

  var L = {
    es: {
      spots: '{n} plazas disponibles', spot1: '1 plaza disponible',
      urgent: '¡Últimas plazas!', book: 'Reservar →', completo: 'Completo',
      noSlots: 'No hay plazas disponibles. <a href="{wa}">Escríbenos</a>.',
      waitlist: '¿Sin plazas? Escríbenos →',
      error: 'Error al cargar. <a href="{wa}">Escríbenos por WhatsApp</a>.',
      formName: 'Tu nombre', formEmail: 'Tu email', formPhone: 'Tu teléfono',
      formSubmit: 'Continuar al pago →', formCancel: 'Cancelar',
      semanal4: '4 clases · 2h · {price}€/mes',
      calSelect: 'Elige una fecha', calTime: 'Elige hora',
      calNoSlots: 'Sin disponibilidad este mes',
      calSpots: '{n} plazas', calSpot1: '1 plaza'
    },
    en: {
      spots: '{n} spots available', spot1: '1 spot available',
      urgent: 'Last spots!', book: 'Book →', completo: 'Full',
      noSlots: 'No spots available. <a href="{wa}">Message us</a>.',
      waitlist: 'No spots left? Message us →',
      error: 'Loading error. <a href="{wa}">Message us on WhatsApp</a>.',
      formName: 'Your name', formEmail: 'Your email', formPhone: 'Your phone',
      formSubmit: 'Continue to payment →', formCancel: 'Cancel',
      semanal4: '4 classes · 2h · €{price}/month',
      calSelect: 'Select a date', calTime: 'Select time',
      calNoSlots: 'No availability this month',
      calSpots: '{n} spots', calSpot1: '1 spot'
    },
    ca: {
      spots: '{n} places disponibles', spot1: '1 plaça disponible',
      urgent: 'Últimes places!', book: 'Reserva →', completo: 'Complet',
      noSlots: 'No hi ha places disponibles. <a href="{wa}">Escriu-nos</a>.',
      waitlist: 'Sense places? Escriu-nos →',
      error: 'Error al carregar. <a href="{wa}">Escriu-nos per WhatsApp</a>.',
      formName: 'El teu nom', formEmail: 'El teu email', formPhone: 'El teu telèfon',
      formSubmit: 'Continua al pagament →', formCancel: 'Cancel·la',
      semanal4: '4 classes · 2h · {price}€/mes',
      calSelect: 'Tria una data', calTime: 'Tria hora',
      calNoSlots: 'Sense disponibilitat aquest mes',
      calSpots: '{n} places', calSpot1: '1 plaça'
    }
  };

  var MONTHS = {
    es: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    ca: ['Gener','Febrer','Març','Abril','Maig','Juny','Juliol','Agost','Setembre','Octubre','Novembre','Desembre']
  };

  var DAY_HDR = {
    es: ['L','M','X','J','V','S','D'],
    en: ['Mo','Tu','We','Th','Fr','Sa','Su'],
    ca: ['Dl','Dt','Dc','Dj','Dv','Ds','Dg']
  };

  var DAYS = {
    es: { Domingo:'Domingo', Lunes:'Lunes', Martes:'Martes', 'Miércoles':'Miércoles', Jueves:'Jueves', Viernes:'Viernes', 'Sábado':'Sábado' },
    en: { Domingo:'Sunday', Lunes:'Monday', Martes:'Tuesday', 'Miércoles':'Wednesday', Jueves:'Thursday', Viernes:'Friday', 'Sábado':'Saturday' },
    ca: { Domingo:'Diumenge', Lunes:'Dilluns', Martes:'Dimarts', 'Miércoles':'Dimecres', Jueves:'Dijous', Viernes:'Divendres', 'Sábado':'Dissabte' }
  };

  /* ── Context ── */

  var lang = document.documentElement.lang || 'es';
  if (!L[lang]) lang = 'es';
  var labels = L[lang];
  var waLink = WA[lang] || WA.es;

  function t(key, r) {
    var s = labels[key] || key;
    if (r) Object.keys(r).forEach(function(k) { s = s.replace(new RegExp('\\{'+k+'\\}','g'), r[k]); });
    return s.replace(/\{wa\}/g, waLink);
  }

  function dayName(esDay) { return (DAYS[lang] && DAYS[lang][esDay]) || esDay; }

  function fmtTime(t24) {
    if (lang !== 'en') return t24 + 'h';
    var p = t24.split(':'), h = +p[0], m = p[1];
    return (h > 12 ? h-12 : h||12) + ':' + m + (h >= 12 ? 'pm' : 'am');
  }

  function pad(n) { return n < 10 ? '0'+n : ''+n; }
  function dateKey(y,m,d) { return y+'-'+pad(m+1)+'-'+pad(d); }

  /* ── API ── */

  function apiGet(p) {
    var qs = Object.keys(p).map(function(k){ return encodeURIComponent(k)+'='+encodeURIComponent(p[k]); }).join('&');
    return fetch(BOOKING_API+'?'+qs).then(function(r){ return r.json(); });
  }
  function apiPost(action, payload) {
    return fetch(BOOKING_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:action,payload:payload})}).then(function(r){return r.json();});
  }

  /* ══════════════════════════════════════════════════════
     SEMANAL — improved cards with dots + completo
     ══════════════════════════════════════════════════════ */

  function initSemanalPage() {
    var grid = document.getElementById('booking-grid');
    if (!grid) return;

    var tipo = grid.dataset.tipo;
    var risorsa = grid.dataset.risorsa;
    var isTorno = risorsa === 'torno';
    var cardCls = isTorno ? 'turno-card--torno' : 'turno-card--modelado';
    var btnCls = isTorno ? 'btn--white' : 'btn--dark';

    // Show skeletons
    grid.innerHTML = '<div class="turno-skeleton"></div><div class="turno-skeleton"></div><div class="turno-skeleton"></div>';

    apiGet({ action: 'slots', tipo: tipo, risorsa: risorsa })
      .then(function(data) {
        if (!data.ok || !data.slots || !data.slots.length) {
          grid.innerHTML = '<div class="turno-no-slots">' + t('noSlots') + '</div>';
          return;
        }
        grid.innerHTML = '';
        data.slots.forEach(function(slot, idx) {
          var isFull = slot.posti_liberi <= 0;
          var isUrgent = !isFull && slot.posti_liberi <= 2;
          var day = dayName(slot.giorno_settimana);
          var time = fmtTime(slot.ora_inizio);
          var spotsText = slot.posti_liberi === 1 ? t('spot1') : t('spots', { n: slot.posti_liberi });

          // Build dots
          var dots = '';
          for (var d = 0; d < slot.posti_totali; d++) {
            dots += '<span class="turno-card__dot' + (d < (slot.posti_totali - slot.posti_liberi) ? ' turno-card__dot--filled' : '') + '"></span>';
          }

          var card = document.createElement('div');
          var delay = idx > 0 ? ' fade-in--delay-' + Math.min(idx, 2) : '';
          card.className = 'turno-card ' + cardCls + ' fade-in' + delay + (isFull ? ' turno-card--completo' : '');

          var html = '<h2 class="turno-card__day">' + day + '<br>' + time + '</h2>' +
            '<p class="turno-card__details">' + t('semanal4', { price: slot.prezzo }) + '</p>' +
            '<div class="turno-card__dots">' + dots + '</div>' +
            '<span class="turno-card__spots">' + spotsText + '</span>';

          if (isFull) {
            html += '<p class="turno-card__completo">' + t('completo') + '</p>';
          } else {
            if (isUrgent) html += '<span class="turno-card__badge--urgent">' + t('urgent') + '</span>';
            html += '<button class="btn ' + btnCls + ' turno-card__cta" data-slot-id="' + slot.slot_id + '">' + t('book') + '</button>' +
              '<a class="turno-card__waitlist" href="' + waLink + '" target="_blank" rel="noopener noreferrer">' + t('waitlist') + '</a>' +
              '<div class="booking-form" style="display:none;" data-slot-id="' + slot.slot_id + '">' +
                '<input type="text" name="nombre" placeholder="' + t('formName') + '" autocomplete="name">' +
                '<input type="email" name="email" placeholder="' + t('formEmail') + '" required autocomplete="email">' +
                '<input type="tel" name="telefono" placeholder="' + t('formPhone') + '" autocomplete="tel">' +
                '<button class="btn ' + btnCls + '" type="submit">' + t('formSubmit') + '</button>' +
                '<button class="btn btn--secondary" type="button" data-cancel>' + t('formCancel') + '</button>' +
              '</div>';
          }

          card.innerHTML = html;
          grid.appendChild(card);
          requestAnimationFrame(function() { card.classList.add('visible'); });
        });
        bindCheckout(grid);
      })
      .catch(function() {
        grid.innerHTML = '<div class="turno-no-slots">' + t('error') + '</div>';
      });
  }

  /* ══════════════════════════════════════════════════════
     SUELTA — calendar + time slots
     ══════════════════════════════════════════════════════ */

  var calState = { risorsa: 'mesa', year: 0, month: 0, slots: [], slotMap: {}, selectedDate: null };

  function initSueltaPage() {
    var tabs = document.getElementById('suelta-tabs');
    var calEl = document.getElementById('suelta-calendar');
    if (!tabs || !calEl) return;

    var now = new Date();
    calState.year = now.getFullYear();
    calState.month = now.getMonth();

    // Tab clicks
    tabs.querySelectorAll('.suelta-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        tabs.querySelector('.suelta-tab--active').classList.remove('suelta-tab--active');
        tab.classList.add('suelta-tab--active');
        calState.risorsa = tab.dataset.risorsa;
        calState.selectedDate = null;
        loadSueltaSlots();
      });
    });

    loadSueltaSlots();
  }

  function loadSueltaSlots() {
    var calEl = document.getElementById('suelta-calendar');
    var timesEl = document.getElementById('suelta-times');
    calEl.innerHTML = '<div class="turno-skeleton" style="height:320px;"></div>';
    if (timesEl) timesEl.innerHTML = '';

    apiGet({ action: 'slots', tipo: 'suelta', risorsa: calState.risorsa })
      .then(function(data) {
        if (!data.ok) { calEl.innerHTML = '<div class="turno-no-slots">' + t('error') + '</div>'; return; }
        calState.slots = data.slots || [];
        // Build date→slots map
        calState.slotMap = {};
        calState.slots.forEach(function(s) {
          if (!calState.slotMap[s.data]) calState.slotMap[s.data] = [];
          calState.slotMap[s.data].push(s);
        });
        renderCalendar();
      })
      .catch(function() {
        calEl.innerHTML = '<div class="turno-no-slots">' + t('error') + '</div>';
      });
  }

  function renderCalendar() {
    var calEl = document.getElementById('suelta-calendar');
    var timesEl = document.getElementById('suelta-times');
    var y = calState.year, m = calState.month;
    var now = new Date();
    var todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());

    // Navigation
    var html = '<div class="cal__header">' +
      '<button class="cal__nav" data-cal-nav="-1" aria-label="Previous month">&#8249;</button>' +
      '<span class="cal__month">' + (MONTHS[lang]||MONTHS.es)[m] + ' ' + y + '</span>' +
      '<button class="cal__nav" data-cal-nav="1" aria-label="Next month">&#8250;</button>' +
      '</div>';

    // Day headers
    html += '<div class="cal__grid">';
    (DAY_HDR[lang]||DAY_HDR.es).forEach(function(d) {
      html += '<span class="cal__day-label">' + d + '</span>';
    });

    // Calendar days
    var firstDay = new Date(y, m, 1);
    var startDow = (firstDay.getDay() + 6) % 7; // Monday = 0
    var daysInMonth = new Date(y, m+1, 0).getDate();
    var prevMonthDays = new Date(y, m, 0).getDate();

    // Previous month filler
    for (var p = startDow - 1; p >= 0; p--) {
      html += '<span class="cal__day cal__day--other">' + (prevMonthDays - p) + '</span>';
    }

    // Current month
    for (var d = 1; d <= daysInMonth; d++) {
      var dk = dateKey(y, m, d);
      var isToday = dk === todayKey;
      var hasSlots = !!calState.slotMap[dk];
      var isSelected = dk === calState.selectedDate;
      var cls = 'cal__day';
      if (isToday) cls += ' cal__day--today';
      if (hasSlots) cls += ' cal__day--available';
      if (isSelected) cls += ' cal__day--selected';
      if (!hasSlots) cls += ' cal__day--disabled';

      if (hasSlots) {
        html += '<button class="' + cls + '" data-date="' + dk + '">' + d + '</button>';
      } else {
        html += '<span class="' + cls + '">' + d + '</span>';
      }
    }

    // Next month filler
    var totalCells = startDow + daysInMonth;
    var remaining = (7 - totalCells % 7) % 7;
    for (var n = 1; n <= remaining; n++) {
      html += '<span class="cal__day cal__day--other">' + n + '</span>';
    }

    html += '</div>';
    calEl.innerHTML = html;

    // Hint if no slots this month
    var hasAnyThisMonth = false;
    for (var dd = 1; dd <= daysInMonth; dd++) {
      if (calState.slotMap[dateKey(y,m,dd)]) { hasAnyThisMonth = true; break; }
    }
    if (!hasAnyThisMonth) {
      calEl.insertAdjacentHTML('beforeend', '<p style="text-align:center; color:var(--color-muted); font-size:0.875rem; margin-top:var(--space-sm);">' + t('calNoSlots') + '</p>');
    }

    // Disable prev nav if current month
    var prevBtn = calEl.querySelector('[data-cal-nav="-1"]');
    if (y === now.getFullYear() && m === now.getMonth()) prevBtn.disabled = true;

    // Nav events
    calEl.querySelectorAll('[data-cal-nav]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var dir = +btn.dataset.calNav;
        calState.month += dir;
        if (calState.month > 11) { calState.month = 0; calState.year++; }
        if (calState.month < 0) { calState.month = 11; calState.year--; }
        calState.selectedDate = null;
        renderCalendar();
      });
    });

    // Day click events
    calEl.querySelectorAll('[data-date]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        calState.selectedDate = btn.dataset.date;
        renderCalendar(); // re-render to update selected state
        renderTimeSlots(btn.dataset.date);
      });
    });

    // If a date was already selected, show its times
    if (calState.selectedDate && calState.slotMap[calState.selectedDate]) {
      renderTimeSlots(calState.selectedDate);
    } else if (timesEl) {
      timesEl.innerHTML = '<p class="cal-times__label">' + t('calSelect') + '</p>';
    }
  }

  function renderTimeSlots(dateStr) {
    var timesEl = document.getElementById('suelta-times');
    if (!timesEl) return;

    var slots = calState.slotMap[dateStr] || [];
    if (!slots.length) { timesEl.innerHTML = ''; return; }

    // Find day name from first slot
    var dayStr = slots[0].giorno_settimana ? dayName(slots[0].giorno_settimana) : '';
    var dateParts = dateStr.split('-');
    var dateDisplay = +dateParts[2] + ' ' + (MONTHS[lang]||MONTHS.es)[+dateParts[1]-1];

    var html = '<p class="cal-times__label">' + dayStr + ' ' + dateDisplay + '</p>';
    html += '<div class="cal-times__list">';

    slots.forEach(function(slot) {
      var spotsLabel = slot.posti_liberi === 1 ? t('calSpot1') : t('calSpots', { n: slot.posti_liberi });
      var isUrgent = slot.posti_liberi <= 2;

      html += '<div class="cal-time" data-slot-id="' + slot.slot_id + '">' +
        '<div class="cal-time__info">' +
          '<span class="cal-time__hour">' + fmtTime(slot.ora_inizio) + ' – ' + fmtTime(slot.ora_fine) + '</span>' +
          '<span class="cal-time__spots">' + spotsLabel +
            (isUrgent ? ' <span class="turno-card__badge--urgent">' + t('urgent') + '</span>' : '') +
          '</span>' +
        '</div>' +
        '<button class="btn btn--dark" data-slot-id="' + slot.slot_id + '">' + t('book') + '</button>' +
      '</div>';
    });

    html += '</div>';
    timesEl.innerHTML = html;

    // Bind booking on time slot buttons
    timesEl.querySelectorAll('.cal-time .btn[data-slot-id]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var slotId = btn.dataset.slotId;
        var calTime = btn.closest('.cal-time');
        // Replace button with form
        var formArea = calTime.querySelector('.btn[data-slot-id]');
        var formHtml = '<div class="booking-form" style="display:flex;" data-slot-id="' + slotId + '">' +
          '<input type="text" name="nombre" placeholder="' + t('formName') + '" autocomplete="name">' +
          '<input type="email" name="email" placeholder="' + t('formEmail') + '" required autocomplete="email">' +
          '<input type="tel" name="telefono" placeholder="' + t('formPhone') + '" autocomplete="tel">' +
          '<button class="btn btn--dark" type="submit">' + t('formSubmit') + '</button>' +
          '<button class="btn btn--secondary" type="button" data-cancel>' + t('formCancel') + '</button>' +
        '</div>';
        btn.style.display = 'none';
        calTime.insertAdjacentHTML('beforeend', formHtml);
        var form = calTime.querySelector('.booking-form');
        form.querySelector('[name="nombre"]').focus();
        bindCheckout(calTime);
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     CHECKOUT — shared form handling
     ══════════════════════════════════════════════════════ */

  function bindCheckout(container) {
    // "Reservar" → show form (semanal cards)
    container.querySelectorAll('.turno-card__cta[data-slot-id]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var form = btn.parentElement.querySelector('.booking-form');
        if (form) { btn.style.display = 'none'; form.style.display = 'flex'; form.querySelector('[name="nombre"]').focus(); }
      });
    });

    // Cancel
    container.querySelectorAll('[data-cancel]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var form = btn.closest('.booking-form');
        if (!form) return;
        form.style.display = 'none';
        var cta = form.parentElement.querySelector('.turno-card__cta, .btn[data-slot-id]');
        if (cta) cta.style.display = '';
      });
    });

    // Submit
    container.querySelectorAll('.booking-form [type="submit"]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var form = btn.closest('.booking-form');
        var slotId = form.dataset.slotId;
        var email = form.querySelector('[name="email"]').value.trim();
        if (!email) { form.querySelector('[name="email"]').focus(); return; }

        btn.disabled = true;
        btn.textContent = '...';

        apiPost('create_checkout', {
          slot_id: slotId,
          cliente_nombre: form.querySelector('[name="nombre"]').value.trim(),
          cliente_email: email,
          cliente_telefono: form.querySelector('[name="telefono"]').value.trim()
        }).then(function(d) {
          if (d.ok && d.checkout_url) { window.location.href = d.checkout_url; }
          else { alert(d.error || 'Error'); btn.disabled = false; btn.textContent = t('formSubmit'); }
        }).catch(function() {
          alert('Error de red'); btn.disabled = false; btn.textContent = t('formSubmit');
        });
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     GRACIAS page
     ══════════════════════════════════════════════════════ */

  function initGraciasPage() {
    var el = document.getElementById('gracias-slot-detail');
    if (!el) return;
    var slotId = new URLSearchParams(window.location.search).get('slot');
    if (!slotId) return;

    apiGet({ action: 'slot_detail', slot_id: slotId })
      .then(function(d) {
        if (!d.ok || !d.slot) return;
        var s = d.slot;
        el.innerHTML = '<p style="font-size:1.1rem;margin-top:16px;"><strong>' +
          dayName(s.giorno_settimana) + '</strong> · ' + fmtTime(s.ora_inizio) +
          ' — ' + (s.tipo.charAt(0).toUpperCase()+s.tipo.slice(1)) + ' ' +
          (s.risorsa.charAt(0).toUpperCase()+s.risorsa.slice(1)) + '</p>';
      }).catch(function(){});
  }

  /* ── Init ── */

  document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('booking-grid')) initSemanalPage();
    if (document.getElementById('suelta-tabs')) initSueltaPage();
    if (document.getElementById('gracias-slot-detail')) initGraciasPage();
  });

})();
