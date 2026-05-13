# P0-8 Baseline diagnostic — 2026-05-13

## DNS + redirect (server-side)

- **CNAME file**: `lamesabcn.com` ✓ (apex, no newline extra)
- **DNS A apex**: `185.199.108.153 / 109.153 / 110.153 / 111.153` (GitHub Pages CDN ✓)
- **DNS CNAME www**: `queondache.github.io.` ✓
- **`curl -I https://www.lamesabcn.com/`**: `HTTP/2 301` → `location: https://lamesabcn.com/` ✓ (redirect attivo)
- **`curl -I https://lamesabcn.com/`**: `HTTP/2 200` ✓

**Conclusione DNS/redirect**: server-side già corretto. Solo da allineare tag HTML/XML.

## Hero P0-2 stato (verifica)

Tutti e 3 home hanno `<picture>` con WebP source + JPG fallback:
- `index.html` line 177-179: `<source srcset="images/hero.webp">` + `<img src="images/hero.jpg">`
- `en/index.html` line 177-179: idem con `../images/`
- `ca/index.html` line 177-179: idem

**Conclusione P0-2**: fix d74c22c applicato correttamente. Andrea aveva temuto fosse mancante in serverside — possibile cache CDN GitHub Pages non ancora invalidata (max-age=600 = 10 min). Nessuna riapplicazione necessaria.

## Mismatch HTML/XML → tutti puntano a www

**Conteggio**: 45 file / 457 occorrenze totali di `https://www.lamesabcn.com`.

### Pattern affected
- `<link rel="canonical" href="https://www.lamesabcn.com/...">` su tutti i 38 HTML + sitemap + robots
- `<meta property="og:url">` / `og:image` / `twitter:image` su 3 home (e probabile su altri)
- JSON-LD `@id` / `url` / `image` / `mainEntityOfPage` su 3 home + clases + blog
- `sitemap.xml` `<loc>` × 39 entries
- `robots.txt` `Sitemap:` directive
- `llms.txt` reference

### Pattern NON affected (safe)
- `sameAs` JSON-LD: contiene solo `https://www.instagram.com/lamesa.lc` + `https://www.etsy.com/es/shop/LaMesaLC` (link esterni — il prefisso `www.` qui NON è lamesabcn, è il dominio di Instagram/Etsy stesso)

### File list (45 totale)
```
ROOT (4): index.html, robots.txt, sitemap.xml, llms.txt, gracias.html, team-building.html
EN (5): en/index.html, en/clases/{semanal-modelado,semanal-torno,suelta}.html, en/gracias.html, en/blog/index.html
CA (6): ca/index.html, ca/clases/{semanal-modelado,semanal-torno,suelta}.html, ca/gracias.html, ca/blog/index.html
CLASES ES (3): clases/{semanal-modelado,semanal-torno,suelta}.html
BLOG (24): 23 post + blog/index.html
```

## Strategia rewrite

Pattern unico find-replace globale:
- `https://www.lamesabcn.com` → `https://lamesabcn.com`

Safe perché `www.lamesabcn.com` mai compare in altri contesti (verificato sameAs).

457 occorrenze su 45 file = sotto soglia 50 file (stop condition rispettata).

## Hot finding pre-rewrite

- Decisione apex (no www) è la più semplice tecnicamente: il redirect server-side era già `www→apex`, quindi solo allineamento tag necessario.
- Decisione opposta (www come canonical) avrebbe richiesto rewrite redirect a livello DNS + invertita la logica = più rischio.
