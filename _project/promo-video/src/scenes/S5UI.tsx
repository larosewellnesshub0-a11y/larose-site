import React from "react";
import { AbsoluteFill, spring, useVideoConfig } from "remotion";
import { Background } from "../Background";
import { C, F, Glow, expo, inOut, tw, useT } from "../lib";

const specialties = ["التغذية العلاجية والإكلينيكية", "إدارة الوزن وبدائل التكميم", "نحت الجسم", "الباطنة العامة", "الكبد والجهاز الهضمي والمناظير", "الروماتيزم والمفاصل"];

const Btn: React.FC<{ bg: string; fg: string; bd?: string; children: React.ReactNode; s: number; press?: number; font?: string }> = ({ bg, fg, bd, children, s, press = 0, font = F.arBody }) => (
  <div style={{ padding: "22px 46px", borderRadius: 99, background: bg, color: fg, border: `1.5px solid ${bd ?? "transparent"}`, fontFamily: font, fontSize: 30, fontWeight: 500,
    transform: `scale(${s * (1 - 0.07 * press)})`, opacity: Math.min(1, s * 1.5), boxShadow: bg !== "transparent" ? "0 10px 30px rgba(35,36,26,.18)" : "none", display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap" }}>{children}</div>
);

// 18–24 s: the UI kit, rebuilt from the site's tokens. Buttons pop on the beat, a cursor books, the booking card and dropdown,
// counters, then the moon toggle flips everything to the dark theme.
export const S5UI: React.FC = () => {
  const { t, g } = useT(18);
  const { fps } = useVideoConfig();
  const sp = (at: number) => (t < at ? 0 : spring({ frame: (t - at) * fps, fps, config: { damping: 12, stiffness: 200 } }));
  const dark = tw(t, [5.0, 5.15], [0, 1]);
  const D = dark > 0.5;
  const ink = D ? "#E9E6D8" : C.ink, muted = D ? "#BEBBA5" : C.inkMuted, card = D ? "#1B1C18" : "#FFFDF9";
  // cursor path
  const cx = tw(t, [1.9, 2.45], [1700, 1610], inOut), cy = tw(t, [1.9, 2.45], [1000, 318], inOut);
  const cx2 = tw(t, [2.6, 2.95], [cx, 1500], inOut), cy2 = tw(t, [2.6, 2.95], [cy, 575], inOut);
  const cx3 = tw(t, [4.6, 4.95], [cx2, 1720], inOut), cy3 = tw(t, [4.6, 4.95], [cy2, 120], inOut);
  const press = Math.max(tw(t, [2.5, 2.55], [0, 1]) - tw(t, [2.6, 2.7], [0, 1]), 0);
  const btnUp = tw(t, [3.0, 3.4], [0, 1], expo);
  const cardIn = tw(t, [2.95, 3.35], [0, 1], expo);
  const dd = tw(t, [3.5, 3.7], [0, 1], expo);
  const hl = Math.min(5, Math.floor(Math.max(0, t - 3.6) / 0.12));
  const count = (to: number, dec = 0) => tw(t, [4.0, 4.8], [0, to], inOut).toFixed(dec);
  const exit = tw(t, [5.5, 6.0], [1, 0.82], inOut);
  return (
    <AbsoluteFill>
      <Background g={g} mode={D ? "night" : "paper"} />
      <div style={{ position: "absolute", left: 70, top: 60, fontFamily: F.sans, fontSize: 20, letterSpacing: 6, color: D ? C.champ : C.champ700 }}>UI ELEMENTS · عناصر الواجهة</div>
      {/* theme toggle */}
      <div style={{ position: "absolute", right: 170, top: 90, width: 64, height: 64, borderRadius: 32, border: `1.5px solid ${D ? "#444" : "rgba(35,36,26,.2)"}`, background: card,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: ink, opacity: tw(t, [4.2, 4.5], [0, 1]), transform: `scale(${1 - 0.1 * (tw(t, [4.95, 5.0], [0, 1]) - tw(t, [5.05, 5.15], [0, 1]))})` }}>{D ? "☀" : "☾"}</div>
      <AbsoluteFill style={{ transform: `scale(${exit})` }}>
        {/* buttons row (RTL) */}
        <div style={{ position: "absolute", top: 280 - btnUp * 160, right: 170, display: "flex", gap: 26, direction: "rtl", transform: `scale(${1 - 0.25 * btnUp})`, transformOrigin: "right top" }}>
          <Btn bg={C.rose600} fg="#fff" s={sp(0)} press={press}>احجز موعدك</Btn>
          <Btn bg="transparent" fg={ink} bd={D ? "#555" : "rgba(35,36,26,.3)"} s={sp(0.5)}>استكشف التخصصات</Btn>
          <Btn bg={D ? "#F6F4EC" : "#454832"} fg={D ? C.ink : C.onDark} s={sp(1.0)} font={F.sans}>Book appointment</Btn>
          <Btn bg={C.whatsapp} fg="#fff" s={sp(1.5)}>● واتساب</Btn>
        </div>
        {/* click ring */}
        <div style={{ position: "absolute", left: 1610 - 60, top: 318 - 60, width: 120, height: 120, borderRadius: 99, border: `2px solid ${C.rose}`,
          transform: `scale(${tw(t, [2.5, 2.9], [0.3, 1.8])})`, opacity: tw(t, [2.5, 2.55], [0, 1]) * tw(t, [2.6, 2.9], [1, 0]) }} />
        {/* booking card */}
        <div style={{ position: "absolute", right: 170, top: 330 + (1 - cardIn) * 80, width: 1580, opacity: cardIn, background: card, borderRadius: 26, padding: "44px 54px", direction: "rtl",
          boxShadow: "0 1px 2px rgba(60,54,32,.06), 0 24px 60px rgba(60,54,32,.18)", border: `1px solid ${D ? "#2B2C25" : "rgba(212,183,147,.45)"}` }}>
          <div style={{ fontFamily: F.arBody, fontSize: 24, color: D ? C.champ : C.champ700, letterSpacing: 1 }}>احجز في دقيقة</div>
          <div style={{ fontFamily: F.arDisplay, fontSize: 52, color: ink, marginTop: 6 }}><Glow g={g} strength={D ? 0.7 : 0.25} color={C.champ}>اختار التخصص والطبيب المناسب لحالتك</Glow></div>
          <div style={{ display: "flex", gap: 22, marginTop: 30, alignItems: "flex-end" }}>
            {[["اختار التخصص", "كل التخصصات"], ["اختار الطبيب", "أي طبيب متاح"], ["اختار الفرع", "فرع التجمع الخامس"]].map(([l, v], i) => (
              <div key={i} style={{ flex: 1, position: "relative" }}>
                <div style={{ fontFamily: F.arBody, fontSize: 22, color: muted, marginBottom: 10 }}>{l}</div>
                <div style={{ height: 66, borderRadius: 14, border: `1.5px solid ${i === 0 && dd > 0 ? C.olive : D ? "#333" : "rgba(35,36,26,.18)"}`, background: D ? "#121310" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", fontFamily: F.arBody, fontSize: 25, color: ink }}>{v}<span style={{ fontSize: 18, color: muted }}>⌄</span></div>
                {i === 0 && (
                  <div style={{ position: "absolute", top: 110, right: 0, left: 0, background: card, borderRadius: 14, border: `1px solid ${D ? "#333" : "rgba(35,36,26,.12)"}`, boxShadow: "0 20px 50px rgba(0,0,0,.18)",
                    overflow: "hidden", transformOrigin: "top", transform: `scaleY(${dd})`, opacity: dd * tw(t, [4.0, 4.2], [1, 0]), zIndex: 5 }}>
                    {specialties.map((s, k) => (
                      <div key={k} style={{ padding: "13px 22px", fontFamily: F.arBody, fontSize: 23, color: ink, background: k === hl ? (D ? "#262720" : C.olive050) : "transparent", borderRight: k === hl ? `4px solid ${C.olive}` : "4px solid transparent" }}>{s}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div style={{ padding: "0 40px", height: 66, borderRadius: 99, background: D ? "#F6F4EC" : "#454832", color: D ? C.ink : C.onDark, display: "flex", alignItems: "center", fontFamily: F.arBody, fontSize: 25 }}>ابحث عن موعد</div>
          </div>
        </div>
        {/* stats */}
        <div style={{ position: "absolute", right: 170, top: 760, display: "flex", gap: 110, direction: "rtl", opacity: tw(t, [3.9, 4.1], [0, 1]) }}>
          {[[count(10), "تخصصات طبية تحت سقف واحد"], [count(5, 1), "تقييم جوجل"], [count(18) + "+", "سنة خبرة"], [count(1), "زيارة واحدة تكفي لأكتر من تخصص"]].map(([n, l], i) => (
            <div key={i}>
              <div style={{ fontFamily: F.display, fontSize: 96, color: ink, direction: "ltr", textAlign: "right" }}><Glow g={g} strength={D ? 1 : 0.3}>{n}</Glow></div>
              <div style={{ width: 60, height: 2, background: C.champ, margin: "8px 0 12px auto" }} />
              <div style={{ fontFamily: F.arBody, fontSize: 24, color: muted, maxWidth: 260 }}>{l}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      {/* cursor */}
      <svg width={40} height={40} viewBox="0 0 24 24" style={{ position: "absolute", left: t < 2.6 ? cx : t < 4.6 ? cx2 : cx3, top: t < 2.6 ? cy : t < 4.6 ? cy2 : cy3, opacity: tw(t, [1.8, 1.95], [0, 1]) * tw(t, [5.2, 5.4], [1, 0]),
        transform: `scale(${1 - 0.15 * press})`, filter: "drop-shadow(0 4px 6px rgba(0,0,0,.3))" }}>
        <path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.6 L11 13.4 L18 13.4 Z" fill="#fff" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};
