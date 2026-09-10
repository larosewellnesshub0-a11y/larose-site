/* ==========================================================================
   LA ROSE WELLNESS HUB، site behaviour
   No dependencies. Everything degrades: with JS off the site still reads,
   navigates and submits.
   ========================================================================== */
(function () {
  "use strict";

  // Tell the stylesheet the script is alive, so the reveal animation's hidden
  // state may be applied. Done first, synchronously, before anything can throw.
  document.documentElement.classList.add("js");

  var rtl = document.documentElement.getAttribute("dir") === "rtl";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     Daily advice pool

     The rendered sentence is a complete no-script fallback. Fetching only
     replaces its text node, so a missing file or blocked request changes
     nothing and the card never has to be rebuilt.
     --------------------------------------------------------------------- */
  var tipBands = document.querySelectorAll("[data-random-tip]");
  if (tipBands.length && window.fetch) {
    var tipSource = tipBands[0].getAttribute("data-tip-source");
    try {
      window.fetch(tipSource, { credentials: "same-origin" }).then(function (response) {
        if (!response.ok) throw new Error("Tip pool request failed");
        return response.json();
      }).then(function (tips) {
        if (!Array.isArray(tips) || tips.length < 2) return;
        var previous = "";
        try { previous = window.sessionStorage.getItem("lr-last-tip") || ""; }
        catch (err) { previous = ""; }
        var choices = tips.filter(function (tip) { return tip && tip.id !== previous; });
        var selected = choices[Math.floor(Math.random() * choices.length)];
        var locale = document.documentElement.getAttribute("lang") === "en" ? "en" : "ar";
        var value = selected && selected[locale];
        if (typeof value !== "string" || !value.trim()) return;
        Array.prototype.forEach.call(tipBands, function (band) {
          var textNode = band.querySelector("[data-random-tip-text]");
          if (textNode) textNode.textContent = value;
        });
        try { window.sessionStorage.setItem("lr-last-tip", selected.id); }
        catch (err) { /* storage is optional */ }
      }).catch(function () { /* the server-rendered tip stays in place */ });
    } catch (err) { /* the server-rendered tip stays in place */ }
  }

  /* ---------------------------------------------------------------------
     Sticky header shadow
     --------------------------------------------------------------------- */
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Desktop dropdowns: hover on pointer devices, click/keyboard everywhere
     --------------------------------------------------------------------- */
  var dropdowns = document.querySelectorAll("[data-dropdown]");
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function closeAllDropdowns(except) {
    dropdowns.forEach(function (d) {
      if (d === except) return;
      d.classList.remove("is-open");
      var l = d.querySelector(".nav__link");
      if (l) l.setAttribute("aria-expanded", "false");
    });
  }

  dropdowns.forEach(function (item) {
    var trigger = item.querySelector(".nav__link");
    if (!trigger) return;

    var open = function () {
      closeAllDropdowns(item);
      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      nudgeIntoView(item);
    };
    var close = function () {
      item.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    };

    if (canHover) {
      var timer;
      item.addEventListener("mouseenter", function () { clearTimeout(timer); open(); });
      item.addEventListener("mouseleave", function () { timer = setTimeout(close, 140); });
    }

    // Keyboard and touch: the caret toggles, the label still navigates.
    trigger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !item.classList.contains("is-open")) {
        e.preventDefault();
        open();
      } else if (e.key === "Escape") {
        close();
        trigger.focus();
      }
    });

    if (!canHover) {
      trigger.addEventListener("click", function (e) {
        if (!item.classList.contains("is-open")) {
          e.preventDefault();
          open();
        }
      });
    }

    item.addEventListener("focusout", function (e) {
      if (!item.contains(e.relatedTarget)) close();
    });
  });

  /* A centred panel wider than the space beside its trigger will hang off the
     edge of the window: most visibly for the first and last nav items, and
     for the wide Knowledge Centre panel. Measure once on open and shift it
     back inside, in whichever direction it overflowed. */
  function nudgeIntoView(item) {
    var panel = item.querySelector(".nav__panel");
    if (!panel) return;
    panel.style.setProperty("--panel-nudge", "0px");
    var margin = 12;
    var r = panel.getBoundingClientRect();
    var nudge = 0;
    if (r.left < margin) nudge = margin - r.left;
    else if (r.right > window.innerWidth - margin) nudge = (window.innerWidth - margin) - r.right;
    if (nudge) panel.style.setProperty("--panel-nudge", Math.round(nudge) + "px");
  }

  window.addEventListener("resize", function () {
    dropdowns.forEach(function (d) {
      if (d.classList.contains("is-open")) nudgeIntoView(d);
    });
  }, { passive: true });

  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-dropdown]")) closeAllDropdowns(null);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAllDropdowns(null);
  });

  /* ---------------------------------------------------------------------
     Mobile drawer
     --------------------------------------------------------------------- */
  var drawer = document.getElementById("drawer");
  var burgers = document.querySelectorAll(".burger");
  var lastFocus = null;

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    burgers.forEach(function (b) { b.setAttribute("aria-expanded", "true"); });
    var first = drawer.querySelector("a, button");
    if (first) first.focus();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    burgers.forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    if (lastFocus) lastFocus.focus();
  }

  burgers.forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.hasAttribute("data-drawer-close")) return closeDrawer();
      drawer && drawer.classList.contains("is-open") ? closeDrawer() : openDrawer();
    });
  });
  document.querySelectorAll("[data-drawer-close]").forEach(function (el) {
    el.addEventListener("click", closeDrawer);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer && drawer.classList.contains("is-open")) closeDrawer();
  });

  // Focus trap inside the drawer
  if (drawer) {
    drawer.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !drawer.classList.contains("is-open")) return;
      var f = drawer.querySelectorAll('a[href], button:not([disabled]), select, input, textarea');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  // Drawer accordions
  document.querySelectorAll("[data-drawer-group] .drawer-nav__toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var group = btn.closest("[data-drawer-group]");
      var open = group.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---------------------------------------------------------------------
     FAQ accordion
     --------------------------------------------------------------------- */
  document.querySelectorAll(".faq__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq__item");
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---------------------------------------------------------------------
     Tabs
     --------------------------------------------------------------------- */
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll("[role='tab']"));
    function select(tab) {
      tabs.forEach(function (x) {
        var on = x === tab;
        x.setAttribute("aria-selected", on ? "true" : "false");
        x.setAttribute("tabindex", on ? "0" : "-1");
        var panel = document.getElementById(x.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function (e) { e.preventDefault(); select(tab); });
      tab.addEventListener("keydown", function (e) {
        var dir = rtl ? -1 : 1;
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + dir + tabs.length) % tabs.length];
        else if (e.key === "ArrowLeft") next = tabs[(i - dir + tabs.length) % tabs.length];
        else if (e.key === "Home") next = tabs[0];
        else if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next); next.focus(); }
      });
    });
  });

  /* ---------------------------------------------------------------------
     Booking finder، filter the doctor list by the chosen specialty
     --------------------------------------------------------------------- */
  document.querySelectorAll("[data-finder]").forEach(function (form) {
    var spec = form.querySelector("[data-finder-specialty]");
    var doc = form.querySelector("[data-finder-doctor]");
    if (!spec || !doc) return;
    var all = Array.prototype.slice.call(doc.options);

    spec.addEventListener("change", function () {
      var v = spec.value;
      doc.innerHTML = "";
      all.forEach(function (opt) {
        if (!opt.value) return doc.appendChild(opt);
        var list = (opt.getAttribute("data-specialties") || "").split(",");
        if (!v || list.indexOf(v) !== -1) doc.appendChild(opt);
      });
      doc.value = "";
    });
  });

  /* ---------------------------------------------------------------------
     Before / after comparison
     --------------------------------------------------------------------- */
  document.querySelectorAll("[data-before-after]").forEach(function (el) {
    var handle = el.querySelector(".ba__handle");
    if (!handle) return;
    var dragging = false;

    function setPos(clientX) {
      var r = el.getBoundingClientRect();
      var pct = ((clientX - r.left) / r.width) * 100;
      if (rtl) pct = 100 - pct;
      pct = Math.max(0, Math.min(100, pct));
      el.style.setProperty("--pos", pct + "%");
      handle.setAttribute("aria-valuenow", Math.round(pct));
    }

    el.addEventListener("pointerdown", function (e) {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      setPos(e.clientX);
    });
    el.addEventListener("pointermove", function (e) { if (dragging) setPos(e.clientX); });
    el.addEventListener("pointerup", function () { dragging = false; });
    el.addEventListener("pointercancel", function () { dragging = false; });

    handle.addEventListener("keydown", function (e) {
      var cur = parseFloat(el.style.getPropertyValue("--pos")) || 50;
      var step = e.shiftKey ? 10 : 2;
      var d = rtl ? -1 : 1;
      if (e.key === "ArrowLeft") cur -= step * d;
      else if (e.key === "ArrowRight") cur += step * d;
      else if (e.key === "Home") cur = 0;
      else if (e.key === "End") cur = 100;
      else return;
      e.preventDefault();
      cur = Math.max(0, Math.min(100, cur));
      el.style.setProperty("--pos", cur + "%");
      handle.setAttribute("aria-valuenow", Math.round(cur));
    });
  });

  /* ---------------------------------------------------------------------
     Scroll reveal: one orchestrated pass, staggered within each section
     --------------------------------------------------------------------- */
  var revealables = document.querySelectorAll("[data-reveal]");
  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Stagger siblings inside the same grid or section
        var parent = el.parentElement;
        var sibs = parent ? Array.prototype.slice.call(parent.querySelectorAll(":scope > [data-reveal]")) : [];
        var i = Math.max(0, sibs.indexOf(el));
        if (!el.style.getPropertyValue("--reveal-delay")) {
          el.style.setProperty("--reveal-delay", Math.min(i, 6) * 70 + "ms");
        }
        el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    revealables.forEach(function (el) { io.observe(el); });

    // Failsafe: whatever happens, nothing stays invisible. Covers fast
    // scrolling past a section, an observer that never fires, and any
    // exception thrown later in this file.
    setTimeout(function () {
      revealables.forEach(function (el) { el.classList.add("is-in"); });
    }, 2600);
  }

  /* ---------------------------------------------------------------------
     Prefill the booking form from ?specialty= / ?doctor= / ?branch=
     --------------------------------------------------------------------- */
  var params = new URLSearchParams(window.location.search);
  ["specialty", "doctor", "branch"].forEach(function (k) {
    var v = params.get(k);
    if (!v) return;
    var field = document.querySelector('[name="' + k + '"]');
    if (field) {
      field.value = v;
      field.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });

  /* ---------------------------------------------------------------------
     Forms: client-side validation, then hand off to WhatsApp.
     The site is static, so there is no server to post to. Submitting
     composes a pre-filled WhatsApp message to the clinic instead, which is
     how the clinic already takes bookings.
     --------------------------------------------------------------------- */
  document.querySelectorAll("[data-whatsapp-form]").forEach(function (form) {
    var status = form.querySelector("[data-form-status]");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var invalid = null;
      form.querySelectorAll("[required]").forEach(function (f) {
        var ok = f.value.trim() !== "" && f.checkValidity();
        f.setAttribute("aria-invalid", ok ? "false" : "true");
        if (!ok && !invalid) invalid = f;
      });

      if (invalid) {
        if (status) {
          status.className = "form-status form-status--err";
          status.textContent = form.getAttribute("data-msg-invalid") || "";
          status.hidden = false;
        }
        invalid.focus();
        return;
      }

      var number = form.getAttribute("data-whatsapp-form");
      var lines = [];
      var intro = form.getAttribute("data-msg-intro");
      if (intro) lines.push(intro, "");

      form.querySelectorAll("[name]").forEach(function (f) {
        if (!f.value || f.type === "checkbox" && !f.checked) return;
        var label = form.querySelector('label[for="' + f.id + '"]');
        var text = f.tagName === "SELECT" && f.selectedOptions[0]
          ? f.selectedOptions[0].textContent.trim()
          : f.value.trim();
        lines.push((label ? label.textContent.replace("*", "").trim() + ": " : "") + text);
      });

      /* Record the submission before handing off. Deliberately not awaited:
         WhatsApp is the path the patient expects, and a slow or unreachable
         endpoint must never delay it or stop it opening. */
      try {
        if (window.LRForms) window.LRForms.send(window.LRForms.collect(form));
      } catch (err) { /* recording is best effort, never fatal */ }

      var url = "https://api.whatsapp.com/send?phone=" + number +
                "&text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");

      if (status) {
        status.className = "form-status form-status--ok";
        status.textContent = form.getAttribute("data-msg-sent") || "";
        status.hidden = false;
      }
    });
  });

  /* ---------------------------------------------------------------------
     Share row: copy link, and the Gemini question

     The copy button is rendered hidden and revealed here, because a button
     whose whole job is the clipboard is worse than absent when there is no
     script to run it. The Gemini link is a real link either way: the copy is
     an extra, so if the clipboard is unavailable the app still opens.
     --------------------------------------------------------------------- */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Older Safari and any non-secure origin land here.
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); }
      catch (err) { reject(err); }
      finally { document.body.removeChild(ta); }
    });
  }

  function flash(button, message) {
    var label = button.querySelector("span");
    if (!label) return;
    var original = label.textContent;
    label.textContent = message;
    button.classList.add("is-copied");
    window.setTimeout(function () {
      label.textContent = original;
      button.classList.remove("is-copied");
    }, 2000);
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-share-copy-item]"), function (item) {
    item.hidden = false;
  });

  document.addEventListener("click", function (event) {
    var copyBtn = event.target.closest ? event.target.closest("[data-share-copy]") : null;
    if (copyBtn) {
      event.preventDefault();
      var share = copyBtn.closest(".share");
      var done = (share && share.getAttribute("data-share-copied")) || "";
      copyText(copyBtn.getAttribute("data-share-copy")).then(function () {
        flash(copyBtn, done);
      }, function () { /* nothing copied; leave the label alone */ });
      return;
    }

    /* Gemini takes no question in its URL, so the question goes to the
       clipboard and the app opens in the new tab the anchor was going to open
       anyway. The copy is fire-and-forget: it must never block the navigation. */
    var ask = event.target.closest ? event.target.closest("[data-ask-copy]") : null;
    if (ask) {
      try { copyText(ask.getAttribute("data-ask-copy")); } catch (err) { /* best effort */ }
    }
  });
})();

/* YouTube testimonial facade. Kept in a separate appended initializer so the
   existing site behaviour above remains untouched. No YouTube resource is
   requested until the visitor activates the real button. */
(function () {
  "use strict";

  document.addEventListener("click", function (event) {
    var button = event.target.closest ? event.target.closest("[data-youtube-play]") : null;
    if (!button) return;

    var facade = button.closest("[data-youtube-facade]");
    if (!facade) return;

    var youtubeId = facade.getAttribute("data-youtube-id") || "";
    if (!/^[A-Za-z0-9_-]{6,20}$/.test(youtubeId)) return;

    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(youtubeId) + "?autoplay=1&mute=1&rel=0";
    iframe.title = facade.getAttribute("data-youtube-title") || "YouTube video";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.setAttribute("allowfullscreen", "");

    facade.replaceChildren(iframe);
    iframe.focus();
  });

  /* ---------------------------------------------------------------------
     Booking form: the consultation panel and the doctor's real days

     Two problems this solves. The "what the consultation includes" panel was
     hardcoded to nutrition, so someone booking a paediatric visit read a list
     about InBody. And the date field accepted any day, including days the
     chosen doctor does not attend, which turns into a phone call to unpick.

     Every specialty's panel is already in the page; this reveals the right
     one. The schedules ride on the doctor select as JSON, keyed by branch,
     using JS day numbers. With no script, the form still submits: WhatsApp is
     how this clinic really takes bookings.
     --------------------------------------------------------------------- */
  var bookingForm = document.getElementById("booking-specialty");
  if (bookingForm) {
    var specialtySel = document.getElementById("booking-specialty");
    var doctorSel = document.getElementById("booking-doctor");
    var branchSel = document.getElementById("booking-branch");
    var daySel = document.getElementById("booking-day");
    var dayHint = document.querySelector("[data-day-hint]");
    var panelGroups = [
      document.querySelectorAll("[data-consultation-includes]"),
      document.querySelectorAll("[data-clinic-hours]")
    ];

    var schedules = {};
    try { schedules = JSON.parse(doctorSel.getAttribute("data-schedules") || "{}"); }
    catch (err) { schedules = {}; }

    var isArabic = document.documentElement.getAttribute("lang") === "ar";
    var DAY_NAMES = isArabic
      ? ["الأحد", "الاتنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
      : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    function showPanel(slug) {
      panelGroups.forEach(function (panels) {
        var matched = false;
        Array.prototype.forEach.call(panels, function (panel) {
          var mine = panel.getAttribute("data-specialty") === slug;
          panel.hidden = !mine;
          if (mine) matched = true;
        });
        // an unknown or empty choice falls back to the first panel rather than
        // leaving the reader with a blank card
        if (!matched && panels.length) {
          Array.prototype.forEach.call(panels, function (panel, i) { panel.hidden = i !== 0; });
        }
      });
    }

    function allowedDays() {
      var doctor = doctorSel && doctorSel.value;
      if (!doctor || !schedules[doctor]) return null;      // any available doctor
      var byBranch = schedules[doctor];
      var branch = branchSel && branchSel.value;
      if (branch && byBranch[branch]) return byBranch[branch];
      // no branch chosen yet: offer every day this doctor works anywhere
      var all = [];
      Object.keys(byBranch).forEach(function (key) {
        byBranch[key].forEach(function (d) { if (all.indexOf(d) === -1) all.push(d); });
      });
      return all.length ? all : null;
    }

    function describe(days) {
      var names = days.map(function (d) { return DAY_NAMES[d]; });
      if (names.length === 1) return names[0];
      return names.slice(0, -1).join("، ") + (isArabic ? " و" : " and ") + names[names.length - 1];
    }

    function refreshDay() {
      var days = allowedDays();
      if (daySel) daySel.min = new Date().toISOString().slice(0, 10);
      if (!dayHint) return;
      if (!days) {
        dayHint.textContent = isArabic
          ? "اختار الطبيب الأول عشان نعرضلك أيام عيادته."
          : "Choose a doctor and we will show you their clinic days.";
      } else {
        dayHint.textContent = (isArabic ? "أيام العيادة: " : "Clinic days: ") + describe(days);
      }
      validateDay();
    }

    function validateDay() {
      if (!daySel || !daySel.value) { daySel && daySel.setCustomValidity(""); return; }
      var days = allowedDays();
      var chosen = new Date(daySel.value + "T00:00:00");
      if (chosen < new Date(new Date().toDateString())) {
        daySel.setCustomValidity(isArabic ? "التاريخ ده عدّى." : "That date has passed.");
      } else if (days && days.indexOf(chosen.getDay()) === -1) {
        daySel.setCustomValidity(isArabic
          ? "الطبيب مش موجود اليوم ده. أيام العيادة: " + describe(days)
          : "The doctor does not attend on that day. Clinic days: " + describe(days));
      } else {
        daySel.setCustomValidity("");
      }
      if (dayHint) {
        dayHint.classList.toggle("field__hint--error", !daySel.checkValidity());
        if (!daySel.checkValidity()) dayHint.textContent = daySel.validationMessage;
      }
    }

    if (specialtySel) {
      specialtySel.addEventListener("change", function () { showPanel(specialtySel.value); });
      if (specialtySel.value) showPanel(specialtySel.value);
    }
    if (doctorSel) doctorSel.addEventListener("change", refreshDay);
    if (branchSel) branchSel.addEventListener("change", refreshDay);
    if (daySel) daySel.addEventListener("change", validateDay);
    refreshDay();
  }
})();

  /* ---------------------------------------------------------------------
     Egyptian mobile numbers

     The number IS the booking: if it is wrong there is no way to chase the
     patient, so this is the one field worth checking properly. It is checked
     here rather than with an HTML pattern because people type real numbers
     the way they read them - "010 4066 1893", "+20 106...", "0020106..." -
     and a pattern strict enough to be worth having would reject every one of
     those. Normalising to digits first accepts what people actually type and
     still catches a number that could not be an Egyptian mobile.

     setCustomValidity is used so the existing submit handler, which already
     walks the required fields calling checkValidity(), picks this up without
     needing to know the rule.
     --------------------------------------------------------------------- */
  document.querySelectorAll("[data-eg-mobile]").forEach(function (input) {
    var ar = (document.documentElement.lang || "ar").indexOf("ar") === 0;
    var hint = document.getElementById(input.getAttribute("aria-describedby"));
    var hintText = hint ? hint.textContent : "";
    var BAD = ar ? "الرقم ده مش شكل رقم موبايل مصري. اكتبه كده: 01000000000"
                 : "That is not an Egyptian mobile number. Enter it like 01000000000";

    function normalise(value) {
      var d = String(value).replace(/\D/g, "");
      /* Reduce every way of writing the country code to the national form:
         +20, 0020, 020 and a bare 20 all mean the same number. Stripping the
         20 leaves it starting at the "1", so the leading zero has to be put
         back or a perfectly good number is rejected. A national number cannot
         begin "020", and a Cairo landline "02..." does not match either, so
         nothing legitimate is caught by this. */
      d = d.replace(/^(?:00|0)?20/, "");
      if (d.charAt(0) === "1") d = "0" + d;
      return d;
    }

    function check() {
      var raw = input.value.trim();
      if (!raw) { input.setCustomValidity(""); return show(false); }
      var d = normalise(raw);
      var ok = /^01[0125]\d{8}$/.test(d);
      input.setCustomValidity(ok ? "" : BAD);
      show(!ok);
    }

    function show(bad) {
      if (!hint) return;
      hint.textContent = bad ? BAD : hintText;
      hint.className = bad ? "field__hint field__hint--error" : "field__hint";
      input.setAttribute("aria-invalid", bad ? "true" : "false");
    }

    /* While typing, only ever clear an error - telling someone their number is
       wrong at the third digit is just noise. The real check lands on blur. */
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") check();
      else input.setCustomValidity("");
    });
    input.addEventListener("blur", check);
    if (input.form) input.form.addEventListener("submit", check);
  });
