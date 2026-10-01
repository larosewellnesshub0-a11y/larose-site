import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "LaRosePromo", browserExecutable: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell" });
for (const f of frames) {
  await renderStill({ serveUrl, composition, frame: f, output: `/tmp/claude-0/stills/f${String(f).padStart(4, "0")}.jpg`, imageFormat: "jpeg", scale: 0.4, browserExecutable: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell" });
}
console.log("done");
