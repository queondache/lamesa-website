// Pagine PT (19/10/2026): ogni pagina portoghese ha lingua, canonical e hreflang reciproci con es/en/ca,
// menu senza workshop, link interni che esistono e preferiscono la versione PT quando c'e'.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const base = 'https://lamesabcn.com/';
// pagina pt -> [es, en, ca]; null = pagina senza hreflang (noindex con token o privacy)
const pages = {
  'pt/experiencias/torno.html': ['experiencias/torno.html', 'en/experiencias/torno.html', 'ca/experiencias/torno.html'],
  'pt/experiencias/modelado.html': ['experiencias/modelado.html', 'en/experiencias/modelado.html', 'ca/experiencias/modelado.html'],
  'pt/clases/semanal-modelado.html': ['clases/semanal-modelado.html', 'en/clases/semanal-modelado.html', 'ca/clases/semanal-modelado.html'],
  'pt/clases/semanal-torno.html': ['clases/semanal-torno.html', 'en/clases/semanal-torno.html', 'ca/clases/semanal-torno.html'],
  'pt/team-building.html': ['team-building.html', 'en/team-building.html', 'ca/team-building.html'],
  'pt/encomendas.html': ['encargos.html', 'en/custom-tableware.html', 'ca/encarrecs.html'],
  'pt/gracias.html': ['gracias.html', 'en/gracias.html', 'ca/gracias.html'],
  'pt/experiencias/cancelar.html': null,
  'pt/clases/confirmar.html': null,
  'pt/privacy.html': null
};
const ptPages = new Set(Object.keys(pages).concat(['pt/clases/suelta.html', 'pt/experiencias/reserva.html', 'pt/index.html', 'pt/perguntas-frequentes.html']));

for (const [pt, siblings] of Object.entries(pages)) {
  test(`${pt}: portoghese, hreflang reciproci, niente workshop, link locali validi`, () => {
    const s = read(pt);
    assert.match(s, /<html lang="pt">/);
    // menu e link senza workshop (la privacy li cita solo come contenuto della newsletter)
    assert.doesNotMatch(s, /href="[^"]*workshops/i, 'Niente link a workshop nelle pagine PT');
    if (/og:locale/.test(s)) assert.match(s, /<meta property="og:locale" content="pt_BR">/);
    if (siblings) {
      const [es, en, ca] = siblings;
      assert.equal((s.match(/<h1(?:\s|>)/g) || []).length, 1);
      assert.ok(s.includes(`<link rel="canonical" href="${base}${pt}">`) || /noindex/.test(s), 'canonical PT');
      for (const [code, path] of [['es', es], ['en', en], ['ca', ca], ['pt', pt]]) assert.ok(s.includes(`<link rel="alternate" hreflang="${code}" href="${base}${path}">`), code);
      assert.ok(s.includes(`<link rel="alternate" hreflang="x-default" href="${base}${es}">`));
      for (const path of siblings) {
        const sib = read(path);
        assert.ok(sib.includes(`<link rel="alternate" hreflang="pt" href="${base}${pt}">`), `${path}: hreflang pt`);
        // il selettore lingua porta alla pagina PT, non piu' alla home PT
        assert.ok(sib.includes(`href="/${pt}" lang="pt"`), `${path}: selettore PT`);
        assert.ok(!sib.includes('href="/pt/" lang="pt"'), `${path}: selettore PT non verso la home`);
      }
    }
    for (const m of s.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      const local = m[1].split(/[?#]/)[0];
      const file = local.endsWith('/') ? `${local}index.html` : local;
      assert.ok(existsSync(resolve(root, `.${file}`)), `Link locale rotto: ${local}`);
      // nessun rimando a /en/ o /ca/ se non dal selettore lingua o hreflang
      if (/^\/(?:en|ca)\//.test(local)) assert.match(s.slice(Math.max(0, m.index - 300), m.index + 200), /lang="(?:en|ca)"/, `Link non PT: ${local}`);
      // verso una pagina che esiste in PT si usa la versione PT
      if (!local.startsWith('/pt/') && local.endsWith('.html')) {
        const candidate = `pt${local}`;
        if (ptPages.has(candidate)) assert.match(s.slice(Math.max(0, m.index - 300), m.index + 200), /lang="es"/, `Esiste la versione PT di ${local}`);
      }
    }
  });
}
