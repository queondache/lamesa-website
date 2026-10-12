import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {validateConfig} from '../js/experience-booking.js';
import {GuestCancelApi,GuestCancelView,readToken,boot} from '../js/guest-cancel.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const location={href:'http://127.0.0.1:8801/experiencias/cancelar.html',hostname:'127.0.0.1'};
const raw={enabled:true,mode:'sandbox',bookingFlow:'stripe',apiBase:'/api',studioSlug:'la-mesa',experiences:{modelado:{classTypeIds:['x']}}};
const config=validateConfig(raw,location);
const WA=/https:\/\/wa\.me\/34711552030/;
const fakeRoot=()=>({html:'',listeners:{},set innerHTML(v){this.html=v;},get innerHTML(){return this.html;},addEventListener(n,h){this.listeners[n]=h;},querySelector(){return null;}});
const preview={title:'Torno <b>',startAt:'2026-10-14T14:00:00Z',endAt:'2026-10-14T16:00:00Z',timezone:'Europe/Madrid',persons:2,amountCents:13000,currency:'EUR',refundable:true,cutoffHours:24,cancellation:null};
const calls=[];
// map: suffisso URL -> [status, body] oppure array di risposte consecutive
const recorder=map=>async(url,options={})=>{
 calls.push({url,options,body:options.body?JSON.parse(options.body):null});
 const key=Object.keys(map).find(k=>url.endsWith(k));let entry=map[key];
 if(Array.isArray(entry[0]))entry=entry.length>1?entry.shift():entry[0];
 const [status,body]=entry;return {ok:status<400,status,json:async()=>body};
};
const ok=data=>[200,{data,error:null}];
const fail=(status,code)=>[status,{data:null,error:{code}}];
const viewWith=(fetcher,lang='es')=>{const r=fakeRoot();const v=new GuestCancelView(r,config,lang);v.api=new GuestCancelApi(config,fetcher);return {r,v};};

test('readToken: legge #t=, toglie subito il frammento dall URL, token assente -> null',()=>{
 const seen=[];const history={replaceState:(...a)=>seen.push(a)};
 assert.equal(readToken({hash:'#t=AbC_-123',pathname:'/experiencias/cancelar.html',search:''},history),'AbC_-123');
 assert.deepEqual(seen,[[null,'','/experiencias/cancelar.html']]);
 assert.equal(readToken({hash:'',pathname:'/p',search:''},history),null);
 assert.equal(readToken({hash:'#x=1',pathname:'/p',search:'?a=1'},history),null);
 assert.equal(seen.at(-1)[2],'/p?a=1');
});
test('anteprima rimborsabile: lezione, data/ora Madrid, persone, importo EUR, rimborso completo, bottone e WhatsApp; titolo escapato',async()=>{
 calls.length=0;const {r,v}=viewWith(recorder({'cancel-preview':ok(preview)}));
 await v.run('TOKEN-SECRET');
 assert.ok(calls[0].url.endsWith('/api/public/guest-bookings/cancel-preview'));
 assert.deepEqual(calls[0].body,{token:'TOKEN-SECRET'});assert.equal(calls[0].options.referrerPolicy,'no-referrer');assert.equal(calls[0].options.credentials,'omit');
 assert.match(r.html,/Torno &lt;b&gt;/);assert.doesNotMatch(r.html,/<b>/);
 assert.match(r.html,/miércoles/i);assert.match(r.html,/16:00–18:00/);
 assert.match(r.html,/2/);assert.match(r.html,/130,00\s?€/);
 assert.match(r.html,/Reembolso completo/);assert.doesNotMatch(r.html,/Sin reembolso/);
 assert.match(r.html,/data-action="cancel"[^>]*>Cancelar reserva/);assert.match(r.html,WA);
 assert.doesNotMatch(r.html,/TOKEN-SECRET/);
});
test('anteprima non rimborsabile: "Sin reembolso (menos de 24 h)" con cutoffHours dall API',async()=>{
 const {r,v}=viewWith(recorder({'cancel-preview':ok({...preview,refundable:false,cutoffHours:48})}));await v.run('t');
 assert.match(r.html,/Sin reembolso \(menos de 48 h\)/);
 const en=viewWith(recorder({'cancel-preview':ok({...preview,refundable:false})}),'en');await en.v.run('t');
 assert.match(en.r.html,/No refund \(less than 24 h\)/);assert.match(en.r.html,/Cancel booking/);
 const ca=viewWith(recorder({'cancel-preview':ok({...preview,refundable:false})}),'ca');await ca.v.run('t');
 assert.match(ca.r.html,/Sense reemborsament \(menys de 24 h\)/);
});
test('rimborsabile: un clic invia solo {token} e mostra cancelled_refunded',async()=>{
 calls.length=0;const {r,v}=viewWith(recorder({'cancel-preview':ok(preview),'/cancel':ok({status:'cancelled_refunded'})}));
 await v.run('TK');await v.requestCancel();
 const post=calls.find(c=>c.url.endsWith('/public/guest-bookings/cancel'));
 assert.deepEqual(post.body,{token:'TK'});
 assert.match(r.html,/reserva ha sido cancelada/i);assert.match(r.html,/reembols/i);assert.match(r.html,WA);assert.doesNotMatch(r.html,/TK/);
});
test('non rimborsabile: seconda conferma esplicita, poi confirmNoRefund=true; Volver non chiama la rete',async()=>{
 calls.length=0;const {r,v}=viewWith(recorder({'cancel-preview':ok({...preview,refundable:false}),'/cancel':ok({status:'cancelled_no_refund'})}));
 await v.run('TK');await v.requestCancel();
 assert.equal(calls.filter(c=>c.url.endsWith('/cancel')).length,0);
 assert.match(r.html,/data-action="confirm-no-refund"/);assert.match(r.html,/sin reembolso/i);assert.match(r.html,WA);
 v.back();assert.match(r.html,/data-action="cancel"/);assert.equal(calls.filter(c=>c.url.endsWith('/cancel')).length,0);
 await v.requestCancel();await v.confirmNoRefund();
 const post=calls.find(c=>c.url.endsWith('/public/guest-bookings/cancel'));
 assert.deepEqual(post.body,{token:'TK',confirmNoRefund:true});
 assert.match(r.html,/cancelada/i);assert.match(r.html,/sin reembolso/i);
});
test('needs_confirmation dal server (finestra scattata dopo la anteprima) porta alla seconda conferma',async()=>{
 const {r,v}=viewWith(recorder({'cancel-preview':ok(preview),'/cancel':ok({status:'needs_confirmation'})}));
 await v.run('TK');await v.requestCancel();
 assert.match(r.html,/data-action="confirm-no-refund"/);assert.doesNotMatch(r.html,/reserva ha sido cancelada/i);
});
test('esiti finali: refund pending, cancelled_by_studio (anteprima), non cancellabile 409',async()=>{
 const a=viewWith(recorder({'cancel-preview':ok(preview),'/cancel':ok({status:'cancelled_refund_pending'})}));await a.v.run('t');await a.v.requestCancel();
 assert.match(a.r.html,/te devolveremos el importe manualmente/i);assert.match(a.r.html,WA);
 const b=viewWith(recorder({'cancel-preview':ok({...preview,cancellation:'cancelled_by_studio'})}));await b.v.run('t');
 assert.match(b.r.html,/cancelada por el estudio/i);assert.doesNotMatch(b.r.html,/data-action="cancel"/);assert.match(b.r.html,WA);
 const c=viewWith(recorder({'cancel-preview':ok(preview),'/cancel':fail(409,'booking_not_cancellable')}));await c.v.run('t');await c.v.requestCancel();
 assert.match(c.r.html,/no se puede cancelar/i);assert.match(c.r.html,WA);
 // anteprima di una prenotazione gia' annullata: stesso esito, senza bottone
 const d=viewWith(recorder({'cancel-preview':ok({...preview,cancellation:'cancelled_no_refund'})}),'en');await d.v.run('t');
 assert.match(d.r.html,/cancelled/i);assert.doesNotMatch(d.r.html,/data-action="cancel"/);
});
test('esiti localizzati en/ca per tutti gli stati finali',async()=>{
 for(const [lang,re] of [['en',/te?he? booking has been cancelled|has been cancelled/i],['ca',/ha estat cancel·lada|cancel·lada/i]]){
  for(const status of ['cancelled_refunded','cancelled_no_refund','cancelled_refund_pending']){
   const {r,v}=viewWith(recorder({'cancel-preview':ok(preview),'/cancel':ok({status})}),lang);await v.run('t');await v.requestCancel();
   assert.match(r.html,re);assert.match(r.html,WA);
  }
 }
 const p=viewWith(recorder({'cancel-preview':ok(preview),'/cancel':ok({status:'cancelled_refund_pending'})}),'en');await p.v.run('t');await p.v.requestCancel();
 assert.match(p.r.html,/refund .* manually/i);
});
test('token non valido (410), assente, 429, rete: messaggio + WhatsApp; assente senza rete',async()=>{
 calls.length=0;const a=viewWith(recorder({}));await a.v.run(null);assert.equal(calls.length,0);assert.match(a.r.html,/no es válido o ha caducado/i);assert.match(a.r.html,WA);
 const b=viewWith(recorder({'cancel-preview':fail(410,'invalid_or_expired_token')}));await b.v.run('t');assert.match(b.r.html,/no es válido o ha caducado/i);assert.match(b.r.html,WA);
 const c=viewWith(recorder({'cancel-preview':fail(429,'rate_limited')}));await c.v.run('t');assert.match(c.r.html,/Demasiados intentos/);assert.match(c.r.html,WA);
 const d=viewWith(async()=>{throw new Error('network');});await d.v.run('t');assert.match(d.r.html,WA);assert.doesNotMatch(d.r.html,/Cargando|Cargant/);
 const e=viewWith(recorder({'cancel-preview':ok(preview),'/cancel':fail(410,'invalid_or_expired_token')}));await e.v.run('t');await e.v.requestCancel();assert.match(e.r.html,/no es válido o ha caducado/i);
 const f=viewWith(recorder({'cancel-preview':ok(preview),'/cancel':fail(503,'provider_unavailable')}));await f.v.run('t');await f.v.requestCancel();
 assert.match(f.r.html,WA);assert.match(f.r.html,/data-action="cancel"/);assert.match(f.r.html,/role="alert"/);
});
test('data/importo malformati: testo generico, mai bloccata; clic bloccato durante busy',async()=>{
 for(const bad of [{startAt:'x'},{timezone:'Mars/Olympus'},{startAt:null,endAt:null},{amountCents:'abc'}]){
  const {r,v}=viewWith(recorder({'cancel-preview':ok({...preview,...bad})}));await v.run('t');
  assert.match(r.html,/data-action="cancel"/);assert.doesNotMatch(r.html,/Invalid|NaN|undefined|Cargando/);assert.match(r.html,WA);
 }
 calls.length=0;let release;const gate=new Promise(res=>{release=res;});
 const {r,v}=viewWith(async(url,o)=>{calls.push({url});if(url.endsWith('cancel-preview'))return {ok:true,json:async()=>({data:preview,error:null})};await gate;return {ok:true,json:async()=>({data:{status:'cancelled_refunded'},error:null})};});
 await v.run('t');const p1=v.requestCancel();const p2=v.requestCancel();release();await Promise.all([p1,p2]);
 assert.equal(calls.filter(c=>c.url.endsWith('/cancel')).length,1);
});
test('titolo malevolo escapato in anteprima e negli esiti',async()=>{
 const evil='<img src=x onerror=alert(1)>';
 const {r,v}=viewWith(recorder({'cancel-preview':ok({...preview,title:evil}),'/cancel':ok({status:'cancelled_refunded'})}));
 await v.run('t');assert.doesNotMatch(r.html,/<img/);assert.match(r.html,/&lt;img src=x onerror=alert\(1\)&gt;/);
 await v.requestCancel();assert.doesNotMatch(r.html,/<img/);
});
test('click delegato: data-action cancel / confirm-no-refund / back',async()=>{
 const {r,v}=viewWith(recorder({'cancel-preview':ok({...preview,refundable:false}),'/cancel':ok({status:'cancelled_no_refund'})}));
 await v.run('t');const click=a=>r.listeners.click({target:{closest:()=>({dataset:{action:a}})}});
 await click('cancel');assert.match(r.html,/confirm-no-refund/);await click('back');assert.match(r.html,/data-action="cancel"/);
 await click('cancel');await click('confirm-no-refund');assert.match(r.html,/cancelada/i);
});
test('boot: il frammento sparisce dall URL PRIMA di qualsiasi fetch; token solo in memoria, mai in DOM/log',async()=>{
 const events=[];const logged=[];const orig={log:console.log,error:console.error,warn:console.warn,info:console.info};
 for(const k of Object.keys(orig))console[k]=(...a)=>logged.push(a);
 const r=fakeRoot();const doc={documentElement:{lang:'es'},querySelector:s=>s==='[data-guest-cancel]'?r:null};
 try{
  await boot({document:doc,window:{LA_MESA_GUEST_BOOKING:raw},location:{...location,hash:'#t=SECRET-TOKEN-1',pathname:'/experiencias/cancelar.html',search:''},
   history:{replaceState:(...a)=>events.push(['replace',a])},fetcher:async(url,o)=>{events.push(['fetch',o.body]);return {ok:true,json:async()=>({data:preview,error:null})};}});
 }finally{Object.assign(console,orig);}
 assert.equal(events[0][0],'replace');assert.deepEqual(events[0][1],[null,'','/experiencias/cancelar.html']);
 assert.equal(events[1][0],'fetch');assert.match(events[1][1],/SECRET-TOKEN-1/);
 assert.ok(!r.html.includes('SECRET-TOKEN-1'));assert.ok(!JSON.stringify(logged).includes('SECRET-TOKEN-1'));
});
test('boot: senza token nessuna chiamata di rete, messaggio + WhatsApp; senza config messaggio + WhatsApp',async()=>{
 let n=0;const r=fakeRoot();const doc={documentElement:{lang:'en'},querySelector:()=>r};
 await boot({document:doc,window:{LA_MESA_GUEST_BOOKING:raw},location:{...location,hash:'',pathname:'/en/experiencias/cancelar.html',search:''},history:{replaceState(){}},fetcher:async()=>{n++;}});
 assert.equal(n,0);assert.match(r.html,/invalid or has expired/i);assert.match(r.html,WA);
 const r2=fakeRoot();await boot({document:{documentElement:{lang:'ca'},querySelector:()=>r2},window:{},location:{...location,hash:'#t=abc',pathname:'/p',search:''},history:{replaceState(){}}});
 assert.match(r2.html,WA);
});

// ---- pagine ----
for(const [lang,prefix] of [['es',''],['en','en/'],['ca','ca/']]){
 test(`${prefix}experiencias/cancelar.html: noindex, no-referrer, lang, no analytics/terze parti, modulo e config`,()=>{
  const s=read(`${prefix}experiencias/cancelar.html`);
  assert.match(s,new RegExp(`<html lang="${lang}"`));
  assert.match(s,/<meta name="robots" content="noindex,nofollow">/);assert.match(s,/<meta name="referrer" content="no-referrer">/);
  assert.match(s,/data-guest-cancel/);assert.match(s,WA);assert.match(s,/class="container"/);
  assert.match(s,/type="module" src="[^"]*guest-cancel\.js\?v=1"/);assert.match(s,/booking-config\.js\?v=8/);
  assert.doesNotMatch(s,/googletagmanager|gtag\(|google-analytics|fbq|clarity|hotjar|cookiebot|connect\.facebook/i);
  const scripts=[...s.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m=>m[1]);
  for(const src of scripts)assert.doesNotMatch(src,/^https?:/);
  assert.doesNotMatch(read('sitemap.xml'),/cancelar\.html/);
 });
}
test('CSS: bottoni dell annullo con area di tocco >= 44px (riuso classi course-turns)',()=>{
 const css=read('css/experience-booking.css');
 for(const selector of ['.course-turns__submit','.course-turns__back','.course-turns__wa']){
  const rule=css.split('}').find(b=>b.split('{')[0].split(',').map(x=>x.trim()).includes(selector));
  const m=/min-height:\s*(\d+)px/.exec(rule||'');assert.ok(m&&Number(m[1])>=44,selector);
 }
 const s=read('js/guest-cancel.js');assert.match(s,/course-turns__submit/);
});
test('workflow site-check include guest-cancel.test.mjs',()=>{assert.match(read('.github/workflows/site-check.yml'),/tests\/guest-cancel\.test\.mjs/);});
