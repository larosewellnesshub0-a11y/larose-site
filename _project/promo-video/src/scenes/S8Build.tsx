import React from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "../Background";
import { C, F, Glow, tw, useT } from "../lib";

// 37–40 s: the plot twist builds on the snare roll: «استنى!» then «الموقع ده كمان SEO Optimized», word by word.
const words: [string, boolean][] = [["الموقع", false], ["ده", false], ["كمان", false], ["SEO", true], ["Optimized", true]];
export const S8Build: React.FC = () => {
  const { t, g } = useT(47);
  const shake = t > 2.4 && t < 2.75 ? Math.sin(t * 160) * 6 : 0;
  const black = false;
  const wait = t < 1;
  const popWait = tw(t, [0, 0.12], [0, 1]);
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${-shake * 0.6}px) scale(${1 + Math.max(0, t - 2) * 0.08})` }}>
      <Background g={g} mode="dark" ripples={1.2} />
      {!black && wait && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: F.arDisplay, fontSize: 300, color: C.onDark, direction: "rtl", transform: `scale(${1.25 - 0.25 * popWait})`, opacity: popWait }}>
            <Glow g={g} strength={1.6}>استنى!</Glow>
          </div>
        </AbsoluteFill>
      )}
      {!black && !wait && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 40, direction: "rtl", fontFamily: F.arDisplay, fontSize: 150, color: C.onDark }}>
            {words.slice(0, 3).map(([w], i) => {
              const at = 1 + i * 0.25; const on = tw(t, [at, at + 0.1], [0, 1]);
              return <span key={w} style={{ opacity: on, transform: `scale(${1.3 - 0.3 * on})`, display: "inline-block" }}><Glow g={g} strength={Math.abs(t - at) < 0.25 ? 1.6 : 0.5}>{w}</Glow></span>;
            })}
          </div>
          <div style={{ display: "flex", gap: 44, fontFamily: F.graphik, fontWeight: 700, fontSize: 160, color: C.champ300, letterSpacing: -2 }}>
            {words.slice(3).map(([w], i) => {
              const at = 1.75 + i * 0.25; const on = tw(t, [at, at + 0.1], [0, 1]);
              return <span key={w} style={{ opacity: on, transform: `scale(${1.3 - 0.3 * on})`, display: "inline-block" }}><Glow g={g} strength={1.6}>{w}</Glow></span>;
            })}
          </div>
        </AbsoluteFill>
      )}
      {/* no black: a champagne flash punches into the drop instead */}
      <AbsoluteFill style={{ background: C.champ300, opacity: tw(t, [2.7, 3.0], [0, 0.9], (x) => x * x) }} />
    </AbsoluteFill>
  );
};
