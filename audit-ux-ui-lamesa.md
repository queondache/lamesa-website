# AUDIT UX/UI — La Mesa BCN

> Data: 2026-04-06
> Scope: index.html (ES/EN/CA), 9 pagine intermedie /clases/, css/style.css
> Tipo: analisi senza modifiche

---

## SEZIONE A — Logica e Flusso

### Mappa percorsi utente

```
HOMEPAGE (index.html / en/ / ca/)
|
+-- #clases
|   +-- Card MODELADO
|   |   +-- "Clase Semanal ->" --> /clases/semanal-modelado.html
|   |   |   +-- Card Miercoles 16h --> Stripe
|   |   |   +-- Card Miercoles 18:30h --> Stripe
|   |   |   +-- Card Jueves 11h --> Stripe
|   |   |   +-- "Sin plazas?" --> WhatsApp
|   |   +-- "Clase Suelta ->" --> /clases/suelta.html
|   |       +-- Card Modelado --> Cal.com
|   |       +-- Card Torno --> Cal.com
|   |
|   +-- Card TORNO
|   |   +-- "Clase Semanal ->" --> /clases/semanal-torno.html
|   |   |   +-- Card Miercoles 16h --> Stripe
|   |   |   +-- Card Miercoles 18:30h --> Stripe
|   |   |   +-- Card Jueves 11h --> Stripe
|   |   |   +-- "Sin plazas?" --> WhatsApp
|   |   +-- "Clase Suelta ->" --> /clases/suelta.html (stessa pagina)
|   |
|   +-- Card COWORKING --> WhatsApp (diretto)
|
+-- #workshops --> Google Drive (esterno) + WhatsApp
+-- #tienda --> Etsy (esterno) + WhatsApp (vale-regalo)
+-- #privadas --> WhatsApp (preventivo)
+-- #faq --> accordion <details> (autocontenuto)
+-- #artistas --> mailto (email)
+-- #contacto --> WhatsApp + tel + email + Maps + newsletter
```

### Click per obiettivo

| Obiettivo | Click | Percorso |
|---|---|---|
| Prenotare Clase Semanal Modelado | **3** | Homepage > Card Modelado > Semanal > Stripe |
| Prenotare Clase Semanal Torno | **3** | Homepage > Card Torno > Semanal > Stripe |
| Prenotare Clase Suelta Modelado | **3** | Homepage > Card Modelado > Suelta > Cal.com |
| Prenotare Clase Suelta Torno | **3** | Homepage > Card Torno > Suelta > Cal.com |
| Coworking | **2** | Homepage > Coworking > WhatsApp |
| Workshop info | **2** | Homepage > Workshops > Google Drive |
| Comprare in Tienda | **2** | Homepage > Tienda > Etsy |
| Sessione privata | **2** | Homepage > Privadas > WhatsApp |
| Contatto generico | **1-2** | Homepage > WhatsApp floating button |

### Problemi di navigazione

| # | Problema | Gravita | Dettaglio |
|---|---|---|---|
| **A1** | **Nessun link "torna indietro" nelle pagine intermedie** | Alta | Le pagine /clases/semanal-*.html e /clases/suelta.html non hanno un breadcrumb o un link diretto alla sezione #clases. L'utente deve usare il navbar per tornare a /#clases. |
| **A2** | **Clase Suelta: entrambe le card homepage puntano alla stessa pagina** | Media | Sia "Clase Suelta" dal card Modelado che dal card Torno portano a /clases/suelta.html. La pagina ha entrambe le opzioni, quindi funziona, ma l'utente potrebbe aspettarsi un link diretto alla disciplina scelta. |
| **A3** | **Navbar ES non ha prefisso lingua** | Bassa | La navbar delle pagine ES sotto /clases/ usa link come /#clases, che funzionano correttamente perche il sito ES e' alla root. Non e' un bug, ma e' diverso dal pattern EN (/en/#clases) e CA (/ca/#clases). |
| **A4** | **Pagine suelta.html: nessun link bidirezionale dalle semanal** | Media | Le pagine semanal non linkano piu alla pagina suelta (il link "Clase Suelta" e' stato rimosso). L'unico modo per arrivarci e' dalla homepage. |

### Link mancanti o rotti

| # | Dove | Problema |
|---|---|---|
| **L1** | Privacy pages EN/CA | /en/privacy.html e /ca/privacy.html sono linkate nel footer e sitemap ma verificare che esistano fisicamente nel repo |
| **L2** | Pagine suelta.html | Grid CSS a 1fr 1fr e breakpoint a 600px -- consistente con il design (2 card), ma diverso dalle semanal che usano repeat(3, 1fr) e 768px |

### Pagine orfane

Nessuna pagina e' strettamente orfana. Tutte le pagine intermedie sono raggiungibili dalla homepage tramite i CTA nella sezione #clases. Tuttavia le pagine suelta non sono piu linkate dalle pagine semanal (solo dalla homepage).

---

## SEZIONE B — UX/UI

### 1. PROBLEMI CRITICI — da fixare subito

| # | Problema | Dove | Perche | Fix |
|---|---|---|---|---|
| **C1** | **Bottoni .btn sotto il minimo 44px** | css/style.css, classe .btn | Il padding 14px su .btn produce ~42px di altezza, sotto il minimo WCAG 2.1 AA di 44px per touch target | Aggiungere min-height: 44px alla classe .btn base |
| **C2** | **Stripe links da verificare** | 6 pagine semanal | I link Stripe buy.stripe.com/... sono link di pagamento reali. Verificare che siano tutti funzionanti e non placeholder | Testare tutti e 6 i link Stripe in un browser |
| **C3** | **CSS inline ripetuto in 9 pagine intermedie** | Tutte le pagine /clases/ | Ogni pagina ha un blocco style di ~50-70 righe con gli stessi stili (turno-hero, turno-card, turno-grid, turno-nota). Qualsiasi modifica futura richiede 9 edit manuali | Estrarre in una sezione dedicata di style.css |

### 2. PROBLEMI MEDI — da fixare presto

| # | Problema | Dove | Perche | Fix |
|---|---|---|---|---|
| **M1** | **Classe CSS .turno-card__suelta orfana** | style in tutte le 6 pagine semanal | Le definizioni CSS per .turno-card__suelta restano nel codice ma non ci sono piu elementi HTML che le usano | Rimuovere le 3 righe CSS orfane da tutte le pagine |
| **M2** | **Testo "Sin plazas?" usa inline styles** | 6 pagine semanal | Il link WhatsApp sotto ogni bottone Reservar ha 6 proprieta CSS inline invece di una classe dedicata. Rende la manutenzione costosa (18 link x 6 file) | Creare una classe .turno-card__waitlist o simile |
| **M3** | **Font custom (Garet, HighCruiser) da verificare** | css/style.css | Il CSS definisce --font-heading: 'Garet' e --font-sub: 'HighCruiser' con @font-face. Verificare che i file font esistano in /fonts/ e siano caricati correttamente | Controllare che i .woff2 esistano nella cartella fonts/ |
| **M4** | **Banner testo semanal non differenzia modelado/torno** | 6 pagine semanal | Il testo del banner e' identico per modelado e torno (tranne la nota "Maximo 2 personas" nel torno). Non menziona il prezzo specifico (120 vs 160 EUR) | Valutare se reinserire il prezzo nel banner per chiarezza |
| **M5** | **Link "Clase Suelta" rimosso dalle pagine semanal** | 6 pagine semanal | L'utente che arriva su semanal-modelado e non trova il turno giusto non ha un percorso alternativo verso la clase suelta -- solo "Sin plazas?" per WhatsApp | Valutare se reinserire un link sottile alla clase suelta |
| **M6** | **hover opacity: 0.8 su tutti i link** | css/style.css | C'e' una regola globale a:hover { opacity: 0.8 } che i bottoni devono sovrascrivere con opacity: 1. Pattern fragile -- qualsiasi nuovo link ne eredita il comportamento | Rimuovere la regola globale e applicare opacity solo dove serve |

### 3. MIGLIORAMENTI — nice to have

| # | Miglioramento | Dove | Beneficio |
|---|---|---|---|
| **N1** | **Breadcrumb sulle pagine intermedie** | 9 pagine /clases/ | "La Mesa > Clases > Clase Semanal Modelado" aiuterebbe la navigazione e il SEO |
| **N2** | **Comprimere nosotras.jpg** | /images/nosotras.jpg | 4.5 MB e' eccessivo per un'immagine web. Comprimere a ~200-300 KB max |
| **N3** | **hero.JPG case sensitivity** | /images/hero.JPG | Il file ha estensione maiuscola ma l'HTML referenzia hero.jpg. Funziona su macOS ma potrebbe fallire su GitHub Pages (Linux) |
| **N4** | **Workshop section: contenuto on-site** | Sezione #workshops | Rimanda a Google Drive per il programma. Ideale sarebbe mostrare i prossimi workshop direttamente nella pagina |
| **N5** | **Self-hosting font Montserrat** | head di tutte le pagine | Eliminare dipendenza da Google Fonts CDN per migliore privacy e performance |
| **N6** | **WebP con fallback per immagini** | Tutte le immagini | Le immagini sono JPG/PNG. WebP ridurrebbe il peso del 25-35% |
| **N7** | **WhatsApp pulse animation e reduced-motion** | css/style.css | L'animazione whatsapp-pulse non ha un target esplicito per prefers-reduced-motion (la cattura la regola universale, ma sarebbe meglio essere espliciti) |
| **N8** | **Consolidare colori hardcoded** | css/style.css | Valori come #555, #888, #444, #333, #666 non usano custom properties. Rende difficile un futuro tema o dark mode |
| **N9** | **Newsletter duplicata** | index.html (ES/EN/CA) | Due form newsletter identiche (workshops + footer) con lo stesso endpoint Mailchimp. Valutare se consolidare |

### 4. COSA FUNZIONA BENE — da preservare

| # | Cosa | Perche funziona |
|---|---|---|
| **OK1** | **Aria labels completi** | Ogni elemento interattivo ha un aria-label appropriato e tradotto nella lingua della pagina. Le sezioni hanno ruoli semantici corretti |
| **OK2** | **Heading hierarchy pulita** | Un solo h1 per pagina, h2 per sezioni, h3 per sottosezioni. Nessun salto di livello |
| **OK3** | **Hreflang corretto ovunque** | Tutte le 12+ pagine hanno tag hreflang corretti con x-default che punta a ES. I language switcher puntano alle versioni corrette |
| **OK4** | **JSON-LD structured data** | LocalBusiness + FAQPage presenti nelle 3 homepage. Buono per SEO locale |
| **OK5** | **Classe suelta chiara** | Le pagine suelta.html hanno un flusso semplice: 2 card, scelta modelado/torno, link Cal.com diretto. Zero confusione |
| **OK6** | **Badge "Abono mensual" sulle card** | Comunica immediatamente che la clase semanal e' un abbonamento, non una singola lezione |
| **OK7** | **Design system coerente** | Custom properties per colori, spacing, radius, transitions. Palette limitata e ben applicata |
| **OK8** | **Mobile-first approach** | Breakpoint a 375px, 600px, 768px, 1024px. Hamburger menu accessibile con aria-expanded |
| **OK9** | **prefers-reduced-motion rispettato** | Regola universale che disabilita animazioni e transizioni per utenti sensibili |
| **OK10** | **CTA differenziati per contesto** | Giallo su cards modelado, bianco su cards torno, nero su sfondo chiaro. Gerarchia visiva chiara |
| **OK11** | **Touch targets sulle card CTA** | .clase-card__cta ha min-height: 44px esplicito. Corretto per mobile |
| **OK12** | **Payment flow split logico** | Stripe per abbonamenti mensili (semanal), Cal.com per prenotazioni singole (suelta). Coerente con la natura del prodotto |

---

## Priorita suggerite per prossimo sprint

| Priorita | ID | Task | Effort | Impatto |
|---|---|---|---|---|
| 1 | C1 | Fix touch target bottoni (.btn min-height: 44px) | 5 min | Accessibilita |
| 2 | C3 | Estrarre CSS pagine intermedie in style.css | 1-2 ore | Manutenibilita |
| 3 | M5 | Reinserire link suelta nelle pagine semanal | 15 min | UX flow |
| 4 | A1 | Aggiungere breadcrumb/back link pagine intermedie | 30 min | Navigazione |
| 5 | N3 | Rinominare hero.JPG in hero.jpg | 2 min | Rischio deploy |
| 6 | N2 | Comprimere nosotras.jpg da 4.5MB | 5 min | Performance |
| 7 | M1 | Rimuovere CSS orfano .turno-card__suelta | 10 min | Pulizia codice |
| 8 | M2 | Classe CSS per link "Sin plazas?" | 20 min | Manutenibilita |
| 9 | M6 | Rimuovere hover opacity globale sui link | 10 min | CSS robustezza |
| 10 | N8 | Consolidare colori hardcoded in custom properties | 30 min | Design system |
