/* Frontend observational proof using a synthetic browser-intercepted API only.
 * Does not prove PostgreSQL locks/persistence, Stripe, webhook or real email delivery. */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createPreviewServer} from '../dev/server.mjs';
import {createFixture} from '../dev/tests/fixture.mjs';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require(process.env.PLAYWRIGHT_MODULE||'playwright');}catch{}
const origin='http://127.0.0.1:8801';
test('Guest widget synthetic browser scenarios (not real DB or Stripe proof)',{skip:!playwright?'Set PLAYWRIGHT_MODULE to an existing Playwright runtime; no new dependency is installed':false},async()=>{
 const server=createPreviewServer();await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(8801,'127.0.0.1',resolve);});
 const browser=await playwright.chromium.launch({headless:true});
 try{
  async function setup({width=390,kind='modelado',locale='es',scenario='normal'}={}){
   const fixture=createFixture();fixture.scenario=scenario;const context=await browser.newContext({viewport:{width,height:900}});const page=await context.newPage();const errors=[];const network=[];page.on('pageerror',e=>errors.push(e.message));
   await context.route('**/*',async route=>{
    const req=route.request();const u=new URL(req.url());
    if(u.origin===origin&&u.pathname.startsWith('/api/')){const result=await fixture.handle(u.href,req.method(),req.postDataJSON(),req.headers().authorization);if(result.abort)return route.abort('connectionreset');return route.fulfill({status:result.status,contentType:'application/json',body:JSON.stringify(result.body)});}
    if(u.origin==='http://127.0.0.1:8800'&&u.pathname.startsWith('/synthetic-pay/'))return route.fulfill({contentType:'text/html',body:'<!doctype html><html><body><h1>SYNTHETIC PAYMENT · no real charge</h1><button id="synthetic-confirm" onclick="location.href=\''+origin+'/experiencias/reserva.html?checkout=return\'">Return</button><button id="synthetic-cancel" onclick="location.href=\''+origin+'/experiencias/reserva.html?checkout=cancel\'">Cancel</button></body></html>'});
    if(u.origin!==origin){network.push(u.origin);return route.abort();}return route.continue();
   });
   await page.goto(`${origin}/${locale==='es'?'':locale+'/'}experiencias/${kind}.html`);await page.locator('.guest-day:not(:disabled)').first().waitFor();
   return {page,fixture,context,errors,network};
  }
  async function fill(page){await page.locator('[data-action="checkout"]').click();await page.locator('#guest-name').fill('Example Guest');await page.locator('#guest-email').fill('example@example.com');}
  async function pay(page){await fill(page);await page.locator('.guest-dialog button[type=submit]').click();}
  async function returned(x,status='confirmed'){await x.page.waitForURL('http://127.0.0.1:8800/**');const id=new URL(x.page.url()).pathname.split('/').at(-1);x.fixture.payment(id,status);await x.page.locator('#synthetic-confirm').click();}
  for(const width of [375,390,1440]){
   const x=await setup({width});await x.page.locator('[data-qty="1"]').click();assert.match(await x.page.locator('.guest-total').innerText(),/90/);assert.equal(await x.page.evaluate(()=>document.documentElement.scrollWidth),width);
   const small=await x.page.locator('.guest-widget').evaluate(root=>[...root.querySelectorAll('button')].map(e=>e.getBoundingClientRect()).filter(r=>r.width<43.99||r.height<43.99).length);assert.equal(small,0);
   await pay(x.page);await returned(x);await x.page.locator('[data-calendar]').waitFor();assert.match(await x.page.locator('.guest-order').innerText(),/90/);
   const storage=await x.page.evaluate(()=>sessionStorage.getItem('lamesa.guest.booking.v1'));assert.ok(!storage.includes('accessToken'));assert.ok(!storage.includes('Example Guest'));assert.ok(!storage.includes('example@example.com'));
   assert.deepEqual(Object.keys(x.fixture.posts[0]).sort(),['email','idempotencyKey','locale','name','quantity','sessionId'].sort());assert.deepEqual(x.errors,[]);await x.context.close();
  }
  {
   const x=await setup({kind:'torno'});await x.page.locator('[data-qty="1"]').click();assert.match(await x.page.locator('.guest-total').innerText(),/130/);assert.equal(await x.page.locator('[data-session="torno-16"]').isDisabled(),true);
   await x.page.locator('.languages a[lang=en]').click();await x.page.locator('.guest-total').waitFor();assert.match(await x.page.locator('.guest-total').innerText(),/130/);assert.equal(await x.page.locator('.guest-participants output').innerText(),'2');await pay(x.page);await returned(x);await x.page.waitForURL('**/en/experiencias/reserva.html?checkout=return');await x.page.locator('[data-calendar]').waitFor();assert.match(await x.page.locator('.guest-widget').innerText(),/See you at La Mesa/);await x.context.close();
  }
  for(const scenario of ['capacity','provider','lost']){
   const x=await setup({scenario});await fill(x.page);await x.page.locator('.guest-dialog button[type=submit]').click();await x.page.locator('.guest-dialog .guest-error:not([hidden])').waitFor();assert.equal(await x.page.locator('[data-calendar]').count(),0);
   if(scenario!=='capacity'){const key=x.fixture.posts[0].idempotencyKey;x.fixture.scenario='normal';await x.page.locator('.guest-dialog button[type=submit]').click();await x.page.waitForURL('http://127.0.0.1:8800/**');assert.equal(x.fixture.posts.at(-1).idempotencyKey,key);if(scenario==='lost')assert.equal(x.fixture.attempts.size,1);}
   await x.context.close();
  }
  {
   const x=await setup({scenario:'mismatch'});await fill(x.page);await x.page.locator('.guest-dialog button[type=submit]').click();await x.page.locator('.guest-dialog .guest-error:not([hidden])').waitFor();assert.ok(x.page.url().includes('modelado'));assert.match(await x.page.locator('.guest-dialog .guest-error').innerText(),/46/);await x.page.locator('.guest-dialog .button').click();await x.page.waitForURL('http://127.0.0.1:8800/**');await x.context.close();
  }
  {
   const x=await setup({scenario:'pending-confirmed'});await pay(x.page);await returned(x,'pending');await x.page.locator('[data-action=status]').waitFor();assert.equal(await x.page.locator('[data-calendar]').count(),0);await x.page.locator('[data-action=status]').click();await x.page.locator('[data-calendar]').waitFor();await x.context.close();
  }
  for(const status of ['failed','expired','paid_needs_staff']){
   const x=await setup();await pay(x.page);await returned(x,status);await x.page.locator('.guest-order').waitFor();assert.equal(await x.page.locator('[data-calendar]').count(),0);if(status==='paid_needs_staff')assert.match(await x.page.locator('.guest-widget').innerText(),/revisión/);else{await x.page.locator('[data-action=reset]').click();await x.page.locator('.guest-day:not(:disabled)').first().waitFor();}await x.context.close();
  }
  {
   const x=await setup();await x.page.locator('[data-qty="1"]').click();await pay(x.page);await x.page.waitForURL('http://127.0.0.1:8800/**');await x.page.locator('#synthetic-cancel').click();await x.page.locator('.guest-day:not(:disabled)').first().waitFor();assert.equal(await x.page.locator('.guest-participants output').innerText(),'2');assert.equal(await x.page.locator('[data-calendar]').count(),0);const state=await x.page.evaluate(()=>JSON.parse(sessionStorage.getItem('lamesa.guest.booking.v1')));assert.equal(state.attempt,undefined);await x.context.close();
  }
  {
   const context=await browser.newContext({viewport:{width:375,height:900}});const page=await context.newPage();let apiCalls=0;
   await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.origin!==origin)return route.abort();if(u.pathname.startsWith('/api/')){apiCalls++;return route.fulfill({contentType:'application/json',body:JSON.stringify({data:{sessions:[]},error:null})});}if(u.pathname.endsWith('modelado.html')){const response=await route.fetch();const body=(await response.text()).replace(/<script>window\.LA_MESA_GUEST_BOOKING=.*?<\/script>/,'');return route.fulfill({response,body});}return route.continue();});
   await page.goto(origin+'/experiencias/modelado.html');await page.waitForTimeout(100);assert.equal(apiCalls,0);assert.match(await page.locator('#reserva').innerText(),/vista previa/);assert.equal(await page.locator('.guest-calendar').count(),0);await context.close();
  }
  {
   const context=await browser.newContext({viewport:{width:375,height:900}});const page=await context.newPage();const fixture=createFixture();fixture.scenario='empty';
   await context.route('**/*',async route=>{const req=route.request(),u=new URL(req.url());if(u.origin!==origin)return route.abort();if(u.pathname.startsWith('/api/')){const r=await fixture.handle(u.href,req.method(),null,null);return route.fulfill({status:r.status,contentType:'application/json',body:JSON.stringify(r.body)});}return route.continue();});
   await page.goto(origin+'/experiencias/modelado.html');await page.locator('.guest-widget [role=status]').filter({hasText:'No hay fechas'}).waitFor();assert.equal(await page.locator('[data-action=checkout]').count(),0);await context.close();
  }
  console.log('Synthetic frontend scenarios PASS: two-person90/130€,375/390/1440,locale resume,capacity conflict,provider failure,POST lost+same-key replay,mismatch acknowledgment,pending-confirmed,failed/expired/staff,cancel-preserve,no PII/token URL or terminal storage');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
});

test('Standalone synthetic preview HTTP: loopback flow and explicit no-database health',{skip:!playwright?'Existing Playwright runtime required':false},async()=>{
 const {startFixturePreview}=await import('../dev/fixture-preview.mjs');const preview=await startFixturePreview();const browser=await playwright.chromium.launch({headless:true});
 try{const page=await browser.newPage({viewport:{width:390,height:900}});await page.route('https://**',r=>r.abort());
 const health=await fetch('http://127.0.0.1:8800/__fixture').then(r=>r.json());assert.deepEqual(health,{mode:'synthetic',database:false,stripe:false,email:false,persistence:false});
 await page.goto(origin+'/experiencias/modelado.html');await page.locator('.guest-day:not(:disabled)').first().waitFor();assert.match(await page.locator('.guest-sandbox').innerText(),/Demo simulata/);
 assert.equal(await page.locator('meta[name="booking-preview-mode"]').getAttribute('content'),'synthetic-in-memory-no-database');
 await page.locator('[data-qty="1"]').click();await page.locator('[data-action=checkout]').click();assert.equal(await page.locator('#guest-email').inputValue(),'demo@example.com');await page.locator('.guest-dialog button[type=submit]').click();await page.waitForURL('http://127.0.0.1:8800/**');assert.match(await page.locator('body').innerText(),/non usa un database/);
 await page.getByRole('button',{name:'Simula pagamento riuscito'}).click();await page.locator('[data-calendar]').waitFor();assert.match(await page.locator('.guest-order').innerText(),/90/);assert.match(await page.locator('.guest-sandbox').innerText(),/Nessuna prenotazione/);
 }finally{await browser.close();await preview.close();}
});
