import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const configSource = read('js/booking-config.js');
const linksSource = read('js/client-area-links.js');
const bookingSource = read('js/booking-v2.js');
const url = 'https://app.mesana.studio/client/la-mesa';
const homes = ['index.html', 'en/index.html', 'ca/index.html', 'pt/index.html'];
const courses = ['clases/semanal-modelado.html', 'clases/semanal-torno.html', 'en/clases/semanal-modelado.html', 'en/clases/semanal-torno.html', 'ca/clases/semanal-modelado.html', 'ca/clases/semanal-torno.html'];
// Published baseline fingerprints, excluding only class reservation CTA blocks.
const preserved = {
  "index.html": "c75182211f87d0fa218fe5b0f9f4fd532ef07bca52df190737e2a591a4ed156e",
  "en/index.html": "72287d21d123e1802b399c4367cac58a22e57ede69ec8c36acc8e7d65393074b",
  "ca/index.html": "97e7eb00c6346d70dc863f4facde3850c5a5254f9ca7a817432a26f9da9d9ae9",
  "pt/index.html": "2e05b284f2e1d8fcd2d3b3b2de6e83281953adb2fad3f6de96490da641ba5dbd",
  "clases/semanal-modelado.html": "ded8469b7a0db450ad3bdaaab8604f095bb6755014a8285a7c1f9d7762bd8ad3",
  "clases/semanal-torno.html": "d27ebbbb089e0035745e045988679e6331a321bf9d9c50e621f2a5718fe77dbe",
  "en/clases/semanal-modelado.html": "c73bb5fa3573cd4c38e9faedf648637149a4de24b0aa49f3268a7a9040819996",
  "en/clases/semanal-torno.html": "946552594c6f036c12672b3d90d0f3bfa5022e2ffe577f112cbcd62583994fcc",
  "ca/clases/semanal-modelado.html": "64984977f24c8220e710f02dd2984f0d0bb258d15ae370b05a156040d082e787",
  "ca/clases/semanal-torno.html": "6fdaf8f5b64f6f82428469d8e2d3ab470335373a6d4ead6b79636cc7bc63ddd7"
};

function page(config, lang = 'es') {
  let queries = 0;
  let requests = 0;
  const button = {href: 'https://wa.me/original', target: '_blank', rel: 'noopener noreferrer'};
  const grid = {children: ['original'], replaceChildren(...children) {this.children = children;}};
  const document = {
    documentElement: {lang}, readyState: 'complete',
    querySelectorAll(selector) {queries++; assert.equal(selector, '[data-client-area="bono"]'); return [button];},
    getElementById(id) {queries++; assert.equal(id, 'booking-grid'); return grid;},
    createElement(tagName) {return {tagName, children: [], append(...children) {this.children.push(...children);}};}
  };
  const window = {LA_MESA_GUEST_BOOKING: config};
  runInNewContext(linksSource, {window, document, URL, fetch() {requests++; throw new Error('Unexpected request');}});
  return {button, grid, window, queries, requests};
}

test('Public configuration enables the client area without network requests', () => {
 const window={};runInNewContext(configSource,{window});assert.equal(window.LA_MESA_GUEST_BOOKING.clientArea.enabled,true);
 const result=page(window.LA_MESA_GUEST_BOOKING);
 assert.equal(result.requests,0);assert.equal(result.button.href,url);assert.equal(result.grid.children.length,1);
});

test('Enabled client area changes bono and course block in every supported language', () => {
  for (const [lang, copy] of Object.entries({
    es: 'Accede a tus cursos desde tu área de cliente',
    en: 'Access your courses in your client area',
    ca: 'Accedeix als teus cursos des de la teva àrea de client',
    pt: 'Acesse seus cursos na sua área de cliente'
  })) {
    const {button, grid, requests} = page({clientArea: {enabled: true, url}}, lang);
    assert.equal(button.href, url);
    assert.equal(button.target, '_self');
    assert.equal(grid.children.length, 1);
    const [block] = grid.children;
    assert.equal(block.children[0].textContent, copy);
    assert.equal(block.children[1].href, url);
    assert.equal(block.children[1].target, '_self');
    assert.equal(requests, 0);
  }
});

test('HTTP and foreign hosts leave the page untouched and do not start booking', () => {
  for (const invalid of ['http://app.mesana.studio/client/la-mesa', 'https://app.mesana.studio.evil.test/client/la-mesa']) {
    const result = page({clientArea: {enabled: true, url: invalid}});
    assert.equal(result.queries, 0);
    assert.equal(result.requests, 0);
    assert.equal(result.button.href, 'https://wa.me/original');
    assert.deepEqual(result.grid.children, ['original']);
    runInNewContext(bookingSource, {window: result.window, document: {documentElement: {lang: 'es'}, readyState: 'complete', querySelectorAll() {return [];}, querySelector() {return null;}}, URL});
  }
  const result = page({clientArea: {enabled: true, url}});
  runInNewContext(bookingSource, {window: result.window, document: {get documentElement() {throw new Error('Booking started');}}, URL});
});

function unrelatedContent(source) {
  return source
    .replace(/<a\b[^>]*>[\s\S]*?<\/a>/g, anchor => /id="cta-hero-reserva"|class="clase-card__cta/.test(anchor) ? '' : anchor)
    .replace(/<div class="turno-grid" id="booking-grid"[^>]*>\s*(?:<!--[^]*?-->\s*)?(?:<div class="turno-skeleton"><\/div>\s*){3}<\/div>/g, '')
    .replace(/<div class="turno-grid">\s*<a[^>]*data-standard-booking[^>]*>[^]*?<\/a>\s*<\/div>/g, '');
}
test('Class CTA changes preserve every unrelated byte in home and weekly course pages', () => {
  for (const file of [...homes, ...courses]) {
    assert.equal(createHash('sha256').update(unrelatedContent(read(file))).digest('hex'), preserved[file], file);
    assert.doesNotMatch(read(file), /data-client-area="bono"|id="booking-grid"/);
  }
});
