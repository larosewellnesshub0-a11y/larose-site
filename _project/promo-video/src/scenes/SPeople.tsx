import React from "react";
import { AbsoluteFill, Img, spring, staticFile, useVideoConfig } from "remotion";
import { Background } from "../Background";
import { C, F, Glow, expo, glass, inOut, tw, useT } from "../lib";

// 35–40 s: the doctors (Dr. Shimaa Sherif's portrait stays empty until the clinic supplies one — never generated),
// then the branches; the last second is the tape stop (39–40): motion slows to a freeze and the colour drains.
const docs: [string | null, string, string][] = [
  ["brand/shimaa-fouad@2x.webp", "د. شيماء فؤاد", "التغذية العلاجية والإكلينيكية"],
  ["brand/alyaa-abu-taleb@2x.webp", "د. علياء سعيد أبوطالب", "التغذية العلاجية والإكلينيكية"],
  ["brand/mohab-ashraf@2x.webp", "د. مهاب أشرف فؤاد", "الباطنة والكبد والجهاز الهضمي"],
  [null, "د. شيماء شريف", "الروماتيزم والمفاصل"],
];
const branches: [string, string, string, boolean][] = [
  ["brand/branch-maadi.webp", "فرع المعادي", "MAADI", true],
  ["brand/branch-fifth-settlement.webp", "فرع التجمع الخامس", "FIFTH SETTLEMENT", true],
  ["brand/branch-sheikh-zayed.webp", "فرع الشيخ زايد", "SHEIKH ZAYED", false],
];

export const SPeople: React.FC = () => {
  const { t: real, g: greal } = useT(35);
  const u = Math.max(0, real - 4);
  const t = real < 4 ? real : 4 + (1 - Math.pow(1 - Math.min(u, 1), 2.3)) / 2.3; // tape-stop time warp
  const g = greal - real + t;
  const { fps } = useVideoConfig();
  const sp = (at: number) => (t < at ? 0 : spring({ frame: (t - at) * fps, fps, config: { damping: 13, stiffness: 190 } }));
  const stop = tw(real, [4.0, 5.0], [0, 1], inOut);
  const toBranches = tw(t, [2.4, 2.75], [0, 1], expo);
  return (
    <AbsoluteFill style={{ filter: `saturate(${1 - 0.8 * stop}) brightness(${1 - 0.25 * stop})` }}>
      <Background g={g} mode="dark" />
      <div style={{ position: "absolute", left: 70, top: 60, fontFamily: F.sans, fontSize: 20, letterSpacing: 6, color: C.champ }}>{toBranches < 0.5 ? "OUR DOCTORS · أطباؤنا" : "BRANCHES · الفروع"}</div>
      <AbsoluteFill style={{ transform: `translateY(${-toBranches * 1080}px)` }}>
        <div style={{ position: "absolute", top: 170, width: "100%", display: "flex", justifyContent: "center", gap: 46, direction: "rtl" }}>
          {docs.map(([img, name, sp1], i) => {
            const s = sp(i * 0.25);
            return (
              <div key={name} style={{ width: 360, transform: `scale(${s}) translateY(${(1 - s) * 60}px)`, opacity: Math.min(1, s * 2), textAlign: "center" }}>
                <div style={{ width: 360, height: 470, borderRadius: "180px 180px 22px 22px", overflow: "hidden", background: C.olive900, border: "1px solid rgba(212,183,147,.35)" }}>
                  {img && <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 - t * 0.02})` }} />}
                </div>
                <div style={{ fontFamily: F.arDisplay, fontSize: 36, color: C.onDark, marginTop: 24 }}><Glow g={g} strength={0.5}>{name}</Glow></div>
                <div style={{ fontFamily: F.arBody, fontSize: 22, color: C.champ, marginTop: 8 }}>{sp1}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", top: 1080 + 200, width: "100%", display: "flex", justifyContent: "center", gap: 46, direction: "rtl" }}>
          {branches.map(([img, ar, en, open], i) => {
            const s = sp(2.5 + i * 0.25);
            return (
              <div key={en} style={{ width: 520, transform: `scale(${s})`, opacity: Math.min(1, s * 2) }}>
                <div style={{ width: 520, height: 520, borderRadius: "260px 260px 24px 24px", overflow: "hidden", position: "relative" }}>
                  <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: open ? "none" : "saturate(.4)", transform: `scale(${1.1 - t * 0.02})` }} />
                  <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, ...glass(true, 20), padding: "18px 24px", textAlign: "center" }}>
                    <div style={{ fontFamily: F.arDisplay, fontSize: 36, color: C.onDark }}>{ar}</div>
                    <div style={{ fontFamily: F.sans, fontSize: 16, letterSpacing: 5, color: C.champ, marginTop: 4 }}>{en}{open ? "" : " · قريباً"}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
