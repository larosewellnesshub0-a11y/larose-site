# La Rose Wellness Hub

## What this repository is

La Rose Wellness Hub is a bilingual Arabic and English static website generated
by a small, zero-dependency Node.js program. It has no npm package, framework,
database, or third-party build tooling. The source of truth is `content/*.json`;
the templates and shared rendering code are in `build/`; and the public output is
written to `site/` as static files.

Run `node build/build.mjs` to generate the site. It currently reports **408
pages**. That number is `written.length` in `build/build.mjs`: each call to the
generator's `out()` function adds one generated HTML page to `written` before the
final total is printed. It includes the language gate, the root 404 page, Arabic
and English pages, and the two RecipeGuide pages.

`site/` is the deliverable, but its generated HTML is not an editing surface.
Change JSON, templates, or hand-managed assets as appropriate, then rebuild.

## Source layout

| Path | Owns |
| --- | --- |
| `content/site.json` | Clinic-wide facts, contact and social data, navigation, footer, legal and UI text, media metadata, integrations, sharing, and the integrated-consultation content. |
| `content/specialties.json` | Specialty records and their bilingual copy, treatments, FAQs, SEO fields, publication state, and related media metadata. |
| `content/doctors.json` | Doctor records, including names, credentials, schedules, specialty links, portraits, and sample markers. |
| `content/branches.json` | Branch records, status, addresses and maps where supplied, schedules, photos, and branch-card imagery. |
| `content/articles.json` | Knowledge Centre categories and entries, including articles, updates, Q&A, and entry metadata. |
| `content/reviews.json` | Review aggregate and topics, published reviews, video and screenshot references, moderation data, and before-and-after records. |
| `content/digital.json` | Digital products and their bilingual page content. |
| `content/pages.json` | Copy for the static home, about, patient, contact, and legal pages. |
| `content/recipe-guide.json` | RecipeGuide sections, categories, and recipes. |
| `content/tips.json` | The bilingual rotating daily-tip collection. The build emits it as `site/assets/data/tips.json`. |
| `content/_submissions.json` | Local-server submission storage. It is not loaded by the static generator and is excluded from the published dashboard snapshot. |
| `build/` | The generator, shared page shell and components, utilities, and page modules. |
| `site/` | Generated public documents plus the assets they reference. Do not hand-edit generated HTML here. |
| `dashboard/` | The dashboard application. The deployment workflow copies it into the published tree and produces a public, read-only content snapshot. |
| `server/serve.mjs` | Local preview server and dashboard API. It is not needed by the published static site. |

The generator loads the ten public source collections through
`build/lib/util.mjs`, renders page modules registered in `build/build.mjs`, and
also creates the language gate, root 404 page, sitemap, robots file, crawler
files, CNAME, and optional verification file.

## Build and verification gate

Run all four commands after any source change. A change is not ready until all
four pass.

```powershell
node build/build.mjs
node tools/validate.mjs
node tools/audit.mjs
python tools/check_voice.py
```

1. `build/build.mjs` reads the content, regenerates the locale trees, and reports
   the generated-page total.
2. `validate.mjs` checks generated pages for resolvable internal links and image
   files, one H1, labels, language and direction, canonical and alternate URLs,
   descriptions, JSON-LD, locale counterparts, template artefacts, and public
   price leaks. It must report `0 errors, 0 warnings`.
3. `audit.mjs` is a separate built-output audit. It checks alt text, intrinsic
   image dimensions, duplicate IDs and titles, heading order, hreflang targets,
   JSON-LD parseability, em dashes, and price text. Together with the validator's
   counterpart checks, this verifies hreflang reciprocity. It must report no
   findings and no blocking findings.
4. `check_voice.py` scans rendered Arabic output, dashboard code, and site
   scripts for forbidden feminine second-person forms. It must print `PASS`.

The audit intentionally overlaps a few validator checks. The separate pass is
valuable because it examines assembled HTML and has its own intrinsic-size,
metadata, heading-sequence, typography, and copy checks.

## Arabic content rules

Arabic is warm Egyptian Arabic. Address the reader in the masculine or neutral
second person: use forms such as `احجز`, never feminine reader-address forms.
`tools/check_voice.py` makes violations a failed gate.

The one sanctioned exception is the two `/RecipeGuide/` pages. They reproduce
the clinic's published RecipeGuide wording, including feminine forms, and are
explicitly excluded by the checker. No other page is exempt.

Keep Arabic and English as real counterparts. Do not invent clinical facts,
people, credentials, locations, statistics, or citations. If a required fact is
not supplied, use `UNKNOWN` or retain the established empty state rather than
guessing.

Technical Latin terms in Arabic copy should be passed through `latin()` so the
term is correctly wrapped for bidi ordering and font selection.

## CSS compatibility rule

`text-align: match-parent` is banned. Chrome does not implement it. Use explicit
alignment and direction behaviour that work in the supported browser instead.

## Images and layout stability

Responsive image support is implemented in `build/lib/util.mjs` and must be
used by templates rather than duplicating `srcset` logic.

- `imageSize(relPath)` reads intrinsic dimensions from the actual WebP, PNG, or
  JPEG asset. It caches the result and never trusts a filename as a dimension.
- `sizeAttrs(relPath)` turns those measured dimensions into `width` and `height`
  attributes, preventing layout shift where it is used.
- `responsiveAttrs(relPath, sizes, toUrl)` discovers existing sibling variants
  named with `-600`, `-700`, `-900`, or `-1200` before the extension, measures
  their real widths, and emits a `srcset` only when at least two usable variants
  exist. `IMAGE_SIZES` supplies layout-specific `sizes` values.

When adding an image to an HTML template, use `responsiveAttrs()` with the
appropriate `IMAGE_SIZES` entry and use `sizeAttrs()` when the dimensions are
not already known from the template's fixed source. Give meaningful content
images an accurate `alt`; use an empty alt only for genuinely decorative images.

## Hosting and deployment boundary

The live website is `https://laroseclinics.com/` on GitHub Pages. The GitHub
Actions workflow in `.github/workflows/deploy.yml` runs on pushes to `main` and
can also be run manually. It builds the site, runs `validate.mjs`, copies the
dashboard into the published tree, creates the public dashboard snapshot, and
deploys `site/` to GitHub Pages. The workflow verifies the generated CNAME and
the no-Jekyll marker before deployment.

Hostinger is for DNS and email only. It is not the web host.

The Apps Script web app that receives booking posts is not in this repository.
It lives in Google Apps Script and is deployed there, not from here. This
repository contains an `integrations/apps-script/` reference implementation and
deployment notes, but changing that local source does not change the deployed
web app.

For the operational procedure, including checks and rollback, see
[`_project/LAUNCH.md`](_project/LAUNCH.md).
