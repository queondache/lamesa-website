/* Costruisce i link mailto al caricamento: l'indirizzo non compare in chiaro nell'HTML servito. */
(function () {
  'use strict';
  function build() {
    document.querySelectorAll('a[data-email-user][data-email-domain]').forEach(function (link) {
      var user = link.dataset.emailUser, domain = link.dataset.emailDomain;
      if (!/^[A-Za-z0-9._+-]+$/.test(user) || !/^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(domain)) return;
      var address = user + '@' + domain;
      var query = link.dataset.emailQuery ? '?' + link.dataset.emailQuery : '';
      link.href = 'mailto:' + address + query;
      // Con data-email-label il testo originale resta (es. «Escribir por email»).
      if (link.dataset.emailLabel !== 'true') link.textContent = address;
      // Conta il clic come quello su WhatsApp, cosi' in Analytics si vede da dove arriva chi scrive.
      link.addEventListener('click', function () {
        if (typeof gtag === 'function') gtag('event', 'click_email', {'event_category': 'conversion', 'event_label': 'email_contact'});
        if (typeof fbq === 'function') fbq('track', 'Contact');
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
