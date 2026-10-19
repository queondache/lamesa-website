// Controllo statico della homepage di test: contenuti, FAQ, link e accessibilità minima.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, '..', '..');
const html = readFileSync(path.join(here, 'index.html'), 'utf8');
const visible = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script[\s\S]*?<\/script>/g, '');
const count = (re) => (html.match(re) || []).length;

test('cinque risposte nel blocco B e cinque righe nell\'indice', () => {
  assert.equal(count(/class="chip[ "]/g), 5);
  assert.equal(count(/<details class="row[ "]/g), 5);
});

const faqHtml = readFileSync(path.join(here, 'preguntas-frecuentes.html'), 'utf8');
const ldFaq = (src) => {
  const block = src.match(/<script type="application\/ld\+json">([\s\S]*?"FAQPage"[\s\S]*?)<\/script>/);
  assert.ok(block, 'manca il JSON-LD FAQPage');
  return JSON.parse(block[1]).mainEntity.length;
};

test('homepage: quattro FAQ e link alla pagina con tutte', () => {
  assert.equal(count(/<details class="faq[ "]/g), 4);
  assert.equal(ldFaq(html), 4);
  assert.match(html, /href="preguntas-frecuentes\.html"/);
});

test('pagina FAQ: undici domande visibili e nei dati strutturati', () => {
  assert.equal((faqHtml.match(/<details class="faq[ "]/g) || []).length, 11);
  assert.equal(ldFaq(faqHtml), 11);
  assert.doesNotMatch(faqHtml.replace(/<!--[\s\S]*?-->/g, ''), /coworking|workshop/i);
});

test('niente coworking né workshop nel testo', () => {
  assert.doesNotMatch(visible, /coworking|workshop/i);
});

test('ogni link interno porta a un file esistente', () => {
  const internal = [...html.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]);
  assert.ok(internal.length > 0);
  for (const href of internal) {
    const file = href.endsWith('/') ? href + 'index.html' : href;
    assert.ok(existsSync(path.join(siteRoot, file)), `link rotto: ${href}`);
  }
});

test('X accessibile, interruttore varianti, voto Google', () => {
  assert.match(html, /<button[^>]*class="who-close"[^>]*aria-label="Cerrar"/);
  assert.match(html, /data-variant-switch/);
  assert.match(visible, /5,0/);
  assert.match(visible, /53 reseñas/);
});
