# Performance and phone audit -- 2026-09-11

## Scope and method

Audited the generated `site/**/*.html` before changing source. CSS selectors
were checked against every generated HTML class/id and then against every
runtime JS file, so a class added by JavaScript was retained. The generator was
run before and after the work.

The generated directory contains 370 HTML files including redirect/dev files;
the production build reports 368 pages.

## Baseline

| Measure | Before | After | Change |
| --- | ---: | ---: | ---: |
| CSS bytes | 134,225 | 127,126 | -7,099 (-5.29%) |
| JS bytes | 65,797 | 65,797 | 0 |
| Shared CSS + JS | 200,022 | 192,923 | -7,099 (-3.55%) |

Largest files before the change were `components.css` (60,002 bytes),
`layout.css` (38,732), `site.js` (32,110), `tools.js` (20,338), and
`recipe-guide.css` (15,366). Afterward the largest are `components.css`
(53,733), `layout.css` (37,816), `site.js` (32,110), `tools.js` (20,338), and
`recipe-guide.css` (15,791).

The regular shell had four render-blocking stylesheets in `<head>`. The two
RecipeGuide pages have five; two fallback pages have three; redirect/dev files
are exceptions. There were zero synchronous external scripts in `<head>`.
Each shell page did have two short inline analytics initializers (GA queue and
the Clarity async loader); their network scripts are async. JSON-LD is inert.

## Removed CSS

The initial static scan identified 50 dead rule blocks (7 in `base.css`, 35 in
`components.css`, 8 in `layout.css`). All were absent from generated HTML and
from `site/assets/js/*.js`. A repeat scan after deletion found **0** dead static
blocks using the same HTML-plus-runtime-JS safeguard. No file was deleted.

- `base.css`: `.wrap--wide`, `.section--lg`, `.stack-lg`, `.u-faint`, `.u-xs`,
  `.u-mt-0`, `.u-hide`.
- `components.css`: unused arch/sprig/chip variants (`.arch--squat`,
  `.arch--soft`, `.sprig--tl`, `[dir="rtl"] .sprig--tl`, `.chip--olive`);
  `.doctor-placeholder`, `.doctor-placeholder svg`, and
  `.card--branch .card__media .doctor-placeholder`; unused review children
  (`.review__quote`, `__foot`, `__avatar`, `[dir="rtl"] .review__avatar`,
  `__name`, `__src`, `__src svg`); `.ba--placeholder`, `.field__error`, and
  `.notice--medical`; `.card__placeholder`, `::after`, `-icon`, and
  `.card--specialty .card__media`; `.glass--dark`, `.glass--dark::after`, and
  both fallback `.glass--dark` branches; `.tool__actions`, `.tool__check`,
  `.tool__check .checkbox`, and its `:has(input:checked)` rule;
  `.share__note`; plus `.results-gallery`, `.result-card`,
  `.result-card > img`, `.result-card__caption`, `.review-screenshots`,
  `.review-screenshot`, `.review-screenshot > img`, and
  `.review-screenshot figcaption`.
- `layout.css`: `.header-phone` and children, `.section--rose`, `.rule--gold`,
  `.site-footer__disclaimer`, `.page-hero__brand`, `.hero__brand-en`.

I did not delete any JS. A named-function reference pass found every named
declaration in `forms.js`, `site.js`, `tools.js`, and `track.js` referenced.

## Loading changes

- Moved critical resource discovery ahead of analytics snippets in the shared
  head. Every normal Arabic page preloads Plex Arabic 400 and Sondos 400;
  English pages preload Montserrat 400 and Romelio 400. All seven existing
  self-hosted `@font-face` declarations already use `font-display: swap`.
  The rebuilt shell contains 728 font preload links (two on each of 364 normal
  shell pages).
- CSS-background heroes cannot carry an `img` `fetchpriority` attribute.
  The shell now detects the page's hero background and emits a high-priority
  image preload. It emitted 114 such preloads in the rebuilt site.
- `forms.js` is now emitted only for a page containing a form: 20 pages still
  load it and 344 ordinary shell pages no longer do. That avoids a 7,355-byte
  request and parse on each of those ordinary navigations (2,530,120 bytes
  avoided across one visit to every affected route; this is not a claim about
  a single page load).
- All owned site scripts remain `defer`. `tools.js` remains conditional and is
  loaded on 12 tool pages only.

Image audit after rebuild: 3,177 `<img>` elements; 1,835 lazy, 242 eager, and
1,100 default-loading. The default group is primarily shared header/footer
logos plus the two above-the-fold RecipeGuide covers. No hero image is lazy.
All public non-slider images have intrinsic dimensions. The only 140 public
images without `width`/`height` are `ba__before`/`ba__after`; their `.ba`
container reserves a `4 / 3` (or portrait variant) aspect ratio before either
image loads, so they do not cause layout shift.

## Phone and iPad fixes

At 390px and 820px, the compact controls below were below the 44px target
(roughly 32--41px; the recipe-book gallery dots were 10px). They now have a
logical `min-block-size: 2.75rem` (44px): compact buttons, language switches,
specialty tabs, utility-bar phone/language links, drawer links, RecipeGuide
brand/search/language/TOC/CTA/video/back controls, and recipe-book gallery
labels. The gallery retains small visual dots inside full-size labels.

The source layout also confirms the requested page types use safe tracks at
both widths: regular content grids use `minmax(min(100%, ...), 1fr)`; the
primary navigation changes to the drawer below 1100px; RecipeGuide switches
its hero and inside layouts to one column at 720px and its header to two
columns at 576px. No tables or code blocks appear in the inspected public page
types. New rules use logical block/inline properties.

Rendered screenshot QA could not be completed in this workspace: headless
Chrome exits before rendering because its Crashpad registration is denied by
the workspace sandbox, and the available browser runtime has a broken
Playwright export. I therefore do **not** claim a pixel-level browser pass;
the width conclusions above are from the rebuilt HTML and responsive CSS audit.

## Deliberately not changed

- RecipeGuide has a separately generated head in `build/pages/recipe-guide.mjs`.
  That file is outside this run's permitted ownership, so I did not add its
  own font/image preloads there. Its above-fold cover is not lazy.
- The inline GA/Clarity bootstrap snippets remain so analytics initialization
  and page views retain their existing timing. Their external work is async;
  moving resource discovery ahead of them gives CSS, fonts, and hero art first
  discovery without changing collection semantics.

## Verification run

```text
$ node build/build.mjs
La Rose - built 368 pages in 12317ms

404 1; ar/index 1; en/index 1; ar/specialties 11; en/specialties 11;
ar/doctors 4; en/doctors 4; ar/branches 4; en/branches 4;
ar/articles 134; en/articles 134; ar/digital 3; en/digital 3;
ar/about 5; en/about 5; ar/patients 7; en/patients 7;
ar/legal 3; en/legal 3; ar/sitemap 1; en/sitemap 1;
ar/tools 7; en/tools 7; RecipeGuide/index 1; RecipeGuide/free 1;
ar/contact 1; ar/404 1; en/contact 1; en/404 1; index 1

$ node tools/validate.mjs
Validated 368 pages
0 errors, 0 warnings

$ python tools/check_voice.py
Arabic voice check - 376 pages
PASS - no feminine second-person address found.
```
