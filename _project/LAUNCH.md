# Launch runbook

## Scope and ownership

This runbook covers changes that originate in this repository and are published
through GitHub Pages. The live site is `https://laroseclinics.com/`.

| System | Owner and change location |
| --- | --- |
| Website content and generator | This repository: `content/` and `build/`. |
| Static hosting | GitHub Pages, deployed by `.github/workflows/deploy.yml`. |
| Google Business Profile | Google Business Profile owner. It is not managed or deployed from this repository. |
| Booking-post receiver | Google Apps Script owner. The deployed web app lives in Google Apps Script, not in this repository. `integrations/apps-script/` is a reference source and deployment guide only. |
| DNS and email | Hostinger owner. Hostinger provides DNS and email only, not website hosting. |

If ownership or access is unknown, record **UNKNOWN** and do not substitute a
different service or endpoint.

## Make a content change

1. Choose the owning file in `content/`. See `PROJECT.md` for the content map.
   Do not edit `site/ar/**/*.html` or `site/en/**/*.html` by hand.
2. Make the bilingual JSON change. Preserve valid JSON and existing content
   safeguards. Do not add an unconfirmed clinical fact, person, credential,
   address, statistic, or citation. Use `UNKNOWN` or the established empty state
   when information is absent.
3. Write Arabic reader-address in the masculine or neutral second person. The
   two RecipeGuide pages are the sole sanctioned exception because they preserve
   supplied wording.
4. If the change needs a new page shape, change the relevant `build/pages/*.mjs`
   module or shared `build/lib/*.mjs` helper. If it needs a new image, use the
   responsive-image helpers and supply correct alternative text.

## Verify before publishing

Run the complete gate from the repository root, in this order:

```powershell
node build/build.mjs
node tools/validate.mjs
node tools/audit.mjs
python tools/check_voice.py
```

Success means the build completes, `validate.mjs` reports `0 errors, 0
warnings`, `audit.mjs` reports no findings and no blocking findings, and the
voice checker prints `PASS`. Fix the source and repeat the entire sequence if
any command fails.

Review the generated page that should contain the change. This catches the
source-to-template disconnect where JSON is valid but no page uses that field.
For local browser review, run `node server/serve.mjs` and open
`http://localhost:4173/`. The server is for local preview and dashboard editing;
it is not part of the deployed site.

## Reach production

The GitHub Actions workflow is triggered by a push to `main` or by manual
workflow dispatch. It checks out the repository, runs the build and validator,
copies `dashboard/` into the publish tree, writes the read-only public dashboard
snapshot, removes internal development harnesses, verifies public deployment
markers, and deploys `site/` to GitHub Pages.

Use the team-approved repository publishing process to send the verified change
to `main`. A local dashboard session also has a Publish flow backed by the local
server. Do not publish unverified changes merely because the workflow itself
runs a subset of the local gate.

Monitor the GitHub Pages workflow until it concludes successfully. If it fails,
read its build or validation log, correct the repository source, rerun the full
local gate, and publish the correction through the approved process.

## Post-deployment check

After the workflow succeeds, check the live site at the affected Arabic and
English routes.

- Confirm the changed copy, links, image, and language counterpart are present.
- Confirm the root language handoff at `https://laroseclinics.com/` still opens
  the Arabic site.
- Confirm the affected page has no missing media or broken internal links.
- If a booking or contact form was changed, verify its visible browser behaviour
  without sending test personal data to the clinic.
- If a content snapshot or dashboard change was published, confirm the hosted
  dashboard remains read-only and contains only public content.

Record the workflow result and any unresolved issue. Unknown live-service state
is **UNKNOWN**, not a reason to claim a successful external configuration.

## Rollback

Rollback is a repository release decision, not a manual edit to GitHub Pages.
Restore the last known-good source revision through the team-approved repository
process, rerun all four local gate commands, and publish that revision to `main`.
Wait for the GitHub Pages workflow to complete, then repeat the post-deployment
checks above.

Do not overwrite files directly in `site/` as a rollback. The next build would
replace those edits and leave the source of truth inconsistent.

## External changes this repository cannot deploy

### Google Business Profile

The profile owner makes listing, review, opening-hours, and business-information
changes in Google Business Profile. Reflect confirmed public facts back into the
appropriate content file only after they are supplied or verified.

### Google Apps Script

The Apps Script owner deploys changes to the booking-post web app in Google Apps
Script and maintains its deployed endpoint. Updating the local reference source
under `integrations/apps-script/` does not update the deployed web app. Update
the site endpoint only through the configured `integrations.formsEndpoint` value
when the owner supplies the deployed URL.

### DNS and email

The Hostinger owner manages DNS and email. GitHub Pages serves the website;
changing repository files cannot change DNS records or mail configuration.
