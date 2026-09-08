# Codex brief B2 — finish and polish the growth dashboard (leads, media buying, campaigns)

Read `AGENTS.md` §8b, `_project/CODEX-BRIEF-DASHBOARD2.md` (the original spec — still binding) and `_project/CODEX-DASHBOARD2-REPORT.md` (what the previous pass did and what it admitted it left undone). Then finish the job to the original spec. You own `dashboard/**`, `server/serve.mjs`, `tools/test-dashboard.mjs`, `content/campaigns.json`. Do not edit `build/**`, `site/**`, `content/site.json`, `integrations/**`.

## 1. Code quality — rewrite `dashboard/js/growth.js`
The previous pass wrote `growth.js` as ~80 lines of 400-character one-liners. That is unmaintainable and unlike the rest of this codebase. Rewrite it in the same style as `dashboard/js/dashboard.js` and `analytics.js`: one statement per line, named functions, short comments explaining *why*, template literals formatted so the HTML structure is readable, ≤ 100 chars per line. Split it if that helps: `leads.js` (fetch/cache/normalise/status updates/CSV), `growth.js` (lead analytics + KPI tiles), `media.js` (UTM / WhatsApp / landing pages / ad copy / events / checklists), `campaigns.js` (campaign summaries), `qr.js`. Keep the bridge into `dashboard.js` small and documented. Behaviour must not regress: the smoke test must still pass and be extended.

## 2. A real QR encoder in `dashboard/js/qr.js`
The current file draws a fake matrix from a hash — scanners cannot read it. Replace it with a correct QR encoder: byte mode, error-correction level M, versions 1–15 (auto-pick the smallest that fits), Reed–Solomon over GF(256), all 8 mask patterns evaluated with the standard penalty rules, format bits, version bits for v≥7, rendered as inline SVG with a 4-module quiet zone. Implement it yourself from the spec or vendor a known MIT implementation (e.g. Project Nayuki's `qrcodegen.js`, MIT) keeping its licence header. Prove it: add a unit check to `tools/test-dashboard.mjs` that encodes `https://laroseclinics.com/ar/patients/booking.html?utm_source=facebook` and asserts the matrix size and the exact finder/timing pattern positions, and decode-verify at least one known vector (e.g. the matrix for "HELLO WORLD" at version 1-M must match the reference bit rows you include in the test).

## 3. Missing features from the spec
- Leads per day chart for the selected range (line or bar; Cairo dates), placed first in the lead analytics.
- Campaigns: each campaign card/list row shows matched leads (case-insensitive match on `UTM campaign`; fallback `UTM source` when the campaign has no utmCampaign), contacted, booked, cost per lead and cost per booking from `budget`. List sortable by leads / booked / CPL. "Save as campaign" from the UTM builder must prefill a new campaign item (id from campaign name slug).
- Ad copy bank: per specialty AND the recipe book: 3 headlines (≤ 40 chars, enforced with a live counter), 2 primary texts (Arabic, first line ≤ 125 chars), 1 description, 2 CTA suggestions, 5 hashtags. Each line editable inline; edits persist to `campaigns.json → adCopy[<slug>][<field>][<index>]` through the normal dirty/save pipeline; a "reset to generated" per item. Copy buttons per line and "copy all for this specialty".
- Landing pages panel: group by section (home, specialties, doctors, branches, patients, articles, tools, digital, recipe guide, legal), show ar/en pairs on one row, lazy-fetch title/description on expand, flag booking forms, copy buttons, "recommended for ads" badge as specified.
- Integrations panel (Settings): the "Test endpoint" button must show three results — liveness probe, leads read with the stored token (row count or the exact error), and the tracking check of `/ar/index.html` (which snippets are present: gtag id, clarity id, fbq id, ttq id, verification metas).
- Overview KPI tiles must be real (leads today / 7d / 30d, pending, top source, booked 30d, tracking configured per tag) and degrade gracefully with no token (show "—" and a link to Settings).

## 4. Design polish (this is a product the clinic's team will use daily)
- Make the new sections look like the existing ones: same panel, card, table and form components, same spacing rhythm, no ad-hoc inline styles. Add CSS to `dashboard.css` under a clearly labelled section.
- Tables: sticky header, zebra rows, right-aligned numbers, status shown as a coloured pill (new = champagne, contacted = olive, booked = green, no-answer = grey, lost = rose).
- Mobile (≤ 720px): lead rows become cards; toolbar wraps; tabs scroll horizontally inside their own container; nothing causes horizontal page scroll at 380px. Charts scale via `viewBox`.
- Empty and error states with the one-line fix hint, as specified.
- Keyboard: every control reachable; tabs use `role="tab"` + arrow keys.

## 5. Verify
`node server/serve.mjs 4178 &`, `node tools/test-dashboard.mjs http://localhost:4178` must pass; then kill the server. `node build/build.mjs` must succeed (do not worry about validator errors that come only from `site/google-test.html`; the other agent is fixing that). Write `_project/CODEX-DASHBOARD3-REPORT.md` with files changed, what remains (should be nothing from the spec), and the verification output.
