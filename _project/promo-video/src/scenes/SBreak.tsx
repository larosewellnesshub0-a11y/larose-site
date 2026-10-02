import React from "react";
import { AbsoluteFill, spring, useVideoConfig } from "remotion";
import { Background } from "../Background";
import { C, F, Glow, easeIn, glass, tw, useT } from "../lib";
import { CoverWall } from "./CoverWall";

// 72–76 s: a kick-less break. Glass stat tiles over the article wall, each number counting with the digital-counter SFX.
// Every figure is from the site/content as of 2026-10-01.
const stats: [number, string, string][] = [
  [10, "تخصصات طبية", "SPECIALTIES"], [4, "أطباء", "DOCTORS"], [2, "فروع مفتوحة", "OPEN BRANCHES"],
  [269, "مقال عربي", "ARABIC ARTICLES"], [269, "مقال إنجليزي", "ENGLISH ARTICLES"], [643, "رابط في خريطة الموقع", "SITEMAP URLS"],
];
export const SBreak: React.FC = () => {
  const { t, g } = useT(72);
  const { fps } = useVideoConfig();
  const blow = tw(t, [3.5, 4.0], [0, 1], easeIn);
  return (
    <AbsoluteFill>
      <Background g={g} mode="paper" />
      <AbsoluteFill style={{ transform: `translate(960px,540px) scale(${0.3 + t * 0.03 + blow * 0.6})`, transformOrigin: "0 0", opacity: 0.55 }}>
        <CoverWall reveal={1.4} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 70, top: 60, fontFamily: F.sans, fontSize: 20, letterSpacing: 6, color: C.champ700 }}>BY THE NUMBERS · بالأرقام</div>
      <div style={{ position: "absolute", left: 210, top: 200, width: 1500, display: "flex", flexWrap: "wrap", gap: 40, direction: "rtl", transform: `scale(${1 + blow * 0.5})`, opacity: 1 - blow }}>
        {stats.map(([n, ar, en], i) => {
          const at = i * 0.5;
          const s = t < at ? 0 : spring({ frame: (t - at) * fps, fps, config: { damping: 14, stiffness: 200 } });
          const v = Math.round(tw(t, [at, at + 0.4], [0, n], (x) => x));
          return (
            <div key={i} style={{ width: 473, height: 300, ...glass(false, 28), padding: "36px 40px", transform: `scale(${s})`, opacity: Math.min(1, s * 2) }}>
              <div style={{ fontFamily: F.graphik, fontWeight: 600, fontSize: 120, color: C.ink, direction: "ltr", textAlign: "right", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                <Glow g={g} strength={0.5}>{v}</Glow>
              </div>
              <div style={{ width: 70, height: 2, background: C.champ, margin: "18px 0 14px auto" }} />
              <div style={{ fontFamily: F.arDisplay, fontSize: 34, color: C.ink }}>{ar}</div>
              <div style={{ fontFamily: F.sans, fontSize: 15, letterSpacing: 5, color: C.champ700, marginTop: 6 }}>{en}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
