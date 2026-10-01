// Explicit standalone SYNTHETIC demo. No PostgreSQL, Stripe, email or persistence.
// Never a fallback of server.mjs. Refuses occupied ports; never stops another service.
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {createPreviewServer,config} from './server.mjs';
import {createFixture} from './tests/fixture.mjs';
const ORIGIN='http://127.0.0.1:8801';
const notice='Demo simulata: date e pagamento di prova. Nessuna prenotazione o pagamento reale.';
const syntheticConfig={...config,fixtureOnly:true,previewNotice:notice};
const reply=(res,status,body,type='application/json')=>{res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store','Referrer-Policy':'no-referrer'});res.end(typeof body==='string'?body:JSON.stringify(body));};
async function body(req){let text='';for await(const chunk of req){text+=chunk;if(text.length>4096)throw new Error('large_request');}return text;}
export async function startFixturePreview(){
 const fixture=createFixture();const backend=http.createServer(async(req,res)=>{
  if(!['127.0.0.1','localhost'].includes((req.headers.host||'').split(':')[0]))return reply(res,403,{data:null,error:{code:'local_only'}});
  const u=new URL(req.url,'http://127.0.0.1:8800');
  try{
   if(u.pathname.startsWith('/api/')){
    const input=req.method==='POST'?JSON.parse(await body(req)):null;
    // Ignore any entered real purchaser details: the observational fixture only retains examples.
    if(input){input.name='Andrea Demo';input.email='demo@example.com';}
    const result=await fixture.handle(u.href,req.method(),input,req.headers.authorization);
    return reply(res,result.status,result.body);
   }
   if(u.pathname==='/__fixture')return reply(res,200,{mode:'synthetic',database:false,stripe:false,email:false,persistence:false});
   const pay=/^\/synthetic-pay\/([A-Za-z0-9-]+)$/.exec(u.pathname);
   if(pay&&fixture.attempts.has(pay[1]))return reply(res,200,`<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer"><title>Pagamento di prova · La Mesa</title><style>body{font-family:Arial,sans-serif;background:#FFFAEE;color:#1A1A1A;max-width:520px;margin:48px auto;padding:24px;line-height:1.6}h1{color:#1B3C8B}button,a{display:block;border:0;border-radius:100px;padding:14px 22px;min-height:48px;font-size:16px;margin:12px 0}button{background:#F7B137;color:#1A1A1A;width:100%;cursor:pointer}a{color:#1B3C8B;text-align:center}button:focus-visible,a:focus-visible{outline:3px solid #1B3C8B;outline-offset:4px}</style></head><body><h1>Pagamento simulato</h1><p>${notice}</p><p>Questa demo non usa un database e non contatta Stripe. Non inserire dati di carta.</p><form method="POST" action="/synthetic-payment/${pay[1]}"><button name="status" value="confirmed">Simula pagamento riuscito</button><button name="status" value="failed">Simula pagamento fallito</button><button name="status" value="expired">Simula prenotazione scaduta</button></form><a href="${ORIGIN}/experiencias/reserva.html?checkout=cancel">Torna senza pagare</a></body></html>`,'text/html; charset=utf-8');
   const confirm=/^\/synthetic-payment\/([A-Za-z0-9-]+)$/.exec(u.pathname);
   if(confirm&&req.method==='POST'&&fixture.attempts.has(confirm[1])){const status=new URLSearchParams(await body(req)).get('status');if(!['confirmed','failed','expired'].includes(status))return reply(res,422,{error:'invalid_status'});fixture.payment(confirm[1],status);res.writeHead(303,{Location:ORIGIN+'/experiencias/reserva.html?checkout=return','Cache-Control':'no-store','Referrer-Policy':'no-referrer'});res.end();return;}
   reply(res,404,{data:null,error:{code:'not_found'}});
  }catch{reply(res,422,{data:null,error:{code:'invalid_request'}});}
 });
 const website=createPreviewServer(syntheticConfig);
 const listen=(server,port)=>new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
 try{await listen(backend,8800);await listen(website,8801);}catch(error){backend.close();website.close();throw error;}
 return {website,backend,close:async()=>Promise.all([new Promise(r=>website.close(r)),new Promise(r=>backend.close(r))])};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 startFixturePreview().then(handles=>{process.stdout.write('SYNTHETIC ONLY: http://127.0.0.1:8801/experiencias/modelado.html\nNo DB, Stripe, email or production calls. Stop this fixture before starting the actual sandbox.\n');for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>handles.close().then(()=>process.exit(0)));}).catch(()=>{process.stderr.write('Demo not started:8800 or8801 unavailable. Existing services were left running.\n');process.exitCode=1;});
}
