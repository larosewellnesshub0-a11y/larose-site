# Header defect fixes

- Moved the full primary-navigation breakpoint from 1100px to 1600px. Below
  that width the existing burger/drawer is used, so the seven longer English
  labels disappear before they can reach the fixed header actions.
- Made `.nav--primary` non-shrinking and max-content-sized. Its nowrap children
  can no longer overflow a flex box that has been squeezed beside the Book CTA.
- Removed the older 1100–1439px crowding overrides, including the rule that
  reduced the nav font size. Labels retain their normal size and are not
  truncated.
- Gave the wide-nav state a 1600px header measure. The standard 1240px content
  measure cannot hold the full English nav, wordmark, persistent language
  switch, and non-shrinking Book CTA together.
- Added light-surface styling for `.lang-switch--header`: strong ink colour,
  visible border, olive interaction states, and the same font size/600 weight
  as `.header-phone`. It remains in the sticky header; at narrower widths the
  nav moves to the drawer rather than hiding this switch to manufacture room.
- Kept `build/lib/shell.mjs` unchanged because the existing semantic link and
  class hooks already support both fixes.

Per instruction, I did not run the project, build, tests, validator, browser,
or Python. The CSS and generated pages therefore still need visual verification
at the 1599/1600px boundary, in both languages, after the other worker's current
`components.css` changes are complete.
