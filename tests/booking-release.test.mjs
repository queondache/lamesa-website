import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {runInNewContext} from 'node:vm';
import {validateConfig,boot} from '../js/experience-booking.js';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const configSource=read('js/booking-config.js');
const languages=['es','en','ca'],types=['modelado','torno','workshops'];
const prefix=lang=>lang==='es'?'':`${lang}/`;

test('Public production configuration activates read-only Mesana calendar and client area',()=>{
 const window={location:{href:'https://lamesabcn.com/experiencias/modelado.html',hostname:'lamesabcn.com'}};
 runInNewContext(configSource,{window});const c=window.LA_MESA_GUEST_BOOKING;
 assert.equal(c.enabled,true);assert.equal(c.releaseApproved,true);assert.equal(c.bookingFlow,'whatsapp');assert.equal(c.studioSlug,'la-mesa');assert.equal(c.clientArea.enabled,true);
 assert.equal(c.apiBase,'https://mesa-saas-backend.onrender.com/api');assert.ok(validateConfig(c,window.location));
 assert.equal(c.experiences.modelado.expectedUnitPriceCents,4500);assert.equal(c.experiences.torno.expectedUnitPriceCents,6500);
 assert.deepEqual(Array.from(c.experiences.modelado.classTypeIds),['ct_c4a053343d214b15a3adf18f018f6bc4']);
});
test('Static production configuration preserves explicitly injected loopback sandbox',()=>{
 const sandbox={enabled:true,mode:'sandbox',bookingFlow:'stripe',apiBase:'/api',studioSlug:'la-mesa-sandbox',experiences:{modelado:{classTypeIds:['ct_guest_modelado'],expectedUnitPriceCents:4500},torno:{classTypeIds:['ct_guest_torno'],expectedUnitPriceCents:6500}}};
 const window={LA_MESA_GUEST_BOOKING:sandbox};runInNewContext(configSource,{window});assert.equal(window.LA_MESA_GUEST_BOOKING,sandbox);
 assert.ok(validateConfig(window.LA_MESA_GUEST_BOOKING,{href:'http://127.0.0.1:8801/experiencias/modelado.html',hostname:'127.0.0.1'}));
});
test('Public localized standby keeps contact, truthful empty workshops, SEO and no demo calls to action',()=>{
 for(const lang of languages)for(const type of types){const source=read(`${prefix(lang)}experiencias/${type}.html`);
  assert.doesNotMatch(source,/href="\/demo\/|vista previa|vista prèvia|this preview|local preview|date di prova|SANDBOX/i);
  assert.match(source,/href="https:\/\/wa.me\/34711552030"[^>]*rel="noopener noreferrer"/);
  assert.match(source,/<meta name="robots" content="index,follow">/);
  if(type!=='workshops'){
   assert.match(source,/data-booking-state="standby"/);assert.doesNotMatch(source,/pay online|paga online|paga en línia/);
   assert.ok(source.indexOf('src="/js/booking-config.js?v=5"')<source.indexOf('src="/js/experience-booking.js?v=5"'));
   assert.match(source,lang==='es'?/Elige día y hora en nuestro calendario/:lang==='en'?/Pick a day and time in our calendar/:/Tria dia i hora al nostre calendari/);
  }else{assert.doesNotMatch(source,/data-experience=|guest-calendar|data-event-id/);assert.match(source,/"numberOfItems": 0/);}
 }
 for(const lang of languages){const source=read(`${prefix(lang)}experiencias/reserva.html`);assert.match(source,/noindex,nofollow/);assert.match(source,/name="referrer" content="no-referrer"/);assert.match(source,/href="https:\/\/wa.me\/34711552030"/);assert.ok(source.indexOf('src="/js/booking-config.js?v=5"')<source.indexOf('src="/js/experience-booking.js?v=5"'));assert.doesNotMatch(source,/preview|vista previa|vista prèvia|local configurad/i);}
});
test('Return status has a safe localized fallback in ES, EN, CA and PT',()=>{
 for(const lang of ['es','en','ca','pt']){
  const source=read(`${prefix(lang)}experiencias/reserva.html`);
  assert.match(source,new RegExp(`<html lang="${lang}">`));assert.match(source,/data-booking-return="true"/);
  assert.match(source,/noindex,nofollow/);assert.match(source,/name="referrer" content="no-referrer"/);
  assert.match(source,/href="https:\/\/wa.me\/34711552030"/);
  assert.doesNotMatch(source,/booking is in preparation|reserva online directa está en preparación|reserva en línia directa està en preparació/i);
 }
});
test('Home discovery and sitemap include nine localized canonical pages while retaining legacy routes',()=>{
 const sitemap=read('sitemap.xml');const nodes=[...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m=>m[1]);
 for(const lang of languages){const home=read(`${prefix(lang)}index.html`);
  for(const type of types){const path=`${prefix(lang)}experiencias/${type}.html`;
  // Giro UX 05/10 (4): la home ha una sola esperienza che porta al calendario; le pagine experiencias restano in sitemap.
  const matching=nodes.filter(n=>n.includes(`<loc>https://lamesabcn.com/${path}</loc>`));assert.equal(matching.length,1);for(const alternate of languages)assert.ok(matching[0].includes(`hreflang="${alternate}" href="https://lamesabcn.com/${prefix(alternate)}experiencias/${type}.html"`));assert.ok(matching[0].includes(`hreflang="x-default" href="https://lamesabcn.com/experiencias/${type}.html"`));}
  assert.equal(home.split(`href="/${prefix(lang)}clases/suelta.html"`).length-1,2,'Hero and the single experience card lead to the booking calendar');assert.ok(read(`${prefix(lang)}experiencias/torno.html`).includes(`href="/${prefix(lang)}clases/suelta.html"`));
  assert.ok(home.includes('drive.google.com/drive/folders/'),'Existing workshop programme remains accessible');assert.ok(read(`${prefix(lang)}experiencias/modelado.html`).includes(`href="/${prefix(lang)}clases/suelta.html"`));
 }
 assert.doesNotMatch(sitemap,/<loc>[^<]*(?:experiencias\/reserva\.html|\/demo\/)/);
 assert.match(read('llms.txt'),/public calendars show actual Mesana dates/);
 assert.match(read('llms.txt'),/Public Modelado is €45; the €15 manual class is excluded/);
});
test('Pages publication excludes fixture and internal material; one stable cheap Node22 check',()=>{
 const config=read('_config.yml');for(const path of ['dev/','tests/','docs/','demo/','.orchestratore/','node_modules/','package.json','package-lock.json','.github/'])assert.ok(config.split('\n').some(line=>line.trim()===`- ${path}`));
 const workflow=read('.github/workflows/site-check.yml');assert.match(workflow,/pull_request:/);assert.match(workflow,/branches: \[main\]/);assert.match(workflow,/cancel-in-progress: true/);assert.match(workflow,/name: site-check/);assert.match(workflow,/node-version: '22'/);assert.match(workflow,/tests\/booking-release.test.mjs/);assert.doesNotMatch(workflow,/paths:|npm install|npm ci|postgres|stripe|experience-booking\.browser/i);
 assert.doesNotMatch(configSource,/ct_guest_|sandbox|localhost|127\.0\.0\.1|secret|sk_live|pk_live|token/i);
});
