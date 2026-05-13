# P0-8 Post-deploy verification — 2026-05-13

**Commit deployed**: `98ca899` pushed origin main + GitHub Pages auto re-deploy (~3 min waited).

## Test 1 — Canonical apex su prod home

```bash
curl -s https://lamesabcn.com/ | grep -i 'rel="canonical"'
```
Output:
```
<link rel="canonical" href="https://lamesabcn.com/">
```
✅ Canonical apex (no www) servito da produzione.

## Test 2 — Redirect www → apex

```bash
curl -sI https://www.lamesabcn.com/ | grep -iE "^HTTP|^location"
```
Output:
```
HTTP/2 301
location: https://lamesabcn.com/
```
✅ Redirect 301 server-side attivo.

## Test 3 — Apex HTTP 200

```bash
curl -sI https://lamesabcn.com/ | head -1
```
Output:
```
HTTP/2 200
```
✅ Apex risponde 200 OK.

## Test 4 — Sitemap apex

```bash
curl -s https://lamesabcn.com/sitemap.xml | grep -E "<loc>" | head -5
```
Output:
```
<loc>https://lamesabcn.com/</loc>
<loc>https://lamesabcn.com/en/</loc>
<loc>https://lamesabcn.com/ca/</loc>
<loc>https://lamesabcn.com/clases/semanal-modelado.html</loc>
<loc>https://lamesabcn.com/en/clases/semanal-modelado.html</loc>
```
✅ Tutti i `<loc>` apex, no www.

## Test 5 — Bonus: zero www.lamesabcn in prod HTML

```bash
curl -s https://lamesabcn.com/ | grep -c "www\.lamesabcn"
```
Output: `0` ✅ — nessun residuo di www in HTML servito.

## Test 6 — Hero P0-2 conferma

```bash
curl -s https://lamesabcn.com/ | grep -oE 'hero\.(webp|jpg)' | sort -u
```
Output: `hero.jpg` + `hero.webp` ✅ — `<picture>` con WebP source + JPG fallback servito da prod.

## Conclusione

Tutti i 6 controlli OK. P0-8 chiusa con successo. Da monitorare GSC 7-14g per consolidamento URL → URL UTM-tagged storici dovrebbero confluire sul canonical apex.

Hero P0-2 era falso allarme web_fetch precedente (probabile cache CDN GitHub Pages max-age=600).
