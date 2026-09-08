# Shared brief, round 4 — La Rose Wellness Hub

Read this fully before touching anything. Every round-4 worker reads this file.
It **supersedes** `CODEX-BRIEF.md`, which said the content files were off limits.
They are not any more: content and templates are both in scope now.

## What this project is

A bilingual (Arabic RTL / English LTR) static website for **La Rose Wellness Hub**
(`عيادات لاروز التخصصية`), a multi-specialty polyclinic in New Maadi, Cairo.
213 pages, generated from JSON by a zero-dependency Node ESM generator.

```
content/*.json   →   build/pages/*.mjs   →   site/**/*.html
```

## Commands

```bash
node build/build.mjs      # regenerate every page (~6s). MUST succeed.
node tools/validate.mjs   # MUST print "0 errors". Non-negotiable.
```

`node` works. **`python` does not** — this machine's Codex sandbox denies the
user-profile Python install. If a job needs Python, write the script, say so in
your report, and stop. Do not spend turns probing for a Python path; it is the
sandbox refusing, not a missing install.

## Golden rules — breaking any of these makes the work unusable

1. **Never invent a medical fact, a price, a doctor, a credential, an address, a
   statistic or a citation.** Missing fact → leave the field empty and add a
   `_todo`. A fabricated credential on a clinic site is a real-world harm.
2. **No prices on any public page.** `tools/validate.mjs` fails the build if a
   price reaches the output. Do not weaken that check.
3. **Edit `content/*.json` and `build/**`. Never edit `site/*.html`** — it is
   generated and will be overwritten. `site/assets/**` IS hand-written and is
   fine to edit.
4. **Arabic is masculine/neutral second person**: `احجز` not `احجزي`, `جهّز` not
   `جهّزي`. Do NOT masculinise `الدكتورة` or `أخصائية` (they describe the
   clinic's female doctors), and `محتاجة` / `ماشية` agreeing with a feminine
   noun are correct as they stand.
5. **No em dashes (`—`) in user-facing copy.** All 260 were just removed by
   client request. Use `،` for an aside, `:` before an enumeration.
6. **Both languages, always.** Every page exists at `/ar/…` and `/en/…`. English
   is a real translation, not a transliteration.
7. **No medical disclaimers.** Every inline disclaimer / "not a substitute for
   medical advice" / "data is stored on your device only" notice was removed by
   explicit client request. Do not reintroduce any. The three standalone pages
   under `legal/` stay; that is the only place such text may live.
8. **Run the validator before reporting done.** Zero errors, or it is not done.

## Key helpers (`build/lib/util.mjs`)

| Helper | Purpose |
|---|---|
| `t(value, locale)` | unwraps `{ar, en}` objects |
| `esc(s)` / `escJson(s)` | HTML / JSON-LD escaping — always use these |
| `link(depth, href)` | locale-relative page link |
| `asset(depth, path)` | asset link (assets sit one level above the locale root) |
| `icon(name, cls)` | inline SVG from the sprite map |
| `latin(s)` | wraps Latin technical terms so bidi ordering stays correct |
| `when(cond, html)` / `map(arr, fn)` | template conditionals |
| `published(arr)` | filters to `published: true` |

**`depth` = number of directories below the locale root.** `ar/index.html` → 0,
`ar/tools/bmi.html` → 1. Wrong depth 404s every link on the page. Never
hand-write `../`.

## Design system in one paragraph

Warm paper ground, never pure white. Olive carries structure, champagne is the
metal, rose is a sparing accent. The **arch** is the brand's signature shape.
Gloss is physical, not gradient: specular sweep, champagne hairlines, warm
shadows, paper grain. **Liquid Glass belongs to the functional layer only**
(sticky header, dropdowns, floating finder, tab bars, drawer, FABs) — content
cards stay opaque. Every glass surface keeps its two fallbacks,
`@supports not (backdrop-filter)` and `@media (prefers-reduced-transparency)`.
The client explicitly rejected "AI gradients"; do not add any.

## House style

- Match the surrounding code: 2-space indent, ESM, no new dependencies.
- Comment **why**, not what. Never narrate obvious code.
- Do not reformat or "tidy" files you were not asked to change.
- Do not add a banner comment to the top of a file you merely edited.

## Reporting

Finish with a short plain-text report: file-by-file what you changed, anything
you could not do and why, and the literal tail of `node build/build.mjs` and
`node tools/validate.mjs`. Do not claim success you did not verify.
