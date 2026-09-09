# Launch guide — laroseclinics.com on GitHub Pages

Written 2026-09-08. Everything below that needs an account is listed with the exact account.

## 1. GitHub (hosting)
1. Create a repository (e.g. `larose-site`) under the owner's GitHub account. It must be **public** for free GitHub Pages
   (private data never enters the repo: `content/_private/` and `content/campaigns.json` are git-ignored).
2. `git remote add origin <repo url>` inside `new site/`, then `git push -u origin main`.
3. Repo → Settings → Pages → Source: **GitHub Actions**. The workflow `.github/workflows/deploy.yml` builds `site/`
   and publishes it. Custom domain: `laroseclinics.com` (the build writes `site/CNAME`). Tick **Enforce HTTPS**
   once the certificate is issued (a few minutes after DNS resolves).

## 2. Hostinger DNS (domain laroseclinics.com)
Delete any existing `A`/`AAAA`/`CNAME` for `@` and `www`, then add:

| Type  | Name | Value |
|-------|------|-------|
| A     | @    | 185.199.108.153 |
| A     | @    | 185.199.109.153 |
| A     | @    | 185.199.110.153 |
| A     | @    | 185.199.111.153 |
| AAAA  | @    | 2606:50c0:8000::153 |
| AAAA  | @    | 2606:50c0:8001::153 |
| AAAA  | @    | 2606:50c0:8002::153 |
| AAAA  | @    | 2606:50c0:8003::153 |
| CNAME | www  | `<github-username>.github.io` |

Propagation is usually under an hour. Check with `dig laroseclinics.com +short`.

## 3. Google (account larosewellnesshub0@gmail.com)
- **Apps Script**: open the sheet "La Rose — Bookings & Enquiries" → Extensions → Apps Script → replace `Code.gs`
  with `integrations/apps-script/Code.gs` → Project Settings → Script Properties → add `READ_TOKEN` (a long random
  string) → Deploy → Manage deployments → pencil → Version: New version → Deploy. The URL does not change.
  Paste the same token in the dashboard → Settings → Integrations (it stays in the browser only).
- **Search Console**: add property `laroseclinics.com` (Domain property via DNS TXT at Hostinger, or URL-prefix
  with the HTML file: put the file name in `integrations.analytics.googleVerificationFile` and rebuild). Submit
  `https://laroseclinics.com/sitemap.xml`. Request indexing for `/ar/`, `/en/`, `/RecipeGuide/`.
- **GA4**: create property "La Rose Wellness Hub", web stream `https://laroseclinics.com`; copy the `G-…` id into
  `integrations.analytics.ga4MeasurementId`. Mark `booking_submit`, `whatsapp_click`, `call_click` as key events.
- **Clarity** (clarity.microsoft.com, same Google login): new project → copy the project id into
  `integrations.analytics.clarityProjectId`.
- Meta Pixel / TikTok Pixel ids go in the same object when the media buyer supplies them.

After editing ids: Save in the dashboard → Publish (or `node build/build.mjs` + commit + push).

## 4. Verify after launch
- `https://laroseclinics.com/` redirects to `/ar/`; `/en/`, `/RecipeGuide/`, `/RecipeGuide/free/`, `/robots.txt`,
  `/sitemap.xml`, `/agents.txt`, `/llms.txt`, `/404.html` all answer 200 over HTTPS.
- Submit the booking form once with source `website-test`; a row must appear in the sheet with UTM columns.
- Dashboard → Settings → Integrations → "Test endpoint" shows liveness + leads read + tracking check all green.

## 5. Status 2026-09-08 22:35 (Cairo)
- Repo: https://github.com/larosewellnesshub0-a11y/larose-site — Pages source = GitHub Actions; first deploy
  succeeded at https://larosewellnesshub0-a11y.github.io/larose-site/
- `laroseclinics.com` is currently attached to another GitHub account's Pages site
  (`www` CNAME → youssefhagag1411-design.github.io). To move it, GitHub asks for domain verification:
  TXT host `_github-pages-challenge-larosewellnesshub0-a11y` value `1e11a3520b314fa293322d4b58498e`
  at Hostinger, then "Verify" at https://github.com/settings/pages_verified_domains/laroseclinics.com,
  then set the custom domain in the repo Pages settings and change `www` CNAME to
  `larosewellnesshub0-a11y.github.io`. A records already point at GitHub Pages.

## 6. Status 2026-09-09 00:25 (Cairo)
- LIVE at https://laroseclinics.com (HTTPS enforced). Domain verified on the larose GitHub account and attached to the repo.
- Search Console: domain property `laroseclinics.com` verified via DNS TXT (Hostinger); sitemap submitted (344 URLs, Success);
  indexing requested for /ar/, /en/, /RecipeGuide/.
- Hosted dashboard: https://laroseclinics.com/dashboard/ — username `larose`, password `LaRose-Hub-2026!`
  (client-side gate; change the hash in `dashboard/js/auth.js`).
- Clarity: signing in with larosewellnesshub0@gmail.com (Google) in progress.
- GA4: analytics.google.com is blocked in the Chrome extension permissions; create the property manually or allow the domain.
- 00:45: Clarity project `yfaiazec51` (account larosewellnesshub0, Google sign-in) live on every page; Google
  site-verification meta live. GA4 property and the Apps Script redeploy (READ_TOKEN + UTM columns) still need
  the Chrome extension to be allowed on analytics.google.com and script.google.com.

## 2026-09-09 — Apps Script redeployed (version 2)
- Project "Larose reservation sheets" (larosewellnesshub0@gmail.com) now runs the token-gated `integrations/apps-script/Code.gs`; deployment URL unchanged (`formsEndpoint` in `content/site.json` still valid).
- Script property `READ_TOKEN` set (value in `_project/.read-token`, git-ignored). Verified: `?action=leads&token=…` returns headers + rows; wrong token → `unauthorised`; POST appends a row with the UTM columns.
- The read token is stored in the Chrome localStorage key `lr_dash_leads_token` for https://laroseclinics.com/dashboard/ (Settings → Integrations shows it). Other browsers: paste it there once.
- Test rows in the sheet (source `website-test`) can be deleted.

## 2026-09-09 — GA4 live
- Account "La Rose Wellness Hub" (a407357780) → property "laroseclinics.com" (p553430881) → web stream "La Rose website" (15746304931), Measurement ID `G-2VLTT89JM7` (in `content/site.json → integrations.analytics.ga4MeasurementId`, deployed).
- Realtime verified: page_view + custom events (booking_submit, whatsapp_click, call_click, form_submit, recipe_guide_cta, tool_used, directions_click) arrive.
- TODO within 24–48h (after the events show in Admin → Events → Recent events): star booking_submit, whatsapp_click, call_click, form_submit, recipe_guide_cta as **Key events**. Optional: Admin → Product links → Search Console link.
- Links: GA4 https://analytics.google.com/analytics/web/#/p553430881/reports/intelligenthome · Clarity https://clarity.microsoft.com/projects/view/yfaiazec51 · Search Console https://search.google.com/search-console?resource_id=sc-domain:laroseclinics.com
