import React from "react";
import { AbsoluteFill } from "remotion";
import { Background, archPath } from "../Background";
import { Browser, C, Chip, F, Glow, Shot, easeIn, expo, inOut, tw, useT, pulseAt } from "../lib";

// 72–84 s: the finale after the key change. 0–4 recap through the arch, 4–8 the same browser flips language/theme/page
// on every half-beat, 8–11.5 an unexpected zoom out to a tilted wall of pages, 11.5–12 the wall collapses into the logo hit.
const AW = 560, AH = 720;
const recap: [string, number, number, number][] = [
  ["ar-home", 720, 470, 900], ["ar-specialties", 720, 600, 900], ["ar-doctor", 1024, 600, 600], ["ar-weight", 720, 500, 900],
  ["ar-branch", 720, 500, 900], ["ar-bmi", 720, 700, 900], ["ar-recipe", 720, 500, 900], ["ar-article", 720, 860, 800],
  ["ar-home-dark", 720, 470, 900], ["en-home", 720, 470, 900], ["ar-about", 720, 500, 900], ["ar-tools", 720, 500, 900],
  ["ar-rheum", 720, 500, 900], ["ar-patients", 720, 500, 900], ["en-article", 720, 500, 900], ["ar-articles", 720, 600, 900],
];
const words: [string, string][] = [["تصميم", "DESIGN"], ["خطوط", "TYPE"], ["ألوان", "COLOUR"], ["واجهة", "INTERFACE"]];
const flips: [string, string, string][] = [
  ["ar-home", "عربي", "/ar/"], ["en-home", "English", "/en/"], ["ar-home-dark", "الوضع الليلي", "/ar/ · dark"], ["ar-home", "الوضع النهاري", "/ar/ · light"],
  ["ar-article", "مقال", "/ar/articles/…"], ["en-article", "Article", "/en/articles/…"], ["ar-specialties", "التخصصات", "/ar/specialties/"], ["ar-doctors", "الأطباء", "/ar/doctors/"],
];
const wall = ["ar-specialties", "ar-weight", "ar-doctors", "ar-article", "ar-bmi", "ar-branch", "en-home", "ar-recipe", "ar-about", "ar-tools", "ar-home-dark", "en-article",
  "ar-home", "ar-rheum", "ar-patients", "en-specialties", "ar-articles", "ar-doctor", "en-doctors", "ar-branches", "ar-weight", "ar-specialties", "ar-bmi", "en-home", "ar-article"];

export const SFinale: React.FC = () => {
  const { t, g } = useT(72);
  const p = pulseAt(g);
  if (t < 4) {
    const i = Math.min(15, Math.floor(t / 0.25)); const lt = t - i * 0.25;
    const [shot, cx, cy, cw] = recap[i]; const k = AW / cw;
    const w = words[Math.min(3, Math.floor(t))]; const wl = t - Math.floor(t);
    return (
      <AbsoluteFill>
        <Background g={g} mode="dark" />
        <div style={{ position: "absolute", left: 1240 - AW / 2, top: 540 - AH / 2, width: AW, height: AH, borderRadius: `${AW / 2}px ${AW / 2}px 22px 22px`, overflow: "hidden",
          transform: `scale(${tw(lt, [0, 0.12], [1.1, 1]) * (1 + 0.02 * p)})`, boxShadow: `0 0 ${20 + 60 * p}px rgba(212,183,147,${0.15 + 0.35 * p})`, background: C.olive900 }}>
          <Shot name={shot as never} width={1440 * k} style={{ left: AW / 2 - cx * k, top: AH / 2 - cy * k }} />
        </div>
        <div style={{ position: "absolute", left: 140, top: 380, width: 760, textAlign: "right" }}>
          <div style={{ fontFamily: F.arDisplay, fontSize: 210, color: C.onDark, direction: "rtl", transform: `scale(${tw(wl, [0, 0.15], [1.25, 1])})`, transformOrigin: "right", opacity: tw(wl, [0, 0.08], [0, 1]) }}>
            <Glow g={g} strength={1.5}>{w[0]}</Glow>
          </div>
          <div style={{ fontFamily: F.sans, fontSize: 26, letterSpacing: 12, color: C.champ, marginTop: 4 }}>{w[1]}</div>
        </div>
      </AbsoluteFill>
    );
  }
  const zo1 = tw(t, [8, 8.6], [0, 1], expo), zo2 = tw(t, [9, 9.6], [0, 1], expo);
  const s = 1 - 0.62 * zo1 - 0.16 * zo2;
  const tilt = 22 * zo1;
  const collapse = tw(t, [11.5, 12], [0, 1], easeIn);
  const fi = Math.min(7, Math.floor((t - 4) / 0.5)); const fl = t - 4 - fi * 0.5;
  const [fshot, flabel, furl] = flips[fi];
  const BW = 1500, BH = 900;
  return (
    <AbsoluteFill>
      <Background g={g} mode={fshot === "ar-home-dark" && t < 8 ? "night" : "olive"} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        <AbsoluteFill style={{ transform: `translate(960px,540px) rotateX(${tilt}deg) rotateZ(${-tilt * 0.25}deg) scale(${s * (1 - collapse)}) rotate(${collapse * 30}deg)`, transformOrigin: "0 0", transformStyle: "preserve-3d" }}>
          {wall.map((n, i) => {
            const c = (i % 5) - 2, r = Math.floor(i / 5) - 2;
            const centre = c === 0 && r === 0;
            if (!centre && t < 8) return null;
            return (
              <Browser key={i} w={BW} h={BH} url={centre ? "laroseclinics.com" + furl : "laroseclinics.com"} dark={centre && fshot === "ar-home-dark"}
                style={{ left: c * (BW + 140) - BW / 2, top: r * (BH + 140) - BH / 2, opacity: centre ? 1 : tw(t, [8.2, 8.8], [0, 1]) }}>
                <Shot name={(centre ? fshot : n) as never} width={BW} scroll={centre ? (t < 8 ? tw(fl, [0, 0.5], [0, 120], inOut) : tw(t, [8, 11.5], [0, 900], inOut)) : tw(t, [8, 11.5], [0, 400 + (i % 4) * 150], inOut)} />
              </Browser>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>
      {t < 8 && (
        <div style={{ position: "absolute", bottom: 46, width: "100%", display: "flex", justifyContent: "center", opacity: tw(fl, [0, 0.08], [0, 1]) }}>
          <Chip dark><span style={{ fontFamily: F.arDisplay, fontSize: 34 }}><Glow g={g} strength={0.8}>{flabel}</Glow></span></Chip>
        </div>
      )}
      {t >= 8.8 && (
        <div style={{ position: "absolute", top: 470, width: "100%", textAlign: "center", opacity: tw(t, [8.8, 9.2], [0, 1]) * (1 - collapse) }}>
          <Chip dark style={{ padding: "22px 50px" }}><span style={{ fontFamily: F.graphik, fontSize: 52, letterSpacing: 2 }}><Glow g={g}>laroseclinics.com</Glow></span></Chip>
        </div>
      )}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: collapse }}>
        <path d={archPath(420, 560)} transform={`translate(960 395) scale(${2.5 - 1.5 * collapse})`} fill="none" stroke={C.champ} strokeWidth={2.5} />
      </svg>
    </AbsoluteFill>
  );
};
