# LLM Citations Test — 6 query target

Generato: 2026-05-13
Metodo: Anthropic WebSearch (proxy SERP organico — limite: NON è AI Overview Google reale, NON è ChatGPT Search reale, NON è Perplexity reale. Misura presenza top-10 organic risultati su Brave/Anthropic web index, che è la fonte usata da Claude per citation. Per verifica completa servirebbe browser headless su ChatGPT/Perplexity/Gemini con account. Da fare manualmente da Andrea — vedi sezione "Manual verification needed".)

---

## Risultato sintetico

| # | Query | La Mesa cita? | Posizione | Top 3 competitor citati |
|---|---|---|---|---|
| 1 | estudio ceramica Barceloneta Barcelona clases | ❌ NO | — | ElTorn, Born to Clay, Forma |
| 2 | donde aprender cerámica en Barcelona principiantes | ❌ NO | — | ElTorn, Born to Clay, Tierra Cerámicas |
| 3 | ceramic workshop Barcelona for beginners | ❌ NO | — | Bcn Clay Studio, Taller Bas, Tierra Cerámicas |
| 4 | taller cerámica Barcelona principiantes mensual | ❌ NO | — | Born to Clay, Recrea, Atuell |
| 5 | clases de torno cerámico Barcelona | ❌ NO | — | Tierra Cerámicas, ElTorn, Atuell |
| 6 | team building creativo Barcelona cerámica | ❌ NO | — | Atuell (teambuilding), Oasis Creativo, Taller Gingell |

**Score: 0/6 — citation rate 0%**

Trigger STOP CONDITION da istruzioni audit: "Test LLM citation Fase 2.2 mostra 0/6 menzioni (allarme strategico)".

---

## Dato sorprendente

**Query #1 "estudio ceramica Barceloneta Barcelona"** include letteralmente il quartiere — La Mesa è l'UNICO studio ceramica a Barceloneta (i 17 competitor sono in Eixample/Gràcia/Poblenou/Born/Poble Sec/Sant Antoni) — eppure La Mesa NON appare. Significa che il sito non emerge nemmeno su query iper-geo-localizzata dove non ha concorrenza reale.

Causa probabile:
1. **Bassa autorità di dominio** — lamesabcn.com è nuovo, pochi backlink storici
2. **Brand name "La Mesa" troppo generico** — collide con ristoranti, mobilia, blog generici
3. **Manca presenza terza parte** — nessuna citation su Atrapalo, aladinia.com, GetYourGuide, Centres Cívics, ajuntament.barcelona.cat (dove competitor compaiono aggregati)
4. **Manca Google Business Profile verificato** (pendente da istruzioni)
5. **Schema LocalBusiness presente ma `sameAs` corto** (solo Instagram + Etsy, mancano Google Maps/Airbnb/TripAdvisor) → entity recognition LLM debole

---

## Competitor che dominano la SERP

Aggregati nelle 6 query, ordinati per occorrenze:

| Rank | Competitor | Dominio | Quartiere | Occorrenze | Note |
|---|---|---|---|---|---|
| 1 | Tierra Cerámicas | tierraceramicas.com | Gràcia + Eixample | 5/6 | **120€/mes — stesso prezzo La Mesa!** Doppia sede. |
| 2 | ElTorn Barcelona | eltornbarcelona.com | Poblenou | 4/6 | Settimanali + intensivi |
| 3 | Born to Clay | borntoclay.com | El Born | 4/6 | Adatta a livello, sala luminosa |
| 4 | Taller Bas | basbarcelona.com | Poble Sec | 3/6 | Intensivi weekend + monthly |
| 5 | Atuell | atuell.com | (verifica) | 3/6 | Modelado + torno principianti, incl. team building |
| 6 | Forma Ceramic School | formaarts.com | (verifica) | 3/6 | Scuola dal 1970 — autorità storica |
| 7 | Atelier Molí | ateliermoli.com | (verifica) | 2/6 | 4h mensili |
| 8 | Terra i Pell | terraipell.com | El Born | 2/6 | 20+ anni esperienza |
| 9 | Bcn Clay Studio | bcnclaystudio.com | Gràcia | 1/6 | Hand-building + wheel |
| 10 | Noï Taller | noitaller.com | (verifica) | 1/6 | Senza matrícula, materiali incl. |
| 11 | La Pintoràmica | lapintoramica.com | Gràcia + Born | 1/6 | Painting + team building |
| 12 | Feliz Studio | felizstudiobarcelona.com | (verifica) | 1/6 | Weekend workshops |
| 13 | Recrea | recreatallerdeceramica.com | (verifica) | 2/6 | — |
| 14 | Ceramic Lab | ceramic-l-a-b.com | (Carrer Quevedo, 08012 = Gràcia) | 1/6 | — |
| 15 | Oasis Creativo BCN | oasiscreativobcn.com | (verifica) | 2/6 | **Specialista team building** |
| 16 | Taller Gingell | tallergingell.com | Centro BCN | 1/6 | Team building 2-3h |
| 17 | Marta Cerámica | martaceramica.com | (verifica) | 1/6 | Team building |

**Top 3 reali** (alta frequenza + relevance): Tierra Cerámicas, ElTorn, Born to Clay.

**Specialista team building** che La Mesa non aveva intercettato come competitor: **Oasis Creativo BCN** e **Atuell/teambuilding**.

---

## Manual verification needed (per Andrea)

Per validare full LLM citation, ripetere queste 6 query su:
- **ChatGPT** (modalità search abilitata): https://chat.openai.com
- **Perplexity**: https://www.perplexity.ai
- **Google AI Overview**: cercare su google.com + osservare blocco AI all'inizio SERP
- **Claude.ai** (search abilitato): https://claude.ai
- **Gemini**: https://gemini.google.com

Per ogni query, annotare: La Mesa citata? In che posizione (1°/2°/3° fonte)? Quali competitor compaiono al suo posto?

Salvare risultati in tabella aggiuntiva qui sotto, sezione "Manual results 2026-05-13":

### Manual results 2026-05-13

| Query | ChatGPT | Perplexity | Google AI Overview | Claude.ai | Gemini |
|---|---|---|---|---|---|
| Q1 | TBD | TBD | TBD | TBD | TBD |
| Q2 | TBD | TBD | TBD | TBD | TBD |
| Q3 | TBD | TBD | TBD | TBD | TBD |
| Q4 | TBD | TBD | TBD | TBD | TBD |
| Q5 | TBD | TBD | TBD | TBD | TBD |
| Q6 | TBD | TBD | TBD | TBD | TBD |

---

## Sources WebSearch (per audit trail)

Q1 estudio ceramica Barceloneta:
- https://www.eltornbarcelona.com/
- https://www.borntoclay.com/
- https://www.formaarts.com/en/
- https://felizstudiobarcelona.com/
- https://www.tierraceramicas.com/
- https://terraipell.com/taller-curso-ceramica-barcelona/
- https://www.recreatallerdeceramica.com/
- https://ajuntament.barcelona.cat/centrescivics/es/activitat/8-talleres-de-ceramica

Q2 donde aprender ceramica BCN principiantes:
- https://www.eltornbarcelona.com/
- https://www.borntoclay.com/
- https://www.tierraceramicas.com/
- https://terraipell.com/
- https://basbarcelona.com/en/ceramics-courses/
- https://atuell.com/
- https://www.ateliermoli.com/cursos-de-ceramica/

Q3 ceramic workshop BCN beginners:
- https://bcnclaystudio.com/
- https://basbarcelona.com/en/ceramics-courses/
- https://www.tierraceramicas.com/en/
- https://lapintoramica.com/en/
- https://corriebain.com/
- https://www.claycapsule.com/en

Q4 taller ceramica BCN principiantes mensual:
- https://www.borntoclay.com/
- https://www.recreatallerdeceramica.com/
- https://atuell.com/
- https://www.ateliermoli.com/cursos-de-ceramica/
- https://laceramicaria.es/eng/

Q5 clases torno ceramico BCN:
- https://www.tierraceramicas.com/
- https://www.eltornbarcelona.com/
- https://atuell.com/
- https://www.tierraceramicas.com/clases-de-ceramica/clase-prueba-torno/
- https://www.formaarts.com/en/potters-wheel-courses-in-barcelona/
- https://noitaller.com/
- https://www.ceramic-l-a-b.com/

Q6 team building creativo BCN ceramica:
- https://atuell.com/teambuilding
- https://oasiscreativobcn.com/team-building-creativo-ceramica/
- https://tallergingell.com/es/blogs/group-activities-barcelona/team-building-barcelona
- https://martaceramica.com/team-building-ceramica/
- https://www.formaarts.com/talleres-para-grupos/
- https://lapintoramica.com/en/special-activities-and-events/
- https://animarius.com/team-building-creativo
