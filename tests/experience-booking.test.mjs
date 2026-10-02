import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateConfig,paymentUrl,civilDate,sessionsFor,validAttempt,calendarIcs,BookingStorage,GuestApi} from '../js/experience-booking.js';
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
