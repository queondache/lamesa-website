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
      modelado: { classTypeIds: ['ct_c4a053343d214b15a3adf18f018f6bc4', 'ct_c99fe995b7ca44b08f0a710a8a1c56fa'] },
      torno: { classTypeIds: ['ct_0dbbb9eb8634405c82efe7d9a1b3c413', 'ct_b079ccf5a7ce4bf289b303173bf7bf26'] }
    },
    // Corsi mensili (box turni su clases/semanal-*): classTypeId "Taller Semanal" di Mesana,
    // letti da GET /public/studios/la-mesa/course-turns il 2026-10-13.
    // Dal 26/10/2026 (nuovo setup Mesana) i turni sono dei tipi unici «Torno» e «Modelado»: i vecchi id restano
    // per le lezioni gia' in calendario prima di quella data.
    courses: {
      torno: { classTypeIds: ['ct_afb572015b6e457b8fd070ab697e7269', 'ct_b079ccf5a7ce4bf289b303173bf7bf26'] },
      modelado: { classTypeIds: ['ct_9366d72e18b545c2b6e5741ea334bbfb', 'ct_c99fe995b7ca44b08f0a710a8a1c56fa'] }
    }
  };
})();
