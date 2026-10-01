// Local-only preview. No production API credentials or remote fallback.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.otf':'font/otf'};
export const config={enabled:true,mode:'sandbox',apiBase:'/api',studioSlug:'la-mesa-sandbox',experiences:{modelado:{classTypeIds:['ct_guest_modelado']},torno:{classTypeIds:['ct_guest_torno']}}};
export function createPreviewServer(localConfig=config){return http.createServer(async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','no-referrer');
 const host=(req.headers.host||'').split(':')[0];if(!['127.0.0.1','localhost'].includes(host)){res.writeHead(403);res.end();return;}
 const url=new URL(req.url,'http://127.0.0.1:8801');
 if(url.pathname.startsWith('/api/')){
  const proxy=http.request({hostname:'127.0.0.1',port:8800,path:url.pathname+url.search,method:req.method,headers:{'content-type':req.headers['content-type']||'application/json',...(req.headers.authorization?{authorization:req.headers.authorization}:{})}},upstream=>{res.writeHead(upstream.statusCode,{'Content-Type':'application/json','Cache-Control':'no-store'});upstream.pipe(res);});
  proxy.on('error',()=>{if(!res.headersSent)res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({data:null,error:{code:'provider_unavailable'}}));});req.pipe(proxy);return;
 }
 try{const decoded=decodeURIComponent(url.pathname==='/'?'/experiencias/modelado.html':url.pathname);const path=resolve(root,'.'+decoded);if(!path.startsWith(root+'/')||/(?:^|\/)\./.test(decoded)||decoded.startsWith('/dev/')||decoded.startsWith('/tests/')||decoded.startsWith('/docs/')){res.writeHead(404);res.end();return;}
  let content=await readFile(path);if(extname(path)==='.html')content=Buffer.from(content.toString().replace('<head>','<head><script>window.LA_MESA_GUEST_BOOKING='+JSON.stringify(localConfig)+'</script><meta name="booking-preview-mode" content="'+(localConfig.fixtureOnly?'synthetic-in-memory-no-database':'local-sandbox-adapter')+'">'));
  res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream'});res.end(content);
 }catch{res.writeHead(404);res.end('Not found');}
 });}
if(process.argv[1]===fileURLToPath(import.meta.url))createPreviewServer().listen(8801,'127.0.0.1',()=>process.stdout.write('Local La Mesa preview: http://127.0.0.1:8801 (sandbox backend127.0.0.1:8800 only)\n'));
