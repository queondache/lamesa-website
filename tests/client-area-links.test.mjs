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
// Baseline fingerprints of the weekly course pages, excluding only class reservation CTA blocks (homes redesigned 19/10: D3; payment copy «online or at the studio» 28/10).
const preserved = {
  "clases/semanal-modelado.html": "6ec90f4a082016bf30c3f32cd18eebf17d6fda69d3228958b87510dde57152db",
  "clases/semanal-torno.html": "d10129e242c3020b84530298e71bc38d3b391c4c45bd6be26f85b6ab7fa72386",
  "en/clases/semanal-modelado.html": "65136c2ac1b0e609dc05355b78eeefcb62f22cd2261c840d44c57f4384cb4c40",
  "en/clases/semanal-torno.html": "e05441d067610bc75f4fd757f46595b04faa589ad09fb2b123afa4f807349970",
  "ca/clases/semanal-modelado.html": "691610c7a0304af505aa4f85e93f3e35d4840cc121a5a9676533025ab92e3883",
  "ca/clases/semanal-torno.html": "6d0b7c3383ad029df190bb351283ec5ee98b7a13a7d57282239a4ad956958bfc"
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
    // Pagine PT dei corsi (19/10/2026): hreflang pt e selettore PT verso la pagina PT sono l'unica differenza ammessa;
    // si riportano alla forma della baseline, cosi' le impronte restano quelle di prima.
    .replace(/ *<link rel="alternate" hreflang="pt" href="https:\/\/lamesabcn\.com\/pt\/clases\/semanal-(?:modelado|torno)\.html">\n/, '')
    .replace(/<a href="\/pt\/clases\/semanal-(?:modelado|torno)\.html" lang="pt">PT<\/a>/g, '<a href="/pt/" lang="pt">PT</a>')
    // Menu allineato alla home D3 (19/10/2026): senza Workshops, ancore #grupos/#cursos esistenti;
    // si ripristina la forma della baseline per confrontare il resto della pagina byte per byte.
    .replace(/(<a class="navbar__(link|mobile-link)" href="(\/(?:en\/|ca\/)?)#cursos"( data-section="cursos")?>[^<]+<\/a>)/g,
      (m, link, kind, base, section) => link + `<a class="navbar__${kind}" href="${base}#workshops"${section ? ' data-section="workshops"' : ''}>${base === '/ca/' ? 'Tallers' : 'Workshops'}</a>`)
    .replace(/href="(\/(?:en\/|ca\/)?)#grupos"/g, 'href="$1#privadas"')
    .replace(/href="(\/(?:en\/|ca\/)?)#cursos">←/g, 'href="$1#clases">←')
    .replace(/<a\b[^>]*>[\s\S]*?<\/a>/g, anchor => /id="cta-hero-reserva"|class="clase-card__cta/.test(anchor) ? '' : anchor)
    .replace(/<div class="turno-grid" id="booking-grid"[^>]*>\s*(?:<!--[^]*?-->\s*)?(?:<div class="turno-skeleton"><\/div>\s*){3}<\/div>/g, '')
    .replace(/<div class="turno-grid">\s*<a[^>]*data-standard-booking[^>]*>[^]*?<\/a>\s*<\/div>/g, '');
}
test('Class CTA changes preserve every unrelated byte in weekly course pages; homes stay without client area', () => {
  // Le home sono state ridisegnate (D3, 19/10/2026): non hanno impronta, ma restano senza area cliente.
  for (const file of courses) assert.equal(createHash('sha256').update(unrelatedContent(read(file))).digest('hex'), preserved[file], file);
  for (const file of [...homes, ...courses]) assert.doesNotMatch(read(file), /data-client-area="bono"|id="booking-grid"/);
});
