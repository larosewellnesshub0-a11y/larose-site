# -*- coding: utf-8 -*-
"""
Collector for the article-cover runner (2026-09-08).

Watches ~/Downloads for lrsite_art-<slug>.png, converts each to the article
cover set (1200x750 + 600x375 webp, 16:10 crop) in site/assets/img/articles/,
points the matching entry in content/articles.json at it, and moves the raw
PNG into _project/raw-images/. Run: python3 tools/collect_article_covers.py [max_minutes]
"""
import os, sys, time, glob, shutil, json
from PIL import Image, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DL = os.path.expanduser("~/Downloads")
OUT = os.path.join(ROOT, "site", "assets", "img", "articles")
RAW = os.path.join(ROOT, "_project", "raw-images")
ARTICLES = os.path.join(ROOT, "content", "articles.json")
os.makedirs(RAW, exist_ok=True); os.makedirs(OUT, exist_ok=True)

def crop(im, tw, th):
    w, h = im.size; target = tw / th
    if w / h > target:
        nw = int(h * target); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / target); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    return im

def process(src, slug):
    im = Image.open(src).convert("RGB")
    im = crop(im, 16, 10)
    im = ImageEnhance.Color(im).enhance(0.96)
    im.resize((1200, 750), Image.LANCZOS).save(os.path.join(OUT, slug + ".webp"), "WEBP", quality=84, method=6)
    im.resize((600, 375), Image.LANCZOS).save(os.path.join(OUT, slug + "-600.webp"), "WEBP", quality=82, method=6)
    data = json.load(open(ARTICLES, encoding="utf-8"))
    hit = False
    for a in data["articles"]:
        if a["slug"] == slug:
            a["image"] = "assets/img/articles/%s.webp" % slug
            a.pop("imagePlaceholder", None)
            hit = True
    if hit:
        with open(ARTICLES, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2); f.write("\n")
    return hit

def main():
    limit = float(sys.argv[1]) * 60 if len(sys.argv) > 1 else 2 * 3600
    t0 = time.time(); seen = set(); n = 0
    while time.time() - t0 < limit:
        for f in sorted(glob.glob(os.path.join(DL, "lrsite_art-*.png"))):
            if f in seen: continue
            s1 = os.path.getsize(f); time.sleep(1.5)
            if os.path.getsize(f) != s1 or s1 < 50000: continue
            slug = os.path.basename(f)[len("lrsite_art-"):-4]
            try:
                hit = process(f, slug)
                shutil.move(f, os.path.join(RAW, os.path.basename(f)))
                n += 1; print("[collect] %s -> articles/%s.webp (%s)" % (slug, slug, "linked" if hit else "NO ENTRY"), flush=True)
            except Exception as e:
                print("[collect] FAILED %s: %s" % (slug, e), flush=True)
            seen.add(f)
        time.sleep(15)
    print("[collect] finished, %d files" % n, flush=True)

if __name__ == "__main__":
    main()
