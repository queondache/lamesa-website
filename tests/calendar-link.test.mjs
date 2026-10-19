import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const url = 'https://app.mesana.studio/book/la-mesa';
const texts = {
  '': 'Ver todas las clases con plazas libres →',
  'en/': 'See all classes with free spots →',
  'ca/': 'Veure totes les classes amb places lliures →',
  'pt/': 'Ver todas as aulas com vagas →',
};
for (const [prefix, text] of Object.entries(texts)) {
  for (const page of ['torno', 'modelado']) {
    test(`${prefix || 'es/'}${page}: il riquadro di prenotazione linka il calendario Mesana`, () => {
      const html = read(`${prefix}experiencias/${page}.html`);
      const aside = html.match(/<aside class="booking-preview"[\s\S]*?<\/aside>/)[0];
      assert.equal(aside.split(url).length - 1, 1);
      assert.ok(aside.includes(`<small class="demo-note"><a href="${url}">${text}</a></small>`));
      assert.doesNotMatch(aside, new RegExp(`href="${url}"[^>]*target=`));
    });
  }
}
