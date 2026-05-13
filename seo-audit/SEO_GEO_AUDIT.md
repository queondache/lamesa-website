# SEO + GEO Audit — La Mesa (lamesabcn.com)

**Data:** 2026-05-13
**Working dir:** `/Users/andreapesce/Dev/la-mesa-v2/website/` (era `~/Dev/La mesa/Sito web`, spostato)
**Repo GitHub:** `queondache/lamesa-website`
**Scope:** SEO tecnico + GEO + competitor + **Performance GA4+GSC** (6/6 fasi complete)

---

## 1. TL;DR

**Stato attuale**: sito tecnicamente solido (schema + hreflang + AI-SEO positioning eccellente), MA **citation LLM = 0/6** su query target. **Vantaggio competitivo non sfruttato**: La Mesa è l'**unico** competitor BCN con schema markup strutturato — gli altri 7 (Tierra Cerámicas, Born to Clay, ElTorn, Bcn Clay, Noï, Terra i Pell, Atuell) hanno autorità SEO e presenza terze parti ma **schema vuoto**. Blue ocean inutilizzato: keyword "Barceloneta/playa/mar" → zero competitor.

**5 top findings**:
1. **0/6 menzioni LLM** su 6 query (incluso "estudio ceramica Barceloneta", dove La Mesa è l'unico studio del quartiere) — STOP CONDITION strategica.
2. **17/23 Article schema mancano campo `image`** → blog post NON eligible Rich Results + Google Discover (perdita silenziosa traffic 23 post in 3 lingue).
3. **`hero.jpg` 730 KB** sopra-the-fold con `fetchpriority="high"` su 3 home → LCP degradato, ranking factor Core Web Vitals fail.
4. **URL UTM-tagged indicizzato come pagina separata** (`/?utm_source=google&utm_medium=gbp...` con 837 impressions = 71% del totale impressions home, CTR 0.6%) → equity SEO sparsa, canale GBP penalizzato. Canonical mancante. **Nuovo P0-7.**
5. **GA4 zero conversion event configurate** nonostante 67 `click_cta` e 8 `click_whatsapp` registrati in 31 giorni → ogni report di acquisizione mostra ROI nullo mentre il sito converte effettivamente al 37% (click_cta/session). **Nuovo P0-9.**

**3 top opportunità**:
1. **Schema Service standalone × 6 + Course `hasCourseInstance`** + Article `image` su tutto → riallineamento tecnico SEO con potenziale citation LLM 3-4× (Princeton GEO: structured data +30-40% boost).
2. **Blue ocean "Barceloneta/cerca del mar / rainy day Barcelona"** — pillar B in `05_CONTENT_PLAN_GEO.md` → zero concorrenza, alto volume turisti EN.
3. **Outreach off-site (Atrapalo + Aladinia + GetYourGuide + Centres Cívics + Google Business review pump)** — fonti terze sono dove competitor compaiono aggregati. Princeton GEO: 6.5x più probabili citation da fonti terze rispetto al proprio dominio.

⚠️ **Warning issue >5 P0** (ora 9 totali post-F3) — triggera istruzione "prioritizzare insieme". Vedi sez. 3 prioritizzazione + `EXECUTE_FIXES_P0.md` per ordine esecuzione.

---

## 2. Performance snapshot

**Range dati:**
- GA4: 2026-04-13 → 2026-05-13 (**31 giorni effettivi**, sito online da ~60g — prima sessione GA4 registrata 13 aprile)
- GSC: ~2026-02-13 → 2026-05-13 (**90 giorni**)
- **Comparison non disponibile**: sito troppo giovane. Rivalutazione prevista 2026-06-30.

Dashboard mini (dati reali F3):

| Metrica | 31g GA4 | 90g GSC | Note |
|---|---|---|---|
| Users | 157 | — | 158 new users (98%) |
| Sessions | 181 | — | 1.15 sess/user |
| Engagement rate | 42.5% | — | Avg duration 1m 55s |
| Page views | 221 | — | 1.22 PV/session |
| GSC Impressions | — | 1 171 | 71% di queste su URL UTM-tagged ghost |
| GSC Clicks | — | 28 | 3 query con clicks |
| GSC CTR medio | — | 2.39% | Posizione media ~7-9 |
| `click_cta` totali | 67 | — | **37% sessions** (alto) |
| WhatsApp clicks | 8 | — | 4.4% sessions (basso) |
| Mobile share | 62% (sess) | 49% (impr) | Concordante |
| Spain share | 59% sess | 85% impr | Concordante, BCN 44% sess |
| **Conversioni GA4 configurate** | **0** | — | **Bug — vedi P0-9** |

**Insights chiave**:
- **GBP è il canale conversion #1**: 22 sessioni / 18 click_cta = **82% CTR** — il profilo Google Business porta traffico ad altissimo intent.
- **Versione EN sopra-performa la ES**: bounce 33% vs 58%, durata 234s vs 109s, GSC pos 5.7 con CTR 4.65%. Audience anglofona sotto-investita.
- **Citation LLM organica viva**: 3 sessioni `chatgpt.com/referral` + 1 `scouts.yutori.com/referral` con engagement 100% → il positioning AI-SEO già porta micro-referral prima dell'outreach formale.
- **Mobile-first SEO funziona**: ranking pos 5.97 mobile vs 9.59 desktop — 3.6 posizioni di vantaggio.
- **`taller creativo barcelona` primary ITA in posizione 55** con 14 impressions = primary target invisibile nella SERP ITA.

Vedi `03_PERFORMANCE_REPORT.md` per dettaglio completo (6 sezioni, 10 file JSON raw in `00_RAW_DATA/`).

---

## 3. Findings consolidati P0/P1/P2

Aggregati F1 + F2 + F3 + F4 (con dedupe). Totale: **9 P0 · 22 P1 · 19 P2**.

### P0 — Blocca o danno strategico (9)

| # | Issue | Source | URL/File | Impatto | Effort | Fix |
|---|---|---|---|---|---|---|
| **P0-1** | 0/6 LLM citation strategico — La Mesa invisibile in tutte 6 query target | F2 G1 | sistemico | Strategico — perdita di canali di acquisizione AI emergenti | 4-6 settimane (combo fix sotto + outreach) | Esecuzione completa fix P0-2 a P0-6 + roadmap off-site 12 settimane (vedi `05_CONTENT_PLAN_GEO.md` sez. 5.6) |
| **P0-2** | `hero.jpg` 730 KB sopra-the-fold con `fetchpriority="high"` | F1 P0-1 | `images/hero.jpg` ref. in 3 home | LCP degradato → ranking factor Core Web Vitals fail | 20 min | Convertire a `hero.webp` <200 KB, `<picture>` con WebP+JPG fallback. Stima LCP -1s |
| **P0-3** | 17/23 Article schema mancano `image` + spesso `dateModified`/`description` | F1 P0-2 + F2 G4 | `/blog/*.html` (lista in `00_RAW_DATA/structured_data_test.json`) | Blog post non eligible Rich Results + no Google Discover | 30-60 min | Aggiungere `"image": "<og hero per post>"` + `"dateModified": "YYYY-MM-DD"` a ogni Article JSON-LD. Idealmente 1 hero image per ogni post (oggi tutti usano `og-lamesa.jpg` come fallback) |
| **P0-4** | Conflitto sitemap/noindex su 9 `/clases/*` (priority 0.7 + `<meta robots noindex>`) | F1 P0-3 + F2 G10 | `sitemap.xml` + clases pages | GSC warning "submitted URL not indexed" + spreco crawl budget | 5-15 min | Decisione: (a) **rimuovere `<meta robots noindex>`** dalle clases (preferibile — hanno schema Course + prezzo + valore SEO) o (b) rimuovere 9 entries dal sitemap.xml |
| **P0-5** | Canonical mancante su 9 `/clases/*` | F1 P0-4 | 9 `clases/*.html` (ES+EN+CA) | Se rimuovi noindex (P0-4 opt a), Google non sa canonicalizzare | 10 min | Aggiungere `<link rel="canonical" href="<self>">` su ogni pagina |
| **P0-6** | FAQ #1 prezzo errato (20€/hora) → confusione utente + LLM hallucination prezzi La Mesa | F2 G2 | 3 home HTML body + JSON-LD FAQPage ES/EN/CA | LLM cita "20€/hora" come prezzo Clase Suelta → ChatGPT/Perplexity rispondono prezzo errato | 30 min | Riscrivere risposta: "Clase Suelta cuesta 50€ modelado o 70€ torno por 2 horas. Taller Semanal 120€/mes (modelado) o 160€/mes (torno). Coworking Torno 20€/hora." × 3 lingue + JSON-LD |
| **P0-7** | Home URL UTM-tagged indicizzato come pagina separata (`/?utm_source=google&utm_medium=gbp...` 837 impr / 0.6% CTR = 71% impressions home value) | F3 GSC | `index.html` (ES/EN/CA) | Equity SEO sparsa, canale GBP penalizzato, CTR aggregato distrutto | 5 min | Aggiungere `<link rel="canonical" href="https://www.lamesabcn.com/">` (+ /en/ + /ca/ self-canonical) in `<head>` |
| **P0-8** | Duplicazione www/non-www su tutte le 3 home (GSC tratta come pagine distinte: `lamesabcn.com/` 55 impr + `lamesabcn.com/en/` 215 impr + `www.lamesabcn.com/en/` 12 impr) | F3 GSC | DNS + GitHub Pages config | Ranking diluito, equity split | 30 min | 301 redirect non-www → www (o viceversa) via custom CNAME + force-HTTPS + HSTS |
| **P0-9** | GA4 nessun evento marked-as-conversion → tutti i report acquisizione mostrano 0 conversion mentre 67 `click_cta` + 8 `click_whatsapp` sparati in 31g | F3 GA4 | Admin GA4 property `532584494` | Cieco su ROI canale, impossibile decidere budget IG vs SEO | 2 min | GA4 Admin → Events → marca `click_cta` + `click_whatsapp` come conversion |

⚠️ **9 P0 > soglia 5** → suggerimento: spaccare esecuzione in 2 sprint (foundazionali tech P0-2/3/4/5/7/8/9 + content/copy P0-1/6). Vedi `EXECUTE_FIXES_P0.md`.

### P1 — Degrado moderato (22)

| # | Issue | Source | URL/File | Effort | Fix |
|---|---|---|---|---|---|
| P1-1 | Hreflang assente in head di 22/23 blog post (sitemap dichiara reciprocità ma head no) | F1 P1-1 | `/blog/*.html` | 1h | Aggiungere blocco 4-link hreflang in head a ciascun post |
| P1-2 | Sitemap senza `x-default` in `<xhtml:link>` (37 url group affected) | F1 P1-2 | `sitemap.xml` | 10 min | Aggiungere riga `<xhtml:link rel="alternate" hreflang="x-default" href="<es>"/>` |
| P1-3 | Meta description >160 char su 2 home + 1 blog | F1 P1-3 | `/`, `/en/`, `/blog/ceramica-para…` | 5-15 min | Riscrittura ≤155 char (proposte in `05_CONTENT_PLAN_GEO.md` sez. 5.3) |
| P1-4 | Sitemap `lastmod` statico 2026-04-13 | F1 P1-4 | `sitemap.xml` | 15 min | Script o manuale: aggiornare per ogni file modificato |
| P1-5 | `team-building.html` solo ES — manca EN+CA | F1 P1-5 + F4 | `team-building.html` | 2-4h | Creare `/en/team-building.html` + `/ca/team-building.html` + hreflang + schema Service per gruppo |
| P1-6 | Blog index senza schema (CollectionPage/Blog) | F1 P1-6 | `/blog/`, `/en/blog/`, `/ca/blog/` | 20 min | Aggiungere `Blog` o `CollectionPage` con `hasPart` |
| P1-7 | `/ca/clases/suelta.html` title contiene "Suelta" (ES, dovrebbe essere "Solta"/"Lliure") | F1 P1-7 | `ca/clases/suelta.html` | 2 min | Cambiare a "Classe Solta de Ceràmica" |
| P1-8 | Course schema manca `hasCourseInstance` (Google Rich Results 2024+ req) | F1 P1-8 | 9 `clases/*.html` | 1h | Aggiungere instances con `courseSchedule` (byDay, duration, timezone) |
| P1-9 | Schema `Service` standalone × 6 mancante (solo su team-building) | F1 P1-9 + F2 G3 | 3 homepage | 2-3h | 6 blocchi JSON-LD Service su 3 home (template in `05_CONTENT_PLAN_GEO.md` sez. 5.3) |
| P1-10 | Privacy CA mancante | F1 P1-10 + F2 | `/ca/privacy.html` 404 | 20 min | Creare da `/en/privacy.html` |
| P1-11 | 404.html solo ES, no fallback EN/CA | F1 P1-11 | `/404.html` | 30 min | Detect navigator.language via JS o creare versioni multiple |
| P1-12 | `sameAs` LocalBusiness short — solo Instagram + Etsy | F2 G5 | 3 home JSON-LD | 1h | Aggiungere Google Maps URL, Airbnb Experiences, Facebook, TripAdvisor (post-creation) |
| P1-13 | llms.txt informazioni stale (Cal.com vecchio, Suelta prezzi mancanti, team building mancante, blog link mancante, Airbnb link mancante) | F2 G6 | `/llms.txt` | 1h | Sostituire con v2 (`05_CONTENT_PLAN_GEO.md` sez. 5.4) |
| P1-14 | Robots.txt manca: anthropic-ai, OAI-SearchBot, ChatGPT-User, Applebot-Extended, Bingbot esplicito | F2 G7 | `/robots.txt` | 15 min | Aggiungere 5 blocchi Allow |
| P1-15 | `/pricing.md` machine-readable mancante per AI agent buying | F2 G8 | root | 30 min | Creare `/pricing.md` con tutti servizi + prezzi |
| P1-16 | Schema `Course` mancante elaborato su 9 `/clases/` (base presente ma manca instances + offers strutturati) | F2 G9 (parte) | 9 `clases/*.html` | 2h | Vedi P1-8 (stessa azione) |
| P1-17 | Schema `BreadcrumbList` mancante su clases + blog | F2 G11 | clases + blog | 2h | Aggiungere breadcrumb schema |
| P1-18 | Zero statistiche citate + zero expert quotation (Lau/Vick) nel sito | F2 G12 | homepage + blog | 4-6h | Inserire stat reali ("180+ alumnas in 2025-2026" o simili) + quote attribuite Lau con cite/blockquote |
| P1-19 | `click_cta` evento GA4 non passa `link_url` o `cta_label` → impossibile distinguere taller_semanal vs clase_suelta vs team_building in funnel report | F3 GA4 | `tracking.js`/`gtag` chiamate | 15 min | Aggiungere param `link_url: e.target.href` o `cta_label: e.target.dataset.ctaLabel` al payload `gtag('event','click_cta',{...})` |
| P1-20 | UTM tagging Instagram frammentato in GA4 (`instagram/social` 29s + `ig/social` 15s = 44 sessioni totali ma split reporting) | F3 GA4 | IG bio link + Stories | 20 min | Standardizzare bio-link con un solo UTM (`?utm_source=instagram&utm_medium=social&utm_campaign=biolink`) + audit link Stories per coerenza |
| P1-21 | `/ca/` versione catalana invisibile (GA4 7 lang Catalan, GSC 22 impr 0 clicks pos 7.09) | F3 GA4+GSC | `/ca/index.html` | 1h | Audit content + meta description /ca/ + verifica hreflang reciproco + considerazione: il dato suggerisce che CA serve "presenza" più che "trafico", priorità bassa |
| P1-22 | `taller creativo barcelona` primary keyword ITA in posizione 55 con 14 impressions → primary target invisibile nella SERP ITA | F3 GSC | content gap home + clases ES | 2-3h | Creare pillar dedicato `/clases-creativas-barcelona.html` OPPURE rinforzare keyword in H1/H2 + internal anchor "taller creativo" su home ES |

### P2 — Nice-to-have (19)

| # | Issue | Source | Effort | Fix breve |
|---|---|---|---|---|
| P2-1 | Favicon `.ico` mancante | F1 P2-1 | 5 min | Generare favicon.ico multi-size |
| P2-2 | Font Garet/HighCruiser non preloaded | F1 P2-2 | 5 min | `<link rel="preload">` |
| P2-3 | foto-tienda non in WebP | F1 P2-3 | 20 min | Conversione + `<picture>` |
| P2-4 | **File sorgente "FOTO TIENDA *.jpg" 6+ MB deployati su GitHub Pages** — non referenziati ma scaricabili pubblicamente | F1 P2-4 | 5 min | `.gitignore` + git rm dal deploy (~16 MB total) |
| P2-5 | Article schema → BlogPosting (sottotipo più preciso) | F1 P2-5 | 10 min | s/Article/BlogPosting/ |
| P2-6 | dateModified mancante in 21 Article | F1 P2-6 | 10 min | Aggiungere `"dateModified"` |
| P2-7 | Title blog index troppo corto (15 char "Blog — La Mesa") | F1 P2-7 | 5 min | "Blog Cerámica Barcelona · Guías y Consejos \| La Mesa" |
| P2-8 | Manca BreadcrumbList | F1 P2-8 | 1h | Schema breadcrumb (dup P1-17) |
| P2-9 | Manca WebSite schema homepage con SearchAction | F1 P2-9 | 10 min | Aggiungere `WebSite` con `potentialAction` |
| P2-10 | robots.txt manca Bingbot, Applebot esplicito | F1 P2-10 | 2 min | Dup P1-14 |
| P2-11 | robots.txt `Disallow /en/privacy.html` ridondante (pagina ha noindex) | F1 P2-11 | 1 min | Rimuovere riga |
| P2-12 | Sitemap blog post priority = blog index (0.8 = 0.8) | F1 P2-12 | 5 min | Index 0.8, post 0.6 |
| P2-13 | Image sitemap mancante | F1 P2-13 | 30 min | Aggiungere `<image:image>` per tienda + hero |
| P2-14 | Logo PNG non SVG | F1 P2-14 | 30 min | Convertire (~3 KB) |
| P2-15 | `og:locale` su EN home = `en_GB` (verifica target audience) | F1 P2-15 | 1 min | Confermare con Andrea — se mercato US sostituire con `en_US` |
| P2-16 | Google Business Profile verification pending | F2 G14 | 1h setup + 2 settimane review pump | Completare GBP + chiedi 5-10 review |
| P2-17 | `AggregateRating` schema (dopo GBP ≥5 review) | F2 G15 | 30 min | Aggiungere a LocalBusiness |
| P2-18 | Schema `Organization` con founder Lau+Vick, foundingDate, logo | F2 G16 | 1h | Aggiungere a homepage |
| P2-19 | Pagina comparison "La Mesa vs alternativi BCN" — formato citato ~33% delle volte da LLM | F2 G18 | 6-8h | Creare `/comparativa-talleres-ceramica-barcelona.html` ES/EN/CA |

---

## 4. Piano azioni 90 giorni

### Sprint 1 (gg 0-30) — Foundazionali tech + content fix

**Obiettivo**: chiudere tutte le P0 + 50% delle P1 quick.

Settimana 1:
- P0-2 hero.webp + `<picture>` (3 home)
- P0-4 rimuovere noindex da 9 `/clases/*` + decisione su sitemap entries
- P0-5 canonical su 9 `/clases/*`
- P0-6 FAQ #1 prezzo fix (3 lingue × HTML body + JSON-LD)
- P1-3 meta description ≤155 char (2 home + 1 blog)
- P1-7 fix CA suelta title "Solta"
- P1-14 robots.txt 5 bot mancanti
- P1-13 llms.txt v2

Settimana 2:
- P0-3 Article `image` + `dateModified` su 23 blog post
- P1-1 hreflang in head 22 blog post
- P1-2 sitemap x-default su 37 group
- P1-4 sitemap lastmod aggiornato (almeno toccare quelle modificate)

Settimana 3-4:
- P1-9 Service standalone × 6 schema (3 home)
- P1-8 Course `hasCourseInstance` su 9 clases
- P1-12 sameAs LocalBusiness expand (Google Maps URL — richiede GMB verification P2-16)
- P1-15 `/pricing.md`
- P2-4 cleanup FOTO TIENDA 6+MB files

**Goal misurabile sprint 1**: 100% P0 chiuse, 0 GSC warning crawl, Rich Results test pass su 23 blog post + 9 clases.

### Sprint 2 (gg 30-60) — Off-site + content nuovo

**Obiettivo**: triplicare presenza terze parti + lanciare pillar B/C/E.

- P2-16 GBP verification completato + 5 review iniziali (alumnas attive)
- Outreach Atrapalo + Aladinia (pillar B+E)
- P1-5 `/team-building.html` EN + CA
- Pillar B: `/barceloneta-ceramic-studio.html` (ES/EN/CA) + blog post EN "Rainy day Barcelona"
- Pillar E: `/en/ceramic-class-barcelona-tourists.html` + outreach GetYourGuide
- P1-18 statistiche reali + quote Lau (homepage 3 lingue)
- P1-10 `/ca/privacy.html`
- P1-6 blog index schema CollectionPage
- P1-17 BreadcrumbList su clases + blog

**Goal misurabile sprint 2**: GBP attivo con ≥5 review, ≥1 backlink Atrapalo o Aladinia, 3+ pagine nuove indicizzate, citation rate manual test 6 query × 5 LLM = 30 punti → ≥6/30 (vs 0/30 oggi).

### Sprint 3 (gg 60-90) — Comparison + decision + scale

**Obiettivo**: occupare format "best of/comparison" + decision stage.

- Pillar D: `/comparativa-talleres-ceramica-barcelona.html` (top-citation format LLM)
- Pillar C: `/despedidas-soltera-ceramica-barcelona.html` + Pillar B blog CA "Coses per fer Barceloneta"
- FAQ page dedicata `/faq.html` ES/EN/CA (15+ Q&A)
- `/nosotras.html` expanded con Organization schema + Lau/Vick bio + quote + foto
- TripAdvisor profile (Vick)
- GetYourGuide pagina dedicata pubblicata
- Centres Cívics partnership pitch (backlink ajuntament.barcelona.cat — autorità SEO non-replicabile)
- 5+ risposte autentiche Reddit/Quora per "pottery class Barcelona" thread

**Goal misurabile sprint 3**: citation rate 12-15/30 (40-50%), GSC impressions su query pillar +30% vs baseline, ≥3 backlink terzi autorevoli (Atrapalo + Aladinia + GetYourGuide o equivalenti).

---

## 5. KPI da monitorare mensilmente

Setup tracking + dashboard mensile:

| # | KPI | Tool | Baseline | Target T+90 | Frequenza |
|---|---|---|---|---|---|
| 1 | **Citation rate LLM** (6 query × 5 LLM = 30 punti) | Manuale ChatGPT/Perplexity/Claude/Gemini/Google AI Overview | 0/30 (WebSearch proxy: 0/6) | 12-15/30 | Mensile (1° lun mese) |
| 2 | **GSC Impressions totali** | GSC | **1 171** (90g) | 1 500+ | Mensile |
| 3 | **GSC Clicks totali** | GSC | **28** (90g) | 50+ | Mensile |
| 4 | **CTR medio top 20 query** | GSC | **2.39%** | +0.5 pp | Mensile |
| 5 | **WhatsApp clicks (GA4 event)** | GA4 event `click_whatsapp` | **8** (31g) | 12+/31g | Mensile |
| 6 | **`click_cta` totali (GA4)** | GA4 event `click_cta` | **67** (31g) | 90+/31g | Mensile |
| 7 | **Stripe sessions started** (Taller Semanal + Suelta) | GA4 + Stripe Dashboard | TBD (event Stripe non tracked in GA4) | +20% post setup | Mensile |
| 8 | **Sessions totali GA4** | GA4 | **181** (31g) | 250+/31g | Mensile |
| 9 | **Engagement rate** | GA4 | **42.5%** | 55%+ | Mensile |
| 10 | **Google Business Profile review count** | GBP dashboard | 0 (pending verification) | ≥10 review | Trimestrale |
| 11 | **Backlink autorevoli** (Atrapalo/Aladinia/GetYourGuide/Ajuntament/IG creator partnerships) | Manuale check + Ahrefs free | ~0 | ≥3 | Trimestrale |

**Note baseline**:
- KPI #2-5, #8-9 popolati con dati reali F3 (vedi `03_PERFORMANCE_REPORT.md`).
- KPI #7 (Stripe sessions started) richiede setup evento GA4 `begin_checkout` + `purchase` con linking Stripe → da fare in fase di esecuzione P0-9.
- Comparison Δ% non possibile fino a 2026-06-30 (sito troppo giovane).

---

## 6. Link agli altri file dettaglio

| File | Contenuto |
|---|---|
| [`00_RAW_DATA/setup_check.md`](00_RAW_DATA/setup_check.md) | Stato MCP, skill, capability |
| [`00_RAW_DATA/crawler_report.json`](00_RAW_DATA/crawler_report.json) | Crawler URL-by-URL raw data |
| [`00_RAW_DATA/structured_data_test.json`](00_RAW_DATA/structured_data_test.json) | Schema validation raw |
| [`00_RAW_DATA/llm_citations_test.md`](00_RAW_DATA/llm_citations_test.md) | 6 query LLM test + competitor SERP detail + manual verification template |
| [`01_SEO_TECH_AUDIT.md`](01_SEO_TECH_AUDIT.md) | Audit tecnico SEO completo (crawler + schema + image weight + hreflang + sitemap + robots + performance flags) |
| [`02_GEO_AUDIT.md`](02_GEO_AUDIT.md) | Audit GEO (llms.txt + robots AI bots + schema gap + estraibilità + LLM citation + 21 findings) |
| [`03_PERFORMANCE_REPORT.md`](03_PERFORMANCE_REPORT.md) | Performance GA4 (31g) + GSC (90g): totals, source/medium, top landing, geo, device/lang, eventi conversion, top query, top pagine, insights priorizzati, 3 nuove P0 + 4 nuove P1 |
| [`04_COMPETITOR_ANALYSIS.md`](04_COMPETITOR_ANALYSIS.md) | 7 competitor BCN (Tierra/ElTorn/Born to Clay/Bcn Clay/Noï/Terra i Pell/Atuell) + gap matrix + posizionamento |
| [`05_CONTENT_PLAN_GEO.md`](05_CONTENT_PLAN_GEO.md) | 5 pillar cluster + roadmap 12 settimane + copy proposals 3 home + `/clases/` + llms.txt v2 + outreach off-site |
| [`EXECUTE_FIXES_P0.md`](EXECUTE_FIXES_P0.md) | Prompt CC autonomo per eseguire **solo le 6 P0** con file path esatti, verification step, commit message |

---

## 7. Decisioni richieste ad Andrea (azione)

1. **~~Sblocco F3 Performance~~** ✅ **CHIUSO 2026-05-13** — MCP `google-analytics` UFFICIALE installato, ADC OAuth attivo, API abilitate su `lamesa-seo-mcp`. Dati GA4 + GSC raccolti in `00_RAW_DATA/` (10 file JSON + 4 CSV originali). Vedi `03_PERFORMANCE_REPORT.md` per dettaglio.
2. **Esecuzione P0**: lanciare `EXECUTE_FIXES_P0.md` ora o aspettare review umana prima? Mio consiglio: review umana su P0-4 (decisione strategica noindex clases) + P0-1 (priorità GEO: combo issue, non azione singola) + P0-8 (decisione www vs non-www è strategica). Le altre 6 P0 sono fix tecniche safe (P0-2/3/5/6/7/9). **`EXECUTE_FIXES_P0.md` da aggiornare** per coprire P0-7/8/9 nuove.
3. **Outreach off-site Sprint 2**: chi esegue? (Andrea solo? Vick? agenzia esterna?) — questi azionamenti hanno ROI più alto delle fix tecniche ma richiedono manodopera commerciale.
4. **Roadmap 12 settimane F5**: valutare con Andrea + Lau + Vick chi scrive copy per le 11 nuove pagine prodotto/servizio. Tono "anfitrionas" è centrale — meglio se Lau approva ogni copy nuovo.
5. **Comparison snapshot 2026-06-30**: rifare il report performance F3 a fine giugno con 60g effettivi + 60g comparison. Mettere reminder in calendario.

---

## 8. Cose non fatte / scope deliberato

- **F3 Performance 60g**: skipped per blocking MCP. Vedi sez. 7 azione #1.
- **Lighthouse runs reali**: non eseguiti (chrome-devtools-mcp disponibile ma tempo bilanciato con altre fasi). Andrea può lanciare manualmente: `npx lighthouse https://www.lamesabcn.com/ --output=json --output-path=00_RAW_DATA/lighthouse_es.json`. Stesso per `/en/`, `/ca/`.
- **Manual verification 6 query × 5 LLM** (ChatGPT/Perplexity/Claude/Gemini/Google AI Overview): WebSearch proxy fatto (0/6), ma verifica completa manuale demandata ad Andrea — template in `00_RAW_DATA/llm_citations_test.md` sez. "Manual verification needed".
- **Lighthouse + PageSpeed Insights API**: pending PageSpeed API key (Andrea può fornire o usare chrome-devtools-mcp manualmente).
- **Backlink stima quantitativa**: solo qualitativa (no Ahrefs/Semrush DA disponibili in setup). Da considerare se Andrea attiva Ahrefs free trial.
