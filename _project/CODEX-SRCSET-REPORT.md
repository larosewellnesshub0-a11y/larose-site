# Responsive image srcset report

- **<img> tags that gained a srcset:** 1,859
- **Variants that changed from unreferenced to referenced:** 133. The image report now records 115 -600.webp and 18 -700.webp variants as referenced. The existing hero-clinic-1200.webp reference is unchanged.
- **400 CSS-pixel, 1x phone payload, article images only:** /ar/articles/ falls from 626.3 KB to 171.1 KB, and /ar/articles/childrens-appetite.html falls from 249.9 KB to 76.2 KB. This counts unique requested article images and selects the 600px candidate at a 360px rendered slot. It intentionally excludes the unchanged CSS banner background.
- **Still unreferenced:** 48 variants. They are either CSS-background-only variants, or siblings whose original is not emitted by any current <img> (unused covers, sample pairs, placeholders and unpublished artwork). No unused image was added to a page merely to make the inventory report green.

The shared generator helper tests each sibling on disk and derives every w descriptor from its measured image width. The helper has context-specific sizes values for the existing grids, constrained media, article shell, and recipe-guide layouts.

## Final verification output

### node build/build.mjs

```text

  La Rose — built 408 pages in 14766ms

    404                          1
    ar/index                     1
    en/index                     1
    ar/specialties               11
    en/specialties               11
    ar/doctors                   4
    en/doctors                   4
    ar/branches                  4
    en/branches                  4
    ar/articles                  154
    en/articles                  154
    ar/digital                   3
    en/digital                   3
    ar/about                     5
    en/about                     5
    ar/patients                  7
    en/patients                  7
    ar/legal                     3
    en/legal                     3
    ar/sitemap                   1
    en/sitemap                   1
    ar/tools                     7
    en/tools                     7
    RecipeGuide/index            1
    RecipeGuide/free             1
    ar/contact                   1
    ar/404                       1
    en/contact                   1
    en/404                       1
    index                        1
```

Exit code: 0

### node tools/validate.mjs

```text

  Validated 408 pages


  0 errors, 0 warnings
```

Exit code: 0

### node tools/audit.mjs

```text

  Audited 408 built pages

  clean


  0 findings, 0 of them blocking
```

Exit code: 0

### python tools/check_voice.py

```text

  Arabic voice check � 416 pages

  PASS � no feminine second-person address found.

```

Exit code: 0

### node tools/image-report.mjs

```text
Image inventory: 454 files, 38174.4 KB total
path | intrinsic | bytes | largest displayed width | referenced | intrinsic/displayed
assets/img/articles/abdominal-hernia-warning-signs-600.webp | 600x375 | 31.4 KB | 1000 | yes | 0.60x
assets/img/articles/abdominal-hernia-warning-signs.webp | 1200x750 | 113.5 KB | 1000 | yes | 1.20x
assets/img/articles/abdominal-ultrasound-what-it-shows-600.webp | 600x375 | 34.9 KB | 1000 | yes | 0.60x
assets/img/articles/abdominal-ultrasound-what-it-shows.webp | 1200x750 | 113.1 KB | 1000 | yes | 1.20x
assets/img/articles/acid-reflux-when-to-see-doctor-600.webp | 600x375 | 18.6 KB | 1000 | yes | 0.60x
assets/img/articles/acid-reflux-when-to-see-doctor.webp | 1200x750 | 78.3 KB | 1000 | yes | 1.20x
assets/img/articles/acne-care-is-gentle-not-aggressive-600.webp | 600x375 | 21.9 KB | 1000 | yes | 0.60x
assets/img/articles/acne-care-is-gentle-not-aggressive.webp | 1200x750 | 69.4 KB | 1000 | yes | 1.20x
assets/img/articles/bariatric-assessment-is-multidisciplinary-600.webp | 600x375 | 18.4 KB | 1000 | yes | 0.60x
assets/img/articles/bariatric-assessment-is-multidisciplinary.webp | 1200x750 | 61.1 KB | 1000 | yes | 1.20x
assets/img/articles/bariatric-follow-up-is-lifelong-600.webp | 600x375 | 21.5 KB | 1000 | yes | 0.60x
assets/img/articles/bariatric-follow-up-is-lifelong.webp | 1200x750 | 60.1 KB | 1000 | yes | 1.20x
assets/img/articles/biotin-before-blood-tests-600.webp | 600x375 | 18.6 KB | 1000 | yes | 0.60x
assets/img/articles/biotin-before-blood-tests.webp | 1200x750 | 59.6 KB | 1000 | yes | 1.20x
assets/img/articles/blood-pressure-needs-a-pattern-600.webp | 600x375 | 20.8 KB | 1000 | yes | 0.60x
assets/img/articles/blood-pressure-needs-a-pattern.webp | 1200x750 | 60.9 KB | 1000 | yes | 1.20x
assets/img/articles/body-composition-not-scale-600.webp | 600x375 | 17.9 KB | 1000 | yes | 0.60x
assets/img/articles/body-composition-not-scale.webp | 1200x750 | 55.5 KB | 1000 | yes | 1.20x
assets/img/articles/body-contouring-safety-first-600.webp | 600x375 | 27.8 KB | 1000 | yes | 0.60x
assets/img/articles/body-contouring-safety-first.webp | 1200x750 | 104.7 KB | 1000 | yes | 1.20x
assets/img/articles/bodycontour-1-600.webp | 600x375 | 37.3 KB | 1000 | yes | 0.60x
assets/img/articles/bodycontour-1.webp | 1200x750 | 105.7 KB | 1000 | yes | 1.20x
assets/img/articles/bodycontour-2-600.webp | 600x375 | 25.5 KB | n/a | no | n/a
assets/img/articles/bodycontour-2.webp | 1200x750 | 69.3 KB | n/a | no | n/a
assets/img/articles/cellulite-is-a-skin-structure-feature-600.webp | 600x375 | 23.3 KB | 1000 | yes | 0.60x
assets/img/articles/cellulite-is-a-skin-structure-feature.webp | 1200x750 | 85.0 KB | 1000 | yes | 1.20x
assets/img/articles/child-growth-is-a-trajectory-600.webp | 600x375 | 21.4 KB | 1000 | yes | 0.60x
assets/img/articles/child-growth-is-a-trajectory.webp | 1200x750 | 83.5 KB | 1000 | yes | 1.20x
assets/img/articles/child-short-height-growth-curve-600.webp | 600x375 | 19.3 KB | 1000 | yes | 0.60x
assets/img/articles/child-short-height-growth-curve.webp | 1200x750 | 75.1 KB | 1000 | yes | 1.20x
assets/img/articles/childrens-appetite-600.webp | 600x375 | 24.2 KB | 1000 | yes | 0.60x
assets/img/articles/childrens-appetite.webp | 1200x750 | 74.6 KB | 1000 | yes | 1.20x
assets/img/articles/clinical-nutrition-2-600.webp | 600x375 | 59.5 KB | 1000 | yes | 0.60x
assets/img/articles/clinical-nutrition-2.webp | 1200x750 | 207.9 KB | 1000 | yes | 1.20x
assets/img/articles/clinical-nutrition-3-600.webp | 600x375 | 44.8 KB | 1000 | yes | 0.60x
assets/img/articles/clinical-nutrition-3.webp | 1200x750 | 115.6 KB | 1000 | yes | 1.20x
assets/img/articles/coeliac-testing-before-gluten-free-diet-600.webp | 600x375 | 24.6 KB | 1000 | yes | 0.60x
assets/img/articles/coeliac-testing-before-gluten-free-diet.webp | 1200x750 | 75.6 KB | 1000 | yes | 1.20x
assets/img/articles/cover-1-600.webp | 600x375 | 1.6 KB | n/a | no | n/a
assets/img/articles/cover-1.webp | 1200x750 | 4.7 KB | n/a | no | n/a
assets/img/articles/cover-2-600.webp | 600x375 | 2.0 KB | n/a | no | n/a
assets/img/articles/cover-2.webp | 1200x750 | 5.4 KB | n/a | no | n/a
assets/img/articles/cover-3-600.webp | 600x375 | 1.8 KB | n/a | no | n/a
assets/img/articles/cover-3.webp | 1200x750 | 4.8 KB | n/a | no | n/a
assets/img/articles/cover-4-600.webp | 600x375 | 1.6 KB | n/a | no | n/a
assets/img/articles/cover-4.webp | 1200x750 | 4.6 KB | n/a | no | n/a
assets/img/articles/cover-5-600.webp | 600x375 | 2.0 KB | n/a | no | n/a
assets/img/articles/cover-5.webp | 1200x750 | 5.4 KB | n/a | no | n/a
assets/img/articles/cover-6-600.webp | 600x375 | 1.8 KB | n/a | no | n/a
assets/img/articles/cover-6.webp | 1200x750 | 4.8 KB | n/a | no | n/a
assets/img/articles/dark-neck-acanthosis-insulin-resistance-600.webp | 600x375 | 20.0 KB | 1000 | yes | 0.60x
assets/img/articles/dark-neck-acanthosis-insulin-resistance.webp | 1200x750 | 65.1 KB | 1000 | yes | 1.20x
assets/img/articles/dermatology-2-600.webp | 600x375 | 24.6 KB | 1000 | yes | 0.60x
assets/img/articles/dermatology-2.webp | 1200x750 | 71.0 KB | 1000 | yes | 1.20x
assets/img/articles/dermatology-3-600.webp | 600x375 | 32.1 KB | n/a | no | n/a
assets/img/articles/dermatology-3.webp | 1200x750 | 91.3 KB | n/a | no | n/a
assets/img/articles/diabetes-remission-is-not-cure-600.webp | 600x375 | 27.3 KB | 1000 | yes | 0.60x
assets/img/articles/diabetes-remission-is-not-cure.webp | 1200x750 | 80.3 KB | 1000 | yes | 1.20x
assets/img/articles/diabetes-review-whole-health-600.webp | 600x375 | 23.0 KB | 1000 | yes | 0.60x
assets/img/articles/diabetes-review-whole-health.webp | 1200x750 | 72.4 KB | 1000 | yes | 1.20x
assets/img/articles/fatty-liver-fibrosis-needs-its-own-assessment-600.webp | 600x375 | 16.3 KB | 1000 | yes | 0.60x
assets/img/articles/fatty-liver-fibrosis-needs-its-own-assessment.webp | 1200x750 | 55.0 KB | 1000 | yes | 1.20x
assets/img/articles/fatty-liver-ultrasound-600.webp | 600x375 | 28.6 KB | 1000 | yes | 0.60x
assets/img/articles/fatty-liver-ultrasound.webp | 1200x750 | 83.4 KB | 1000 | yes | 1.20x
assets/img/articles/gallstones-symptoms-and-surgery-600.webp | 600x375 | 26.4 KB | 1000 | yes | 0.60x
assets/img/articles/gallstones-symptoms-and-surgery.webp | 1200x750 | 84.9 KB | 1000 | yes | 1.20x
assets/img/articles/gastro-1-600.webp | 600x375 | 47.4 KB | 1000 | yes | 0.60x
assets/img/articles/gastro-1.webp | 1200x750 | 143.5 KB | 1000 | yes | 1.20x
assets/img/articles/gastro-2-600.webp | 600x375 | 24.9 KB | 1000 | yes | 0.60x
assets/img/articles/gastro-2.webp | 1200x750 | 61.3 KB | 1000 | yes | 1.20x
assets/img/articles/general-1-600.webp | 600x375 | 46.0 KB | n/a | no | n/a
assets/img/articles/general-1.webp | 1200x750 | 133.3 KB | n/a | no | n/a
assets/img/articles/glp1-medication-guide-600.webp | 600x375 | 33.6 KB | 1000 | yes | 0.60x
assets/img/articles/glp1-medication-guide.webp | 1200x750 | 178.3 KB | 1000 | yes | 1.20x
assets/img/articles/h-pylori-reflux-ibs-600.webp | 600x375 | 27.9 KB | 1000 | yes | 0.60x
assets/img/articles/h-pylori-reflux-ibs.webp | 1200x750 | 101.2 KB | 1000 | yes | 1.20x
assets/img/articles/hair-loss-blood-tests-first-600.webp | 600x375 | 24.1 KB | 1000 | yes | 0.60x
assets/img/articles/hair-loss-blood-tests-first.webp | 1200x750 | 74.1 KB | 1000 | yes | 1.20x
assets/img/articles/high-cholesterol-results-and-next-steps-600.webp | 600x375 | 30.0 KB | 1000 | yes | 0.60x
assets/img/articles/high-cholesterol-results-and-next-steps.webp | 1200x750 | 87.9 KB | 1000 | yes | 1.20x
assets/img/articles/hypothyroidism-and-weight-600.webp | 600x375 | 27.6 KB | 1000 | yes | 0.60x
assets/img/articles/hypothyroidism-and-weight.webp | 1200x750 | 99.6 KB | 1000 | yes | 1.20x
assets/img/articles/ibs-colon-symptoms-red-flags-600.webp | 600x375 | 22.9 KB | 1000 | yes | 0.60x
assets/img/articles/ibs-colon-symptoms-red-flags.webp | 1200x750 | 71.0 KB | 1000 | yes | 1.20x
assets/img/articles/insulin-resistance-explained-600.webp | 600x375 | 43.2 KB | 1000 | yes | 0.60x
assets/img/articles/insulin-resistance-explained.webp | 1200x750 | 147.4 KB | 1000 | yes | 1.20x
assets/img/articles/internal-medicine-2-600.webp | 600x375 | 33.4 KB | 1000 | yes | 0.60x
assets/img/articles/internal-medicine-2.webp | 1200x750 | 84.8 KB | 1000 | yes | 1.20x
assets/img/articles/iron-deficiency-in-children-600.webp | 600x375 | 24.9 KB | 1000 | yes | 0.60x
assets/img/articles/iron-deficiency-in-children.webp | 1200x750 | 74.5 KB | 1000 | yes | 1.20x
assets/img/articles/kidney-stones-symptoms-and-tests-600.webp | 600x375 | 24.2 KB | 1000 | yes | 0.60x
assets/img/articles/kidney-stones-symptoms-and-tests.webp | 1200x750 | 77.5 KB | 1000 | yes | 1.20x
assets/img/articles/loose-skin-or-localised-fat-600.webp | 600x375 | 23.0 KB | 1000 | yes | 0.60x
assets/img/articles/loose-skin-or-localised-fat.webp | 1200x750 | 93.1 KB | 1000 | yes | 1.20x
assets/img/articles/mesotherapy-needs-an-ingredient-level-check-600.webp | 600x375 | 21.7 KB | 1000 | yes | 0.60x
assets/img/articles/mesotherapy-needs-an-ingredient-level-check.webp | 1200x750 | 58.6 KB | 1000 | yes | 1.20x
assets/img/articles/movement-benefits-beyond-the-scale-600.webp | 600x375 | 28.8 KB | 1000 | yes | 0.60x
assets/img/articles/movement-benefits-beyond-the-scale.webp | 1200x750 | 99.7 KB | 1000 | yes | 1.20x
assets/img/articles/muscle-assessment-in-nutrition-care-600.webp | 600x375 | 31.5 KB | 1000 | yes | 0.60x
assets/img/articles/muscle-assessment-in-nutrition-care.webp | 1200x750 | 119.4 KB | 1000 | yes | 1.20x
assets/img/articles/non-surgical-weight-options-600.webp | 600x375 | 28.6 KB | 1000 | yes | 0.60x
assets/img/articles/non-surgical-weight-options.webp | 1200x750 | 91.8 KB | 1000 | yes | 1.20x
assets/img/articles/normal-ultrasound-does-not-end-assessment-600.webp | 600x375 | 17.4 KB | 1000 | yes | 0.60x
assets/img/articles/normal-ultrasound-does-not-end-assessment.webp | 1200x750 | 55.7 KB | 1000 | yes | 1.20x
assets/img/articles/obesity-care-beyond-bmi-600.webp | 600x375 | 21.5 KB | 1000 | yes | 0.60x
assets/img/articles/obesity-care-beyond-bmi.webp | 1200x750 | 73.3 KB | 1000 | yes | 1.20x
assets/img/articles/pcos-and-weight-600.webp | 600x375 | 32.9 KB | 1000 | yes | 0.60x
assets/img/articles/pcos-and-weight.webp | 1200x750 | 111.6 KB | 1000 | yes | 1.20x
assets/img/articles/pediatrics-2-600.webp | 600x375 | 31.4 KB | n/a | no | n/a
assets/img/articles/pediatrics-2.webp | 1200x750 | 79.0 KB | n/a | no | n/a
assets/img/articles/pediatrics-3-600.webp | 600x375 | 26.9 KB | 1000 | yes | 0.60x
assets/img/articles/pediatrics-3.webp | 1200x750 | 76.0 KB | 1000 | yes | 1.20x
assets/img/articles/preparing-for-bariatric-surgery-600.webp | 600x375 | 30.4 KB | 1000 | yes | 0.60x
assets/img/articles/preparing-for-bariatric-surgery.webp | 1200x750 | 97.8 KB | 1000 | yes | 1.20x
assets/img/articles/protecting-muscle-while-losing-weight-600.webp | 600x375 | 32.6 KB | 1000 | yes | 0.60x
assets/img/articles/protecting-muscle-while-losing-weight.webp | 1200x750 | 111.6 KB | 1000 | yes | 1.20x
assets/img/articles/qa-breastfeeding-hunger-600.webp | 600x375 | 42.9 KB | 1000 | yes | 0.60x
assets/img/articles/qa-breastfeeding-hunger.webp | 1200x750 | 139.6 KB | 1000 | yes | 1.20x
assets/img/articles/qa-child-fussy-eating-600.webp | 600x375 | 26.8 KB | 1000 | yes | 0.60x
assets/img/articles/qa-child-fussy-eating.webp | 1200x750 | 89.4 KB | 1000 | yes | 1.20x
assets/img/articles/qa-fatty-liver-normal-enzymes-600.webp | 600x375 | 26.9 KB | 1000 | yes | 0.60x
assets/img/articles/qa-fatty-liver-normal-enzymes.webp | 1200x750 | 91.3 KB | 1000 | yes | 1.20x
assets/img/articles/qa-h-pylori-still-bloated-600.webp | 600x375 | 34.3 KB | 1000 | yes | 0.60x
assets/img/articles/qa-h-pylori-still-bloated.webp | 1200x750 | 126.1 KB | 1000 | yes | 1.20x
assets/img/articles/qa-healthy-weight-gain-600.webp | 600x375 | 34.2 KB | 1000 | yes | 0.60x
assets/img/articles/qa-healthy-weight-gain.webp | 1200x750 | 103.1 KB | 1000 | yes | 1.20x
assets/img/articles/qa-injection-nausea-constipation-600.webp | 600x375 | 28.5 KB | 1000 | yes | 0.60x
assets/img/articles/qa-injection-nausea-constipation.webp | 1200x750 | 90.7 KB | 1000 | yes | 1.20x
assets/img/articles/qa-measurements-down-scale-still-600.webp | 600x375 | 22.1 KB | 1000 | yes | 0.60x
assets/img/articles/qa-measurements-down-scale-still.webp | 1200x750 | 104.5 KB | 1000 | yes | 1.20x
assets/img/articles/qa-normal-glucose-insulin-600.webp | 600x375 | 14.5 KB | 1000 | yes | 0.60x
assets/img/articles/qa-normal-glucose-insulin.webp | 1200x750 | 45.2 KB | 1000 | yes | 1.20x
assets/img/articles/qa-pcos-weight-regain-600.webp | 600x375 | 19.6 KB | 1000 | yes | 0.60x
assets/img/articles/qa-pcos-weight-regain.webp | 1200x750 | 76.6 KB | 1000 | yes | 1.20x
assets/img/articles/qa-thyroid-dose-weight-600.webp | 600x375 | 16.6 KB | 1000 | yes | 0.60x
assets/img/articles/qa-thyroid-dose-weight.webp | 1200x750 | 54.1 KB | 1000 | yes | 1.20x
assets/img/articles/responsive-complementary-feeding-600.webp | 600x375 | 24.5 KB | 1000 | yes | 0.60x
assets/img/articles/responsive-complementary-feeding.webp | 1200x750 | 80.0 KB | 1000 | yes | 1.20x
assets/img/articles/silent-gallstones-usually-need-no-treatment-600.webp | 600x375 | 24.3 KB | 1000 | yes | 0.60x
assets/img/articles/silent-gallstones-usually-need-no-treatment.webp | 1200x750 | 76.8 KB | 1000 | yes | 1.20x
assets/img/articles/stubborn-localised-fat-600.webp | 600x375 | 28.4 KB | 1000 | yes | 0.60x
assets/img/articles/stubborn-localised-fat.webp | 1200x750 | 80.1 KB | 1000 | yes | 1.20x
assets/img/articles/supplements-are-targeted-not-a-default-600.webp | 600x375 | 13.1 KB | 1000 | yes | 0.60x
assets/img/articles/supplements-are-targeted-not-a-default.webp | 1200x750 | 40.9 KB | 1000 | yes | 1.20x
assets/img/articles/surgical-checks-are-a-team-pause-600.webp | 600x375 | 19.1 KB | 1000 | yes | 0.60x
assets/img/articles/surgical-checks-are-a-team-pause.webp | 1200x750 | 62.3 KB | 1000 | yes | 1.20x
assets/img/articles/tip-child-texture-bridge-600.webp | 600x375 | 15.4 KB | 1000 | yes | 0.60x
assets/img/articles/tip-child-texture-bridge.webp | 1200x750 | 46.4 KB | 1000 | yes | 1.20x
assets/img/articles/tip-child-two-jobs-600.webp | 600x375 | 33.7 KB | 1000 | yes | 0.60x
assets/img/articles/tip-child-two-jobs.webp | 1200x750 | 96.8 KB | 1000 | yes | 1.20x
assets/img/articles/tip-enrich-one-weight-gain-meal-600.webp | 600x375 | 30.4 KB | 1000 | yes | 0.60x
assets/img/articles/tip-enrich-one-weight-gain-meal.webp | 1200x750 | 101.6 KB | 1000 | yes | 1.20x
assets/img/articles/tip-feeding-chair-snack-kit-600.webp | 600x375 | 24.9 KB | 1000 | yes | 0.60x
assets/img/articles/tip-feeding-chair-snack-kit.webp | 1200x750 | 74.7 KB | 1000 | yes | 1.20x
assets/img/articles/tip-freezer-meal-pairs-600.webp | 600x375 | 13.1 KB | 1000 | yes | 0.60x
assets/img/articles/tip-freezer-meal-pairs.webp | 1200x750 | 50.5 KB | 1000 | yes | 1.20x
assets/img/articles/tip-note-salty-meal-600.webp | 600x375 | 15.5 KB | 1000 | yes | 0.60x
assets/img/articles/tip-note-salty-meal.webp | 1200x750 | 53.6 KB | 1000 | yes | 1.20x
assets/img/articles/tip-one-day-meal-photos-600.webp | 600x375 | 33.4 KB | 1000 | yes | 0.60x
assets/img/articles/tip-one-day-meal-photos.webp | 1200x750 | 125.9 KB | 1000 | yes | 1.20x
assets/img/articles/tip-photograph-medicine-boxes-600.webp | 600x375 | 14.9 KB | 1000 | yes | 0.60x
assets/img/articles/tip-photograph-medicine-boxes.webp | 1200x750 | 49.7 KB | 1000 | yes | 1.20x
assets/img/articles/tip-protein-backup-portions-600.webp | 600x375 | 20.1 KB | 1000 | yes | 0.60x
assets/img/articles/tip-protein-backup-portions.webp | 1200x750 | 58.9 KB | 1000 | yes | 1.20x
assets/img/articles/tip-reflux-time-stamp-600.webp | 600x375 | 23.4 KB | 1000 | yes | 0.60x
assets/img/articles/tip-reflux-time-stamp.webp | 1200x750 | 66.7 KB | 1000 | yes | 1.20x
assets/img/articles/tip-repeatable-waist-measure-600.webp | 600x375 | 21.9 KB | 1000 | yes | 0.60x
assets/img/articles/tip-repeatable-waist-measure.webp | 1200x750 | 85.9 KB | 1000 | yes | 1.20x
assets/img/articles/tip-three-column-bowel-log-600.webp | 600x375 | 15.7 KB | 1000 | yes | 0.60x
assets/img/articles/tip-three-column-bowel-log.webp | 1200x750 | 48.2 KB | 1000 | yes | 1.20x
assets/img/articles/tip-ultrasound-prep-card-600.webp | 600x375 | 18.0 KB | 1000 | yes | 0.60x
assets/img/articles/tip-ultrasound-prep-card.webp | 1200x750 | 54.7 KB | 1000 | yes | 1.20x
assets/img/articles/tip-walk-after-hardest-meal-600.webp | 600x375 | 18.0 KB | 1000 | yes | 0.60x
assets/img/articles/tip-walk-after-hardest-meal.webp | 1200x750 | 60.9 KB | 1000 | yes | 1.20x
assets/img/articles/ultrasound-uses-sound-not-xrays-600.webp | 600x375 | 33.5 KB | 1000 | yes | 0.60x
assets/img/articles/ultrasound-uses-sound-not-xrays.webp | 1200x750 | 112.1 KB | 1000 | yes | 1.20x
assets/img/articles/vitamin-b12-in-plant-based-eating-600.webp | 600x375 | 29.1 KB | 1000 | yes | 0.60x
assets/img/articles/vitamin-b12-in-plant-based-eating.webp | 1200x750 | 90.8 KB | 1000 | yes | 1.20x
assets/img/articles/weight-management-2-600.webp | 600x375 | 30.2 KB | 1000 | yes | 0.60x
assets/img/articles/weight-management-2.webp | 1200x750 | 84.3 KB | 1000 | yes | 1.20x
assets/img/articles/weight-management-3-600.webp | 600x375 | 75.4 KB | 1000 | yes | 0.60x
assets/img/articles/weight-management-3.webp | 1200x750 | 202.6 KB | 1000 | yes | 1.20x
assets/img/articles/weight-medicines-are-not-a-short-course-600.webp | 600x375 | 18.1 KB | 1000 | yes | 0.60x
assets/img/articles/weight-medicines-are-not-a-short-course.webp | 1200x750 | 52.7 KB | 1000 | yes | 1.20x
assets/img/banners/about-900.webp | 900x506 | 45.1 KB | n/a | no | n/a
assets/img/banners/about-results-900.webp | 900x506 | 55.1 KB | n/a | no | n/a
assets/img/banners/about-results.webp | 1600x900 | 149.3 KB | n/a | yes | n/a
assets/img/banners/about-technology-900.webp | 900x506 | 62.8 KB | n/a | no | n/a
assets/img/banners/about-technology.webp | 1600x900 | 140.0 KB | n/a | yes | n/a
assets/img/banners/about.webp | 1600x900 | 98.9 KB | n/a | yes | n/a
assets/img/banners/articles-900.webp | 900x506 | 41.9 KB | n/a | no | n/a
assets/img/banners/articles.webp | 1600x900 | 88.1 KB | n/a | yes | n/a
assets/img/banners/branches-900.webp | 900x506 | 75.0 KB | n/a | no | n/a
assets/img/banners/branches.webp | 1600x900 | 187.7 KB | n/a | yes | n/a
assets/img/banners/contact-900.webp | 900x506 | 54.9 KB | n/a | no | n/a
assets/img/banners/contact.webp | 1600x900 | 131.2 KB | n/a | yes | n/a
assets/img/banners/digital-900.webp | 900x506 | 56.3 KB | n/a | no | n/a
assets/img/banners/digital.webp | 1600x900 | 122.2 KB | n/a | yes | n/a
assets/img/banners/doctors-900.webp | 900x506 | 44.8 KB | n/a | no | n/a
assets/img/banners/doctors.webp | 1600x900 | 92.7 KB | n/a | yes | n/a
assets/img/banners/home-visits-900.webp | 900x506 | 50.2 KB | n/a | no | n/a
assets/img/banners/home-visits.webp | 1600x900 | 113.4 KB | n/a | yes | n/a
assets/img/banners/patients-900.webp | 900x506 | 45.1 KB | n/a | no | n/a
assets/img/banners/patients.webp | 1600x900 | 99.4 KB | n/a | yes | n/a
assets/img/banners/reviews-900.webp | 900x506 | 22.7 KB | n/a | no | n/a
assets/img/banners/reviews.webp | 1600x900 | 49.6 KB | n/a | yes | n/a
assets/img/banners/specialties-900.webp | 900x506 | 57.6 KB | n/a | no | n/a
assets/img/banners/specialties.webp | 1600x900 | 151.7 KB | n/a | yes | n/a
assets/img/banners/tools-900.webp | 900x506 | 56.4 KB | n/a | no | n/a
assets/img/banners/tools.webp | 1600x900 | 125.6 KB | n/a | yes | n/a
assets/img/before-after/pair-1-after-600.webp | 600x800 | 29.0 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-1-after.webp | 1200x1600 | 85.9 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-1-before-600.webp | 600x800 | 28.6 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-1-before.webp | 1200x1600 | 75.8 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-10-after-600.webp | 600x800 | 31.0 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-10-after.webp | 1200x1600 | 73.7 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-10-before-600.webp | 600x800 | 20.3 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-10-before.webp | 1200x1600 | 52.7 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-11-after-600.webp | 600x800 | 52.3 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-11-after.webp | 1200x1600 | 119.0 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-11-before-600.webp | 600x800 | 31.2 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-11-before.webp | 1200x1600 | 75.5 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-12-after-600.webp | 600x800 | 19.5 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-12-after.webp | 1200x1600 | 45.9 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-12-before-600.webp | 600x800 | 63.2 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-12-before.webp | 1200x1600 | 143.1 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-13-after-600.webp | 600x800 | 30.5 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-13-after.webp | 1200x1600 | 71.5 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-13-before-600.webp | 600x800 | 25.4 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-13-before.webp | 1200x1600 | 60.2 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-2-after-600.webp | 600x800 | 32.8 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-2-after.webp | 1200x1600 | 77.5 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-2-before-600.webp | 600x800 | 21.3 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-2-before.webp | 1200x1600 | 56.4 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-3-after-600.webp | 600x800 | 37.4 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-3-after.webp | 1200x1600 | 87.1 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-3-before-600.webp | 600x800 | 22.2 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-3-before.webp | 1200x1600 | 60.0 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-4-after-600.webp | 600x800 | 23.4 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-4-after.webp | 1200x1600 | 54.8 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-4-before-600.webp | 600x800 | 23.7 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-4-before.webp | 1200x1600 | 63.1 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-5-after-600.webp | 600x800 | 22.4 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-5-after.webp | 1200x1600 | 54.3 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-5-before-600.webp | 600x800 | 51.0 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-5-before.webp | 1200x1600 | 113.9 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-6-after-600.webp | 600x800 | 22.1 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-6-after.webp | 1200x1600 | 54.5 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-6-before-600.webp | 600x800 | 39.0 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-6-before.webp | 1200x1600 | 89.8 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-7-after-600.webp | 600x800 | 27.0 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-7-after.webp | 1200x1600 | 63.6 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-7-before-600.webp | 600x800 | 42.7 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-7-before.webp | 1200x1600 | 97.8 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-8-after-600.webp | 600x800 | 36.1 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-8-after.webp | 1200x1600 | 83.6 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-8-before-600.webp | 600x800 | 44.7 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-8-before.webp | 1200x1600 | 114.9 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-9-after-600.webp | 600x800 | 30.9 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-9-after.webp | 1200x1600 | 75.0 KB | 1200 | yes | 1.00x
assets/img/before-after/pair-9-before-600.webp | 600x800 | 25.1 KB | 1200 | yes | 0.50x
assets/img/before-after/pair-9-before.webp | 1200x1600 | 58.8 KB | 1200 | yes | 1.00x
assets/img/before-after/sample-1-after-600.webp | 600x450 | 1.7 KB | n/a | no | n/a
assets/img/before-after/sample-1-after.webp | 1200x900 | 5.2 KB | n/a | no | n/a
assets/img/before-after/sample-1-before-600.webp | 600x450 | 1.9 KB | n/a | no | n/a
assets/img/before-after/sample-1-before.webp | 1200x900 | 5.3 KB | n/a | no | n/a
assets/img/before-after/sample-2-after-600.webp | 600x450 | 1.7 KB | n/a | no | n/a
assets/img/before-after/sample-2-after.webp | 1200x900 | 5.3 KB | n/a | no | n/a
assets/img/before-after/sample-2-before-600.webp | 600x450 | 2.0 KB | n/a | no | n/a
assets/img/before-after/sample-2-before.webp | 1200x900 | 5.6 KB | n/a | no | n/a
assets/img/before-after/sample-3-after-600.webp | 600x450 | 1.8 KB | n/a | no | n/a
assets/img/before-after/sample-3-after.webp | 1200x900 | 5.2 KB | n/a | no | n/a
assets/img/before-after/sample-3-before-600.webp | 600x450 | 1.9 KB | n/a | no | n/a
assets/img/before-after/sample-3-before.webp | 1200x900 | 5.4 KB | n/a | no | n/a
assets/img/before-after/sample-4-after-600.webp | 600x450 | 1.8 KB | n/a | no | n/a
assets/img/before-after/sample-4-after.webp | 1200x900 | 5.1 KB | n/a | no | n/a
assets/img/before-after/sample-4-before-600.webp | 600x450 | 2.0 KB | n/a | no | n/a
assets/img/before-after/sample-4-before.webp | 1200x900 | 5.4 KB | n/a | no | n/a
assets/img/before-after/sample-5-after-600.webp | 600x450 | 1.8 KB | n/a | no | n/a
assets/img/before-after/sample-5-after.webp | 1200x900 | 5.2 KB | n/a | no | n/a
assets/img/before-after/sample-5-before-600.webp | 600x450 | 1.9 KB | n/a | no | n/a
assets/img/before-after/sample-5-before.webp | 1200x900 | 5.5 KB | n/a | no | n/a
assets/img/before-after/sample-6-after-600.webp | 600x450 | 1.8 KB | n/a | no | n/a
assets/img/before-after/sample-6-after.webp | 1200x900 | 5.1 KB | n/a | no | n/a
assets/img/before-after/sample-6-before-600.webp | 600x450 | 1.9 KB | n/a | no | n/a
assets/img/before-after/sample-6-before.webp | 1200x900 | 5.4 KB | n/a | no | n/a
assets/img/clinic/branch-fifth-settlement-600.webp | 600x400 | 80.5 KB | 600 | yes | 1.00x
assets/img/clinic/branch-fifth-settlement.webp | 1200x800 | 253.5 KB | 600 | yes | 2.00x
assets/img/clinic/branch-maadi-600.webp | 600x400 | 77.9 KB | 600 | yes | 1.00x
assets/img/clinic/branch-maadi.webp | 1200x800 | 241.1 KB | 600 | yes | 2.00x
assets/img/clinic/branch-sheikh-zayed-600.webp | 600x400 | 79.8 KB | 600 | yes | 1.00x
assets/img/clinic/branch-sheikh-zayed.webp | 1200x800 | 262.7 KB | 600 | yes | 2.00x
assets/img/clinic/fifth-settlement-consultation-700.webp | 700x466 | 28.1 KB | 600 | yes | 1.17x
assets/img/clinic/fifth-settlement-consultation.webp | 960x640 | 46.5 KB | 600 | yes | 1.60x
assets/img/clinic/fifth-settlement-office-700.webp | 700x466 | 24.8 KB | 600 | yes | 1.17x
assets/img/clinic/fifth-settlement-office.webp | 960x640 | 40.9 KB | 600 | yes | 1.60x
assets/img/clinic/fifth-settlement-reception-700.webp | 700x466 | 25.1 KB | 600 | yes | 1.17x
assets/img/clinic/fifth-settlement-reception.webp | 960x640 | 42.7 KB | 600 | yes | 1.60x
assets/img/clinic/fifth-settlement-waiting-700.webp | 700x466 | 11.1 KB | 600 | yes | 1.17x
assets/img/clinic/fifth-settlement-waiting.webp | 960x640 | 19.0 KB | 600 | yes | 1.60x
assets/img/clinic/hero-clinic-1200.webp | 1200x675 | 106.7 KB | n/a | yes | n/a
assets/img/clinic/integrated-consultation-600.webp | 600x750 | 77.2 KB | 600 | yes | 1.00x
assets/img/clinic/integrated-consultation.webp | 1200x1500 | 200.5 KB | 600 | yes | 2.00x
assets/img/clinic/maadi-consultation-700.webp | 700x394 | 11.1 KB | 600 | yes | 1.17x
assets/img/clinic/maadi-consultation.webp | 1200x675 | 26.1 KB | 600 | yes | 2.00x
assets/img/clinic/maadi-reception-700.webp | 700x394 | 32.5 KB | 600 | yes | 1.17x
assets/img/clinic/maadi-reception.webp | 1200x675 | 86.5 KB | 600 | yes | 2.00x
assets/img/clinic/maadi-treatment-700.webp | 700x394 | 15.6 KB | 600 | yes | 1.17x
assets/img/clinic/maadi-treatment.webp | 1200x675 | 37.9 KB | 600 | yes | 2.00x
assets/img/clinic/maadi-waiting-700.webp | 700x394 | 33.1 KB | 600 | yes | 1.17x
assets/img/clinic/maadi-waiting.webp | 1200x675 | 92.7 KB | 600 | yes | 2.00x
assets/img/clinic/patients-first-visit-900.webp | 900x506 | 46.3 KB | n/a | no | n/a
assets/img/clinic/patients-first-visit.webp | 1600x900 | 111.6 KB | n/a | no | n/a
assets/img/clinic/sheikh-zayed-placeholder-800.webp | 800x450 | 4.9 KB | n/a | no | n/a
assets/img/clinic/sheikh-zayed-placeholder.webp | 1600x900 | 10.8 KB | n/a | no | n/a
assets/img/digital/online-diet-600.webp | 600x400 | 37.7 KB | n/a | no | n/a
assets/img/digital/online-diet.webp | 1200x800 | 103.6 KB | n/a | no | n/a
assets/img/digital/recipe-book-600.webp | 600x750 | 91.7 KB | 1200 | yes | 0.50x
assets/img/digital/recipe-book-cover-600.webp | 600x900 | 113.3 KB | 700 | yes | 0.86x
assets/img/digital/recipe-book-cover.webp | 1024x1536 | 296.6 KB | 700 | yes | 1.46x
assets/img/digital/recipe-book-og.jpg | 1200x630 | 80.8 KB | n/a | no | n/a
assets/img/digital/recipe-book-og.webp | 1200x630 | 54.5 KB | n/a | no | n/a
assets/img/digital/recipe-book-open-600.webp | 600x750 | 110.0 KB | 1200 | yes | 0.50x
assets/img/digital/recipe-book-open.webp | 1200x1500 | 296.4 KB | 1200 | yes | 1.00x
assets/img/digital/recipe-book.webp | 1200x1500 | 289.1 KB | 1200 | yes | 1.00x
assets/img/doctors/alyaa-abu-taleb.jpg | 450x562 | 35.9 KB | 600 | yes | 0.75x
assets/img/doctors/alyaa-abu-taleb@2x.jpg | 900x1125 | 95.2 KB | 600 | yes | 1.50x
assets/img/doctors/mohab-ashraf.jpg | 450x562 | 38.3 KB | 600 | yes | 0.75x
assets/img/doctors/mohab-ashraf@2x.jpg | 900x1125 | 100.7 KB | 600 | yes | 1.50x
assets/img/doctors/sample-bariatric-surgeon-450.webp | 450x562 | 3.4 KB | n/a | no | n/a
assets/img/doctors/sample-bariatric-surgeon.webp | 900x1125 | 9.4 KB | n/a | no | n/a
assets/img/doctors/sample-dermatologist-450.webp | 450x562 | 3.4 KB | n/a | no | n/a
assets/img/doctors/sample-dermatologist.webp | 900x1125 | 9.5 KB | n/a | no | n/a
assets/img/doctors/sample-general-surgeon-450.webp | 450x562 | 3.4 KB | n/a | no | n/a
assets/img/doctors/sample-general-surgeon.webp | 900x1125 | 9.3 KB | n/a | no | n/a
assets/img/doctors/sample-pediatrician-450.webp | 450x562 | 3.4 KB | n/a | no | n/a
assets/img/doctors/sample-pediatrician.webp | 900x1125 | 9.4 KB | n/a | no | n/a
assets/img/doctors/shimaa-fouad.jpg | 450x562 | 37.2 KB | 600 | yes | 0.75x
assets/img/doctors/shimaa-fouad@2x.jpg | 900x1125 | 100.2 KB | 600 | yes | 1.50x
assets/img/knowledge/articles-600.webp | 600x375 | 29.2 KB | n/a | no | n/a
assets/img/knowledge/articles.webp | 1200x750 | 76.3 KB | n/a | no | n/a
assets/img/knowledge/qa-600.webp | 600x375 | 39.1 KB | n/a | no | n/a
assets/img/knowledge/qa.webp | 1200x750 | 124.5 KB | n/a | no | n/a
assets/img/knowledge/tips-600.webp | 600x375 | 35.2 KB | n/a | no | n/a
assets/img/knowledge/tips.webp | 1200x750 | 113.2 KB | n/a | no | n/a
assets/img/logo/apple-touch-icon.png | 180x180 | 10.2 KB | n/a | yes | n/a
assets/img/logo/favicon-192.png | 192x192 | 11.2 KB | n/a | yes | n/a
assets/img/logo/favicon-48.png | 48x48 | 2.0 KB | n/a | no | n/a
assets/img/logo/favicon-512.png | 512x512 | 37.5 KB | n/a | no | n/a
assets/img/logo/favicon-96.png | 96x96 | 4.7 KB | n/a | yes | n/a
assets/img/logo/favicon.svg | unknown | 55.8 KB | n/a | yes | n/a
assets/img/logo/larose-logo-black.png | 1563x1563 | 65.6 KB | n/a | no | n/a
assets/img/logo/larose-wordmark-280.webp | 280x242 | 12.9 KB | 280 | yes | 1.00x
assets/img/logo/larose-wordmark-white-280.webp | 280x242 | 9.4 KB | 280 | yes | 1.00x
assets/img/logo/larose-wordmark-white.png | 984x849 | 54.1 KB | 984 | yes | 1.00x
assets/img/logo/larose-wordmark.png | 984x849 | 54.2 KB | 160 | yes | 6.15x
assets/img/products/digital-online-900.webp | 900x506 | 51.3 KB | n/a | no | n/a
assets/img/products/digital-online.webp | 1600x900 | 104.5 KB | n/a | no | n/a
assets/img/recipe-guide/01.jpg | 1100x1366 | 208.9 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/02.jpg | 1100x1375 | 278.8 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/03.jpg | 1100x1375 | 267.8 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/04.jpg | 1100x1375 | 358.1 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/05.jpg | 1100x1375 | 231.1 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/06.jpg | 1100x1375 | 230.3 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/07.jpg | 1100x1375 | 202.4 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/08.jpg | 1100x1375 | 253.7 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/09.jpg | 1100x1375 | 330.0 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/10.jpg | 1100x1375 | 290.0 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/11.jpg | 1100x1375 | 324.5 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/12.jpg | 1100x1375 | 294.0 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/13.jpg | 1100x1375 | 325.2 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/14.jpg | 1100x1375 | 234.4 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/15.jpg | 1100x1375 | 348.8 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/16.jpg | 1100x1375 | 241.6 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/17.jpg | 1100x1375 | 228.9 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/18.jpg | 1100x1375 | 347.9 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/19.jpg | 1100x1375 | 244.3 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/20.jpg | 1100x1375 | 258.2 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/21.jpg | 1100x1375 | 301.2 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/22.jpg | 1100x1375 | 220.6 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/23.jpg | 1100x1375 | 244.3 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/24.jpg | 1100x1375 | 218.9 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/25.jpg | 1100x1375 | 200.1 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/26.jpg | 1100x1375 | 282.7 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/27.jpg | 1100x1375 | 204.1 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/28.jpg | 1100x1375 | 199.9 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/29.jpg | 1100x1375 | 365.8 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/30.jpg | 1100x1375 | 260.5 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/31.jpg | 1100x1375 | 299.0 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/32.jpg | 1100x1375 | 329.2 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/33.jpg | 1100x1375 | 348.3 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/34.jpg | 1100x1375 | 221.8 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/35.jpg | 1100x1375 | 291.4 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/36.jpg | 1100x1375 | 214.1 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/37.jpg | 1100x1375 | 312.4 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/38.jpg | 1100x1375 | 379.5 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/39.jpg | 1100x1375 | 250.3 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/40.jpg | 1100x1375 | 234.3 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/41.jpg | 1100x1375 | 226.3 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/42.jpg | 1100x1375 | 290.7 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/43.jpg | 1100x1375 | 270.6 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/44.jpg | 1100x1375 | 217.4 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/45.jpg | 1100x1375 | 213.9 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/46.jpg | 1100x1375 | 261.4 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/47.jpg | 1100x1375 | 322.4 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/48.jpg | 1100x1375 | 276.1 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/49.jpg | 1100x1375 | 196.9 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/50.jpg | 1100x1375 | 210.7 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/51.jpg | 1100x1375 | 387.5 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/52.jpg | 1100x1375 | 238.9 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/53.jpg | 1100x1375 | 236.7 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/54.jpg | 1100x1375 | 204.8 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/55.jpg | 1100x1375 | 259.0 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/56.jpg | 1100x1375 | 380.2 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/57.jpg | 1100x1375 | 381.0 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/58.jpg | 1100x1375 | 192.9 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/59.jpg | 1100x1375 | 275.1 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/60.jpg | 1100x1375 | 209.4 KB | 1100 | yes | 1.00x
assets/img/recipe-guide/cover-1100.webp | 1100x550 | 73.3 KB | n/a | no | n/a
assets/img/recipe-guide/cover.webp | 2200x1100 | 250.5 KB | n/a | no | n/a
assets/img/recipe-guide/hero-backdrop-1200.webp | 1200x500 | 47.4 KB | n/a | no | n/a
assets/img/recipe-guide/hero-backdrop.webp | 2400x1000 | 142.3 KB | n/a | no | n/a
assets/img/specialties/_placeholder-700.webp | 700x438 | 2.1 KB | n/a | no | n/a
assets/img/specialties/_placeholder.webp | 1200x750 | 4.6 KB | n/a | no | n/a
assets/img/specialties/bariatric-surgery-700.webp | 700x438 | 51.8 KB | 1200 | yes | 0.58x
assets/img/specialties/bariatric-surgery-art-700.webp | 700x438 | 2.3 KB | n/a | no | n/a
assets/img/specialties/bariatric-surgery-art.webp | 1200x750 | 4.5 KB | n/a | no | n/a
assets/img/specialties/bariatric-surgery.webp | 1200x750 | 112.0 KB | 1200 | yes | 1.00x
assets/img/specialties/body-contouring-700.webp | 700x438 | 49.4 KB | 1200 | yes | 0.58x
assets/img/specialties/body-contouring.webp | 1200x750 | 105.3 KB | 1200 | yes | 1.00x
assets/img/specialties/clinical-nutrition-700.webp | 700x438 | 51.9 KB | 1200 | yes | 0.58x
assets/img/specialties/clinical-nutrition-art-700.webp | 700x438 | 2.6 KB | n/a | no | n/a
assets/img/specialties/clinical-nutrition-art.webp | 1200x750 | 5.1 KB | n/a | no | n/a
assets/img/specialties/clinical-nutrition.webp | 1200x750 | 112.5 KB | 1200 | yes | 1.00x
assets/img/specialties/dermatology-700.webp | 700x438 | 59.4 KB | 1200 | yes | 0.58x
assets/img/specialties/dermatology-art-700.webp | 700x438 | 3.2 KB | n/a | no | n/a
assets/img/specialties/dermatology-art.webp | 1200x750 | 5.9 KB | n/a | no | n/a
assets/img/specialties/dermatology.webp | 1200x750 | 127.1 KB | 1200 | yes | 1.00x
assets/img/specialties/gastroenterology-hepatology-700.webp | 700x438 | 47.7 KB | 1200 | yes | 0.58x
assets/img/specialties/gastroenterology-hepatology.webp | 1200x750 | 104.8 KB | 1200 | yes | 1.00x
assets/img/specialties/general-surgery-700.webp | 700x438 | 53.9 KB | 1200 | yes | 0.58x
assets/img/specialties/general-surgery.webp | 1200x750 | 114.1 KB | 1200 | yes | 1.00x
assets/img/specialties/internal-medicine-700.webp | 700x438 | 54.1 KB | 1200 | yes | 0.58x
assets/img/specialties/internal-medicine-art-700.webp | 700x438 | 9.8 KB | n/a | no | n/a
assets/img/specialties/internal-medicine-art.webp | 1200x750 | 15.4 KB | n/a | no | n/a
assets/img/specialties/internal-medicine.webp | 1200x750 | 139.5 KB | 1200 | yes | 1.00x
assets/img/specialties/pediatrics-700.webp | 700x438 | 55.3 KB | 1200 | yes | 0.58x
assets/img/specialties/pediatrics-art-700.webp | 700x438 | 4.5 KB | n/a | no | n/a
assets/img/specialties/pediatrics-art.webp | 1200x750 | 8.2 KB | n/a | no | n/a
assets/img/specialties/pediatrics.webp | 1200x750 | 127.0 KB | 1200 | yes | 1.00x
assets/img/specialties/ultrasound-700.webp | 700x438 | 39.7 KB | 1200 | yes | 0.58x
assets/img/specialties/ultrasound.webp | 1200x750 | 77.5 KB | 1200 | yes | 1.00x
assets/img/specialties/weight-management-700.webp | 700x438 | 27.6 KB | 1200 | yes | 0.58x
assets/img/specialties/weight-management.webp | 1200x750 | 57.3 KB | 1200 | yes | 1.00x

Oversized (intrinsic width > 2x largest displayed width) (1)
  assets/img/logo/larose-wordmark.png — 984px / 160px = 6.15x (54.2 KB)

Unreferenced (100)
  assets/img/articles/bodycontour-2-600.webp (25.5 KB)
  assets/img/articles/bodycontour-2.webp (69.3 KB)
  assets/img/articles/cover-1-600.webp (1.6 KB)
  assets/img/articles/cover-1.webp (4.7 KB)
  assets/img/articles/cover-2-600.webp (2.0 KB)
  assets/img/articles/cover-2.webp (5.4 KB)
  assets/img/articles/cover-3-600.webp (1.8 KB)
  assets/img/articles/cover-3.webp (4.8 KB)
  assets/img/articles/cover-4-600.webp (1.6 KB)
  assets/img/articles/cover-4.webp (4.6 KB)
  assets/img/articles/cover-5-600.webp (2.0 KB)
  assets/img/articles/cover-5.webp (5.4 KB)
  assets/img/articles/cover-6-600.webp (1.8 KB)
  assets/img/articles/cover-6.webp (4.8 KB)
  assets/img/articles/dermatology-3-600.webp (32.1 KB)
  assets/img/articles/dermatology-3.webp (91.3 KB)
  assets/img/articles/general-1-600.webp (46.0 KB)
  assets/img/articles/general-1.webp (133.3 KB)
  assets/img/articles/pediatrics-2-600.webp (31.4 KB)
  assets/img/articles/pediatrics-2.webp (79.0 KB)
  assets/img/banners/about-900.webp (45.1 KB)
  assets/img/banners/about-results-900.webp (55.1 KB)
  assets/img/banners/about-technology-900.webp (62.8 KB)
  assets/img/banners/articles-900.webp (41.9 KB)
  assets/img/banners/branches-900.webp (75.0 KB)
  assets/img/banners/contact-900.webp (54.9 KB)
  assets/img/banners/digital-900.webp (56.3 KB)
  assets/img/banners/doctors-900.webp (44.8 KB)
  assets/img/banners/home-visits-900.webp (50.2 KB)
  assets/img/banners/patients-900.webp (45.1 KB)
  assets/img/banners/reviews-900.webp (22.7 KB)
  assets/img/banners/specialties-900.webp (57.6 KB)
  assets/img/banners/tools-900.webp (56.4 KB)
  assets/img/before-after/sample-1-after-600.webp (1.7 KB)
  assets/img/before-after/sample-1-after.webp (5.2 KB)
  assets/img/before-after/sample-1-before-600.webp (1.9 KB)
  assets/img/before-after/sample-1-before.webp (5.3 KB)
  assets/img/before-after/sample-2-after-600.webp (1.7 KB)
  assets/img/before-after/sample-2-after.webp (5.3 KB)
  assets/img/before-after/sample-2-before-600.webp (2.0 KB)
  assets/img/before-after/sample-2-before.webp (5.6 KB)
  assets/img/before-after/sample-3-after-600.webp (1.8 KB)
  assets/img/before-after/sample-3-after.webp (5.2 KB)
  assets/img/before-after/sample-3-before-600.webp (1.9 KB)
  assets/img/before-after/sample-3-before.webp (5.4 KB)
  assets/img/before-after/sample-4-after-600.webp (1.8 KB)
  assets/img/before-after/sample-4-after.webp (5.1 KB)
  assets/img/before-after/sample-4-before-600.webp (2.0 KB)
  assets/img/before-after/sample-4-before.webp (5.4 KB)
  assets/img/before-after/sample-5-after-600.webp (1.8 KB)
  assets/img/before-after/sample-5-after.webp (5.2 KB)
  assets/img/before-after/sample-5-before-600.webp (1.9 KB)
  assets/img/before-after/sample-5-before.webp (5.5 KB)
  assets/img/before-after/sample-6-after-600.webp (1.8 KB)
  assets/img/before-after/sample-6-after.webp (5.1 KB)
  assets/img/before-after/sample-6-before-600.webp (1.9 KB)
  assets/img/before-after/sample-6-before.webp (5.4 KB)
  assets/img/clinic/patients-first-visit-900.webp (46.3 KB)
  assets/img/clinic/patients-first-visit.webp (111.6 KB)
  assets/img/clinic/sheikh-zayed-placeholder-800.webp (4.9 KB)
  assets/img/clinic/sheikh-zayed-placeholder.webp (10.8 KB)
  assets/img/digital/online-diet-600.webp (37.7 KB)
  assets/img/digital/online-diet.webp (103.6 KB)
  assets/img/digital/recipe-book-og.jpg (80.8 KB)
  assets/img/digital/recipe-book-og.webp (54.5 KB)
  assets/img/doctors/sample-bariatric-surgeon-450.webp (3.4 KB)
  assets/img/doctors/sample-bariatric-surgeon.webp (9.4 KB)
  assets/img/doctors/sample-dermatologist-450.webp (3.4 KB)
  assets/img/doctors/sample-dermatologist.webp (9.5 KB)
  assets/img/doctors/sample-general-surgeon-450.webp (3.4 KB)
  assets/img/doctors/sample-general-surgeon.webp (9.3 KB)
  assets/img/doctors/sample-pediatrician-450.webp (3.4 KB)
  assets/img/doctors/sample-pediatrician.webp (9.4 KB)
  assets/img/knowledge/articles-600.webp (29.2 KB)
  assets/img/knowledge/articles.webp (76.3 KB)
  assets/img/knowledge/qa-600.webp (39.1 KB)
  assets/img/knowledge/qa.webp (124.5 KB)
  assets/img/knowledge/tips-600.webp (35.2 KB)
  assets/img/knowledge/tips.webp (113.2 KB)
  assets/img/logo/favicon-48.png (2.0 KB)
  assets/img/logo/favicon-512.png (37.5 KB)
  assets/img/logo/larose-logo-black.png (65.6 KB)
  assets/img/products/digital-online-900.webp (51.3 KB)
  assets/img/products/digital-online.webp (104.5 KB)
  assets/img/recipe-guide/cover-1100.webp (73.3 KB)
  assets/img/recipe-guide/cover.webp (250.5 KB)
  assets/img/recipe-guide/hero-backdrop-1200.webp (47.4 KB)
  assets/img/recipe-guide/hero-backdrop.webp (142.3 KB)
  assets/img/specialties/_placeholder-700.webp (2.1 KB)
  assets/img/specialties/_placeholder.webp (4.6 KB)
  assets/img/specialties/bariatric-surgery-art-700.webp (2.3 KB)
  assets/img/specialties/bariatric-surgery-art.webp (4.5 KB)
  assets/img/specialties/clinical-nutrition-art-700.webp (2.6 KB)
  assets/img/specialties/clinical-nutrition-art.webp (5.1 KB)
  assets/img/specialties/dermatology-art-700.webp (3.2 KB)
  assets/img/specialties/dermatology-art.webp (5.9 KB)
  assets/img/specialties/internal-medicine-art-700.webp (9.8 KB)
  assets/img/specialties/internal-medicine-art.webp (15.4 KB)
  assets/img/specialties/pediatrics-art-700.webp (4.5 KB)
  assets/img/specialties/pediatrics-art.webp (8.2 KB)

Over 300 KB (16)
  assets/img/recipe-guide/04.jpg (358.1 KB)
  assets/img/recipe-guide/09.jpg (330.0 KB)
  assets/img/recipe-guide/11.jpg (324.5 KB)
  assets/img/recipe-guide/13.jpg (325.2 KB)
  assets/img/recipe-guide/15.jpg (348.8 KB)
  assets/img/recipe-guide/18.jpg (347.9 KB)
  assets/img/recipe-guide/21.jpg (301.2 KB)
  assets/img/recipe-guide/29.jpg (365.8 KB)
  assets/img/recipe-guide/32.jpg (329.2 KB)
  assets/img/recipe-guide/33.jpg (348.3 KB)
  assets/img/recipe-guide/37.jpg (312.4 KB)
  assets/img/recipe-guide/38.jpg (379.5 KB)
  assets/img/recipe-guide/47.jpg (322.4 KB)
  assets/img/recipe-guide/51.jpg (387.5 KB)
  assets/img/recipe-guide/56.jpg (380.2 KB)
  assets/img/recipe-guide/57.jpg (381.0 KB)
```

Exit code: 0
