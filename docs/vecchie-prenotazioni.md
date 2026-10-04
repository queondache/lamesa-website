# Vecchi accessi a prenotazione e pagamento — La Mesa

Inventario del codice del sito al 4 ottobre 2026. Una riga della tabella corrisponde a un accesso presente in una pagina; ES, EN e CA indicano la lingua della pagina, anche quando un articolo del blog è nella cartella comune `blog/`. Il rischio riguarda la vendita doppia di **posti per esperienze**. È una valutazione del percorso nel codice, non una prova che il pagamento sia oggi raggiungibile in produzione.

## Destinazioni e criterio

- **Alto**: la lezione si può scegliere nel gestionale La Mesa v2 o chiedere esplicitamente via WhatsApp fuori da Mesana; la stessa disponibilità può essere confermata due volte.
- **Medio**: contatto per classe, workshop o sessione privata che può diventare prenotazione manuale; serve inserire la data in Mesana prima di confermarla.
- **Basso**: contatto generico, assistenza dopo l’acquisto, buono senza data o vendita di oggetti; nessun posto viene impegnato dal clic.
- Il flusso v2 è definito in `js/booking-v2.js:12-14,151,171,208,356,389-400`: API `https://la-mesa-v2-backend.onrender.com`; classe singola → `https://app.lamesabcn.com/book.html?slot_id=…`; corso settimanale → `/bookings/checkout-semanal` → URL di pagamento Stripe. `js/booking.js:8,465-472` contiene anche il vecchio flusso Google Apps Script, ma nessun HTML lo carica: codice inattivo, non un pulsante attuale.

## Accessi presenti nelle pagine

| Pagina e riga | Lingua | Accesso | Dove porta | Rischio | Proposta |
|---|---|---|---|---|---|
| `404.html:85` | ES | Escríbenos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/ceramica-para-principiantes-barcelona.html:220` | ES | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `blog/ceramica-para-principiantes-barcelona.html:221` | ES | Ver el Taller Semanal | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/ceramica-para-principiantes-barcelona.html:247` | ES | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/ceramica-para-principiantes-barcelona.html:253` | ES | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/ceramica-para-principiantes-barcelona.html:262` | ES | Escríbenos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/ceramica-para-principiantes-barcelona.html:276` | ES | Contactar La Mesa por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/ceramica-per-a-principiants-barcelona.html:220` | CA | WhatsApp → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/ceramica-per-a-principiants-barcelona.html:221` | CA | Veure el Taller Setmanal | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/ceramica-per-a-principiants-barcelona.html:247` | CA | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/ceramica-per-a-principiants-barcelona.html:253` | CA | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/ceramica-per-a-principiants-barcelona.html:262` | CA | Escriu-nos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/ceramica-per-a-principiants-barcelona.html:276` | CA | Contactar La Mesa per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/ceramics-classes-barcelona-guide.html:192` | EN | drop-in session | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/ceramics-classes-barcelona-guide.html:220` | EN | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `blog/ceramics-classes-barcelona-guide.html:221` | EN | See the Weekly Class | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/ceramics-classes-barcelona-guide.html:247` | EN | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/ceramics-classes-barcelona-guide.html:253` | EN | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/ceramics-classes-barcelona-guide.html:262` | EN | Write to us → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/ceramics-classes-barcelona-guide.html:275` | EN | Contact La Mesa on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/com-triar-taller-ceramica-barcelona.html:247` | CA | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `blog/com-triar-taller-ceramica-barcelona.html:248` | CA | Veure el Taller Setmanal | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/com-triar-taller-ceramica-barcelona.html:274` | CA | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/com-triar-taller-ceramica-barcelona.html:280` | CA | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/com-triar-taller-ceramica-barcelona.html:289` | CA | Escriu-nos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/com-triar-taller-ceramica-barcelona.html:303` | CA | Contactar La Mesa per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/como-elegir-taller-ceramica-barcelona.html:247` | ES | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `blog/como-elegir-taller-ceramica-barcelona.html:248` | ES | Ver el Taller Semanal | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/como-elegir-taller-ceramica-barcelona.html:274` | ES | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/como-elegir-taller-ceramica-barcelona.html:280` | ES | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/como-elegir-taller-ceramica-barcelona.html:289` | ES | Escríbenos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/como-elegir-taller-ceramica-barcelona.html:303` | ES | Contactar La Mesa por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/cosas-que-hacer-en-barceloneta.html:191` | ES | La Mesa | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/cosas-que-hacer-en-barceloneta.html:227` | ES | WhatsApp → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/cosas-que-hacer-en-barceloneta.html:228` | ES | Reservar una Clase Suelta | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/cosas-que-hacer-en-barceloneta.html:254` | ES | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/cosas-que-hacer-en-barceloneta.html:260` | ES | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/cosas-que-hacer-en-barceloneta.html:269` | ES | Escríbenos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/cosas-que-hacer-en-barceloneta.html:283` | ES | Contactar La Mesa por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/cuanto-cuesta-clase-ceramica-barcelona.html:308` | ES | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `blog/cuanto-cuesta-clase-ceramica-barcelona.html:309` | ES | Ver el Taller Semanal | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/cuanto-cuesta-clase-ceramica-barcelona.html:335` | ES | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/cuanto-cuesta-clase-ceramica-barcelona.html:341` | ES | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/cuanto-cuesta-clase-ceramica-barcelona.html:350` | ES | Escríbenos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/cuanto-cuesta-clase-ceramica-barcelona.html:364` | ES | Contactar La Mesa por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/guia-talleres-ceramica-barcelona.html:192` | ES | clase suelta | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/guia-talleres-ceramica-barcelona.html:220` | ES | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `blog/guia-talleres-ceramica-barcelona.html:221` | ES | Ver el Taller Semanal | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/guia-talleres-ceramica-barcelona.html:247` | ES | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/guia-talleres-ceramica-barcelona.html:253` | ES | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/guia-talleres-ceramica-barcelona.html:262` | ES | Escríbenos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/guia-talleres-ceramica-barcelona.html:276` | ES | Contactar La Mesa por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/guia-tallers-ceramica-barcelona.html:192` | CA | classe solta | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/guia-tallers-ceramica-barcelona.html:220` | CA | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `blog/guia-tallers-ceramica-barcelona.html:221` | CA | Veure el Taller Setmanal | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/guia-tallers-ceramica-barcelona.html:247` | CA | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/guia-tallers-ceramica-barcelona.html:253` | CA | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/guia-tallers-ceramica-barcelona.html:262` | CA | Escriu-nos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/guia-tallers-ceramica-barcelona.html:275` | CA | Contactar La Mesa per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/how-to-choose-pottery-class-barcelona.html:247` | EN | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `blog/how-to-choose-pottery-class-barcelona.html:248` | EN | See the Weekly Class | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/how-to-choose-pottery-class-barcelona.html:274` | EN | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/how-to-choose-pottery-class-barcelona.html:280` | EN | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/how-to-choose-pottery-class-barcelona.html:289` | EN | Write to us → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/how-to-choose-pottery-class-barcelona.html:303` | EN | Contact La Mesa on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/index.html:186` | ES | Privadas | Sezione sessioni private della home → WhatsApp per preventivo | medio | lasciare solo per preventivo; registrare la data in Mesana |
| `blog/index.html:293` | ES | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/index.html:299` | ES | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/index.html:308` | ES | Escríbenos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/index.html:321` | ES | Contactar La Mesa por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/pla-diferent-barcelona-ceramica.html:190` | CA | sessions privades | Sezione sessioni private della home → WhatsApp per preventivo | medio | lasciare solo per preventivo; registrare la data in Mesana |
| `blog/pla-diferent-barcelona-ceramica.html:214` | CA | vine a La Mesa | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/pla-diferent-barcelona-ceramica.html:220` | CA | WhatsApp → | WhatsApp per preventivo/prenotazione di sessione privata | medio | lasciare per preventivo; bloccare il posto in Mesana prima della conferma |
| `blog/pla-diferent-barcelona-ceramica.html:221` | CA | Veure privades | Sezione sessioni private della home → WhatsApp per preventivo | medio | lasciare solo per preventivo; registrare la data in Mesana |
| `blog/pla-diferent-barcelona-ceramica.html:247` | CA | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/pla-diferent-barcelona-ceramica.html:253` | CA | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/pla-diferent-barcelona-ceramica.html:262` | CA | Escriu-nos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/pla-diferent-barcelona-ceramica.html:276` | CA | Contactar La Mesa per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/plan-diferente-barcelona-ceramica.html:190` | ES | sesiones privadas | Sezione sessioni private della home → WhatsApp per preventivo | medio | lasciare solo per preventivo; registrare la data in Mesana |
| `blog/plan-diferente-barcelona-ceramica.html:214` | ES | ven a La Mesa | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/plan-diferente-barcelona-ceramica.html:220` | ES | WhatsApp → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/plan-diferente-barcelona-ceramica.html:221` | ES | Ver privadas | Sezione sessioni private della home → WhatsApp per preventivo | medio | lasciare solo per preventivo; registrare la data in Mesana |
| `blog/plan-diferente-barcelona-ceramica.html:247` | ES | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/plan-diferente-barcelona-ceramica.html:253` | ES | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/plan-diferente-barcelona-ceramica.html:262` | ES | Escríbenos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/plan-diferente-barcelona-ceramica.html:276` | ES | Contactar La Mesa por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/pottery-class-prices-barcelona.html:308` | EN | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `blog/pottery-class-prices-barcelona.html:309` | EN | See the Weekly Class | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/pottery-class-prices-barcelona.html:335` | EN | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/pottery-class-prices-barcelona.html:341` | EN | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/pottery-class-prices-barcelona.html:350` | EN | Write to us → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/pottery-class-prices-barcelona.html:364` | EN | Contact La Mesa on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/pottery-for-beginners-barcelona.html:222` | EN | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `blog/pottery-for-beginners-barcelona.html:223` | EN | See the Weekly Class | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/pottery-for-beginners-barcelona.html:249` | EN | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/pottery-for-beginners-barcelona.html:255` | EN | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/pottery-for-beginners-barcelona.html:264` | EN | Write to us → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/pottery-for-beginners-barcelona.html:278` | EN | Contact La Mesa on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/preu-classe-ceramica-barcelona.html:308` | CA | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `blog/preu-classe-ceramica-barcelona.html:309` | CA | Veure el Taller Setmanal | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/preu-classe-ceramica-barcelona.html:335` | CA | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/preu-classe-ceramica-barcelona.html:341` | CA | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/preu-classe-ceramica-barcelona.html:350` | CA | Escriu-nos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/preu-classe-ceramica-barcelona.html:364` | CA | Contactar La Mesa per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/que-es-el-torno-ceramica.html:214` | ES | Taller Semanal de Torno | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/que-es-el-torno-ceramica.html:224` | ES | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `blog/que-es-el-torno-ceramica.html:225` | ES | Ver el Taller de Torno | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/que-es-el-torno-ceramica.html:251` | ES | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/que-es-el-torno-ceramica.html:257` | ES | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/que-es-el-torno-ceramica.html:266` | ES | Escríbenos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/que-es-el-torno-ceramica.html:280` | ES | Contactar La Mesa por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/que-esperar-primera-clase-ceramica.html:249` | ES | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `blog/que-esperar-primera-clase-ceramica.html:250` | ES | Reservar una Clase Suelta | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/que-esperar-primera-clase-ceramica.html:276` | ES | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/que-esperar-primera-clase-ceramica.html:282` | ES | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/que-esperar-primera-clase-ceramica.html:291` | ES | Escríbenos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/que-esperar-primera-clase-ceramica.html:305` | ES | Contactar La Mesa por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/que-esperar-primera-classe-ceramica.html:212` | CA | classes soltes | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/que-esperar-primera-classe-ceramica.html:218` | CA | Barceloneta | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/que-esperar-primera-classe-ceramica.html:224` | CA | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `blog/que-esperar-primera-classe-ceramica.html:225` | CA | Reservar una Classe Solta | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/que-esperar-primera-classe-ceramica.html:251` | CA | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/que-esperar-primera-classe-ceramica.html:257` | CA | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/que-esperar-primera-classe-ceramica.html:266` | CA | Escriu-nos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/que-esperar-primera-classe-ceramica.html:280` | CA | Contactar La Mesa per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/things-to-do-barceloneta-barcelona.html:191` | EN | La Mesa | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/things-to-do-barceloneta-barcelona.html:227` | EN | WhatsApp → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/things-to-do-barceloneta-barcelona.html:228` | EN | Book a Drop-in Class | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/things-to-do-barceloneta-barcelona.html:254` | EN | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/things-to-do-barceloneta-barcelona.html:260` | EN | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/things-to-do-barceloneta-barcelona.html:269` | EN | Write to us → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/things-to-do-barceloneta-barcelona.html:283` | EN | Contact La Mesa on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/torn-ceramica-barcelona-guia.html:214` | CA | Taller Setmanal de Torn | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/torn-ceramica-barcelona-guia.html:224` | CA | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `blog/torn-ceramica-barcelona-guia.html:225` | CA | Veure el Taller de Torn | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/torn-ceramica-barcelona-guia.html:251` | CA | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/torn-ceramica-barcelona-guia.html:257` | CA | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/torn-ceramica-barcelona-guia.html:266` | CA | Escriu-nos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/torn-ceramica-barcelona-guia.html:280` | CA | Contactar La Mesa per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/unique-date-ideas-barcelona-pottery.html:192` | EN | La Mesa | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/unique-date-ideas-barcelona-pottery.html:200` | EN | private sessions | Sezione sessioni private della home → WhatsApp per preventivo | medio | lasciare solo per preventivo; registrare la data in Mesana |
| `blog/unique-date-ideas-barcelona-pottery.html:222` | EN | WhatsApp → | WhatsApp per preventivo/prenotazione di sessione privata | medio | lasciare per preventivo; bloccare il posto in Mesana prima della conferma |
| `blog/unique-date-ideas-barcelona-pottery.html:223` | EN | See private sessions | Sezione sessioni private della home → WhatsApp per preventivo | medio | lasciare solo per preventivo; registrare la data in Mesana |
| `blog/unique-date-ideas-barcelona-pottery.html:249` | EN | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/unique-date-ideas-barcelona-pottery.html:255` | EN | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/unique-date-ideas-barcelona-pottery.html:264` | EN | Write to us → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/unique-date-ideas-barcelona-pottery.html:278` | EN | Contact La Mesa on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/what-to-expect-first-pottery-class.html:210` | EN | drop-in sessions | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/what-to-expect-first-pottery-class.html:218` | EN | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `blog/what-to-expect-first-pottery-class.html:219` | EN | Book a Drop-in Class | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/what-to-expect-first-pottery-class.html:245` | EN | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/what-to-expect-first-pottery-class.html:251` | EN | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/what-to-expect-first-pottery-class.html:260` | EN | Write to us → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/what-to-expect-first-pottery-class.html:273` | EN | Contact La Mesa on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/wheel-throwing-barcelona-beginners.html:218` | EN | Weekly Wheel Class | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/wheel-throwing-barcelona-beginners.html:228` | EN | WhatsApp → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/wheel-throwing-barcelona-beginners.html:229` | EN | See the Wheel Class | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `blog/wheel-throwing-barcelona-beginners.html:255` | EN | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `blog/wheel-throwing-barcelona-beginners.html:261` | EN | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/wheel-throwing-barcelona-beginners.html:270` | EN | Write to us → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `blog/wheel-throwing-barcelona-beginners.html:284` | EN | Contact La Mesa on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/blog/index.html:278` | CA | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `ca/blog/index.html:284` | CA | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/blog/index.html:293` | CA | Escriu-nos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/blog/index.html:306` | CA | Contactar La Mesa per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/clases/semanal-modelado.html:211` | CA | ES | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-modelado.html:213` | CA | EN | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-modelado.html:215` | CA | CA | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-modelado.html:231` | CA | ES | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-modelado.html:232` | CA | EN | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-modelado.html:233` | CA | CA | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-modelado.html:274` | CA | No estàs segur? Prova primer una Classe Suelta → | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-modelado.html:281` | CA | WhatsApp | WhatsApp per prenotare una lezione fuori calendario | alto | sostituire con calendario Mesana; per richieste speciali registrare prima il posto in Mesana |
| `ca/clases/semanal-modelado.html:325` | CA | classe solta de modelat | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-modelado.html:329` | CA | classe setmanal de torn | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-modelado.html:347` | CA | Contactar La Mesa per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/clases/semanal-torno.html:214` | CA | ES | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-torno.html:216` | CA | EN | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-torno.html:218` | CA | CA | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-torno.html:234` | CA | ES | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-torno.html:235` | CA | EN | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-torno.html:236` | CA | CA | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-torno.html:278` | CA | No estàs segur? Prova primer una Classe Suelta → | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-torno.html:285` | CA | WhatsApp | WhatsApp per prenotare una lezione fuori calendario | alto | sostituire con calendario Mesana; per richieste speciali registrare prima il posto in Mesana |
| `ca/clases/semanal-torno.html:334` | CA | classe solta de torn | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-torno.html:334` | CA | classe setmanal de modelat | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/semanal-torno.html:352` | CA | Contactar La Mesa per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/clases/suelta.html:225` | CA | ES | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/suelta.html:227` | CA | EN | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/suelta.html:229` | CA | CA | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/suelta.html:245` | CA | ES | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/suelta.html:246` | CA | EN | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/suelta.html:247` | CA | CA | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/suelta.html:312` | CA | WhatsApp | WhatsApp per prenotare una lezione fuori calendario | alto | sostituire con calendario Mesana; per richieste speciali registrare prima il posto in Mesana |
| `ca/clases/suelta.html:361` | CA | Modelat | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/suelta.html:361` | CA | torn | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/clases/suelta.html:379` | CA | Contactar La Mesa per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/encarrecs.html:524` | CA | Explica'ns la teva idea per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/encarrecs.html:606` | CA | Escriure per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/encarrecs.html:607` | CA | Escriure per email | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `ca/encarrecs.html:633` | CA | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `ca/encarrecs.html:639` | CA | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/encarrecs.html:648` | CA | Escriu-nos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/encarrecs.html:662` | CA | Contactar La Mesa per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/gracias.html:115` | CA | WhatsApp | WhatsApp dopo pagamento, assistenza | basso | lasciare: assistenza dopo la prenotazione |
| `ca/gracias.html:134` | CA | Contactar La Mesa per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/index.html:225` | CA | Reserva la teva classe online → | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/index.html:234` | CA | Escriu-nos per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/index.html:321` | CA | Apunta't a la propera classe → | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/index.html:329` | CA | Classe Suelta → | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/index.html:352` | CA | Apunta't a la propera classe → | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/index.html:359` | CA | Classe Suelta → | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `ca/index.html:375` | CA | escriu-nos | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/index.html:401` | CA | Escriu-nos per a més informació → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `ca/index.html:481` | CA | Comprar val de regal → | WhatsApp per acquisto buono regalo | basso | lasciare se il buono non assegna una data; riscatto tramite Mesana |
| `ca/index.html:494` | CA | Veure botiga a Etsy → | Negozio Etsy; vendita di oggetti, fuori da Mesana | basso | lasciare: non vende posti per esperienze |
| `ca/index.html:560` | CA | Demanar pressupost → | WhatsApp per preventivo/prenotazione di sessione privata | medio | lasciare per preventivo; bloccare il posto in Mesana prima della conferma |
| `ca/index.html:639` | CA | Explica'ns el que fas → | Email per proporre un laboratorio | basso | lasciare: proposta di collaborazione, non prenotazione |
| `ca/index.html:679` | CA | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `ca/index.html:698` | CA | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/index.html:717` | CA | Escriu-nos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/index.html:775` | CA | Contactar La Mesa per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/team-building.html:188` | CA | Reserva per WhatsApp → | WhatsApp per preventivo/prenotazione di sessione privata | medio | lasciare per preventivo; bloccare il posto in Mesana prima della conferma |
| `ca/team-building.html:189` | CA | Escriu-nos un correu | Email precompilata per team building | medio | lasciare solo per preventivi; inserire la data confermata in Mesana |
| `ca/team-building.html:302` | CA | WhatsApp → | WhatsApp per preventivo/prenotazione di sessione privata | medio | lasciare per preventivo; bloccare il posto in Mesana prima della conferma |
| `ca/team-building.html:305` | CA | lamesa.lc@gmail.com | Email precompilata per team building | medio | lasciare solo per preventivi; inserire la data confermata in Mesana |
| `ca/team-building.html:328` | CA | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `ca/team-building.html:334` | CA | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/team-building.html:343` | CA | Escriu-nos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `ca/team-building.html:357` | CA | Contactar La Mesa per WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `clases/semanal-modelado.html:220` | ES | ES | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-modelado.html:222` | ES | EN | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-modelado.html:224` | ES | CA | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-modelado.html:255` | ES | ES | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-modelado.html:256` | ES | EN | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-modelado.html:257` | ES | CA | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-modelado.html:308` | ES | ¿No estás seguro? Prueba primero una Clase Suelta → | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-modelado.html:318` | ES | WhatsApp | WhatsApp per prenotare una lezione fuori calendario | alto | sostituire con calendario Mesana; per richieste speciali registrare prima il posto in Mesana |
| `clases/semanal-modelado.html:370` | ES | clase suelta de modelado | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-modelado.html:374` | ES | clase semanal de torno | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-modelado.html:398` | ES | Contactar La Mesa por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `clases/semanal-torno.html:223` | ES | ES | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-torno.html:225` | ES | EN | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-torno.html:227` | ES | CA | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-torno.html:258` | ES | ES | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-torno.html:259` | ES | EN | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-torno.html:260` | ES | CA | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-torno.html:311` | ES | ¿No estás seguro? Prueba primero una Clase Suelta → | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-torno.html:321` | ES | WhatsApp | WhatsApp per prenotare una lezione fuori calendario | alto | sostituire con calendario Mesana; per richieste speciali registrare prima il posto in Mesana |
| `clases/semanal-torno.html:378` | ES | clase suelta de torno | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-torno.html:378` | ES | clase semanal de modelado | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/semanal-torno.html:402` | ES | Contactar La Mesa por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `clases/suelta.html:234` | ES | ES | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/suelta.html:236` | ES | EN | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/suelta.html:238` | ES | CA | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/suelta.html:269` | ES | ES | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/suelta.html:270` | ES | EN | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/suelta.html:271` | ES | CA | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/suelta.html:350` | ES | WhatsApp | WhatsApp per prenotare una lezione fuori calendario | alto | sostituire con calendario Mesana; per richieste speciali registrare prima il posto in Mesana |
| `clases/suelta.html:399` | ES | Modelado | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/suelta.html:399` | ES | torno | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `clases/suelta.html:423` | ES | Contactar La Mesa por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/blog/index.html:293` | EN | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `en/blog/index.html:299` | EN | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/blog/index.html:308` | EN | Message us → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/blog/index.html:321` | EN | Contact La Mesa on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/clases/semanal-modelado.html:214` | EN | ES | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-modelado.html:216` | EN | EN | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-modelado.html:218` | EN | CA | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-modelado.html:234` | EN | ES | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-modelado.html:235` | EN | EN | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-modelado.html:236` | EN | CA | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-modelado.html:277` | EN | Not sure yet? Try a Drop-in Class first → | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-modelado.html:284` | EN | WhatsApp | WhatsApp per prenotare una lezione fuori calendario | alto | sostituire con calendario Mesana; per richieste speciali registrare prima il posto in Mesana |
| `en/clases/semanal-modelado.html:328` | EN | drop-in hand-building class | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-modelado.html:332` | EN | weekly wheel throwing class | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-modelado.html:350` | EN | Contact La Mesa on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/clases/semanal-torno.html:214` | EN | ES | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-torno.html:216` | EN | EN | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-torno.html:218` | EN | CA | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-torno.html:234` | EN | ES | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-torno.html:235` | EN | EN | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-torno.html:236` | EN | CA | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-torno.html:278` | EN | Not sure yet? Try a Drop-in Class first → | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-torno.html:285` | EN | WhatsApp | WhatsApp per prenotare una lezione fuori calendario | alto | sostituire con calendario Mesana; per richieste speciali registrare prima il posto in Mesana |
| `en/clases/semanal-torno.html:334` | EN | drop-in wheel class | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-torno.html:334` | EN | weekly hand-building class | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/semanal-torno.html:352` | EN | Contact La Mesa on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/clases/suelta.html:225` | EN | ES | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/suelta.html:227` | EN | EN | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/suelta.html:229` | EN | CA | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/suelta.html:245` | EN | ES | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/suelta.html:246` | EN | EN | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/suelta.html:247` | EN | CA | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/suelta.html:312` | EN | WhatsApp | WhatsApp per prenotare una lezione fuori calendario | alto | sostituire con calendario Mesana; per richieste speciali registrare prima il posto in Mesana |
| `en/clases/suelta.html:361` | EN | Hand-building | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/suelta.html:361` | EN | wheel throwing | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/clases/suelta.html:379` | EN | Contact La Mesa on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/custom-tableware.html:524` | EN | Tell us your idea on WhatsApp | WhatsApp per ordine di ceramiche | basso | lasciare: nessuna disponibilità di esperienze coinvolta |
| `en/custom-tableware.html:606` | EN | Message us on WhatsApp | WhatsApp per ordine di ceramiche | basso | lasciare: nessuna disponibilità di esperienze coinvolta |
| `en/custom-tableware.html:607` | EN | Send an email | Email per preventivo di ceramiche su misura | basso | lasciare: prodotto su ordinazione, non posto in classe |
| `en/custom-tableware.html:633` | EN | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `en/custom-tableware.html:639` | EN | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/custom-tableware.html:648` | EN | Message us → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/custom-tableware.html:662` | EN | Contact La Mesa on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/gracias.html:115` | EN | WhatsApp | WhatsApp dopo pagamento, assistenza | basso | lasciare: assistenza dopo la prenotazione |
| `en/gracias.html:134` | EN | Contact La Mesa on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/index.html:225` | EN | Book your class online → | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/index.html:234` | EN | Message us on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/index.html:321` | EN | Join the next class → | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/index.html:329` | EN | Drop-in Class → | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/index.html:352` | EN | Join the next class → | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/index.html:359` | EN | Drop-in Class → | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `en/index.html:375` | EN | get in touch | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/index.html:401` | EN | Message us for more info → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `en/index.html:481` | EN | Buy gift voucher → | WhatsApp per acquisto buono regalo | basso | lasciare se il buono non assegna una data; riscatto tramite Mesana |
| `en/index.html:494` | EN | Visit Etsy shop → | Negozio Etsy; vendita di oggetti, fuori da Mesana | basso | lasciare: non vende posti per esperienze |
| `en/index.html:560` | EN | Request a quote → | WhatsApp per preventivo/prenotazione di sessione privata | medio | lasciare per preventivo; bloccare il posto in Mesana prima della conferma |
| `en/index.html:639` | EN | Tell us what you do → | Email per proporre un laboratorio | basso | lasciare: proposta di collaborazione, non prenotazione |
| `en/index.html:679` | EN | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `en/index.html:698` | EN | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/index.html:717` | EN | Message us → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/index.html:775` | EN | Contact La Mesa on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/team-building.html:188` | EN | Book on WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `en/team-building.html:189` | EN | Write us an email | Email precompilata per team building | medio | lasciare solo per preventivi; inserire la data confermata in Mesana |
| `en/team-building.html:302` | EN | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `en/team-building.html:305` | EN | lamesa.lc@gmail.com | Email precompilata per team building | medio | lasciare solo per preventivi; inserire la data confermata in Mesana |
| `en/team-building.html:328` | EN | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `en/team-building.html:334` | EN | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/team-building.html:343` | EN | Message us → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `en/team-building.html:357` | EN | Contact La Mesa on WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `encargos.html:524` | ES | Cuéntanos tu idea por WhatsApp | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `encargos.html:606` | ES | Escribir por WhatsApp | WhatsApp per ordine di ceramiche | basso | lasciare: nessuna disponibilità di esperienze coinvolta |
| `encargos.html:607` | ES | Escribir por email | Email per preventivo di ceramiche su misura | basso | lasciare: prodotto su ordinazione, non posto in classe |
| `encargos.html:633` | ES | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `encargos.html:639` | ES | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `encargos.html:648` | ES | Escríbenos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `encargos.html:662` | ES | Contactar La Mesa por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `gracias.html:116` | ES | WhatsApp | WhatsApp dopo pagamento, assistenza | basso | lasciare: assistenza dopo la prenotazione |
| `gracias.html:135` | ES | Contactar La Mesa por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `index.html:225` | ES | Reserva tu clase online → | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `index.html:234` | ES | Escríbenos por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `index.html:321` | ES | Apúntate a la próxima clase → | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `index.html:329` | ES | Clase Suelta → | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `index.html:352` | ES | Apúntate a la próxima clase → | Pagina corso settimanale → La Mesa v2 → checkout Stripe tramite backend v2 | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `index.html:359` | ES | Clase Suelta → | Pagina classe singola → La Mesa v2 → app.lamesabcn.com/book.html?slot_id=… | alto | sostituire il percorso di prenotazione con il calendario Mesana |
| `index.html:375` | ES | escríbenos | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `index.html:401` | ES | Escríbenos para más información → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `index.html:481` | ES | Comprar vale-regalo → | WhatsApp per acquisto buono regalo | basso | lasciare se il buono non assegna una data; riscatto tramite Mesana |
| `index.html:494` | ES | Ver tienda en Etsy → | Negozio Etsy; vendita di oggetti, fuori da Mesana | basso | lasciare: non vende posti per esperienze |
| `index.html:560` | ES | Pedir presupuesto → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `index.html:639` | ES | Cuéntanos lo que haces → | Email per proporre un laboratorio | basso | lasciare: proposta di collaborazione, non prenotazione |
| `index.html:679` | ES | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `index.html:698` | ES | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `index.html:717` | ES | Escríbenos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `index.html:775` | ES | Contactar La Mesa por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `team-building.html:188` | ES | Reservar por WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `team-building.html:189` | ES | Escribir por email | Email precompilata per team building | medio | lasciare solo per preventivi; inserire la data confermata in Mesana |
| `team-building.html:302` | ES | WhatsApp → | WhatsApp per informazioni su lezioni/workshop, convertibile in prenotazione manuale | medio | lasciare come contatto; inviare il link Mesana per la prenotazione |
| `team-building.html:305` | ES | lamesa.lc@gmail.com | Email precompilata per team building | medio | lasciare solo per preventivi; inserire la data confermata in Mesana |
| `team-building.html:328` | ES | lamesa.lc@gmail.com | Email generica a lamesa.lc@gmail.com | basso | lasciare come contatto; prenotazioni di esperienze solo via Mesana |
| `team-building.html:334` | ES | WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `team-building.html:343` | ES | Escríbenos → | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |
| `team-building.html:357` | ES | Contactar La Mesa por WhatsApp | WhatsApp generico, può ricevere richieste di prenotazione | basso | lasciare come contatto; inviare il link Mesana per fissare la data |

## Pulsanti e moduli generati da JavaScript

| Origine | Lingue | Dove porta | Rischio | Proposta |
|---|---|---|---|---|
| `clases/suelta.html:318,333`; `en/clases/suelta.html:284,298`; `ca/clases/suelta.html:284,298` | ES/EN/CA | `js/booking-v2.js:171` → `app.lamesabcn.com/book.html?slot_id=…` | alto | sostituire con calendario Mesana |
| `clases/semanal-modelado.html:297`; `clases/semanal-torno.html:301`; `en/clases/semanal-modelado.html:267`; `en/clases/semanal-torno.html:268`; `ca/clases/semanal-modelado.html:264`; `ca/clases/semanal-torno.html:268` | ES/EN/CA | `js/booking-v2.js:356,389-400` → backend La Mesa v2 → pagamento Stripe | alto | sostituire con calendario Mesana |
| `js/booking-v2.js:14,28,50,72,151,242` | ES/EN/CA | WhatsApp precompilato quando non ci sono posti o il caricamento fallisce | alto | togliere la possibilità di prenotare manualmente; mostrare calendario Mesana o assistenza con registrazione in Mesana |

## Prova della ricerca

Comando eseguito dalla radice del sito (uscita 0):

```sh
rg -n -i 'wa\.me|mailto:|etsy\.com|<form|/clases/|booking-v2|checkout-semanal|BOOK_URL' -g '*.html' -g 'js/**' .
```

Output:

```text
./blog/ceramica-per-a-principiants-barcelona.html:220:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20Vull%20començar%20amb%20la%20ceràmica" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">WhatsApp &rarr;</a>
./blog/ceramica-per-a-principiants-barcelona.html:221:              <a class="btn btn--outline-dark" href="/ca/clases/semanal-modelado.html" aria-label="Veure el Taller Setmanal">Veure el Taller Setmanal</a>
./blog/ceramica-per-a-principiants-barcelona.html:247:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correu a La Mesa">lamesa.lc@gmail.com</a>
./blog/ceramica-per-a-principiants-barcelona.html:253:              <a href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20més%20informació%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./blog/ceramica-per-a-principiants-barcelona.html:262:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20saber%20més%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">Escriu-nos &rarr;</a>
./blog/ceramica-per-a-principiants-barcelona.html:276:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20saber%20més%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./encargos.html:244:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./encargos.html:524:            <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola%2C%20me%20gustar%C3%ADa%20encargar%20una%20pieza%20de%20cer%C3%A1mica.%20Mi%20idea%20es%3A%20" target="_blank" rel="noopener noreferrer">Cuéntanos tu idea por WhatsApp</a>
./encargos.html:606:          <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola%2C%20me%20interesa%20vuestra%20vajilla%20artesanal%20para%20mi%20restaurante.%20Restaurante%20y%20ciudad%3A%20" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a>
./encargos.html:607:          <a class="btn btn--secondary" href="mailto:lamesa.lc@gmail.com?subject=Presupuesto%20vajilla&amp;body=Restaurante%3A%0ACiudad%3A%0APiezas%20y%20cantidades%3A%0ACompra%20o%20alquiler%3A%0AFecha%20aproximada%3A%0A">Escribir por email</a>
./encargos.html:633:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correo a La Mesa">lamesa.lc@gmail.com</a>
./encargos.html:639:              <a href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar a La Mesa por WhatsApp">
./encargos.html:648:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">Escríbenos →</a>
./encargos.html:662:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20Me%20gustaría%20saber%20más%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">
./gracias.html:116:          <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20Acabo%20de%20reservar%20en%20La%20Mesa" target="_blank" rel="noopener noreferrer" style="gap:8px;">
./gracias.html:135:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">
./index.html:89:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./index.html:228:            href="/clases/suelta.html"
./index.html:236:            href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20La%20Mesa"
./index.html:323:                   href="/clases/semanal-modelado.html"
./index.html:331:                   href="/clases/suelta.html"
./index.html:353:                   href="/clases/semanal-torno.html"
./index.html:360:                   href="/clases/suelta.html"
./index.html:375:          o <a href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" style="color:var(--blue); text-decoration:underline;">escríbenos</a>.
./index.html:402:               href="https://wa.me/34711552030?text=Hola!%20Quiero%20saber%20m%C3%A1s%20sobre%20los%20pr%C3%B3ximos%20workshops%20de%20La%20Mesa"
./index.html:412:            <form class="newsletter-form newsletter-form--inline"
./index.html:483:            href="https://wa.me/34711552030?text=Hola!%20Me%20interesa%20comprar%20un%20vale-regalo%20de%20La%20Mesa.%20%C2%BFComo%20funciona%3F"
./index.html:496:            href="https://www.etsy.com/es/shop/LaMesaLC"
./index.html:562:            href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20organizar%20una%20sesi%C3%B3n%20privada%20en%20La%20Mesa.%20%C2%BFPod%C3%A9is%20hacerme%20un%20presupuesto%3F"
./index.html:641:            href="mailto:lamesa.lc@gmail.com?subject=Quiero%20dar%20un%20taller%20en%20La%20Mesa&body=Hola!%20Me%20llamo%20[nombre]%20y%20me%20gustar%C3%ADa%20proponer%20un%20taller."
./index.html:680:              href="mailto:lamesa.lc@gmail.com"
./index.html:699:                href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa"
./index.html:719:              href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa"
./index.html:738:          <form class="newsletter-form" action="https://lamesabcn.us1.list-manage.com/subscribe/post?u=e67dcaeb000f3ed6681a0ffc8&id=42df7f26b2&f_id=007fc3e1f0" method="post" id="newsletter-form-footer" target="_blank">
./index.html:777:    href="https://wa.me/34711552030?text=Hola!%20Me%20gustaría%20saber%20más%20sobre%20La%20Mesa"
./index.html:858:          "https://www.etsy.com/es/shop/LaMesaLC",
./index.html:967:          "https://www.etsy.com/es/shop/LaMesaLC",
./blog/que-esperar-primera-clase-ceramica.html:126:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./blog/que-esperar-primera-clase-ceramica.html:249:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20probar%20una%20clase%20de%20cer%C3%A1mica" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">WhatsApp →</a>
./blog/que-esperar-primera-clase-ceramica.html:250:              <a class="btn btn--outline-dark" href="/clases/suelta.html" aria-label="Reservar una Clase Suelta">Reservar una Clase Suelta</a>
./blog/que-esperar-primera-clase-ceramica.html:276:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correo a La Mesa">lamesa.lc@gmail.com</a>
./blog/que-esperar-primera-clase-ceramica.html:282:              <a href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar a La Mesa por WhatsApp">
./blog/que-esperar-primera-clase-ceramica.html:291:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">Escríbenos →</a>
./blog/que-esperar-primera-clase-ceramica.html:305:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20Me%20gustaría%20saber%20más%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">
./js/booking.js:11:    es: 'https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20La%20Mesa',
./js/booking.js:12:    en: 'https://wa.me/34711552030?text=Hi!%20I\'d%20like%20to%20know%20more%20about%20La%20Mesa',
./js/booking.js:13:    ca: 'https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa'
./ca/index.html:89:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./ca/index.html:228:            href="/ca/clases/suelta.html"
./ca/index.html:236:            href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa"
./ca/index.html:323:                   href="/ca/clases/semanal-modelado.html"
./ca/index.html:331:                   href="/ca/clases/suelta.html"
./ca/index.html:353:                   href="/ca/clases/semanal-torno.html"
./ca/index.html:360:                   href="/ca/clases/suelta.html"
./ca/index.html:375:          o <a href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" style="color:var(--blue); text-decoration:underline;">escriu-nos</a>.
./ca/index.html:402:               href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20els%20pròxims%20tallers%20de%20La%20Mesa"
./ca/index.html:412:            <form class="newsletter-form newsletter-form--inline"
./ca/index.html:483:            href="https://wa.me/34711552030?text=Hola!%20M%27interessa%20comprar%20un%20val%20de%20regal%20de%20La%20Mesa.%20Com%20funciona%3F"
./ca/index.html:496:            href="https://www.etsy.com/es/shop/LaMesaLC"
./ca/index.html:562:            href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20organitzar%20una%20sessi%C3%B3%20privada%20a%20La%20Mesa.%20Podeu%20fer-me%20un%20pressupost%3F"
./ca/index.html:641:            href="mailto:lamesa.lc@gmail.com?subject=Vull%20fer%20un%20taller%20a%20La%20Mesa"
./ca/index.html:680:              href="mailto:lamesa.lc@gmail.com"
./ca/index.html:699:                href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa"
./ca/index.html:719:              href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa"
./ca/index.html:738:          <form class="newsletter-form" action="https://lamesabcn.us1.list-manage.com/subscribe/post?u=e67dcaeb000f3ed6681a0ffc8&id=42df7f26b2&f_id=007fc3e1f0" method="post" id="newsletter-form-footer" target="_blank">
./ca/index.html:777:    href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa"
./ca/index.html:858:          "https://www.etsy.com/es/shop/LaMesaLC",
./ca/index.html:967:          "https://www.etsy.com/es/shop/LaMesaLC",
./ca/blog/index.html:72:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./ca/blog/index.html:278:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Envia un correu electrònic a La Mesa">lamesa.lc@gmail.com</a>
./ca/blog/index.html:284:              <a href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./ca/blog/index.html:293:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">Escriu-nos →</a>
./ca/blog/index.html:306:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./js/booking-v2.js:2: * booking-v2.js — La Mesa Booking Frontend (v2 gestionale).
./js/booking-v2.js:7: *     → pick date → form inline → POST /checkout-semanal → Stripe Checkout
./js/booking-v2.js:13:  var BOOK_URL = 'https://app.lamesabcn.com/book.html';
./js/booking-v2.js:14:  var WA_FALLBACK = 'https://wa.me/34711552030?text=Hola!%20Quiero%20reservar%20una%20clase%20en%20La%20Mesa';
./js/booking-v2.js:171:          window.location.href = BOOK_URL + '?slot_id=' + encodeURIComponent(s.id);
./js/booking-v2.js:223:        console.error('[booking-v2] suelta fetch failed:', e);
./js/booking-v2.js:389:          return fetch(API_BASE + '/bookings/checkout-semanal', {
./js/booking-v2.js:403:          console.error('[booking-v2] semanal checkout failed:', e);
./js/booking-v2.js:433:        console.error('[booking-v2] semanal fetch failed:', e);
./blog/pla-diferent-barcelona-ceramica.html:214:          <p>Si estàs buscant alguna cosa diferent per fer a Barcelona — alguna cosa que no sigui un altre sopar, un altre còctel, una altra activitat on mires més que fas — <a href="/ca/clases/suelta.html">vine a La Mesa</a>. Et taques les mans, rius, i t'emportes alguna cosa bonica a casa. Això és tot. I és molt.</p>
./blog/pla-diferent-barcelona-ceramica.html:220:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20organitzar%20una%20sessió%20privada" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp per a sessió privada">WhatsApp →</a>
./blog/pla-diferent-barcelona-ceramica.html:247:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correu a La Mesa">lamesa.lc@gmail.com</a>
./blog/pla-diferent-barcelona-ceramica.html:253:              <a href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20més%20informació%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./blog/pla-diferent-barcelona-ceramica.html:262:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20saber%20més%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">Escriu-nos →</a>
./blog/pla-diferent-barcelona-ceramica.html:276:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20saber%20més%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./blog/com-triar-taller-ceramica-barcelona.html:126:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./blog/com-triar-taller-ceramica-barcelona.html:247:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20provar%20una%20classe%20de%20cer%C3%A0mica" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">WhatsApp →</a>
./blog/com-triar-taller-ceramica-barcelona.html:248:              <a class="btn btn--outline-dark" href="/ca/clases/semanal-modelado.html" aria-label="Veure el Taller Setmanal">Veure el Taller Setmanal</a>
./blog/com-triar-taller-ceramica-barcelona.html:274:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correu a La Mesa">lamesa.lc@gmail.com</a>
./blog/com-triar-taller-ceramica-barcelona.html:280:              <a href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20m%C3%A9s%20informaci%C3%B3%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./blog/com-triar-taller-ceramica-barcelona.html:289:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20m%C3%A9s%20informaci%C3%B3%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">Escriu-nos →</a>
./blog/com-triar-taller-ceramica-barcelona.html:303:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./ca/team-building.html:120:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./ca/team-building.html:188:            <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20M%27interessa%20un%20team%20building%20de%20cer%C3%A0mica" target="_blank" rel="noopener noreferrer" aria-label="Reservar team building per WhatsApp">Reserva per WhatsApp →</a>
./ca/team-building.html:189:            <a class="btn btn--outline-dark" href="mailto:lamesa.lc@gmail.com?subject=Team%20Building%20de%20Cer%C3%A0mica" aria-label="Reservar team building per correu">Escriu-nos un correu</a>
./ca/team-building.html:302:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20M%27interessa%20un%20team%20building%20de%20cer%C3%A0mica" target="_blank" rel="noopener noreferrer" aria-label="Reservar team building per WhatsApp">
./ca/team-building.html:305:            <a class="btn btn--secondary" href="mailto:lamesa.lc@gmail.com?subject=Team%20Building%20de%20Cer%C3%A0mica" aria-label="Reservar team building per correu">lamesa.lc@gmail.com</a>
./ca/team-building.html:328:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Envia un correu electrònic a La Mesa">lamesa.lc@gmail.com</a>
./ca/team-building.html:334:              <a href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20m%C3%A9s%20informaci%C3%B3%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./ca/team-building.html:343:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20m%C3%A9s%20informaci%C3%B3%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">Escriu-nos →</a>
./ca/team-building.html:357:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./404.html:85:      <a href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20La%20Mesa"
./blog/pottery-class-prices-barcelona.html:126:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./blog/pottery-class-prices-barcelona.html:308:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20pottery%20class%20prices" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">WhatsApp →</a>
./blog/pottery-class-prices-barcelona.html:309:              <a class="btn btn--outline-dark" href="/en/clases/semanal-modelado.html" aria-label="See the Weekly Class">See the Weekly Class</a>
./blog/pottery-class-prices-barcelona.html:335:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Email La Mesa">lamesa.lc@gmail.com</a>
./blog/pottery-class-prices-barcelona.html:341:              <a href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20info%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./blog/pottery-class-prices-barcelona.html:350:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20info%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">Write to us →</a>
./blog/pottery-class-prices-barcelona.html:364:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./ca/clases/semanal-torno.html:9:  <link rel="canonical" href="https://lamesabcn.com/ca/clases/semanal-torno.html">
./ca/clases/semanal-torno.html:15:  <meta property="og:url" content="https://lamesabcn.com/ca/clases/semanal-torno.html">
./ca/clases/semanal-torno.html:21:  <link rel="alternate" hreflang="es" href="https://lamesabcn.com/clases/semanal-torno.html">
./ca/clases/semanal-torno.html:22:  <link rel="alternate" hreflang="en" href="https://lamesabcn.com/en/clases/semanal-torno.html">
./ca/clases/semanal-torno.html:23:  <link rel="alternate" hreflang="ca" href="https://lamesabcn.com/ca/clases/semanal-torno.html">
./ca/clases/semanal-torno.html:24:  <link rel="alternate" hreflang="x-default" href="https://lamesabcn.com/clases/semanal-torno.html">
./ca/clases/semanal-torno.html:132:        "item": "https://lamesabcn.com/ca/clases/semanal-torno.html"
./ca/clases/semanal-torno.html:214:          <a href="/clases/semanal-torno.html" lang="es">ES</a>
./ca/clases/semanal-torno.html:216:          <a href="/en/clases/semanal-torno.html" lang="en">EN</a>
./ca/clases/semanal-torno.html:218:          <a href="/ca/clases/semanal-torno.html" class="active" aria-current="page" lang="ca">CA</a>
./ca/clases/semanal-torno.html:234:        <a href="/clases/semanal-torno.html" lang="es">ES</a>
./ca/clases/semanal-torno.html:235:        <a href="/en/clases/semanal-torno.html" lang="en">EN</a>
./ca/clases/semanal-torno.html:236:        <a href="/ca/clases/semanal-torno.html" class="active" aria-current="page" lang="ca">CA</a>
./ca/clases/semanal-torno.html:278:        <a href="/ca/clases/suelta.html" style="color:var(--yellow);">No estàs segur? Prova primer una Classe Suelta →</a>
./ca/clases/semanal-torno.html:285:        <a class="turno-nota__wa" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20reservar%20una%20classe%20setmanal%20de%20torn%20per%C3%B2%20cap%20dels%20torns%20disponibles%20em%20va%20b%C3%A9." target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./ca/clases/semanal-torno.html:334:            <p class="faq__answer">Sí, amb una <a href="/ca/clases/suelta.html">classe solta de torn</a>: classe particular de 2 hores per 65&nbsp;€. Si prefereixes treballar a mà, mira la <a href="/ca/clases/semanal-modelado.html">classe setmanal de modelat</a> (120&nbsp;€/mes).</p>
./ca/clases/semanal-torno.html:352:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./ca/clases/semanal-torno.html:357:  <script src="../../js/booking-v2.js?v=2" data-cookieconsent="ignore" defer></script>
./en/privacy.html:41:    Email: <a href="mailto:lamesa.lc@gmail.com">lamesa.lc@gmail.com</a></p>
./en/privacy.html:53:    <p>We keep your email for as long as your subscription is active. You can unsubscribe at any time by writing to us at <a href="mailto:lamesa.lc@gmail.com">lamesa.lc@gmail.com</a>.</p>
./en/privacy.html:59:    <p>You have the right to access, rectify, erase and object to the processing of your data. Write to us at <a href="mailto:lamesa.lc@gmail.com">lamesa.lc@gmail.com</a>.</p>
./ca/clases/suelta.html:9:  <link rel="canonical" href="https://lamesabcn.com/ca/clases/suelta.html">
./ca/clases/suelta.html:15:  <meta property="og:url" content="https://lamesabcn.com/ca/clases/suelta.html">
./ca/clases/suelta.html:21:  <link rel="alternate" hreflang="es" href="https://lamesabcn.com/clases/suelta.html">
./ca/clases/suelta.html:22:  <link rel="alternate" hreflang="en" href="https://lamesabcn.com/en/clases/suelta.html">
./ca/clases/suelta.html:23:  <link rel="alternate" hreflang="ca" href="https://lamesabcn.com/ca/clases/suelta.html">
./ca/clases/suelta.html:24:  <link rel="alternate" hreflang="x-default" href="https://lamesabcn.com/clases/suelta.html">
./ca/clases/suelta.html:131:        "item": "https://lamesabcn.com/ca/clases/suelta.html"
./ca/clases/suelta.html:197:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./ca/clases/suelta.html:225:          <a href="/clases/suelta.html" lang="es">ES</a>
./ca/clases/suelta.html:227:          <a href="/en/clases/suelta.html" lang="en">EN</a>
./ca/clases/suelta.html:229:          <a href="/ca/clases/suelta.html" class="active" aria-current="page" lang="ca">CA</a>
./ca/clases/suelta.html:245:        <a href="/clases/suelta.html" lang="es">ES</a>
./ca/clases/suelta.html:246:        <a href="/en/clases/suelta.html" lang="en">EN</a>
./ca/clases/suelta.html:247:        <a href="/ca/clases/suelta.html" class="active" aria-current="page" lang="ca">CA</a>
./ca/clases/suelta.html:312:        <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20Vull%20reservar%20una%20classe%20solta%20a%20una%20altra%20hora" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp" style="gap:8px;">
./ca/clases/suelta.html:361:            <p class="faq__answer">Tens el taller setmanal: 4 classes de 2 hores, sempre el mateix dia i hora. <a href="/ca/clases/semanal-modelado.html">Modelat</a> 120&nbsp;€/mes i <a href="/ca/clases/semanal-torno.html">torn</a> 160&nbsp;€/mes.</p>
./ca/clases/suelta.html:379:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./ca/clases/suelta.html:384:  <script src="../../js/booking-v2.js?v=2" data-cookieconsent="ignore" defer></script>
./ca/privacy.html:41:    Email: <a href="mailto:lamesa.lc@gmail.com">lamesa.lc@gmail.com</a></p>
./ca/privacy.html:53:    <p>Conservem el teu correu mentre mantinguis la subscripció activa. Pots donar-te de baixa en qualsevol moment escrivint-nos a <a href="mailto:lamesa.lc@gmail.com">lamesa.lc@gmail.com</a>.</p>
./ca/privacy.html:59:    <p>Tens dret a accedir, rectificar, suprimir i oposar-te al tractament de les teves dades. Escriu-nos a <a href="mailto:lamesa.lc@gmail.com">lamesa.lc@gmail.com</a>.</p>
./blog/what-to-expect-first-pottery-class.html:210:          <p>You can. We have weekly classes — a fixed session once a week, two hours, 120 euros per month — where you progress at your own pace within a regular group. We also have <a href="/en/clases/suelta.html">drop-in sessions</a> if you prefer something more flexible, and wheel-throwing options if you are curious about the potter's wheel. You can explore all our <a href="/blog/ceramics-classes-barcelona-guide.html">ceramics class options in this guide</a>.</p>
./blog/what-to-expect-first-pottery-class.html:218:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20try%20a%20pottery%20class" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">WhatsApp →</a>
./blog/what-to-expect-first-pottery-class.html:219:              <a class="btn btn--outline-dark" href="/en/clases/suelta.html" aria-label="Book a Drop-in Class">Book a Drop-in Class</a>
./blog/what-to-expect-first-pottery-class.html:245:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Send email to La Mesa">lamesa.lc@gmail.com</a>
./blog/what-to-expect-first-pottery-class.html:251:              <a href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20information%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./blog/what-to-expect-first-pottery-class.html:260:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20information%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">Write to us →</a>
./blog/what-to-expect-first-pottery-class.html:273:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./ca/encarrecs.html:244:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./ca/encarrecs.html:524:            <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola%2C%20m%27agradaria%20encarregar%20una%20pe%C3%A7a%20de%20cer%C3%A0mica.%20La%20meva%20idea%20%C3%A9s%3A%20" target="_blank" rel="noopener noreferrer">Explica'ns la teva idea per WhatsApp</a>
./ca/encarrecs.html:606:          <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola%2C%20m%27interessa%20la%20vostra%20vaixella%20artesanal%20per%20al%20meu%20restaurant.%20Restaurant%20i%20ciutat%3A%20" target="_blank" rel="noopener noreferrer">Escriure per WhatsApp</a>
./ca/encarrecs.html:607:          <a class="btn btn--secondary" href="mailto:lamesa.lc@gmail.com?subject=Pressupost%20vaixella&amp;body=Restaurant%3A%0ACiutat%3A%0APeces%20i%20quantitats%3A%0ACompra%20o%20lloguer%3A%0AData%20aproximada%3A%0A">Escriure per email</a>
./ca/encarrecs.html:633:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Envia un correu electrònic a La Mesa">lamesa.lc@gmail.com</a>
./ca/encarrecs.html:639:              <a href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20m%C3%A9s%20informaci%C3%B3%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./ca/encarrecs.html:648:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20m%C3%A9s%20informaci%C3%B3%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">Escriu-nos →</a>
./ca/encarrecs.html:662:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./privacy.html:41:    Email: <a href="mailto:lamesa.lc@gmail.com">lamesa.lc@gmail.com</a></p>
./privacy.html:53:    <p>Conservamos tu email mientras mantengas la suscripción activa. Puedes darte de baja en cualquier momento escribiéndonos a <a href="mailto:lamesa.lc@gmail.com">lamesa.lc@gmail.com</a>.</p>
./privacy.html:59:    <p>Tienes derecho a acceder, rectificar, suprimir y oponerte al tratamiento de tus datos. Escríbenos a <a href="mailto:lamesa.lc@gmail.com">lamesa.lc@gmail.com</a>.</p>
./blog/que-esperar-primera-classe-ceramica.html:212:          <p>Pots. Tenim el <a href="/blog/guia-tallers-ceramica-barcelona.html">Taller Setmanal</a> &mdash; una classe fixa a la setmana, 2 hores, 120 euros al mes &mdash; on vas avan&ccedil;ant al teu ritme amb un grup fix. Tamb&eacute; tenim <a href="/ca/clases/suelta.html">classes soltes</a> si prefereixes alguna cosa m&eacute;s flexible, i opcions de torn si et pica la curiositat.</p>
./blog/que-esperar-primera-classe-ceramica.html:218:          <p>Aix&iacute; que si encara tens dubtes, deixa'ls aqu&iacute;. Escriu-nos, pregunta'ns el que vulguis, i vine a provar. T'esperem a la <a href="/ca/clases/suelta.html">Barceloneta</a>.</p>
./blog/que-esperar-primera-classe-ceramica.html:224:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20provar%20una%20classe%20de%20cer%C3%A0mica" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">WhatsApp &rarr;</a>
./blog/que-esperar-primera-classe-ceramica.html:225:              <a class="btn btn--outline-dark" href="/ca/clases/suelta.html" aria-label="Reservar una Classe Solta">Reservar una Classe Solta</a>
./blog/que-esperar-primera-classe-ceramica.html:251:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correu a La Mesa">lamesa.lc@gmail.com</a>
./blog/que-esperar-primera-classe-ceramica.html:257:              <a href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20m%C3%A9s%20informaci%C3%B3%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./blog/que-esperar-primera-classe-ceramica.html:266:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20m%C3%A9s%20informaci%C3%B3%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">Escriu-nos &rarr;</a>
./blog/que-esperar-primera-classe-ceramica.html:280:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./blog/index.html:72:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./blog/index.html:293:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correo a La Mesa">lamesa.lc@gmail.com</a>
./blog/index.html:299:              <a href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar a La Mesa por WhatsApp">
./blog/index.html:308:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">Escríbenos →</a>
./blog/index.html:321:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20Me%20gustaría%20saber%20más%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">
./blog/preu-classe-ceramica-barcelona.html:126:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./blog/preu-classe-ceramica-barcelona.html:308:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20saber%20preus%20de%20les%20classes%20de%20cer%C3%A0mica" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">WhatsApp →</a>
./blog/preu-classe-ceramica-barcelona.html:309:              <a class="btn btn--outline-dark" href="/ca/clases/semanal-modelado.html" aria-label="Veure el Taller Setmanal">Veure el Taller Setmanal</a>
./blog/preu-classe-ceramica-barcelona.html:335:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correu a La Mesa">lamesa.lc@gmail.com</a>
./blog/preu-classe-ceramica-barcelona.html:341:              <a href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20m%C3%A9s%20informaci%C3%B3%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./blog/preu-classe-ceramica-barcelona.html:350:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20m%C3%A9s%20informaci%C3%B3%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">Escriu-nos →</a>
./blog/preu-classe-ceramica-barcelona.html:364:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./en/gracias.html:115:          <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hi!%20I%20just%20booked%20at%20La%20Mesa" target="_blank" rel="noopener noreferrer" style="gap:8px;">
./en/gracias.html:134:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./ca/clases/semanal-modelado.html:9:  <link rel="canonical" href="https://lamesabcn.com/ca/clases/semanal-modelado.html">
./ca/clases/semanal-modelado.html:15:  <meta property="og:url" content="https://lamesabcn.com/ca/clases/semanal-modelado.html">
./ca/clases/semanal-modelado.html:21:  <link rel="alternate" hreflang="es" href="https://lamesabcn.com/clases/semanal-modelado.html">
./ca/clases/semanal-modelado.html:22:  <link rel="alternate" hreflang="en" href="https://lamesabcn.com/en/clases/semanal-modelado.html">
./ca/clases/semanal-modelado.html:23:  <link rel="alternate" hreflang="ca" href="https://lamesabcn.com/ca/clases/semanal-modelado.html">
./ca/clases/semanal-modelado.html:24:  <link rel="alternate" hreflang="x-default" href="https://lamesabcn.com/clases/semanal-modelado.html">
./ca/clases/semanal-modelado.html:129:        "item": "https://lamesabcn.com/ca/clases/semanal-modelado.html"
./ca/clases/semanal-modelado.html:211:          <a href="/clases/semanal-modelado.html" lang="es">ES</a>
./ca/clases/semanal-modelado.html:213:          <a href="/en/clases/semanal-modelado.html" lang="en">EN</a>
./ca/clases/semanal-modelado.html:215:          <a href="/ca/clases/semanal-modelado.html" class="active" aria-current="page" lang="ca">CA</a>
./ca/clases/semanal-modelado.html:231:        <a href="/clases/semanal-modelado.html" lang="es">ES</a>
./ca/clases/semanal-modelado.html:232:        <a href="/en/clases/semanal-modelado.html" lang="en">EN</a>
./ca/clases/semanal-modelado.html:233:        <a href="/ca/clases/semanal-modelado.html" class="active" aria-current="page" lang="ca">CA</a>
./ca/clases/semanal-modelado.html:274:        <a href="/ca/clases/suelta.html" style="color:var(--blue);">No estàs segur? Prova primer una Classe Suelta →</a>
./ca/clases/semanal-modelado.html:281:        <a class="turno-nota__wa" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20reservar%20una%20classe%20setmanal%20de%20modelat%20per%C3%B2%20cap%20dels%20torns%20disponibles%20em%20va%20b%C3%A9." target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./ca/clases/semanal-modelado.html:325:            <p class="faq__answer">Sí, amb una <a href="/ca/clases/suelta.html">classe solta de modelat</a>: 2 hores per 45&nbsp;€.</p>
./ca/clases/semanal-modelado.html:329:            <p class="faq__answer">Sí: la <a href="/ca/clases/semanal-torno.html">classe setmanal de torn</a> costa 160&nbsp;€/mes, amb màxim 2 persones per torn.</p>
./ca/clases/semanal-modelado.html:347:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./ca/clases/semanal-modelado.html:352:  <script src="../../js/booking-v2.js?v=2" data-cookieconsent="ignore" defer></script>
./blog/how-to-choose-pottery-class-barcelona.html:126:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./blog/how-to-choose-pottery-class-barcelona.html:247:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20try%20a%20pottery%20class" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">WhatsApp →</a>
./blog/how-to-choose-pottery-class-barcelona.html:248:              <a class="btn btn--outline-dark" href="/en/clases/semanal-modelado.html" aria-label="See the Weekly Class">See the Weekly Class</a>
./blog/how-to-choose-pottery-class-barcelona.html:274:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Email La Mesa">lamesa.lc@gmail.com</a>
./blog/how-to-choose-pottery-class-barcelona.html:280:              <a href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20info%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./blog/how-to-choose-pottery-class-barcelona.html:289:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20info%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">Write to us →</a>
./blog/how-to-choose-pottery-class-barcelona.html:303:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./blog/pottery-for-beginners-barcelona.html:222:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20start%20pottery" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">WhatsApp &rarr;</a>
./blog/pottery-for-beginners-barcelona.html:223:              <a class="btn btn--outline-dark" href="/en/clases/semanal-modelado.html" aria-label="See the Weekly Class">See the Weekly Class</a>
./blog/pottery-for-beginners-barcelona.html:249:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Email La Mesa">lamesa.lc@gmail.com</a>
./blog/pottery-for-beginners-barcelona.html:255:              <a href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20information%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./blog/pottery-for-beginners-barcelona.html:264:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">Write to us &rarr;</a>
./blog/pottery-for-beginners-barcelona.html:278:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./blog/unique-date-ideas-barcelona-pottery.html:192:          <p>At <a href="/en/clases/suelta.html">La Mesa</a>, sessions last two hours. You show up at the studio on Carrer de l'Atlantida in Barceloneta — five minutes from the beach — and we set you up at the table. We start with a quick intro to the basics: how to prepare the clay, what techniques you can use, what kinds of pieces you can make. No experience needed, no artistic skill required. We guide you through the whole thing.</p>
./blog/unique-date-ideas-barcelona-pottery.html:222:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20organise%20a%20private%20session" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp for a private session">WhatsApp →</a>
./blog/unique-date-ideas-barcelona-pottery.html:249:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Send an email to La Mesa">lamesa.lc@gmail.com</a>
./blog/unique-date-ideas-barcelona-pottery.html:255:              <a href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20information%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./blog/unique-date-ideas-barcelona-pottery.html:264:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">Write to us →</a>
./blog/unique-date-ideas-barcelona-pottery.html:278:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./blog/plan-diferente-barcelona-ceramica.html:214:          <p>Si estás buscando algo diferente que hacer en Barcelona — algo que no sea otra cena, otro cóctel, otra actividad donde miras más que haces — <a href="/clases/suelta.html">ven a La Mesa</a>. Te manchas las manos, te ríes, y te llevas algo bonito a casa. Eso es todo. Y es mucho.</p>
./blog/plan-diferente-barcelona-ceramica.html:220:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20Me%20gustaría%20organizar%20una%20sesión%20privada" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp para sesión privada">WhatsApp →</a>
./blog/plan-diferente-barcelona-ceramica.html:247:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correo a La Mesa">lamesa.lc@gmail.com</a>
./blog/plan-diferente-barcelona-ceramica.html:253:              <a href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar a La Mesa por WhatsApp">
./blog/plan-diferente-barcelona-ceramica.html:262:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">Escríbenos →</a>
./blog/plan-diferente-barcelona-ceramica.html:276:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20Me%20gustaría%20saber%20más%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">
./blog/ceramica-para-principiantes-barcelona.html:220:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20Quiero%20empezar%20con%20la%20cerámica" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">WhatsApp &rarr;</a>
./blog/ceramica-para-principiantes-barcelona.html:221:              <a class="btn btn--outline-dark" href="/clases/semanal-modelado.html" aria-label="Ver el Taller Semanal">Ver el Taller Semanal</a>
./blog/ceramica-para-principiantes-barcelona.html:247:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correo a La Mesa">lamesa.lc@gmail.com</a>
./blog/ceramica-para-principiantes-barcelona.html:253:              <a href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar a La Mesa por WhatsApp">
./blog/ceramica-para-principiantes-barcelona.html:262:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">Escríbenos &rarr;</a>
./blog/ceramica-para-principiantes-barcelona.html:276:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20Me%20gustaría%20saber%20más%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">
./blog/guia-tallers-ceramica-barcelona.html:192:          <p>Si el teu horari no et permet comprometre't amb un dia fix, la <a href="/ca/clases/suelta.html">classe solta</a> es la teva millor opcio. Reserves quan et va be, vens un minim de dues hores i treballes en el que vulguis. Es ideal per provar la ceramica per primera vegada, per regalar una experiencia diferent o per complementar el que ja fas en un altre lloc.</p>
./blog/guia-tallers-ceramica-barcelona.html:220:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20info%20sobre%20els%20tallers" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">WhatsApp →</a>
./blog/guia-tallers-ceramica-barcelona.html:221:              <a class="btn btn--outline-dark" href="/ca/clases/semanal-modelado.html" aria-label="Veure el Taller Setmanal">Veure el Taller Setmanal</a>
./blog/guia-tallers-ceramica-barcelona.html:247:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correu a La Mesa">lamesa.lc@gmail.com</a>
./blog/guia-tallers-ceramica-barcelona.html:253:              <a href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20més%20informació%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./blog/guia-tallers-ceramica-barcelona.html:262:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20més%20informació%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">Escriu-nos →</a>
./blog/guia-tallers-ceramica-barcelona.html:275:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20saber%20més%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./blog/guia-talleres-ceramica-barcelona.html:192:          <p>Si tu horario no te permite comprometerte con un día fijo, la <a href="/clases/suelta.html">clase suelta</a> es tu mejor opción. Reservas cuando te va bien, vienes un mínimo de dos horas y trabajas en lo que quieras. Es ideal para probar la cerámica por primera vez, para regalar una experiencia diferente o para complementar lo que ya haces en otro sitio.</p>
./blog/guia-talleres-ceramica-barcelona.html:220:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20Me%20gustaría%20info%20sobre%20los%20talleres" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">WhatsApp →</a>
./blog/guia-talleres-ceramica-barcelona.html:221:              <a class="btn btn--outline-dark" href="/clases/semanal-modelado.html" aria-label="Ver el Taller Semanal">Ver el Taller Semanal</a>
./blog/guia-talleres-ceramica-barcelona.html:247:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correo a La Mesa">lamesa.lc@gmail.com</a>
./blog/guia-talleres-ceramica-barcelona.html:253:              <a href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar a La Mesa por WhatsApp">
./blog/guia-talleres-ceramica-barcelona.html:262:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">Escríbenos →</a>
./blog/guia-talleres-ceramica-barcelona.html:276:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20Me%20gustaría%20saber%20más%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">
./en/custom-tableware.html:244:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./en/custom-tableware.html:524:            <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hello%2C%20I%27d%20like%20to%20order%20a%20custom%20ceramic%20piece.%20My%20idea%20is%3A%20" target="_blank" rel="noopener noreferrer">Tell us your idea on WhatsApp</a>
./en/custom-tableware.html:606:          <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hello%2C%20I%27m%20interested%20in%20your%20handmade%20tableware%20for%20my%20restaurant.%20Restaurant%20and%20city%3A%20" target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>
./en/custom-tableware.html:607:          <a class="btn btn--secondary" href="mailto:lamesa.lc@gmail.com?subject=Tableware%20quote&amp;body=Restaurant%3A%0ACity%3A%0APieces%20and%20quantities%3A%0ABuy%20or%20rent%3A%0AApproximate%20date%3A%0A">Send an email</a>
./en/custom-tableware.html:633:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Send an email to La Mesa">lamesa.lc@gmail.com</a>
./en/custom-tableware.html:639:              <a href="https://wa.me/34711552030?text=Hi!%20I%27d%20like%20more%20information%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./en/custom-tableware.html:648:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hi!%20I%27d%20like%20more%20information%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">Message us →</a>
./en/custom-tableware.html:662:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hi!%20I%27d%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./en/clases/suelta.html:9:  <link rel="canonical" href="https://lamesabcn.com/en/clases/suelta.html">
./en/clases/suelta.html:15:  <meta property="og:url" content="https://lamesabcn.com/en/clases/suelta.html">
./en/clases/suelta.html:21:  <link rel="alternate" hreflang="es" href="https://lamesabcn.com/clases/suelta.html">
./en/clases/suelta.html:22:  <link rel="alternate" hreflang="en" href="https://lamesabcn.com/en/clases/suelta.html">
./en/clases/suelta.html:23:  <link rel="alternate" hreflang="ca" href="https://lamesabcn.com/ca/clases/suelta.html">
./en/clases/suelta.html:24:  <link rel="alternate" hreflang="x-default" href="https://lamesabcn.com/clases/suelta.html">
./en/clases/suelta.html:131:        "item": "https://lamesabcn.com/en/clases/suelta.html"
./en/clases/suelta.html:197:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./en/clases/suelta.html:225:          <a href="/clases/suelta.html" lang="es">ES</a>
./en/clases/suelta.html:227:          <a href="/en/clases/suelta.html" class="active" aria-current="page" lang="en">EN</a>
./en/clases/suelta.html:229:          <a href="/ca/clases/suelta.html" lang="ca">CA</a>
./en/clases/suelta.html:245:        <a href="/clases/suelta.html" lang="es">ES</a>
./en/clases/suelta.html:246:        <a href="/en/clases/suelta.html" class="active" aria-current="page" lang="en">EN</a>
./en/clases/suelta.html:247:        <a href="/ca/clases/suelta.html" lang="ca">CA</a>
./en/clases/suelta.html:312:        <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hi!%20I%27d%20like%20to%20book%20a%20drop-in%20class%20at%20another%20time" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp" style="gap:8px;">
./en/clases/suelta.html:361:            <p class="faq__answer">There is the weekly class: 4 sessions of 2 hours, always the same day and time. <a href="/en/clases/semanal-modelado.html">Hand-building</a> €120/month and <a href="/en/clases/semanal-torno.html">wheel throwing</a> €160/month.</p>
./en/clases/suelta.html:379:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./en/clases/suelta.html:384:  <script src="../../js/booking-v2.js?v=2" data-cookieconsent="ignore" defer></script>
./en/index.html:89:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./en/index.html:228:            href="/en/clases/suelta.html"
./en/index.html:236:            href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa"
./en/index.html:323:                   href="/en/clases/semanal-modelado.html"
./en/index.html:331:                   href="/en/clases/suelta.html"
./en/index.html:353:                   href="/en/clases/semanal-torno.html"
./en/index.html:360:                   href="/en/clases/suelta.html"
./en/index.html:375:          or <a href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" style="color:var(--blue); text-decoration:underline;">get in touch</a>.
./en/index.html:402:               href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20upcoming%20workshops%20at%20La%20Mesa"
./en/index.html:412:            <form class="newsletter-form newsletter-form--inline"
./en/index.html:483:            href="https://wa.me/34711552030?text=Hi!%20I'm%20interested%20in%20buying%20a%20La%20Mesa%20gift%20voucher.%20How%20does%20it%20work%3F"
./en/index.html:496:            href="https://www.etsy.com/es/shop/LaMesaLC"
./en/index.html:562:            href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20organise%20a%20private%20session%20at%20La%20Mesa.%20Can%20you%20send%20me%20a%20quote%3F"
./en/index.html:641:            href="mailto:lamesa.lc@gmail.com?subject=I'd%20like%20to%20run%20a%20workshop%20at%20La%20Mesa"
./en/index.html:680:              href="mailto:lamesa.lc@gmail.com"
./en/index.html:699:                href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20information%20about%20La%20Mesa"
./en/index.html:719:              href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20information%20about%20La%20Mesa"
./en/index.html:738:          <form class="newsletter-form" action="https://lamesabcn.us1.list-manage.com/subscribe/post?u=e67dcaeb000f3ed6681a0ffc8&id=42df7f26b2&f_id=007fc3e1f0" method="post" id="newsletter-form-footer" target="_blank">
./en/index.html:777:    href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa"
./en/index.html:858:          "https://www.etsy.com/es/shop/LaMesaLC",
./en/index.html:967:          "https://www.etsy.com/es/shop/LaMesaLC",
./en/clases/semanal-torno.html:9:  <link rel="canonical" href="https://lamesabcn.com/en/clases/semanal-torno.html">
./en/clases/semanal-torno.html:15:  <meta property="og:url" content="https://lamesabcn.com/en/clases/semanal-torno.html">
./en/clases/semanal-torno.html:21:  <link rel="alternate" hreflang="es" href="https://lamesabcn.com/clases/semanal-torno.html">
./en/clases/semanal-torno.html:22:  <link rel="alternate" hreflang="en" href="https://lamesabcn.com/en/clases/semanal-torno.html">
./en/clases/semanal-torno.html:23:  <link rel="alternate" hreflang="ca" href="https://lamesabcn.com/ca/clases/semanal-torno.html">
./en/clases/semanal-torno.html:24:  <link rel="alternate" hreflang="x-default" href="https://lamesabcn.com/clases/semanal-torno.html">
./en/clases/semanal-torno.html:132:        "item": "https://lamesabcn.com/en/clases/semanal-torno.html"
./en/clases/semanal-torno.html:214:          <a href="/clases/semanal-torno.html" lang="es">ES</a>
./en/clases/semanal-torno.html:216:          <a href="/en/clases/semanal-torno.html" class="active" aria-current="page" lang="en">EN</a>
./en/clases/semanal-torno.html:218:          <a href="/ca/clases/semanal-torno.html" lang="ca">CA</a>
./en/clases/semanal-torno.html:234:        <a href="/clases/semanal-torno.html" lang="es">ES</a>
./en/clases/semanal-torno.html:235:        <a href="/en/clases/semanal-torno.html" class="active" aria-current="page" lang="en">EN</a>
./en/clases/semanal-torno.html:236:        <a href="/ca/clases/semanal-torno.html" lang="ca">CA</a>
./en/clases/semanal-torno.html:278:        <a href="/en/clases/suelta.html" style="color:var(--yellow);">Not sure yet? Try a Drop-in Class first →</a>
./en/clases/semanal-torno.html:285:        <a class="turno-nota__wa" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20book%20a%20weekly%20wheel%20throwing%20class%20but%20none%20of%20the%20available%20slots%20work%20for%20me." target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./en/clases/semanal-torno.html:334:            <p class="faq__answer">Yes, with a <a href="/en/clases/suelta.html">drop-in wheel class</a>: a 2-hour private class for €65. If you prefer working by hand, see the <a href="/en/clases/semanal-modelado.html">weekly hand-building class</a> (€120/month).</p>
./en/clases/semanal-torno.html:352:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./en/clases/semanal-torno.html:357:  <script src="../../js/booking-v2.js?v=2" data-cookieconsent="ignore" defer></script>
./blog/ceramics-classes-barcelona-guide.html:192:          <p>If your schedule does not allow you to commit to a fixed day, a <a href="/en/clases/suelta.html">drop-in session</a> is the way to go. You book when it works for you, come in for a minimum of two hours, and work on whatever you like. It is perfect for trying pottery for the first time, for a gift experience, or simply for fitting ceramics into a busy week.</p>
./blog/ceramics-classes-barcelona-guide.html:220:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20info%20about%20your%20ceramics%20classes" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">WhatsApp →</a>
./blog/ceramics-classes-barcelona-guide.html:221:              <a class="btn btn--outline-dark" href="/en/clases/semanal-modelado.html" aria-label="See the Weekly Class">See the Weekly Class</a>
./blog/ceramics-classes-barcelona-guide.html:247:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Send email to La Mesa">lamesa.lc@gmail.com</a>
./blog/ceramics-classes-barcelona-guide.html:253:              <a href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20information%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./blog/ceramics-classes-barcelona-guide.html:262:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20information%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">Write to us →</a>
./blog/ceramics-classes-barcelona-guide.html:275:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./en/blog/index.html:72:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./en/blog/index.html:293:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Send an email to La Mesa">lamesa.lc@gmail.com</a>
./en/blog/index.html:299:              <a href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20information%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./en/blog/index.html:308:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20information%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">Message us →</a>
./en/blog/index.html:321:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./blog/como-elegir-taller-ceramica-barcelona.html:126:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./blog/como-elegir-taller-ceramica-barcelona.html:247:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20probar%20una%20clase%20de%20cer%C3%A1mica" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">WhatsApp →</a>
./blog/como-elegir-taller-ceramica-barcelona.html:248:              <a class="btn btn--outline-dark" href="/clases/semanal-modelado.html" aria-label="Ver el Taller Semanal">Ver el Taller Semanal</a>
./blog/como-elegir-taller-ceramica-barcelona.html:274:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correo a La Mesa">lamesa.lc@gmail.com</a>
./blog/como-elegir-taller-ceramica-barcelona.html:280:              <a href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar a La Mesa por WhatsApp">
./blog/como-elegir-taller-ceramica-barcelona.html:289:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">Escríbenos →</a>
./blog/como-elegir-taller-ceramica-barcelona.html:303:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20Me%20gustaría%20saber%20más%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">
./blog/wheel-throwing-barcelona-beginners.html:218:          <p>If the wheel hooks you &mdash; and it usually does &mdash; you can continue with the <a href="/en/clases/semanal-torno.html">Weekly Wheel Class</a>, a fixed weekly session where you deepen your technique with a small group. We also have a wheel coworking option for experienced potters who want to come in and practise on their own with access to our equipment and kiln.</p>
./blog/wheel-throwing-barcelona-beginners.html:228:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20info%20about%20the%20wheel%20throwing%20course" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">WhatsApp &rarr;</a>
./blog/wheel-throwing-barcelona-beginners.html:229:              <a class="btn btn--outline-dark" href="/en/clases/semanal-torno.html" aria-label="See the Wheel Class">See the Wheel Class</a>
./blog/wheel-throwing-barcelona-beginners.html:255:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Send an email to La Mesa">lamesa.lc@gmail.com</a>
./blog/wheel-throwing-barcelona-beginners.html:261:              <a href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20information%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./blog/wheel-throwing-barcelona-beginners.html:270:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">Write to us &rarr;</a>
./blog/wheel-throwing-barcelona-beginners.html:284:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./blog/torn-ceramica-barcelona-guia.html:214:          <p>Si el torn t'atrapa &mdash; i sol passar &mdash; pots seguir amb el <a href="/ca/clases/semanal-torno.html">Taller Setmanal de Torn</a>, una classe fixa setmanal on aprofundeixes en la t&egrave;cnica amb un grup redu&iuml;t. Tamb&eacute; tenim el coworking de torn per a ceramistes amb experi&egrave;ncia que volen venir a practicar pel seu compte amb acc&eacute;s a l'equip i al forn.</p>
./blog/torn-ceramica-barcelona-guia.html:224:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20info%20sobre%20el%20curs%20de%20torn" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">WhatsApp &rarr;</a>
./blog/torn-ceramica-barcelona-guia.html:225:              <a class="btn btn--outline-dark" href="/ca/clases/semanal-torno.html" aria-label="Veure el Taller de Torn">Veure el Taller de Torn</a>
./blog/torn-ceramica-barcelona-guia.html:251:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correu a La Mesa">lamesa.lc@gmail.com</a>
./blog/torn-ceramica-barcelona-guia.html:257:              <a href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20m%C3%A9s%20informaci%C3%B3%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./blog/torn-ceramica-barcelona-guia.html:266:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20m%C3%A9s%20informaci%C3%B3%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">Escriu-nos &rarr;</a>
./blog/torn-ceramica-barcelona-guia.html:280:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20M'agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./clases/semanal-torno.html:9:  <link rel="canonical" href="https://lamesabcn.com/clases/semanal-torno.html">
./clases/semanal-torno.html:15:  <meta property="og:url" content="https://lamesabcn.com/clases/semanal-torno.html">
./clases/semanal-torno.html:21:  <link rel="alternate" hreflang="es" href="https://lamesabcn.com/clases/semanal-torno.html">
./clases/semanal-torno.html:22:  <link rel="alternate" hreflang="en" href="https://lamesabcn.com/en/clases/semanal-torno.html">
./clases/semanal-torno.html:23:  <link rel="alternate" hreflang="ca" href="https://lamesabcn.com/ca/clases/semanal-torno.html">
./clases/semanal-torno.html:24:  <link rel="alternate" hreflang="x-default" href="https://lamesabcn.com/clases/semanal-torno.html">
./clases/semanal-torno.html:132:        "item": "https://lamesabcn.com/clases/semanal-torno.html"
./clases/semanal-torno.html:223:          <a href="/clases/semanal-torno.html" class="active" aria-current="page" lang="es">ES</a>
./clases/semanal-torno.html:225:          <a href="/en/clases/semanal-torno.html" lang="en">EN</a>
./clases/semanal-torno.html:227:          <a href="/ca/clases/semanal-torno.html" lang="ca">CA</a>
./clases/semanal-torno.html:258:        <a href="/clases/semanal-torno.html" class="active" aria-current="page" lang="es">ES</a>
./clases/semanal-torno.html:259:        <a href="/en/clases/semanal-torno.html" lang="en">EN</a>
./clases/semanal-torno.html:260:        <a href="/ca/clases/semanal-torno.html" lang="ca">CA</a>
./clases/semanal-torno.html:311:        <a href="/clases/suelta.html" style="color:var(--yellow);">¿No estás seguro? Prueba primero una Clase Suelta →</a>
./clases/semanal-torno.html:323:          href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20reservar%20una%20clase%20semanal%20de%20torno%20pero%20no%20me%20viene%20bien%20ninguno%20de%20los%20turnos%20disponibles."
./clases/semanal-torno.html:378:            <p class="faq__answer">Sí, con una <a href="/clases/suelta.html">clase suelta de torno</a>: clase particular de 2 horas por 65&nbsp;€. Si prefieres trabajar a mano, mira la <a href="/clases/semanal-modelado.html">clase semanal de modelado</a> (120&nbsp;€/mes).</p>
./clases/semanal-torno.html:404:    href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20La%20Mesa"
./clases/semanal-torno.html:416:  <script src="../js/booking-v2.js?v=2" data-cookieconsent="ignore" defer></script>
./en/team-building.html:120:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./en/team-building.html:188:            <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hi!%20I%27m%20interested%20in%20a%20pottery%20team%20building" target="_blank" rel="noopener noreferrer" aria-label="Book a team building on WhatsApp">Book on WhatsApp →</a>
./en/team-building.html:189:            <a class="btn btn--outline-dark" href="mailto:lamesa.lc@gmail.com?subject=Pottery%20Team%20Building" aria-label="Book a team building by email">Write us an email</a>
./en/team-building.html:302:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hi!%20I%27m%20interested%20in%20a%20pottery%20team%20building" target="_blank" rel="noopener noreferrer" aria-label="Book a team building on WhatsApp">
./en/team-building.html:305:            <a class="btn btn--secondary" href="mailto:lamesa.lc@gmail.com?subject=Pottery%20Team%20Building" aria-label="Book a team building by email">lamesa.lc@gmail.com</a>
./en/team-building.html:328:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Send an email to La Mesa">lamesa.lc@gmail.com</a>
./en/team-building.html:334:              <a href="https://wa.me/34711552030?text=Hi!%20I%27d%20like%20more%20information%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./en/team-building.html:343:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hi!%20I%27d%20like%20more%20information%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">Message us →</a>
./en/team-building.html:357:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hi!%20I%27d%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./blog/que-es-el-torno-ceramica.html:214:          <p>Si el torno te atrapa &mdash; y suele pasar &mdash; puedes seguir con el <a href="/clases/semanal-torno.html">Taller Semanal de Torno</a>, una clase fija semanal donde profundizas en la t&eacute;cnica con un grupo reducido. Tambi&eacute;n tenemos el coworking de torno para ceramistas con experiencia que quieren venir a practicar por su cuenta con acceso al equipo y al horno.</p>
./blog/que-es-el-torno-ceramica.html:224:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20info%20sobre%20el%20curso%20de%20torno" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">WhatsApp &rarr;</a>
./blog/que-es-el-torno-ceramica.html:225:              <a class="btn btn--outline-dark" href="/clases/semanal-torno.html" aria-label="Ver el Taller de Torno">Ver el Taller de Torno</a>
./blog/que-es-el-torno-ceramica.html:251:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correo a La Mesa">lamesa.lc@gmail.com</a>
./blog/que-es-el-torno-ceramica.html:257:              <a href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar a La Mesa por WhatsApp">
./blog/que-es-el-torno-ceramica.html:266:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">Escr&iacute;benos &rarr;</a>
./blog/que-es-el-torno-ceramica.html:280:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">
./blog/cuanto-cuesta-clase-ceramica-barcelona.html:126:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./blog/cuanto-cuesta-clase-ceramica-barcelona.html:308:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20saber%20precios%20de%20las%20clases%20de%20cer%C3%A1mica" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">WhatsApp →</a>
./blog/cuanto-cuesta-clase-ceramica-barcelona.html:309:              <a class="btn btn--outline-dark" href="/clases/semanal-modelado.html" aria-label="Ver el Taller Semanal">Ver el Taller Semanal</a>
./blog/cuanto-cuesta-clase-ceramica-barcelona.html:335:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correo a La Mesa">lamesa.lc@gmail.com</a>
./blog/cuanto-cuesta-clase-ceramica-barcelona.html:341:              <a href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar a La Mesa por WhatsApp">
./blog/cuanto-cuesta-clase-ceramica-barcelona.html:350:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">Escríbenos →</a>
./blog/cuanto-cuesta-clase-ceramica-barcelona.html:364:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20Me%20gustaría%20saber%20más%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">
./clases/semanal-modelado.html:9:  <link rel="canonical" href="https://lamesabcn.com/clases/semanal-modelado.html">
./clases/semanal-modelado.html:15:  <meta property="og:url" content="https://lamesabcn.com/clases/semanal-modelado.html">
./clases/semanal-modelado.html:21:  <link rel="alternate" hreflang="es" href="https://lamesabcn.com/clases/semanal-modelado.html">
./clases/semanal-modelado.html:22:  <link rel="alternate" hreflang="en" href="https://lamesabcn.com/en/clases/semanal-modelado.html">
./clases/semanal-modelado.html:23:  <link rel="alternate" hreflang="ca" href="https://lamesabcn.com/ca/clases/semanal-modelado.html">
./clases/semanal-modelado.html:24:  <link rel="alternate" hreflang="x-default" href="https://lamesabcn.com/clases/semanal-modelado.html">
./clases/semanal-modelado.html:129:        "item": "https://lamesabcn.com/clases/semanal-modelado.html"
./clases/semanal-modelado.html:220:          <a href="/clases/semanal-modelado.html" class="active" aria-current="page" lang="es">ES</a>
./clases/semanal-modelado.html:222:          <a href="/en/clases/semanal-modelado.html" lang="en">EN</a>
./clases/semanal-modelado.html:224:          <a href="/ca/clases/semanal-modelado.html" lang="ca">CA</a>
./clases/semanal-modelado.html:255:        <a href="/clases/semanal-modelado.html" class="active" aria-current="page" lang="es">ES</a>
./clases/semanal-modelado.html:256:        <a href="/en/clases/semanal-modelado.html" lang="en">EN</a>
./clases/semanal-modelado.html:257:        <a href="/ca/clases/semanal-modelado.html" lang="ca">CA</a>
./clases/semanal-modelado.html:308:        <a href="/clases/suelta.html" style="color:var(--blue);">¿No estás seguro? Prueba primero una Clase Suelta →</a>
./clases/semanal-modelado.html:320:          href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20reservar%20una%20clase%20semanal%20de%20modelado%20pero%20no%20me%20viene%20bien%20ninguno%20de%20los%20turnos%20disponibles."
./clases/semanal-modelado.html:370:            <p class="faq__answer">Sí, con una <a href="/clases/suelta.html">clase suelta de modelado</a>: 2 horas por 45&nbsp;€.</p>
./clases/semanal-modelado.html:374:            <p class="faq__answer">Sí: la <a href="/clases/semanal-torno.html">clase semanal de torno</a> cuesta 160&nbsp;€/mes, con máximo 2 personas por turno.</p>
./clases/semanal-modelado.html:400:    href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20La%20Mesa"
./clases/semanal-modelado.html:412:  <script src="../js/booking-v2.js?v=2" data-cookieconsent="ignore" defer></script>
./clases/suelta.html:9:  <link rel="canonical" href="https://lamesabcn.com/clases/suelta.html">
./clases/suelta.html:15:  <meta property="og:url" content="https://lamesabcn.com/clases/suelta.html">
./clases/suelta.html:21:  <link rel="alternate" hreflang="es" href="https://lamesabcn.com/clases/suelta.html">
./clases/suelta.html:22:  <link rel="alternate" hreflang="en" href="https://lamesabcn.com/en/clases/suelta.html">
./clases/suelta.html:23:  <link rel="alternate" hreflang="ca" href="https://lamesabcn.com/ca/clases/suelta.html">
./clases/suelta.html:24:  <link rel="alternate" hreflang="x-default" href="https://lamesabcn.com/clases/suelta.html">
./clases/suelta.html:131:        "item": "https://lamesabcn.com/clases/suelta.html"
./clases/suelta.html:197:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./clases/suelta.html:234:          <a href="/clases/suelta.html" class="active" aria-current="page" lang="es">ES</a>
./clases/suelta.html:236:          <a href="/en/clases/suelta.html" lang="en">EN</a>
./clases/suelta.html:238:          <a href="/ca/clases/suelta.html" lang="ca">CA</a>
./clases/suelta.html:269:        <a href="/clases/suelta.html" class="active" aria-current="page" lang="es">ES</a>
./clases/suelta.html:270:        <a href="/en/clases/suelta.html" lang="en">EN</a>
./clases/suelta.html:271:        <a href="/ca/clases/suelta.html" lang="ca">CA</a>
./clases/suelta.html:350:        <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20Quiero%20reservar%20una%20clase%20suelta%20a%20otra%20hora" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp" style="gap:8px;">
./clases/suelta.html:399:            <p class="faq__answer">Tienes el taller semanal: 4 clases de 2 horas, siempre el mismo día y a la misma hora. <a href="/clases/semanal-modelado.html">Modelado</a> 120&nbsp;€/mes y <a href="/clases/semanal-torno.html">torno</a> 160&nbsp;€/mes.</p>
./clases/suelta.html:425:    href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20La%20Mesa"
./clases/suelta.html:437:  <script src="../js/booking-v2.js?v=2" data-cookieconsent="ignore" defer></script>
./en/clases/semanal-modelado.html:9:  <link rel="canonical" href="https://lamesabcn.com/en/clases/semanal-modelado.html">
./en/clases/semanal-modelado.html:15:  <meta property="og:url" content="https://lamesabcn.com/en/clases/semanal-modelado.html">
./en/clases/semanal-modelado.html:21:  <link rel="alternate" hreflang="es" href="https://lamesabcn.com/clases/semanal-modelado.html">
./en/clases/semanal-modelado.html:22:  <link rel="alternate" hreflang="en" href="https://lamesabcn.com/en/clases/semanal-modelado.html">
./en/clases/semanal-modelado.html:23:  <link rel="alternate" hreflang="ca" href="https://lamesabcn.com/ca/clases/semanal-modelado.html">
./en/clases/semanal-modelado.html:24:  <link rel="alternate" hreflang="x-default" href="https://lamesabcn.com/clases/semanal-modelado.html">
./en/clases/semanal-modelado.html:129:        "item": "https://lamesabcn.com/en/clases/semanal-modelado.html"
./en/clases/semanal-modelado.html:214:          <a href="/clases/semanal-modelado.html" lang="es">ES</a>
./en/clases/semanal-modelado.html:216:          <a href="/en/clases/semanal-modelado.html" class="active" aria-current="page" lang="en">EN</a>
./en/clases/semanal-modelado.html:218:          <a href="/ca/clases/semanal-modelado.html" lang="ca">CA</a>
./en/clases/semanal-modelado.html:234:        <a href="/clases/semanal-modelado.html" lang="es">ES</a>
./en/clases/semanal-modelado.html:235:        <a href="/en/clases/semanal-modelado.html" class="active" aria-current="page" lang="en">EN</a>
./en/clases/semanal-modelado.html:236:        <a href="/ca/clases/semanal-modelado.html" lang="ca">CA</a>
./en/clases/semanal-modelado.html:277:        <a href="/en/clases/suelta.html" style="color:var(--blue);">Not sure yet? Try a Drop-in Class first →</a>
./en/clases/semanal-modelado.html:284:        <a class="turno-nota__wa" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20book%20a%20weekly%20ceramics%20class%20but%20none%20of%20the%20available%20slots%20work%20for%20me." target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./en/clases/semanal-modelado.html:328:            <p class="faq__answer">Yes, with a <a href="/en/clases/suelta.html">drop-in hand-building class</a>: 2 hours for €45.</p>
./en/clases/semanal-modelado.html:332:            <p class="faq__answer">Yes: the <a href="/en/clases/semanal-torno.html">weekly wheel throwing class</a> costs €160/month, with up to 2 people per slot.</p>
./en/clases/semanal-modelado.html:350:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./en/clases/semanal-modelado.html:355:  <script src="../../js/booking-v2.js?v=2" data-cookieconsent="ignore" defer></script>
./ca/gracias.html:115:          <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20Acabo%20de%20reservar%20a%20La%20Mesa" target="_blank" rel="noopener noreferrer" style="gap:8px;">
./ca/gracias.html:134:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20M%27agradaria%20saber%20m%C3%A9s%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa per WhatsApp">
./blog/things-to-do-barceloneta-barcelona.html:191:          <p>If you want to do something creative with your hands — literally — there is a small pottery studio on Carrer de l'Atlàntida called <a href="/en/clases/suelta.html">La Mesa</a>. Two-hour sessions, no experience needed, all materials included. You shape your own bowl, cup or plate from scratch, and they fire it for you so you can pick it up later. No Spanish needed — the team speaks English fluently. It is a great option for couples, friends, or anyone who wants a break from sightseeing and a chance to actually make something.</p>
./blog/things-to-do-barceloneta-barcelona.html:227:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20information%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">WhatsApp →</a>
./blog/things-to-do-barceloneta-barcelona.html:228:              <a class="btn btn--outline-dark" href="/en/clases/suelta.html" aria-label="Book a Drop-in Class">Book a Drop-in Class</a>
./blog/things-to-do-barceloneta-barcelona.html:254:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Send an email to La Mesa">lamesa.lc@gmail.com</a>
./blog/things-to-do-barceloneta-barcelona.html:260:              <a href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20more%20information%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./blog/things-to-do-barceloneta-barcelona.html:269:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">Write to us →</a>
./blog/things-to-do-barceloneta-barcelona.html:283:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hi!%20I'd%20like%20to%20know%20more%20about%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contact La Mesa on WhatsApp">
./blog/cosas-que-hacer-en-barceloneta.html:191:          <p>Si buscas algo diferente con las manos — literalmente —, en el barrio hay un taller de cerámica que se llama <a href="/clases/suelta.html">La Mesa</a>. Es un espacio pequeño en el Carrer de l'Atlàntida donde puedes hacer una clase de dos horas sin necesidad de experiencia previa. Todo el material está incluido, tú solo vienes con ganas. Es un plan perfecto para hacer en pareja o con amigos, y te llevas a casa algo que has hecho tú. Mucho mejor que un imán de nevera.</p>
./blog/cosas-que-hacer-en-barceloneta.html:227:              <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">WhatsApp →</a>
./blog/cosas-que-hacer-en-barceloneta.html:228:              <a class="btn btn--outline-dark" href="/clases/suelta.html" aria-label="Reservar una Clase Suelta">Reservar una Clase Suelta</a>
./blog/cosas-que-hacer-en-barceloneta.html:254:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correo a La Mesa">lamesa.lc@gmail.com</a>
./blog/cosas-que-hacer-en-barceloneta.html:260:              <a href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar a La Mesa por WhatsApp">
./blog/cosas-que-hacer-en-barceloneta.html:269:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">Escríbenos →</a>
./blog/cosas-que-hacer-en-barceloneta.html:283:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20Me%20gustaría%20saber%20más%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">
./team-building.html:120:      document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
./team-building.html:188:            <a class="btn btn--dark" href="https://wa.me/34711552030?text=Hola!%20Me%20interesa%20un%20team%20building%20de%20cer%C3%A1mica" target="_blank" rel="noopener noreferrer" aria-label="Reservar team building por WhatsApp">Reservar por WhatsApp →</a>
./team-building.html:189:            <a class="btn btn--outline-dark" href="mailto:lamesa.lc@gmail.com?subject=Team%20Building%20de%20Cer%C3%A1mica" aria-label="Reservar team building por email">Escribir por email</a>
./team-building.html:302:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20Me%20interesa%20un%20team%20building%20de%20cer%C3%A1mica" target="_blank" rel="noopener noreferrer" aria-label="Reservar team building por WhatsApp">
./team-building.html:305:            <a class="btn btn--secondary" href="mailto:lamesa.lc@gmail.com?subject=Team%20Building%20de%20Cer%C3%A1mica" aria-label="Reservar team building por email">lamesa.lc@gmail.com</a>
./team-building.html:328:            <a href="mailto:lamesa.lc@gmail.com" aria-label="Enviar correo a La Mesa">lamesa.lc@gmail.com</a>
./team-building.html:334:              <a href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar a La Mesa por WhatsApp">
./team-building.html:343:            <a class="btn btn--primary" href="https://wa.me/34711552030?text=Hola!%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">Escríbenos →</a>
./team-building.html:357:  <a class="whatsapp-btn" href="https://wa.me/34711552030?text=Hola!%20Me%20gustaría%20saber%20más%20sobre%20La%20Mesa" target="_blank" rel="noopener noreferrer" aria-label="Contactar La Mesa por WhatsApp">
```

I moduli `newsletter-form` della home ES/EN/CA inviano iscrizioni a Mailchimp, non prenotazioni né pagamenti. Le email in `privacy.html` e traduzioni servono ai diritti sui dati. I link Etsy vendono oggetti e sono elencati a rischio basso. I link interni alle pagine lezioni sono inclusi perché oggi conducono al checkout v2, pur non essendo essi stessi un pagamento esterno.
