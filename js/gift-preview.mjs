import {DEFAULT_GIFT, initialLanguage, priceGift, madridToday, deliveryDetails, validatePersonalization, formatMoney, formatDate} from './gift-preview-domain.mjs';
import {translate} from './gift-preview-i18n.mjs';

const $ = id => document.getElementById(id);
const form = $('gift-form');
let language = initialLanguage(location.search, document.documentElement.lang);
let giftLanguage = language;
let reviewed = false;
const languageNames = {es: 'Español', en: 'English', ca: 'Català', pt: 'Português'};
const t = (key, values) => translate(language, key, values);
const gt = (key, values) => translate(giftLanguage, key, values);
const text = (id, value) => { $(id).textContent = value; };
const selected = name => form.querySelector(`input[name="${name}"]:checked`).value;
const giftData = () => ({...DEFAULT_GIFT, kind: selected('kind'), months: $('months').value, discipline: $('discipline').value, hours: $('hours').value, credit: $('credit').value});
const personalData = () => ({giver: $('giver').value.trim(), recipient: $('recipient').value.trim(), dedication: $('dedication').value.trim(), design: selected('design')});
const deliveryData = () => ({email: $('email').value, date: $('date').value, deliveryTo: $('delivery-to').value});

function giftDescription(gift, price, lang) {
  const tr = (key, values) => translate(lang, key, values);
  if (price.error) return {title: tr('missing'), detail: tr(price.error)};
  if (gift.kind === 'months') return {title: tr(price.quantity === 1 ? 'monthSummaryOne' : 'monthsSummary', {count: price.quantity}), detail: tr('monthsDetail')};
  if (gift.kind === 'single') return {title: tr('singleSummary', {discipline: tr(gift.discipline)}), detail: tr('singleDetail')};
  if (gift.kind === 'hours') return {title: tr('hoursSummary', {count: price.quantity}), detail: tr('hoursDetail')};
  return {title: tr('creditSummary', {amount: formatMoney(price.cents, lang)}), detail: tr('creditDetail')};
}

function setError(field, key, target = `${field}-error`) {
  const element = $(field);
  element.setAttribute('aria-invalid', key ? 'true' : 'false');
  $(target).hidden = !key;
  text(target, key ? t(key) : '');
}

function render() {
  const gift = giftData();
  const personal = personalData();
  const price = priceGift(gift);
  const delivery = deliveryDetails(deliveryData());
  for (const panel of form.querySelectorAll('[data-kind]')) {
    panel.hidden = panel.dataset.kind !== gift.kind;
    for (const input of panel.querySelectorAll('input,select')) input.disabled = panel.hidden;
  }
  const description = giftDescription(gift, price, giftLanguage);
  const uiDescription = giftDescription(gift, price, language);
  $('voucher').lang = giftLanguage;
  $('voucher').dataset.design = personal.design;
  $('voucher-art').src = `/images/gifts/${personal.design}.svg`;
  text('voucher-eyebrow', gt('giftVoucher'));
  text('voucher-for', gt('forLabel'));
  text('voucher-recipient', personal.recipient || gt('recipientPlaceholder'));
  text('voucher-from', gt('fromLabel'));
  text('voucher-giver', personal.giver || gt('giverPlaceholder'));
  text('voucher-gift', description.title);
  text('voucher-detail', description.detail);
  text('voucher-dedication', personal.dedication);
  $('voucher-dedication').hidden = !personal.dedication;
  text('voucher-sample', gt('sample'));
  text('voucher-validity', delivery.error ? gt('validityEmpty') : gt('validity', {date: formatDate(delivery.expiresOn, giftLanguage)}));
  text('total', price.error ? '—' : formatMoney(price.cents, language));
  text('recap-gift', uiDescription.title);
  text('recap-language', languageNames[giftLanguage]);
  text('recap-email-label', `${t('recapDelivery')} · ${t($('delivery-to').value === 'buyer' ? 'giver' : 'recipient')}`);
  text('recap-email', $('email').value.trim() || t('missing'));
  text('recap-date', delivery.error ? t('missing') : delivery.mode === 'afterPayment' ? t('afterPayment') : t('scheduled', {date: formatDate(delivery.date, language)}));
  text('recap-expiry', delivery.error ? t('missing') : t('validity', {date: formatDate(delivery.expiresOn, language)}));
  if (reviewed) validate(false);
}

function validate(focus) {
  const gift = giftData();
  const price = priceGift(gift);
  const personal = personalData();
  const field = {months: 'months', single: 'discipline', hours: 'hours', credit: 'credit'}[gift.kind];
  for (const id of ['months', 'discipline', 'hours', 'credit']) $(id).removeAttribute('aria-invalid');
  setError(field, price.error, 'gift-error');
  setError('giver', !personal.giver ? 'giverRequired' : null);
  setError('recipient', !personal.recipient ? 'recipientRequired' : null);
  const delivery = deliveryDetails(deliveryData());
  setError('email', delivery.error === 'emailInvalid' ? delivery.error : null);
  // Validate date independently so one missing field doesn't hide another error.
  const dateResult = deliveryDetails({...deliveryData(), email: 'preview@example.test'});
  setError('date', dateResult.error || null);
  const valid = !price.error && !validatePersonalization(personal) && !delivery.error;
  text('review-status', t(valid ? 'ready' : 'reviewErrors'));
  if (focus && !valid) form.querySelector('[aria-invalid="true"]:not(:disabled)')?.focus();
  return valid;
}

function localize() {
  document.documentElement.lang = language;
  document.title = t('pageTitle');
  for (const element of document.querySelectorAll('[data-i18n]')) element.textContent = t(element.dataset.i18n);
  $('dedication').placeholder = t('dedicationPlaceholder');
  $('page-language').value = language;
  $('gift-language').value = giftLanguage;
  render();
}

$('date').value = madridToday();
$('date').min = madridToday();
form.addEventListener('input', render);
form.addEventListener('change', event => {
  if (event.target === $('gift-language')) giftLanguage = $('gift-language').value;
  render();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  reviewed = true;
  validate(true);
});
$('page-language').addEventListener('change', () => {
  language = $('page-language').value;
  localize();
});
localize();
