# 01 — SEO Tech Audit — lamesabcn.com

**Data audit:** 2026-05-13
**Metodo:** ispezione statica filesystem locale (no live HTTP fetch)
**Scope:** 22 URL campionati (3 home + 9 clases + 3 blog index + 3 blog post + team-building + privacy ES/EN + 404)
**Repo:** `/Users/andreapesce/Dev/la-mesa-v2/website/`

---

## 1. TL;DR

**Cosa funziona bene**
- Hreflang completo (es/en/ca/x-default) su tutte e 3 le home, blog index e tutte le 9 pagine clases.
- LocalBusiness schema solido (4 istanze) con `hasOfferCatalog` che copre tutti i 5 servizi + FAQPage con 7 Q/A su tutte le 3 home.
- robots.txt esplicito per GPTBot/PerplexityBot/ClaudeBot/Google-Extended + llms.txt presente — ottimo positioning per AI search.
- GA4 + Meta Pixel correttamente installati su tutte le pagine; cache-busting `?v=N` coerente (style v=8, main v=5, booking-v2 v=2).
- 100% alt coverage sulle immagini ispezionate; font-display:swap attivo.

**Top 3 problemi P0**
1. **`hero.jpg` 730 KB** referenziato sopra-the-fold con `fetchpriority="high"` su 3 home — LCP degradato. Target <300 KB (WebP/AVIF).
2. **17/23 Article schema mancano campo `image`** → blog posts non eligible per Rich Results, no Google Discover.
3. **Conflitto sitemap/noindex su `/clases/*`** — sitemap dichiara priority 0.7 per 9 URL che hanno `<meta robots noindex>`. Google scarta gli URL dalla sitemap → "sitemap submitted URL not indexed" warning in GSC.

**Top 3 quick wins**
1. Aggiungere `<link rel="canonical">` mancante su tutte le 9 pagine `/clases/*` (oggi solo hreflang, no canonical) — 15 min.
2. Aggiungere x-default `<xhtml:link>` ai 12 url group della sitemap che ne sono privi — 10 min.
3. Convertire `hero.jpg` (730 KB) in `hero.webp` ~150 KB con `<picture>` come fatto per `nosotras` — 20 min, impatto LCP misurabile.

---

## 2. Crawler findings — tabella URL-by-URL

| URL | Status | Title (char) | Desc (char) | H1 | Canonical | Hreflang | Schema | Alt % |
|---|---|---|---|---|---|---|---|---|
| `/` | 200 | 42 | 177 ⚠️ | 1 ✓ | ✓ | 4 ✓ x-default | LocalBusiness + FAQPage | 100 |
| `/en/` | 200 | 38 | 172 ⚠️ | 1 ✓ | ✓ | 4 ✓ x-default | LocalBusiness + FAQPage | 100 |
| `/ca/` | 200 | 41 | 158 | 1 ✓ | ✓ | 4 ✓ x-default | LocalBusiness + FAQPage | 100 |
| `/clases/semanal-modelado.html` | 200 noindex | 47 | 110 | 1 ✓ | ✗ MISS | 4 ✓ | Course | 100 |
| `/clases/semanal-torno.html` | 200 noindex | 44 | 107 | 1 ✓ | ✗ MISS | 4 ✓ | Course | 100 |
| `/clases/suelta.html` | 200 noindex | 47 | 109 | 1 ✓ | ✗ MISS | 4 ✓ | Course | 100 |
| `/en/clases/semanal-modelado.html` | 200 noindex | 59 | 107 | 1 ✓ | ✗ MISS | 4 ✓ | Course | 100 |
| `/en/clases/semanal-torno.html` | 200 noindex | 49 | 113 | 1 ✓ | ✗ MISS | 4 ✓ | Course | 100 |
| `/en/clases/suelta.html` | 200 noindex | 44 | 115 | 1 ✓ | ✗ MISS | 4 ✓ | Course | 100 |
| `/ca/clases/semanal-modelado.html` | 200 noindex | 48 | 117 | 1 ✓ | ✗ MISS | 4 ✓ | Course | 100 |
| `/ca/clases/semanal-torno.html` | 200 noindex | 45 | 114 | 1 ✓ | ✗ MISS | 4 ✓ | Course | 100 |
| `/ca/clases/suelta.html` | 200 noindex | 48 ⚠️ "Suelta"=ES | 110 | 1 ✓ | ✗ MISS | 4 ✓ | Course | 100 |
| `/blog/` | 200 | 15 ⚠️ corto | 154 | 1 ✓ | ✓ | 4 ✓ x-default | — niente schema | 100 |
| `/en/blog/` | 200 | 15 ⚠️ corto | ~150 | 1 ✓ | ✓ | 4 ✓ x-default | — | 100 |
| `/ca/blog/` | 200 | 15 ⚠️ corto | ~150 | 1 ✓ | ✓ | 4 ✓ x-default | — | 100 |
| `/blog/ceramica-para-principiantes-barcelona.html` | 200 | 79 | 175 ⚠️ | 1 ✓ | ✓ | ✗ NO hreflang in head | Article (no image) | 100 |
| `/blog/ceramics-classes-barcelona-guide.html` | 200 | 57 | ~155 | 1 ✓ | ✓ | ✗ NO hreflang | Article (no image) | 100 |
| `/blog/com-triar-taller-ceramica-barcelona.html` | 200 | 53 | 144 | 1 ✓ | ✓ | ✗ NO hreflang | Article ✓ image ✓ dateMod | 100 |
| `/team-building.html` | 200 | 49 | 160 | 1 ✓ | ✓ | ✗ solo ES, no EN/CA | LocalBusiness + Service | 100 |
| `/privacy.html` | 200 noindex | 33 | — | — | ✗ | ✗ | — | — |
| `/en/privacy.html` | 200 noindex (Disallow in robots) | — | — | — | ✗ | ✗ | — | — |
| `/404.html` | 404 noindex | 31 | — | 1 ✓ | — | — solo ES | — | 100 |

**Legenda**: ⚠️ = warning, ✗ = mancante, ✓ = OK

---

## 3. Title / Meta description issues

| Issue | URL | Problema | Fix |
|---|---|---|---|
| Desc troppo lunga | `/` (ES) | 177 char (cap Google ~160) | Tagliare 20 char senza perdere keyword |
| Desc troppo lunga | `/en/` | 172 char | Idem |
| Desc lunga | `/blog/ceramica-para-principiantes-barcelona.html` | 175 char | Tagliare |
| Title troppo corto | `/blog/` `/en/blog/` `/ca/blog/` | 15 char ("Blog — La Mesa") | "Blog Cerámica Barcelona — Guías, Consejos y Historias \| La Mesa" (60 char) |
| Localizzazione errata | `/ca/clases/suelta.html` | Title contiene "Suelta" (ES) invece di "Solta"/"Lliure" | Cambiare a "Classe Solta de Ceràmica" |
| Title troppo lungo | `/blog/ceramica-para-principiantes-barcelona.html` | 79 char (limit ~60) | Accorciare |
| Title CTA-poor | tutte clases | "Clase Semanal de Modelado – La Mesa Barcelona" — manca prezzo/USP | "Clase Semanal de Modelado en Barcelona · 120€/mes · La Mesa" |

Nessun titolo duplicato esatto. Nessuna desc mancante.

---

## 4. Schema findings

### Schemi presenti
- **LocalBusiness** ×4 (home ES/EN/CA + team-building) — completo, include `hasOfferCatalog` con tutti 5 servizi ✓
- **FAQPage** ×3 (3 home) — 7 Q/A, tutti con Question+Answer ✓
- **Course** ×9 (tutte le clases) — campi base OK ma manca `hasCourseInstance` (Google Course 2024+ requirement) e `image`
- **Article** ×23 (blog post) — **17/23 manca `image`** (Rich Results fail), maggior parte manca `dateModified` e `description`
- **Service** ×1 (solo team-building, standalone)

### Schemi mancanti — raccomandazioni
| Priorità | Schema | Dove | Perché |
|---|---|---|---|
| P0 | `image` in Article | 17 blog post | Senza `image` Article non passa Rich Results test + no Google Discover |
| P1 | `Service` standalone | Pagina dedicata per ognuno dei 5 servizi | Oggi annidato in LocalBusiness — Service standalone migliora rich snippet SERP |
| P1 | `BreadcrumbList` | Blog post + clases | Breadcrumb rich result SERP |
| P1 | `hasCourseInstance` | 9 Course | Google rich results Course 2024+ richiede istanze concrete con date |
| P2 | `BlogPosting` (sostituisce Article) | 23 blog post | Sottotipo più preciso per blog |
| P2 | `WebSite` con SearchAction | Homepage | Sitelinks searchbox SERP |
| P2 | `Event` | Se workshop hanno pagine dedicate | Rich result Event + Google Eventi |

`AggregateRating` non implementabile senza dati reali di review nel sito (Google vieta import recensioni GMB).

---

## 5. Image weight — top 5

| File | Peso | Note | Suggerimento |
|---|---|---|---|
| `images/hero.jpg` | **730 KB** ❌ | Sopra-the-fold, fetchpriority=high su 3 home | Convertire a WebP <200 KB con `<picture>` + AVIF fallback. Stimato LCP -1s |
| `images/nosotras.jpg` | 237 KB | Già ha `<picture>` con nosotras.webp (201 KB) — browser moderni usano webp ✓ | OK (lazy-loaded) |
| `images/nosotras.webp` | 201 KB | Servito ai browser moderni | OK |
| `images/foto-tienda-3.jpg` | 140 KB | Lazy-loaded, fold inferiore | Convertire a WebP <80 KB |
| `images/foto-tienda-4.jpg` | 111 KB | Lazy-loaded | WebP <70 KB |
| `images/og-lamesa.jpg` | 87 KB | OG share image 1200×630 | OK |
| `images/logo-lamesa.png` | 35 KB | Nav logo | Considerare SVG (più nitido + ~3 KB) |

Inoltre, in repo ci sono **`FOTO TIENDA 1.jpg` (6.4 MB), `FOTO TIENDA 2.jpg` (5.9 MB), `FOTO TIENDA 3` (1.5 MB), `FOTO TIENDA 4` (1.4 MB)** — sembrano file sorgente non riferenziati nell'HTML ma deployati su GitHub Pages. **Verifica** se accessibili via URL e in tal caso aggiungere a `.gitignore` o cancellare.

---

## 6. Hreflang issues (priorità alta)

| Issue | Dettaglio | Fix |
|---|---|---|
| Blog post manca hreflang | 22/23 blog post hanno solo `<link rel="canonical">`, **zero hreflang in head** (la sitemap li dichiara però!) | Aggiungere blocco hreflang in head a ciascun post con 3 lingue + x-default |
| Sitemap hreflang group orfani | "Cosas que hacer en Barceloneta" è ES/EN ma in sitemap non dichiara `hreflang="ca"` (corretto — ma CA semplicemente manca, non c'è il post) | Aggiungere versione CA del post o lasciare così se è scelta editoriale |
| Sitemap xhtml:link senza x-default | **0 occorrenze di "x-default" nei tag `<xhtml:link>` della sitemap** (37 url group affected) | Aggiungere `<xhtml:link rel="alternate" hreflang="x-default" href="..."/>` a ciascun gruppo |
| team-building.html senza hreflang | Pagina ES-only, nessuna versione EN/CA né tag hreflang | Creare versioni EN/CA (target turisti/aziende intl) o aggiungere `hreflang="es"` + `x-default` esplicito |
| privacy CA mancante | `/ca/privacy.html` non esiste; `/en/privacy.html` esiste ma `Disallow` in robots.txt | Creare `/ca/privacy.html`; rimuovere Disallow da robots su `/en/privacy.html` (è già noindex) |
| Coerenza hreflang cross-page | Su `/` index ES: hreflang es→/, en→/en/, ca→/ca/, x-default→/ ✓<br>Su `/en/` e `/ca/`: stesso pattern ✓ | OK |
| Pagine `/clases/*` con hreflang ma noindex | Hreflang dichiara reciprocità tra 3 lingue, ma tutte noindex → Google ignora i tag | Rimuovere noindex (vedi P0 #3) o tutte le hreflang sono inutili |

---

## 7. Sitemap issues

`/sitemap.xml`, 39 URL totali, `lastmod=2026-04-13` su tutti (statico).

| Priorità | Issue | Fix |
|---|---|---|
| P0 | 9 URL `/clases/*` in sitemap con priority 0.7 ma pagina `<meta robots noindex>` → conflitto + warning GSC | Rimuovere noindex dalle clases (sono pagine di prenotazione con valore SEO: prezzi, descrizione corso, schema Course) OPPURE rimuoverle dalla sitemap |
| P1 | **0 occorrenze di `x-default`** nei `<xhtml:link>` (solo nei `<link>` in `<head>` html) | Aggiungere `<xhtml:link rel="alternate" hreflang="x-default" href="<es-url>"/>` per ogni gruppo url |
| P1 | `lastmod` fisso 2026-04-13 su tutti — sito è stato toccato il 2026-04-20 (index.html mtime) | Aggiornare `lastmod` per ogni pagina effettivamente modificata, o usare data corrente in build |
| P1 | `team-building.html` in sitemap senza `<xhtml:link>` (pagina ES-only) | Aggiungere `<xhtml:link rel="alternate" hreflang="es" href=".../team-building.html"/>` + x-default |
| P2 | Manca CA privacy in sitemap (perché file non esiste) | Vedi sezione hreflang |
| P2 | `priority` 0.8 sui blog post = stesso valore di blog index (dovrebbe essere differenziato) | Index 0.8, post 0.6-0.7 |
| P2 | Nessun sitemap dedicato per immagini (`<image:image>`) | Aggiungere per piezas tienda + hero (Google Image Search) |

---

## 8. Robots.txt findings

```
User-agent: *      → Allow / + Disallow /en/privacy.html
User-agent: GPTBot, PerplexityBot, ClaudeBot, Google-Extended → Allow /
Sitemap: https://www.lamesabcn.com/sitemap.xml
```

| Status | Note |
|---|---|
| ✓ | AI bots esplicitamente permessi (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) — eccellente per AI Search |
| ✓ | Sitemap dichiarata |
| ⚠️ P2 | `Disallow: /en/privacy.html` è superfluo se la pagina ha già `<meta robots noindex>` — rimuovere per coerenza |
| ⚠️ P2 | Manca dichiarazione esplicita Bingbot, AdsBot-Google (per Google Ads), `Applebot` | Aggiungere |
| ⚠️ P2 | Nessun `crawl-delay` o sezione `Disallow: /api/` (n/a — sito statico) | OK |
| ⚠️ P2 | Manca `Disallow: /*?*` opzionale per evitare URL parametrizzati indicizzati (n/a per static, ma protegge da future query string) | Opzionale |

---

## 9. Performance flags (non Lighthouse)

| Categoria | Stato | Note |
|---|---|---|
| Image weight | ❌ P0 | hero.jpg 730 KB sopra-fold (vedi §5) |
| JS bloccanti | ✓ | main.js + booking-v2.js sono `defer` |
| CSS bloccante | ⚠️ | `style.css?v=8` 52 KB caricato in head senza media split — render-blocking |
| Google Fonts | ⚠️ | Montserrat caricato da CDN Google con `<link rel="stylesheet">` (render-blocking). Ha `<link rel="preconnect">` ✓. Manca però `<link rel="preload">` per Garet/HighCruiser self-hosted woff2 |
| Font preload | ❌ P2 | Garet-Black.woff2 (51 KB) e HighCruiser.woff2 (7 KB) self-hosted ma non preloaded |
| Font display | ✓ | `font-display: swap` su entrambi i @font-face |
| Cache headers | N/A | GitHub Pages serve con `Cache-Control: max-age=600` di default — verifica manuale via curl (non eseguibile staticamente) |
| Cookiebot in head sync | ⚠️ | `<script async>` ma in head; non bloccante, ma esegue script di consenso prima del paint |
| Preconnect fonts | ✓ | fonts.googleapis.com + fonts.gstatic.com presenti |
| WebP coverage | ⚠️ | Solo `nosotras.webp` esiste. hero, foto-tienda, og-lamesa, logo-lamesa restano in formato non-WebP |
| Favicon .ico | ❌ P2 | Manca `/favicon.ico` (solo PNG 16/32). Alcuni browser legacy + bot fanno fallback a `/favicon.ico` → 404 nei log |

---

## 10. Tabella findings finale

### P0 — Blocca indicizzazione o danno grave

| # | Issue | URL/File | Impatto SEO | Effort | Suggerimento concreto |
|---|---|---|---|---|---|
| P0-1 | hero.jpg 730 KB sopra-the-fold | `images/hero.jpg`, ref. in 3 home | LCP degradato (Core Web Vitals fail) → ranking factor | 20 min | Convertire a `hero.webp` <200 KB, usare `<picture>` con WebP+JPG fallback. Stima LCP -1s |
| P0-2 | 17/23 Article schema mancano campo `image` | `/blog/*.html` (vedi lista) | Blog post NON eligible Rich Results + no Google Discover (perdita traffico organico potenziale) | 30 min | Aggiungere `"image": "https://www.lamesabcn.com/images/og-lamesa.jpg"` a ogni JSON-LD Article (o creare hero per post) |
| P0-3 | Conflitto sitemap/noindex su 9 `/clases/*` | sitemap.xml + clases pages | Google warning GSC "submitted URL not indexed" + spreco crawl budget | 5 min | Decisione: (a) rimuovere `<meta robots noindex>` dalle clases (preferibile: hanno schema Course + prezzo) o (b) rimuoverle dalla sitemap |
| P0-4 | Canonical mancante su 9 `/clases/*` | `clases/*.html`, `en/clases/*.html`, `ca/clases/*.html` | Se noindex viene rimosso (P0-3) → Google non sa quale URL canonicalizzare | 10 min | Aggiungere `<link rel="canonical" href="...">` su ogni pagina puntando a se stessa |

### P1 — Degrado moderato

| # | Issue | URL/File | Impatto | Effort | Fix |
|---|---|---|---|---|---|
| P1-1 | Hreflang assente nei 22 blog post | `/blog/*.html` | Google non collega versioni linguistiche → cross-lingua canonicalization rotta | 1h | Aggiungere blocco hreflang 4-link in head a ciascun post |
| P1-2 | Sitemap senza x-default in `<xhtml:link>` | `sitemap.xml` (37 group) | Google fallback locale meno preciso per utenti fuori ES/EN/CA | 10 min | Aggiungere riga `<xhtml:link rel="alternate" hreflang="x-default" href="<es>"/>` |
| P1-3 | Meta description >160 char su 2 home + 1 blog | `/`, `/en/`, `/blog/ceramica-para…` | Troncamento SERP, perdita CTR | 5 min | Riscrivere a ≤155 char |
| P1-4 | Sitemap `lastmod` statico al 2026-04-13 | `sitemap.xml` | Google considera contenuto vecchio → re-crawl meno frequente | 15 min | Script che aggiorni `lastmod` per file modificato (build hook) |
| P1-5 | team-building solo ES, no EN/CA | `team-building.html` | Pagina B2B turisti/aziende intl non raggiungibile | 2h | Creare `/en/team-building.html` + `/ca/team-building.html` + hreflang |
| P1-6 | Blog index senza schema | `/blog/`, `/en/blog/`, `/ca/blog/` | Nessuna marcatura CollectionPage/Blog | 20 min | Aggiungere `Blog` o `CollectionPage` schema con `hasPart` per i post |
| P1-7 | `/ca/clases/suelta.html` title contiene "Suelta" (ES) | `ca/clases/suelta.html` | Errore localizzazione visibile in SERP CA | 2 min | "Classe Solta de Ceràmica" |
| P1-8 | Course schema manca `hasCourseInstance` | 9 clases | Google rich result Course 2024+ requirement | 1h | Aggiungere instances con `courseSchedule` |
| P1-9 | Service standalone solo per team-building | tutte le pagine clases | Mancanza rich snippet Service in SERP | 30 min | Estendere LocalBusiness offerCatalog con `Service` standalone su pagine clases |
| P1-10 | Privacy CA mancante | `/ca/privacy.html` 404 | Compliance GDPR + UX utente CA | 20 min | Creare versione CA da `/en/privacy.html` |
| P1-11 | 404.html solo ES, no fallback EN/CA | `/404.html` | Utente EN/CA su URL inesistente vede pagina ES | 30 min | Creare `/en/404.html` + `/ca/404.html` (GitHub Pages serve solo root /404.html però — gestire via JS detect navigator.language) |

### P2 — Nice-to-have

| # | Issue | URL | Effort | Fix |
|---|---|---|---|---|
| P2-1 | Favicon `.ico` mancante | root | 5 min | Generare favicon.ico multi-size |
| P2-2 | Font Garet/HighCruiser non preloaded | head HTML | 5 min | `<link rel="preload" href="/fonts/Garet-Black.woff2" as="font" type="font/woff2" crossorigin>` |
| P2-3 | foto-tienda non in WebP | `images/foto-tienda-*.jpg` | 20 min | Convertire + `<picture>` |
| P2-4 | File sorgente "FOTO TIENDA *.jpg" 6+ MB deployati | `images/FOTO TIENDA *.jpg` | 5 min | `.gitignore` + rm dal deploy GitHub Pages |
| P2-5 | Article schema → BlogPosting | 23 blog post | 10 min | s/Article/BlogPosting/ |
| P2-6 | dateModified mancante in Article | 21 blog post | 10 min | Aggiungere `"dateModified": "YYYY-MM-DD"` |
| P2-7 | Title blog troppo corto (15 char) | `/blog/` (×3 lingue) | 5 min | "Blog Cerámica Barcelona · Guías y Consejos \| La Mesa" |
| P2-8 | Manca BreadcrumbList | blog post + clases | 1h | Aggiungere schema breadcrumb |
| P2-9 | Manca WebSite schema homepage | `/` | 10 min | Aggiungere `WebSite` con `potentialAction` `SearchAction` |
| P2-10 | robots.txt manca Bingbot, Applebot esplicito | `robots.txt` | 2 min | Aggiungere user-agent stanzas |
| P2-11 | robots.txt `Disallow /en/privacy.html` ridondante | `robots.txt` | 1 min | Rimuovere (la pagina ha già noindex) |
| P2-12 | Sitemap priority blog post = blog index (0.8) | `sitemap.xml` | 5 min | Index 0.8, post 0.6 |
| P2-13 | Image sitemap mancante | `sitemap.xml` | 30 min | Aggiungere `<image:image>` per piezas tienda + hero |
| P2-14 | Logo PNG non SVG | `images/logo-lamesa.png` | 30 min | Convertire a SVG (più nitido HiDPI, ~3 KB) |
| P2-15 | `og:locale` su EN home = `en_GB` | `en/index.html` | 1 min | Confermare audience target — se ES/USA, usare `en_US` |

---

## Note conclusive

- **Sito statico ben strutturato per essere SPA-free**: meta, schema, hreflang corretti sulle pagine top. Il "debito tecnico SEO" è concentrato in **blog (image schema, hreflang in head)** e **clases (noindex+canonical conflitti)**.
- **L'AI-SEO positioning è eccellente**: llms.txt + AI bot allowlist + LocalBusiness completo + FAQPage → buona base per essere citati in ChatGPT/Claude/Perplexity.
- **Vero quick win impatto/effort** ordinato: hero.webp (P0-1) → canonical clases (P0-4) → image in Article (P0-2) → desc <160 char (P1-3) → x-default sitemap (P1-2).
- Lighthouse / Core Web Vitals reali demandati alla fase parent (richiede HTTP live fetch).
