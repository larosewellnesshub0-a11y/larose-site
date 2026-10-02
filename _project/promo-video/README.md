# La Rose promo video (Remotion)

A 90-second, 1920×1080, 30 fps motion-graphics film about the site's design language. Arabic comes first and English is the
counterpart. The type is Graphik Arabic and Graphik, plus Romelio and Montserrat as on the site. Glass panels use the site's
own glass tokens. Most scenes sit on the light paper ground; dark olive is kept for the intro, the fake ending, the build and the logo.

| Time | Scene |
|---|---|
| 0–4 s | The best photos on the site flash through one brand arch, the logo lands on dark olive, a snare fill flies through the arch |
| 4–8 s | The Arabic homepage full-frame with a slow push, then two surprise zoom outs (browser, then a wall of pages) |
| 8–14 s | Type specimens on the half-beat, then the hero line word by word and its English version |
| 14–18 s | The palette as brand arches (a rose-dot match cut in, a dive into "paper" out) |
| 18–24 s | UI kit: buttons, cursor clicks, a glass booking card over the clinic photo, counters, light→dark |
| 24–28 s | The BMI calculator in glass: typing, a click, the result counting up |
| 28–35 s | 8-page montage, then desktop + tablet + phone and an AR⇄EN flip |
| 35–40 s | The doctors with portraits (Dr. Shimaa Sherif has none yet, so her frame is left out), then branches, then a tape stop |
| 40–47 s | Fake ending on dark olive. It stays lit, with no dip to black |
| 47–50 s | «استنى!» then «الموقع ده كمان SEO Optimized», and a light flash into the drop |
| 50–72 s | SEO: title/meta/canonical, hreflang, JSON-LD (held 3.5 s), search preview (held 4 s), trust signals, clean URLs + sitemap + robots, the OG share card, a zoom out to the library |
| 72–76 s | A kick-less break: glass stat tiles with digital counters |
| 76–84 s | Finale, up a whole tone: a photo recap, the browser flipping language/theme/page, a tilted wall of pages |
| 84–90 s | Logo |

## Rebuild

```bash
npm i
node ../../server/serve.mjs 4173 &   # serve the built site
node scripts/capture.mjs             # real screenshots → public/shots, src/seo.json
mkdir -p public/fonts public/brand public/covers
cp ../../site/assets/fonts/*.woff2 public/fonts/
# Licensed brand fonts (not in git, get them from the clinic): Graphik-{Regular,Medium,Bold,Super}.ttf (Latin) and
# GraphikArabic-{Regular,Medium,Semibold,Bold}.woff2. Without GraphikArabic the video falls back to IBM Plex Sans Arabic.
cp ../../site/assets/img/logo/{larose-wordmark-white.png,favicon.svg} public/brand/
# plus the photos named in src/scenes/S1Intro.tsx / SFinale.tsx → public/photos, and doctor/branch images → public/brand
cp $(node -e "console.log(require('./src/covers.json').map(f=>'../../site/assets/img/articles/'+f).join(' '))") public/covers/
pip install numpy scipy
python3 scripts/music.py public/soundtrack.wav   # synthesised 120 BPM track + SFX
npx remotion studio                  # preview
npx remotion render LaRosePromo out/larose-promo.mp4 --codec=h264 --crf=18 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

Every visual is timed to the beat (SFX: clicks, mouse clicks on every cursor press, a digital counter under every count-up). 120 BPM gives one beat per 0.5 s, which is 15 frames. `src/lib.tsx` `pulseAt()` mirrors the
kick/snare schedule in `scripts/music.py`, so the background grid, arch ripples, dial and text glow pulse with the
music. If you move a scene, move its SFX in `music.py` (the `ev` list) too.

The numbers on screen come from the built site/content, as of 2026-10-01: 10 specialties, 4 doctors, 2 open branches, 269
articles per language, 643 sitemap URLs and 6 FAQ entries in the featured article's schema. The search result is an illustrative preview, not a ranking claim. No prices are shown.
