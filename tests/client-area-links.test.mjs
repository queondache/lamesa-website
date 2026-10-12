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
  "clases/semanal-modelado.html": "57676b46091188232d5979ca02d80d9d5328003c0f0ba52d77e28a2459472ee4",
  "clases/semanal-torno.html": "1fa440fe166fc4027f4eb3b3ae766f201ccb5bb99bd3fcc9e0661c03d48e9402",
  "en/clases/semanal-modelado.html": "983e3258b8c26a117234c190d2b925817eb828cc67caa40310be16dc26c5a287",
  "en/clases/semanal-torno.html": "b28b6717ae5a874e79c0eb77f155f306a3cabfdd179e5d4a5104515a22b499f0",
  "ca/clases/semanal-modelado.html": "1a515c11901679399c3b965f043bbaaddc351a379728924a94eacebe4628fa35",
  "ca/clases/semanal-torno.html": "1f5712c573b74999c655583eb2bd09f1e2f67872ba82834eb21072cd6b6dd175"
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
