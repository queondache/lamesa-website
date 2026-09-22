# 06 — Piano operativo di presenza su fonti terze (third-party presence)

**Studio:** La Mesa — Carrer de l'Atlàntida 47, Barceloneta, Barcellona (lamesabcn.com)
**Periodo dati GA4 di riferimento:** 24/06 → 21/09/2026 (90 giorni)
**Data documento:** 22/09/2026
**A chi è rivolto:** Andrea fa le azioni una tantum (registrazioni, contratti, testi). Lau e Vick eseguono le azioni ricorrenti (risposte a recensioni, monitoraggio community, follow-up con clienti). Nessuna azione qui richiede di toccare il codice del sito, il `robots.txt`, `llms.txt` o lo schema — quella parte è già a posto e resta fuori da questo piano (vedi `02_GEO_AUDIT.md`).
**Documenti collegati:** `02_GEO_AUDIT.md` (stato tecnico GEO del sito), `04_PLAN_GBP.md` (piano Google Business Profile), `05_CONTENT_PLAN_GEO.md` (piano editoriale on-site).

---

## 0. Perché questo piano — i numeri che lo giustificano

Nei 90 giorni 24/06→21/09/2026, La Mesa viene già citata dalle AI, ma **di rimbalzo**, non dal proprio dominio:

| Sorgente GA4 | Sessioni (90gg) | Cosa cita l'AI |
|---|---|---|
| `chatgpt.com / gbp` | 27 | La scheda Google Business Profile, non il sito |
| `chatgpt.com / ai-assistant` | 60 | Fonte non attribuibile a un singolo referrer — probabile mix di risposta diretta + fonti terze indicizzate |
| `gemini.google.com` | 5 | Indice Google (stesso bacino di GBP + web) |
| Tripadvisor | 2 | Scheda Tripadvisor esistente, 5,0/20 recensioni |

Il dato che conta: **il sito proprio (lamesabcn.com) non è quasi mai la fonte diretta citata**. Il capitolo GEO tecnico (`02_GEO_AUDIT.md`) è già coperto — `robots.txt`, `llms.txt`, `pricing.md`, schema LocalBusiness/FAQPage/Offer/Service. Questo piano non lo tocca e non lo rifà.

La leva che resta è dove **altri parlano di La Mesa**: portali, guide, recensioni, community. Non è una scelta stilistica — è la logica con cui i motori AI selezionano le fonti: citano più spesso terze parti autorevoli (directory, portali, community) che il dominio del brand stesso, perché una fonte terza che menziona un'attività locale funge da conferma indipendente. È lo stesso principio già osservato su GBP: **ChatGPT cita quello che trova strutturato e verificabile fuori dal sito**.

---

## 1. Mappa delle fonti che contano per La Mesa

Non una lista generica di directory: solo le fonti dove arriva davvero qualcuno in cerca di un'attività come La Mesa a Barcellona, con l'intento giusto.

### 1.1 — Portali di attività ed esperienze

| Portale | Chi ci arriva | Intento | Vale per La Mesa? |
|---|---|---|---|
| **Airbnb Experiences** | Turisti che pianificano il viaggio prima di partire, spesso dagli USA/Europa (coerente con il 64% Spagna ma anche 66 sessioni USA, 24 Germania, 19 Svizzera del sito) | Vuole comprare un'esperienza una tantum, spesso in coppia o piccolo gruppo | **Sì, con verifica preliminare.** `product-marketing-context.md` (fuori dal perimetro di questo documento) lo segna come canale "attivo", ma questo dato non è tra i fatti verificati per questo task — prima azione è controllare se il listing esiste davvero e in che stato, poi decidere se crearlo o aggiornarlo |
| **GetYourGuide** | Turisti che cercano "things to do Barcelona" prima o durante il soggiorno, alto intento d'acquisto immediato | Comprare un'esperienza specifica, spesso confrontando 3-4 opzioni sulla stessa pagina di ricerca | **Sì, solo per Clase Suelta.** Pubblico prevalentemente anglofono/internazionale — coerente con le 268 sessioni con browser in inglese contro 168 in spagnolo |
| **Civitatis** | Equivalente di GetYourGuide per il pubblico ispanofono (Spagna + America Latina) | Stesso intento d'acquisto immediato, ma turisti domestici spagnoli (Madrid 33 sessioni, Valencia 18 — profilo compatibile con turismo interno) | **Sì, solo per Clase Suelta.** Copre il segmento che GetYourGuide non intercetta bene |
| **Atrápalo** | Pubblico spagnolo, ricerca locale di attività a Barcellona, spesso a caccia di prezzo | Confronto diretto tra attività simili sulla stessa pagina | **Sì, per rispondere a un vuoto concreto.** Un concorrente diretto vende già lì un'attività di ceramica a 27,00 € con 4,6/8 recensioni. La Mesa non è presente: chi cerca "ceramica Barcelona" su Atrápalo oggi vede solo il concorrente |
| **Fever** | Pubblico locale + turistico, scoperta di eventi ed esperienze curate editorialmente dalla piattaforma | Scoperta d'impulso, non ricerca mirata | **Non ora.** Fever richiede candidatura e selezione editoriale, tempi lunghi e nessuna garanzia di accettazione. Va in backlog come test successivo, non tra le prime 5 azioni |

**Nota sul confronto di prezzo:** i prezzi di riferimento La Mesa (Clase Suelta Modelado 50 €, Torno 70 €, Intro al Torno 90 €) sono più alti dei 27 € del concorrente su Atrápalo. Questo non è un motivo per non esserci — è un motivo per non competere sul prezzo nella scheda: la descrizione deve giustificare la differenza (materiali e cottura inclusi, gruppi piccoli, torno privato max 2 persone), non nasconderla.

### 1.2 — Tripadvisor

Chi arriva: turisti in fase di pianificazione o già in loco, che cercano "cose da fare a Barcellona" con un filtro di fiducia (recensioni verificate, non sponsorizzate). Intento misto: sia scoperta sia decisione d'acquisto nelle ultime ore prima di prenotare. La scheda esiste già e **manda già traffico reale** (2 sessioni su 90 giorni, piccolo ma reale, con lo stesso pattern di GBP: l'AI cita la piattaforma terza, non il sito). Vale, ed è già a metà strada — trattato a parte al §5.

### 1.3 — Guide e liste "mejores talleres de cerámica en Barcelona" / "best pottery classes Barcelona"

Chi ci arriva: chi ha già deciso di provare la ceramica ma non sa ancora dove, tipicamente attraverso una ricerca generica su Google o direttamente chiedendo a un'AI. Intento: comparativo, cerca 3-5 opzioni con un giudizio già filtrato da chi scrive l'articolo. **Vale moltissimo, per un motivo preciso**: questo è esattamente il tipo di contenuto — liste, guide, comparazioni — che gli assistenti AI citano più spesso quando rispondono a domande generiche sul settore, perché è già strutturato come risposta. Un articolo che include La Mesa diventa una fonte che ChatGPT o Perplexity possono riprendere quasi parola per parola.

### 1.4 — Reddit

Chi ci arriva: chi fa una domanda specifica e vuole una risposta genuina da persone reali, non da un'azienda. Intento variabile — spesso locale (`r/Barcelona`) o di nicchia sull'hobby (`r/Pottery`). Vale, con un confine netto tra partecipazione e spam (vedi §4). È anche una fonte che gli assistenti AI indicizzano pesantemente per rispondere a domande "dal vivo" tipo "qualcuno ha provato un corso di ceramica a Barcellona?".

### 1.5 — Community di expat a Barcellona

Chi ci arriva: expat/studenti internazionali che cercano attività sociali, spesso in gruppi Facebook chiusi ("Barcelona Expats", "Girls in Barcelona", gruppi Erasmus) più che su Reddit. Intento: sociale prima ancora che di hobby — cercano un modo per conoscere gente. Coerente con il profilo pubblico del sito (268 sessioni inglese, Germania/Svizzera/Francia/UK oltre 70 sessioni totali). Vale come estensione dello stesso principio di partecipazione genuina di Reddit — stesso confine, gruppi diversi. Non è una fonte indicizzata dalle AI (i gruppi Facebook privati non sono crawlabili), ma resta valida per generare clienti reali che poi lasciano recensioni pubbliche (che *sono* citabili).

### 1.6 — Blog di turismo locale e stampa di quartiere

Chi ci arriva: lettori di blog su Barcellona (spesso scritti da altri expat o da appassionati locali) e lettori di stampa di quartiere sulla Barceloneta. Intento: scoperta di posti "autentici" nel quartiere, spesso con un angolo editoriale (storia del quartiere, artigiani locali). Vale come sottoinsieme del lavoro di outreach guide/liste (§3) — stesso metodo di contatto, target editoriale diverso (più locale, meno turistico generico).

### 1.7 — Fonti scartate esplicitamente

| Fonte | Perché non entra in questo piano |
|---|---|
| **Groupon / LetsBonus** | Modello a sconto aggressivo (spesso il 50% o più sul prezzo) incompatibile con un business che vive di abbonamenti mensili da 120-160 €. Attira chi cerca lo sconto una tantum, non chi si iscrive a un taller settimanale — rischio concreto di danneggiare il posizionamento prezzo senza costruire clientela ricorrente |
| **Yelp España** | Uso marginale in Spagna rispetto a Google/Tripadvisor per questo tipo di attività; nessuna evidenza che porti traffico rilevante a studi di ceramica a Barcellona |
| **Directory generiche tipo Páginas Amarillas** | Pubblico che cerca servizi locali generici (idraulici, avvocati), non attività creative/turistiche. Il pubblico di La Mesa (64% turistico/expat secondo la lingua browser) non passa da lì |
| **Tripadvisor Experiences (modulo di prenotazione)** | Diverso dalla scheda recensioni già attiva: attivare anche il modulo booking duplicherebbe il flusso Stripe già in produzione e aggiungerebbe una commissione senza un beneficio chiaro rispetto a tenere solo la scheda review-based |

---

## 2. Il compromesso commerciale: farsi citare vs vendere

Va detto in chiaro perché cambia la priorità di ogni fonte.

I portali di esperienze (Airbnb Experiences, GetYourGuide, Civitatis, Atrápalo, Fever) trattengono una commissione per ogni prenotazione — variabile da piattaforma a piattaforma e non pubblicata in modo uniforme, va verificata nelle condizioni di registrazione di ciascuna al momento dell'iscrizione, ma è tipicamente una quota a doppia cifra sul prezzo lordo. Portano clienti che comprano **una volta sola** un'esperienza. Il modello di La Mesa vive invece di abbonamenti mensili (Taller Semanal Modelado/Torno) che generano ricavo ricorrente senza commissione a terzi. Sono due economie diverse:

| Fonte | Serve a citare | Serve a vendere | Note |
|---|---|---|---|
| Airbnb Experiences / GetYourGuide / Civitatis / Atrápalo | Sì, indirettamente (essere elencati genera un profilo indicizzato che le AI possono riprendere quando rispondono a "cosas que hacer en Barceloneta") | Sì, ma **solo per Clase Suelta / Intro al Torno**, mai per gli abbonamenti — i portali non gestiscono ricorrenza | Vale la pena mantenere un listing anche con poche vendite dirette, purché il costo di gestione (foto, testo, calendario aggiornato) resti basso: il ritorno principale qui è il segnale, non la commissione incassata |
| Tripadvisor | Sì, fortemente (già dimostrato: 2 sessioni referral in 90gg, stesso pattern citazionale di GBP) | Indirettamente (nessuna commissione se si usa solo la scheda recensioni, non il modulo booking) | Il rapporto costo/beneficio più alto di tutta la mappa: zero commissione, solo tempo di gestione |
| Guide e liste "mejores talleres" | Sì, è lo scopo primario | No, o solo come referral indiretto (link al sito) | Nessuna commissione, nessun vincolo di prezzo. Puro guadagno di citazione |
| Reddit / community expat | Sì (community indicizzate dalle AI) | No, solo indirettamente (un lettore convinto va poi a prenotare sul sito) | Zero costo economico, costo in tempo e disciplina (§4) |

**In sintesi:** i portali con commissione vanno attivati solo per il prodotto compatibile (Clase Suelta/Intro), non per gli abbonamenti. Tripadvisor, guide/liste e community sono le fonti che valgono anche a saldo di vendite zero, perché il loro ritorno è essere citati, non essere pagati per una prenotazione.

---

## 3. Liste e guide: come entrarci concretamente

### 3.1 — Come trovare gli articoli giusti da contattare

Metodo manuale, da ripetere ogni 6 mesi (i risultati di ricerca cambiano):

1. Cercare su Google, in incognito, da un browser configurato su Barcellona: `mejores talleres de cerámica Barcelona`, `clases de cerámica Barcelona recomendadas`, `best pottery classes Barcelona`, `things to do Barcelona pottery`.
2. Annotare i primi 10-15 risultati per ciascuna query: nome del sito, se è un blog indipendente/rivista locale/guida turistica generalista, se cita già dei concorrenti (Tierra, Born to Clay, ElTorn — vedi `04_COMPETITOR_ANALYSIS.md`), se ha una email di contatto o un form redazionale.
3. Scartare gli articoli generati automaticamente o senza autore riconoscibile (bassa qualità editoriale, l'AI li pesa meno). Tenere quelli con un autore reale, aggiornati negli ultimi 12-18 mesi.
4. Target realistico: 8-10 articoli/blog identificati per il primo giro di outreach.

### 3.2 — Materiali da avere pronti prima di scrivere una sola email

Checklist press kit (materiale che esiste già o richiede solo di essere assemblato, non creato da zero):

- [ ] 3-5 foto reali dello studio e delle mani al lavoro (già presenti su Instagram @lamesa.lc e sul sito)
- [ ] Una descrizione di 2-3 frasi in spagnolo e in inglese ("hosts, not teachers", spazio creativo alla Barceloneta — riprendere il tono già usato in `llms.txt`)
- [ ] Link diretto alla pagina prezzi machine-readable (`lamesabcn.com/pricing.md`) e a `/clases/` per la prenotazione online
- [ ] Numeri di prova sociale verificati: 5,0 su 41 recensioni Google, 5,0 su 20 recensioni Tripadvisor, 997 follower Instagram
- [ ] Indirizzo, orari, contatto WhatsApp

### 3.3 — Modello email in spagnolo

```
Asunto: La Mesa, taller de cerámica en La Barceloneta — para [nombre del blog/medio]

Hola [nombre],

Soy Andrea de La Mesa, un taller de cerámica y laboratorio creativo en La
Barceloneta (Carrer de l'Atlàntida 47). Vi vuestro artículo sobre [título del
artículo] y nos encantaría que conocierais nuestro espacio, por si encaja con
el contenido que ya publicáis.

Somos anfitrionas, no profesoras: un espacio pensado para que cualquiera —sin
experiencia previa— pueda sentarse a la mesa, tocar el barro y desconectar un
rato. Ofrecemos talleres semanales de modelado y torno, clases sueltas para
quien solo quiere probar una vez, e iniciación al torno.

Tenemos valoración 5,0 sobre 41 reseñas en Google y 5,0 sobre 20 en
Tripadvisor. Toda la información de precios está aquí: lamesabcn.com/pricing.md

Si os sirve, podemos:
- Enviaros fotos en alta resolución del espacio y de las clases
- Ofrecer una clase de prueba para quien escriba el artículo
- Responder cualquier pregunta sobre el taller

Un saludo,
Andrea (La Mesa)
lamesa.lc@gmail.com · wa.me/34711552030 · @lamesa.lc
```

### 3.4 — Modello email in inglese

```
Subject: La Mesa, a ceramics studio in La Barceloneta — for [blog/publication name]

Hi [name],

I'm Andrea from La Mesa, a ceramics studio and creative lab in La Barceloneta
(Carrer de l'Atlàntida 47). I came across your piece on [article title] and
thought our space might be a good fit if you're covering similar spots in
Barcelona.

We're hosts, not teachers: a space where anyone — no experience needed — can
sit down, work with clay, and slow down for a couple of hours. We run weekly
hand-building and wheel-throwing classes, drop-in sessions for people who
just want to try it once, and a wheel-throwing intro course.

We're rated 5.0 out of 41 reviews on Google and 5.0 out of 20 on Tripadvisor.
Full pricing is here: lamesabcn.com/pricing.md

Happy to send high-res photos, offer a trial class for whoever's writing the
piece, or answer any questions about the studio.

Best,
Andrea (La Mesa)
lamesa.lc@gmail.com · wa.me/34711552030 · @lamesa.lc
```

---

## 4. Reddit e community: come partecipare senza fare spam

### Cosa fare

- Impostare una ricerca salvata (o un controllo manuale settimanale) su `r/Barcelona`, `r/Pottery`, `r/Spain`, `r/expats` con parole chiave "pottery", "ceramics class", "cerámica", "torno".
- Rispondere solo quando qualcuno fa già una domanda pertinente (es. "anyone know a good pottery class in Barcelona?"). Mai creare un thread nuovo per promuovere La Mesa.
- Se si risponde parlando della propria attività, dichiararlo esplicitamente nella risposta ("full disclosure, this is my studio" / "aviso, es mi propio taller"). È la norma non scritta di Reddit — nasconderlo, se scoperto, brucia la credibilità e spesso porta alla rimozione del commento da parte dei moderatori.
- Una risposta per thread, con informazioni utili anche a chi non sceglierà La Mesa (orari, zona, differenza modelado/torno), non solo un link.
- Lo stesso principio vale per i gruppi Facebook di expat: rispondere a chi chiede, non pubblicare annunci non richiesti.

### Cosa non fare mai

- Non creare account multipli o chiedere ad amici/clienti di commentare in coordinamento — i moderatori e gli algoritmi anti-spam di Reddit riconoscono il pattern e bannano il dominio.
- Non postare lo stesso testo copiato su più thread o subreddit.
- Non rispondere a thread vecchi di mesi/anni solo per piazzare un link — letto come spam anche se il contenuto è genuino.
- Non offrire sconti o incentivi in cambio di una menzione o di un voto positivo: viola le policy della piattaforma e, se scoperto, danneggia la credibilità futura del profilo.

---

## 5. Tripadvisor: allineare 20 recensioni a 41

La scheda Tripadvisor esiste, ha lo stesso punteggio di Google (5,0) ma meno della metà delle recensioni (20 contro 41) e manda già traffico reale al sito. Obiettivo: ridurre il divario, non ripartire da zero.

- **Aggiornare foto e descrizione della scheda** allineandole a quanto già presente su Google Business Profile (foto recenti già disponibili, vedi `04_PLAN_GBP.md` §1) — evitare di avere due schede con informazioni disallineate, perché un'AI che confronta le due fonti su prezzo/orari discordanti è meno propensa a citare nessuna delle due con sicurezza.
- **Rispondere a tutte le recensioni esistenti** con lo stesso standard di cura già usato su Google, e senza il ritardo di ~3 mesi osservato lì (vedi `04_PLAN_GBP.md` §1) — replicare qui la stessa correzione, non ripetere lo stesso errore su una seconda piattaforma.
- **Chiedere una recensione Tripadvisor a chi ha già lasciato una recensione Google**, non ai clienti nuovi due volte: un messaggio soft post-classe ("si os ha gustado, una reseña en Google o Tripadvisor nos ayuda mucho") lasciando scegliere la piattaforma alla persona, senza incentivi (vietati da entrambe le piattaforme).
- **Verificare la categoria della scheda** (deve essere una categoria di classi/laboratori, non generica "cosa da fare"), lo stesso controllo già fatto su GBP per la categoria `Escuela de arte`.

Nessuna di queste azioni richiede accesso diverso da quello già in uso per gestire la scheda.

---

## 6. Priorità — le prime 5 azioni

Ordinate per rapporto tra ritorno e fatica, dalla più conveniente. Il resto è in backlog (§7).

| # | Azione | Chi | Quanto tempo | Ogni quanto | Numero che deve muoversi |
|---|---|---|---|---|---|
| 1 | **Tripadvisor**: aggiornare foto/descrizione, rispondere a tutte le 20 recensioni esistenti senza ritardo, messaggio soft post-classe per chi ha già recensito su Google | Andrea (setup scheda) + Lau/Vick (messaggio post-classe ricorrente) | 30 min setup una tantum + 2 min per messaggio | Setup una tantum, poi controllo mensile nuove recensioni | Recensioni Tripadvisor da 20 verso la parità con Google (41); sessioni `tripadvisor.*` in GA4 (baseline: 2/90gg) |
| 2 | **Outreach guide/liste**: identificare 8-10 articoli "mejores talleres de cerámica Barcelona" / "best pottery classes Barcelona" e inviare email con press kit (§3) | Andrea (ricerca + press kit) poi Lau o Vick (invio email e follow-up) | 3h il primo giro (ricerca + email), poi 15 min/settimana di follow-up | Batch iniziale, poi refresh della ricerca ogni 6 mesi | N° di menzioni ottenute su articoli esistenti/12 mesi (baseline: 0 verificate); sessioni referral da quei domini in GA4 |
| 3 | **Listing Clase Suelta su GetYourGuide + Civitatis** (mai abbonamenti) | Andrea | ~2h per creare i due listing (foto, testo, prezzo, calendario) | Una tantum + verifica mensile disponibilità/calendario | Sessioni referral `getyourguide.com` / `civitatis.com` in GA4 (baseline: 0); n° prenotazioni via portale/mese (anche 1-2/mese giustifica il mantenimento per il segnale di citazione) |
| 4 | **Listing Clase Suelta su Atrápalo**, in risposta diretta al concorrente già presente | Andrea | ~1h | Una tantum + verifica trimestrale prezzo/disponibilità | Sessioni referral `atrapalo.com` in GA4 (baseline: 0); comparsa nella stessa pagina di ricerca del concorrente (verifica manuale trimestrale) |
| 5 | **Monitoraggio Reddit** su `r/Barcelona` + `r/Pottery` con risposta genuina quando pertinente (§4) | Lau o Vick (chi ha più naturalezza nella scrittura in inglese/spagnolo colloquiale) | 10 min/settimana | Settimanale | N° di risposte utili postate/mese (baseline: 0); eventuale comparsa di sessioni referral `reddit.com` in GA4 (baseline: 0, quindi qualunque comparsa è un segnale positivo) |

---

## 7. Backlog (resto)

Non urgente, da valutare dopo che le prime 5 hanno prodotto un primo risultato misurabile:

- **Airbnb Experiences**: prima verificare se il listing segnalato come "attivo" in `product-marketing-context.md` esiste davvero e in che stato (foto, prezzo, descrizione aggiornati); solo dopo decidere se crearlo ex novo o correggerlo.
- **Fever**: candidatura editoriale, tempi lunghi e nessuna garanzia di accettazione — testare solo dopo che GetYourGuide/Civitatis/Atrápalo hanno dato un primo riscontro.
- **Blog di turismo locale e stampa di quartiere Barceloneta** (La Vanguardia sezione quartiere, Time Out Barcelona, testate locali): stesso metodo di outreach del §3, target editoriale più locale — seconda ondata dopo la prima batch di guide generaliste.
- **Community expat Facebook** (gruppi tipo "Barcelona Expats", gruppi Erasmus/scambio): stesso principio del §4, canale non indicizzato dalle AI ma utile a generare clienti reali che poi lasciano recensioni pubbliche.
- **Ricontrollo trimestrale delle fonti scartate** (§1.7): se cambia il modello di business (es. si introduce un pacchetto one-off più allineato al prezzo dei portali sconto) rivalutare Groupon/LetsBonus.

---

## 8. Misurazione

### 8.1 — Sorgenti GA4 da monitorare

Quelle già note più le nuove attivate da questo piano:

| Sorgente / medium GA4 | Stato oggi (baseline 90gg) | Cosa segnala |
|---|---|---|
| `chatgpt.com / gbp` | 27 sessioni | ChatGPT cita la scheda Google |
| `chatgpt.com / ai-assistant` | 60 sessioni | Citazione AI non attribuibile a un singolo referrer |
| `gemini.google.com` | 5 sessioni | Citazione da indice Google |
| `tripadvisor.*` | 2 sessioni | Citazione/traffico da Tripadvisor |
| `l.wl.co` | da verificare in GA4 (link tracker già esistente) | Traffico da link brevi già in uso (es. WhatsApp) |
| `getyourguide.com` | 0 (nuovo, azione §6.3) | Traffico/vendite dal portale |
| `civitatis.com` | 0 (nuovo, azione §6.3) | Traffico/vendite dal portale |
| `atrapalo.com` | 0 (nuovo, azione §6.4) | Traffico/vendite dal portale |
| `reddit.com` | 0 (nuovo, azione §6.5) | Referral da menzioni organiche |
| `perplexity.ai` | da aggiungere al controllo mensile | Citazione da Perplexity |

Metodo: in GA4, report Traffic Acquisition, dimensione `Session source / medium`, filtro per i domini sopra, cadenza mensile insieme al controllo manuale di cui sotto.

### 8.2 — Controllo manuale mensile: 10 query su ChatGPT e Perplexity

Le 10 query che un cliente reale userebbe, metà in spagnolo metà in inglese, a coprire entrambe le discipline (modelado/torno) ed entrambi i pubblici (locale e turistico/expat):

| # | Query (ES) |
|---|---|
| 1 | mejores talleres de cerámica en Barcelona |
| 2 | clases de cerámica en La Barceloneta |
| 3 | dónde aprender torno alfarero en Barcelona |
| 4 | clase de cerámica para principiantes en Barcelona precio |
| 5 | planes originales para hacer en pareja en Barcelona |

| # | Query (EN) |
|---|---|
| 6 | best pottery classes in Barcelona |
| 7 | pottery workshop near Barceloneta beach |
| 8 | wheel throwing classes Barcelona for tourists |
| 9 | fun couple activities Barcelona ceramics |
| 10 | drop-in pottery class Barcelona no experience needed |

**Metodo:** lanciare ciascuna query su ChatGPT (con ricerca web attiva) e su Perplexity, il primo lunedì lavorativo di ogni mese. Per ogni query registrare in una tabella: La Mesa compare sì/no, quale fonte viene citata (sito proprio, GBP, Tripadvisor, un articolo/guida, altro), quali concorrenti compaiono (Tierra, Born to Clay, ElTorn — vedi `04_COMPETITOR_ANALYSIS.md`). Tenere lo storico mese su mese nello stesso file per vedere se le azioni del §6 spostano il risultato — senza aspettarsi numeri di crescita garantiti: l'obiettivo è vedere La Mesa comparire dove oggi non compare, non una percentuale di miglioramento prestabilita.

---

*Documento scritto per l'esecuzione da parte di Andrea, Lau e Vick. Nessuna azione qui richiede modifiche al codice del sito, allo schema, a `robots.txt`, `llms.txt` o `pricing.md`.*
