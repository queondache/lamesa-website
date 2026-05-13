# Setup Check — Audit SEO + GEO + Performance (Fase 0)

Generato: 2026-05-13
Working dir: `~/Dev/la-mesa-v2/website/` (era `~/Dev/La mesa/Sito web`, spostato + rinominato)

---

## Skills locali

| Skill | Stato | Note |
|---|---|---|
| `seo-audit` | ✅ disponibile | `~/.claude/skills/seo-audit` |
| `ai-seo` | ✅ disponibile | `~/.claude/skills/ai-seo` |
| `competitor-alternatives` | ✅ disponibile | `~/.claude/skills/competitor-alternatives` |
| `content-strategy` | ✅ disponibile | `~/.claude/skills/content-strategy` |
| `chrome-devtools-mcp` | ✅ disponibile (plugin MCP) | Lighthouse + CWV diretto |
| `superpowers` | ✅ disponibile (plugin) | brainstorm + TDD + debug |

→ Nessuna skill mancante, no `--refresh` necessario.

---

## MCP servers (project `la-mesa-v2`)

`mcpServers: []` — nessun MCP configurato a livello progetto.

| Server richiesto | Stato | Impatto sul job |
|---|---|---|
| MCP GA4 (`G-SQ90MD674K`) | ❌ NON installato | Fase 3 (Performance GA4) bloccata |
| MCP Search Console (`lamesabcn.com`) | ❌ NON installato | Fase 3 (Performance GSC) bloccata |
| PageSpeed Insights API key | ❌ NON in .env (sito HTML statico, no .env) | Mitigabile via Chrome DevTools MCP |
| Chrome DevTools MCP | ✅ disponibile | OK per Lighthouse mobile/desktop |

---

## Capability senza MCP GA4/GSC

| Fase | Eseguibile in autonomia? | Mezzo alternativo |
|---|---|---|
| F1 — SEO tecnico | ✅ sì | WebFetch + Chrome DevTools MCP + lettura file locali |
| F2 — GEO + LLM citations | ✅ sì | WebFetch + WebSearch su 6 query target |
| F3 — Performance 60d | ❌ NO senza dati GA4/GSC | Richiede setup MCP o CSV export manuale |
| F4 — Competitor | ✅ sì | WebSearch + WebFetch siti competitor BCN |
| F5 — Content plan | ⚠️ parziale | Cluster basati su ricerca + brand context. Senza top-query GSC reali = ipotetico. Migliorabile post-F3. |
| F6 — Report finale | ✅ sì | Consolidamento findings F1+F2+F4+F5 |

---

## STOP Condition raggiunta

Per istruzioni audit (Fase 0):
> **STOP**: conferma con Andrea che setup è ok prima di Fase 1.

MCP GA4 + GSC non disponibili → necessaria decisione esplicita su come procedere prima di avviare Fase 1.

---

## Opzioni proposte

**A. Setup MCP GA4 + GSC ora (block fino a ready)**
- Setup tempo stimato: 20-40 min (richiede OAuth Google + config MCP server in `~/.claude.json`)
- Vantaggio: dati live, Fase 3 piena, F5 più solida
- Svantaggio: blocca audit ora

**B. Andrea fornisce CSV manuali GA4 + GSC**
- Andrea export da: analytics.google.com (60gg + 60gg precedenti) + search.google.com/search-console (60gg + 60gg precedenti)
- Salvo in `00_RAW_DATA/ga4_60d.csv` + `gsc_60d.csv`
- Vantaggio: dati reali senza setup MCP
- Svantaggio: manuale, 10 min lavoro Andrea

**C. Skip Fase 3 + procedere senza performance data**
- F5 content plan basato su brand context + ricerca competitor (no GSC top-query reali)
- F6 report finale senza dashboard performance 60d
- Vantaggio: zero blocchi, audit completo F1+F2+F4+F5+F6
- Svantaggio: meno dati actionable, F3 = "N/A — recupero pending"

**D. Procedere F1+F2+F4 in autonomia ora, F3 in second wave**
- Audit tecnico + GEO + competitor completo
- F3 in attesa dati Andrea (CSV o setup MCP)
- F5 + F6 dopo arrivo dati F3
- Vantaggio: progresso parallelo, niente sprechi tempo
- Svantaggio: 2 round consegna invece di 1
