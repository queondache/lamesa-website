# Esperienze La Mesa — pubblicazione in attesa di Mesana

## Contenuto pubblico e disponibilità

Le nove pagine ES/EN/CA sono predisposte per essere pubblicate e indicizzate: descrizioni statiche, FAQ, indirizzo, prezzi Modelado45€/Torno65€ per persona, due ore e inclusioni già presenti nel sito. La prenotazione diretta nuova resta disattivata; nessuna data o disponibilità è pubblicata dal componente. Il contatto WhatsApp del sito34711552030 permette di chiedere al laboratorio disponibilità e condizioni, senza inventare politiche di cancellazione o consegna.

La scelta Modelado/Torno/Workshops è dentro il pannello della prenotazione o l’agenda e collega la pagina nella stessa lingua, mantenendo coerenti titolo e descrizione. Le tre agende non contengono eventi inventati: l’utente può chiedere il programma attuale allo studio. Le home aggiungono link alle nuove esperienze accanto ai pulsanti delle classi, preservando tutti i pulsanti di prenotazione esistenti e il programma Drive. I vecchi URL `/clases/suelta.html` e le traduzioni restano accessibili e separati dal nuovo motore; le prenotazioni settimanali esistenti non cambiano.

## SEO e pubblicazione statica

Canonical auto-referenti suhttps://lamesabcn.com, alternate ES/EN/CA e x-default reciproci, metadata e contenuti leggibili senza JavaScript. La sitemap include le nove pagine delle esperienze e mantiene gli URL precedenti; non include la demo né le pagine di ritorno. Course+Offer descrivono corsi/prezzi senza promettere disponibilità; CollectionPage+ItemList vuoto descrivono le agende. Nessuna recensione o Event inventati e nessuna promessa di posizionamento SEO/GEO.

GitHub Pages usa `main` e cartella radice con Jekyll. `_config.yml` esclude dev, tests, docs, demo, .orchestratore, node_modules, filepackage e .github; questi file non devono entrare nel sito generato. Pubblicare preservando questa configurazione: non aggiungere `.nojekyll` senza una pubblicazione con elenco esplicito dei file ammessi. Verificare che fixture e documenti interni rispondano404 nel sito generato, oltre a HTTP200/canonical/mobile delle pagine pubbliche. Non pubblicare dati personali, token o segreti: la configurazione contiene solo parametri pubblici.

## Configurazione disattivata e attivazione successiva

`/js/booking-config.js` precede il modulo nei sei corsi e tre ritorni. Imposta `enabled:false`, `mode:production`, `releaseApproved:false`, APIhttps://mesa-saas-backend.onrender.com/api e origine esplicitahttps://mesa-saas-backend.onrender.com. Slug studio vuoto e classTypeIds vuoti per Modelado/Torno sono intenzionali: non si conoscono i valori reali e non si usano quelli sintetici. Il modulo non effettua richieste con questa configurazione. Il file preserva una configurazione già iniettata dal server locale: non sovrascrive la sandbox esplicita.

Prima di attivare: verificare lo slug La Mesa, i classTypeIds reali, CORS per il dominio del sito, sessioni materializzate/prezzi/posti, concorrenza e protezione posti Mesana, Stripe e verifica server della conferma. Definire e tradurre condizioni di cambio/cancellazione e consegna; aggiornare lo stato pubblico e la copy del checkout solo dopo questa verifica. L’attivazione richiede `enabled:true`, `releaseApproved:true`, mapping reale e origine HTTPS autorizzata. Non abilitare il componente finché Mesana non è pronta.

Il contratto è `/api/public/studios/{slug}/guest-sessions?from=YYYY-MM-DD&to=YYYY-MM-DD`, POST `guest-checkouts` e GET `guest-checkouts/{attemptId}` con Authorization. Il browser invia solo sessionId/quantity/name/email/locale/idempotencyKey; prezzo e capacità arrivano dal server. Nome/email non sono salvati; fingerprint e idempotencyKey consentono retry della stessa richiesta. Il token opaco resta in sessionStorage/Authorization, mai URL, log o analytics. Pending non equivale a conferma; confirmed permette ICS, failed/expired nuova scelta, paid_needs_staff richiede assistenza. Alla conferma il token transitorio viene rimosso.

Stripe è ammesso suhttps://checkout.stripe.com. Le pagine di ritorno `/experiencias/reserva.html?checkout=return|cancel` e traduzioni sono noindex/no-referrer; riprendono la lingua dalla scelta memorizzata nello stesso browser e rimangono informative quando il componente è disattivato. Non promettere ripresa tra dispositivi.

## Anteprima locale e prove

`node dev/server.mjs` serve solo127.0.0.1:8801, inietta la sandbox e inoltra `/api/` solo a127.0.0.1:8800. Richiede la composizione Mesana separata; non avvia database e non ripiega su fixture. Configurazione locale: slugla-mesa-sandbox, tipi ct_guest_modelado/ct_guest_torno. La produzione non contiene questi mapping.

`node dev/fixture-preview.mjs` è esclusivamente una simulazione esplicita su8801/8800, con dati in memoria e pagamento di prova. Mostra «Demo simulata: date e pagamento di prova. Nessuna prenotazione o pagamento reale.», metadata synthetic-in-memory-no-database e health con database/Stripe/email/persistencefalse. Sostituisce eventuali dati inseriti con esempi, non usa carte o invia email; fermarla prima della sandbox Mesana sulle stesse porte. Non è pubblicabile né fallback del server reale.

Controlli economici: `node --test tests/experience-booking.test.mjs tests/experiences.test.mjs tests/booking-release.test.mjs`. Il workflow `site-check` crea un solo controllo stabile su ogni proposta e su main: Node22, nessuna dipendenza installata, database o pagamento. La concorrenza annulla esecuzioni superate; niente filtri che lascino il controllo assente. Prima di promuovere una versione, richiedere esplicitamente questo controllo e review indipendente del candidato esatto; i soli controlli di pubblicazione Pages non provano la prenotazione.

Il runner browser con Playwright già presente verifica calendario, selettore/localizzazione, quantità, tastiera, retry e privacy usando API sintetica; non dimostra PostgreSQL, Stripe, webhook o invii email. Le prove reali Mesana restano separate. Controllare anche le nove pagine senza JavaScript a375/390/768/1440 e zero chiamateAPI con la configurazione pubblica disattivata.
