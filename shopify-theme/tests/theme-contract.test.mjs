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
  assert.deepEqual(files, ['ca.json', 'en.json', 'es.json', 'pt.json']);
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

test('untrusted descriptive content and cart property values are escaped', () => {
  const source = liquid.join('\n');
  for (const [, expression] of source.matchAll(/{{\s*([^}]+)\s*}}/g)) {
    if (/^(details\.|color\b|property\.|product\.title|item\.product\.title|item\.title|variant\.title|filter\.label|value\.label)/.test(expression.trim())) {
      assert.match(expression, /\| escape\b/, expression);
    }
  }
  assert.match(liquid[1], /details\.description \| escape \| newline_to_br/);
  assert.match(liquid[1], /product\.description \| strip_html \| escape/);
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


test('explicitly cleared Mesana descriptions never fall back to stale Shopify copy', () => {
  const source = liquid[1];
  const fallback = source.match(/{%\s*elsif\s+([^%]+)\s*%}\s*<p>{{ product\.description \| strip_html \| escape }}<\/p>/);
  assert.ok(fallback, 'native description fallback must have an explicit guard');
  assert.match(fallback[1], /product\.metafields\.mesana_catalog\.details == nil/,
    'fallback requires absence of the managed metafield, not an empty managed description');
  assert.match(fallback[1], /and product\.description != blank/);
  assert.doesNotMatch(fallback[1], /details\.description == blank|details == blank/);
});

test('cart image slot is present even when a line has no image', () => {
  assert.match(liquid[2], /<article class="mesa-shop__line">\s*<div class="mesa-shop__line-image">\s*{% if item\.image %}[\s\S]*?{% else %}<span>{{ 'mesa_shop\.no_photo' \| t \| escape }}<\/span>{% endif %}\s*<\/div>\s*<div>\s*<h2>/);
  assert.match(read('assets/mesa-shop.css'), /\.mesa-shop__line-image>span[^}]*overflow-wrap:anywhere/);
});
