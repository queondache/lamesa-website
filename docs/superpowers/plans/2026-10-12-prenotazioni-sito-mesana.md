# Prenotazioni dal sito La Mesa collegate a Mesana — Ticket e piano di implementazione

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prenotare e pagare la clase suelta 2 h, e prenotare la prima lezione dei mensili, direttamente dal sito La Mesa, con i dati di Mesana.

**Architecture:**
- Il sito statico (`queondache/lamesa-website`) tiene interfaccia e testi. Mesana (`queondache/mesa-saas`) tiene date, posti, pagamenti, email e annulli tramite l'API pubblica `/api/public/studios/la-mesa/*`.
- Le parti solo-sito sono dettagliate qui passo per passo (ticket S1-S4).
- Le parti Mesana sono un sottosistema separato, con base ancora in revisione (#264/#268). Qui sono schede-ticket con contratto, file e test obbligatori. Il piano passo-passo di ciascuna si scrive all'avvio del ticket, sulla versione principale aggiornata dopo M0.

**Tech Stack:**
- Sito: HTML statico, JS modulo vanilla, test `node --test` (Node 22), GitHub Pages.
- Mesana: Hono + TypeScript, Drizzle/Postgres (Neon), Stripe Connect Standard, `email_outbox`, test vitest su pg-mem e Postgres 17/18.

**Spec:** `docs/superpowers/specs/2026-10-12-prenotazioni-sito-mesana-design.md`

## Global Constraints
- Solo studio `la-mesa`. Gli altri studi restano in sospeso (D8). Pagine PT di torno, modelado e mensili sono fuori perimetro.
- Lingue sito: es (radice), `en/`, `ca/`. Ogni modifica di pagina va fatta in tutte e tre.
- Nessuna nuova dipendenza npm, né nel sito né in Mesana, senza dichiararla prima.
- Mesana:
  - `org_id` sempre dal contesto, risolto dallo slug lato server, mai dal chiamante;
  - test anti-fuga tra due studi per ogni nuovo endpoint;
  - una migrazione per ticket, generata con drizzle-kit più vincoli aggiunti a mano;
  - prova da zero su database effimero;
  - la numerazione parte da `0092`, da riverificare su main al momento.
- Mesana tier 3 (pagamenti, email, database): ogni proposta Mesana aspetta l'OK di Andrea prima di entrare.
- Mensili: nessuna risposta pubblica contiene il numero di posti (D5).
- Rimborso: totale, commissione Stripe a carico di La Mesa (D7). Soglia: `organization.cancellation_cutoff_hours` (= 24 per La Mesa).
- Token (annullo, prima lezione): solo nel frammento URL `#t=`, mai nei log, risposta uniforme se non validi.
- Commenti nel codice in italiano, nomi in inglese. Errori sempre nel log con contesto.
- Mobile 390 px, aree di tocco ≥ 44 px.

## Review Focus
1. **Prezzo cambiato in Mesana** (es. torno 65 → 70 €): il box deve mostrare 70 € e restare prenotabile, non sparire in silenzio. Test in S1.
2. **API Mesana lenta o ferma** sulla pagina experiencias: il box mostra il messaggio d'errore e WhatsApp, mai un link verso `clases/suelta.html` diventata rimando. Test in S1 e S3.
3. **Vecchi link a `clases/suelta.html`** (Google, WhatsApp salvati): devono arrivare a una pagina con link a torno e modelado e canonical corretto, non a un 404. Test in S4.
4. **Doppio clic o webhook ripetuto**: niente seconda email alle ragazze e niente secondo rimborso. Test in M1 e M4.
5. **Turno mensile che si riempie tra la richiesta e il clic sul link**: niente prenotazione, messaggio "turno lleno" + WhatsApp. Test in M3.

---

## Indice dei ticket

| ID | Fase | Repo | Cosa | Dipende da | Chi | Stima |
|---|---|---|---|---|---|---|
| M0 | F0 | mesa-saas | #264 e #268 entrano; aggiornamenti database in produzione; Lau accende 4 tipi, crea date modelado, cutoff 24 h, `reply_to_email` | — | Andrea (OK) + Lau | ½ giorno + collaudo |
| S1 | F1 | sito | Box: prezzo da Mesana, mese corretto, fallback WhatsApp | — | agente | 2 h |
| S2 | F1 | sito | Skip link invisibile senza focus da tastiera | — | agente | 30 min |
| S3 | F1 | sito | Home ES/EN/CA: link a experiencias e mensili; test aggiornati | S1 | agente | 2 h |
| S4 | F1 | sito | `clases/suelta` → rimando; sitemap, llms.txt, doc; link dalle semanal | S3 | agente | 2 h |
| M1 | F2 | mesa-saas | Email `staff_booking_notice` alle ragazze | M0 | agente + OK Andrea | 1 giorno |
| M2 | F3 | mesa-saas | `GET course-turns` senza numeri di posti | M0 | agente + OK Andrea | 1 giorno |
| M3 | F3 | mesa-saas | Prima lezione mensile: richiesta + verifica + prenotazione T2 | M1, M2 | agente + OK Andrea | 1½ giorni |
| S5 | F3 | sito | Box turni sulle pagine semanal + pagina conferma | M2, M3 | agente | 1 giorno |
| M4 | F4 | mesa-saas | Link annullo ospite + rimborso Stripe automatico | M1 | agente + OK Andrea | 1½ giorni |
| S6 | F4 | sito | `experiencias/cancelar.html` | M4 | agente | ½ giorno |
| X1 | tutte | — | Prova completa in modalità test Stripe (Codex app con il Mac) e collaudo con Lau da telefono | S4, S5, S6 | Codex app + Lau | ½ giorno |

Ogni ticket di codice passa dal `verificatore` prima di avanzare. Ogni proposta sul sito ha i
controlli automatici del sito verdi. Le proposte Mesana hanno i controlli completi verdi sul
commit esatto.

---

## Ticket del sito (dettaglio passo per passo)

Copia di lavoro: nuova, da `origin/main` del sito, per esempio `~/Dev/worktrees/lamesa-website-f1`, ramo `feat/f1-sueltas-sito`.
Comando di test di riferimento (lo stesso dei controlli automatici):

```bash
node --test tests/mini-booking.test.mjs tests/experience-booking.test.mjs tests/experiences.test.mjs tests/booking-release.test.mjs tests/client-area-links.test.mjs
```

### Task S1: Box — prezzo da Mesana, mese corretto, fallback WhatsApp

**Files:**
- Modify: `js/experience-booking.js:26` (`validateConfig`), `:47-50` (`publicSessions`), `:175` (etichetta del mese)
- Modify: `js/booking-config.js:14-15` (togliere `expectedUnitPriceCents`)
- Modify: `css/experience-booking.css:1` (togliere `text-transform:capitalize` da `.guest-month`)
- Modify: `{,en/,ca/}experiencias/{torno,modelado}.html`: fallback statico dentro `aside#reserva`
- Test: `tests/experience-booking.test.mjs`, `tests/booking-release.test.mjs:19`, `tests/mini-booking.test.mjs` (fixture)

**Interfaces:**
- Produces:
  - `publicSessions(raw, experience) → Session[]`, stessa firma: filtra per `classTypeIds` e `remainingSeats > 0`, nessun controllo prezzo;
  - `validateConfig` accetta esperienze con solo `classTypeIds`;
  - `monthLabel(date, locale, timeZone) → string`, esportata.

- [ ] **Step 1: Write the failing tests** (in coda a `tests/experience-booking.test.mjs`)

```js
test('Prezzo da Mesana: sessione con prezzo diverso resta prenotabile e mostra il prezzo di Mesana',async()=>{
 const {publicSessions,validateConfig}=await import('../js/experience-booking.js');
 const config=validateConfig({...raw,experiences:{modelado:{classTypeIds:['modelado']}}},location);
 assert.ok(config,'config senza expectedUnitPriceCents è valida');
 const repriced={...session,id:'s2',unitPriceCents:5000};
 assert.deepEqual(publicSessions([session,repriced,{...session,id:'full',remainingSeats:0}],config.experiences.modelado).map(s=>s.id),['s1','s2']);
});
test('Etichetta mese: solo la prima lettera maiuscola',async()=>{
 const {monthLabel}=await import('../js/experience-booking.js');
 assert.equal(monthLabel(new Date('2026-10-14T10:00:00Z'),'es','Europe/Madrid'),'Octubre de 2026');
});
```

Aggiungere nello stesso test il controllo per `ca`, la cui forma esatta dipende da `Intl`: prima lettera maiuscola, resto invariato.

```js
 const ca=monthLabel(new Date('2026-10-14T10:00:00Z'),'ca','Europe/Madrid');
 const raw=new Intl.DateTimeFormat('ca',{month:'long',year:'numeric',timeZone:'Europe/Madrid'}).format(new Date('2026-10-14T10:00:00Z'));
 assert.equal(ca,raw.charAt(0).toUpperCase()+raw.slice(1));
```


- [ ] **Step 2: Run to verify fail**

Run: `node --test tests/experience-booking.test.mjs`
Expected: FAIL. `validateConfig` restituisce `null` senza `expectedUnitPriceCents`, e `monthLabel` non è esportata.

- [ ] **Step 3: Implement**

In `js/experience-booking.js`:
```js
// riga 26: rimossa — il prezzo arriva da Mesana, non dalla configurazione del sito
export function publicSessions(raw,experience){
 // il prezzo lo decide Mesana: qui filtriamo solo tipo di lezione e posti liberi
 return sessionsFor(raw,experience.classTypeIds).filter(s=>s.remainingSeats>0);
}
export function monthLabel(date,locale,timeZone='Europe/Madrid'){
 const text=new Intl.DateTimeFormat(locale,{month:'long',year:'numeric',timeZone}).format(date);
 return text.charAt(0).toUpperCase()+text.slice(1);
}
```
Alla riga 175 sostituire la costruzione inline dell'etichetta con `monthLabel(<data del mese corrente>, this.locale, 'Europe/Madrid')`, usando le stesse variabili già presenti in quella riga.

In `js/booking-config.js`:
```js
      modelado: { classTypeIds: ['ct_c4a053343d214b15a3adf18f018f6bc4'] },
      torno: { classTypeIds: ['ct_0dbbb9eb8634405c82efe7d9a1b3c413'] }
```

In `css/experience-booking.css`: dentro la regola `.guest-month{…}` togliere `text-transform:capitalize`.

Fallback statico in `aside#reserva` delle 6 pagine experiencias: sostituire il link a `clases/suelta.html` con il link WhatsApp già usato nella pagina (`https://wa.me/34711552030`) e il testo localizzato:

| Lingua | Testo |
|---|---|
| es | `Consultar fechas por WhatsApp →` |
| en | `Ask for dates on WhatsApp →` |
| ca | `Consultar dates per WhatsApp →` |

- [ ] **Step 4: Update existing fixtures/tests**
  - `tests/booking-release.test.mjs:19`: sostituire le due asserzioni sul prezzo con `assert.equal(c.experiences.torno.expectedUnitPriceCents,undefined)`.
  - `tests/booking-release.test.mjs`, test "Home discovery…": sostituire le asserzioni che richiedono `href="/…clases/suelta.html"` in torno e modelado con `assert.match(read(...),/href="https:\/\/wa.me\/34711552030/)`.
  - Le fixture con `expectedUnitPriceCents` in `mini-booking.test.mjs` ed `experience-booking.test.mjs` restano valide: il campo in più viene ignorato.
  - Il vecchio test a `:249`, che si aspettava di escludere `wrong` per prezzo: se `wrong` differisce solo per prezzo, aggiornare l'atteso includendolo.

- [ ] **Step 5: Run all site tests**

Run: il comando di riferimento sopra. Expected: tutto PASS.

- [ ] **Step 6: Commit**

```bash
git add js/ css/experience-booking.css experiencias/ en/experiencias/ ca/experiencias/ tests/
git commit -m "feat(booking): prezzo da Mesana, mese con sola iniziale maiuscola, fallback WhatsApp"
```

### Task S2: Skip link nascosto finché non serve

**Files:**
- Modify: `css/experiences.css:5` (regola `.skip-link`), `css/style.css:12-27`
- Test: `tests/experiences.test.mjs` (nuovo test statico sul CSS)

- [ ] **Step 1: Failing test** (in coda a `tests/experiences.test.mjs`)

```js
test('Skip link: visibile solo con focus da tastiera',()=>{
 for(const file of ['css/experiences.css','css/style.css']){
  const css=read(file);
  assert.match(css,/\.skip-link:focus-visible/,file);
  assert.doesNotMatch(css,/\.skip-link:focus\s*\{/,file);
  assert.match(css,/\.skip-link\{[^}]*clip-path:inset\(50%\)|\.skip-link\s*\{[^}]*clip-path:\s*inset\(50%\)/,file);
 }
});
```

- [ ] **Step 2: Run, expect FAIL**: `node --test tests/experiences.test.mjs`

- [ ] **Step 3: Implement.** In entrambi i file, la regola base della skip link diventa nascosta in modo robusto, e visibile solo con `:focus-visible`:

```css
/* skip link: nascosto finché non arriva il focus da tastiera (su mobile il tap non deve mostrarlo) */
.skip-link{position:fixed;top:12px;left:12px;z-index:9999;clip-path:inset(50%);width:1px;height:1px;overflow:hidden;white-space:nowrap}
.skip-link:focus-visible{clip-path:none;width:auto;height:auto;overflow:visible;padding:10px 14px;background:var(--blue);color:#fff;border-radius:8px}
```

In `style.css` mantenere la formattazione multilinea del file. Rimuovere le vecchie regole `top:-100%` / `translateY(-200%)` e `:focus`.

- [ ] **Step 4: Run all site tests**: PASS. Poi controllo visivo a 390 px su `experiencias/torno.html#reserva`: la skip link non è visibile. Screenshot nella cartella di lavoro.

- [ ] **Step 5: Commit**: `git commit -am "fix(a11y): skip link visibile solo con focus da tastiera"`

### Task S3: Home → experiencias e mensili

**Files:**
- Modify: `index.html:226,299,321,332`, stesse righe in `en/index.html` e `ca/index.html`; `pt/index.html` resta invariato (fuori perimetro)
- Modify: `tests/booking-release.test.mjs` (conteggio link Mesana), `tests/standard-booking-links.test.mjs`
- Verify: `tests/client-area-links.test.mjs`. Le impronte ignorano le ancore hero e `clase-card__cta`, quindi devono restare verdi senza modifiche.

**Interfaces:**
- Produces: dalla home i link `/{lang/}experiencias/torno.html` (hero e card 2 h), `/{lang/}clases/semanal-modelado.html` e `/{lang/}clases/semanal-torno.html` (card corsi). Il bono (`:344`) resta `https://app.mesana.studio/book/la-mesa`.

- [ ] **Step 1: Failing test.** In `tests/booking-release.test.mjs`, test "Home discovery…", sostituire l'asserzione "5 link Mesana" con:

```js
  assert.equal(home.split('href="https://app.mesana.studio/book/la-mesa"').length-1,1,'Solo il bono resta su Mesana');
  assert.ok(home.includes(`href="/${prefix(lang)}experiencias/torno.html"`),'Hero e card 2h portano al box suelta');
  for(const t of ['semanal-modelado','semanal-torno'])assert.ok(home.includes(`href="/${prefix(lang)}clases/${t}.html"`),t);
```

- [ ] **Step 2: Run, expect FAIL**: `node --test tests/booking-release.test.mjs`

- [ ] **Step 3: Implement.** Per es/en/ca:
  - `:226` (hero) e `:299` (card 2 h): `href="/{prefix}experiencias/torno.html"`. Togliere `data-standard-booking` e l'eventuale `rel`/`target` legato a Mesana.
  - `:321`: corso modelado → `/{prefix}clases/semanal-modelado.html`.
  - `:332`: corso torno → `/{prefix}clases/semanal-torno.html`.
  - Controllare con `sed -n` che ogni card corrisponda davvero al corso indicato prima di modificarla.

- [ ] **Step 4: Aggiornare `tests/standard-booking-links.test.mjs`** alla nuova regola: 1 sola CTA Mesana in home (bono). Le pagine `clases/semanal-*` mantengono per ora la loro CTA Mesana: la sostituisce S5. `clases/suelta` è gestita in S4. Eseguirlo anche a mano, perché non è nei controlli automatici: `node --test tests/standard-booking-links.test.mjs`.

- [ ] **Step 5: Run all site tests + `standard-booking-links`**: PASS.

- [ ] **Step 6: Commit**: `git commit -am "feat(home): sueltas al box experiencias, corsi alle pagine mensili"`

### Task S4: `clases/suelta.html` → rimando; sitemap, llms.txt, documentazione

**Files:**
- Modify: `{,en/,ca/}clases/suelta.html` (sostituzione completa con pagina di rimando)
- Modify: `{,en/,ca/}clases/semanal-torno.html:308` (link a suelta → experiencias/torno)
- Modify: `sitemap.xml` (rimuovere le 3 voci `clases/suelta.html`), `llms.txt:37-39,74`, `docs/booking-release.md`
- Modify: `tests/client-area-links.test.mjs` (impronta aggiornata di `semanal-torno`, solo per il link cambiato)
- Test: `tests/booking-release.test.mjs` (nuovo test rimando)

- [ ] **Step 1: Failing test** (in `tests/booking-release.test.mjs`)

```js
test('clases/suelta è un rimando verso experiencias in ES, EN, CA',()=>{
 for(const lang of languages){
  const src=read(`${prefix(lang)}clases/suelta.html`);
  const target=`https://lamesabcn.com/${prefix(lang)}experiencias/torno.html`;
  assert.ok(src.includes(`<link rel="canonical" href="${target}">`));
  assert.match(src,new RegExp(`<meta http-equiv="refresh" content="0; url=/${prefix(lang)}experiencias/torno.html">`));
  assert.match(src,/<meta name="robots" content="noindex,follow">/);
  assert.ok(src.includes(`href="/${prefix(lang)}experiencias/modelado.html"`));
  assert.doesNotMatch(read('sitemap.xml'),new RegExp(`${prefix(lang)}clases/suelta\\.html`));
 }
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement.** Pagina di rimando (esempio es; en/ca con prefisso e testi tradotti: en "Pottery wheel class" / "Hand-building class", ca "Classe de torn" / "Classe de modelat"):

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Clase de cerámica de 2 horas · La Mesa</title>
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="https://lamesabcn.com/experiencias/torno.html">
<meta http-equiv="refresh" content="0; url=/experiencias/torno.html">
<link rel="stylesheet" href="/css/experiences.css">
</head>
<body>
<main class="content">
<h1>Clase de cerámica de 2 horas</h1>
<p><a href="/experiencias/torno.html">Clase de torno →</a></p>
<p><a href="/experiencias/modelado.html">Clase de modelado →</a></p>
</main>
</body>
</html>
```

Poi:
- `semanal-torno.html:308` in es/en/ca punta a `/{prefix}experiencias/torno.html`.
- In `client-area-links.test.mjs` ricalcolare solo le impronte dei tre `semanal-torno`: lanciare il test, leggere l'impronta attuale nel messaggio di errore e sostituirla, dopo aver verificato con `git diff` che l'unica differenza nelle pagine è il link.

Altri file:
- `sitemap.xml`: rimuovere i blocchi `<url>` di `clases/suelta.html` (3 lingue) ed eseguire `node scripts/update-sitemap-lastmod.mjs`.
- `llms.txt:37-39`: le pagine experiencias "show live Mesana dates and take online payment (Stripe)".
- `llms.txt:74`: punta a `experiencias/torno.html` e `experiencias/modelado.html`.
- `docs/booking-release.md`: stato reale, cioè config attiva, prezzo da Mesana, interruttore online in Mesana.

- [ ] **Step 4: Run all site tests + `standard-booking-links`**: PASS (aggiornare `standard-booking-links` per escludere `clases/suelta`).

- [ ] **Step 5: Controllo a 390 px.** Avviare `python3 -m http.server 8801` nella cartella. Aprire `/clases/suelta.html`: deve rimandare a torno. Aprire `/experiencias/torno.html`: il box compare con date da produzione, perché l'origine 127.0.0.1 non è in CORS. In alternativa verificare solo il fallback WhatsApp e annotarlo nel report.

- [ ] **Step 6: Commit + proposta di modifica** (F1 completa)

```bash
git add -A && git commit -m "feat(seo): clases/suelta rimanda a experiencias; sitemap e llms aggiornati"
git push -u origin feat/f1-sueltas-sito
gh pr create --title "F1 — Sueltas prenotabili dal sito (experiencias)" --body "Spec: docs/superpowers/specs/2026-10-12-prenotazioni-sito-mesana-design.md · Ticket S1-S4"
```

Pubblicazione dopo il `verificatore` e l'OK di Andrea. Se M0 non è ancora in produzione, il box mostra solo le date torno già online oggi: comportamento accettato in spec §8.

---

## Ticket Mesana (schede)

Regole comuni:
- copia di lavoro nuova da `origin/main` aggiornato dopo M0;
- skill `mesa-senior-architect` + `senior-architect` caricate;
- piano passo-passo scritto con `superpowers:writing-plans` all'avvio del ticket, nel repo Mesana;
- verificatore su un modello diverso dal builder;
- proposta in attesa dell'OK di Andrea (tier 3).

### M0 — Prerequisito in produzione
- **Cosa:** entrano le proposte #264 e #268 (in quest'ordine, oppure solo #268 che contiene #264, da verificare al momento). Si applicano in produzione gli aggiornamenti database fino a `0091`, seguendo il runbook di produzione di Mesana.
- **Lau, in Ajustes:**
  - accende online: suelta torno, suelta modelado, corso torno, corso modelado;
  - crea le date ricorrenti della suelta modelado;
  - imposta `cancellation_cutoff_hours=24` e `reply_to_email`.
- **Accettazione:**
  - `GET https://mesa-saas-backend.onrender.com/api/public/studios/la-mesa/guest-sessions?from=<oggi>&to=<+30g>` restituisce sessioni con entrambi i `classTypeId`;
  - spegnendo modelado le sue sessioni spariscono;
  - riaccendendolo tornano.
- **Chi:** Andrea (OK e produzione), Lau (dati). Nessun codice.

### M1 — Email alle ragazze `staff_booking_notice` (F2)
- **Files (da confermare su main):**
  - nuova migrazione: vincolo `email_outbox_type_check` esteso;
  - `backend/src/db/schema.ts` (enum del tipo);
  - `backend/src/jobs/email-dispatch.ts` (ramo nuovo);
  - nuovo `backend/src/lib/email/templates/staff-booking-notice.ts` (es/ca/en/it);
  - punti di accodamento in `backend/src/db/repos/guestBooking.ts` (fulfil pagato);
  - più gli hook usati da M3 e M4.
- **Interfaces:**
  - Produces `enqueueStaffBookingNotice(tx, ctx, { kind: 'paid_single' | 'first_lesson' | 'guest_cancel', bookingId, refundCents?: number }) → Promise<void>`;
  - destinatario `organization.reply_to_email`; se è null: nessun invio e log con `orgId`/`bookingId`;
  - abilitazione tramite `GUEST_BOOKING_STUDIO_SLUGS`.
- **Test obbligatori (Postgres):**
  - fulfil pagato → esattamente 1 `confirmation` + 1 `staff_booking_notice`;
  - stesso webhook rielaborato → nessuna riga in più;
  - `reply_to_email` null → 0 righe e log;
  - anti-fuga: lo studio B non riceve avvisi dello studio A.

### M2 — `GET /public/studios/:slug/course-turns` (F3)
- **Files:**
  - nuova route in `backend/src/routes/` accanto a `guest-booking.ts`, montata come le altre `/public` (`mount.ts`);
  - repo in `backend/src/db/repos/` che riusa `readOnlineAvailabilityBatch` (`online-availability.ts`) e il calcolo posti di `guestBooking.ts:76-90`.
- **Contratto:**
  ```ts
  type CourseTurn = { templateId: string; classTypeId: string; title: string;
    weekday: 1|2|3|4|5|6|7; startTime: string /* HH:mm Europe/Madrid */; durationMin: number;
    monthlyPriceCents: number | null; nextSessionStartAt: string /* ISO */ };
  // 200 { data: { turns: CourseTurn[] }, error: null }
  ```
- **Selezione dei turni:**
  - template `bookingMode='enrollment'`, attivo, tipo `onlineBookable=true`;
  - la prossima sessione futura entro `booking_page_horizon_days` ha almeno 1 posto libero (conteggio completo: prenotazioni, iscritti, trattenute in corso);
  - stessi gate dello studio delle altre letture pubbliche (slug abilitato, CORS `PUBLIC_BOOKING_ORIGINS`).
- **Test obbligatori:**
  - risposta byte-identica con 1 e con 2 posti liberi (anti-fuga posti);
  - turno pieno assente;
  - tipo spento assente;
  - template drop-in assente;
  - anti-fuga tra studi.

### M3 — Prima lezione mensile senza pagare (F3)
- **Files:**
  - nuove route `POST /public/studios/:slug/course-first-lesson-requests` e `POST /public/course-first-lesson/verify`;
  - riuso di `backend/src/lib/public-purchase/token.ts` (nuovo `intent: 'course_first_lesson'`, scadenza 30 min);
  - template email di verifica e di conferma (es/ca/en/it);
  - scrittura in un repo dedicato. Non estendere `createClientDropIn`, che rifiuta le sessioni non drop-in per invariante.
- **Contratto:**
  - richiesta `{ templateId, name, email, phone?, locale, idempotencyKey } → 202 { data: { status: 'email_sent' } }`;
  - verifica `{ token } → 200 { data: { status: 'confirmed', startAt, title } | { status: 'turn_full' } }`.
- **Regola T2:**
  - prenotazione `drop_in`, quantità 1, non pagata, `pay_in_studio`, origine `web_first_lesson`, sulla prossima sessione con posto;
  - nessuna `enrollment`;
  - controllo capienza sotto lock (`SELECT … FOR UPDATE` sulla sessione) al momento della verifica.
- **Gate prima del codice:**
  - revisione con `mesa-senior-architect` dell'eccezione all'invariante "non mescolare enrollment/drop-in";
  - test che, quando lo staff iscrive la stessa persona al turno, quella prenotazione non conti due posti (si converte o si annulla, da decidere nella revisione).
- **Test obbligatori:**
  - due verifiche contemporanee sull'ultimo posto → 1 `confirmed` e 1 `turn_full`;
  - token scaduto o riusato → risposta uniforme;
  - una sola prima lezione futura per email e turno;
  - rate limit per IP e per email;
  - `staff_booking_notice` `first_lesson` accodato (M1);
  - anti-fuga tra studi.

### M4 — Annullo ospite e rimborso Stripe (F4)
- **Files:**
  - `backend/src/db/repos/guestBooking.ts`: salvare l'email dell'acquirente sul cliente ospite;
  - template `confirmation` ospite (`backend/src/lib/email/templates/*`): link `https://lamesabcn.com/{lang/}experiencias/cancelar.html#t=<token>`;
  - nuove route `POST /public/guest-bookings/cancel-preview` e `POST /public/guest-bookings/cancel`;
  - nuovo `backend/src/lib/connect/refund.ts` con `stripe.refunds.create({ payment_intent }, { stripeAccount, idempotencyKey: 'guest-cancel:' + bookingId })`;
  - `backend/src/db/repos/refund.ts`: salvare `stripe_refund_id`.
- **Contratto:**
  - preview `{ token } → { title, startAt, persons, amountCents, refundable, cutoffHours }`;
  - cancel `{ token, confirmNoRefund?: boolean } → { status: 'cancelled_refunded' | 'cancelled_no_refund' | 'cancelled_refund_pending' | 'needs_confirmation' }`.
- **Regole:**
  - oltre il cutoff: annullo, poi rimborso totale;
  - entro il cutoff: senza `confirmNoRefund` → `needs_confirmation`; con → annullo senza rimborso;
  - Stripe rifiuta: annullo resta, voce nella coda attenzione, stato `cancelled_refund_pending`;
  - ripetere una chiamata restituisce lo stesso stato e non crea un secondo rimborso;
  - email esito al cliente + `staff_booking_notice` `guest_cancel`.
- **Test obbligatori (Stripe simulato):**
  - oltre 24 h → 1 chiamata rimborso con importo totale e `stripeAccount` corretto;
  - seconda chiamata → 0 nuove chiamate;
  - entro 24 h senza conferma → nessun annullo;
  - errore Stripe → `cancelled_refund_pending` + voce attenzione;
  - token di un altro studio → risposta uniforme;
  - posto liberato dopo l'annullo.

### S5 — Sito: box turni sulle pagine semanal (F3)
- **Files:**
  - `{,en/,ca/}clases/semanal-{torno,modelado}.html`: `.turno-grid` sostituito da `<aside id="turnos" data-course="torno|modelado">`;
  - nuovo `js/course-turns.js`, modulo nello stile di `experience-booking.js`, che riusa `GuestApi` e il CSS `experience-booking.css`;
  - `js/booking-config.js`: `courses: { torno: { classTypeIds: [...] }, modelado: { classTypeIds: [...] } }` con gli ID dei corsi mensili, presi da Mesana in M0;
  - testi "Tras el pago…" → "Pagas en el estudio el primer día";
  - `tests/course-turns.test.mjs`, da aggiungere ai controlli automatici in `site-check.yml`;
  - impronte `client-area-links` ricalcolate.
- **Comportamento:**
  - elenco turni "Miércoles · 16:00–18:00", senza posti;
  - scelta → nome, email, telefono facoltativo → `POST course-first-lesson-requests` → "Revisa tu email";
  - nessun turno → WhatsApp;
  - pagina di verifica `clases/confirmar.html` (`noindex`) che legge `#t=`, chiama verify e mostra `confirmed` o `turn_full` + WhatsApp.
- **Test:**
  - nessun numero di posti nel DOM renderizzato;
  - risposta vuota → WhatsApp;
  - token assente o non valido → messaggio + WhatsApp;
  - aree di tocco ≥ 44 px (controllo CSS).

### S6 — Sito: `experiencias/cancelar.html` (F4)
- **Files:** `{,en/,ca/}experiencias/cancelar.html` (`noindex`, `no-referrer`); nuovo `js/guest-cancel.js`; `tests/guest-cancel.test.mjs` (da aggiungere ai controlli automatici).
- **Comportamento:**
  - legge `#t=` e chiama preview;
  - mostra lezione, data, persone, importo e "Reembolso completo" oppure "Sin reembolso (menos de 24 h)";
  - bottone "Cancelar reserva"; entro 24 h serve una seconda conferma esplicita;
  - esito per ognuno dei 4 stati;
  - WhatsApp sempre presente;
  - il token si toglie dalla barra degli indirizzi (`history.replaceState`) dopo la lettura.
- **Test:** i 4 stati renderizzati; token assente → messaggio; nessun token nel DOM o negli URL dopo il caricamento.

### X1 — Prova completa e collaudo
- **Codex app con il Mac, Stripe in modalità test (Sandbox di Mesana):**
  1. Suelta torno pagata dal sito → email cliente con link → email ragazze → prenotazione e ricavo nel cruscotto di Mesana.
  2. Annullo oltre 24 h → rimborso visibile nel pannello Stripe di prova.
  3. Prima lezione mensile → link → conferma → email ragazze.
- **Lau da telefono:** accende e spegne un tipo e vede la differenza sul sito entro 1 minuto (la cache del sito è `no-store`).
- Report con screenshot in chat ad Andrea.
