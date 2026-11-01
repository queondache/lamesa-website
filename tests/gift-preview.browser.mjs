import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, mkdir} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {messages} from '../js/gift-preview-i18n.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const evidence = resolve(root, '.orchestratore/evidence');
const mime = {'.html': 'text/html', '.css': 'text/css', '.mjs': 'text/javascript', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2'};

test('C2/C4/C5 gift preview: real desktop/mobile, safe personalization, independent languages, keyboard and no external/API requests', {timeout: 120000}, async t => {
  let browser;
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
      const file = resolve(root, `.${pathname}`);
      if (!file.startsWith(root.endsWith(sep) ? root : `${root}${sep}`)) { res.writeHead(403).end(); return; }
      const body = await readFile(file);
      res.writeHead(200, {'Content-Type': mime[extname(file)] || 'application/octet-stream'}).end(body);
    } catch { res.writeHead(404).end(); }
  });
  try {
    await new Promise((resolveListen, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolveListen); });
    const origin = `http://127.0.0.1:${server.address().port}`;
    const modulePath = process.env.PLAYWRIGHT_MODULE || '/home/andrea/.npm/_npx/9833c18b2d85bc59/node_modules/playwright';
    const {chromium} = await import(pathToFileURL(resolve(modulePath, 'index.mjs')).href);
    browser = await chromium.launch({headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || '/home/andrea/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell'});
    await mkdir(evidence, {recursive: true});
    for (const viewport of [{width: 1440, height: 1100}, {width: 390, height: 844}]) {
      await t.test(`${viewport.width}px: complete interactive journey`, async () => {
        const context = await browser.newContext({viewport, timezoneId: 'Europe/Madrid', reducedMotion: 'reduce'});
        const requests = [], blocked = [], errors = [], failures = [];
        const page = await context.newPage();
        page.setDefaultTimeout(10000);
        try {
          page.on('request', request => requests.push(request.url()));
          page.on('pageerror', error => errors.push(error.message));
          page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
          page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
          await context.route('**/*', route => {
            const url = new URL(route.request().url());
            if (url.origin !== origin || /\/api(?:\/|$)/.test(url.pathname)) { blocked.push(url.href); return route.abort(); }
            return route.continue();
          });
          await page.clock.install({time: new Date('2026-11-01T12:00:00Z')});
          await page.goto(`${origin}/regalos-preview.html?lang=en`);
          await page.locator('#voucher-gift').waitFor({state: 'visible'});
          assert.equal(await page.locator('html').getAttribute('lang'), 'en');
          assert.equal(await page.locator('#gift-language').inputValue(), 'en');
          assert.match(await page.locator('#total').textContent(), /120/);
          assert.equal(await page.locator('#months').inputValue(), '1');
          if (viewport.width === 1440) await page.screenshot({path: resolve(evidence, 'gift-preview-first-screen.png'), fullPage: false});
          assert.equal(await page.locator('#purchase').isDisabled(), true);
          await page.keyboard.press('Tab');
          assert.equal(await page.locator('.skip-link').evaluate(el => el === document.activeElement), true);
          assert.notEqual(await page.locator('.skip-link').evaluate(el => getComputedStyle(el).clipPath), 'inset(50%)');

          // Empty mandatory fields produce localized errors and focus the first one.
          await page.locator('.review-button').click();
          assert.equal(await page.locator('#giver').evaluate(el => el === document.activeElement), true);
          assert.equal(await page.locator('#giver-error').textContent(), messages.en.giverRequired);
          assert.equal(await page.locator('#recipient-error').textContent(), messages.en.recipientRequired);
          assert.equal(await page.locator('#email-error').textContent(), messages.en.emailInvalid);
          await page.locator('#months').fill('1.5');
          assert.equal(await page.locator('#gift-error').textContent(), messages.en.monthsInvalid);
          await page.locator('#months').fill('3');
          assert.match(await page.locator('#total').textContent(), /360/);
          assert.match(await page.locator('#voucher-detail').textContent(), /recipient chooses the discipline and dates/);

          await page.locator('input[name=kind][value=single]').check();
          await page.locator('#discipline').selectOption('torno');
          assert.match(await page.locator('#total').textContent(), /65/);
          assert.match(await page.locator('#voucher-gift').textContent(), /Pottery wheel/);
          await page.locator('#discipline').selectOption('modelado');
          assert.match(await page.locator('#total').textContent(), /45/);
          await page.locator('input[name=kind][value=hours]').check();
          for (const [hours, amount] of [['8', '120'], ['16', '220'], ['24', '300']]) {
            await page.locator('#hours').selectOption(hours);
            assert.match(await page.locator('#total').textContent(), new RegExp(amount));
          }
          await page.locator('input[name=kind][value=credit]').check();
          assert.equal(await page.locator('#credit').getAttribute('max'), null);
          await page.locator('#credit').fill('24.99');
          assert.equal(await page.locator('#gift-error').textContent(), messages.en.creditInvalid);
          await page.locator('#credit').fill('1234.56');
          assert.match(await page.locator('#total').textContent(), /1,234\.56/);

          const giver = 'Àngels & João <img src=x onerror=alert(1)> ' + 'é'.repeat(65);
          const recipient = 'María da Conceição <script>alert(1)</script> ' + 'ñ'.repeat(70);
          const dedication = 'A little time for you. <svg onload=alert(1)>\nAmb molt d’amor, para criar!';
          await page.locator('#giver').fill(giver);
          await page.keyboard.press('Tab');
          assert.equal(await page.locator('#recipient').evaluate(el => el === document.activeElement), true);
          assert.equal(await page.locator('#recipient').evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
          await page.keyboard.type(recipient);
          await page.locator('#dedication').fill(dedication);
          assert.equal(await page.locator('#voucher-recipient').textContent(), recipient);
          assert.equal(await page.locator('#voucher-giver').textContent(), giver);
          assert.equal(await page.locator('#voucher-dedication').textContent(), dedication);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'long names and dedication do not overflow the page');
          assert.equal(await page.locator('#voucher').evaluate(el => el.scrollWidth <= el.clientWidth), true, 'long names wrap inside the voucher');
          assert.equal(await page.locator('.voucher-body script, .voucher-body svg, #voucher-recipient script, #voucher-giver img, #voucher-dedication svg').count(), 0);
          await page.locator('#delivery-to').selectOption('recipient');
          await page.locator('#email').fill('recipient@example.test');
          assert.match(await page.locator('#recap-date').textContent(), /Today, after payment/);
          await page.locator('#date').fill('2026-10-31');
          assert.equal(await page.locator('#date-error').textContent(), messages.en.datePast);
          await page.locator('#date').fill('2026-12-15');
          assert.match(await page.locator('#recap-date').textContent(), /09:00.*Europe\/Madrid/);
          assert.match(await page.locator('#recap-expiry').textContent(), /June.*2027/);

          // Gift and page language can be changed independently; selections and text survive.
          for (const lang of ['es', 'en', 'ca', 'pt']) {
            await page.locator('#gift-language').selectOption(lang);
            assert.equal(await page.locator('#voucher').getAttribute('lang'), lang);
            assert.equal(await page.locator('#voucher-sample').textContent(), messages[lang].sample);
            assert.equal(await page.locator('h1').textContent(), messages.en.title);
            assert.equal(await page.locator('#recipient').inputValue(), recipient);
          }
          for (const lang of ['es', 'ca', 'pt', 'en']) {
            await page.locator('#page-language').selectOption(lang);
            assert.equal(await page.locator('html').getAttribute('lang'), lang);
            assert.equal(await page.locator('#voucher').getAttribute('lang'), 'pt');
            assert.equal(await page.locator('#gift-language').inputValue(), 'pt');
            for (const node of await page.locator('[data-i18n]').all()) {
              const key = await node.getAttribute('data-i18n');
              assert.equal(await node.textContent(), messages[lang][key], `${lang}.${key}`);
            }
            assert.equal(await page.locator('input[name=kind]:checked').inputValue(), 'credit');
            await page.locator('.review-button').click();
            assert.equal(await page.locator('#review-status').textContent(), messages[lang].ready);
          }
          await page.locator('#delivery-to').selectOption('buyer');
          await page.locator('#email').fill('buyer@example.test');
          assert.match(await page.locator('#recap-email-label').textContent(), /From/);
          assert.equal(await page.locator('#recap-email').textContent(), 'buyer@example.test');
          assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);

          // Screenshot a readable personalised example; malicious and long strings were tested above.
          await page.locator('#page-language').selectOption('es');
          await page.locator('#gift-language').selectOption('es');
          await page.locator('input[name=kind][value=months]').check();
          await page.locator('#months').fill('1');
          await page.locator('#giver').fill('Andrea');
          await page.locator('#recipient').fill('María');
          await page.locator('#dedication').fill('Para que tus manos cuenten nuevas historias.\nCon mucho cariño.');
          await page.locator('.review-button').click();
          for (const design of ['vessels', 'wheel', 'tiles']) {
            await page.locator(`input[name=design][value=${design}]`).check();
            await page.locator('#voucher-art').evaluate(img => img.decode());
            assert.equal(await page.locator('#voucher').getAttribute('data-design'), design);
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${viewport.width}px page overflow for ${design}`);
            assert.equal(await page.locator('#voucher').evaluate(el => el.scrollWidth <= el.clientWidth), true, 'voucher contents wrap');
            if (viewport.width === 1440) await page.screenshot({path: resolve(evidence, `gift-preview-${design}-desktop.png`), fullPage: true});
          }
          if (viewport.width === 390) await page.screenshot({path: resolve(evidence, 'gift-preview-mobile-390.png'), fullPage: true});
          assert.deepEqual(blocked, [], 'No external or API requests attempted');
          assert.deepEqual(errors, [], 'No browser console errors');
          assert.deepEqual(failures, [], 'Every local resource loads');
          assert.ok(requests.length > 5);
          assert.ok(requests.every(url => new URL(url).origin === origin));
        } finally { await context.close(); }
      });
    }
  } finally {
    await browser?.close();
    await new Promise(resolveClose => server.close(resolveClose));
  }
});
