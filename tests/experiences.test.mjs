import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const languages=['es','en','ca'];
const experiences=['modelado','torno','workshops'];
const prefix=lang=>lang==='es'?'':`${lang}/`;
const pagePath=(lang,kind)=>`${prefix(lang)}experiencias/${kind}.html`;
const pageUrl=(lang,kind)=>`https://lamesabcn.com/${pagePath(lang,kind)}`;
const read=path=>readFileSync(resolve(root,path),'utf8');
const docs=[];
for(const lang of languages)for(const kind of experiences){
 const path=pagePath(lang,kind);const source=read(path);docs.push(source);
 test(`${path}: discoverable localized static content and truthful schema`,()=>{
  assert.match(source,new RegExp(`<html lang="${lang}">`));
  assert.equal((source.match(/<h1(?:\s|>)/g)||[]).length,1);
  assert.match(source,/<meta name="robots" content="index,follow">/);
  assert.match(source,/<title>[^<]+<\/title>/);
  assert.match(source,/<meta name="description" content="[^\"]{70,200}">/);
  assert.ok(source.includes(`<link rel="canonical" href="${pageUrl(lang,kind)}">`));
  for(const code of languages)assert.ok(source.includes(`<link rel="alternate" hreflang="${code}" href="${pageUrl(code,kind)}">`));
  assert.ok(source.includes(`<link rel="alternate" hreflang="x-default" href="${pageUrl('es',kind)}">`));
  const blocks=[...source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  assert.equal(blocks.length,2);const entity=blocks[0];
  assert.equal(entity.url,pageUrl(lang,kind));assert.equal(entity.inLanguage,lang);
  assert.equal(entity['@type'],kind==='workshops'?'CollectionPage':'Course');
  assert.equal(blocks[1]['@type'],'BreadcrumbList');
  assert.equal(blocks[1].itemListElement.at(-1).item,pageUrl(lang,kind));
  assert.doesNotMatch(source,/aggregateRating|reviewCount|priceValidUntil|startDate|endDate|"@type":\s*"Event"/);
  assert.equal((source.match(/<script/g)||[]).length,kind==='workshops'?2:3,'Only JSON-LD and explicitly gated local booking module');
  if(kind!=='workshops')assert.match(source,/<script type="module" src="\/js\/experience-booking.js"><\/script>/);
  assert.doesNotMatch(source,/Cookiebot|googletagmanager|google-analytics|onrender|\/js\/booking|<iframe/i);
  assert.match(source,/class="preview-banner" role="note"/);
  assert.ok((source.match(/<details>/g)||[]).length>=3);
  assert.match(source,/Carrer de l’Atlàntida, 47/);
  if(kind==='workshops'){
   assert.equal(entity.mainEntity.numberOfItems,0);assert.deepEqual(entity.mainEntity.itemListElement,[]);
   assert.doesNotMatch(source,/data-experience=|class="price"|data-event-id/);
  }else{
   assert.equal(entity.offers.price,kind==='modelado'?'45':'65');assert.equal(entity.offers.priceCurrency,'EUR');
   assert.equal(entity.timeRequired,'PT2H');assert.equal(entity.provider.address.streetAddress,'Carrer de l’Atlàntida, 47');
   assert.match(source,new RegExp(`id="reserva" data-experience="${kind}" data-booking-state="prelaunch"`));
   assert.match(source,/href="\/demo\/prenotazione.html#reserva" lang="es"/);
   assert.equal((source.match(/<li>/g)||[]).length,3,'Included materials and firing are static');
  }
  for(const m of source.matchAll(/(?:href|src)="(\/[^\"]*)"/g)){
   const local=m[1].split(/[?#]/)[0];assert.ok(existsSync(resolve(root,`.${local}`)),`Broken local asset/link: ${local}`);
  }
 });
}
test('Each experience has a distinct title and description in each language',()=>{
 assert.equal(new Set(docs.map(s=>s.match(/<title>(.*?)<\/title>/)[1])).size,9);
 assert.equal(new Set(docs.map(s=>s.match(/name="description" content="([^\"]+)"/)[1])).size,9);
});
test('Styles preserve branded fonts, contrast colors, target sizes and reduced motion',()=>{
 const css=read('css/experiences.css');
 for(const value of ['#FFFAEE','#1B3C8B','#E84159','#F7B137','#1A1A1A','HighCruiser','Garet','Montserrat'])assert.ok(css.includes(value));
 assert.match(css,/min-width:44px/);assert.match(css,/min-height:44px/);assert.match(css,/prefers-reduced-motion:reduce/);
 for(const match of css.matchAll(/url\('([^']+)'\)/g))assert.ok(existsSync(resolve(root,'css',match[1])));
});
