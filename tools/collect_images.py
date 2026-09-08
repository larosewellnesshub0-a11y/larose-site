# -*- coding: utf-8 -*-
"""
Background collector for the ChatGPT image runner.

Watches ~/Downloads for lr_<id>.png, converts each to a web-ready set of webp
files at the right aspect, and files it into site/assets/img/.
Runs until the queue is done or it is killed.

Run:  python tools/collect_images.py [max_minutes]
"""
import os, sys, time, glob, shutil
from PIL import Image, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DL = os.path.join(os.path.expanduser("~"), "Downloads")
IMG = os.path.join(ROOT, "site", "assets", "img")
RAW = os.path.join(ROOT, "_project", "raw-images")
os.makedirs(RAW, exist_ok=True)

# where each id belongs, and the aspect it is cropped to
ROUTE = {
    "hero-clinic":        ("clinic",      (16, 9),  [2000, 1200]),
    "about-story":        ("clinic",      (16, 9),  [1600, 900]),
    "about-technology":   ("clinic",      (16, 9),  [1600, 900]),
    "patients-first-visit": ("clinic",    (16, 9),  [1600, 900]),
    "digital-recipe-book": ("products",   (1, 1),   [1200, 700]),
    "digital-online":     ("products",    (16, 9),  [1600, 900]),
}
for s in ["clinical-nutrition", "weight-management", "body-contouring", "internal-medicine",
          "general-surgery", "bariatric-surgery", "dermatology", "pediatrics"]:
    ROUTE["sp-" + s] = ("specialties", (16, 10), [1200, 700])


def crop_to(im, ratio):
    tw, th = ratio
    w, h = im.size
    target = tw / th
    if w / h > target:
        nw = int(h * target)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / target)
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    return im


def process(src, ident):
    folder, ratio, widths = ROUTE.get(ident, ("misc", (16, 9), [1600, 900]))
    out_dir = os.path.join(IMG, folder)
    os.makedirs(out_dir, exist_ok=True)
    im = Image.open(src).convert("RGB")
    im = crop_to(im, ratio)
    # a light warm grade so generated frames sit with the clinic photographs
    im = ImageEnhance.Color(im).enhance(0.96)
    r, g, b = im.split()
    r = r.point(lambda p: min(255, int(p * 1.012 + 2)))
    b = b.point(lambda p: min(255, int(p * 0.988)))
    im = Image.merge("RGB", (r, g, b))

    name = ident.replace("sp-", "")
    made = []
    for wpx in widths:
        if im.size[0] < wpx and wpx != min(widths):
            continue
        hpx = round(im.size[1] * wpx / im.size[0])
        suffix = "" if wpx == max(widths) else "-%d" % wpx
        p = os.path.join(out_dir, "%s%s.webp" % (name, suffix))
        im.resize((wpx, hpx), Image.LANCZOS).save(p, "WEBP", quality=84, method=6)
        made.append(os.path.relpath(p, os.path.join(ROOT, "site")).replace(os.sep, "/"))
    return made


def main():
    limit = float(sys.argv[1]) * 60 if len(sys.argv) > 1 else 3 * 3600
    t0 = time.time()
    seen = set()
    while time.time() - t0 < limit:
        # Only ids this job created. ~/Downloads already holds ~94 lr_*.png
        # files from the client's earlier recipe-book and reels jobs, and
        # those must not be touched.
        for f in glob.glob(os.path.join(DL, "lr_*.png")):
            if f in seen:
                continue
            if os.path.basename(f)[3:-4] not in ROUTE:
                continue
            # wait for the download to finish writing
            s1 = os.path.getsize(f); time.sleep(1.5)
            if os.path.getsize(f) != s1:
                continue
            ident = os.path.basename(f)[3:-4]
            try:
                made = process(f, ident)
                shutil.move(f, os.path.join(RAW, os.path.basename(f)))
                seen.add(f)
                print("[collect] %-24s -> %s" % (ident, ", ".join(made)), flush=True)
            except Exception as e:
                print("[collect] FAILED %s: %s" % (ident, e), flush=True)
                seen.add(f)
        time.sleep(20)
    print("[collect] finished after %d min" % ((time.time() - t0) / 60), flush=True)


if __name__ == "__main__":
    main()
