# Dashboard Audit

### Content saves and restores replace the live JSON file non-atomically
- **Where:** server/serve.mjs:331, server/serve.mjs:333, server/serve.mjs:356, server/serve.mjs:358, server/serve.mjs:393, server/serve.mjs:394
- **Evidence:**
  ```js
  for (const f of CONTENT_FILES) {
    const p = path.join(CONTENT, f);
    if (fs.existsSync(p)) all[f] = JSON.parse(await fsp.readFile(p, "utf8"));
  }
  ```
  ```js
  const target = path.join(CONTENT, seg[1]);
  const backup = await createBackup(seg[1]);
  await fsp.writeFile(target, JSON.stringify(parsed, null, 2) + "\n", "utf8");
  ```
  ```js
  const preserved = await createBackup(file);
  await fsp.writeFile(path.join(CONTENT, file), JSON.stringify(restored, null, 2) + "\n", "utf8");
  ```
- **Why it breaks:** `writeFile` truncates the live file before all replacement bytes are safely written. If the process stops or the disk write fails after truncation, a save or restore can leave an empty/partial JSON file. On the next load, the quoted `JSON.parse` fails while fetching all content, so staff cannot even reach the dashboard's Backups panel to restore the valid snapshot.
- **Fix:** Write the complete JSON to a sibling temporary file, flush and close it, then atomically replace the target with that file; remove the temporary file on failure. Keep `createBackup` before the final replacement.

### Edits made while a save is running are incorrectly marked as saved
- **Where:** dashboard/js/dashboard.js:1624, dashboard/js/dashboard.js:1630, dashboard/js/dashboard.js:1632, dashboard/js/dashboard.js:1634, dashboard/js/dashboard.js:1967, dashboard/js/dashboard.js:1971, dashboard/js/dashboard.js:1972
- **Evidence:**
  ```js
  state.savingFiles.add(file);
  ```
  ```js
  const result = await api(`/api/content/${encodeURIComponent(file)}`, {
    method: "PUT",
    body: JSON.stringify(state.content[file]),
  });
  state.dirtyFiles.delete(file);
  ```
  ```js
  document.addEventListener("input", (event) => {
    const control = event.target.closest("[data-bind]");
    if (!control || !state.editorContext) return;
    const path = readPathToken(control.dataset.path);
    setAt(state.editorContext.root, path, coerceInput(control));
    markDirty(state.editorContext.file);
  });
  ```
- **Why it breaks:** Saving includes a rebuild, so the request can remain pending for several seconds while the form stays editable. If a staff member clicks Save and then types another character, the request contains the earlier serialized value, the input handler marks the newer value dirty, and the eventual response unconditionally deletes that dirty flag. Save becomes disabled and the unload warning disappears even though the new character exists only in memory; reloading loses it.
- **Fix:** Record a per-file mutation counter (or the exact serialized payload) when the request starts, and clear the dirty flag only if that counter/payload is still current when the response returns. Otherwise leave the file dirty and Save enabled.

### A stale browser tab can overwrite another editor's complete file
- **Where:** dashboard/js/dashboard.js:1954, dashboard/js/dashboard.js:1955, dashboard/js/dashboard.js:1630, dashboard/js/dashboard.js:1632, server/serve.mjs:343, server/serve.mjs:358
- **Evidence:**
  ```js
  const content = await api("/api/content");
  state.content = content || {};
  ```
  ```js
  const result = await api(`/api/content/${encodeURIComponent(file)}`, {
    method: "PUT",
    body: JSON.stringify(state.content[file]),
  });
  ```
  ```js
  // PUT /api/content/<file>.json  -> replace, back up, rebuild
  ```
  ```js
  await fsp.writeFile(target, JSON.stringify(parsed, null, 2) + "\n", "utf8");
  ```
- **Why it breaks:** Open the dashboard in tabs A and B, edit and save one doctor in A, then edit a different doctor in B and save. B submits the entire old `doctors.json` snapshot and the server replaces the whole file without checking whether it changed since B loaded it, so A's saved change disappears from the current content.
- **Fix:** Return a revision (hash, mtime, or ETag) with each content file and require it on PUT. Re-read and compare immediately before backup/write; return `409 Conflict` and make the editor reload/merge when the revision is stale.

### Uploading an existing image name destroys the previous asset
- **Where:** server/serve.mjs:416, server/serve.mjs:418, server/serve.mjs:424
- **Evidence:**
  ```js
  const clean = filename.replace(/[^\w.\-]+/g, "-").replace(/^[.\-]+/, "").slice(0, 120);
  ```
  ```js
  const outDir = safeJoin(UPLOADS, dir);
  ```
  ```js
  await fsp.writeFile(path.join(outDir, clean), buf);
  ```
- **Why it breaks:** If staff upload `hero.webp` to a directory that already contains `hero.webp`, `writeFile` silently replaces the existing bytes. Every content field using that path changes at once, and unlike JSON saves this route creates no backup or confirmation, so the old image is lost.
- **Fix:** Check whether the destination exists and return `409 Conflict` instead of overwriting it, or generate a unique suffixed filename and return that final path.

### A filter from one collection can hide every item in another with no clear control
- **Where:** dashboard/js/dashboard.js:915, dashboard/js/dashboard.js:917, dashboard/js/dashboard.js:918, dashboard/js/dashboard.js:920, dashboard/js/dashboard.js:923, dashboard/js/dashboard.js:928, dashboard/js/dashboard.js:2027, dashboard/js/dashboard.js:2029
- **Evidence:**
  ```js
  const q = state.listQuery || "";
  const facet = state.listFacet || "";
  const facets = typeFacets(items);
  const ordered = orderedIndices(items, section).filter((i) => {
    const it = items[i];
    if (facet && it?.type !== facet) return false;
    return matchesQuery(it, q);
  });
  const tools = (items.length > 8 || facets.length) ? `
  ```
  ```js
  ${facets.length ? `<div class="list-filters">
  ```
  ```js
  if (action === "select-collection") {
    state.activeGroups[actionElement.dataset.section] = actionElement.dataset.collection;
    render();
  }
  ```
- **Why it breaks:** Select an article type filter such as `tip`, then change to a collection whose items have no `type` facet (for example Categories). The global `state.listFacet` remains `tip`, so every category is filtered out. Because `facets.length` is now zero, that panel renders no facet buttons, including no “All” button, and staff cannot clear the hidden filter there. The same global-state problem can hide a collection of eight or fewer items after carrying a search from another section, because `tools` is then omitted entirely.
- **Fix:** Reset `state.listQuery` and `state.listFacet` whenever the section, collection group, or settings file changes. Alternatively, store them per collection and always render a visible Clear control whenever either value is active.

### A successful upload from the Images screen never refreshes the library
- **Where:** dashboard/js/dashboard.js:1321, dashboard/js/dashboard.js:1322, dashboard/js/dashboard.js:1325, dashboard/js/dashboard.js:1327, dashboard/js/dashboard.js:1883, dashboard/js/dashboard.js:1886, dashboard/js/dashboard.js:1910, dashboard/js/dashboard.js:1914
- **Evidence:**
  ```js
  async function loadImages() {
    if (state.imagesLoaded || state.imagesLoading) return;
  ```
  ```js
  const data = await api("/api/images");
  state.images = data.images || [];
  state.imagesLoaded = true;
  ```
  ```js
  state.uploadedValue = result.path;
  uploadedPath.value = result.path;
  uploadPreview.innerHTML = `<img src="/${escapeHtml(result.path)}" alt="معاينة الصورة المرفوعة · Uploaded image preview">`;
  uploadResult.hidden = false;
  ```
  ```js
  function useUploadedValue() {
    if (!state.uploadTarget || !state.uploadedValue) return;
    setAt(state.uploadTarget.root, state.uploadTarget.path, state.uploadedValue);
    markDirty(state.uploadTarget.file);
    state.imagesLoaded = false; state.images = [];
  ```
- **Why it breaks:** Load the Images section, use its header Upload button, complete an upload, and close the dialog. That route has no field target, so `useUploadedValue` cannot run; the successful upload path does not invalidate `imagesLoaded`. The library continues showing the cached pre-upload list, with no refresh control, until the whole dashboard is reloaded.
- **Fix:** After any successful upload, set `state.imagesLoaded = false`, clear `state.images`, and reload/render the Images section. Keep the existing field-target behavior for editor uploads.

### Images and Backups enter an endless request/render loop after an API error
- **Where:** dashboard/js/dashboard.js:1321, dashboard/js/dashboard.js:1322, dashboard/js/dashboard.js:1328, dashboard/js/dashboard.js:1331, dashboard/js/dashboard.js:1332, dashboard/js/dashboard.js:1345, dashboard/js/dashboard.js:1413, dashboard/js/dashboard.js:1415, dashboard/js/dashboard.js:1422, dashboard/js/dashboard.js:1425, dashboard/js/dashboard.js:1426, dashboard/js/dashboard.js:1432
- **Evidence:**
  ```js
  async function loadImages() {
    if (state.imagesLoaded || state.imagesLoading) return;
  ```
  ```js
  } catch (e) {
    state.imagesError = String(e.message);
  } finally {
    state.imagesLoading = false;
    if (state.section === "images") render();
  }
  ```
  ```js
  loadImages();
  ```
  ```js
  async function loadBackups(force = false) {
    if (force) state.backupsLoaded = false;
    if (state.backupsLoaded || state.backupsLoading) return;
  ```
  ```js
  } catch (error) {
    state.backupsError = error.message;
  } finally {
    state.backupsLoading = false;
    if (state.section === "backups") render();
  }
  ```
  ```js
  loadBackups();
  ```
- **Why it breaks:** If `/api/images` or `/api/backups` returns an error, the corresponding `*Loaded` flag remains false. `finally` calls `render()`, that render immediately calls the loader again, and the next failure repeats the cycle. A permission or disk error therefore makes the panel continuously re-render and flood the server instead of leaving a stable error message.
- **Fix:** Track that the request attempt completed even on failure and do not retry from `render()`. Show the stored error with an explicit Retry action (the Backups panel already has a refresh action that can serve this purpose).

### Price text in a public field passes dashboard validation before the site validator rejects it
- **Where:** AGENTS.md:16, AGENTS.md:17, AGENTS.md:18, dashboard/js/dashboard.js:511, dashboard/js/dashboard.js:516, dashboard/js/dashboard.js:517, server/serve.mjs:118, server/serve.mjs:123
- **Evidence:**
  ```md
  2. **No prices on any public page.** This is an explicit client decision. Real
     figures live in the dashboard behind `showPrice: false`. `tools/validate.mjs`
     fails the build if a price pattern reaches the output — do not weaken that check.
  ```
  ```js
  const walk = (value, path = []) => {
  ```
  ```js
  if (key === "showPrice" && child !== false) {
    issues.push({ path: nextPath, message: `${dottedPath(nextPath)} must remain false.` });
  }
  ```
  ```js
  const walk = (value, pointer = "") => {
  ```
  ```js
  if (key === "showPrice" && child !== false) errors.push(`${next} must remain false.`);
  ```
- **Why it breaks:** Enter `جلسة 1500 جنيه` (or `1500 EGP`) into a public description, intro, treatment body, or other rendered string while leaving every `showPrice` flag false. Both dashboard checks accept it and the server writes it; the build then puts the price in public output and the project validator rejects the result under the quoted contract.
- **Fix:** Apply the same price-pattern rule used by the site validator to public content strings in both client and server validation, while explicitly excluding the internal pricing subtree. The server-side check must run before backup/write.

### Common phone controls are smaller than the 44px touch target
- **Where:** dashboard/css/dashboard.css:347, dashboard/css/dashboard.css:411, dashboard/css/dashboard.css:412, dashboard/css/dashboard.css:460, dashboard/css/dashboard.css:462, dashboard/css/dashboard.css:463, dashboard/css/dashboard.css:747, dashboard/css/dashboard.css:792, dashboard/css/dashboard.css:844, dashboard/css/dashboard.css:846
- **Evidence:**
  ```css
  .admin-btn--sm { min-height: 2.25rem; padding: .35rem .65rem; font-size: .72rem; }
  ```
  ```css
  .segment-btn {
    min-height: 2.5rem;
  ```
  ```css
  .icon-action {
    display: inline-grid;
    width: 2rem;
    height: 2rem;
  ```
  ```css
  .icon-btn { display: grid; width: 2.5rem; height: 2.5rem; place-items: center; border: 1px solid var(--line-strong); border-radius: 50%; font-size: 1.5rem; }
  ```
  ```css
  .admin-topbar__actions .admin-btn { min-height: 2.5rem; padding: .4rem .55rem; font-size: .72rem; }
  ```
  ```css
  .list-search {
    width: 100%;
    min-height: 2.4rem;
  ```
- **Why it breaks:** At the normal 16px root size these targets are approximately 32px, 36px, 38px, or 40px high/wide. On a phone this affects reorder buttons, small Save/Delete/Approve/Restore buttons, tabs, the dialog close button, the sticky Save button, and search. Staff can easily hit an adjacent destructive action or miss the intended target.
- **Fix:** Give interactive controls a minimum block size and, for icon-only controls, minimum inline size of `2.75rem` (44px), including the narrow-screen overrides; keep the visual glyph/button styling inside that hit area.

### The Arabic mobile drawer is physically pinned to the left
- **Where:** dashboard/index.html:2, dashboard/css/dashboard.css:764, dashboard/css/dashboard.css:765, dashboard/css/dashboard.css:766, dashboard/css/dashboard.css:768
- **Evidence:**
  ```html
  <html lang="ar" dir="rtl">
  ```
  ```css
  .admin-sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: min(18rem, calc(100vw - 2.5rem));
    transform: translateX(-105%);
  ```
- **Why it breaks:** Under the page's Arabic RTL direction, inline-start is the right edge, but the drawer is hardcoded to the physical left and exits with a negative X transform. The phone navigation therefore opens from the opposite side from the Arabic reading/navigation edge.
- **Fix:** Use logical block/inline inset properties and a direction-aware off-canvas transform (positive X for RTL, negative X for LTR), rather than the physical `left: 0` equivalent and one fixed transform sign.

TOTAL FINDINGS: 10
