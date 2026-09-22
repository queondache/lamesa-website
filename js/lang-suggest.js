/* ============================================================
   La Mesa – Creative Lab · Barcelona
   Language Suggestion Bar — logica unica (niente più duplicazione)
   Caricato SENZA "defer" nello stesso punto dove prima stava lo
   script inline in testa al <body> di index.html / en/index.html /
   ca/index.html: deve girare in modo sincrono PRIMA del primo paint
   per evitare layout shift (CLS), quindi non può dipendere da
   js/main.js (caricato con "defer", gira dopo il render iniziale).
   Un'unica copia, richiesta same-origin cacheata e condivisa dalle
   tre home.
   ============================================================ */
(function () {
  var STORAGE_KEY = 'lamesa_lang_suggest_dismissed';
  var AVAILABLE_LANGS = ['es', 'en', 'ca'];
  var FALLBACK_TO_EN = ['de', 'fr', 'it', 'pt'];

  var LABELS = {
    es: { notice: 'Esta página también está disponible en español.', cta: 'Ver en español →', close: 'Cerrar aviso de idioma' },
    en: { notice: 'This page is also available in English.', cta: 'View in English →', close: 'Close language notice' },
    ca: { notice: 'Aquesta pàgina també està disponible en català.', cta: 'Veure en català →', close: 'Tancar avís d’idioma' }
  };
  var URLS = { es: '/index.html', en: '/en/index.html', ca: '/ca/index.html' };

  function isDismissed() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {
      // Navigazione privata o storage disabilitato: nessun blocco,
      // il sito deve funzionare comunque (semplicemente non ricorda).
      return false;
    }
  }

  // Funzione pura di decisione — fonte di verità unica, testabile via
  // Node: node -e "require('./js/lang-suggest.js')" non serve, il test
  // del gate la richiama esportandola sotto (module.exports) quando
  // eseguita fuori dal browser.
  function decideLangSuggestion(browserLanguages, pageLang, dismissed) {
    if (dismissed) return null;
    if (!browserLanguages || !browserLanguages.length) return null;

    for (var i = 0; i < browserLanguages.length; i++) {
      var code = String(browserLanguages[i]).slice(0, 2).toLowerCase();

      if (code === pageLang) return null; // il browser preferisce già questa lingua

      if (AVAILABLE_LANGS.indexOf(code) !== -1) {
        return { lang: code };
      }

      if (FALLBACK_TO_EN.indexOf(code) !== -1 && pageLang !== 'en') {
        return { lang: 'en' };
      }
    }

    return null;
  }

  // Export Node per il test del gate di verifica. Zero dipendenze
  // nuove: è un controllo d'ambiente, il browser ignora questo ramo
  // (module non esiste su window).
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { decideLangSuggestion: decideLangSuggestion };
  }

  // Il resto manipola il DOM: solo in browser (document non esiste in
  // Node quando il file è richiesto per il test della funzione pura).
  if (typeof document === 'undefined') return;

  var pageLang = document.documentElement.lang || 'es';
  var browserLanguages = (navigator.languages && navigator.languages.length)
    ? navigator.languages
    : [navigator.language || ''];

  var suggestion = decideLangSuggestion(browserLanguages, pageLang, isDismissed());
  if (!suggestion) return;

  var labels = LABELS[suggestion.lang];
  var url = URLS[suggestion.lang];
  if (!labels || !url) return;

  var bar = document.getElementById('lang-suggest-bar');
  if (!bar) return;

  // WCAG 3.1.2 "Language of Parts": il testo del suggerimento parla
  // nella lingua SUGGERITA (non in quella della pagina, dichiarata su
  // <html lang>), quindi va marcato esplicitamente con lang, come già
  // avviene per il link CTA sotto.
  var textEl = document.getElementById('lang-suggest-text');
  textEl.textContent = labels.notice;
  textEl.lang = suggestion.lang;

  var link = document.getElementById('lang-suggest-link');
  link.textContent = labels.cta;
  link.href = url;
  link.lang = suggestion.lang;

  var closeLabel = labels.close;
  var closeBtn = document.getElementById('lang-suggest-close');
  closeBtn.setAttribute('aria-label', closeLabel);
  closeBtn.lang = suggestion.lang;

  // Ricorda la chiusura/scelta in localStorage: try/catch perché in
  // navigazione privata l'accesso puo' lanciare (il sito deve
  // funzionare comunque, semplicemente non ricordera' la scelta).
  function rememberDismissed() {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {
      // no-op: storage non disponibile
    }
  }

  closeBtn.addEventListener('click', function () {
    bar.hidden = true;
    rememberDismissed();
  });

  link.addEventListener('click', function () {
    if (typeof gtag === 'function') {
      gtag('event', 'language_switch', {
        from_lang: pageLang,
        to_lang: suggestion.lang,
        source: 'suggestion_bar'
      });
    }
    rememberDismissed();
  });

  bar.hidden = false;
})();
