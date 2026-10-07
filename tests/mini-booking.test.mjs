import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
await import('../js/mini-booking.js');
const {MiniBooking,bookingMode}=globalThis.MiniBookingTestHooks;

const prod={enabled:true,mode:'production',releaseApproved:true,apiBase:'https://mesana.example/api',allowedApiOrigins:['https://mesana.example'],studioSlug:'la-mesa',experiences:{modelado:{classTypeIds:['ct-modelado']},torno:{classTypeIds:['ct-torno']}}};
const page={href:'https://lamesabcn.com/pt/clases/suelta.html',hostname:'lamesabcn.com',hash:'',assign(){}};
const session=(overrides={})=>({id:'session-1',classTypeId:'ct-modelado',title:'Modelado',startAt:'2099-05-10T16:00:00Z',endAt:'2099-05-10T18:00:00Z',timezone:'Europe/Madrid',unitPriceCents:4500,currency:'EUR',remainingSeats:3,...overrides});
const response=(data,ok=true)=>({ok,json:async()=>data});
const memory=()=>{const map=new Map();return{getItem:key=>map.get(key),setItem:(key,value)=>map.set(key,value)};};
const tab=kind=>({kind,attrs:{'data-kind':kind},getAttribute(name){return this.attrs[name];},setAttribute(name,value){this.attrs[name]=value;},addEventListener(_event,handler){this.click=handler;}});
function root(){
 const body={html:'',set innerHTML(value){this.html=value;},get innerHTML(){return this.html;},querySelector(){return null;},querySelectorAll(){return[];}};
 return{body,tabs:[tab('mesa'),tab('torno')],getAttribute(name){return({'data-default':'mesa','data-price-mesa':'45','data-price-torno':'65'})[name]||null;},querySelector(selector){return selector==='.mini-booking__body'?body:null;},querySelectorAll(selector){return selector==='[data-kind]'?this.tabs:[];}};
}
function widget({config=prod,fetcher,lang='es',location=page,storage=memory()}={}){
 return new MiniBooking(root(),{config,fetcher,lang,location,storage});
}

function interactiveRoot(){
 const element=(attributes,html)=>({disabled:/\bdisabled\b/.test(html),getAttribute(name){return attributes[name]||null;},focus(){this.focused=true;}});
 const r=root();
 let html='',cache={};Object.defineProperty(r.body,'innerHTML',{get(){return html;},set(value){html=value;cache={};}});
 r.body.querySelectorAll=function(selector){
  if(cache[selector])return cache[selector];
  const attribute=selector.match(/^\[data-(month|date|slot|qty)\]/)?.[1];
  if(!attribute)return[];
  return cache[selector]=[...this.innerHTML.matchAll(/<button\b([^>]*)>/g)].filter(([,html])=>html.includes(`data-${attribute}=`)).map(([,html])=>{
   const value=html.match(new RegExp(`data-${attribute}="([^"]*)"`))?.[1];
   return element({[`data-${attribute}`]:value},html);
  }).filter(button=>!selector.includes(':not(:disabled)')||!button.disabled);
 };
 r.body.querySelector=function(selector){return selector==='.mini-booking__time'?this.querySelectorAll('[data-slot]')[0]:null;};
 return r;
}

test('contract feed supports Torno clicks, a bookable day, people and a 65 € total',async()=>{
 const start=new Date();start.setDate(start.getDate()+3);start.setHours(12,0,0,0);
 const startAt=start.toISOString();
 const date=(await import('../js/experience-booking.js')).civilDate(startAt,'Europe/Madrid');
 const r=interactiveRoot();
 const config={...prod,experiences:{modelado:{classTypeIds:['ct_m']},torno:{classTypeIds:['ct_t']}}};
 const w=new MiniBooking(r,{config,lang:'es',location:page,storage:memory(),fetcher:async()=>response({data:{sessions:[session({id:'sess_1',classTypeId:'ct_t',title:'Torno',startAt,endAt:new Date(start.getTime()+7200000).toISOString(),unitPriceCents:6500,remainingSeats:2})]},error:null})});
 await w.load();assert.match(w.body.innerHTML,/<div class="mini-booking__price">—/);r.tabs[1].click();
 assert.deepEqual(w.slots.torno.map(s=>s.id),['sess_1']);
 assert.ok(w.body.innerHTML.includes(`data-date="${date}"`));
 assert.ok(!w.body.innerHTML.includes(`data-date="${date}" disabled`));
 assert.match(w.body.innerHTML,/<div class="mini-booking__price">65(?:[,.]00)?\s*€/);
 const days=r.body.querySelectorAll('[data-date]:not(:disabled)');assert.ok(days.length>0,JSON.stringify(days));
 const day=days.find(button=>button.getAttribute('data-date')===date);assert.ok(day,JSON.stringify(days));day.onclick();
 assert.match(w.body.innerHTML,/mini-booking__time/);
 r.body.querySelectorAll('[data-slot]').find(button=>button.getAttribute('data-slot')==='sess_1').onclick();
 assert.match(w.body.innerHTML,/mini-booking__people/);
 assert.match(w.body.innerHTML,/mini-booking__total[\s\S]*65(?:[,.]00)?\s*€/);
 r.body.querySelectorAll('[data-qty]').find(button=>button.getAttribute('data-qty')==='1').onclick();
 assert.equal(w.quantity,2);assert.match(w.body.innerHTML,/mini-booking__total[\s\S]*130(?:[,.]00)?\s*€/);
});

test('switching to Torno while Mesana is loading keeps the loading state and then renders the contract session',async()=>{
 let answer;const pending=new Promise(resolve=>{answer=resolve;});
 const start=new Date();start.setDate(start.getDate()+3);start.setHours(12,0,0,0);
 const config={...prod,experiences:{modelado:{classTypeIds:['ct_m']},torno:{classTypeIds:['ct_t']}}};
 const r=interactiveRoot();const w=new MiniBooking(r,{config,lang:'es',location:page,storage:memory(),fetcher:async()=>pending});
 const loading=w.load();await new Promise(resolve=>setImmediate(resolve));r.tabs[1].click();
 assert.match(w.body.innerHTML,/Buscando fechas/);assert.doesNotMatch(w.body.innerHTML,/0,65|no hay fechas online/i);
 answer(response({data:{sessions:[session({id:'sess_1',classTypeId:'ct_t',title:'Torno',startAt:start.toISOString(),endAt:new Date(start.getTime()+7200000).toISOString(),unitPriceCents:6500,remainingSeats:1})]},error:null}));await loading;
 assert.match(w.body.innerHTML,/<div class="mini-booking__price">65(?:[,.]00)?\s*€/);
 assert.ok(r.body.querySelectorAll('[data-date]:not(:disabled)').length>0);
});

test('invalid configuration shows WhatsApp without contacting the old system',async()=>{
 const calls=[];const w=widget({config:{...prod,bookingFlow:'whatsapp',enabled:false},fetcher:async(url)=>{calls.push(url);throw new Error('unexpected fetch');}});
 const old=console.error;console.error=()=>{};
 try{await w.load();assert.equal(w.mode,'unavailable');assert.deepEqual(calls,[]);assert.match(w.body.innerHTML,/wa.me\/34711552030/);assert.doesNotMatch(w.body.innerHTML,/book.html|checkout/);}finally{console.error=old;}
});

test('valid Mesana configuration loads no more than 90 days and never calls v2',async()=>{
 const calls=[];const w=widget({fetcher:async(url)=>{calls.push(url);return response({data:{sessions:[session()]},error:null});}});await w.load();
 assert.equal(w.mode,'mesana');assert.equal(calls.length,1);assert.match(calls[0],/^https:\/\/mesana\.example\/api\/public\/studios\/la-mesa\/guest-sessions\?from=\d{4}-\d{2}-\d{2}&to=\d{4}-\d{2}-\d{2}$/);
 const query=new URL(calls[0]).searchParams;const span=(Date.parse(query.get('to'))-Date.parse(query.get('from')))/86400000+1;assert.ok(span<=90);assert.ok(!calls[0].includes('public-slots'));
});

test('Mesana sessions split by configured class IDs and show server unit price',async()=>{
 const sessions=[session(),session({id:'session-2',classTypeId:'ct-torno',title:'Torno',unitPriceCents:6500})];
 const w=widget({fetcher:async()=>response({data:{sessions},error:null})});await w.load();
 assert.deepEqual(w.slots.mesa.map(s=>s.id),['session-1']);assert.deepEqual(w.slots.torno.map(s=>s.id),['session-2']);assert.match(w.body.innerHTML,/45[,.]00\s*€/);
 w.setKind('torno');assert.match(w.body.innerHTML,/65[,.]00\s*€/);
});

test('checkout sends the strict payload, maps pt to en, keeps the same intent key and redirects',async()=>{
 const posts=[];let redirected='';const location={...page,assign:value=>{redirected=value;}};
 const fetcher=async(url,options={})=>{if(options.method==='POST'){posts.push(JSON.parse(options.body));return response({data:{attemptId:'attempt-1',status:'pending',quantity:posts.at(-1).quantity,totalCents:4500*posts.at(-1).quantity,currency:'EUR',session:{id:posts.at(-1).sessionId,title:'Modelado',startAt:'2099-05-10T16:00:00Z',endAt:'2099-05-10T18:00:00Z',timezone:'Europe/Madrid'},checkoutUrl:'https://checkout.stripe.com/c/pay/test',accessToken:'x'.repeat(43)},error:null},true);}return response({data:{sessions:[session()]},error:null});};
 const storage=memory();const w=widget({fetcher,lang:'pt',location,storage});await w.load();w.selectedId='session-1';w.date='2099-05-10';w.render();await w.checkout('Andrea','A@Example.com');await w.checkout('Andrea','A@Example.com');
 assert.deepEqual({...posts[0],idempotencyKey:'key'},{sessionId:'session-1',quantity:1,name:'Andrea',email:'a@example.com',locale:'en',idempotencyKey:'key'});assert.equal(posts[0].idempotencyKey,posts[1].idempotencyKey);assert.equal(redirected,'https://checkout.stripe.com/c/pay/test');
 assert.deepEqual(JSON.parse(storage.getItem('lamesa.guest.booking.v1')).intent,{experience:'modelado',sessionId:'session-1',quantity:1,date:'2099-05-10',locale:'en'});
 w.quantity=2;await w.checkout('Andrea','A@Example.com');assert.notEqual(posts[2].idempotencyKey,posts[1].idempotencyKey);
 w.slots.mesa.push({...session({id:'session-2',startAt:'2099-05-11T16:00:00Z',endAt:'2099-05-11T18:00:00Z'}),date:'2099-05-11',available:3,price:4500,startTime:'18:00'});w.selectedId='session-2';await w.checkout('Andrea','A@Example.com');assert.notEqual(posts[3].idempotencyKey,posts[2].idempotencyKey);
});

test('insufficient seats displays capacity message and reloads sessions',async()=>{
 let gets=0;const fetcher=async(_url,options={})=>{if(options.method==='POST')return response({data:null,error:{code:'insufficient_seats'}},false);gets++;return response({data:{sessions:[session()]},error:null});};
 const w=widget({fetcher});await w.load();w.selectedId='session-1';w.date='2099-05-10';await assert.rejects(()=>w.checkout('Andrea','a@example.com'),/insufficient_seats/);assert.equal(gets,2);assert.ok(w.body.innerHTML.includes('<p class="mini-booking__status" role="alert">Esas plazas ya no están disponibles. Elige otro horario.</p>'));
});

test('full Mesana sessions never make a day bookable',async()=>{
 const w=widget({fetcher:async()=>response({data:{sessions:[session({remainingSeats:0})]},error:null})});await w.load();
 assert.deepEqual(w.slots.mesa,[]);assert.ok(!w.body.innerHTML.includes('data-date="2099-05-10"'));
});

test('WhatsApp calendar filters exact public prices and never writes a checkout',async()=>{
 const config={...prod,bookingFlow:'whatsapp',experiences:{modelado:{classTypeIds:['ct-modelado'],expectedUnitPriceCents:4500},torno:{classTypeIds:['ct-torno'],expectedUnitPriceCents:6500}}};
 for(const lang of ['es','en','ca','pt']){
  const calls=[];const w=widget({config,lang,fetcher:async(url,options={})=>{calls.push({url,method:options.method||'GET'});return response({data:{sessions:[session(),session({id:'manual',unitPriceCents:1500}),session({id:'full',remainingSeats:0})]},error:null});}});
  await w.load();assert.deepEqual(w.slots.mesa.map(s=>s.id),['session-1']);assert.equal(calls.length,1);assert.match(calls[0].url,/calendar-sessions\?from=/);assert.equal(calls[0].method,'GET');
  w.selectedId='session-1';w.date='2099-05-10';w.quantity=2;w.render();
  const url=w.body.innerHTML.match(/href="(https:\/\/wa.me\/34711552030\?text=[^"]+)/)?.[1];assert.ok(url,lang);
  const message=new URL(url).searchParams.get('text');assert.match(message,/2099-05-10/);assert.match(message,/18:00/);assert.match(message,/2 /);
  assert.doesNotMatch(w.body.innerHTML,/mini-booking__form|data-action="book"|checkout.stripe|15[,.]00/);
  await assert.rejects(()=>w.checkout('Name','a@example.com'),/session_unavailable/);assert.equal(calls.length,1);
 }
});

test('WhatsApp mini calendar loads when browser storage access throws',async()=>{
 const config={...prod,bookingFlow:'whatsapp',experiences:{modelado:{classTypeIds:['ct-modelado'],expectedUnitPriceCents:4500},torno:{classTypeIds:['ct-torno'],expectedUnitPriceCents:6500}}};
 const original=Object.getOwnPropertyDescriptor(globalThis,'sessionStorage');let browserReads=0,optionReads=0;const calls=[];
 Object.defineProperty(globalThis,'sessionStorage',{configurable:true,get(){browserReads++;throw new Error('SecurityError');}});
 try{
  const options={config,lang:'es',location:page,fetcher:async(url,request={})=>{calls.push({url,method:request.method||'GET'});return response({data:{sessions:[session()]},error:null});},get storage(){optionReads++;throw new Error('storage_unavailable');}};
  const w=new MiniBooking(root(),options);await w.load();
  assert.deepEqual(w.slots.mesa.map(s=>s.id),['session-1']);assert.equal(w.store,null);
  assert.deepEqual(calls.map(call=>call.method),['GET']);assert.match(calls[0].url,/calendar-sessions\?from=/);
  w.selectedId='session-1';w.date='2099-05-10';w.render();assert.match(w.body.innerHTML,/wa.me\/34711552030\?text=/);
  assert.equal(browserReads,0);assert.equal(optionReads,0);
 }finally{if(original)Object.defineProperty(globalThis,'sessionStorage',original);else delete globalThis.sessionStorage;}
});

test('untrusted session title and id are escaped before innerHTML',async()=>{
 const attack='<img src=x onerror=alert(1)>';const badId='"><svg/onload=alert(1)>';const w=widget({fetcher:async()=>response({data:{sessions:[session({id:badId,title:attack})]},error:null})});await w.load();w.date='2099-05-10';w.selectedId=badId;w.render();
 assert.ok(!w.body.innerHTML.includes(attack));assert.ok(!w.body.innerHTML.includes('"><svg'));assert.match(w.body.innerHTML,/&lt;img|&quot;&gt;&lt;svg/);
});

test('invalid allowedApiOrigins does not fall back to the old system',async()=>{
 const errors=[];const calls=[];const invalid={...prod,bookingFlow:'whatsapp',allowedApiOrigins:['https://other.example']};const old=console.error;console.error=(...args)=>errors.push(args);
 try{assert.equal(bookingMode(invalid,page),'unavailable');const w=widget({config:invalid,fetcher:async(url)=>{calls.push(url);throw new Error('unexpected fetch');}});await w.load();assert.deepEqual(calls,[]);assert.match(w.body.innerHTML,/wa.me\/34711552030/);assert.ok(errors.length>=1);}finally{console.error=old;}
});

test('all localized pages load shared config before the classic widget',()=>{
 for(const file of ['clases/suelta.html','en/clases/suelta.html','ca/clases/suelta.html','pt/clases/suelta.html']){const html=readFileSync(new URL(`../${file}`,import.meta.url),'utf8');assert.match(html,/booking-config\.js\?v=4[\s\S]*<script src="[^"]*mini-booking\.js\?v=4"[^>]*defer/);assert.doesNotMatch(html,/type="module" src="[^"]*mini-booking\.js/);}
});

test('browser script remains classic and uses no ES2022 syntax',()=>{
 const source=readFileSync(new URL('../js/mini-booking.js',import.meta.url),'utf8');assert.doesNotMatch(source,/^\s*import\s/m);assert.match(source,/import\(['"]\.\/experience-booking\.js\?v=4['"]\)/);assert.doesNotMatch(source,/\.at\s*\(|\?\?=/);
});
