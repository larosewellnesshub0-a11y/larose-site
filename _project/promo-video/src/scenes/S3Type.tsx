import React from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "../Background";
import { C, F, Glow, expo, tw, useT, pulseAt } from "../lib";

type Card = { big: React.ReactNode; font: string; size: number; rtl?: boolean; label: string; sub: string; weight?: number };
const cards: Card[] = [
  { big: "سندس", font: F.arDisplay, size: 330, rtl: true, label: "Sondos", sub: "عناوين عربي · Arabic display" },
  { big: "لاروز", font: F.arDisplay, size: 330, rtl: true, label: "Sondos", sub: "عناوين عربي · Arabic display" },
  { big: "Aa", font: F.display, size: 420, label: "Romelio", sub: "English display · عناوين إنجليزي" },
  { big: "La Rose", font: F.display, size: 300, label: "Romelio", sub: "English display · عناوين إنجليزي" },
  { big: "التغذية العلاجية", font: F.arBody, size: 170, rtl: true, weight: 400, label: "IBM Plex Sans Arabic", sub: "النصوص العربية · Arabic text" },
  { big: "إدارة الوزن", font: F.arBody, size: 200, rtl: true, weight: 600, label: "IBM Plex Sans Arabic", sub: "400 · 500 · 600" },
  { big: "Montserrat", font: F.sans, size: 190, weight: 500, label: "Montserrat", sub: "Body & UI · النص الإنجليزي" },
  { big: "0123 · 5.0", font: F.sans, size: 190, weight: 400, label: "Montserrat", sub: "Numerals · الأرقام" },
];
const arWords = ["حالتك", "أكبر", "من", "رأي", "تخصص", "واحد"];

// 8–14 s: type specimens, one per half-beat; then the hero line word by word, then its English counterpart.
export const S3Type: React.FC = () => {
  const { t, g } = useT(8);
  const idx = Math.floor(t / 0.5);
  const local = t - idx * 0.5;
  const pop = tw(local, [0, 0.22], [0, 1]);
  const p = pulseAt(g);
  const roseFill = tw(t, [5.55, 6.0], [0, 1], expo);
  return (
    <AbsoluteFill>
      <Background g={g} mode={idx % 2 ? "olive" : "dark"} />
      {idx < 8 && (() => {
        const c = cards[idx];
        return (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div style={{ fontFamily: c.font, fontSize: c.size, fontWeight: c.weight ?? 400, color: C.onDark, direction: c.rtl ? "rtl" : "ltr", lineHeight: 1.1,
              transform: `scale(${1.18 - 0.18 * pop}) translateY(${(1 - pop) * 30}px)`, opacity: pop }}>
              <Glow g={g}>{c.big}</Glow>
            </div>
            <div style={{ display: "flex", gap: 28, alignItems: "center", marginTop: 50, opacity: tw(local, [0.05, 0.2], [0, 1]) }}>
              <div style={{ width: 80, height: 2, background: C.champ }} />
              <div style={{ fontFamily: F.sans, fontSize: 26, letterSpacing: 8, color: C.champ, textTransform: "uppercase" }}>{c.label}</div>
              <div style={{ fontFamily: F.arBody, fontSize: 26, color: C.onDarkMute, direction: "rtl" }}>{c.sub}</div>
              <div style={{ width: 80, height: 2, background: C.champ }} />
            </div>
          </AbsoluteFill>
        );
      })()}
      {idx >= 8 && idx < 10 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ direction: "rtl", fontFamily: F.arDisplay, fontSize: 150, color: C.onDark, display: "flex", flexWrap: "wrap", gap: "0 40px", width: 1000, justifyContent: "center", lineHeight: 1.35 }}>
            {arWords.map((w, i) => {
              const on = tw(t, [4 + i * 0.16, 4 + i * 0.16 + 0.2], [0, 1]);
              const lit = Math.abs(t - (4 + i * 0.16)) < 0.35;
              return <span key={i} style={{ opacity: 0.15 + 0.85 * on, transform: `translateY(${(1 - on) * 40}px)`, display: "inline-block", color: lit ? C.champ300 : C.onDark }}>
                <Glow g={g} strength={lit ? 1.4 : 0.6}>{w}</Glow></span>;
            })}
          </div>
          <div style={{ position: "absolute", bottom: 120, fontFamily: F.sans, letterSpacing: 6, fontSize: 22, color: C.champ }}>HERO · H1 · SONDOS 400</div>
        </AbsoluteFill>
      )}
      {idx >= 10 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: F.display, fontSize: 128, color: C.onDark, width: 1500, textAlign: "center", lineHeight: 1.08, opacity: tw(t, [5, 5.2], [0, 1]), transform: `translateY(${tw(t, [5, 5.3], [40, 0])}px)` }}>
            <Glow g={g}>Your case is more than one specialty’s opinion</Glow>
          </div>
          {/* the rose dot grows into the next scene's rose swatch */}
          <div style={{ position: "absolute", left: 960, top: 540, width: 40, height: 40, marginLeft: -20, marginTop: -20, borderRadius: 99, background: C.rose,
            transform: `scale(${tw(t, [5.4, 5.55], [0, 1]) + roseFill * 60})`, opacity: tw(t, [5.4, 5.45], [0, 1]) }} />
          <div style={{ position: "absolute", bottom: 120, fontFamily: F.sans, letterSpacing: 6, fontSize: 22, color: C.champ, opacity: 1 - roseFill }}>ENGLISH COUNTERPART · ROMELIO</div>
        </AbsoluteFill>
      )}
      <div style={{ position: "absolute", left: 70, top: 60, fontFamily: F.sans, fontSize: 20, letterSpacing: 6, color: C.champ, opacity: 0.8 * (1 - roseFill) }}>
        TYPOGRAPHY · الخطوط <span style={{ opacity: 0.4 + 0.6 * p }}>●</span>
      </div>
    </AbsoluteFill>
  );
};
