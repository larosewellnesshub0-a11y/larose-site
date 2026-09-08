/* Record form submissions alongside the WhatsApp hand-off.
   ---------------------------------------------------------------------------
   The WhatsApp flow is the primary path and must never be delayed or broken by
   this file: everything here is fire-and-forget, wrapped in try/catch, and does
   nothing at all when no endpoint is configured.

   Two destinations, either of which may be absent:
     * the Apps Script Web App named in content/site.json → integrations.formsEndpoint
     * the local dashboard server, but only while previewing from localhost

   Nothing on the page tells the reader any of this is happening. */
(function () {
  "use strict";

  var root = document.documentElement;
  var ENDPOINT = (root.getAttribute("data-forms-endpoint") || "").trim();
  var QUEUE_KEY = "lr_form_queue";
  var isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  function store(get, set) {
    // storage throws outright in some privacy modes, not just returns null
    try { return get(); } catch (e) { return set === undefined ? null : undefined; }
  }

  function readQueue() {
    return store(function () {
      return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    }) || [];
  }

  function writeQueue(list) {
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(list.slice(-25))); } catch (e) {}
  }

  /* Apps Script cannot answer a CORS preflight, and a preflight is exactly what
     an application/json content type triggers. text/plain is a "simple request"
     so the browser sends it straight through. The script parses the body as
     JSON regardless. Do not "fix" this to application/json. */
  function postRemote(payload) {
    if (!ENDPOINT) return Promise.resolve(false);
    return fetch(ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(function () { return true; }).catch(function () { return false; });
  }

  function postLocal(payload) {
    if (!isLocal) return Promise.resolve(false);
    return fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.ok; }).catch(function () { return false; });
  }

  function send(payload) {
    // no-cors responses are opaque, so a resolved promise is the only signal
    // available. Treat a rejection as "retry later" and never block the user.
    return Promise.all([postRemote(payload), postLocal(payload)])
      .then(function (r) {
        if (ENDPOINT && !r[0]) {
          var q = readQueue();
          q.push(payload);
          writeQueue(q);
        }
      })
      .catch(function () {});
  }

  function flushQueue() {
    var q = readQueue();
    if (!q.length || !ENDPOINT) return;
    writeQueue([]);
    q.forEach(function (item) { postRemote(item); });
  }

  /* Reads a submitted form into the field names the sheet expects. Falls back
     to the visible label text so a field the map does not know about still
     lands in the free-text Message column rather than being dropped. */
  var MAP = {
    name: "name", fullname: "name", "full-name": "name",
    phone: "phone", tel: "phone", mobile: "phone",
    specialty: "specialty", speciality: "specialty", service: "specialty",
    doctor: "doctor",
    branch: "branch",
    day: "preferredDay", date: "preferredDay", "preferred-day": "preferredDay",
    time: "preferredTime", "preferred-time": "preferredTime",
    notes: "message", message: "message", note: "message", area: "message"
  };

  function collect(form) {
    var touch = {};
    var first = {};
    try { touch = JSON.parse(sessionStorage.getItem("lr_touch") || "{}"); } catch (e) {}
    try {
      var storedFirst = JSON.parse(localStorage.getItem("lr_first_touch") || "{}");
      if (!storedFirst.expiresAt || storedFirst.expiresAt > Date.now()) first = storedFirst;
    } catch (e) {}
    var clickId = touch.fbclid ? "fb:" + touch.fbclid
      : touch.gclid ? "g:" + touch.gclid
      : touch.ttclid ? "tt:" + touch.ttclid : "";
    var mobile = false;
    try { mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || matchMedia("(max-width: 767px)").matches; } catch (e) {}
    var out = {
      source: form.getAttribute("data-form-source") || "website",
      language: root.getAttribute("lang") || "",
      pageUrl: location.href,
      utmSource: touch.utm_source || "",
      utmMedium: touch.utm_medium || "",
      utmCampaign: touch.utm_campaign || "",
      utmContent: touch.utm_content || "",
      utmTerm: touch.utm_term || "",
      clickId: clickId,
      landingPage: touch.landingPage || "",
      referrer: touch.referrer || "",
      device: mobile ? "mobile" : "desktop",
      firstTouchSource: [first.utm_source, first.utm_campaign].filter(Boolean).join("/")
    };
    var extra = [];

    form.querySelectorAll("[name]").forEach(function (f) {
      if (!f.value) return;
      if (f.type === "checkbox" && !f.checked) return;
      var value = f.tagName === "SELECT" && f.selectedOptions[0]
        ? f.selectedOptions[0].textContent.trim()
        : String(f.value).trim();
      if (!value) return;

      var key = MAP[String(f.name).toLowerCase()];
      if (key && !out[key]) {
        out[key] = value;
      } else {
        var label = f.id && form.querySelector('label[for="' + f.id + '"]');
        extra.push((label ? label.textContent.replace("*", "").trim() + ": " : "") + value);
      }
    });

    if (extra.length) {
      out.message = out.message ? out.message + "\n" + extra.join("\n") : extra.join("\n");
    }
    return out;
  }

  window.LRForms = { collect: collect, send: send };

  document.addEventListener("DOMContentLoaded", function () {
    try { flushQueue(); } catch (e) {}
  });
})();
