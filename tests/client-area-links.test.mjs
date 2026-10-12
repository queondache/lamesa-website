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
  "index.html": "5e039afb7a36538aa4cc33c729f5b6cbd14d19d216f84c1663181ffacbd0ed0e",
  "en/index.html": "454b00c71f6e2dd66f73f2676a104d6d584bcd2b68446d8f7df1adcc1c0d622c",
  "ca/index.html": "1fa8e563544288b3bf0694a55b62bc3016a0d37e04c7d5325bfd0984ca36c360",
  "pt/index.html": "7a8214c07a10b63c2292b0a2a634f6becbaf63e53b1d49e94b881b110ede21c2",
  "clases/semanal-modelado.html": "506418bc616ff69166461b425984e579f9e02938f4478bebd3d6c06744253cdd",
  "clases/semanal-torno.html": "bcadb44a996c862d0c9b6ebb7f28bc7882eefac05753b4fd2a339d25cfc06648",
  "en/clases/semanal-modelado.html": "ed397d4f336472b7d05b8aae878183325318cd5b7cdcc9b05fde8cbc2cc7e2e3",
  "en/clases/semanal-torno.html": "9fafeafa14bbb30f637249eab7f80a6d8d51aaf3c161ba2e8113ae6114b8031c",
  "ca/clases/semanal-modelado.html": "64b780c0203539599cc64fb2b36542e4cd9b8faf4b649555d2172ae02d86b928",
  "ca/clases/semanal-torno.html": "a30612303b2ed79b5b6cc79a6dcdfa78d0d023692c34fa8be73a6b8b7699e1c1"
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
