import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root,path),'utf8');
const source = read('js/shop-links.js');
const destination = 'https://qqiza2-n3.myshopify.com/collections/all';
function render(config) {
 const link = {href:'#coleccion',textContent:'Explore',dataset:{shopLabel:'Available pieces'}};
 const status = {textContent:'Opening soon',dataset:{shopOpenLabel:'Available now'}};
 let queries = 0;
 runInNewContext(source,{window:{LA_MESA_SHOP:config}, URL, document:{querySelectorAll(selector){queries++; return selector==='[data-shop-link]'?[link]:[status];}}});
 return {link,status,queries};
}
test('Shop remains closed with default, absent and non-boolean configuration',()=>{
 const window={};runInNewContext(read('js/shop-config.js'),{window});
 for(const config of [window.LA_MESA_SHOP, undefined, {}, {enabled:'true',url:destination},{enabled:1,url:destination}]) {
  const r=render(config);assert.equal(r.link.href,'#coleccion');assert.equal(r.status.textContent,'Opening soon');assert.equal(r.queries,0);
 }
});
test('Approved switch links directly to Shopify, without copying stock or taking payment',()=>{
 const r=render({enabled:true,url:destination});assert.equal(r.link.href,destination);assert.equal(r.link.textContent,'Available pieces');assert.equal(r.status.textContent,'Available now');
});
test('Malformed URLs, lookalike hosts, credentials and alternate paths stay closed',()=>{
 for(const url of ['javascript:alert(1)','http://qqiza2-n3.myshopify.com/collections/all','https://qqiza2-n3.myshopify.com.evil.test/collections/all','https://user:password@qqiza2-n3.myshopify.com/collections/all','https://qqiza2-n3.myshopify.com/admin','https://qqiza2-n3.myshopify.com/collections/all?redirect=evil','https://qqiza2-n3.myshopify.com/collections/all#x','not a URL',undefined]) {
  const r=render({enabled:true,url});assert.equal(r.link.href,'#coleccion');assert.equal(r.queries,0);
 }
});
test('All four languages connect to real local assets, retain noindex and have native FAQs',()=>{
 for(const lang of ['es','en','ca','pt']) {
  const prefix=lang==='es'?'':lang+'/';const html=read(prefix+'tienda/index.html');
  assert.match(html,new RegExp(`<html lang="${lang}">`));assert.match(html,/<meta name="robots" content="noindex,follow">/);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.equal((html.match(/<summary>/g)||[]).length,3);
  assert.match(html,/14[,.]99/);assert.match(html,/Atlàntida/);assert.match(html,/data-shop-link/);
  assert.doesNotMatch(html,/Product"|Offer"|add.to.cart|\/cart\//i);
  for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
   let path=match[1].slice(1);if(!path||path.endsWith('/'))path+='index.html';
   assert.ok(existsSync(resolve(root,path)),`${lang}: ${path}`);
  }
  const home=read(prefix+'index.html');assert.ok(home.includes(`href="/${prefix}tienda/" id="shop-link"`));
 }
});
