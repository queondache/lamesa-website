# Esperienze La Mesa — stato reale della prenotazione dal sito

## Stato attuale (12/10/2026)

Le nove pagine ES/EN/CA (`experiencias/{modelado,torno,workshops}.html`) mostrano le date reali di Mesana e prendono il pagamento online con Stripe. La configurazione pubblica `/js/booking-config.js` è attiva: `enabled:true`, `releaseApproved:true`, `bookingFlow:stripe`, studio `la-mesa`, classTypeIds reali per Modelado e Torno. Il prezzo arriva da Mesana: il sito non controlla più un prezzo atteso (`expectedUnitPriceCents` assente in produzione). Se il calendario non carica, il box ripiega sul contatto WhatsApp del sito (34711552030). Le agende workshop non contengono eventi inventati.

L'interruttore online è in Mesana: la prenotazione ospite si accende o spegne dal gestionale Mesana, non dal sito. Le home puntano a `experiencias/torno.html` e alle classi settimanali `clases/semanal-*.html`; solo il bono resta su app.mesana.studio.

`/clases/suelta.html` in ES, EN e CA è ormai una pagina di rimando (meta refresh + canonical verso `experiencias/torno.html`, `noindex,follow`, link a `experiencias/modelado.html`) e non è più in sitemap né in `llms.txt`. La versione PT (`pt/clases/suelta.html`) non è toccata e resta in sitemap come unica voce suelta. I link interni residui verso la vecchia URL (blog, workshops, semanal-modelado) passano dal rimando.

## SEO e pubblicazione statica

Canonical auto-referenti suhttps://lamesabcn.com, alternate ES/EN/CA e x-default reciproci, metadata e contenuti leggibili senza JavaScript. La sitemap include le nove pagine delle esperienze e mantiene le classi settimanali e la voce PT di suelta (ES/EN/CA sono rimandi noindex, fuori sitemap); non include la demo né le pagine di ritorno. Course+Offer descrivono corsi/prezzi senza promettere disponibilità; CollectionPage+ItemList vuoto descrivono le agende. Nessuna recensione o Event inventati e nessuna promessa di posizionamento SEO/GEO.

GitHub Pages usa `main` e cartella radice con Jekyll. `_config.yml` esclude dev, tests, docs, demo, .orchestratore, node_modules, filepackage e .github; questi file non devono entrare nel sito generato. Pubblicare preservando questa configurazione: non aggiungere `.nojekyll` senza una pubblicazione con elenco esplicito dei file ammessi. Verificare che fixture e documenti interni rispondano404 nel sito generato, oltre a HTTP200/canonical/mobile delle pagine pubbliche. Non pubblicare dati personali, token o segreti: la configurazione contiene solo parametri pubblici.

## Configurazione e verifiche prima di cambiare l’attivazione

`/js/booking-config.js` precede il modulo nei sei corsi e tre ritorni. In produzione imposta `enabled:true`, `mode:production`, `releaseApproved:true`, APIhttps://mesa-saas-backend.onrender.com/api e origine esplicitahttps://mesa-saas-backend.onrender.com. Slug studio e classTypeIds sono quelli reali di La Mesa; non si usano quelli sintetici della sandbox. Il file preserva una configurazione già iniettata dal server locale: non sovrascrive la sandbox esplicita.

Prima di modificare la configurazione: verificare lo slug La Mesa, i classTypeIds reali, CORS per il dominio del sito, sessioni materializzate/prezzi/posti, concorrenza e protezione posti Mesana, Stripe e verifica server della conferma. Definire e tradurre condizioni di cambio/cancellazione e consegna; aggiornare lo stato pubblico e la copy del checkout solo dopo questa verifica. L’attivazione richiede `enabled:true`, `releaseApproved:true`, mapping reale e origine HTTPS autorizzata. Per spegnere la prenotazione online usare l’interruttore in Mesana.

Il contratto è `/api/public/studios/{slug}/guest-sessions?from=YYYY-MM-DD&to=YYYY-MM-DD`, POST `guest-checkouts` e GET `guest-checkouts/{attemptId}` con Authorization. Il browser invia solo sessionId/quantity/name/email/locale/idempotencyKey; prezzo e capacità arrivano dal server. Nome/email non sono salvati; fingerprint e idempotencyKey consentono retry della stessa richiesta. Il token opaco resta in sessionStorage/Authorization, mai URL, log o analytics. Pending non equivale a conferma; confirmed permette ICS, failed/expired nuova scelta, paid_needs_staff richiede assistenza. Alla conferma il token transitorio viene rimosso.

Il feed delle sessioni include `description` e `imageUrl` opzionali (sessione, con possibile eredità dal modello): il pannello mostra il contenuto del turno selezionato quando presente e continua senza contenuto quando è assente. La quantità resta tra 1 e il minimo tra 100 e i posti server disponibili; il totale visualizzato usa il prezzo unitario del feed, mentre il totale definitivo è quello restituito dal checkout. Mesana accetta locale `es`, `en`, `ca`, `it`; questo sito invia la lingua della pagina ES/EN/CA. Il checkout Stripe usa carta e mostra Apple Pay/Google Pay solo quando disponibili per il conto e il dispositivo. Le rotte pubbliche usano CORS senza credenziali: il browser invia `credentials:'omit'`; l'origine del sito deve essere in `PUBLIC_BOOKING_ORIGINS`, non in `CORS_ORIGINS`.

Stripe è ammesso suhttps://checkout.stripe.com. Le pagine di ritorno `/experiencias/reserva.html?checkout=return|cancel` e traduzioni sono noindex/no-referrer; riprendono la lingua dalla scelta memorizzata nello stesso browser e rimangono informative quando il componente è disattivato. Non promettere ripresa tra dispositivi.

## Anteprima locale e prove

`node dev/server.mjs` serve solo127.0.0.1:8801, inietta la sandbox e inoltra `/api/` solo a127.0.0.1:8800. Richiede la composizione Mesana separata; non avvia database e non ripiega su fixture. Configurazione locale: slugla-mesa-sandbox, tipi ct_guest_modelado/ct_guest_torno. La produzione non contiene questi mapping.

`node dev/fixture-preview.mjs` è esclusivamente una simulazione esplicita su8801/8800, con dati in memoria e pagamento di prova. Mostra «Demo simulata: date e pagamento di prova. Nessuna prenotazione o pagamento reale.», metadata synthetic-in-memory-no-database e health con database/Stripe/email/persistencefalse. Sostituisce eventuali dati inseriti con esempi, non usa carte o invia email; fermarla prima della sandbox Mesana sulle stesse porte. Non è pubblicabile né fallback del server reale.

Controlli economici: `node --test tests/experience-booking.test.mjs tests/experiences.test.mjs tests/booking-release.test.mjs`. Il workflow `site-check` crea un solo controllo stabile su ogni proposta e su main: Node22, nessuna dipendenza installata, database o pagamento. La concorrenza annulla esecuzioni superate; niente filtri che lascino il controllo assente. Prima di promuovere una versione, richiedere esplicitamente questo controllo e review indipendente del candidato esatto; i soli controlli di pubblicazione Pages non provano la prenotazione.

Il runner browser con Playwright già presente verifica calendario, selettore/localizzazione, quantità, tastiera, retry e privacy usando API sintetica; non dimostra PostgreSQL, Stripe, webhook o invii email. Le prove reali Mesana restano separate. Controllare anche le nove pagine senza JavaScript a375/390/768/1440 e zero chiamateAPI con la configurazione pubblica disattivata.
