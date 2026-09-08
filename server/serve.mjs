#!/usr/bin/env node
/* ==========================================================================
   LA ROSE WELLNESS HUB — local server
   --------------------------------------------------------------------------
   Two jobs:
     1. Serve `site/` and `dashboard/` over http so the pages can be previewed
        in a browser (Chrome will not run a site properly from file://).
     2. Back the dashboard: read and write `content/*.json`, accept image
        uploads into `site/assets/img/`, and re-run the generator on save.

   The published site itself never needs this server — it is plain HTML and
   opens by double-clicking. This is only for previewing and for editing.

   Run:  node server/serve.mjs         (default port 4173)
         node server/serve.mjs 5000
   ========================================================================== */

import http from "node:http";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.join(ROOT, "site");
const DASH = path.join(ROOT, "dashboard");
const CONTENT = path.join(ROOT, "content");
const BACKUPS = path.join(CONTENT, "_backups");
const UPLOADS = path.join(SITE, "assets", "img");

const PORT = Number(process.argv[2]) || 4173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".pdf": "application/pdf",
};

/* ---- helpers -------------------------------------------------------------- */
const json = (res, code, obj) => {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "cache-control": "no-store",
  });
  res.end(body);
};

const readBody = (req, limit = 32 * 1024 * 1024) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error("Payload too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

/** Reject any path that tries to escape its base directory. */
function safeJoin(base, target) {
  const p = path.resolve(base, "." + path.posix.normalize("/" + target));
  if (p !== base && !p.startsWith(base + path.sep)) return null;
  return p;
}

const CONTENT_FILES = new Set([
  "site.json", "specialties.json", "doctors.json", "branches.json",
  "articles.json", "reviews.json", "digital.json", "pages.json",
  "campaigns.json", "tips.json",
]);

const COLLECTION_RULES = {
  "specialties.json": [{ key: "specialties", id: "slug", required: ["slug", "name.ar", "name.en"] }],
  "doctors.json": [{ key: "doctors", id: "slug", required: ["slug", "name.ar", "name.en"] }],
  "branches.json": [{ key: "branches", id: "slug", required: ["slug", "status", "name.ar", "name.en"] }],
  "articles.json": [
    { key: "categories", id: "slug", required: ["slug", "name.ar", "name.en"] },
    { key: "articles", id: "slug", required: ["slug", "type", "category", "title.ar", "title.en"] },
  ],
  "reviews.json": [{ key: "reviews", id: "id", required: ["id"] }],
  "digital.json": [{ key: "products", id: "slug", required: ["slug", "type", "name.ar", "name.en"] }],
  "campaigns.json": [{ key: "campaigns", id: "id", required: ["id", "name"] }],
};

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function valueAt(root, dottedPath) {
  return dottedPath.split(".").reduce((value, key) => value?.[key], root);
}

/* Mirrors rule 8 of tools/validate.mjs: a numeral followed by the Egyptian
   pound in either script. Kept in sync with it deliberately. */
const PRICE_LEAK = /[\d\u0660-\u0669][\d,\u0660-\u0669\s]{1,8}(\u062c\.?\u0645|\u062c\u0646\u064a\u0647|\bEGP\b|\bLE\b)/;
const PRICING_PATH = /(^|\.)(pricing|prices|price)(\.|\[|$)/i;

function validateContent(file, data) {
  const errors = [];
  if (file === "tips.json") {
    if (!Array.isArray(data)) return ["tips.json must have an array root."];
    const seen = new Set();
    data.forEach((item, index) => {
      if (!isObject(item)) return errors.push(`tips[${index}] must be an object.`);
      for (const key of ["id", "ar", "en"]) {
        if (typeof item[key] !== "string" || !item[key].trim()) errors.push(`tips[${index}].${key} is required.`);
      }
      if (typeof item.id === "string" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)) errors.push(`tips[${index}].id must be a slug.`);
      if (seen.has(item.id)) errors.push(`tips.id "${item.id}" is duplicated.`);
      seen.add(item.id);
    });
    return errors;
  }
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

/* A plain writeFile truncates the target before the new bytes land, so an
   interrupted save leaves an empty content file and the dashboard can no longer
   parse it - including the Backups panel needed to recover from exactly that.
   Write beside the target and rename: rename over an existing file in the same
   directory is atomic on every platform this runs on. */
async function writeFileAtomic(target, contents) {
  const tmp = `${target}.tmp-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  let handle = null;
  try {
    handle = await fsp.open(tmp, "wx");
    await handle.writeFile(contents, "utf8");
    await handle.sync();
    await handle.close();
    handle = null;
    await fsp.rename(tmp, target);
  } catch (error) {
    if (handle) await handle.close().catch(() => {});
    await fsp.rm(tmp, { force: true }).catch(() => {});
    throw error;
  }
}

function contentRev(contents) {
  return createHash("sha256").update(contents).digest("hex");
}

async function contentSnapshot(file) {
  const text = await fsp.readFile(path.join(CONTENT, file), "utf8");
  return { content: JSON.parse(text), rev: contentRev(text) };
}

/* Content writes for one file are serialised around compare/backup/replace.
   Without this, two requests can both compare the same revision before either
   reaches rename, then the later request still overwrites the earlier one. */
const contentWriteQueues = new Map();

function withContentWrite(file, task) {
  const previous = contentWriteQueues.get(file) || Promise.resolve();
  const current = previous.catch(() => {}).then(task);
  contentWriteQueues.set(file, current);
  return current.finally(() => {
    if (contentWriteQueues.get(file) === current) contentWriteQueues.delete(file);
  });
}

async function createBackup(file) {
  const target = path.join(CONTENT, file);
  if (!fs.existsSync(target)) return null;
  await fsp.mkdir(BACKUPS, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const name = `${file}.${stamp}.bak`;
  const backupPath = path.join(BACKUPS, name);
  await fsp.copyFile(target, backupPath);
  const olds = (await fsp.readdir(BACKUPS))
    .filter((entry) => entry.startsWith(file + ".") && entry.endsWith(".bak"))
    .sort()
    .reverse()
    .slice(20);
  await Promise.all(olds.map((entry) => fsp.unlink(path.join(BACKUPS, entry))));
  const stat = await fsp.stat(backupPath);
  return { name, file, bytes: stat.size, createdAt: stat.mtime.toISOString() };
}

async function listBackups() {
  await fsp.mkdir(BACKUPS, { recursive: true });
  const backups = [];
  for (const name of await fsp.readdir(BACKUPS)) {
    const file = [...CONTENT_FILES].find((candidate) => name.startsWith(candidate + ".") && name.endsWith(".bak"));
    if (!file) continue;
    const stat = await fsp.stat(path.join(BACKUPS, name)).catch(() => null);
    if (stat?.isFile()) backups.push({ name, file, bytes: stat.size, createdAt: stat.mtime.toISOString() });
  }
  backups.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return backups;
}

/* ---- rebuild and validation ---------------------------------------------- */
let building = false;
let activeRebuild = null;
let lastPipeline = null;

function runNodeScript(script) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(ROOT, script)], {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "", err = "";
    child.stdout.on("data", (data) => (out += data));
    child.stderr.on("data", (data) => (err += data));
    child.on("error", (error) => resolve({ ok: false, code: null, out, err: `${err}${error.message}` }));
    child.on("close", (code) => resolve({ ok: code === 0, code, out, err }));
  });
}

async function countPages(dir = SITE) {
  let total = 0;
  const entries = await fsp.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) total += await countPages(absolute);
    else if (entry.name.endsWith(".html") && !entry.name.startsWith("_")) total += 1;
  }
  return total;
}

async function runPipeline() {
  const startedAt = new Date().toISOString();
  const build = await runNodeScript(path.join("build", "build.mjs"));
  const validation = build.ok
    ? await runNodeScript(path.join("tools", "validate.mjs"))
    : { ok: false, code: null, out: "", err: "Validation was skipped because the build failed.", skipped: true };
  const result = {
    ok: build.ok && validation.ok,
    startedAt,
    finishedAt: new Date().toISOString(),
    pageCount: await countPages(),
    build,
    validation,
    out: build.out,
    err: [build.err, validation.err, validation.ok ? "" : validation.out].filter(Boolean).join("\n"),
  };
  lastPipeline = result;
  return result;
}

async function rebuild() {
  if (activeRebuild) {
    await activeRebuild;
    return rebuild();
  }
  building = true;
  activeRebuild = runPipeline();
  try {
    return await activeRebuild;
  } finally {
    activeRebuild = null;
    building = false;
  }
}

/* ---- static --------------------------------------------------------------- */
async function serveStatic(res, base, urlPath) {
  let target = safeJoin(base, decodeURIComponent(urlPath));
  if (!target) return json(res, 403, { error: "Forbidden" });

  try {
    let stat = await fsp.stat(target).catch(() => null);
    if (stat?.isDirectory()) {
      target = path.join(target, "index.html");
      stat = await fsp.stat(target).catch(() => null);
    }
    if (!stat) {
      // Try adding .html — lets /ar/specialties/dermatology resolve
      const alt = target + ".html";
      if (fs.existsSync(alt)) target = alt;
      else {
        res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
        return res.end("<h1>404</h1>");
      }
    }
    const ext = path.extname(target).toLowerCase();
    const data = await fsp.readFile(target);
    res.writeHead(200, {
      "content-type": MIME[ext] || "application/octet-stream",
      "content-length": data.length,
      "cache-control": "no-store",
    });
    res.end(data);
  } catch (e) {
    res.writeHead(500, { "content-type": "text/plain" });
    res.end(String(e.message));
  }
}

/* ---- API ------------------------------------------------------------------ */
async function handleApi(req, res, url) {
  const seg = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);

  // GET /api/content            -> every content file
  // GET /api/content/site.json  -> one file
  if (req.method === "GET" && seg[0] === "content") {
    if (!seg[1]) {
      const all = {};
      const revs = {};
      for (const f of CONTENT_FILES) {
        const p = path.join(CONTENT, f);
        if (fs.existsSync(p)) {
          const snapshot = await contentSnapshot(f);
          all[f] = snapshot.content;
          revs[f] = snapshot.rev;
        }
      }
      /* __revs rides alongside the files rather than inside them: the client
         PUTs a file's own object back verbatim, so anything added inside it
         would be written into the content on the next save. */
      return json(res, 200, { ...all, __revs: revs });
    }
    if (!CONTENT_FILES.has(seg[1])) return json(res, 404, { error: "Unknown content file" });
    const p = path.join(CONTENT, seg[1]);
    if (!fs.existsSync(p)) return json(res, 404, { error: "Not found" });
    return json(res, 200, (await contentSnapshot(seg[1])).content);
  }

  // PUT /api/content/<file>.json  -> replace, back up, rebuild
  if (req.method === "PUT" && seg[0] === "content" && seg[1]) {
    if (!CONTENT_FILES.has(seg[1])) return json(res, 400, { error: "Unknown content file" });
    let parsed;
    try {
      parsed = JSON.parse((await readBody(req)).toString("utf8"));
    } catch {
      return json(res, 400, { error: "Body is not valid JSON" });
    }
    const validationErrors = validateContent(seg[1], parsed);
    if (validationErrors.length) {
      return json(res, 422, { error: "Content validation failed", validationErrors });
    }
    const sentRev = String(req.headers["x-content-rev"] || "");
    if (!sentRev) {
      return json(res, 428, { error: "A content revision is required. Reload the dashboard before saving." });
    }
    const replacement = JSON.stringify(parsed, null, 2) + "\n";
    const saved = await withContentWrite(seg[1], async () => {
      const current = await contentSnapshot(seg[1]);
      /* Checked inside the per-file queue immediately before backup/replace,
         so a stale or simultaneous request cannot spend a backup slot or write. */
      if (sentRev !== current.rev) return { conflict: current };
      const backup = await createBackup(seg[1]);
      await writeFileAtomic(path.join(CONTENT, seg[1]), replacement);
      return { backup, rev: contentRev(replacement) };
    });
    if (saved.conflict) {
      return json(res, 409, {
        error: "This file changed in another tab or window since you loaded it. Reload it before saving, or your colleague's change would be replaced.",
        conflict: true,
        file: seg[1],
        rev: saved.conflict.rev,
        content: saved.conflict.content,
      });
    }
    const pipeline = await rebuild();
    return json(res, 200, { saved: seg[1], backup: saved.backup, rev: saved.rev, rebuild: pipeline, pipeline });
  }

  // GET /api/backups -> timestamped content snapshots
  if (req.method === "GET" && seg[0] === "backups") {
    const backups = await listBackups();
    return json(res, 200, { count: backups.length, backups });
  }

  // POST /api/backups/restore { backup } -> preserve current file, restore, verify
  if (req.method === "POST" && seg[0] === "backups" && seg[1] === "restore") {
    let payload;
    try {
      payload = JSON.parse((await readBody(req)).toString("utf8"));
    } catch {
      return json(res, 400, { error: "Body is not valid JSON" });
    }
    const name = String(payload.backup || "");
    if (!name || path.basename(name) !== name) return json(res, 400, { error: "Invalid backup name" });
    const file = [...CONTENT_FILES].find((candidate) => name.startsWith(candidate + ".") && name.endsWith(".bak"));
    if (!file) return json(res, 400, { error: "Unknown backup file" });
    const source = path.join(BACKUPS, name);
    if (!fs.existsSync(source)) return json(res, 404, { error: "Backup not found" });
    let restored;
    try {
      restored = JSON.parse(await fsp.readFile(source, "utf8"));
    } catch {
      return json(res, 422, { error: "Backup does not contain valid JSON" });
    }
    const validationErrors = validateContent(file, restored);
    if (validationErrors.length) {
      return json(res, 422, { error: "Backup content failed validation", validationErrors });
    }
    const replacement = JSON.stringify(restored, null, 2) + "\n";
    const restoredFile = await withContentWrite(file, async () => {
      const preserved = await createBackup(file);
      await writeFileAtomic(path.join(CONTENT, file), replacement);
      return { preserved, rev: contentRev(replacement) };
    });
    const pipeline = await rebuild();
    return json(res, 200, { restored: name, file, content: restored, preserved: restoredFile.preserved, rev: restoredFile.rev, pipeline });
  }

  // POST /api/upload  { dir, filename, dataUrl }
  if (req.method === "POST" && seg[0] === "upload") {
    let payload;
    try {
      payload = JSON.parse((await readBody(req)).toString("utf8"));
    } catch {
      return json(res, 400, { error: "Body is not valid JSON" });
    }
    const { dir = "uploads", filename, dataUrl } = payload;
    if (!filename || !dataUrl) return json(res, 400, { error: "filename and dataUrl are required" });

    const m = /^data:([\w/+.-]+);base64,(.+)$/s.exec(dataUrl);
    if (!m) return json(res, 400, { error: "dataUrl must be a base64 data URI" });

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml", "application/pdf"];
    if (!allowed.includes(m[1])) return json(res, 400, { error: `Type ${m[1]} is not allowed` });

    const clean = filename.replace(/[^\w.\-]+/g, "-").replace(/^[.\-]+/, "").slice(0, 120);
    if (!clean) return json(res, 400, { error: "Filename is not valid" });
    const outDir = safeJoin(UPLOADS, dir);
    if (!outDir) return json(res, 403, { error: "Forbidden" });
    await fsp.mkdir(outDir, { recursive: true });

    const buf = Buffer.from(m[2], "base64");
    if (buf.length > 12 * 1024 * 1024) return json(res, 400, { error: "File exceeds 12 MB" });
    /* Uploading hero.webp into a folder that already holds hero.webp used to
       overwrite it, and every content field pointing at that path changed at
       once, with no backup taken. Keep both files and hand back the name that
       was actually written, which is what the upload dialog displays. */
    const dot = clean.lastIndexOf(".");
    const stem = dot > 0 ? clean.slice(0, dot) : clean;
    const ext = dot > 0 ? clean.slice(dot) : "";
    let finalName = clean;
    let suffix = 2;
    while (true) {
      try {
        await fsp.writeFile(path.join(outDir, finalName), buf, { flag: "wx" });
        break;
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
        finalName = `${stem}-${suffix}${ext}`;
        suffix += 1;
      }
    }

    return json(res, 200, {
      ok: true,
      path: `assets/img/${dir}/${finalName}`.replace(/\/+/g, "/"),
      renamed: finalName !== clean ? clean : undefined,
      bytes: buf.length,
    });
  }

  // POST /api/rebuild
  if (req.method === "POST" && seg[0] === "rebuild") {
    return json(res, 200, await rebuild());
  }

  // GET /api/images  -> every image under site/assets/img, with its size
  // The dashboard needs to BROWSE what already exists, not just upload.
  if (req.method === "GET" && seg[0] === "images") {
    const out = [];
    const walk = async (dir, rel) => {
      let entries = [];
      try { entries = await fsp.readdir(dir, { withFileTypes: true }); } catch { return; }
      for (const e of entries) {
        const abs = path.join(dir, e.name);
        const r = rel ? `${rel}/${e.name}` : e.name;
        if (e.isDirectory()) await walk(abs, r);
        else if (/\.(webp|png|jpe?g|avif|svg)$/i.test(e.name)) {
          const st = await fsp.stat(abs).catch(() => null);
          out.push({
            path: `assets/img/${r}`,
            dir: (rel.split("/")[0] || "root"),
            name: e.name,
            bytes: st ? st.size : 0,
            mtime: st ? st.mtimeMs : 0,
          });
        }
      }
    };
    await walk(UPLOADS, "");
    out.sort((a, b) => b.mtime - a.mtime);
    return json(res, 200, { count: out.length, images: out });
  }

  // POST /api/capture  { name, body }
  // A drop box for text produced in a browser tab (copy passes run through
  // ChatGPT). Writes to _project/gpt-out/<name>.txt so results do not have to
  // be shuttled back through the automation tool in chunks.
  if (req.method === "POST" && seg[0] === "capture") {
    let payload;
    try { payload = JSON.parse((await readBody(req)).toString("utf8")); }
    catch { return json(res, 400, { error: "Body is not valid JSON" }); }
    const name = String(payload.name || "capture").replace(/[^\w.\-]+/g, "-").slice(0, 80);
    const dir = path.join(ROOT, "_project", "gpt-out");
    await fsp.mkdir(dir, { recursive: true });
    await fsp.writeFile(path.join(dir, name + ".txt"), String(payload.body ?? ""), "utf8");
    return json(res, 200, { ok: true, name, bytes: Buffer.byteLength(String(payload.body ?? "")) });
  }

  // POST /api/submissions   -> append one form submission
  // GET  /api/submissions   -> read them back
  // GET  /api/submissions.csv -> the same, for a spreadsheet
  //
  // Local capture so nothing is lost while previewing, and so submissions are
  // still recorded if the Apps Script endpoint is not deployed yet. The live
  // site posts to both; whichever answers, answers.
  if (seg[0] === "submissions" || seg[0] === "submissions.csv") {
    const file = path.join(ROOT, "content", "_submissions.json");
    const readAll = async () => {
      try { return JSON.parse(await fsp.readFile(file, "utf8")); }
      catch { return []; }
    };

    if (req.method === "POST" && seg[0] === "submissions") {
      let payload;
      try { payload = JSON.parse((await readBody(req)).toString("utf8")); }
      catch { return json(res, 400, { error: "Body is not valid JSON" }); }
      const FIELDS = ["source", "name", "phone", "specialty", "doctor", "branch",
                      "preferredDay", "preferredTime", "message", "language", "pageUrl"];
      const row = { receivedAt: new Date().toISOString(), status: "new" };
      for (const f of FIELDS) row[f] = String(payload[f] ?? "").slice(0, 2000);
      const all = await readAll();
      all.push(row);
      await fsp.writeFile(file, JSON.stringify(all, null, 2), "utf8");
      return json(res, 200, { ok: true, count: all.length });
    }

    if (req.method === "GET") {
      const all = await readAll();
      if (seg[0] === "submissions") return json(res, 200, { ok: true, items: all });
      const cols = ["receivedAt", "source", "name", "phone", "specialty", "doctor",
                    "branch", "preferredDay", "preferredTime", "message",
                    "language", "pageUrl", "status"];
      // a leading BOM so Excel opens the Arabic as UTF-8 instead of mojibake
      const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      const csv = "\uFEFF" + [cols.join(",")]
        .concat(all.map((r) => cols.map((c) => esc(r[c])).join(",")))
        .join("\r\n");
      res.writeHead(200, {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="larose-submissions.csv"',
      });
      return res.end(csv);
    }
  }

  // GET /api/status
  if (req.method === "GET" && seg[0] === "status") {
    return json(res, 200, {
      ok: true,
      root: ROOT,
      port: PORT,
      building,
      // Always count what is on disk. Trusting the last pipeline's number
      // makes this stale the moment anyone builds outside the server.
      pageCount: await countPages(),
      lastBuildTime: lastPipeline?.finishedAt || null,
      lastPipelineOk: lastPipeline?.ok ?? null,
    });
  }

  return json(res, 404, { error: "No such endpoint" });
}

/* ---- server --------------------------------------------------------------- */
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }

  try {
    if (url.pathname.startsWith("/api/")) return await handleApi(req, res, url);
    if (url.pathname === "/dashboard" || url.pathname === "/dashboard/")
      return serveStatic(res, DASH, "/index.html");
    if (url.pathname.startsWith("/dashboard/"))
      return serveStatic(res, DASH, url.pathname.replace(/^\/dashboard/, ""));
    return serveStatic(res, SITE, url.pathname);
  } catch (e) {
    json(res, 500, { error: String(e.message) });
  }
});

server.listen(PORT, () => {
  console.log(`
  LA ROSE WELLNESS HUB - local server

    Site        http://localhost:${PORT}/
    Arabic      http://localhost:${PORT}/ar/
    English     http://localhost:${PORT}/en/
    Dashboard   http://localhost:${PORT}/dashboard/

  Press Ctrl+C to stop.
`);
});
