# Codex SEO polish and live-site QA report

Date: 2026-09-08  
Temporary deployment tested: `https://larosewellnesshub0-a11y.github.io/larose-site/`

## Outcome

All eight findings in `_project/AUDIT-SEO.md` are resolved in the generated output. The final local build produced 346 pages, and `node tools/validate.mjs` completed with **0 errors and 0 warnings**.

## Audit fixes

- Root language-gate description expanded to 151 characters.
- English Clinical Nutrition title shortened to 50 characters including the brand.
- Doctor-hub descriptions expanded to 145 characters in Arabic and 159 in English.
- Doctor hub now has an intervening, visually hidden `h2` before its `h3` doctor cards.
- Arabic branch-hub description expanded to 141 characters.
- GLP-1 titles are now 53 characters in Arabic and 57 in English including the brand; its Arabic description is 141 characters.
- Thyroid Q&A titles are now 48 characters in Arabic and 56 in English including the brand; descriptions are 138 and 144 characters respectively.
- Arabic contact description expanded to 153 characters.

All counts above are measured from rendered HTML, after entity decoding where relevant.

## Article metadata and structured data

- Article-detail social images now use each entry's own `image` as an absolute URL for `og:image` and `twitter:image`, with `og:image:width` and `og:image:height`.
- Generated cover-image `alt` text falls back to the entry title, including detail, listing, category and featured cards.
- Standard entries emit `Article` JSON-LD with headline, image, publication/modification dates, doctor `Person` author, reviewer where available, and the clinic as publisher.
- Entries with FAQ data additionally emit `FAQPage` in the same JSON-LD graph.
- Q&A detail pages emit `QAPage` containing `Question` and doctor-authored `Answer` instead of being represented as ordinary articles.
- The validator parsed the single JSON-LD graph on every generated page successfully.

## Sitemap and image validation

- Every sitemap URL has a `lastmod`: an article's content date when available, otherwise the Cairo build date.
- The sitemap declares the Google image-sitemap namespace and includes article covers and specialty frames. The current build contains 234 `<image:image>` entries across the two locales.
- `tools/validate.mjs` now resolves every internal `<img src>` and every candidate in `<img srcset>` against `site/`, in addition to requiring the `alt` attribute.

## Live-site QA output

Command: `node tools/check-live.mjs`

```text
Live QA: https://larosewellnesshub0-a11y.github.io/larose-site/
STATUS  CONTENT-TYPE                         TRACKING  PATH
200     text/html; charset=utf-8             no       /
200     text/html; charset=utf-8             no       /ar/
200     text/html; charset=utf-8             no       /en/
200     text/html; charset=utf-8             no       /RecipeGuide/
200     text/html; charset=utf-8             no       /RecipeGuide/free/
200     text/plain; charset=utf-8            n/a      /robots.txt
200     application/xml                      n/a      /sitemap.xml
200     text/plain; charset=utf-8            n/a      /agents.txt
200     text/plain; charset=utf-8            n/a      /llms.txt
200     text/html; charset=utf-8             no       /404.html
200     text/html; charset=utf-8             no       /dashboard/
200     application/json; charset=utf-8      n/a      /dashboard/content/index.json
200     text/html; charset=utf-8             no       /en/articles/fatty-liver-fibrosis-needs-its-own-assessment.html
200     text/html; charset=utf-8             no       /ar/articles/qa-fatty-liver-normal-enzymes.html
200     text/html; charset=utf-8             no       /ar/articles/qa-mesotherapy-guaranteed-result.html
200     text/html; charset=utf-8             no       /en/articles/supplements-are-targeted-not-a-default.html
200     text/html; charset=utf-8             no       /en/articles/stubborn-localised-fat.html
200     image/jpeg                           n/a      /larose-site/assets/img/recipe-guide/07.jpg
200     image/jpeg                           n/a      /larose-site/assets/img/recipe-guide/17.jpg
200     image/jpeg                           n/a      /larose-site/assets/img/recipe-guide/35.jpg

20 URLs checked; 0 non-200 responses.
```

The five article and three asset samples are random on each run. The tool preserves the `/larose-site/` base path while translating canonical sitemap paths to the temporary GitHub Pages deployment.

Tracking head detection returned `no` on all tested HTML in the current deployment. This means none of the supported GA4, Clarity, Meta Pixel or TikTok tracking signatures was present in the fetched HTML; it is a deployment/configuration observation, not an HTTP failure.

## Final verification

```text
$ node build/build.mjs
La Rose — built 346 pages

$ node tools/validate.mjs
Validated 346 pages
0 errors, 0 warnings
```

No dashboard, server, image asset, or GitHub workflow file was edited for this task. Concurrent article-cover updates were preserved; this work did not edit any article `image` field.
