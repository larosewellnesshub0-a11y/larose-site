(() => {
  "use strict";

  /* These paths deliberately match COLLECTION_RULES in server/serve.mjs. The
     dashboard must describe completeness the same way the save endpoint does. */
  const REQUIRED_FIELDS = Object.freeze({
    "specialties.json": [{ key: "specialties", required: ["slug", "name.ar", "name.en"] }],
    "doctors.json": [{ key: "doctors", required: ["slug", "name.ar", "name.en"] }],
    "branches.json": [{ key: "branches", required: ["slug", "status", "name.ar", "name.en"] }],
    "articles.json": [
      { key: "categories", required: ["slug", "name.ar", "name.en"] },
      { key: "articles", required: ["slug", "type", "category", "title.ar", "title.en"] },
    ],
    "reviews.json": [{ key: "reviews", required: ["id"] }],
    "digital.json": [{ key: "products", required: ["slug", "type", "name.ar", "name.en"] }],
  });

  const FILE_LABELS = {
    "site.json": { ar: "إعدادات الموقع", en: "Site settings" },
    "specialties.json": { ar: "التخصصات", en: "Specialties" },
    "doctors.json": { ar: "الأطباء", en: "Doctors" },
    "branches.json": { ar: "الفروع", en: "Branches" },
    "articles.json": { ar: "المقالات والمعرفة", en: "Articles & Knowledge" },
    "reviews.json": { ar: "الآراء", en: "Reviews" },
    "digital.json": { ar: "المنتجات الرقمية", en: "Digital products" },
    "pages.json": { ar: "إعدادات الصفحات", en: "Page settings" },
  };

  const TYPE_LABELS = {
    article: { ar: "مقال", en: "Article" },
    update: { ar: "تحديث", en: "Update" },
    qa: { ar: "سؤال وجواب", en: "Q&A" },
    tip: { ar: "نصيحة", en: "Tip" },
  };

  const FILE_ORDER = [
    "site.json",
    "specialties.json",
    "doctors.json",
    "branches.json",
    "articles.json",
    "reviews.json",
    "digital.json",
    "pages.json",
  ];

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function bilingualText(ar, en) {
    return `${ar} · ${en}`;
  }

  function bilingualHtml(ar, en) {
    return `${escapeHtml(ar)} <small lang="en" dir="ltr">${escapeHtml(en)}</small>`;
  }

  /* SVG text does not inherit the HTML page's alignment rules consistently.
     Give both lines the same x position and text-anchor explicitly: Arabic is
     always first, and the English gloss is deliberately smaller underneath. */
  function svgBilingualLabel(ar, en, { x, y, anchor = "start", className = "analytics-svg__label" }) {
    return `<text class="${className}" x="${x}" y="${y}" text-anchor="${anchor}" direction="ltr">
      <tspan lang="ar" unicode-bidi="isolate" x="${x}">${escapeHtml(`\u2067${ar}\u2069`)}</tspan>
      <tspan class="analytics-svg__english" lang="en" unicode-bidi="isolate" x="${x}" dy="1.25em">${escapeHtml(`\u2066${en}\u2069`)}</tspan>
    </text>`;
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function valueAt(root, dottedPath) {
    return dottedPath.split(".").reduce((value, key) => value?.[key], root);
  }

  function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function hasText(value) {
    if (typeof value === "string") return Boolean(value.trim());
    if (isObject(value) && typeof value.slug === "string") return Boolean(value.slug.trim());
    if (isObject(value)) {
      return [value.ar, value.en].some((part) => typeof part === "string" && Boolean(part.trim()));
    }
    return false;
  }

  function hasBilingualText(value) {
    return isObject(value)
      && typeof value.ar === "string" && Boolean(value.ar.trim())
      && typeof value.en === "string" && Boolean(value.en.trim());
  }

  function hasOutstandingValue(value) {
    if (typeof value === "string") return Boolean(value.trim());
    if (Array.isArray(value)) return value.some(hasOutstandingValue);
    if (isObject(value)) return Object.values(value).some(hasOutstandingValue);
    return value !== null && value !== undefined && value !== false;
  }

  function countTodos(value) {
    if (Array.isArray(value)) return value.reduce((total, child) => total + countTodos(child), 0);
    if (!isObject(value)) return 0;
    return Object.entries(value).reduce((total, [key, child]) => {
      if (key === "_todo") return total + (hasOutstandingValue(child) ? 1 : 0);
      return total + countTodos(child);
    }, 0);
  }

  function fileLabel(file) {
    return FILE_LABELS[file] || { ar: "ملف محتوى", en: `Content file (${file})` };
  }

  function labelFrom(value, fallbackAr, fallbackEn) {
    return {
      ar: String(value?.ar || fallbackAr),
      en: String(value?.en || fallbackEn),
    };
  }

  function niceMaximum(value) {
    if (!Number.isFinite(value) || value <= 1) return 1;
    if (value <= 5) return Math.ceil(value);
    const magnitude = 10 ** Math.floor(Math.log10(value));
    const scaled = value / magnitude;
    const step = scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10;
    return step * magnitude;
  }

  function tickValues(maximum) {
    if (Number.isInteger(maximum) && maximum <= 5) {
      return Array.from({ length: maximum + 1 }, (_, index) => index);
    }
    const ticks = [0, maximum * .25, maximum * .5, maximum * .75, maximum]
      .map((value) => Math.round(value * 100) / 100);
    return [...new Set(ticks)];
  }

  function barClass(index) {
    return `analytics-svg__bar analytics-svg__bar--${index % 4}`;
  }

  function tooltip(label, value) {
    return `<title>${escapeHtml(`${bilingualText(label.ar, label.en)}: ${value}`)}</title>`;
  }

  function chartHasValues(rows) {
    return rows.some((row) => Number(row.value) > 0);
  }

  function chartAriaLabel(titleAr, titleEn, rows, valueLabel = (row) => row.value) {
    const figures = rows.map((row) => `${bilingualText(row.label.ar, row.label.en)}: ${valueLabel(row)}`).join("; ");
    return `${bilingualText(titleAr, titleEn)}. ${figures || bilingualText("لا توجد بيانات", "No data")}`;
  }

  function dataTable({ captionAr, captionEn, headers, rows }) {
    return `<div class="visually-hidden">
      <table>
        <caption>${escapeHtml(bilingualText(captionAr, captionEn))}</caption>
        <thead><tr>${headers.map((header) => `<th scope="col">${escapeHtml(bilingualText(header.ar, header.en))}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((row) => `<tr>${row.map((cell, index) => `<${index === 0 ? "th scope=\"row\"" : "td"}>${escapeHtml(cell)}</${index === 0 ? "th" : "td"}>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>`;
  }

  function verticalBarChart(rows, options) {
    const hasData = options.hasData ?? chartHasValues(rows);
    if (!rows.length || !hasData) {
      return emptyChart(options.titleAr, options.titleEn, options.emptyAr, options.emptyEn);
    }
    const width = Math.max(560, rows.length * 118 + 90);
    const height = 330;
    const left = 55;
    const right = 24;
    const top = 48;
    const bottom = 102;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const actualMaximum = Math.max(0, ...rows.map((row) => Number(row.value) || 0));
    const maximum = options.maximum || niceMaximum(actualMaximum);
    const band = plotWidth / Math.max(rows.length, 1);
    const barWidth = Math.min(68, band * .58);
    const ticks = tickValues(maximum);
    const ariaLabel = chartAriaLabel(options.titleAr, options.titleEn, rows, options.valueLabel);

    return `<div class="analytics-chart-scroll" tabindex="0" aria-label="${escapeHtml(bilingualText("مرّر أفقياً لو لزم", "Scroll horizontally if needed"))}">
      <svg class="analytics-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(ariaLabel)}">
        ${svgBilingualLabel(options.valueAxisAr, options.valueAxisEn, { x: left, y: 16, className: "analytics-svg__axis-title" })}
        ${ticks.map((tick) => {
          const y = top + plotHeight - (tick / maximum) * plotHeight;
          return `<line class="analytics-svg__grid" x1="${left}" y1="${y}" x2="${width - right}" y2="${y}"></line>
            <text class="analytics-svg__tick analytics-svg__number" x="${left - 9}" y="${y + 4}" text-anchor="end">${tick}</text>`;
        }).join("")}
        ${rows.map((row, index) => {
          const value = Math.max(0, Number(row.value) || 0);
          const x = left + band * index + (band - barWidth) / 2;
          const barHeight = (value / maximum) * plotHeight;
          const y = top + plotHeight - barHeight;
          return `<rect class="${barClass(index)}" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="5">${tooltip(row.label, options.valueLabel(row))}</rect>
            <text class="analytics-svg__value analytics-svg__number" x="${x + barWidth / 2}" y="${Math.max(top - 6, y - 8)}" text-anchor="middle">${escapeHtml(options.valueLabel(row))}</text>
            ${svgBilingualLabel(row.label.ar, row.label.en, { x: x + barWidth / 2, y: height - 65, anchor: "middle" })}`;
        }).join("")}
        ${svgBilingualLabel(options.categoryAxisAr, options.categoryAxisEn, { x: left + plotWidth / 2, y: height - 28, anchor: "middle", className: "analytics-svg__axis-title" })}
      </svg>
    </div>`;
  }

  function horizontalBarChart(rows, options) {
    const hasData = options.hasData ?? chartHasValues(rows);
    if (!rows.length || !hasData) {
      return emptyChart(options.titleAr, options.titleEn, options.emptyAr, options.emptyEn);
    }
    const width = 780;
    const left = 285;
    const right = 70;
    const top = 54;
    const rowHeight = 58;
    const bottom = 42;
    const height = Math.max(150, top + rows.length * rowHeight + bottom);
    const plotWidth = width - left - right;
    const actualMaximum = Math.max(0, ...rows.map((row) => Number(row.value) || 0));
    const maximum = options.maximum || niceMaximum(actualMaximum);
    const ticks = tickValues(maximum);
    const ariaLabel = chartAriaLabel(options.titleAr, options.titleEn, rows, options.valueLabel);

    return `<div class="analytics-chart-scroll" tabindex="0" aria-label="${escapeHtml(bilingualText("مرّر أفقياً لو لزم", "Scroll horizontally if needed"))}">
      <svg class="analytics-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(ariaLabel)}">
        ${svgBilingualLabel(options.categoryAxisAr, options.categoryAxisEn, { x: left - 12, y: 16, anchor: "end", className: "analytics-svg__axis-title" })}
        ${svgBilingualLabel(options.valueAxisAr, options.valueAxisEn, { x: left, y: 16, className: "analytics-svg__axis-title" })}
        ${ticks.map((tick) => {
          const x = left + (tick / maximum) * plotWidth;
          const label = options.percent ? `${tick}%` : tick;
          return `<line class="analytics-svg__grid" x1="${x}" y1="${top - 5}" x2="${x}" y2="${height - bottom + 4}"></line>
            <text class="analytics-svg__tick analytics-svg__number" x="${x}" y="${height - 12}" text-anchor="middle">${label}</text>`;
        }).join("")}
        ${rows.map((row, index) => {
          const numericValue = Number.isFinite(row.value) ? Math.max(0, row.value) : 0;
          const y = top + index * rowHeight;
          const barWidth = (numericValue / maximum) * plotWidth;
          return `${svgBilingualLabel(row.label.ar, row.label.en, { x: left - 12, y: y + 13, anchor: "end" })}
            <rect class="analytics-svg__track" x="${left}" y="${y + 6}" width="${plotWidth}" height="24" rx="5"></rect>
            <rect class="${barClass(index)}" x="${left}" y="${y + 6}" width="${barWidth}" height="24" rx="5">${tooltip(row.label, options.valueLabel(row))}</rect>
            <text class="analytics-svg__value analytics-svg__number" x="${Math.min(width - 4, left + barWidth + 9)}" y="${y + 23}">${escapeHtml(options.valueLabel(row))}</text>`;
        }).join("")}
      </svg>
    </div>`;
  }

  function emptyChart(titleAr, titleEn, messageAr = "لا توجد بيانات حالياً", messageEn = "No data yet") {
    const label = `${bilingualText(titleAr, titleEn)}. ${bilingualText(messageAr, messageEn)}`;
    return `<div class="analytics-chart-scroll">
      <svg class="analytics-svg analytics-svg--empty" width="560" height="150" viewBox="0 0 560 150" role="img" aria-label="${escapeHtml(label)}">
        <rect class="analytics-svg__empty-box" x="20" y="20" width="520" height="110" rx="10"></rect>
        ${svgBilingualLabel(messageAr, messageEn, { x: 280, y: 72, anchor: "middle", className: "analytics-svg__empty-text" })}
      </svg>
    </div>`;
  }

  function stackedCoverageChart(rows, titleAr, titleEn) {
    const width = 700;
    const height = 160;
    const left = 50;
    const right = 50;
    const barY = 56;
    const barHeight = 42;
    const plotWidth = width - left - right;
    const total = rows.reduce((sum, row) => sum + row.value, 0);
    if (!total) return emptyChart(titleAr, titleEn);

    let cursor = left;
    const segments = rows.map((row, index) => {
      const segmentWidth = (row.value / total) * plotWidth;
      const currentX = cursor;
      cursor += segmentWidth;
      return `<rect class="analytics-svg__series" x="${currentX}" y="${barY}" width="${segmentWidth}" height="${barHeight}" fill="url(#analytics-coverage-pattern-series-${index % 4})">${tooltip(row.label, row.value)}</rect>
        ${segmentWidth >= 38 ? `<text class="analytics-svg__segment-value analytics-svg__number" x="${currentX + segmentWidth / 2}" y="${barY + 27}" text-anchor="middle">${row.value}</text>` : ""}`;
    }).join("");
    const ariaLabel = chartAriaLabel(titleAr, titleEn, rows);

    return `<div class="analytics-chart-scroll" tabindex="0" aria-label="${escapeHtml(bilingualText("مرّر أفقياً لو لزم", "Scroll horizontally if needed"))}">
      <svg class="analytics-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(ariaLabel)}">
        ${seriesPatternDefs("analytics-coverage-pattern")}
        <defs><clipPath id="analytics-coverage-clip"><rect x="${left}" y="${barY}" width="${plotWidth}" height="${barHeight}" rx="6"></rect></clipPath></defs>
        ${svgBilingualLabel("نسبة إدخالات المعرفة", "Share of knowledge entries", { x: left, y: 18, className: "analytics-svg__axis-title" })}
        <rect class="analytics-svg__track" x="${left}" y="${barY}" width="${plotWidth}" height="${barHeight}" rx="6"></rect>
        <g clip-path="url(#analytics-coverage-clip)">${segments}</g>
        <text class="analytics-svg__tick analytics-svg__number" x="${left}" y="${barY + barHeight + 24}" text-anchor="middle">0%</text>
        <text class="analytics-svg__tick analytics-svg__number" x="${left + plotWidth / 2}" y="${barY + barHeight + 24}" text-anchor="middle">50%</text>
        <text class="analytics-svg__tick analytics-svg__number" x="${left + plotWidth}" y="${barY + barHeight + 24}" text-anchor="middle">100%</text>
      </svg>
    </div>`;
  }

  function timelineChart(rows, titleAr, titleEn) {
    if (!rows.length) return emptyChart(titleAr, titleEn);
    const width = Math.max(620, rows.length * 145 + 100);
    const height = 330;
    const left = 58;
    const right = 28;
    const top = 48;
    const bottom = 102;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const maximum = niceMaximum(Math.max(...rows.map((row) => row.value)));
    const ticks = tickValues(maximum);
    const points = rows.map((row, index) => {
      const x = rows.length === 1 ? left + plotWidth / 2 : left + (index / (rows.length - 1)) * plotWidth;
      const y = top + plotHeight - (row.value / maximum) * plotHeight;
      return { ...row, x, y };
    });
    const path = points.length > 1 ? `M ${points.map((point) => `${point.x} ${point.y}`).join(" L ")}` : "";
    const ariaLabel = chartAriaLabel(titleAr, titleEn, rows);

    return `<div class="analytics-chart-scroll" tabindex="0" aria-label="${escapeHtml(bilingualText("مرّر أفقياً لو لزم", "Scroll horizontally if needed"))}">
      <svg class="analytics-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(ariaLabel)}">
        ${svgBilingualLabel("عدد المحتوى", "Entries", { x: left, y: 16, className: "analytics-svg__axis-title" })}
        ${ticks.map((tick) => {
          const y = top + plotHeight - (tick / maximum) * plotHeight;
          return `<line class="analytics-svg__grid" x1="${left}" y1="${y}" x2="${width - right}" y2="${y}"></line>
            <text class="analytics-svg__tick analytics-svg__number" x="${left - 9}" y="${y + 4}" text-anchor="end">${tick}</text>`;
        }).join("")}
        ${path ? `<path class="analytics-svg__line" d="${path}"></path>` : ""}
        ${points.map((point) => `<circle class="analytics-svg__point" cx="${point.x}" cy="${point.y}" r="5">${tooltip(point.label, point.value)}</circle>
          <text class="analytics-svg__value analytics-svg__number" x="${point.x}" y="${Math.max(top - 7, point.y - 10)}" text-anchor="middle">${point.value}</text>
          ${svgBilingualLabel(point.label.ar, point.label.en, { x: point.x, y: height - 65, anchor: "middle" })}`).join("")}
        ${svgBilingualLabel("الشهر", "Month", { x: left + plotWidth / 2, y: height - 28, anchor: "middle", className: "analytics-svg__axis-title" })}
      </svg>
    </div>`;
  }

  function seriesPatternDefs(id) {
    return `<defs>
      <pattern id="${id}-series-0" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect class="analytics-svg__series-base analytics-svg__series-base--0" width="8" height="8"></rect>
      </pattern>
      <pattern id="${id}-series-1" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect class="analytics-svg__series-base analytics-svg__series-base--1" width="8" height="8"></rect>
        <path class="analytics-svg__series-mark" d="M-2 8L8-2M2 10L10 2"></path>
      </pattern>
      <pattern id="${id}-series-2" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect class="analytics-svg__series-base analytics-svg__series-base--2" width="8" height="8"></rect>
        <circle class="analytics-svg__series-dot" cx="2" cy="2" r="1.2"></circle>
        <circle class="analytics-svg__series-dot" cx="6" cy="6" r="1.2"></circle>
      </pattern>
      <pattern id="${id}-series-3" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect class="analytics-svg__series-base analytics-svg__series-base--3" width="8" height="8"></rect>
        <path class="analytics-svg__series-mark" d="M0 0L8 8M8 0L0 8"></path>
      </pattern>
    </defs>`;
  }

  function groupedHorizontalBarChart(rows, series, options) {
    const hasData = rows.some((row) => series.some((item) => Number(row.values?.[item.key]) > 0));
    if (!rows.length || !hasData) {
      return emptyChart(options.titleAr, options.titleEn, options.emptyAr, options.emptyEn);
    }

    const id = options.id;
    const width = 960;
    const left = 335;
    const right = 70;
    const top = 58;
    const barHeight = 13;
    const barGap = 5;
    const groupPadding = 18;
    const rowHeight = series.length * (barHeight + barGap) + groupPadding;
    const bottom = 44;
    const height = Math.max(180, top + rows.length * rowHeight + bottom);
    const plotWidth = width - left - right;
    const maximum = niceMaximum(Math.max(...rows.flatMap((row) => series.map((item) => Number(row.values?.[item.key]) || 0))));
    const ticks = tickValues(maximum);
    const figures = rows.map((row) => {
      const values = series.map((item) => `${bilingualText(item.label.ar, item.label.en)}: ${Number(row.values?.[item.key]) || 0}`).join(", ");
      return `${bilingualText(row.label.ar, row.label.en)} — ${values}`;
    }).join("; ");
    const ariaLabel = `${bilingualText(options.titleAr, options.titleEn)}. ${figures}`;

    return `<div class="analytics-chart-scroll" tabindex="0" aria-label="${escapeHtml(bilingualText("مرّر أفقياً لو لزم", "Scroll horizontally if needed"))}">
      <svg class="analytics-svg analytics-svg--grouped" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(ariaLabel)}">
        ${seriesPatternDefs(id)}
        ${svgBilingualLabel(options.categoryAxisAr, options.categoryAxisEn, { x: left - 12, y: 16, anchor: "end", className: "analytics-svg__axis-title" })}
        ${svgBilingualLabel(options.valueAxisAr, options.valueAxisEn, { x: left, y: 16, className: "analytics-svg__axis-title" })}
        ${ticks.map((tick) => {
          const x = left + (tick / maximum) * plotWidth;
          return `<line class="analytics-svg__grid" x1="${x}" y1="${top - 5}" x2="${x}" y2="${height - bottom + 3}"></line>
            <text class="analytics-svg__tick analytics-svg__number" x="${x}" y="${height - 12}" text-anchor="middle">${tick}</text>`;
        }).join("")}
        ${rows.map((row, rowIndex) => {
          const groupY = top + rowIndex * rowHeight;
          const bars = series.map((item, seriesIndex) => {
            const value = Math.max(0, Number(row.values?.[item.key]) || 0);
            const y = groupY + seriesIndex * (barHeight + barGap);
            const barWidth = (value / maximum) * plotWidth;
            const valueLabel = `${item.label.ar} / ${item.label.en}: ${value}`;
            return `<rect class="analytics-svg__track" x="${left}" y="${y}" width="${plotWidth}" height="${barHeight}" rx="3"></rect>
              <rect class="analytics-svg__series" x="${left}" y="${y}" width="${barWidth}" height="${barHeight}" rx="3" fill="url(#${id}-series-${seriesIndex % 4})">${tooltip(row.label, valueLabel)}</rect>
              <text class="analytics-svg__value analytics-svg__number" x="${Math.min(width - 4, left + barWidth + 8)}" y="${y + barHeight - 2}">${value}</text>`;
          }).join("");
          return `${svgBilingualLabel(row.label.ar, row.label.en, { x: left - 12, y: groupY + 14, anchor: "end" })}
            ${bars}
            <line class="analytics-svg__row-rule" x1="20" y1="${groupY + rowHeight - 8}" x2="${width - right}" y2="${groupY + rowHeight - 8}"></line>`;
        }).join("")}
      </svg>
    </div>`;
  }

  function seriesLegend(series) {
    const marks = ["■", "╱", "•", "×"];
    return `<ul class="analytics-legend analytics-legend--series" aria-label="${escapeHtml(bilingualText("مفتاح سلاسل الرسم", "Chart series legend"))}">
      ${series.map((item, index) => `<li><span class="analytics-legend__swatch analytics-legend__swatch--series-${index % 4}" aria-hidden="true">${marks[index % 4]}</span><span>${bilingualHtml(item.label.ar, item.label.en)}</span></li>`).join("")}
    </ul>`;
  }

  function legend(rows) {
    const marks = ["■", "╱", "•", "×"];
    return `<ul class="analytics-legend analytics-legend--series" aria-label="${escapeHtml(bilingualText("مفتاح الرسم", "Chart legend"))}">
      ${rows.map((row, index) => `<li><span class="analytics-legend__swatch analytics-legend__swatch--series-${index % 4}" aria-hidden="true">${marks[index % 4]}</span><span>${bilingualHtml(row.label.ar, row.label.en)}</span><strong dir="ltr">${row.value}</strong></li>`).join("")}
    </ul>`;
  }

  function chartCard({ id, titleAr, titleEn, descriptionAr, descriptionEn, chart, table, wide = false, extra = "" }) {
    return `<section class="analytics-card${wide ? " analytics-card--wide" : ""}" aria-labelledby="${id}-title">
      <div class="analytics-card__head">
        <h2 id="${id}-title">${bilingualHtml(titleAr, titleEn)}</h2>
        ${descriptionAr ? `<p>${escapeHtml(descriptionAr)} <span class="english-copy" lang="en" dir="ltr">${escapeHtml(descriptionEn)}</span></p>` : ""}
      </div>
      ${chart}
      ${extra}
      ${table}
    </section>`;
  }

  function knowledgeByType(entries) {
    const rows = Object.entries(TYPE_LABELS).map(([type, label]) => ({
      key: type,
      label,
      value: entries.filter((entry) => entry?.type === type).length,
    }));
    const known = new Set(Object.keys(TYPE_LABELS));
    const other = entries.filter((entry) => !known.has(entry?.type)).length;
    if (other) rows.push({ key: "other", label: { ar: "نوع آخر", en: "Other" }, value: other });
    return rows;
  }

  function entriesByCategory(entries, categories) {
    const rows = new Map();
    categories.forEach((category) => {
      if (!category?.slug) return;
      rows.set(category.slug, {
        key: category.slug,
        label: labelFrom(category.name, "تصنيف بدون اسم", "Unnamed category"),
        value: 0,
      });
    });
    entries.forEach((entry) => {
      const key = String(entry?.category || "uncategorised");
      if (!rows.has(key)) {
        rows.set(key, {
          key,
          label: key === "uncategorised"
            ? { ar: "بدون تصنيف", en: "Uncategorised" }
            : { ar: "تصنيف غير مسجل", en: `Unlisted category (${key})` },
          value: 0,
        });
      }
      rows.get(key).value += 1;
    });
    return [...rows.values()].sort((a, b) => b.value - a.value || a.label.en.localeCompare(b.label.en));
  }

  function imageCoverage(entries) {
    return [
      {
        label: { ar: "مسار صورة غير معلّم كمؤقت", en: "Non-placeholder image path" },
        value: entries.filter((entry) => entry?.imagePlaceholder !== true && String(entry?.image || "").trim()).length,
      },
      {
        label: { ar: "صورة معلّمة كمؤقتة", en: "Image marked as a stand-in" },
        value: entries.filter((entry) => entry?.imagePlaceholder === true).length,
      },
      {
        label: { ar: "بدون صورة", en: "No image" },
        value: entries.filter((entry) => entry?.imagePlaceholder !== true && !String(entry?.image || "").trim()).length,
      },
    ];
  }

  function completenessByFile(content) {
    return Object.entries(REQUIRED_FIELDS).map(([file, rules]) => {
      const fileData = content[file] || {};
      const records = rules.flatMap((rule) => asArray(fileData[rule.key]).map((item) => ({ item, rule })));
      const complete = records.filter(({ item, rule }) => {
        if (!isObject(item)) return false;
        const required = [...rule.required];
        if (rule.key === "reviews" && item.published === true) {
          required.push("name.ar", "name.en", "text.ar", "text.en");
        }
        return required.every((path) => {
          const value = valueAt(item, path);
          return typeof value === "string" && Boolean(value.trim());
        });
      }).length;
      const total = records.length;
      return {
        file,
        label: fileLabel(file),
        complete,
        total,
        value: total ? Math.round((complete / total) * 100) : null,
      };
    });
  }

  function publishingTimeline(entries) {
    const months = new Map();
    entries.forEach((entry) => {
      const date = String(entry?.date || "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
      const key = date.slice(0, 7);
      months.set(key, (months.get(key) || 0) + 1);
    });
    return [...months.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => {
      const date = new Date(`${key}-01T00:00:00Z`);
      return {
        key,
        label: {
          ar: date.toLocaleDateString("ar-EG", { month: "short", year: "numeric", timeZone: "UTC" }),
          en: date.toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" }),
        },
        value,
      };
    });
  }

  function isPendingReview(review) {
    return review?.status === "pending" || review?.approved === false || review?.published === false;
  }

  function reviewFigures(fileData) {
    const reviews = asArray(fileData?.reviews);
    const legacyPending = asArray(fileData?.pending?.items);
    const pending = reviews.filter(isPendingReview);
    const published = reviews.filter((review) => review?.published === true && !isPendingReview(review));
    const all = reviews.concat(legacyPending);
    const stateRows = [
      { label: { ar: "منشور", en: "Published" }, value: published.length },
      { label: { ar: "بانتظار المراجعة", en: "Pending moderation" }, value: pending.length + legacyPending.length },
    ];
    const ratingValues = new Set([5, 4, 3, 2, 1]);
    all.forEach((review) => {
      if (Number.isFinite(review?.rating) && review.rating >= 1 && review.rating <= 5) ratingValues.add(review.rating);
    });
    const ratingRows = [...ratingValues].sort((a, b) => b - a).map((rating) => ({
      label: { ar: `${rating} نجوم`, en: `${rating} stars` },
      value: all.filter((review) => review?.rating === rating).length,
    }));
    return { stateRows, ratingRows, total: all.length };
  }

  function patientProofFigures(fileData) {
    const reviews = asArray(fileData?.reviews);
    const legacyPending = asArray(fileData?.pending?.items);
    const pending = reviews.filter(isPendingReview).length + legacyPending.length;
    const published = reviews.filter((review) => review?.published === true && !isPendingReview(review)).length;
    const pairs = asArray(fileData?.beforeAfter?.pairs);
    return [
      { label: { ar: "آراء فردية منشورة", en: "Published individual reviews" }, value: published },
      { label: { ar: "آراء بانتظار المراجعة", en: "Reviews awaiting moderation" }, value: pending },
      { label: { ar: "شهادات فيديو", en: "Video testimonials" }, value: asArray(fileData?.videos).length },
      { label: { ar: "شهادات مصورة", en: "Screenshot testimonials" }, value: asArray(fileData?.screenshots).length },
      {
        label: { ar: "قبل وبعد حقيقي بموافقة", en: "Consented real before/after" },
        value: pairs.filter((pair) => pair?.sample !== true && pair?.consent === true).length,
      },
      {
        label: { ar: "نماذج قبل وبعد مؤقتة", en: "Sample before/after stand-ins" },
        value: pairs.filter((pair) => pair?.sample === true).length,
      },
      {
        label: { ar: "قبل وبعد حقيقي بلا موافقة مؤكدة", en: "Real before/after without confirmed consent" },
        value: pairs.filter((pair) => pair?.sample !== true && pair?.consent !== true).length,
      },
    ];
  }

  function specialtyContentMix(content) {
    const specialties = asArray(content["specialties.json"]?.specialties);
    const doctors = asArray(content["doctors.json"]?.doctors)
      .filter((doctor) => doctor?.published === true && doctor?.sample !== true);
    const articlesData = content["articles.json"] || {};
    const entries = asArray(articlesData.articles).filter((entry) => entry?.published === true);
    const categories = new Map(asArray(articlesData.categories)
      .filter((category) => hasText(category?.slug))
      .map((category) => [category.slug, category]));
    const reviews = asArray(content["reviews.json"]?.reviews)
      .filter((review) => review?.published === true && review?.sample !== true && !isPendingReview(review));

    function linkedSpecialties(item, allowCategoryFallback = false) {
      const explicit = asArray(item?.specialties)
        .map((value) => typeof value === "string" ? value : value?.slug)
        .filter((value) => typeof value === "string" && Boolean(value.trim()));
      if (explicit.length || !allowCategoryFallback) return new Set(explicit);
      const categorySpecialty = categories.get(item?.category)?.specialty;
      return new Set(hasText(categorySpecialty) ? [categorySpecialty] : []);
    }

    return specialties.map((specialty) => {
      const slug = String(specialty?.slug || "");
      return {
        key: slug,
        label: labelFrom(specialty?.name, "تخصص بدون اسم", "Unnamed specialty"),
        values: {
          knowledge: entries.filter((entry) => linkedSpecialties(entry, true).has(slug)).length,
          doctors: doctors.filter((doctor) => linkedSpecialties(doctor).has(slug)).length,
          reviews: reviews.filter((review) => linkedSpecialties(review).has(slug)).length,
        },
      };
    });
  }

  function editorialGapRows(entries) {
    const published = entries.filter((entry) => entry?.published === true);
    const sourceEntries = published.filter((entry) => entry?.type === "article" || entry?.type === "update");
    const hasSearchDescription = (entry) => hasBilingualText(entry?.seo?.description) || hasBilingualText(entry?.excerpt);
    const hasSource = (entry) => asArray(entry?.sources)
      .some((source) => hasText(source) || hasText(source?.url) || hasText(source?.label));
    return [
      {
        label: { ar: "بدون كاتب", en: "Missing author" },
        value: published.filter((entry) => !hasText(entry?.author)).length,
        total: published.length,
      },
      {
        label: { ar: "بدون مراجع طبي", en: "Missing medical reviewer" },
        value: published.filter((entry) => !hasText(entry?.reviewedBy)).length,
        total: published.length,
      },
      {
        label: { ar: "بدون صورة نهائية", en: "Missing final image" },
        value: published.filter((entry) => !hasText(entry?.image) || entry?.imagePlaceholder === true).length,
        total: published.length,
      },
      {
        label: { ar: "بدون وصف بحث بالعربي والإنجليزي", en: "Missing bilingual search description" },
        value: published.filter((entry) => !hasSearchDescription(entry)).length,
        total: published.length,
      },
      {
        label: { ar: "مقال أو تحديث بلا مصادر", en: "Article or update without sources" },
        value: sourceEntries.filter((entry) => !hasSource(entry)).length,
        total: sourceEntries.length,
      },
    ];
  }

  function publicationReadiness(content) {
    const collections = [
      { label: { ar: "التخصصات", en: "Specialties" }, items: asArray(content["specialties.json"]?.specialties) },
      { label: { ar: "الأطباء", en: "Doctors" }, items: asArray(content["doctors.json"]?.doctors) },
      { label: { ar: "الفروع", en: "Branches" }, items: asArray(content["branches.json"]?.branches) },
      { label: { ar: "المحتوى المعرفي", en: "Knowledge entries" }, items: asArray(content["articles.json"]?.articles) },
      { label: { ar: "المنتجات الرقمية", en: "Digital products" }, items: asArray(content["digital.json"]?.products) },
      { label: { ar: "الآراء الفردية", en: "Individual reviews" }, items: asArray(content["reviews.json"]?.reviews) },
    ].filter((collection) => collection.items.length);

    return collections.map((collection) => ({
      label: collection.label,
      values: {
        publishedReal: collection.items.filter((item) => item?.published === true && item?.sample !== true).length,
        publishedSample: collection.items.filter((item) => item?.published === true && item?.sample === true).length,
        unpublishedReal: collection.items.filter((item) => item?.published !== true && item?.sample !== true).length,
        unpublishedSample: collection.items.filter((item) => item?.published !== true && item?.sample === true).length,
      },
    }));
  }

  function todoByFile(content) {
    const seen = new Set(FILE_ORDER);
    const files = FILE_ORDER.filter((file) => Object.hasOwn(content, file));
    Object.keys(content).sort().forEach((file) => {
      if (!seen.has(file)) files.push(file);
    });
    return files.map((file) => ({ label: fileLabel(file), file, value: countTodos(content[file]) }));
  }

  function renderStats({ content, status, images, imagesLoaded, imagesError, entries, todos }) {
    const specialties = asArray(content["specialties.json"]?.specialties);
    const doctors = asArray(content["doctors.json"]?.doctors);
    const imageCount = imagesError ? "—" : imagesLoaded ? images.length : "…";
    const tiles = [
      { label: { ar: "صفحة مولّدة", en: "Generated pages" }, value: status?.pageCount ?? "?" },
      { label: { ar: "تخصص منشور", en: "Published specialties" }, value: specialties.filter((item) => item?.published === true).length },
      // published and non-sample, so the tile matches what a visitor finds
      { label: { ar: "طبيب منشور", en: "Published doctors" },
        value: doctors.filter((item) => item?.published !== false && item?.sample !== true).length },
      { label: { ar: "إدخال معرفة", en: "Knowledge entries" }, value: entries.length },
      { label: { ar: "صورة على القرص", en: "Images on disk" }, value: imageCount },
      { label: { ar: "معلومة مطلوبة", en: "Outstanding TODOs" }, value: todos },
    ];
    return `<section class="analytics-stats" aria-label="${escapeHtml(bilingualText("ملخص التحليلات", "Analytics summary"))}">
      ${tiles.map((tile) => `<article class="metric-card analytics-stat">
        <strong class="metric-card__number">${escapeHtml(tile.value)}</strong>
        <span class="metric-card__label">${bilingualHtml(tile.label.ar, tile.label.en)}</span>
      </article>`).join("")}
    </section>`;
  }

  function renderAnalytics({ content = {}, status = {}, images = [], imagesLoaded = false, imagesError = null } = {}) {
    const articlesData = content["articles.json"] || {};
    const entries = asArray(articlesData.articles);
    const categories = asArray(articlesData.categories);
    const typeRows = knowledgeByType(entries);
    const categoryRows = entriesByCategory(entries, categories);
    const coverageRows = imageCoverage(entries);
    const completenessRows = completenessByFile(content);
    const timelineRows = publishingTimeline(entries);
    const reviews = reviewFigures(content["reviews.json"] || {});
    const proofRows = patientProofFigures(content["reviews.json"] || {});
    const specialtyRows = specialtyContentMix(content);
    const gapRows = editorialGapRows(entries);
    const readinessRows = publicationReadiness(content);
    const todoRows = todoByFile(content);
    const totalTodos = todoRows.reduce((sum, row) => sum + row.value, 0);

    const specialtySeries = [
      { key: "knowledge", label: { ar: "محتوى معرفي منشور", en: "Published knowledge" } },
      { key: "doctors", label: { ar: "أطباء منشورون غير تجريبيين", en: "Published non-sample doctors" } },
      { key: "reviews", label: { ar: "آراء فردية منشورة", en: "Published individual reviews" } },
    ];
    const readinessSeries = [
      { key: "publishedReal", label: { ar: "منشور غير تجريبي", en: "Published non-sample" } },
      { key: "publishedSample", label: { ar: "منشور تجريبي", en: "Published sample" } },
      { key: "unpublishedReal", label: { ar: "غير منشور وغير تجريبي", en: "Unpublished non-sample" } },
      { key: "unpublishedSample", label: { ar: "غير منشور تجريبي", en: "Unpublished sample" } },
    ];

    const specialtyCard = chartCard({
      id: "analytics-specialty-mix",
      titleAr: "تغطية الموقع حسب التخصص",
      titleEn: "Site coverage by specialty",
      descriptionAr: "يقارن المحتوى المنشور والأطباء غير التجريبيين والآراء الفردية المرتبطة بكل تخصص؛ الفجوة بتوضح فين الموقع محتاج دعم.",
      descriptionEn: "Compares published knowledge, non-sample doctors and individual reviews linked to each specialty, exposing weak coverage.",
      wide: true,
      chart: groupedHorizontalBarChart(specialtyRows, specialtySeries, {
        id: "analytics-specialty-mix-pattern",
        titleAr: "تغطية الموقع حسب التخصص",
        titleEn: "Site coverage by specialty",
        categoryAxisAr: "التخصص",
        categoryAxisEn: "Specialty",
        valueAxisAr: "عدد العناصر المنشورة",
        valueAxisEn: "Published records",
        emptyAr: "لا توجد تخصصات أو عناصر مرتبطة بها حالياً",
        emptyEn: "No specialties or linked records yet",
      }),
      extra: seriesLegend(specialtySeries),
      table: dataTable({
        captionAr: "تغطية الموقع حسب التخصص",
        captionEn: "Site coverage by specialty",
        headers: [
          { ar: "التخصص", en: "Specialty" },
          ...specialtySeries.map((item) => item.label),
        ],
        rows: specialtyRows.map((row) => [
          bilingualText(row.label.ar, row.label.en),
          ...specialtySeries.map((item) => row.values[item.key]),
        ]),
      }),
    });

    const publishedEntries = entries.filter((entry) => entry?.published === true);
    const editorialCard = chartCard({
      id: "analytics-editorial-gaps",
      titleAr: "فجوات الجودة في المحتوى المنشور",
      titleEn: "Published-content quality gaps",
      descriptionAr: "كل عمود هو عدد الإدخالات المنشورة اللي محتاجة إجراء؛ وصف البحث يقبل وصف SEO مخصص أو المقتطف الثنائي المستخدم كبديل.",
      descriptionEn: "Each bar counts published entries needing action; search copy accepts dedicated SEO text or the bilingual excerpt used as fallback.",
      wide: true,
      chart: horizontalBarChart(gapRows, {
        titleAr: "فجوات الجودة في المحتوى المنشور",
        titleEn: "Published-content quality gaps",
        categoryAxisAr: "الفجوة",
        categoryAxisEn: "Quality gap",
        valueAxisAr: "إدخالات تحتاج إجراء",
        valueAxisEn: "Entries needing action",
        maximum: Math.max(1, ...gapRows.map((row) => row.total)),
        hasData: publishedEntries.length > 0,
        emptyAr: "لا يوجد محتوى منشور لتحليله حالياً",
        emptyEn: "No published knowledge entries to analyse yet",
        valueLabel: (row) => `${row.value}/${row.total}`,
      }),
      table: dataTable({
        captionAr: "فجوات الجودة في المحتوى المنشور",
        captionEn: "Published-content quality gaps",
        headers: [
          { ar: "الفجوة", en: "Gap" },
          { ar: "يحتاج إجراء", en: "Needs action" },
          { ar: "الإجمالي المناسب", en: "Relevant total" },
        ],
        rows: gapRows.map((row) => [bilingualText(row.label.ar, row.label.en), row.value, row.total]),
      }),
    });

    const readinessCard = chartCard({
      id: "analytics-publishing-readiness",
      titleAr: "حالة النشر والمحتوى التجريبي",
      titleEn: "Publishing and sample-content status",
      descriptionAr: "يقسم كل مجموعة بدون تداخل، علشان المحتوى التجريبي أو غير المنشور يبان فوراً قبل التسليم.",
      descriptionEn: "Partitions each collection without overlap, making sample or unpublished records visible before handover.",
      wide: true,
      chart: groupedHorizontalBarChart(readinessRows, readinessSeries, {
        id: "analytics-readiness-pattern",
        titleAr: "حالة النشر والمحتوى التجريبي",
        titleEn: "Publishing and sample-content status",
        categoryAxisAr: "مجموعة المحتوى",
        categoryAxisEn: "Content collection",
        valueAxisAr: "عدد السجلات",
        valueAxisEn: "Records",
        emptyAr: "لا توجد مجموعات محتوى قابلة للنشر حالياً",
        emptyEn: "No publishable content collections yet",
      }),
      extra: seriesLegend(readinessSeries),
      table: dataTable({
        captionAr: "حالة النشر والمحتوى التجريبي",
        captionEn: "Publishing and sample-content status",
        headers: [
          { ar: "المجموعة", en: "Collection" },
          ...readinessSeries.map((item) => item.label),
        ],
        rows: readinessRows.map((row) => [
          bilingualText(row.label.ar, row.label.en),
          ...readinessSeries.map((item) => row.values[item.key]),
        ]),
      }),
    });

    const typeCard = chartCard({
      id: "analytics-types",
      titleAr: "إدخالات المعرفة حسب النوع",
      titleEn: "Knowledge entries by type",
      descriptionAr: "كل إدخالات مركز المعرفة، سواء كانت منشورة أو مسودة.",
      descriptionEn: "All knowledge-centre entries, published or draft.",
      chart: verticalBarChart(typeRows, {
        titleAr: "إدخالات المعرفة حسب النوع",
        titleEn: "Knowledge entries by type",
        valueAxisAr: "عدد المحتوى",
        valueAxisEn: "Entries",
        categoryAxisAr: "نوع المحتوى",
        categoryAxisEn: "Entry type",
        valueLabel: (row) => row.value,
      }),
      table: dataTable({
        captionAr: "إدخالات المعرفة حسب النوع",
        captionEn: "Knowledge entries by type",
        headers: [{ ar: "النوع", en: "Type" }, { ar: "العدد", en: "Count" }],
        rows: typeRows.map((row) => [bilingualText(row.label.ar, row.label.en), row.value]),
      }),
    });

    const categoryCard = chartCard({
      id: "analytics-categories",
      titleAr: "الإدخالات حسب التصنيف",
      titleEn: "Entries per category",
      descriptionAr: "مرتبة من أكبر عدد إلى أصغر عدد.",
      descriptionEn: "Sorted from the largest count to the smallest.",
      wide: true,
      chart: horizontalBarChart(categoryRows, {
        titleAr: "الإدخالات حسب التصنيف",
        titleEn: "Entries per category",
        categoryAxisAr: "التصنيف",
        categoryAxisEn: "Category",
        valueAxisAr: "عدد المحتوى",
        valueAxisEn: "Entries",
        valueLabel: (row) => row.value,
      }),
      table: dataTable({
        captionAr: "الإدخالات حسب التصنيف",
        captionEn: "Entries per category",
        headers: [{ ar: "التصنيف", en: "Category" }, { ar: "العدد", en: "Count" }],
        rows: categoryRows.map((row) => [bilingualText(row.label.ar, row.label.en), row.value]),
      }),
    });

    const coverageCard = chartCard({
      id: "analytics-images",
      titleAr: "تغطية صور المحتوى",
      titleEn: "Image coverage",
      descriptionAr: "التقسيم مبني على وجود مسار الصورة وعلامة imagePlaceholder فقط، ولا يفترض مصدر الصورة.",
      descriptionEn: "The split uses only the image path and imagePlaceholder flag; it does not infer image provenance.",
      chart: stackedCoverageChart(coverageRows, "تغطية صور المحتوى", "Image coverage"),
      extra: legend(coverageRows),
      table: dataTable({
        captionAr: "تغطية صور المحتوى",
        captionEn: "Image coverage",
        headers: [{ ar: "حالة الصورة", en: "Image state" }, { ar: "العدد", en: "Count" }],
        rows: coverageRows.map((row) => [bilingualText(row.label.ar, row.label.en), row.value]),
      }),
    });

    const completenessCard = chartCard({
      id: "analytics-completeness",
      titleAr: "اكتمال المحتوى حسب الملف",
      titleEn: "Content completeness per file",
      descriptionAr: "النسبة مبنية فقط على الحقول المطلوبة عند الحفظ في الخادم.",
      descriptionEn: "Percentages use only the server's required-on-save fields.",
      wide: true,
      chart: horizontalBarChart(completenessRows, {
        titleAr: "اكتمال المحتوى حسب الملف",
        titleEn: "Content completeness per file",
        categoryAxisAr: "ملف المحتوى",
        categoryAxisEn: "Content file",
        valueAxisAr: "نسبة الإدخالات المكتملة",
        valueAxisEn: "Complete entries",
        maximum: 100,
        percent: true,
        hasData: completenessRows.some((row) => row.total > 0),
        emptyAr: "لا توجد إدخالات مجموعة قابلة لقياس الاكتمال حالياً",
        emptyEn: "No collection records are available for completeness checks",
        valueLabel: (row) => row.value === null ? "—" : `${row.value}% (${row.complete}/${row.total})`,
      }),
      table: dataTable({
        captionAr: "اكتمال المحتوى حسب الملف",
        captionEn: "Content completeness per file",
        headers: [
          { ar: "الملف", en: "File" },
          { ar: "المكتمل", en: "Complete" },
          { ar: "الإجمالي", en: "Total" },
          { ar: "النسبة", en: "Percentage" },
        ],
        rows: completenessRows.map((row) => [
          bilingualText(row.label.ar, row.label.en),
          row.complete,
          row.total,
          row.value === null ? bilingualText("لا توجد إدخالات", "No entries") : `${row.value}%`,
        ]),
      }),
    });

    const timelineCard = chartCard({
      id: "analytics-timeline",
      titleAr: "الخط الزمني للنشر",
      titleEn: "Publishing timeline",
      descriptionAr: "عدد إدخالات المعرفة لكل شهر حسب حقل التاريخ.",
      descriptionEn: "Knowledge entries per month from their date field.",
      wide: true,
      chart: timelineChart(timelineRows, "الخط الزمني للنشر", "Publishing timeline"),
      table: dataTable({
        captionAr: "الخط الزمني للنشر",
        captionEn: "Publishing timeline",
        headers: [{ ar: "الشهر", en: "Month" }, { ar: "العدد", en: "Count" }],
        rows: timelineRows.map((row) => [bilingualText(row.label.ar, row.label.en), row.value]),
      }),
    });

    const proofChart = horizontalBarChart(proofRows, {
      titleAr: "مخزون أدلة وتجارب المرضى",
      titleEn: "Patient-proof inventory",
      categoryAxisAr: "نوع الدليل",
      categoryAxisEn: "Proof type",
      valueAxisAr: "عدد السجلات",
      valueAxisEn: "Records",
      emptyAr: "لا توجد آراء أو شهادات أو نتائج مسجلة حالياً",
      emptyEn: "No reviews, testimonials or results are recorded yet",
      valueLabel: (row) => row.value,
    });
    const ratingChart = horizontalBarChart(reviews.ratingRows, {
      titleAr: "توزيع التقييمات",
      titleEn: "Rating spread",
      categoryAxisAr: "التقييم",
      categoryAxisEn: "Rating",
      valueAxisAr: "عدد الآراء",
      valueAxisEn: "Reviews",
      emptyAr: "لا توجد آراء فردية بتقييم نجوم حالياً",
      emptyEn: "No individual star-rated reviews yet",
      valueLabel: (row) => row.value,
    });
    const reviewsCard = chartCard({
      id: "analytics-reviews",
      titleAr: "أدلة المرضى وتوزيع التقييمات",
      titleEn: "Patient proof and rating spread",
      descriptionAr: "يجمع السجلات الفردية والفيديوهات واللقطات ونتائج قبل وبعد؛ لا يستخدم إجمالي جوجل المجمع كأنه رأي مفصل.",
      descriptionEn: "Counts individual records, videos, screenshots and before/after results; the aggregate Google total is not treated as detailed reviews.",
      wide: true,
      chart: `<div class="analytics-review-grid">
        <div>
          <h3>${bilingualHtml("مخزون أدلة وتجارب المرضى", "Patient-proof inventory")}</h3>
          ${proofChart}
        </div>
        <div>
          <h3>${bilingualHtml("توزيع التقييمات", "Rating spread")}</h3>
          ${ratingChart}
        </div>
      </div>`,
      table: dataTable({
        captionAr: "أدلة المرضى وتوزيع التقييمات",
        captionEn: "Patient proof and rating spread",
        headers: [{ ar: "المجموعة", en: "Group" }, { ar: "القيمة", en: "Value" }, { ar: "العدد", en: "Count" }],
        rows: proofRows.map((row) => [
          bilingualText("نوع دليل المريض", "Patient-proof type"),
          bilingualText(row.label.ar, row.label.en),
          row.value,
        ]).concat(reviews.ratingRows.map((row) => [
          bilingualText("التقييم", "Rating"),
          bilingualText(row.label.ar, row.label.en),
          row.value,
        ])),
      }),
    });

    const todoCard = chartCard({
      id: "analytics-todos",
      titleAr: "المعلومات المطلوبة حسب الملف",
      titleEn: "TODO burn-down by file",
      descriptionAr: "كل حقل معلومات مطلوبة غير فارغ يُحسب مرة واحدة.",
      descriptionEn: "Each non-empty _todo field is counted once.",
      wide: true,
      chart: horizontalBarChart(todoRows, {
        titleAr: "المعلومات المطلوبة حسب الملف",
        titleEn: "TODO burn-down by file",
        categoryAxisAr: "ملف المحتوى",
        categoryAxisEn: "Content file",
        valueAxisAr: "عدد الحقول المطلوبة",
        valueAxisEn: "Outstanding fields",
        hasData: todoRows.length > 0,
        emptyAr: "لا توجد ملفات محتوى محملة لحساب المعلومات المطلوبة",
        emptyEn: "No content files are loaded for TODO analysis",
        valueLabel: (row) => row.value,
      }),
      table: dataTable({
        captionAr: "المعلومات المطلوبة حسب الملف",
        captionEn: "TODO burn-down by file",
        headers: [{ ar: "الملف", en: "File" }, { ar: "العدد", en: "Count" }],
        rows: todoRows.map((row) => [bilingualText(row.label.ar, row.label.en), row.value]),
      }),
    });

    return `<div class="view-head">
      <div>
        <h2>${bilingualHtml("التحليلات", "Analytics")}</h2>
        <p>رسوم مباشرة من محتوى لوحة الإدارة الحالي. <span class="english-copy" lang="en" dir="ltr">Live charts from the dashboard's current content.</span></p>
      </div>
    </div>
    ${renderStats({ content, status, images, imagesLoaded, imagesError, entries, todos: totalTodos })}
    <div class="analytics-grid">
      <div class="analytics-section-head">
        <h2>${bilingualHtml("قرارات تحتاج انتباه", "Decision-ready analytics")}</h2>
        <p>تغطية التخصصات، فجوات التحرير، وحالة النشر في صورة واحدة قابلة للتنفيذ. <span class="english-copy" lang="en" dir="ltr">Specialty coverage, editorial gaps and publishing status in an actionable view.</span></p>
      </div>
      ${specialtyCard}
      ${editorialCard}
      ${readinessCard}
      <div class="analytics-section-head">
        <h2>${bilingualHtml("تفاصيل المحتوى", "Content detail")}</h2>
        <p>تفصيل الأنواع والتصنيفات والصور والتواريخ والآراء والمعلومات المطلوبة. <span class="english-copy" lang="en" dir="ltr">Breakdowns of types, categories, images, dates, reviews and outstanding information.</span></p>
      </div>
      ${typeCard}
      ${coverageCard}
      ${categoryCard}
      ${completenessCard}
      ${timelineCard}
      ${reviewsCard}
      ${todoCard}
    </div>`;
  }

  window.DashboardAnalytics = Object.freeze({
    REQUIRED_FIELDS,
    completenessByFile,
    countTodos,
    editorialGapRows,
    entriesByCategory,
    imageCoverage,
    knowledgeByType,
    patientProofFigures,
    publicationReadiness,
    publishingTimeline,
    renderAnalytics,
    reviewFigures,
    specialtyContentMix,
    todoByFile,
  });
})();
