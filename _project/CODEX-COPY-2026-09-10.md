# Arabic copy update — 2026-09-10

1. **Medical-team heading** — Changed the hard-coded `sectionHead.title` in `build/pages/home.mjs` (no JSON key). Evidence: `site/ar/index.html:935` contains `أطباء يقومون بالكشف بأحسن شكل ممكن لا يكتفون بمراجعة الاوراق فقط!`.
2. **Reviews heading** — Changed the hard-coded reviews `sectionHead` in `build/pages/home.mjs` (no JSON key): removed the old title line and kept a single `title` with `اراء المرضى`. Evidence: `site/ar/index.html:994-998` contains one `<h2>اراء المرضى</h2>` and no eyebrow; the deleted copy has zero matches in the page.
3. **Branches heading** — Changed the hard-coded branches `sectionHead.title` in `build/pages/home.mjs` (no JSON key). Evidence: `site/ar/index.html:1063` contains `المعادي والتجمع دلوقتي، والشيخ زايد قريباً`.
4. **Knowledge-centre heading** — Changed the hard-coded articles `sectionHead.title` in `build/pages/home.mjs` (no JSON key). Evidence: `site/ar/index.html:1116` contains the complete new sentence beginning `معلومات ونصائح هتفرق`.
5. **Shared CTA headline** — Changed the default `ctaBand` title in `build/lib/components.mjs` (no JSON key). The exact old source string existed only here; the home page calls this shared component. Evidence: `site/ar/index.html:1163` contains `ابدأ بكشف حقيقي واحجز دلوقتي`; the old CTA has zero matches across `site/`, and the new CTA renders in 153 built files.
6. **Footer hours** — Changed `content/site.json` key `hours.display.ar`. Evidence: the footer at `site/ar/index.html:1246` contains only `الأيام بتختلف حسب الطبيب والفرع`; the removed hours fragment has zero matches in that footer region. Branch-specific hours remain present.
7. **Fifth Settlement hero sentence** — Changed `content/branches.json` key `branches[slug=fifth-settlement].intro.ar`. Evidence: `site/ar/branches/fifth-settlement.html:409` contains the shortened hero copy, and the removed `حاليًا العيادة شغّالة...` sentence has zero matches.
8. **Fifth Settlement price** — Removed `content/branches.json` key `branches[slug=fifth-settlement].consultation.price` (Arabic and English, so no empty bilingual field remains). Evidence: the consultation list ends at `site/ar/branches/fifth-settlement.html:463` and the action row starts at line 465; the removed price has zero matches in the built page.
9. **Fifth Settlement consultation block** — Changed `content/branches.json` keys `branches[slug=fifth-settlement].consultation.heading.ar` and `branches[slug=fifth-settlement].hours.ar`. Evidence: `site/ar/branches/fifth-settlement.html:455-456` reads `كشف التغذية في فرع التجمع بيشمل` followed by `د. شيماء فؤاد · الأربعاء من ٣ لـ ٧ مساءً`; the weekly hedge has zero matches.
10. **Booking phone example** — Changed the hard-coded bilingual `booking-phone-hint` copy in `build/pages/patients.mjs` (no JSON key). Evidence: `site/ar/patients/booking.html:430` contains `رقم موبايل مصري، زي 01000000000`; the old example has zero matches in the target page.

## Verification

- `node build/build.mjs`: PASS — 346 pages built.
- `node tools/validate.mjs`: PASS — 0 errors, 0 warnings.
- `python tools/check_voice.py`: BLOCKED by the existing exemption mismatch — 151 findings, all reported from `site/RecipeGuide/free/index.html`. The checker exempts only `site/RecipeGuide/index.html`, while the task explicitly says the whole RecipeGuide is sanctioned and must not be edited. No files under `tools/` or RecipeGuide were changed.
- Supplemental read-only run with `site/RecipeGuide/free/index.html` excluded: PASS — no feminine second-person address found across the other 354 checked files.
- Git Bash/GNU grep could not start in this sandbox (`CreateFileMapping ... Win32 error 5`), so the requested built-output searches were run with ripgrep (`rg`), producing equivalent file matches.
