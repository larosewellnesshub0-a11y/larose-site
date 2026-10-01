import React from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "../Background";
import { Browser, C, Chip, F, Glow, Phone, Shot, Tablet, expo, inOut, tw, useT } from "../lib";

const pages: [string, string, string, string][] = [
  ["ar-specialties", "التخصصات", "SPECIALTIES", "/ar/specialties/"],
  ["ar-weight", "إدارة الوزن وبدائل التكميم", "WEIGHT MANAGEMENT", "/ar/specialties/weight-management"],
  ["ar-doctor", "د. شيماء فؤاد", "DOCTOR PROFILE", "/ar/doctors/shimaa-fouad"],
  ["ar-branch", "فرع التجمع الخامس", "BRANCH PAGE", "/ar/branches/fifth-settlement"],
  ["ar-bmi", "حاسبة مؤشر كتلة الجسم", "HEALTH TOOLS", "/ar/tools/bmi-calculator"],
  ["ar-recipe", "كتاب وصفات لاروز", "LA ROSE DIGITAL", "/ar/digital/recipe-book"],
];

// 24–30 s: page montage on the half-beat → zoom out to desktop + tablet + phone → AR/EN flip → tape-stop freeze (29–30).
export const S6Pages: React.FC = () => {
  const { t: real, g: greal } = useT(24);
  // time warp for the tape stop
  const u = Math.max(0, real - 5);
  const t = real < 5 ? real : 5 + (1 - Math.pow(1 - Math.min(u, 1), 2.3)) / 2.3;
  const g = greal - real + t;
  const idx = Math.min(5, Math.floor(t / 0.5));
  const lt = t - idx * 0.5;
  const trio = tw(t, [3.0, 3.55], [0, 1], expo);
  const flipT = t - 4.0;
  const flipS = Math.abs(flipT) < 0.12 ? Math.abs(flipT) / 0.12 : 1;
  const en = flipT >= 0;
  const stop = tw(real, [5.0, 6.0], [0, 1], inOut);
  const scrollTrio = tw(t, [3.3, 5.5], [0, 900], inOut);
  // browser: montage size → laptop slot
  const bw = 1500, bh = 900;
  const bx = 960 + (520 - 960) * trio, by = 520 + (560 - 520) * trio, bs = 1 - 0.45 * trio;
  const [name, ar, enLabel, url] = pages[idx];
  return (
    <AbsoluteFill style={{ filter: `brightness(${1 - 0.85 * stop}) saturate(${1 - 0.7 * stop})`, transform: `scale(${1 - 0.04 * stop})` }}>
      <Background g={g} mode="olive" />
      <div style={{ position: "absolute", left: 70, top: 60, fontFamily: F.sans, fontSize: 20, letterSpacing: 6, color: C.champ }}>{trio < 0.5 ? "PAGES · الصفحات" : "EVERY SCREEN · كل الشاشات"}</div>
      <div style={{ position: "absolute", left: bx - bw / 2, top: by - bh / 2, width: bw, height: bh, transform: `scale(${bs}) scaleX(${trio > 0.5 ? flipS : 1})` }}>
        <Browser w={bw} h={bh} url={"laroseclinics.com" + (trio > 0.5 ? (en ? "/en/" : "/ar/") : url)}>
          {trio < 0.02 ? (
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - tw(lt, [0, 0.2], [0, 1])) * -90}px)` }}>
              <Shot name={name as never} width={bw} scroll={tw(lt, [0, 0.5], [0, 420], inOut)} />
            </div>
          ) : (
            <Shot name={(en ? "en-home" : "ar-home") as never} width={bw} scroll={scrollTrio} />
          )}
        </Browser>
      </div>
      {trio > 0 && (
        <>
          <Tablet w={340} style={{ left: 1080, top: 260 + (1 - trio) * 900, transform: `scaleX(${flipS})` }}>
            <Shot name={(en ? "t-en-home" : "t-ar-home") as never} width={340} scroll={scrollTrio} />
          </Tablet>
          <Phone w={220} style={{ left: 1530, top: 330 + (1 - tw(t, [3.1, 3.65], [0, 1], expo)) * 900, transform: `scaleX(${flipS})` }}>
            <Shot name={(en ? "m-en-home" : "m-ar-home") as never} width={220} scroll={scrollTrio} />
          </Phone>
        </>
      )}
      {/* labels */}
      {trio < 0.3 && (
        <div style={{ position: "absolute", bottom: 40, width: "100%", display: "flex", justifyContent: "center", opacity: tw(lt, [0.2, 0.3], [0, 1]), transform: `translateY(${tw(lt, [0.2, 0.32], [16, 0])}px)` }}>
          <Chip dark><span style={{ fontFamily: F.arDisplay, fontSize: 32 }}><Glow g={g} strength={0.7}>{ar}</Glow></span><span style={{ fontFamily: F.sans, fontSize: 18, letterSpacing: 4, color: C.champ }}>{enLabel}</span></Chip>
        </div>
      )}
      {trio > 0.5 && (
        <div style={{ position: "absolute", bottom: 46, width: "100%", textAlign: "center", fontFamily: F.arDisplay, fontSize: 46, color: C.onDark, opacity: tw(t, [3.5, 3.8], [0, 1]) }}>
          <Glow g={g}><span style={{ opacity: en ? 0.45 : 1 }}>عربي</span>  ⇄  <span style={{ fontFamily: F.display, opacity: en ? 1 : 0.45 }}>English</span></Glow>
          <div style={{ fontFamily: F.sans, fontSize: 18, letterSpacing: 6, color: C.champ, marginTop: 6 }}>RTL · LTR · DESKTOP · TABLET · MOBILE</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
