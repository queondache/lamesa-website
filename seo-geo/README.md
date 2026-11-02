# SEO e GEO — punto di ripresa

Leggere questo file per primo. Cartella interna: esclusa dal sito pubblico (`_config.yml`).
Aggiornare **questo** file a fine sessione, sostituendo lo stato vecchio (niente file di stato paralleli).

## Dove siamo — 2 novembre 2026

Tema in lavoro: **encargos** (vajilla per ristoranti, noleggio, regali aziendali, regali di Natale).

| Cosa | Stato |
| --- | --- |
| Pagina regali aziendali ES/EN (`encargos/regalos-empresa.html`, `en/encargos/corporate-gifts.html`) | online (PR #56) |
| Tempi di Natale sui regali aziendali: su misura 2–3 settimane via WhatsApp/email, tienda online fino al 14/12 | online (PR #58) |
| Menu "Por encargo" su tutte le pagine (4 lingue) + link regali aziendali in home e piede | online (PR #59) |
| Regali originali di Natale: guida Barcellona + kit mosaico, ES/CA | **bozza, PR #60** (ramo `feat/regalos-navidad`) — in attesa materiali |
| Misure di partenza GA4 + Search Console + Perplexity | fatte → `misure/2026-11-02-partenza.md` |

Voti audit 2/11: SEO 7,5/10 (provvisorio), GEO 7/10.

## Prossimo passo

1. **PR #60 (regali Natale)**: servono URL prodotto del kit (atteso il 6/11), foto del team, contenuto scatola/tempo/età.
   Poi: aggiornare `KIT_SHOP_URL` in `scripts/build-regalos-navidad.py` e i commenti `PENDIENTE EQUIPO`,
   `python3 scripts/build-regalos-navidad.py .`, `node --test tests/*.test.mjs`, verificatore, merge.
   Kit esaurito → `KIT_AVAILABLE = False` e rigenerare.
2. Riscrivere la pagina madre encargos (oggi parla quasi solo ai ristoranti).
3. Nuove pagine `/encargos/restaurantes` e `/encargos/alquiler-vajilla`.
4. Servizi encargos nel profilo Google (Andrea / team).
5. Primo lunedì di dicembre: rifare le misure (vedi `misure/`) e aggiornare la tabella della strategia.

## Cosa è aperto

- Decisioni di Andrea (strategia, sezione "Decisioni"): prezzi indicativi, matrimoni, clienti citabili per nome, spesa.
  Già decise: nessun limite di quantità da citare; 14/12 vale solo per la tienda online.
- ChatGPT, Gemini e Google AI Overview non ancora misurati (solo Perplexity).
- Pagine `experiencias/*` e `tienda/*` hanno menu proprio, senza "Por encargo".
- Voce "Tienda" del menu punta ancora a `/#tienda`.

## File in questa cartella

- `strategia-encargos-2026-11.md` — piano nov 2026–gen 2027 (copia del documento del 2/11; l'originale vive nei Docs di Claude).
- `misure/` — una fotografia per data; la prima è `2026-11-02-partenza.md`.
- `strumenti/leggi-google.py` — legge GA4 e Search Console con il service account (`~/ga4-reader-key.json`, fuori dal repo).

Altri riferimenti:
- Audit precedente del sito (settembre–ottobre 2026): `seo-audit/` (stessa repo).
- Specifica e piano dei regali di Natale: `docs/superpowers/specs/2026-11-02-regalos-navidad-design.md`,
  `docs/superpowers/plans/2026-11-02-regalos-navidad.md` (nel ramo della PR #60).
- Report SEO/GEO generale: https://claude.ai/code/artifact/99e2df72-5a8e-4543-850b-e0ddb920716b
- Strategia encargos (versione viva): https://claude.ai/artifact/8a6dVyQ1kCU8iBK3snjzWg

## Regole da ricordare

- **Shopify non si tocca**: Codex sta sviluppando l'ecommerce sul server (VPS). Leggere i prodotti solo da `products.json` pubblico.
- Ogni modifica passa da PR + verificatore indipendente + controllo automatico `site-check` verde, poi merge
  con `gh pr merge N --merge --match-head-commit <sha>` e controllo online.
- Nessun test sul sito vivo: anteprima locale (`python3 -m http.server`) prima della PR.
- Ogni promessa sul sito (tempi, prezzi, quantità) deve essere confermata da Andrea; niente claim inventati sui prodotti.
- Testi: FAQ visibili = FAQ nei dati strutturati; meta description ≤ 160 caratteri; hreflang reciproci; sitemap e `llms.txt` aggiornati.
