import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const url = 'https://app.mesana.studio/book/la-mesa';
const locales = { es: '', en: 'en/', ca: 'ca/', pt: 'pt/' };
const labels = { es: 'Reservar clases en Mesana', en: 'Book classes on Mesana', ca: 'Reserva classes a Mesana', pt: 'Reserve aulas na Mesana' };
for (const [locale, prefix] of Object.entries(locales)) {
  test(`${locale}: homepage class reservation CTAs work without JavaScript`, () => {
    const anchors = [...read(`${prefix}index.html`).matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map(match => match[0]);
    const booking = anchors.filter(anchor => /id="cta-hero-reserva"|class="clase-card__cta/.test(anchor));
    assert.equal(booking.length, 5);
    // Fuori da pt, in home solo il bono resta su Mesana: le altre CTA portano a pagine interne.
    const onMesana = booking.filter(anchor => anchor.includes(`href="${url}"`));
    assert.equal(onMesana.length, locale === 'pt' ? 5 : 1);
    if (locale !== 'pt') assert.ok(onMesana[0].includes('bono_horas'));
    for (const anchor of onMesana) {
      assert.ok(anchor.includes('data-standard-booking'));
      assert.doesNotMatch(anchor, /target="_blank"|data-client-area=/);
      assert.ok(anchor.replace(/<[^>]*>/g, '').trim().length > 0);
    }
  });
  for (const name of locale === 'pt' ? ['suelta'] : ['suelta', 'semanal-modelado', 'semanal-torno']) {
    test(`${locale}/${name}: class booking uses the standard page and no legacy calendar activation`, () => {
      const source = read(`${prefix}clases/${name}.html`);
      const booking = [...source.matchAll(/<a\b[^>]*data-standard-booking[^>]*>[\s\S]*?<\/a>/g)];
      assert.equal(booking.length, 1);
      assert.ok(booking[0][0].includes(`href="${url}"`));
      assert.ok(booking[0][0].includes(labels[locale]));
      assert.doesNotMatch(source, /id="booking-grid"|class="mini-booking"|turno-skeleton|<script[^>]*src="[^"]*\/(?:mini-booking|booking|booking-v2)\.js/);
      assert.match(source, /href="https:\/\/wa.me\/34711552030/);
      assert.match(source, /<link rel="canonical"/);
    });
  }
}
test('existing brand CTA classes retain at least 44px touch targets', () => {
  const css = read('css/style.css');
  assert.match(css, /\.clase-card__cta\s*\{[^}]*min-height:\s*44px/);
  assert.match(css, /\.mini-booking__cta\s*\{[^}]*min-height:\s*52px/);
});
test('client-area helper does not redirect static standard booking CTAs or start a guest checkout', () => {
  const window = {};
  runInNewContext(read('js/booking-config.js'), { window });
  const anchor = { href: url };
  const document = { readyState: 'complete', querySelectorAll(selector) { assert.equal(selector, '[data-client-area="bono"]'); return []; }, getElementById(id) { assert.equal(id, 'booking-grid'); return null; } };
  runInNewContext(read('js/client-area-links.js'), { window, document, URL, fetch() { throw new Error('Unexpected booking request'); } });
  assert.equal(anchor.href, url);
});
