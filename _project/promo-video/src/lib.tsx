import React from "react";
import { Easing, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import shots from "./shots.json";

export const FPS = 30;
export const C = {
  olive: "#8E8B63", olive950: "#23241A", olive900: "#333524", olive800: "#454832", olive700: "#5C5F3F",
  olive100: "#E7E6CF", olive050: "#F3F2E6", sage: "#D6D4AD",
  rose: "#CB8587", rose600: "#B96F72", rose200: "#EDDADA",
  champ: "#D4B793", champ700: "#7E6340", champ300: "#EBDCC8",
  paper: "#FBF9F4", paperSunk: "#F4F1E8", ink: "#23241A", inkStrong: "#1A1B12", inkMuted: "#5F6150",
  onDark: "#F6F4EC", onDarkMute: "#C9C9B4", darkPaper: "#121310", darkRaised: "#1B1C18",
  whatsapp: "#1FA855",
};
export const F = {
  arDisplay: '"Sondos", "IBM Plex Sans Arabic", sans-serif',
  arBody: '"IBM Plex Sans Arabic", sans-serif',
  display: '"Romelio", serif',
  sans: '"Montserrat", sans-serif',
};
for (const [family, file, weight] of [
  ["Sondos", "Sondos-400", "400"], ["Romelio", "Romelio-400", "400"],
  ["Montserrat", "Montserrat-400", "400"], ["Montserrat", "Montserrat-500", "500"], ["Montserrat", "Montserrat-600", "600"],
  ["IBM Plex Sans Arabic", "PlexArabic-400", "400"], ["IBM Plex Sans Arabic", "PlexArabic-500", "500"], ["IBM Plex Sans Arabic", "PlexArabic-600", "600"],
]) loadFont({ family, url: staticFile(`fonts/${file}.woff2`), weight });

// ---------- timing ----------
export const expo = Easing.bezier(0.16, 1, 0.3, 1);
export const inOut = Easing.bezier(0.7, 0, 0.2, 1);
export const easeIn = Easing.bezier(0.6, 0, 0.9, 0.4);
/** interpolate in seconds with clamp */
export const tw = (t: number, inp: number[], out: number[], easing = expo) =>
  interpolate(t, inp, out, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

const GROOVES: [number, number][] = [[4, 29], [40, 56]];
const ROLL: number[] = (() => { const r: number[] = []; let t = 37; while (t < 39.75) { r.push(t); t += t < 38 ? 0.25 : t < 39 ? 0.125 : 0.0625; } return r; })();
const HITS = [4, 18, 40, 56];
/** 0..1 envelope that spikes on every kick / snare and decays — the music's pulse. Global seconds. */
export const pulseAt = (t: number) => {
  let p = 0;
  for (const [a, b] of GROOVES) if (t >= a && t < b) p = Math.max(p, Math.exp(-((t - a) % 0.5) / 0.12));
  for (const r of ROLL) if (t >= r && t < r + 0.3) p = Math.max(p, 0.8 * Math.exp(-(t - r) / 0.06) * (0.4 + (r - 37) / 4));
  for (const h of HITS) if (t >= h && t < h + 1.5) p = Math.max(p, Math.exp(-(t - h) / 0.35));
  if (t < 4 && t >= 2) p = Math.max(p, 0.35 * Math.exp(-((t - 2) % 0.25) / 0.05));
  return p;
};
/** slow breathing, used everywhere so nothing is ever static */
export const breathAt = (t: number) => 0.5 + 0.5 * Math.sin((t / 4) * Math.PI * 2);
/** bar accent (every 2 s) */
export const barAt = (t: number) => {
  for (const [a, b] of GROOVES) if (t >= a && t < b) return Math.exp(-((t - a) % 2) / 0.25);
  return 0;
};

export const useT = (offset: number) => { const f = useCurrentFrame(); return { t: f / FPS, g: f / FPS + offset }; };

// ---------- shots ----------
type ShotName = keyof typeof shots;
export const CSSW = (n: string) => (n.startsWith("m-") ? 390 : n.startsWith("t-") ? 820 : 1440);
/** A real page screenshot shown at `width` px, scrolled to `scroll` css px. */
export const Shot: React.FC<{ name: ShotName; width: number; scroll?: number; style?: React.CSSProperties }> = ({ name, width, scroll = 0, style }) => {
  const [w, h] = shots[name];
  const k = width / CSSW(name);
  return <Img src={staticFile(`shots/${name}.jpg`)} style={{ position: "absolute", left: 0, top: -scroll * k, width, height: (h / w) * width, ...style }} />;
};

// ---------- frames ----------
export const Browser: React.FC<{ w: number; h: number; url: string; children: React.ReactNode; dark?: boolean; style?: React.CSSProperties }> = ({ w, h, url, children, dark, style }) => (
  <div style={{ position: "absolute", width: w, height: h, borderRadius: 18, overflow: "hidden", background: dark ? "#1B1C18" : "#fff",
    boxShadow: "0 2px 6px rgba(20,20,10,.18), 0 40px 90px rgba(20,20,10,.35)", border: `1px solid ${dark ? "#333" : "rgba(0,0,0,.08)"}`, ...style }}>
    <div style={{ height: 44, background: dark ? "#23241A" : "#F4F1E8", display: "flex", alignItems: "center", padding: "0 18px", gap: 8, borderBottom: "1px solid rgba(0,0,0,.06)" }}>
      {["#E2B6B7", "#EBDCC8", "#D6D4AD"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />)}
      <div style={{ marginLeft: 24, flex: 1, maxWidth: 620, height: 26, borderRadius: 13, background: dark ? "#333524" : "#fff", display: "flex", alignItems: "center", padding: "0 14px",
        fontFamily: F.sans, fontSize: 14, color: dark ? C.onDarkMute : C.inkMuted, letterSpacing: 0.2, direction: "ltr" }}>
        <span style={{ color: C.olive, marginRight: 6 }}>●</span>{url}
      </div>
    </div>
    <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>{children}</div>
  </div>
);

export const Phone: React.FC<{ w: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, children, style }) => {
  const h = w * (844 / 390); const b = w * 0.035;
  return (
    <div style={{ position: "absolute", width: w + 2 * b, height: h + 2 * b, borderRadius: w * 0.16, background: "#16170F", padding: b, boxShadow: "0 40px 80px rgba(0,0,0,.4)", ...style }}>
      <div style={{ position: "relative", width: w, height: h, borderRadius: w * 0.13, overflow: "hidden", background: "#fff" }}>
        {children}
        <div style={{ position: "absolute", top: w * 0.03, left: "50%", width: w * 0.3, height: w * 0.075, marginLeft: -w * 0.15, borderRadius: 99, background: "#000" }} />
      </div>
    </div>
  );
};

export const Tablet: React.FC<{ w: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, children, style }) => {
  const h = w * (1180 / 820); const b = w * 0.04;
  return (
    <div style={{ position: "absolute", width: w + 2 * b, height: h + 2 * b, borderRadius: w * 0.07, background: "#16170F", padding: b, boxShadow: "0 40px 80px rgba(0,0,0,.4)", ...style }}>
      <div style={{ position: "relative", width: w, height: h, borderRadius: w * 0.035, overflow: "hidden", background: "#fff" }}>{children}</div>
    </div>
  );
};

// ---------- text ----------
/** Text whose glow breathes with the kick. */
export const Glow: React.FC<{ g: number; color?: string; strength?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ g, color = C.champ, strength = 1, children, style }) => {
  const p = pulseAt(g) * strength;
  const hex = (a: number) => Math.round(Math.min(1, a) * 255).toString(16).padStart(2, "0");
  return (
    <span style={{ textShadow: `0 0 ${2 + 10 * p}px ${color}${hex(0.5 + 0.5 * p)}, 0 0 ${10 + 40 * p}px ${color}${hex(0.15 + 0.55 * p)}, 0 0 ${60 * p}px ${color}${hex(0.35 * p)}`, ...style }}>
      {children}
    </span>
  );
};

/** Wipe reveal that respects RTL (reveals right-to-left for Arabic). */
export const Wipe: React.FC<{ p: number; rtl?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({ p, rtl, children, style }) => {
  const cut = (1 - p) * 100;
  return <div style={{ clipPath: rtl ? `inset(-20% 0 -20% ${cut}%)` : `inset(-20% ${cut}% -20% 0)`, ...style }}>{children}</div>;
};

export const Chip: React.FC<{ children: React.ReactNode; dark?: boolean; style?: React.CSSProperties }> = ({ children, dark, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "12px 24px", borderRadius: 99, border: `1px solid ${dark ? "rgba(246,244,236,.25)" : "rgba(35,36,26,.15)"}`,
    background: dark ? "rgba(35,36,26,.75)" : "rgba(251,249,244,.92)", color: dark ? C.onDark : C.ink, fontFamily: F.arBody, fontSize: 26, ...style }}>{children}</div>
);

export const rnd = (seed: string) => random(seed);
