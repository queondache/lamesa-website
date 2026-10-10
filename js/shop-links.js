/* With missing/invalid config or JavaScript disabled, the studio gallery remains usable. */
(function () {
  'use strict';
  const config = window.LA_MESA_SHOP;
  if (!config || config.enabled !== true) return;
  let destination;
  try {
    destination = new URL(config.url);
  } catch (_) { return; }
  if (destination.origin !== 'https://qqiza2-n3.myshopify.com' ||
      destination.pathname !== '/collections/all' || destination.username ||
      destination.password || destination.search || destination.hash) return;
  document.querySelectorAll('[data-shop-link]').forEach(function (link) {
    link.href = destination.href;
    link.textContent = link.dataset.shopLabel;
  });
  document.querySelectorAll('[data-shop-status]').forEach(function (status) {
    status.textContent = status.dataset.shopOpenLabel;
  });
})();
