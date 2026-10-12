import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {validateConfig,GuestApi} from '../js/experience-booking.js';
import {turnLabel,visibleTurns,CourseTurnsWidget,CourseApi,ConfirmView,readToken,boot} from '../js/course-turns.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const location={href:'http://127.0.0.1:8801/clases/semanal-torno.html',hostname:'127.0.0.1'};
const raw={enabled:true,mode:'sandbox',bookingFlow:'stripe',apiBase:'/api',studioSlug:'la-mesa',
 experiences:{modelado:{classTypeIds:['x']}},courses:{torno:{classTypeIds:['ct_torno']},modelado:{classTypeIds:['ct_TODO_mensile_modelado']}}};
const config=validateConfig(raw,location);
const turn={templateId:'tpl_1',classTypeId:'ct_torno',title:'Torno mensual',weekday:3,startTime:'16:00',durationMin:120,monthlyPriceCents:12000,nextSessionStartAt:'2026-10-14T14:00:00Z'};
const fakeRoot=()=>({html:'',listeners:{},set innerHTML(v){this.html=v;},get innerHTML(){return this.html;},addEventListener(n,h){this.listeners[n]=h;},querySelector(){return null;},contains(){return false;}});
const respond=(status,body)=>async()=>({ok:status<400,status,json:async()=>body});
const widgetWith=(fetcher,lang='es',course='torno',cfg=config)=>{
 const r=fakeRoot();const w=new CourseTurnsWidget(r,cfg,course,lang);w.api=new CourseApi(cfg,fetcher);return {r,w};
};
const calls=[];
const recorder=(map)=>async(url,options={})=>{calls.push({url,options});const key=Object.keys(map).find(k=>url.endsWith(k));const [status,body]=map[key];return {ok:status<400,status,json:async()=>body};};

test('turnLabel: giorno localizzato e fascia oraria da startTime + durationMin',()=>{
 assert.equal(turnLabel(turn,'es'),'Miércoles · 16:00–18:00');
 assert.equal(turnLabel(turn,'en'),'Wednesday · 16:00–18:00');
 assert.equal(turnLabel(turn,'ca'),'Dimecres · 16:00–18:00');
 assert.equal(turnLabel({...turn,weekday:1,startTime:'10:30:00',durationMin:90},'es'),'Lunes · 10:30–12:00');
});
test('visibleTurns filtra per classTypeIds del corso e ordina per giorno e ora',()=>{
 const list=visibleTurns([{...turn,templateId:'b',weekday:4},{...turn,templateId:'a'},{...turn,templateId:'z',classTypeId:'other'}],['ct_torno']);
 assert.deepEqual(list.map(t=>t.templateId),['a','b']);
 assert.throws(()=>visibleTurns({},['ct_torno']));
});
test('il box non mostra mai numeri di posti, nemmeno se l API li inviasse',async()=>{
 const {r,w}=widgetWith(respond(200,{data:{turns:[{...turn,remainingSeats:4242,seats:4243,capacity:4244}]},error:null}));
 await w.init();
 assert.match(r.html,/Miércoles · 16:00–18:00/);
 assert.doesNotMatch(r.html,/424[234]/);
 assert.doesNotMatch(r.html,/plazas?|seats?|places?|remaining|capacity|data-seats/i);
 assert.match(r.html,/El primer día pagas en el estudio el mes o la clase suelta/);
 assert.match(r.html,/https:\/\/wa\.me\/34711552030/);
});
test('lista vuota: solo WhatsApp, nessun form',async()=>{
 const {r,w}=widgetWith(respond(200,{data:{turns:[]},error:null}));await w.init();
 assert.match(r.html,/href="https:\/\/wa\.me\/34711552030[^"]*"/);assert.match(r.html,/Escríbenos por WhatsApp/);
 assert.doesNotMatch(r.html,/<form|data-turn=/);
});
test('errore API (rete, 404, 409 disabilitato): WhatsApp invece del form',async()=>{
 for(const fetcher of [async()=>{throw new Error('network');},respond(404,{data:null,error:{code:'not_found'}}),respond(409,{data:null,error:{code:'guest_checkout_disabled'}})]){
  const {r,w}=widgetWith(fetcher);await w.init();
  assert.match(r.html,/https:\/\/wa\.me\/34711552030/);assert.match(r.html,/role="alert"/);assert.doesNotMatch(r.html,/<form|data-turn=/);
 }
});
test('ID TODO in config: WhatsApp senza nessuna chiamata di rete',async()=>{
 let n=0;const {r,w}=widgetWith(async()=>{n++;throw new Error('no');},'es','modelado');
 await w.init();assert.equal(n,0);assert.match(r.html,/https:\/\/wa\.me\/34711552030/);assert.doesNotMatch(r.html,/<form|data-turn=/);
 const missing=widgetWith(async()=>{n++;},'es','torno',validateConfig({...raw,courses:undefined},location));await missing.w.init();assert.equal(n,0);assert.match(missing.r.html,/wa\.me/);
});
test('scelta turno mostra form nome/email/telefono facoltativo e avviso pagamento in studio',async()=>{
 const {r,w}=widgetWith(respond(200,{data:{turns:[turn]},error:null}));await w.init();w.selectTurn('tpl_1');
 assert.match(r.html,/<form/);assert.match(r.html,/name="name"[^>]*required/);assert.match(r.html,/name="email"[^>]*type="email"|type="email"[^>]*name="email"/);
 assert.match(r.html,/name="phone"/);assert.doesNotMatch(r.html,/name="phone"[^>]*required/);
 assert.match(r.html,/El primer día pagas en el estudio/);
});
test('invio richiesta: POST strict, telefono omesso se vuoto, poi stato "Revisa tu email"',async()=>{
 calls.length=0;
 const {r,w}=widgetWith(recorder({'course-turns':[200,{data:{turns:[turn]},error:null}],'course-first-lesson-requests':[202,{data:{status:'email_sent'},error:null}]}),'ca');
 await w.init();w.selectTurn('tpl_1');await w.submit({name:' Ana  ',email:'Ana@Example.com ',phone:''});
 const post=calls.find(c=>c.options.method==='POST');
 assert.ok(post.url.endsWith('/public/studios/la-mesa/course-first-lesson-requests'));
 const body=JSON.parse(post.options.body);
 assert.deepEqual(Object.keys(body).sort(),['email','idempotencyKey','locale','name','templateId']);
 assert.equal(body.name,'Ana');assert.equal(body.email,'ana@example.com');assert.equal(body.locale,'ca');assert.equal(body.templateId,'tpl_1');
 assert.match(body.idempotencyKey,/^[A-Za-z0-9_-]{16,128}$/);
 assert.match(r.html,/Revisa el teu email/);assert.doesNotMatch(r.html,/<form/);assert.match(r.html,/wa\.me/);
});
test('telefono valido viene inviato; chiave idempotente stabile nel retry e nuova se cambia email',async()=>{
 calls.length=0;let fail=true;
 const f=async(url,options={})=>{calls.push({url,options});if(url.endsWith('course-turns'))return {ok:true,json:async()=>({data:{turns:[turn]},error:null})};
  if(fail){fail=false;throw new Error('network');}return {ok:true,json:async()=>({data:{status:'email_sent'},error:null})};};
 const {w}=widgetWith(f);await w.init();w.selectTurn('tpl_1');
 const values={name:'Ana',email:'a@example.com',phone:'+34 600 000 000'};
 await w.submit(values);await w.submit(values);
 const posts=calls.filter(c=>c.options.method==='POST').map(c=>JSON.parse(c.options.body));
 assert.equal(posts[0].phone,'+34 600 000 000');assert.equal(posts[0].idempotencyKey,posts[1].idempotencyKey);
 const {w:w2}=widgetWith(f);await w2.init();w2.selectTurn('tpl_1');fail=true;await w2.submit(values);await w2.submit({...values,email:'other@example.com'});
 const p2=calls.filter(c=>c.options.method==='POST').slice(2).map(c=>JSON.parse(c.options.body));
 assert.notEqual(p2[0].idempotencyKey,p2[1].idempotencyKey);
});
test('validazione client: email o nome non validi non producono richieste',async()=>{
 calls.length=0;const {r,w}=widgetWith(recorder({'course-turns':[200,{data:{turns:[turn]},error:null}]}));await w.init();w.selectTurn('tpl_1');
 for(const bad of [{name:'',email:'a@b.co',phone:''},{name:'Ana',email:'nope',phone:''},{name:'Ana',email:'a@b.co',phone:'abc'}]){await w.submit(bad);assert.match(r.html,/class="guest-error"|role="alert"/);}
 assert.equal(calls.filter(c=>c.options.method==='POST').length,0);
});
test('errori del POST: turn_full, invalid_request, rate_limited, email_unavailable con messaggio e via WhatsApp',async()=>{
 const cases=[[409,'turn_full',/se ha llenado/],[422,'invalid_request',/Revisa/],[429,'rate_limited',/Demasiados/],[503,'email_unavailable',/WhatsApp/]];
 for(const [status,code,pattern] of cases){
  const {r,w}=widgetWith(recorder({'course-turns':[200,{data:{turns:[turn]},error:null}],'course-first-lesson-requests':[status,{data:null,error:{code}}]}));
  await w.init();w.selectTurn('tpl_1');await w.submit({name:'Ana',email:'a@b.co',phone:''});
  assert.match(r.html,pattern,code);assert.match(r.html,/wa\.me\/34711552030/,code);assert.doesNotMatch(r.html,/Revisa tu email/);
 }
});
test('testi en/ca e nessun "Tras el pago" nel widget',async()=>{
 const {r,w}=widgetWith(respond(200,{data:{turns:[turn]},error:null}),'en');await w.init();
 assert.match(r.html,/Wednesday · 16:00–18:00/);assert.match(r.html,/On the first day you pay at the studio/);
 const ca=widgetWith(respond(200,{data:{turns:[turn]},error:null}),'ca');await ca.w.init();assert.match(ca.r.html,/El primer dia pagues a l’estudi/);
});

// ---- pagina di conferma ----
test('readToken legge #t=, toglie il frammento con replaceState prima di ogni rete e non lo tocca nel DOM',()=>{
 const seen=[];const history={replaceState:(...a)=>seen.push(a)};
 const loc={hash:'#t=abc.DEF-123_x',pathname:'/clases/confirmar.html',search:''};
 assert.equal(readToken(loc,history),'abc.DEF-123_x');
 assert.deepEqual(seen,[[null,'','/clases/confirmar.html']]);
 assert.equal(readToken({hash:'',pathname:'/p',search:''},history),null);
 assert.equal(readToken({hash:'#other=1',pathname:'/p',search:'?a=1'},history),null);
 assert.equal(seen.at(-1)[2],'/p?a=1');
});
const confirmView=(lang,fetcher)=>{const r=fakeRoot();const v=new ConfirmView(r,config,lang);v.api=new CourseApi(config,fetcher);return {r,v};};
const confirmed={status:'confirmed',startAt:'2026-10-14T14:00:00Z',endAt:'2026-10-14T16:00:00Z',timezone:'Europe/Madrid',title:'Torno <mensual>'};
test('conferma: confirmed mostra titolo (escapato), data, orario e avviso pagamento; POST senza studio nel path',async()=>{
 calls.length=0;const {r,v}=confirmView('es',recorder({'verify':[200,{data:confirmed,error:null}]}));
 await v.run('TOKEN-SECRET');
 const post=calls[0];assert.ok(post.url.endsWith('/api/public/course-first-lesson/verify'));assert.deepEqual(JSON.parse(post.options.body),{token:'TOKEN-SECRET'});
 assert.match(r.html,/Torno &lt;mensual&gt;/);assert.match(r.html,/miércoles/i);assert.match(r.html,/16:00–18:00/);assert.match(r.html,/pagas en el estudio/);
 assert.doesNotMatch(r.html,/TOKEN-SECRET/);assert.equal(post.options.referrerPolicy,'no-referrer');
});
test('conferma: startAt/timezone malformati -> testo generico confermato, mai bloccata su Confirmando',async()=>{
 for(const bad of [{startAt:'non-una-data'},{timezone:'Mars/Olympus'},{startAt:null,endAt:undefined}]){
  const {r,v}=confirmView('es',recorder({'verify':[200,{data:{...confirmed,...bad},error:null}]}));
  await v.run('t');
  assert.match(r.html,/Primera clase confirmada/);assert.match(r.html,/pagas en el estudio/);
  assert.doesNotMatch(r.html,/Confirmando|Invalid|NaN/);assert.match(r.html,/wa\.me\/34711552030/);
 }
});
test('conferma: titolo malevolo dall API resta escapato nella vista confermata',async()=>{
 const evil='<img src=x onerror=alert(1)>';
 const {r,v}=confirmView('es',recorder({'verify':[200,{data:{...confirmed,title:evil},error:null}]}));await v.run('t');
 assert.doesNotMatch(r.html,/<img/);assert.match(r.html,/&lt;img src=x onerror=alert\(1\)&gt;/);
});
test('conferma: turn_full e contact_studio mostrano WhatsApp',async()=>{
 for(const [status,pattern] of [['turn_full',/se ha llenado/],['contact_studio',/Escríbenos/]]){
  const {r,v}=confirmView('es',recorder({'verify':[200,{data:{status},error:null}]}));await v.run('t');
  assert.match(r.html,pattern);assert.match(r.html,/wa\.me\/34711552030/);
 }
});
test('conferma: token assente, 410, 429 e rete mostrano messaggio + WhatsApp; token assente senza rete',async()=>{
 calls.length=0;const a=confirmView('en',recorder({}));await a.v.run(null);assert.equal(calls.length,0);assert.match(a.r.html,/wa\.me\/34711552030/);assert.match(a.r.html,/invalid or has expired/i);
 for(const [status,code,pattern] of [[410,'invalid_or_expired_token',/invalid or has expired/i],[429,'rate_limited',/Too many/],[500,'x',/WhatsApp/]]){
  const {r,v}=confirmView('en',recorder({'verify':[status,{data:null,error:{code}}]}));await v.run('t');assert.match(r.html,pattern);assert.match(r.html,/wa\.me\/34711552030/);
 }
 const n=confirmView('ca',async()=>{throw new Error('network');});await n.v.run('t');assert.match(n.r.html,/wa\.me/);
});
test('boot sulla pagina di conferma: legge il token, ripulisce l URL e non lo scrive in console',async()=>{
 const logged=[];const orig={log:console.log,error:console.error,warn:console.warn,info:console.info};
 for(const k of Object.keys(orig))console[k]=(...a)=>logged.push(a);
 const replaced=[];const r=fakeRoot();
 const doc={documentElement:{lang:'es'},querySelector:s=>s==='[data-course-confirm]'?r:null,querySelectorAll:()=>[]};
 try{
  await boot({document:doc,window:{LA_MESA_GUEST_BOOKING:raw},location:{...location,hash:'#t=SECRET-TOKEN-1',pathname:'/clases/confirmar.html',search:''},history:{replaceState:(...a)=>replaced.push(a)},fetcher:async()=>({ok:true,json:async()=>({data:confirmed,error:null})})});
 }finally{Object.assign(console,orig);}
 assert.deepEqual(replaced[0],[null,'','/clases/confirmar.html']);assert.match(r.html,/Torno/);
 assert.ok(!JSON.stringify(logged).includes('SECRET-TOKEN-1'));assert.ok(!r.html.includes('SECRET-TOKEN-1'));
});

// ---- CSS, config e pagine ----
test('aree di tocco >= 44px nel CSS del box turni',()=>{
 const css=read('css/experience-booking.css');
 for(const selector of ['.course-turn','.course-turns input','.course-turns__submit','.course-turns__wa','.course-turns__back']){
  const rule=css.split('}').find(block=>block.split('{')[0].split(',').map(s=>s.trim()).includes(selector));
  assert.ok(rule,selector);const m=/min-height:\s*(\d+)px/.exec(rule);assert.ok(m&&Number(m[1])>=44,selector);
 }
});
test('booking-config: corsi mensili con segnaposto TODO dichiarati solo li',()=>{
 const config=read('js/booking-config.js');assert.match(config,/courses:\s*\{/);
 assert.match(config,/ct_TODO_mensile_torno/);assert.match(config,/ct_TODO_mensile_modelado/);assert.match(config,/TODO/);
 for(const f of ['js/course-turns.js','js/experience-booking.js'])assert.doesNotMatch(read(f),/ct_TODO_mensile/);
});
for(const [lang,prefix] of [['es',''],['en','en/'],['ca','ca/']])for(const course of ['torno','modelado']){
 test(`${prefix}clases/semanal-${course}: aside #turnos, nessun CTA Mesana, testo pagamento in studio`,()=>{
  const s=read(`${prefix}clases/semanal-${course}.html`);
  assert.match(s,new RegExp(`<section id="turnos"[^>]*aria-labelledby="turnos-title"[^>]*data-course="${course}"`));
  assert.doesNotMatch(s,/turno-grid|data-standard-booking|app\.mesana\.studio\/book/);
  assert.doesNotMatch(s,/Tras el pago|After payment|Després del pagament/);
  assert.match(s,/booking-config\.js\?v=8/);assert.match(s,/type="module" src="[^"]*course-turns\.js\?v=1"/);assert.match(s,/experience-booking\.css\?v=3/);
  assert.match(s,{es:/el primer día pagas en el estudio el mes o la clase suelta/i,en:/on the first day you pay at the studio for the full month or the single class/i,ca:/el primer dia pagues a l’estudi el mes o la classe solta/i}[lang]);
 });
}
for(const prefix of ['','en/','ca/'])test(`${prefix}clases/confirmar.html: noindex, no-referrer, senza analytics, ancora WhatsApp`,()=>{
 const s=read(`${prefix}clases/confirmar.html`);
 assert.match(s,/name="robots" content="noindex,nofollow"/);assert.match(s,/name="referrer" content="no-referrer"/);
 assert.match(s,/data-course-confirm/);assert.match(s,/course-turns\.js\?v=1/);assert.match(s,/booking-config\.js\?v=8/);
 assert.doesNotMatch(s,/googletagmanager|Cookiebot/);assert.match(s,/wa\.me\/34711552030/);
});

test('S5 fix1: ID segnaposto -> stato neutro (non loadFailed, non alert) con WhatsApp; errore API reale resta loadFailed',async()=>{
 const {r,w}=widgetWith(async()=>{throw new Error('no');},'es','modelado');await w.init();
 assert.match(r.html,/Reserva tu turno por WhatsApp: te contamos los días y horarios disponibles\./);
 assert.doesNotMatch(r.html,/No hemos podido cargar|role="alert"/);assert.match(r.html,/wa\.me\/34711552030/);
 const en=widgetWith(async()=>{throw new Error('no');},'en','modelado');await en.w.init();assert.match(en.r.html,/Book your slot on WhatsApp/);
 const ca=widgetWith(async()=>{throw new Error('no');},'ca','modelado');await ca.w.init();assert.match(ca.r.html,/Reserva el teu torn per WhatsApp/);
 const real=widgetWith(async()=>{throw new Error('network');});await real.w.init();assert.match(real.r.html,/No hemos podido cargar los turnos/);
});
test('S5 fix3: telefono senza attributo pattern; fix5: turni senza aria-pressed',async()=>{
 const {r,w}=widgetWith(respond(200,{data:{turns:[turn]},error:null}));await w.init();
 assert.doesNotMatch(r.html,/aria-pressed/);
 w.selectTurn('tpl_1');assert.match(r.html,/name="phone"/);assert.doesNotMatch(r.html,/pattern=/);
});
test('S5 fix4: ConfirmView 429 ha titolo proprio; errore generico non dice "link non valido"',async()=>{
 for(const [lang,re] of [['es',/<h1[^>]*>Demasiados intentos, prueba en unos minutos/],['en',/<h1[^>]*>Too many attempts, try again in a few minutes/],['ca',/<h1[^>]*>Massa intents, prova-ho en uns minuts/]]){
  const {r,v}=confirmView(lang,recorder({'verify':[429,{data:null,error:{code:'rate_limited'}}]}));await v.run('t');assert.match(r.html,re);assert.doesNotMatch(r.html,/<h1[^>]*>(El enlace no es|This link is invalid|L’enllaç no és)/);
 }
 const g=confirmView('es',async()=>{throw new Error('network');});await g.v.run('t');assert.doesNotMatch(g.r.html,/<h1[^>]*>El enlace no es válido/);
 const r2=fakeRoot();const doc={documentElement:{lang:'es'},querySelector:s=>s==='[data-course-confirm]'?r2:null,querySelectorAll:()=>[]};
 await boot({document:doc,window:{},location:{...location,hash:'#t=abc',pathname:'/p',search:''},history:{replaceState(){}}});
 assert.doesNotMatch(r2.html,/<h1[^>]*>El enlace no es válido/);assert.match(r2.html,/wa\.me/);
});
test('S5 fix6: nome/email/telefono digitati sopravvivono a "Cambiar de turno"',async()=>{
 const {r,w}=widgetWith(respond(200,{data:{turns:[turn]},error:null}));await w.init();w.selectTurn('tpl_1');
 for(const [name,value] of [['name','Ana'],['email','ana@x.es'],['phone','+34 600 000 000']])r.listeners.input({target:{name,value}});
 w.selectTurn(null);w.selectTurn('tpl_1');
 assert.match(r.html,/value="Ana"/);assert.match(r.html,/value="ana@x\.es"/);assert.match(r.html,/value="\+34 600 000 000"/);
});
for(const [lang,prefix,re] of [['es','',/Reserva tu primera clase en el turno que prefieras; el primer día pagas en el estudio el mes o la clase suelta\./],['en','en/',/Book your first class in the slot you prefer; on the first day you pay at the studio for the full month or the single class\./],['ca','ca/',/Reserva la primera classe al torn que prefereixis; el primer dia pagues a l’estudi el mes o la classe solta\./]])for(const course of ['torno','modelado'])
 test(`S5 fix7: ${prefix}clases/semanal-${course}: banner allineato al flusso prima lezione`,()=>{
  const s=read(`${prefix}clases/semanal-${course}.html`);assert.match(s,re);assert.doesNotMatch(s,/plaza fija en este turno|fixed spot in this class|plaça fixa en aquest torn/);
 });
test('S5 fix5: pagina conferma senza aria-live duplicato; workflow include standard-booking-links',()=>{
 for(const p of ['clases/confirmar.html','en/clases/confirmar.html','ca/clases/confirmar.html'])assert.doesNotMatch(read(p),/aria-live/);
 assert.match(read('.github/workflows/site-check.yml'),/tests\/standard-booking-links\.test\.mjs/);
});
