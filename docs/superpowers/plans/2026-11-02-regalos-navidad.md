# Regali originali per Natale — piano

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use `- [ ]`.

**Goal:** due pagine statiche ES+CA (kit mosaico, guida regali) collegate al sito, pronte da pubblicare quando il kit è in tienda.
**Architecture:** HTML statico generato una volta da un template esistente (`encargos/regalos-empresa.html`, `ca/encarrecs.html` per l'intestazione CA), stili `enc-*` esistenti, nessun CSS/JS nuovo. Link solo verso URL Shopify pubblici esistenti.
**Tech Stack:** HTML, JSON-LD, `node --test`.
**Spec:** `docs/superpowers/specs/2026-11-02-regalos-navidad-design.md`

## Global Constraints

- Shopify non si tocca. Nessun file `regalos-preview*`. Nessun CSS/JS nuovo.
- Kit: 30 €, EUR, «edición limitada» (~30 cajas), ritiro gratis in taller (Carrer de l'Atlàntida 47) o spedizione 14,99 €.
- Ultima data per Natale: 14 de diciembre / 14 de desembre.
- Collezioni tienda usate: `tazas`, `jarrones`, `macetas`, `lamparas`, `cocina`, `platos`, `bowls`, `all?sort_by=price-ascending`.
- Contenuti del team mancanti = commento `<!-- PENDIENTE EQUIPO: … -->`; la proposta resta in bozza finché ce ne sono.
- Tap target ≥ 44 px; immagini con `width`/`height`/`alt`.

## File

- Create: `regalos-originales-barcelona.html`, `kit-mosaico-ceramica.html`, `ca/regals-originals-barcelona.html`, `ca/kit-mosaic-ceramica.html`
- Create: `tests/regalos-navidad.test.mjs`
- Modify: `index.html`, `ca/index.html` (riquadro «Hacer un regalo»: link guida), `blog/regalos-ceramica-personalizados-barcelona.html`, `blog/regals-ceramica-personalitzats-barcelona.html` (link guida), `sitemap.xml`, `llms.txt`

## Review Focus

1. Kit esaurito → la pagina deve poter passare ad «agotado» cambiando un punto solo (commento guida + `availability`).
2. Lingua: pagina CA tutta in catalano, hreflang es↔ca reciproco, menu CA.
3. Prezzo nei dati strutturati = prezzo nel testo (30).
4. Nessun link interno rotto; link esterni solo `tienda.lamesabcn.com` e `wa.me`.
5. Date: 14/12 coerente con le pagine regali aziendali.

### Task 1: test

- [ ] `tests/regalos-navidad.test.mjs`: per ognuna delle 4 pagine: `lang` corretto; canonical = URL; hreflang es e ca reciproci; ogni JSON-LD fa parse; il kit ha `Product` con `offers.price === "30"`, `priceCurrency === "EUR"`, testo visibile contiene «30 €»; FAQ visibile == FAQPage; link locali esistono; link esterni solo `https://tienda.lamesabcn.com/` o `https://wa.me/`; testo contiene «14 de diciembre» (ES) / «14 de desembre» (CA); nessun `regalos-preview`.
- [ ] Run `node --test tests/regalos-navidad.test.mjs` → FAIL (file mancanti).

### Task 2: pagine kit + guida ES/CA

- [ ] Generare le 4 pagine dal template: head (title, description ≤160, canonical, hreflang, og), JSON-LD (BreadcrumbList; kit: Product+Offer+FAQPage; guida: ItemList delle sezioni + FAQPage), main nuovo, footer/contatti del template.
- [ ] Run test → PASS; `node --test tests/*.test.mjs` → tutto verde.
- [ ] Commit.

### Task 3: collegamenti

- [ ] Home ES/CA (riquadro regalo), articoli blog ES/CA, `sitemap.xml` (4 URL), `llms.txt`.
- [ ] Prova a 390 px delle 4 pagine; test verdi; commit; proposta in bozza; verifica indipendente.
