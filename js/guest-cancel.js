/* Annullo di una prenotazione pagata da ospite: pagina aperta dal link dell'email (#t=token).
   Il token vive solo in memoria: si toglie dall'URL prima di qualsiasi chiamata e non finisce mai nel DOM.
   Riusa validateConfig e GuestApi di experience-booking.js (stessa istanza del modulo di course-turns.js). */
import {validateConfig,GuestApi} from './experience-booking.js?v=7';

const WA='https://wa.me/34711552030';
const LOCALES=['es','en','ca','pt'];
const COPY={
 es:{intl:'es-ES',loading:'Cargando tu reserva…',title:'Cancelar reserva',
  lesson:'Clase',when:'Fecha y hora',persons:'Personas',amount:'Importe pagado',
  refundFull:'Reembolso completo',refundNone:h=>`Sin reembolso (menos de ${h} h)`,
  cancel:'Cancelar reserva',busy:'Cancelando…',wa:'Escríbenos por WhatsApp',
  confirmTitle:'¿Cancelar sin reembolso?',confirmNote:h=>`Faltan menos de ${h} h para la clase, por eso no se devolverá el importe. Esta acción no se puede deshacer.`,
  confirmYes:'Sí, cancelar sin reembolso',confirmBack:'No, volver',
  refundedTitle:'Reserva cancelada',refundedNote:'Tu reserva ha sido cancelada y te hemos reembolsado el importe completo. En unos días lo verás en tu tarjeta.',
  noRefundTitle:'Reserva cancelada',noRefundNote:h=>`Tu reserva ha sido cancelada sin reembolso, porque faltaban menos de ${h} h para la clase.`,
  pendingTitle:'Reserva cancelada',pendingNote:'Tu reserva ha sido cancelada. No hemos podido completar el reembolso ahora mismo: te devolveremos el importe manualmente.',
  studioTitle:'Reserva cancelada por el estudio',studioNote:'El estudio ha cancelado esta clase. Escríbenos por WhatsApp si necesitas ayuda con el reembolso o con otra fecha.',
  notCancellableTitle:'Esta reserva ya no se puede cancelar',notCancellableNote:'La reserva ya no admite cancelación online. Escríbenos por WhatsApp y lo resolvemos.',
  invalidTitle:'El enlace no es válido o ha caducado',invalidNote:'Usa el enlace de tu email de confirmación o escríbenos por WhatsApp.',
  rate:'Demasiados intentos. Espera unos minutos y vuelve a abrir el enlace, o escríbenos por WhatsApp.',
  errorTitle:'No hemos podido cargar tu reserva',errorNote:'Vuelve a abrir el enlace del email o escríbenos por WhatsApp.',
  actionError:'No hemos podido confirmar la cancelación. Puede que ya esté cancelada: vuelve a intentarlo sin riesgo, el reembolso no se repetirá.',
  generic:'Hemos recibido tu solicitud. Escríbenos por WhatsApp para confirmar el estado de tu reserva.'},
 en:{intl:'en-GB',loading:'Loading your booking…',title:'Cancel booking',
  lesson:'Class',when:'Date and time',persons:'People',amount:'Amount paid',
  refundFull:'Full refund',refundNone:h=>`No refund (less than ${h} h)`,
  cancel:'Cancel booking',busy:'Cancelling…',wa:'Message us on WhatsApp',
  confirmTitle:'Cancel without a refund?',confirmNote:h=>`The class is less than ${h} h away, so the amount will not be refunded. This cannot be undone.`,
  confirmYes:'Yes, cancel without refund',confirmBack:'No, go back',
  refundedTitle:'Booking cancelled',refundedNote:'Your booking has been cancelled and the full amount has been refunded. It will show on your card in a few days.',
  noRefundTitle:'Booking cancelled',noRefundNote:h=>`Your booking has been cancelled without a refund, because the class was less than ${h} h away.`,
  pendingTitle:'Booking cancelled',pendingNote:'Your booking has been cancelled. We could not complete the refund right now: we will refund the amount manually.',
  studioTitle:'Booking cancelled by the studio',studioNote:'The studio has cancelled this class. Message us on WhatsApp if you need help with the refund or another date.',
  notCancellableTitle:'This booking can no longer be cancelled',notCancellableNote:'This booking no longer accepts online cancellation. Message us on WhatsApp and we will sort it out.',
  invalidTitle:'This link is invalid or has expired',invalidNote:'Use the link in your confirmation email or message us on WhatsApp.',
  rate:'Too many attempts. Wait a few minutes and open the link again, or message us on WhatsApp.',
  errorTitle:'We could not load your booking',errorNote:'Open the email link again or message us on WhatsApp.',
  actionError:'We could not confirm the cancellation. It may already be cancelled: trying again is safe, the refund will not be repeated.',
  generic:'We have received your request. Message us on WhatsApp to confirm the status of your booking.'},
 ca:{intl:'ca-ES',loading:'Carregant la teva reserva…',title:'Cancel·lar reserva',
  lesson:'Classe',when:'Data i hora',persons:'Persones',amount:'Import pagat',
  refundFull:'Reemborsament complet',refundNone:h=>`Sense reemborsament (menys de ${h} h)`,
  cancel:'Cancel·lar reserva',busy:'Cancel·lant…',wa:'Escriu-nos per WhatsApp',
  confirmTitle:'Cancel·lar sense reemborsament?',confirmNote:h=>`Falten menys de ${h} h per a la classe, per això no es retornarà l’import. Aquesta acció no es pot desfer.`,
  confirmYes:'Sí, cancel·lar sense reemborsament',confirmBack:'No, tornar',
  refundedTitle:'Reserva cancel·lada',refundedNote:'La teva reserva ha estat cancel·lada i t’hem reemborsat l’import complet. En uns dies el veuràs a la targeta.',
  noRefundTitle:'Reserva cancel·lada',noRefundNote:h=>`La teva reserva ha estat cancel·lada sense reemborsament, perquè faltaven menys de ${h} h per a la classe.`,
  pendingTitle:'Reserva cancel·lada',pendingNote:'La teva reserva ha estat cancel·lada. No hem pogut completar el reemborsament ara mateix: et retornarem l’import manualment.',
  studioTitle:'Reserva cancel·lada per l’estudi',studioNote:'L’estudi ha cancel·lat aquesta classe. Escriu-nos per WhatsApp si necessites ajuda amb el reemborsament o amb una altra data.',
  notCancellableTitle:'Aquesta reserva ja no es pot cancel·lar',notCancellableNote:'La reserva ja no admet cancel·lació en línia. Escriu-nos per WhatsApp i ho resolem.',
  invalidTitle:'L’enllaç no és vàlid o ha caducat',invalidNote:'Fes servir l’enllaç del teu email de confirmació o escriu-nos per WhatsApp.',
  rate:'Massa intents. Espera uns minuts i torna a obrir l’enllaç, o escriu-nos per WhatsApp.',
  errorTitle:'No hem pogut carregar la teva reserva',errorNote:'Torna a obrir l’enllaç de l’email o escriu-nos per WhatsApp.',
  actionError:'No hem pogut confirmar la cancel·lació. Pot ser que ja estigui cancel·lada: torna-ho a provar sense risc, el reemborsament no es repetirà.',
  generic:'Hem rebut la teva sol·licitud. Escriu-nos per WhatsApp per confirmar l’estat de la teva reserva.'},
 pt:{intl:'pt-BR',loading:'Carregando a sua reserva…',title:'Cancelar reserva',
  lesson:'Aula',when:'Data e horário',persons:'Pessoas',amount:'Valor pago',
  refundFull:'Reembolso total',refundNone:h=>`Sem reembolso (menos de ${h} h)`,
  cancel:'Cancelar reserva',busy:'Cancelando…',wa:'Fale com a gente pelo WhatsApp',
  confirmTitle:'Cancelar sem reembolso?',confirmNote:h=>`Faltam menos de ${h} h para a aula, por isso o valor não será devolvido. Esta ação não pode ser desfeita.`,
  confirmYes:'Sim, cancelar sem reembolso',confirmBack:'Não, voltar',
  refundedTitle:'Reserva cancelada',refundedNote:'A sua reserva foi cancelada e reembolsamos o valor total. Em alguns dias ele aparecerá no seu cartão.',
  noRefundTitle:'Reserva cancelada',noRefundNote:h=>`A sua reserva foi cancelada sem reembolso, porque faltavam menos de ${h} h para a aula.`,
  pendingTitle:'Reserva cancelada',pendingNote:'A sua reserva foi cancelada. Não conseguimos concluir o reembolso agora: vamos devolver o valor manualmente.',
  studioTitle:'Reserva cancelada pelo estúdio',studioNote:'O estúdio cancelou esta aula. Fale com a gente pelo WhatsApp se precisar de ajuda com o reembolso ou com outra data.',
  notCancellableTitle:'Esta reserva não pode mais ser cancelada',notCancellableNote:'Esta reserva não aceita mais cancelamento online. Fale com a gente pelo WhatsApp e a gente resolve.',
  invalidTitle:'O link não é válido ou expirou',invalidNote:'Use o link do seu email de confirmação ou fale com a gente pelo WhatsApp.',
  rate:'Muitas tentativas. Aguarde alguns minutos e abra o link de novo, ou fale com a gente pelo WhatsApp.',
  errorTitle:'Não conseguimos carregar a sua reserva',errorNote:'Abra de novo o link do email ou fale com a gente pelo WhatsApp.',
  actionError:'Não conseguimos confirmar o cancelamento. Talvez ela já esteja cancelada: tentar de novo é seguro, o reembolso não será repetido.',
  generic:'Recebemos o seu pedido. Fale com a gente pelo WhatsApp para confirmar o estado da sua reserva.'}
};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pickLocale=lang=>LOCALES.includes(lang)?lang:'es';
const upperFirst=s=>s.charAt(0).toUpperCase()+s.slice(1);
const FINAL={cancelled_refunded:['refundedTitle','refundedNote'],cancelled_no_refund:['noRefundTitle','noRefundNote'],
 cancelled_refund_pending:['pendingTitle','pendingNote'],cancelled_by_studio:['studioTitle','studioNote']};

// Date, fuso o importo malformati non bloccano mai la pagina: la riga relativa semplicemente manca.
export function formatWhen(p,intl){
 try{
  const tz=p.timezone||'Europe/Madrid';
  const day=new Intl.DateTimeFormat(intl,{dateStyle:'full',timeZone:tz}).format(new Date(p.startAt));
  const time=d=>new Intl.DateTimeFormat(intl,{hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZone:tz}).format(new Date(d));
  return `${upperFirst(day)} · ${time(p.startAt)}–${time(p.endAt)}`;
 }catch{return '';}
}
export function formatAmount(cents,intl){
 try{
  if(typeof cents!=='number'||!Number.isFinite(cents))return '';
  return new Intl.NumberFormat(intl,{style:'currency',currency:'EUR'}).format(cents/100);
 }catch{return '';}
}

// Il token vive nel frammento: si legge una volta e si toglie subito dalla barra degli indirizzi.
export function readToken(location,history){
 const match=/^#?t=([^&]+)/.exec(location.hash||'');
 let token=null;
 if(match){try{token=decodeURIComponent(match[1]);}catch{token=null;}}
 if(location.hash)history.replaceState(null,'',location.pathname+(location.search||''));
 return token;
}

export class GuestCancelApi extends GuestApi{
 // Le rotte di annullo non hanno lo studio nel path: il token da solo identifica la prenotazione.
 async post(path,body){
  const abort=new AbortController();const timer=setTimeout(()=>abort.abort(),this.config.timeoutMs||12000);
  try{
   const res=await this.fetcher(`${this.config.apiBase}/public/guest-bookings/${path}`,{method:'POST',body:JSON.stringify(body),signal:abort.signal,cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json'}});
   const json=await res.json();if(!res.ok||json.error)throw new Error(json.error?.code||'network');return json.data;
  }catch(e){if(e.name==='AbortError')throw new Error('timeout');throw e;}finally{clearTimeout(timer);}
 }
 preview(token){return this.post('cancel-preview',{token});}
 cancel(token,confirmNoRefund=false){return this.post('cancel',confirmNoRefund?{token,confirmNoRefund:true}:{token});}
}

export class GuestCancelView{
 constructor(root,config,lang='es'){
  this.root=root;this.config=config;this.locale=pickLocale(lang);this.c=COPY[this.locale];
  this.api=new GuestCancelApi(config);this.now=()=>Date.now();this.confirmReadyAt=0;this.token=null;this.data=null;this.stage='preview';this.busy=false;this.error='';
  this.root.addEventListener?.('click',e=>{
   const action=e.target?.closest?.('[data-action]')?.dataset?.action;
   if(action==='cancel')return this.requestCancel();
   if(action==='confirm-no-refund')return this.confirmNoRefund();
   if(action==='back')this.back();
  });
 }
 wa(){return `<a class="course-turns__wa" href="${WA}" target="_blank" rel="noopener noreferrer">${this.c.wa}</a>`;}
 shell(title,inner){
  this.root.innerHTML=`<h1 id="cancel-title" tabindex="-1">${escape(title)}</h1>${inner}${this.wa()}`;
  this.root.querySelector?.('#cancel-title')?.focus?.({preventScroll:true});
 }
 final(titleKey,noteKey,extra=''){this.shell(this.c[titleKey],`${extra}<p>${escape(this.c[noteKey])}</p>`);}
 finalStatus(status){
  const keys=FINAL[status];
  if(keys){
   const note=this.c[keys[1]];
   this.shell(this.c[keys[0]],`<p>${escape(typeof note==='function'?note(this.hours()):note)}</p>`);
  }
  else this.shell(this.c.title,`<p>${escape(this.c.generic)}</p>`);
 }
 summary(){
  const d=this.data,c=this.c,rows=[];
  rows.push(`<dt>${c.lesson}</dt><dd><strong>${escape(d.title)}</strong></dd>`);
  const when=formatWhen(d,c.intl);if(when)rows.push(`<dt>${c.when}</dt><dd>${escape(when)}</dd>`);
  if(Number.isInteger(d.persons))rows.push(`<dt>${c.persons}</dt><dd>${d.persons}</dd>`);
  const amount=formatAmount(d.amountCents,c.intl);if(amount)rows.push(`<dt>${c.amount}</dt><dd>${escape(amount)}</dd>`);
  return `<dl class="course-turns__summary">${rows.join('')}</dl>`;
 }
 hours(){const h=this.data?.cutoffHours;return Number.isFinite(h)&&h>0?h:24;}
 render(){
  const c=this.c,err=this.error?`<p role="alert" class="guest-error">${escape(this.error)}</p>`:'';
  if(this.stage==='confirm'){
   this.shell(c.confirmTitle,`${this.summary()}<p role="note" class="course-turns__notice">${escape(c.confirmNote(this.hours()))}</p>${err}
<button type="button" class="course-turns__submit" data-action="confirm-no-refund"${this.busy?' disabled':''}>${this.busy?c.busy:c.confirmYes}</button>
<button type="button" class="course-turns__back" data-action="back"${this.busy?' disabled':''}>${c.confirmBack}</button>`);
   return;
  }
  const refund=this.data.refundable?c.refundFull:c.refundNone(this.hours());
  this.shell(c.title,`${this.summary()}<p class="course-turns__notice" role="note"><strong>${escape(refund)}</strong></p>${err}
<button type="button" class="course-turns__submit" data-action="cancel"${this.busy?' disabled':''}>${this.busy?c.busy:c.cancel}</button>`);
 }
 async run(token){
  if(!token){this.final('invalidTitle','invalidNote');return;}
  this.token=token;
  this.root.innerHTML=`<p role="status">${this.c.loading}</p>`;
  let data;
  try{data=await this.api.preview(token);}
  catch(e){
   if(e.message==='invalid_or_expired_token')this.final('invalidTitle','invalidNote');
   else if(e.message==='rate_limited')this.shell(this.c.errorTitle,`<p>${escape(this.c.rate)}</p>`);
   else this.final('errorTitle','errorNote');
   return;
  }
  if(!data||typeof data.title!=='string'){this.final('errorTitle','errorNote');return;}
  this.data=data;
  // Prenotazione gia' annullata (dal cliente o dallo studio): solo l'esito, nessun bottone.
  if(data.cancellation){this.finalStatus(data.cancellation);return;}
  this.stage='preview';this.render();
 }
 back(){if(this.busy)return;this.stage='preview';this.error='';this.render();}
 // Fuori dal termine non si cancella al primo clic: serve la seconda conferma esplicita.
 async requestCancel(){
  if(this.busy||!this.data)return;
  this.error='';
  if(!this.data.refundable){this.enterConfirm();return;}
  await this.send(false);
 }
 // Anti doppio clic: subito dopo il cambio di schermata il bottone di conferma ignora i tocchi (400 ms).
 enterConfirm(){this.stage='confirm';this.confirmReadyAt=this.now()+400;this.render();}
 async confirmNoRefund(){if(this.busy||!this.data||this.now()<this.confirmReadyAt)return;this.error='';await this.send(true);}
 async send(confirmNoRefund){
  this.busy=true;this.render();
  try{
   const res=await this.api.cancel(this.token,confirmNoRefund);
   this.busy=false;
   if(res?.status==='needs_confirmation'){this.data={...this.data,refundable:false};this.enterConfirm();return;}
   this.finalStatus(res?.status);
  }catch(e){
   this.busy=false;
   if(e.message==='invalid_or_expired_token'){this.final('invalidTitle','invalidNote');return;}
   if(e.message==='booking_not_cancellable'){this.final('notCancellableTitle','notCancellableNote');return;}
   this.error=e.message==='rate_limited'?this.c.rate:this.c.actionError;
   this.render();
  }
 }
}

// env serve ai test; in pagina si usano i globali del browser.
export async function boot(env={}){
 const doc=env.document||(typeof document!=='undefined'?document:null);
 const win=env.window||(typeof window!=='undefined'?window:null);
 const loc=env.location||(typeof location!=='undefined'?location:null);
 const hist=env.history||(typeof history!=='undefined'?history:null);
 if(!doc||!win||!loc)return;
 const root=doc.querySelector('[data-guest-cancel]');
 if(!root)return;
 // Il token si legge e si toglie dall'URL prima di qualsiasi altra operazione (e di ogni fetch).
 const token=readToken(loc,hist);
 const config=validateConfig(win.LA_MESA_GUEST_BOOKING,loc);
 const view=new GuestCancelView(root,config||{apiBase:'',studioSlug:''},doc.documentElement.lang);
 if(!config){view.final('errorTitle','errorNote');return;}
 if(env.fetcher)view.api=new GuestCancelApi(config,env.fetcher);
 await view.run(token);
}
if(typeof window!=='undefined'&&typeof document!=='undefined')boot();
