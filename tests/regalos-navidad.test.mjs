import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync, statSync} from 'node:fs';
import {resolve} from 'node:path';

// Pagine regali di Natale (design 2026-11-02): kit mosaico + guida regali, ES e CA.
const root = resolve(import.meta.dirname, '..');
const base = 'https://lamesabcn.com';
const read = p => readFileSync(resolve(root, p), 'utf8');
const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
const plain = s => decode(s.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
const attrs = s => Object.fromEntries([...s.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], decode(m[2])]));
const tags = (s, tag) => [...s.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'g'))].map(m => attrs(m[0]));
const schemas = s => [...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
const graph = s => schemas(s).flatMap(j => j['@graph'] || [j]);

const pages = {
  guide: {es: 'regalos-originales-barcelona.html', ca: 'ca/regals-originals-barcelona.html'},
  kit: {es: 'kit-mosaico-ceramica.html', ca: 'ca/kit-mosaic-ceramica.html'},
};
const deadline = {es: '14 de diciembre', ca: '14 de desembre'};
const all = Object.entries(pages).flatMap(([kind, byLang]) => Object.entries(byLang).map(([lang, file]) => ({kind, lang, file})));

for (const {kind, lang, file} of all) {
  test(`${file}: lingua, canonical e hreflang reciproci`, () => {
    assert.ok(existsSync(resolve(root, file)), `${file} manca`);
    const s = read(file);
    assert.match(s, new RegExp(`<html lang="${lang}"`));
    const links = tags(s, 'link');
    assert.equal(links.find(l => l.rel === 'canonical')?.href, `${base}/${file}`);
    for (const [other, otherFile] of Object.entries(pages[kind])) {
      assert.equal(links.find(l => l.rel === 'alternate' && l.hreflang === other)?.href, `${base}/${otherFile}`, `${file}: hreflang ${other}`);
    }
    const desc = tags(s, 'meta').find(m => m.name === 'description')?.content || '';
    assert.ok(desc.length > 50 && desc.length <= 160, `${file}: description ${desc.length}`);
    assert.equal((s.match(/<h1\b/g) || []).length, 1);
  });

  test(`${file}: dati strutturati validi, FAQ uguale al testo, data di Natale`, () => {
    const s = read(file);
    const nodes = graph(s);
    const faq = nodes.find(n => n['@type'] === 'FAQPage');
    assert.ok(faq, `${file}: FAQPage`);
    const visible = [...s.matchAll(/<summary class="faq__question">([\s\S]*?)<\/summary>\s*<p class="faq__answer">([\s\S]*?)<\/p>/g)].map(m => [plain(m[1]), plain(m[2])]);
    assert.deepEqual(faq.mainEntity.map(q => [q.name, q.acceptedAnswer.text]), visible);
    assert.ok(plain(s).includes(deadline[lang]), `${file}: ${deadline[lang]}`);
    assert.doesNotMatch(s, /regalos-preview/);
    if (kind === 'kit') {
      const product = nodes.find(n => n['@type'] === 'Product');
      assert.ok(product, `${file}: Product`);
      assert.equal(product.offers.price, '30');
      assert.equal(product.offers.priceCurrency, 'EUR');
      assert.match(plain(s), /30 €/);
    }
  });

  test(`${file}: link locali esistenti, esterni solo tienda o WhatsApp, immagini dimensionate`, () => {
    const s = read(file);
    for (const a of [...tags(s, 'a'), ...tags(s, 'img'), ...tags(s, 'link'), ...tags(s, 'script')]) {
      const ref = a.href || a.src;
      if (!ref || ref.startsWith('#') || ref.startsWith('tel:')) continue;
      const url = new URL(ref, `${base}/${file}`);
      if (url.origin === base) {
        const path = decodeURIComponent(url.pathname);
        const target = resolve(root, '.' + path + (path.endsWith('/') ? 'index.html' : ''));
        assert.ok(existsSync(target) && statSync(target).isFile(), `${file}: link rotto ${ref}`);
      } else if (a.href && tags(s, 'a').includes(a)) {
        assert.ok(/^https:\/\/(tienda\.lamesabcn\.com|wa\.me|instagram\.com)\//.test(url.href), `${file}: link esterno ${ref}`);
      }
    }
    for (const img of tags(s, 'img')) {
      if (img.src?.startsWith('https://www.facebook.com')) continue;
      assert.ok(img.width && img.height && img.alt !== undefined, `${file}: img ${img.src}`);
    }
  });
}

test('guida e kit si collegano a vicenda nella stessa lingua', () => {
  for (const lang of ['es', 'ca']) {
    assert.ok(read(pages.guide[lang]).includes(`href="/${pages.kit[lang]}`), `guida ${lang} → kit`);
    assert.ok(read(pages.kit[lang]).includes(`href="/${pages.guide[lang]}`), `kit ${lang} → guida`);
  }
});
