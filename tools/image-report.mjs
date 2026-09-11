/* Image asset audit: dependency-free dimensions come from build/lib/util.mjs. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { OUT_DIR, imageSize } from "../build/lib/util.mjs";

const IMAGE_ROOT = path.join(OUT_DIR, "assets", "img");
const HTML_EXT = ".html";
const KB = 1024;

function walk(dir, predicate, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, out);
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return match ? (match[1] ?? match[2] ?? match[3] ?? "") : null;
}

function localImagePath(ref, pagePath) {
  if (!ref || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(ref)) {
    try {
      const url = new URL(ref);
      if (!/^www\.laroseclinics\.com$/i.test(url.hostname) && !/^laroseclinics\.com$/i.test(url.hostname)) return null;
      ref = url.pathname;
    } catch {
      return null;
    }
  }
  const clean = ref.split(/[?#]/, 1)[0];
  if (!clean) return null;
  const absolute = clean.startsWith("/")
    ? path.resolve(OUT_DIR, `.${clean}`)
    : path.resolve(path.dirname(pagePath), clean);
  const relative = path.relative(OUT_DIR, absolute).split(path.sep).join("/");
  return relative.startsWith("assets/img/") && !relative.includes("../") ? relative : null;
}

function srcsetUrls(srcset) {
  return srcset.split(",").map((entry) => entry.trim().split(/\s+/, 1)[0]).filter(Boolean);
}

function pageReferences() {
  const widths = new Map();
  const add = (ref, page, width = null) => {
    const image = localImagePath(ref, page);
    if (!image) return;
    const current = widths.get(image) || { largestWidth: null, pages: new Set() };
    if (width !== null) current.largestWidth = Math.max(current.largestWidth || 0, width);
    current.pages.add(path.relative(OUT_DIR, page).split(path.sep).join("/"));
    widths.set(image, current);
  };
  const addTagReferences = (tag, page, width = null) => {
    add(attr(tag, "src"), page, width);
    for (const ref of srcsetUrls(attr(tag, "srcset") || "")) add(ref, page, width);
  };
  const pages = walk(OUT_DIR, (file) => path.extname(file).toLowerCase() === HTML_EXT);

  for (const page of pages) {
    const html = fs.readFileSync(page, "utf8");
    const withoutPictures = html.replace(/<picture\b[^>]*>([\s\S]*?)<\/picture>/gi, (picture) => {
      const tags = [...picture.matchAll(/<(?:img|source)\b[^>]*>/gi)].map((match) => match[0]);
      const imageTag = tags.find((tag) => /^<img\b/i.test(tag));
      const rawWidth = imageTag && attr(imageTag, "width");
      const width = rawWidth && /^\d+$/.test(rawWidth) ? Number(rawWidth) : null;
      for (const tag of tags) addTagReferences(tag, page, width);
      return "";
    });
    for (const match of withoutPictures.matchAll(/<img\b[^>]*>/gi)) {
      const tag = match[0];
      const rawWidth = attr(tag, "width");
      const width = rawWidth && /^\d+$/.test(rawWidth) ? Number(rawWidth) : null;
      addTagReferences(tag, page, width);
    }
    for (const match of withoutPictures.matchAll(/<(?:link|video|audio|object|embed)\b[^>]*>/gi)) {
      const tag = match[0];
      add(attr(tag, "href") || attr(tag, "src") || attr(tag, "poster"), page);
    }
    // Image URLs in metadata and JSON-LD are also page references. They have no
    // displayed width, but must not be labelled unreferenced just because they
    // are consumed by a crawler rather than an <img> element.
    for (const match of html.matchAll(/(?:(?:https?:)?\/\/(?:www\.)?laroseclinics\.com)?(?:\.\.\/|\.\/)*assets\/img\/[^\s"'<>\\)]+/gi)) {
      add(match[0], page);
    }
  }
  return widths;
}

function bytes(value) {
  return `${(value / KB).toFixed(1)} KB`;
}

function ratio(value) {
  return value == null ? "n/a" : `${value.toFixed(2)}x`;
}

export function getImageReport() {
  const references = pageReferences();
  const files = walk(IMAGE_ROOT, () => true)
    .sort((a, b) => a.localeCompare(b))
    .map((full) => {
      const rel = path.relative(OUT_DIR, full).split(path.sep).join("/");
      const size = imageSize(rel);
      const reference = references.get(rel);
      const largestWidth = reference?.largestWidth ?? null;
      const intrinsicToDisplayed = size && largestWidth ? size.w / largestWidth : null;
      return {
        path: rel,
        width: size?.w ?? null,
        height: size?.h ?? null,
        bytes: fs.statSync(full).size,
        largestWidth,
        referenced: Boolean(reference),
        pages: reference ? [...reference.pages].sort() : [],
        intrinsicToDisplayed,
      };
    });
  const totalBytes = files.reduce((total, file) => total + file.bytes, 0);
  return {
    files,
    totalBytes,
    oversized: files.filter((file) => file.intrinsicToDisplayed !== null && file.intrinsicToDisplayed > 2),
    unreferenced: files.filter((file) => !file.referenced),
    over300KB: files.filter((file) => file.bytes > 300 * KB),
  };
}

function printList(label, files, detail) {
  console.log(`\n${label} (${files.length})`);
  if (!files.length) {
    console.log("  None");
    return;
  }
  for (const file of files) console.log(`  ${detail(file)}`);
}

export function printImageReport(report) {
  console.log(`Image inventory: ${report.files.length} files, ${bytes(report.totalBytes)} total`);
  console.log("path | intrinsic | bytes | largest displayed width | referenced | intrinsic/displayed");
  for (const file of report.files) {
    const intrinsic = file.width && file.height ? `${file.width}x${file.height}` : "unknown";
    console.log(`${file.path} | ${intrinsic} | ${bytes(file.bytes)} | ${file.largestWidth ?? "n/a"} | ${file.referenced ? "yes" : "no"} | ${ratio(file.intrinsicToDisplayed)}`);
  }
  printList("Oversized (intrinsic width > 2x largest displayed width)", report.oversized,
    (file) => `${file.path} — ${file.width}px / ${file.largestWidth}px = ${ratio(file.intrinsicToDisplayed)} (${bytes(file.bytes)})`);
  printList("Unreferenced", report.unreferenced, (file) => `${file.path} (${bytes(file.bytes)})`);
  printList("Over 300 KB", report.over300KB, (file) => `${file.path} (${bytes(file.bytes)})`);
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  const report = getImageReport();
  if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
  else printImageReport(report);
}
