/* Public standby: no requests or checkout until the real studio mapping is verified.
 * The explicit loopback preview injects its own configuration before this file. */
(function () {
  if (window.LA_MESA_GUEST_BOOKING !== undefined) return;
  window.LA_MESA_GUEST_BOOKING = {
    enabled: false,
    mode: 'production',
    releaseApproved: false,
    apiBase: 'https://mesa-saas-backend.onrender.com/api',
    allowedApiOrigins: ['https://mesa-saas-backend.onrender.com'],
    studioSlug: '',
    clientArea: { enabled: false, url: 'https://app.mesana.studio/client/la-mesa' },
    experiences: {
      modelado: { classTypeIds: [] },
      torno: { classTypeIds: [] }
    }
  };
})();
