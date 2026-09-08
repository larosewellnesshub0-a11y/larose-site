# -*- coding: utf-8 -*-
"""
Branded placeholder artwork, generated locally.

The point of these is to let the whole platform be previewed without any
empty frames — while remaining *unmistakably* placeholders. They are drawn,
not photographic, and each carries a label. Nothing here can be mistaken for
a real photograph of the clinic, a real doctor or a real patient result.

Doctor placeholders in particular are deliberately a monogram in an arch, not
a generated face: a fabricated portrait on a clinic site is a claim about who
works there.

Run:  python tools/make_placeholders.py
"""
import os, math, io
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "site", "assets", "img")

# brand palette
OLIVE       = (142, 139, 99)
OLIVE_DEEP  = (51, 53, 36)
OLIVE_LIGHT = (231, 230, 207)
SAGE        = (214, 212, 173)
CHAMPAGNE   = (212, 183, 147)
ROSE        = (203, 133, 135)
PAPER       = (251, 249, 244)
CREAM       = (244, 241, 232)


def grad(size, top, bottom):
    """Vertical gradient base."""
    w, h = size
    g = Image.new("RGB", (1, h))
    px = g.load()
    for y in range(h):
        f = y / max(h - 1, 1)
        px[0, y] = tuple(round(top[i] + (bottom[i] - top[i]) * f) for i in range(3))
    return g.resize(size, Image.BICUBIC)


def arch_mask(size, inset=0.0):
    """The brand's arch: a rounded top on straight sides."""
    w, h = size
    m = Image.new("L", (w * 2, h * 2), 0)
    d = ImageDraw.Draw(m)
    ix = int(w * 2 * inset)
    iy = int(h * 2 * inset)
    W, H = w * 2 - ix * 2, h * 2 - iy * 2
    r = W // 2
    d.ellipse([ix, iy, ix + W, iy + W], fill=255)
    d.rectangle([ix, iy + r, ix + W, iy + H], fill=255)
    return m.resize(size, Image.LANCZOS)


def sprig(draw, cx, cy, scale, colour, alpha=70):
    """A small olive sprig, the brand's ornament. Leaves are thin ellipses on
    an alternating stem — drawn small and faint, as a texture not a motif."""
    n = 8
    pts = []
    for i in range(n + 1):
        t = i / n
        pts.append((cx + math.sin(t * 2.2) * 12 * scale, cy - t * 105 * scale))
    draw.line(pts, fill=colour + (alpha + 25,), width=max(1, int(1.6 * scale)))
    for i in range(1, n):
        t = i / n
        x, y = pts[i]
        for sgn in (-1, 1):
            lx = x + sgn * 17 * scale * (1 - t * 0.4)
            ly = y - 3 * scale
            rx, ry = 12 * scale * (1 - t * 0.35), 4.6 * scale
            draw.ellipse([lx - rx, ly - ry, lx + rx, ly + ry], fill=colour + (alpha,))


def draw_arch(d, box, colour, width):
    """The brand arch outline: a semicircular head on two straight legs."""
    x0, y0, x1, y1 = box
    w = x1 - x0
    r = w / 2
    d.arc([x0, y0, x1, y0 + w], 180, 360, fill=colour, width=width)
    d.line([(x0, y0 + r), (x0, y1)], fill=colour, width=width)
    d.line([(x1, y0 + r), (x1, y1)], fill=colour, width=width)


def texture(im, strength=6):
    """Fine grain, so a flat fill does not read as digital."""
    w, h = im.size
    noise = Image.effect_noise((w, h), 20).convert("L")
    return Image.blend(im, Image.merge("RGB", [noise] * 3), strength / 255.0)


def frame(size, kind, seed=0):
    """Base plate for every placeholder."""
    w, h = size
    if kind == "dark":
        base = grad(size, OLIVE_DEEP, (40, 42, 29))
    elif kind == "sage":
        base = grad(size, OLIVE_LIGHT, SAGE)
    else:
        base = grad(size, PAPER, CREAM)
    base = base.convert("RGBA")

    ov = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    ink = CHAMPAGNE if kind == "dark" else OLIVE
    a = 60 if kind == "dark" else 48
    lw = max(1, w // 380)

    # three concentric arches, standing on the base line
    for i, sc in enumerate((0.86, 0.66, 0.46)):
        aw = w * sc * 0.44
        ah = h * sc
        cx = w * (0.5 + ((seed % 3) - 1) * 0.05)
        draw_arch(d, [cx - aw / 2, h - ah, cx + aw / 2, h], ink + (max(18, a - i * 14),), lw)

    sprig(d, w * 0.13, h * 0.95, w / 950, ink, a)
    sprig(d, w * 0.88, h * 0.99, w / 1200, ink, max(20, a - 18))

    return texture(Image.alpha_composite(base, ov).convert("RGB"), 4)


def save(im, rel, widths):
    p = os.path.join(IMG, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    made = []
    for wpx in widths:
        hpx = round(im.size[1] * wpx / im.size[0])
        suffix = "" if wpx == max(widths) else "-%d" % wpx
        q = p.replace(".webp", "%s.webp" % suffix)
        im.resize((wpx, hpx), Image.LANCZOS).save(q, "WEBP", quality=82, method=6)
        made.append(os.path.relpath(q, os.path.join(ROOT, "site")).replace(os.sep, "/"))
    return made


def monogram(size, initials, kind="sage"):
    """Doctor placeholder: an arch with a monogram. Never a generated face."""
    w, h = size
    base = frame(size, kind, seed=sum(ord(c) for c in initials))
    d = ImageDraw.Draw(base)
    # a simple drawn bust silhouette inside the arch
    cx, cy = w // 2, int(h * 0.62)
    r = int(w * 0.13)
    ink = (255, 255, 255) if kind == "dark" else OLIVE_DEEP
    d.ellipse([cx - r, cy - r * 2, cx + r, cy], outline=ink, width=max(2, w // 180))
    d.arc([cx - int(r * 1.9), cy + int(r * 0.1), cx + int(r * 1.9), cy + int(r * 3.2)],
          200, 340, fill=ink, width=max(2, w // 180))
    return base


def main():
    made = []

    # ---- doctor placeholders (4 sample doctors + any without a portrait) ---
    for slug, initials in [("sample-general-surgeon", "GS"),
                           ("sample-bariatric-surgeon", "BS"),
                           ("sample-dermatologist", "DR"),
                           ("sample-pediatrician", "PD"),
                           ("thoraya-al-alfy", "TA")]:
        im = monogram((900, 1125), initials, "sage")
        made += save(im, "doctors/%s.webp" % slug, [900, 450])

    # ---- branch placeholders for the two announced branches ---------------
    for slug in ("fifth-settlement", "sheikh-zayed"):
        im = frame((1600, 900), "dark", seed=len(slug))
        made += save(im, "clinic/%s-placeholder.webp" % slug, [1600, 800])

    # ---- before / after placeholder pairs ---------------------------------
    for i in range(1, 7):
        for side in ("before", "after"):
            im = frame((1200, 900), "paper" if side == "before" else "sage", seed=i)
            made += save(im, "before-after/sample-%d-%s.webp" % (i, side), [1200, 600])

    # ---- article cover placeholders ---------------------------------------
    for i in range(1, 7):
        im = frame((1200, 750), ["paper", "sage", "dark"][i % 3], seed=i * 7)
        made += save(im, "articles/cover-%d.webp" % i, [1200, 600])

    # ---- generic specialty fallback ---------------------------------------
    im = frame((1200, 750), "sage", seed=99)
    made += save(im, "specialties/_placeholder.webp", [1200, 700])

    print("generated %d files" % len(made))
    for m in made[:8]:
        print("  ", m)
    print("   ...")


if __name__ == "__main__":
    main()
