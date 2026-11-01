// Synthetic preview catalogue. This module cannot issue a voucher or place an order.
export const LANGUAGES = ['es', 'en', 'ca', 'pt'];
export const DESIGNS = ['vessels', 'wheel', 'tiles'];
export const DEFAULT_GIFT = Object.freeze({kind: 'months', months: 1, discipline: 'modelado', hours: 8, credit: '25'});
export function initialLanguage(search = '', documentLanguage = 'es') {
  const query = new URLSearchParams(search).get('lang')?.toLowerCase();
  const documentCode = documentLanguage.toLowerCase().split('-')[0];
  return LANGUAGES.includes(query) ? query : LANGUAGES.includes(documentCode) ? documentCode : 'es';
}
export function priceGift(gift) {
  if (gift.kind === 'months') {
    const count = Number(gift.months);
    if (!Number.isSafeInteger(count) || count <= 0 || !Number.isSafeInteger(count * 12000)) return {error: 'monthsInvalid'};
    return {cents: count * 12000, quantity: count, disciplineOwner: 'recipient'};
  }
  if (gift.kind === 'single' && ['modelado', 'torno'].includes(gift.discipline)) {
    return {cents: gift.discipline === 'modelado' ? 4500 : 6500, quantity: 1, disciplineOwner: 'buyer'};
  }
  if (gift.kind === 'hours' && [8, 16, 24].includes(Number(gift.hours))) {
    return {cents: {8: 12000, 16: 22000, 24: 30000}[Number(gift.hours)], quantity: Number(gift.hours), disciplineOwner: 'recipient'};
  }
  if (gift.kind === 'credit') {
    // Decimal arithmetic in cents, without a commercial maximum or rounding gifts up.
    const value = String(gift.credit).trim().replace(',', '.');
    if (!/^\d+(?:\.\d{1,2})?$/.test(value)) return {error: 'creditInvalid'};
    const [whole, fraction = ''] = value.split('.');
    const exactCents = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
    if (exactCents > BigInt(Number.MAX_SAFE_INTEGER) || exactCents < 2500n) return {error: 'creditInvalid'};
    const cents = Number(exactCents);
    if (!Number.isSafeInteger(cents) || cents < 2500) return {error: 'creditInvalid'};
    return {cents, quantity: 1, disciplineOwner: null};
  }
  return {error: 'giftInvalid'};
}
export function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1000 || year > 9998 || month < 1 || month > 12 || day < 1) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? {year, month, day} : null;
}
export function madridToday(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit'}).formatToParts(now).map(p => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
export function addCalendarMonths(value, count = 6) {
  const date = parseDate(value);
  if (!date) throw new RangeError('Invalid calendar date');
  const target = new Date(Date.UTC(date.year, date.month - 1 + count, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  return `${target.getUTCFullYear()}-${String(target.getUTCMonth() + 1).padStart(2, '0')}-${String(Math.min(date.day, lastDay)).padStart(2, '0')}`;
}
export function madridInstant(value, hour, minute = 0, second = 0, millisecond = 0) {
  const date = parseDate(value);
  if (!date) throw new RangeError('Invalid calendar date');
  const target = Date.UTC(date.year, date.month - 1, date.day, hour, minute, second);
  let timestamp = target;
  const formatter = new Intl.DateTimeFormat('en-GB', {timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'});
  for (let i = 0; i < 3; i++) {
    const p = Object.fromEntries(formatter.formatToParts(new Date(timestamp)).map(part => [part.type, part.value]));
    const displayed = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute), Number(p.second));
    timestamp += target - displayed;
  }
  return new Date(timestamp + millisecond).toISOString();
}
export function deliveryDetails({email, date, deliveryTo}, now = new Date()) {
  if (!['buyer', 'recipient'].includes(deliveryTo)) return {error: 'deliveryInvalid'};
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(String(email).trim())) return {error: 'emailInvalid'};
  if (!parseDate(date)) return {error: 'dateInvalid'};
  const today = madridToday(now);
  if (date < today) return {error: 'datePast'};
  const expiresOn = addCalendarMonths(date);
  if (!parseDate(expiresOn)) return {error: 'dateInvalid'};
  return {mode: date === today ? 'afterPayment' : 'scheduled', date, deliveryTo, scheduledAt: date === today ? null : madridInstant(date, 9), expiresOn, expiresAt: madridInstant(expiresOn, 23, 59, 59, 999)};
}
export function validatePersonalization({giver, recipient, design}) {
  if (!String(giver ?? '').trim()) return 'giverRequired';
  if (!String(recipient ?? '').trim()) return 'recipientRequired';
  return DESIGNS.includes(design) ? null : 'designInvalid';
}
export function formatMoney(cents, language) {
  return new Intl.NumberFormat(language, {style: 'currency', currency: 'EUR'}).format(cents / 100);
}
export function formatDate(value, language) {
  if (!parseDate(value)) return '';
  return new Intl.DateTimeFormat(language, {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'}).format(new Date(`${value}T12:00:00Z`));
}
