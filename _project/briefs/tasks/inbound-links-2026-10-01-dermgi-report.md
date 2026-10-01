# Dermgi inbound links — 2026-10-01

Each target received one new link from each source below, in the same section in Arabic and English. Labels are verbatim phrases from the linked section body.

| Target | Source | Arabic label | English label |
| --- | --- | --- | --- |
| `eczema-flare-when-to-check` | `folliculitis-vs-acne-itchy-bumps` | حبوب متشابهة وبتحك | similar itchy bumps |
| `eczema-flare-when-to-check` | `acne-in-pregnancy-safe-assessment` | مساحة احمرار في الحمل | patch of redness in pregnancy |
| `melasma-and-sun-protection` | `acne-marks-and-scars-what-is-the-difference` | تصبغ واضح بعد الالتهاب | post-inflammatory pigmentation |
| `melasma-and-sun-protection` | `acne-safe-home-care-and-when-to-check` | واقي شمس واسع الحماية | non-comedogenic sun protection |
| `h-pylori-symptoms-and-testing-pathway` | `acid-reflux-when-to-see-doctor` | اختبار جرثومة المعدة | H. pylori testing |
| `h-pylori-symptoms-and-testing-pathway` | `gastroscopy-vs-colonoscopy-what-to-expect` | اختبار جرثومة المعدة | H. pylori testing |
| `ibs-symptoms-in-pregnancy-when-to-check` | `heartburn-in-pregnancy-when-to-assess` | ألم شديد وجديد في أعلى البطن | upper-abdominal pain |
| `ibs-symptoms-in-pregnancy-when-to-check` | `h-pylori-after-treatment-follow-up` | القولون العصبي | irritable bowel syndrome |
| `ibs-symptoms-men-assessment-guide` | `h-pylori-reflux-ibs` | أعراض القولون العصبي | IBS symptoms |
| `ibs-symptoms-men-assessment-guide` | `colonoscopy-preparation-what-to-ask` | القولون العصبي | irritable bowel syndrome |
| `ibs-symptoms-women-assessment-guide` | `ibs-symptoms-in-pregnancy-when-to-check` | متلازمة القولون العصبي | irritable bowel syndrome |
| `ibs-symptoms-women-assessment-guide` | `abdominal-pelvic-ultrasound-what-it-shows` | القولون العصبي | irritable bowel syndrome |

## Verbatim label fixes

| File | Change |
| --- | --- |
| `content/articles-p2-acne-in-pregnancy-safe-assessment-2026-09-27.json` | Replaced the nonverbatim dark-neck, gentle acne-care, and safe home-care labels with phrases in their section bodies, in both languages. |
| `content/articles-p2-eczema-flare-when-to-check-2026-09-27.json` | Replaced the nonverbatim folliculitis, gentle acne-care, and safe home-care labels with phrases in their section bodies, in both languages. |
| `content/articles-p2-folliculitis-vs-acne-itchy-bumps-2026-09-27.json` | Replaced the nonverbatim gentle acne-care and safe home-care labels in both languages, and the deep-painful-acne label in English. |
| `content/articles-p2-hair-loss-blood-tests-first-2026-09-27.json` | Moved the telogen-effluvium link in both languages from `pattern-before-panel` to `timeline-and-clues`, where its verbatim labels occur. |
| `content/articles-p2-melasma-and-sun-protection-2026-09-27.json` | Replaced the acne-marks-and-scars labels in both languages with verbatim phrases. |

Only section links, `updatedAt`, and one appended history entry changed in each article. The medical content was unchanged. The link-edit checker passed on all fifteen edited content files.

## Claude review corrections (2026-10-01)

Codex's labels were verbatim but four of them sent readers to the wrong place. Corrected:

| Source | Change | Why |
| --- | --- | --- |
| `heartburn-in-pregnancy-when-to-assess` | Removed "ألم شديد وجديد في أعلى البطن" / "upper-abdominal pain" -> ibs-in-pregnancy | The sentence is about pre-eclampsia; IBS is the wrong destination for an urgent symptom. |
| `acne-in-pregnancy-safe-assessment` | Removed "مساحة احمرار في الحمل" / "patch of redness in pregnancy" -> eczema-flare | The sentence is about pregnancy-specific rashes, not eczema. |
| `folliculitis-vs-acne-itchy-bumps` | Removed "حبوب متشابهة وبتحك" / "similar itchy bumps" -> eczema-flare | The phrase refers to folliculitis look-alikes, not eczema. |
| `acne-marks-and-scars-what-is-the-difference` | Relabelled the melasma link to "الحماية من الشمس" / "sun protection" | The target is about sun protection; the old label promised a PIH article. |

Replacement inbound links (labels verbatim in the section body, AR and EN):

| Target | Source | Section | AR label | EN label |
| --- | --- | --- | --- | --- |
| `ibs-symptoms-in-pregnancy-when-to-check` | `ibs-symptoms-women-assessment-guide` | individual-treatment-plan | الحمل أو التخطيط له | pregnancy or plans for pregnancy |
| `eczema-flare-when-to-check` | `dark-neck-skin-children-assessment` | not-every-dark-patch-is-acanthosis | إكزيما | eczema |
| `eczema-flare-when-to-check` | `hair-loss-in-children-when-to-check` | scaly-patches-tinea | الإكزيما | eczema |

`hair-loss-in-children-when-to-check` had no natural anchor anywhere, so one navigational sentence (no medical claim) was appended and linked in `telogen-effluvium-sudden-hair-shedding` (what-is-telogen-effluvium) and `hair-loss-in-women-causes-that-matter` (diffuse-shedding): "ولو التساقط عند طفل، اقرا دليل تساقط الشعر عند الأطفال." / "If the hair loss is in a child, read the guide to hair loss in children." Label: "تساقط الشعر عند الأطفال" / "hair loss in children".

History notes in the 15 dermgi files were standardised to the site wording. Pre-existing issue found, not fixed this round: in `dark-neck-acanthosis`, `gallbladder-pain-in-pregnancy` and `after-gallbladder-surgery` (old rewrite files) the booking link is not in the final section.
