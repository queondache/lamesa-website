// Controllo statico della homepage D3 e della pagina FAQ nelle quattro lingue,
// sia per l'anteprima di prova (dev/nueva-home) sia per le pagine definitive del sito.
// Le pagine si rigenerano con `node dev/nueva-home/build.mjs` (definitive) e `... build.mjs dev` (prova).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { LANGS, FAQ_KEYS } from './src/i18n.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, '..', '..');
const strip = (s) => s.replace(/<!--[\s\S]*?-->/g, '').replace(/<script[\s\S]*?<\/script>/g, '');
const count = (src, re) => (src.match(re) || []).length;
// la pagina può avere più blocchi JSON-LD (attività + FAQ): si prende quello FAQPage
const ldFaq = (src) => {
  const blocks = [...src.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const faq = blocks.find((b) => b['@type'] === 'FAQPage');
  assert.ok(faq, 'manca il JSON-LD FAQPage');
  return faq.mainEntity;
};
const answered = (L) => FAQ_KEYS.filter((k) => L.faq.items[k][1] !== null).length;

for (const target of ['dev', 'prod']) {
  const root = target === 'dev' ? here : siteRoot;
  for (const [code, L] of Object.entries(LANGS)) {
    const name = `${target}/${code}`;
    const html = readFileSync(path.join(root, L.files.home), 'utf8');
    const faq = readFileSync(path.join(root, L.files.faq), 'utf8');

    test(`${name}: lingua dichiarata e domanda tradotta`, () => {
      assert.match(html, new RegExp(`<html lang="${code}">`));
      assert.match(faq, new RegExp(`<html lang="${code}">`));
      assert.ok(html.includes(L.who.q), 'domanda non tradotta');
    });

    test(`${name}: cinque risposte, cinque righe d'indice, menu con le stesse cinque voci`, () => {
      assert.equal(count(html, /class="chip"/g), 5);
      assert.equal(count(html, /<details class="row[ "]/g), 5);
      const navLinks = html.match(/<ul class="nav-links">([\s\S]*?)<\/ul>/)[1];
      for (const key of ['exp', 'courses', 'shop', 'groups', 'resto']) {
        assert.ok(navLinks.includes(L.nav[key][0].replace(/&/g, '&amp;')), `menu senza ${key}`);
      }
    });

    test(`${name}: 4 FAQ in homepage, pagina FAQ completa`, () => {
      assert.equal(count(html, /<details class="faq"/g), 4);
      assert.equal(ldFaq(html).length, 4);
      const visible = target === 'dev' ? FAQ_KEYS.length : answered(L);
      assert.equal(count(faq, /<details class="faq"/g), visible);
      assert.equal(ldFaq(faq).length, answered(L));
      assert.ok(ldFaq(faq).every((q) => !/COMPLETAR/.test(q.acceptedAnswer.text)));
    });

    test(`${name}: niente coworking né workshop nel testo`, () => {
      assert.doesNotMatch(strip(html), /coworking|workshop/i);
      assert.doesNotMatch(strip(faq), /coworking|workshop/i);
    });

    test(`${name}: link interni, immagini e lingue collegate esistono`, () => {
      for (const [file, src] of [[L.files.home, html], [L.files.faq, faq]]) {
        const dir = path.dirname(path.join(root, file));
        for (const m of src.matchAll(/(?:href|src)="([^"#?]+)/g)) {
          const ref = m[1];
          if (/^(https?:|mailto:|tel:)/.test(ref)) continue;
          const target2 = ref.startsWith('/') ? path.join(siteRoot, ref.endsWith('/') ? ref + 'index.html' : ref) : path.join(dir, ref);
          assert.ok(existsSync(target2), `${file}: link rotto ${ref}`);
        }
      }
    });

    test(`${name}: X accessibile, voto Google`, () => {
      assert.match(html, new RegExp(`<button class="who-close"[^>]*aria-label="${L.ui.close}"`));
      assert.doesNotMatch(html, /data-variant-switch/);
      assert.match(strip(html), /53 /);
    });

    if (target === 'prod') {
      test(`${name}: pronta per il pubblico (indicizzabile, tracciata, senza segnaposti)`, () => {
        for (const src of [html, faq]) {
          assert.doesNotMatch(src, /noindex/);
          assert.match(src, /<link rel="canonical" href="https:\/\/lamesabcn\.com\//);
          assert.match(src, /G-SQ90MD674K/);
          assert.match(src, /consent\.cookiebot\.com/);
          assert.doesNotMatch(strip(src), /COMPLETAR|provisional|provisória|placeholder/i);
        }
        assert.match(html, /id="lang-suggest-bar"/);
        // Lead per Meta sugli stessi clic delle home precedenti
        assert.match(html, /fbq\('track', 'Lead'/);
        for (const label of ['clase_suelta', 'taller_semanal', 'bono_horas']) assert.match(html, new RegExp(`data-track="${label}"`));
        assert.match(html, /"@type":"LocalBusiness"/);
      });
    } else {
      test(`${name}: prova fuori dai motori di ricerca`, () => {
        assert.match(html, /noindex, nofollow/);
        assert.doesNotMatch(html, /G-SQ90MD674K/);
      });
    }
  }
}

test('nessun nero pieno nello stile', () => {
  const css = readFileSync(path.join(here, 'src', 'site.css'), 'utf8');
  assert.doesNotMatch(css, /#1A1A1A|#000\b|#000000|:\s*black\b/i);
});
