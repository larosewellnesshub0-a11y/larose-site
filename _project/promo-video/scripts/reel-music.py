"""Synthesised 84 s soundtrack + SFX for the vertical reel (LaRoseReel). Crisper than the film: brighter 16th hats,
rim clicks on the off-beats, sharper kick transients, brighter plucks. 120 BPM (beat = 0.5 s).
 0-3 hook | 3-21 groove A | 21-45 groove B | 45-49 falls away (never silent) | 49-51 build | 51-64 drop | 64-80 drop +2 | 80 hit
"""
import numpy as np, json, wave, sys
from scipy.signal import butter, sosfilt, fftconvolve

SR = 44100
DUR = 84.0
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

def sfx_mouse():
    """Crisp mouse click: sharp press, then a lighter, higher release 70 ms later."""
    n = int(0.12*SR); y = np.zeros(n)
    def part(freq, g, dec):
        m = int(0.02*SR); t = T(m)
        return (hp(rng.standard_normal(m), 4000, 4) * np.exp(-t/0.0007) * 1.0
                + np.sin(2*np.pi*freq*t) * np.exp(-t/dec) * 0.6
                + np.sin(2*np.pi*freq*2.7*t) * np.exp(-t/(dec*0.5)) * 0.3) * g
    a = part(2300, 1.0, 0.004); y[:len(a)] += a
    i = int(0.07*SR); b = part(3100, 0.55, 0.003); y[i:i+len(b)] += b
    return y

def sfx_counter(dur):
    """Digital counter: a run of tiny square-wave blips that speeds up then settles, pitch rising."""
    n = int((dur + 0.05)*SR); y = np.zeros(n); t = 0.0; k = 0
    while t < dur:
        m = int(0.007*SR); tt = T(m); f = 2600 + 900 * (t / dur)
        blip = np.sign(np.sin(2*np.pi*f*tt)) * np.exp(-tt/0.0025) * 0.35
        i = int(t*SR); y[i:i+m] += blip[: n-i]
        rate = 22 + 18 * np.sin(np.pi * min(1, t/dur))
        t += 1.0 / rate; k += 1
    m = int(0.06*SR); tt = T(m)  # settle "ding"
    end = np.sin(2*np.pi*4200*tt) * np.exp(-tt/0.02) * 0.4
    i = int(dur*SR) - m // 3; y[i:i+m] += end[: n-i]
    return y

def sfx_shutter():
    n = int(0.09*SR); y = np.zeros(n)
    for o in (0, 0.035):
        c = sfx_click(1.3); i = int(o*SR); y[i:i+len(c)] += c[: n-i]
    return y

# ---------------- arrangement ----------------
music = Bus(); drums = Bus(); fx = Bus()
prog = [(45, [57, 60, 64], [69, 72, 76, 72]), (41, [57, 60, 65], [69, 72, 77, 72]), (48, [55, 60, 64], [67, 72, 76, 72]), (43, [55, 59, 62], [67, 71, 74, 71])]
def chord_at(t): return prog[int(t // 2) % 4]
def tr(c, k):
    b, ch, ar = c; return (b + k, [n + k for n in ch], [n + k for n in ar])

def rim():
    n = int(0.03*SR); t = T(n)
    return (hp(rng.standard_normal(n), 3500, 4) * np.exp(-t/0.002) + np.sin(2*np.pi*1750*t) * np.exp(-t/0.008) * 0.6) * 0.5

lead_motif = [76, None, 74, 72, 74, None, 76, 79, 77, None, 76, 74, 72, None, 74, 76,
              79, None, 77, 76, 74, None, 72, 74, 71, None, 72, 74, 76, None, None, None]

def groove(t0, t1, level="A", key=0):
    t = t0
    while t < t1 - 1e-6:
        beat_in_bar = round((t % 2) / 0.5)
        b, ch, ar = tr(chord_at(t), key)
        drums.add(kick(1.3 if level == "D" else 1.0), t, 0.95)
        if beat_in_bar in (1, 3): drums.add(clap(), t, 0.7)
        for s in range(4):
            ts = t + s * 0.125
            drums.add(hat(), ts, 0.55 if s % 2 else 0.3, 0.3 if s % 2 else -0.3)
            music.add(pluck(ar[s], 0.16, 7500 if level != "A" else 6000), ts, 0.32, pan=-0.35 if s % 2 else 0.35)
        drums.add(rim(), t + 0.375, 0.55, 0.4)
        if level in ("B", "D"): drums.add(hat(True), t + 0.25, 0.3, -0.2)
        music.add(bass(b, 0.2, 2.2 if level == "D" else 1.6), t + 0.25, 0.8)
        music.add(bass(b, 0.12), t + 0.375, 0.45)
        music.add(stab(ch, 0.2, 7000 if level == "D" else 4500), t + 0.25, 0.42 if level == "D" else 0.3)
        t += 0.5
    if level in ("B", "D"):
        for i, m in enumerate(lead_motif * 6):
            ts = t0 + i * 0.25
            if ts >= t1: break
            if m is not None: music.add(lead(m + key + (12 if level == "D" else 0), 0.24), ts, 0.36 if level == "D" else 0.3)
    if level == "D":
        for bar in np.arange(t0, t1, 2.0):
            b, ch, ar = tr(chord_at(bar), key)
            music.add(pad([n + 12 for n in ch], 2.0, 4500), bar, 0.33)

# hook 0-3: filtered arp, crisp hats, a glitch stutter at 2.7
hook = Bus()
for i in range(24):
    t = i * 0.125; b, ch, ar = chord_at(t + 4)
    hook.add(pluck(ar[i % 4], 0.16, 7000), t, 1.0, pan=0.3 if i % 2 else -0.3)
music.L[:3*SR] += sweep_lp(hook.L[:3*SR], 2500, 8000); music.R[:3*SR] += sweep_lp(hook.R[:3*SR], 2500, 8000)
music.add(stab([57, 60, 64, 69], 0.5, 6000), 0.0, 0.6)
for t in np.arange(0.0, 3.0, 0.5): music.add(bass(45, 0.18, 1.8), t + 0.25, 0.75)
for t in (0.5, 1.5, 2.5): drums.add(clap(), t, 0.55)
for i in range(24): drums.add(hat(), i * 0.125, 0.45 if i % 2 else 0.25, 0.25)
for i in range(4): drums.add(rim(), 0.375 + i * 0.5, 0.45)
st = music.L[int(2.45*SR):int(2.52*SR)].copy(); st2 = music.R[int(2.45*SR):int(2.52*SR)].copy()
for k in range(4):
    i = int((2.7 + k * 0.0625) * SR); music.L[i:i+len(st)] += st * 0.8; music.R[i:i+len(st2)] += st2 * 0.8
fx.add(noise_riser(1.0, 800, 9000), 2.0, 0.35)

music.add(impact(), 3.0, 0.6)
groove(3.0, 21.0, "A")
music.add(impact(), 5.0, 0.75)
music.add(impact(), 21.0, 0.7)
groove(21.0, 45.0, "B")

# 45-49: falls away like an ending (no drums, filter closing, pad and bells), but never silent
amb = Bus()
amb.add(pad([57, 60, 64, 69], 4.2, 1400), 45.0, 0.8)
for i, m in enumerate([76, 72, 69, 67]):
    amb.add(bell(m, 2.0), 45.3 + i * 0.9, 0.38 * (0.85 ** i), pan=(-0.4 if i % 2 else 0.4))
amb.L = reverb(amb.L, 3.0, 0.45); amb.R = reverb(amb.R, 3.1, 0.45)
music.L += amb.L; music.R += amb.R
# 49-51 build
t = 49.0
while t < 50.9:
    p = (t - 49.0) / 1.9
    drums.add(snare(1.0 + p * 0.9), t, 0.3 + 0.55 * p)
    t += 0.25 if t < 50.0 else 0.125
for t in np.arange(49.0, 50.5, 0.5): drums.add(kick(0.8), t, 0.6)
fx.add(noise_riser(2.0, 300, 12000), 49.0, 0.6)
b = Bus(); b.add(pad([57, 60, 64], 2.0, 3000), 49.0, 0.45); music.L += b.L; music.R += b.R

music.add(impact(), 51.0, 1.0)
groove(51.0, 64.0, "D")
fx.add(noise_riser(1.5, 600, 11000), 62.5, 0.4)
music.add(impact(), 64.0, 0.9)
groove(64.0, 80.0, "D", key=2)
for i in range(8): drums.add(snare(1.3 + i * 0.08), 79.5 + i * 0.0625, 0.35 + i * 0.07)

music.add(impact(), 80.0, 1.0)
tl = Bus()
tl.add(stab([59, 62, 66, 71, 74], 1.2, 8000), 80.0, 0.9)
tl.add(bass(35, 1.4, 1.2), 80.0, 0.9)
for i, m in enumerate([83, 78, 74, 71, 66]):
    tl.add(bell(m, 2.0), 80.5 + i * 0.25, 0.3)
tl.L = reverb(tl.L, 3.0, 0.5); tl.R = reverb(tl.R, 3.1, 0.5)
music.L += tl.L; music.R += tl.R

def sidechain(bus, kicks, depth=0.6, rel=0.18):
    g = np.ones(N)
    for k in kicks:
        i = int(k*SR); n = int(0.4*SR); t = T(n)
        e = 1 - depth * np.exp(-t/rel)
        g[i:i+n] = np.minimum(g[i:i+n], e[: N-i])
    bus.L *= g; bus.R *= g
sidechain(music, list(np.arange(3, 45, 0.5)) + list(np.arange(51, 80, 0.5)))
# close the filter on everything 44.5-45.5 so the fall-away feels like an ending
for bus in (music, drums):
    i0, i1 = int(44.5*SR), int(45.5*SR)
    for ch in ("L", "R"):
        x = getattr(bus, ch); x[i0:i1] = sweep_lp(x[i0:i1], 9000, 300)
    for ch in ("L", "R"):
        getattr(bus, ch)[int(45.5*SR):int(45.52*SR)] *= np.linspace(1, 0, int(0.02*SR))
drums.L[int(45.5*SR):int(49*SR)] = 0; drums.R[int(45.5*SR):int(49*SR)] = 0

# ---- SFX schedule (matches src/reel) ----
ev = []
ev += [(0.1, "pop")] + [(i * 0.38, "tick") for i in range(6)] + [(2.7, "shutter"), (3.0, "mouse"), (3.05, "whoosh_s"), (5.0, "shutter"), (5.8, "pop"), (8.0, "whoosh"),
       (8.05, "pop"), (8.2, "counter0.7"), (8.85, "pop"), (9.0, "counter0.7")]
ev += [(11 + a, "mouse") for a in [0.6, 1.4, 2.2, 2.9, 3.6, 4.3, 5.0, 5.5, 6.4, 7.3]]
ev += [(float(s), "tick") for s in range(12, 20)] + [(20.0, "ding"), (12.45, "pop"), (13.95, "pop"), (15.35, "pop"), (21.05, "pop")]
ev += [(24.0, "pop"), (24.5, "counter0.8")] + [(24.6 + i * 0.15, "tick") for i in range(5)]
ev += [(28.05, "pop"), (28.5, "whoosh_s"), (31.0, "pop"), (31.6, "mouse"), (31.65, "pop"), (33.0, "whoosh"), (33.2, "counter0.9"), (34.8, "pop")]
ev += [(38.3, "mouse"), (39.0, "mouse"), (39.7, "mouse"), (41.0, "pop")] + [(41.5 + d, "tick") for d in (0, 0.125, 0.25, 0.5, 0.625)]
ev += [(42.6, "mouse"), (42.7, "counter0.75"), (43.45, "pop")] + [(43.6 + i * 0.25, "pop") for i in range(4)]
ev += [(45.5, "click"), (46.2, "click"), (46.9, "click"), (48.4, "pop")]
ev += [(51.0, "shutter")] + [(51.5 + i * 0.5, "pop") for i in range(4)] + [(54.0, "whoosh_s"), (57.0, "pop")] + [(57.2 + i * 0.25, "pop") for i in range(3)]
ev += [(58.8, "mouse"), (58.9, "whoosh"), (61.0, "pop"), (61.7, "mouse"), (61.9, "pop"), (62.0, "counter0.6"), (64.0, "shutter"), (64.3, "counter0.8"), (65.2, "pop"), (65.6, "pop")]
ev += [(68.0, "pop"), (71.0, "pop"), (71.75, "whoosh_s"), (72.5, "whoosh_s"), (73.0, "whoosh"), (74.0, "pop"), (74.2, "pop"), (74.5, "pop"), (75.6, "pop")]
ev += [(78.0, "click"), (78.5, "click"), (79.0, "click"), (79.4, "mouse"), (80.4, "pop"), (80.7, "pop")] + [(81.0 + i * 0.06, "tick") for i in range(10)]

def sfx_ding():
    n = int(0.5*SR); t = T(n)
    return (np.sin(2*np.pi*1760*t) + 0.5*np.sin(2*np.pi*2640*t) + 0.25*np.sin(2*np.pi*3520*t)) * np.exp(-t/0.12) * 0.45

for t, kind in ev:
    if kind == "ding":
        fx.add(sfx_ding(), t, 0.8); continue
    if kind.startswith("counter"):
        fx.add(sfx_counter(float(kind[7:])), t, 0.5, pan=0.0); continue
    s = {"tick": sfx_tick, "click": sfx_click, "pop": sfx_pop, "shutter": sfx_shutter,
         "whoosh": lambda: sfx_whoosh(0.55), "whoosh_s": lambda: sfx_whoosh(0.8), "mouse": sfx_mouse}[kind]()
    g = {"tick": 0.55, "click": 0.75, "pop": 0.6, "shutter": 0.8, "whoosh": 0.5, "whoosh_s": 0.35, "mouse": 1.0}[kind]
    if 45 <= t < 49: g *= 0.6
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
