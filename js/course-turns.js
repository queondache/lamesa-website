/* Corsi mensili: elenco turni da Mesana, prima lezione senza pagare e pagina di conferma.
   Riusa validateConfig e GuestApi di experience-booking.js; nessun numero di posti compare mai nel DOM. */
import {validateConfig,GuestApi} from './experience-booking.js?v=7';

const WA='https://wa.me/34711552030';
const LOCALES=['es','en','ca'];
const PHONE=/^\+?[0-9 ().-]{6,20}$/;
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX=80;
const COPY={
 es:{intl:'es-ES',title:'Elige tu turno',loading:'Buscando turnos…',
  empty:'Ahora mismo no hay turnos disponibles. Escríbenos por WhatsApp y lo resolvemos.',
  loadFailed:'No hemos podido cargar los turnos. Escríbenos por WhatsApp.',
  wa:'Escríbenos por WhatsApp',notice:'El primer día pagas en el estudio el mes o la clase suelta.',
  name:'Tu nombre',email:'Email',phone:'Teléfono (opcional)',submit:'Pedir mi primera clase',busy:'Enviando…',back:'Cambiar de turno',
  chosen:'Tu primera clase será en este turno',sent:'Revisa tu email',
  sentNote:'Te hemos enviado un enlace para confirmar tu primera clase. Hasta que no lo pulses no hay nada reservado. Caduca en 30 minutos.',
  invalid:'Revisa tu nombre, email y teléfono.',full:'Este turno se ha llenado. Elige otro o escríbenos por WhatsApp.',
  rate:'Demasiados intentos. Espera unos minutos o escríbenos por WhatsApp.',
  unavailable:'La reserva online no está disponible ahora. Escríbenos por WhatsApp.',
  network:'No hemos podido enviar la solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.',
  waMessage:{torno:'Hola, quisiera apuntarme a la clase semanal de torno.',modelado:'Hola, quisiera apuntarme a la clase semanal de modelado.'},
  confirming:'Confirmando tu primera clase…',confirmed:'Primera clase confirmada',
  confirmedNote:'El primer día pagas en el estudio el mes o la clase suelta. Te hemos enviado un email con los detalles.',
  confirmFull:'El turno se ha llenado',confirmFullNote:'Mientras confirmabas, el turno se ha completado. No se ha reservado nada. Escríbenos y buscamos otra opción.',
  confirmInvalid:'El enlace no es válido o ha caducado',confirmInvalidNote:'Pide tu primera clase de nuevo desde la página del curso o escríbenos por WhatsApp.',
  confirmContact:'Escríbenos para terminar tu reserva',confirmContactNote:'No podemos confirmar tu primera clase automáticamente. Escríbenos por WhatsApp y lo resolvemos.',
  confirmRate:'Demasiados intentos. Espera unos minutos y vuelve a abrir el enlace, o escríbenos por WhatsApp.',
  confirmError:'No hemos podido confirmar tu clase ahora. Vuelve a abrir el enlace del email o escríbenos por WhatsApp.'},
 en:{intl:'en-GB',title:'Choose your slot',loading:'Looking for slots…',
  empty:'There are no slots available right now. Message us on WhatsApp and we will sort it out.',
  loadFailed:'We could not load the slots. Message us on WhatsApp.',
  wa:'Message us on WhatsApp',notice:'On the first day you pay at the studio for the full month or the single class.',
  name:'Your name',email:'Email',phone:'Phone (optional)',submit:'Request my first class',busy:'Sending…',back:'Change slot',
  chosen:'Your first class will be in this slot',sent:'Check your email',
  sentNote:'We have sent you a link to confirm your first class. Nothing is booked until you click it. It expires in 30 minutes.',
  invalid:'Check your name, email and phone.',full:'This slot has just filled up. Choose another or message us on WhatsApp.',
  rate:'Too many attempts. Wait a few minutes or message us on WhatsApp.',
  unavailable:'Online booking is not available right now. Message us on WhatsApp.',
  network:'We could not send your request. Try again or message us on WhatsApp.',
  waMessage:{torno:'Hello, I would like to join the weekly wheel-throwing class.',modelado:'Hello, I would like to join the weekly hand-building class.'},
  confirming:'Confirming your first class…',confirmed:'First class confirmed',
  confirmedNote:'On the first day you pay at the studio for the full month or the single class. We have emailed you the details.',
  confirmFull:'The slot has filled up',confirmFullNote:'While you were confirming, the slot became full. Nothing has been booked. Message us and we will find another option.',
  confirmInvalid:'This link is invalid or has expired',confirmInvalidNote:'Request your first class again from the course page or message us on WhatsApp.',
  confirmContact:'Message us to finish your booking',confirmContactNote:'We cannot confirm your first class automatically. Message us on WhatsApp and we will sort it out.',
  confirmRate:'Too many attempts. Wait a few minutes and open the link again, or message us on WhatsApp.',
  confirmError:'We could not confirm your class right now. Open the email link again or message us on WhatsApp.'},
 ca:{intl:'ca-ES',title:'Tria el teu torn',loading:'Buscant torns…',
  empty:'Ara mateix no hi ha torns disponibles. Escriu-nos per WhatsApp i ho resolem.',
  loadFailed:'No hem pogut carregar els torns. Escriu-nos per WhatsApp.',
  wa:'Escriu-nos per WhatsApp',notice:'El primer dia pagues a l’estudi el mes o la classe solta.',
  name:'El teu nom',email:'Email',phone:'Telèfon (opcional)',submit:'Demanar la meva primera classe',busy:'Enviant…',back:'Canviar de torn',
  chosen:'La teva primera classe serà en aquest torn',sent:'Revisa el teu email',
  sentNote:'T’hem enviat un enllaç per confirmar la teva primera classe. Fins que no el premis no hi ha res reservat. Caduca en 30 minuts.',
  invalid:'Revisa el nom, l’email i el telèfon.',full:'Aquest torn s’ha omplert. Tria’n un altre o escriu-nos per WhatsApp.',
  rate:'Massa intents. Espera uns minuts o escriu-nos per WhatsApp.',
  unavailable:'La reserva en línia no està disponible ara. Escriu-nos per WhatsApp.',
  network:'No hem pogut enviar la sol·licitud. Torna-ho a provar o escriu-nos per WhatsApp.',
  waMessage:{torno:'Hola, voldria apuntar-me a la classe setmanal de torn.',modelado:'Hola, voldria apuntar-me a la classe setmanal de modelat.'},
  confirming:'Confirmant la teva primera classe…',confirmed:'Primera classe confirmada',
  confirmedNote:'El primer dia pagues a l’estudi el mes o la classe solta. T’hem enviat un email amb els detalls.',
  confirmFull:'El torn s’ha omplert',confirmFullNote:'Mentre confirmaves, el torn s’ha completat. No s’ha reservat res. Escriu-nos i busquem una altra opció.',
  confirmInvalid:'L’enllaç no és vàlid o ha caducat',confirmInvalidNote:'Demana la primera classe de nou des de la pàgina del curs o escriu-nos per WhatsApp.',
  confirmContact:'Escriu-nos per acabar la reserva',confirmContactNote:'No podem confirmar la primera classe automàticament. Escriu-nos per WhatsApp i ho resolem.',
  confirmRate:'Massa intents. Espera uns minuts i torna a obrir l’enllaç, o escriu-nos per WhatsApp.',
  confirmError:'No hem pogut confirmar la classe ara. Torna a obrir l’enllaç de l’email o escriu-nos per WhatsApp.'}
};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pickLocale=lang=>LOCALES.includes(lang)?lang:'es';
const upperFirst=s=>s.charAt(0).toUpperCase()+s.slice(1);
const hhmm=minutes=>`${String(Math.floor(minutes/60)%24).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;

// Etichetta "Miércoles · 16:00–18:00": solo giorno e fascia oraria, mai posti.
export function turnLabel(turn,locale='es'){
 const copy=COPY[pickLocale(locale)];
 const day=new Intl.DateTimeFormat(copy.intl,{weekday:'long',timeZone:'UTC'}).format(new Date(Date.UTC(2026,0,4+turn.weekday)));
 const [h,m]=String(turn.startTime).split(':').map(Number);
 const start=h*60+m;
 return `${upperFirst(day)} · ${hhmm(start)}–${hhmm(start+turn.durationMin)}`;
}
export function visibleTurns(raw,classTypeIds){
 if(!Array.isArray(raw))throw new Error('invalid_response');
 return raw.filter(t=>classTypeIds.includes(t.classTypeId)).map(t=>{
  if(!t.templateId||!Number.isInteger(t.weekday)||t.weekday<1||t.weekday>7||!/^\d{2}:\d{2}/.test(t.startTime)||!Number.isInteger(t.durationMin)||t.durationMin<=0)throw new Error('invalid_response');
  // si copiano solo i campi necessari: eventuali numeri di posti non entrano nel modello della vista
  return {templateId:t.templateId,classTypeId:t.classTypeId,weekday:t.weekday,startTime:t.startTime,durationMin:t.durationMin};
 }).sort((a,b)=>a.weekday-b.weekday||a.startTime.localeCompare(b.startTime));
}
const hasPlaceholder=ids=>!Array.isArray(ids)||!ids.length||ids.some(id=>typeof id!=='string'||id.includes('TODO'));
const whatsappUrl=(copy,course)=>`${WA}?text=${encodeURIComponent(copy.waMessage[course]||copy.waMessage.torno)}`;
const waButton=(copy,course)=>`<a class="course-turns__wa" href="${whatsappUrl(copy,course)}" target="_blank" rel="noopener noreferrer">${copy.wa}</a>`;

export class CourseApi extends GuestApi{
 turns(){return this.request('course-turns');}
 requestFirstLesson(body){return this.request('course-first-lesson-requests',{method:'POST',body:JSON.stringify(body)});}
 // La verifica non e' legata a uno studio: il token da solo identifica la richiesta.
 async verify(token){
  const abort=new AbortController();const timer=setTimeout(()=>abort.abort(),this.config.timeoutMs||12000);
  try{
   const res=await this.fetcher(`${this.config.apiBase}/public/course-first-lesson/verify`,{method:'POST',body:JSON.stringify({token}),signal:abort.signal,cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json'}});
   const json=await res.json();if(!res.ok||json.error)throw new Error(json.error?.code||'network');return json.data;
  }catch(e){if(e.name==='AbortError')throw new Error('timeout');throw e;}finally{clearTimeout(timer);}
 }
}

export class CourseTurnsWidget{
 constructor(root,config,course,lang='es'){
  this.root=root;this.config=config;this.course=course;this.locale=pickLocale(lang);this.c=COPY[this.locale];
  this.api=new CourseApi(config);this.turns=[];this.selectedId=null;this.values={name:'',email:'',phone:''};this.error='';this.busy=false;this.sent=false;this.keyFor=null;this.key=null;
  this.root.addEventListener?.('click',e=>{
   const target=e.target?.closest?.('[data-turn],[data-action]');if(!target)return;
   if(target.dataset.turn)this.selectTurn(target.dataset.turn);
   else if(target.dataset.action==='back')this.selectTurn(null);
  });
  this.root.addEventListener?.('submit',e=>{
   e.preventDefault();const f=e.target.elements;
   this.submit({name:f.name.value,email:f.email.value,phone:f.phone.value});
  });
 }
 get ids(){return this.config.courses?.[this.course]?.classTypeIds;}
 shell(inner,{focus=false}={}){
  this.root.innerHTML=`<h2 id="turnos-title" tabindex="-1">${this.c.title}</h2>${inner}`;
  if(focus)this.root.querySelector?.('#turnos-title')?.focus?.({preventScroll:true});
 }
 fallback(message){this.shell(`<p role="alert" class="course-turns__msg">${escape(message)}</p>${waButton(this.c,this.course)}`);}
 async init(){
  // ID segnaposto: il corso mensile non e' ancora configurato, si va dritti a WhatsApp.
  if(hasPlaceholder(this.ids)){this.fallback(this.c.loadFailed);return;}
  this.shell(`<p role="status">${this.c.loading}</p>`);
  try{
   const data=await this.api.turns();
   this.turns=visibleTurns(data?.turns,this.ids);
  }catch{this.fallback(this.c.loadFailed);return;}
  if(!this.turns.length){this.fallback(this.c.empty);return;}
  this.render();
 }
 selectTurn(id){
  this.selectedId=id&&this.turns.some(t=>t.templateId===id)?id:null;this.error='';
  this.render({focus:true});
 }
 render({focus=false}={}){
  const notice=`<p class="course-turns__notice" role="note">${this.c.notice}</p>`;
  if(this.sent){this.shell(`<p role="status" class="course-turns__sent"><strong>${this.c.sent}</strong></p><p>${this.c.sentNote}</p>${notice}${waButton(this.c,this.course)}`,{focus:true});return;}
  const selected=this.turns.find(t=>t.templateId===this.selectedId);
  const error=this.error?`<p role="alert" class="guest-error">${escape(this.error)}</p>`:'';
  if(!selected){
   const list=this.turns.map(t=>`<li><button type="button" class="course-turn" data-turn="${escape(t.templateId)}" aria-pressed="false">${escape(turnLabel(t,this.locale))}</button></li>`).join('');
   this.shell(`<ul class="course-turns__list" role="list">${list}</ul>${error}${notice}${waButton(this.c,this.course)}`,{focus});
   return;
  }
  const v=this.values;
  this.shell(`<p class="course-turns__chosen">${this.c.chosen}: <strong>${escape(turnLabel(selected,this.locale))}</strong></p>
<form novalidate>
<label for="ct-name">${this.c.name}</label><input id="ct-name" name="name" type="text" autocomplete="name" maxlength="${NAME_MAX}" required value="${escape(v.name)}">
<label for="ct-email">${this.c.email}</label><input id="ct-email" name="email" type="email" autocomplete="email" inputmode="email" maxlength="254" required value="${escape(v.email)}">
<label for="ct-phone">${this.c.phone}</label><input id="ct-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" pattern="\\+?[0-9 ().\\-]{6,20}" value="${escape(v.phone)}">
${error}${notice}
<button type="submit" class="course-turns__submit"${this.busy?' disabled':''}>${this.busy?this.c.busy:this.c.submit}</button>
</form>
<button type="button" class="course-turns__back" data-action="back">${this.c.back}</button>${waButton(this.c,this.course)}`,{focus});
 }
 message(code){
  return ({turn_full:this.c.full,invalid_request:this.c.invalid,rate_limited:this.c.rate,email_unavailable:this.c.unavailable,guest_checkout_disabled:this.c.unavailable,not_found:this.c.unavailable})[code]||this.c.network;
 }
 // La chiave idempotente resta uguale nei retry dello stesso modulo e cambia se cambiano i dati.
 idempotencyKey(fingerprint){
  if(this.keyFor!==fingerprint||!this.key){
   const random=globalThis.crypto?.randomUUID?globalThis.crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
   this.key=random;this.keyFor=fingerprint;
  }
  return this.key;
 }
 async submit(values){
  if(this.busy||this.sent||!this.selectedId)return;
  const name=String(values.name||'').replace(/\s+/g,' ').trim();
  const email=String(values.email||'').trim().toLowerCase();
  const phone=String(values.phone||'').trim();
  this.values={name,email,phone};
  if(!name||name.length>NAME_MAX||email.length>254||!EMAIL.test(email)||(phone&&!PHONE.test(phone))){this.error=this.c.invalid;this.render();return;}
  this.busy=true;this.error='';this.render();
  const body={templateId:this.selectedId,name,email,locale:this.locale,idempotencyKey:this.idempotencyKey([this.selectedId,name,email,phone].join('\u0000'))};
  if(phone)body.phone=phone;
  try{
   await this.api.requestFirstLesson(body);
   this.sent=true;this.busy=false;this.values={name:'',email:'',phone:''};this.render();
  }catch(e){
   this.busy=false;
   if(e.message==='turn_full'){this.selectedId=null;this.turns=this.turns.filter(t=>t.templateId!==body.templateId);}
   this.error=this.message(e.message);
   if(!this.turns.length){this.fallback(this.error);return;}
   this.render();
  }
 }
}

// Il token vive nel frammento: si legge una volta e si toglie subito dalla barra degli indirizzi.
export function readToken(location,history){
 const match=/^#?t=([^&]+)/.exec(location.hash||'');
 let token=null;
 if(match){try{token=decodeURIComponent(match[1]);}catch{token=null;}}
 if(location.hash)history.replaceState(null,'',location.pathname+(location.search||''));
 return token;
}

export class ConfirmView{
 constructor(root,config,lang='es'){this.root=root;this.config=config;this.locale=pickLocale(lang);this.c=COPY[this.locale];this.api=new CourseApi(config);}
 show(title,note,{wa=true,extra=''}={}){
  this.root.innerHTML=`<h1 id="confirm-title" tabindex="-1">${escape(title)}</h1>${extra}<p>${escape(note)}</p>${wa?`<a class="course-turns__wa" href="${WA}" target="_blank" rel="noopener noreferrer">${this.c.wa}</a>`:''}`;
  this.root.querySelector?.('#confirm-title')?.focus?.({preventScroll:true});
 }
 async run(token){
  if(!token){this.show(this.c.confirmInvalid,this.c.confirmInvalidNote);return;}
  this.root.innerHTML=`<p role="status">${this.c.confirming}</p>`;
  let result;
  try{result=await this.api.verify(token);}
  catch(e){
   if(e.message==='invalid_or_expired_token')this.show(this.c.confirmInvalid,this.c.confirmInvalidNote);
   else if(e.message==='rate_limited')this.show(this.c.confirmInvalid,this.c.confirmRate);
   else this.show(this.c.confirmInvalid,this.c.confirmError);
   return;
  }
  if(result?.status==='confirmed')this.confirmed(result);
  else if(result?.status==='turn_full')this.show(this.c.confirmFull,this.c.confirmFullNote);
  else this.show(this.c.confirmContact,this.c.confirmContactNote);
 }
 confirmed(r){
  // Date o fuso malformati non devono mai lasciare la pagina su "Confirmando…": testo generico.
  let summary='';
  try{
   const tz=r.timezone||'Europe/Madrid';
   const day=new Intl.DateTimeFormat(this.c.intl,{dateStyle:'full',timeZone:tz}).format(new Date(r.startAt));
   const time=d=>new Intl.DateTimeFormat(this.c.intl,{hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZone:tz}).format(new Date(d));
   summary=`<p class="course-turns__summary"><strong>${escape(r.title)}</strong><br>${escape(upperFirst(day))} · ${time(r.startAt)}–${time(r.endAt)}</p>`;
  }catch{summary='';}
  this.show(this.c.confirmed,this.c.confirmedNote,{extra:summary});
 }
}

// env serve ai test; in pagina si usano i globali del browser.
export async function boot(env={}){
 const doc=env.document||(typeof document!=='undefined'?document:null);
 const win=env.window||(typeof window!=='undefined'?window:null);
 const loc=env.location||(typeof location!=='undefined'?location:null);
 const hist=env.history||(typeof history!=='undefined'?history:null);
 if(!doc||!win||!loc)return;
 const confirmRoot=doc.querySelector('[data-course-confirm]');
 // Il token si legge e si toglie dall'URL prima di qualsiasi altra operazione.
 const token=confirmRoot?readToken(loc,hist):null;
 const config=validateConfig(win.LA_MESA_GUEST_BOOKING,loc);
 const lang=doc.documentElement.lang;
 if(confirmRoot){
  const view=new ConfirmView(confirmRoot,config||{apiBase:'',studioSlug:''},lang);
  if(!config){view.show(view.c.confirmInvalid,view.c.confirmError);return;}
  if(env.fetcher)view.api=new CourseApi(config,env.fetcher);
  await view.run(token);return;
 }
 const roots=[...doc.querySelectorAll('[data-course]')];
 await Promise.all(roots.map(async root=>{
  const course=root.dataset.course;
  const widget=new CourseTurnsWidget(root,config||{courses:{}},course,lang);
  if(config&&env.fetcher)widget.api=new CourseApi(config,env.fetcher);
  if(!config){widget.fallback(widget.c.loadFailed);return;}
  await widget.init();
 }));
}
if(typeof window!=='undefined'&&typeof document!=='undefined')boot();
