import React from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "../Background";
import { Browser, Chip, C, F, Shot, inOut, expo, tw, useT, pulseAt } from "../lib";

const TW = 1600, TH = 1000; // browser tile in world px
const tiles: [string, string][] = [
  ["ar-specialties", "/ar/specialties"], ["ar-weight", "/ar/specialties/weight-management"], ["ar-doctors", "/ar/doctors"],
  ["ar-article", "/ar/articles/…"], ["ar-home", "/ar/"], ["ar-bmi", "/ar/tools/bmi-calculator"],
  ["ar-branch", "/ar/branches/fifth-settlement"], ["en-home", "/en/"], ["ar-recipe", "/ar/digital/recipe-book"],
];

// 4–8 s: extreme close-up on the Arabic hero headline → unexpected zoom out to the browser → zoom out again to a wall of pages.
export const S2Home: React.FC = () => {
  const { t, g } = useT(4);
  // world point of the h1 centre (measured: css 720,475 → tile px ×1.111 + 44 chrome, origin tile centre)
  const h1x = 60, h1y = 475 * (TW / 1440) + 44 - TH / 2;
  // open full-bleed: the browser viewport exactly fills the frame (no chrome, no odd crop), then a slow push toward the H1
  const vpY = 44 + 478 - TH / 2; // viewport centre in world px
  const s0 = 1920 / TW;
  const push = tw(t, [0, 1.85], [0, 1], inOut);
  let s = s0 * (1 + 0.1 * push);
  let fx = h1x * 0.5 * push, fy = vpY + (h1y - vpY) * 0.35 * push;
  if (t >= 1.85) { const k = tw(t, [1.85, 2.4], [0, 1], expo); s = s0 * 1.1 + (0.98 - s0 * 1.1) * k; fx = fx * (1 - k); fy = fy * (1 - k); }
  if (t >= 2.9) { const k = tw(t, [2.9, 3.5], [0, 1], expo); s = 0.98 + (0.31 - 0.98) * k; }
  if (t >= 3.5) s = 0.31 - (t - 3.5) * 0.02;
  const p = pulseAt(g);
  const scroll = tw(t, [2.4, 3.0], [0, 120], inOut);
  return (
    <AbsoluteFill>
      <Background g={g} mode="paper" />
      <AbsoluteFill style={{ transform: `translate(960px,540px) scale(${s * (1 + 0.006 * p)}) translate(${-fx}px,${-fy}px)`, transformOrigin: "0 0" }}>
        {tiles.map(([n, url], i) => {
          const cx = ((i % 3) - 1) * (TW + 160), cy = (Math.floor(i / 3) - 1) * (TH + 160);
          const centre = i === 4;
          const tileScroll = centre ? scroll : tw(t, [3.0, 4.0], [0, 260 + i * 40], inOut);
          return (
            <Browser key={n} w={TW} h={TH} url={"laroseclinics.com" + url} style={{ left: cx - TW / 2, top: cy - TH / 2, opacity: centre ? 1 : tw(t, [2.7, 3.2], [0, 1]) }}>
              <Shot name={n as never} width={TW} scroll={tileScroll} />
            </Browser>
          );
        })}
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 70, bottom: 60, opacity: tw(t, [2.4, 2.8], [0, 1]), transform: `translateY(${tw(t, [2.4, 2.8], [30, 0])}px)` }}>
        <Chip><span style={{ fontFamily: F.arDisplay, fontSize: 30 }}>الرئيسية</span><span style={{ fontFamily: F.sans, fontSize: 18, color: C.inkMuted, letterSpacing: 2 }}>HOME · /ar/</span></Chip>
      </div>
    </AbsoluteFill>
  );
};
