// Generates the Malay pages from the English sources (the source of truth) + i18n/ms.json:
//   index.html -> ms/index.html,  lab/index.html -> ms/lab/index.html
// Every [data-i18n] element must have a Malay entry, and every entry must be used, or the build fails.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { parse } from 'node-html-parser';

const SITE = 'https://www.afifzuhdi.com/';
const ms = JSON.parse(readFileSync('i18n/ms.json', 'utf8'));
const fail = (msg) => { console.error('build-ms: ' + msg); process.exit(1); };

// 1) body text (shared dictionary: a key may be used by either page)
const used = new Set();
const translate = (root) => {
  for (const el of root.querySelectorAll('[data-i18n]')) {
    const key = el.getAttribute('data-i18n');
    if (!(key in ms)) fail(`missing Malay text for ${key}`);
    el.set_content(ms[key]);
    used.add(key);
  }
};
const setMetaOn = (root) => (sel, v) => { const m = root.querySelector(sel); if (!m) fail(`no ${sel}`); m.setAttribute('content', v); };
const switchTo = (root, href) => {
  const sw = root.querySelector('a[data-lang]');
  if (!sw) fail('no language switch');
  sw.setAttribute('href', href); sw.setAttribute('hreflang', 'en'); sw.setAttribute('lang', 'en');
  sw.setAttribute('data-lang', 'en'); sw.setAttribute('aria-label', 'Read in English'); sw.set_content('EN');
  return sw;
};

// ---- the portfolio: index.html -> ms/index.html -------------------------
const root = parse(readFileSync('index.html', 'utf8'), { comment: true });
translate(root);

// 2) head + attributes
const head = {
  title: 'Afif Zuhdi | Pembangun Back-End & Full-Stack · Kedah, Malaysia',
  description: 'Afif Zuhdi ialah pembangun back-end dan full-stack di Alor Setar, Kedah, dengan 3 tahun pengalaman freelance membina laman web, aplikasi web, sistem perniagaan dan automasi AI. Pengasas bersama Iqbal Media Enterprise.',
  social: 'Pembangun back-end dan full-stack di Kedah, Malaysia. Laman web, aplikasi web, sistem perniagaan dan automasi AI.',
};
root.querySelector('html').setAttribute('lang', 'ms');
root.querySelector('title').set_content(head.title);
const setMeta = setMetaOn(root);
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
const sw = switchTo(root, '../');

// 3) the page lives one folder deeper: ./x -> ../x (anchors and absolute URLs untouched).
//    ./lab/ stays as is: from /ms/ it already opens the Malay Lab.
for (const el of root.querySelectorAll('[src], [href]')) {
  for (const attr of ['src', 'href']) {
    const v = el.getAttribute(attr);
    if (v && v.startsWith('./') && !v.startsWith('./lab/') && el !== sw) el.setAttribute(attr, '../' + v.slice(2));
  }
}

// ---- the Lab: lab/index.html -> ms/lab/index.html -----------------------
const lab = parse(readFileSync('lab/index.html', 'utf8'), { comment: true });
translate(lab);
const labTitle = 'Makmal | Afif Zuhdi: Rakan AI & Eksperimen';
const labSocial = 'Alice, rakan AI saya, dan eksperimen di sebaliknya.';
lab.querySelector('html').setAttribute('lang', 'ms');
lab.querySelector('title').set_content(labTitle);
const setLabMeta = setMetaOn(lab);
setLabMeta('meta[name="description"]', 'Makmal Afif Zuhdi, pembangun back-end dan full-stack di Kedah, Malaysia: Alice, rakan AI yang dia gunakan setiap hari, dan eksperimen di sebaliknya.');
setLabMeta('meta[property="og:title"]', 'Makmal | Afif Zuhdi');
setLabMeta('meta[name="twitter:title"]', 'Makmal | Afif Zuhdi');
setLabMeta('meta[property="og:description"]', labSocial);
setLabMeta('meta[name="twitter:description"]', labSocial);
setLabMeta('meta[property="og:locale"]', 'ms_MY');
setLabMeta('meta[property="og:url"]', SITE + 'ms/lab/');
setLabMeta('meta[property="og:image:alt"]', 'Afif Zuhdi, Pembangun Back-End & Full-Stack');
lab.querySelector('link[rel="canonical"]').setAttribute('href', SITE + 'ms/lab/');
const labLd = lab.querySelector('script[type="application/ld+json"]');
const labPage = JSON.parse(labLd.textContent);
Object.assign(labPage, { '@id': SITE + 'ms/lab/#page', url: SITE + 'ms/lab/', name: labTitle, inLanguage: 'ms' });
labLd.set_content('\n  ' + JSON.stringify(labPage) + '\n  ');
const labSw = switchTo(lab, '../../lab/');

// one folder deeper again: ../x -> ../../x, except links to the portfolio itself (../ and ../#…),
// which from /ms/lab/ already open the Malay portfolio.
for (const el of lab.querySelectorAll('[src], [href]')) {
  for (const attr of ['src', 'href']) {
    const v = el.getAttribute(attr);
    if (!v || el === labSw || v === '../' || v.startsWith('../#')) continue;
    if (v.startsWith('../')) el.setAttribute(attr, '../' + v);
    else if (v.startsWith('./')) el.setAttribute(attr, '../' + v.slice(2));
  }
}

// ---- every key used by one page or the other ----------------------------
const unused = Object.keys(ms).filter((k) => !used.has(k));
if (unused.length) fail(`unused Malay keys: ${unused.join(', ')}`);

mkdirSync('ms/lab', { recursive: true });
writeFileSync('ms/index.html', root.toString());
writeFileSync('ms/lab/index.html', lab.toString());
console.log(`build-ms: ms/index.html + ms/lab/index.html written (${used.size} texts)`);
