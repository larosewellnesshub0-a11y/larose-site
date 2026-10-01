# Task: Fifth Settlement branch page — local SEO (nearby areas, geo, local FAQ)

Repo: this one. Read `AGENTS.md` first and follow it. Do not commit or push. Do not touch article files.

**Edit only these files:**
- `content/branches.json`: the `fifth-settlement` entry only.
- `build/pages/branches.mjs`
- `build/lib/shell.mjs`: only if needed for schema.

**Source of truth for distances:** `_project/FIFTH-SETTLEMENT-DISTANCES-2026-10-01.md`. Do not name any area that is not in its "Within ~10 km" table, except Al Rehab, which may appear once as "also reachable (~11 km)". Never mention Nasr City, Madinaty, Mivida or Lotus. Use "about" / "حوالي" with every distance and time.

## 1. Geo (data)

- Set `geo` to `{ "lat": 30.020659, "lng": 31.4338974 }`.
- Set `plusCode` to `"2CCM+7H6 New Cairo 1"`.
- Replace `_todoGeo` with `_geoSource`: "Resolved 2026-10-01 from the clinic-supplied mapsUrl (CMC, N Teseen, New Cairo 1); the Air Force Specialized Hospital is 750 m away, matching the address. See _project/FIFTH-SETTLEMENT-DISTANCES-2026-10-01.md".

## 2. `nearbyAreas` (new field: `{ar:[...], en:[...]}`)

- Write 6–7 short lines, one per area from the table. Each line gives the area, the approximate km, the approximate minutes by car, and the main road.
- Example: "El Yasmeen (New Cairo 1): about 5 km, around 10 minutes by car via North 90th Street."
- Arabic must be calm Egyptian Arabic. Example: "الياسمين (التجمع الأول): حوالي ٥ كم، يعني تقريباً ١٠ دقايق بالعربية من التسعين الشمالي."
- Render it in `branches.mjs` as a new section right after "Getting here", only when the field exists.
  - Eyebrow: AR "قريبين منك", EN "Close to you".
  - Title: AR "جاي من المناطق القريبة؟", EN "Coming from a nearby area?".
  - Lede (one sentence): drive times are approximate and depend on traffic, and the Maps button gives live directions.
  - Use the existing `sectionHead` and `prose` patterns.
- Add `areaServed` (an array of `{"@type":"Place","name":...}` built from a new `areaServedNames: {ar:[], en:[]}` field) to the `openBranch` MedicalClinic schema. Also add `hasMap: b.mapsUrl`, and add `openingHoursSpecification` for Wednesday 15:30–20:00 if it is missing; put that in the data as `openingHoursSpecification`. shell.mjs already reads that field. Check that it stays valid schema.org.

## 3. Local FAQ (new field: `faq: [{q:{ar,en}, a:{ar,en}}]`)

- Render it on the branch page before the CTA band. Reuse the site's existing FAQ markup/component if there is one (grep `faq` in `build/`), and emit `FAQPage` JSON-LD the same way article pages do.
- Write 4–5 Q&As that answer real local searches: "مونجارو التجمع الخامس", "ويجوفي التجمع", "عيادة تغذية التجمع الخامس", "روماتيزم التجمع الخامس".
- Facts allowed (from `branches.json` / `doctors.json` only):
  - Open Wednesday 3:30–8 pm.
  - Mounjaro / Wegovy are prescribed and followed **only after a medical consultation and when suitable**.
  - Full InBody assessment.
  - Body-contouring sessions.
  - Rheumatology clinic (shimaa-sherif; check `doctors.json` for which days and branch, and do not state a day you cannot find).
  - Booking via WhatsApp / phone.
- Facts forbidden:
  - Prices.
  - Guarantees.
  - Weight-loss numbers.
  - Medication stock claims.
  - Anything not in the data.
- Name 2–3 nearby areas naturally in one answer, for example "if you're coming from First Settlement or El Yasmeen…".

## 4. Light touch on existing copy

- Add one `gettingHere` line in AR and EN that gives the North 90th Street approach from the Festival City / Ring Road side. Base it on the table and stay generic.
- Leave `intro` alone, except that it may gain at most one short clause naming "New Cairo neighbourhoods such as First Settlement, El Yasmeen and El Narges". It doubles as the meta description, so keep it under ~320 characters per language.

## Checks (all must pass)

- `node build/build.mjs`, `node tools/validate.mjs`, `node tools/audit.mjs`, `python tools/check_voice.py`.
- `&lt;bdi` count in `site/` must be 0.
- Open `site/ar/branches/fifth-settlement.html` and `site/en/branches/fifth-settlement.html` and confirm that the section, the FAQ and the JSON-LD (MedicalClinic with geo, areaServed, FAQPage) are present and parse as JSON.
- The Maadi branch page must be unchanged apart from shared template output. Maadi has no `nearbyAreas` / `faq`, so nothing new renders there.

Report the files changed, the new copy (AR+EN) and the check results.
