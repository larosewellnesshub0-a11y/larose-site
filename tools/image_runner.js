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
    "Editorial photograph for a medical clinic website. " +
    "Soft directional daylight from the left, gentle natural shadows, shallow " +
    "depth of field, warm off-white plaster surface. Muted palette of olive " +
    "green, sage, warm champagne beige and soft dusty rose, with a few olive " +
    "leaves. Calm, premium, understated, real photography, not an illustration " +
    "and not a 3D render. Absolutely no text, no lettering, no numbers, no " +
    "logos and no watermarks of any kind. Landscape 3:2 aspect ratio. Subject: ";

  const Q = [
    // ---- specialties: the subject of the specialty, not the clinic room ----
    ["sp-clinical-nutrition",
      "a flat arrangement of fresh whole ingredients — olive oil in a small glass cruet, " +
      "leafy greens, walnuts, a halved pomegranate and a bowl of lentils — beside a " +
      "stainless steel tape measure and a plain closed notebook"],
    ["sp-weight-management",
      "a clean modern digital bathroom scale seen from a low three-quarter angle, beside " +
      "a stainless tape measure coiled loosely and a plain glass of water"],
    // Mesotherapy is the only contouring treatment the clinic still offers, so
    // this frame must show a calm treatment room and nothing device-shaped.
    ["sp-body-contouring",
      "a private treatment room prepared for a session: a treatment couch made up with " +
      "fresh sage-green linen, a covered stainless instrument tray on a low trolley and " +
      "a small potted olive plant by the window, no machines or devices in the frame"],
    ["sp-internal-medicine",
      "a stethoscope, a medical ultrasound transducer probe resting on a folded cloth, " +
      "and a small neat stack of blank clinical report pages"],
    ["sp-general-surgery",
      "sterile stainless steel laparoscopic surgical instruments laid out in a precise row " +
      "on a folded surgical drape"],
    ["sp-bariatric-surgery",
      "a set of sterile stainless steel surgical instruments beside a small plate holding " +
      "a deliberately modest portion of food, suggesting scale and restraint"],
    ["sp-dermatology",
      "a dermatoscope, a small amber glass dropper bottle and neatly folded gauze"],
    ["sp-pediatrics",
      "a small paediatric stethoscope with a soft knitted baby blanket and a plain wooden " +
      "height ruler leaning against the wall"],

    // ---- page banners: each one has to say what its page is about ---------
    ["hero-about",
      "a quiet corner of a calm consulting room: a plain wooden desk edge, a potted olive " +
      "sprig and a single upholstered chair, shot wide and airy"],
    ["hero-about-technology",
      "a professional body-composition analyser and an ultrasound machine console in a " +
      "bright treatment room, clean and uncluttered, no screens showing any text"],
    ["hero-about-results",
      "a plain tape measure and a closed notebook on a bright surface, with a soft shadow " +
      "of window light across them"],
    ["hero-patients",
      "a calm reception desk corner with a small vase of olive branches and a plain glass " +
      "of water, shot at a welcoming angle"],
    ["hero-articles",
      "an open blank notebook, a pair of reading glasses and a cup of tea on a warm desk, " +
      "the pages completely blank with no writing at all"],
    ["hero-branches",
      "a bright arched window in a warm plaster wall with soft daylight falling through it " +
      "onto a tiled floor"],
    ["hero-tools",
      "a tape measure, a small digital scale and a plain glass of water arranged neatly in " +
      "a row on a warm surface"],
    ["hero-home-visits",
      "a doctor's leather home-visit bag sitting on a domestic hallway console table beside " +
      "a set of keys and a small potted plant"],
    ["hero-doctors",
      "three plain white clinician coats hanging in a neat row on warm wooden pegs against " +
      "a plaster wall, empty, no people"],
    ["hero-specialties",
      "an overhead flat lay of a stethoscope, an ultrasound probe, a dermatoscope and a " +
      "tape measure spaced evenly apart on a warm surface"],
    ["hero-digital",
      "a closed tablet device and a printed recipe booklet lying on a kitchen counter beside " +
      "fresh herbs, the covers completely blank with no writing"],
    ["hero-contact",
      "a desk telephone handset and a small potted olive plant on a warm plaster surface, " +
      "shot simply and calmly"],

    // ---- digital products -------------------------------------------------
    ["dg-recipe-book",
      "a beautiful home-cooked mediterranean meal photographed from above on warm ceramic " +
      "plates, with fresh herbs and olive oil, styled simply"],
    ["dg-online-diet",
      "a tablet device propped on a kitchen counter next to a prepared healthy lunch box, " +
      "the screen switched off and completely blank"],
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
