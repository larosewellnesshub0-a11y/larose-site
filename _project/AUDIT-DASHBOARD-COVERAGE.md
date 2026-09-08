# Dashboard content coverage audit

## Coverage

Scope: the eight current files under `content/`, the dashboard routing and recursive editors, and the server save validation. The inventory contains **568 logical key paths**. Array-item placeholders such as a bare `[*]` are not keys and are therefore not separate rows; descendant keys use `[*]` to mean “each object in this array.”

Every classification in the table cites the verbatim renderer evidence below. This is a static source audit; no project command, build, server, Python script, or validator was run.

### Evidence used by the classifications

**E1 — the server loads and permits exactly all eight requested content files.**

**server/serve.mjs:89-92**

```js
const CONTENT_FILES = new Set([
  "site.json", "specialties.json", "doctors.json", "branches.json",
  "articles.json", "reviews.json", "digital.json", "pages.json",
]);
```

**E2 — each non-settings collection file has a dashboard section and every declared main group is routed.**

**dashboard/js/dashboard.js:38-65**

```js
  const COLLECTION_SECTIONS = {
    specialties: {
      file: "specialties.json",
      groups: [{ key: "specialties", ar: "التخصصات", en: "Specialties" }],
    },
    doctors: {
      file: "doctors.json",
      groups: [{ key: "doctors", ar: "الأطباء", en: "Doctors" }],
    },
    branches: {
      file: "branches.json",
      groups: [{ key: "branches", ar: "الفروع", en: "Branches" }],
    },
    articles: {
      file: "articles.json",
      groups: [
        { key: "articles", ar: "المحتوى المعرفي", en: "Knowledge entries" },
        { key: "categories", ar: "التصنيفات", en: "Categories" },
      ],
    },
    reviews: {
      file: "reviews.json",
      groups: [{ key: "reviews", ar: "الآراء", en: "Reviews" }],
    },
    digital: {
      file: "digital.json",
      groups: [{ key: "products", ar: "المنتجات الرقمية", en: "Digital products" }],
    },
```

**E3 — Settings exposes both `site.json` and `pages.json`, then recursively renders the selected root.**

**dashboard/js/dashboard.js:1384-1409**

```js
  function renderSettings() {
    const files = ["site.json", "pages.json"].filter((file) => state.content[file]);
    if (!files.includes(state.settingsFile)) state.settingsFile = files[0] || "site.json";
    const file = state.settingsFile;
    const root = state.content[file] || {};
    state.editorContext = { file, root, mode: "root" };
    fieldSequence = 0;

    return `${viewHeading(
      SECTION_META.settings,
      "كل حقول إعدادات الموقع متاحة هنا، بما فيها القوائم والمعلومات القانونية. · All site settings are editable here, including navigation and legal copy.",
    )}
    <div class="settings-tabs" role="tablist" aria-label="ملفات الإعدادات · Settings files">
      ${files.map((candidate) => `<button class="segment-btn${candidate === file ? " is-active" : ""}" id="settings-tab-${candidate.replace(/\W/g, "-")}" type="button" role="tab" aria-selected="${candidate === file}" aria-controls="settings-panel" tabindex="${candidate === file ? "0" : "-1"}" data-action="select-settings-file" data-file="${candidate}">${candidate}</button>`).join("")}
    </div>
    <section class="editor-panel" id="settings-panel" role="tabpanel" aria-labelledby="settings-tab-${file.replace(/\W/g, "-")}">
      <div class="editor-head">
        <div>
          <p class="admin-kicker">ملف المحتوى <span lang="en" dir="ltr">Content file</span></p>
          <h2 id="settings-editor-title" dir="ltr">${escapeHtml(file)}</h2>
        </div>
        <button class="admin-btn admin-btn--primary" type="button" data-action="save-file" data-file="${escapeHtml(file)}">حفظ الملف <span lang="en" dir="ltr">Save file</span></button>
      </div>
      <form class="dynamic-form" data-editor-form data-file="${escapeHtml(file)}">${renderObjectFields(root, [], 0)}</form>
      <p class="form-message" id="editor-message" role="status" aria-live="polite"></p>
    </section>`;
```

**E4 — collection entries have add, reorder, delete, and recursive field editing.**

**dashboard/js/dashboard.js:1032-1034**

```js
        <button class="admin-btn admin-btn--primary" type="button" data-action="add-item" data-file="${escapeHtml(file)}" data-collection="${escapeHtml(group.key)}">
          إضافة جديد <span lang="en" dir="ltr">Add new</span>
        </button>
```

**dashboard/js/dashboard.js:1052-1054**

```js
              <button class="icon-action" type="button" data-action="move-item" data-file="${escapeHtml(file)}" data-collection="${escapeHtml(group.key)}" data-index="${index}" data-direction="-1" aria-label="حرّك ${escapeHtml(itemName(item, index))} لأعلى · Move up" ${index === 0 ? "disabled" : ""}>↑</button>
              <button class="icon-action" type="button" data-action="move-item" data-file="${escapeHtml(file)}" data-collection="${escapeHtml(group.key)}" data-index="${index}" data-direction="1" aria-label="حرّك ${escapeHtml(itemName(item, index))} لأسفل · Move down" ${index === items.length - 1 ? "disabled" : ""}>↓</button>
              ${Object.prototype.hasOwnProperty.call(item || {}, "published") ? `<label class="mini-toggle" title="منشور · Published">
```

**dashboard/js/dashboard.js:1085-1095**

```js
          <button class="admin-btn admin-btn--danger admin-btn--sm" type="button" data-action="delete-item" data-file="${escapeHtml(file)}" data-collection="${escapeHtml(group.key)}" data-index="${selectedIndex}">
            حذف <span lang="en" dir="ltr">Delete</span>
          </button>
          <button class="admin-btn admin-btn--primary admin-btn--sm" type="button" data-action="save-file" data-file="${escapeHtml(file)}">
            حفظ الملف <span lang="en" dir="ltr">Save file</span>
          </button>
        </div>
      </div>
      <form class="dynamic-form" data-editor-form data-file="${escapeHtml(file)}">
        ${renderObjectFields(item, [group.key, selectedIndex], 0)}
      </form>
```

**E5 — keys outside a file’s declared collection groups are not dropped; they are rendered under Additional file fields.**

**dashboard/js/dashboard.js:1100-1113**

```js
  function renderFileExtras(file, fileData, collectionKeys) {
    const extras = Object.fromEntries(Object.entries(fileData).filter(([key]) => !collectionKeys.includes(key)));
    if (!Object.keys(extras).length) return "";
    return `<details class="admin-panel file-extras">
      <summary>${bilingualHeading("حقول الملف الإضافية", "Additional file fields")}</summary>
      <div class="file-extras__body">
        <p class="field-help">بيانات الملف اللي مش جزءاً من قائمة العناصر الرئيسية. · File-level data outside the main item list.</p>
        <form class="dynamic-form" data-editor-form data-file="${escapeHtml(file)}">
          ${renderObjectFields(extras, [], 0)}
        </form>
        <button class="admin-btn admin-btn--primary" type="button" data-action="save-file" data-file="${escapeHtml(file)}">حفظ الملف <span lang="en" dir="ltr">Save file</span></button>
      </div>
    </details>`;
  }
```

**E6 — bilingual, array, object, and scalar values all reach an editor recursively.**

**dashboard/js/dashboard.js:1277-1292**

```js
  function renderBilingualField(key, value, path, depth) {
    const required = isRequiredPath(state.editorContext?.file, path.concat("ar"))
      || isRequiredPath(state.editorContext?.file, path.concat("en"));
    return `<section class="bilingual-field">
      <p class="field-label">${labelHtml(key)}${required ? requiredMarkHtml() : ""}</p>
      <div class="bilingual-grid">
        <div>
          <span class="locale-tag" lang="ar" dir="rtl">AR · العربية</span>
          ${renderLocaleValue(key, value.ar, path.concat("ar"), "ar", depth)}
        </div>
        <div dir="ltr">
          <span class="locale-tag" lang="en">EN · English</span>
          ${renderLocaleValue(key, value.en, path.concat("en"), "en", depth)}
        </div>
      </div>
    </section>`;
```

**dashboard/js/dashboard.js:1371-1382**

```js
  function renderField(key, value, path, depth) {
    if (isBilingual(value)) return renderBilingualField(key, value, path, depth);
    if (Array.isArray(value)) return renderArrayEditor(key, value, path, depth);
    if (isPlainObject(value)) return renderObjectField(key, value, path, depth);
    return renderScalarInput(key, value, path);
  }

  function renderObjectFields(object, basePath, depth) {
    const entries = Object.entries(object || {});
    if (!entries.length) return '<p class="collection-empty">لا توجد حقول في هذا الكائن. · This object has no fields.</p>';
    return entries.map(([key, value]) => renderField(key, value, basePath.concat(key), depth)).join("");
  }
```

**E7 — inner arrays expose add, move, and remove controls; object templates cover the current empty object arrays.**

**dashboard/js/dashboard.js:283-310**

```js
  const ARRAY_ITEM_TEMPLATES = {
    treatments: {
      slug: "",
      name: { ar: "", en: "" },
      summary: { ar: "", en: "" },
      body: { ar: "", en: "" },
      facts: { ar: [], en: [] },
    },
    faq: { q: { ar: "", en: "" }, a: { ar: "", en: "" } },
    sections: { id: "", heading: { ar: "", en: "" }, body: { ar: "", en: "" } },
    sources: { label: "", url: "" },
    photos: { src: "", alt: { ar: "", en: "" } },
    nav: { key: "", label: { ar: "", en: "" }, href: "", mega: false, childrenFrom: "", children: [] },
    stats: { n: "", label: { ar: "", en: "" } },
    columns: { title: { ar: "", en: "" }, linksFrom: "", links: [] },
    links: { label: { ar: "", en: "" }, href: "" },
    children: { label: { ar: "", en: "" }, href: "", desc: { ar: "", en: "" } },
    formats: {
      slug: "",
      name: { ar: "", en: "" },
      summary: { ar: "", en: "" },
      includes: { ar: [], en: [] },
      showPrice: false,
    },
    inside: { ar: "", en: "" },
    audience: { ar: "", en: "" },
    pairs: { slug: "", sample: true, before: "", after: "", specialty: "" },
  };
```

**dashboard/js/dashboard.js:1324-1353**

```js
          if (isPlainObject(item)) {
            return `<article class="repeat-card">
              <div class="repeat-card__head">
                <strong>${escapeHtml(labelsFor(key)[0])} ${index + 1} <small lang="en" dir="ltr">Item ${index + 1}</small></strong>
                <div class="row-actions">
                  <button class="icon-action" type="button" data-action="move-array-item" data-path="${pathToken(itemPath)}" data-direction="-1" aria-label="حرّك العنصر لأعلى · Move item up" ${index === 0 ? "disabled" : ""}>↑</button>
                  <button class="icon-action" type="button" data-action="move-array-item" data-path="${pathToken(itemPath)}" data-direction="1" aria-label="حرّك العنصر لأسفل · Move item down" ${index === items.length - 1 ? "disabled" : ""}>↓</button>
                  <button class="admin-btn admin-btn--danger admin-btn--sm" type="button" data-action="remove-array-item" data-path="${pathToken(itemPath)}">حذف · Remove</button>
                </div>
              </div>
              <div class="form-section">${renderObjectFields(item, itemPath, depth + 1)}</div>
            </article>`;
          }
          const customLabel = locale
            ? `<span lang="${locale}">${escapeHtml(locale === "ar" ? labelsFor(key)[0] : labelsFor(key)[1])}${locale === "ar" ? "، العربية" : ", English"} ${index + 1}</span>`
            : `${labelHtml(key)} ${index + 1}`;
          return `<div class="array-row">
            ${renderScalarInput(key, item, itemPath, customLabel, locale === "ar" ? "rtl" : (locale === "en" ? "ltr" : null))}
            <div class="row-actions">
              <button class="icon-action" type="button" data-action="move-array-item" data-path="${pathToken(itemPath)}" data-direction="-1" aria-label="حرّك العنصر لأعلى · Move item up" ${index === 0 ? "disabled" : ""}>↑</button>
              <button class="icon-action" type="button" data-action="move-array-item" data-path="${pathToken(itemPath)}" data-direction="1" aria-label="حرّك العنصر لأسفل · Move item down" ${index === items.length - 1 ? "disabled" : ""}>↓</button>
              <button class="admin-btn admin-btn--danger admin-btn--sm" type="button" data-action="remove-array-item" data-path="${pathToken(itemPath)}">حذف · Remove</button>
            </div>
          </div>`;
        }).join("") : '<p class="field-help">القائمة فاضية. · Empty list.</p>'}
      </div>
      <div class="array-actions">
        <button class="admin-btn admin-btn--quiet admin-btn--sm" type="button" data-action="add-array-item" data-path="${pathToken(path)}" data-array-key="${escapeHtml(key)}" data-object-items="${hasObjects}">
          إضافة صف <span lang="en" dir="ltr">Add row</span>
        </button>
```

**dashboard/js/dashboard.js:1305-1316**

```js
  function arrayItemTemplate(key, items, path) {
    const joined = path.join(".");
    if (state.editorContext?.file === "reviews.json" && joined === "topics.items") {
      return { count: 0, label: { ar: "", en: "" } };
    }
    if (state.editorContext?.file === "reviews.json" && joined === "pending.items") {
      return deepClone(COLLECTION_TEMPLATES.reviews);
    }
    if (ARRAY_ITEM_TEMPLATES[key]) return deepClone(ARRAY_ITEM_TEMPLATES[key]);
    if (items.length) return blankLike(items[0], key);
    return "";
  }
```

The empty arrays currently in the data are safe under those routes: article `faq` and `sources` use explicit object templates; `reviews.pending.items` has the quoted special template; empty doctor `credentials.{ar,en}` and branch `gettingHere.{ar,en}` are intentionally scalar arrays. Thus the editor can add, reorder, and delete inner items, including when the current array is empty.

**E8 — both `showPrice` path families are rendered, but their checkbox is deliberately disabled.**

**dashboard/js/dashboard.js:545-551**

```js
    if (typeof value === "boolean") return key === "published";
    if (typeof value === "number") return 0;
    if (value === null) return null;
    return "";
  }

  function pathToken(path) {
```

The current data contains the product-level values at `content/digital.json:55,217` and format-level values at `content/digital.json:148,178`:

```json
      "showPrice": false,
          "showPrice": false
          "showPrice": false
      "showPrice": false,
```

### File routing result

- `site.json` and `pages.json`: Settings tabs [E3].
- `specialties.json`, `doctors.json`, `branches.json`, `articles.json`, `reviews.json`, and `digital.json`: their named collection sections [E2], with every non-group root key routed to Additional file fields [E5].
- No content file is omitted: the dashboard fetches `/api/content`, and the server iterates the complete eight-file set [E1].

| Content file | Key path | Classification |
|---|---|---|
| `site.json` | `_note` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.domain` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.kind` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.kind.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.kind.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.logo` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.logo._todo` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.logo.primary` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.logo.wordmark` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.logo.wordmarkWhite` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.name` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.name.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.name.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.shortName` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.shortName.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.shortName.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.tagline` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.tagline.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.tagline.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.wordmark` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.wordmark.line1` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `brand.wordmark.line2` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `contact` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `contact.email` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `contact.email._todo` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `contact.phone` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `contact.phone.display` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `contact.phone.tel` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `contact.whatsapp` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `contact.whatsapp.href` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `contact.whatsapp.number` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `footer` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `footer.blurb` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `footer.blurb.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `footer.blurb.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `footer.columns` | REACHABLE — Settings → `site.json`; array rows can be added, reordered, and deleted [E3, E6, E7] |
| `site.json` | `footer.columns[*].links` | REACHABLE — Settings → `site.json`; array rows can be added, reordered, and deleted [E3, E6, E7] |
| `site.json` | `footer.columns[*].linksFrom` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `footer.columns[*].links[*].href` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `footer.columns[*].links[*].label` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `footer.columns[*].links[*].label.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `footer.columns[*].links[*].label.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `footer.columns[*].title` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `footer.columns[*].title.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `footer.columns[*].title.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `footer.legal` | REACHABLE — Settings → `site.json`; array rows can be added, reordered, and deleted [E3, E6, E7] |
| `site.json` | `footer.legal[*].href` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `footer.legal[*].label` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `footer.legal[*].label.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `footer.legal[*].label.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `hours` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `hours._note` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `hours._todo` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `hours.bookingNote` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `hours.bookingNote.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `hours.bookingNote.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `hours.display` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `hours.display.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `hours.display.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `i18n` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `i18n.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `i18n.ar.altLabel` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `i18n.ar.code` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `i18n.ar.dir` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `i18n.ar.label` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `i18n.ar.locale` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `i18n.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `i18n.en.altLabel` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `i18n.en.code` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `i18n.en.dir` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `i18n.en.label` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `i18n.en.locale` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `integrations` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `integrations._note` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `integrations.formsEndpoint` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `latinTerms` | REACHABLE — Settings → `site.json`; array rows can be added, reordered, and deleted [E3, E6, E7] |
| `site.json` | `legal` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `legal.copyright` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `legal.copyright.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `legal.copyright.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `legal.disclaimer` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `legal.disclaimer.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `legal.disclaimer.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `legal.resultsVary` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `legal.resultsVary.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `legal.resultsVary.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `legal.sampleContent` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `legal.sampleContent.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `legal.sampleContent.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `media` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `media._note` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `media.homeHero` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `media.homeHero._todo` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `media.homeHero.alt` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `media.homeHero.alt.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `media.homeHero.alt.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `media.homeHero.illustrative` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `media.homeHero.src` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `nav` | REACHABLE — Settings → `site.json`; array rows can be added, reordered, and deleted [E3, E6, E7] |
| `site.json` | `nav[*].children` | REACHABLE — Settings → `site.json`; array rows can be added, reordered, and deleted [E3, E6, E7] |
| `site.json` | `nav[*].childrenFrom` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `nav[*].children[*].desc` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `nav[*].children[*].desc.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `nav[*].children[*].desc.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `nav[*].children[*].href` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `nav[*].children[*].label` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `nav[*].children[*].label.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `nav[*].children[*].label.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `nav[*].href` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `nav[*].key` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `nav[*].label` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `nav[*].label.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `nav[*].label.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `nav[*].mega` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `proof` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `proof.rating` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `proof.rating.checked` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `proof.rating.count` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `proof.rating.source` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `proof.rating.url` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `proof.rating.value` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `proof.stats` | REACHABLE — Settings → `site.json`; array rows can be added, reordered, and deleted [E3, E6, E7] |
| `site.json` | `proof.stats[*].label` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `proof.stats[*].label.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `proof.stats[*].label.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `proof.stats[*].n` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `social` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `social.instagram` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `social.instagramBeforeAfter` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `social.instagramStories` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `social.linktree` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `social.youtube` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `social.youtubeTestimonials` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.addReview` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.addReview.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.addReview.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.after` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.after.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.after.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.articles` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.articles.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.articles.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.before` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.before.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.before.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.bookNow` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.bookNow.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.bookNow.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.bookShort` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.bookShort.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.bookShort.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.calculate` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.calculate.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.calculate.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.callUs` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.callUs.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.callUs.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.clinicDays` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.clinicDays.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.clinicDays.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.close` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.close.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.close.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.comingSoon` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.comingSoon.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.comingSoon.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.conditionsTreated` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.conditionsTreated.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.conditionsTreated.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.findAppointment` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.findAppointment.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.findAppointment.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.healthTools` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.healthTools.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.healthTools.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.home` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.home.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.home.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.homeVisits` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.homeVisits.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.homeVisits.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.knowledgeCentre` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.knowledgeCentre.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.knowledgeCentre.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.learnMore` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.learnMore.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.learnMore.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.menu` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.menu.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.menu.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.onlineFollowUp` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.onlineFollowUp.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.onlineFollowUp.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.openNow` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.openNow.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.openNow.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.openingSoon` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.openingSoon.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.openingSoon.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.ourDoctors` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.ourDoctors.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.ourDoctors.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.priceOnConsult` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.priceOnConsult.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.priceOnConsult.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.publishedOn` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.publishedOn.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.publishedOn.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.qa` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.qa.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.qa.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.readMore` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.readMore.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.readMore.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.readingTime` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.readingTime.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.readingTime.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.reset` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.reset.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.reset.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.reviewedBy` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.reviewedBy.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.reviewedBy.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.sample` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.sample.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.sample.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.saveLocal` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.saveLocal.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.saveLocal.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.selectBranch` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.selectBranch.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.selectBranch.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.selectDoctor` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.selectDoctor.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.selectDoctor.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.selectSpecialty` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.selectSpecialty.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.selectSpecialty.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.skipToContent` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.skipToContent.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.skipToContent.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tabDoctors` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tabDoctors.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tabDoctors.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tabFaq` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tabFaq.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tabFaq.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tabOverview` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tabOverview.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tabOverview.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tabResults` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tabResults.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tabResults.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tabReviews` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tabReviews.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tabReviews.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tips` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tips.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.tips.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.toolDisclaimer` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.toolDisclaimer.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.toolDisclaimer.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.treatments` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.treatments.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.treatments.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.updates` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.updates.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.updates.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.viewAll` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.viewAll.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.viewAll.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.viewProfile` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.viewProfile.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.viewProfile.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.viewSpecialty` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.viewSpecialty.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.viewSpecialty.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.whatsapp` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.whatsapp.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.whatsapp.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.whatsappShort` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.whatsappShort.ar` | REACHABLE — Settings → `site.json` [E3, E6] |
| `site.json` | `ui.whatsappShort.en` | REACHABLE — Settings → `site.json` [E3, E6] |
| `specialties.json` | `_note` | REACHABLE — Specialties → Additional file fields [E5, E6] |
| `specialties.json` | `specialties` | REACHABLE — Specialties → Specialties; collection items can be added, reordered, and deleted [E2, E4] |
| `specialties.json` | `specialties[*].faq` | REACHABLE — Specialties → Specialties; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `specialties.json` | `specialties[*].faq[*].a` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].faq[*].a.ar` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].faq[*].a.en` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].faq[*].q` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].faq[*].q.ar` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].faq[*].q.en` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].featured` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].hasBeforeAfter` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].hasReviews` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].icon` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].index` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].intro` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].intro.ar` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].intro.en` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].name` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].name.ar` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].name.en` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].published` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].seo` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].seo.description` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].seo.description.ar` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].seo.description.en` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].seo.title` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].seo.title.ar` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].seo.title.en` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].short` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].short.ar` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].short.en` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].slug` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].staffed` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].sub` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].sub.ar` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].sub.en` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].treatments` | REACHABLE — Specialties → Specialties; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `specialties.json` | `specialties[*].treatments[*].body` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].treatments[*].body.ar` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].treatments[*].body.en` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].treatments[*].facts` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].treatments[*].facts.ar` | REACHABLE — Specialties → Specialties; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `specialties.json` | `specialties[*].treatments[*].facts.en` | REACHABLE — Specialties → Specialties; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `specialties.json` | `specialties[*].treatments[*].name` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].treatments[*].name.ar` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].treatments[*].name.en` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].treatments[*].slug` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].treatments[*].summary` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].treatments[*].summary.ar` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].treatments[*].summary.en` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].treats` | REACHABLE — Specialties → Specialties [E4, E6] |
| `specialties.json` | `specialties[*].treats.ar` | REACHABLE — Specialties → Specialties; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `specialties.json` | `specialties[*].treats.en` | REACHABLE — Specialties → Specialties; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `doctors.json` | `_note` | REACHABLE — Doctors → Additional file fields [E5, E6] |
| `doctors.json` | `doctors` | REACHABLE — Doctors → Doctors; collection items can be added, reordered, and deleted [E2, E4] |
| `doctors.json` | `doctors[*]._evidence` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*]._source` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*]._todo` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].bio` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].bio.ar` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].bio.en` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].branches` | REACHABLE — Doctors → Doctors; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `doctors.json` | `doctors[*].credentials` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].credentials.ar` | REACHABLE — Doctors → Doctors; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `doctors.json` | `doctors[*].credentials.en` | REACHABLE — Doctors → Doctors; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `doctors.json` | `doctors[*].days` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].days.ar` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].days.en` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].ekshefClinicId` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].featured` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].hours` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].hours.ar` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].hours.en` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].name` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].name.ar` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].name.en` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].portrait` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].portrait2x` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].portraitPlaceholder` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].published` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].sample` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].slug` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].specialties` | REACHABLE — Doctors → Doctors; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `doctors.json` | `doctors[*].title` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].title.ar` | REACHABLE — Doctors → Doctors [E4, E6] |
| `doctors.json` | `doctors[*].title.en` | REACHABLE — Doctors → Doctors [E4, E6] |
| `branches.json` | `_note` | REACHABLE — Branches → Additional file fields [E5, E6] |
| `branches.json` | `branches` | REACHABLE — Branches → Branches; collection items can be added, reordered, and deleted [E2, E4] |
| `branches.json` | `branches[*]._todo` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*]._todoAddress` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].address` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].address.ar` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].address.en` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].area` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].area.ar` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].area.en` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].city` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].city.ar` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].city.en` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].country` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].country.ar` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].country.en` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].geo` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].geo.lat` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].geo.lng` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].gettingHere` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].gettingHere.ar` | REACHABLE — Branches → Branches; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `branches.json` | `branches[*].gettingHere.en` | REACHABLE — Branches → Branches; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `branches.json` | `branches[*].hours` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].hours.ar` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].hours.en` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].intro` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].intro.ar` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].intro.en` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].isPrimary` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].landmark` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].landmark.ar` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].landmark.en` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].mapsUrl` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].name` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].name.ar` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].name.en` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].phone` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].phone.display` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].phone.tel` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].photos` | REACHABLE — Branches → Branches; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `branches.json` | `branches[*].photos[*].alt` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].photos[*].alt.ar` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].photos[*].alt.en` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].photos[*].placeholder` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].photos[*].src` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].plusCode` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].published` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].shortName` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].shortName.ar` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].shortName.en` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].slug` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].specialties` | REACHABLE — Branches → Branches; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `branches.json` | `branches[*].status` | REACHABLE — Branches → Branches [E4, E6] |
| `branches.json` | `branches[*].whatsapp` | REACHABLE — Branches → Branches [E4, E6] |
| `articles.json` | `_note` | REACHABLE — Articles & Knowledge → Additional file fields [E5, E6] |
| `articles.json` | `_todoBylines` | REACHABLE — Articles & Knowledge → Additional file fields [E5, E6] |
| `articles.json` | `articles` | REACHABLE — Articles & Knowledge → Knowledge entries; collection items can be added, reordered, and deleted [E2, E4] |
| `articles.json` | `articles[*]._todoReview` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].author` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].category` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].date` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].excerpt` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].excerpt.ar` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].excerpt.en` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].faq` | REACHABLE — Articles & Knowledge → Knowledge entries; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `articles.json` | `articles[*].faq[*].a` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].faq[*].a.ar` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].faq[*].a.en` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].faq[*].q` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].faq[*].q.ar` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].faq[*].q.en` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].featured` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].image` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].imagePlaceholder` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].published` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].readingTime` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].reviewedBy` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].sections` | REACHABLE — Articles & Knowledge → Knowledge entries; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `articles.json` | `articles[*].sections[*].body` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].sections[*].body.ar` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].sections[*].body.en` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].sections[*].heading` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].sections[*].heading.ar` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].sections[*].heading.en` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].sections[*].id` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].slug` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].sources` | REACHABLE — Articles & Knowledge → Knowledge entries; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `articles.json` | `articles[*].sources[*].label` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].sources[*].url` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].specialties` | REACHABLE — Articles & Knowledge → Knowledge entries; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `articles.json` | `articles[*].tags` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].tags.ar` | REACHABLE — Articles & Knowledge → Knowledge entries; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `articles.json` | `articles[*].tags.en` | REACHABLE — Articles & Knowledge → Knowledge entries; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `articles.json` | `articles[*].title` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].title.ar` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].title.en` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `articles[*].type` | REACHABLE — Articles & Knowledge → Knowledge entries [E4, E6] |
| `articles.json` | `categories` | REACHABLE — Articles & Knowledge → Categories; collection items can be added, reordered, and deleted [E2, E4] |
| `articles.json` | `categories[*].desc` | REACHABLE — Articles & Knowledge → Categories [E4, E6] |
| `articles.json` | `categories[*].desc.ar` | REACHABLE — Articles & Knowledge → Categories [E4, E6] |
| `articles.json` | `categories[*].desc.en` | REACHABLE — Articles & Knowledge → Categories [E4, E6] |
| `articles.json` | `categories[*].name` | REACHABLE — Articles & Knowledge → Categories [E4, E6] |
| `articles.json` | `categories[*].name.ar` | REACHABLE — Articles & Knowledge → Categories [E4, E6] |
| `articles.json` | `categories[*].name.en` | REACHABLE — Articles & Knowledge → Categories [E4, E6] |
| `articles.json` | `categories[*].slug` | REACHABLE — Articles & Knowledge → Categories [E4, E6] |
| `articles.json` | `categories[*].specialty` | REACHABLE — Articles & Knowledge → Categories [E4, E6] |
| `reviews.json` | `_note` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `aggregate` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `aggregate.checked` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `aggregate.count` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `aggregate.source` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `aggregate.url` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `aggregate.value` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `beforeAfter` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `beforeAfter._note` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `beforeAfter.pairs` | REACHABLE — Reviews → Additional file fields; nested rows can be added, reordered, and deleted [E5, E6, E7] |
| `reviews.json` | `beforeAfter.pairs[*].after` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `beforeAfter.pairs[*].before` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `beforeAfter.pairs[*].sample` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `beforeAfter.pairs[*].slug` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `beforeAfter.pairs[*].specialty` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `pending` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `pending._note` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `pending.items` | REACHABLE — Reviews → Additional file fields; nested rows can be added, reordered, and deleted [E5, E6, E7] |
| `reviews.json` | `reviews` | REACHABLE — Reviews → Reviews; collection items can be added, reordered, and deleted [E2, E4] |
| `reviews.json` | `topics` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `topics._note` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `topics.items` | REACHABLE — Reviews → Additional file fields; nested rows can be added, reordered, and deleted [E5, E6, E7] |
| `reviews.json` | `topics.items[*].count` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `topics.items[*].label` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `topics.items[*].label.ar` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `reviews.json` | `topics.items[*].label.en` | REACHABLE — Reviews → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing._note` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing.onlineGroup` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing.onlineGroup.currency` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing.onlineGroup.offer` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing.onlineGroup.period` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing.onlineGroup.was` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing.onlinePrivate3Months` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing.onlinePrivate3Months.currency` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing.onlinePrivate3Months.offer` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing.onlinePrivate3Months.was` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing.onlinePrivateMonth` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing.onlinePrivateMonth.currency` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing.onlinePrivateMonth.offer` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing.onlinePrivateMonth.was` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing.recipeBook` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_internalPricing.recipeBook._todo` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `_note` | REACHABLE — Digital products → Additional file fields [E5, E6] |
| `digital.json` | `products` | REACHABLE — Digital products → Digital products; collection items can be added, reordered, and deleted [E2, E4] |
| `digital.json` | `products[*]._todo` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].audience` | REACHABLE — Digital products → Digital products; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `digital.json` | `products[*].audience[*].ar` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].audience[*].en` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].cta` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].cta.ar` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].cta.en` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].faq` | REACHABLE — Digital products → Digital products; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `digital.json` | `products[*].faq[*].a` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].faq[*].a.ar` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].faq[*].a.en` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].faq[*].q` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].faq[*].q.ar` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].faq[*].q.en` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].featured` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].formats` | REACHABLE — Digital products → Digital products; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `digital.json` | `products[*].formats[*].includes` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].formats[*].includes.ar` | REACHABLE — Digital products → Digital products; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `digital.json` | `products[*].formats[*].includes.en` | REACHABLE — Digital products → Digital products; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `digital.json` | `products[*].formats[*].name` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].formats[*].name.ar` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].formats[*].name.en` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].formats[*].showPrice` | READ-ONLY — Digital products → Digital products; disabled checkbox [E8] |
| `digital.json` | `products[*].formats[*].slug` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].formats[*].summary` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].formats[*].summary.ar` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].formats[*].summary.en` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].icon` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].image` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].inside` | REACHABLE — Digital products → Digital products; nested rows can be added, reordered, and deleted [E4, E6, E7] |
| `digital.json` | `products[*].inside[*].ar` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].inside[*].en` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].lede` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].lede.ar` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].lede.en` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].name` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].name.ar` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].name.en` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].published` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].short` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].short.ar` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].short.en` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].showPrice` | READ-ONLY — Digital products → Digital products; disabled checkbox [E8] |
| `digital.json` | `products[*].slug` | REACHABLE — Digital products → Digital products [E4, E6] |
| `digital.json` | `products[*].type` | REACHABLE — Digital products → Digital products [E4, E6] |
| `pages.json` | `_note` | REACHABLE — Settings → `pages.json` [E3, E6] |

## Defects

There are no unreachable paths. The two read-only path families are deliberate safety controls, not accidental omissions:

- **Path:** `digital.json → products[*].showPrice`
  - **Why it matters:** The clinic editor can see the switch but cannot enable public product pricing. That matches the project’s explicit no-public-prices decision; the server also rejects any value other than `false`.
  - **Fix:** None recommended while that decision stands. If the client reverses it, the smallest complete change is coordinated: enable this checkbox and change the matching server and build price guards together. Removing only `disabled` would still make every save fail.

- **Path:** `digital.json → products[*].formats[*].showPrice`
  - **Why it matters:** The clinic editor cannot enable public pricing for an individual format. This is the same intentional safety boundary.
  - **Fix:** None recommended while public prices remain prohibited. A future policy change requires the same coordinated dashboard, server, and build-validator change.

### Other validation-feedback gaps

These do not change the reachability count, but they are ways an editor can damage or silently suppress site content without a targeted validation message.

The complete server-side content validator only applies generic price, URL-suffix, date, email, and coordinate checks, plus the quoted top-level collection rules:

**server/serve.mjs:119-204**

```js
function validateContent(file, data) {
  const errors = [];
  if (!isObject(data)) return ["The content root must be a JSON object."];

  const walk = (value, pointer = "") => {
    if (Array.isArray(value)) return value.forEach((child, index) => walk(child, `${pointer}[${index}]`));
    if (!isObject(value)) return;
    for (const [key, child] of Object.entries(value)) {
      const next = pointer ? `${pointer}.${key}` : key;
      if (key === "showPrice" && child !== false) errors.push(`${next} must remain false.`);
      /* Prices never appear publicly - the client's decision. tools/validate.mjs
         catches one in the built HTML, but only after the file is on disk. Same
         pattern, applied on save, so the person who typed it is told while the
         page is still open. The pricing subtree is where real figures belong,
         so it is excluded rather than flagged. */
      if (typeof child === "string" && child && !PRICING_PATH.test(next)) {
        const leak = PRICE_LEAK.exec(child);
        if (leak) errors.push(`${next} looks like it contains a price ("${leak[0].trim()}"). Prices are never shown publicly.`);
      }
      if (/url$/i.test(key) && typeof child === "string" && child && !/^https?:\/\//i.test(child)) {
        errors.push(`${next} must be a complete http(s) URL.`);
      }
      if (key === "date" && typeof child === "string" && child && !/^\d{4}-\d{2}-\d{2}$/.test(child)) {
        errors.push(`${next} must use YYYY-MM-DD.`);
      }
      if (key === "checked" && typeof child === "string" && child && !/^\d{4}-\d{2}$/.test(child)) {
        errors.push(`${next} must use YYYY-MM.`);
      }
      if (/email/i.test(key) && typeof child === "string" && child && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(child)) {
        errors.push(`${next} must be a valid email address.`);
      }
      if (key === "lat" && child !== null && (!Number.isFinite(child) || child < -90 || child > 90)) {
        errors.push(`${next} must be between -90 and 90.`);
      }
      if (key === "lng" && child !== null && (!Number.isFinite(child) || child < -180 || child > 180)) {
        errors.push(`${next} must be between -180 and 180.`);
      }
      walk(child, next);
    }
  };
  walk(data);

  for (const rule of COLLECTION_RULES[file] || []) {
    const items = data[rule.key];
    if (!Array.isArray(items)) {
      errors.push(`${rule.key} must be an array.`);
      continue;
    }
    const seen = new Set();
    items.forEach((item, index) => {
      if (!isObject(item)) {
        errors.push(`${rule.key}[${index}] must be an object.`);
        return;
      }
      const required = [...rule.required];
      if (rule.key === "reviews" && item.published === true) {
        required.push("name.ar", "name.en", "text.ar", "text.en");
      }
      for (const requiredPath of required) {
        const value = valueAt(item, requiredPath);
        if (typeof value !== "string" || !value.trim()) {
          errors.push(`${rule.key}[${index}].${requiredPath} is required.`);
        }
      }
      const identifier = item[rule.id];
      if (typeof identifier === "string" && identifier) {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(identifier)) {
          errors.push(`${rule.key}[${index}].${rule.id} must use lowercase Latin letters, numbers, and hyphens.`);
        }
        if (seen.has(identifier)) errors.push(`${rule.key}.${rule.id} "${identifier}" is duplicated.`);
        seen.add(identifier);
      }
      if (Object.hasOwn(item, "published") && typeof item.published !== "boolean") {
        errors.push(`${rule.key}[${index}].published must be true or false.`);
      }
      if (Object.hasOwn(item, "rating") && (!Number.isFinite(item.rating) || item.rating < 1 || item.rating > 5)) {
        errors.push(`${rule.key}[${index}].rating must be between 1 and 5.`);
      }
      if (Object.hasOwn(item, "readingTime") && (!Number.isFinite(item.readingTime) || item.readingTime < 0)) {
        errors.push(`${rule.key}[${index}].readingTime must be zero or greater.`);
      }
    });
  }

  return errors;
}
```

- **Path:** `doctors[*].branches[*]`, `doctors[*].specialties[*]`, `branches[*].specialties[*]`, `categories[*].specialty`, `articles[*].category`, `articles[*].specialties[*]`, `beforeAfter.pairs[*].specialty`
  - **Why it matters:** These are cross-file slug references, but neither the generic walk nor `COLLECTION_RULES` verifies that the referenced branch, specialty, or category exists. A typo can remove a relationship from generated content or produce an indirect build symptom without identifying the field that caused it.
  - **Fix:** Add membership checks in `validateContent` against the referenced collections and mirror them in `validateFile`, returning the exact offending path.

- **Path:** non-required bilingual pairs across `site.json`, specialty copy, doctor details, branch copy, article sections/FAQ/tags, review topics, and digital-product copy
  - **Why it matters:** Required checks cover only the small set in `COLLECTION_RULES`; an editor can erase one language from most `{ar,en}` pairs and still save successfully, leaving one language incomplete.
  - **Fix:** Add one recursive bilingual-pair rule: for published/used content, require both language values (and matching array/object shapes); mirror it client-side so the field is focused before the PUT.

- **Path:** `specialties[*].treatments[*]`, `specialties[*].faq[*]`, `branches[*].photos[*]`, `articles[*].sections[*]`, `articles[*].faq[*]`, `articles[*].sources[*]`, `beforeAfter.pairs[*]`, `topics.items[*]`, `products[*].formats[*]`, `products[*].inside[*]`, `products[*].audience[*]`, `products[*].faq[*]`
  - **Why it matters:** The controls correctly create and manage these rows [E7], but the server validates required fields only on top-level collection items. Blank treatment, FAQ, section, source, photo, pair, topic, format, audience, or inside rows can therefore be saved without a row-specific error.
  - **Fix:** Add compact per-array required-field schemas to the shared dashboard/server validation rules; reject a partially filled row and optionally ignore a wholly blank draft row.

- **Path:** `site.json → brand.domain`, `contact.phone.tel`, `contact.whatsapp.{number,href}`, `social.{instagram,instagramBeforeAfter,instagramStories,linktree,youtube,youtubeTestimonials}`, `integrations.formsEndpoint`; `branches[*].phone.tel`, `branches[*].whatsapp`; `doctors[*].ekshefClinicId`
  - **Why it matters:** These fields drive canonical URLs, calls, WhatsApp, social links, form delivery, and external booking. The quoted validator checks only keys ending in `url` for an HTTP(S) prefix and has no checks for these explicit key names, so malformed values receive no targeted feedback.
  - **Fix:** Add an explicit allowlist of destination/identifier paths with hostname, HTTP(S), telephone, WhatsApp-number, and positive-ID checks; use matching input types and constraints in the dashboard.

- **Path:** `site.json → nav[*].childrenFrom`, `footer.columns[*].linksFrom`
  - **Why it matters:** These strings choose generated data sources. Unsupported values can silently empty a dynamic navigation/footer group, and they are not constrained by an enum or server rule.
  - **Fix:** Render these two fields as selects backed by the supported source names and reject any other value on save.

By contrast, dead internal `href` and missing generated assets do receive post-save pipeline feedback: the build validator checks every generated `href`/`src` and reports a dead link. The weakness is timing—the file is already saved—not absence of feedback.

**tools/validate.mjs:60-70**

```js
  /* ---- 1. internal links resolve --------------------------------------- */
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = m[1];
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(raw)) continue;
    const clean = raw.split("#")[0].split("?")[0];
    if (!clean) continue;
    let target = path.resolve(dir, clean);
    if (!fs.existsSync(target)) {
      if (fs.existsSync(path.join(target, "index.html"))) continue;
      add(rel, "ERROR", `dead link → ${raw}`);
    }
```

The dashboard then exposes that pipeline output to the editor:

**dashboard/js/dashboard.js:1751-1759**

```js
        const details = [pipeline?.build?.err, pipeline?.validation?.out, pipeline?.validation?.err].filter(Boolean).join("\n")
          || "لم يرجع الخادم نتيجة فحص ناجحة. · The server did not report a successful verification.";
        message = `تم حفظ ${file} ونسخه احتياطياً، لكن البناء أو الفحص فشل. التعديل محفوظ ولم يضع. · Saved and backed up, but build or validation failed. The edit is preserved.`;
        setOperation(message, "error", details);
        announce(message, "error");
      }
      await refreshStatus();
      render();
      setFormMessage(message, pipeline?.ok ? "success" : "error");
```

## Labels added

The fallback being eliminated is quoted here:

**dashboard/js/dashboard.js:509-511**

```js
  function labelsFor(key) {
    return FIELD_LABELS[key] || [humanise(key), humanise(key)];
  }
```

**82 labels added.** These are the 82 keys that actually reached `labelsFor` without a `FIELD_LABELS` entry before this change. (Root collection keys `doctors` and `reviews` were not counted because their collection headings come from `COLLECTION_SECTIONS`, not `labelsFor`.) No existing label was renamed, removed, or reordered.

- `_todoAddress`
- `_todoBylines`
- `_todoReview`
- `addReview`
- `altLabel`
- `ar`
- `blurb`
- `bookNow`
- `bookShort`
- `bookingNote`
- `brand`
- `calculate`
- `callUs`
- `clinicDays`
- `close`
- `code`
- `comingSoon`
- `conditionsTreated`
- `copyright`
- `dir`
- `disclaimer`
- `ekshefClinicId`
- `en`
- `findAppointment`
- `formsEndpoint`
- `healthTools`
- `home`
- `homeHero`
- `homeVisits`
- `instagram`
- `instagramBeforeAfter`
- `instagramStories`
- `integrations`
- `key`
- `knowledgeCentre`
- `latinTerms`
- `learnMore`
- `line1`
- `line2`
- `linktree`
- `locale`
- `menu`
- `n`
- `number`
- `onlineFollowUp`
- `onlineGroup`
- `onlinePrivate3Months`
- `onlinePrivateMonth`
- `openNow`
- `openingSoon`
- `ourDoctors`
- `placeholder`
- `priceOnConsult`
- `primary`
- `publishedOn`
- `qa`
- `readMore`
- `recipeBook`
- `reset`
- `resultsVary`
- `sampleContent`
- `saveLocal`
- `selectBranch`
- `selectDoctor`
- `selectSpecialty`
- `skipToContent`
- `specialty`
- `tabDoctors`
- `tabFaq`
- `tabOverview`
- `tabResults`
- `tabReviews`
- `tips`
- `toolDisclaimer`
- `updates`
- `viewAll`
- `viewProfile`
- `viewSpecialty`
- `whatsappShort`
- `wordmarkWhite`
- `youtube`
- `youtubeTestimonials`

UNREACHABLE PATHS: 0
