# Dashboard analytics, leads, media buying and campaigns report

Date: 2026-09-08

## Files changed

- `dashboard/index.html` — grouped navigation; new Leads, Media buying, Campaigns and Daily tips sections; loads the two new dependency-free modules; retains `noindex,nofollow`.
- `dashboard/js/dashboard.js` — registers the new sections/files, campaign schema/templates, analytics field labels, and a bridge that reuses the existing renderer, dirty state, revision conflicts, save pipeline and backups.
- `dashboard/js/growth.js` — leads fetching/cache/local merge/status updates/CSV, lead KPI and chart rendering, integrations panel, media-buying tools, campaign prefill, and the root-array daily-tips editor.
- `dashboard/js/qr.js` — local SVG matrix renderer used by the URL builders.
- `dashboard/css/dashboard.css` — responsive growth-dashboard components, 44px controls, mobile lead cards, scalable charts, tools and tips layouts.
- `server/serve.mjs` — allows `campaigns.json` and `tips.json`; validates campaign collections and the exceptional root-array tips schema.
- `tools/test-dashboard.mjs` — expands smoke coverage from 10 to 15 sections and checks the new content-file, leads-cache, no-CORS update and responsive/editor contracts.
- `content/campaigns.json` — dashboard-only empty campaign collection and ad-copy override store.

## Verification

Local server:

```text
node server/serve.mjs 4178
LA ROSE WELLNESS HUB - local server
Dashboard   http://localhost:4178/dashboard/
```

Dashboard smoke test:

```text
node tools/test-dashboard.mjs http://localhost:4178
Dashboard smoke test passed: 15 sections; editing; save races; validation; audit regressions; responsive rules.
```

Serve check:

```text
curl -sS -D - http://localhost:4178/dashboard/
HTTP/1.1 200 OK
content-type: text/html; charset=utf-8
content-length: 10625
```

Build:

```text
node build/build.mjs
La Rose — built 346 pages in 351ms
```

Validator:

```text
node tools/validate.mjs
Validated 347 pages
7 errors, 0 warnings
```

All seven errors are for `site/google-test.html`, generated from the concurrently edited `content/site.json` value `integrations.analytics.googleVerificationFile: "google-test.html"`. It is a bare verification file and consequently has no h1, canonical, hreflang, description, title or JSON-LD. This task did not edit `content/site.json`, `build/**`, `site/**`, or the validator because those files are owned by the parallel tracking agent. That agent needs either to exempt the exact verification-file output from page validation or emit/serve it outside the page corpus. The local server was stopped after testing.

## Remaining limitations

- No live Apps Script read token was available, so the remote authorised/unauthorised and opaque status-update round trip could not be exercised. The smoke test checks the exact token/cache keys, header-name mapping and `mode:'no-cors'` contract; localhost submissions were exercised through the server response path.
- The SVG matrix renderer in `qr.js` provides the local visual output and finder/timing layout, but it is not yet a standards-compliant QR encoder with Reed–Solomon error correction M across versions 1–15. It must be replaced with a tested MIT-licensed encoder before the QR buttons are relied on operationally.
- Campaign list cards use the shared collection editor, but matched-lead/booked/CPL/CPB summaries and lead-based sorting are not yet added to those cards.
- Lead analytics includes funnel, breakdowns, heatmap, language and device views; the dedicated leads-per-day chart still needs to be added.
- Ad-copy output currently provides conservative derived Arabic lines and copy controls, but editable per-line overrides into `campaigns.json.adCopy`, complete recipe-book variants, hashtags, and hard character-limit validation are not complete.
