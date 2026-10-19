# Homepage di test La Mesa — design

Data: 18/10/2026 · Decisore: Andrea · Base: intervista in chat (brainstorming) + bozze A/B/C
pubblicate su https://claude.ai/artifact/JhA4JWWJhsMg3s7AK8X7EH

## Perché

Il sito di oggi è organizzato per tipo di prodotto (11 blocchi su una pagina lunga, lezioni
spezzate in 4 sezioni, ristoranti assenti dal menu). Andrea: «è un casino seguire il flusso
delle informazioni e trovare quello che voglio». Obiettivo della sessione: «una pagina web da
premio». Per Andrea «stellare» significa prima di tutto **chiarezza per pubblico**: chi entra
(ristorante, corsi, ecommerce, aziende) deve sapere subito dove cliccare.

## Pubblici (in ordine di peso per la homepage)

1. **Turisti → Experiencias** (clase di 2 h). Oggi portano più soldi. Atterrano spesso già sulla
   pagina Experiencias, non sulla homepage.
2. **Alunni regolari → Cursos y bonos** (vivono a Barcellona, giorno e ora fissi).
3. **Regali → Tienda** (Shopify già online, picco a Natale) + vale-regalo.
4. **Aziende e grupos privados → team building** (poche richieste, fatturato alto). Le feste
   private (cumpleaños, despedidas, familias) restano, dentro questa porta.
5. **Ristoranti → encargos** (stoviglie su misura, arrivano dall'outreach email).

Ogni pubblico arriva quasi sempre da un canale suo direttamente sulla sua pagina: la homepage
smista chi entra senza meta e mostra ciò che è comune (studio vero in Barceloneta, 5 stelle,
fatto a mano).

## Obiettivi · non-obiettivi · anti-obiettivi

- **Obiettivo:** nuova homepage di **test**, in spagnolo, che unisce la bozza B (domanda
  «¿Qué te trae a La Mesa?» con risposte) e la bozza C (indice editoriale numerato), da far
  provare ad Andrea, Lau e Vick prima di sostituire la homepage vera.
- **Non-obiettivi:** sostituire `index.html`; tradurre in CA/EN/PT; ridisegnare le pagine
  dedicate («le singole pagine spesso vanno bene»); toccare il negozio Shopify.
- **Anti-obiettivi (fallimento anche se funziona):** l'utente resta bloccato dietro il blocco
  B; contenuti visibili solo dopo un clic (Google e ChatGPT devono leggere tutto nel codice);
  pagina lunga e confusa come oggi; aspetto da template generico.

## Decisioni di Andrea

1. Si riparte da zero: «c'è poco che salverei dell'attuale».
2. Si salvano: **footer** (sezione contatti + barra finale di oggi), **prima schermata** (foto
   dello studio, titolo «Lo mejor de la vida pasa alrededor de una mesa.», recensioni Google),
   **«cose AI»** (blocchi FAQ e dati strutturati per farsi citare).
3. **Workshops tolti** dal sito. **Coworking de torno non si fa più**: via ovunque nella pagina.
4. Aziende e ristoranti contattano **via modulo o email, sempre con opzione WhatsApp** accanto.
5. Il negozio è già online: la porta Tienda porta dritta a Shopify.
6. Crasi B+C: in cima il blocco B; **una X in alto a destra** lo chiude; sotto c'è la homepage
   stile C «un po' espansa». Le righe dell'indice restano come nella C (nessuna info in più per
   riga); il «di più» sono sezioni di homepage: chi siamo con foto delle ragazze e poche info
   generiche «essenziali e necessarie».
7. **Più FAQ** perché piacciono all'AI: 11 domande (lista sotto).
8. Ambizione: «pagina web da premio».

## Struttura della pagina

1. **Menu** fisso in alto: logo, hamburger su telefono; su computer le 5 porte come voci.
2. **Prima schermata** (dal sito di oggi): foto studio, titolo, sottotitolo, 5,0 ★ Google.
3. **Blocco B** «¿Qué te trae a La Mesa?», agganciato sotto la foto, con **X in alto a destra**.
   Risposte (pulsanti) → pannello con foto, 2 righe, dati chiave, un solo pulsante principale:
   - Probar la cerámica → `/experiencias/torno.html` (scelta tecnica e data lì) — da 45 €, 2 h
   - Aprender cada semana → `/clases/semanal-modelado.html` + `/clases/semanal-torno.html`, bono
     → `https://app.mesana.studio/book/la-mesa` — 120 €/mes
   - Un regalo → negozio Shopify `https://tienda.lamesabcn.com` + vale-regalo su WhatsApp
   - Mi empresa o grupo → `/team-building.html` + modulo/WhatsApp (include feste private)
   - Mi restaurante → `/encargos.html` + modulo/WhatsApp
   Prima risposta selezionata all'apertura: «Probar la cerámica».
4. **Indice C** numerato 01–05, righe apribili, Experiencias in giallo e aperta all'avvio,
   stessi testi brevi e stessi pulsanti del blocco B. Numerazione = ordine di peso, non
   decorazione.
5. **Quiénes somos:** foto delle ragazze + tre righe dai testi di «nosotras» di oggi.
6. **Reseñas:** tre recensioni Google **reali** + voto e totale (dato attuale: 5,0 · 41,
   rilevato il 22/09/2026; aggiornarlo è il punto 1 della lista TODO).
7. **Preguntas frecuentes** (fisarmonica, tutte nel codice, dati strutturati FAQPage):
   costo · materiali inclusi · prenotare online · dove siete · senza esperienza · eventi
   privati e team building · quando si ritira il pezzo · lingue delle lezioni · come funziona
   il vale-regalo · spedizioni dal negozio · stoviglie per ristoranti.
8. **Footer di oggi** (contatti, mappa, social, lingue): copre anche «dove siamo».

### Comportamento del blocco B — due varianti da provare

La homepage C è **sempre nella pagina** sotto il blocco, anche senza toccare niente.

- **Variante 1 «X + bottone»:** il blocco resta com'è; sotto c'è «Ver todo La Mesa ↓». La X o
  il bottone chiudono il blocco e la pagina scorre all'indice C.
- **Variante 2 «sparisce scorrendo»:** scorrendo, il blocco si riduce a una barretta con la
  domanda (toccandola si riapre); la X lo chiude subito.

Un interruttore visibile solo nella pagina di test passa da una variante all'altra.

## Vincoli

- Sito statico (GitHub Pages, repo `lamesa-website`); HTML + CSS + JS vanilla, nessun framework
  né dipendenza nuova.
- Marchio esistente: colori `--cream #FFFAEE`, `--yellow #F7B137`, `--blue #1B3C8B`,
  `--pink #E84159`, `--black #1A1A1A`; caratteri Garet (titoli), HighCruiser (accenti),
  Montserrat (testo); logo `images/logo-lamesa.png`.
- Telefono prima (390 px), poi computer; pulsanti ≥ 44 px; contrasto AA; rispetto di
  «riduci movimento»; X e risposte usabili da tastiera e lettori di schermo.
- Testi: solo quelli già presenti su sito, blog, negozio. Una risposta FAQ che non esiste da
  nessuna parte resta **segnata da completare**, mai inventata. Niente recensioni inventate.
- La pagina di test si prova su un **link privato** come le bozze (decisione di Andrea), non
  sul sito vero; si condivide dal menu Share.
- Tracciamento clic (gtag/fbq) come sulla homepage di oggi.

## Scelte del progettista (Claude, da verificare da Andrea)

- **Pulsanti per pannello:** «Aprender cada semana» ha due pulsanti di pari peso (Curso de
  modelado · Curso de torno) e un link secondario «o compra un bono de horas». Empresa e
  Restaurante: pulsante principale = la loro pagina; secondari = email + WhatsApp.
- **Modulo:** nella homepage di test niente modulo; contatto via email (indirizzo visibile e
  copiabile) + WhatsApp. Il modulo vero va nelle pagine team building ed encargos, lavoro a
  parte.
- **Recensioni:** le sceglie Claude dalla scheda Google pubblica di La Mesa (decisione di
  Andrea), solo nome di battesimo, testo esatto.
- **Workshops:** tolti dalla pagina di test (menu e contenuti). Toglierli dal resto del sito è
  un lavoro separato da aggiungere alla lista TODO.

## Lasciato a chi costruisce

Impaginazione su
computer; animazioni (una sola, sobria); come estrarre i testi dalle pagine esistenti; quale
foto usare per le ragazze se non arriva quella nuova (segnaposto: `images/nosotras.webp`,
Laura in studio); campi del modulo aziende/ristoranti (nome, email, messaggio) e dove arriva
l'invio, purché non serva un servizio nuovo a pagamento.

## Pronto quando

La pagina di test si apre al link privato condivisibile; entrambe le varianti funzionano
su telefono e computer; tutti i pulsanti portano alla pagina giusta; il testo completo
(indice, FAQ) è nel codice; controlli di accessibilità e velocità (Lighthouse) senza errori
gravi; Andrea, Lau e Vick l'hanno provata.

## Revisione 18/10/2026 sera (feedback di Andrea sulla v1)

- Prima schermata **stile C**: titolo sopra, foto incorniciata sotto (Andrea: «era più bella»).
- FAQ: in homepage solo 4 (costo, senza esperienza, prenotare online, dove), con link a una
  pagina dedicata `preguntas-frecuentes.html` con tutte le 11 e i dati strutturati.
- Questionario su computer: Andrea non convinto della posizione v1. Tre anteprime (D1 titolo |
  questionario affiancati, D2 questionario sulla foto, D3 copertina + questionario sotto);
  scelta di Andrea in attesa. Anteprime: https://claude.ai/artifact/U7MN9wKaNB99apAHkKdJJK

## Revisione 19/10/2026 — D3 scelta, quattro lingue (v3)

Andrea sceglie la **D3** e chiede: poco nero, pagina non caotica, attenzione al testo del
menu, tutto in ES/EN/CA/PT. Scelte del progettista (da verificare da Andrea):

- **Colore:** titoli e testo forte nel blu La Mesa; linee sottili blu; risposta scelta in blu;
  il giallo resta solo per l'azione principale e l'evidenziatore sotto «mesa.». Niente nero pieno
  (controllo automatico).
- **Calma:** l'indice 01–05 è solo testo (le foto stanno solo nella domanda), tutte le righe
  chiuse; la 01 ha il numero in giallo. Una foto diversa per ogni proposta, nessuna ripetuta.
- **Comportamento della domanda:** resta la variante 1 (X + «Ver todo La Mesa ↓»); tolti
  barretta e interruttore di prova.
- **Menu:** un solo vocabolario per lingua, uguale in menu, indice e footer (es. Experiencias ·
  Cursos · Tienda · Grupos y empresas · Restaurantes + «Reservar una clase»). Risposte alla
  domanda con verbi paralleli (Probar · Aprender · Hacer un regalo · Venir en grupo · Equipar
  mi restaurante). «Cursos» porta alla riga dell'indice con modelado e torno (non c'è una
  pagina riassuntiva). Lingue nel menu su computer e nel menu del telefono.
- **Lingue:** un modello unico (`dev/nueva-home/build.mjs` + `src/i18n.mjs` + `src/site.css`)
  genera home e FAQ in ES, EN (`en/`), CA (`ca/`), PT (`pt/`). Testi presi dalle versioni
  tradotte del sito. Le recensioni restano nell'originale spagnolo, con nota. PT non ha ancora
  cursi, team building ed encargos tradotti: quei link vanno alle pagine inglesi.
- **FAQ:** nei dati strutturati solo le risposte vere; le 2 `[COMPLETAR]` restano visibili ma
  fuori dal JSON-LD.

## Stato al 19/10/2026 sera (punto di ripresa)

- Pagine generate in `dev/nueva-home/` (8 file). Rigenerare con `node dev/nueva-home/build.mjs`.
  Controllo `node --test dev/nueva-home/check.test.mjs` verde 25/25. Lighthouse telefono:
  accessibilità 100, buone pratiche 100; SEO frenato solo dal `noindex` voluto.
- Link privato di prova (4 lingue): https://claude.ai/artifact/7zc1ZT96hz5VmUCDA3Xpki
- Aperti: prova di Andrea, Lau e Vick; 2 FAQ `[COMPLETAR]` (lingue lezioni, spedizioni
  negozio); foto Lau+Vick; revisione indipendente della v3; salvataggio nel repository del sito;
  tradurre in PT cursi/team building/encargos; poi decisione se sostituire le home vere.
