# EXECUTE_FIXES_P0 — Prompt CC per fix P0

> **Come usare**: apri una nuova sessione Claude Code dentro `~/Dev/la-mesa-v2/website/` e incolla questo prompt sotto la riga `<<<PROMPT>>>`. Il prompt è autonomo (no contesto esterno richiesto). Plugin-aware: `superpowers` + `frontend-design` + `seo-audit`.

> **Scope**: SOLO le 9 P0 dell'audit `SEO_GEO_AUDIT.md` (6 originali + 3 nuove da F3 Performance). Tempo stimato: ~3.5-4.5h work + verifica.

> **Pre-condizione**: working directory pulito o branch dedicato `git checkout -b seo-fixes-p0`. Sito statico GitHub Pages — deploy automatico al push su `main`.

> **Per Andrea**:
> - **P0-1** (citation strategico) è una roadmap 90gg, NON un fix tecnico singolo. È inclusa nel prompt come reminder ma il fix CC esegue solo P0-2 → P0-7. P0-1 segue il piano in `05_CONTENT_PLAN_GEO.md` + `SEO_GEO_AUDIT.md` sez. 4 (Sprint 1-2-3).
> - **P0-8** (www vs non-www 301) richiede decisione strategica + accesso DNS/GitHub Pages config — non-script fix. Tratto in TASK 7 ma con istruzione operativa manuale.
> - **P0-9** (GA4 mark conversion) richiede accesso UI Admin GA4 — Andrea deve fare manualmente in 2 min. Tratto in TASK 8.

---

```
<<<PROMPT>>>

# Sei Claude Code — eseguito i fix P0 SEO/GEO per lamesabcn.com

## Contesto

Sito statico HTML/CSS/JS in `~/Dev/la-mesa-v2/website/`, deployato su GitHub Pages, dominio `lamesabcn.com`, 3 lingue (ES root, EN `/en/`, CA `/ca/`). Repo git `queondache/lamesa-website`. Branch `main` = produzione.

Stack: zero framework, zero npm, HTML5 + CSS3 + JS vanilla. NON aggiungere dipendenze. NON toccare link Stripe/Cal.com/WhatsApp/Mailchimp senza chiedere.

Letture obbligatorie prima di eseguire (in ordine):
1. `./istruzioni sito La Mesa.md` (contesto tecnico completo del sito)
2. `../website-marketing/product-marketing-context.md` (brand voice "anfitrionas, no profesoras")
3. `./seo-audit/SEO_GEO_AUDIT.md` (audit completo, vedi sez. 3 per P0)

## Plugin/skill da usare

- `superpowers` — per debug + brainstorming se incontri ambiguità
- `frontend-design` — se devi toccare CSS (NON necessario per i fix P0)
- `seo-audit` — referenza per validazione schema

## Task numerati (eseguire in ordine, 1 commit per task)

### TASK 1 — Convertire `hero.jpg` 730 KB in WebP <200 KB con fallback (P0-2)

**File**: `images/hero.jpg` (730 KB) + 3 home `index.html`, `en/index.html`, `ca/index.html`

**Cosa fare**:
1. Verifica `cwebp` installato: `which cwebp || brew install webp`
2. Conversione: `cwebp -q 80 images/hero.jpg -o images/hero.webp`
3. Target <200 KB. Se >200 KB ridurre q a 70 e re-test. Se ancora >200, ridimensionare a max 1920×1080 prima della conversione.
4. In 3 home `index.html`, `en/index.html`, `ca/index.html`: cercare il blocco hero attuale:

```html
<img src="images/hero.jpg" ... fetchpriority="high" ...>
```
(path relativo: `images/hero.jpg` su ES, `../images/hero.jpg` su EN/CA)

Sostituire con `<picture>`:
```html
<picture>
  <source srcset="images/hero.webp" type="image/webp">
  <img src="images/hero.jpg" alt="<alt esistente>" fetchpriority="high" ...>
</picture>
```
(adattare path relativo per EN/CA: `../images/...`)

**Perché**: LCP degradato → ranking factor Core Web Vitals fail. Stima miglioramento LCP -1s.

**Verification**:
- `ls -lh images/hero.webp` → conferma <200 KB
- Apri `index.html` in browser, DevTools Network: verifica `hero.webp` servito (non `hero.jpg`)
- Lighthouse run su `https://www.lamesabcn.com/` post-deploy → LCP < 2.5s

**Commit**: `perf(seo): hero.webp + <picture> fallback su 3 home (P0-2 LCP fix)`

### TASK 2 — Aggiungere `image` + `dateModified` agli Article schema dei 23 blog post (P0-3)

**File**: 23 file `blog/*.html` (lista in `00_RAW_DATA/structured_data_test.json` se generato; altrimenti `ls blog/*.html` esclude `blog/index.html`).

**Cosa fare**:
1. Per ogni blog post, leggere blocco JSON-LD `Article` esistente.
2. Aggiungere SE MANCANTI:
   - `"image": "https://www.lamesabcn.com/images/og-lamesa.jpg"` (fallback uniforme; in futuro 1 hero dedicato per post — non scope P0)
   - `"dateModified": "2026-05-13"` (oggi se non specificato altrove)
   - `"description": "<meta description della pagina>"` se manca

3. Lasciare invariati: `headline`, `author`, `publisher`, `datePublished`, `mainEntityOfPage`, `inLanguage`.

**Pattern previsto post-fix**:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "image": "https://www.lamesabcn.com/images/og-lamesa.jpg",
  "datePublished": "2026-04-13",
  "dateModified": "2026-05-13",
  "description": "...",
  "author": {...},
  "publisher": {...},
  "inLanguage": "es"
}
```

**Perché**: Senza `image` + `dateModified`, Article non passa Google Rich Results test → blog post non eligible Rich Results + Google Discover.

**Verification**:
- Per ogni file modificato: `grep -c '"image"' blog/<file>.html` deve essere ≥1 dentro blocco Article
- Aprire 3 post a campione su `search.google.com/test/rich-results` post-deploy → "Items detected: Article ✓"

**Commit**: `feat(seo): Article schema image + dateModified su 23 blog post (P0-3 Rich Results)`

### TASK 3 — Rimuovere `<meta robots noindex>` dalle 9 pagine `/clases/*` + decisione sitemap (P0-4)

**Decisione strategica richiesta ad Andrea PRIMA di eseguire**:

Opzione **A** (preferita): Rimuovere noindex → pagine clases diventano indicizzabili. Hanno schema Course + prezzo + descrizione → valore SEO. Mantenere entries in sitemap.

Opzione **B**: Mantenere noindex → rimuovere 9 entries da `sitemap.xml`.

**Chiedi ad Andrea via AskUserQuestion quale opzione preferisce.** Se Andrea non disponibile (esecuzione batch), default a opzione **A** + commit con messaggio "decisione opzione A — confermare con Andrea".

**Per opzione A**:
File: 9 file `clases/*.html` + `en/clases/*.html` + `ca/clases/*.html`

In ogni file, cercare riga:
```html
<meta name="robots" content="noindex">
```
Rimuoverla.

**Per opzione B**:
File: `sitemap.xml`
Rimuovere 9 blocchi `<url>` con `<loc>` che contiene `/clases/`.

**Verification opzione A**:
- `grep -c 'noindex' clases/*.html en/clases/*.html ca/clases/*.html` → 0
- Submit sitemap.xml in GSC, verifica nessun warning "submitted URL not indexed" dopo 7 giorni

**Verification opzione B**:
- `grep -c '/clases/' sitemap.xml` → 0
- GSC sitemap recrawl

**Commit**:
- Opzione A: `feat(seo): indicizzazione pagine /clases/ + schema Course (P0-4)`
- Opzione B: `fix(seo): remove /clases/ entries from sitemap (noindex consistency, P0-4)`

### TASK 4 — Aggiungere `<link rel="canonical">` su 9 pagine `/clases/*` (P0-5)

**Pre-condizione**: TASK 3 completato. Se opzione A scelta, canonical è essenziale. Se opzione B, comunque utile.

**File**: 9 file `clases/*.html` + `en/clases/*.html` + `ca/clases/*.html`

In ogni file, dentro `<head>`, dopo `<meta name="description">`, aggiungere:
```html
<link rel="canonical" href="https://www.lamesabcn.com/<path-self>">
```

Path self per ogni file:
- `clases/semanal-modelado.html` → `https://www.lamesabcn.com/clases/semanal-modelado.html`
- `clases/semanal-torno.html` → `https://www.lamesabcn.com/clases/semanal-torno.html`
- `clases/suelta.html` → `https://www.lamesabcn.com/clases/suelta.html`
- `en/clases/semanal-modelado.html` → `https://www.lamesabcn.com/en/clases/semanal-modelado.html`
- (idem per torno + suelta EN)
- `ca/clases/...` → `https://www.lamesabcn.com/ca/clases/...`

**Perché**: Senza canonical, Google deve decidere quale URL canonicalizzare se ci sono varianti (query string, http vs https). Con canonical esplicito = nessuna ambiguità.

**Verification**: `grep -c 'rel="canonical"' clases/*.html en/clases/*.html ca/clases/*.html` → 9 (uno per file).

**Commit**: `feat(seo): rel=canonical su 9 pagine /clases/ (P0-5)`

### TASK 5 — Fix FAQ #1 prezzo errato (P0-6)

**File**: 3 home `index.html`, `en/index.html`, `ca/index.html` — sia HTML body (sezione FAQ visibile) sia JSON-LD FAQPage.

**Bug attuale FAQ #1**:
- ES: "En La Mesa los precios van desde 20€/hora para la Clase Suelta hasta 120€/mes para el Taller Semanal."
- EN: analogo con 20€/hour
- CA: analogo

**Errore**: 20€/hora è il **Coworking Torno**, NON la Clase Suelta (50€ modelado / 70€ torno per 2h).

**Risposta corretta da inserire** (mantenendo brand voice "anfitrionas"):

**ES** (in `index.html` sia body sia JSON-LD):
> "En La Mesa: la Clase Suelta cuesta 50€ (modelado) o 70€ (torno) por 2 horas; el Taller Semanal 120€/mes (modelado) o 160€/mes (torno) por 4 sesiones; el Intro al Torno 90€ por 2 sesiones; el Coworking Torno 20€/hora. Materiales y horneadas incluidos."

**EN** (in `en/index.html`):
> "At La Mesa: Drop-in class is €50 (hand-building) or €70 (wheel) for 2 hours; Weekly class is €120/month (hand-building) or €160/month (wheel) for 4 sessions; Wheel Intro €90 for 2 sessions; Wheel Coworking €20/hour. Materials and firings included."

**CA** (in `ca/index.html`):
> "A La Mesa: la Classe Solta costa 50€ (modelat) o 70€ (torn) per 2 hores; el Taller Setmanal 120€/mes (modelat) o 160€/mes (torn) per 4 sessions; l'Intro al Torn 90€ per 2 sessions; el Coworking Torn 20€/hora. Materials i fornades inclosos."

**Cercare e sostituire**: cercare stringa "20€/hora" / "20€/hour" (occorrenze multiple per pagina: 1 in HTML body sezione FAQ + 1 in JSON-LD `acceptedAnswer.text`). Sostituire entrambe.

**Verification**:
- `grep -n "20€/hora" index.html en/index.html ca/index.html` → 0 (sostituite tutte)
- `grep -n "Coworking" index.html en/index.html ca/index.html` → ≥3 (presenza del Coworking come voce separata nella risposta)
- Validare schema su `search.google.com/test/rich-results` per 3 home → FAQPage ✓ con risposta corretta

**Commit**: `fix(seo): FAQ #1 prezzo corretto Clase Suelta 50€/70€ (P0-6, fix 20€/hora bug ES/EN/CA)`

### TASK 6 — Aggiungere `<link rel="canonical">` self alle 3 home + verifica /en/ /ca/ (P0-7)

**File**: `index.html` ES + `en/index.html` + `ca/index.html`.

**Bug attuale**: la home `/?utm_source=google&utm_medium=gbp&utm_campaign=business-profile` viene indicizzata da Google come pagina separata dalla home pulita. In 90g ha ricevuto 837 impressions (71% del totale impressions della home) con CTR 0.6%. Senza canonical, Google non sa che è la stessa pagina.

**Fix** (5 minuti):

Dentro `<head>` di `index.html` (ES root), aggiungere subito dopo `<meta name="description">`:
```html
<link rel="canonical" href="https://www.lamesabcn.com/">
```

In `en/index.html`:
```html
<link rel="canonical" href="https://www.lamesabcn.com/en/">
```

In `ca/index.html`:
```html
<link rel="canonical" href="https://www.lamesabcn.com/ca/">
```

**Perché**: con canonical esplicito, qualunque variante URL (UTM param, trailing slash, http vs https, www vs non-www) viene consolidata sulla URL pulita. Google attribuirà tutte le 837 impressions UTM-tagged alla home pulita.

**Verification**:
- `grep -c 'rel="canonical"' index.html en/index.html ca/index.html` → 3 (uno per file)
- Aprire https://www.lamesabcn.com/?utm_source=google&utm_medium=gbp in browser, View Source, cercare `<link rel="canonical"` → presente puntante a URL pulita
- Dopo 7-14 giorni, GSC > Indexing > Pages > Reasons → URL UTM-tagged dovrebbe scomparire da indexed o passare a "Duplicate without user-selected canonical" → "Google-selected canonical: https://www.lamesabcn.com/"

**Commit**: `feat(seo): rel=canonical self su 3 home (P0-7, consolidate UTM-tagged URL)`

### TASK 7 — Decisione + 301 redirect www vs non-www (P0-8)

**Decisione strategica richiesta ad Andrea PRIMA di eseguire**:

GSC mostra 3 URL home indicizzati come pagine distinte:
- `https://www.lamesabcn.com/` (201 impr 13 clicks pos 11.33)
- `https://lamesabcn.com/` (55 impr 0 clicks pos 7.6)
- `https://www.lamesabcn.com/en/` + `https://lamesabcn.com/en/` (duplicato analogo)

Servono **due decisioni**:
1. www o non-www come canonical?
2. http o https? (probabilmente già solo https, verifica)

**Opzione consigliata**: `https://www.lamesabcn.com/` come canonical (è già il primary cdn-friendly, GitHub Pages supporta nativamente CNAME).

**Chiedi ad Andrea via AskUserQuestion**: confermare scelta + accesso al pannello del dominio (registrar) per impostare 301.

**Esecuzione (richiede Andrea + accesso registrar)**:

GitHub Pages **non supporta** redirect 301 nativamente. Soluzioni:
- **A** (preferita): Configurare 301 al livello del registrar/DNS (es. Cloudflare). Se Andrea usa Cloudflare:
  - Cloudflare > Rules > Page Rules → "lamesabcn.com/*" → Forwarding URL 301 → `https://www.lamesabcn.com/$1`
- **B**: Se Andrea NON usa Cloudflare, restare su CNAME-only e accettare che Google consolida nel tempo (più lento). Aggiungere canonical (già fatto in TASK 6) è il minimo accettabile.

**Verification**:
- `curl -I https://lamesabcn.com/` → HTTP 301 con `Location: https://www.lamesabcn.com/`
- `curl -I https://lamesabcn.com/en/` → 301 verso `https://www.lamesabcn.com/en/`
- Wait 7-14 giorni, GSC > URL Inspection su `https://lamesabcn.com/` → "URL is on Google, page redirects to www variant"

**Commit**: nessun commit nel repo — config DNS esterna. Documentare la decisione + screenshot in `seo-audit/00_RAW_DATA/p0-8-www-redirect-config.md`.

**Se Andrea non procede ora**: skip TASK 7, completare TASK 1-6 + 8. TASK 7 richiede 30 min di Andrea + ~24h DNS propagation.

### TASK 8 — Marca eventi GA4 come conversion (P0-9)

**Tipo**: azione manuale Andrea via UI GA4 — NON code change.

**Cosa fare** (2 minuti):
1. Aprire https://analytics.google.com/
2. Selezionare property "La mesa" (ID `532584494`)
3. Sidebar sinistra basso → Admin → Property settings → **Events**
4. Trovare l'evento `click_cta` nella lista → toggle "Mark as conversion" ON
5. Stessa cosa per `click_whatsapp` → toggle ON
6. (Opzionale ma raccomandato) Aggiungere anche `begin_checkout` come conversion se presente

**Verification**:
- In GA4 → Admin → Conversions (nuovo nome: Key Events) → verifica che `click_cta` e `click_whatsapp` siano nella lista come "Marked as key event"
- Attendere 24-48h, poi GA4 > Reports > Acquisition > User acquisition → colonna "Conversions" non deve più essere 0

**Perché**: GA4 sparpaglia 67 click_cta + 8 click_whatsapp in 31g ma nessun report di acquisizione mostra ROI. Una volta marcati come conversion, il funnel acquisition → conversion diventa visibile.

**Bonus** (separato, non scope P0): tracciare anche evento `purchase` (Stripe webhook) → richiede integrazione GA4 Measurement Protocol nel webhook handler. Effort 1-2h.

**Commit**: documentare l'azione in `seo-audit/00_RAW_DATA/p0-9-ga4-conversions-marked.md` con screenshot della pagina Events post-toggle.

## Verification finale post-tutti-i-task

Dopo aver eseguito TASK 1-5, fare:

1. **Lighthouse run** (3 home, mobile + desktop):
   ```
   npx lighthouse https://www.lamesabcn.com/ --preset=desktop --output=json --output-path=seo-audit/00_RAW_DATA/lighthouse_es_desktop.json --quiet
   npx lighthouse https://www.lamesabcn.com/ --output=json --output-path=seo-audit/00_RAW_DATA/lighthouse_es_mobile.json --quiet
   ```
   (Ripetere per `/en/` e `/ca/`)
   Target: Performance ≥ 80, SEO ≥ 95, LCP < 2.5s, CLS < 0.1.

2. **Rich Results test** (manuale):
   - https://search.google.com/test/rich-results
   - Testare: `/`, `/en/`, `/ca/`, 3 pagine `/clases/`, 3 blog post a campione
   - Verifica nessun "Critical issue" o "Warning"

3. **Sitemap submit** (manuale):
   - GSC → Sitemaps → ri-submit `https://www.lamesabcn.com/sitemap.xml`
   - Attendere 24-48h, verificare "Discovered: 39 / Indexed: ~30+" (era ~22 con noindex clases)

4. **Cache busting**:
   - Se si toccano CSS/JS (non necessario in P0), incrementare `?v=N` in 3 home.

5. **Deploy**:
   ```
   git status
   git log --oneline -10
   git push origin main
   ```
   GitHub Pages re-deploy automatico ~1-3 min.

## Cosa NON fare in questo prompt

- NON eseguire P0-1 (citation strategico) — è roadmap 90gg, segue `05_CONTENT_PLAN_GEO.md` + `SEO_GEO_AUDIT.md` sez. 4.
- NON toccare P1/P2 in questa sessione (separare).
- NON modificare link Stripe / Cal.com / WhatsApp / Mailchimp / GA4 / Meta Pixel.
- NON aggiungere dipendenze npm.
- NON creare file CSS/JS nuovi.
- NON committare file `.env*`, `.DS_Store`.
- NON forzare push, no `--force`.
- Se incontri ambiguità (es. opzione A vs B su TASK 3), chiedi ad Andrea via `AskUserQuestion`.

## Output atteso

A fine sessione, riporto:
- Lista commit fatti con SHA hash
- Lighthouse score pre/post (se eseguito)
- Rich Results test esiti (3 home + 3 clases + 3 blog post)
- Eventuali blocker o deviation rispetto al prompt
- Suggerimento next-step (Sprint 2 dello `SEO_GEO_AUDIT.md` sez. 4)

<<<END_PROMPT>>>
```

---

## Note per Andrea

- **Pre-flight**: prima di lanciare il prompt, fai `git checkout -b seo-fixes-p0` per isolare i fix.
- **Tempo stimato totale**: 3-4h work + 1h verification + 1h Lighthouse run + 24-48h GSC re-indexing wait.
- **Dipendenze esterne richieste**: `cwebp` (`brew install webp`) per TASK 1. Tutto il resto è file editing puro.
- **Decisione strategica TASK 3**: meglio se decidi opzione A o B PRIMA di lanciare prompt — risparmi 1 step di domanda CC.
- **Costo strategico P0-1**: i 6 P0 tech non muovono da soli il "0/6 LLM citation". Per uscire da 0/6 servono Sprint 2-3 (off-site outreach + nuovi pillar). Senza quelli, score citation rimane vicino a 0.

## File modificati attesi (riepilogo)

| File | Task | Change |
|---|---|---|
| `images/hero.webp` | T1 | nuovo (~150-200 KB) |
| `index.html` | T1, T5, T6 | `<picture>` hero + FAQ #1 fix + canonical self |
| `en/index.html` | T1, T5, T6 | idem |
| `ca/index.html` | T1, T5, T6 | idem |
| `blog/*.html` (23 file) | T2 | Article schema image + dateModified |
| `clases/*.html` (3 ES + 3 EN + 3 CA = 9) | T3, T4 | remove noindex (se opt A) + add canonical |
| `sitemap.xml` | T3 (se opt B) | remove `/clases/` entries |
| `seo-audit/00_RAW_DATA/p0-8-www-redirect-config.md` | T7 | doc esterna DNS — no commit code |
| `seo-audit/00_RAW_DATA/p0-9-ga4-conversions-marked.md` | T8 | doc azione manuale GA4 |

Totale codice: ~12 file modificati + 1 file nuovo. 6 commit atomici (T1-T6). T7-T8 sono fix esterni al codice (DNS + GA4 UI) con documentazione.
