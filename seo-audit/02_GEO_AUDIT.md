# 02 — GEO Audit (Generative Engine Optimization)

Audit di La Mesa per citation in motori AI (Google AI Overview, ChatGPT, Perplexity, Claude, Gemini, Copilot).
Generato: 2026-05-13.

---

## TL;DR

**Score citation attuale: 0/6 query** (test WebSearch 2026-05-13 — vedi `00_RAW_DATA/llm_citations_test.md`).
La Mesa NON appare in nessuna delle 6 query target — neppure su "estudio ceramica Barceloneta" dove è l'unico studio del quartiere.

**Cose che funzionano**:
- ✅ `llms.txt` presente in root con stack info, servizi, location, contatti, orari.
- ✅ `robots.txt` allow esplicito per GPTBot, PerplexityBot, ClaudeBot, Google-Extended.
- ✅ Schema `LocalBusiness` completo (address, geo, phone, openingHours, priceRange "€€", sameAs, hasOfferCatalog con 5 servizi e prezzi).
- ✅ Schema `FAQPage` con 7 domande self-contained (post fix apr 2026 — risposte iniziano con brand name).
- ✅ Title keyword-first nelle 3 lingue ("Taller de Cerámica en Barcelona", "Ceramics Studio in Barcelona", "Taller de Ceràmica a Barcelona").
- ✅ Meta description 160-180 char, geo+CTA, tradotte nelle 3 lingue.

**Cose rotte / mancanti** (3 top):
1. **0/6 citation** (P0 strategico — vedi STOP CONDITION istruzioni).
2. **Schema standalone `Service` mancante** — i 5 servizi sono annidati in `OfferCatalog`. LLM e Google Rich Results estraggono meglio `Service` standalone con `provider`, `areaServed`, `offers`.
3. **FAQ #1 prezzo errato**: "Clase Suelta 20€/hora" — è il prezzo del Coworking Torno, non della Clase Suelta (che costa 50€ mesa / 70€ torno per 2h). Errore documentato in product-marketing-context vs. schema. **Confuso = penalizzato da LLM**.

**3 opportunità top**:
1. **Aggiungere `Service` standalone × 5** (Taller Semanal modelado/torno, Clase Suelta, Intro Torno, Taller Flex, Coworking Torno, Privadas/Team Building) sulle 3 homepage + JSON-LD su ogni pagina `/clases/*.html`.
2. **Backfill presenza terze parti**: profili Atrapalo, Aladinia, GetYourGuide, Airbnb Experiences (già attivo ma da link in `sameAs`), Centres Cívics partnership, Google Business Profile review pump. **LLM citano dove ti citano gli altri** — 7.8% citation ChatGPT vengono da Wikipedia, 1.8% da Reddit (fonte: studio Princeton GEO).
3. **`/pricing.md` machine-readable** — file `/pricing.md` o `/pricing.txt` root con prezzi strutturati pronti per parsing AI agent. Sito nasconde i prezzi (per scelta brand), ma negare prezzi a un AI agent = essere filtrati dalla shortlist quando un utente chiede "best ceramic class Barcelona under 150€/month".

---

## 1. Stato `llms.txt`

Esistente in root: `/Users/andreapesce/Dev/la-mesa-v2/website/llms.txt`.

**Pro**:
- Sintetico, leggibile, brand description chiara ("hosts, not teachers").
- Elenca tutti i servizi con prezzi.
- Location, contatti, orari, Etsy, lingue.

**Issue P1**:
| # | Issue | Fix proposto |
|---|---|---|
| L1 | "Drop-in class (Clase Suelta): minimum 2 hours, booking via Cal.com" — **booking NON è più via Cal.com** post-cutover 2026-04-20. Ora è Stripe via lamesabcn.com → app.lamesabcn.com. Anche prezzo mancante. | Cambiare a: "Drop-in class (Clase Suelta): 2h, €50 modelado / €70 torno, Thursdays 16:00–18:00, book online at lamesabcn.com/clases/suelta.html" |
| L2 | "Taller Semanal" senza distinguere modelado vs torno (prezzi diversi: 120€ vs 160€) | Splittare in 2 voci: "Weekly modelado: €120/mes" + "Weekly wheel: €160/mes" |
| L3 | "Coworking Torno: contact via WhatsApp" — manca prezzo (€20/h documentato) | "Wheel coworking: €20/hour, Tue/Wed/Fri 14:00–18:00" |
| L4 | Manca menzione "team building" / "private events" come keyword esplicita | Aggiungere sezione "## For groups & teams" con "team building, bachelor/bachelorette parties, birthdays, family activities — custom quotes via WhatsApp/email" |
| L5 | Manca link al blog (17 post pubblicati) | Aggiungere sezione "## Blog" con link `https://www.lamesabcn.com/blog/` |
| L6 | Manca Airbnb Experiences link (canale attivo da product-marketing-context.md) | Aggiungere a "## Contact" |
| L7 | Manca Google Maps URL (entity recognition LLM) | Aggiungere a "## Location" |
| L8 | Manca brand differentiator esplicito ("anfitrionas, not teachers") nei termini cercati | Già presente come "hosts, not teachers" — OK |

Versione fix `llms.txt` proposta — vedi `05_CONTENT_PLAN_GEO.md` sezione 5.4 (sarà generata in F5).

**Opzionale P2**: creare `llms-full.txt` con dump completo blog post + pagine clases — per LLM che vogliono context completo.

---

## 2. Stato `robots.txt`

Esistente: `/Users/andreapesce/Dev/la-mesa-v2/website/robots.txt`.

```
User-agent: *
Allow: /
Disallow: /en/privacy.html

Sitemap: https://www.lamesabcn.com/sitemap.xml

User-agent: GPTBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Google-Extended
Allow: /
```

**Pro**: 4 bot AI principali esplicitamente allowed.

**Issue P1**:
| # | Bot mancante | Cosa cita |
|---|---|---|
| R1 | `anthropic-ai` | Alias storico di ClaudeBot — alcuni Claude scraper usano ancora questo UA |
| R2 | `OAI-SearchBot` | Bot OpenAI specifico per ChatGPT Search (separato da GPTBot training) |
| R3 | `ChatGPT-User` | Bot ChatGPT per fetch on-demand quando utente clicca un link in chat |
| R4 | `Applebot-Extended` | Apple Intelligence (Siri/macOS 15+) |
| R5 | `Bingbot` | Implicit allow via `*`, ma esplicito è meglio per Copilot |
| R6 | `CCBot` (Common Crawl) | Decisione: bloccare training-only (CCBot) e tenere search bot allow. La Mesa probabilmente vuole essere citata, non usata come training → allow OK ma non necessario. **Lasciare allow** è la scelta più conservativa per esperienze emergenti. |

Fix proposto: aggiungere blocchi `User-agent: anthropic-ai` / `OAI-SearchBot` / `ChatGPT-User` / `Applebot-Extended` / `Bingbot` tutti `Allow: /`.

**Issue P2**: nessun `User-agent: GoogleOther` (alias Google interno, raramente serve).

---

## 3. Schema markup — gap GEO

### Cosa c'è (LocalBusiness — homepage 3 lingue)

✅ Completo: `@id`, name, alternateName, description (3 frasi), url, telephone, email, image, address (street/city/region/zip/country), geo (lat/lng corretti 41.3783/2.1894), priceRange "€€", 4× `openingHoursSpecification`, `sameAs` (IG + Etsy), `hasOfferCatalog` con 5 `Offer` annidati (ognuno con `Service` + price + `UnitPriceSpecification` "mes"/"hora").

### Cosa c'è (FAQPage — homepage 3 lingue)

✅ 7 domande × 3 lingue, self-contained. Le risposte includono brand name "La Mesa" e città "Barcelona" — perfetto per snippet AI.

❌ **Bug FAQ #1**: la risposta dice "los precios van desde 20€/hora para la Clase Suelta hasta 120€/mes para el Taller Semanal". 20€/hora è il Coworking Torno (€20/h), NON la Clase Suelta (€50/€70 per 2h). Errore propagato in ES/EN/CA.

### Schema MANCANTI (priorità alta GEO)

| # | Schema mancante | Dove aggiungere | Perché serve | Priorità |
|---|---|---|---|---|
| S1 | `Service` standalone × 6 con `provider`, `areaServed: "Barcelona"`, `offers` | 3 homepage (o pagina dedicata `/servicios.html`) | Google Rich Results estrae Service standalone meglio di OfferCatalog annidato. LLM (Perplexity, Claude, Gemini) leggono `Service` per "What is X service?" queries. | **P0** |
| S2 | `Course` (con `courseMode: "onsite"`, `provider`, `inLanguage`, `hasCourseInstance`) | 3 homepage + pagine `/clases/semanal-*.html` | Le pagine clases sono `noindex` ma AI bot le crawlano comunque. `Course` schema spinge ranking SERP "best ceramics course Barcelona". | **P1** |
| S3 | `Article` o `BlogPosting` per ogni blog post (17 post) | `/blog/*.html` | Già presente da istruzioni? Da verificare in F1 (subagent in corso). Se no, è P0 — 17 post senza Article schema = perdita immensa GEO. | **P0 se assente** |
| S4 | `BreadcrumbList` su tutte le pagine `/clases/*.html` e `/blog/*.html` | Tutte le sub-pagine | Aiuta Google e LLM a capire gerarchia sito e migliora SERP visual snippets. | **P1** |
| S5 | `Event` per workshops (creativi puntuali) | Sezione `#workshops` homepage o pagina dedicata | LLM citano `Event` per query "ceramic workshops Barcelona this weekend". | **P2** |
| S6 | `AggregateRating` + `Review` se La Mesa ha review Google Business Profile attive | Schema LocalBusiness, campo `aggregateRating` | Schema con rating boost CTR + trust. Solo se ci sono review reali (no fake). | **P1 se review esistono** |
| S7 | `Organization` (alternativa a LocalBusiness, complementare) con `founder` (Lau, Vick), `foundingDate`, `numberOfEmployees`, `logo` | Homepage | Migliora entity recognition LLM ("chi è La Mesa?"). | **P2** |
| S8 | `ItemList` per pagine comparazione / "best of" (es. pagina "Tipos de clases en La Mesa") | Pagina futura | Format più citato (~33% citation share Princeton GEO). | **P3** |

### Tabella: campi `sameAs` LocalBusiness — espandere

Attualmente:
```json
"sameAs": [
  "https://www.instagram.com/lamesa.lc",
  "https://www.etsy.com/es/shop/LaMesaLC"
]
```

Aggiungere (verifica esistenza pagine):
- `https://www.google.com/maps/place/?q=place_id:CHIJ...` — URL Google Maps La Mesa (entity unique ID Google)
- `https://www.airbnb.com/experiences/...` — Airbnb Experiences (canale attivo product-marketing)
- `https://www.tripadvisor.com/...` — TripAdvisor (da creare per Vick, pendente)
- `https://www.facebook.com/...` — Facebook page (se esiste — verifica)
- `https://lamesabcn.us1.list-manage.com` — newsletter Mailchimp (NO, non è entity)
- `https://www.linkedin.com/company/lamesa-bcn` — LinkedIn (se esiste, utile per team building B2B)

Più `sameAs` puntano a entity verificate (Google Maps in primis), più LLM riconoscono "La Mesa Barcelona" come entity unique.

---

## 4. Estraibilità contenuto homepage

Test su 3 lingue (campionatura ES `index.html`):

| Check | ES | EN | CA | Note |
|---|---|---|---|---|
| Definizione "La Mesa" in 1 frase auto-contenuta nel primo paragrafo | ⚠️ parziale | ⚠️ parziale | ⚠️ parziale | Hero ha H1 + subtitle SEO, ma `description` JSON-LD è la fonte chiave per LLM. OK. |
| Prezzi presenti in formato strutturato sul body HTML | ❌ | ❌ | ❌ | **Prezzi NON sul sito** (scelta brand) — solo in schema. LLM li legge da `Offer.price` schema, ma utenti che chiedono a ChatGPT "quanto costa La Mesa" rischiano risposta "non listato" se LLM non legge schema. |
| Indirizzo + orari completi LocalBusiness schema | ✅ | ✅ | ✅ | Top |
| Lista servizi enumerata con 1 frase descrittiva ciascuno | ✅ | ✅ | ✅ | In `hasOfferCatalog.itemListElement[].itemOffered.description` |
| FAQ con domande conversational | ✅ | ✅ | ✅ | 7 FAQ tradotte, naturali |
| Statistic blocks con fonte citata | ❌ | ❌ | ❌ | No statistiche citate. Princeton GEO: +37% visibility con statistiche. **Opportunità.** |
| Expert quotation (Lau o Vick come ceramista) | ❌ | ❌ | ❌ | Nessuna citazione attribuita. Manca "Lau dice: ..." con credenziale. |
| "Last updated" date visibile | ❌ | ❌ | ❌ | Niente data updated public. Schema ha `lastmod` in sitemap ma non visibile. |

**Frasi "auto-contenute" — pattern già rispettato post-fix apr 2026** ("La Mesa se encuentra en Barceloneta" vs "Estamos en..."). ✅

---

## 5. Pagine `/clases/*.html` — paradosso noindex

9 pagine `/clases/` (3 servizi × 3 lingue) sono `<meta robots noindex>` per scelta (sono pagine booking dinamiche con slot real-time + checkout Stripe).

**Conseguenze GEO**:
- Google le esclude da SERP organico ✅ (intenzionale)
- AI bot (GPTBot, PerplexityBot, ClaudeBot) le crawlano comunque (ignorano noindex se UA-specific allow) → contenuto può essere usato per training
- **Issue sitemap.xml**: queste 9 pagine sono INCLUSE nel sitemap con `priority 0.7` — **conflitto P1**: dichiari a Google "indicizza" via sitemap ma poi blocchi via meta. Da rimuovere dal sitemap (mantieni file ma escludi entry).

**Trade-off**:
- Mantenere noindex = OK per UX checkout (no thin pages SERP)
- Rimuovere dal sitemap = obbligatorio per coerenza
- **Alternativa P2**: creare pagine "informative" (es. `/servicios/taller-semanal-modelado.html` indicizzabile, con info + schema `Course` + link a `/clases/semanal-modelado.html` per booking). Doppia struttura: informative-indexable + booking-noindex. Più lavoro ma SEO win sostanziale.

---

## 6. AI Overview readiness — pattern blocks

Princeton GEO research ranking metodi efficaci:

| Metodo | Visibility boost | Stato La Mesa | Action |
|---|---|---|---|
| Cite sources | +40% | ❌ blog post citano fonti? (F1 subagent verifica) | Aggiungere fonti in blog post |
| Add statistics | +37% | ❌ nessuna statistica | Inserire dati: "más de 200 alumnas activas en 2026", "20+ workshops creativos por trimestre", "horneadas semanales" |
| Add quotations | +30% | ❌ nessuna citation Lau/Vick | Pagina "Nosotras" con quote attribute |
| Authoritative tone | +25% | ⚠️ tone "anfitrionas" è caldo ma poco autoritativo — OK per brand, conflicto con +25% boost | Bilanciare: tone caldo + dato concreto |
| Improve clarity | +20% | ✅ buono | OK |
| Technical terms | +18% | ⚠️ "modelado", "torno", "alta temperatura" presenti — buono. Mancano: "engobe", "esmalte", "bizcocho", "horneada" come terminologia | Aggiungere glossario / FAQ tecnica |
| Unique vocabulary | +15% | ✅ "anfitrionas" è unique vocabulary brand | OK |
| Keyword stuffing | **-10%** | ✅ NO stuffing | OK |

---

## 7. Pagine prodotto: priorità AI SEO

Per i 6 query type LLM più probabili, mapping pagine attuali:

| Query type | Esempio | Pagina target esistente | Gap |
|---|---|---|---|
| "What is X?" | "What is La Mesa Barcelona?" | Hero homepage 3 lingue | ✅ OK |
| "Best X in Y" | "Best ceramic class Barcelona" | — | ❌ Manca pagina comparison / "best of" |
| "X vs Y" | "La Mesa vs Tierra Cerámicas" | — | ❌ Manca comparison page |
| "How to X" | "How to start ceramics in Barcelona" | Blog: "ceramica para principiantes" | ✅ presente in 3 lingue |
| "X pricing" | "La Mesa pricing" | Blog: "cuanto cuesta clase ceramica BCN" | ✅ presente in 3 lingue. Manca `/pricing.md` machine-readable. |
| "X for [persona]" | "Ceramic class for tourists Barcelona" | — | ❌ Manca landing target turisti |

---

## 8. Findings GEO consolidati (P0/P1/P2)

| Prio | # | Issue | Fix | Effort |
|---|---|---|---|---|
| **P0** | G1 | 0/6 LLM citation su query target (STOP CONDITION raggiunta) | Combinazione di tutti i fix sotto + presenza terze parti (Atrapalo, Airbnb, GMB review pump) | Alto — 4-6 settimane |
| **P0** | G2 | FAQ #1 prezzo errato (20€/hora) — propagato in 3 lingue × JSON-LD + HTML body | Correggere a "50€/70€ per 2h Clase Suelta" mantenendo info su Coworking come voce separata | 30 min |
| **P0** | G3 | Schema standalone `Service` × 6 mancante | Aggiungere 6 blocchi `Service` JSON-LD su 3 homepage | 2-3h |
| **P0** | G4 | Schema `Article` su 17 blog post (DA VERIFICARE F1 — se assente) | Aggiungere JSON-LD Article/BlogPosting con author, datePublished, dateModified, image | 3-4h se assente |
| **P1** | G5 | `sameAs` LocalBusiness short — solo IG + Etsy | Aggiungere Google Maps place URL, Airbnb Experiences, TripAdvisor (post-creation), Facebook (se esiste) | 1h |
| **P1** | G6 | `llms.txt` informazioni stale (Cal.com vecchio, Suelta prezzi mancanti, team building mancante, blog link mancante) | Riscrivere completamente — vedi 05_CONTENT_PLAN_GEO.md sez. 5.4 | 1h |
| **P1** | G7 | Robots.txt manca bot: anthropic-ai, OAI-SearchBot, ChatGPT-User, Applebot-Extended, Bingbot esplicito | Aggiungere 5 blocchi Allow | 15 min |
| **P1** | G8 | `/pricing.md` machine-readable mancante | Creare file root `/pricing.md` con tutti i servizi, prezzi, condizioni — formato markdown parseable AI agent | 30 min |
| **P1** | G9 | Schema `Course` mancante su 9 pagine `/clases/` | Aggiungere JSON-LD Course con courseMode, provider, inLanguage, hasCourseInstance, offers | 2h |
| **P1** | G10 | Sitemap include 9 pagine `/clases/` noindex → conflitto | Rimuovere entries `/clases/` dal sitemap.xml | 15 min |
| **P1** | G11 | Schema `BreadcrumbList` mancante su clases + blog | Aggiungere su 9 pagine clases + 17 blog post | 2h |
| **P1** | G12 | 0 statistiche citate, 0 expert quotation (Lau/Vick) | Aggiungere: hero / nosotras / blog post statistiche + quote attribuite | 4-6h con copy fix |
| **P1** | G13 | Presenza terze parti zero (Atrapalo, aladinia, GetYourGuide, ajuntament centres cívics) | Outreach 60d: pitch a 5 aggregatori + sottomettere su Centres Cívics partnership | Alto — 4-8 settimane |
| **P2** | G14 | Google Business Profile verification pending | Completare verification + chiedere 5-10 review post-clase ad alumnas attive | 1h setup + 2 settimane review pump |
| **P2** | G15 | `AggregateRating` schema mancante (dipende da review GBP) | Aggiungere dopo che GBP ha ≥5 review | 30 min |
| **P2** | G16 | Schema `Organization` (alternativa/integrazione LocalBusiness) con founder Lau+Vick, foundingDate, logo | Aggiungere su homepage | 1h |
| **P2** | G17 | Schema `Event` per workshops puntuali | Aggiungere quando pubblichi nuovi workshop | Variabile |
| **P2** | G18 | Pagina comparison "La Mesa vs alternativi BCN" — formato citato 33% delle volte da LLM (Princeton) | Creare `/blog/comparativa-talleres-ceramica-barcelona.html` ES/EN/CA | 6-8h |
| **P2** | G19 | Pagina landing turisti dedicata (Airbnb Experiences traffic) | Creare `/en/ceramic-class-barcelona-tourists.html` | 4h |
| **P3** | G20 | `llms-full.txt` con dump completo blog + clases per LLM context | Generare via script (concat di markdown body posts) | 30 min |
| **P3** | G21 | Self-hosting font (Google Fonts → /fonts/) per ridurre dipendenze esterne tracking | Già parzialmente done (HighCruiser/Garet self) | 1h |

**Conteggio**: 4 P0, 9 P1, 6 P2, 2 P3 (totale 21).

---

## 9. STOP CONDITION raggiunta

Per istruzioni audit (sezione `🚨 STOP CONDITIONS`):
> Ferma e chiedi conferma ad Andrea se test LLM citation Fase 2.2 mostra 0/6 menzioni (allarme strategico).

Score: **0/6 menzioni**. Allarme attivo.

Decisione richiesta ad Andrea — vedi notifica chat.

---

## 10. Quick wins (15-60 min each, alto ROI)

1. **Correzione FAQ #1 prezzo** (G2) — 30 min, fix in 6 file (HTML body + JSON-LD × 3 lingue)
2. **Robots.txt 5 bot mancanti** (G7) — 15 min
3. **`/pricing.md` machine-readable** (G8) — 30 min
4. **Rimozione `/clases/` da sitemap** (G10) — 15 min
5. **llms.txt riscrittura** (G6) — 1h (template proposto in F5)
6. **sameAs Google Maps URL** (G5 parziale) — 15 min se ha già verifica GMB

Tot quick wins: ~3h con impatto immediato su crawlability + machine-readability.
