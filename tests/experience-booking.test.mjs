import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {validateConfig,paymentUrl,civilDate,sessionsFor,sessionDetails,validAttempt,calendarIcs,BookingStorage,GuestApi,GuestWidget,boot} from '../js/experience-booking.js';
const location={href:'http://127.0.0.1:8801/experiencias/modelado.html',hostname:'127.0.0.1'};
const raw={enabled:true,mode:'sandbox',apiBase:'/api',studioSlug:'test',experiences:{modelado:{classTypeIds:['modelado']}}};
const session={id:'s1',classTypeId:'modelado',title:'Class',startAt:'2026-10-25T00:30:00Z',endAt:'2026-10-25T02:30:00Z',timezone:'Europe/Madrid',unitPriceCents:4500,currency:'EUR',remainingSeats:2};
const attempt={attemptId:'a1',status:'pending',quantity:2,totalCents:9000,currency:'EUR',session,accessToken:'x'.repeat(43)};
const memory=()=>{const map=new Map();return{getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)}};
test('Default off; sandbox restricted to same-origin loopback /api; production explicit approval and origin',()=>{
 assert.equal(validateConfig(undefined,location),null);assert.equal(validateConfig({...raw,enabled:false},location),null);
 assert.equal(validateConfig({...raw,apiBase:'https://real.example/api'},location),null);
 assert.equal(validateConfig(raw,{href:'https://lamesabcn.com/',hostname:'lamesabcn.com'}),null);
 assert.equal(validateConfig({...raw,apiBase:'/wrong'},location),null);
 assert.equal(validateConfig({...raw,experiences:{modelado:{classTypeIds:[]}}},location),null);
 assert.equal(validateConfig({...raw,mode:'production'},location),null);
 const prod={...raw,mode:'production',releaseApproved:true,apiBase:'https://approved.example/api',allowedApiOrigins:['https://approved.example']};
 assert.ok(validateConfig(prod,location));assert.equal(validateConfig({...prod,apiBase:'http://approved.example/api'},location),null);
});
test('Checkout URL allowlist rejects misleading hosts, credentials and remote sandbox',()=>{
 const config=validateConfig(raw,location);
 assert.equal(paymentUrl('https://checkout.stripe.com/c/pay/test',config),'https://checkout.stripe.com/c/pay/test');
 assert.equal(paymentUrl('http://127.0.0.1:8800/pay/test',config),'http://127.0.0.1:8800/pay/test');
 for(const value of ['https://checkout.stripe.com.evil.test/pay','javascript:alert(1)','https://user:pass@checkout.stripe.com/pay','http://localhost:8800/pay','http://127.0.0.1:9999/pay'])assert.throws(()=>paymentUrl(value,config));
 assert.throws(()=>paymentUrl('http://127.0.0.1:8800/pay/test',{mode:'production'}));
});
test('Stable class IDs, validated API prices/capacity and Madrid civil dates across DST',()=>{
 assert.equal(civilDate('2026-10-24T23:30:00Z'),'2026-10-25');
 assert.deepEqual(sessionsFor([session,{...session,id:'other',classTypeId:'another'}],['modelado']),[session]);
 for(const invalid of [{unitPriceCents:0},{remainingSeats:-1},{currency:'USD'},{timezone:'UTC'},{endAt:'bad'}])assert.throws(()=>sessionsFor([{...session,...invalid}],['modelado']));
});
test('Guest feed description and photo appear when supplied, and absent content stays optional',()=>{
 const content={...session,description:'Turno & torno <para todos>',imageUrl:'https://cdn.example.test/torno.jpg'};
 assert.match(sessionDetails(content),/Turno &amp; torno &lt;para todos&gt;/);
 assert.match(sessionDetails(content),/src="https:\/\/cdn\.example\.test\/torno\.jpg"/);
 assert.equal(sessionDetails(session),'');
 assert.equal(sessionDetails({...content,imageUrl:'javascript:alert(1)'}).includes('<img'),false);
});
test('Payment copy describes conditional wallets',()=>{
 const source=readFileSync(resolve(dirname(fileURLToPath(import.meta.url)),'../js/experience-booking.js'),'utf8');
 for(const wallet of ['Apple Pay','Google Pay'])assert.match(source,new RegExp(wallet));
});
test('Widget limits plus clicks to server seats and POSTs the selected quantity in the strict schema',async()=>{
 const original={document:globalThis.document,sessionStorage:globalThis.sessionStorage,location:globalThis.location};
 const calls=[];
 const button=(attributes={})=>({dataset:attributes,disabled:false,addEventListener(_name,handler){this.onclick=handler;},focus(){}});
 const root={dataset:{experience:'modelado'},className:'',setAttribute(){},removeAttribute(){},contains(){return false;},querySelector(selector){return selector==='[data-action="checkout"]'?this.checkout:null;},querySelectorAll(selector){return this.buttons[selector]||[];},buttons:{}};
 Object.defineProperty(root,'innerHTML',{set(html){
  this.html=html;this.buttons={};
  for(const key of ['month','date','session','qty'])this.buttons[`[data-${key}]`]=[...html.matchAll(new RegExp(`<button\\b([^>]*)data-${key}="([^"]+)"([^>]*)>`, 'g'))].map(([,before,value,after])=>{const el=button({[key]:value});el.disabled=/\bdisabled\b/.test(before+after);return el;});
  this.checkout=html.includes('data-action="checkout"')?button():null;
 }});
 const close=button(),submitButton=button();submitButton.type='submit';
 const form={elements:{name:{value:'Example Guest'},email:{value:'guest@example.com'}},reportValidity:()=>true,querySelector:()=>submitButton};
 const error={hidden:true,textContent:''};
 const dialog={className:'',setAttribute(){},addEventListener(){},showModal(){},close(){},remove(){},querySelector(selector){return selector==='form'?form:selector==='[data-close]'?close:selector==='.guest-error'?error:null;}};
 globalThis.document={documentElement:{lang:'es'},activeElement:null,querySelectorAll:()=>[],createElement:()=>dialog,body:{append(){} }};
 globalThis.sessionStorage=memory();
 globalThis.location={...location,assign(){}};
 try{
  const widget=new GuestWidget(root,validateConfig(raw,location));
  widget.api=new GuestApi(widget.config,async(url,options)=>{
   calls.push({url,options});
   return {ok:true,json:async()=>({data:options.method==='POST'?{...attempt,status:'pending',quantity:2,checkoutUrl:'http://127.0.0.1:8800/pay/test'}:{sessions:[{...session,remainingSeats:3}]},error:null})};
  });
  await widget.init();
  const plus=root.querySelectorAll('[data-qty]').find(el=>el.dataset.qty==='1');
  for(let i=0;i<4;i++)plus.onclick();
  assert.equal(widget.quantity,3);
  assert.equal(root.querySelectorAll('[data-qty]').find(el=>el.dataset.qty==='1').disabled,true);
  root.querySelectorAll('[data-qty]').find(el=>el.dataset.qty==='-1').onclick();
  assert.equal(widget.quantity,2);
  root.querySelector('[data-action="checkout"]').onclick();
  await widget.submit();
  const post=calls.find(call=>call.options.method==='POST');
  assert.ok(post.url.endsWith('/public/studios/test/guest-checkouts'));
  const payload=JSON.parse(post.options.body);
  assert.deepEqual(Object.keys(payload).sort(),['sessionId','quantity','name','email','locale','idempotencyKey'].sort());
  assert.match(payload.idempotencyKey,/^[A-Za-z0-9_-]{16,128}$/);
  assert.deepEqual({...payload,idempotencyKey:'key'},{sessionId:'s1',quantity:2,name:'Example Guest',email:'guest@example.com',locale:'es',idempotencyKey:'key'});
 }finally{globalThis.document=original.document;globalThis.sessionStorage=original.sessionStorage;globalThis.location=original.location;}
});
test('Retry preserves idempotency key; changed quantity/purchaser/locale gets a fresh intent; no PII stored',async()=>{
 const backing=memory(),storage=new BookingStorage(backing);const input={sessionId:'s1',quantity:2,name:'Example Person',email:'example@example.com',locale:'es'};
 const key=await storage.key(input);assert.equal(await storage.key(input),key);
 assert.notEqual(await storage.key({...input,quantity:1}),key);
 const second=await storage.key(input);assert.notEqual(await storage.key({...input,name:'Other Person'}),second);
 const third=await storage.key(input);assert.notEqual(await storage.key({...input,locale:'en'}),third);
 const state=JSON.stringify(storage.read());assert.ok(!state.includes(input.name));assert.ok(!state.includes(input.email));
 storage.attempt(attempt);storage.terminal({...attempt,status:'confirmed'});assert.equal(storage.read().attempt.accessToken,undefined);
});
test('ICS is confirmed-only and uses unambiguous UTC instants across Madrid DST transition',()=>{
 assert.throws(()=>calendarIcs(attempt));const confirmed={...attempt,status:'confirmed'};const ics=calendarIcs(confirmed);
 assert.match(ics,/DTSTART:20261025T003000Z/);assert.match(ics,/DTEND:20261025T023000Z/);assert.match(ics,/X-WR-TIMEZONE:Europe\/Madrid/);
 assert.equal(validAttempt({...attempt,status:'paid_needs_staff'}).status,'paid_needs_staff');assert.throws(()=>validAttempt({...attempt,status:'paid'}));
});
test('API strict browser payload; status token bearer header only; no credentials, cached responses or referrer',async()=>{
 const calls=[];const api=new GuestApi(validateConfig(raw,location),async(url,options)=>{calls.push({url,options});return{ok:true,json:async()=>({data:attempt,error:null})};});
 const input={sessionId:'s1',quantity:2,name:'Example',email:'example@example.com',locale:'es',idempotencyKey:'key'};
 await api.start(input);await api.status(attempt);
 assert.deepEqual(JSON.parse(calls[0].options.body),input);assert.equal(calls[1].options.headers.Authorization,'Bearer '+attempt.accessToken);
 assert.ok(!calls[1].url.includes(attempt.accessToken));assert.equal(calls[1].options.credentials,'omit');assert.equal(calls[1].options.cache,'no-store');assert.equal(calls[1].options.referrerPolicy,'no-referrer');
});
test('API timeout and backend seat conflict stay retryable failures instead of confirmation',async()=>{
 const conflict=new GuestApi(validateConfig(raw,location),async()=>({ok:false,json:async()=>({data:null,error:{code:'insufficient_seats'}})}));
 await assert.rejects(()=>conflict.start({}),/insufficient_seats/);
 const timeout=new GuestApi({...validateConfig(raw,location),timeoutMs:5},async(_url,{signal})=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(Object.assign(new Error(),{name:'AbortError'})))));
 await assert.rejects(()=>timeout.start({}),/timeout/);
});

for(const [locale,loadMessage,paymentMessage] of [
 ['es','No hemos podido cargar las fechas. Vuelve a intentarlo o escríbenos por WhatsApp.','No se pudo abrir el pago. Vuelve a intentar.'],
 ['en',"We couldn't load the dates. Try again or message us on WhatsApp.",'Unable to open payment. Please retry.'],
 ['ca','No hem pogut carregar les dates. Torna-ho a provar o escriu-nos per WhatsApp.','No s’ha pogut obrir el pagament. Torna-ho a provar.']
])test(`Date-loading 503 shows dates and WhatsApp; checkout 503 keeps payment copy (${locale})`,async()=>{
 const original={document:globalThis.document,sessionStorage:globalThis.sessionStorage};const calls=[];
 const retry={};const root={dataset:{experience:'modelado'},contains:()=>false,setAttribute(){},removeAttribute(){},querySelector:selector=>selector==='button'?retry:null};
 const formError={hidden:true,textContent:''},close={},pay={};
 const form={elements:{name:{value:'Example Guest'},email:{value:'example@example.com'}},reportValidity:()=>true,querySelector:()=>pay};
 const dialog={querySelector:selector=>selector==='form'?form:selector==='[data-close]'?close:formError};
 globalThis.document={documentElement:{lang:locale},activeElement:null,querySelectorAll:()=>[]};globalThis.sessionStorage=memory();
 try{
  const widget=new GuestWidget(root,validateConfig(raw,location));
  widget.api=new GuestApi(widget.config,async(url,options)=>{calls.push({url,method:options.method||'GET'});return {ok:false,status:503,json:async()=>({data:null,error:{code:'provider_unavailable'}})};});
  await widget.load();
  const alert=root.innerHTML.match(/<p role="alert">([\s\S]*?)<\/p>/)?.[1];assert.ok(alert,'Load failure renders an alert');
  assert.equal(alert.replace(/<[^>]+>/g,'').replace(/&#39;/g,"'"),loadMessage);
  assert.match(alert,/<a href="https:\/\/wa.me\/34711552030"[^>]*>WhatsApp<\/a>/);assert.match(root.innerHTML,/data-action="load"/);assert.equal(typeof retry.onclick,'function');
  widget.sessions=[session];widget.selectedId=session.id;widget.dialog=dialog;await widget.submit();
  assert.equal(formError.textContent,paymentMessage);assert.equal(formError.hidden,false);assert.equal(widget.busy,false);assert.equal(pay.disabled,false);
  assert.deepEqual(calls.map(call=>call.method),['GET','POST']);assert.ok(calls[0].url.includes('/guest-sessions?'));assert.ok(calls[1].url.endsWith('/guest-checkouts'));
 }finally{for(const [key,value] of Object.entries(original)){if(value===undefined)delete globalThis[key];else globalThis[key]=value;}}
});

test('Cancellation policy gives 24-hour free cancellation in every locale',()=>{
 const original={document:globalThis.document,sessionStorage:globalThis.sessionStorage};
 const expected={
  es:'Cancelación gratuita hasta 24 horas antes de la clase. Tu pieza estará lista para recoger unos 15 días después.',
  en:'Free cancellation up to 24 hours before the class. Your piece will be ready to collect about 15 days later.',
  ca:'Cancel·lació gratuïta fins a 24 hores abans de la classe. La teva peça estarà llesta per recollir uns 15 dies després.'
 };
 try{
  globalThis.sessionStorage=memory();
  for(const [locale,answer] of Object.entries(expected)){
   globalThis.document={documentElement:{lang:locale},querySelectorAll:()=>[]};
   const root={dataset:{experience:'modelado'},setAttribute(){},removeAttribute(){},querySelector(){return null;}};
   const policy=new GuestWidget(root,validateConfig(raw,location)).c.policy;
   assert.equal(policy,answer);
   assert.match(policy,/24/);
   assert.doesNotMatch(policy,/pendiente|must be confirmed|s’han de confirmar/i);
   for(const name of ['modelado.html','torno.html']){
    const page=readFileSync(resolve(dirname(fileURLToPath(import.meta.url)),`../${locale==='es'?'':locale+'/'}experiencias/${name}`),'utf8');
    assert.ok(page.includes(`<p>${answer}</p></details>`),`${locale}/${name}`);
   }
  }
 }finally{globalThis.document=original.document;globalThis.sessionStorage=original.sessionStorage;}
});

test('WhatsApp experiences read calendar only, filter 15 EUR, and render no payment action',async()=>{
 const {publicSessions,whatsappRequestUrl}=await import('../js/experience-booking.js');
 const config=validateConfig({...raw,bookingFlow:'whatsapp',experiences:{modelado:{classTypeIds:['modelado'],expectedUnitPriceCents:4500}}},location);
 assert.ok(config);
 const wrong={...session,id:'manual',unitPriceCents:1500};
 assert.deepEqual(publicSessions([session,wrong,{...session,id:'full',remainingSeats:0}],config.experiences.modelado).map(s=>s.id),['s1']);
 for(const locale of ['es','en','ca','pt']){
  const message=new URL(whatsappRequestUrl(session,2,locale,'modelado')).searchParams.get('text');
  assert.match(message,/2026-10-25/);assert.match(message,/02:30/);assert.match(message,/2 /);
 }
 const original={document:globalThis.document,sessionStorage:globalThis.sessionStorage};const calls=[];
 const root={dataset:{experience:'modelado'},contains:()=>false,setAttribute(){},removeAttribute(){},querySelector:()=>null,querySelectorAll:()=>[]};
 globalThis.document={documentElement:{lang:'es'},activeElement:null,querySelectorAll:()=>[]};globalThis.sessionStorage=memory();
 try{
  const widget=new GuestWidget(root,config);widget.month='2026-10';
  widget.api=new GuestApi(config,async(url,options)=>{calls.push({url,method:options.method||'GET'});return{ok:true,json:async()=>({data:{sessions:[session,wrong]},error:null})};});
  await widget.init();assert.deepEqual(calls.map(c=>c.method),['GET']);assert.match(calls[0].url,/calendar-sessions\?from=/);
  assert.equal(globalThis.sessionStorage.getItem('lamesa.guest.booking.v1'),undefined);
  assert.match(root.innerHTML,/wa.me\/34711552030\?text=/);assert.doesNotMatch(root.innerHTML,/data-action="checkout"|guest-dialog|15,00|15\.00/);
 }finally{globalThis.document=original.document;globalThis.sessionStorage=original.sessionStorage;}
});

test('WhatsApp ignores a saved payment intent even when storage writes fail',async()=>{
 const config=validateConfig({...raw,bookingFlow:'whatsapp',experiences:{modelado:{classTypeIds:['modelado'],expectedUnitPriceCents:4500}}},location);
 const original={document:globalThis.document,sessionStorage:globalThis.sessionStorage};const calls=[];let reads=0,writes=0;
 const saved=JSON.stringify({intent:{experience:'modelado',sessionId:'old',quantity:3,date:'2020-01-01',locale:'en'},attempt});
 const root={dataset:{experience:'modelado'},contains:()=>false,setAttribute(){},removeAttribute(){},querySelector:()=>null,querySelectorAll:()=>[]};
 globalThis.document={documentElement:{lang:'es'},activeElement:null,querySelectorAll:()=>[]};
 globalThis.sessionStorage={getItem(){reads++;return saved;},setItem(){writes++;throw new Error('storage_unavailable');}};
 try{
  const widget=new GuestWidget(root,config);const currentMonth=civilDate(Date.now()).slice(0,7);
  assert.equal(widget.month,currentMonth);assert.equal(widget.quantity,1);assert.equal(widget.selectedId,undefined);assert.equal(widget.store,null);
  widget.api=new GuestApi(config,async(url,options)=>{calls.push({url,method:options.method||'GET'});return{ok:true,json:async()=>({data:{sessions:[session]},error:null})};});
  await widget.init();assert.equal(widget.month,currentMonth);assert.deepEqual(widget.sessions.map(s=>s.id),['s1']);
  assert.deepEqual(calls.map(c=>c.method),['GET']);assert.match(calls[0].url,/calendar-sessions\?from=/);
  assert.equal(reads,0);assert.equal(writes,0);assert.doesNotMatch(root.innerHTML,/data-action="checkout"|guest-dialog/);
 }finally{globalThis.document=original.document;globalThis.sessionStorage=original.sessionStorage;}
});

test('WhatsApp boot and calendar load work when sessionStorage access throws',async()=>{
 const config=validateConfig({...raw,bookingFlow:'whatsapp',experiences:{modelado:{classTypeIds:['modelado'],expectedUnitPriceCents:4500}}},location);
 const original={document:globalThis.document,window:globalThis.window,storage:Object.getOwnPropertyDescriptor(globalThis,'sessionStorage')};let accesses=0;
 const root={dataset:{experience:'modelado'},contains:()=>false,setAttribute(){},removeAttribute(){},querySelector:()=>null,querySelectorAll:()=>[]};
 globalThis.document={documentElement:{lang:'es'},body:{dataset:{}},activeElement:null,querySelectorAll:()=>[]};
 globalThis.window={LA_MESA_GUEST_BOOKING:config,location};
 Object.defineProperty(globalThis,'sessionStorage',{configurable:true,get(){accesses++;throw new Error('SecurityError');}});
 try{
  assert.doesNotThrow(()=>boot());
  const widget=new GuestWidget(root,config);widget.api=new GuestApi(config,async()=>({ok:true,json:async()=>({data:{sessions:[session]},error:null})}));
  await widget.init();assert.deepEqual(widget.sessions.map(s=>s.id),['s1']);assert.match(root.innerHTML,/wa.me\/34711552030\?text=/);
  assert.equal(accesses,0);
 }finally{
  globalThis.document=original.document;globalThis.window=original.window;
  if(original.storage)Object.defineProperty(globalThis,'sessionStorage',original.storage);else delete globalThis.sessionStorage;
 }
});

test('WhatsApp experience failure still offers contact without legacy requests or storage writes',async()=>{
 const config=validateConfig({...raw,bookingFlow:'whatsapp',experiences:{modelado:{classTypeIds:['modelado'],expectedUnitPriceCents:4500}}},location);
 const original={document:globalThis.document,sessionStorage:globalThis.sessionStorage};const calls=[];
 const root={dataset:{experience:'modelado'},contains:()=>false,setAttribute(){},removeAttribute(){},querySelector:selector=>selector==='button'?{}:null,querySelectorAll:()=>[]};
 globalThis.document={documentElement:{lang:'en'},activeElement:null,querySelectorAll:()=>[]};globalThis.sessionStorage=memory();
 try{const widget=new GuestWidget(root,config);widget.api=new GuestApi(config,async(url,options)=>{calls.push({url,method:options.method||'GET'});throw new Error('network');});await widget.init();
 assert.deepEqual(calls.map(c=>c.method),['GET']);assert.match(calls[0].url,/calendar-sessions\?from=/);assert.match(root.innerHTML,/href="https:\/\/wa.me\/34711552030"/);assert.equal(globalThis.sessionStorage.getItem('lamesa.guest.booking.v1'),undefined);
 }finally{globalThis.document=original.document;globalThis.sessionStorage=original.sessionStorage;}
});
