# Istruzioni Sito La Mesa — Fonte di Verita Tecnica

> ⚠️ ATTENZIONE: questo file non deve contenere API keys, secrets o password.
> Tutti i valori sensibili vanno nelle DocumentProperties GAS. Mai committare credentials.

> Questo file viene letto da Claude Code ad ogni sessione.
> Contiene tutto il contesto necessario per lavorare sul sito senza domande.
> Ultimo aggiornamento: 2026-04-20 (bonifica: rimossi riferimenti Koalendar/Cal.com, canali reali allineati a Stripe+WhatsApp)

---

## 1. Descrizione Progetto e Stack

**Progetto:** Sito vetrina di La Mesa, studio di ceramica e laboratorio creativo a Barceloneta, Barcelona.
**Dominio:** lamesabcn.com (CNAME nel repo)
**Live:** https://www.lamesabcn.com

### Stack

| Componente | Dettaglio |
|---|---|
| HTML | HTML5 statico puro, nessun framework, nessun bundler |
| CSS | CSS3 con custom properties (design tokens), zero preprocessori |
| JavaScript | Vanilla ES6+ (IIFE), zero dipendenze npm |
| Font | Google Fonts — Montserrat (400, 600, 700, 900) |
| Hosting | GitHub Pages, deploy da branch `main`, root `/` |
| Dominio | lamesabcn.com via file `CNAME` |
| Newsletter | Mailchimp (form POST verso `lamesabcn.us1.list-manage.com`) |
| Prenotazioni | Stripe Checkout Sessions (dinamiche) + WhatsApp. GAS Booking.js backend, js/booking.js frontend |
| Etsy | https://www.etsy.com/es/shop/LaMesaLC |
| Cookie Banner | Cookiebot (CBID: `0c496daf-df8d-4640-8875-84e193803d9a`), `data-blockingmode="auto"`, primo script in `<head>` di ogni pagina |
| Pagamenti | Stripe (account La Mesa), Checkout Sessions dinamiche, webhook su GAS |
| Calendari | Google Calendar: Mesa + Torno (calendari separati, eventi automatici da prenotazioni) |

---

## 2. Struttura File Completa

```
lamesa-website/
├── index.html              # Pagina principale — versione ES (default, lang="es")
├── en/
│   └── index.html          # Versione EN (lang="en")
├── ca/
│   └── index.html          # Versione CA (lang="ca")
├── clases/
│   ├── semanal-modelado.html  # Pagina turni Clase Semanal Modelado (noindex)
│   ├── semanal-torno.html     # Pagina turni Clase Semanal Torno (noindex)
│   └── suelta.html            # Pagina scelta Clase Suelta (noindex)
├── en/
│   ├── index.html          # Versione EN (lang="en")
│   └── clases/
│       ├── semanal-modelado.html
│       ├── semanal-torno.html
│       └── suelta.html
├── ca/
│   ├── index.html          # Versione CA (lang="ca")
│   └── clases/
│       ├── semanal-modelado.html
│       ├── semanal-torno.html
│       └── suelta.html
├── css/
│   └── style.css           # Design system completo + stili pagine clases
├── js/
│   └── main.js             # Navbar, scroll, lazy load, toast, smooth scroll (267 righe)
├── images/
│   ├── hero.jpg            # Hero background (747 KB)
│   ├── nosotras.jpg        # Sezione nosotras (237 KB, ottimizzato)
│   ├── nosotras.webp       # Versione WebP (201 KB)
│   ├── pieza-01.jpg        # Tienda grid (139 KB)
│   ├── pieza-02.jpg        # Tienda grid (116 KB)
│   ├── pieza-03.jpg        # Tienda grid (91 KB)
│   ├── og-lamesa.jpg       # Open Graph image (89 KB, 1200x630)
│   ├── og-placeholder.svg  # Placeholder OG (non usato)
│   ├── logo-lamesa.png     # Logo navbar (68 KB)
│   ├── favicon-16.png      # Favicon 16x16
│   ├── favicon-32.png      # Favicon 32x32
│   └── favicon-180.png     # Apple touch icon 180x180
├── fonts/                  # Font custom: Garet-Black.woff2, HighCruiser.woff2
├── blog/
│   ├── index.html          # Blog index
│   ├── que-esperar-primera-clase-ceramica.html   # Post 1 ES
│   ├── guia-talleres-ceramica-barcelona.html     # Post 2 ES
│   ├── que-es-el-torno-ceramica.html             # Post 3 ES
│   ├── cosas-que-hacer-en-barceloneta.html       # Post 4 ES
│   ├── plan-diferente-barcelona-ceramica.html    # Post 5 ES
│   ├── ceramica-para-principiantes-barcelona.html # Post 6 ES
│   ├── what-to-expect-first-pottery-class.html   # Post 1 EN
│   ├── ceramics-classes-barcelona-guide.html     # Post 2 EN
│   ├── wheel-throwing-barcelona-beginners.html   # Post 3 EN
│   ├── things-to-do-barceloneta-barcelona.html   # Post 4 EN
│   ├── unique-date-ideas-barcelona-pottery.html  # Post 5 EN
│   ├── pottery-for-beginners-barcelona.html      # Post 6 EN
│   ├── que-esperar-primera-classe-ceramica.html  # Post 1 CA
│   ├── guia-tallers-ceramica-barcelona.html      # Post 2 CA
│   ├── torn-ceramica-barcelona-guia.html         # Post 3 CA
│   ├── pla-diferent-barcelona-ceramica.html      # Post 5 CA
│   ├── ceramica-per-a-principiants-barcelona.html # Post 6 CA
│   ├── como-elegir-taller-ceramica-barcelona.html # Post 7 ES
│   ├── how-to-choose-pottery-class-barcelona.html # Post 7 EN
│   ├── com-triar-taller-ceramica-barcelona.html   # Post 7 CA
│   ├── cuanto-cuesta-clase-ceramica-barcelona.html # Post 8 ES
│   ├── pottery-class-prices-barcelona.html        # Post 8 EN
│   └── preu-classe-ceramica-barcelona.html        # Post 8 CA
├── gracias.html            # Pagina post-checkout ES (noindex)
├── en/
│   └── gracias.html        # Pagina post-checkout EN (noindex)
├── ca/
│   └── gracias.html        # Pagina post-checkout CA (noindex)
├── team-building.html      # Landing page Team Building ES
├── privacy.html            # Politica privacy ES (noindex)
├── 404.html                # Pagina errore custom
├── sitemap.xml             # Sitemap con hreflang (ES, EN, CA + privacy)
├── robots.txt              # Allow: / — Disallow: /en/privacy.html
├── CNAME                   # lamesabcn.com
├── README.md               # Documentazione base
└── .claude/skills/         # Directory skills Claude Code
```

### Note critiche sui file

- **nosotras.jpg** ottimizzato: 237 KB (JPG) + 201 KB (WebP). Tag `<picture>` con fallback in tutti i file index.html.
- Le 3 versioni linguistiche (ES, EN, CA) sono file HTML separati con contenuto tradotto manualmente. **Non esiste un sistema i18n automatico.**
- CSS e JS sono condivisi: un solo `style.css` e un solo `main.js` per tutte le lingue.
- EN e CA usano path relativi (`../css/style.css`, `../images/...`), ES usa path dalla root (`css/style.css`, `images/...`) o assoluti (`/images/...` per favicon).
- Le 9 pagine intermedie `/clases/` non hanno blocchi `<style>` inline — tutti gli stili sono nel CSS condiviso sotto il commento `/* ============ PAGINE CLASES ============ */`.
- **Cache-busting:** `style.css?v=8`, `booking.js?v=7`, `main.js?v=5`. Incrementare ad ogni modifica.
- **Suelta cards:** ogni card ha `<details class="suelta-card__info">` con descrizione espandibile (ES/EN/CA). Quando si apre una card, il JS svuota il contenuto delle altre (cal/times/checkout).
- **Cookiebot** è il primo script in `<head>` di tutte le 45 pagine HTML (CBID: `0c496daf-df8d-4640-8875-84e193803d9a`). In `privacy.html` c'è anche lo script `CookieDeclaration` per la tabella cookie automatica. Script `booking.js` e `main.js` hanno `data-cookieconsent="ignore"` per evitare che Cookiebot blocchi i fetch verso `script.google.com`.

---

## 3. Design System Completo

### 3.1 Colori (CSS Custom Properties)

```css
--cream:  #FFFAEE    /* Sfondo principale body, navbar, sezioni chiare */
--yellow: #F7B137    /* Primario brand — CTA, hero bg fallback, WhatsApp btn, workshops bg */
--blue:   #1B3C8B    /* Secondario — privadas bg, testi titoli, card torno */
--pink:   #E84159    /* Accento — clase-suelta banner, tag privadas */
--black:  #1A1A1A    /* Testo principale, navbar, sezione contacto bg */
--white:  #FFFFFF    /* Sfondo nosotras, tienda, card secondary */
```

**Colori neutrali (CSS Custom Properties):**
```css
--color-muted:          #888  /* Testo catalano inline, turno-nota */
--color-text-secondary: #555  /* Body text card secondary, turno-nota__wa */
--color-text-tertiary:  #444  /* FAQ answer, testo privacy */
--color-dark:           #333  /* Hover di btn--dark */
--color-text-light:     #666  /* Testo 404 */
```

**Colori derivati (hardcoded, non variabili):**
- `#e09e28` — hover di btn--primary

### 3.2 Tipografia

```css
--font-heading: 'Garet', 'Montserrat', sans-serif   /* Garet Black 900 — titoli h1, h2 */
--font-sub:     'HighCruiser', 'Montserrat', sans-serif  /* HighCruiser 400 — sottotitoli h3 */
--font-body:    'Montserrat', sans-serif              /* Body text, UI */
```

**Font custom caricati via @font-face:** Garet-Black.woff2, HighCruiser.woff2 dalla cartella `/fonts/`.

**Stessa font per heading e body.** Pesi usati: 400 (body), 600 (h3, nav link), 700 (btn, labels), 900 (h1, h2, card title).

| Elemento | font-size | font-weight | Note |
|---|---|---|---|
| h1 | `clamp(2.25rem, 5vw, 4rem)` | 900 | Hero title override: `clamp(2.5rem, 6vw, 5rem)` |
| h2 | `clamp(1.75rem, 3.5vw, 2.75rem)` | 900 | |
| h3 | `clamp(1rem, 2vw, 1.25rem)` | 600 | `text-transform: uppercase; letter-spacing: 0.08em` |
| p | `1rem` | 400 | `line-height: 1.75; max-width: 65ch` |
| navbar link | `0.875rem` | 600 | `text-transform: uppercase; letter-spacing: 0.06em` |
| clase-card title | `1.3rem` | 900 | |
| clase-suelta title | `1.6rem` (mobile) / `2rem` (768px+) | 900 | |

### 3.3 Spacing Scale (CSS Custom Properties)

```css
--space-xs:  8px
--space-sm:  16px
--space-md:  24px
--space-lg:  48px
--space-xl:  80px
--space-2xl: 120px
```

**Override responsive:**

| Breakpoint | --space-xl | --space-2xl | --container-pad |
|---|---|---|---|
| Desktop (default) | 80px | 120px | 24px |
| <= 1024px | 60px | 80px | 20px |
| <= 768px | 48px | 64px | 16px |
| <= 375px | (invariato) | (invariato) | 12px + --space-lg: 32px |

### 3.4 Layout

```css
--container-max: 1280px
--container-pad: 24px   /* responsive, vedi sopra */
--nav-height: 64px
```

### 3.5 Border Radius

```css
--radius-sm:   8px
--radius-md:   16px
--radius-lg:   24px
--radius-pill: 100px
```

### 3.6 Transitions

```css
--transition-fast: 150ms ease
--transition-base: 200ms ease
--transition-slow: 300ms ease
```

### 3.7 Z-index Scale

```css
--z-base:    10
--z-overlay: 20
--z-modal:   30
--z-nav:     50
--z-fixed:   999
```

### 3.8 Breakpoint

| Nome | Media query | Uso |
|---|---|---|
| Small mobile | `max-width: 375px` | Container pad 12px, hero title 2rem, tienda grid 1col |
| Mobile | `max-width: 600px` | section--lg padding 48px, clase-card padding 20px, clase-card grid 1col |
| Tablet | `max-width: 768px` | Hamburger visibile, nav links nascosti, tienda grid 2col, contacto grid 1col |
| Tablet large | `max-width: 1024px` | Nosotras 1col, contacto grid 2col, spacing ridotto |
| Desktop | `min-width: 1024px` | Clases bloques row layout |

### 3.9 Classi CSS Principali

**Layout:**
- `.container` — max-width 1280px, margin auto, padding laterale
- `.section` — padding: var(--space-xl) 0 (80px default)
- `.section--lg` — padding: var(--space-2xl) 0 (120px default)
- `.grid-2`, `.grid-3` — grid helper
- `.flex-center`, `.text-center`

**Animazioni:**
- `.fade-in` — opacity 0, translateY(24px), transition 0.6s
- `.fade-in.visible` — opacity 1, translateY(0) (aggiunto via IntersectionObserver)
- `.fade-in--delay-1` (0.1s), `--delay-2` (0.2s), `--delay-3` (0.3s)
- Override dentro `.turno-grid`: delay-1 (0.05s), delay-2 (0.1s) — piu' rapidi per pagine con poche card

**Bottoni:**
- `.btn` — base: inline-flex, padding 14px 28px, min-height 44px, border-radius pill, font-weight 700, font-size 0.9375rem
- `.btn--primary` — bg yellow, color black
- `.btn--dark` — bg black, color cream
- `.btn--secondary` — transparent, border cream
- `.btn--white` — bg white, color blue
- `.btn--outline-dark` — border blue, color blue, bg transparent (padding 16px 32px, font-size 1rem)

**Card classi:**
- `.clase-card` — border-radius 24px (--radius-lg), padding 24px
- `.clase-card--primary` — bg yellow (ceramica)
- `.clase-card--torno-primary` — bg blue (torno)
- `.clase-card--secondary` — bg white, border 1.5px solid rgba(27,60,139,0.15)
- `.clase-card__cta` — min-height 44px (tap target), font-size 0.85rem, uppercase

**Pagine intermedie /clases/ (CSS in style.css, sezione PAGINE CLASES):**
- `.turno-back` — breadcrumb, bg cream, padding-top var(--space-sm)
- `.turno-back a` — display inline-block, padding 12px 0 (tap target), color blue, font-weight 600
- `.turno-hero` — bg cream, text-align center, padding xl/lg
- `.turno-explainer` — text-align center, bg cream
- `.turno-explainer__banner` — bg blue, border-radius md, max-width 800px
- `.turno-grid` — grid repeat(3, 1fr), collapse a 1fr sotto 768px
- `.turno-grid--2col` — grid 1fr 1fr (pagine suelta), collapse a 1fr sotto 600px
- `.turno-card` — border-radius lg, padding md, flex column, hover translateY(-4px)
- `.turno-card--modelado` — bg yellow; `.turno-card--torno` — bg blue
- `.turno-card__waitlist` — display flex, align-items center, min-height 44px (tap target), font-size 0.8rem
- `.turno-suelta-banner` — text-align center, margin-top md
- `.turno-nota` — text-align center, padding-bottom xl
- `.turno-nota--suelta` — padding-bottom calc(xl + 80px) per evitare overlap con WhatsApp floating button
- `.turno-nota__wa` — inline-flex, pill border, min-height 44px

**Newsletter:**
- `.newsletter-form` — flex wrap, gap 8px
- `.newsletter-form--inline` — nowrap (usato in workshops)
- `.newsletter-input` — pill shape, border 2px solid blue, padding 14px 20px
- `.newsletter-btn` — pill, bg yellow, padding 14px 24px
- `.privacy-check` — flex, font-size 0.8rem, color blue
- `.privacy-check--light` — per footer (sfondo scuro)

---

## 4. Architettura Sezioni

Tutte e 3 le versioni linguistiche hanno la **stessa identica struttura HTML**. Cambiano solo i testi, gli aria-label e i link WhatsApp (testo pre-compilato nella lingua).

### Ordine sezioni e anchor ID

| # | Anchor ID | Classe sezione | Background | Presente in nav |
|---|---|---|---|---|
| 1 | `#inicio` | `.hero` | var(--yellow) + immagine | No (logo scroll-to-top) |
| 2 | `#nosotras` | `.nosotras .section` | var(--white) #FFFFFF | No |
| 3 | `#clases` | `.clases .section--lg` | var(--cream) #FFFAEE | Si |
| 4 | `#workshops` | `.workshops .section--lg` | var(--yellow) #F7B137 | Si |
| 5 | `#tienda` | `.tienda .section--lg` | var(--white) #FFFFFF | Si |
| 6 | `#privadas` | `.privadas .section--lg` | var(--blue) #1B3C8B | Si |
| 7 | `#faq` | `.faq .section--lg` | var(--cream) #FFFAEE | Si |
| 8 | `#artistas` | `.artistas .section--lg` | var(--cream) #FFFAEE | No |
| 9 | `#contacto` | `.contacto` | var(--black) #1A1A1A | Si |

### Struttura dettagliata per sezione

**#inicio (Hero)**
```
section.hero > div.hero__bg > img.hero__bg-img
             > div.hero__overlay
             > div.hero__content > h1.hero__title
                                 > p.hero__subtitle
                                 > p.hero__subtitle-ca (testo catalano inline)
                                 > a.btn.btn--primary (WhatsApp CTA)
```
- Immagine hero: `fetchpriority="high"`, no lazy load
- Hero min-height: 90vh (80vh su mobile)

**#nosotras**
```
section.nosotras.section > div.container > div.nosotras__inner (grid 2 col)
    > div.nosotras__text.fade-in > h2 + p + p.nosotras__ca
    > div.nosotras__image.fade-in.fade-in--delay-1 > img
```

**#clases**
```
section.clases.section--lg > div.container
    > div.clases__header.fade-in > h2
    > div.clases__bloques (flex col, row su desktop)
        > div.clases__bloque (Ceramica)
            > p.clases__bloque-label
            > div.clases__bloque-grid (1col mobile, 2col 600px+)
                > article.clase-card.clase-card--primary (Taller Semanal)
                > article.clase-card.clase-card--secondary (Taller Flex)
        > div.clases__bloque.clases__bloque--torno (Torno)
            > p.clases__bloque-label
            > div.clases__bloque-grid
                > article.clase-card.clase-card--torno-primary (Intro al Torno)
    > div.clase-suelta.fade-in (banner separato)
        > div.clase-suelta__inner
            > div.clase-suelta__text > p.clase-suelta__eyebrow + h3 + p
            > a.clase-suelta__cta
```

**#workshops**
```
section.workshops.section--lg > div.container > div.workshops__inner.fade-in
    > h2
    > p.workshops__subheadline
    > div.workshops__ctas > a.btn.btn--dark (Drive link) + a.btn.btn--outline-dark (WhatsApp)
    > div.workshops__newsletter
        > p.workshops__newsletter-label
        > form.newsletter-form.newsletter-form--inline (Mailchimp)
        > label.privacy-check
```

**#tienda**
```
section.tienda.section--lg > div.container
    > div.tienda__header.fade-in > h2 + p.tienda__subheadline + p.tienda__text
    > div.tienda__grid (3col, 2col tablet, 1col small mobile)
        > div.tienda__product x4 (con fade-in delay progressivo, foto-tienda-1/2/3/4.jpg)
    > div.tienda__gift.fade-in (vale-regalo box)
    > div.tienda__ctas.fade-in > a.btn.btn--dark#etsy-link
```

**#privadas**
```
section.privadas.section--lg > div.container > div.privadas__inner.fade-in
    > h2 + p.privadas__subheadline + p.privadas__body
    > div.privadas__tags > span.privadas__tag x5 + span.privadas__tag.privadas__tag--ca
    > a.btn.btn--primary (WhatsApp CTA con icona SVG)
```

**#faq**
```
section.faq.section--lg > div.container > div.faq__inner.fade-in
    > h2
    > div.faq__list
        > details.faq__item x6
            > summary.faq__question
            > p.faq__answer
```
10 domande FAQ identiche nelle 3 lingue (tradotte):
1. Quanto costano le classi
2. Materiali inclusi
3. Prenotazione online
4. Dove si trova La Mesa
5. Posso provare senza esperienza
6. Eventi privati / team building
7-9. (aggiunte apr 2026: location, esperienza, eventi privati)
10. Coworking di Torno (aggiunta apr 2026)

**#artistas**
```
section.artistas.section--lg > div.container > div.artistas__inner.fade-in
    > h2 + p.artistas__body + a.btn.btn--dark (mailto:lamesa.lc@gmail.com)
```

**#contacto (include footer)**
```
section.contacto > div.container
    > div.fade-in > h2
    > div.contacto__grid (3col desktop, 2col tablet, 1col mobile)
        > div.contacto__col x3 (indirizzo, email/social, CTA)
        > div.contacto__map (iframe Google Maps, grid-column 1/-1)
    > div.footer__newsletter (form Mailchimp + privacy check)
    > div.footer__bar (tagline ES + CA + copyright)
```

**Elementi globali fuori main:**
- `.whatsapp-btn` — fixed bottom-right (24px), 60px cerchio giallo, pulsante animato
- 2 blocchi `<script type="application/ld+json">` — LocalBusiness + FAQPage

### Varianti per lingua

| Elemento | ES (index.html) | EN (en/index.html) | CA (ca/index.html) |
|---|---|---|---|
| `<html lang>` | `es` | `en` | `ca` |
| Testi navbar | Clases, Workshops, Tienda, Privadas, FAQ, Contacto | Classes, Workshops, Shop, Private, FAQ, Contact | Classes, Tallers, Botiga, Privades, FAQ, Contacte |
| Lang switcher active | ES | EN | CA |
| WhatsApp text | Spagnolo url-encoded | Inglese url-encoded | Catalano url-encoded |
| CSS/JS path | `css/style.css`, `js/main.js` | `../css/style.css`, `../js/main.js` | `../css/style.css`, `../js/main.js` |
| Image path | `images/...` | `../images/...` | `../images/...` |
| Favicon path | `/images/...` (assoluto) | `../images/...` (relativo) | `../images/...` (relativo) |
| Privacy link | `/privacy.html` | `/en/privacy.html` | `/ca/privacy.html` |
| OG locale | `es_ES` | `en_GB` | `ca_ES` |
| Schema.org | Testi in spagnolo | Testi in inglese | Testi in catalano |

---

## 5. Servizi La Mesa — Canali di Prenotazione

### Servizi e prezzi

| Servizio | Categoria | Prezzo | Per chi | Giorni | Canale prenotazione |
|---|---|---|---|---|---|
| **Taller Semanal** | Ceramica modelado | 120 EUR/mese | Principianti | Lun, Mar, Mer, Ven | Sito web (Stripe) |
| **Taller Flex** | Ceramica modelado/torno | 120 EUR | Con esperienza | Flessibile | WhatsApp |
| **Intro al Torno** | Torno | 90 EUR (2 sessioni) | Principianti torno | Da concordare | WhatsApp |
| **Coworking Torno** | Torno | 20 EUR/ora | Ceramisti autonomi | Mar, Mer, Ven 14-18h | WhatsApp |
| **Clase Suelta** | Mesa o torno | 50/70 EUR | Chiunque | Jueves 16-18h | Sito web (Stripe) |
| **Workshops creativi** | Varie discipline | Variabile | Tutti | Puntuali | Drive + WhatsApp |
| **Sessioni private** | Su misura | Preventivo | Gruppi max 10 | Da concordare | WhatsApp |
| **Vale-regalo** | Transversale | Variabile | Regalo | — | WhatsApp |

### Sistema di prenotazione — Stripe Checkout Sessions (dinamiche)

Le prenotazioni semanal e suelta usano Stripe Checkout Sessions dinamiche (non Payment Links statici).

**Stripe Price IDs (live):**

| Slot | Prezzo | Price ID |
|---|---|---|
| Semanal Modelado Mer 16h | 120€ | `price_1TM1KmQgp3kTxQ2Zshm7YyT9` |
| Semanal Modelado Mer 18:30h | 120€ | `price_1TJGyWQgp3kTxQ2ZFJ855jlZ` |
| Semanal Modelado Jue 11h | 120€ | `price_1TJGytQgp3kTxQ2ZxOQ95YxB` |
| Semanal Torno Mer 16h | 180€ | `price_1TJGzVQgp3kTxQ2Z56D215Mc` |
| Semanal Torno Mer 18:30h | 180€ | `price_1TJH05Qgp3kTxQ2Z7SeeeJpx` |
| Semanal Torno Jue 11h | 180€ | `price_1TJH0LQgp3kTxQ2Zo1ZjQrxV` |
| Suelta Mesa | 50€ | `price_1TM1KoQgp3kTxQ2ZZsj08666` |
| Suelta Torno | 70€ | `price_1TM1KpQgp3kTxQ2ZICg92EqJ` |

**Coworking** — Solo WhatsApp, nessun link di prenotazione online.

### Link WhatsApp

Numero: **+34 711 55 20 30**
Base URL: `https://wa.me/34711552030`
Ogni CTA ha un `?text=` pre-compilato diverso nella lingua della pagina.

### Link esterni

| Destinazione | URL |
|---|---|
| Etsy shop | `https://www.etsy.com/es/shop/LaMesaLC` |
| Instagram | `https://instagram.com/lamesa.lc` |
| Workshops Drive | `https://drive.google.com/drive/folders/1skRVnl7KxyRohEVQ3QLtmfphP1Ny0Hpm?usp=sharing` |
| Email | `lamesa.lc@gmail.com` |

### Mailchimp Newsletter

Action URL: `https://lamesabcn.us1.list-manage.com/subscribe/post?u=e67dcaeb000f3ed6681a0ffc8&id=42df7f26b2&f_id=007fc3e1f0`
Honeypot field: `b_e67dcaeb000f3ed6681a0ffc8_42df7f26b2`
Presente in 2 posizioni: sezione workshops + footer.

---

## 6. Sistema di Spacing Attuale

### Padding per sezione (valori esatti dal CSS)

```css
/* Sezioni cream — 72px */
#nosotras  { padding-top: 72px; padding-bottom: 72px; }
#tienda    { padding-top: 72px; padding-bottom: 72px; }
#faq       { padding-top: 72px; padding-bottom: 56px; }
#artistas  { padding-top: 72px; padding-bottom: 56px; }

/* Sezioni colorate — 64px */
#workshops { padding-top: 64px; padding-bottom: 64px; }
#privadas  { padding-top: 64px; padding-bottom: 64px; }

/* Eccezioni */
#clases    { padding-bottom: 0 !important; }  /* section--lg default top = 120px */
#contacto  { padding: 80px 0 0; }             /* solo padding-top, footer gestisce il bottom */
#inicio    { min-height: 90vh; }               /* no padding esplicito, flex center */
```

### Note spacing

- `.section` base: padding 80px 0 (--space-xl)
- `.section--lg` base: padding 120px 0 (--space-2xl)
- I valori espliciti per ID **sovrascrivono** le classi `.section` e `.section--lg`
- `.clase-suelta` ha `margin-top: 16px` e `margin-bottom: 16px`
- `.clases__bloques` gap: 24px (16px sotto 1023px, 32px desktop row)
- `.workshops__ctas` margin-bottom: 40px
- `.faq__inner h2` margin-bottom: 40px
- `.tienda__header` margin-bottom: 80px (--space-xl)
- `.tienda__gift` margin: 0 auto 80px (--space-xl)
- `.footer__newsletter` padding: 48px 24px 40px

---

## 7. SEO — Stato Attuale

### Meta tags (per ogni versione linguistica)

Ogni pagina ha:
- `<title>` unico e tradotto
- `<meta name="description">` unico e tradotto (160-180 caratteri)
- `<link rel="canonical">` alla propria URL
- Hreflang completo: `es`, `en`, `ca`, `x-default` (punta a ES)
- Open Graph completo: type, title, description, url, image (con dimensioni), locale, site_name
- Twitter Card: summary_large_image con title, description, image
- Geo meta: `geo.region=ES-CT`, `geo.placename=Barcelona`, coordinate `41.3783;2.1894`
- `theme-color: #F7B137`

### Structured Data (JSON-LD)

Ogni pagina (ES, EN, CA) contiene 2 blocchi:

**1. LocalBusiness**
- @type: LocalBusiness
- Nome, indirizzo (Carrer de l'Atlantida 47, 08003), coordinate
- Telefono, email, immagine OG
- priceRange: "EUR"
- openingHoursSpecification: Lun 15-17, Mar 14-20:30, Mer 14-18, Ven 11-18
- sameAs: Instagram, Etsy
- hasOfferCatalog con 5 servizi (nome, descrizione, prezzo)

**2. FAQPage**
- 10 domande/risposte tradotte nella lingua della pagina (6 originali + 3 aggiunte apr 2026: location, esperienza, eventi privati + 1 Coworking Torno apr 2026)

### Sitemap (sitemap.xml)

URL indicizzate (aggiornato apr 2026):
- 3 homepage (ES/EN/CA) — priority 1.0/0.9 con hreflang
- 9 pagine /clases/ (3 classi × 3 lingue) — priority 0.7 con hreflang
- 1 blog index — priority 0.8
- 23 blog post (8 temi × 2-3 lingue) — priority 0.8 con hreflang
- 1 team-building.html — priority 0.8
- 2 privacy (ES/EN) — priority 0.3
- **Totale: 39 URL**

### robots.txt

```
User-agent: *
Allow: /
Disallow: /en/privacy.html
Sitemap: https://www.lamesabcn.com/sitemap.xml
```

### Pagine noindex

- `404.html` — `<meta name="robots" content="noindex">`
- `privacy.html` — `<meta name="robots" content="noindex">`
- `gracias.html` (ES/EN/CA) — `<meta name="robots" content="noindex">`
- Tutte le pagine `/clases/` — `<meta name="robots" content="noindex">`

---

## 8. Regole Operative

### DA FARE sempre

- **Modificare tutte e 3 le versioni linguistiche** quando si tocca struttura HTML, sezioni, classi o link. ES, EN e CA devono restare sincronizzate.
- **Usare le CSS custom properties** (`var(--yellow)`, `var(--space-md)`, ecc.) — mai hardcodare colori o spacing che hanno gia' una variabile.
- **Mantenere i valori esatti di spacing** per sezione come documentati sopra. Non usare `.section--lg` generico se la sezione ha override specifico.
- **Testare su mobile** — il sito e' mobile-first nella pratica. Breakpoint a 375px, 600px, 768px, 1024px.
- **Preservare l'accessibilita'** — aria-label su tutti i link, role="banner" su navbar, `<details>` per FAQ, prefers-reduced-motion rispettato.
- **Aggiornare sitemap.xml** se si aggiungono pagine.
- **Aggiornare lo structured data JSON-LD** in tutte e 3 le pagine se cambiano servizi, prezzi o orari.
- **Mantenere i tap target >= 44px** su mobile per tutti i bottoni e link interattivi.

### NON FARE mai

- **NON aggiungere dipendenze npm, framework CSS o JS** — il sito e' puro HTML/CSS/JS per scelta.
- **NON modificare i link Stripe (Price IDs, pagine /clases/) o WhatsApp** senza conferma esplicita del proprietario.
- **NON cambiare i prezzi** nei testi o nello structured data senza conferma.
- **NON toccare il form Mailchimp** (action URL, honeypot field name) — e' collegato a un account esterno.
- **NON creare nuovi file CSS o JS** — tutto deve restare in un singolo `style.css` e un singolo `main.js` (eccezione: `js/booking.js` per il sistema di prenotazione).
- **NON usare `!important`** a meno che non sia strettamente necessario (al momento c'e' solo `#clases { padding-bottom: 0 !important }`).
- **NON rimuovere i commenti di sezione** nel CSS e HTML — servono per navigazione rapida.
- **NON rimuovere GA4 o Meta Pixel** — installati e funzionanti (vedi sezione 11).
- **NON committare file .DS_Store** (gia' presenti nel repo, da aggiungere a .gitignore).

---

## 9. Pendenti Noti

### Problemi da risolvere

1. ~~**hero.JPG**~~ — **RISOLTO**
2. ~~**nosotras.jpg**~~ — **RISOLTO** (compresso + WebP)
3. **Manca .gitignore** — `.DS_Store` nel repo.
4. **Privacy page solo in ES** — EN (`/en/privacy.html`) esiste ma CA mancante.
5. **Sitemap** — aggiornare con pagine /clases/ hreflang.
6. **robots.txt** — Disallow solo `/en/privacy.html`.
7. **Nessun favicon .ico** — Solo PNG.
8. ~~**Font directory**~~ — **RISOLTO**

---

## 10. Sistema di Prenotazione (Booking System)

### Architettura

```
Browser → js/booking.js → GAS Web App API → Google Sheets (SLOTS, PRENOTAZIONI)
                                           → Stripe Checkout Sessions
                                           → GmailApp (email HTML branded)
                                           → Google Calendar (Mesa + Torno)
```

**GAS URL deploy:** `https://script.google.com/macros/s/AKfycbzo26tz9qK4nN-6IdCcaI2bxccvKJL08nUaVWZs1ozSpNMetAdh5z2gkw-GeCvOtGsK/exec`

### Componenti

**Frontend (Sito web):**
- `js/booking.js` — fetch API, calendario suelta, card semanal migliorate, checkout flow, i18n (ES/EN/CA), prefetch ASAP
- Pagine dinamiche: `semanal-modelado.html`, `semanal-torno.html`, `suelta.html` (×3 lingue)
- `gracias.html` (×3 lingue) — post-checkout con dettaglio slot da URL param
- CSS card suelta: `.suelta-cards` (grid 2col), `.suelta-card--mesa/--torno`, `.suelta-card__body--open` (fade-in)
- CSS calendario: `.cal__grid`, `.cal__day--available/selected/today`, `.cal__nav` (44×44px)
- CSS time pills: `.cal-times__pills`, `.cal-pill`, `.cal-pill--active`
- CSS semanal: `.turno-card__dots`, `.turno-card__dot--filled`, `.turno-card--completo`, `.turno-card__badge--urgent`
- `<details class="suelta-card__info">` — descrizione espandibile in ogni card suelta (ES/EN/CA)
- Performance: prefetch suelta (mesa+torno) e semanal a script load, timeout 8s, stale callback guard
- `data-cookieconsent="ignore"` su booking.js e main.js per evitare blocco Cookiebot

**Backend (GAS — repo `la-mesa-appscript`):**
- `Booking.js` — tutte le funzioni di booking (~900+ righe)
- `Codice.js` — doGet/doPost con action routing + webhook idempotenza
- `fetchSlots_()` — CacheService 60s per ridurre letture foglio SLOTS
- `fetchSlotDetail_()` — scansiona tutte le righe, preferisce `stato=aperto` tra duplicati
- `createCheckout_()` — logging completo, usa stripe_price_id da slot
- `handleStripeWebhook_()` — processa `checkout.session.completed`
- `confermaPosto_()` — LockService, incrementa posti, crea prenotazione, email, Calendar
- `creaEventoCalendar_()` — calendario Mesa o Torno in base a risorsa
- `inviaEmailCliente_()` — email HTML branded con card blu La Mesa (GmailApp, mittente "La Mesa")
- `notificaRagazze_()` — email notifica a lamesa.lc@gmail.com (mittente "La Mesa Reservas")

**Google Sheets:**
- Foglio `SLOTS`: slot_id, data, ora_inizio/fine, tipo, risorsa, posti_totali/occupati/liberi (formula), stato, prezzo, stripe_price_id, note
- Foglio `PRENOTAZIONI`: prenotazione_id, slot_id, data_prenotazione, cliente_nombre/email/telefono, canale, importo, stato, note

**Logica SLOTS — Semanal vs Suelta:**
- **Semanal** (6 righe permanenti): `data` vuota, `slot_id` formato `semanal_[risorsa]_[giorno]_[ora]`. Giorno in colonna `note`. Non scadono.
- **Suelta** (righe con data): solo **Jueves 16:00-18:00**, `slot_id` formato `YYYY-MM-DD_16:00_suelta_[risorsa]`. Mesa (8 posti, 50€) + Torno (2 posti, 70€). `stripe_price_id` inserito automaticamente da `generaSlotSuelta_()`.
- **Generazione**: `generaSlotSuelta(N)` aggiunge N settimane dal prossimo giovedì, con anti-duplicati. `resetSlotsSuelta(N)` cancella tutti e rigenera.

**Google Calendar:**
- Calendario Mesa: `56799356f8774916d556d0a5fe22fc89844d5e7478e5bff7d1f666e2ca2c8f5b@group.calendar.google.com`
- Calendario Torno: `6f8ab63ea9450068404e579a29f7e8f7bc918c59678542a3ab40ed6ce434128e@group.calendar.google.com`
- Account GAS (owner file): `andrea.pesce@zeroco2.eco`
- Ogni prenotazione confermata crea evento nel calendario corretto

**Stripe Webhook:**
- Endpoint: `[GAS_URL]?action=stripe_webhook`
- Evento: `checkout.session.completed`
- Anti-duplicati: CacheService con TTL 24h per `event_id` — skip se già processato
- Signing secret: `STRIPE_WEBHOOK_SECRET=<impostato nelle DocumentProperties GAS>`

### API Endpoints (GAS Web App)

**GET:**
- `?action=slots&tipo=semanal&risorsa=mesa` — slot aperti con posti liberi
- `?action=slots&tipo=suelta&risorsa=mesa` — slot suelta aperti
- `?action=slot_detail&slot_id=XXX` — dettaglio singolo slot
- `?action=ical` — feed iCal (.ics) con tutti gli slot aperti

**POST (body JSON `{action, payload}`):**
- `create_checkout` — crea Stripe Checkout Session → ritorna `checkout_url`
- `add_slot` — aggiunge nuovo slot
- `close_slot` / `open_slot` — cambia stato slot
- `manual_booking` — prenotazione manuale (WhatsApp/Airbnb/direct)

**POST (URL param `?action=stripe_webhook`):**
- Riceve eventi Stripe → `checkout.session.completed` → conferma posto + email + Calendar

### Flusso prenotazione

1. Utente apre pagina → JS fetcha slot da API → mostra card/calendario dinamici
2. Click "Reservar" → form inline (nome, email, telefono)
3. Submit → POST `create_checkout` → redirect a Stripe Checkout
4. Pagamento completato → Stripe webhook → `confermaPosto_()`:
   - Incrementa `posti_occupati` nello slot
   - Se pieno, stato → `chiuso`
   - Aggiunge riga in PRENOTAZIONI
   - Email HTML branded al cliente (GmailApp)
   - Email notifica a lamesa.lc@gmail.com
   - Evento Google Calendar (Mesa o Torno)
5. Redirect a `gracias.html?slot=XXX`

### DocumentProperties necessarie (GAS)

- `STRIPE_SECRET_KEY`: chiave live Stripe `sk_live_...`
- `STRIPE_WEBHOOK_SECRET`: `<impostato nelle DocumentProperties GAS>`
- `DASHBOARD_TOKEN`: per dashboard KPI

**⚠️ REGOLA CRITICA:** Non sovrascrivere mai STRIPE_SECRET_KEY o STRIPE_WEBHOOK_SECRET con 'PASTE_HERE'. Sono già impostate nelle DocumentProperties. La funzione `setStripeProperties()` ha placeholder — NON eseguirla.

### Funzioni manuali (eseguire da editor Apps Script)

| Funzione | Cosa fa |
|---|---|
| `generaSlotSuelta(N)` | Aggiunge N settimane di slot suelta Jueves (default 4) |
| `resetSlotsSuelta(N)` | Cancella tutti suelta + rigenera N settimane (default 8) |
| `fixSueltaPriceIds()` | Backfill stripe_price_id su slot suelta esistenti |
| `sincronizzaPrenotazioniCalendar()` | Crea eventi Calendar per prenotazioni confermate |
| `auditSlots()` | Verifica duplicati e stato slot |
| `rimuoviDuplicatiSlots()` | Elimina righe duplicate (mantiene aperto) |
| `clearSlotsCache()` | Svuota cache GAS 60s |
| `testCreateCheckout()` | Test end-to-end checkout con primo slot suelta aperto |
| `testCalendarBasic()` | Test scrittura su entrambi i calendari |
| `warmUp()` | Chiamata da trigger ogni 5 min |
| `setupWarmUpTrigger()` | Installa trigger warm-up |
| `listProperties()` | Mostra chiavi DocumentProperties (senza valori) |

### Prenotazioni manuali registrate

Nel foglio PRENOTAZIONI:
- Tori | tel 695052393 | semanal_mesa_mer_1830 | whatsapp
- Valerie | valerie.jaeck@gmail.com | tel 4915731631759 | semanal_mesa_mer_16 | whatsapp
- Jazmin | jbalegh@gmail.com | tel 613949398 | semanal_torno_mer_16 | whatsapp
- Elise | elisedespert@gmail.com | tel +33630472452 | semanal_mesa_mer_16 | whatsapp

### Modifiche sessione 13 apr 2026

- **Coworking Torno**: rimosso da sezione #clases → ora solo in FAQ (domanda dedicata in tutte e 3 le lingue + JSON-LD)
- **Tienda**: foto sostituite con foto-tienda-1/2/3/4.jpg (convertite da HEIC, ottimizzate 38-140 KB). Grid ora 4 immagini.
- **/team-building.html**: landing page team building creata (ES), link nel footer di tutti e 3 i file index.html
- **Blog**: 6 nuovi post creati (como-elegir-taller ES/EN/CA + precios ES/EN/CA), totale 24 file in /blog/ (23 post + index)
- **Sitemap**: aggiornata con tutti i post blog + team-building (39 URL totali)

### PWA Reservas (Sprint 1-4 — apr 2026)

**Repo:** `queondache/la-mesa-reservas`
**URL:** https://queondache.github.io/la-mesa-reservas/
**Hosting:** GitHub Pages (`docs/`)
**Stack:** HTML statico + CSS3 + JS vanilla (single file `docs/index.html`)
**Auth:** PIN 4 cifre in DocumentProperties GAS (`PWA_RESERVAS_PIN`)

**Tab implementati:**
- **Hoy** — prenotazioni di oggi, contatori, sezione "Subscripciones por vencer", bottoni WA/tel/email, badge scadenza, bottone ✕ cancella
- **Mes** — calendario mensile con dots, tap giorno → dettaglio slot con barra occupazione, lista clienti espandibile, frecce ◀ ▶ navigazione giorno, bottone + Añadir
- **Turnos** — 6 turni semanal con lista clienti completa inline (NON richiede fetch extra), copia lista WhatsApp, bottone "+ Añadir alumna", bottone ✕ cancella

**Architettura Sprint 4 — mega endpoint:**
- UNA sola fetch `init_pwa_reservas` al login → ritorna TUTTO (today, week, month, turnos, expiring)
- Legge ogni foglio Sheets UNA volta, costruisce tutti i dati in memoria
- Zero fetch navigando tra tab — tutto dalla cache
- Refresh automatico ogni 10 minuti con singola chiamata
- Solo azioni (add/edit/cancel) fanno POST, poi reload completo

**Endpoint GAS GET (Codice.js doGet):**
- `?action=init_pwa_reservas` — **mega endpoint** con tutti i dati (Sprint 4)
- `?action=today_bookings` — prenotazioni di oggi (legacy)
- `?action=slot_bookings&slot_id=X` — clienti per slot (legacy)
- `?action=week_slots&date=YYYY-MM-DD` — slot settimanali (usato per mesi diversi)
- `?action=month_slots&month=YYYY-MM` — slot mensili (usato per mesi diversi)
- `?action=expiring_subscriptions&days=N` — abbonamenti in scadenza
- `?action=verify_pin&pin=X` — verifica PIN

**Endpoint GAS POST (Codice.js doPost):**
- `update_booking` — modifica nome/email/tel prenotazione
- `cancel_booking` — cancella prenotazione + libera posto
- `manual_booking` — prenotazione manuale

**Email trigger:** `setupDailyRecapTrigger()` — dailyRecap alle 8:00 con chi viene oggi + abbonamenti in scadenza

**Performance:** 1 fetch init, timeout 15s, refresh 10 min, `testInitPwa()` per debug performance

**Setup:** `PWA_RESERVAS_PIN` in DocumentProperties GAS → redeploy. Email: `setupDailyRecapTrigger()`.

### Pendenti futuri

- Privacy page EN e CA (mancanti)
- Sitemap: aggiornare con pagine /clases/ (noindex non serve, ma hreflang sì)
- Google Business Profile: verifica in corso
- PWA Reservas: gestione slot (apri/chiudi dalla PWA), dark mode
- Email mittente: ora è andrea.pesce@zeroco2.eco — ideale trasferire ownership GAS a lamesa.lc@gmail.com
- Coupon Stripe: funzionanti ma richiedono codice promozionale associato al coupon
- Blog: creare versioni EN/CA di team-building page
- Blog: verificare post CA mancante per "cosas que hacer en barceloneta"
- TripAdvisor: profilo da creare (Vick)

### Miglioramenti possibili (non urgenti)

- Ottimizzare altre immagini in formato WebP con fallback (nosotras già fatto)
- Self-hosting dei font Montserrat per eliminare dipendenza Google Fonts
- Aggiungere `aria-label` più specifici al language switcher

---

## 10. Deploy Workflow

### Setup

- **Hosting:** GitHub Pages
- **Branch:** `main`
- **Source:** root `/`
- **Custom domain:** `lamesabcn.com` (definito nel file `CNAME`)

### Procedura di deploy

```bash
git add .
git commit -m "feat: descrizione della modifica"
git push origin main
```

GitHub Pages si aggiorna automaticamente dal push su `main`. Non c'e' CI/CD, non ci sono build step, non c'e' bundling. I file vengono serviti cosi' come sono.

### Verifica post-deploy

1. Controllare https://www.lamesabcn.com/ — versione ES
2. Controllare https://www.lamesabcn.com/en/ — versione EN
3. Controllare https://www.lamesabcn.com/ca/ — versione CA
4. Verificare che le immagini si carichino (specialmente hero)
5. Testare link WhatsApp e flusso Stripe Checkout (/clases/semanal-*, /clases/suelta.html)
6. Validare structured data con Google Rich Results Test

### Configurazione GitHub Pages

In **Settings > Pages**:
- Source: Deploy from a branch
- Branch: `main` / `/ (root)`
- Custom domain: `lamesabcn.com`
- Enforce HTTPS: Si

---

## 11. Tracking & Analytics (installati apr 2026)

### Google Analytics 4

- **ID**: G-SQ90MD674K
- **Snippet**: nel `<head>` di tutti e 3 i file HTML (ES/EN/CA)
- **Eventi conversione**:
  - `click_cta` con label `taller_semanal` — sui 4 CTA Clase Semanal (modelado + torno)
  - `click_cta` con label `clase_suelta` — sui 4 CTA Clase Suelta (modelado + torno)
  - `click_whatsapp` — event delegation su tutti i link `wa.me/34711552030`
- **CTA IDs**: `id="cta-taller-semanal"` e `id="cta-clase-suelta"` sulla prima occorrenza (modelado)
- **Commit**: `2616841`

### Meta Pixel

- **ID**: 928743266641763
- **Snippet**: nel `<head>` di tutti e 3 i file HTML, dopo GA4
- **Eventi conversione**:
  - `fbq('track', 'Lead', {content_name: 'taller_semanal'})` — sui CTA Clase Semanal
  - `fbq('track', 'Lead', {content_name: 'clase_suelta'})` — sui CTA Clase Suelta
  - `fbq('track', 'Contact')` — event delegation su tutti i link WhatsApp
- **Commit**: `3df3780`

### Cache busting

- `style.css?v=8`, `booking.js?v=7`, `main.js?v=5` in tutti i file HTML
- Incrementare ad ogni modifica CSS/JS

### Ordine script nel `<head>`

```
1. Cookiebot (async, primo script assoluto)
2. GA4 loader (async)
3. GA4 config
4. Meta Pixel (IIFE + noscript fallback)
5. DOMContentLoaded — event delegation WhatsApp (gtag + fbq)
```

Nel `<body>` (fine pagina, solo pagine clases/gracias):
```
1. main.js (defer, data-cookieconsent="ignore")
2. booking.js (defer, data-cookieconsent="ignore")
```

---

## 12. Aggiunte SEO/GEO (apr 2026)

1. **Title tag keyword-first** in tutte e 3 le lingue:
   - ES: `Taller de Cerámica en Barcelona | La Mesa`
   - EN: `Ceramics Studio in Barcelona | La Mesa`
   - CA: `Taller de Ceràmica a Barcelona | La Mesa`

2. **Hero subtitle SEO** (`<p class="hero-subtitle">`) aggiunto sotto H1 poetico in tutte e 3 le lingue. Subtitles ridondanti (`hero__subtitle`, `hero__subtitle-ca`) rimossi.

3. **H2 aggiornati con keyword** in 4 sezioni:
   - Workshops: "Sesiones Creativas" → "Workshops creativos en Barcelona"
   - Tienda: "Tienda" → "Tienda de cerámica artesanal"
   - Privadas: "Sesiones Privadas" → "Sesiones privadas y team building"
   - Contacto: "Encuéntranos" → "Encuéntranos en La Barceloneta"

4. **3 nuove FAQ** aggiunte (location, esperienza, eventi privati) — HTML + JSON-LD sincronizzati. Duplicati rimossi apr 2026: FAQ #1/#4/#6 ridondanti eliminate, mantenute #7/#8/#9. Totale attuale: **6 FAQ per pagina**.

5. **FAQ arricchite per GEO** — risposte self-contained con brand name + citta' (es. "La Mesa se encuentra en..." invece di "Estamos en...").

6. **Copy tienda** — rimossi punti esclamativi.

- **Commit SEO/GEO**: `3ba4173`
- **Commit FAQ**: `ae33c64`

### Pendenti SEO/GEO (non ancora implementati)

- [x] robots.txt — Allow esplicito per GPTBot, PerplexityBot, ClaudeBot, Google-Extended
- [x] llms.txt — creato nella root del sito (servizi, location, contatti, orari, Etsy)
- [x] sitemap.xml — aggiornato con 9 pagine /clases/ + blog posts (ES/EN/CA) con hreflang
- [ ] Schema Course (JSON-LD) — aggiungere nelle 9 pagine /clases/
- [x] Blog statico — /blog/ creato con 17 post (6 ES + 6 EN + 5 CA), vedi sezione 13
- [x] nosotras.jpg — compresso a 237 KB + WebP 201 KB, tag `<picture>` aggiunto
- [ ] Google Business Profile — verifica in attesa

---

## 13. Blog (/blog/)

### Struttura

- `/blog/index.html` — indice blog con lista post (ES, con sezioni EN/CA)
- 17 post in totale: 6 ES + 6 EN + 5 CA
- Layout: container 760px, font-size 1.05rem, line-height 1.85
- Navbar e footer condivisi con homepage (stessa struttura)
- CSS/JS condivisi: `../css/style.css?v=2`, `../js/main.js?v=2`
- GA4 + Meta Pixel + WhatsApp click tracking installati

### Post pubblicati

| # | Tema | ES | EN | CA |
|---|------|----|----|-----|
| 1 | Primera clase ceramica | `que-esperar-primera-clase-ceramica.html` | `what-to-expect-first-pottery-class.html` | `que-esperar-primera-classe-ceramica.html` |
| 2 | Guia talleres Barcelona | `guia-talleres-ceramica-barcelona.html` | `ceramics-classes-barcelona-guide.html` | `guia-tallers-ceramica-barcelona.html` |
| 3 | Torno ceramica | `que-es-el-torno-ceramica.html` | `wheel-throwing-barcelona-beginners.html` | `torn-ceramica-barcelona-guia.html` |
| 4 | Cosas que hacer Barceloneta | `cosas-que-hacer-en-barceloneta.html` | `things-to-do-barceloneta-barcelona.html` | — |
| 5 | Plan diferente / date ideas | `plan-diferente-barcelona-ceramica.html` | `unique-date-ideas-barcelona-pottery.html` | `pla-diferent-barcelona-ceramica.html` |
| 6 | Ceramica per principianti | `ceramica-para-principiantes-barcelona.html` | `pottery-for-beginners-barcelona.html` | `ceramica-per-a-principiants-barcelona.html` |

### Structured Data blog

- Ogni post ha `Article` schema (JSON-LD) con headline, author, publisher, datePublished, dateModified, image, inLanguage, mainEntityOfPage.
- Tutti i post presenti in `sitemap.xml` con hreflang (ES/EN/CA).

### Note blog

- Post #4 (Barceloneta) non ha versione CA.
- Tutti i path nel blog usano `../` per CSS/JS/images (come EN/CA).
- CTA in fondo a ogni post: WhatsApp + link clases.

---

## Contatti Business

| Canale | Valore |
|---|---|
| Telefono | +34 711 55 20 30 |
| Email | lamesa.lc@gmail.com |
| Instagram | @lamesa.lc |
| Indirizzo | Carrer de l'Atlantida 47, Barceloneta, 08003 Barcelona |
| Coordinate | 41.3783, 2.1894 |
