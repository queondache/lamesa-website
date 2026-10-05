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
const tab=kind=>({kind,attrs:{'data-kind':kind},getAttribute(name){return this.attrs[name];},setAttribute(name,value){this.attrs[name]=value;},addEventListener(){}});
function root(){
 const body={html:'',set innerHTML(value){this.html=value;},get innerHTML(){return this.html;},querySelector(){return null;},querySelectorAll(){return[];}};
 return{body,tabs:[tab('mesa'),tab('torno')],getAttribute(name){return({'data-default':'mesa','data-price-mesa':'45','data-price-torno':'65'})[name]||null;},querySelector(selector){return selector==='.mini-booking__body'?body:null;},querySelectorAll(selector){return selector==='[data-kind]'?this.tabs:[];}};
}
function widget({config=prod,fetcher,lang='es',location=page,storage=memory()}={}){
 return new MiniBooking(root(),{config,fetcher,lang,location,storage});
}

test('disabled configuration preserves the v2 feed and booking link',async()=>{
 const calls=[];const w=widget({config:{...prod,enabled:false},fetcher:async(url)=>{calls.push(url);return response({data:{slots:[{id:'legacy-1',date:'2099-05-10',startTime:'18:00',available:2,price:45,serviceCategory:'ceramica'}]}});}});
 await w.load();w.date='2099-05-10';w.slotId='legacy-1';w.render();
 assert.equal(w.mode,'v2');assert.deepEqual(calls,['https://la-mesa-v2-backend.onrender.com/bookings/public-slots?service=suelta&days=90']);
 assert.match(w.body.innerHTML,/https:\/\/app\.lamesabcn\.com\/book\.html\?slot_id=legacy-1/);
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

function legacyMarkup(lang){
 const copy={
  es:{note:'2 horas · todos los niveles',per:'por persona',date:'Elige tu fecha',time:'Elige la hora',seats:'plazas',book:'Continuar a la reserva',prev:'Mes anterior',next:'Mes siguiente',available:'disponible',unavailable:'no disponible',pay:'Pago seguro con tarjeta · sin crear una cuenta'},
  en:{note:'2 hours · all levels',per:'per person',date:'Choose your date',time:'Choose the time',seats:'places',book:'Continue to booking',prev:'Previous month',next:'Next month',available:'available',unavailable:'unavailable',pay:'Secure card payment · no account needed'},
  ca:{note:'2 hores · tots els nivells',per:'per persona',date:'Tria la data',time:'Tria l’hora',seats:'places',book:'Continua a la reserva',prev:'Mes anterior',next:'Mes següent',available:'disponible',unavailable:'no disponible',pay:'Pagament segur amb targeta · sense crear un compte'},
  pt:{note:'2 horas · todos os níveis',per:'por pessoa',date:'Escolha a sua data',time:'Escolha o horário',seats:'vagas',book:'Continuar para a reserva',prev:'Mês anterior',next:'Mês seguinte',available:'disponível',unavailable:'indisponível',pay:'Pagamento seguro com cartão · sem criar conta'}
 }[lang];
 let cells='';for(let i=0;i<7;i++)cells+='<span class="mini-booking__weekday">'+new Intl.DateTimeFormat(lang,{weekday:'narrow',timeZone:'UTC'}).format(new Date(Date.UTC(2026,0,5+i)))+'</span>';cells+='<span></span>'.repeat((new Date(Date.UTC(2099,4,1)).getUTCDay()+6)%7);
 for(let day=1;day<=31;day++){const iso='2099-05-'+String(day).padStart(2,'0'),available=day===10,label=new Intl.DateTimeFormat(lang,{dateStyle:'long',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));cells+='<button type="button" class="mini-booking__day'+(available?' is-selected':'')+'" data-date="'+iso+'"'+(available?'':' disabled')+' aria-pressed="'+available+'" aria-label="'+label+' · '+(available?copy.available:copy.unavailable)+'">'+day+'</button>';}
 let monthLabel=new Intl.DateTimeFormat(lang,{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date('2099-05-01T12:00:00Z'));monthLabel=monthLabel.charAt(0).toUpperCase()+monthLabel.slice(1);
 return '<div class="mini-booking__price">'+(lang==='en'?'€45':'45 €')+'<small>'+copy.per+' · '+copy.note+'</small></div><h2 class="mini-booking__title">'+copy.date+'</h2><div class="mini-booking__month"><strong>'+monthLabel+'</strong><div><button type="button" data-month="-1" aria-label="'+copy.prev+'" disabled>‹</button><button type="button" data-month="1" aria-label="'+copy.next+'" disabled>›</button></div></div><div class="mini-booking__calendar" role="group" aria-label="'+copy.date+'">'+cells+'</div><div class="mini-booking__field">'+copy.time+'</div><div class="mini-booking__times" role="group" aria-label="'+copy.time+'"><button type="button" class="mini-booking__time is-selected" data-slot="legacy-1" aria-pressed="true">11:00<small>2 '+copy.seats+'</small></button></div><a class="mini-booking__cta" href="https://app.lamesabcn.com/book.html?slot_id=legacy-1" data-action="book">'+copy.book+' →</a><p class="mini-booking__note">'+copy.pay+'</p>';
}

test('v2 renders byte-for-byte legacy markup and booking link in every locale',async()=>{
 for(const lang of ['es','en','ca','pt']){const w=widget({config:{...prod,enabled:false},lang,fetcher:async()=>response({data:{slots:[{id:'legacy-1',date:'2099-05-10',startTime:'11:00:00',available:2,price:45,serviceCategory:'ceramica'}]}})});await w.load();w.date='2099-05-10';w.selectedId='legacy-1';w.render();assert.equal(w.body.innerHTML,legacyMarkup(lang),lang);}
});

test('untrusted session title and id are escaped before innerHTML',async()=>{
 const attack='<img src=x onerror=alert(1)>';const badId='"><svg/onload=alert(1)>';const w=widget({fetcher:async()=>response({data:{sessions:[session({id:badId,title:attack})]},error:null})});await w.load();w.date='2099-05-10';w.selectedId=badId;w.render();
 assert.ok(!w.body.innerHTML.includes(attack));assert.ok(!w.body.innerHTML.includes('"><svg'));assert.match(w.body.innerHTML,/&lt;img|&quot;&gt;&lt;svg/);
});

test('invalid allowedApiOrigins falls back to v2 and logs an error',async()=>{
 const errors=[];const calls=[];const invalid={...prod,allowedApiOrigins:['https://other.example']};const old=console.error;console.error=(...args)=>errors.push(args);
 try{assert.equal(bookingMode(invalid,page),'v2');const w=widget({config:invalid,fetcher:async(url)=>{calls.push(url);return response({data:{slots:[]}});}});await w.load();assert.match(calls[0],/public-slots/);assert.ok(errors.length>=1);}finally{console.error=old;}
});

test('all localized pages load shared config before the classic widget',()=>{
 for(const file of ['clases/suelta.html','en/clases/suelta.html','ca/clases/suelta.html','pt/clases/suelta.html']){const html=readFileSync(new URL(`../${file}`,import.meta.url),'utf8');assert.match(html,/booking-config\.js\?v=2[\s\S]*<script src="[^"]*mini-booking\.js\?v=2"[^>]*defer/);assert.doesNotMatch(html,/type="module" src="[^"]*mini-booking\.js/);}
});

test('browser script keeps v2 classic and uses no ES2022 syntax',()=>{
 const source=readFileSync(new URL('../js/mini-booking.js',import.meta.url),'utf8');assert.doesNotMatch(source,/^\s*import\s/m);assert.match(source,/import\(['"]\.\/experience-booking\.js['"]\)/);assert.doesNotMatch(source,/\.at\s*\(|\?\?=/);
});
