# Dashboard charts report

## Scope

The existing Analytics view was extended in place. It still receives the dashboard's in-memory `content` object, which originates from `GET /api/content`, and every chart is recalculated when the view renders. No chart library, framework, CDN, sample dataset, or hardcoded result was added.

Implementation files:

- `dashboard/js/analytics.js`
- `dashboard/css/dashboard.css`

`dashboard/index.html` and `dashboard/js/dashboard.js` did not need structural changes; their existing Analytics navigation item, script order, IDs, data hooks, and render path remain intact.

## New owner-facing analytics

### Site coverage by specialty

This grouped horizontal chart answers which specialties are well supported on the public site and which need more content or social proof.

For each record in `specialties.json > specialties`:

- **Published knowledge** counts records in `articles.json > articles` where `published === true` and the specialty slug occurs in the record's `specialties` array. For compatibility with older records that have no `specialties` array, the chart falls back to the matching category's `specialty` value.
- **Published non-sample doctors** counts records in `doctors.json > doctors` where `published === true`, `sample !== true`, and the specialty slug occurs in the doctor's `specialties` array.
- **Published individual reviews** counts records in `reviews.json > reviews` where `published === true`, `sample !== true`, the record is not pending, and the specialty slug occurs in its `specialties` array.

One item may correctly contribute to more than one specialty when its live `specialties` array says it does. No relationship is inferred from prose.

### Published-content quality gaps

This action chart uses only published records in `articles.json > articles`. Each bar shows `records needing action / relevant records`:

- **Missing author:** `author` is empty.
- **Missing medical reviewer:** `reviewedBy` is empty.
- **Missing final image:** `image` is empty or `imagePlaceholder === true`.
- **Missing bilingual search description:** neither `seo.description` nor the bilingual `excerpt` fallback has both Arabic and English text. This mirrors the renderer's use of the excerpt as search-description fallback rather than pretending every entry needs a separate SEO field.
- **Article or update without sources:** applies only to records whose `type` is `article` or `update`, and counts those with no usable source label or URL.

The axis uses the relevant record total, so a small number of gaps does not visually fill the whole chart.

### Publishing and sample-content status

This grouped chart partitions each non-empty publishable collection into four mutually exclusive states:

- published, non-sample: `published === true && sample !== true`
- published sample: `published === true && sample === true`
- unpublished, non-sample: `published !== true && sample !== true`
- unpublished sample: `published !== true && sample === true`

The collections are specialties, doctors, branches, knowledge entries, digital products, and individual reviews. Empty collections are omitted instead of being made to look populated.

## Existing analytics enriched

The review card now includes a patient-proof inventory alongside the star-rating spread. It derives its figures from:

- published and pending records in `reviews.json > reviews` plus legacy `pending.items`
- `reviews.json > videos`
- `reviews.json > screenshots`
- `reviews.json > beforeAfter.pairs`, separated into consented non-sample pairs, sample stand-ins, and non-sample pairs without confirmed consent

The aggregate Google review total is deliberately not counted as if it represented individual review records.

The existing type, category, image, completeness, timeline, rating, and TODO charts remain. Their rendering was improved as follows:

- zero-record datasets now show an honest bilingual sentence instead of an empty axis;
- image coverage names only what the fields prove: whether an image path exists and whether it is marked as a stand-in; it does not infer provenance;
- bars, segments, and timeline points include native SVG titles derived from the same live values;
- all existing chart IDs and public analytics helper exports were preserved, with the new derivation helpers added to `window.DashboardAnalytics`.

## RTL, mobile, and accessibility

- SVG plotting remains physically left-to-right so numeric scales are conventional inside the RTL dashboard.
- Every visible bilingual SVG label is two lines: Arabic first, then a smaller English gloss. Both lines receive the same explicit `x` and `text-anchor`; the implementation does not use unsupported `text-align: match-parent` behavior.
- Multi-series bars use solid, hatch, dot, and cross patterns as well as colour. Their legends repeat distinct marks, so series are not identified by colour alone.
- Every chart has an `aria-label`, and every card includes a visually hidden table containing the same figures.
- Wide charts retain a readable minimum SVG width and scroll inside `.analytics-chart-scroll`. Dashboard cards and the page itself keep `min-inline-size: 0`/bounded overflow behavior, preventing page-level horizontal scrolling.

## Verification performed

Only read and write operations were used, as requested. The content JSON schemas and current values were read with PowerShell to cross-check the specialty joins, editorial-gap rules, publication partitions, and patient-proof groups. The changed JavaScript and CSS were then read back to inspect the complete inserted sections and verify that existing IDs/classes/hooks were retained.

Node, npm, Python, the build, and `tools/test-dashboard.mjs` were not run, per the task constraint.
