/* Public Mesana calendar and Stripe guest checkout. */
(function () {
  if (window.LA_MESA_GUEST_BOOKING !== undefined) return;
  window.LA_MESA_GUEST_BOOKING = {
    enabled: true,
    mode: 'production',
    releaseApproved: true,
    bookingFlow: 'stripe',
    apiBase: 'https://mesa-saas-backend.onrender.com/api',
    allowedApiOrigins: ['https://mesa-saas-backend.onrender.com'],
    studioSlug: 'la-mesa',
    clientArea: { enabled: true, url: 'https://app.mesana.studio/client/la-mesa' },
    experiences: {
      modelado: { classTypeIds: ['ct_c4a053343d214b15a3adf18f018f6bc4'], expectedUnitPriceCents: 4500 },
      torno: { classTypeIds: ['ct_0dbbb9eb8634405c82efe7d9a1b3c413'], expectedUnitPriceCents: 6500 }
    }
  };
})();
