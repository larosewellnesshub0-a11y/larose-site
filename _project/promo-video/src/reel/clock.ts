// Reel timing (120 BPM, beat = 0.5 s). Mirrors scripts/reel-music.py.
//  0–3 hook (no kick) | 3–45 groove (A to 21, B after) | 45–49 low "ending" | 49–51 build | 51–80 drop (+2 at 64) | 80 hit, tail
import type { Clock } from "../Background";
const GROOVES: [number, number][] = [[3, 45], [51, 80]];
const HITS = [3, 5, 21, 51, 64, 80];
const ROLL = (() => { const r: number[] = []; let t = 49; while (t < 50.9) { r.push(t); t += t < 50 ? 0.25 : 0.125; } return r; })();
export const rPulse = (t: number) => {
  let p = 0;
  for (const [a, b] of GROOVES) if (t >= a && t < b) p = Math.max(p, Math.exp(-((t - a) % 0.5) / 0.12));
  for (const h of HITS) if (t >= h && t < h + 1.2) p = Math.max(p, Math.exp(-(t - h) / 0.3));
  for (const r of ROLL) if (t >= r && t < r + 0.25) p = Math.max(p, 0.8 * Math.exp(-(t - r) / 0.06) * (0.4 + (r - 49) / 3));
  if (t < 3) p = Math.max(p, 0.3 * Math.exp(-(t % 0.25) / 0.05));
  return p;
};
export const rBar = (t: number) => { for (const [a, b] of GROOVES) if (t >= a && t < b) return Math.exp(-((t - a) % 2) / 0.25); return 0; };
export const rEmit = (g: number) => {
  const out: number[] = [];
  const add = (a: number, b: number, step: number) => { for (let t = a; t < b; t += step) if (t <= g && g - t < 2.2) out.push(t); };
  add(0, 3, 0.5); add(3, 45, 1); add(45, 49, 3); add(49, 51, 0.25); add(51, 80, 0.5); add(80, 84, 1.5);
  return out;
};
export const reelClock: Clock = { pulse: rPulse, bar: rBar, emit: rEmit };
