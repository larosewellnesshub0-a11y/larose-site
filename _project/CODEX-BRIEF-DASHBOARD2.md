# Codex brief B — dashboard: analytics, leads, media-buying tools, campaigns

You are working inside the La Rose Wellness Hub static-site project (this directory).
READ `AGENTS.md` (especially §8b "The dashboard") and `PROJECT.md` FIRST, then `_project/CODEX-DASHBOARD-FIXES.md` and `_project/NOTE-ANALYTICS.md` to learn how the dashboard is built. Key rules:
- Files you own: `dashboard/**`, `server/serve.mjs`, `tools/test-dashboard.mjs`, and the NEW `content/campaigns.json`. You may read everything else.
- Do NOT edit `build/**`, `site/**`, `content/site.json`, `content/digital.json`, `integrations/**`, `site/assets/js/*` — another agent is editing those in parallel. (Read-only is fine.)
- The dashboard has ZERO dependencies and must stay that way: no CDN, no npm. Charts are hand-drawn inline SVG (see `dashboard/js/analytics.js` helpers — reuse them; extend them if needed).
- Bilingual labels everywhere (Arabic first, English small), RTL layout, 44px touch targets, must work at 380px width. The existing style system in `dashboard/css/dashboard.css` is the reference; make everything feel like one professional product, not bolted-on panels.
- `node tools/test-dashboard.mjs` must pass at the end (extend it for the new sections). `node build/build.mjs` and `node tools/validate.mjs` must still pass (you are not changing them, but confirm).
- Never test a write endpoint against a real content file with junk (see AGENTS.md §8).

Context you need:
- The site posts booking/enquiry forms to a Google Apps Script endpoint (`site.json → integrations.formsEndpoint`) which appends rows to a Google Sheet. The other agent is extending that script RIGHT NOW so that:
  - `GET <formsEndpoint>?action=leads&token=<READ_TOKEN>` returns `{ok:true, headers:[…], rows:[[…]], updatedAt}`; headers are: `Timestamp, Source, Name, Phone, Specialty, Doctor, Branch, Preferred day, Preferred time, Message, Language, Page URL, Status, Notes, UTM source, UTM medium, UTM campaign, UTM content, UTM term, Click ID, Landing page, Referrer, Device, First touch`. Older rows may have fewer columns — be tolerant; look values up by header name, never by index.
  - `POST <formsEndpoint>` with a `text/plain` JSON body `{action:'updateStatus', token, row:<1-based sheet row>, status, notes}` updates a row. Browser POSTs to Apps Script must use `mode:'no-cors'` with `Content-Type: text/plain` (see `site/assets/js/forms.js` for the reason) — the response is opaque, so re-fetch the leads afterwards to confirm. Apps Script GETs return normal CORS-readable JSON.
  - Row numbers: `rows[i]` corresponds to sheet row `i + 2`. Include `row` in each lead object.
  - The token must NEVER be written into any content file or the repo. Store it in `localStorage` (`lr_dash_leads_token`) and let the user paste it in the dashboard.
- `site.json → integrations.analytics` (being added by the other agent) has keys `ga4MeasurementId, clarityProjectId, metaPixelId, tiktokPixelId, googleSiteVerification, googleVerificationFile, bingSiteVerification`. The Settings section already renders site.json generically; add `FIELD_LABELS` entries + help text for those keys so a non-technical editor understands them.
- The site fires these events (names are fixed): `whatsapp_click, call_click, booking_submit, form_submit, recipe_guide_cta, social_click, language_switch, scroll_depth, tool_used, directions_click`.
- The local server already exposes `/api/submissions` (local-only form log), `/api/status`, `/api/images`, `/api/content`, `/api/backups`.
- The public site will live at `https://laroseclinics.com`; the dashboard at `/dashboard/` (noindex). The local server stays the way content is edited for now.

Deliver ALL of the following. Write a report to `_project/CODEX-DASHBOARD2-REPORT.md` (files changed, what each does, verification output, anything left undone and why).

## 1. Information architecture
Sidebar becomes grouped:
- **Overview** (KPI tiles: leads today / 7 days / 30 days, pending (status=new) leads, top source 30d, booked 30d, pages built, open TODOs, last build time, tracking configured yes/no per tag) — keep the existing TODO list below the tiles.
- **Analytics** (existing content analytics + the new lead analytics, with a date-range control 7/30/90/all and a "refresh" button)
- **Leads & bookings** (new)
- **Media buying** (new; sub-tabs: UTM builder · WhatsApp links · Landing pages · Ad copy bank · Events & pixels · Checklists)
- **Campaigns** (new collection editor over `content/campaigns.json`)
- Content: Specialties, Doctors, Branches, Articles, Reviews, Digital products, **Daily tips** (new: edits `content/tips.json`, array of `{id, ar, en}`; add/remove/reorder; `id` must be a slug)
- Site: Settings (add an **Integrations** panel at the top: the analytics IDs from site.json with labels/help + the dashboard-only leads token field + "Test endpoint" button that GETs the liveness probe and the leads read and reports the result + quick-link cards to GA4, Clarity, Search Console, Meta Events Manager, TikTok Ads Manager, Google Business Profile, Apps Script editor, the Sheet), Images, Backups.
Server: add `campaigns.json` and `tips.json` to `CONTENT_FILES` and `COLLECTION_RULES` in `server/serve.mjs` (campaigns: key `campaigns`, id `id`, required `id, name`; tips: root is an ARRAY not an object — handle that: the validator currently requires an object root; allow an array root for `tips.json` only and require each item to have `id, ar, en`). Create `content/campaigns.json` as `{"_note": "...", "campaigns": [], "adCopy": {}}`. `campaigns.json` is never published; the build ignores it.

## 2. Leads & bookings
- Fetch via the read endpoint (endpoint from `site.json`, token from localStorage). Cache the last successful response in localStorage (`lr_dash_leads_cache`) with its timestamp so the section opens instantly and offline; show "last updated". When running on localhost also merge `/api/submissions` rows (mark source `local-preview`).
- Table with: timestamp (Cairo time, relative + absolute), name, phone (tap-to-call + WhatsApp button that opens `https://wa.me/<phone>` with the leading 0 replaced by 20), specialty, branch, preferred day/time, source/UTM (source · medium · campaign), device, status (select: new / contacted / booked / no-answer / lost), notes (inline edit), page URL (short). Search box, filters (status, source, specialty, branch, date range), sort by newest. Save status/notes → POST updateStatus → optimistic UI → refetch after 2s.
- CSV export of the filtered view (client-side Blob download, UTF-8 BOM so Excel reads Arabic).
- Mobile: rows become cards below 720px.
- Empty/error states: no endpoint, no token, unauthorised, network error — each with a one-line fix hint.

## 3. Lead analytics (in Analytics, above the content charts)
All inline SVG via the helpers in `analytics.js` (add a line chart, a heatmap and a funnel helper if missing):
- Leads per day for the selected range (line/bar)
- Funnel: total → contacted → booked (from status)
- By source, by campaign, by specialty, by branch (horizontal bars)
- Weekday × hour heatmap (Cairo time) — "when do leads arrive"
- Language split and device split (small stacked bars)
- A table under each chart (the existing `dataTable` pattern) for screen readers.
Filters share the date range control.

## 4. Media buying tools
a. **UTM builder**: choose a landing page from the site's page list (fetch `/sitemap.xml` and parse `<loc>`; fall back to `/api/status` pages list; group by section; show ar/en), platform preset (Meta/Instagram → source `facebook`/`instagram`, medium `paid_social`; TikTok; Google Ads → `google`/`cpc`; Snapchat; YouTube; WhatsApp broadcast → `whatsapp`/`message`; Email; QR/print → `qr`/`offline`), campaign, content, term. Live URL preview, copy button, "save as campaign" (pre-fills the Campaigns editor), and a QR code. Implement a dependency-free QR encoder in `dashboard/js/qr.js` (byte mode, error correction M, versions 1–15, rendered as SVG). If you vendor a known MIT implementation, keep the licence header.
b. **WhatsApp link builder**: number from `site.json`, message templates (Arabic, masculine voice) per specialty and for the recipe book, optional reference token `[LR-<source>-<campaign>]` appended on a new line (same format the site uses), output `https://wa.me/<number>?text=…` + copy + QR.
c. **Landing pages**: every public page from the sitemap with title and meta description (fetch each HTML lazily on expand; cache), ar/en pair, "has booking form" flag (page HTML contains `data-form-source`), copy URL buttons, and a "recommended for ads" badge for specialty pages, booking, RecipeGuide landing, home.
d. **Ad copy bank**: generated from `specialties.json` (`name, short, intro/lede, treatments`), `doctors.json`, `digital.json`: for each specialty and the recipe book produce 3 headlines (≤ 40 chars), 2 primary texts (≤ 125 chars first line, Arabic), 1 description, CTA suggestions, and hashtags — masculine Egyptian voice, no prices, no guarantees, no "أفضل" superlatives, no medical claims beyond the page's own copy. Editable overrides saved to `campaigns.json → adCopy[<slug>]`. Copy buttons per line.
e. **Events & pixels reference**: table of the site's events (list above) with params, when they fire, and the GA4 / Meta / TikTok mapping; plus a **Tracking check** that fetches `/ar/index.html` and reports which snippets are present (gtag id, clarity id, fbq id, ttq id, verification meta).
f. **Checklists**: Meta Pixel + Events Manager, Meta Conversions API note, GA4 key events, Search Console verification + sitemap submission, Clarity, Google Business Profile — each a persisted checklist (localStorage) with a link.

## 5. Campaigns
Collection editor over `content/campaigns.json` items: `id (slug), name, platform, objective, status (planned/active/paused/ended), startDate, endDate, budget (number, internal), currency, utmSource, utmMedium, utmCampaign, landingUrl, audience, notes`. Each item card shows matched leads (rows whose `UTM campaign` equals `utmCampaign`, case-insensitive), booked count, and cost per lead / per booking computed from `budget` (dashboard only — never rendered publicly, and it is not a public price). List view sortable by leads.

## 6. Polish
- The topbar Save button, dirty state, conflict handling and backups must keep working for the new files.
- Add the new sections to `SECTION_META`, the nav, `render()`, `switchSection()` and the smoke test.
- Everything keyboard-accessible; charts have `aria-label` + tables.
- 380px: sidebar drawer, tables → cards, charts scale with `viewBox`, no horizontal page scroll.
- Keep `dashboard/index.html` `noindex`.

## 7. Verify
Start `node server/serve.mjs 4178`, run `node tools/test-dashboard.mjs http://localhost:4178`, and curl `/dashboard/` to confirm it serves. Kill the server. Confirm `node build/build.mjs` and `node tools/validate.mjs` still pass. Put the outputs in the report.
