// One-off/maintenance: tag every translatable element in index.html with data-i18n and dump English to i18n/en.json.
import { readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'node-html-parser';

const SELECTORS = [
  'header.nav nav a',
  '.hero .kicker', '.hero h1', '.hero .lead', '.hero .actions a', '.facts span', '.badge span', '.badge b',
  '.sec-k', 'main h2',
  '#about .about p',
  '.services .card h3', '.services .card p', '.services__note',
  '.role .yr', '.role .org', '.role h3', '.role > div > p', '.role li', '.role .chips span',
  '.work .kind', '.work .card h3', '.work .card > p', '.work .chips span', '.work__note',
  '.ev__y', '.ev h3', '.ev p',
  '.edu .yr', '.edu h3', '.edu p',
  '.skills h4', '#skills .card > h4', '.lang b', '.lang span',
  '.mission blockquote', '.goals h3', '.goals p',
  '.cta p:not(.sec-k)', '.cta .btn',
  'footer span',
];
const html = readFileSync('index.html', 'utf8');
const root = parse(html, { comment: true });
const en = {};
let n = 0;
for (const sel of SELECTORS) {
  for (const el of root.querySelectorAll(sel)) {
    if (el.getAttribute('data-i18n')) continue;
    const key = 't' + String(++n).padStart(3, '0');
    el.setAttribute('data-i18n', key);
  }
}
for (const el of root.querySelectorAll('[data-i18n]')) en[el.getAttribute('data-i18n')] = el.innerHTML.trim();
writeFileSync('index.html', root.toString());
writeFileSync('i18n/en.json', JSON.stringify(en, null, 2) + '\n');
console.log('tagged', Object.keys(en).length);
