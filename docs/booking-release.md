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
