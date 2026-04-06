# Istruzioni Sito La Mesa — Fonte di Verita Tecnica

> Questo file viene letto da Claude Code ad ogni sessione.
> Contiene tutto il contesto necessario per lavorare sul sito senza domande.
> Ultimo aggiornamento: 2026-03-31

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
| Prenotazioni | Koalendar (link esterni) + WhatsApp |
| Etsy | https://www.etsy.com/es/shop/LaMesaLC |

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
│   ├── nosotras.jpg        # Sezione nosotras (4.5 MB) ⚠️ DA OTTIMIZZARE
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
├── privacy.html            # Politica privacy ES (noindex)
├── 404.html                # Pagina errore custom
├── sitemap.xml             # Sitemap con hreflang (ES, EN, CA + privacy)
├── robots.txt              # Allow: / — Disallow: /en/privacy.html
├── CNAME                   # lamesabcn.com
├── README.md               # Documentazione base
└── .claude/skills/         # Directory skills Claude Code
```

### Note critiche sui file

- **nosotras.jpg** e' 4.5 MB — troppo pesante per il web, da comprimere.
- Le 3 versioni linguistiche (ES, EN, CA) sono file HTML separati con contenuto tradotto manualmente. **Non esiste un sistema i18n automatico.**
- CSS e JS sono condivisi: un solo `style.css` e un solo `main.js` per tutte le lingue.
- EN e CA usano path relativi (`../css/style.css`, `../images/...`), ES usa path dalla root (`css/style.css`, `images/...`) o assoluti (`/images/...` per favicon).
- Le 9 pagine intermedie `/clases/` non hanno blocchi `<style>` inline — tutti gli stili sono nel CSS condiviso sotto il commento `/* ============ PAGINE CLASES ============ */`.

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
                > article.clase-card.clase-card--secondary (Coworking Torno)
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
        > div.tienda__product x3 (con fade-in delay progressivo)
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
6 domande FAQ identiche nelle 3 lingue (tradotte).

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
| **Taller Semanal** | Ceramica modelado | 120 EUR/mese | Principianti | Lun, Mar, Mer, Ven | Koalendar |
| **Taller Flex** | Ceramica modelado/torno | 120 EUR | Con esperienza | Flessibile | WhatsApp |
| **Intro al Torno** | Torno | 90 EUR (2 sessioni) | Principianti torno | Da concordare | WhatsApp |
| **Coworking Torno** | Torno | 20 EUR/ora | Ceramisti autonomi | Mar, Mer, Ven 14-18h | WhatsApp |
| **Clase Suelta** | Mesa o torno | 20 EUR/ora | Chiunque | Mar, Mer, Ven 14-18h | Koalendar |
| **Workshops creativi** | Varie discipline | Variabile | Tutti | Puntuali | Drive + WhatsApp |
| **Sessioni private** | Su misura | Preventivo | Gruppi max 10 | Da concordare | WhatsApp |
| **Vale-regalo** | Transversale | Variabile | Regalo | — | WhatsApp |

### Sistema di prenotazione

**Clase Semanal (abbonamento mensile) — Stripe Payment Links:**

| Tipo | Turno | Stripe Link |
|---|---|---|
| Modelado | Miercoles 16h | `https://buy.stripe.com/cNi8wRcdvdN29VfddebMQ05` |
| Modelado | Miercoles 18:30h | `https://buy.stripe.com/aFa4gB2CV4cs8RbgpqbMQ04` |
| Modelado | Jueves 11h | `https://buy.stripe.com/cNidRba5n8sI9VfehibMQ03` |
| Torno | Miercoles 16h | `https://buy.stripe.com/14A8wRa5n4cs7N7a12bMQ02` |
| Torno | Miercoles 18:30h | `https://buy.stripe.com/dRm4gBa5nfVa8RbgpqbMQ01` |
| Torno | Jueves 11h | `https://buy.stripe.com/28E7sN3GZgZe3wR1uwbMQ00` |

**Clase Suelta (prenotazione singola) — Cal.com:**

| Tipo | Cal.com Link |
|---|---|
| Modelado | `https://cal.com/la-mesa/clase-suelta-modelado` |
| Torno | `https://cal.com/la-mesa/clase-suelta-torno` |

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
- 6 domande/risposte tradotte nella lingua della pagina

### Sitemap (sitemap.xml)

5 URL indicizzate:
1. `https://www.lamesabcn.com/` — priority 1.0, con xhtml:link hreflang
2. `https://www.lamesabcn.com/en/` — priority 0.9, con xhtml:link hreflang
3. `https://www.lamesabcn.com/ca/` — priority 0.9, con xhtml:link hreflang
4. `https://www.lamesabcn.com/privacy.html` — priority 0.3
5. `https://www.lamesabcn.com/en/privacy.html` — priority 0.3

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
- **NON modificare i link Koalendar o WhatsApp** senza conferma esplicita del proprietario.
- **NON cambiare i prezzi** nei testi o nello structured data senza conferma.
- **NON toccare il form Mailchimp** (action URL, honeypot field name) — e' collegato a un account esterno.
- **NON creare nuovi file CSS o JS** — tutto deve restare in un singolo `style.css` e un singolo `main.js`.
- **NON usare `!important`** a meno che non sia strettamente necessario (al momento c'e' solo `#clases { padding-bottom: 0 !important }`).
- **NON rimuovere i commenti di sezione** nel CSS e HTML — servono per navigazione rapida.
- **NON aggiungere Google Analytics, cookie banner o tracker** senza richiesta esplicita.
- **NON committare file .DS_Store** (gia' presenti nel repo, da aggiungere a .gitignore).

---

## 9. Pendenti Noti

### Problemi da risolvere

1. ~~**hero.JPG estensione maiuscola**~~ — **RISOLTO**: il file e' gia' `hero.jpg` con estensione minuscola.

2. **nosotras.jpg troppo pesante** — 4.5 MB e' eccessivo per un'immagine web. Comprimere a ~200-300 KB max.

3. **Manca .gitignore** — I file `.DS_Store` sono nel repo. Creare un `.gitignore` con almeno `.DS_Store` e `*.swp`.

4. **Privacy page solo in ES** — Esiste `privacy.html` (ES) ma la versione EN (`/en/privacy.html`) e' linkata nel sitemap ma non presente nel repo. La versione CA (`/ca/privacy.html`) e' linkata dalla pagina CA ma non presente.

5. **Sitemap incompleta** — Manca `https://www.lamesabcn.com/ca/` nella privacy (ma la pagina CA non esiste ancora, vedi punto 4).

6. **robots.txt** — Disallow solo `/en/privacy.html`, non blocca `/privacy.html` ne' `/ca/privacy.html` (che hanno noindex nel meta ma non nel robots).

7. **Nessun favicon .ico** — Solo PNG. Alcuni browser vecchi potrebbero non trovare il favicon.

8. ~~**Font directory vuota**~~ — **RISOLTO**: la cartella `fonts/` contiene Garet-Black e HighCruiser, caricati via @font-face. Montserrat caricato da Google Fonts CDN.

### Miglioramenti possibili (non urgenti)

- Aggiungere `loading="lazy"` alle immagini tienda nelle versioni EN e CA (gia' presente in ES).
- Ottimizzare immagini in formato WebP con fallback.
- Aggiungere `<meta name="author">`.
- Self-hosting dei font Montserrat per eliminare dipendenza Google Fonts.
- Aggiungere `aria-label` piu' specifici al language switcher.

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
5. Testare link WhatsApp e Koalendar
6. Validare structured data con Google Rich Results Test

### Configurazione GitHub Pages

In **Settings > Pages**:
- Source: Deploy from a branch
- Branch: `main` / `/ (root)`
- Custom domain: `lamesabcn.com`
- Enforce HTTPS: Si

---

## Contatti Business

| Canale | Valore |
|---|---|
| Telefono | +34 711 55 20 30 |
| Email | lamesa.lc@gmail.com |
| Instagram | @lamesa.lc |
| Indirizzo | Carrer de l'Atlantida 47, Barceloneta, 08003 Barcelona |
| Coordinate | 41.3783, 2.1894 |
