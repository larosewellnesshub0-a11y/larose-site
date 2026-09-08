# Codex brief C — publish workflow, hosted (read-only) dashboard mode, private data out of the repo

Read `AGENTS.md`, `PROJECT.md`, `_project/CODEX-DASHBOARD2-REPORT.md` and `_project/CODEX-DASHBOARD3-REPORT.md` first. The site is deployed by `.github/workflows/deploy.yml` (GitHub Pages, custom domain laroseclinics.com): every push to `main` rebuilds `site/` and copies `dashboard/` into `site/dashboard/`. The dashboard is edited locally through `node server/serve.mjs`; there is no server on GitHub Pages. You own `dashboard/**`, `server/serve.mjs`, `tools/test-dashboard.mjs`, `.github/workflows/deploy.yml`, `.gitignore`, `build/build.mjs` (only for the snapshot step described below), `content/digital.json` (only to move `_internalPricing`), and `tools/validate.mjs` if a new generated file needs exempting. Zero dependencies, bilingual RTL UI, 44px targets, smoke test must pass.

## 1. Private data must never reach the public repository
GitHub Pages on a free plan means the repo is PUBLIC. Two things in `content/` are internal:
- `content/digital.json → _internalPricing` (real prices; the client never shows prices publicly).
- `content/campaigns.json` (ad budgets).
Do this:
- Create `content/_private/` (add `content/_private/` and `content/campaigns.json` to `.gitignore`; ship `content/_private/README.md` that IS committed and explains the folder). Move `_internalPricing` out of `digital.json` into `content/_private/pricing.json` (same object, plus `_note`). Move `campaigns.json` into `content/_private/campaigns.json` and update the server (`CONTENT_FILES`, paths) and dashboard so nothing else changes for the editor. Keep a stub `content/campaigns.json`? No — one location only: `content/_private/campaigns.json`; create it with the empty shape on first run if missing.
- Server: `pricing.json` becomes an editable dashboard file like the others (Settings → "Internal pricing" panel, generic object editor, backups, validation: numbers ≥ 0). `tools/export_content_map.py` references `_internalPricing`; update its path too if trivial, else note it in the report.
- Grep the repo for any other secret-looking value (tokens, passwords, emails other than the public clinic contacts) and report.

## 2. Publish from the dashboard (local mode)
Add to `server/serve.mjs`:
- `GET /api/git/status` → `{ branch, ahead, behind, dirty: [files], lastCommit: {hash, date, message}, remote: url|null }` via `git` child processes (never shell-interpolate user input).
- `POST /api/publish { message }` → runs `node build/build.mjs`, `node tools/validate.mjs` (abort and return the validator output on errors), then `git add -A && git commit -m <message> && git push origin main`. Stream progress as newline-delimited JSON (or return a final JSON with a log array — your call, but the dashboard must show progress). Commit author from git config; if no remote or push fails, return a clear error the dashboard shows verbatim.
- `GET /api/deploy/status` → polls the public GitHub API `https://api.github.com/repos/<owner>/<repo>/actions/runs?per_page=1` (owner/repo parsed from the remote URL) and returns the latest run status/conclusion/url; degrade gracefully offline.
Dashboard: a **Publish** button in the topbar next to Save (bilingual), enabled when the working tree is dirty or ahead; a small "unpublished changes · N files" pill; clicking opens a dialog: commit message (default "Content update <date>"), the list of changed files, then a live log, then the deploy status with a link to the run and to https://laroseclinics.com. Refresh the git status after save and after publish.

## 3. Hosted mode (the dashboard served from laroseclinics.com/dashboard/)
There is no API on Pages. Make the dashboard detect that (`/api/status` fails → try `content/index.json` relative to the dashboard) and run in **hosted mode**:
- `build/build.mjs` (or the workflow step) writes a snapshot: `site/dashboard/content/index.json` = `{ files: { "site.json": {...}, ... }, builtAt }` for every public content file EXCEPT anything under `content/_private/` — and with `showPrice`/`_todo` keys left as they are. Simplest: a small `tools/snapshot-content.mjs` run in the workflow after the build and copy; the local server must not need it.
- In hosted mode: Overview KPIs, Analytics (content + leads), Leads & bookings (token in browser, status updates still work because they go straight to Apps Script), Media buying tools and Daily-tips/collections browsing all work. Editing controls are disabled with a persistent banner: "وضع العرض: التعديل من الجهاز المحلي عبر `node server/serve.mjs` ثم زر النشر" / "Read-only hosted mode: edit locally, then Publish". Campaigns section shows a short note that campaigns are local-only. Images/Backups sections show the same note.
- The Integrations panel's "Test endpoint" and the Tracking check must work in hosted mode (fetch `/ar/index.html` relative to the site root).
- Keep `<meta name="robots" content="noindex,nofollow">` on the dashboard.

## 4. Workflow
Update `.github/workflows/deploy.yml`: after `node build/build.mjs` and the validator, run the snapshot tool, copy `dashboard/` into `site/dashboard/`, remove `_viewport.html`/`_bookpages.html`, ensure `CNAME` and `.nojekyll` exist (the build already writes them — verify, don't duplicate). Make sure `content/_private/**` is never copied.

## 5. Verify
`node server/serve.mjs 4179 &` → `node tools/test-dashboard.mjs http://localhost:4179` (extend it for git status endpoint shape, hosted-mode detection with a mocked failing `/api/status`, and the private-file exclusions). `git status` must show `content/_private/` untracked/ignored. `node build/build.mjs` + `node tools/validate.mjs` pass. Kill the server. Report to `_project/CODEX-PUBLISH-REPORT.md`.
