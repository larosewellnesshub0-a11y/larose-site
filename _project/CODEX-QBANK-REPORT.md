# Question-bank conversion report

Date: 2026-09-07

## Scope and safeguards

- Read the project rules, all 289 question rows, the 25 existing `qa` entries, and every current specialty FAQ before drafting.
- Used column 3 as the source of the public questions. Column 4 was treated only as an indication of the intended topic; none of its draft answers was pasted or lightly paraphrased.
- Column 7 is empty throughout the bank, so none of these answers is represented here as doctor-approved source material.
- Columns 5 and 6 were excluded from selection, ordering, emphasis and wording. No sales priority or suggested service influenced the public copy.
- No public answer contains a price, a drug brand, a guarantee, a promised result, or a retired body-contouring technique.
- All three requested output files are staging files only. The `author`, `reviewedBy` and doctor-answer heading fields in the Q&A batch mirror the existing entry shape and its provisional byline convention. They still require clinic confirmation before merge, as documented by `_todoBylines` in `content/articles.json`.

## New Q&A entries

The Q&A batch contains exactly 20 entries. Each answer adds uncertainty, decision factors and in-person or urgent-care thresholds where those are relevant.

| Bank row | Output slug | How the question was used |
|---:|---|---|
| 23 | `qa-weight-medicine-dependence` | Reframed a named-product question as whether long-term weight-management treatment means addiction or lifelong dependence. |
| 24 | `qa-hair-loss-during-medical-weight-loss` | Reframed a named-product question around hair shedding during medically managed weight loss and the need to consider nutrition, thyroid, iron, illness and scalp causes. |
| 12 | `qa-weight-medicine-pregnancy-breastfeeding` | Reframed a named-product lactation question to cover prescription weight-management treatment during pregnancy, pregnancy planning and breastfeeding. |
| 40 | `qa-mesotherapy-safety` | Kept the client's natural concern about harm, but replaced the reassuring draft with a substance-specific risk discussion and post-injection warning signs. |
| 62 | `qa-mesotherapy-guaranteed-result` | Answered the guarantee question directly with no guarantee, realistic goals, consistent measurement and a stop/review point. |
| 103 | `qa-fast-weight-loss-before-event` | Preserved the time-pressure context while rejecting a promised number or crash approach. |
| 116 | `qa-unknown-slimming-pills` | Addressed non-prescription and unclear-source slimming products, interactions and urgent reaction signs. |
| 120 | `qa-intermittent-fasting-suitable` | Treated fasting as an optional meal-timing pattern and identified cases needing individual review. |
| 137 | `qa-hungry-soon-after-meal` | Preserved the natural “hungry again after an hour” wording and explained how meal composition, pace, sleep, stress and symptoms guide assessment. |
| 142 | `qa-binge-eating-episodes` | Reframed loss-of-control eating without blame and distinguished assessment from self-diagnosis. |
| 169 | `qa-physical-or-emotional-hunger` | Kept the client's real distinction question but presented the usual clues as clues, not a diagnostic rule. |
| 188 | `qa-emotional-eating-needs-specialist` | Turned the threshold question into practical indicators for nutrition, psychological or urgent support. |
| 216 | `qa-snoring-breathing-pauses-weight` | Kept the observed breathing-pause question, made clear weight is one risk factor rather than the only cause, and did not delay sleep assessment until weight loss. |
| 219 | `qa-medicine-causing-weight-gain` | Preserved the concern about medicine-related gain while explicitly warning against stopping treatment without the prescriber. |
| 220 | `qa-sudden-unexplained-weight-gain` | Distinguished possible fluid change from fat gain and added urgent thresholds for swelling, breathlessness, chest pain and reduced urine. |
| 223 | `qa-visceral-fat-how-to-know` | Explained the limits of the scale, body-composition estimates and routine ultrasound, with emphasis on waist and metabolic risk in context. |
| 258 | `qa-teen-restricting-food-fears-weight` | Treated food refusal plus fear of weight gain as a possible eating-disorder warning and used non-stigmatising family language. |
| 262 | `qa-underweight-inherited-or-illness` | Preserved the inherited-versus-illness question and added symptoms that make medical assessment important. |
| 277 | `qa-vegetarian-protein-iron-b12` | Kept the practical vegetarian-diet concern, covering food pattern, iron absorption and vitamin B12 without automatic supplement dosing. |
| 294 | `qa-gestational-diabetes-food` | Preserved the gestational-diabetes question while avoiding carbohydrate elimination, fasting and weight-loss framing during pregnancy. |

## Specialty FAQ additions

Every specialty slug receives three new entries. Rows reused in both formats were deliberate: the Q&A gives the full educational answer, while the specialty FAQ gives a short answer at the point of care.

| Specialty slug | Bank rows | Public question focus |
|---|---:|---|
| `clinical-nutrition` | 266, 280, 295 | Family eating, whether supplements are needed, and making frequent delivery meals more balanced. |
| `weight-management` | 3, 19, 13 | Dose changes, a missed injection, and treatment choice with blood-pressure or heart history. All three named-product source questions were generalised. |
| `body-contouring` | 40, 50, 62 | Mesotherapy risks, pregnancy or breastfeeding, and the absence of a guaranteed result. |
| `internal-medicine` | 139, 152, 220 | Sudden appetite change, appetite or weight effects of mental-health medicine, and sudden unexplained weight gain. |
| `gastroenterology-hepatology` | 243, 285, 286 | Possible malabsorption, post-meal bloating and chronic constipation. |
| `ultrasound` | 215, 220, 223 | What ultrasound can and cannot establish about fatty liver, sudden weight gain and visceral fat. These answers deliberately state the boundary of the scan rather than manufacturing an indication. |
| `general-surgery` | 125, 205, 206 | Whether stubborn local fat requires surgery, when bariatric assessment becomes relevant, and how medicine-versus-surgery decisions are made. These are framed as assessment questions, not as claims that general surgery is the automatic destination. |
| `bariatric-surgery` | 88, 216, 290 | Medication after post-surgical regain, sleep-apnoea symptoms in pre-operative assessment, and nutrition before and after surgery. Row 88 was generalised from a named-product question. |
| `dermatology` | 94, 44, 43 | Hair shedding during medical weight loss, limits of hair mesotherapy, and the need to diagnose the cause of dark circles before facial treatment. Row 94 was generalised from a named-product question. |
| `pediatrics` | 119, 208, 258 | Supporting a teenager without stigma, avoiding an adult-style diet for a child, and early action on restrictive eating with fear of weight gain. |

## Every drug-name rewrite used in the outputs

No drug brand is repeated in this report. These are all the selected places where the source question named one and the public wording was changed:

| Bank row | Output location | Public rewrite |
|---:|---|---|
| 12 | Q&A `qa-weight-medicine-pregnancy-breastfeeding` | “دواء لإدارة الوزن” / “weight-management medicine”. |
| 23 | Q&A `qa-weight-medicine-dependence` | “دواء لإدارة الوزن” / “weight-management medicine”. |
| 24 | Q&A `qa-hair-loss-during-medical-weight-loss` | “علاج دوائي” / “medical weight loss”. |
| 3 | FAQ `weight-management` | “جرعة دواء إدارة الوزن” / “dose of weight-management medicine”. |
| 19 | FAQ `weight-management` | “حقنة إدارة الوزن” / “weight-management injection”. |
| 13 | FAQ `weight-management` | “دواء لإدارة الوزن” / “weight-management medicine”. |
| 88 | FAQ `bariatric-surgery` | “علاج دوائي” / “medicine” after bariatric surgery. |
| 94 | FAQ `dermatology` | “علاج دوائي” / “medical weight loss”. |

## Deliberately skipped material

### Already covered by the 25 existing Q&A entries

- Rows 4 and 72: nausea and digestive adverse effects from weight-management injections are already covered by `qa-injection-nausea-constipation`.
- Rows 31 and 81: PCOS and recurrent weight difficulty are already covered by `qa-pcos-weight-regain`.
- Rows 97, 104, 117 and 131: plateaus, measurement changes and scale fluctuation are already covered by `qa-measurements-down-scale-still` and `qa-sleep-weight-plateau`.
- Row 113: thyroid treatment and persistent weight difficulty are already covered by `qa-thyroid-dose-weight`.
- Rows 118 and 228: insulin-resistance questions are already covered by `qa-normal-glucose-insulin` and `qa-insulin-resistance-single-test`.
- Row 163: breastfeeding hunger with a weight goal is already covered by `qa-breastfeeding-hunger`.
- Rows 235 and 240: persistent low weight and appetite-stimulant framing are already covered by `qa-healthy-weight-gain`.
- Rows 265, 283 and 287 were not made into new Q&A entries because vitamin D, ferritin and anaemia questions already have focused existing Q&As. Row 265 was not reused in the final FAQ batch.
- Row 271 was not made into a new Q&A because selective child eating is already covered by `qa-child-fussy-eating` and `qa-child-refuses-meat-iron`.
- Rows 145, 151, 171 and related “eating under pressure” variants were not made into separate Q&As because `qa-stress-eating-willpower` already covers the core question. Rows 169 and 188 were retained because they answer distinct recognition and referral-threshold questions.

### Excluded for policy, safety or weak public value

- Rows 33, 37, 90 and 123 ask about cost or affordability. They were excluded completely under the site's no-price rule.
- Product comparisons, availability, authenticity and promotional-location questions were not used as public Q&As. They are time-sensitive, product-specific or commercially framed rather than durable patient education.
- Storage, travel and exact missed-dose or escalation instructions were not turned into general Q&As where the safe answer depends on the exact medicine and label. The two short medication FAQs direct the reader back to the product instructions and prescriber without inventing a schedule.
- Exact promised kilograms, session counts, treatment intervals and “before an event” result claims from draft answers were rejected. The one event-timing Q&A uses no promised number and explicitly rejects crash methods.
- Draft claims that mesotherapy “dissolves” a particular area, reliably treats cellulite, tightens skin, guarantees a result or is universally safe were not adopted. The public copy identifies variable evidence, substance-specific risk and realistic review points.
- Rows that exist mainly to locate the clinic or sell a package were skipped because they add little durable clinical value and are easily slanted by the internal sales notes.
- Repetitive variants within each bank block were consolidated around the underlying patient question rather than producing many near-identical pages.

## Medical framing check

The high-risk wording was cross-checked against current patient guidance from authoritative sources, without adding brand names to the outputs:

- [NIDDK: prescription medicines for overweight and obesity](https://www.niddk.nih.gov/health-information/weight-management/prescription-medications-treat-overweight-obesity)
- [FDA: risks of unapproved fat-dissolving injections](https://www.fda.gov/drugs/buying-using-medicine-safely/using-fat-dissolving-injections-are-not-fda-approved-can-be-harmful)
- [NIMH: eating disorders](https://www.nimh.nih.gov/health/publications/eating-disorders)
- [NHLBI: sleep-apnoea symptoms](https://www.nhlbi.nih.gov/health/sleep-apnea/symptoms)
- [NHLBI: overweight and obesity assessment](https://www.nhlbi.nih.gov/health/overweight-and-obesity/symptoms)
- [ACOG: gestational diabetes](https://www.acog.org/womens-health/faqs/gestational-diabetes)
- [NIH Office of Dietary Supplements: vitamin B12](https://ods.od.nih.gov/factsheets/Vitaminb12-HealthProfessional/)

These references informed caution and red-flag wording only. The clinic still needs to confirm clinical ownership and final approval before publishing the staged entries.
