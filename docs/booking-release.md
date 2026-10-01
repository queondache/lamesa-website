# Esperienze La Mesa — preparazione locale, nessuna pubblicazione

Stato: nove pagine statiche ES/EN/CA pronte come anteprima; disponibilità e acquisto non attivi. Gli URL live esistenti, sitemap, robots, home, analytics e backend non sono modificati. La demo `/demo/prenotazione.html` resta `noindex,nofollow` e contiene soltanto date, posti e pagamenti simulati.

## Contenuti verificati

Fonte: `clases/suelta.html` e traduzioni EN/CA del sito attuale. Modelado 45 €/persona, torno 65 €/persona; durata 2 ore, materiali/equipaggiamento e hornada/cuita inclusi; livello iniziale; torno massimo 2 persone; sede Carrer de l’Atlàntida 47, 08003 Barcelona. Questi contenuti sono HTML statico leggibile anche con JavaScript disabilitato. Nessuna recensione, promessa di cancellazione o disponibilità aggiunta. Workshop: stato vuoto esplicito; nessun evento, data, prezzo o numero di posti inventato.

## URL da aggiungere alla sitemap soltanto al lancio autorizzato

| Esperienza | ES | EN | CA |
| --- | --- | --- | --- |
| Modelado | `/experiencias/modelado.html` | `/en/experiencias/modelado.html` | `/ca/experiencias/modelado.html` |
| Torno | `/experiencias/torno.html` | `/en/experiencias/torno.html` | `/ca/experiencias/torno.html` |
| Workshop | `/experiencias/workshops.html` | `/en/experiencias/workshops.html` | `/ca/experiencias/workshops.html` |

Il dominio canonico è `https://lamesabcn.com`; ogni pagina contiene canonical auto-referente, alternate ES/EN/CA reciproci, x-default ES e metadata OpenGraph. `index,follow` è preparato nei nuovi file locali, che non sono pubblicati. Non esporre una preview di questi file su host pubblico senza autenticarla o aggiungere temporaneamente `noindex`; controllare il canonical prima di qualsiasi anteprima esterna. Conservare `/clases/suelta.html`, le traduzioni e tutti gli URL esistenti; niente redirect fino a una decisione specifica. Al lancio, collegare le nuove pagine dalla navigazione/home autorizzata e aggiungere i nove URL alla sitemap con alternate equivalenti; verificare HTTP200, canonical, crawling e mobile.

## Contratto prenotazione

Le sei pagine dei corsi espongono `#reserva`, `data-experience="modelado|torno"`, `data-booking-state="prelaunch"`. Il placeholder dichiara che la prenotazione non è attiva e collega solo alla demo in spagnolo. Sostituirlo con il componente autorizzato sul dominio La Mesa solo dopo verifica: disponibilità dal calendario unico Mesana, prezzo autorevole, quantità e capacità, protezione posti, pagamento e conferma autentica, lingua coerente. Non usare date del prototipo come disponibilità reale. Tradurre anche checkout e conferma prima di attivare EN/CA. Le condizioni di cambio/cancellazione e consegna delle opere devono essere definite e visibili prima del pagamento. La pagina workshop non espone un widget per un evento inesistente.

## Contratto pagina evento futuro

Pubblicare una pagina evento soltanto da una scheda approvata: identificatore stabile, slug, titolo e descrizione ES/EN/CA, foto autorizzata e alt, docente se confermato, sede, durata, data/ora e fuso Europe/Madrid, prezzo/valuta/inclusioni, capacità/disponibilità dal calendario unico, condizioni e informazioni di consegna. URL proposto `/experiencias/workshops/<slug>.html` con traduzioni equivalenti. Nessun file template con dati fittizi pubblicabile. Collegare l’evento all’agenda solo quando la scheda e il motore sono pronti. Per JSON-LD Event inserire startDate/endDate ISO8601 con offset corretto, location, organizer, offers e eventStatus corrispondenti a dati reali; aggiornare cancellazioni/rinvii e rimuovere disponibilità esaurita. Non aggiungere Event all’agenda vuota.

## Schema e rilascio

Course+Offer sulle sei pagine corsi rappresentano prezzi attuali; non affermano disponibilità, data, modalità di pagamento o prenotazione attiva. CollectionPage+ItemList vuoto sulle tre agende rappresenta lo stato reale. BreadcrumbList su tutte. FAQ visibili in HTML, nessuna promessa di risultati arricchiti o posizionamento SEO/GEO. Prima del lancio riconfermare offerte/prezzi/inclusioni, validare JSON-LD con strumenti ufficiali, attivare il widget soltanto dopo prove complete del motore e rimuovere avvisi/demo link. Pubblicazione richiede autorizzazione separata di Andrea; nessun tracker/pixel aggiunto.

## Verifica locale

`node --test tests/experiences.test.mjs` controlla nove pagine, lingue, canonical/hreflang, schema, contenuti statici, collegamenti locali, asset e assenza di tracker/codice di prenotazione. Controllo browser con JavaScript disabilitato a 375/390/1440: titolo, descrizione, FAQ, prezzi/inclusioni e stato prelaunch devono restare leggibili senza overflow. Non testare acquisti reali da queste pagine.

## Widget guest — configurazione e anteprima locale

Le pagine dei corsi caricano il modulo locale `/js/experience-booking.js`, inerte senza `window.LA_MESA_GUEST_BOOKING.enabled === true`. Il contenuto SEO e il placeholder restano disponibili senza JavaScript o configurazione. Il server `node dev/server.mjs` serve soltanto su127.0.0.1:8801, inietta la configurazione sandbox e inoltra `/api/` soltanto a127.0.0.1:8800. Non avvia il backend; quello richiede la composizione Mesana sandbox separata. Le cartelle dev/tests/docs e i file nascosti non sono serviti. Nessuna credenziale o chiamata al backend di produzione è presente.

La configurazione sandbox usa slug `la-mesa-sandbox` e classTypeIds espliciti `ct_guest_modelado`/`ct_guest_torno`. Non dedurre mai il tipo di esperienza dal titolo tradotto. Il widget legge solo sessioni materializzate, prezzi e posti API, seleziona giorno/orario in Europe/Madrid, limita quantità ai posti e massimo100, invia esclusivamente sessionId/quantity/name/email/locale/idempotencyKey. Un prezzo diverso restituito dal backend richiede accettazione esplicita prima del redirect. Nome/email sono richiesti solo nel dialogo e non salvati. Il fingerprint della richiesta è hash; la chiave resta identica per retry con stessa richiesta, cambia con sessione/quantità/acquirente/lingua. Non inferire conferma dal ritorno di pagamento.

La configurazione produzione è soltanto un contratto non attivato: richiede mode `production`, enabled true, releaseApproved true, apiBase HTTPS e allowedApiOrigins espliciti. Verificare e autorizzare il dominio API reale e i classTypeIds La Mesa prima di inserire qualunque configurazione nel sito. Stripe è ammesso soltanto su `https://checkout.stripe.com`; il checkout HTTP127.0.0.1:8800 è ammesso esclusivamente in sandbox loopback. Non pubblicare `dev/` o fixture; non trasformare una fixture in fallback backend.

Ritorno gestito da `/experiencias/reserva.html?checkout=return|cancel` e traduzioni equivalenti, tutte noindex e no-referrer. Il bearer opaco rimane soltanto in sessionStorage e Authorization, mai URL/log/analytics. Intento senza PII conserva esperienza/giorno/sessione/posti e lingua; il ritorno base reindirizza alla lingua memorizzata. Pending mostra verifica e polling, confirmed abilita conferma e download ICS (instanti UTC corretti anche con cambio ora Europe/Madrid), failed/expired consentono nuova scelta, paid_needs_staff richiede assistenza e non conferma. Cancel conserva la scelta ed elimina token/chiave; confirmed elimina token dal deposito transitorio. È necessaria sessionStorage: non promettere ripresa su altro browser/dispositivo.

## Prove frontend distinte da PostgreSQL e Stripe

`node --test tests/experience-booking.test.mjs` prova whitelist/configurazione, prezzi/posti, DST, idempotenza, rimozione token, contratto request/Bearer e timeout/errore API. `tests/experience-booking.browser.mjs` usa esclusivamente `dev/tests/fixture.mjs`, API intercettate nel browser e una pagina di pagamento sintetica: nessuna connessione aDB, Stripe o email. Eseguire con `PLAYWRIGHT_MODULE` indirizzato al runtime Playwright già disponibile; senza runtime il solo test browser è dichiarato skipped, non superato. Scenari coperti:2posti modelado90€ e torno130€, mobile375/390 e desktop1440, ripresaEN, ultimo posto perso, provider non disponibile, risposta POST persa e replay con stessa chiave, prezzo aggiornato da accettare, pending→confirmed, failed/expired/paid_needs_staff, cancellazione e scelta conservata, modalità disattivata senza richiesteAPI e disponibilità vuota. Queste prove non dimostrano transazioni, persistenza, concorrenza o integrazione Stripe reali: restano controlli separati obbligatori prima del lancio.
