(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) =>
    String(v ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const b = (ar, en) =>
    `${esc(ar)} <small lang="en" dir="ltr">${esc(en)}</small>`;
  const STORE = {
    token: "lr_dash_leads_token",
    cache: "lr_dash_leads_cache",
    checks: "lr_dash_media_checklists",
  };
  const HEADERS = [
    "Timestamp",
    "Source",
    "Name",
    "Phone",
    "Specialty",
    "Doctor",
    "Branch",
    "Preferred day",
    "Preferred time",
    "Message",
    "Language",
    "Page URL",
    "Status",
    "Notes",
    "UTM source",
    "UTM medium",
    "UTM campaign",
    "UTM content",
    "UTM term",
    "Click ID",
    "Landing page",
    "Referrer",
    "Device",
    "First touch",
  ];
  const state = {
    leads: [],
    loaded: false,
    loading: false,
    error: "",
    updatedAt: "",
    range: "30",
    tab: "utm",
    campaignSort: "leads",
    pages: [],
    pagesLoaded: false,
    bridge: null,
    filters: { q: "", status: "", source: "", specialty: "", branch: "" },
  };

  function endpoint() {
    return (
      state.bridge?.content?.["site.json"]?.integrations?.formsEndpoint || ""
    );
  }
  function index(headers, name) {
    return headers.findIndex(
      (h) => String(h).trim().toLowerCase() === name.toLowerCase(),
    );
  }
  function normalise(payload) {
    const headers = payload.headers || HEADERS;
    return (payload.rows || []).map((row, i) => {
      const get = (name) => {
        const n = index(headers, name);
        return n < 0 ? "" : String(row[n] ?? "");
      };
      return {
        row: i + 2,
        timestamp: get("Timestamp"),
        source: get("Source"),
        name: get("Name"),
        phone: get("Phone"),
        specialty: get("Specialty"),
        doctor: get("Doctor"),
        branch: get("Branch"),
        preferredDay: get("Preferred day"),
        preferredTime: get("Preferred time"),
        message: get("Message"),
        language: get("Language"),
        pageUrl: get("Page URL"),
        status: get("Status") || "new",
        notes: get("Notes"),
        utmSource: get("UTM source"),
        utmMedium: get("UTM medium"),
        utmCampaign: get("UTM campaign"),
        device: get("Device"),
        landingPage: get("Landing page"),
        local: false,
      };
    });
  }
  function cacheRead() {
    try {
      const x = JSON.parse(localStorage.getItem(STORE.cache) || "null");
      if (x?.leads) {
        state.leads = x.leads;
        state.updatedAt = x.updatedAt || x.cachedAt;
        state.loaded = true;
      }
    } catch {}
  }
  function cacheWrite() {
    try {
      localStorage.setItem(
        STORE.cache,
        JSON.stringify({
          leads: state.leads,
          updatedAt: state.updatedAt,
          cachedAt: new Date().toISOString(),
        }),
      );
    } catch {}
  }
  async function refreshLeads() {
    if (state.loading) return;
    const url = endpoint(),
      token = localStorage.getItem(STORE.token) || "";
    if (!url) {
      state.error = "no-endpoint";
      return rerender();
    }
    if (!token) {
      state.error = "no-token";
      return rerender();
    }
    state.loading = true;
    state.error = "";
    rerender();
    try {
      const r = await fetch(
        `${url}${url.includes("?") ? "&" : "?"}action=leads&token=${encodeURIComponent(token)}`,
      );
      if (!r.ok)
        throw new Error(
          r.status === 401 || r.status === 403
            ? "unauthorised"
            : `HTTP ${r.status}`,
        );
      const data = await r.json();
      if (!data.ok) throw new Error(data.error || "unauthorised");
      let leads = normalise(data);
      if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
        try {
          const local = await fetch("/api/submissions").then((x) => x.json());
          leads = leads.concat(
            (local.items || []).map((x, i) => ({
              row: null,
              timestamp: x.receivedAt,
              source: "local-preview",
              name: x.name || "",
              phone: x.phone || "",
              specialty: x.specialty || "",
              doctor: x.doctor || "",
              branch: x.branch || "",
              preferredDay: x.preferredDay || "",
              preferredTime: x.preferredTime || "",
              message: x.message || "",
              language: x.language || "",
              pageUrl: x.pageUrl || "",
              status: x.status || "new",
              notes: "",
              utmSource: "",
              utmMedium: "",
              utmCampaign: "",
              device: "",
              local: true,
              id: `local-${i}`,
            })),
          );
        } catch {}
      }
      state.leads = leads.sort(
        (a, z) => Date.parse(z.timestamp) - Date.parse(a.timestamp),
      );
      state.updatedAt = data.updatedAt || new Date().toISOString();
      state.loaded = true;
      cacheWrite();
    } catch (e) {
      state.error = /unauthor/i.test(e.message) ? "unauthorised" : "network";
    } finally {
      state.loading = false;
      rerender();
    }
  }
  function cutoff() {
    if (state.range === "all") return 0;
    return Date.now() - Number(state.range) * 864e5;
  }
  function filtered() {
    const q = state.filters.q.toLowerCase(),
      cut = cutoff();
    return state.leads.filter(
      (x) =>
        (!cut || Date.parse(x.timestamp) >= cut) &&
        (!q || Object.values(x).join(" ").toLowerCase().includes(q)) &&
        (!state.filters.status || x.status === state.filters.status) &&
        (!state.filters.source || x.source === state.filters.source) &&
        (!state.filters.specialty || x.specialty === state.filters.specialty) &&
        (!state.filters.branch || x.branch === state.filters.branch),
    );
  }
  const uniq = (key) =>
    [...new Set(state.leads.map((x) => x[key]).filter(Boolean))].sort();
  function optionFilter(key, ar, en) {
    return `<label>${b(ar, en)}<select data-lead-filter="${key}"><option value="">${b("الكل", "All")}</option>${uniq(
      key,
    )
      .map(
        (v) =>
          `<option ${state.filters[key] === v ? "selected" : ""}>${esc(v)}</option>`,
      )
      .join("")}</select></label>`;
  }
  function timeText(value) {
    const d = new Date(value);
    if (!Number.isFinite(d.valueOf())) return esc(value);
    const mins = Math.round((Date.now() - d) / 60000);
    const rel =
      mins < 60
        ? `${mins}m`
        : mins < 1440
          ? `${Math.floor(mins / 60)}h`
          : `${Math.floor(mins / 1440)}d`;
    return `<span title="${esc(new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Cairo" }).format(d))}">${rel}</span>`;
  }
  function waPhone(v) {
    let n = String(v).replace(/\D/g, "");
    if (n.startsWith("0")) n = "20" + n.slice(1);
    return n;
  }
  function emptyState() {
    const map = {
      "no-endpoint": [
        "رابط النماذج غير مضبوط",
        "Add integrations.formsEndpoint in Settings.",
      ],
      "no-token": [
        "الصق رمز القراءة في الإعدادات",
        "Paste the read token in Settings → Integrations.",
      ],
      unauthorised: [
        "رمز القراءة مرفوض",
        "Check the token and Apps Script deployment.",
      ],
      network: [
        "تعذر تحديث البيانات؛ آخر نسخة محفوظة ظاهرة",
        "Check the network, then press Refresh.",
      ],
    };
    const m = map[state.error];
    return m
      ? `<div class="growth-empty" role="alert"><strong>${esc(m[0])}</strong><small lang="en" dir="ltr">${esc(m[1])}</small></div>`
      : "";
  }
  function controls() {
    return `<div class="growth-toolbar"><label>${b("الفترة", "Range")}<select data-range>${[7, 30, 90, "all"].map((v) => `<option value="${v}" ${String(v) === state.range ? "selected" : ""}>${v === "all" ? "All" : v + " days"}</option>`).join("")}</select></label><button class="admin-btn admin-btn--quiet" data-growth="refresh-leads">${b("تحديث", "Refresh")}</button><span>${b("آخر تحديث", "Last updated")}: ${esc(state.updatedAt ? new Date(state.updatedAt).toLocaleString("en-GB", { timeZone: "Africa/Cairo" }) : "—")}</span></div>`;
  }
  function renderLeads() {
    const rows = filtered();
    return `<div class="view-head"><div><h2>${b("العملاء والحجوزات", "Leads & bookings")}</h2><p>متابعة طلبات الموقع والحملات في مكان واحد. <span class="english-copy" lang="en">Track website and campaign enquiries.</span></p></div></div>${controls()}${emptyState()}<section class="admin-panel"><div class="lead-filters"><label>${b("بحث", "Search")}<input type="search" data-lead-filter="q" value="${esc(state.filters.q)}"></label>${optionFilter("status", "الحالة", "Status")}${optionFilter("source", "المصدر", "Source")}${optionFilter("specialty", "التخصص", "Specialty")}${optionFilter("branch", "الفرع", "Branch")}<button class="admin-btn admin-btn--accent" data-growth="export-csv">${b("تصدير CSV", "Export CSV")}</button></div><div class="lead-table table-scroll"><table><thead><tr>${["الوقت · Time", "الاسم والهاتف · Contact", "الطلب · Request", "المصدر · Source", "الحالة والملاحظات · Status & notes", "الصفحة · Page"].map((x) => `<th>${esc(x)}</th>`).join("")}</tr></thead><tbody>${rows.map((x, i) => `<tr data-lead-card><td>${timeText(x.timestamp)}</td><td><strong>${esc(x.name || "—")}</strong><div><a href="tel:${esc(x.phone)}">${esc(x.phone)}</a> <a class="admin-btn admin-btn--sm" href="https://wa.me/${waPhone(x.phone)}" target="_blank" rel="noopener">WA</a></div></td><td>${esc([x.specialty, x.branch, x.preferredDay, x.preferredTime].filter(Boolean).join(" · ") || "—")}</td><td>${esc([x.utmSource || x.source, x.utmMedium, x.utmCampaign].filter(Boolean).join(" · ") || "—")}<small>${esc(x.device)}</small></td><td><select data-lead-status="${i}" data-row="${x.row || ""}" ${x.local ? "disabled" : ""}>${["new", "contacted", "booked", "no-answer", "lost"].map((s) => `<option ${x.status === s ? "selected" : ""}>${s}</option>`).join("")}</select><input data-lead-notes="${i}" data-row="${x.row || ""}" value="${esc(x.notes)}" placeholder="Notes" ${x.local ? "disabled" : ""}></td><td><a href="${esc(x.pageUrl || "#")}" title="${esc(x.pageUrl)}" target="_blank">${esc((x.pageUrl || "—").replace(/^https?:\/\/[^/]+/, "").slice(0, 32))}</a></td></tr>`).join("")}</tbody></table></div>${rows.length ? "" : `<p class="growth-empty">${b("لا توجد نتائج مطابقة", "No matching leads")}</p>`}</section>`;
  }

  function counts(key, leads = filtered()) {
    const m = {};
    leads.forEach((x) => {
      const v = x[key] || "(none)";
      m[v] = (m[v] || 0) + 1;
    });
    return Object.entries(m).sort((a, z) => z[1] - a[1]);
  }
  function bars(title, key) {
    const rows = counts(key).slice(0, 8),
      max = Math.max(1, ...rows.map((x) => x[1]));
    return `<article class="analytics-card"><h3>${esc(title)}</h3><svg class="growth-chart" viewBox="0 0 600 ${Math.max(100, rows.length * 42 + 25)}" role="img" aria-label="${esc(title)}">${rows.map(([n, v], i) => `<text x="5" y="${i * 42 + 22}">${esc(n.slice(0, 24))}</text><rect x="180" y="${i * 42 + 6}" width="${(360 * v) / max}" height="24" rx="4"></rect><text x="${190 + (360 * v) / max}" y="${i * 42 + 23}">${v}</text>`).join("")}</svg><div class="visually-hidden"><table><caption>${esc(title)}</caption>${rows.map((x) => `<tr><th>${esc(x[0])}</th><td>${x[1]}</td></tr>`).join("")}</table></div></article>`;
  }
  function renderLeadAnalytics() {
    const leads = filtered(),
      total = leads.length,
      contacted = leads.filter((x) =>
        ["contacted", "booked"].includes(x.status),
      ).length,
      booked = leads.filter((x) => x.status === "booked").length;
    const cells = Array.from({ length: 168 }, () => 0);
    leads.forEach((x) => {
      const d = new Date(x.timestamp);
      if (Number.isFinite(d.valueOf())) {
        const parts = new Intl.DateTimeFormat("en", {
          timeZone: "Africa/Cairo",
          weekday: "short",
          hour: "numeric",
          hourCycle: "h23",
        }).formatToParts(d);
        const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
          parts.find((p) => p.type === "weekday")?.value,
        );
        const h = Number(parts.find((p) => p.type === "hour")?.value);
        if (wd >= 0) cells[wd * 24 + h]++;
      }
    });
    const mx = Math.max(1, ...cells);
    return `<section class="lead-analytics">
      <div class="analytics-section-head">
        <h2>${b("تحليلات العملاء", "Lead analytics")}</h2>
        ${controls()}
      </div>
      <div class="analytics-grid">
        ${dailyLeadsChart(leads)}
        <article class="analytics-card">
          <h3>${b("مسار التحويل", "Funnel")}</h3>
          <div class="funnel">
            <div style="--w:100%">${total} total</div>
            <div style="--w:${total ? (contacted / total) * 100 : 0}%">
              ${contacted} contacted
            </div>
            <div style="--w:${total ? (booked / total) * 100 : 0}%">
              ${booked} booked
            </div>
          </div>
        </article>
        ${bars("By source", "utmSource")}
        ${bars("By campaign", "utmCampaign")}
        ${bars("By specialty", "specialty")}
        ${bars("By branch", "branch")}
        <article class="analytics-card analytics-card--wide">
          <h3>${b("وقت وصول العملاء", "Weekday × hour heatmap")}</h3>
          <div class="heatmap" aria-label="Lead arrival heatmap">
            ${cells
              .map((v, i) => `<span title="day ${Math.floor(i / 24) + 1},
                ${i % 24}:00 — ${v}" style="--heat:${v / mx}"></span>`)
              .join("")}
          </div>
        </article>
        ${bars("Language split", "language")}
        ${bars("Device split", "device")}
      </div>
    </section>`;
  }

  function cairoDate(value) {
    const date = new Date(value);
    if (!Number.isFinite(date.valueOf())) return "";
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Cairo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  }

  function dailyLeadsChart(leads) {
    const totals = new Map();
    leads.forEach((lead) => {
      const day = cairoDate(lead.timestamp);
      if (day) totals.set(day, (totals.get(day) || 0) + 1);
    });
    const rows = [...totals.entries()].sort(([a], [z]) => a.localeCompare(z));
    const max = Math.max(1, ...rows.map(([, value]) => value));
    const width = Math.max(600, rows.length * 34 + 60);
    const barsHtml = rows.map(([day, value], index) => {
      const height = (180 * value) / max;
      const x = 40 + index * 34;
      return `<rect x="${x}" y="${215 - height}" width="22"
        height="${height}" rx="3"><title>${day}: ${value}</title></rect>`;
    }).join("");
    const table = rows.map(([day, value]) =>
      `<tr><th scope="row">${day}</th><td>${value}</td></tr>`,
    ).join("");
    return `<article class="analytics-card analytics-card--wide lead-daily">
      <h3>${b("العملاء كل يوم", "Leads per day")}</h3>
      <svg class="growth-chart" viewBox="0 0 ${width} 240" role="img"
        aria-label="Leads per day in Cairo time">
        <line x1="35" y1="215" x2="${width - 10}" y2="215"></line>
        ${barsHtml}
      </svg>
      <div class="visually-hidden"><table>
        <caption>Leads per day in Cairo time</caption>
        <tbody>${table}</tbody>
      </table></div>
    </article>`;
  }

  const tabs = [
    ["utm", "UTM builder", "منشئ UTM"],
    ["wa", "WhatsApp links", "روابط واتساب"],
    ["landing", "Landing pages", "صفحات الهبوط"],
    ["copy", "Ad copy bank", "بنك نصوص الإعلانات"],
    ["events", "Events & pixels", "الأحداث والبكسلات"],
    ["checks", "Checklists", "قوائم المراجعة"],
  ];
  function renderMedia() {
    return `<div class="view-head"><div><h2>${b("أدوات شراء الإعلانات", "Media buying")}</h2></div></div><div class="settings-tabs" role="tablist">${tabs.map(([id, en, ar]) => `<button class="segment-btn ${state.tab === id ? "is-active" : ""}" role="tab" aria-selected="${state.tab === id}" data-growth="media-tab" data-tab="${id}">${b(ar, en)}</button>`).join("")}</div>${mediaPanel()}`;
  }
  function sitePages() {
    return state.pages.length
      ? state.pages
      : [
          "/ar/index.html",
          "/en/index.html",
          "/ar/booking.html",
          "/en/booking.html",
        ];
  }
  async function loadPages() {
    if (state.pagesLoaded) return;
    try {
      const xml = await fetch("/sitemap.xml").then((r) => r.text());
      state.pages = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    } catch {
      state.pages = [];
    }
    state.pagesLoaded = true;
    rerender();
  }
  function utmPanel() {
    return `<section class="admin-panel tool-grid"><div class="admin-field"><label>${b("صفحة الهبوط", "Landing page")}</label><select id="utm-url" aria-label="Landing page" dir="ltr">${sitePages()
      .map((x) => `<option>${esc(x)}</option>`)
      .join(
        "",
      )}</select></div><div class="admin-field"><label>${b("المنصة", "Preset")}</label><select id="utm-preset" aria-label="Platform preset"><option value="facebook|paid_social">Meta / Facebook</option><option value="instagram|paid_social">Instagram</option><option value="tiktok|paid_social">TikTok</option><option value="google|cpc">Google Ads</option><option value="snapchat|paid_social">Snapchat</option><option value="youtube|video">YouTube</option><option value="whatsapp|message">WhatsApp</option><option value="email|email">Email</option><option value="qr|offline">QR / print</option></select></div>${["campaign", "content", "term"].map((x) => `<label>${esc(x)}<input id="utm-${x}" dir="ltr"></label>`).join("")}<output id="utm-output" dir="ltr"></output><div id="utm-qr"></div><button class="admin-btn admin-btn--accent" data-growth="copy-utm">${b("نسخ الرابط", "Copy URL")}</button><button class="admin-btn" data-growth="save-campaign">${b("حفظ كحملة", "Save as campaign")}</button></section>`;
  }
  function waPanel() {
    const phone =
      state.bridge.content["site.json"]?.contact?.whatsapp?.display ||
      state.bridge.content["site.json"]?.whatsapp?.display ||
      "201040661893";
    return `<section class="admin-panel tool-grid"><label>${b("الرقم", "Number")}<input id="wa-number" value="${esc(phone)}" dir="ltr"></label><label>${b("الرسالة", "Message")}<textarea id="wa-message">أهلاً، عايز أحجز موعد في عيادات لاروز.</textarea></label><label>${b("مرجع اختياري", "Optional reference")}<input id="wa-ref" placeholder="[LR-source-campaign]" dir="ltr"></label><output id="wa-output" dir="ltr"></output><div id="wa-qr"></div><button class="admin-btn admin-btn--accent" data-growth="copy-wa">${b("نسخ الرابط", "Copy link")}</button></section>`;
  }
  function landingPanel() {
    return `<section class="admin-panel"><p>${b("اضغط على الصفحة لتحميل العنوان والوصف ونموذج الحجز عند الطلب.", "Expand a page to lazily inspect title, description and booking form.")}</p><div class="landing-list">${sitePages()
      .map(
        (u, i) =>
          `<details data-page-detail="${i}"><summary><span dir="ltr">${esc(u)}</span> ${/specialt|booking|recipe|\/ar\/?$|\/en\/?$/.test(u) ? '<span class="admin-badge">Recommended for ads</span>' : ""}</summary><div data-page-body>${b("افتح لتحميل البيانات", "Expand to load metadata")}</div></details>`,
      )
      .join("")}</div></section>`;
  }
  function copyPanel() {
    const specs = state.bridge.content["specialties.json"]?.specialties || [];
    const recipe = state.bridge.content["digital.json"]?.products?.find(
      (product) => product.slug === "recipe-book",
    );
    const items = specs.concat(recipe ? [recipe] : []);
    return `<section class="admin-panel">
      <p>${b(
        "مسودات محافظة مشتقة فقط من نص الموقع؛ راجعها قبل النشر.",
        "Conservative drafts derived only from site copy; review before use.",
      )}</p>
      <div class="copy-bank">
        ${items.map(adCopyCard).join("")}
      </div>
    </section>`;
  }

  function generatedAdCopy(item) {
    const name = item.name?.ar || item.slug;
    const short = item.short?.ar || item.intro?.ar || item.lede?.ar || "";
    const firstLine = short.split("\n")[0].slice(0, 125);
    return {
      headlines: [
        name.slice(0, 40),
        `احجز استشارتك في ${name}`.slice(0, 40),
        `اعرف أكتر عن ${name}`.slice(0, 40),
      ],
      primaryTexts: [firstLine, `${name}\nكلّمنا واعرف التفاصيل.`],
      descriptions: [`معلومات واضحة وخطوة مناسبة ليك.`],
      ctas: ["احجز موعد", "تواصل واتساب"],
      hashtags: ["#لاروز", "#صحتك", "#عيادات_لاروز", "#القاهرة", "#احجز_موعد"],
    };
  }

  function adCopyValue(slug, field, index, generated) {
    return state.bridge.content["campaigns.json"]?.adCopy?.[slug]?.[field]?.[index]
      ?? generated;
  }

  function adCopyLine(slug, field, index, generated, limit = 0) {
    const value = adCopyValue(slug, field, index, generated);
    const limitAttribute = limit ? `maxlength="${limit}"` : "";
    const control = field === "primaryTexts"
      ? `<textarea data-ad-copy data-slug="${esc(slug)}" data-field="${field}"
          data-i="${index}">${esc(value)}</textarea>`
      : `<input data-ad-copy data-slug="${esc(slug)}" data-field="${field}"
          data-i="${index}" ${limitAttribute} value="${esc(value)}">`;
    return `<div class="ad-copy-line">
      ${control}
      <span class="char-count" data-count-for="${esc(slug)}-${field}-${index}">
        ${limit ? `${String(value).length}/${limit}` : ""}
      </span>
      <button class="admin-btn admin-btn--sm" data-growth="copy-ad-line"
        data-slug="${esc(slug)}" data-field="${field}" data-i="${index}">
        ${b("نسخ", "Copy")}
      </button>
      <button class="admin-btn admin-btn--sm" data-growth="reset-ad-line"
        data-slug="${esc(slug)}" data-field="${field}" data-i="${index}">
        ${b("إعادة", "Reset")}
      </button>
    </div>`;
  }

  function adCopyCard(item) {
    const generated = generatedAdCopy(item);
    const groups = [
      ["headlines", generated.headlines, 40],
      ["primaryTexts", generated.primaryTexts, 0],
      ["descriptions", generated.descriptions, 0],
      ["ctas", generated.ctas, 0],
      ["hashtags", generated.hashtags, 0],
    ];
    return `<article data-ad-card="${esc(item.slug)}">
      <h3>${esc(item.name?.ar || item.slug)}</h3>
      ${groups.map(([field, values, limit]) => `
        <fieldset><legend>${esc(field)}</legend>
          ${values.map((value, index) =>
            adCopyLine(item.slug, field, index, value, limit),
          ).join("")}
        </fieldset>`).join("")}
      <button class="admin-btn admin-btn--accent" data-growth="copy-ad-all"
        data-slug="${esc(item.slug)}">${b("نسخ الكل", "Copy all")}</button>
    </article>`;
  }
  const events = [
    "whatsapp_click",
    "call_click",
    "booking_submit",
    "form_submit",
    "recipe_guide_cta",
    "social_click",
    "language_switch",
    "scroll_depth",
    "tool_used",
    "directions_click",
  ];
  function eventsPanel() {
    return `<section class="admin-panel"><button class="admin-btn" data-growth="tracking-check">${b("فحص التتبع", "Tracking check")}</button><div id="tracking-result"></div><div class="table-scroll"><table><thead><tr><th>Event</th><th>When / params</th><th>GA4</th><th>Meta</th><th>TikTok</th></tr></thead><tbody>${events.map((e) => `<tr><th><code>${e}</code></th><td>${e.includes("click") ? "link_url, placement" : "form/source/page"}</td><td>${e}</td><td>${e.includes("booking") ? "Lead" : "Custom"}</td><td>${e.includes("booking") ? "SubmitForm" : "Custom"}</td></tr>`).join("")}</tbody></table></div></section>`;
  }
  const checks = [
    ["GA4 key events", "https://analytics.google.com/"],
    [
      "Meta Pixel + Events Manager",
      "https://business.facebook.com/events_manager2",
    ],
    [
      "Meta Conversions API note",
      "https://developers.facebook.com/docs/marketing-api/conversions-api/",
    ],
    ["Search Console + sitemap", "https://search.google.com/search-console"],
    ["Microsoft Clarity", "https://clarity.microsoft.com/"],
    ["Google Business Profile", "https://business.google.com/"],
  ];
  function checksPanel() {
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(STORE.checks) || "{}");
    } catch {}
    return `<section class="admin-panel checklist">${checks.map(([n, u], i) => `<label><input type="checkbox" data-check="${i}" ${saved[i] ? "checked" : ""}> <span>${esc(n)}</span> <a href="${u}" target="_blank" rel="noopener">Open</a></label>`).join("")}</section>`;
  }
  function mediaPanel() {
    if (state.tab === "utm") return utmPanel();
    if (state.tab === "wa") return waPanel();
    if (state.tab === "landing") return landingPanel();
    if (state.tab === "copy") return copyPanel();
    if (state.tab === "events") return eventsPanel();
    return checksPanel();
  }

  function campaignMatches(campaign) {
    const expected = String(campaign.utmCampaign || campaign.utmSource || "")
      .trim()
      .toLowerCase();
    if (!expected) return [];
    const key = campaign.utmCampaign ? "utmCampaign" : "utmSource";
    return state.leads.filter((lead) =>
      String(lead[key] || "").trim().toLowerCase() === expected,
    );
  }

  function campaignMetrics(campaign) {
    const matches = campaignMatches(campaign);
    const contacted = matches.filter((lead) =>
      ["contacted", "booked"].includes(lead.status),
    ).length;
    const booked = matches.filter((lead) => lead.status === "booked").length;
    const budget = Number(campaign.budget) || 0;
    return {
      leads: matches.length,
      contacted,
      booked,
      cpl: matches.length ? budget / matches.length : null,
      cpb: booked ? budget / booked : null,
    };
  }

  function metricValue(value, currency = "") {
    if (value === null) return "—";
    return `${new Intl.NumberFormat("en-EG", {
      maximumFractionDigits: 2,
    }).format(value)}${currency ? ` ${currency}` : ""}`;
  }

  function campaignField(campaign, index, key, label, type = "text") {
    return `<label>${esc(label)}
      <input type="${type}" data-campaign-field="${key}" data-i="${index}"
        value="${esc(campaign[key] ?? "")}">
    </label>`;
  }

  function campaignCard(campaign, index) {
    const metrics = campaignMetrics(campaign);
    return `<article class="campaign-card">
      <div class="campaign-card__head">
        <h3>${esc(campaign.name || "New campaign")}</h3>
        <button class="icon-action" type="button" data-growth="campaign-remove"
          data-i="${index}" aria-label="Remove campaign">×</button>
      </div>
      <div class="campaign-metrics">
        <span><strong>${metrics.leads}</strong> Leads</span>
        <span><strong>${metrics.contacted}</strong> Contacted</span>
        <span><strong>${metrics.booked}</strong> Booked</span>
        <span><strong>${metricValue(metrics.cpl, campaign.currency)}</strong> CPL</span>
        <span><strong>${metricValue(metrics.cpb, campaign.currency)}</strong> CPB</span>
      </div>
      <div class="campaign-fields">
        ${campaignField(campaign, index, "id", "ID (slug)")}
        ${campaignField(campaign, index, "name", "Name")}
        ${campaignField(campaign, index, "platform", "Platform")}
        ${campaignField(campaign, index, "objective", "Objective")}
        <label>Status
          <select data-campaign-field="status" data-i="${index}">
            ${["planned", "active", "paused", "ended"].map((status) =>
              `<option ${campaign.status === status ? "selected" : ""}>
                ${status}</option>`,
            ).join("")}
          </select>
        </label>
        ${campaignField(campaign, index, "startDate", "Start date", "date")}
        ${campaignField(campaign, index, "endDate", "End date", "date")}
        ${campaignField(campaign, index, "budget", "Budget", "number")}
        ${campaignField(campaign, index, "currency", "Currency")}
        ${campaignField(campaign, index, "utmSource", "UTM source")}
        ${campaignField(campaign, index, "utmMedium", "UTM medium")}
        ${campaignField(campaign, index, "utmCampaign", "UTM campaign")}
        ${campaignField(campaign, index, "landingUrl", "Landing URL", "url")}
        ${campaignField(campaign, index, "audience", "Audience")}
        ${campaignField(campaign, index, "notes", "Notes")}
      </div>
    </article>`;
  }

  function renderCampaigns() {
    const file = state.bridge.content["campaigns.json"];
    const campaigns = file.campaigns || [];
    state.bridge.setEditorContext({
      file: "campaigns.json",
      root: file,
      mode: "campaigns",
    });
    const sorted = campaigns.map((campaign, index) => ({ campaign, index }));
    sorted.sort((a, z) => {
      const left = campaignMetrics(a.campaign)[state.campaignSort];
      const right = campaignMetrics(z.campaign)[state.campaignSort];
      return (right ?? Infinity) - (left ?? Infinity);
    });
    return `<div class="view-head">
      <div><h2>${b("الحملات", "Campaigns")}</h2></div>
      <button class="admin-btn admin-btn--primary" data-action="save-file"
        data-file="campaigns.json">${b("حفظ الملف", "Save file")}</button>
    </div>
    <div class="growth-toolbar">
      <button class="admin-btn admin-btn--accent" data-growth="campaign-add">
        ${b("إضافة حملة", "Add campaign")}
      </button>
      <label>${b("ترتيب حسب", "Sort by")}
        <select data-campaign-sort>
          ${["leads", "booked", "cpl"].map((key) =>
            `<option ${state.campaignSort === key ? "selected" : ""}>
              ${key.toUpperCase()}</option>`,
          ).join("")}
        </select>
      </label>
    </div>
    <section class="campaign-list">
      ${sorted.length
        ? sorted.map(({ campaign, index }) => campaignCard(campaign, index)).join("")
        : `<div class="growth-empty">${b(
          "مفيش حملات محفوظة. احفظ واحدة من منشئ UTM.",
          "No campaigns yet. Save one from the UTM builder.",
        )}</div>`}
    </section>`;
  }

  function renderTips() {
    const tips = state.bridge.content["tips.json"] || [];
    state.bridge.setEditorContext({
      file: "tips.json",
      root: tips,
      mode: "root-array",
    });
    return `<div class="view-head"><div><h2>${b("النصائح اليومية", "Daily tips")}</h2></div><button class="admin-btn admin-btn--primary" data-action="save-file" data-file="tips.json">${b("حفظ الملف", "Save file")}</button></div><section class="admin-panel"><button class="admin-btn admin-btn--accent" data-growth="tip-add">${b("إضافة نصيحة", "Add tip")}</button><div class="tips-editor">${tips.map((t, i) => `<article><div class="item-actions"><button data-growth="tip-move" data-i="${i}" data-d="-1" ${i ? "" : "disabled"}>↑</button><button data-growth="tip-move" data-i="${i}" data-d="1" ${i < tips.length - 1 ? "" : "disabled"}>↓</button><button data-growth="tip-remove" data-i="${i}">×</button></div><label>ID<input data-tip="id" data-i="${i}" value="${esc(t.id)}" pattern="[a-z0-9]+(?:-[a-z0-9]+)*"></label><label>العربية<textarea data-tip="ar" data-i="${i}">${esc(t.ar)}</textarea></label><label>English<textarea data-tip="en" data-i="${i}" dir="ltr">${esc(t.en)}</textarea></label></article>`).join("")}</div></section>`;
  }
  function rerender() {
    state.bridge?.render();
  }
  async function saveLead(el) {
    const i = Number(el.dataset.leadStatus ?? el.dataset.leadNotes),
      lead = filtered()[i];
    if (!lead?.row) return;
    const status = $(`[data-lead-status="${i}"]`)?.value || lead.status,
      notes = $(`[data-lead-notes="${i}"]`)?.value || lead.notes;
    lead.status = status;
    lead.notes = notes;
    const token = localStorage.getItem(STORE.token) || "";
    fetch(endpoint(), {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        action: "updateStatus",
        token,
        row: lead.row,
        status,
        notes,
      }),
    }).finally(() => setTimeout(refreshLeads, 2000));
  }
  function csv() {
    const rows = filtered(),
      keys = [
        "timestamp",
        "name",
        "phone",
        "specialty",
        "doctor",
        "branch",
        "preferredDay",
        "preferredTime",
        "source",
        "utmSource",
        "utmMedium",
        "utmCampaign",
        "device",
        "status",
        "notes",
        "pageUrl",
      ];
    const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const blob = new Blob(
      [
        "\uFEFF" +
          [
            keys.join(","),
            ...rows.map((r) => keys.map((k) => q(r[k])).join(",")),
          ].join("\r\n"),
      ],
      { type: "text/csv;charset=utf-8" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "larose-leads.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  function updateBuilders() {
    const url = $("#utm-url");
    if (url) {
      const [source, medium] = $("#utm-preset").value.split("|"),
        u = new URL(url.value, location.origin);
      u.searchParams.set("utm_source", source);
      u.searchParams.set("utm_medium", medium);
      ["campaign", "content", "term"].forEach((k) => {
        const v = $(`#utm-${k}`).value;
        if (v) u.searchParams.set(`utm_${k}`, v);
      });
      $("#utm-output").textContent = u.href;
      $("#utm-qr").innerHTML = window.LRQR?.svg(u.href) || "";
    }
    const wn = $("#wa-number");
    if (wn) {
      const u = `https://wa.me/${waPhone(wn.value)}?text=${encodeURIComponent($("#wa-message").value + ($("#wa-ref").value ? "\n" + $("#wa-ref").value : ""))}`;
      $("#wa-output").textContent = u;
      $("#wa-qr").innerHTML = window.LRQR?.svg(u) || "";
    }
  }
  async function pageDetail(d) {
    if (d.dataset.loaded) return;
    d.dataset.loaded = "1";
    const u = sitePages()[Number(d.dataset.pageDetail)];
    try {
      const html = await fetch(u).then((r) => r.text()),
        title = html.match(/<title>(.*?)<\/title>/is)?.[1] || "",
        desc =
          html.match(
            /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i,
          )?.[1] || "";
      d.querySelector("[data-page-body]").innerHTML =
        `<h3>${esc(title)}</h3><p>${esc(desc)}</p><p>${html.includes("data-form-source") ? "Has booking form" : "No booking form"}</p><button data-growth="copy-text" data-text="${esc(new URL(u, location.origin).href)}">Copy URL</button>`;
    } catch {
      d.querySelector("[data-page-body]").textContent = "Could not load page.";
    }
  }
  function render(section, bridge) {
    state.bridge = bridge;
    if (!state.loaded) cacheRead();
    if (section === "leads" && !state.loaded && !state.loading)
      setTimeout(refreshLeads, 0);
    if (section === "media-buying") setTimeout(loadPages, 0);
    if (section === "leads") return renderLeads();
    if (section === "media-buying") return renderMedia();
    if (section === "campaigns") return renderCampaigns();
    return renderTips();
  }
  function integrationPanel() {
    const token = localStorage.getItem(STORE.token) || "";
    const links = [
      ["GA4", "https://analytics.google.com/"],
      ["Clarity", "https://clarity.microsoft.com/"],
      ["Search Console", "https://search.google.com/search-console"],
      ["Meta Events", "https://business.facebook.com/events_manager2"],
      ["TikTok Ads", "https://ads.tiktok.com/"],
      ["Google Business", "https://business.google.com/"],
      ["Apps Script", "https://script.google.com/"],
      ["Bookings Sheet", "https://docs.google.com/spreadsheets/"],
    ];
    return `<section class="admin-panel integrations-panel"><h2>${b("التكاملات والقياس", "Integrations")}</h2><p>${b("رمز قراءة العملاء محفوظ في هذا المتصفح فقط ولا يدخل ملفات المشروع.", "The leads token stays only in this browser and is never written to the repository.")}</p><label>${b("رمز قراءة العملاء", "Leads read token")}<input id="leads-token" type="password" value="${esc(token)}" autocomplete="off"></label><button class="admin-btn" data-growth="test-endpoint">${b("اختبار الرابط", "Test endpoint")}</button><div id="endpoint-result" role="status"></div><div class="quick-links">${links.map(([n, u]) => `<a class="info-card" href="${u}" target="_blank" rel="noopener">${esc(n)}</a>`).join("")}</div></section>`;
  }
  function countsFrom(a, key) {
    const m = {};
    a.forEach((x) => {
      const v = x[key] || x.source || "(none)";
      m[v] = (m[v] || 0) + 1;
    });
    return Object.entries(m).sort((x, y) => y[1] - x[1]);
  }
  function overviewKpis() {
    const leads = state.leads,
      now = Date.now(),
      within = (n) =>
        leads.filter((x) => Date.parse(x.timestamp) >= now - n * 864e5),
      m30 = within(30),
      top = countsFrom(m30, "utmSource")[0]?.[0] || "—",
      tags = state.bridge.content["site.json"]?.integrations?.analytics || {};
    return `<section class="admin-panel"><div class="count-grid">${[
      ["عملاء اليوم", "Leads today", within(1).length],
      ["آخر 7 أيام", "Last 7 days", within(7).length],
      ["آخر 30 يوم", "Last 30 days", m30.length],
      ["جديد", "Pending", leads.filter((x) => x.status === "new").length],
      ["أعلى مصدر", "Top source 30d", top],
      ["محجوز", "Booked 30d", m30.filter((x) => x.status === "booked").length],
      ["صفحات", "Pages built", state.bridge.status?.pageCount ?? "—"],
      ["GA4", "Tracking", tags.ga4MeasurementId ? "Yes" : "No"],
      ["Clarity", "Tracking", tags.clarityProjectId ? "Yes" : "No"],
      ["Meta", "Tracking", tags.metaPixelId ? "Yes" : "No"],
      ["TikTok", "Tracking", tags.tiktokPixelId ? "Yes" : "No"],
    ]
      .map(
        (x) =>
          `<article class="metric-card"><strong class="metric-card__number">${esc(x[2])}</strong><span>${b(x[0], x[1])}</span></article>`,
      )
      .join("")}</div></section>`;
  }
  function afterRender(section) {
    if (section === "analytics") {
      const host = $(".view-head");
      if (host && !$(".lead-analytics"))
        host.insertAdjacentHTML("afterend", renderLeadAnalytics());
    }
    if (section === "overview") {
      const h = $(".view-head");
      if (h && !$(".growth-overview"))
        h.insertAdjacentHTML(
          "afterend",
          `<div class="growth-overview">${overviewKpis()}</div>`,
        );
    }
    if (section === "settings") {
      const tabs = $(".settings-tabs");
      if (tabs && !$(".integrations-panel"))
        tabs.insertAdjacentHTML("afterend", integrationPanel());
    }
    if (section === "media-buying") updateBuilders();
  }
  function action(action, el) {
    if (
      !action.startsWith("growth-") &&
      ![
        "refresh-leads",
        "export-csv",
        "media-tab",
        "copy-utm",
        "copy-wa",
        "save-campaign",
        "copy-text",
        "tracking-check",
        "campaign-add",
        "campaign-remove",
        "copy-ad-line",
        "copy-ad-all",
        "reset-ad-line",
        "tip-add",
        "tip-move",
        "tip-remove",
      ].includes(action)
    )
      return false;
    action = action.replace(/^growth-/, "");
    if (action === "refresh-leads") refreshLeads();
    if (action === "export-csv") csv();
    if (action === "media-tab") {
      state.tab = el.dataset.tab;
      rerender();
    }
    if (
      action === "copy-utm" ||
      action === "copy-wa" ||
      action === "copy-text"
    ) {
      navigator.clipboard?.writeText(
        el.dataset.text ||
          $(action === "copy-utm" ? "#utm-output" : "#wa-output")
            ?.textContent ||
          "",
      );
    }
    if (action === "tip-add") {
      state.bridge.content["tips.json"].push({ id: "", ar: "", en: "" });
      state.bridge.markDirty("tips.json");
      rerender();
    }
    if (action === "tip-remove") {
      state.bridge.content["tips.json"].splice(Number(el.dataset.i), 1);
      state.bridge.markDirty("tips.json");
      rerender();
    }
    if (action === "tip-move") {
      const a = state.bridge.content["tips.json"],
        i = Number(el.dataset.i),
        j = i + Number(el.dataset.d);
      [a[i], a[j]] = [a[j], a[i]];
      state.bridge.markDirty("tips.json");
      rerender();
    }
    if (action === "save-campaign") {
      const c = state.bridge.content["campaigns.json"].campaigns;
      const name = $("#utm-campaign").value || "new-campaign";
      c.push({
        id: slugify(name),
        name,
        platform: $("#utm-preset").selectedOptions[0].text,
        objective: "leads",
        status: "planned",
        startDate: "",
        endDate: "",
        budget: 0,
        currency: "EGP",
        utmSource: $("#utm-preset").value.split("|")[0],
        utmMedium: $("#utm-preset").value.split("|")[1],
        utmCampaign: $("#utm-campaign").value,
        landingUrl: $("#utm-output").textContent,
        audience: "",
        notes: "",
      });
      state.bridge.markDirty("campaigns.json");
      location.hash = "campaigns";
      location.reload();
    }
    if (action === "campaign-add") {
      state.bridge.content["campaigns.json"].campaigns.push({
        id: "new-campaign",
        name: "New campaign",
        platform: "meta",
        objective: "leads",
        status: "planned",
        startDate: "",
        endDate: "",
        budget: 0,
        currency: "EGP",
        utmSource: "",
        utmMedium: "",
        utmCampaign: "",
        landingUrl: "",
        audience: "",
        notes: "",
      });
      state.bridge.markDirty("campaigns.json");
      rerender();
    }
    if (action === "campaign-remove") {
      state.bridge.content["campaigns.json"].campaigns.splice(
        Number(el.dataset.i),
        1,
      );
      state.bridge.markDirty("campaigns.json");
      rerender();
    }
    if (action === "copy-ad-line") {
      const control = document.querySelector(
        `[data-ad-copy][data-slug="${el.dataset.slug}"]` +
        `[data-field="${el.dataset.field}"][data-i="${el.dataset.i}"]`,
      );
      navigator.clipboard?.writeText(control?.value || "");
    }
    if (action === "copy-ad-all") copyAllAdCopy(el.dataset.slug);
    if (action === "reset-ad-line") resetAdLine(el);
    if (action === "tracking-check")
      fetch("/ar/index.html")
        .then((r) => r.text())
        .then((h) => {
          $("#tracking-result").innerHTML = [
            "gtag",
            "clarity",
            "fbq",
            "ttq",
            "google-site-verification",
          ]
            .map(
              (x) =>
                `<span class="admin-badge">${x}: ${h.includes(x) ? "present" : "missing"}</span>`,
            )
            .join(" ");
        });
    return true;
  }
  document.addEventListener("input", (e) => {
    const f = e.target.dataset.leadFilter;
    if (f !== undefined) {
      state.filters[f] = e.target.value;
      rerender();
    }
    if (e.target.dataset.tip) {
      state.bridge.content["tips.json"][Number(e.target.dataset.i)][
        e.target.dataset.tip
      ] = e.target.value;
      state.bridge.markDirty("tips.json");
    }
    if (e.target.matches?.("[data-campaign-field]")) {
      const campaign = state.bridge.content["campaigns.json"].campaigns[
        Number(e.target.dataset.i)
      ];
      const key = e.target.dataset.campaignField;
      campaign[key] = key === "budget" ? Number(e.target.value) : e.target.value;
      state.bridge.markDirty("campaigns.json");
    }
    if (e.target.matches?.("[data-ad-copy]")) updateAdCopy(e.target);
    if (e.target.closest(".tool-grid")) updateBuilders();
  });
  document.addEventListener("change", (e) => {
    if (
      e.target.dataset.leadStatus !== undefined ||
      e.target.dataset.leadNotes !== undefined
    )
      saveLead(e.target);
    if (e.target.dataset.check !== undefined) {
      let x = {};
      try {
        x = JSON.parse(localStorage.getItem(STORE.checks) || "{}");
      } catch {}
      x[e.target.dataset.check] = e.target.checked;
      localStorage.setItem(STORE.checks, JSON.stringify(x));
    }
    if (e.target.matches("[data-range]")) {
      state.range = e.target.value;
      rerender();
    }
    if (e.target.matches?.("[data-campaign-sort]")) {
      state.campaignSort = e.target.value;
      rerender();
    }
    if (e.target.closest(".tool-grid")) updateBuilders();
  });
  document.addEventListener(
    "toggle",
    (e) => {
      if (e.target.matches?.("[data-page-detail]") && e.target.open)
        pageDetail(e.target);
    },
    true,
  );
  document.addEventListener(
    "click",
    async (e) => {
      if (!e.target.closest?.('[data-growth="test-endpoint"]')) return;
      const out = $("#endpoint-result"),
        token = $("#leads-token")?.value || "";
      localStorage.setItem(STORE.token, token);
      out.textContent = "Testing…";
      try {
        const base = endpoint();
        const live = await fetch(base).then((r) => r.ok);
        const data = await fetch(
          `${base}${base.includes("?") ? "&" : "?"}action=leads&token=${encodeURIComponent(token)}`,
        ).then((r) => r.json());
        out.textContent =
          live && data.ok
            ? "Endpoint and leads read passed."
            : "Endpoint responded, but leads read was rejected.";
      } catch {
        out.textContent = "Network or endpoint error.";
      }
    },
    true,
  );
  document.addEventListener("input", (e) => {
    if (e.target.id === "leads-token")
      localStorage.setItem(STORE.token, e.target.value);
  });
  window.DashboardGrowth = { render, afterRender, action, state, refreshLeads };
})();
