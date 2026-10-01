# La Rose promo video (Remotion)

A 60-second, 1920×1080, 30 fps motion-graphics film about the site's design language. Arabic comes first and English is the counterpart.

| Time | Scene |
|---|---|
| 0–4 s | A champagne rule draws, the brand arch rises from it, the wordmark appears, and the camera flies through the arch |
| 4–8 s | Close-up of the Arabic hero H1, a zoom out to the browser, then a second zoom out to a wall of nine pages |
| 8–14 s | Type specimens on the half-beat (Sondos, Romelio, IBM Plex Sans Arabic, Montserrat), then the hero line word by word and its English version |
| 14–18 s | The palette as brand arches. The rose dot match-cuts into the rose swatch, then the camera dives into "paper" |
| 18–24 s | The UI kit: buttons, a cursor booking, the booking card and dropdown, counters, then the light→dark toggle |
| 24–30 s | Page montage, then desktop + tablet + phone, an AR⇄EN flip, and a tape-stop freeze |
| 30–37 s | Fake ending: logo and URL, the music almost gone, everything dims |
| 37–40 s | Build on the snare roll: «استنى. الموقع ده معمول عشان يتلاقي» |
| 40–54 s | The drop, about SEO: title/meta/canonical, hreflang, JSON-LD, a search preview, trust signals, then a zoom out to the article library |
| 54–60 s | The library collapses and the logo lands on the final hit |

## Rebuild

```bash
npm i
node ../../server/serve.mjs 4173 &   # serve the built site
node scripts/capture.mjs             # real screenshots → public/shots, src/seo.json
mkdir -p public/fonts public/brand public/covers
cp ../../site/assets/fonts/*.woff2 public/fonts/
cp ../../site/assets/img/logo/{larose-wordmark-white.png,favicon.svg} public/brand/
cp $(node -e "console.log(require('./src/covers.json').map(f=>'../../site/assets/img/articles/'+f).join(' '))") public/covers/
pip install numpy scipy
python3 scripts/music.py public/soundtrack.wav   # synthesised 120 BPM track + SFX
npx remotion studio                  # preview
npx remotion render LaRosePromo out/larose-promo.mp4 --codec=h264 --crf=18 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

Every visual is timed to the beat. 120 BPM gives one beat per 0.5 s, which is 15 frames. `src/lib.tsx` `pulseAt()` mirrors the
kick/snare schedule in `scripts/music.py`, so the background grid, arch ripples, dial and text glow pulse with the
music. If you move a scene, move its SFX in `music.py` (the `ev` list) too.

The numbers on screen come from the built site, as of 2026-10-01: 269 articles per language, 643 sitemap URLs and 6 FAQ entries
in the featured article's schema. The search result is an illustrative preview, not a ranking claim. No prices are shown.
