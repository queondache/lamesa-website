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
// Homepage snapshots updated for the dedicated shop entry; booking markup is unchanged.
const baseline = {
  'index.html': '5465b729d9e600f84f6123f408250c71c10993901ffdc4c22b6c95f880269187',
  'en/index.html': 'c1ea53ed3a4662d8d74e0306d90f250bd16a15777d7ee96357ef84fe578bcac3',
  'ca/index.html': 'e787b9bcc8527f4d807e61880359c7de2d1aa47ed03e21483359e48af5349bc7',
  'pt/index.html': '61bd07c209ef7c7725d321b1f5f7077805e21211b1dfd760a86f64bb444bb1ec',
  'clases/semanal-modelado.html': 'fc32123da05c74ff55688f0f53f64194575f831899315d175ef513bd8cc7e5ea',
  'clases/semanal-torno.html': 'fb74a04e18466cacf13cb89ae578cf3f1ccf302641ee2deaea11343b78290bf0',
  'en/clases/semanal-modelado.html': 'e45acbbca1086a29567208aac2fb8ee83168d45c51e9f8eca742283beb669781',
  'en/clases/semanal-torno.html': '952d50ce5de06e5a1655683e42ee48116926f48c2d5a5f1166802d3e5f7939e1',
  'ca/clases/semanal-modelado.html': '61ab6b66dc32467dea1bd231949435431cea373e26146e9cfbc60c7ffbdb7b93',
  'ca/clases/semanal-torno.html': 'b28eae2ca8724bb08d4e79adfdc1c4005ed5ac94bbad4dbec2e4fe149cd25ba8'
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

test('Touched HTML is byte-identical after removing only the new marker and script tags', () => {
  for (const path of [...homes, ...courses]) {
    const source = read(path);
    const normalized = source.replace(' data-client-area="bono"', '').replace(/^  <script src="(?:\.\.\/){0,2}js\/booking-config\.js\?v=6" data-cookieconsent="ignore" defer><\/script>\n/m, '').replace(/^  <script src="(?:\.\.\/){0,2}js\/client-area-links\.js\?v=4" data-cookieconsent="ignore" defer><\/script>\n/m, '').replace(/^  <script src="(?:\.\.\/){1,2}js\/booking-v2\.js\?v=4" data-cookieconsent="ignore" defer><\/script>\n/m, '');
    assert.equal(createHash('sha256').update(normalized).digest('hex'), baseline[path], path);
    assert.match(source, /src="(?:\.\.\/){0,2}js\/client-area-links\.js\?v=4"/);
    if (homes.includes(path)) assert.match(source, /data-client-area="bono"/);
    else {
      assert.doesNotMatch(source, /src="(?:\.\.\/){1,2}js\/booking-v2\.js/);
    }
  }
});
