# Homepage di test La Mesa — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use `- [ ]`.

**Goal:** pagina di test in spagnolo che unisce bozza B (domanda con risposte, X) e bozza C
(indice 01–05 + sezioni homepage), con due varianti di comportamento, pubblicata su link privato.

**Architecture:** un file HTML autonomo (CSS e JS inline, vanilla) in `dev/nueva-home/`, che
riusa token, font e immagini del sito. Un controllo statico in Node verifica contenuti e link;
controllo visivo con Playwright a 390 e 1280 px. Pubblicazione come Artifact con le immagini
come file di supporto.

**Tech Stack:** HTML/CSS/JS vanilla, Node 24 (`node:test`), Playwright MCP.

**Spec:** `docs/superpowers/specs/2026-10-18-homepage-test-design.md`

## Global Constraints

- Nessuna dipendenza nuova; `index.html` e pagine dedicate non si toccano.
- Colori `#FFFAEE #F7B137 #1B3C8B #E84159 #1A1A1A`; font Garet / HighCruiser / Montserrat.
- Tap ≥ 44 px; contrasto AA; `prefers-reduced-motion`; X con `aria-label="Cerrar"`.
- Niente «coworking», niente «workshop» nel testo visibile.
- Testi solo da sito/blog/negozio; risposta mancante = `[COMPLETAR]` visibile, mai inventata.
- Recensioni: Luisa, Valerie, Jupa (testo Google esatto, estratti con «…»); voto «5,0 · 53».

## Review Focus

1. Utente che non tocca nulla e scorre: indice C e FAQ devono essere già nel DOM e visibili.
2. Tastiera: Tab raggiunge X, risposte, righe indice; Invio/Spazio le attiva.
3. Variante 2 con «riduci movimento»: niente animazione, la barretta compare comunque.
4. Telefono 360 px: niente scorrimento orizzontale (pulsanti risposta vanno a capo).
5. Link: ogni pulsante porta a un URL esistente del sito o a Shopify/Mesana/WhatsApp.

---

### Task 1: Controllo statico (prima rosso)

**Files:** Create `dev/nueva-home/check.test.mjs`

- [ ] Test `node --test dev/nueva-home/check.test.mjs` che legge `dev/nueva-home/index.html` e
  verifica: 5 `.chip`; 5 `details.row`; JSON-LD `FAQPage` con 11 `Question`; 11 `details.faq`;
  nessuna occorrenza di `coworking|workshop` (case-insensitive) fuori dai commenti; ogni `href`
  interno (`/…`) esiste come file in `sito/`; `button.who-close[aria-label="Cerrar"]`;
  `[data-variant-switch]`; testo «5,0» e «53».
- [ ] Esecuzione → FAIL (file assente).

### Task 2: Pagina

**Files:** Create `dev/nueva-home/index.html` (immagini con percorso `img/…`)

- [ ] Struttura spec §«Struttura della pagina» nell'ordine 1–8; testi dal sito di oggi.
- [ ] JS: `selectAnswer(id)`, `closeWho()`, `setVariant('boton'|'scroll')` (stato in
  `localStorage` con try/catch; default `boton`); variante scroll con `IntersectionObserver`.
- [ ] `node --test` → PASS.

### Task 3: Controllo visivo e pubblicazione

- [ ] Server locale su `dev/nueva-home/`, Playwright 390 e 1280 px, entrambe le varianti:
  screenshot, nessun errore in console, nessuno scorrimento orizzontale.
- [ ] Pubblicazione Artifact con `img/*`; link ad Andrea.
