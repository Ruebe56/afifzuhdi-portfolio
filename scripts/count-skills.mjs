// Counts how many Selected-work cards use each skill and writes the number onto its chip in index.html.
// The cards' data-tech lists are the source; every tech named there must have a chip, or the build fails.
import { readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'node-html-parser';

const html = readFileSync('index.html', 'utf8');
const root = parse(html, { comment: true });
const fail = (msg) => { console.error('count-skills: ' + msg); process.exit(1); };

const counts = new Map();
const cards = root.querySelectorAll('.work [data-tech]');
if (!cards.length) fail('no .work cards with data-tech');
for (const card of cards) {
  for (const t of card.getAttribute('data-tech').split(',').map((x) => x.trim()).filter(Boolean)) {
    counts.set(t, (counts.get(t) || 0) + 1);
  }
}

const seen = new Set();
for (const chip of root.querySelectorAll('.skills .chips span')) {
  chip.querySelector('b.n')?.remove();
  const name = chip.text.trim();
  const n = counts.get(name);
  chip.set_content(n ? `${name} <b class="n">${n}</b>` : name);
  if (n) seen.add(name);
}
const missing = [...counts.keys()].filter((t) => !seen.has(t));
if (missing.length) fail(`tech with no skill chip: ${missing.join(', ')}`);

const out = root.toString();
if (out !== html) writeFileSync('index.html', out);
console.log(`count-skills: ${counts.size} skills counted across ${cards.length} projects`);
