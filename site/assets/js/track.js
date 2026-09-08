/* La Rose event tracking and campaign attribution. Dependency-free. */
(function () {
  "use strict";

  var KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "ttclid"];
  var lang = document.documentElement.getAttribute("lang") || "";

  function read(storage, key) {
    try { return JSON.parse(storage.getItem(key) || "null"); } catch (e) { return null; }
  }
  function write(storage, key, value) {
    try { storage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function captureTouch() {
    var query = new URLSearchParams(location.search);
    var existing = read(sessionStorage, "lr_touch") || {};
    var touch = {};
    KEYS.forEach(function (key) { touch[key] = query.get(key) || existing[key] || ""; });
    touch.landingPage = existing.landingPage || location.href;
    touch.referrer = existing.referrer || document.referrer || "";
    write(sessionStorage, "lr_touch", touch);

    var first = read(localStorage, "lr_first_touch");
    if (!first || !first.expiresAt || first.expiresAt <= Date.now()) {
      first = Object.assign({}, touch, { expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 });
      write(localStorage, "lr_first_touch", first);
    }
    return touch;
  }
  var touch = captureTouch();

  function event(name, params) {
    params = params || {};
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, params));
    try { if (typeof window.gtag === "function") window.gtag("event", name, params); } catch (e) {}
    try {
      if (typeof window.fbq === "function") {
        window.fbq("trackCustom", name, params);
        if (name === "booking_submit") window.fbq("track", "Lead");
        if (name === "whatsapp_click" || name === "call_click") window.fbq("track", "Contact");
      }
    } catch (e) {}
    try {
      if (window.ttq && typeof window.ttq.track === "function") {
        var ttName = name === "booking_submit" ? "SubmitForm"
          : (name === "whatsapp_click" || name === "call_click") ? "Contact" : name;
        window.ttq.track(ttName, params);
      }
    } catch (e) {}
    try { if (typeof window.clarity === "function") window.clarity("event", name); } catch (e) {}
  }
  window.LRTrack = { event: event };

  function locationName(el) {
    var tracked = el.closest("[data-track]");
    if (tracked && tracked.getAttribute("data-track")) return tracked.getAttribute("data-track");
    var section = el.closest("section[id]");
    return section ? section.id : "page";
  }
  function isWhatsApp(url) { return /(^|\.)(api\.whatsapp\.com|wa\.me|whatsapp\.com)$/i.test(url.hostname); }
  function tokenPart(value) { return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function attributeWhatsApp(link, url) {
    if (!touch.utm_source && !touch.utm_campaign) return;
    var token = ("[LR-" + tokenPart(touch.utm_source) + "-" + tokenPart(touch.utm_campaign) + "]").slice(0, 39) + "]";
    token = token.replace(/\]\]$/, "]");
    var current = url.searchParams.get("text") || "أهلاً، عايز أحجز كشف";
    if (current.indexOf(token) === -1) url.searchParams.set("text", current + "\n" + token);
    link.href = url.toString();
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest("a[href]");
    if (!link) return;
    var url;
    try { url = new URL(link.href, location.href); } catch (err) { return; }
    var host = url.hostname.toLowerCase();
    if (isWhatsApp(url)) {
      attributeWhatsApp(link, url);
      event("whatsapp_click", { location: locationName(link), page: location.pathname, lang: lang });
    }
    if (url.protocol === "tel:") event("call_click", { location: locationName(link), page: location.pathname, lang: lang });
    if (link.hasAttribute("hreflang") && link.closest("header, .utility-bar, .drawer")) event("language_switch", { to: link.getAttribute("hreflang") });
    if (link.getAttribute("data-track") === "recipe-guide" || /^\/RecipeGuide\/(?:free\/)?$/i.test(url.pathname)) {
      event("recipe_guide_cta", { target: /\/free\/$/i.test(url.pathname) ? "free" : "landing" });
    }
    var networks = { "instagram.com": "instagram", "youtube.com": "youtube", "youtu.be": "youtube", "linktr.ee": "linktree", "facebook.com": "facebook", "tiktok.com": "tiktok" };
    Object.keys(networks).some(function (domain) {
      if (host === domain || host.endsWith("." + domain)) { event("social_click", { network: networks[domain] }); return true; }
      return false;
    });
    if (host === "maps.app.goo.gl" || /(^|\.)google\.[^/]+$/.test(host) && /\/maps/.test(url.pathname)) {
      event("directions_click", { branch: link.getAttribute("data-branch") || locationName(link) });
    }
  });

  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form || form.tagName !== "FORM") return;
    var source = form.getAttribute("data-form-source") || "website";
    if (source === "booking") {
      var value = function (name) { var el = form.elements[name]; return el ? el.value : ""; };
      event("booking_submit", { specialty: value("specialty"), branch: value("branch") });
    } else event("form_submit", { source: source });
  });

  document.addEventListener("lr:tool-result", function (e) { event("tool_used", { tool: e.detail && e.detail.tool || "unknown" }); });
  var sent = {};
  function depth() {
    var doc = document.documentElement;
    var max = Math.max(doc.scrollHeight - innerHeight, 1);
    var pct = Math.min(100, Math.round((scrollY / max) * 100));
    [25, 50, 75, 100].forEach(function (mark) { if (pct >= mark && !sent[mark]) { sent[mark] = true; event("scroll_depth", { percent: mark }); } });
  }
  addEventListener("scroll", depth, { passive: true });
  addEventListener("load", depth);
})();
