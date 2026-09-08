# Codex dashboard fixes

Date: 2026-09-08

All ten findings in `AUDIT-DASHBOARD.md` are fixed. No item remains blocked or partially implemented.

## 1. Atomic content saves and restores

- Changed `server/serve.mjs:212` to write JSON through an exclusively-created sibling temp file, flush it with `FileHandle.sync()`, close it, and rename it over the live file. Failed writes close and remove the temp file.
- Both save and restore use the helper at `server/serve.mjs:435` and `server/serve.mjs:484`; their backups are still created before replacement.
- Verified by the atomic-write regression assertion in `tools/test-dashboard.mjs:263`, by starting the edited server successfully, and by the passing dashboard smoke test.

## 2. Edits made during an in-flight save stay dirty

- Added per-file mutation counters at `dashboard/js/dashboard.js:496` and increment them from the shared dirty path at `dashboard/js/dashboard.js:788`.
- A save captures its file counter at `dashboard/js/dashboard.js:1891` and clears the dirty flag only when that same counter is still current at `dashboard/js/dashboard.js:1905`.
- Verified behaviorally in `tools/test-dashboard.mjs:195`: the test starts a mocked save, mutates the editor before the response resolves, and confirms Save remains enabled.

## 3. Stale tabs cannot overwrite newer content

- Added SHA-256 revisions over the exact loaded file bytes at `server/serve.mjs:229`. The combined content response now returns matching per-file revisions at `server/serve.mjs:395`.
- Saves require `X-Content-Rev` at `server/serve.mjs:424`; a missing revision returns 428. Compare/backup/replace is serialized per file through `server/serve.mjs:243`, and a stale revision returns 409 with the current content at `server/serve.mjs:439`.
- The dashboard sends and updates revisions at `dashboard/js/dashboard.js:1900` and `dashboard/js/dashboard.js:1903`. Restore also updates the revision at `dashboard/js/dashboard.js:1997`.
- A conflict renders an explicit warning and “Load server version” recovery control at `dashboard/js/dashboard.js:1701` and `dashboard/js/dashboard.js:2211`; the local draft remains untouched until the editor confirms replacement.
- Verified by the stale-write source assertions in `tools/test-dashboard.mjs:264` and by running the smoke suite against a fresh edited server on port 4174.

## 4. Existing image assets are never overwritten

- Replaced the check-then-write upload with an exclusive `wx` create loop at `server/serve.mjs:525`. Name collisions receive `-2`, `-3`, and so on, and the final path is returned to the dialog.
- Exclusive creation also closes the simultaneous-upload race; an existing destination can never be truncated.
- Verified by the upload regression assertion in `tools/test-dashboard.mjs:265` and the passing server-backed smoke test.

## 5. Collection filters cannot leak into another collection

- Added the shared reset at `dashboard/js/dashboard.js:1118`.
- It now runs for TODO/editor navigation, section changes, initial load, collection-tab changes, and settings-file changes at `dashboard/js/dashboard.js:1796`, `dashboard/js/dashboard.js:2250`, `dashboard/js/dashboard.js:2270`, `dashboard/js/dashboard.js:2342`, and `dashboard/js/dashboard.js:2347`.
- Verified by the navigation reset regression assertion in `tools/test-dashboard.mjs:267` and the full ten-section render pass.

## 6. Successful uploads refresh the Images library

- Added cache invalidation and optional reload at `dashboard/js/dashboard.js:1562`.
- Every successful upload calls it at `dashboard/js/dashboard.js:2180`; editor-field uploads also invalidate the cache at `dashboard/js/dashboard.js:2205`.
- If an older image request is already running, `imagesReloadPending` schedules one fresh request after it finishes so an old response cannot hide the new asset.
- Verified by the upload-refresh regression assertion in `tools/test-dashboard.mjs:269` and the Images-section smoke render.

## 7. Images and Backups stop after API errors and expose Retry

- Images use the completed-attempt guard in `dashboard/js/dashboard.js:508` and `dashboard/js/dashboard.js:1539`; the stable error state includes Retry at `dashboard/js/dashboard.js:1625`.
- Backups use the equivalent guard at `dashboard/js/dashboard.js:515` and `dashboard/js/dashboard.js:1651`; the existing Refresh control at `dashboard/js/dashboard.js:1680` explicitly resets it.
- Verified by the failed-load/retry regression assertion in `tools/test-dashboard.mjs:268` and successful Images/Backups smoke renders.

## 8. Public price text is rejected before save

- Mirrored the site validator’s price pattern in server validation at `server/serve.mjs:117` and `server/serve.mjs:135`, excluding only `pricing`, `prices`, or `price` subtrees used for internal figures.
- Added the same pre-save rule to dashboard validation at `dashboard/js/dashboard.js:649` and `dashboard/js/dashboard.js:663`.
- Verified behaviorally at `tools/test-dashboard.mjs:142`: a PUT containing both the independently-invalid `showPrice: true` guard and `1500 EGP` returns 422 and specifically reports the price text. The independent guard guarantees the test can never write the live file.

## 9. Phone controls meet the 44px touch target

- Set small buttons and tabs to at least `2.75rem` at `dashboard/css/dashboard.css:347` and `dashboard/css/dashboard.css:412`.
- Expanded item-open controls, reorder actions, toggles, and the dialog close button at `dashboard/css/dashboard.css:455`, `dashboard/css/dashboard.css:460`, `dashboard/css/dashboard.css:475`, and `dashboard/css/dashboard.css:759`.
- Kept the narrow topbar override and list search/filter/link controls at `2.75rem` at `dashboard/css/dashboard.css:808`, `dashboard/css/dashboard.css:860`, `dashboard/css/dashboard.css:872`, and `dashboard/css/dashboard.css:1630`.
- Verified by the touch-target CSS regression assertion in `tools/test-dashboard.mjs:271` and the responsive smoke checks.

## 10. The Arabic mobile drawer opens from the right

- Replaced the physical edge pin with logical insets at `dashboard/css/dashboard.css:777`.
- Added direction-aware off-canvas transforms at `dashboard/css/dashboard.css:785`; RTL uses positive X and LTR uses negative X, while the open state remains zero.
- Verified by the RTL-drawer regression assertion in `tools/test-dashboard.mjs:272`. The CSS regression also confirms no old physical drawer inset or unsupported alignment declaration remains.

## Required verification output

`node build/build.mjs`

```text
La Rose — built 344 pages in 7458ms
```

`node tools/validate.mjs`

```text
Validated 344 pages

0 errors, 0 warnings
```

`node tools/test-dashboard.mjs`

```text
Dashboard smoke test passed: 10 sections; editing; save races; validation; audit regressions; responsive rules.
```

An additional run against a fresh instance of the edited server also passed:

```text
node tools/test-dashboard.mjs http://localhost:4174
Dashboard smoke test passed: 10 sections; editing; save races; validation; audit regressions; responsive rules.
```
