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
    const home = read(`${prefix}index.html`);
    const anchors = [...home.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map(match => match[0]);
    // Home D3: la classe di 2 h porta alla pagina interna; su Mesana resta solo il bono.
    const onMesana = anchors.filter(anchor => anchor.includes(`href="${url}"`));
    assert.equal(onMesana.length, 1);
    assert.ok(onMesana[0].includes('bono_horas'));
    assert.ok(onMesana[0].includes('data-standard-booking'));
    assert.doesNotMatch(onMesana[0], /target="_blank"|data-client-area=/);
    assert.ok(onMesana[0].replace(/<[^>]*>/g, '').trim().length > 0);
    const twoHours = locale === 'pt' ? '/pt/clases/suelta.html' : `/${prefix}experiencias/torno.html`;
    assert.ok(anchors.some(anchor => anchor.includes(`href="${twoHours}"`) && anchor.includes('clase_suelta')));
  });
  for (const name of locale === 'pt' ? ['suelta'] : ['semanal-modelado', 'semanal-torno'] /* suelta es/en/ca e un rimando */) {
    test(`${locale}/${name}: class booking uses the standard page and no legacy calendar activation`, () => {
      const source = read(`${prefix}clases/${name}.html`);
      const booking = [...source.matchAll(/<a\b[^>]*data-standard-booking[^>]*>[\s\S]*?<\/a>/g)];
      if (locale === 'pt') {
        assert.equal(booking.length, 1);
        assert.ok(booking[0][0].includes(`href="${url}"`));
        assert.ok(booking[0][0].includes(labels[locale]));
      } else {
        // S5: i mensili es/en/ca non rimandano piu a Mesana; il box turni (#turnos) prenota la prima lezione.
        assert.equal(booking.length, 0);
        assert.match(source, /<section id="turnos"[^>]*data-course="(?:torno|modelado)"/);
        assert.ok(!source.includes(url));
      }
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
