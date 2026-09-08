/* ---------------------------------------------------------------------------
   In-page autonomous image runner for ChatGPT.

   Injected into a logged-in chatgpt.com tab. Walks a queue of prompts, one
   fresh chat per image, waits for the render, downloads the result into the
   browser's normal download folder, and moves on. `tools/collect_images.py`
   then crops, grades and files them into site/assets/img/.

   Threads are reused, six images each: one chat per image left 44 threads behind
   in an afternoon. The two hazards of a shared thread are handled rather than
   avoided - `seen` records every image already on the page so the detector
   cannot mistake an old one for the answer, and every follow-up prompt says
   explicitly that it wants a new image, not an edit of the last.

   Paste with:  javascript_tool → this file's contents, then __LR.start()
   Check with:  __LR.status()
   Stop with:   __LR.stop()
   --------------------------------------------------------------------------- */
(() => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* How many images share one chat. Six keeps the thread list short without
     letting the conversation grow long enough for the model to start treating
     the next request as an edit of the last picture. */
  const PER_THREAD = 6;

  /* The "no people" rule was reversed by the client on 2026-09-06: specialty
     images may show a clinician or a patient, because a room full of objects
     did not read as a clinic. Two limits still hold. A generated face must
     never sit on a page that names a real doctor, or it reads as a photograph
     of that doctor. And no frame may show a treatment the clinic does not
     offer - cavitation, radiofrequency and cryolipolysis were retired on
     2026-09-06, so no handpieces, no cooling applicators, no device consoles. */
  const BASE =
    "Editorial cover photograph for a health article on a medical clinic website; it must make a reader curious to open the article, with one clear hero object and a quiet, intriguing composition. " +
    "Soft directional daylight from the left, gentle natural shadows, shallow " +
    "depth of field, warm off-white plaster surface. Muted palette of olive " +
    "green, sage, warm champagne beige and soft dusty rose, with a few olive " +
    "leaves. Calm, premium, understated, real photography, not an illustration " +
    "and not a 3D render. Absolutely no text, no lettering, no numbers, no " +
    "logos and no watermarks of any kind. Landscape 3:2 aspect ratio. Subject: ";

  const Q = [
  [
    "art-diabetes-review-whole-health",
    "a glucose meter, a blood-pressure cuff, a lipid test tube rack and a small notebook arranged together on a warm desk, suggesting one review that looks at everything"
  ],
  [
    "art-body-contouring-safety-first",
    "a sealed sterile syringe pack and a small labelled amber vial on a folded sage-green cloth beside a clinician's clipboard, calm and precise, no device"
  ],
  [
    "art-glp1-medication-guide",
    "a slim injector pen resting on a folded linen napkin next to a glass of water and a weekly pill organiser, seen from above"
  ],
  [
    "art-obesity-care-beyond-bmi",
    "a tape measure coiled beside a body-composition scale and a stethoscope, the scale display switched off, arranged so the tape is the hero"
  ],
  [
    "art-abdominal-ultrasound-what-it-shows",
    "an ultrasound transducer probe resting on a soft towel beside a small tube of clear gel, shallow focus, quiet clinical calm"
  ],
  [
    "art-gallstones-symptoms-and-surgery",
    "a scattering of small smooth pale stones on a ceramic dish beside laparoscopic instruments laid on a green drape"
  ],
  [
    "art-kidney-stones-symptoms-and-tests",
    "a tall clear glass of water catching window light next to a specimen cup and a lab requisition clipboard, the paper blank"
  ],
  [
    "art-abdominal-hernia-warning-signs",
    "a folded surgical mesh sample and sterile instruments on a green drape with a wooden anatomical torso model out of focus behind"
  ],
  [
    "art-preparing-for-bariatric-surgery",
    "a small ceramic plate with a very modest portion of grilled fish and vegetables beside a checklist clipboard and a pen, the checklist blank"
  ],
  [
    "art-child-short-height-growth-curve",
    "a wooden height ruler on a cream wall with small pencil marks at different heights and a child's pair of shoes on the floor beside it"
  ],
  [
    "art-iron-deficiency-in-children",
    "a child's colourful bowl of lentils, spinach and a slice of orange on a small wooden table with a tiny spoon"
  ],
  [
    "art-dark-neck-acanthosis-insulin-resistance",
    "a dermatoscope and a small mirror on a dresser beside a glucose meter, soft window light, suggesting skin and metabolism together"
  ],
  [
    "art-loose-skin-or-localised-fat",
    "a tape measure and a soft folded towel on a treatment couch with sage linen, a small vial of mesotherapy solution beside them"
  ],
  [
    "art-ibs-colon-symptoms-red-flags",
    "a warm cup of peppermint tea, a bowl of oats and a small food diary notebook with a pencil, the pages blank"
  ],
  [
    "art-acid-reflux-when-to-see-doctor",
    "a wedge pillow on a neatly made bed with a glass of water and a small clock on the bedside table, calm evening light"
  ],
  [
    "art-high-cholesterol-results-and-next-steps",
    "a bowl of walnuts, a bottle of olive oil, oats and a lab tube rack on a warm surface, the balance between food and medicine"
  ],
  [
    "art-supplements-are-targeted-not-a-default",
    "a single amber supplement bottle standing alone next to a lab test tube, deliberately sparse, on a warm plaster surface"
  ],
  [
    "art-vitamin-b12-in-plant-based-eating",
    "a plant-based meal of chickpeas, greens and grains beside a small amber dropper bottle and a fortified plant-milk carton with a blank label"
  ],
  [
    "art-weight-medicines-are-not-a-short-course",
    "a weekly injector pen beside a wall calendar with many blank months visible, suggesting a long journey, warm light"
  ],
  [
    "art-movement-benefits-beyond-the-scale",
    "a pair of walking shoes, a water bottle and a folded towel by a sunlit doorway, no scale in the frame"
  ],
  [
    "art-mesotherapy-needs-an-ingredient-level-check",
    "a labelled amber vial with a completely blank label under a magnifying glass on a clinician's desk beside sterile syringes"
  ],
  [
    "art-blood-pressure-needs-a-pattern",
    "a home blood-pressure monitor with a blank cuff beside a small logbook and a pen on a kitchen table in morning light"
  ],
  [
    "art-diabetes-remission-is-not-cure",
    "a glucose meter with its display off next to a fresh salad plate and a calendar, suggesting ongoing care rather than an ending"
  ],
  [
    "art-coeliac-testing-before-gluten-free-diet",
    "a slice of wholegrain bread on a plate beside a lab blood tube and requisition form, the form blank, soft daylight"
  ],
  [
    "art-fatty-liver-fibrosis-needs-its-own-assessment",
    "an ultrasound probe and an elastography report clipboard on a desk, the report pages blank, with a small potted olive sprig"
  ],
  [
    "art-silent-gallstones-usually-need-no-treatment",
    "a few pale smooth stones resting quietly in a ceramic bowl on a windowsill with soft light, nothing surgical in the frame"
  ],
  [
    "art-surgical-checks-are-a-team-pause",
    "a surgical safety checklist clipboard resting on a folded green drape beside a pair of sterile gloves, the checklist blank"
  ],
  [
    "art-bariatric-assessment-is-multidisciplinary",
    "a round table seen from above with a stethoscope, a tape measure, a food diary and a psychology notepad at four seats, all pages blank"
  ],
  [
    "art-bariatric-follow-up-is-lifelong",
    "a small pill organiser, a supplement bottle and a wall calendar with many months, on a warm kitchen counter"
  ],
  [
    "art-acne-care-is-gentle-not-aggressive",
    "a gentle cleanser bottle with a blank label, a soft cotton pad and a small towel on a bathroom shelf, no scrub brush"
  ],
  [
    "art-cellulite-is-a-skin-structure-feature",
    "a soft folded towel and a small jar of body cream with a blank label on a treatment couch with sage linen, calm and kind"
  ],
  [
    "art-child-growth-is-a-trajectory",
    "a child's growth chart notebook open to a blank grid page beside a wooden height ruler and a pair of small shoes"
  ],
  [
    "art-ultrasound-uses-sound-not-xrays",
    "an ultrasound transducer probe on a soft cloth with gentle ripples of water in a shallow glass dish beside it, suggesting sound waves"
  ],
  [
    "art-normal-ultrasound-does-not-end-assessment",
    "an ultrasound probe beside a stethoscope and a blank lab requisition form on a desk, showing the assessment continues"
  ]
];


  const S = (window.__LR = {
    q: Q, i: 0, done: [], failed: [], log: [], running: false, current: null,
    seen: new Set(),
    started: 0,
  });

  const note = (m) => {
    const line = new Date().toTimeString().slice(0, 8) + " " + m;
    S.log.push(line);
    if (S.log.length > 200) S.log.shift();
  };

  /* Anything already on screen when a prompt is sent must not be mistaken for
     the answer, so every existing large image is recorded first. */
  const bigImages = () =>
    [...document.images].filter(
      (im) => im.naturalWidth >= 700 && im.naturalWidth >= im.naturalHeight * 0.9
    );

  async function newChat() {
    const btn =
      document.querySelector('a[data-testid="create-new-chat-button"]') ||
      [...document.querySelectorAll("a,button")].find((e) =>
        /^\s*(new chat|محادثة جديدة)\s*$/i.test(e.textContent || "")
      );
    if (btn) btn.click();
    else history.pushState({}, "", "/");
    await sleep(2500);
  }

  function composer() {
    return (
      document.querySelector("#prompt-textarea") ||
      document.querySelector('div[contenteditable="true"]') ||
      document.querySelector("textarea")
    );
  }

  async function send(text) {
    const el = composer();
    if (!el) throw new Error("no composer");
    el.focus();
    if (el.tagName === "TEXTAREA") {
      el.value = text;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      // ProseMirror ignores textContent assignment; insertText goes through
      // its own input handling and keeps the editor state consistent.
      document.execCommand("selectAll", false, null);
      document.execCommand("insertText", false, text);
    }
    await sleep(700);
    const btn =
      document.querySelector('button[data-testid="send-button"]') ||
      document.querySelector('button[aria-label*="Send" i]');
    if (btn && !btn.disabled) btn.click();
    else
      el.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true })
      );
  }

  async function waitForImage(timeoutMs) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeoutMs) {
      await sleep(3000);
      for (const im of bigImages()) {
        const src = im.currentSrc || im.src;
        if (!src || S.seen.has(src)) continue;
        // the thumbnail in the sidebar/library is small; require real size
        if (im.naturalWidth < 700) continue;
        S.seen.add(src);
        return src;
      }
    }
    return null;
  }

  async function download(src, id) {
    const r = await fetch(src);
    if (!r.ok) throw new Error("fetch " + r.status);
    const b = await r.blob();
    const url = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lrsite_" + id + ".png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 20000);
  }

  S.start = async function () {
    if (S.running) return "already running";
    S.running = true;
    S.started = Date.now();
    note("start, " + (S.q.length - S.i) + " left");
    while (S.running && S.i < S.q.length) {
      const [id, subject] = S.q[S.i];
      S.current = id;
      try {
        /* One chat per image left 44 threads behind in a single afternoon. A
           thread is reused for a handful of images instead, and only rotated
           when the context gets long enough that the model starts drifting
           toward editing what it already made. The two things that made the
           original one-per-image rule necessary are both handled: `seen` holds
           every image src already on the page, so the detector cannot mistake
           an earlier one for the answer, and each follow-up prompt says
           outright that this is a new image and not an edit. */
        if (S.i % PER_THREAD === 0) {
          await newChat();
          note("new thread");
        }
        for (const im of bigImages()) S.seen.add(im.currentSrc || im.src);
        note("send " + id);
        const fresh = S.i % PER_THREAD === 0
          ? "Generate an image. "
          : "Now generate a completely new, unrelated image from scratch. "
            + "Do not edit, extend, restyle or reuse any earlier image in this chat. ";
        await send(fresh + BASE + subject + ".");
        const src = await waitForImage(9 * 60 * 1000);
        if (!src) {
          S.failed.push(id);
          note("TIMEOUT " + id);
        } else {
          await download(src, id);
          S.done.push(id);
          note("saved " + id);
        }
      } catch (e) {
        S.failed.push(id);
        note("ERROR " + id + " " + (e && e.message));
      }
      S.i++;
      await sleep(6000);
    }
    S.running = false;
    S.current = null;
    note("finished");
    return "done";
  };

  S.stop = () => { S.running = false; return "stopping"; };

  S.status = () =>
    JSON.stringify({
      running: S.running,
      current: S.current,
      done: S.done.length,
      failed: S.failed,
      left: S.q.length - S.i,
      mins: Math.round((Date.now() - S.started) / 60000),
      tail: S.log.slice(-6),
    });

  /* Retry whatever timed out, once the account's image capacity recovers. */
  S.retryFailed = function () {
    if (S.running) return "still running";
    const again = S.q.filter(([id]) => S.failed.includes(id));
    if (!again.length) return "nothing to retry";
    S.q = again;
    S.i = 0;
    S.failed = [];
    return S.start();
  };

  return "runner ready: __LR.start()";
})();
