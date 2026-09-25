import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/hanken-grotesk';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './style.css';

// The terminal ships with its full text in the HTML (no-JS and crawlers see it); JS retypes it on scroll.
  const lines = [
    ['p', '$ '], ['v', 'whoami\n'],
    ['k', 'name     '], ['v', 'Afif Zuhdi\n'],
    ['k', 'role     '], ['v', 'Back-end · Full-stack dev\n'],
    ['k', 'exp      '], ['v', '3 years freelance\n'],
    ['k', 'company  '], ['v', 'Iqbal Media Enterprise\n'],
    ['k', 'study    '], ['v', 'CS (Hons) Networking, 2027\n'],
    ['k', 'based    '], ['v', 'Alor Setar, Kedah\n'],
    ['k', 'speaks   '], ['v', 'EN · BM · ID · 日本語 · 中文\n\n'],
    ['p', '$ '], ['v', 'cat motto.txt\n'],
    ['c', '"What you give, you will get back more."\n\n'],
    ['p', '$ ']
  ];
  const el = document.getElementById('term');
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const render = (upto) => { let out = '', n = 0; for (const [c, t] of lines) { const take = t.slice(0, Math.max(0, upto - n)); n += t.length; if (take) out += `<span class="${c}">${esc(take)}</span>`; if (n >= upto) break; } el.innerHTML = out + '<span class="cursor"></span>'; };
  const total = lines.reduce((a, [, t]) => a + t.length, 0);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) render(total);
  else {
    render(0);
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); let i = 0; (function step() { i += 2; render(i); if (i < total) setTimeout(step, 26); })(); }, { threshold: .4 });
    io.observe(el);
  }
  document.querySelectorAll('.card').forEach(t => t.addEventListener('pointermove', e => {
    const r = t.getBoundingClientRect(); t.style.setProperty('--x', (e.clientX - r.left) + 'px'); t.style.setProperty('--y', (e.clientY - r.top) + 'px');
  }));

// Remember an explicit language choice; the inline head script honours it on the next visit.
document.querySelectorAll('a[data-lang]').forEach((a) => a.addEventListener('click', () => {
  try { localStorage.setItem('lang', a.dataset.lang); } catch (e) {}
}));

// Picture protection (his call, 2026-09-26): no right-click menu or drag on pictures. Stops casual
// saving only — a screenshot still works. Text is deliberately left selectable.
document.addEventListener('contextmenu', (e) => { if (e.target.closest?.('img, .frame')) e.preventDefault(); });
document.addEventListener('dragstart', (e) => { if (e.target.closest?.('img, .frame')) e.preventDefault(); });
