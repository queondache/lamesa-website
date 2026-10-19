import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(resolve(root, path), 'utf8');
const sections = ['collection', 'product', 'cart'];
const liquid = [...sections.map(name => read(`sections/mesa-${name}.liquid`)), read('snippets/mesa-navigation.liquid')];

test('extension templates resolve only supplied sections; host layout is preserved', () => {
  assert.equal(existsSync(resolve(root, 'layout')), false);
  assert.equal(existsSync(resolve(root, 'locales')), false, 'locale fragments must never overwrite host files');
  for (const name of sections) {
    const template = JSON.parse(read(`templates/${name}.mesa.json`));
    assert.deepEqual(template.order, Object.keys(template.sections));
    for (const section of Object.values(template.sections)) {
      const source = read(`sections/${section.type}.liquid`);
      const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
      assert.ok(schema.name.length <= 25);
      for (const [, asset] of source.matchAll(/'([^']+)' \| asset_url/g)) assert.ok(existsSync(resolve(root, 'assets', asset)));
      for (const [, snippet] of source.matchAll(/{% render '([^']+)'/g)) assert.ok(existsSync(resolve(root, 'snippets', `${snippet}.liquid`)));
    }
  }
});

test('all supported languages contain every UI key and the same interpolation placeholders', () => {
  const used = new Set(Array.from(liquid.join('\n').matchAll(/'mesa_shop\.([^']+)' \| t/g), match => match[1]));
  const files = readdirSync(resolve(root, 'locale-fragments')).sort();
  assert.deepEqual(files, ['ca.json', 'en.json', 'es.json', 'it.json', 'pt.json']);
  const baseline = JSON.parse(read('locale-fragments/es.json')).mesa_shop;
  for (const file of files) {
    const copy = JSON.parse(read(`locale-fragments/${file}`)).mesa_shop;
    assert.deepEqual(Object.keys(copy).sort(), [...used].sort());
    for (const key of used) {
      assert.ok(copy[key].trim());
      assert.deepEqual(copy[key].match(/{{.*?}}/g), baseline[key].match(/{{.*?}}/g));
    }
  }
});

test('catalog uses native filtered server collection, pagination and safe filter parameters', () => {
  const source = liquid[0];
  assert.match(source, /paginate collection\.products by 24/);
  assert.match(source, /for filter in collection\.filters/);
  assert.match(source, /name="{{ value\.param_name \| escape }}"/);
  assert.match(source, /value="{{ value\.value \| escape }}"/);
  assert.match(source, /value\.count == 0 and value\.active == false/);
  assert.match(source, /name="sort_by"/);
  assert.doesNotMatch(source, /name="page"|fetch\(|localStorage|products\.json/);
});

test('plain-text characteristics and cart property values are escaped', () => {
  const source = liquid.join('\n');
  for (const [, expression] of source.matchAll(/{{\s*([^}]+)\s*}}/g)) {
    if (/^(colors\b|color\b|materials\b|dimensions\b|care\b|property\.|product\.type|product\.title|item\.product\.title|item\.title|variant\.title|filter\.label|value\.label)/.test(expression.trim())) {
      assert.match(expression, /\| escape\b/, expression);
    }
  }
  assert.match(liquid[1], /care \| escape \| newline_to_br/);
});

test('commerce posts authoritative variant IDs and uses native cart totals and checkout', () => {
  const product = liquid[1]; const cart = liquid[2];
  assert.match(product, /product\.selected_or_first_available_variant/);
  assert.match(product, /form 'product', product/);
  assert.match(product, /name="id" value="{{ chosen\.id }}"/);
  assert.match(product, /unless chosen\.available.*disabled/);
  assert.match(product, /method="get" action="{{ product\.url }}"/);
  assert.match(product, /chosen\.quantity_rule\.min/);
  assert.match(product, /form\.errors \| default_errors/);
  assert.match(cart, /form 'cart', cart/);
  assert.match(cart, /name="updates\[\]"/);
  assert.match(cart, /item\.url_to_remove/);
  assert.match(cart, /item\.final_line_price \| money_with_currency/);
  assert.match(cart, /cart\.total_price \| money_with_currency/);
  assert.match(cart, /name="checkout"/);
  assert.doesNotMatch(liquid.join('\n'), /https?:\/\/|action="\/cart|href="\/products/);
});


test('Shopify alone owns rich description and typed merchant characteristics', () => {
  const source = liquid[1];
  assert.match(source, /if product\.description != blank %}<div class="mesa-shop__description">{{ product\.description }}<\/div>{% endif %}/);
  assert.doesNotMatch(source, /product\.description \||details\.|descriptionHtml/,
    'Shopify rich text must not be stripped, escaped or replaced by managed fallback');
  assert.match(source, /product\.type \| escape/);
  assert.match(liquid[0], /item\.type \| escape/);
  for (const key of ['colors', 'materials', 'dimensions', 'care']) {
    assert.match(source, new RegExp(`assign ${key} = product\\.metafields\\.custom\\.${key}\\.value`));
    assert.match(source, new RegExp(`if ${key}(?: != blank|\\.size > 0)`));
    assert.ok(read('README.md').includes(`custom.${key}`), `merchant setup must document ${key}`);
  }
  assert.match(source, /for color in colors/);
  assert.doesNotMatch(liquid.join('\n') + read('README.md'), /mesana_catalog/,
    'obsolete app-owned editorial namespace must not be consumed or configured');
});

test('Shopify rich text is contained on mobile without suppressing content', () => {
  const css = read('assets/mesa-shop.css');
  assert.match(css, /\.mesa-shop__product>div{min-width:0}/);
  assert.match(css, /\.mesa-shop__description{[^}]*overflow-x:auto;overflow-wrap:anywhere/);
  assert.match(css, /\.mesa-shop__description img,\.mesa-shop__description video{max-width:100%;height:auto}/);
  assert.match(css, /\.mesa-shop__description a{display:inline;min-height:0;text-decoration:underline}/);
});

test('cart image slot is present even when a line has no image', () => {
  assert.match(liquid[2], /<article class="mesa-shop__line">\s*<div class="mesa-shop__line-image">\s*{% if item\.image %}[\s\S]*?{% else %}<span>{{ 'mesa_shop\.no_photo' \| t \| escape }}<\/span>{% endif %}\s*<\/div>\s*<div>\s*<h2>/);
  assert.match(read('assets/mesa-shop.css'), /\.mesa-shop__line-image>span[^}]*overflow-wrap:anywhere/);
});
