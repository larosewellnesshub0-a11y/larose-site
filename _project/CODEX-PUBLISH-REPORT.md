# Publish workflow and hosted dashboard report

Date: 2026-09-08

## Outcome

The dashboard now has a local build/validate/commit/push workflow and a read-only
hosted mode for GitHub Pages. Internal prices and campaign budgets are stored only
in ignored `content/_private/` files; the hosted content snapshot uses public
top-level JSON files and cannot include either private dashboard file.

## Private content

- Removed `_internalPricing` from `content/digital.json` and placed the same values
  under `pricing` in ignored `content/_private/pricing.json`, with an internal-use
  note.
- Moved the campaign store to ignored `content/_private/campaigns.json` and removed
  the old top-level file. The server creates safe empty shapes for either file when
  missing.
- Added the committed `content/_private/README.md` exception and explicit ignore
  rules for the private directory and the obsolete `content/campaigns.json` path.
- The local API continues to expose the logical names `pricing.json` and
  `campaigns.json`; saves retain revision protection, backups, atomic replacement,
  and validation. Pricing numbers must be finite and at least zero.
- `tools/export_content_map.py` no longer looks for `_internalPricing`; private
  pricing is deliberately excluded from the public-copy workbook.

## Publishing and hosted mode

- `GET /api/git/status` reports branch, ahead/behind counts, changed files, latest
  commit and origin URL using argument-array child processes.
- `POST /api/publish` builds, validates, stages, commits with the supplied message,
  and pushes `origin main`, returning its progress log and clear command failures.
- `GET /api/deploy/status` derives the GitHub owner/repository from origin and reads
  the newest Actions run through the public API, with an offline/error response.
- The bilingual top bar shows unpublished-file state and opens a publish review
  dialog with commit message, file list, log, deploy/run link and live-site link.
- When `/api/content` is unavailable, the dashboard loads `content/index.json`,
  displays a persistent bilingual read-only banner, disables repository editing,
  and replaces Campaigns, Images and Backups with local-only notices. Content
  overview/analytics, leads, direct Apps Script status updates, media tools, tips
  browsing, endpoint diagnostics and tracking checks remain available.
- `tools/snapshot-content.mjs` writes the hosted snapshot after the workflow copies
  the dashboard. It reads only top-level public JSON and explicitly excludes the
  obsolete campaigns path and every underscore-prefixed entry/directory.
- The workflow verifies the build-produced `CNAME` and `.nojekyll`, removes both dev
  harnesses, and asserts that private pricing/campaign files are absent.
- The site validator skips only `site/dashboard/`, which is a noindex application
  shell covered by `tools/test-dashboard.mjs`, rather than a public SEO page.

## Secret scan

A repository scan for API keys, secrets, passwords, bearer credentials, private-key
headers, token assignments and email addresses found no embedded credential or
secret value. Matches were code/brief references to browser-local lead tokens and
the documented clinic Google account `larosewellnesshub0@gmail.com`; the spreadsheet
identifier already documented in public site configuration also appeared. No token,
password, private key or non-clinic email was found.

## Verification

```text
node tools/test-dashboard.mjs http://localhost:4179
Dashboard smoke test passed: 15 sections; editing; save races; validation; audit regressions; responsive rules.

node build/build.mjs
La Rose — built 346 pages

node tools/validate.mjs
Validated 346 pages
0 errors, 0 warnings
```

The snapshot test used a copied dashboard tree and confirmed `pricing.json`,
`campaigns.json`, and `_internalPricing` were absent. `site/CNAME` and
`site/.nojekyll` were present. `git check-ignore` confirmed both live private JSON
files are ignored while the README is not. The local server was stopped after the
tests.

Unrelated concurrent edits in `content/articles.json`, article images and untracked
project runner/log files were preserved and are not part of this work.
