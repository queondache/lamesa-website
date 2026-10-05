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
const baseline = {
  'index.html': 'b8cc9c1f60af82985a10c95b533bba82e40f800f87bd34923788abf4a2b4bd5a',
  'en/index.html': 'fcedaf7320c09a8bc7bf84aec5e21d3720d6f0866ae25e8b45859cf4c554fe0a',
  'ca/index.html': 'a8fb0f3c2369f83c77e60c52b79d7cd2ff21cf3148e8ba3e8ee11fdf29a652f5',
  'pt/index.html': '3287833aef429ddf5df3753cd61897e777d858b158957f75c4207203479f6f1a',
  'clases/semanal-modelado.html': '4ec979fe4cf339f3e6945cdf6b06eb9f020f45e0aba9819e412de3716c9e139b',
  'clases/semanal-torno.html': '90bf345e146a7922e18a95caf0174c6a1846d9803af5f9dc0b83c0f873644995',
  'en/clases/semanal-modelado.html': '9bc8b12509d08dd2b8e7a4d18a6369982ff94727613d3652eccfc6044099272a',
  'en/clases/semanal-torno.html': 'c9df7f950938e56c7a69430c0e0ef980d8a2889d30ceb7cfa25eb619d1194c85',
  'ca/clases/semanal-modelado.html': 'b6ff35339f5a06c1620e595f85937be358aa8e35850a1c54836896beb4454207',
  'ca/clases/semanal-torno.html': '743e7147489d8fdf62ba133242ed9cef148526aa74d2323effd2e3be2caa374f'
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

test('Public configuration keeps the client area off with zero DOM access and requests', () => {
  const window = {};
  runInNewContext(configSource, {window});
  assert.equal(window.LA_MESA_GUEST_BOOKING.clientArea.enabled, false);
  assert.equal(window.LA_MESA_GUEST_BOOKING.clientArea.url, url);
  const result = page(window.LA_MESA_GUEST_BOOKING);
  assert.equal(result.queries, 0);
  assert.equal(result.requests, 0);
  assert.equal(result.button.href, 'https://wa.me/original');
  assert.deepEqual(result.grid.children, ['original']);
});

test('Enabled client area changes bono and course block in every supported language', () => {
  for (const [lang, copy] of Object.entries({
    es: 'Inscríbete y paga desde tu área de cliente',
    en: 'Enrol and pay from your client area',
    ca: 'Inscriu-te i paga des de la teva àrea de client',
    pt: 'Inscreva-se e pague na sua área de cliente'
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
    const normalized = source.replace(' data-client-area="bono"', '').replace(/^  <script src="(?:\.\.\/){0,2}js\/booking-config\.js" data-cookieconsent="ignore" defer><\/script>\n/m, '').replace(/^  <script src="(?:\.\.\/){0,2}js\/client-area-links\.js" data-cookieconsent="ignore" defer><\/script>\n/m, '');
    assert.equal(createHash('sha256').update(normalized).digest('hex'), baseline[path], path);
    assert.match(source, /src="(?:\.\.\/){0,2}js\/client-area-links\.js"/);
    if (homes.includes(path)) assert.match(source, /data-client-area="bono"/);
    else {
      assert.match(source, /src="(?:\.\.\/){1,2}js\/booking-v2\.js\?v=4"/);
      assert.ok(source.indexOf('client-area-links.js') < source.indexOf('booking-v2.js'));
    }
  }
});
