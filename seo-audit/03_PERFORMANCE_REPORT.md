# 03 — Performance Report — lamesabcn.com

**Data report:** 2026-05-13
**Fonti:** GA4 property `532584494` (account "La mesa", account ID `391057671`) + GSC export CSV manuale
**Strumento GA4:** MCP ufficiale Google `analytics-mcp` v0.4.0 via ADC OAuth, GCP project `lamesa-seo-mcp`
**Range GA4:** 2026-04-13 → 2026-05-13 (31 giorni effettivi, vedi nota sotto)
**Range GSC:** Últimos 3 meses ≈ 2026-02-13 → 2026-05-13 (≈90 giorni)
**Comparison:** **non disponibile** — il sito è online da ~60 giorni, dati storici insufficienti per delta

> **Nota metodologica.** L'audit richiedeva confronto 60g vs 60g precedenti. Sia GA4 (prima sessione registrata 2026-04-13) sia GSC (property creata di recente) non hanno copertura del periodo `2026-01-13 → 2026-03-13`. Rivedere a fine giugno 2026 quando ci saranno 60g di dati storici comparabili.

---

## 1. Executive snapshot

Il traffico è **piccolo ma sano e fortemente locale**. 157 utenti unici in 31 giorni con 181 sessioni, 62% mobile, **Barcellona 44% delle sessioni** e Spagna 58.6% — il funnel geo-organico funziona. La SERP rankka meglio su mobile (pos 5.97) che desktop (pos 9.59), confermando che il design mobile-first paga.

Tre criticità strutturali emergono dal dato grezzo: (1) **0 conversion event configurate in GA4** nonostante 67 `click_cta` e 8 `click_whatsapp` registrati → ogni report di acquisizione mostra zero ROI; (2) l'evento `click_cta` non passa il parametro `link_url` → impossibile distinguere se il click va al taller_semanal o alla clase_suelta; (3) **un URL UTM-tagged è indicizzato come pagina distinta** (`/?utm_source=google&utm_medium=gbp`, 837 impressions, 71% del totale impressions home) — questo splitta equity SEO e distrugge il CTR aggregato della home.

Sul lato opportunità, la versione **EN della home performa il doppio della versione ES per engagement** (bounce 33% vs 58%, durata media 234s vs 109s) e GSC conferma `/en/` con CTR 4.65% pos 5.7. La keyword `pottery class barcelona` è in posizione 4 con 50% CTR — pronto per espansione contenuti EN. Lato ES, `taller creativo barcelona` è in posizione 55 con 14 impressions → primary target ITA fuori dai radar SERP, gap di contenuto pillar.

---

## 2. GA4 — 31 giorni effettivi

### 2.1 Totali (2026-04-13 → 2026-05-13)

| Metrica | Valore |
|---|---|
| Total users | 157 |
| New users | 158 |
| Sessions | 181 |
| Engaged sessions | 77 |
| Engagement rate | 42.5% |
| Avg session duration | 1m 55s (114.96 s) |
| Bounce rate | 57.5% |
| Page views | 221 |
| **Sessions/user** | 1.15 |
| **PV/session** | 1.22 |
| **Conversions** | **0** (nessun evento marked-as-conversion) |

> **Bug GA4 #1.** Sessions (181) > Users (157) di solo 24 — la maggior parte dei visitatori vede 1 sola pagina e non torna. Engagement rate 42.5% è in linea con la media settore "single landing page" (40-50%), ma sotto la media per sito multi-page (55-70%).

### 2.2 Source / Medium — top 10

| # | Source / Medium | Sessions | Eng. sessions | Eng. rate | Conv. |
|---|---|---|---|---|---|
| 1 | (direct) / (none) | 80 | 26 | 32.5% | 0 |
| 2 | instagram / social | 29 | 16 | **55.2%** | 0 |
| 3 | google / gbp | 22 | 12 | **54.5%** | 0 |
| 4 | google / organic | 21 | 12 | **57.1%** | 0 |
| 5 | ig / social | 15 | 4 | 26.7% | 0 |
| 6 | facebook.com / referral | 5 | 3 | 60% | 0 |
| 7 | chatgpt.com / referral | 3 | 3 | **100%** | 0 |
| 8 | (not set) | 2 | 0 | 0% | 0 |
| 9 | bing / organic | 1 | 0 | 0% | 0 |
| 10 | chatgpt.com / (not set) | 1 | 0 | 0% | 0 |

**Letture rapide:**
- **Direct 44% del traffico** — alto perché il sito è giovane; include word-of-mouth, IG bio-link non taggato (vedi punto sotto), QR code volantini, type-in da prossimità (Barcelona BCN locals).
- **Instagram presente con DUE tag distinti** (`instagram / social` + `ig / social`) — frammentazione UTM. Il tag `ig` ha engagement rate 26.7% vs `instagram` 55.2% → il primo è probabilmente IG Stories non taggate (auto-rilevamento Google), il secondo è bio-link/sponsored. **Azione**: standardizzare a un solo tag.
- **GBP + organic = 23.7%** = canale Google totale, in linea con segmento locale-business in Spagna.
- **ChatGPT referral 3 sessioni con engagement 100%** — primo segnale di citation LLM organico, da monitorare.

### 2.3 Top landing pages

| Landing page | Sessions | Eng. sessions | Bounce | Avg duration |
|---|---|---|---|---|
| `/` | 165 | 69 | 58.2% | 1m 49s |
| `/en` | 12 | 8 | **33.3%** | **3m 54s** |
| `(empty)` | 2 | 0 | 100% | 0 |
| `(not set)` | 2 | 0 | 100% | 0 |
| `/en/index.html` | 1 | 0 | 100% | 0 |

**Insight EN sopra-performance.** `/en` ha bounce rate **2× più basso** e durata media **2.1× più alta** della home ES. Su 12 sessioni la statistica è fragile, ma converge con GSC (CTR 4.65% pos 5.7 vs Spain CTR 1.91%). L'audience anglofona — meno volume ma molto più qualitativa — non è valorizzata: solo 12 landing in 31 giorni vs 165 sulla home ES.

### 2.4 Geo split

**Paesi top 10**:

| Paese | Sessions | Eng. rate |
|---|---|---|
| Spain | 106 | 50% |
| United States | 21 | 19% |
| Canada | 7 | 0% |
| Germany | 7 | **71%** |
| Saudi Arabia | 5 | 0% |
| India | 4 | 75% |
| Italy | 4 | 50% |
| Poland | 4 | 25% |
| Ireland | 3 | 0% |
| Argentina | 2 | 50% |

**Città top 10**: Barcelona 80 · (not set) 16 · Valencia 10 · Burnaby 6 · Hyderabad 4 · Riyadh 4 · Warsaw 4 · Boardman 3 · Dublin 3 · Frankfurt 3.

**Letture:**
- **Barcelona 44% sessioni** — ICP target raggiunto. Valencia 10 sessioni è il secondo polo ES (Andrea valutare se opportunità).
- **US 21 sessioni / engagement 19%** — volume buono ma intent debole (Spain engagement 50%). Probabilmente curiosity click su brand `mesa` (queries di mobili US-EN ranking accidentale).
- **Germania 7 sessioni / engagement 71%** + GSC pos 4.3 → micro-segment expat DE in BCN, target qualitativo da valutare per IG Reels in tedesco (effort basso).
- **Burnaby (Canada) + Boardman (US) + Hyderabad (India) + Riyadh** = ≈14 sessioni → quasi certamente bot/scraper/datacenter traffic. Filtrare in GA4 con audience exclude.

### 2.5 Device + lingua browser

**Device**:

| Categoria | Sessions | Eng. rate | Bounce |
|---|---|---|---|
| Mobile | 112 (62%) | 43.8% | 56.2% |
| Desktop | 68 (38%) | 41.2% | 58.8% |
| Tablet | 1 | 0% | 100% |

**Lingua browser top 5**: English 87 · Spanish 54 · German 10 · Italian 9 · Catalan 7.

**Letture:**
- Mobile 62% confermato — strategy mobile-first è corretta.
- **Lingua EN 48% browser** vs Spain geo 58.6% → expat e turisti spagnoli con device EN (Apple/Android default). Il sito DEVE proporre EN proattivamente (geo-banner o auto-detect language).
- Catalan 7 sessioni: la versione `/ca/` è scarsamente fruita (GSC 22 impr 0 clicks → confermato).

### 2.6 Eventi

| Evento | Count | Users |
|---|---|---|
| page_view | 221 | 156 |
| session_start | 182 | 156 |
| first_visit | 158 | 156 |
| **click_cta** | **67** | 36 |
| user_engagement | 53 | 44 |
| click | 36 | 28 |
| scroll | 24 | 23 |
| **click_whatsapp** | **8** | 6 |

**`click_cta` per source**:

| Source | Count |
|---|---|
| (direct) | 21 |
| google / gbp | 18 |
| instagram / social | 16 |
| google / organic | 5 |
| ig / social | 3 |
| chatgpt.com / referral | 2 |
| scouts.yutori.com / referral | 1 |
| (not set) | 1 |

**`click_whatsapp` per source**: direct 3 · instagram 3 · gbp 1 · google organic 1.

**Bug GA4 #2 — linkUrl vuoto.** L'evento `click_cta` viene sparato senza il parametro `link_url`. Tutti i 67 click sono attribuiti a `linkUrl=""`. **Conseguenza:** impossibile sapere quale CTA viene cliccata (Taller Semanal vs Clase Suelta vs Taller Día vs Team Building). Fix in `tracking.js`/`gtag.js`: aggiungere `link_url: window.location.href + e.target.href` o `cta_label: e.target.dataset.ctaLabel` al payload `gtag('event', 'click_cta', {...})`.

**Tassi conversione macro (calcolati a mano)**:

| Metrica | Valore | Note |
|---|---|---|
| `click_cta` / sessions | **37%** | Eccellente — 67/181 |
| `click_whatsapp` / sessions | **4.4%** | Basso — il bottone WA è meno prominente del CTA primary |
| `click_cta` / users | 43% | 67 click su 36 users distinti = 1.86 click/user (multi-touch) |

**Lettura GBP**: 22 sessioni → 18 `click_cta` = **CTR 82%**. Il Google Business Profile porta visitatori con altissimo intent. Da monitorare se quel CTR è gonfiato da retargeting o se è effettivamente nuovo intent.

---

## 3. GSC — 90 giorni

### 3.1 Totali

| Metrica | Valore |
|---|---|
| Clicks totali | 28 |
| Impressions totali | 1 171 |
| CTR medio | 2.39% |
| Posizione media | ~7-9 (var. per device) |
| Query con clicks | 3 |
| Pagine indicizzate visibili | 8 |
| Paesi visibili | 33 |

### 3.2 Top 20 query

| Query | Cl | Impr | CTR | Pos | Bucket |
|---|---|---|---|---|---|
| la mesa barcelona | 2 | 41 | 4.88% | 3.29 | brand |
| pottery class barcelona | 1 | 2 | 50% | **4** | EN quick win |
| tiendas bellas artes barcelona | 1 | 1 | 100% | 31 | low-volume |
| **mesa** | 0 | **363** | 0% | 6.64 | off-target (mobili) |
| la mesa | 0 | 58 | 0% | 9.12 | brand |
| **taller de maquetas** | 0 | 31 | 0% | 22 | **off-target** (modellismo) |
| la mess | 0 | 17 | 0% | 3.41 | brand misspell |
| taller maquetas | 0 | 16 | 0% | 22.69 | off-target |
| **taller creativo barcelona** | 0 | 14 | 0% | **55.43** | **primary ITA gap** |
| taller manualidades barcelona | 0 | 7 | 0% | 13 | quick win ES |
| reservar mesa | 0 | 7 | 0% | 2.71 | off-target (restaurant) |
| workshops barcelona | 0 | 4 | 0% | 9.5 | borderline ES |
| ceramic lab barcelona | 0 | 3 | 0% | 8.67 | EN quick win |
| spanish ceramics | 0 | 3 | 0% | 10 | EN borderline |
| ceramic training | 0 | 1 | 0% | 2 | EN low-volume |
| barcelona ceramics shop | 0 | 1 | 0% | 2 | EN tienda |
| clases de ceramica barcelona | 0 | 1 | 0% | 8 | ES core (gap content) |

### 3.3 Top pagine

| Pagina | Cl | Impr | CTR | Pos |
|---|---|---|---|---|
| `https://www.lamesabcn.com/` | 13 | 201 | 6.47% | 11.33 |
| `https://lamesabcn.com/en/` | 10 | 215 | 4.65% | **5.7** |
| **`/?utm_source=google&utm_medium=gbp&...`** | 5 | **837** | 0.6% | 7.24 |
| `https://lamesabcn.com/` (no www) | 0 | 55 | 0% | 7.6 |
| `https://lamesabcn.com/ca/` | 0 | 22 | 0% | 7.09 |
| `https://www.lamesabcn.com/en/` (www) | 0 | 12 | 0% | 4.08 |
| `/blog/ceramica-para-principiantes-barcelona.html` | 0 | 4 | 0% | 8 |
| `/en/index.html` | 0 | 1 | 0% | 1 |

### 3.4 Geo + device

**Paesi top**: España 19c/995i/1.91% · Alemania 2c/10i/20% · Países Bajos 2c/5i/40% · USA 1c/81i/1.23% · Brasil 1c/3i.

**Device**: Móviles 16c/571i/2.8% pos 5.97 · Ordenador 12c/592i/2.03% pos 9.59 · Tablet 0c.

---

## 4. Sintesi insights (priorizzati)

### 4.1 Cosa funziona

1. **Mobile-first SEO performa**: ranking mobile pos 5.97 vs desktop 9.59 → 3.6 posizioni di vantaggio. Il design responsive premia.
2. **GBP è il #1 canale conversion qualitativa**: 22 sessioni → 18 `click_cta` (82% CTR). Profilo Google Business da nutrire (vedi sezione fix sotto).
3. **Versione EN sopra-performa la ES**: bounce 33% vs 58%, durata 234s vs 109s, GSC pos 5.7 con CTR 4.65%. Il segmento anglofono è qualitativo ma sotto-investito.
4. **Citation LLM organica viva**: 3 sessioni `chatgpt.com/referral` + 1 `scouts.yutori.com/referral` con engagement 100% → il positioning AI-SEO (llms.txt + schema) sta già portando referral, anche se in volumi micro.
5. **Barcellona 44% sessioni**: l'ICP geo è centrato. Non è uno spreco di traffico turistico generico.

### 4.2 Quick wins (high impressions + low CTR < 2%)

Da spingere a CTR 5-10% migliorando title/description e disambiguando intent.

| Pagina/Query | Impr | CTR ora | Pos | Azione |
|---|---|---|---|---|
| `/?utm_source=google&utm_medium=gbp...` | 837 | 0.6% | 7.24 | **P0 — canonical mancante** (vedi 4.5) |
| `https://lamesabcn.com/` (no www) | 55 | 0% | 7.6 | **P0 — 301 redirect → www** |
| `taller manualidades barcelona` | 7 | 0% | 13 | Aggiungere variante "manualidades" in H2 home + interno blog |
| `workshops barcelona` | 4 | 0% | 9.5 | Pillar EN dedicato `/en/workshops-barcelona.html` |
| `ceramic lab barcelona` | 3 | 0% | 8.67 | Variante in /en/ title + JSON-LD `alternateName` |

### 4.3 Gap posizione 8-20 da spingere a 1-7

| Query | Pos attuale | Obiettivo | Strategia |
|---|---|---|---|
| `la mesa` (brand) | 9.12 | 1-3 | Schema `Organization` + `sameAs` esteso, internal anchor "La Mesa" |
| `taller manualidades barcelona` | 13 | 5-7 | Pillar `/clases/` indicizzato (vedi P0-4 risolto) + variante "manualidades" |
| `clases de ceramica barcelona` | 8 | 1-3 | **Critico** — keyword core ES con pos 8 e 1 impression = pagina non vista. Pillar dedicato `/clases-ceramica-barcelona.html` |
| `taller creativo barcelona` | **55** | 10-15 (step 1) | Pillar B "Barceloneta/cerca del mar" + interlinking |
| `ceramic lab barcelona` | 8.67 | 1-5 | Title /en/ enrichment + content lab/laboratory expansion |

### 4.4 Off-target traffic — semantic drift

Query alto-volume che NON convertono e NON dovrebbero (intent mismatch). **Non vale lo sforzo**, ma serve consapevolezza:

- `mesa` 363 impressions pos 6.64 → intent mobili da arredamento, **313 impressions in pura confusione brand**. Mitigazione: forte segnale Organization/LocalBusiness per disambiguare.
- `taller de maquetas` + `taller maquetas` = 47 impressions pos 22 → intent modellismo architettonico. La pagina ha contenuto che fa cannibalizzazione su keyword fuori target. Non agire (no fix).
- `reservar mesa` 7 impr pos 2.71 → intent restaurant booking. Da ignorare.
- `trans near me`, `fine dining restaurants`, `numero de mesa` → noise.

### 4.5 Pagine in declino

**N/A — comparison non disponibile.** Da rivedere a fine giugno 2026 con 60g di dati storici.

### 4.6 Conversion rate per source — best converter

Senza eventi conversion configurati, uso `click_cta` come proxy:

| Source | Sessions | click_cta | CTR | Note |
|---|---|---|---|---|
| google / gbp | 22 | 18 | **82%** | **Best in class** |
| instagram / social | 29 | 16 | 55% | Buono |
| (direct) / (none) | 80 | 21 | 26% | Volume alto, intent vario |
| google / organic | 21 | 5 | 24% | Sotto-aspettative — meta tags da rivedere |
| ig / social | 15 | 3 | 20% | Tag UTM da consolidare con `instagram/social` |
| chatgpt.com / referral | 3 | 2 | **67%** | Alto intent ma volume micro |

**WhatsApp** (8 click totali): direct 3 · instagram 3 · gbp 1 · organic 1. Volume basso conferma che il bottone WhatsApp è poco prominente o sotto-CTA primary.

### 4.7 Verità scomoda

**Il dato più preoccupante.** L'URL `/?utm_source=google&utm_medium=gbp&utm_campaign=business-profile` ha ricevuto **837 impressions** in 90 giorni — il **71.5% di tutte le impressions GSC della home**. Google lo tratta come pagina separata dalla home perché manca il `<link rel="canonical">` che lo riconduca a `/`. Il CTR di questa pagina è 0.6% (vs 6.47% della home pulita). Stiamo letteralmente sprecando il canale GBP — il traffico ad alto intent dal profilo Google viene segnato su una "pagina ghost" con metadati assenti e Google penalizza il CTR aggregato.

**Fix immediato (5 min):**
```html
<!-- in index.html -->
<link rel="canonical" href="https://www.lamesabcn.com/">
```
Aggiungere anche header HTTP `Link: <https://www.lamesabcn.com/>; rel="canonical"` se possibile (richiede config CDN).

**Secondo dato scomodo.** GA4 registra 67 click su CTA e 0 conversioni. La proprietà non ha **nessun evento marked-as-conversion**. Per chi guarda i report di acquisizione (Andrea o un consulente), il sito sembra non convertire affatto, mentre in realtà sta generando azioni a tassi solidi (37% click_cta/session). Fix: in Admin GA4 → Conversions → marca `click_cta` e `click_whatsapp` come eventi conversion. Effort: 2 minuti.

---

## 5. Dashboard mini

| Metrica | 31g (GA4) | 90g (GSC) | Comparison |
|---|---|---|---|
| Users | 157 | — | N/A (sito 60g) |
| New users | 158 | — | N/A |
| Sessions | 181 | — | N/A |
| Engaged sessions | 77 | — | N/A |
| Engagement rate | 42.5% | — | N/A |
| Avg session duration | 1m 55s | — | N/A |
| Page views | 221 | — | N/A |
| GSC Impressions | — | 1 171 | N/A |
| GSC Clicks | — | 28 | N/A |
| GSC CTR medio | — | 2.39% | N/A |
| GSC Posizione media | — | ~7-9 | N/A |
| `click_cta` totali | 67 | — | N/A |
| `click_cta`/session | 37% | — | N/A |
| WhatsApp clicks | 8 | — | N/A |
| WhatsApp/session | 4.4% | — | N/A |
| Conversioni configurate | **0** ❌ | — | Da risolvere |
| Mobile share | 62% | 49% (impr) | Concordante |
| Spain share | 59% (sess) | 85% (impr) | Concordante |
| Barcelona share | 44% (sess) | — | — |

---

## 6. Issue P0/P1 nuove emerse da F3

Aggiungere al consolidato `SEO_GEO_AUDIT.md` sezione 3.

### Nuove P0 (3)

| # | Issue | Source | Impatto | Fix | Effort |
|---|---|---|---|---|---|
| **P0-7** | Home URL UTM-tagged indicizzato come pagina separata (`/?utm_source=google&utm_medium=gbp...` 837 impr / 0.6% CTR) | F3 GSC | -71% impressions home value, equity split | Aggiungere `<link rel="canonical" href="https://www.lamesabcn.com/">` in `index.html` + `/en/index.html` + `/ca/index.html` | 5 min |
| **P0-8** | Duplicazione www/non-www su tutte le 3 home (split equity, GSC tratta come pagine distinte) | F3 GSC | 55+22+12 impressions disperse, ranking diluito | 301 redirect non-www → www (o viceversa) via DNS/host + HSTS | 30 min |
| **P0-9** | GA4 nessun evento marked-as-conversion → tutti i report acquisizione mostrano 0 conversion | F3 GA4 | Cieco su ROI canale, impossibile decidere budget | Admin → Conversions → marca `click_cta` + `click_whatsapp` | 2 min |

### Nuove P1 (4)

| # | Issue | Fix | Effort |
|---|---|---|---|
| **P1-19** | `click_cta` evento non passa `link_url`/`cta_label` → impossibile distinguere taller_semanal vs clase_suelta in funnel report | Aggiungere param `link_url` o `cta_label` in chiamata `gtag('event','click_cta',{...})` in `tracking.js` | 15 min |
| **P1-20** | UTM tagging Instagram frammentato (`instagram/social` 29s + `ig/social` 15s) → reporting confuso | Standardizzare bio-link IG con un solo UTM (`instagram/social/biolink`) + audit Stories link | 20 min |
| **P1-21** | `/ca/` versione catalana invisibile (GA4 7 lang Catalan, GSC 22 impr 0 clicks pos 7.09) | Audit content + meta description /ca/ + verifica hreflang reciproco | 1h |
| **P1-22** | `taller creativo barcelona` primary keyword ITA in posizione 55 con 14 impressions = primary target invisible | Creare pillar dedicato `/clases-creativas-barcelona.html` + interlinking dalla home (oppure includere variante in H1/H2 esistenti) | 2-3h |

### Insight extra non-P (monitoring)

- **ChatGPT referral ATTIVO**: 3 sess/100% engagement → AI citation funziona prima di outreach formale. Monitorare mensilmente con dimensione `sessionSourceMedium` filtered `chatgpt.com|perplexity.ai|claude.ai|gemini.google`.
- **Germania micro-loyalty**: 7 sess GA4 engagement 71% + GSC Alemania 20% CTR — segmento qualitativo. Valutare se IG content occasional in DE vale lo sforzo.

---

## 7. Da rifare quando ci saranno 60g storici (target: 2026-06-30)

Quando il sito avrà ≥120 giorni di dati continui:

1. **Comparison 60g vs 60g** su tutti i 6 dataset GA4 + 4 GSC.
2. **Trend giornaliero** sessions + click_cta → identificare cicli settimanali e impatto post Instagram.
3. **Funnel sessions → click_cta → click_whatsapp → conversion Stripe** quando le conversioni Stripe saranno mappate come eventi GA4.
4. **Search Console query con declino** clicks/impressions.
5. **YoY** quando ci saranno 12 mesi (target maggio 2027).

---

## Allegati

- `00_RAW_DATA/ga4_totals_60d.json` — totali metriche
- `00_RAW_DATA/ga4_source_medium.json` — source/medium top 10
- `00_RAW_DATA/ga4_top_landing.json` — landing pages
- `00_RAW_DATA/ga4_geo.json` — country + city split
- `00_RAW_DATA/ga4_device_lang.json` — device + browser language
- `00_RAW_DATA/ga4_events.json` — events + click_cta breakdown
- `00_RAW_DATA/ga4_timeline.json` — daily sessions timeline
- `00_RAW_DATA/gsc_queries.json` — query con bucket priorità
- `00_RAW_DATA/gsc_pages.json` — pagine con P0 issues
- `00_RAW_DATA/gsc_countries.json` — country split GSC
- `00_RAW_DATA/gsc_devices.json` — device split GSC
- `00_RAW_DATA/lamesabcn.com-Performance-on-Search-2026-05-13/` — CSV originali GSC (4 copie identiche da pulire)
