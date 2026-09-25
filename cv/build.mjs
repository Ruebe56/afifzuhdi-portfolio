// Builds cv/out/Afif-Zuhdi-Resume.pdf (1 page) and cv/out/Afif-Zuhdi-CV.pdf (2 pages)
// from cv/content.mjs, printed through headless Edge.
//   node cv/build.mjs          → HTML + PDF
//   node cv/build.mjs --html   → HTML only (for previewing in a browser)
import { writeFileSync, mkdirSync, existsSync, rmSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { person, profile, education, experience, projects, skills, languages } from './content.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'out');
mkdirSync(out, { recursive: true });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fonts = '../node_modules/@fontsource-variable';

const css = `
@font-face { font-family: "Hanken"; src: url(${fonts}/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2) format("woff2"); font-weight: 100 900; }
@font-face { font-family: "Bricolage"; src: url(${fonts}/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2) format("woff2"); font-weight: 200 800; }
@font-face { font-family: "Plex Mono"; src: url(../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2) format("woff2"); font-weight: 500; }
@page { size: A4; margin: 0; }
:root { --ink: #16181c; --muted: #555a63; --dim: #80848c; --gold: #a0701a; --line: #e4e0d6; --tint: #faf7f0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font: 400 9.6pt/1.45 "Hanken", system-ui, sans-serif; color: var(--ink); background: #fff; }
.page { width: 210mm; height: 297mm; padding: 13mm 15mm 12mm; overflow: hidden; position: relative; page-break-after: always; break-after: page; }
.page:last-child { page-break-after: auto; break-after: auto; }
.page::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 2.2mm; background: var(--gold); }
a { color: inherit; text-decoration: none; }
header { display: flex; gap: 6mm; align-items: center; padding-bottom: 4.2mm; border-bottom: 1px solid var(--line); margin-bottom: 4mm; }
header .id { flex: 1; }
h1 { font: 700 24pt/1 "Bricolage", sans-serif; letter-spacing: -0.03em; }
.title { font: 600 11.5pt/1.3 "Hanken", sans-serif; color: var(--gold); margin-top: 1.6mm; }
.sub { color: var(--muted); font-size: 9.2pt; }
.contact { display: flex; flex-wrap: wrap; gap: 0.6mm 4.5mm; margin-top: 2.4mm; font-size: 8.6pt; color: var(--muted); }
.contact span b { color: var(--ink); font-weight: 600; }
.avail { display: inline-block; margin-top: 2.2mm; font: 500 7.6pt/1 "Plex Mono", monospace; letter-spacing: .04em; text-transform: uppercase; color: var(--gold); border: 1px solid #e2cfa6; background: var(--tint); padding: 1.3mm 2.2mm; border-radius: 1.2mm; }
.photo { width: 31mm; height: 31mm; border-radius: 50%; background: radial-gradient(circle at 50% 35%, #fbf3e2, #efe2c6); overflow: hidden; flex: none; border: 1px solid #e2cfa6; }
.photo img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 12%; }
section { margin-top: 3.6mm; }
h2 { display: flex; align-items: center; gap: 2.5mm; font: 500 7.8pt/1 "Plex Mono", monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--gold); margin-bottom: 2.2mm; }
h2::after { content: ""; flex: 1; height: 1px; background: var(--line); }
p.lead { color: #2c2f35; }
.item { margin-bottom: 2.6mm; break-inside: avoid; }
.item:last-child { margin-bottom: 0; }
.row { display: flex; justify-content: space-between; align-items: baseline; gap: 4mm; }
h3 { font: 650 10.2pt/1.3 "Hanken", sans-serif; }
.org { color: var(--muted); font-weight: 500; }
.when { font: 500 7.8pt/1.3 "Plex Mono", monospace; color: var(--dim); white-space: nowrap; }
ul { margin: 0.8mm 0 0 4mm; }
li { margin-bottom: 0.5mm; padding-left: 0.6mm; }
li::marker { color: var(--gold); }
.stack { font: 500 7.6pt/1.3 "Plex Mono", monospace; color: var(--gold); }
.proj p { margin-top: 0.5mm; color: #2c2f35; }
.course { margin-top: 0.7mm; font-size: 8.8pt; color: var(--muted); }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.8mm 6mm; }
.sk b { display: block; font-weight: 650; font-size: 9pt; }
.sk span { color: #2c2f35; }
.langs { display: flex; flex-wrap: wrap; gap: 1mm 5mm; }
.langs span b { font-weight: 650; }
.langs span i { font-style: normal; color: var(--muted); }
dl { display: grid; grid-template-columns: 30mm 1fr; gap: 0.8mm 3mm; }
dt { color: var(--muted); }
body.tight { font-size: 9.1pt; line-height: 1.38; }
body.tight .page { padding: 11mm 14mm 9mm 15mm; }
body.tight h1 { font-size: 21pt; }
body.tight section { margin-top: 2.7mm; }
body.tight header { padding-bottom: 3.2mm; margin-bottom: 2.6mm; }
body.tight .item { margin-bottom: 1.9mm; }
body.tight h2 { margin-bottom: 1.6mm; }
body.tight li { margin-bottom: 0.2mm; }
.skl { display: grid; grid-template-columns: 34mm 1fr; gap: 0.6mm 3mm; }
.skl b { font-weight: 650; }
.foot { position: absolute; left: 15mm; right: 15mm; bottom: 7mm; display: flex; justify-content: space-between; font: 500 7pt/1 "Plex Mono", monospace; color: var(--dim); }
`;

const contactLine = () => `
  <div class="contact">
    <span>${esc(person.location)}</span>
    <span><a href="${person.phoneHref}"><b>${esc(person.phone)}</b></a></span>
    <span><a href="mailto:${person.email}"><b>${esc(person.email)}</b></a></span>
    <span><a href="https://www.${person.web}/">${esc(person.web)}</a></span>
    <span><a href="https://${person.github}">${esc(person.github)}</a></span>
    <span><a href="https://www.${person.linkedin}">LinkedIn</a></span>
  </div>`;

const header = (withPhoto) => `
  <header>
    <div class="id">
      <h1>${esc(person.name)}</h1>
      <div class="title">${esc(person.title)}</div>
      <div class="sub">${esc(person.subtitle)}</div>
      ${contactLine()}
      <div class="avail">${esc(person.availability)}</div>
    </div>
    ${withPhoto ? `<div class="photo"><img src="${person.photo}" alt="${esc(person.short)}"></div>` : ''}
  </header>`;

const eduBlock = (full) => `
  <section><h2>Education</h2>
    ${education.map((e) => `
      <div class="item">
        <div class="row"><h3>${esc(e.what)}</h3><span class="when">${esc(e.when)}</span></div>
        <div class="org">${esc(e.where)}</div>
        ${full && e.coursework ? `<div class="course">Relevant coursework: ${e.coursework.map(esc).join(' · ')}</div>` : ''}
      </div>`).join('')}
  </section>`;

const xpBlock = (kind) => `
  <section><h2>Experience</h2>
    ${experience.filter((x) => kind === 'cv' || !x.cvOnly).map((x) => `
      <div class="item">
        <div class="row"><h3>${esc(x.role)} <span class="org">· ${esc(x.org)}, ${esc(x.where)}</span></h3><span class="when">${esc(x.when)}</span></div>
        <ul>${x.bullets[kind].map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
      </div>`).join('')}
  </section>`;

const projBlock = (kind) => `
  <section><h2>${kind === 'cv' ? 'Projects' : 'Selected projects'}</h2>
    ${projects.filter((p) => kind === 'cv' || !p.cvOnly).map((p) => `
      <div class="item proj">
        <div class="row"><h3>${esc(p.name)}</h3><span class="stack">${esc(p.stack)}</span></div>
        ${kind === 'cv' ? `<ul>${p.cv.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : `<p>${esc(p.resume)}</p>`}
      </div>`).join('')}
  </section>`;

const skillsBlock = () => `
  <section><h2>Skills</h2>
    <div class="grid">${skills.map((s) => `<div class="sk"><b>${esc(s.group)}</b><span>${s.items.map(esc).join(' · ')}</span></div>`).join('')}</div>
  </section>`;

// Resume: one labelled line per group, languages included — the grid form is too tall for one page.
const skillsCompact = () => `
  <section><h2>Skills &amp; languages</h2>
    <div class="skl">${skills.map((s) => `<b>${esc(s.group)}</b><span>${s.items.map(esc).join(' · ')}</span>`).join('')}<b>Languages</b><span>${languages.map((l) => `${esc(l.name)} (${esc(l.level.toLowerCase())})`).join(' · ')}</span></div>
  </section>`;

const langBlock = () => `
  <section><h2>Languages</h2>
    <div class="langs">${languages.map((l) => `<span><b>${esc(l.name)}</b> <i>— ${esc(l.level)}</i></span>`).join('')}</div>
  </section>`;

const personalBlock = () => `
  <section><h2>Personal details</h2>
    <dl>
      <dt>Full name</dt><dd>${esc(person.name)}</dd>
      <dt>Nationality</dt><dd>${esc(person.nationality)}</dd>
      <dt>Based in</dt><dd>${esc(person.location)}</dd>
      <dt>Portfolio</dt><dd><a href="https://www.${person.web}/">www.${esc(person.web)}</a></dd>
      <dt>LinkedIn</dt><dd><a href="https://www.${person.linkedin}">www.${esc(person.linkedin)}</a></dd>
      <dt>References</dt><dd>Available upon request</dd>
    </dl>
  </section>`;

const doc = (title, pages, cls = '') => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${css}</style></head>
<body class="${cls}">${pages.map((p) => `<div class="page">${p}</div>`).join('')}</body></html>`;

const foot = (label, n, total) => `<div class="foot"><span>${esc(person.short)} · ${label}</span><span>${n} / ${total}</span></div>`;

const resumeHtml = doc(`${person.short} — Resume`, [
  header(false)
  + `<section><h2>Profile</h2><p class="lead">${esc(profile.resume)}</p></section>`
  + eduBlock(false) + xpBlock('resume') + projBlock('resume') + skillsCompact(),
], 'tight');

const cvHtml = doc(`${person.short} — Curriculum Vitae`, [
  header(true)
  + `<section><h2>Profile</h2><p class="lead">${esc(profile.cv)}</p></section>`
  + eduBlock(true) + xpBlock('cv') + langBlock() + foot('Curriculum Vitae', 1, 2),
  projBlock('cv') + skillsBlock() + personalBlock() + foot('Curriculum Vitae', 2, 2),
]);

const targets = [
  ['resume', resumeHtml, 'Afif-Zuhdi-Resume.pdf'],
  ['cv', cvHtml, 'Afif-Zuhdi-CV.pdf'],
];

for (const [name, html] of targets) writeFileSync(join(here, `${name}.html`), html, 'utf8');
if (process.argv.includes('--html')) process.exit(0);

// Renderer: Chrome is not installed on this machine; Edge is the known-good headless renderer.
// A missing renderer must delete stale PDFs and fail — never leave yesterday's PDF beside today's HTML.
const candidates = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];
const browser = candidates.find(existsSync);
if (!browser) {
  for (const [, , pdf] of targets) rmSync(join(out, pdf), { force: true });
  console.error('No Chrome/Edge found — stale PDFs removed, aborting.');
  process.exit(1);
}

const profileDir = join(tmpdir(), `cv-edge-${process.pid}`);
for (const [name, , pdf] of targets) {
  const dest = join(out, pdf);
  rmSync(dest, { force: true });
  execFileSync(browser, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-pdf-header-footer',
    `--user-data-dir=${profileDir}`, '--virtual-time-budget=4000',
    `--print-to-pdf=${dest}`, pathToFileURL(join(here, `${name}.html`)).href,
  ], { stdio: 'ignore', timeout: 90000 });
  if (!existsSync(dest) || readFileSync(dest).length < 5000) {
    console.error(`${pdf}: not written`);
    process.exit(1);
  }
  console.log(`${pdf}: ${readFileSync(dest).length} B`);
}
rmSync(profileDir, { recursive: true, force: true });
