# Codex tracking, SEO, RecipeGuide, and disclaimer report

Date: 2026-09-08

## Outcome

Implemented content-driven analytics tags and verification metadata, a dependency-free event and attribution layer, attributed form capture, token-gated Apps Script lead reads/status updates, generated GitHub Pages and crawler files, the RecipeGuide landing/free-guide URL split, and the requested disclaimer cleanup. Tracking IDs are restored to empty in the final build.

## Files changed

### Source and hand-managed assets

- `content/site.json` — added the `integrations.analytics` configuration with empty IDs; removed the public Ask-AI diagnosis note.
- `content/digital.json` — moved the recipe-book free sample URL to `/RecipeGuide/free/` and updated its note.
- `build/lib/shell.mjs` — added the single exported `trackingHead(c)` implementation, robots metadata, and deferred `track.js` loading on every standard page.
- `build/lib/components.mjs` — removed the note beneath the Ask-AI buttons while retaining the buttons.
- `build/build.mjs` — reused `trackingHead` in the root gate; generated `robots.txt`, `agents.txt`, `.nojekyll`, `CNAME`, optional Google verification files, root `404.html`, RecipeGuide entries in `llms.txt`, and RecipeGuide-aware sitemap alternates.
- `build/pages/recipe-guide.mjs` — split output into the product landing at `/RecipeGuide/` and the existing bilingual 60-recipe guide at `/RecipeGuide/free/`; fixed two-level asset paths; added the return link, metadata, tracking, cover selection, content-driven sections, WhatsApp ordering flow, free CTA, and Product JSON-LD without offers.
- `build/pages/digital.mjs` — replaced defensive payment wording with neutral WhatsApp ordering/payment information.
- `build/pages/patients.mjs` — marked the actual booking form with `data-form-source="booking"`.
- `site/assets/js/track.js` — new event API, delegated click/form listeners, scroll-depth/tool events, UTM/click-ID storage, and WhatsApp attribution rewriting.
- `site/assets/js/forms.js` — appended campaign, click ID, landing/referrer, device, and first-touch fields to captured payloads.
- `site/assets/js/tools.js` — dispatches `lr:tool-result` when a result panel is shown; removed the obsolete disclaimer comment.
- `site/assets/css/recipe-guide.css` — added landing-page, cover, section, list, FAQ, button, and responsive styles.
- `integrations/apps-script/Code.gs` — expanded columns and accepted fields; added header extension/reorder safety; added token-gated lead reads, optional `since`, safe JSONP callback, and status/notes updates.
- `integrations/apps-script/README.md` — documented `READ_TOKEN` storage, setup, rotation, read/update calls, and version redeployment.
- `tools/validate.mjs` — registered the root 404 and both single-document bilingual RecipeGuide URLs as standalone pages for canonical/hreflang validation.

### Generated output

Running `node build/build.mjs` regenerated all 346 public HTML files under `site/ar/**`, `site/en/**`, `site/index.html`, and the RecipeGuide output. Their shared changes are the robots meta and deferred tracking script; article output also reflects removal of the Ask-AI note, tool pages contain no disclaimer banner, digital product pages contain the neutral ordering copy, and the booking pages carry the booking source marker.

Generated/new root artifacts:

- `site/RecipeGuide/index.html` — recipe-book landing.
- `site/RecipeGuide/free/index.html` — free 60-recipe guide.
- `site/404.html` — bilingual root 404 using absolute `/assets/...` paths.
- `site/robots.txt` — global and named-crawler rules plus protected-path exclusions.
- `site/agents.txt` — content-backed clinic/contact/key-URL agent summary and policy.
- `site/llms.txt` — includes both RecipeGuide URLs.
- `site/sitemap.xml` — includes both RecipeGuide URLs with bilingual alternates; excludes dashboard and underscore tools.
- `site/.nojekyll` — empty GitHub Pages marker.
- `site/CNAME` — exact content `laroseclinics.com`.

Other dirty files visible in the worktree (`dashboard/**`, `server/serve.mjs`, `content/campaigns.json`, `content/branches.json`, clinic/branch image assets, and related dashboard files) were concurrent work from another agent and were not edited for this brief.

## Tracking and attribution details

- `window.LRTrack.event(name, params)` pushes to `dataLayer` and forwards safely to configured GA4, Meta, TikTok, and Clarity globals.
- Auto-events cover WhatsApp, calls, booking/other forms, RecipeGuide CTAs, social networks, language switches, 25/50/75/100% scroll depth, health-tool results, and Google Maps directions.
- Session touch data is stored in `sessionStorage.lr_touch`; first touch is stored for 30 days in `localStorage.lr_first_touch`.
- WhatsApp attribution keeps the original host/path/query and appends the required `[LR-source-campaign]` token to existing/default text, normalised to lowercase hyphenated ASCII and capped at 40 characters.

## Disclaimer audit

- Health-tool templates do not render `toolDisclaimer`; only the existing legal footer link remains.
- The Ask-AI diagnosis note was removed; assistant buttons remain.
- Digital ordering copy is now: `الطلب والدفع بيتم على واتساب مع الفريق` / `Ordering and payment are handled with the team on WhatsApp`.
- Template grep for `مش تشخيص`, `not a diagnosis`, `not medical advice`, and `إخلاء` outside `build/pages/legal.mjs` returned no matches.
- The remaining matches are confined to `build/pages/legal.mjs` (the medical disclaimer page), as required.
- Sample doctor and sample-content markers were not changed.

## Verification

Final build:

```text
La Rose — built 346 pages in 346ms
```

Final validator:

```text
Validated 346 pages
0 errors, 0 warnings
```

Generated-file checks:

```text
CNAME=laroseclinics.com
.nojekyll bytes=0
sitemap recipe URLs=2
sitemap excluded paths=0
empty tracking tags=0
```

Local server and curl checks on port 4177:

```text
/RecipeGuide/      200  10490 bytes
/RecipeGuide/free/ 200  803885 bytes
/robots.txt        200  2961 bytes
/agents.txt        200  1533 bytes
/404.html          200  3322 bytes
/ar/index.html     200  92559 bytes
```

With final empty IDs, the root/standard/RecipeGuide pages emitted none of the GA4, Clarity, Meta, TikTok, Google verification, or Bing verification markers.

Temporary dummy configuration test (then restored to empty and rebuilt):

```text
/                  GA4, Clarity, Meta, TikTok, Google verification, Bing verification present
/ar/index.html     GA4, Clarity, Meta, TikTok, Google verification, Bing verification present
/RecipeGuide/      GA4, Clarity, Meta, TikTok, Google verification, Bing verification present
/RecipeGuide/free/ GA4, Clarity, Meta, TikTok, Google verification, Bing verification present
/google-test.html  google-site-verification: google-test.html
```

The temporary verification file was deleted, IDs were restored to empty, the site was rebuilt, the validator passed, and the port 4177 server was stopped.
