/**
 * booking.js — La Mesa Booking Frontend
 * Fetches slots from GAS API and renders dynamic cards.
 * Handles checkout flow via Stripe.
 */
(function() {
  'use strict';

  /* ── Config ── */
  var BOOKING_API = 'URL_DEL_TUO_GAS_DEPLOY'; // Replace after GAS deploy

  var WA_LINKS = {
    es: 'https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20La%20Mesa',
    en: 'https://wa.me/34711552030?text=Hi!%20I\'d%20like%20to%20know%20more%20about%20La%20Mesa',
    ca: 'https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa'
  };

  /* ── i18n labels ── */
  var LABELS = {
    es: {
      spots: '{n} plazas disponibles',
      spot1: '1 plaza disponible',
      urgent: '¡Últimas plazas!',
      book: 'Reservar →',
      noSlots: 'No hay plazas disponibles. <a href="{wa}">Escríbenos</a>.',
      waitlist: '¿Sin plazas? Escríbenos →',
      loading: 'Cargando turnos...',
      error: 'Error al cargar. <a href="{wa}">Escríbenos por WhatsApp</a>.',
      formName: 'Tu nombre',
      formEmail: 'Tu email',
      formPhone: 'Tu teléfono',
      formSubmit: 'Continuar al pago →',
      formCancel: 'Cancelar',
      semanalDetails4: '4 clases · 2h · {price}€/mes',
      sueltaPickDate: 'Elige fecha y hora:',
      sueltaSlotLabel: '{day} {date} · {time}h',
      sueltaSpots: '{n} plazas'
    },
    en: {
      spots: '{n} spots available',
      spot1: '1 spot available',
      urgent: 'Last spots!',
      book: 'Book →',
      noSlots: 'No spots available. <a href="{wa}">Message us</a>.',
      waitlist: 'No spots left? Message us →',
      loading: 'Loading slots...',
      error: 'Loading error. <a href="{wa}">Message us on WhatsApp</a>.',
      formName: 'Your name',
      formEmail: 'Your email',
      formPhone: 'Your phone',
      formSubmit: 'Continue to payment →',
      formCancel: 'Cancel',
      semanalDetails4: '4 classes · 2h · €{price}/month',
      sueltaPickDate: 'Choose date and time:',
      sueltaSlotLabel: '{day} {date} · {time}',
      sueltaSpots: '{n} spots'
    },
    ca: {
      spots: '{n} places disponibles',
      spot1: '1 plaça disponible',
      urgent: 'Últimes places!',
      book: 'Reserva →',
      noSlots: 'No hi ha places disponibles. <a href="{wa}">Escriu-nos</a>.',
      waitlist: 'Sense places? Escriu-nos →',
      loading: 'Carregant torns...',
      error: 'Error al carregar. <a href="{wa}">Escriu-nos per WhatsApp</a>.',
      formName: 'El teu nom',
      formEmail: 'El teu email',
      formPhone: 'El teu telèfon',
      formSubmit: 'Continua al pagament →',
      formCancel: 'Cancel·la',
      semanalDetails4: '4 classes · 2h · {price}€/mes',
      sueltaPickDate: 'Tria data i hora:',
      sueltaSlotLabel: '{day} {date} · {time}h',
      sueltaSpots: '{n} places'
    }
  };

  var DAYS = {
    es: { Domingo:'Domingo', Lunes:'Lunes', Martes:'Martes', 'Miércoles':'Miércoles', Jueves:'Jueves', Viernes:'Viernes', 'Sábado':'Sábado' },
    en: { Domingo:'Sunday', Lunes:'Monday', Martes:'Tuesday', 'Miércoles':'Wednesday', Jueves:'Thursday', Viernes:'Friday', 'Sábado':'Saturday' },
    ca: { Domingo:'Diumenge', Lunes:'Dilluns', Martes:'Dimarts', 'Miércoles':'Dimecres', Jueves:'Dijous', Viernes:'Divendres', 'Sábado':'Dissabte' }
  };

  /* ── Detect page context ── */
  var lang = document.documentElement.lang || 'es';
  if (!LABELS[lang]) lang = 'es';
  var L = LABELS[lang];
  var waLink = WA_LINKS[lang] || WA_LINKS.es;

  function dayName(esDay) {
    return (DAYS[lang] && DAYS[lang][esDay]) || esDay;
  }

  function label(key, replacements) {
    var s = L[key] || key;
    if (replacements) {
      Object.keys(replacements).forEach(function(k) {
        s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), replacements[k]);
      });
    }
    return s.replace(/\{wa\}/g, waLink);
  }

  /* ── API helpers ── */

  function apiGet(params) {
    var qs = Object.keys(params).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');
    return fetch(BOOKING_API + '?' + qs).then(function(r) { return r.json(); });
  }

  function apiPost(action, payload) {
    return fetch(BOOKING_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: action, payload: payload })
    }).then(function(r) { return r.json(); });
  }

  /* ── Skeleton loaders ── */

  function showSkeletons(grid, count) {
    grid.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var sk = document.createElement('div');
      sk.className = 'turno-skeleton';
      grid.appendChild(sk);
    }
  }

  /* ── Semanal page renderer ── */

  function initSemanalPage() {
    var grid = document.getElementById('booking-grid');
    if (!grid) return;

    var tipo = grid.dataset.tipo;       // 'semanal'
    var risorsa = grid.dataset.risorsa; // 'mesa' or 'torno'
    var cardClass = risorsa === 'torno' ? 'turno-card--torno' : 'turno-card--modelado';
    var btnClass = risorsa === 'torno' ? 'btn--white' : 'btn--dark';

    showSkeletons(grid, 3);

    apiGet({ action: 'slots', tipo: tipo, risorsa: risorsa })
      .then(function(data) {
        if (!data.ok || !data.slots || data.slots.length === 0) {
          grid.innerHTML = '<div class="turno-no-slots">' +
            label('noSlots') + '</div>';
          return;
        }

        grid.innerHTML = '';
        data.slots.forEach(function(slot, idx) {
          var card = document.createElement('div');
          var delay = idx > 0 ? ' fade-in--delay-' + Math.min(idx, 2) : '';
          card.className = 'turno-card ' + cardClass + ' fade-in' + delay;

          var spotsText = slot.posti_liberi === 1
            ? label('spot1')
            : label('spots', { n: slot.posti_liberi });

          var urgentBadge = slot.posti_liberi <= 2
            ? '<span class="turno-card__badge--urgent">' + label('urgent') + '</span>'
            : '';

          var day = dayName(slot.giorno_settimana);
          var timeDisplay = lang === 'en'
            ? formatTimeEN(slot.ora_inizio)
            : slot.ora_inizio + 'h';

          card.innerHTML =
            '<h2 class="turno-card__day">' + day + '<br>' + timeDisplay + '</h2>' +
            '<p class="turno-card__details">' + label('semanalDetails4', { price: slot.prezzo }) + '</p>' +
            '<span class="turno-card__spots">' + spotsText + '</span>' +
            urgentBadge +
            '<button class="btn ' + btnClass + ' turno-card__cta" data-slot-id="' + slot.slot_id + '">' +
              label('book') +
            '</button>' +
            '<a class="turno-card__waitlist" href="' + waLink + '" target="_blank" rel="noopener noreferrer">' +
              label('waitlist') +
            '</a>' +
            '<div class="booking-form" style="display:none;" data-slot-id="' + slot.slot_id + '">' +
              '<input type="text" name="nombre" placeholder="' + label('formName') + '" required>' +
              '<input type="email" name="email" placeholder="' + label('formEmail') + '" required>' +
              '<input type="tel" name="telefono" placeholder="' + label('formPhone') + '">' +
              '<button class="btn ' + btnClass + '" type="submit">' + label('formSubmit') + '</button>' +
              '<button class="btn btn--secondary" type="button" data-cancel>' + label('formCancel') + '</button>' +
            '</div>';

          grid.appendChild(card);

          // Trigger fade-in
          requestAnimationFrame(function() {
            card.classList.add('visible');
          });
        });

        // Bind events
        bindBookingEvents(grid);
      })
      .catch(function() {
        grid.innerHTML = '<div class="turno-no-slots">' + label('error') + '</div>';
      });
  }

  /* ── Suelta page renderer ── */

  function initSueltaPage() {
    var container = document.getElementById('suelta-container');
    if (!container) return;

    // Bind "Reservar" buttons on the 2 static cards
    var btns = container.querySelectorAll('[data-suelta-trigger]');
    btns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var risorsa = btn.dataset.risorsa;
        var slotsDiv = document.getElementById('slots-' + risorsa);
        if (!slotsDiv) return;

        if (slotsDiv.classList.contains('active')) {
          slotsDiv.classList.remove('active');
          return;
        }

        // Fetch slots
        slotsDiv.innerHTML = '<div class="turno-skeleton" style="height:60px;"></div>';
        slotsDiv.classList.add('active');

        apiGet({ action: 'slots', tipo: 'suelta', risorsa: risorsa })
          .then(function(data) {
            if (!data.ok || !data.slots || data.slots.length === 0) {
              slotsDiv.innerHTML = '<div class="turno-no-slots">' + label('noSlots') + '</div>';
              return;
            }

            var html = '<p style="font-weight:600; margin-bottom:8px;">' + label('sueltaPickDate') + '</p>';
            data.slots.forEach(function(slot) {
              var day = dayName(slot.giorno_settimana);
              var time = lang === 'en' ? formatTimeEN(slot.ora_inizio) : slot.ora_inizio + 'h';
              var spotsLabel = label('sueltaSpots', { n: slot.posti_liberi });

              html += '<div class="suelta-slot-item">' +
                '<span>' + day + ' ' + slot.data + ' · ' + time + ' — ' + spotsLabel + '</span>' +
                '<button class="btn btn--dark" style="padding:8px 16px; font-size:0.8rem;" data-slot-id="' + slot.slot_id + '">' +
                  label('book') +
                '</button>' +
              '</div>';
            });
            slotsDiv.innerHTML = html;
            bindBookingEvents(slotsDiv);
          })
          .catch(function() {
            slotsDiv.innerHTML = '<div class="turno-no-slots">' + label('error') + '</div>';
          });
      });
    });
  }

  /* ── Checkout flow ── */

  function bindBookingEvents(container) {
    // "Reservar" buttons → show form
    container.querySelectorAll('[data-slot-id]').forEach(function(btn) {
      if (btn.tagName === 'BUTTON' && !btn.closest('.booking-form') && !btn.closest('.suelta-slot-item')) {
        btn.addEventListener('click', function() {
          var form = btn.parentElement.querySelector('.booking-form');
          if (form) {
            btn.style.display = 'none';
            form.style.display = 'flex';
            form.querySelector('input[name="nombre"]').focus();
          }
        });
      }
    });

    // Cancel buttons
    container.querySelectorAll('[data-cancel]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var form = btn.closest('.booking-form');
        if (form) {
          form.style.display = 'none';
          var ctaBtn = form.parentElement.querySelector('.turno-card__cta');
          if (ctaBtn) ctaBtn.style.display = '';
        }
      });
    });

    // Submit buttons inside forms
    container.querySelectorAll('.booking-form [type="submit"]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var form = btn.closest('.booking-form');
        var slotId = form.dataset.slotId;
        var nombre = form.querySelector('[name="nombre"]').value.trim();
        var email = form.querySelector('[name="email"]').value.trim();
        var telefono = form.querySelector('[name="telefono"]').value.trim();

        if (!email) {
          form.querySelector('[name="email"]').focus();
          return;
        }

        btn.disabled = true;
        btn.textContent = '...';

        apiPost('create_checkout', {
          slot_id: slotId,
          cliente_nombre: nombre,
          cliente_email: email,
          cliente_telefono: telefono
        }).then(function(data) {
          if (data.ok && data.checkout_url) {
            window.location.href = data.checkout_url;
          } else {
            alert(data.error || 'Error');
            btn.disabled = false;
            btn.textContent = label('formSubmit');
          }
        }).catch(function() {
          alert('Error de red');
          btn.disabled = false;
          btn.textContent = label('formSubmit');
        });
      });
    });

    // Suelta slot item buttons → inline form or direct
    container.querySelectorAll('.suelta-slot-item [data-slot-id]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var slotId = btn.dataset.slotId;
        var item = btn.closest('.suelta-slot-item');

        // Replace item content with mini form
        item.innerHTML =
          '<div class="booking-form" style="display:flex; width:100%;" data-slot-id="' + slotId + '">' +
            '<input type="text" name="nombre" placeholder="' + label('formName') + '" style="flex:1;">' +
            '<input type="email" name="email" placeholder="' + label('formEmail') + '" required style="flex:1;">' +
            '<input type="tel" name="telefono" placeholder="' + label('formPhone') + '" style="flex:1;">' +
            '<button class="btn btn--dark" type="submit" style="padding:8px 16px; font-size:0.8rem;">' + label('formSubmit') + '</button>' +
          '</div>';

        // Re-bind submit for this new form
        var newForm = item.querySelector('.booking-form');
        var submitBtn = newForm.querySelector('[type="submit"]');
        submitBtn.addEventListener('click', function() {
          var nombre = newForm.querySelector('[name="nombre"]').value.trim();
          var email = newForm.querySelector('[name="email"]').value.trim();
          var telefono = newForm.querySelector('[name="telefono"]').value.trim();

          if (!email) {
            newForm.querySelector('[name="email"]').focus();
            return;
          }

          submitBtn.disabled = true;
          submitBtn.textContent = '...';

          apiPost('create_checkout', {
            slot_id: slotId,
            cliente_nombre: nombre,
            cliente_email: email,
            cliente_telefono: telefono
          }).then(function(data) {
            if (data.ok && data.checkout_url) {
              window.location.href = data.checkout_url;
            } else {
              alert(data.error || 'Error');
              submitBtn.disabled = false;
              submitBtn.textContent = label('formSubmit');
            }
          }).catch(function() {
            alert('Error de red');
            submitBtn.disabled = false;
            submitBtn.textContent = label('formSubmit');
          });
        });

        newForm.querySelector('[name="nombre"]').focus();
      });
    });
  }

  /* ── Gracias page ── */

  function initGraciasPage() {
    var detail = document.getElementById('gracias-slot-detail');
    if (!detail) return;

    var params = new URLSearchParams(window.location.search);
    var slotId = params.get('slot');
    if (!slotId) return;

    apiGet({ action: 'slot_detail', slot_id: slotId })
      .then(function(data) {
        if (!data.ok || !data.slot) return;
        var s = data.slot;
        var day = dayName(s.giorno_settimana);
        var time = lang === 'en' ? formatTimeEN(s.ora_inizio) : s.ora_inizio + 'h';

        detail.innerHTML =
          '<p style="font-size:1.1rem; margin-top:16px;">' +
          '<strong>' + day + '</strong> · ' + time +
          ' — ' + capitalize(s.tipo) + ' ' + capitalize(s.risorsa) +
          '</p>';
      })
      .catch(function() { /* silently fail */ });
  }

  /* ── Utilities ── */

  function formatTimeEN(time24) {
    var parts = time24.split(':');
    var h = parseInt(parts[0], 10);
    var m = parts[1] || '00';
    var ampm = h >= 12 ? 'pm' : 'am';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return h + ':' + m + ampm;
  }

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  }

  /* ── Init ── */

  document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('booking-grid')) {
      initSemanalPage();
    }
    if (document.getElementById('suelta-container')) {
      initSueltaPage();
    }
    if (document.getElementById('gracias-slot-detail')) {
      initGraciasPage();
    }
  });

})();
