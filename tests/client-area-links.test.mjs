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
  "index.html": "6f6f287fe36261fd7a5955d22abd04e208668156e34ad0bdfb7aa0a6df4a482d",
  "en/index.html": "f7839ce5f68f5e0bd46f79072077140949c06ed38f9c3d93480ff14a68b9fc6a",
  "ca/index.html": "a50b13f1f4accd08fffd3ab57964881479de852c6b33173a676a8618b53edd99",
  "pt/index.html": "d6506cae67c65ddaaa82daa51d2f7f207bc9fb71cb7fa208ab1587fc08ac85b6",
  "clases/semanal-modelado.html": "7064567825e6d48397f406d7c053b1f4381e3f99cb815767cda55193b3ad40fd",
  "clases/semanal-torno.html": "1a51f3a6ff984168ca2737778cab2cdfe696a26b0373ba3f1b20ace4969bafc9",
  "en/clases/semanal-modelado.html": "edeba0f1d41543849db586e8cb3b72405b3fe2d5d810c11d42d6282656d0c626",
  "en/clases/semanal-torno.html": "86e1ff04ec431676db6a9d940fb8b0c115321d7e1fa68228b6adece856780ceb",
  "ca/clases/semanal-modelado.html": "113ebf466804a5b6f1b7fa818ddd8c56307e0cb6fcab112751c9bf0d61d46d11",
  "ca/clases/semanal-torno.html": "248d5a2c03ad2a12b4140d0c09bb1313070d6e7fff0336fb670d59d4e2907db0"
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
