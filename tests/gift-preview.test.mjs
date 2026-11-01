import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEFAULT_GIFT, DESIGNS, LANGUAGES, initialLanguage, priceGift, parseDate, madridToday, addCalendarMonths, deliveryDetails, validatePersonalization, formatMoney, formatDate} from '../js/gift-preview-domain.mjs';
import {messages, translate} from '../js/gift-preview-i18n.mjs';
const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const now = new Date('2026-11-01T12:00:00Z');
const delivery = (overrides = {}, clock = now) => deliveryDetails({email: 'example@example.test', date: '2026-11-01', deliveryTo: 'buyer', ...overrides}, clock);
test('C1 gift-catalog: one month default, arbitrary consecutive integer months, recipient chooses discipline', () => {
  assert.equal(DEFAULT_GIFT.months, 1);
  for (const months of [1, 2, 7, 25, 1001]) {
    assert.deepEqual(priceGift({...DEFAULT_GIFT, months}), {cents: months * 12000, quantity: months, disciplineOwner: 'recipient'});
  }
  for (const months of [-1, 0, 1.5, NaN, Infinity, 'bad', '', Number.MAX_SAFE_INTEGER]) assert.equal(priceGift({...DEFAULT_GIFT, months}).error, 'monthsInvalid');
});
test('C1 gift-catalog: every language promises a one-off gift without renewal', () => {
  // Contract expectations are deliberately independent of the application's dictionary.
  const promises = {es: 'Un solo regalo, sin renovación.', en: 'One gift, no renewal.', ca: 'Un sol regal, sense renovació.', pt: 'Um só presente, sem renovação.'};
  for (const [language, promise] of Object.entries(promises)) {
    assert.ok(messages[language].monthHelp.startsWith(promise), `${language}: monthly gift must explicitly promise no renewal`);
  }
});
test('C1 gift-catalog: single discipline belongs to buyer, fixed hour bundles, credit has no commercial ceiling', () => {
  for (const [discipline, cents] of [['modelado', 4500], ['torno', 6500]]) assert.deepEqual(priceGift({kind: 'single', discipline}), {cents, quantity: 1, disciplineOwner: 'buyer'});
  for (const [hours, cents] of [[8, 12000], [16, 22000], [24, 30000]]) assert.deepEqual(priceGift({kind: 'hours', hours}), {cents, quantity: hours, disciplineOwner: 'recipient'});
  for (const [credit, cents] of [['25', 2500], ['25.01', 2501], ['25,99', 2599], ['1000000', 100000000]]) assert.equal(priceGift({kind: 'credit', credit}).cents, cents);
  for (const credit of ['24.99', '-25', 'NaN', 'Infinity', '25.123', '1e3', '', '90071992547409999']) assert.equal(priceGift({kind: 'credit', credit}).error, 'creditInvalid');
  assert.equal(priceGift({kind: 'hours', hours: 9}).error, 'giftInvalid');
  assert.equal(priceGift({kind: 'single', discipline: 'anything'}).error, 'giftInvalid');
  const html = read('regalos-preview.html');
  assert.doesNotMatch(html, /\bmax=/);
  assert.match(html, /id="months"[^>]*value="1"/);
});
test('C2 gift-personalization: names required, optional dedication and three distinct ceramic artworks', () => {
  assert.equal(validatePersonalization({giver: '', recipient: 'Ana', design: 'vessels'}), 'giverRequired');
  assert.equal(validatePersonalization({giver: 'Ana', recipient: '  ', design: 'vessels'}), 'recipientRequired');
  assert.equal(validatePersonalization({giver: 'Àngels <img onerror=alert(1)>', recipient: 'João', design: 'wheel'}), null);
  assert.equal(validatePersonalization({giver: 'A', recipient: 'B', design: 'invalid'}), 'designInvalid');
  const arts = DESIGNS.map(design => read(`images/gifts/${design}.svg`));
  assert.equal(new Set(arts).size, 3);
  for (const svg of arts) { assert.match(svg, /<svg/); assert.doesNotMatch(svg, /<script|(?:href|src)="https?:|<foreignObject/); }
  const script = read('js/gift-preview.mjs');
  assert.doesNotMatch(script, /innerHTML|insertAdjacentHTML|localStorage|sessionStorage|fetch\(|XMLHttpRequest|sendBeacon/);
  assert.match(script, /textContent/);
});
test('C3 gift-delivery: today is after payment, future is 09:00 Madrid and both email destinations work', () => {
  assert.equal(delivery().mode, 'afterPayment');
  assert.equal(delivery().scheduledAt, null);
  assert.equal(delivery().expiresAt, '2027-05-01T21:59:59.999Z');
  const future = delivery({date: '2026-12-15', deliveryTo: 'recipient'});
  assert.equal(future.scheduledAt, '2026-12-15T08:00:00.000Z');
  assert.equal(future.expiresOn, '2027-06-15');
  assert.equal(future.expiresAt, '2027-06-15T21:59:59.999Z');
  assert.equal(madridToday(new Date('2026-10-31T23:30:00Z')), '2026-11-01');
  assert.equal(delivery({}, new Date('2026-10-31T23:30:00Z')).mode, 'afterPayment');
});
test('C3 gift-delivery: rejects past and impossible dates, missing email and unsupported target', () => {
  assert.equal(delivery({date: '2026-10-31'}).error, 'datePast');
  for (const date of ['2026-02-29', '2026-04-31', '2026-13-01', '2026-11-00', 'bad', '']) assert.equal(delivery({date}).error, 'dateInvalid');
  for (const email of ['', 'missing-at', 'a@', '<x>@a.test', 'a b@c.test']) {
    assert.equal(delivery({email}).error, 'emailInvalid');
  }
  assert.equal(delivery({deliveryTo: 'other'}).error, 'deliveryInvalid');
});
test('C3 gift-delivery: six calendar months clamp end of month, leap year and Madrid DST boundaries', () => {
  assert.equal(addCalendarMonths('2023-08-31'), '2024-02-29');
  assert.equal(addCalendarMonths('2024-08-31'), '2025-02-28');
  assert.equal(addCalendarMonths('2024-02-29'), '2024-08-29');
  assert.equal(addCalendarMonths('2026-03-31'), '2026-09-30');
  const clock = new Date('2026-01-01T12:00:00Z');
  for (const [date, instant] of [['2026-03-28', '2026-03-28T08:00:00.000Z'], ['2026-03-29', '2026-03-29T07:00:00.000Z'], ['2026-10-24', '2026-10-24T07:00:00.000Z'], ['2026-10-25', '2026-10-25T08:00:00.000Z']]) assert.equal(delivery({date}, clock).scheduledAt, instant);
  assert.equal(parseDate('2024-02-29').day, 29);
  assert.equal(parseDate('2025-02-29'), null);
});
test('C4 gift-languages: complete ES/EN/CA/PT dictionaries, query/document fallback, localized money and dates', () => {
  assert.equal(initialLanguage('?lang=pt', 'ca'), 'pt');
  assert.equal(initialLanguage('?lang=other', 'en-GB'), 'en');
  assert.equal(initialLanguage('', 'xx'), 'es');
  const keys = Object.keys(messages.es).sort();
  for (const language of LANGUAGES) {
    assert.deepEqual(Object.keys(messages[language]).sort(), keys);
    for (const key of keys) {
      assert.ok(translate(language, key).length > 0, `${language}.${key}`);
      assert.deepEqual([...messages[language][key].matchAll(/\{\w+\}/g)].map(m => m[0]).sort(), [...messages.es[key].matchAll(/\{\w+\}/g)].map(m => m[0]).sort());
    }
    assert.match(formatMoney(12000, language), /120/);
    assert.match(formatMoney(12000, language), /€/);
    assert.match(formatDate('2027-05-01', language), /2027/);
  }
  assert.match(formatDate('2027-05-01', 'en'), /May/);
  assert.match(formatDate('2027-05-01', 'es'), /mayo/);
});
test('C5 isolated prototype: noindex, no external assets, tracking, purchase or voucher download', () => {
  const html = read('regalos-preview.html');
  assert.match(html, /name="robots" content="noindex,nofollow"/);
  assert.match(html, /id="purchase"[^>]*disabled/);
  assert.doesNotMatch(html, /https?:\/\/|\bdownload\b|action=|<iframe/);
  assert.doesNotMatch(read('js/gift-preview.mjs'), /https?:\/\/|\/api\/|window\.open|location\s*=/);
});
