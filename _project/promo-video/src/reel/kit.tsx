import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Background } from "../Background";
import { C, F, FPS, Glow, Phone, Shot, expo, gloss, tw } from "../lib";
import { reelClock, rPulse } from "./clock";

export const W = 1080, H = 1920;
// The phone: screen 600×1298 (390 css × 1.538). Text lives above it, inside the reel safe zone (y 230–560).
export const PW = 600, BEZ = PW * 0.035, PX = (W - PW - 2 * BEZ) / 2, PY = 590;
export const K = PW / 390; // screen px per css px
/** screen position (frame px) of a point given in phone-css px */
export const sx = (x: number) => PX + BEZ + x * K;
export const sy = (y: number) => PY + BEZ + y * K;

export const useG = (offset: number) => { const f = useCurrentFrame(); const t = f / FPS; return { t, g: t + offset }; };
export const RGlow: React.FC<{ g: number; strength?: number; color?: string; children: React.ReactNode }> = (p) => <Glow {...p} pulse={rPulse} />;
export const BG: React.FC<{ g: number; mode?: "paper" | "dark" | "brand" | "night"; dial?: boolean }> = ({ g, mode = "paper", dial = true }) => <Background g={g} mode={mode} clock={reelClock} dial={dial} />;

/** Headline block in the safe zone. `lead` decides which language is the big line. */
export const Headline: React.FC<{ g: number; t: number; at?: number; ar: React.ReactNode; en: React.ReactNode; lead?: "ar" | "en"; sub?: React.ReactNode; dark?: boolean; top?: number; size?: number }> = ({ g, t, at = 0, ar, en, lead = "ar", sub, dark, top = 250, size }) => {
  const a = tw(t, [at, at + 0.25], [0, 1], expo);
  const ink = dark ? C.onDark : C.ink, mute = dark ? C.onDarkMute : C.inkMuted, acc = dark ? C.champ : C.champ700;
  const big = lead === "ar"
    ? <div style={{ fontFamily: F.arDisplay, fontSize: size ?? 84, lineHeight: 1.2, color: ink, direction: "rtl" }}><RGlow g={g} strength={dark ? 1.2 : 0.55}>{ar}</RGlow></div>
    : <div style={{ fontFamily: F.graphik, fontWeight: 700, fontSize: size ?? 92, lineHeight: 1.05, letterSpacing: -1.5, color: ink }}><RGlow g={g} strength={dark ? 1.2 : 0.55}>{en}</RGlow></div>;
  const small = lead === "ar"
    ? <div style={{ fontFamily: F.graphik, fontWeight: 500, fontSize: 30, letterSpacing: 1, color: acc, marginTop: 14 }}>{en}</div>
    : <div style={{ fontFamily: F.arDisplay, fontSize: 46, color: acc, marginTop: 12, direction: "rtl" }}>{ar}</div>;
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60, textAlign: "center", opacity: a, transform: `translateY(${(1 - a) * 40}px) scale(${1.06 - 0.06 * a})` }}>
      {big}{small}
      {sub && <div style={{ fontFamily: F.arBody, fontSize: 32, color: mute, marginTop: 14, direction: "rtl" }}>{sub}</div>}
    </div>
  );
};

/** Touch indicator: a glossy dot that presses, with a ring ripple. Pair every one with a "tap" SFX at the same time. */
export const Tap: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => {
  if (t < at - 0.25 || t > at + 0.5) return null;
  const inn = tw(t, [at - 0.25, at - 0.05], [0, 1], expo) * tw(t, [at + 0.2, at + 0.45], [1, 0]);
  const press = Math.max(tw(t, [at, at + 0.05], [0, 1]) - tw(t, [at + 0.08, at + 0.2], [0, 1]), 0);
  const ring = tw(t, [at, at + 0.45], [0, 1], expo);
  return (
    <>
      <div style={{ position: "absolute", left: x - 60, top: y - 60, width: 120, height: 120, borderRadius: 99, border: `3px solid ${C.rose}`, transform: `scale(${0.3 + ring * 1.2})`, opacity: t >= at ? 1 - ring : 0 }} />
      <div style={{ position: "absolute", left: x - 34, top: y - 34, width: 68, height: 68, ...gloss(false, 99), opacity: inn * 0.95, transform: `scale(${1 - 0.25 * press})` }} />
    </>
  );
};

/** The site's fixed mobile bottom bar (captures hide fixed elements, so it is redrawn live). WhatsApp item centre: css (241, 807). */
export const BottomBar: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div style={{ position: "absolute", left: 12 * K, right: 12 * K, bottom: 10 * K, height: 64 * K, borderRadius: 99, ...gloss(!!dark, 99), display: "flex", direction: "rtl", alignItems: "center", justifyContent: "space-around", padding: `0 ${6 * K}px`, fontFamily: F.arBody, fontSize: 12 * K, color: dark ? C.onDark : C.ink }}>
    {[["☎", "اتصل بينا"], ["●", "واتساب"], ["▣", "احجز الآن"], ["≡", "القائمة"]].map(([i, l]) => (
      <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 * K, ...(l === "احجز الآن" ? { background: C.rose600, color: "#fff", borderRadius: 99, padding: `${6 * K}px ${16 * K}px` } : {}) }}>
        <span style={{ fontSize: 14 * K, color: l === "واتساب" ? C.whatsapp : undefined, lineHeight: 1 }}>{i}</span>{l}
      </div>
    ))}
  </div>
);

export const PhoneShot: React.FC<{ name: string; scroll?: number; style?: React.CSSProperties; children?: React.ReactNode; dim?: number; bar?: boolean }> = ({ name, scroll = 0, style, children, dim = 0, bar = true }) => (
  <Phone w={PW} style={{ left: PX, top: PY, ...style }}>
    <Shot name={name as never} width={PW} scroll={scroll} />
    {bar && <BottomBar dark={name.includes("dark")} />}
    {dim > 0 && <AbsoluteFill style={{ background: `rgba(35,36,26,${dim})` }} />}
    {children}
  </Phone>
);

export const Photo: React.FC<{ src: string; style?: React.CSSProperties; arch?: boolean; t?: number }> = ({ src, style, arch = true, t = 0 }) => (
  <div style={{ position: "absolute", overflow: "hidden", borderRadius: arch ? "999px 999px 28px 28px" : 28, boxShadow: "0 24px 60px rgba(60,54,32,.28)", ...style }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 - t * 0.015})` }} />
  </div>
);

export const Counter: React.FC<{ t: number; from: number; to: number; at: number; dur?: number; dec?: number; prefix?: string; suffix?: string; style?: React.CSSProperties }> = ({ t, from, to, at, dur = 0.7, dec = 0, prefix = "", suffix = "", style }) => {
  const v = tw(t, [at, at + dur], [0, 1], (x) => x);
  return <span style={{ fontVariantNumeric: "tabular-nums", direction: "ltr", unicodeBidi: "isolate", ...style }}>{prefix}{(from + (to - from) * v).toFixed(dec)}{suffix}</span>;
};
export { AbsoluteFill };
