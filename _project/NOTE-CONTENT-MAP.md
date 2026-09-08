# Content map round trip

Two scripts now provide a spreadsheet round trip for the site's eight JSON
content files:

- `tools/export_content_map.py` writes `_project/CONTENT-MAP.xlsx`.
- `tools/apply_content_map.py` reads the returned workbook and applies the
  non-empty `New (AR)` and `New (EN)` cells.

The scripts deliberately do not read or write generated files under `site/`.
The Node build remains the only process that turns content into public pages.

## Client workflow

From the project root, generate the workbook:

```text
python tools/export_content_map.py
```

Send `_project/CONTENT-MAP.xlsx` to the client. They should change only the two
shaded `New` columns and may use `Notes` for comments. A blank New cell means
“leave this language unchanged.” They should not edit the narrow `_ref` column.

When the workbook comes back, preview the import first:

```text
python tools/apply_content_map.py _project/CONTENT-MAP.xlsx --dry-run
```

Then apply it:

```text
python tools/apply_content_map.py _project/CONTENT-MAP.xlsx
```

The apply command defaults to writing; `--dry-run` is the explicit preview
mode. After applying, the normal project workflow still applies:

```text
node build/build.mjs
node tools/validate.mjs
```

`openpyxl` is the sole non-standard-library dependency. If it is unavailable,
both scripts stop with this exact remedy instead of falling back to CSV:

```text
python -m pip install openpyxl
```

## What the exporter includes

The exporter walks these files in a fixed tour order: `site.json`, `pages.json`,
`specialties.json`, `doctors.json`, `branches.json`, `articles.json`,
`digital.json`, and `reviews.json`. Rows are then ordered as site-wide settings,
home, specialties, doctors, branches, patient/information pages, Knowledge
Centre, La Rose Digital, and reviews.

It understands all bilingual shapes currently used in the project:

1. A direct pair such as `{ "ar": "...", "en": "..." }` becomes one row.
2. Locale-separated parallel arrays such as
   `{ "ar": ["..."], "en": ["..."] }` become one row per corresponding item.
3. Arrays whose individual items are `{ar, en}` pairs become one row per item.
4. Existing monolingual strings become a row with one Current cell populated.

Existing empty string fields are included because the client may fill them.
An empty array produces no insertion row: the apply script is forbidden from
creating a new list item or key.

The machine reference is an RFC 6901 JSON Pointer prefixed by its content file,
for example:

```text
doctors.json#/doctors/0/name
```

Parallel language arrays need two exact pointers in the same cell:

```text
doctors.json#/doctors/0/credentials/ar/0 || doctors.json#/doctors/0/credentials/en/0
```

## Safety behaviour

- Every changed file is copied to `content/_backups/` before the first JSON
  write. Backup names follow `filename.json.TIMESTAMP.bak`.
- Writes use UTF-8, `ensure_ascii=False`, `indent=1`, and exactly one trailing
  newline. A temporary file is completed before it atomically replaces the
  content file.
- A New value is considered only when it is non-blank after trimming and
  differs from the corresponding Current cell.
- Before applying a value, the script confirms that the live JSON still equals
  the workbook's Current value. If the content changed after export, the row is
  reported as stale and skipped instead of overwriting newer work. This check
  also makes index-based JSON Pointers safe if an array was reordered.
- Every part of a two-pointer reference must still resolve even when only one
  language is being changed. Missing or malformed references are reported and
  skipped; no nearby field is guessed.
- Formula cells in either New column are rejected. The JSON receives plain
  text only.
- If either proposed language contains a price pattern, the whole row is
  rejected. The check recognises Latin, Arabic-Indic and Eastern Arabic digits
  followed by `ج.م`, `جنيه`, `EGP`, or `LE`, with ordinary number separators.
- Dry-run performs all workbook, pointer, stale-copy and price checks in memory,
  but creates no backup and writes no file.
- The final summary always states rows examined, rows applied, skipped-reason
  counts, reported row numbers, and the files changed or that would change.

## Assumptions and deliberate choices

1. “Whole site copy” means the eight named `content/*.json` sources. These
   scripts do not extract literals from `build/pages/*.mjs`, generated HTML,
   JavaScript, CSS, submissions, backups, or internal project notes.
2. Column C contains the Arabic public URL (`/ar/...`) built from
   `site.json > brand.domain`. The English counterpart is reachable through the
   page language switcher. Global header, footer, brand and interface settings
   intentionally have a blank Link because they do not belong to one page.
3. Page and Part labels, and the editorial Aim, are bilingual. Links point to
   the most specific known public page: specialty, doctor, branch, article,
   product, review or category page.
4. Operational fields are excluded even when stored as strings: slugs, IDs,
   indexes, publication and feature flags, icons, image paths, dates,
   coordinates, URLs, route references, relationship slugs, phone transport
   values, integration endpoints, counts, source metadata, and pricing data.
   This keeps the workbook about wording rather than site wiring. An exact
   `_todo` nested inside an internal subtree is still surfaced, but none of its
   surrounding machine or pricing values are.
5. Keys beginning with `_` are excluded except an exact `_todo`. Similar names
   such as `_todoAddress`, `_todoReview`, `_note`, and `_source` stay internal,
   as required by the exact-key exception. A `_todo` row is labelled as an
   outstanding confirmed-fact question, not ordinary marketing copy.
6. A monolingual/shared field normally appears in Current (EN), unless its JSON
   Pointer is explicitly under an `ar` branch. For a truly shared field, the
   client may use either New column, but two different proposals on the same row
   are ambiguous and are skipped. Language-specific scalar fields accept only
   their matching New column.
7. Leading and trailing whitespace in New cells is treated as accidental and
   trimmed. Internal line breaks and spacing are preserved.
8. “Rows applied” counts spreadsheet rows, not language cells. A row changing
   both Arabic and English counts once. In dry-run it means rows that would be
   applied.
9. Only files receiving at least one accepted change are backed up and written.
   All their backups complete before any of those files is replaced.
10. The scripts do not rebuild or validate the generated site. That remains a
    separate, explicit step so a content import cannot publish itself.

## Verification status

Per the task instruction, neither Python script was executed, imported, or
compiled in this environment. No workbook was generated, no round trip was
simulated, and no JSON or backup file was written. The code was written against
the current schemas and the existing `tools/` conventions, but runtime syntax,
`openpyxl` behaviour, row coverage, formatting, backup creation, and JSON output
remain unverified until the scripts are run outside the sandbox.
