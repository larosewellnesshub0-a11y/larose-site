# Dashboard visual repair report

Date: 2026-09-07

## Scope

Updated only the requested dashboard files, plus this report:

- `dashboard/index.html`
- `dashboard/css/dashboard.css`
- `dashboard/js/dashboard.js`
- `dashboard/js/analytics.js`

No content files, generated site pages, server code, or build files were changed.

## What changed and why

### Bilingual label hierarchy

- English glosses remain `lang="en" dir="ltr"`, but now render as subordinate second lines.
- `text-align: match-parent` makes each English line use the alignment edge resolved from its RTL parent while preserving correct LTR character order.
- Removed opacity-based muting. English uses explicit, readable colours and a consistent type scale instead.
- Headings, navigation labels, field labels, metric-card labels, list counts, filters, status pills, and table headings now follow the same Arabic-first hierarchy.
- Bilingual action buttons are stacked and centred, including save, rebuild, upload, approve, delete, restore, retry, and copy actions.
- Dashboard-rendered descriptions use a dedicated `english-copy` second line instead of running both languages together.

### Brand lockup

- Added the non-functional `.admin-brand__name` styling hook around the existing name block.
- Fixed the selector collision that changed the LR mark from `display: grid` to `display: block`; the initials are centred again.
- Tightened the mark/name gap, aligned both vertically, and kept the complete lockup at the sidebar's RTL inline-start edge.

### Contrast

- Replaced faint dashboard text with explicit high-contrast colours.
- Important worst-case pairs are above WCAG AA's 4.5:1 target: secondary text `#5f6150` on `#ece8da` is about 5.2:1; faint text `#656759` on `#f4f1e8` is about 5.1:1; dark-panel secondary text `#e8e5d8` over the composited olive panel is about 6.5:1; nav numerals `#f6f4ec` on `#23241a` are about 14:1; white on the revised rose action colour `#8f474d` is about 6.7:1.
- The optional-tool callout's English copy now uses the dedicated light-on-olive colour.
- Disabled button colours and placeholder text are explicit instead of relying on low opacity.

### Timestamp

- `formatTimestamp()` now returns one value only.
- It explicitly uses `ar-EG-u-nu-arab`, so the Arabic UI receives Arabic-Indic digits, with a single compact date/time line and no duplicate English timestamp.
- The same formatter also keeps backup timestamps consistent.

### Mobile and overflow

- Preserved the existing functional drawer and reinforced its RTL-side positioning, width, shadow, scrim, inert state, and touch targets.
- Overview and analytics statistics use two columns on normal phones and one column on very narrow screens.
- Editor actions and dialog actions form balanced mobile grids; long editor controls collapse to one column where needed.
- Added `min-inline-size: 0`, wrapping, and width constraints at the layout boundaries that commonly force page overflow.
- Wide backup tables, pipeline output, and analytics charts retain their own local scrolling containers. The page itself remains `overflow-x: hidden`.
- Added opaque topbar fallbacks for unsupported or reduced-transparency environments.

## Functional preservation and verification

- Existing IDs, classes, `data-*` hooks, ARIA attributes, dialog structure, navigation structure, and event delegation paths were preserved.
- Static searches found no remaining bilingual `.admin-btn` with Arabic and English joined on one line, no English gloss beginning with the old separator dot, and no English timestamp formatter.
- The only `overflow-x: auto` declarations are the intended table and analytics-chart containers.
- Per instruction, Node, npm, Python, the site build, and the validator were not run. Verification was limited to file inspection and static searches.
