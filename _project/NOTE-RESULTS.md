# Results, video testimonials, and feedback screenshots

Date: 2026-09-07

## What changed

- Added an optional `results` array to the `clinical-nutrition` and
  `weight-management` specialty records. Both arrays are intentionally empty.
  Each future item has this shape: `image`, bilingual `alt`, bilingual
  `caption`, and `consent`.
- Added a dedicated finished-card results gallery. It treats each supplied 4:5
  card as one portrait image, preserves that aspect ratio, lazy-loads it, and
  renders its caption in a real `figcaption`.
- Enforced the results consent gate in the renderer. An entry is rendered only
  when `consent === true` and its image, current-language alt text, and
  current-language caption are all non-empty.
- Kept the existing comparison-slider output as the exact empty-state fallback.
  Once a specialty has at least one complete, consented `results` item, the new
  gallery replaces the legacy slider content inside that specialty's existing
  Results tab.
- Added empty top-level `videos` and `screenshots` arrays to `reviews.json`.
- Extended the reviews-page content component with YouTube testimonial facades.
  A facade contains a locally rendered thumbnail, a real button with a
  bilingual accessible label, and the supplied title and caption. YouTube is
  not contacted on page load. Activating the button creates a
  `youtube-nocookie.com` iframe, assigns the current-language title, starts it
  muted, and moves focus to it.
- Added a consent-gated screenshot gallery to the reviews page. It renders only
  complete entries with `consent === true`, preserves each screenshot's natural
  shape, lazy-loads the file, uses the supplied bilingual alt text, and shows
  only the declared source label. It does not generate a person name or rating.
- Added responsive, RTL-safe component styles using logical properties. The new
  cards remain opaque content surfaces rather than Liquid Glass.
- Appended a separate YouTube-facade initializer to `site/assets/js/site.js`;
  the existing script body was not changed.
- Added dashboard field labels for `results`, `consent`, `caption`, `videos`,
  `youtubeId`, and `screenshots`, plus add-row templates for all three arrays.
  Existing labels already cover `image`, `alt`, `title`, and `source`.

## Assumptions and items not verified

- JSON does not support comments. To keep both specialty arrays literally empty
  while still providing the requested commented example, one documentation-only
  schema example was added to the existing top-level `_note` in
  `specialties.json`. It is not array data and can never render.
- No result-card files, screenshot files, bare YouTube video IDs, bilingual
  video titles, or bilingual captions were present in the permitted source
  files. A direct fetch of the configured playlist failed and web search did
  not expose matching clinic entries, so nothing was populated or inferred
  from the URL; doing so would risk misidentifying patient content.
- A CSS-rendered branded video thumbnail is used instead of a poster fetched
  from `i.ytimg.com`. This follows the requirement that the page make no
  third-party request before the visitor acts, and works with the requested
  video schema, which has no local thumbnail field.
- A click starts the video with `autoplay=1&mute=1`. This interprets “No autoplay
  with sound” as allowing muted playback after an explicit user action.
- The code treats `consent: true` as the clinic's confirmation that written
  consent exists. The renderer can enforce the boolean gate but cannot verify a
  signed consent document.
- Result images are expected to use the site's normal content path convention,
  for example `assets/img/results/file.webp`. YouTube entries must contain the
  bare video ID, not a full URL.
- Unknown screenshot-source values are displayed as the bilingual “Other
  source” label. The documented values are `google`, `whatsapp`, `instagram`,
  and `other`.
- The reviews page reaches these new sections through the shared `reviewTopics`
  component, which is used there and was inside the permitted edit list. No
  change was made to `build/pages/about.mjs`.
- The supplied instruction explicitly prohibited running the project, builds,
  tests, or Python. Accordingly, the changes received a source review only and
  have not been executed, built, validated, or visually inspected.
