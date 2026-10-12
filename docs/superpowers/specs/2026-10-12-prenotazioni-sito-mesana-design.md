# SPEC — Prenotazioni dal sito La Mesa collegate a Mesana

> Stato: **bozza da approvare** (Andrea). Data: 2026-10-12. Metodo SDD: piano (approvato in chat
> 2026-10-12) → **questa spec** → ticket → sviluppo.
> Perimetro: solo La Mesa (slug `la-mesa`). Repo coinvolti: `queondache/lamesa-website` (sito
> statico, GitHub Pages) e `queondache/mesa-saas` (Mesana: backend Hono + Drizzle).
> Tier: **3** sulle parti Mesana che toccano pagamenti, email e database → ogni proposta Mesana
> resta in attesa dell'OK di Andrea. Le parti solo-sito sono tier 1-2.

## 1. Obiettivo

Due percorsi di un visitatore che arriva da Google.

**P1 — Clase suelta 2 h** (ricerca tipo "curso de cerámica Barcelona")
1. Atterra su `experiencias/torno.html` o `experiencias/modelado.html`.
2. Nel box vede le date disponibili, sceglie giorno, ora e numero di persone.
3. Paga con Stripe (carta, Apple Pay, Google Pay), senza creare un account.
4. Riceve l'email di conferma con un link per annullare. Le ragazze ricevono un avviso via email.
5. Se annulla più di 24 h prima, riceve il rimborso totale sulla carta in automatico.

**P2 — Corso mensile** (ricerca tipo "curso mensual de cerámica Barcelona")
1. Atterra su `clases/semanal-torno.html` o `clases/semanal-modelado.html`.
2. Vede i turni (giorno + ora) che hanno almeno un posto libero, **senza il numero di posti**.
3. Sceglie un turno e prenota la **prima lezione senza pagare**. Avviso esplicito: "el primer día
   pagas en el estudio el mes o la clase suelta".
4. Conferma con il link ricevuto via email. Solo allora il posto è preso. Le ragazze ricevono un
   avviso via email.
5. In alternativa scrive su WhatsApp.

In entrambi i casi il calendario ha l'aspetto di La Mesa (box delle pagine experiencias), mentre i
dati vengono da Mesana. Le ragazze decidono in Mesana cosa compare online.

### Criteri di successo
- Un visitatore da telefono (390 px) completa P1 in ≤ 6 tocchi dalla pagina fino a Stripe.
- Le ragazze non toccano mai il codice del sito per accendere o spegnere una lezione online.
- Nessuna pagina pubblica rivela quanti posti restano in un turno mensile.
- Ogni prenotazione online genera un'email alle ragazze entro 5 minuti.

## 2. Decisioni (Andrea, 2026-10-12)

| # | Decisione |
|---|---|
| D1 | Il box delle pagine experiencias è la UX di riferimento. Niente iframe della pagina Mesana. |
| D2 | Restano le pagine `experiencias/{torno,modelado}`. `clases/suelta.html` diventa un rimando a `experiencias/torno.html` (con link a modelado). |
| D3 | Le ragazze accendono le lezioni online da Mesana (interruttore per tipo di lezione, già costruito nella proposta #268). Le sueltas sono i tipi con modalità drop-in, i mensili sono i tipi con modalità iscrizione (enrollment). Nessun nuovo campo "suelta/mensile". |
| D4 | Mensili: prima lezione senza pagare, conferma tramite link email, si paga in studio il mese o la lezione suelta. |
| D5 | Mensili: nessun numero di posti visibile. I turni pieni non compaiono. |
| D6 | Email: conferma al cliente + avviso alle ragazze (casella `organization.reply_to_email`). |
| D7 | Annullo suelta dal link nell'email. Oltre 24 h prima: rimborso totale automatico sulla carta. La commissione Stripe resta a carico di La Mesa. |
| D8 | Gli altri studi e le pagine in portoghese restano **in sospeso**. |

### Decisioni tecniche dell'agente (reversibili, dichiarate)
- **T1. Collegamento pagina ↔ tipo di lezione.** Ogni pagina del sito dichiara quali tipi di lezione mostra (`classTypeIds` in `js/booking-config.js`). L'accensione, lo spegnimento, il prezzo e le date vengono solo da Mesana. Il controllo `expectedUnitPriceCents` viene tolto: oggi, se Lau cambia il prezzo, le date spariscono in silenzio. Al suo posto il box mostra il prezzo di Mesana. Un tipo di lezione nuovo richiede una riga di configurazione: va bene finché i tipi sono 2 + 2.
- **T2. Prima lezione mensile = prenotazione singola sul turno.** Prenotazione `drop_in` con quantità 1, non pagata, `pay_in_studio`, collegata alla prossima sessione del turno e marcata come origine "prima lezione web". Non si crea un'iscrizione. Occupa un posto nella capienza della sessione. Quando la persona arriva e paga il mese, le ragazze la iscrivono da Mesana come oggi. Prima di implementare va verificato con un test che l'iscrizione successiva non conti due volte lo stesso posto (ticket M2).
- **T3. Rimborso.** Si fa con `refunds.create` di Stripe sull'account collegato di La Mesa (stessa modalità del pagamento). Prima del rimborso si scrive l'annullo con un identificativo di ripetizione sicura (idempotenza). Nel registro si salva `refund.stripe_refund_id` (oggi sempre vuoto).
- **T4. Annullo entro 24 h.** La pagina spiega che non c'è rimborso e offre WhatsApp. Il cliente può comunque liberare il posto con una seconda conferma esplicita. Il posto torna libero, nessun rimborso.
- **T5. La pagina di annullo vive sul sito** (`experiencias/cancelar.html`, in tutte le lingue attive) e chiama l'API Mesana. Il token viaggia nel frammento `#t=`, che non finisce nei log né nel referrer.

## 3. Stato verificato (2026-10-12)

Fonte: `origin/codex/class-type-online-20261012` (proposta Mesana #268, che contiene la #264) e
`origin/main` del sito. Riferimenti completi negli audit di sessione.

### Esiste già
- **Interruttore online:** `class_type.online_bookable` (migrazione `0091`), `PATCH /class-types/:id/publication`, interfaccia in Ajustes › Tipos de clase.
- **`GET /public/studios/la-mesa/guest-sessions`:** restituisce solo sessioni drop-in di tipi accesi. Campi: `id, classTypeId, title, startAt, endAt, timezone, unitPriceCents, currency, remainingSeats, …`. Può restituire sessioni piene (`remainingSeats: 0`, per la lista d'attesa).
- **Pagamento suelta ospite:** checkout Stripe Connect, webhook, prenotazione + vendita + ricavo, email `confirmation` al cliente. Ritorno su `experiencias/reserva.html`.
- **Annullo con account cliente** (`/client/bookings/:id/cancel`), con credito invece del rimborso. Non vale per le prenotazioni ospite.
- **Flusso "prima lezione" non pagata con link email** (`purchase-access`), ma solo per sessioni drop-in.
- **Sito:** box completo in `js/experience-booking.js` (calendario, ore, persone, nome + email, Stripe, ritorno, file calendario). Pagine experiencias in es/en/ca.

### Manca (verificato, nessuna riga di codice)
1. Lettura pubblica dei turni dei mensili (tutte le letture pubbliche escludono enrollment).
2. Prima lezione senza pagare su un turno mensile.
3. Email alle ragazze per una nuova prenotazione: nessun tipo in `email_outbox`. Oggi c'è solo la coda nell'app.
4. Link di annullo per prenotazioni ospite, e la pagina relativa.
5. Rimborso sulla carta via Stripe: nessuna chiamata, `stripe_refund_id` sempre vuoto.
6. Sito: home, menu e pagine `clases/*` puntano a `app.mesana.studio/book/la-mesa`. Le pagine experiencias non sono collegate da nessuna parte.
7. Difetti del box: il mese appare come "Octubre De 2026" (`css/experience-booking.css:1` usa `text-transform:capitalize`). Il link "Saltar al contenido" resta visibile su mobile (regole `:focus` in `css/experiences.css:5` e `css/style.css:12-27`).

### Prerequisito bloccante
Le proposte Mesana **#264 e #268** devono entrare nella versione principale e andare in produzione,
con 21 aggiornamenti del database da applicare (fino a `0091`). Senza la #268 l'interruttore
online non esiste in produzione. Approvazione: Andrea (tier 3).

## 4. Requisiti per fase

### F0 — Prerequisito Mesana in produzione
- R0.1 #264 e #268 entrate, aggiornamenti database applicati in produzione, controlli verdi.
- R0.2 Lau accende online in Ajustes: suelta torno, suelta modelado, corso mensile torno, corso mensile modelado.
- R0.3 Lau crea le date della suelta di modelado (oggi zero) e controlla i turni mensili.
- R0.4 `organization.cancellation_cutoff_hours = 24` e `reply_to_email` impostati per La Mesa.

**Accettazione:** `guest-sessions` di produzione restituisce date sia torno sia modelado. Spegnendo
un tipo in Ajustes, le sue date spariscono dalla risposta.

### F1 — Sueltas sul sito (solo sito)
- R1.1 Home es/en/ca, menu, hero e card "Clase de 2 horas" puntano a `experiencias/torno.html` e `experiencias/modelado.html`. Le card dei corsi mensili puntano a `clases/semanal-*.html`. Il bono resta su Mesana (area clienti).
- R1.2 `clases/suelta.html` (es/en/ca) diventa una pagina di rimando: canonical verso experiencias torno, meta refresh, link visibili a torno e modelado. `sitemap.xml` aggiornata.
- R1.3 Il box usa il prezzo da Mesana (T1) e mostra solo `remainingSeats > 0`.
- R1.4 Correzioni: mese con sola iniziale maiuscola; skip link con `:focus-visible` e nascosto davvero (clip) quando non ha il focus.
- R1.5 Il fallback statico del box (quando l'API non risponde) mostra WhatsApp, non un link a `clases/suelta.html`.
- R1.6 `llms.txt` e `docs/booking-release.md` aggiornati.
- R1.7 Test del sito aggiornati: `booking-release`, `standard-booking-links`, impronte di `client-area-links`, `experiences`.

**Accettazione:**
- Da telefono, home → torno → data → ora → persone → "Continuar al pago" → Stripe, in ≤ 6 tocchi.
- Un pagamento di prova reale (minimo importo possibile, poi rimborsato dalle ragazze) produce una prenotazione in Mesana e l'email al cliente.
- I controlli automatici del sito sono verdi.

### F2 — Email alle ragazze (Mesana)
- R2.1 Nuovo tipo `staff_booking_notice` in `email_outbox` (aggiornamento del vincolo, una migrazione).
- R2.2 Si accoda nella stessa transazione di: (a) una prenotazione ospite pagata confermata; (b) una prima lezione mensile confermata (F3); (c) un annullo ospite (F4).
- R2.3 Destinatario: `organization.reply_to_email`. Se è vuoto non si invia e si scrive nel log con contesto, senza errore per il cliente.
- R2.4 Contenuto (lingua dello studio): tipo (suelta pagata / prima lezione mensile da pagare in studio / annullo con o senza rimborso), lezione, data e ora, persone, nome, email, telefono se c'è, importo.
- R2.5 Solo per gli studi abilitati (allowlist come `GUEST_BOOKING_STUDIO_SLUGS`).

**Accettazione:** test su Postgres. Una prenotazione ospite pagata produce esattamente 1 email
cliente + 1 email ragazze. Rielaborare lo stesso webhook non ne crea altre.

### F3 — Mensili: turni e prima lezione (Mesana + sito)
**Mesana**
- R3.1 `GET /public/studios/:slug/course-turns`: per ogni template in modalità iscrizione, attivo, di un tipo acceso online, restituisce `{templateId, classTypeId, title, weekday, startTime, durationMin, monthlyPriceCents|null, nextSessionStartAt}`.
  - Restituisce solo i turni la cui prossima sessione prenotabile (entro l'orizzonte) ha almeno un posto libero.
  - **Nessun campo con il numero di posti**: la risposta è identica con 1 o con N posti liberi.
- R3.2 `POST /public/studios/:slug/course-first-lesson-requests` `{templateId, name, email, phone?, locale, idempotencyKey}` → `202` e invio del link di verifica (riuso del meccanismo token di `purchase-access`, scadenza 30 min).
- R3.3 La verifica crea, o riusa per email, il cliente e la prenotazione secondo T2 sulla prossima sessione con posto. Il controllo di capienza avviene sotto lock al momento della verifica. Se nel frattempo il turno si è riempito: messaggio "el turno se ha llenado" + WhatsApp, e nessuna prenotazione.
- R3.4 Email al cliente "prima lezione confermata · paghi in studio", più l'email alle ragazze (F2).
- R3.5 Limiti anti-abuso: rate limit per IP e per email. Una sola prima lezione futura attiva per email e per turno.

**Sito**
- R3.6 Su `clases/semanal-{torno,modelado}.html` (es/en/ca), al posto del link a Mesana, un box nello stile experiencias:
  - elenco dei turni ("Miércoles 16:00–18:00");
  - scelta del turno, nome, email, telefono facoltativo;
  - avviso pagamento in studio;
  - stato "revisa tu email".
- R3.7 La pagina di conferma del link (`clases/confirmar.html`, o lo stesso box con `#t=`) mostra l'esito.
- R3.8 WhatsApp sempre visibile come alternativa. Se non ci sono turni: "Escríbenos por WhatsApp".
- R3.9 I testi "Tras el pago…" diventano "Pagas en el estudio el primer día".

**Accettazione:**
- Test anti-fuga: la risposta di `course-turns` non cambia tra 1 e 2 posti liberi e non contiene il template quando è pieno.
- Test di concorrenza: due verifiche contemporanee sull'ultimo posto danno 1 prenotazione e 1 "turno pieno".
- Test T2: dopo l'iscrizione della stessa persona al turno, la capienza non conta due volte.

### F4 — Annullo e rimborso (Mesana + sito)
**Mesana**
- R4.1 L'email `confirmation` delle prenotazioni ospite contiene il link `https://lamesabcn.com/{lang/}experiencias/cancelar.html#t=<token>`.
  - Token firmato e legato alla prenotazione, valido fino all'inizio della lezione.
  - Si salva l'email dell'acquirente (oggi il cliente ospite ha email nulla) per poter mandare l'avviso di annullo.
- R4.2 `POST /public/guest-bookings/cancel-preview {token}` → `{lesson, startAt, persons, amountCents, refundable: boolean, cutoffHours}`.
- R4.3 `POST /public/guest-bookings/cancel {token, confirmNoRefund?}`:
  - Se mancano più di `cancellation_cutoff_hours`: annullo + rimborso totale con Stripe sull'account collegato. L'identificativo di idempotenza è derivato dalla prenotazione. Si salvano `refund` e `stripe_refund_id`.
  - Se mancano meno ore: annullo senza rimborso, solo con `confirmNoRefund=true` (T4).
  - Ripetere la chiamata è innocuo e restituisce lo stesso esito.
- R4.4 Se Stripe rifiuta il rimborso: la prenotazione resta annullata, il rimborso finisce nella coda "attenzione" delle ragazze e il cliente vede "te devolveremos el importe manualmente". Mai un errore muto.
- R4.5 Email al cliente con l'esito, ed email alle ragazze (F2).

**Sito**
- R4.6 `experiencias/cancelar.html` (es/en/ca, `noindex`). Mostra riepilogo, rimborso sì/no, bottone "Cancelar reserva", poi l'esito.

**Accettazione:**
- Test con Stripe simulato: oltre 24 h → 1 rimborso totale e una seconda chiamata non ne crea un altro; entro 24 h → nessun rimborso e serve la conferma.
- Prova end-to-end in modalità test di Stripe (Codex app): pagamento → email → link → rimborso visibile nel pannello di Stripe di prova.

## 5. Contratti e sicurezza
- Tutte le nuove letture e scritture passano dal livello dati con `org_id` preso dal contesto (risolto dallo slug lato server), mai dal chiamante. Test anti-fuga tra due studi per ogni nuovo endpoint.
- CORS: solo `PUBLIC_BOOKING_ORIGINS`, già usato da `/api/public/*`.
- Token (annullo, prima lezione): cifrati e firmati con scadenza, sempre nel frammento dell'URL, mai nei log. Gli endpoint rispondono in modo uniforme con token non valido o scaduto.
- Dati personali: nome, email e telefono solo dove servono. Nessun dato personale nelle risposte pubbliche.
- Errori: sempre nel log con contesto (studio, prenotazione, tentativo), mai silenziosi. Risposte nella forma esistente dell'API.

## 6. Ordine e dipendenze

```
F0 (proposte #264/#268 in produzione) ─┬─> F1 sito sueltas ─────────────┐
                                       ├─> F2 email ragazze ─┬─> F3 mensili
                                       │                     └─> F4 annullo/rimborso
                                       └─ (F1 può partire in anteprima subito; si pubblica dopo F0)
```

Stime: F1 circa 1 giorno · F2 circa 1 giorno · F3 circa 2-3 giorni · F4 circa 2 giorni.

## 7. Fuori perimetro / in sospeso
- Altri studi (D8): da definire dopo La Mesa.
- Pagine in portoghese di torno, modelado e mensili.
- Bono e acquisti con account: restano nell'area clienti di Mesana.
- Spostamento di data da parte del cliente.
- Pagina di prenotazione standard di Mesana (`/book/la-mesa`): nessuna modifica.

## 8. Rischi
- **F0 è grande** (21 aggiornamenti del database): se tarda, F1 resta pronta ma non pubblicata. Mitigazione: F1 non dipende dal codice nuovo, solo dall'interruttore. Se serve, si può pubblicare con i tipi già online oggi.
- **T2 tocca un'invariante di Mesana** (modalità iscrizione e drop-in non vanno mescolate). La prenotazione singola su sessione di un corso va validata con la skill di dominio e con test prima del codice.
- **Rimborsi automatici:** primo uso dell'API rimborsi di Stripe in Mesana. Va provato solo in modalità test prima di accendere.
