(function () {
  'use strict';

  function clientAreaUrl(config) {
    if (!config || config.enabled !== true || typeof config.url !== 'string') return null;
    try {
      var parsed = new URL(config.url);
      if (parsed.protocol !== 'https:' || parsed.host !== 'app.mesana.studio' || parsed.username || parsed.password) return null;
      return parsed.href;
    } catch (_) {
      return null;
    }
  }

  window.LA_MESA_CLIENT_AREA_URL = clientAreaUrl;

  var url = clientAreaUrl(window.LA_MESA_GUEST_BOOKING && window.LA_MESA_GUEST_BOOKING.clientArea);
  if (!url) return;

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-client-area="bono"]'), function (button) {
      button.href = url;
      button.target = '_self';
    });

    var grid = document.getElementById('booking-grid');
    if (!grid) return;

    var language = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
    var copy = {
      es: 'Inscríbete y paga desde tu área de cliente',
      en: 'Enrol and pay from your client area',
      ca: 'Inscriu-te i paga des de la teva àrea de client',
      pt: 'Inscreva-se e pague na sua área de cliente'
    };
    var block = document.createElement('div');
    var message = document.createElement('p');
    var button = document.createElement('a');
    message.textContent = copy[language] || copy.es;
    button.className = 'clase-card__cta clase-card__cta--curso';
    button.href = url;
    button.target = '_self';
    button.textContent = message.textContent + ' →';
    block.append(message, button);
    grid.replaceChildren(block);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
