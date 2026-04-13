# AUDIT UX/UI v2 -- La Mesa BCN

> Data: 2026-04-13
> Scope: index.html (ES), semanal-modelado.html, semanal-torno.html, suelta.html, css/style.css, js/booking.js
> Tipo: analisi senza modifiche -- confronto con audit v1 (2026-04-06)
> Skill utilizzata: UI/UX Pro Max (10 categorie, 99+ regole)

---

## 1. PROBLEMI CRITICI -- da fixare subito

| # | Problema | Dove | Regola Skill | Severita | Fix |
|---|---|---|---|---|---|
| ~~**C1**~~ | ~~**Nessun skip-link per navigazione tastiera**~~ | ~~Tutte le pagine~~ | `skip-links` | ~~CRITICO~~ | **RISOLTO 2026-04-13.** Skip-link aggiunto in 15 pagine (ES/EN/CA) + CSS `.skip-link` in style.css + `id="main-content"` su `<main>`. |
| **C2** | **Newsletter input `outline: none` senza sostituto custom visibile** | style.css:1625 `.newsletter-input` | `focus-states` (Accessibility #1) | CRITICO | L'input ha `outline: none` e come focus-state solo `box-shadow: 0 0 0 3px rgba(27,60,139,0.2)`. L'opacita 0.2 produce contrasto troppo debole su sfondo cream. Aumentare a `rgba(27,60,139,0.5)` o usare `:focus-visible` globale. |
| **C3** | **Booking API placeholder non funzionante** | js/booking.js:10 `BOOKING_API = 'URL_DEL_TUO_GAS_DEPLOY'` | `error-feedback` (Touch #2) | CRITICO | URL API e un placeholder. Tutte le pagine dinamiche faranno fetch a URL invalido. Inserire URL reale dopo deploy GAS. |
| ~~**C4**~~ | ~~**Prezzo strutturato errato per Clase Semanal de Torno**~~ | ~~semanal-torno.html:56~~ | `consistency` | ~~CRITICO~~ | **RISOLTO 2026-04-13.** JSON-LD corretto a `"price": "180"` in semanal-torno ES/EN/CA. |
| **C5** | **Emoji come icona nel bottone workshops** | index.html, bottone workshops | `no-emoji-icons` (Style #4) | ALTO | Bottone usa emoji come icona. Rendering varia tra OS. Sostituire con SVG icon. |
| **C6** | **Booking form usa placeholder-only come label** | js/booking.js form dinamici | `input-labels` (Forms #8), `form-labels` (Accessibility #1) | ALTO | Campi nome/email/telefono senza `<label>` ne `aria-label`. Viola WCAG 1.3.1 e 3.3.2. Aggiungere label visibili o `aria-label`. |

---

## 2. PROBLEMI MEDI -- da fixare presto

| # | Problema | Dove | Regola Skill | Severita | Fix |
|---|---|---|---|---|---|
| ~~**M1**~~ | ~~**Link cream su sfondo cream (torno suelta-banner)**~~ | ~~semanal-torno.html~~ | `color-contrast` | ~~ALTA~~ | **RISOLTO 2026-04-13.** Colore cambiato a `var(--yellow)` in semanal-torno ES/EN/CA. |
| **M2** | **Errori booking mostrati con `alert()` nativo** | booking.js:318, 323, 369, 374 | `error-feedback` (Touch #2) | MEDIA | `alert()` e bloccante, non stilizzato, inaccessibile. Usare `showToast()` gia presente in main.js. |
| **M3** | **Badge inline-style non manutenibile** | suelta.html:167 badge "Clase particular" | `consistency` (Style #4) | MEDIA | 7 proprieta CSS inline. Creare classe `.turno-card__badge--particular`. |
| **M4** | **Form booking senza `autocomplete` attributes** | booking.js campi generati | `autofill-support` (Forms #8) | MEDIA | Aggiungere `autocomplete="name"`, `autocomplete="email"`, `autocomplete="tel"`. |
| **M5** | **Newsletter form non ha submit-feedback** | index.html (2 form) | `submit-feedback` (Forms #8) | MEDIA | Post diretto a Mailchimp senza feedback visivo. Aggiungere disable + testo "Enviando..." al click. |
| **M6** | **Testi con `opacity` ridotta -- rischio contrasto** | style.css multiple posizioni (0.7-0.85) | `color-contrast` (Accessibility #1) | MEDIA | Opacity per gerarchia potrebbe violare 4.5:1 su testi piccoli. Verificare con tool e usare colori espliciti se necessario. |
| **M7** | **Mobile menu senza focus trap** | main.js hamburger toggle | `keyboard-nav` (Accessibility #1) | MEDIA | Focus puo andare a elementi sottostanti quando menu aperto. Aggiungere focus trap. |
| **M8** | **Hero image 748KB senza srcset/WebP** | index.html hero.jpg | `image-optimization` (Performance #3) | MEDIA | Servire immagine piu piccola su mobile. Fornire WebP + fallback JPG con `<picture>` e `srcset`. |
| **M9** | **Immagini tienda senza WebP** | index.html foto-tienda-1/2/3/4.jpg | `image-optimization` (Performance #3) | MEDIA | Estendere pattern `<picture>` WebP gia usato per nosotras. |
| **M10** | **Checkbox privacy 16x16px visivamente piccola** | style.css `.privacy-check input` | `touch-target-size` (Touch #2) | BASSA | Label wrapper ha min-height 44px (OK per tap), ma checkbox visivamente piccolo. Considerare 20x20px. |

---

## 3. MIGLIORAMENTI CONSIGLIATI

| # | Miglioramento | Regola Skill | Beneficio |
|---|---|---|---|
| **N1** | Self-hosting Montserrat (rimuovere Google Fonts CDN) | `third-party-scripts` | Privacy GDPR + performance |
| **N2** | `prefers-reduced-motion` esplicito per skeleton (mantenerla come colore statico) | `reduced-motion` | A11y: feedback loading anche con motion ridotto |
| **N3** | Consolidare colori inline hardcoded (`color:#888`) con token CSS | `color-semantic` | Manutenibilita design system |
| **N4** | `aria-live` per errori form booking | `aria-live-errors` | Screen reader annuncia errori |
| **N5** | Spinner CSS per bottone submit booking (`btn--loading`) | `loading-buttons` | Feedback visivo migliore durante checkout |
| **N6** | Hover opacity solo con `@media (hover: hover)` | `hover-vs-tap` | No flash opacity su tap mobile |
| **N7** | `role="img"` ridondante su div nosotras (gia c'e `<img>` con `alt`) | `voiceover-sr` | Screen reader non legge doppio |
| **N8** | Rimuovere immagini FOTO TIENDA maiuscole (duplicati ~16MB) | Deploy hygiene | Repo piu leggero |

---

## 4. CONFRONTO CON AUDIT PRECEDENTE (v1 -- 2026-04-06)

### Problemi RISOLTI

| ID v1 | Problema | Stato v2 |
|---|---|---|
| **C1** | Bottoni `.btn` sotto 44px | RISOLTO: `min-height: 44px` aggiunto |
| **C3** | CSS inline ripetuto in 9 pagine | RISOLTO: stili ora in style.css condiviso |
| **A1** | Nessun link "torna indietro" | RISOLTO: `.turno-back` in tutte le pagine intermedie |
| **M1** | Classe CSS `.turno-card__suelta` orfana | RISOLTO: rimossa |
| **M2** | Inline styles su "Sin plazas?" | RISOLTO: classe `.turno-card__waitlist` |
| **M5** | Link Clase Suelta rimosso da semanal | RISOLTO: `.turno-suelta-banner` aggiunto |
| **M6** | Hover opacity globale `a:hover { opacity: 0.8 }` | RISOLTO: regola globale rimossa |

### Problemi PERSISTENTI

| ID v1 | Problema | Stato v2 |
|---|---|---|
| **M3** | Font custom da verificare nel deploy | PERSISTENTE: verificare che /fonts/ sia nel deploy |
| **N5** | Self-hosting Montserrat | PERSISTENTE |
| **N6** | WebP per immagini | PARZIALE: nosotras fatto, hero + tienda ancora JPG-only |
| **N8** | Colori hardcoded inline | PARZIALE: token creati, ma alcuni inline restano |
| **A2** | Suelta: entrambe le card homepage puntano stessa pagina | PERSISTENTE by design (accettabile) |

### Problemi NUOVI (post-refactoring)

| ID v2 | Descrizione | Causa |
|---|---|---|
| **C3** | Booking API placeholder | Nuovo: booking.js aggiunto con URL placeholder |
| **C4** | Prezzo JSON-LD torno errato | Pre-esistente ma non segnalato in v1 |
| **C6** | Form booking senza label | Nuovo: form dinamici in booking.js |
| **M1** | Link cream su cream in torno suelta-banner | Nuovo: colore errato introdotto |
| **M2** | Alert nativo per errori booking | Nuovo: booking.js usa alert() |

---

## 5. PUNTEGGIO COMPLESSIVO PER CATEGORIA (1-10)

| # | Categoria | Punteggio | Note |
|---|---|---|---|
| 1 | **Accessibilita** | **6/10** | Focus-visible globale OK. Aria-labels tradotti. Manca: skip-link, newsletter focus debole, booking senza label, focus trap menu. |
| 2 | **Touch & Interaction** | **7/10** | Tutti i bottoni 44px+, `touch-action:manipulation`. Checkbox piccolo visivamente, alert() per errori. |
| 3 | **Performance** | **7/10** | Hero fetchpriority high, lazy load, nosotras WebP, skeleton loaders. Manca: hero srcset, tienda WebP, self-host Montserrat. |
| 4 | **Style Selection** | **8/10** | Design system coerente, palette limitata, card differenziate. Emoji come icona, badge inline-style. |
| 5 | **Layout & Responsive** | **9/10** | Mobile-first, breakpoints corretti, no h-scroll, container max-width, z-index scale. Eccellente. |
| 6 | **Typography & Color** | **8/10** | Base 16px, line-height 1.6-1.75, clamp() per headings, `max-width:65ch`. Token semantici. Opacity per gerarchia borderline. |
| 7 | **Animation** | **8/10** | Durate 150-300ms, transform+opacity, prefers-reduced-motion rispettato. Fade-in 600ms leggermente lungo. |
| 8 | **Forms & Feedback** | **5/10** | Area piu debole. Booking form senza label, errori via alert(), no submit-feedback newsletter, no inline validation. |
| 9 | **Navigation** | **8/10** | Active nav, back links, smooth scroll, deep linking, language switcher. Manca focus trap menu mobile. |
| 10 | **Charts & Data** | **N/A** | |

**Media ponderata: 7.3/10** (migliorata da ~6.5 stimato v1)

---

## Priorita suggerite per prossimo sprint

| # | ID | Task | Effort | Impatto |
|---|---|---|---|---|
| 1 | C3 | URL reale booking API | 2 min | Funzionalita |
| 2 | M1 | Fix colore link cream->blue in semanal-torno | 1 min | Visibilita |
| 3 | C4 | Fix prezzo JSON-LD torno 120->160 | 1 min | SEO |
| 4 | C1 | Skip-link | 15 min | A11y WCAG |
| 5 | C2 | Fix focus newsletter input | 5 min | A11y WCAG |
| 6 | C5 | Emoji -> SVG workshops | 10 min | Consistenza |
| 7 | C6 | Label form booking | 20 min | A11y WCAG |
| 8 | M2 | alert() -> showToast() | 15 min | UX |
| 9 | M8 | Hero WebP + srcset | 20 min | Performance |
| 10 | M7 | Focus trap menu mobile | 30 min | A11y |
