/* Guest booking progressive enhancement. Default OFF; no backend URL inferred. */
const KEY='lamesa.guest.booking.v1';
const LOOPBACK=new Set(['127.0.0.1','localhost','[::1]']);
const STATUSES=new Set(['pending','confirmed','failed','expired','paid_needs_staff']);
const COPY={
 es:{askWhatsapp:'Consultar por WhatsApp',requestOnly:'Las plazas son orientativas. La Mesa confirmará tu solicitud.',loading:'Buscando fechas…',loadFailed:'No hemos podido cargar las fechas. Vuelve a intentarlo o escríbenos por WhatsApp.',empty:'No hay fechas disponibles este mes.',retry:'Volver a intentar',date:'Elige tu fecha',time:'Elige la hora',people:'Personas',total:'Total',name:'Tu nombre',email:'Email de confirmación',pay:'Continuar al pago',busy:'Preparando el pago…',back:'Volver a las fechas',pending:'Estamos verificando tu pago.',pendingNote:'La vuelta del pago todavía no confirma la reserva. Espera la verificación.',check:'Comprobar estado',confirmed:'¡Nos vemos en La Mesa!',confirmedNote:'Tu reserva está confirmada por el sistema.',failed:'El pago no se ha completado.',expired:'La reserva ha caducado.',staff:'Tu pago necesita revisión del equipo.',staffNote:'Todavía no podemos confirmar tu plaza. Contacta con La Mesa antes de volver a pagar.',network:'No se pudo conectar. Vuelve a intentar: conservamos la misma solicitud.',capacity:'Esas plazas ya no están disponibles. Elige otro horario.',provider:'No se pudo abrir el pago. Vuelve a intentar.',unavailable:'La reserva online no está disponible.',invalid:'Revisa tu nombre y email.',mismatch:'El total actualizado por el sistema es',continue:'Continuar con el importe actualizado',calendar:'Añadir al calendario',secure:'Sin crear una cuenta',payments:'Tarjeta; Apple Pay y Google Pay si están disponibles en el pago seguro',sandbox:'SANDBOX LOCAL · fechas, plazas y pagos simulados. Sin cobros ni emails reales.',prev:'Mes anterior',next:'Mes siguiente',less:'Una persona menos',more:'Una persona más',available:'disponible',unavailableDay:'no disponible',cancelled:'Has vuelto sin completar el pago. Puedes elegir otra fecha.',resumeMissing:'No hay una reserva pendiente en este navegador.',choose:'Elegir otra fecha',resume:'Volver al pago',policy:'Cancelación gratuita hasta 24 horas antes de la clase. Tu pieza estará lista para recoger unos 15 días después.',currency:'por persona',seats:'plazas',timeout:'La conexión ha tardado demasiado. Reintenta la misma solicitud.',checkNote:'No cierres esta página mientras comprobamos el estado.'},
 en:{askWhatsapp:'Ask on WhatsApp',requestOnly:'Places are indicative. La Mesa will confirm your request.',loading:'Looking for dates…',loadFailed:"We couldn't load the dates. Try again or message us on WhatsApp.",empty:'No dates available this month.',retry:'Try again',date:'Choose your date',time:'Choose the time',people:'People',total:'Total',name:'Your name',email:'Confirmation email',pay:'Continue to payment',busy:'Preparing payment…',back:'Back to dates',pending:'We are verifying your payment.',pendingNote:'Returning from payment does not confirm a booking. Wait for verification.',check:'Check status',confirmed:'See you at La Mesa!',confirmedNote:'Your booking has been confirmed by the system.',failed:'Payment was not completed.',expired:'The reservation has expired.',staff:'Your payment needs staff assistance.',staffNote:'We cannot confirm your place yet. Contact La Mesa before paying again.',network:'Unable to connect. Retry: we keep the same request.',capacity:'Those places are no longer available. Choose another time.',provider:'Unable to open payment. Please retry.',unavailable:'Online booking is unavailable.',invalid:'Check your name and email.',mismatch:'The updated system total is',continue:'Continue with the updated amount',calendar:'Add to calendar',secure:'No account needed',payments:'Card; Apple Pay and Google Pay when available at secure checkout',sandbox:'LOCAL SANDBOX · simulated dates, places and payments. No real charges or emails.',prev:'Previous month',next:'Next month',less:'One person fewer',more:'One more person',available:'available',unavailableDay:'unavailable',cancelled:'You returned without completing payment. You can choose another date.',resumeMissing:'No pending booking in this browser.',choose:'Choose another date',resume:'Return to payment',policy:'Free cancellation up to 24 hours before the class. Your piece will be ready to collect about 15 days later.',currency:'per person',seats:'places',timeout:'The connection took too long. Retry the same request.',checkNote:'Keep this page open while we check the status.'},
 ca:{askWhatsapp:'Consultar per WhatsApp',requestOnly:'Les places són orientatives. La Mesa confirmarà la teva sol·licitud.',loading:'Buscant dates…',loadFailed:'No hem pogut carregar les dates. Torna-ho a provar o escriu-nos per WhatsApp.',empty:'No hi ha dates disponibles aquest mes.',retry:'Torna-ho a provar',date:'Tria la data',time:'Tria l’hora',people:'Persones',total:'Total',name:'El teu nom',email:'Email de confirmació',pay:'Continua al pagament',busy:'Preparant el pagament…',back:'Torna a les dates',pending:'Estem verificant el pagament.',pendingNote:'Tornar del pagament encara no confirma la reserva. Espera la verificació.',check:'Comprova l’estat',confirmed:'Ens veiem a La Mesa!',confirmedNote:'El sistema ha confirmat la reserva.',failed:'El pagament no s’ha completat.',expired:'La reserva ha caducat.',staff:'El teu pagament necessita revisió de l’equip.',staffNote:'Encara no podem confirmar la plaça. Contacta amb La Mesa abans de tornar a pagar.',network:'No s’ha pogut connectar. Torna-ho a provar: conservem la mateixa sol·licitud.',capacity:'Aquestes places ja no estan disponibles. Tria un altre horari.',provider:'No s’ha pogut obrir el pagament. Torna-ho a provar.',unavailable:'La reserva en línia no està disponible.',invalid:'Revisa el nom i l’email.',mismatch:'L’import actualitzat pel sistema és',continue:'Continua amb l’import actualitzat',calendar:'Afegeix al calendari',secure:'Sense crear un compte',payments:'Targeta; Apple Pay i Google Pay si estan disponibles al pagament segur',sandbox:'SANDBOX LOCAL · dates, places i pagaments simulats. Sense cobraments ni emails reals.',prev:'Mes anterior',next:'Mes següent',less:'Una persona menys',more:'Una persona més',available:'disponible',unavailableDay:'no disponible',cancelled:'Has tornat sense completar el pagament. Pots triar una altra data.',resumeMissing:'No hi ha cap reserva pendent en aquest navegador.',choose:'Tria una altra data',resume:'Torna al pagament',policy:'Cancel·lació gratuïta fins a 24 hores abans de la classe. La teva peça estarà llesta per recollir uns 15 dies després.',currency:'per persona',seats:'places',timeout:'La connexió ha trigat massa. Torna a intentar la mateixa sol·licitud.',checkNote:'No tanquis la pàgina mentre comprovem l’estat.'}
};
COPY.pt={...COPY.en,
 askWhatsapp:'Consultar pelo WhatsApp',requestOnly:'As vagas são indicativas. La Mesa confirmará o seu pedido.',loading:'Procurando datas…',loadFailed:'Não foi possível carregar as datas. Tente novamente ou escreva pelo WhatsApp.',empty:'Não há datas disponíveis este mês.',retry:'Tentar novamente',date:'Escolha a data',time:'Escolha o horário',people:'Pessoas',total:'Total',name:'Seu nome',email:'E-mail de confirmação',pay:'Continuar para o pagamento',busy:'Preparando o pagamento…',back:'Voltar às datas',
 pending:'Estamos verificando o seu pagamento.',pendingNote:'Voltar do pagamento ainda não confirma a reserva. Aguarde a verificação.',check:'Verificar estado',confirmed:'Até breve na La Mesa!',confirmedNote:'A sua reserva foi confirmada pelo sistema.',failed:'O pagamento não foi concluído.',expired:'A reserva expirou.',staff:'O pagamento precisa de revisão da equipe.',staffNote:'Ainda não podemos confirmar a vaga. Fale com a La Mesa antes de pagar novamente.',network:'Não foi possível conectar. Tente novamente: guardamos o mesmo pedido.',capacity:'Essas vagas já não estão disponíveis. Escolha outro horário.',provider:'Não foi possível abrir o pagamento. Tente novamente.',unavailable:'A reserva online não está disponível.',invalid:'Confira seu nome e e-mail.',
 calendar:'Adicionar ao calendário',secure:'Sem criar conta',payments:'Cartão; Apple Pay e Google Pay quando disponíveis no pagamento seguro',sandbox:'SANDBOX LOCAL · datas, vagas e pagamentos simulados. Sem cobranças ou e-mails reais.',prev:'Mês anterior',next:'Mês seguinte',less:'Uma pessoa a menos',more:'Mais uma pessoa',available:'disponível',unavailableDay:'indisponível',cancelled:'Você voltou sem concluir o pagamento. Pode escolher outra data.',resumeMissing:'Não há reserva pendente neste navegador.',choose:'Escolher outra data',resume:'Voltar ao pagamento',policy:'Cancelamento gratuito até 24 horas antes da aula. Sua peça estará pronta para retirada em cerca de 15 dias.',currency:'por pessoa',seats:'vagas',timeout:'A conexão demorou demais. Tente novamente com o mesmo pedido.',checkNote:'Mantenha esta página aberta enquanto verificamos o estado.'};
export function validateConfig(raw,location){
 if(!raw||raw.enabled!==true||typeof raw.apiBase!=='string'||!raw.studioSlug||!raw.experiences)return null;
 if(raw.bookingFlow!=='whatsapp'&&raw.bookingFlow!=='stripe')return null;
 const origin=new URL(location.href).origin;
 let api;try{api=new URL(raw.apiBase,origin);}catch{return null;}
 if(api.username||api.password||api.search||api.hash)return null;
 if(raw.mode==='sandbox'){
  if(!LOOPBACK.has(location.hostname)||api.origin!==origin||api.pathname!=='/api')return null;
 }else if(raw.mode==='production'){
  if(raw.releaseApproved!==true||api.protocol!=='https:'||!raw.allowedApiOrigins?.includes(api.origin))return null;
 }else return null;
 for(const experience of Object.values(raw.experiences))if(!Array.isArray(experience.classTypeIds)||!experience.classTypeIds.length||experience.classTypeIds.some(id=>typeof id!=='string'||!id))return null;
 if(Object.values(raw.experiences).some(e=>!Number.isInteger(e.expectedUnitPriceCents)||e.expectedUnitPriceCents<=0))return null;
 return {...raw,apiBase:api.href.replace(/\/$/,'')};
}
export function paymentUrl(value,config){
 const u=new URL(value);
 if(u.username||u.password)throw new Error('untrusted_payment');
 if(u.protocol==='https:'&&u.origin==='https://checkout.stripe.com')return u.href;
 if(config.mode==='sandbox'&&!u.hash&&u.protocol==='http:'&&u.origin==='http://127.0.0.1:8800')return u.href;
 throw new Error('untrusted_payment');
}
export function civilDate(value,timeZone='Europe/Madrid'){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(value));
 return ['year','month','day'].map(t=>parts.find(p=>p.type===t).value).join('-');
}
export function sessionsFor(raw,ids){
 if(!Array.isArray(raw))throw new Error('invalid_response');
 return raw.filter(s=>ids.includes(s.classTypeId)).map(s=>{
  if(!s.id||!s.title||!Number.isInteger(s.unitPriceCents)||s.unitPriceCents<=0||s.currency!=='EUR'||!Number.isInteger(s.remainingSeats)||s.remainingSeats<0||!Number.isFinite(Date.parse(s.startAt))||!Number.isFinite(Date.parse(s.endAt))||Date.parse(s.endAt)<=Date.parse(s.startAt)||s.timezone!=='Europe/Madrid')throw new Error('invalid_response');
  return s;
 }).sort((a,b)=>Date.parse(a.startAt)-Date.parse(b.startAt));
}
export function publicSessions(raw,experience){
 const selected=sessionsFor(raw,experience.classTypeIds);
 return selected.filter(s=>s.unitPriceCents===experience.expectedUnitPriceCents&&s.remainingSeats>0);
}
export function whatsappRequestUrl(session,quantity,locale='es',experience='modelado'){
 const date=civilDate(session.startAt,session.timezone);
 const time=new Intl.DateTimeFormat(locale,{hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZone:session.timezone}).format(new Date(session.startAt));
 const names={es:{modelado:'modelado',torno:'torno'},en:{modelado:'hand-building',torno:'pottery wheel'},ca:{modelado:'modelat',torno:'torn'},pt:{modelado:'modelagem',torno:'torno'}};
 const intro={es:'Hola, quisiera consultar disponibilidad para',en:'Hello, I would like to ask about availability for',ca:'Hola, voldria consultar disponibilitat per a',pt:'Olá, gostaria de consultar a disponibilidade para'};
 const people={es:'personas',en:'people',ca:'persones',pt:'pessoas'};
 const confirm={es:'¿Podéis confirmar la plaza?',en:'Could you confirm availability?',ca:'Podeu confirmar la plaça?',pt:'Podem confirmar a vaga?'};
 const language=names[locale]?locale:'es';
 const message=`${intro[language]} ${names[language][experience]||experience}: ${date}, ${time}, ${quantity} ${people[language]}. ${confirm[language]}`;
 return 'https://wa.me/34711552030?text='+encodeURIComponent(message);
}
export function validAttempt(a){
 if(!a||!a.attemptId||!STATUSES.has(a.status)||!Number.isInteger(a.quantity)||a.quantity<1||!Number.isInteger(a.totalCents)||a.totalCents<=0||a.currency!=='EUR'||!a.session?.id||!Number.isFinite(Date.parse(a.session.startAt))||!Number.isFinite(Date.parse(a.session.endAt))||a.session.timezone!=='Europe/Madrid')throw new Error('invalid_response');
 return a;
}
export function verifiedAttempt(raw,selected,quantity,experience,config){
 const attempt=validAttempt(raw);
 if(!selected||!experience||!publicSessions([selected],experience).length||!Number.isInteger(quantity)||quantity<1||quantity>Math.min(100,selected.remainingSeats)||attempt.session.id!==selected.id||(attempt.session.classTypeId&&attempt.session.classTypeId!==selected.classTypeId)||(attempt.session.unitPriceCents!==undefined&&attempt.session.unitPriceCents!==experience.expectedUnitPriceCents)||Date.parse(attempt.session.startAt)!==Date.parse(selected.startAt)||Date.parse(attempt.session.endAt)!==Date.parse(selected.endAt)||attempt.session.timezone!==selected.timezone||attempt.quantity!==quantity||attempt.totalCents!==experience.expectedUnitPriceCents*quantity)throw new Error('invalid_response');
 if(attempt.status==='pending'){
  if(!/^[A-Za-z0-9_-]{43}$/.test(attempt.accessToken||''))throw new Error('invalid_response');
  return {...attempt,checkoutUrl:paymentUrl(attempt.checkoutUrl,config)};
 }
 return attempt;
}
export function calendarIcs(attempt){
 if(attempt.status!=='confirmed')throw new Error('not_confirmed');
 const stamp=v=>new Date(v).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const esc=s=>s.replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//La Mesa//Guest booking//ES','X-WR-TIMEZONE:Europe/Madrid','BEGIN:VEVENT','UID:'+esc(attempt.attemptId)+'@lamesabcn.com','DTSTAMP:'+stamp(Date.now()),'DTSTART:'+stamp(attempt.session.startAt),'DTEND:'+stamp(attempt.session.endAt),'SUMMARY:'+esc(attempt.session.title),'LOCATION:'+esc('La Mesa, Carrer de l’Atlàntida 47, Barcelona'),'END:VEVENT','END:VCALENDAR',''].join('\r\n');
}
export async function intentFingerprint(input){
 const data=[input.sessionId,input.quantity,input.name.trim(),input.email.trim().toLowerCase(),input.locale].join('\u0000');
 const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(data));
 return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
export class BookingStorage{
 constructor(storage){this.storage=storage;}
 read(){try{return JSON.parse(this.storage.getItem(KEY)||'null')||{};}catch{return {};}}
 write(value){try{this.storage.setItem(KEY,JSON.stringify(value));}catch{throw new Error('storage_unavailable');}}
 intent(intent){this.write({...this.read(),intent});}
 async key(input){const fingerprint=await intentFingerprint(input);const state=this.read();if(state.fingerprint===fingerprint&&state.idempotencyKey)return state.idempotencyKey;const idempotencyKey=crypto.randomUUID();this.write({...state,fingerprint,idempotencyKey,attempt:null});return idempotencyKey;}
 attempt(attempt){this.write({...this.read(),attempt});}
 clearAttempt(){const s=this.read();delete s.attempt;delete s.fingerprint;delete s.idempotencyKey;this.write(s);}
 terminal(attempt){const s=this.read();delete s.fingerprint;delete s.idempotencyKey;s.attempt={...attempt};delete s.attempt.accessToken;this.write(s);}
}
export class GuestApi{
 constructor(config,fetcher=(...args)=>fetch(...args)){this.config=config;this.fetcher=fetcher;}
 async request(path,options={}){
  const abort=new AbortController();const timer=setTimeout(()=>abort.abort(),this.config.timeoutMs||12000);
  try{const res=await this.fetcher(`${this.config.apiBase}/public/studios/${encodeURIComponent(this.config.studioSlug)}/${path}`,{...options,signal:abort.signal,cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json',...options.headers}});const json=await res.json();if(!res.ok||json.error)throw new Error(json.error?.code||'network');return json.data;
  }catch(e){if(e.name==='AbortError')throw new Error('timeout');throw e;}finally{clearTimeout(timer);}
 }
 sessions(from,to){return this.request(`${this.config.bookingFlow==='whatsapp'?'calendar-sessions':'guest-sessions'}?from=${from}&to=${to}`);}
 start(input){return this.request('guest-checkouts',{method:'POST',body:JSON.stringify(input)});}
 status(a){return this.request(`guest-checkouts/${encodeURIComponent(a.attemptId)}`,{headers:{Authorization:`Bearer ${a.accessToken}`}});}
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function sessionDetails(session){
 if(!session)return '';
 let image='';
 if(typeof session.imageUrl==='string'){
  try{const url=new URL(session.imageUrl);if(url.protocol==='https:'&&!url.username&&!url.password)image=`<img src="${escape(url.href)}" alt="${escape(session.title)}" loading="lazy" style="max-width:100%;height:auto;border-radius:12px">`;}catch{}
 }
 const description=typeof session.description==='string'&&session.description.trim()?`<p>${escape(session.description)}</p>`:'';
 return image||description?`<div class="guest-session-details">${image}${description}</div>`:'';
}
const range=month=>{const [y,m]=month.split('-').map(Number);return {from:`${month}-01`,to:`${month}-${new Date(Date.UTC(y,m,0)).getUTCDate()}`};};
const addMonth=(month,n)=>{const[y,m]=month.split('-').map(Number);return new Date(Date.UTC(y,m-1+n,1)).toISOString().slice(0,7);};
const iconArrow='<span aria-hidden="true">→</span>';
export class GuestWidget{
 constructor(root,config){this.root=root;this.config=config;this.api=new GuestApi(config);this.locale=document.documentElement.lang in COPY?document.documentElement.lang:'es';this.c=COPY[this.locale];this.store=config.bookingFlow==='whatsapp'?null:new BookingStorage(sessionStorage);this.state=this.store?this.store.read():{};this.experience=root.dataset.experience;this.sessions=[];this.month=civilDate(Date.now()).slice(0,7);this.quantity=1;this.busy=false;this.timer=null;this.icsUrl=null;this.attempt=null;this.error='';this.loadSequence=0;this.selector=root.querySelector('.experience-nav');
  const intent=this.store?this.state.intent:null;
  if(intent?.experience===this.experience){this.store.intent({...intent,locale:this.locale});this.selectedId=intent.sessionId;this.quantity=intent.quantity||1;if(intent.date)this.month=intent.date.slice(0,7);}
  this.root.className='booking-preview guest-widget';this.root.removeAttribute('aria-labelledby');this.root.setAttribute('aria-label',this.c.date);
  document.querySelectorAll('.languages a').forEach(a=>a.addEventListener('click',()=>this.persist()));
 }
 money(cents){return new Intl.NumberFormat(this.locale,{style:'currency',currency:'EUR'}).format(cents/100);}
 date(s){return new Intl.DateTimeFormat(this.locale,{dateStyle:'long',timeZone:s.timezone}).format(new Date(s.startAt));}
 time(s){return new Intl.DateTimeFormat(this.locale,{hour:'2-digit',minute:'2-digit',timeZone:s.timezone}).format(new Date(s.startAt));}
 selected(){return this.sessions.find(s=>s.id===this.selectedId);}
 persist(){if(this.config.bookingFlow==='whatsapp')return;const s=this.selected();this.store.intent({experience:this.experience,sessionId:this.selectedId,quantity:this.quantity,date:s?civilDate(s.startAt,s.timezone):this.state.intent?.date,locale:this.locale});}
 banner(){return this.config.mode==='sandbox'?`<p class="guest-sandbox" role="note">${escape(this.config.previewNotice||this.c.sandbox)}</p>`:'';}
 message(error){return ({insufficient_seats:this.c.capacity,session_unavailable:this.c.capacity,provider_unavailable:this.c.provider,guest_checkout_disabled:this.c.unavailable,booking_page_unavailable:this.c.unavailable,invalid_request:this.c.invalid,timeout:this.c.timeout})[error]||this.c.network;}
 async init(){
  if(this.config.bookingFlow==='whatsapp'){await this.load();return;}
  const saved=this.store.read().attempt;
  const returned=new URL(location.href).searchParams.get('checkout');
  if(returned==='cancel')history.replaceState(null,'',location.pathname);
  if(saved&&this.state.intent?.experience===this.experience){this.attempt=saved;this.renderAttempt();if(saved.status==='pending'&&saved.accessToken)await this.poll();return;}
  if(returned==='cancel')this.error=this.c.cancelled;
  await this.load();
 }
 showSelector(){if(this.selector)this.root.prepend(this.selector);}
 captureFocus(){
  const active=document.activeElement;if(!this.root.contains(active))return null;
  for(const attribute of ['data-qty','data-date','data-session','data-month','data-action','data-calendar'])if(active.hasAttribute(attribute))return {attribute,value:active.getAttribute(attribute)};
  return null;
 }
 restoreFocus(target){
  if(!target)return;const select=(attribute,value)=>this.root.querySelector(`[${attribute}="${CSS.escape(value)}"]`);let next=select(target.attribute,target.value);
  if(!next||next.disabled){
   if(target.attribute==='data-qty')next=select('data-qty',String(-Number(target.value)));
   else if(target.attribute==='data-month')next=select('data-month',String(-Number(target.value)));
   else if(target.attribute==='data-session')next=this.root.querySelector('.guest-time.selected:not(:disabled)');
   else if(target.attribute==='data-date')next=this.root.querySelector('.guest-day.selected:not(:disabled)');
   else if(target.attribute==='data-action')next=this.root.querySelector('[data-action=status],[data-action=reset]');
  }
  if(!next||next.disabled){next=this.root.querySelector('h2')||this.root.querySelector('button:not(:disabled),a[href]');if(next?.tagName==='H2')next.setAttribute('tabindex','-1');}
  next?.focus({preventScroll:true});
 }
 async load(){
  const focus=this.captureFocus();const sequence=++this.loadSequence;this.root.innerHTML=this.banner()+`<p role="status">${this.c.loading}</p>`;this.showSelector();
  try{const r=range(this.month);const data=await this.api.sessions(r.from,r.to);if(sequence!==this.loadSequence)return;
   this.sessions=publicSessions(data.sessions,this.config.experiences[this.experience]);
   if(!this.sessions.some(s=>s.id===this.selectedId&&s.remainingSeats>0))this.selectedId=this.sessions.find(s=>s.remainingSeats>0)?.id;
   this.quantity=Math.max(1,Math.min(this.quantity,Math.min(100,this.selected()?.remainingSeats||1)));this.render();this.persist();this.restoreFocus(focus);
  }catch(e){if(sequence!==this.loadSequence)return;this.root.innerHTML=this.banner()+`<p role="alert">${escape(e.message==='provider_unavailable'?this.c.loadFailed:this.message(e.message)).replace('WhatsApp','<a href="https://wa.me/34711552030" target="_blank" rel="noopener noreferrer">WhatsApp</a>')}</p><button class="button" data-action="load">${this.c.retry}</button>${this.config.bookingFlow==='whatsapp'?'<a class="button" href="https://wa.me/34711552030" target="_blank" rel="noopener noreferrer">WhatsApp</a>':''}`;this.showSelector();this.root.querySelector('button').onclick=()=>this.load();this.restoreFocus(focus);}
 }
 render(){
  const focus=this.captureFocus();const s=this.selected();const selectedDate=s?civilDate(s.startAt,s.timezone):'';const[y,m]=this.month.split('-').map(Number);const days=new Date(Date.UTC(y,m,0)).getUTCDate();const offset=(new Date(Date.UTC(y,m-1,1)).getUTCDay()+6)%7;let cells='';
  const weekdays=Array.from({length:7},(_,i)=>new Intl.DateTimeFormat(this.locale,{weekday:'narrow',timeZone:'UTC'}).format(new Date(Date.UTC(2026,0,5+i))));
  cells+=weekdays.map(day=>`<span class="guest-weekday">${day}</span>`).join('');cells+='<span></span>'.repeat(offset);
  for(let d=1;d<=days;d++){const date=`${this.month}-${String(d).padStart(2,'0')}`;const available=this.sessions.some(t=>civilDate(t.startAt,t.timezone)===date&&t.remainingSeats>0);const label=new Intl.DateTimeFormat(this.locale,{dateStyle:'long',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));cells+=`<button type="button" class="guest-day${date===selectedDate?' selected':''}" data-date="${date}" ${available?'':'disabled'} aria-pressed="${date===selectedDate}" aria-label="${escape(label)} · ${available?this.c.available:this.c.unavailableDay}">${d}</button>`;}
  const times=this.sessions.filter(t=>civilDate(t.startAt,t.timezone)===selectedDate).map(t=>`<button type="button" class="guest-time${t.id===this.selectedId?' selected':''}" data-session="${escape(t.id)}" ${t.remainingSeats<this.quantity?'disabled':''} aria-pressed="${t.id===this.selectedId}">${this.time(t)}<small>${t.remainingSeats} ${this.c.seats}</small></button>`).join('');
  const monthLabel=new Intl.DateTimeFormat(this.locale,{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${this.month}-01T12:00:00Z`));
  this.root.innerHTML=this.banner()+`<div class="price">${s?this.money(s.unitPriceCents):'—'}<small>${this.c.currency}</small></div>${sessionDetails(s)}<h2>${this.c.date}</h2><div class="guest-month"><strong>${monthLabel}</strong><div><button type="button" data-month="-1" aria-label="${this.c.prev}">‹</button><button type="button" data-month="1" aria-label="${this.c.next}">›</button></div></div><div class="guest-calendar" role="group" aria-label="${this.c.date}">${cells}</div>${s?`<div class="guest-field">${this.c.time}</div><div class="guest-times" role="group" aria-label="${this.c.time}">${times}</div><div class="guest-participants"><span>${this.c.people}</span><div><button type="button" data-qty="-1" aria-label="${this.c.less}" ${this.quantity<=1?'disabled':''}>−</button><output aria-live="polite">${this.quantity}</output><button type="button" data-qty="1" aria-label="${this.c.more}" ${this.quantity>=Math.min(100,s.remainingSeats)?'disabled':''}>+</button></div></div><div class="guest-total" aria-live="polite"><span>${this.c.total}<small>${this.quantity} × ${this.money(s.unitPriceCents)}</small></span><strong>${this.money(s.unitPriceCents*this.quantity)}</strong></div>${this.config.bookingFlow==='whatsapp'?`<a class="button" href="${whatsappRequestUrl(s,this.quantity,this.locale,this.experience)}" target="_blank" rel="noopener noreferrer">${this.c.askWhatsapp||'Ask on WhatsApp'} ${iconArrow}</a><p class="guest-note">${this.c.requestOnly||'Availability is indicative; La Mesa will confirm your request.'}</p>`:`<button type="button" class="button" data-action="checkout">${this.c.pay} ${iconArrow}</button><p class="guest-note">${this.c.payments}</p><p class="guest-note">${this.c.secure}</p>`}`:`<p role="status">${this.c.empty}</p>${this.config.bookingFlow==='whatsapp'?`<a class="button" href="https://wa.me/34711552030" target="_blank" rel="noopener noreferrer">WhatsApp</a>`:''}`}${this.error?`<p class="guest-error" role="alert">${escape(this.error)}</p>`:''}`;
  this.showSelector();this.root.querySelectorAll('[data-month]').forEach(b=>{if(b.dataset.month==='-1'&&this.month<=civilDate(Date.now()).slice(0,7))b.disabled=true;b.onclick=()=>{this.month=addMonth(this.month,Number(b.dataset.month));this.load();};});
  this.root.querySelectorAll('[data-date]').forEach(b=>b.onclick=()=>{const candidates=this.sessions.filter(t=>civilDate(t.startAt,t.timezone)===b.dataset.date&&t.remainingSeats>0);this.selectedId=(candidates.find(t=>t.remainingSeats>=this.quantity)||candidates[0]).id;this.quantity=Math.min(this.quantity,this.selected().remainingSeats);this.error='';this.render();this.persist();});
  this.root.querySelectorAll('[data-session]').forEach(b=>b.onclick=()=>{this.selectedId=b.dataset.session;this.error='';this.render();this.persist();});
  this.root.querySelectorAll('[data-qty]').forEach(b=>b.onclick=()=>{this.quantity=Math.max(1,Math.min(100,s.remainingSeats,this.quantity+Number(b.dataset.qty)));this.render();this.persist();});
  if(this.config.bookingFlow!=='whatsapp')this.root.querySelector('[data-action="checkout"]')?.addEventListener('click',()=>this.openCheckout());this.restoreFocus(focus);
 }
 summary(attempt){const s=attempt?.session||this.selected();return `<div class="guest-order"><strong>${escape(s.title)}</strong><p>${this.date(s)} · ${this.time(s)}</p><p>${attempt?.quantity||this.quantity} ${this.c.people.toLowerCase()} · La Mesa, Barceloneta</p><div>${this.c.total}<strong>${this.money(attempt?.totalCents||s.unitPriceCents*this.quantity)}</strong></div></div>`;}
 openCheckout(){
  this.dialog?.remove();const dialog=document.createElement('dialog');this.dialog=dialog;dialog.className='guest-dialog';dialog.setAttribute('aria-labelledby','guest-checkout-title');dialog.innerHTML=`<div class="guest-dialog-top"><strong>la mesa</strong><button type="button" data-close aria-label="${this.c.back}">×</button></div>${this.banner()}<h2 id="guest-checkout-title">${this.c.pay}</h2>${this.summary()}<form><label for="guest-name">${this.c.name}</label><input id="guest-name" name="name" autocomplete="name" required maxlength="80" value="${this.config.mode==='sandbox'?'Andrea Demo':''}"><label for="guest-email">${this.c.email}</label><input id="guest-email" name="email" type="email" autocomplete="email" required maxlength="150" value="${this.config.mode==='sandbox'?'demo@example.com':''}"><p class="guest-policy">${this.c.policy}</p><p class="guest-error" role="alert" hidden></p><button type="submit" class="button">${this.c.pay}</button></form>`;document.body.append(dialog);dialog.querySelector('[data-close]').onclick=()=>{if(!this.busy)dialog.close();};dialog.addEventListener('cancel',e=>{if(this.busy)e.preventDefault();});dialog.querySelector('form').onsubmit=e=>{e.preventDefault();this.submit();};dialog.showModal();
 }
 async submit(){
  if(this.busy)return;const form=this.dialog.querySelector('form');if(!form.reportValidity())return;
  const name=form.elements.name.value.trim();const email=form.elements.email.value.trim().toLowerCase();if(!name){this.formError(this.c.invalid);return;}
  this.busy=true;const button=form.querySelector('button');button.disabled=true;button.textContent=this.c.busy;this.dialog.querySelector('[data-close]').disabled=true;
  try{const selected=this.selected(),experience=this.config.experiences[this.experience];if(!selected||!publicSessions([selected],experience).length||this.quantity>selected.remainingSeats)throw new Error('session_unavailable');this.persist();const input={sessionId:this.selectedId,quantity:this.quantity,name,email,locale:this.locale==='pt'?'en':this.locale};input.idempotencyKey=await this.store.key(input);const attempt=verifiedAttempt(await this.api.start(input),selected,this.quantity,experience,this.config);this.store.attempt(attempt);this.attempt=attempt;
   if(attempt.status!=='pending'){this.dialog.close();this.renderAttempt();return;}
   this.redirect(attempt);
  }catch(e){this.formError(this.message(e.message));if(['insufficient_seats','session_unavailable'].includes(e.message)){this.error=this.message(e.message);this.store.clearAttempt();this.load();}}
  finally{this.busy=false;button.disabled=false;if(button.type==='submit')button.textContent=this.c.pay;this.dialog.querySelector('[data-close]').disabled=false;}
 }
 formError(message){const p=this.dialog.querySelector('.guest-error');p.hidden=false;p.textContent=message;}
 redirect(a){try{location.assign(paymentUrl(a.checkoutUrl,this.config));}catch(e){this.formError(this.c.unavailable);}}
 renderAttempt(){
  const focus=this.captureFocus();const a=this.attempt;const status=a.status;const label=status==='confirmed'?this.c.confirmed:status==='pending'?this.c.pending:status==='expired'?this.c.expired:status==='paid_needs_staff'?this.c.staff:this.c.failed;
  this.root.innerHTML=this.banner()+`<h2 tabindex="-1">${label}</h2>${this.summary(a)}<p role="status">${status==='confirmed'?this.c.confirmedNote:status==='pending'?this.c.pendingNote:status==='paid_needs_staff'?this.c.staffNote:''}</p>${status==='pending'?`<button class="button" data-action="status">${this.c.check}</button>${a.checkoutUrl?`<button class="guest-secondary" data-action="resume">${this.c.resume}</button>`:''}`:status==='confirmed'?`<a class="button" data-calendar download="la-mesa.ics">${this.c.calendar}</a>`:status==='paid_needs_staff'?'':`<button class="button" data-action="reset">${this.c.choose}</button>`}${this.error?`<p class="guest-error" role="alert">${escape(this.error)}</p>`:''}`;
  this.root.querySelector('[data-action="status"]')?.addEventListener('click',()=>this.poll());
  this.root.querySelector('[data-action="resume"]')?.addEventListener('click',()=>{try{location.assign(paymentUrl(a.checkoutUrl,this.config));}catch{this.error=this.c.unavailable;this.renderAttempt();}});
  this.root.querySelector('[data-action="reset"]')?.addEventListener('click',()=>{clearTimeout(this.timer);this.attempt=null;this.store.clearAttempt();this.error='';this.load();});
  if(status==='confirmed'){this.store.terminal(a);if(this.icsUrl)URL.revokeObjectURL(this.icsUrl);this.icsUrl=URL.createObjectURL(new Blob([calendarIcs(a)],{type:'text/calendar;charset=utf-8'}));this.root.querySelector('[data-calendar]').href=this.icsUrl;}
  if(['failed','expired'].includes(status))this.store.terminal(a);this.restoreFocus(focus);
 }
 async poll(){
  clearTimeout(this.timer);if(this.busy||!this.attempt?.accessToken)return;this.busy=true;
  try{const a=validAttempt(await this.api.status(this.attempt));this.attempt={...a,accessToken:this.attempt.accessToken};this.error='';this.store.attempt(this.attempt);this.renderAttempt();if(a.status==='pending')this.timer=setTimeout(()=>this.poll(),this.config.pollMs||2000);}
  catch(e){this.error=this.message(e.message);this.renderAttempt();}finally{this.busy=false;}
 }
}
export function boot(){
 const config=validateConfig(window.LA_MESA_GUEST_BOOKING,window.location);if(!config)return;
 if(config.bookingFlow==='whatsapp'&&document.body.dataset.bookingReturn==='true')return;
 const saved=config.bookingFlow==='whatsapp'?null:new BookingStorage(sessionStorage).read();
 if(document.body.dataset.bookingReturn==='true'){
  const locale=saved.intent?.locale||'es';const prefix=locale==='es'?'':`${locale}/`;const expected=`/${prefix}experiencias/reserva.html`;
  if(location.pathname!==expected){location.replace(expected+location.search);return;}
  const root=document.querySelector('[data-booking-return]');if(!saved.intent?.experience||!config.experiences[saved.intent.experience]){root.textContent=COPY[locale]?.resumeMissing||COPY.es.resumeMissing;return;}
  root.dataset.experience=saved.intent.experience;new GuestWidget(root,config).init();return;
 }
 document.querySelectorAll('[data-experience]').forEach(root=>{if(config.experiences[root.dataset.experience])new GuestWidget(root,config).init();});
}
if(typeof window!=='undefined'&&typeof document!=='undefined')boot();
