# -*- coding: utf-8 -*-
"""
Collect the images the in-page ChatGPT runner drops into ~/Downloads.

The runner names every file `lrsite_<id>.png`. That prefix matters: the same
Downloads folder holds ~94 `lr_*.png` from the client's earlier recipe-book and
reels jobs, and those must never be touched. Only `lrsite_` is ours.

Each id maps to a destination, a target aspect and a set of widths. Images are
centre-cropped to the target aspect (never squashed), resized down with LANCZOS,
and written as WebP. The source PNG is moved to `_project/raw-images/` so a
re-run does not reprocess it and so the originals stay available.

Run:  python tools/collect_new_images.py
"""
import os, re, shutil, glob
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "site", "assets", "img")
RAW = os.path.join(ROOT, "_project", "raw-images")
DOWNLOADS = os.path.join(os.path.expanduser("~"), "Downloads")

# prefix -> (subfolder, aspect w/h, widths to emit)
ROUTES = {
    "sp":    ("specialties", 1200 / 750.0, [1200, 700]),
    "hero":  ("banners",     1600 / 900.0, [1600, 900]),
    "dg":    ("digital",     1200 / 800.0, [1200, 600]),
    "doc":   ("doctors",      900 / 1125.0, [900, 450]),
    "ba":    ("before-after", 1200 / 900.0, [1200, 600]),
    "art":   ("articles",     1200 / 750.0, [1200, 600]),
    "kc":    ("knowledge",    1200 / 750.0, [1200, 600]),
    "branch": ("clinic",      1600 / 900.0, [1600, 800]),
}


def crop_to(im, aspect):
    """Centre crop to the target aspect ratio. Never distorts."""
    w, h = im.size
    if w / h > aspect:                       # too wide, trim the sides
        nw = int(round(h * aspect))
        x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = int(round(w / aspect))              # too tall, trim top and bottom
    # bias slightly above centre: still lifes put their subject a touch high
    y = int((h - nh) * 0.45)
    return im.crop((0, y, w, y + nh))


def main():
    os.makedirs(RAW, exist_ok=True)
    files = sorted(glob.glob(os.path.join(DOWNLOADS, "lrsite_*.png")))
    if not files:
        print("nothing new in Downloads")
        return

    done, skipped = [], []
    for src in files:
        name = os.path.basename(src)
        m = re.match(r"lrsite_([a-z]+)-(.+)\.png$", name)
        if not m:
            skipped.append((name, "unrecognised name"))
            continue
        prefix, slug = m.group(1), m.group(2)
        if prefix not in ROUTES:
            skipped.append((name, "no route for prefix " + prefix))
            continue
        folder, aspect, widths = ROUTES[prefix]

        try:
            im = Image.open(src).convert("RGB")
        except Exception as e:
            skipped.append((name, "unreadable: %s" % e))
            continue
        if min(im.size) < 400:
            skipped.append((name, "too small %dx%d" % im.size))
            continue

        im = crop_to(im, aspect)
        out_dir = os.path.join(IMG, folder)
        os.makedirs(out_dir, exist_ok=True)
        top = max(widths)
        for wpx in widths:
            hpx = int(round(im.size[1] * wpx / im.size[0]))
            suffix = "" if wpx == top else "-%d" % wpx
            p = os.path.join(out_dir, "%s%s.webp" % (slug, suffix))
            im.resize((wpx, hpx), Image.LANCZOS).save(p, "WEBP", quality=88, method=6)
        done.append("%s/%s.webp" % (folder, slug))
        shutil.move(src, os.path.join(RAW, name))

    print("collected %d" % len(done))
    for d in done:
        print("  ", d)
    for n, why in skipped:
        print("  SKIP", n, "-", why)


if __name__ == "__main__":
    main()
