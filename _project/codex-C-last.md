Implemented the complete publish and hosted-dashboard workflow.

Key outcomes:

- Private pricing and campaign data moved to ignored `content/_private/`.
- Local dashboard still edits both through logical `pricing.json` and `campaigns.json` files.
- Added git status, publish, and GitHub Actions deployment-status APIs.
- Added bilingual Publish dialog, progress log, changed-file indicator, and deployment links.
- Added read-only hosted mode with public-content snapshot fallback.
- Hosted Campaigns, Images, and Backups correctly show local-only notices.
- Updated GitHub Pages workflow and private-file exclusion checks.
- Secret scan found no credentials, passwords, private keys, or embedded tokens.
- Unrelated concurrent article/image changes were preserved.

Verification passed:

```text
Dashboard smoke test passed: 15 sections
La Rose — built 346 pages
Validated 346 pages
0 errors, 0 warnings
```

The local server was stopped. Full details are in [CODEX-PUBLISH-REPORT.md](/Users/maged/Desktop/new/website%20data/new%20site/_project/CODEX-PUBLISH-REPORT.md).