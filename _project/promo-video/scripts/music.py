"""Synthesises the 60 s soundtrack + SFX for the La Rose promo.
120 BPM (beat = 0.5 s = 15 frames at 30 fps). Structure:
 0-4 intro | 4-18 groove A | 18-29 groove B | 29-30 tape stop
 30-37 fake ending (quiet pad) | 37-40 build | 40-56 drop | 56-60 tail
"""
import numpy as np, json, wave, sys
from scipy.signal import butter, sosfilt, fftconvolve

SR = 44100
DUR = 60.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
BEAT = 0.5

def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def T(n): return np.arange(n) / SR

def lp(x, f, order=2):
    return sosfilt(butter(order, min(f, SR/2-100), "low", fs=SR, output="sos"), x)
def hp(x, f, order=2):
    return sosfilt(butter(order, f, "high", fs=SR, output="sos"), x)
def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)

def sweep_lp(x, f0, f1, block=512):
    out = np.zeros_like(x); zi = None
    nb = int(np.ceil(len(x) / block))
    for b in range(nb):
        f = f0 * (f1 / f0) ** (b / max(1, nb - 1))
        sos = butter(2, min(f, SR/2-100), "low", fs=SR, output="sos")
        if zi is None: zi = np.zeros((sos.shape[0], 2))
        seg = x[b*block:(b+1)*block]
        out[b*block:b*block+len(seg)], zi = sosfilt(sos, seg, zi=zi)
    return out

class Bus:
    def __init__(s): s.L = np.zeros(N); s.R = np.zeros(N)
    def add(s, sig, t, g=1.0, pan=0.0):
        i = int(t * SR)
        if i >= N: return
        sig = sig[: N - i]
        s.L[i:i+len(sig)] += sig * g * np.sqrt((1 - pan) / 2) * 1.414
        s.R[i:i+len(sig)] += sig * g * np.sqrt((1 + pan) / 2) * 1.414

def env(n, a=0.002, d=0.2):
    t = T(n); e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d); return e

# ---------------- instruments ----------------
def kick(power=1.0):
    n = int(0.45 * SR); t = T(n)
    f = 45 + 110 * np.exp(-t / 0.035)
    ph = 2*np.pi*np.cumsum(f)/SR
    body = np.sin(ph) * np.exp(-t / (0.28 * power))
    click = hp(rng.standard_normal(n), 3000) * np.exp(-t / 0.003) * 0.35
    return np.tanh((body + click) * 1.6) * 0.9

def clap():
    n = int(0.3 * SR); t = T(n); nz = bp(rng.standard_normal(n), 900, 5000)
    e = np.zeros(n)
    for o in (0, 0.011, 0.022):
        i = int(o*SR); e[i:] += np.exp(-(t[:n-i]) / 0.012)
    e += np.exp(-t / 0.12) * 0.5
    return nz * e * 0.5

def snare(pitch=1.0):
    n = int(0.22 * SR); t = T(n)
    tone = np.sin(2*np.pi*190*pitch*t) * np.exp(-t/0.05)
    nz = bp(rng.standard_normal(n), 1500, 9000) * np.exp(-t/0.08)
    return (tone*0.5 + nz*0.6) * 0.7

def hat(open_=False):
    n = int((0.35 if open_ else 0.06) * SR); t = T(n)
    return hp(rng.standard_normal(n), 7000, 4) * np.exp(-t / (0.12 if open_ else 0.014)) * 0.35

def saw(f, t, det=0.0):
    ph = (f * (1 + det)) * t
    return 2 * (ph - np.floor(ph + 0.5))

def supersaw(f, n, voices=5, spread=0.012):
    t = T(n); s = np.zeros(n)
    for v in range(voices):
        d = spread * (v - (voices-1)/2) / ((voices-1)/2)
        s += saw(f, t + rng.random()/f, d)
    return s / voices

def pluck(m, dur=0.22, bright=4000):
    n = int(dur * SR); t = T(n); f = mtof(m)
    x = supersaw(f, n, 3, 0.006)
    # filter envelope approximated by blending lp versions
    a = lp(x, bright); b = lp(x, 600)
    e = np.exp(-t / 0.05)
    y = a * e + b * (1 - e)
    return y * env(n, 0.002, dur * 0.35) * 0.5

def bass(m, dur, drive=1.5):
    n = int(dur * SR); t = T(n); f = mtof(m)
    x = saw(f, t) * 0.6 + np.sin(2*np.pi*f*t) * 0.8
    x = lp(x, 900)
    e = np.minimum(1, t/0.004) * np.minimum(1, (dur - t) / 0.02)
    return np.tanh(x * drive) * e * 0.55

def stab(notes, dur=0.25, cutoff=5000):
    n = int(dur * SR); x = sum(supersaw(mtof(m), n) for m in notes) / len(notes)
    return lp(x, cutoff) * env(n, 0.003, dur*0.5) * 0.6

def pad(notes, dur, cutoff=1800):
    n = int(dur * SR); t = T(n)
    x = sum(supersaw(mtof(m), n, 7, 0.02) for m in notes) / len(notes)
    e = np.minimum(1, t / 0.6) * np.minimum(1, (dur - t) / 0.8)
    return lp(x, cutoff) * np.clip(e, 0, 1) * 0.5

def lead(m, dur):
    n = int(dur * SR); t = T(n); f = mtof(m) * (1 + 0.004*np.sin(2*np.pi*5.5*t) * np.minimum(1, t/0.15))
    ph = np.cumsum(f) / SR
    sq = np.sign(np.sin(2*np.pi*ph)) * 0.5 + 2*(ph - np.floor(ph+0.5)) * 0.5
    return lp(sq, 3500) * env(n, 0.005, dur*0.9) * np.minimum(1, (dur - t)/0.03) * 0.33

def bell(m, dur=1.6):
    n = int(dur*SR); t = T(n); f = mtof(m)
    x = np.sin(2*np.pi*f*t) + 0.4*np.sin(2*np.pi*f*2.0*t)*np.exp(-t/0.3) + 0.2*np.sin(2*np.pi*f*3.01*t)*np.exp(-t/0.15)
    return x * env(n, 0.003, 0.6) * 0.35

def noise_riser(dur, f0=400, f1=9000):
    n = int(dur*SR); t = T(n); x = rng.standard_normal(n)
    y = sweep_lp(hp(x, 200), f0, f1)
    return y * (t/dur) ** 2 * 0.5

def impact():
    n = int(2.5*SR); t = T(n)
    f = 30 + 90*np.exp(-t/0.08)
    sub = np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t/0.7)
    crash = hp(rng.standard_normal(n), 3000) * np.exp(-t/0.6) * 0.25
    return np.tanh((sub + crash) * 1.4) * 0.9

def reverb(x, secs=2.2, wet=0.25):
    n = int(secs*SR); t = T(n)
    ir = rng.standard_normal(n) * np.exp(-t / (secs/6))
    ir = lp(ir, 6000); ir /= np.sqrt(np.sum(ir**2))
    y = fftconvolve(x, ir)[:len(x)]
    return x * (1 - wet) + y * wet

# ---------------- SFX ----------------
def sfx_click(bright=1.0):
    n = int(0.03*SR); t = T(n)
    nz = hp(rng.standard_normal(n), 5000) * np.exp(-t/0.0012)
    blip = np.sin(2*np.pi*3200*bright*t) * np.exp(-t/0.006)
    body = np.sin(2*np.pi*900*t) * np.exp(-t/0.004)
    return (nz*0.7 + blip*0.45 + body*0.35) * 0.9

def sfx_tick():
    n = int(0.015*SR); t = T(n)
    return (hp(rng.standard_normal(n), 6000)*np.exp(-t/0.0008) + np.sin(2*np.pi*4800*t)*np.exp(-t/0.003)*0.4) * 0.6

def sfx_whoosh(dur=0.5, up=True):
    n = int(dur*SR); t = T(n); x = rng.standard_normal(n)
    y = sweep_lp(hp(x, 300), 500 if up else 8000, 8000 if up else 500)
    e = np.sin(np.pi * t / dur) ** 2
    return y * e * 0.5

def sfx_pop():
    n = int(0.08*SR); t = T(n)
    f = 500 + 900*(1-np.exp(-t/0.01))
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t/0.02) * 0.5

def sfx_shutter():
    n = int(0.09*SR); y = np.zeros(n)
    for o in (0, 0.035):
        c = sfx_click(1.3); i = int(o*SR); y[i:i+len(c)] += c[: n-i]
    return y

# ---------------- arrangement ----------------
music = Bus(); drums = Bus(); fx = Bus()
prog = [  # (bass midi, chord, arp tones)
    (45, [57, 60, 64], [69, 72, 76, 72]),
    (41, [57, 60, 65], [69, 72, 77, 72]),
    (48, [55, 60, 64], [67, 72, 76, 72]),
    (43, [55, 59, 62], [67, 71, 74, 71]),
]
def chord_at(t): return prog[int(t // 2) % 4]

# intro arp 0-4 filtered open
intro = Bus()
for i in range(32):
    t = i * 0.125; b, ch, ar = chord_at(t + 4)  # start on Am
    intro.add(pluck(ar[i % 4], 0.2), t, 0.5, pan=0.3 if i % 2 else -0.3)
iL = sweep_lp(intro.L[:4*SR], 250, 7000); iR = sweep_lp(intro.R[:4*SR], 250, 7000)
music.L[:4*SR] += iL; music.R[:4*SR] += iR
fx.add(noise_riser(2.0), 2.0, 0.45)
for i in range(8): drums.add(hat(), 2.0 + i*0.25, 0.5, 0.2)
music.add(impact(), 4.0, 0.9)

lead_motif = [76, None, 74, 72, 74, None, 76, 79, 77, None, 76, 74, 72, None, 74, 76,
              79, None, 77, 76, 74, None, 72, 74, 71, None, 72, 74, 76, None, None, None]

def groove(t0, t1, level="A"):
    t = t0
    while t < t1 - 1e-6:
        beat_in_bar = round((t % 2) / 0.5)
        b, ch, ar = chord_at(t)
        drums.add(kick(1.3 if level == "D" else 1.0), t, 0.95)
        if beat_in_bar in (1, 3): drums.add(clap(), t, 0.7)
        for s in range(4):
            ts = t + s * 0.125
            drums.add(hat(), ts, 0.45 if s % 2 else 0.25, 0.25)
            music.add(pluck(ar[s], 0.18, 5000 if level != "A" else 3500), ts, 0.32, pan=-0.35 if s % 2 else 0.35)
        if level in ("B", "D"): drums.add(hat(True), t + 0.25, 0.3, -0.2)
        # offbeat bass
        music.add(bass(b, 0.2, 2.2 if level == "D" else 1.5), t + 0.25, 0.8)
        music.add(bass(b, 0.12), t + 0.375, 0.45)
        # chord stab on the off-beat
        music.add(stab(ch, 0.22, 6000 if level == "D" else 3500), t + 0.25, 0.42 if level == "D" else 0.3)
        t += 0.5
    if level in ("B", "D"):
        for i, m in enumerate(lead_motif * 4):
            ts = t0 + i * 0.25
            if ts >= t1: break
            if m is not None: music.add(lead(m + (12 if level == "D" else 0), 0.24), ts, 0.38 if level == "D" else 0.32)
    if level == "D":
        for bar in np.arange(t0, t1, 2.0):
            b, ch, ar = chord_at(bar)
            music.add(pad([n + 12 for n in ch], 2.0, 4000), bar, 0.35)

groove(4.0, 18.0, "A")
groove(18.0, 29.5, "B")
fx.add(noise_riser(2.0, 600, 10000), 16.0, 0.35)
music.add(impact(), 18.0, 0.6)

# sidechain on music bus from kicks (grooves only)
def sidechain(bus, kicks, depth=0.6, rel=0.18):
    g = np.ones(N)
    for k in kicks:
        i = int(k*SR); n = int(0.4*SR); t = T(n)
        e = 1 - depth * np.exp(-t/rel)
        g[i:i+n] = np.minimum(g[i:i+n], e[: N-i])
    bus.L *= g; bus.R *= g

kicks = list(np.arange(4, 29.5, 0.5)) + list(np.arange(40, 56, 0.5))

# ---- fake ending 30-37 ----
amb = Bus()
amb.add(pad([57, 60, 64, 69], 4.0, 900), 30.2, 0.55)
amb.add(pad([53, 57, 60, 65], 3.6, 700), 33.6, 0.5)
for i, m in enumerate([76, 72, 69, 67, 64]):
    amb.add(bell(m, 2.0), 30.6 + i * 1.1, 0.35 * (0.85 ** i), pan=(-0.4 if i % 2 else 0.4))
amb.L = reverb(amb.L, 3.0, 0.45); amb.R = reverb(amb.R, 3.1, 0.45)
fade = np.ones(N); a, b = int(34.0*SR), int(37.2*SR); fade[a:b] = np.linspace(1, 0.12, b-a); fade[b:] = 0.12
music.L += amb.L * fade; music.R += amb.R * fade

# ---- build 37-40 ----
roll = []
t = 37.0
while t < 39.75:
    roll.append(t)
    t += 0.25 if t < 38.0 else (0.125 if t < 39.0 else 0.0625)
for i, t in enumerate(roll):
    p = (t - 37.0) / 2.75
    drums.add(snare(1.0 + p * 0.8), t, 0.25 + 0.55 * p)
for t in np.arange(37.0, 39.5, 0.5): drums.add(kick(0.8), t, 0.5 + 0.2*(t-37))
fx.add(noise_riser(2.75, 300, 12000), 37.0, 0.6)
b = Bus(); b.add(pad([57, 60, 64], 2.75, 3000), 37.0, 0.4)
music.L += sweep_lp(b.L, 200, 8000) if False else b.L; music.R += b.R

# ---- drop 40-56 ----
music.add(impact(), 40.0, 1.0)
groove(40.0, 56.0, "D")
fx.add(noise_riser(1.5, 600, 10000), 54.5, 0.35)

# ---- tail 56-60 ----
music.add(impact(), 56.0, 1.0)
tail = Bus()
tail.add(stab([57, 60, 64, 69, 72], 1.2, 7000), 56.0, 0.9)
tail.add(bass(33, 1.4, 1.2), 56.0, 0.9)
for i, m in enumerate([81, 76, 72, 69, 64, 60]):
    tail.add(bell(m, 2.0), 56.5 + i*0.25, 0.3)
tail.L = reverb(tail.L, 3.5, 0.5); tail.R = reverb(tail.R, 3.6, 0.5)
music.L += tail.L; music.R += tail.R

sidechain(music, kicks)

# tape stop 29.0 -> 30.0 on music+drums
def tape_stop(bus, t0, dur):
    i0 = int(t0*SR); n = int(dur*SR)
    rate = np.linspace(1, 0, n) ** 1.3
    pos = i0 + np.cumsum(rate)
    for ch in ("L", "R"):
        x = getattr(bus, ch)
        seg = np.interp(pos, np.arange(len(x)), x) * np.linspace(1, 0, n) ** 0.5
        x[i0:i0+n] = seg
        x[i0+n:int(30.15*SR)] = 0  # silence after the stop until the pad
for bus in (music, drums):
    # keep the 30+ material: tape_stop only zeroes up to 30.15
    tape_stop(bus, 29.0, 1.0)

# ---- SFX schedule (matches src/timeline) ----
ev = []
ev += [(0.25, "tick"), (1.0, "whoosh_s"), (2.0, "click")]
ev += [(2.5 + i*0.125, "tick") for i in range(8)]
ev += [(5.85, "whoosh"), (6.9, "whoosh")]
ev += [(8 + i*0.5, "click") for i in range(12)]
ev += [(14 + i*0.5, "pop") for i in range(6)] + [(17.4, "whoosh")]
ev += [(18.0, "click"), (18.5, "click"), (19.0, "click"), (19.5, "click"), (20.5, "shutter"), (21.0, "click"), (21.5, "tick"), (22.0, "tick"), (22.25, "tick"), (22.5, "tick"), (22.75, "tick"), (22.95, "click"), (23.5, "whoosh")]
ev += [(24 + i*0.25, "shutter" if i % 2 == 0 else "tick") for i in range(12)]
ev += [(27.0, "whoosh"), (28.0, "whoosh_s")]
ev += [(31.0, "tick"), (33.2, "tick")]
ev += [(38.0 + i*0.25, "tick") for i in range(6)]
ev += [(40.0, "shutter"), (41.0, "whoosh"), (41.5, "click"), (42.5, "click"), (43.5, "click"), (45.0, "whoosh")]
ev += [(46.0 + i*0.25, "pop") for i in range(7)]
ev += [(48.0 + i*0.0625, "tick") for i in range(24)]
ev += [(50.0, "click"), (50.5, "click"), (51.0, "click"), (51.5, "click"), (52.0, "whoosh"), (53.0, "whoosh"), (55.5, "whoosh")]
for t, kind in ev:
    s = {"tick": sfx_tick, "click": sfx_click, "pop": sfx_pop, "shutter": sfx_shutter,
         "whoosh": lambda: sfx_whoosh(0.55), "whoosh_s": lambda: sfx_whoosh(0.8)}[kind]()
    g = {"tick": 0.55, "click": 0.75, "pop": 0.6, "shutter": 0.8, "whoosh": 0.5, "whoosh_s": 0.35}[kind]
    if 30 <= t < 37: g *= 0.5
    if kind.startswith("whoosh"): t -= 0.25
    fx.add(s, t, g, pan=float(rng.uniform(-0.3, 0.3)))

L = music.L * 0.8 + drums.L * 0.85 + fx.L
R = music.R * 0.8 + drums.R * 0.85 + fx.R
# master: gentle glue + limiter
L = hp(L, 28); R = hp(R, 28)
peak = max(np.max(np.abs(L)), np.max(np.abs(R)))
L /= peak; R /= peak
L = np.tanh(L * 1.6) / np.tanh(1.6); R = np.tanh(R * 1.6) / np.tanh(1.6)
fo = int(0.8*SR); L[-fo:] *= np.linspace(1, 0, fo); R[-fo:] *= np.linspace(1, 0, fo)
out = (np.stack([L, R], 1) * 0.95 * 32767).astype(np.int16)
with wave.open(sys.argv[1] if len(sys.argv) > 1 else "public/soundtrack.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes())
print("ok")
