import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {resolve, dirname, relative, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Cartelle e file non pubblicati (vedi _config.yml) o fuori dal sito.
// Gli esclusi sono quelli di _config.yml (non pubblicati), piu' .git e node_modules.
const skipDirs = new Set(['.git', '.github', 'node_modules', 'shopify-theme', 'seo-audit', 'scripts', 'dev', 'demo', 'docs', 'tests', '.orchestratore']);
const skipFiles = new Set(['README.md', 'AUDIT_UIUX_V2.md', 'istruzioni sito La Mesa.md']);
const exts = /\.(html|json|txt|xml|md)$/;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    if (entry.isDirectory()) { if (!skipDirs.has(entry.name)) walk(join(dir, entry.name), out); }
    else if (exts.test(entry.name) && !skipFiles.has(entry.name)) out.push(join(dir, entry.name));
  }
  return out;
}

test('No published file contains the plain contact email', () => {
  const files = walk(root);
  assert.ok(files.length > 50, 'expected to scan the whole site');
  const offenders = files.filter(f => /lamesa\.lc(@|%40|&#64;|&commat;)gmail\.com/i.test(readFileSync(f, 'utf8'))).map(f => relative(root, f));
  assert.deepEqual(offenders, []);
});

function run(attrs, text = 'fallback', globals = {}) {
  const link = {
    dataset: attrs, textContent: text, href: '', listeners: {},
    getAttribute() { return null; },
    addEventListener(type, fn) { this.listeners[type] = fn; }
  };
  const document = {readyState: 'complete', querySelectorAll(sel) { assert.equal(sel, 'a[data-email-user][data-email-domain]'); return [link]; }};
  runInNewContext(readFileSync(resolve(root, 'js/contact-email.js'), 'utf8'), {document, ...globals});
  return link;
}

test('contact-email.js builds the mailto and shows the address', () => {
  const link = run({emailUser: 'lamesa.lc', emailDomain: 'gmail.com'});
  assert.equal(link.href, 'mailto:lamesa.lc@gmail.com');
  assert.equal(link.textContent, 'lamesa.lc@gmail.com');
});

test('contact-email.js keeps a custom label and appends the query', () => {
  const link = run({emailUser: 'lamesa.lc', emailDomain: 'gmail.com', emailQuery: 'subject=Hola', emailLabel: 'true'}, 'Escribir por email');
  assert.equal(link.href, 'mailto:lamesa.lc@gmail.com?subject=Hola');
  assert.equal(link.textContent, 'Escribir por email');
});

test('contact-email.js ignores invalid parts', () => {
  const link = run({emailUser: 'a b', emailDomain: 'evil'});
  assert.equal(link.href, '');
});

test('contact-email.js tracks email clicks like WhatsApp', () => {
  const calls = [];
  const link = run({emailUser: 'lamesa.lc', emailDomain: 'gmail.com'}, 'x', {
    gtag: (...args) => calls.push(['gtag', ...args]),
    fbq: (...args) => calls.push(['fbq', ...args])
  });
  assert.equal(typeof link.listeners.click, 'function');
  link.listeners.click();
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
    ['gtag', 'event', 'click_email', {event_category: 'conversion', event_label: 'email_contact'}],
    ['fbq', 'track', 'Contact']
  ]);
});

test('contact-email.js click works without analytics loaded', () => {
  const link = run({emailUser: 'lamesa.lc', emailDomain: 'gmail.com'});
  assert.doesNotThrow(() => link.listeners.click());
});

test('Pages using the obfuscated email load the script', () => {
  const pages = walk(root).filter(f => f.endsWith('.html') && /data-email-user=/.test(readFileSync(f, 'utf8')));
  assert.ok(pages.length > 25);
  for (const f of pages) assert.match(readFileSync(f, 'utf8'), /\/js\/contact-email\.js/, relative(root, f));
});
