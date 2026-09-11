# Image weight audit

The image audit runs against every file below `site/assets/img/` and every
built HTML page below `site/`. It reads intrinsic raster dimensions through
`imageSize()` in `build/lib/util.mjs`, without installing a dependency.

## Totals

| Measure | Before | After | Saving |
| --- | ---: | ---: | ---: |
| Image files | 454 | 454 | 0 |
| Image directory bytes | 39,090,612 | 39,090,612 | 0 bytes (0.0 KB, 0.00%) |
| Image directory size | 38,174.4 KB | 38,174.4 KB | 0.0 KB (0.00%) |

No file was eligible for regeneration. The audit found one image whose
intrinsic width was more than twice its largest HTML `width` attribute, but it
is under the protected logo directory and was intentionally left unchanged.
Responsive `-600`, `-700`, `-900` and `-1200` variants, all favicons, and all
unreferenced files were also left untouched.

## Oversized findings and outcome

| File | Largest displayed width | Intrinsic size | Old bytes | New bytes | Saving | Outcome |
| --- | ---: | --- | ---: | ---: | ---: | --- |
| `assets/img/logo/larose-wordmark.png` | 160 px | 984 x 849 px | 55,528 | 55,528 | 0 | Excluded: protected logo asset |

The post-build report contains 233 unreferenced files (listed by
`node tools/image-report.mjs`) and 16 files over 300 KB. Neither category was
changed or deleted by this task.

## Verification

- `node build/build.mjs` — built 408 pages.
- `node tools/validate.mjs` — 0 errors, 0 warnings.
- `node tools/audit.mjs` — 0 findings.
- `python tools/check_voice.py` — PASS; no feminine second-person address
  found across 416 checked pages. The foreground sandbox has a 30-second
  capture limit, so this was run as the same hidden Python process and its
  completed output was read after it exited.
- `node tools/image-report.mjs` — rerun after the build; totals are unchanged.
