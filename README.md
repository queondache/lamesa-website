# La Mesa – Laboratorio Creativo · Barcelona

Sito vetrina di **La Mesa**, studio di ceramica e laboratorio creativo a Barceloneta, Barcelona.

**Live:** [lamesabcn.com](https://www.lamesabcn.com)
**Instagram:** [@lamesa.lc](https://instagram.com/lamesa.lc)
**WhatsApp:** +34 711 55 20 30

---

## Stack

- HTML5 statico puro
- CSS3 (design tokens, responsive, animazioni CSS native)
- JavaScript vanilla ES6+ (no dipendenze esterne)
- Google Fonts (Montserrat)
- Hosting: GitHub Pages
- Dominio custom: lamesabcn.com

## Struttura

```
lamesa-website/
├── index.html          # Versione ES (default)
├── en/
│   └── index.html      # Versione EN
├── css/
│   └── style.css       # Design system completo
├── js/
│   └── main.js         # Navbar, scroll, lazy load, animazioni
├── images/             # Foto (da aggiungere)
├── fonts/              # Font custom (opzionale)
├── CNAME               # lamesabcn.com
└── README.md
```

## Sezioni

| Anchor | Sezione |
|--------|---------|
| `#inicio` | Hero |
| `#nosotras` | Qué es La Mesa |
| `#clases` | Clases y Talleres |
| `#workshops` | Sesiones Creativas |
| `#tienda` | Tienda |
| `#privadas` | Sesiones Privadas |
| `#artistas` | ¿Eres artista? |
| `#contacto` | Contacto + Footer |

## Come aggiungere le foto

1. Aggiungi i file in `/images/`
2. Nei placeholder HTML, decommentare il tag `<img>` e aggiornare `src` e `data-src`
3. Il lazy loading è già configurato via `IntersectionObserver`

**Nomi file consigliati:**
- `hero.jpg` — immagine hero (1440×800)
- `nosotras.jpg` — sezione nosotras (600×450)
- `pieza-01.jpg`, `pieza-02.jpg`, `pieza-03.jpg` — griglia tienda (400×400)
- `og-lamesa.jpg` — Open Graph image (1200×630)

## Link da aggiornare

- `id="etsy-link"` in `index.html` e `en/index.html` → aggiornare `href="#"` con URL Etsy reale

## Deploy GitHub Pages

```bash
git add .
git commit -m "feat: update website"
git push origin main
```

GitHub Pages si aggiorna automaticamente da `main`. Assicurarsi che in **Settings → Pages** sia configurato:
- Source: `Deploy from a branch`
- Branch: `main` / `/ (root)`

Il dominio custom `lamesabcn.com` viene letto dal file `CNAME`.

---

© 2026 La Mesa · Barcelona
