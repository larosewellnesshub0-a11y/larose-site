# -*- coding: utf-8 -*-
"""
Brand artwork generator - risograph-style editorial illustration.

Why this exists
---------------
Every article was falling back to one of six identical grey plates (one of them
was reused 94 times) and five of the eight specialties shared a single generic
placeholder. That reads as an unfinished site, not a designed one.

These are *drawn*, not photographic and not "AI-looking". The technique is a
two-ink risograph print: flat brand-coloured shapes, multiplied so overlaps
darken, with a deliberate registration offset between the ink layers, ink
spread at the edges and paper grain over the top. Misregistration and grain are
what make a print read as printed rather than rendered - which is the whole
point, since the client explicitly rejected AI gradients.

Composition is seeded from the slug, so a given article always gets the same
artwork, and no two neighbouring cards look alike.

Run:  python tools/make_artwork.py
"""
import os, math, json, hashlib, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "site", "assets", "img")

# ---------------------------------------------------------------- palette ---
OLIVE = (142, 139, 99)          # #8E8B63  client brand
SAGE = (214, 212, 173)          # #D6D4AD
ROSE = (203, 133, 135)          # #CB8587
BLUSH = (237, 218, 218)         # #EDDADA
CHAMPAGNE = (212, 183, 147)     # #d4b793
OLIVE_DEEP = (62, 64, 44)       # derived, for weight
PAPER = (250, 247, 240)
PAPER_WARM = (246, 242, 232)

# Two-ink pairings. Ordered (base ink, accent ink); the accent prints on top
# and covers the smaller area, which is how a two-colour job is separated.
SCHEMES = [
    (SAGE, OLIVE),
    (BLUSH, ROSE),
    (SAGE, OLIVE_DEEP),
    (CHAMPAGNE, OLIVE),
    (BLUSH, OLIVE),
    (SAGE, ROSE),
    (CHAMPAGNE, OLIVE_DEEP),
]


def seed_of(key):
    return int(hashlib.sha1(key.encode("utf-8")).hexdigest()[:8], 16)


# ------------------------------------------------------------------ paper ---
def paper(size):
    """Warm stock with a faint vertical tone shift - never flat white."""
    w, h = size
    top, bot = PAPER, PAPER_WARM
    col = Image.new("RGB", (1, h))
    px = col.load()
    for y in range(h):
        f = y / max(h - 1, 1)
        px[0, y] = tuple(round(top[i] + (bot[i] - top[i]) * f) for i in range(3))
    return col.resize(size, Image.BICUBIC)


def grain(im, amount=9):
    """Fine paper tooth, applied as a multiply so it darkens rather than fogs."""
    w, h = im.size
    n = Image.effect_noise((w, h), 24).convert("L")
    n = n.point(lambda v: 255 - int((255 - v) * amount / 255.0))
    return ImageChops.multiply(im, Image.merge("RGB", [n] * 3))


def ink(canvas, mask, colour, opacity=0.92, offset=(0, 0), spread=1.2):
    """Print one ink layer.

    `mask` is coverage. The layer is multiplied into the canvas so that where
    two inks overlap the result darkens, exactly as overlapping transparent
    inks do on press. `offset` is the registration error.
    """
    if offset != (0, 0):
        # NOT ImageChops.offset - that scrolls the mask circularly, so a shape
        # bled off one edge reappears as a stray line on the opposite one.
        shifted = Image.new("L", mask.size, 0)
        shifted.paste(mask, offset)
        mask = shifted
    if spread:
        mask = mask.filter(ImageFilter.GaussianBlur(spread))
    if opacity < 1:
        mask = mask.point(lambda v: int(v * opacity))
    tint = Image.new("RGB", canvas.size, colour)
    return Image.composite(ImageChops.multiply(canvas, tint), canvas, mask)


# ------------------------------------------------------------ shape tools ---
def new_mask(size):
    m = Image.new("L", size, 0)
    return m, ImageDraw.Draw(m)


def arch(d, x, y, w, h, fill=None, outline=None, width=6):
    """The brand's arch: a semicircular head on straight legs."""
    r = w / 2
    if fill is not None:
        d.pieslice([x, y, x + w, y + w], 180, 360, fill=fill)
        d.rectangle([x, y + r, x + w, y + h], fill=fill)
    if outline is not None:
        d.arc([x, y, x + w, y + w], 180, 360, fill=outline, width=width)
        d.line([(x, y + r), (x, y + h)], fill=outline, width=width)
        d.line([(x + w, y + r), (x + w, y + h)], fill=outline, width=width)


def _leaf(d, x, y, length, width, angle, val):
    """One olive leaf: a lens shape swept to a point at both ends, rotated.

    Drawn as a polygon rather than an ellipse - an axis-aligned ellipse reads
    as a bead, and a row of beads looks like a caterpillar rather than a sprig.
    """
    pts = []
    steps = 14
    for i in range(steps + 1):        # upper edge, then back along the lower
        t = i / steps
        pts.append((t * length, -math.sin(t * math.pi) * width))
    for i in range(steps, -1, -1):
        t = i / steps
        pts.append((t * length, math.sin(t * math.pi) * width * 0.72))
    ca, sa = math.cos(angle), math.sin(angle)
    d.polygon([(x + px * ca - py * sa, y + px * sa + py * ca) for px, py in pts], fill=val)


def sprig(d, cx, cy, scale, val=255, leaves=9, curve=1.0):
    """Olive sprig - the clinic's own ornament, drawn as flat leaf shapes."""
    pts = []
    for i in range(leaves + 1):
        t = i / leaves
        pts.append((cx + math.sin(t * 2.3 * curve) * 16 * scale, cy - t * 128 * scale))
    d.line(pts, fill=val, width=max(2, int(2.2 * scale)), joint="curve")
    for i in range(1, leaves):
        t = i / leaves
        x, y = pts[i]
        ln = 30 * scale * (1 - t * 0.42)
        for sgn in (-1, 1):
            # leaves ride up the stem at roughly 45 degrees, one to each side
            ang = -(math.pi / 2) + sgn * 0.78
            _leaf(d, x, y, ln, 5.4 * scale * (1 - t * 0.3), ang, val)


def dotfield(d, box, step, r, val=255):
    x0, y0, x1, y1 = box
    y = y0
    row = 0
    while y < y1:
        x = x0 + (step / 2 if row % 2 else 0)
        while x < x1:
            d.ellipse([x - r, y - r, x + r, y + r], fill=val)
            x += step
        y += step
        row += 1


def rules(d, box, n, val=255, width=3):
    x0, y0, x1, y1 = box
    for i in range(n):
        y = y0 + (y1 - y0) * i / max(n - 1, 1)
        d.line([(x0, y), (x1, y)], fill=val, width=width)


# ----------------------------------------------------------- compositions ---
# Each returns (base_mask, accent_mask). Deliberately geometric and flat.

def comp_colonnade(size, rnd):
    w, h = size
    b, db = new_mask(size)
    a, da = new_mask(size)
    n = rnd.choice((3, 4, 5))
    gap = w / (n + 1.6)
    cw = gap * rnd.uniform(0.62, 0.78)
    solid = rnd.randrange(n)
    for i in range(n):
        x = gap * 0.8 + i * gap
        ah = h * rnd.uniform(0.46, 0.86)
        if i == solid:
            arch(da, x, h - ah, cw, ah, fill=255)
        else:
            arch(db, x, h - ah, cw, ah, fill=255)
    db.rectangle([0, h - max(6, h // 90), w, h], fill=255)
    return b, a


def comp_portal(size, rnd):
    w, h = size
    b, db = new_mask(size)
    a, da = new_mask(size)
    aw = w * rnd.uniform(0.34, 0.44)
    ah = h * rnd.uniform(0.74, 0.9)
    x = (w - aw) / 2 + w * rnd.uniform(-0.06, 0.06)
    db.rectangle([0, h * rnd.uniform(0.52, 0.66), w, h], fill=255)
    arch(db, x, h - ah, aw, ah, fill=255)
    inset = aw * 0.2
    arch(da, x + inset, h - ah + inset, aw - inset * 2, ah - inset, fill=255)
    sprig(da, x + aw * rnd.choice((-0.28, 1.28)), h * 0.97, w / 900, 255)
    return b, a


def comp_orchard(size, rnd):
    w, h = size
    b, db = new_mask(size)
    a, da = new_mask(size)
    r = min(w, h) * rnd.uniform(0.3, 0.4)
    cx = w * rnd.uniform(0.3, 0.72)
    cy = h * rnd.uniform(0.34, 0.48)
    db.ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
    db.rectangle([0, h * rnd.uniform(0.78, 0.86), w, h * rnd.uniform(0.80, 0.88) + h * 0.02],
                 fill=255)
    n = rnd.choice((3, 4, 5))
    for i in range(n):
        x = w * (0.12 + 0.76 * i / max(n - 1, 1))
        sprig(da, x, h * rnd.uniform(0.99, 1.06), (w / 820) * rnd.uniform(0.8, 1.25),
              255, curve=rnd.uniform(0.7, 1.4))
    return b, a


def comp_strata(size, rnd):
    w, h = size
    b, db = new_mask(size)
    a, da = new_mask(size)
    y = h * rnd.uniform(0.12, 0.24)
    while y < h:
        t = h * rnd.uniform(0.02, 0.085)
        db.rectangle([0, y, w, y + t], fill=255)
        y += t + h * rnd.uniform(0.035, 0.07)
    aw = w * rnd.uniform(0.26, 0.36)
    ah = h * rnd.uniform(0.6, 0.82)
    x = w * rnd.uniform(0.08, 0.62)
    # the arch knocks the bands out and prints in the accent instead
    arch(db, x, h - ah, aw, ah, fill=0)
    arch(da, x, h - ah, aw, ah, fill=255)
    return b, a


def comp_lattice(size, rnd):
    w, h = size
    b, db = new_mask(size)
    a, da = new_mask(size)
    aw = w * rnd.uniform(0.4, 0.52)
    ah = h * rnd.uniform(0.72, 0.9)
    x = w * rnd.uniform(0.06, 0.5)
    clip, dc = new_mask(size)
    arch(dc, x, h - ah, aw, ah, fill=255)
    field, df = new_mask(size)
    if rnd.random() < 0.5:
        dotfield(df, (0, 0, w, h), max(14, w // 34), max(3, w // 190))
    else:
        rules(df, (0, 0, w, h), rnd.choice((10, 14, 18)), width=max(3, w // 260))
    b = ImageChops.multiply(field, clip)
    arch(da, x, h - ah, aw, ah, outline=255, width=max(4, w // 190))
    sprig(da, w * rnd.choice((0.1, 0.9)), h * 1.0, w / 1000, 255)
    floor, dfl = new_mask(size)
    dfl.rectangle([0, h * rnd.uniform(0.86, 0.93), w, h], fill=255)
    b = ImageChops.lighter(b, floor)
    return b, a


def comp_bloom(size, rnd):
    w, h = size
    b, db = new_mask(size)
    a, da = new_mask(size)
    cx = w * rnd.choice((0.0, 1.0))
    cy = h * rnd.choice((0.0, 1.0))
    step = max(w, h) * rnd.uniform(0.13, 0.18)
    lw = max(4, w // 150)
    for i in range(1, 7):
        r = step * i
        db.ellipse([cx - r, cy - r, cx + r, cy + r], outline=255, width=lw)
    aw = w * rnd.uniform(0.22, 0.3)
    ah = h * rnd.uniform(0.42, 0.6)
    ax = w * (0.62 if cx == 0 else 0.14)
    arch(da, ax, h - ah, aw, ah, fill=255)
    return b, a


COMPS = [comp_colonnade, comp_portal, comp_orchard, comp_strata, comp_lattice, comp_bloom]


def artwork(size, key, comp=None, scheme=None):
    rnd = random.Random(seed_of(key))
    fn = COMPS[comp % len(COMPS)] if comp is not None else rnd.choice(COMPS)
    sch = SCHEMES[scheme % len(SCHEMES)] if scheme is not None else rnd.choice(SCHEMES)
    base_ink, acc_ink = sch

    canvas = paper(size)
    b, a = fn(size, rnd)

    off = max(2, size[0] // 320)
    canvas = ink(canvas, b, base_ink, opacity=0.95,
                 offset=(rnd.randint(-off, off), rnd.randint(-off, off)),
                 spread=size[0] / 900)
    canvas = ink(canvas, a, acc_ink, opacity=0.9,
                 offset=(rnd.randint(-off * 2, off * 2), rnd.randint(-off * 2, off * 2)),
                 spread=size[0] / 1100)
    return grain(canvas, 10)


def save(im, rel, widths):
    p = os.path.join(IMG, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    out = []
    top = max(widths)
    for wpx in widths:
        hpx = round(im.size[1] * wpx / im.size[0])
        q = p.replace(".webp", ("" if wpx == top else "-%d" % wpx) + ".webp")
        im.resize((wpx, hpx), Image.LANCZOS).save(q, "WEBP", quality=86, method=6)
        out.append(os.path.relpath(q, os.path.join(ROOT, "site")).replace(os.sep, "/"))
    return out


# ------------------------------------------------------------------- main ---
def main():
    content = os.path.join(ROOT, "content")
    made = []

    # --- article covers: one per article, seeded by slug ------------------
    arts = json.load(open(os.path.join(content, "articles.json"), encoding="utf-8"))["articles"]
    cats = sorted({x.get("category") or "general" for x in arts})
    for art in arts:
        slug = art["slug"]
        cat = art.get("category") or "general"
        # category fixes the ink pair, so a category reads as a family;
        # the slug varies the composition inside it.
        sch = cats.index(cat)
        comp = seed_of(slug) % len(COMPS)
        im = artwork((1200, 750), "art:" + slug, comp=comp, scheme=sch)
        made += save(im, "articles/%s.webp" % slug, [1200, 600])

    # --- specialty frames that have no photograph -------------------------
    specs = json.load(open(os.path.join(content, "specialties.json"), encoding="utf-8"))
    if isinstance(specs, dict):
        specs = specs.get("specialties", specs)
    for i, sp in enumerate(specs):
        slug = sp["slug"]
        if os.path.exists(os.path.join(IMG, "specialties", slug + ".webp")):
            continue                      # a real generated frame already landed
        im = artwork((1200, 750), "sp:" + slug, comp=(i + 1) % len(COMPS), scheme=i)
        made += save(im, "specialties/%s-art.webp" % slug, [1200, 700])

    # --- digital products -------------------------------------------------
    for i, p in enumerate(json.load(open(os.path.join(content, "digital.json"),
                                        encoding="utf-8"))["products"]):
        im = artwork((1200, 900), "dg:" + p["slug"], comp=(i * 2) % len(COMPS), scheme=i + 3)
        made += save(im, "digital/%s.webp" % p["slug"], [1200, 600])

    # --- section banners for pages that had no imagery at all -------------
    for i, name in enumerate(["about", "about-technology", "about-results", "patients",
                              "articles", "branches", "tools", "home-visits",
                              "doctors", "specialties", "digital", "contact"]):
        im = artwork((1800, 620), "hero:" + name, comp=i % len(COMPS), scheme=i % len(SCHEMES))
        made += save(im, "banners/%s.webp" % name, [1800, 900])

    print("generated %d files" % len(made))
    return made


if __name__ == "__main__":
    main()
