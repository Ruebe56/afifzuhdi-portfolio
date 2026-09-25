"""Verify the built PDFs: page counts, fonts embedded, text present, and render PNG previews.
Usage: py -3 cv/check.py <preview-dir>
"""
import sys
from pathlib import Path

import fitz  # PyMuPDF

out = Path(__file__).parent / "out"
prev = Path(sys.argv[1]) if len(sys.argv) > 1 else out
prev.mkdir(parents=True, exist_ok=True)

expect = {"Afif-Zuhdi-Resume.pdf": 1, "Afif-Zuhdi-CV.pdf": 2}
# The last item of each document is included, so clipped overflow shows up as "missing".
must_have = ["Afif Zuhdi bin Suhardi", "afif.zuhdi56@gmail.com", "Wisma Darul Aman", "UiTM", "Mandarin"]
must_have_cv = ["Available upon request", "Laptop Repair", "myDay"]
ok = True
for name, pages in expect.items():
    doc = fitz.open(out / name)
    text = "".join(p.get_text() for p in doc).lower()
    fonts = sorted({f[3] for p in doc for f in p.get_fonts()})
    wanted = must_have + (must_have_cv if pages == 2 else [])
    missing = [m for m in wanted if m.lower() not in text]
    print(f"{name}: pages={doc.page_count} (want {pages}) fonts={fonts} missing={missing}")
    # Content that overflows .page is clipped by overflow:hidden, so also check each page's
    # last text block sits above the footer zone rather than trusting the page count alone.
    for i, page in enumerate(doc):
        # Word-level, not block-level: body text that collides with the footer gets merged
        # into the footer's block, so a block filter hides exactly the overlap it should catch.
        footer = {"Afif", "Zuhdi", "·", "Curriculum", "Vitae", "1", "2", "/"}
        words = page.get_text("words")
        foot_top = page.rect.height - 30
        body = [w for w in words if not (w[1] > foot_top and w[4] in footer)]
        bottom = max(w[3] for w in body) if body else 0
        print(f"  page {i+1}: lowest text at {bottom:.0f}pt of {page.rect.height:.0f}pt")
        if bottom > page.rect.height - 28:
            print("  !! text reaches the bottom margin — probably clipped")
            ok = False
        page.get_pixmap(dpi=110).save(prev / f"{Path(name).stem}-p{i+1}.png")
    if doc.page_count != pages or missing or len(fonts) < 2:
        ok = False
sys.exit(0 if ok else 1)
