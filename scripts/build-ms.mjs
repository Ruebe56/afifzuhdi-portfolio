// Generates ms/index.html (Malay) from index.html (English, the source of truth) + i18n/ms.json.
// Every [data-i18n] element must have a Malay entry, and every entry must be used, or the build fails.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { parse } from 'node-html-parser';

const SITE = 'https://www.afifzuhdi.com/';
const ms = JSON.parse(readFileSync('i18n/ms.json', 'utf8'));
const root = parse(readFileSync('index.html', 'utf8'), { comment: true });
const fail = (msg) => { console.error('build-ms: ' + msg); process.exit(1); };

// 1) body text
const used = new Set();
for (const el of root.querySelectorAll('[data-i18n]')) {
  const key = el.getAttribute('data-i18n');
  if (!(key in ms)) fail(`missing Malay text for ${key}`);
  el.set_content(ms[key]);
  used.add(key);
}
const unused = Object.keys(ms).filter((k) => !used.has(k));
if (unused.length) fail(`unused Malay keys: ${unused.join(', ')}`);

// 2) head + attributes
const head = {
  title: 'Afif Zuhdi | Pembangun Back-End & Full-Stack · Kedah, Malaysia',
  description: 'Afif Zuhdi ialah pembangun back-end dan full-stack di Alor Setar, Kedah, dengan 3 tahun pengalaman freelance membina laman web, aplikasi web, sistem perniagaan dan automasi AI. Pengasas bersama Iqbal Media Enterprise.',
  social: 'Pembangun back-end dan full-stack di Kedah, Malaysia. Laman web, aplikasi web, sistem perniagaan dan automasi AI.',
};
root.querySelector('html').setAttribute('lang', 'ms');
root.querySelector('title').set_content(head.title);
const setMeta = (sel, v) => { const m = root.querySelector(sel); if (!m) fail(`no ${sel}`); m.setAttribute('content', v); };
setMeta('meta[name="description"]', head.description);
setMeta('meta[property="og:title"]', 'Afif Zuhdi | Pembangun Back-End & Full-Stack');
setMeta('meta[name="twitter:title"]', 'Afif Zuhdi | Pembangun Back-End & Full-Stack');
setMeta('meta[property="og:description"]', head.social);
setMeta('meta[name="twitter:description"]', head.social);
setMeta('meta[property="og:locale"]', 'ms_MY');
setMeta('meta[property="og:url"]', SITE + 'ms/');
setMeta('meta[property="og:image:alt"]', 'Afif Zuhdi, Pembangun Back-End & Full-Stack');
root.querySelector('link[rel="canonical"]').setAttribute('href', SITE + 'ms/');
const photo = root.querySelector('.frame img');
photo.setAttribute('alt', 'Afif Zuhdi, pembangun back-end dan full-stack dari Kedah, berpakaian sut gelap dan tali leher');

// JSON-LD: this page is the Malay ProfilePage of the same Person
const ld = root.querySelector('script[type="application/ld+json"]');
const graph = JSON.parse(ld.textContent);
const page = graph['@graph'].find((n) => n['@type'] === 'ProfilePage');
Object.assign(page, { '@id': SITE + 'ms/#profile', url: SITE + 'ms/', name: head.title, inLanguage: 'ms' });
ld.set_content('\n  ' + JSON.stringify(graph) + '\n  ');

// language switch points back to English
const sw = root.querySelector('a[data-lang]');
if (!sw) fail('no language switch');
sw.setAttribute('href', '../'); sw.setAttribute('hreflang', 'en'); sw.setAttribute('lang', 'en');
sw.setAttribute('data-lang', 'en'); sw.setAttribute('aria-label', 'Read in English'); sw.set_content('EN');

// 3) the page lives one folder deeper: ./x -> ../x (anchors and absolute URLs untouched)
for (const el of root.querySelectorAll('[src], [href]')) {
  for (const attr of ['src', 'href']) {
    const v = el.getAttribute(attr);
    if (v && v.startsWith('./') && el !== sw) el.setAttribute(attr, '../' + v.slice(2));
  }
}

mkdirSync('ms', { recursive: true });
writeFileSync('ms/index.html', root.toString());
console.log(`build-ms: ms/index.html written (${used.size} texts)`);
