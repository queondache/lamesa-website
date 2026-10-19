// Genera la homepage D3 e la pagina FAQ nelle quattro lingue da un solo modello.
// Uso (dalla cartella del sito):
//   node dev/nueva-home/build.mjs        → pagine definitive del sito (/, /en/, /ca/, /pt/ + FAQ)
//   node dev/nueva-home/build.mjs dev    → anteprima di prova in dev/nueva-home/ (noindex, foto locali)
// Nessuna dipendenza: solo Node.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LANGS, QUOTES, FAQ_KEYS, HOME_FAQ, BONO, MAPS, RATING, REVIEWS_TOTAL, wa } from './src/i18n.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, '..', '..');
const css = readFileSync(path.join(here, 'src', 'site.css'), 'utf8');
const SPRITE = readFileSync(path.join(here, 'src', 'sprite.svg'), 'utf8').trim();
const ORDER = ['es', 'en', 'ca', 'pt'];
const SITE = 'https://lamesabcn.com';
// Mappa del footer: stesso embed Google Maps delle home precedenti, interfaccia nella lingua della pagina
const MAP_EMBED = (lang) => "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.73232532334!2d2.1872730759081325!3d41.379899971300794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a3a9facb9f0d%3A0xc916c573c8382ce3!2sCarrer%20de%20l'Atl%C3%A0ntida%2C%2047%2C%20Ciutat%20Vella%2C%2008003%20Barcelona!5e0!3m2!1sit!2ses!4v1774454480233!5m2!1sit!2ses".replace(/!1sit!2ses/g, `!1s${lang}!2ses`);
const OG_LOCALE = { es: 'es_ES', en: 'en_GB', ca: 'ca_ES', pt: 'pt_BR' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const arrow = (label) => `${esc(label)} <span class="ar" aria-hidden="true">→</span>`;
const ext = 'target="_blank" rel="noopener noreferrer"';
const waIcon = '<svg aria-hidden="true"><use href="#i-wa"/></svg>';
const plus = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

// Foto: una per proposta, nessuna ripetuta nella pagina. Percorso sul sito vero + dimensioni.
const IMG = {
  hero: ['images/hero.webp', 2302, 1536],
  probar: ['images/nosotras.webp', 1200, 1600],
  aprender: ['images/pieza-01.jpg', 800, 800],
  regalo: ['images/foto-tienda-4.jpg', 800, 600],
  grupo: ['images/pieza-02.jpg', 800, 800],
  resto: ['images/encargos/descanso-verde-piedra-set-960.webp', 960, 640],
  about: ['images/lau-vick-960.webp', 960, 640],
  logo: ['images/logo-lamesa.png', 1080, 1080],
};

// Le cinque porte: stesso ordine in menu, domanda, indice e footer
const DOORS = [
  { nav: 'exp', offer: 'probar', id: 'experiencias' },
  { nav: 'courses', offer: 'aprender', id: 'cursos' },
  { nav: 'shop', offer: 'regalo', id: 'tienda' },
  { nav: 'groups', offer: 'grupo', id: 'grupos' },
  { nav: 'resto', offer: 'resto', id: 'restaurantes' },
];

// Contesto di una pagina: lingua, tipo (home|faq), destinazione (prod|dev)
function context(code, kind, target) {
  const L = LANGS[code];
  const prod = target === 'prod';
  const depth = code === 'es' ? '' : '../';
  // URL pubblico «pulito» di una pagina: /, /en/, /preguntas-frecuentes.html…
  const publicPath = (c, k) => '/' + LANGS[c].files[k].replace(/(^|\/)index\.html$/, '$1');
  return {
    code, kind, target, prod, L,
    asset: (p) => (prod ? '/' + p : depth + 'img/' + path.basename(p)),
    fonts: prod ? '/fonts/' : depth + 'fonts/',
    pageHref: (c, k) => (prod ? publicPath(c, k) : depth + LANGS[c].files[k]),
    canonical: (c = code, k = kind) => SITE + publicPath(c, k),
    // in produzione le FAQ senza risposta non si pubblicano; in prova restano segnate [COMPLETAR]
    faqKeys: (keys) => (prod ? keys.filter((k) => L.faq.items[k][1] !== null) : keys),
  };
}

const img = (ctx, key, alt, extra = 'loading="lazy" decoding="async"') => {
  const [file, w, h] = IMG[key];
  return `<img src="${ctx.asset(file)}" alt="${esc(alt)}" width="${w}" height="${h}" ${extra}>`;
};

// Negozio: pagina /tienda/ della lingua, che porta a Shopify (js/shop-links.js)
const shopHref = (L) => '/' + (L.htmlLang === 'es' ? '' : L.htmlLang + '/') + 'tienda/';
// Email: mai in chiaro nell'HTML; js/contact-email.js costruisce il mailto al caricamento
const AT = { es: 'arroba', en: 'at', ca: 'arrova', pt: 'arroba' };
const emailLink = (L, subject, attrs = '') => `<a${attrs} data-email-user="lamesa.lc" data-email-domain="gmail.com"${subject ? ` data-email-query="subject=${encodeURIComponent(subject)}"` : ''}>lamesa.lc [${AT[L.htmlLang]}] gmail.com</a>`;

// «Cursos» non ha una pagina riassuntiva: porta alla riga dell'indice con modelado e torno
function doorHref(ctx, nav) {
  const l = ctx.L.l;
  const href = { exp: l.exp, courses: '#cursos', shop: shopHref(ctx.L), groups: l.team, resto: l.resto }[nav];
  return ctx.kind === 'faq' && href.startsWith('#') ? ctx.pageHref(ctx.code, 'home') + href : href;
}
const doorAttrs = () => '';

// Pulsanti di una proposta: `where` = panel (domanda) | index (righe 01–05)
function offerActions(L, key, where) {
  const o = L.offer[key];
  const l = L.l;
  const mail = (subject) => `<p class="${where === 'panel' ? 'extra' : 'mail'}">${esc(L.ui.orMail)} ${emailLink(L, subject)}</p>`;
  // il bono è l'unico link della home verso Mesana (prenotazione standard, stessa scheda)
  const bono = (label, cls) => `<a${cls ? ` class="${cls}"` : ''} href="${BONO}" rel="noopener" data-standard-booking data-track="bono_horas">${esc(label)}</a>`;
  switch (key) {
    case 'probar':
      return { btns: `<a class="btn ${where === 'panel' ? 'btn-y' : 'btn-b'}" href="${l.exp}" data-track="clase_suelta">${arrow(o.cta)}</a>`, extra: '' };
    case 'aprender':
      return {
        btns: `<a class="btn btn-b" href="${l.modelado}" data-track="taller_semanal">${arrow(o.modelado)}</a><a class="btn btn-b" href="${l.torno}" data-track="taller_semanal">${arrow(o.torno)}</a>`,
        extra: where === 'panel' ? `<p class="extra">${bono(o.bono)}</p>` : '',
      };
    case 'regalo':
      return { btns: `<a class="btn btn-y" href="${shopHref(L)}"${where === 'panel' ? ' id="shop-link"' : ''} data-track="tienda">${arrow(o.cta)}</a><a class="btn btn-wa" href="${wa(o.wa)}" ${ext} data-track="vale_regalo">${waIcon}${esc(o.voucher)}</a>`, extra: '' };
    case 'grupo':
      return { btns: `<a class="btn btn-b" href="${l.team}" data-track="team_building">${arrow(o.cta)}</a><a class="btn btn-wa" href="${wa(o.wa)}" ${ext} data-track="privada_wa">${waIcon}WhatsApp</a>`, extra: mail(o.subject) };
    case 'resto':
      return { btns: `<a class="btn btn-b" href="${l.resto}" data-track="encargos">${arrow(o.cta)}</a><a class="btn btn-wa" href="${wa(o.wa)}" ${ext} data-track="encargos_wa">${waIcon}WhatsApp</a>`, extra: mail(o.subject) };
  }
}

// Tracciamento e consenso cookie come sulle pagine attuali del sito
const ANALYTICS = `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SQ90MD674K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-SQ90MD674K');
</script>
<!-- Meta Pixel -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '928743266641763');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=928743266641763&ev=PageView&noscript=1"/></noscript>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href*="wa.me/34711552030"]').forEach(function(link) {
      link.addEventListener('click', function() {
        if (typeof gtag === 'function') gtag('event', 'click_whatsapp', {'event_category': 'conversion', 'event_label': 'whatsapp_contact'});
        if (typeof fbq === 'function') fbq('track', 'Contact');
      });
    });
  });
</script>`;

function head(ctx) {
  const { L, code, kind, prod } = ctx;
  const title = kind === 'home' ? L.title : L.faqTitle;
  const alternates = [...ORDER.map((c) => `<link rel="alternate" hreflang="${c}" href="${ctx.canonical(c)}">`),
    `<link rel="alternate" hreflang="x-default" href="${ctx.canonical('es')}">`].join('\n');
  const seo = prod
    ? `<link rel="canonical" href="${ctx.canonical()}">
${alternates}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(L.description)}">
<meta property="og:url" content="${ctx.canonical()}">
<meta property="og:image" content="${SITE}/images/og-lamesa.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${OG_LOCALE[code]}">
<meta property="og:site_name" content="La Mesa Barcelona">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(L.description)}">
<meta name="twitter:image" content="${SITE}/images/og-lamesa.jpg">
<meta name="geo.region" content="ES-CT">
<meta name="geo.placename" content="Barcelona">
<meta name="geo.position" content="41.3783;2.1894">
<meta name="ICBM" content="41.3783, 2.1894">`
    : `<!-- pagina di prova: fuori dai motori di ricerca -->
<meta name="robots" content="noindex, nofollow">
${alternates}`;
  return `<!DOCTYPE html>
<html lang="${L.htmlLang}">
<head>
${prod ? '<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="0c496daf-df8d-4640-8875-84e193803d9a" data-blockingmode="auto" type="text/javascript" async></script>\n' : ''}<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(L.description)}">
${seo}
<meta name="theme-color" content="#FFFAEE">
${prod ? `<link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/images/favicon-180.png">` : `<link rel="icon" href="${ctx.asset(IMG.logo[0])}">`}
<link rel="preload" href="${ctx.fonts}Garet-Black.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
${css.replace(/__BASE__fonts\//g, ctx.fonts)}
</style>
${prod ? ANALYTICS + '\n' : ''}</head>`;
}

function langLinks(ctx, cls) {
  return `<div class="${cls}" role="group" aria-label="${esc(ctx.L.ui.language)}">${ORDER.map((c) =>
    `<a href="${ctx.pageHref(c, ctx.kind)}" hreflang="${c}" lang="${c}"${c === ctx.code ? ' aria-current="page"' : ''} title="${LANGS[c].name}">${LANGS[c].label}</a>`).join('')}</div>`;
}

// Avviso «questa pagina esiste nella tua lingua» del sito attuale (solo home in produzione)
function langSuggest(ctx) {
  if (!ctx.prod || ctx.kind !== 'home') return '';
  return `<div id="lang-suggest-bar" class="lang-suggest" hidden role="region" aria-label="${esc(ctx.L.ui.language)}">
  <div class="lang-suggest__inner">
    <p class="lang-suggest__message"><span class="lang-suggest__text" id="lang-suggest-text"></span> <a href="#" class="lang-suggest__cta" id="lang-suggest-link"></a></p>
    <button type="button" class="lang-suggest__close" id="lang-suggest-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
  </div>
</div>
<script src="/js/lang-suggest.js?v=3" data-cookieconsent="ignore"></script>`;
}

function nav(ctx) {
  const { L } = ctx;
  const homeHref = ctx.kind === 'home' ? '#inicio' : ctx.pageHref(ctx.code, 'home');
  return `<a class="skip" href="#contenido">${esc(L.ui.skip)}</a>
${langSuggest(ctx)}
<header class="nav">
  <div class="wrap nav-bar">
    <a class="brand" href="${homeHref}" aria-label="${esc(L.ui.home)}"><img src="${ctx.asset(IMG.logo[0])}" alt="" width="30" height="30"><span>LA MESA</span></a>
    <nav aria-label="${esc(L.ui.mainNav)}">
      <ul class="nav-links">
${DOORS.map((d) => `        <li><a href="${doorHref(ctx, d.nav)}"${doorAttrs(d.nav)}>${esc(L.nav[d.nav][0])}</a></li>`).join('\n')}
      </ul>
    </nav>
    <div class="nav-end">
      ${langLinks(ctx, 'lang-mini')}
      <a class="btn btn-y nav-cta" href="${L.l.exp}" data-track="nav_reservar">${esc(L.nav.cta)}</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="${esc(L.ui.openMenu)}" data-open-label="${esc(L.ui.openMenu)}" data-close-label="${esc(L.ui.closeMenu)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </div>
  <div class="drawer" id="drawer" hidden>
    <div class="wrap">
      <ul>
${DOORS.map((d, i) => `        <li><a href="${doorHref(ctx, d.nav)}"${doorAttrs(d.nav)}><span class="n">0${i + 1}</span><b>${esc(L.nav[d.nav][0])}</b><span class="arr" aria-hidden="true">→</span><small>${esc(L.nav[d.nav][1])}</small></a></li>`).join('\n')}
      </ul>
      <div class="drawer-foot">
        <a class="btn btn-y" href="${L.l.exp}" data-track="nav_reservar">${arrow(L.nav.cta)}</a>
        ${langLinks(ctx, 'langs')}
      </div>
    </div>
  </div>
</header>`;
}

function hero(ctx) {
  const { L, code } = ctx;
  const rating = RATING[code];
  const proof = (short) => `<a class="proof" href="${MAPS}" ${ext} aria-label="${rating} · ${REVIEWS_TOTAL} ${esc(L.hero.reviews)}: Google Maps"><b aria-hidden="true">★★★★★</b><span>${rating} · ${REVIEWS_TOTAL} ${esc(short ? L.hero.reviewsShort : L.hero.reviews)}</span></a>`;
  const chips = DOORS.map((d, i) => `<button class="chip" type="button" role="tab" id="t-${d.offer}" aria-controls="p-${d.offer}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''} data-answer="${d.offer}">${esc(L.who.chips[d.offer])}</button>`).join('\n          ');
  const panels = DOORS.map((d, i) => {
    const o = L.offer[d.offer];
    const a = offerActions(L, d.offer, 'panel');
    const facts = o.facts ? `<ul class="facts">${o.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : '';
    return `<div class="panel" role="tabpanel" id="p-${d.offer}" aria-labelledby="t-${d.offer}"${i ? ' hidden' : ''}>
        ${img(ctx, d.offer, o.alt)}
        <div class="in">
          <h3>${esc(o.h)}</h3>
          <p class="desc">${esc(o.p)}</p>
          ${facts}
        </div>
        <div class="btns">${a.btns}${a.extra}</div>
      </div>`;
  }).join('\n      ');
  const long = (L.hero.before + L.hero.mark).length > 52 ? ' class="long"' : '';
  return `<section class="top" aria-label="${esc(L.who.q)}">
  <div class="wrap top-grid">
    <div class="t-text">
      <h1${long}>${esc(L.hero.before)}<span class="mark">${esc(L.hero.mark)}</span></h1>
      <p class="sub">${esc(L.hero.sub)}</p>
      <!-- dato Google rilevato il 18/10/2026 dalla scheda pubblica -->
      ${proof(false)}
    </div>
    <figure class="t-photo">
      ${img(ctx, 'hero', L.hero.photoAlt, 'fetchpriority="high" sizes="(min-width:1024px) 640px, 100vw"')}
      ${proof(true)}
    </figure>
    <div class="t-who" id="que-te-trae" role="region" aria-labelledby="who-q">
      <div class="who-card">
        <button class="who-close" type="button" aria-label="${esc(L.ui.close)}" data-close-who>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <div class="who-head">
          <h2 class="who-q" id="who-q">${esc(L.who.q)}</h2>
          <div class="chips" role="tablist" aria-label="${esc(L.ui.choose)}">
          ${chips}
          </div>
        </div>
      ${panels}
        <div class="who-more"><button class="link link-btn" type="button" data-close-who>${esc(L.ui.seeAll)} ↓</button></div>
      </div>
    </div>
  </div>
</section>`;
}

function indexSection(ctx) {
  const { L } = ctx;
  const rows = DOORS.map((d, i) => {
    const o = L.offer[d.offer];
    const a = offerActions(L, d.offer, 'index');
    return `<details class="row${i === 0 ? ' first' : ''}" id="${d.id}">
        <summary><span class="n">0${i + 1}</span><span class="t">${esc(L.nav[d.nav][0])}<small>${esc(L.index.lines[d.nav])}</small></span><span class="pl" aria-hidden="true">${plus}</span></summary>
        <div class="body">
          <p>${esc(o.index || o.p)}</p>
          <div class="btns">${a.btns}</div>
          ${a.extra}
        </div>
      </details>`;
  }).join('\n      ');
  return `<section class="section" id="todo" aria-labelledby="todo-h">
  <div class="wrap">
    <p class="eyebrow">${esc(L.index.eyebrow)}</p>
    <h2 class="h2" id="todo-h" tabindex="-1">${esc(L.index.h)}</h2>
    <div class="index">
      ${rows}
    </div>
  </div>
</section>`;
}

function about(ctx) {
  const { L } = ctx;
  const A = L.about;
  const facts = A.facts;
  return `<section class="section about-sec" id="nosotras" aria-labelledby="about-h">
  <div class="wrap about">
    <figure>
      ${img(ctx, 'about', A.alt, `loading="lazy" decoding="async"${ctx.prod ? ' srcset="/images/lau-vick-960.webp 960w, /images/lau-vick-1536.webp 1536w" sizes="(min-width:900px) 560px, 100vw"' : ''}`)}
      <figcaption>${esc(A.caption)}</figcaption>
    </figure>
    <div>
      <p class="eyebrow">${esc(A.eyebrow)}</p>
      <h2 class="h2" id="about-h">${esc(A.before)}<span class="mark">${esc(A.mark)}</span></h2>
      <p class="lead">${esc(A.p1)}</p>
      <p class="lead">${esc(A.p2)}</p>
      <div class="about-facts">
        ${facts.map(([b, s]) => `<div><b>${esc(b)}</b><span>${esc(s)}</span></div>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>`;
}

function reviews(ctx) {
  const { L, code } = ctx;
  const R = L.reviews;
  return `<!-- recensioni Google reali (estratti), testo originale in spagnolo -->
<section class="reviews" aria-labelledby="rev-h">
  <div class="wrap rev-wrap">
    <div class="rev-score">
      <h2 class="rev-h" id="rev-h"><b>${RATING[code]}</b><i aria-hidden="true">★★★★★</i><span>${REVIEWS_TOTAL} ${esc(L.hero.reviews)}</span></h2>
      ${R.original ? `<p class="rev-note">${esc(R.original)}</p>` : ''}
      <a class="link" href="${MAPS}" ${ext}>${arrow(R.readAll)}</a>
    </div>
    <div class="quotes" tabindex="0" role="region" aria-label="${esc(R.label)}">
      ${QUOTES.map((q) => `<blockquote class="quote" lang="es"><p>${esc(q.text)}</p><footer lang="${code}">${esc(q.name)} · ${esc(R.ctx[q.ctx])}</footer></blockquote>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function faqItems(L, keys) {
  return keys.map((k) => {
    const [q, a] = L.faq.items[k];
    const ans = a === null ? `<span class="todo">[COMPLETAR]</span> ${esc(L.ui.todo)}` : esc(a);
    return `<details class="faq"><summary>${esc(q)}</summary><div class="ans">${ans}</div></details>`;
  }).join('\n        ');
}

// Dati strutturati: FAQ solo con risposta vera; in produzione anche l'attività (LocalBusiness)
function jsonLd(ctx, keys) {
  const { L, code } = ctx;
  const mainEntity = keys.filter((k) => L.faq.items[k][1] !== null).map((k) => ({
    '@type': 'Question', name: L.faq.items[k][0], acceptedAnswer: { '@type': 'Answer', text: L.faq.items[k][1] },
  }));
  const faq = `<script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: L.htmlLang, mainEntity })}
</script>`;
  if (!ctx.prod || ctx.kind !== 'home') return faq;
  const graph = readFileSync(path.join(here, 'src', `ld-${code}.json`), 'utf8');
  return `<script type="application/ld+json">
${JSON.stringify(JSON.parse(graph))}
</script>
${faq}`;
}

function faqHome(ctx) {
  const { L } = ctx;
  const total = ctx.faqKeys(FAQ_KEYS).length;
  return `<section class="section" id="faq" aria-labelledby="faq-h">
  <div class="wrap faq-grid">
    <div>
      <p class="eyebrow">${esc(L.faq.eyebrow)}</p>
      <h2 class="h2" id="faq-h">${esc(L.faq.h)}</h2>
      <p class="lead">${esc(L.faq.lead)}</p>
    </div>
    <div>
      <div class="faqs">
        ${faqItems(L, ctx.faqKeys(HOME_FAQ))}
      </div>
      <a class="btn btn-line faq-all" href="${ctx.pageHref(ctx.code, 'faq')}">${arrow(L.faq.all.replace('{n}', total))}</a>
    </div>
  </div>
</section>`;
}

function footer(ctx) {
  const { L } = ctx;
  const F = L.foot;
  const faqHref = ctx.kind === 'faq' ? '#faq' : ctx.pageHref(ctx.code, 'faq');
  return `<footer class="foot" id="contacto">
  <div class="wrap">
    <h2 class="h2">${esc(F.h)}</h2>
    <div class="foot-grid">
      <div>
        <h3>${esc(F.where)}</h3>
        <address>Carrer de l'Atlàntida, 47<br>La Barceloneta, Barcelona</address>
        <a class="fl" href="${MAPS}" ${ext}>${arrow(F.maps)}</a>
      </div>
      <div>
        <h3>${esc(F.contact)}</h3>
        <a class="fl" href="tel:+34711552030">+34 711 55 20 30</a>
        ${emailLink(L, '', ' class="fl"')}
      </div>
      <div>
        <h3>${esc(F.follow)}</h3>
        <a class="fl" href="https://instagram.com/lamesa.lc" ${ext}><svg aria-hidden="true"><use href="#i-ig"/></svg>@lamesa.lc</a>
        <a class="fl" href="${wa(F.wa)}" ${ext}>${waIcon}WhatsApp</a>
      </div>
    </div>
    <div class="foot-map">
      <iframe src="${MAP_EMBED(L.htmlLang)}" width="100%" height="360" style="border:0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${esc(F.mapTitle)}"></iframe>
    </div>
    <nav class="foot-links" aria-label="${esc(L.ui.footNav)}">
${DOORS.map((d) => `      <a href="${doorHref(ctx, d.nav)}"${doorAttrs(d.nav)}>${esc(L.nav[d.nav][0])}</a>`).join('\n')}
      <a href="${faqHref}">${esc(L.nav.faq)}</a>
      <a href="${L.l.blog}">${esc(L.nav.blog)}</a>
      <a href="${L.l.privacy}">${esc(L.nav.privacy)}</a>
    </nav>
    <div class="foot-bar">
      ${langLinks(ctx, 'langs')}
      <p>${esc(F.tagline)}</p>
      <p>${esc(F.rights)}</p>
    </div>
  </div>
</footer>
<a class="wa-float" href="${wa(F.wa)}" ${ext} aria-label="${esc(L.ui.waFloat)}">${waIcon}</a>`;
}

const EMAIL_JS = '<script src="/js/contact-email.js?v=1" data-cookieconsent="ignore" defer></script>';

const SCRIPT = `<script>
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // come sulle home precedenti: prenotazioni di classe, corsi e bono contano anche come Lead per Meta
  var LEAD = { clase_suelta: 'clase_suelta', nav_reservar: 'clase_suelta', taller_semanal: 'taller_semanal', bono_horas: 'bono_horas' };
  function track(label) {
    if (typeof window.gtag === 'function') window.gtag('event', 'click_cta', { event_category: 'conversion', event_label: label });
  }
  document.querySelectorAll('[data-track]').forEach(function (a) {
    a.addEventListener('click', function () {
      track(a.dataset.track);
      var lead = LEAD[a.dataset.track];
      if (lead && typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: lead });
    });
  });

  // Menu su telefono
  var burger = document.querySelector('.burger');
  var drawer = document.getElementById('drawer');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? burger.dataset.closeLabel : burger.dataset.openLabel);
    drawer.hidden = !open;
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) { setMenu(false); burger.focus(); } });

  // Apre la riga dell'indice indicata dall'ancora (#cursos dal menu)
  function openFromHash() {
    var row = location.hash && document.querySelector('details.row' + location.hash);
    if (row) row.open = true;
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();

  // Domanda «¿Qué te trae?»: schede accessibili da tastiera
  var who = document.getElementById('que-te-trae');
  if (!who) return;
  var chips = Array.prototype.slice.call(who.querySelectorAll('.chip'));
  function select(id, focus) {
    chips.forEach(function (c) {
      var on = c.dataset.answer === id;
      c.setAttribute('aria-selected', on ? 'true' : 'false');
      c.tabIndex = on ? 0 : -1;
      document.getElementById(c.getAttribute('aria-controls')).hidden = !on;
      if (on && focus) c.focus();
    });
  }
  // porta in vista la proposta scelta se finisce sotto il bordo dello schermo
  function reveal(id) {
    var panel = document.getElementById('p-' + id);
    if (panel.getBoundingClientRect().bottom > window.innerHeight - 8) {
      panel.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    }
  }
  chips.forEach(function (c, i) {
    c.addEventListener('click', function () { select(c.dataset.answer); track('respuesta_' + c.dataset.answer); reveal(c.dataset.answer); });
    c.addEventListener('keydown', function (e) {
      var n = chips.length, j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % n;
      else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = n - 1;
      if (j === null) return;
      e.preventDefault();
      select(chips[j].dataset.answer, true);
    });
  });
  // X o «Ver todo»: chiude la domanda e porta all'indice
  who.querySelectorAll('[data-close-who]').forEach(function (b) {
    b.addEventListener('click', function () {
      who.hidden = true;
      var h = document.getElementById('todo-h');
      document.getElementById('todo').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      h.focus({ preventScroll: true });
    });
  });
})();
</script>`;

function homePage(ctx) {
  return `${head(ctx)}
<body>
${nav(ctx)}
<main id="contenido">
<div id="inicio"></div>
${hero(ctx)}
${indexSection(ctx)}
${about(ctx)}
${reviews(ctx)}
${faqHome(ctx)}
</main>
${footer(ctx)}
${SPRITE}
${jsonLd(ctx, ctx.faqKeys(HOME_FAQ))}
${SCRIPT}
${EMAIL_JS}
</body>
</html>
`;
}

function faqPage(ctx) {
  const { L } = ctx;
  const keys = ctx.faqKeys(FAQ_KEYS);
  return `${head(ctx)}
<body>
${nav(ctx)}
<main id="contenido">
<section class="section" id="faq" aria-labelledby="faq-h">
  <div class="wrap faq-grid">
    <div>
      <p class="eyebrow">${esc(L.faq.eyebrow)}</p>
      <h1 class="h2" id="faq-h">${esc(L.faq.pageH)}</h1>
      <p class="lead">${esc(L.faq.pageLead)} ${esc(L.faq.lead)}</p>
      <a class="link" href="${ctx.pageHref(ctx.code, 'home')}">${esc(L.ui.back)}</a>
    </div>
    <div class="faqs">
        ${faqItems(L, keys)}
    </div>
  </div>
</section>
</main>
${footer(ctx)}
${SPRITE}
${jsonLd(ctx, keys)}
${SCRIPT}
${EMAIL_JS}
</body>
</html>
`;
}

const target = process.argv[2] === 'dev' ? 'dev' : 'prod';
const outRoot = target === 'dev' ? here : siteRoot;
for (const code of ORDER) {
  for (const [kind, render] of [['home', homePage], ['faq', faqPage]]) {
    const out = path.join(outRoot, LANGS[code].files[kind]);
    mkdirSync(path.dirname(out), { recursive: true });
    writeFileSync(out, render(context(code, kind, target)));
    console.log('scritto', path.relative(siteRoot, out));
  }
}
