#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.argv[2] || "http://localhost:4173";
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

class FakeClassList {
  constructor(initial = []) {
    this.values = new Set(initial);
  }
  add(...names) {
    names.forEach((name) => this.values.add(name));
  }
  remove(...names) {
    names.forEach((name) => this.values.delete(name));
  }
  contains(name) {
    return this.values.has(name);
  }
  toggle(name, force) {
    if (force === undefined ? !this.values.has(name) : force)
      this.values.add(name);
    else this.values.delete(name);
  }
}

class FakeElement {
  constructor(id = "") {
    this.id = id;
    this.attributes = new Map();
    this.classList = new FakeClassList();
    this.dataset = {};
    this.listeners = {};
    this.hidden = false;
    this.disabled = false;
    this.innerHTML = "";
    this.textContent = "";
    this.value = "";
  }
  addEventListener(type, listener) {
    this.listeners[type] = listener;
  }
  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }
  removeAttribute(name) {
    this.attributes.delete(name);
  }
  focus() {}
  reset() {}
  querySelector(selector) {
    if (selector === "[data-nav].is-active")
      return (
        navItems.find((item) => item.classList.contains("is-active")) || null
      );
    return null;
  }
}

const ids = [
  "admin-shell",
  "admin-sidebar",
  "menu-toggle",
  "view-root",
  "view-title",
  "connection-pill",
  "dirty-pill",
  "top-save",
  "operation-banner",
  "admin-toast",
  "upload-dialog",
  "upload-form",
  "upload-message",
  "upload-result",
  "uploaded-path",
  "upload-preview",
  "use-uploaded-path",
  "sidebar-scrim",
  "upload-directory",
  "dashboard-main",
];
const elements = Object.fromEntries(ids.map((id) => [id, new FakeElement(id)]));
elements["admin-shell"].classList = new FakeClassList();
elements["connection-pill"].classList = new FakeClassList(["is-loading"]);
elements["upload-dialog"].open = false;
elements["upload-dialog"].close = () => {
  elements["upload-dialog"].open = false;
};
elements["upload-dialog"].showModal = () => {
  elements["upload-dialog"].open = true;
};

const sections = [
  "overview",
  "analytics",
  "leads",
  "media-buying",
  "campaigns",
  "specialties",
  "doctors",
  "branches",
  "articles",
  "reviews",
  "digital",
  "tips",
  "settings",
  "images",
  "backups",
];
const navItems = sections.map((section, index) => {
  const item = new FakeElement();
  item.dataset.nav = section;
  item.classList = new FakeClassList(index ? [] : ["is-active"]);
  return item;
});

const documentListeners = {};
const document = {
  querySelector(selector) {
    const id = /^#([\w-]+)$/.exec(selector)?.[1];
    return id ? elements[id] || null : null;
  },
  querySelectorAll(selector) {
    return selector === "[data-nav]" ? navItems : [];
  },
  addEventListener(type, listener) {
    (documentListeners[type] ||= []).push(listener);
  },
};

const realFetch = globalThis.fetch;
globalThis.fetch = (input, options) => realFetch(new URL(input, BASE), options);
globalThis.document = document;
globalThis.window = {
  clearTimeout,
  setTimeout,
  requestAnimationFrame(callback) {
    callback();
  },
  matchMedia() {
    return { matches: false };
  },
  addEventListener() {},
  confirm() {
    return true;
  },
};
globalThis.location = { hash: "" };
globalThis.history = { replaceState() {} };
globalThis.localStorage = {
  data: new Map(),
  getItem(k) {
    return this.data.get(k) ?? null;
  },
  setItem(k, v) {
    this.data.set(k, String(v));
  },
};
Object.defineProperty(globalThis, "navigator", {
  value: { clipboard: { writeText() {} } },
  configurable: true,
});

const script = fs.readFileSync(
  path.join(ROOT, "dashboard", "js", "dashboard.js"),
  "utf8",
);
const growthScript = fs.readFileSync(
  path.join(ROOT, "dashboard", "js", "growth.js"),
  "utf8",
);
const qrScript = fs.readFileSync(
  path.join(ROOT, "dashboard", "js", "qr.js"),
  "utf8",
);
const analyticsScript = fs.readFileSync(
  path.join(ROOT, "dashboard", "js", "analytics.js"),
  "utf8",
);
const serverSource = fs.readFileSync(
  path.join(ROOT, "server", "serve.mjs"),
  "utf8",
);
vm.runInThisContext(analyticsScript, { filename: "analytics.js" });
vm.runInThisContext(qrScript, { filename: "qr.js" });
vm.runInThisContext(growthScript, { filename: "growth.js" });
vm.runInThisContext(script, { filename: "dashboard.js" });

for (
  let attempt = 0;
  attempt < 100 && !elements["view-root"].innerHTML.includes("Content counts");
  attempt += 1
) {
  await new Promise((resolve) => setTimeout(resolve, 20));
}

function findUnlabelledControls(html) {
  const labels = new Set(
    [...html.matchAll(/<label[^>]*\sfor="([^"]+)"/g)].map((match) => match[1]),
  );
  return [...html.matchAll(/<(input|select|textarea)\b[^>]*>/g)]
    .filter((match) => {
      const tag = match[0];
      if (/aria-label=|aria-labelledby=/.test(tag)) return false;
      if (
        html.lastIndexOf("<label", match.index) >
        html.lastIndexOf("</label>", match.index)
      )
        return false;
      const id = /\sid="([^"]+)"/.exec(tag)?.[1];
      return !id || !labels.has(id);
    })
    .map((match) => match[0]);
}

const rendered = {};
for (const nav of navItems) {
  nav.listeners.click();
  if (nav.dataset.nav === "images" || nav.dataset.nav === "backups")
    await new Promise((resolve) => setTimeout(resolve, 80));
  const html = elements["view-root"].innerHTML;
  rendered[nav.dataset.nav] = html;
  check(html.length > 200, `${nav.dataset.nav}: empty render`);
  check(
    !html.includes("[object Object]"),
    `${nav.dataset.nav}: object leaked into HTML`,
  );
  const unlabelled = findUnlabelledControls(html);
  check(
    unlabelled.length === 0,
    `${nav.dataset.nav}: unlabelled form control ${unlabelled.join(" ")}`,
  );
}

function clickAction(dataset) {
  const target = {
    dataset,
    closest(selector) {
      return selector === "[data-action]" ? this : null;
    },
  };
  for (const listener of documentListeners.click || []) listener({ target });
}

/* Counts come from the live content, not from constants. They used to be
   hardcoded, so removing one doctor from the site failed three assertions that
   had nothing to do with the dashboard. */
const liveContent = await realFetch(new URL("/api/content", BASE)).then((r) =>
  r.json(),
);
const countOf = (file, key) => (liveContent[file]?.[key] || []).length;
const DOCTORS = countOf("doctors.json", "doctors");
const ARTICLES = countOf("articles.json", "articles");
const REVIEWS = countOf("reviews.json", "reviews");

/* This PUT is guaranteed not to write: showPrice is an older independent guard.
   It lets the smoke test prove the new price-text issue is also reported without
   ever testing a successful write against a real content file. */
const invalidPrice = JSON.parse(JSON.stringify(liveContent["site.json"]));
invalidPrice.__dashboardAudit = { showPrice: true, publicText: "1500 EGP" };
const invalidPriceResponse = await realFetch(
  new URL("/api/content/site.json", BASE),
  {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "x-content-rev": liveContent.__revs?.["site.json"] || "",
    },
    body: JSON.stringify(invalidPrice),
  },
);
const invalidPriceBody = await invalidPriceResponse.json();
check(
  invalidPriceResponse.status === 422,
  "server validation: unsafe price probe was not rejected",
);
check(
  invalidPriceBody.validationErrors?.some((issue) =>
    issue.includes("looks like it contains a price"),
  ),
  "server validation: public price text was not reported",
);

navItems.find((item) => item.dataset.nav === "doctors").listeners.click();
clickAction({
  action: "add-item",
  file: "doctors.json",
  collection: "doctors",
});
check(
  elements["view-root"].innerHTML.includes(`${DOCTORS + 1} items`),
  "doctors: adding a new draft failed",
);
check(
  !/data-list-published[^>]*data-index="8"[^>]*checked/.test(
    elements["view-root"].innerHTML,
  ),
  "doctors: new draft starts published",
);
clickAction({
  action: "move-item",
  file: "doctors.json",
  collection: "doctors",
  index: String(DOCTORS),
  direction: "-1",
});
clickAction({
  action: "delete-item",
  file: "doctors.json",
  collection: "doctors",
  index: String(DOCTORS - 1),
});
check(
  elements["view-root"].innerHTML.includes(`${DOCTORS} items`),
  "doctors: reorder/delete did not restore the list",
);

navItems.find((item) => item.dataset.nav === "articles").listeners.click();
clickAction({
  action: "add-item",
  file: "articles.json",
  collection: "articles",
});
check(
  elements["view-root"].innerHTML.includes(`${ARTICLES + 1} items`),
  "articles: adding a new draft failed",
);
clickAction({
  action: "delete-item",
  file: "articles.json",
  collection: "articles",
  index: String(ARTICLES),
});

navItems.find((item) => item.dataset.nav === "reviews").listeners.click();
clickAction({
  action: "add-item",
  file: "reviews.json",
  collection: "reviews",
});
check(
  elements["view-root"].innerHTML.includes(`${REVIEWS + 1} items`),
  "reviews: adding a new draft failed",
);
check(
  elements["view-root"].innerHTML.includes('data-action="move-item"'),
  "reviews: a new review has no reorder controls",
);
clickAction({
  action: "delete-item",
  file: "reviews.json",
  collection: "reviews",
  index: String(REVIEWS),
});
check(
  elements["view-root"].innerHTML.includes(`${REVIEWS} items`),
  "reviews: deleting a new draft failed",
);

navItems.find((item) => item.dataset.nav === "specialties").listeners.click();
const treatsPath = ["specialties", 0, "treats", "ar"];
clickAction({
  action: "add-array-item",
  path: encodeURIComponent(JSON.stringify(treatsPath)),
  arrayKey: "treats",
});
const addedTreatPath = encodeURIComponent(
  JSON.stringify(treatsPath.concat(10)),
);
check(
  elements["view-root"].innerHTML.includes(`data-path="${addedTreatPath}"`),
  "nested array: adding a row failed",
);
clickAction({
  action: "move-array-item",
  path: encodeURIComponent(JSON.stringify(treatsPath.concat(10))),
  direction: "-1",
});
clickAction({
  action: "remove-array-item",
  path: encodeURIComponent(JSON.stringify(treatsPath.concat(9))),
});
check(
  !elements["view-root"].innerHTML.includes(`data-path="${addedTreatPath}"`),
  "nested array: reorder/delete did not restore the list",
);

navItems.find((item) => item.dataset.nav === "doctors").listeners.click();
clickAction({
  action: "add-item",
  file: "doctors.json",
  collection: "doctors",
});
clickAction({ action: "save-file", file: "doctors.json" });
await new Promise((resolve) => setTimeout(resolve, 20));
check(
  elements["operation-banner"].className.includes("is-error"),
  "validation: blank doctor was not rejected before save",
);
clickAction({
  action: "delete-item",
  file: "doctors.json",
  collection: "doctors",
  index: String(DOCTORS),
});

const workingFetch = globalThis.fetch;
globalThis.fetch = () => Promise.reject(new Error("simulated offline"));
clickAction({ action: "save-file", file: "doctors.json" });
for (
  let attempt = 0;
  attempt < 50 &&
  !elements["operation-banner"].textContent.includes("Save failed");
  attempt += 1
) {
  await new Promise((resolve) => setTimeout(resolve, 10));
}
check(
  elements["operation-banner"].textContent.includes("Save failed"),
  "save: failure feedback missing",
);
check(
  !elements["top-save"].disabled,
  "save: failed request cleared the unsaved state",
);
globalThis.fetch = workingFetch;

/* Resolve a successful save only after another form mutation. The response
   represents the older payload, so Save and the unload guard must stay active. */
let resolvePendingSave;
globalThis.fetch = (input, options = {}) => {
  if (options.method === "PUT" && String(input).includes("doctors.json")) {
    return new Promise((resolve) => {
      resolvePendingSave = resolve;
    });
  }
  return workingFetch(input, options);
};
clickAction({ action: "save-file", file: "doctors.json" });
const doctorNamePath = encodeURIComponent(
  JSON.stringify(["doctors", 0, "name", "en"]),
);
const originalDoctorName = liveContent["doctors.json"].doctors[0].name.en;
const changedControl = {
  dataset: { path: doctorNamePath },
  value: `${originalDoctorName} audit mutation`,
  closest(selector) {
    return selector === "[data-bind]" ? this : null;
  },
};
for (const listener of documentListeners.input || [])
  listener({ target: changedControl });
resolvePendingSave(
  new Response(
    JSON.stringify({
      saved: "doctors.json",
      rev: liveContent.__revs?.["doctors.json"] || "audit-rev",
      pipeline: { ok: true, build: { ok: true }, validation: { ok: true } },
    }),
    { status: 200, headers: { "content-type": "application/json" } },
  ),
);
for (
  let attempt = 0;
  attempt < 100 &&
  (!elements["operation-banner"].className.includes("is-success") ||
    elements["top-save"].disabled);
  attempt += 1
) {
  await new Promise((resolve) => setTimeout(resolve, 10));
}
check(
  !elements["top-save"].disabled,
  "save: an edit made in flight was incorrectly marked saved",
);
changedControl.value = originalDoctorName;
for (const listener of documentListeners.input || [])
  listener({ target: changedControl });
globalThis.fetch = workingFetch;

if (process.env.DASHBOARD_WRITE_TEST === "1") {
  clickAction({ action: "save-file", file: "doctors.json" });
  for (
    let attempt = 0;
    attempt < 600 &&
    !elements["operation-banner"].className.includes("is-success");
    attempt += 1
  ) {
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  check(
    elements["operation-banner"].className.includes("is-success"),
    "save: no persistent success state",
  );
  check(
    elements["top-save"].disabled,
    "save: current file still marked unsaved after persistence",
  );
}

check(
  rendered.overview.includes("Generated pages"),
  "overview: page count missing",
);
check(
  rendered.overview.includes("Open editor"),
  "overview: TODO links missing",
);
for (const section of [
  "specialties",
  "doctors",
  "branches",
  "articles",
  "reviews",
  "digital",
]) {
  check(
    rendered[section].includes("Additional file fields"),
    `${section}: file-level editor missing`,
  );
}
for (const section of [
  "specialties",
  "doctors",
  "branches",
  "articles",
  "digital",
]) {
  check(
    rendered[section].includes('data-action="move-item"'),
    `${section}: reorder controls missing`,
  );
}
check(
  rendered.reviews.includes('data-action="add-item"'),
  "reviews: add control missing",
);
check(
  rendered.reviews.includes("Rating aggregate"),
  "reviews: aggregate editor missing",
);
check(
  rendered.reviews.includes("Before and after"),
  "reviews: before/after editor missing",
);
check(
  rendered.digital.includes("Internal pricing"),
  "digital: internal pricing editor missing",
);
check(
  rendered.digital.includes('data-value-type="boolean"') &&
    rendered.digital.includes("disabled"),
  "digital: public price guard missing",
);
check(
  rendered.images.includes("Media registry"),
  "images: media registry editor missing",
);
check(rendered.backups.includes("Backup list"), "backups: list missing");
check(
  rendered.backups.includes('data-action="restore-backup"'),
  "backups: restore control missing",
);
check(
  rendered.leads.includes("Leads &amp; bookings") &&
    rendered.leads.includes("Export CSV"),
  "leads: table tools missing",
);
check(
  rendered["media-buying"].includes("UTM builder") &&
    rendered["media-buying"].includes("WhatsApp links"),
  "media buying: tabs missing",
);
check(rendered.campaigns.includes("Campaigns"), "campaigns: editor missing");
check(
  rendered.tips.includes("Daily tips") &&
    rendered.tips.includes('data-growth="tip-add"'),
  "tips: root-array editor missing",
);
check(
  serverSource.includes('"campaigns.json", "tips.json"') &&
    serverSource.includes('file === "tips.json"'),
  "server: new content files or tips array validation missing",
);
check(
  growthScript.includes("lr_dash_leads_token") &&
    growthScript.includes("lr_dash_leads_cache") &&
    /mode:\s*["']no-cors["']/.test(growthScript),
  "leads: token/cache/update contract missing",
);
check(
  growthScript.includes("Leads per day"),
  "lead analytics: daily chart missing",
);
check(
  growthScript.includes("campaignMetrics"),
  "campaigns: lead metrics missing",
);
check(
  growthScript.includes("data-ad-copy"),
  "ad copy: editable overrides missing",
);

const qrUrl =
  "https://laroseclinics.com/ar/patients/booking.html?utm_source=facebook";
const urlMatrix = window.LRQR.matrix(qrUrl);
check(
  urlMatrix.length === 37,
  "QR: URL did not select the expected version 5-M matrix",
);
check(
  urlMatrix.every((row) => row.length === 37),
  "QR: matrix is not square",
);

function checkFinder(matrix, left, top, label) {
  for (let y = 0; y < 7; y += 1) {
    for (let x = 0; x < 7; x += 1) {
      const expected =
        x === 0 ||
        x === 6 ||
        y === 0 ||
        y === 6 ||
        (x >= 2 && x <= 4 && y >= 2 && y <= 4);
      check(
        matrix[top + y][left + x] === expected,
        `QR: ${label} finder ${x},${y}`,
      );
    }
  }
}

checkFinder(urlMatrix, 0, 0, "top-left");
checkFinder(urlMatrix, urlMatrix.length - 7, 0, "top-right");
checkFinder(urlMatrix, 0, urlMatrix.length - 7, "bottom-left");
for (let coordinate = 8; coordinate < urlMatrix.length - 8; coordinate += 1) {
  check(
    urlMatrix[6][coordinate] === (coordinate % 2 === 0),
    `QR: horizontal timing pattern at ${coordinate}`,
  );
  check(
    urlMatrix[coordinate][6] === (coordinate % 2 === 0),
    `QR: vertical timing pattern at ${coordinate}`,
  );
}

const helloReference = [
  "111111101100101111111",
  "100000100001001000001",
  "101110100101001011101",
  "101110101001001011101",
  "101110101110101011101",
  "100000101001001000001",
  "111111101010101111111",
  "000000001001100000000",
  "100010111111011111001",
  "000100001011100001111",
  "001111110011011010010",
  "111110001100010000000",
  "111110101010101100110",
  "000000001010111101011",
  "111111101110101011010",
  "100000100101110110011",
  "101110101101011000110",
  "101110100100100011011",
  "101110100111000111000",
  "100000100001010000000",
  "111111101111111110101",
];
const helloRows = window.LRQR.matrix("HELLO WORLD").map((row) =>
  row.map((cell) => (cell ? "1" : "0")).join(""),
);
check(
  JSON.stringify(helloRows) === JSON.stringify(helloReference),
  "QR: HELLO WORLD version 1-M reference matrix mismatch",
);

const css = fs.readFileSync(
  path.join(ROOT, "dashboard", "css", "dashboard.css"),
  "utf8",
);
check(
  /@media \(max-width: 52rem\)[\s\S]*?\.bilingual-grid\s*\{[\s\S]*?grid-template-columns:\s*1fr/.test(css),
  "responsive: bilingual fields do not collapse",
);
check(
  /@media \(max-width: 36rem\)[\s\S]*?\.array-row,[\s\S]*?grid-template-columns: 1fr/.test(
    css,
  ),
  "responsive: form rows do not collapse",
);
check(
  css.includes(".table-scroll") && css.includes("overflow-x: auto"),
  "responsive: tables do not scroll internally",
);
check(
  /handle\.sync\(\)[\s\S]*?handle\.close\(\)[\s\S]*?fsp\.rename\(tmp, target\)/.test(
    serverSource,
  ),
  "atomic writes: temp file is not flushed, closed, and renamed",
);
check(
  serverSource.includes('createHash("sha256")') &&
    serverSource.includes("contentWriteQueues") &&
    serverSource.includes("json(res, 428"),
  "conflicts: hash revision is not required and serialised",
);
check(
  serverSource.includes('{ flag: "wx" }'),
  "uploads: destination is not created exclusively",
);
check(
  script.includes("fileMutations") && script.includes("sentMutation"),
  "save: per-file mutation counter missing",
);
check(
  (script.match(/resetListFilters\(\)/g) || []).length >= 5,
  "filters: reset is not applied to every navigation path",
);
check(
  script.includes("imagesAttempted") &&
    script.includes('data-action="refresh-images"'),
  "images: failed-load stop/retry state missing",
);
check(
  script.includes('invalidateImages(state.section === "images")') &&
    script.includes("imagesReloadPending"),
  "images: upload does not refresh the library safely",
);
check(
  script.includes("looks like it contains a price") &&
    script.includes("pricingPath"),
  "client validation: public price rule missing",
);
check(
  /\.admin-btn--sm\s*\{[\s\S]*?min-height:\s*2\.75rem/.test(css) &&
    /\.icon-action\s*\{[\s\S]*?width:\s*2\.75rem;[\s\S]*?height:\s*2\.75rem;/.test(css) &&
    /\.list-search\s*\{[\s\S]*?min-height:\s*2\.75rem;/.test(css),
  "touch targets: common controls are below 44px",
);
check(
  css.includes("inset-inline-start: 0") &&
    /\[dir=["']rtl["']\] \.admin-sidebar\s*\{[\s\S]*?transform:\s*translateX\(105%\)/.test(css),
  "RTL drawer: logical right-edge rule missing",
);
check(
  !css.includes("text-align: match-parent") &&
    !css.includes("inset: 0 auto 0 0"),
  "CSS: unsupported alignment or physical drawer inset remains",
);

if (failures.length) {
  process.stderr.write(
    `Dashboard smoke test failed (${failures.length}):\n${failures.map((failure) => `- ${failure}`).join("\n")}\n`,
  );
  process.exit(1);
}

process.stdout.write(
  `Dashboard smoke test passed: ${sections.length} sections; editing; save races; validation; audit regressions; responsive rules.\n`,
);
