/* Browser-only synthetic API fixture. Not database/Stripe proof. Never served by dev/server. */
import {randomUUID} from 'node:crypto';
export function createFixture(){
 const day=new Date(Date.now()+86400000*2);const date=day.toISOString().slice(0,10);
 const session=(id,kind,hour,seats)=>({id,classTypeId:`ct_guest_${kind}`,title:`SYNTHETIC ${kind}`,startAt:`${date}T${hour}:00:00+02:00`,endAt:`${date}T${String(Number(hour)+2).padStart(2,'0')}:00:00+02:00`,timezone:'Europe/Madrid',unitPriceCents:kind==='torno'?6500:4500,currency:'EUR',remainingSeats:seats});
 const sessions=[session('modelado-11','modelado','11',8),session('modelado-16','modelado','16',4),session('torno-11','torno','11',2),session('torno-16','torno','16',1)];
 const attempts=new Map(),keys=new Map(),posts=[];let scenario='normal',lost=false;
 return {sessions,attempts,posts,set scenario(v){scenario=v;},get scenario(){return scenario;},async handle(url,method,body,authorization){
  const u=new URL(url);const ok=data=>({status:200,body:{data,error:null}});const fail=(status,code)=>({status,body:{data:null,error:{code}}});
  if(u.pathname.endsWith('/guest-sessions'))return ok({sessions:scenario==='empty'?[]:sessions.filter(s=>s.startAt.slice(0,10)>=u.searchParams.get('from')&&s.startAt.slice(0,10)<=u.searchParams.get('to'))});
  if(method==='POST'){
   posts.push(body);if(scenario==='capacity')return fail(409,'insufficient_seats');if(scenario==='provider')return fail(503,'provider_unavailable');
   if(keys.has(body.idempotencyKey))return ok(attempts.get(keys.get(body.idempotencyKey)));
   const s=sessions.find(s=>s.id===body.sessionId);if(!s||body.quantity>s.remainingSeats)return fail(409,'insufficient_seats');
   const id=randomUUID();const a={attemptId:id,status:'pending',quantity:body.quantity,totalCents:s.unitPriceCents*body.quantity+(scenario==='mismatch'?100:0),currency:'EUR',session:s,holdUntil:new Date(Date.now()+600000).toISOString(),checkoutUrl:'http://127.0.0.1:8800/synthetic-pay/'+id,accessToken:'x'.repeat(43),reads:0};attempts.set(id,a);keys.set(body.idempotencyKey,id);
   if(scenario==='lost'&&!lost){lost=true;return {abort:true};}return {status:201,body:{data:a,error:null}};
  }
  const id=u.pathname.split('/').at(-1);const a=attempts.get(id);if(!a||authorization!=='Bearer '+a.accessToken)return fail(404,'not_found');a.reads++;
  if(scenario==='pending-confirmed'&&a.reads>1)a.status='confirmed';
  const{accessToken,reads,...publicAttempt}=a;return ok(publicAttempt);
 },payment(id,status='confirmed'){const a=attempts.get(id);if(a)a.status=status;}};
}
