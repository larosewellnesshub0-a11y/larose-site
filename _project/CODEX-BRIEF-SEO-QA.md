# Codex brief D — SEO polish and live-site QA

Read `AGENTS.md` (incl. §10), `PROJECT.md`, `_project/AUDIT-SEO.md`. The site is now deployed at
https://larosewellnesshub0-a11y.github.io/larose-site/ (temporary project URL; the custom domain
laroseclinics.com is being moved). You own `build/**`, `content/articles.json` (metadata fields only:
title/excerpt/seo — never touch `image`, another process is writing covers), `content/specialties.json`
(seo fields only), `tools/validate.mjs`, `tools/**` new scripts. Do not touch `dashboard/**`, `server/**`,
`site/assets/img/**`, `.github/**`. Run `node build/build.mjs` + `node tools/validate.mjs` (0 errors) at the end.

1. Fix every finding in `_project/AUDIT-SEO.md` (titles ≤ 60 chars incl. brand suffix, descriptions 120–160,
   the doctors hub h2, etc.). Keep Arabic masculine voice; English real translations.
2. Article pages: `og:image` / `twitter:image` must be the entry's own cover (`entry.image`, absolute URL,
   with width/height), not the site hero. Add `Article` JSON-LD (headline, image, datePublished, author
   as the doctor Person, publisher = the clinic) and `FAQPage` JSON-LD where an entry has `faq`. Q&A entries
   should use `QAPage`/`Question`+`Answer`. Validate JSON-LD parses (validator rule 10 already checks).
3. Sitemap: per-URL `<lastmod>` from the entry `date` where available (articles) else the build date;
   images: add `<image:image>` entries for article covers and specialty frames (image sitemap namespace).
4. Every `<img>` on every generated page must reference an existing file — add that check to
   `tools/validate.mjs` (currently only links are checked; confirm and extend). Generated cover images must
   have meaningful `alt` (the entry title) — check `build/pages/articles.mjs` and fix.
5. Add `tools/check-live.mjs`: given a base URL (default the github.io URL above) it fetches `/`, `/ar/`, `/en/`,
   `/RecipeGuide/`, `/RecipeGuide/free/`, `/robots.txt`, `/sitemap.xml`, `/agents.txt`, `/llms.txt`,
   `/404.html`, `/dashboard/`, `/dashboard/content/index.json`, 5 random article URLs from the sitemap
   and 3 random asset URLs, and reports status + content-type + whether the tracking head is present.
   Note: on the temporary project URL the site is served under `/larose-site/`; make the tool handle a base
   path. Run it and put the output in the report.
6. Report to `_project/CODEX-SEO-QA-REPORT.md`.
