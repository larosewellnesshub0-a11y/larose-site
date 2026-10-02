import React from "react";
import { C, F, expo, tw } from "../lib";
import { AbsoluteFill, BG, PhoneShot, RGlow, useG } from "./kit";

// 48–51: it feels like the end (music has fallen away) — «ولسه…» — then the snare roll builds; a light flash, never black.
export const R4Twist: React.FC = () => {
  const { t, g } = useG(48);
  const away = tw(t, [0, 0.7], [0, 1], expo);
  const a = tw(t, [0.4, 1.0], [0, 1], expo);
  const shake = t > 2.5 && t < 2.8 ? Math.sin(t * 170) * 7 : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px,${-shake * 0.5}px) scale(${1 + Math.max(0, t - 1.8) * 0.06})` }}>
      <BG g={g} mode="paper" dial={false} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 - 0.8 * away}) translateY(${away * 300}px)`, transformOrigin: "540px 1300px", opacity: 1 - away }}>
        <PhoneShot name="m-ar-prep" scroll={500} />
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: a }}>
        <div style={{ fontFamily: F.arDisplay, fontSize: 240, color: C.ink, direction: "rtl", transform: `scale(${1.15 - 0.15 * a})` }}><RGlow g={g} strength={1.3}>ولسه…</RGlow></div>
        <div style={{ fontFamily: F.graphik, fontWeight: 500, fontSize: 46, color: C.champ700, letterSpacing: 2 }}>And there's more…</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: C.champ300, opacity: tw(t, [2.75, 3.0], [0, 0.9], (x) => x * x) }} />
    </AbsoluteFill>
  );
};
