import React from "react";
import { Img, staticFile } from "remotion";
import { C, F, expo, gloss, tw } from "../lib";
import { Phone } from "../lib";
import { AbsoluteFill, BG, Headline, K, PW, PX, PY, RGlow, Tap, useG, sx, sy } from "./kit";

// 11–21 real-time booking challenge (stopwatch 11.0 → 20.0 = 00:09) · 21–24 «تم الحجز ✓» with the steps row match-cut.
type Field = { label: string; y: number; value: string; at: number };
const FIELDS: Field[] = [
  { label: "اختار التخصص", y: 180, value: "التغذية العلاجية والإكلينيكية", at: 1.45 },
  { label: "اختار الطبيب", y: 274, value: "د. شيماء فؤاد", at: 2.95 },
  { label: "اختار الفرع", y: 368, value: "فرع التجمع الخامس", at: 4.35 },
  { label: "الاسم بالكامل", y: 462, value: "أحمد محمود", at: 5.55 },
  { label: "رقم الموبايل", y: 556, value: "0100 123 4567", at: 5.6 },
];
const SHEETS: { open: number; close: number; rows: string[]; pick: number }[] = [
  { open: 0.65, close: 1.45, rows: ["التغذية العلاجية والإكلينيكية", "إدارة الوزن وبدائل التكميم", "نحت الجسم", "الباطنة العامة", "الكبد والجهاز الهضمي والمناظير"], pick: 0 },
  { open: 2.25, close: 2.95, rows: ["أي طبيب متاح", "د. شيماء فؤاد", "د. علياء سعيد أبوطالب", "د. مهاب أشرف فؤاد"], pick: 1 },
  { open: 3.65, close: 4.35, rows: ["فرع المعادي", "فرع التجمع الخامس"], pick: 1 },
];
const TAPS: [number, number, number][] = [ // local t, css x, css y
  [0.6, 195, 203], [1.4, 195, 0], [2.2, 195, 297], [2.9, 195, 0], [3.6, 195, 391], [4.3, 195, 0], [5.0, 195, 485], [5.5, 195, 0], [6.4, 352, 640], [7.3, 195, 700],
];
const sheetRowY = (s: number, i: number) => 844 - (SHEETS[s].rows.length * 54 + 70) + 56 + i * 54 + 27;

const BookingScreen: React.FC<{ t: number }> = ({ t }) => {
  const sending = t >= 7.35 && t < 9;
  const done = tw(t, [9.0, 9.3], [0, 1], expo);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 390, height: 844, transform: `scale(${K})`, transformOrigin: "0 0", background: "#FBF9F4", direction: "rtl", fontFamily: F.arBody, color: C.ink }}>
      <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", borderBottom: "1px solid rgba(35,36,26,.08)" }}>
        <Img src={staticFile("brand/larose-wordmark.png")} style={{ height: 38 }} />
        <div style={{ padding: "7px 14px", borderRadius: 99, background: "#454832", color: C.onDark, fontSize: 13 }}>احجز موعد</div>
      </div>
      <div style={{ padding: "16px 22px 0" }}>
        <div style={{ fontSize: 13, color: C.champ700 }}>احجز في دقيقة</div>
        <div style={{ fontSize: 21, fontWeight: 600, marginTop: 4 }}>اختار التخصص والطبيب المناسب لحالتك</div>
      </div>
      {FIELDS.map((f, i) => {
        const filled = t >= f.at; const active = TAPS.some(([a, , y]) => y && Math.abs(y - (f.y + 23)) < 30 && t >= a && t < a + 0.8) && !filled;
        return (
          <div key={i} style={{ position: "absolute", left: 22, right: 22, top: f.y - 22 }}>
            <div style={{ fontSize: 12.5, color: C.inkMuted, marginBottom: 5 }}>{f.label}</div>
            <div style={{ height: 46, borderRadius: 12, background: "#fff", border: `1.5px solid ${active || (filled && t < f.at + 0.4) ? C.olive : "rgba(35,36,26,.16)"}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", fontSize: 15 }}>
              <span style={{ color: filled ? C.ink : C.inkMuted, direction: i === 4 ? "ltr" : "rtl" }}>{filled ? f.value : i < 3 ? "اختار" : ""}</span>
              {i < 3 && <span style={{ color: C.inkMuted, fontSize: 12 }}>⌄</span>}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 22, right: 22, top: 628, display: "flex", gap: 10, alignItems: "flex-start", fontSize: 11.5, color: C.inkMuted, lineHeight: 1.5 }}>
        <div style={{ width: 20, height: 20, borderRadius: 6, flex: "none", border: `1.5px solid ${C.olive}`, background: t >= 6.45 ? C.olive : "#fff", color: "#fff", fontSize: 14, textAlign: "center", lineHeight: "18px" }}>{t >= 6.45 ? "✓" : ""}</div>
        أوافق على إرسال البيانات اللي كتبتها عبر واتساب بعد ما أراجع الرسالة
      </div>
      <div style={{ position: "absolute", left: 22, right: 22, top: 676, height: 50, borderRadius: 99, background: C.whatsapp, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 16, fontWeight: 600,
        transform: `scale(${1 - 0.05 * Math.max(tw(t, [7.3, 7.35], [0, 1]) - tw(t, [7.4, 7.5], [0, 1]), 0)})` }}>
        {sending ? <span style={{ display: "inline-block", width: 20, height: 20, borderRadius: 99, border: "3px solid rgba(255,255,255,.4)", borderTopColor: "#fff", transform: `rotate(${t * 720}deg)` }} /> : "ابعت طلب الحجز"}
      </div>
      {SHEETS.map((s, si) => {
        const o = tw(t, [s.open, s.open + 0.2], [0, 1], expo) * tw(t, [s.close, s.close + 0.2], [1, 0]);
        if (o <= 0) return null;
        const h = s.rows.length * 54 + 70;
        return (
          <React.Fragment key={si}>
            <div style={{ position: "absolute", inset: 0, background: `rgba(35,36,26,${0.25 * o})` }} />
            <div style={{ position: "absolute", left: 8, right: 8, bottom: 8, height: h, transform: `translateY(${(1 - o) * (h + 20)}px)`, ...gloss(false, 26), padding: "14px 0" }}>
              <div style={{ width: 40, height: 5, borderRadius: 9, background: "rgba(35,36,26,.2)", margin: "0 auto 14px" }} />
              {s.rows.map((r, i) => (
                <div key={r} style={{ height: 54, display: "flex", alignItems: "center", padding: "0 22px", fontSize: 16, background: i === s.pick && t >= s.close - 0.1 ? "rgba(142,139,99,.18)" : "transparent", borderBottom: "1px solid rgba(35,36,26,.06)" }}>{r}</div>
              ))}
            </div>
          </React.Fragment>
        );
      })}
      {t >= 5.0 && t < 5.7 && (
        <div style={{ position: "absolute", left: 8, right: 8, bottom: 8, ...gloss(false, 20), padding: "12px 16px", opacity: tw(t, [5.0, 5.15], [0, 1]) * tw(t, [5.55, 5.7], [1, 0]) }}>
          <div style={{ fontSize: 11, color: C.inkMuted, marginBottom: 6 }}>ملء تلقائي</div>
          <div style={{ fontSize: 15 }}>أحمد محمود · <span style={{ direction: "ltr", unicodeBidi: "isolate" }}>0100 123 4567</span></div>
        </div>
      )}
      {done > 0 && (
        <div style={{ position: "absolute", inset: 0, background: `rgba(251,249,244,${0.92 * done})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 150, height: 150, borderRadius: 99, background: C.olive, color: "#fff", fontSize: 90, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${done})` }}>✓</div>
        </div>
      )}
    </div>
  );
};

export const R2Book: React.FC = () => {
  const { t, g } = useG(11);
  const elapsed = Math.min(t, 9);
  const stopped = t >= 9;
  const booked = tw(t, [10, 10.45], [0, 1], expo);
  const steps = ["التخصص", "الطبيب", "الفرع"];
  const stepAt = [1.45, 2.95, 4.35];
  const tapAt = (a: number, x: number, y: number) => {
    const s = TAPS.findIndex(([at]) => at === a);
    if (y === 0) { const sh = SHEETS.find((q) => Math.abs(q.close - 0.05 - a) < 0.2); const si = SHEETS.indexOf(sh!); return { x, y: si >= 0 ? sheetRowY(si, SHEETS[si].pick) : 800 - 30 }; }
    return { x, y, s };
  };
  return (
    <AbsoluteFill>
      <BG g={g} mode="paper" />
      {/* headline + steps row (the row match-cuts into the booked card) */}
      <Headline g={g} t={t} at={0} ar="احجز في 10 ثواني!" en="Book in 10 seconds!" size={92} top={240} />
      <div style={{ position: "absolute", top: 440 + booked * 260, width: "100%", display: "flex", justifyContent: "center", gap: 14, direction: "rtl", transform: `scale(${1 + booked * 0.25})` }}>
        {steps.map((s, i) => {
          const on = t >= stepAt[i];
          return (
            <React.Fragment key={s}>
              <div style={{ padding: "12px 26px", ...gloss(!on ? false : true, 99), background: on ? C.olive700 : undefined, color: on ? C.onDark : C.ink, fontFamily: F.arDisplay, fontSize: 34, transform: `scale(${on ? 1 + 0.15 * Math.exp(-(t - stepAt[i]) * 6) : 1})` }}>
                {s}{on ? " ✓" : ""}
              </div>
              {i < 2 && <div style={{ fontSize: 34, color: C.champ700, alignSelf: "center" }}>←</div>}
            </React.Fragment>
          );
        })}
      </div>
      {/* phone with the live form; it eases back when the booking lands */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${booked * 520}px) scale(${1 - 0.25 * booked})`, transformOrigin: "540px 1400px", filter: `blur(${booked * 6}px)`, opacity: 1 - 0.5 * booked }}>
        <Phone w={PW} style={{ left: PX, top: PY }}><BookingScreen t={t} /></Phone>
        {TAPS.map(([a, x, y]) => { const p = tapAt(a, x, y); return <Tap key={a} t={t} at={a} x={sx(p.x)} y={sy(p.y)} />; })}
      </div>
      {/* stopwatch */}
      <div style={{ position: "absolute", right: 70, top: PY - 40 + booked * 900, ...gloss(true, 99), padding: "14px 28px", display: "flex", gap: 12, alignItems: "center", color: C.onDark, opacity: 1 - booked,
        transform: `scale(${stopped ? 1 + 0.12 * Math.exp(-(t - 9) * 5) : 1})` }}>
        <span style={{ fontSize: 30 }}>⏱</span>
        <span style={{ fontFamily: F.graphik, fontWeight: 600, fontSize: 44, fontVariantNumeric: "tabular-nums", color: stopped ? C.champ300 : C.onDark }}>
          {"00:" + String(Math.floor(elapsed)).padStart(2, "0") + "." + String(Math.floor((elapsed % 1) * 100)).padStart(2, "0")}
        </span>
      </div>
      {booked > 0 && (
        <div style={{ position: "absolute", top: 860, width: "100%", textAlign: "center", opacity: booked, transform: `scale(${1.3 - 0.3 * booked})` }}>
          <div style={{ fontFamily: F.arDisplay, fontSize: 150, color: C.ink }}><RGlow g={g} strength={0.9}>تم الحجز ✓</RGlow></div>
          <div style={{ fontFamily: F.graphik, fontWeight: 600, fontSize: 44, color: C.champ700, letterSpacing: 2 }}>BOOKED ✓</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
