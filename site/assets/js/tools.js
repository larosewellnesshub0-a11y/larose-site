/* ==========================================================================
   LA ROSE WELLNESS HUB، health tools
   --------------------------------------------------------------------------
   Every tool is progressive: the markup is a plain, usable form, and this
   script adds the calculation and the persistence. Nothing here is a
   diagnosis; each page carries a visible disclaimer above the tool.

   Stored data never leaves the browser: localStorage only, namespaced.
   ========================================================================== */
(function () {
  "use strict";

  var LS = "larose.tools.";
  var isRTL = document.documentElement.getAttribute("dir") === "rtl";
  var lang = document.documentElement.getAttribute("lang") || "ar";
  var AR = lang === "ar";

  /* ---- helpers ---------------------------------------------------------- */
  function store(key, value) {
    try { localStorage.setItem(LS + key, JSON.stringify(value)); } catch (e) {}
  }
  function recall(key, fallback) {
    try {
      var v = localStorage.getItem(LS + key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  }

  // Latin digits in both languages. The input fields accept Latin numerals,
  // so an Arabic-Indic readout beside a Latin input reads as two different
  // numbers rather than one measurement. Consistency beats localisation here.
  var nf = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
  var nf1 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
  var num = function (n) { return nf.format(Math.round(n)); };
  var num1 = function (n) { return nf1.format(n); };

  function val(root, name) {
    var el = root.querySelector('[name="' + name + '"]');
    if (!el) return null;
    if (el.type === "checkbox") return el.checked;
    return el.value;
  }
  function numVal(root, name) {
    var v = parseFloat(val(root, name));
    return isFinite(v) ? v : null;
  }
  function out(root, html) {
    var box = root.querySelector(".tool__result");
    if (!box) return;
    box.innerHTML = html;
    box.hidden = false;
  }
  function T(ar, en) { return AR ? ar : en; }

  function figure(n, label, sub) {
    return '<div class="tool__figure">' +
      '<span class="tool__figure-n">' + n + "</span>" +
      '<span class="tool__figure-l">' + label + "</span>" +
      (sub ? '<span class="tool__figure-s">' + sub + "</span>" : "") +
      "</div>";
  }

  function bar(pct, tone) {
    var p = Math.max(0, Math.min(100, pct));
    return '<div class="tool__bar" role="img" aria-label="' + Math.round(p) + '%">' +
      '<span class="tool__bar-fill' + (tone ? " is-" + tone : "") + '" style="width:' + p + '%"></span>' +
      "</div>";
  }

  /* ======================================================================
     1. CALORIE / MACRO CALCULATOR
     Mifflin–St Jeor for resting metabolic rate, which is the equation most
     clinical guidelines use for adults, then an activity multiplier, then a
     goal adjustment. Deliberately conservative: a deficit is capped at 20%
     and never taken below a floor, because an unsupervised crash target is
     exactly what this clinic spends its time undoing.
     ====================================================================== */
  function calorie(root) {
    var sex = val(root, "sex");
    var age = numVal(root, "age");
    var h = numVal(root, "height");
    var w = numVal(root, "weight");
    var act = parseFloat(val(root, "activity"));
    var goal = val(root, "goal");

    if (!age || !h || !w || !isFinite(act)) {
      return out(root, '<p class="tool__empty">' +
        T("املا كل الخانات الأول عشان نحسب.", "Fill in every field so we can calculate.") + "</p>");
    }

    // Mifflin–St Jeor
    var bmr = 10 * w + 6.25 * h - 5 * age + (sex === "female" ? -161 : 5);
    var tdee = bmr * act;

    var target = tdee, note = "";
    if (goal === "lose") {
      target = Math.max(tdee * 0.8, sex === "female" ? 1200 : 1500);
      note = T(
        "العجز محسوب ٢٠٪ بحد أقصى، ومش بينزل تحت الحد الآمن، النزول البطيء هو اللي بيحافظ على العضل.",
        "The deficit is capped at 20% and never goes below a safe floor، slow loss is what protects muscle."
      );
    } else if (goal === "gain") {
      target = tdee * 1.12;
      note = T(
        "الزيادة محسوبة ١٢٪ عشان اللي يزيد يكون عضل مش دهون.",
        "A 12% surplus, so what you gain is muscle rather than fat."
      );
    } else {
      note = T("ده احتياجك للتثبيت على وزنك الحالي.", "This is what you need to hold your current weight.");
    }

    // Protein 1.6 g/kg protects lean mass in a deficit; fat 25% of energy;
    // the remainder as carbohydrate.
    var protein = Math.round(w * 1.6);
    var fat = Math.round((target * 0.25) / 9);
    var carbs = Math.round((target - protein * 4 - fat * 9) / 4);

    out(root,
      '<div class="tool__row">' +
        figure(num(bmr), T("معدل الأيض الأساسي", "Resting metabolic rate"), T("سعر/يوم", "kcal/day")) +
        figure(num(tdee), T("احتياجك اليومي", "Daily energy needs"), T("سعر/يوم", "kcal/day")) +
        figure(num(target), T("هدفك المقترح", "Suggested target"), T("سعر/يوم", "kcal/day")) +
      "</div>" +
      '<p class="u-sm u-muted" style="margin-top:1rem">' + note + "</p>" +
      '<h3 class="h4" style="margin-top:1.75rem">' + T("توزيع الماكروز المقترح", "Suggested macro split") + "</h3>" +
      '<div class="tool__row" style="margin-top:.75rem">' +
        figure(num(protein) + " " + T("جم", "g"), T("بروتين", "Protein")) +
        figure(num(Math.max(carbs, 0)) + " " + T("جم", "g"), T("كربوهيدرات", "Carbohydrate")) +
        figure(num(fat) + " " + T("جم", "g"), T("دهون", "Fat")) +
      "</div>"
    );

    store("calorie.target", Math.round(target));
    store("calorie.inputs", { sex: sex, age: age, height: h, weight: w, activity: act, goal: goal });
  }

  /* ======================================================================
     2. BMI
     Reported with the WHO adult categories, and with an explicit caveat:
     BMI says nothing about what the weight is made of, which is the whole
     reason this clinic measures body composition instead.
     ====================================================================== */
  var BMI_BANDS = [
    { max: 18.5, key: "under", ar: "أقل من الطبيعي", en: "Underweight", tone: "warn" },
    { max: 25,   key: "normal", ar: "الوزن الطبيعي", en: "Healthy range", tone: "ok" },
    { max: 30,   key: "over",  ar: "زيادة في الوزن", en: "Overweight", tone: "warn" },
    { max: 35,   key: "ob1",   ar: "سمنة درجة أولى", en: "Obesity class I", tone: "high" },
    { max: 40,   key: "ob2",   ar: "سمنة درجة تانية", en: "Obesity class II", tone: "high" },
    { max: Infinity, key: "ob3", ar: "سمنة درجة تالتة", en: "Obesity class III", tone: "high" }
  ];

  function bmi(root) {
    var h = numVal(root, "height");
    var w = numVal(root, "weight");
    if (!h || !w) {
      return out(root, '<p class="tool__empty">' +
        T("اكتب الطول والوزن.", "Enter your height and weight.") + "</p>");
    }
    var m = h / 100;
    var b = w / (m * m);
    var band = BMI_BANDS.find(function (x) { return b < x.max; });

    // healthy weight range for this height
    var lo = 18.5 * m * m, hi = 24.9 * m * m;

    // position along a 15–45 scale for the bar
    var pct = ((b - 15) / 30) * 100;

    out(root,
      '<div class="tool__row">' +
        figure(num1(b), T("مؤشر كتلة الجسم", "Body mass index"), T(band.ar, band.en)) +
        figure(num1(lo) + " – " + num1(hi) + " " + T("كجم", "kg"), T("النطاق الصحي لطولك", "Healthy range for your height")) +
      "</div>" +
      bar(pct, band.tone) +
      '<p class="u-sm u-muted" style="margin-top:1rem">' +
        T("مؤشر كتلة الجسم بيقيس الوزن بالنسبة للطول بس، مش بيفرّق بين الدهون والعضل. رياضية عندها عضل كتير ممكن يطلع مؤشرها عالي وهي سليمة تماماً، والعكس صحيح. عشان كده إحنا بنقيس التركيب الجسمي بجهاز InBody في كل زيارة، مش الوزن لوحده.",
          "BMI measures weight against height alone، it cannot tell fat from muscle. A muscular athlete can score high and be entirely healthy, and the reverse is also true. That is why we measure body composition with InBody at every visit rather than weight on its own.") +
      "</p>"
    );
    store("bmi.last", { h: h, w: w, bmi: Math.round(b * 10) / 10 });
  }

  /* ======================================================================
     3. WATER
     35 ml per kg as the everyday baseline, adjusted for activity and heat.
     ====================================================================== */
  function water(root) {
    var w = numVal(root, "weight");
    var act = parseFloat(val(root, "activity")) || 0;
    var climate = parseFloat(val(root, "climate")) || 0;
    if (!w) {
      return out(root, '<p class="tool__empty">' + T("اكتب وزنك.", "Enter your weight.") + "</p>");
    }
    var ml = w * 35 + act + climate;
    var litres = ml / 1000;
    var glasses = Math.round(ml / 250);

    out(root,
      '<div class="tool__row">' +
        figure(num1(litres) + " " + T("لتر", "L"), T("احتياجك اليومي التقريبي", "Approximate daily need")) +
        figure(num(glasses), T("كوب (٢٥٠ مل)", "glasses (250 ml)")) +
      "</div>" +
      '<p class="u-sm u-muted" style="margin-top:1rem">' +
        T("الرقم ده تقدير عام للأصحاء. لو عندك مشكلة في الكلى أو القلب أو بتاخد مدرات بول، الكمية بتتحدد بطبيبك مش بحاسبة.",
          "This is a general estimate for healthy adults. If you have a kidney or heart condition, or take diuretics, the amount is set by your doctor, not by a calculator.") +
      "</p>"
    );
  }

  /* ======================================================================
     4. CALORIE TRACKER: a day's log, kept on the device
     ====================================================================== */
  function tracker(root) {
    var listEl = root.querySelector(".tool__log");
    var totalEl = root.querySelector("[data-total]");
    var barEl = root.querySelector(".tool__bar-fill");
    var targetInput = root.querySelector('[name="target"]');
    var today = new Date().toISOString().slice(0, 10);
    var key = "tracker." + today;

    var items = recall(key, []);
    var savedTarget = recall("calorie.target", 2000);
    if (targetInput && !targetInput.value) targetInput.value = savedTarget;

    function render() {
      var total = items.reduce(function (a, x) { return a + x.kcal; }, 0);
      var target = parseFloat(targetInput && targetInput.value) || savedTarget;

      if (!items.length) {
        listEl.innerHTML = '<li class="tool__empty">' +
          T("لسه مفيش حاجة مسجلة النهاردة.", "Nothing logged yet today.") + "</li>";
      } else {
        listEl.innerHTML = items.map(function (x, i) {
          return '<li class="tool__log-item">' +
            "<span>" + escapeHtml(x.name) + "</span>" +
            "<b>" + num(x.kcal) + " " + T("سعر", "kcal") + "</b>" +
            '<button type="button" class="tool__del" data-i="' + i + '" aria-label="' +
              T("حذف", "Remove") + " " + escapeHtml(x.name) + '">&times;</button>' +
            "</li>";
        }).join("");
      }

      if (totalEl) {
        totalEl.textContent = num(total) + " / " + num(target) + " " + T("سعر", "kcal");
      }
      if (barEl) {
        var pct = target ? (total / target) * 100 : 0;
        barEl.style.width = Math.min(100, pct) + "%";
        barEl.className = "tool__bar-fill" + (pct > 105 ? " is-high" : pct > 85 ? " is-warn" : " is-ok");
      }
      store(key, items);
    }

    var form = root.querySelector("[data-add]");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = val(root, "item");
        var kcal = numVal(root, "kcal");
        if (!name || !kcal) return;
        items.push({ name: name, kcal: kcal });
        form.reset();
        var f = root.querySelector('[name="item"]');
        if (f) f.focus();
        render();
      });
    }

    listEl && listEl.addEventListener("click", function (e) {
      var b = e.target.closest(".tool__del");
      if (!b) return;
      items.splice(parseInt(b.getAttribute("data-i"), 10), 1);
      render();
    });

    targetInput && targetInput.addEventListener("input", render);

    var clear = root.querySelector("[data-clear]");
    clear && clear.addEventListener("click", function () {
      items = [];
      render();
    });

    render();
  }

  /* ======================================================================
     5. PROGRESS TRACKER، weight and waist over time
     ====================================================================== */
  function progress(root) {
    var listEl = root.querySelector(".tool__log");
    var entries = recall("progress", []);

    function render() {
      if (!entries.length) {
        listEl.innerHTML = '<li class="tool__empty">' +
          T("سجّل أول قياس عشان نبدأ نتابع التغيير.", "Log your first measurement to start tracking change.") +
          "</li>";
        var s = root.querySelector(".tool__result");
        if (s) s.hidden = true;
        return;
      }

      entries.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      var first = entries[0], last = entries[entries.length - 1];
      var dW = last.weight - first.weight;
      var dC = (last.waist && first.waist) ? last.waist - first.waist : null;

      var weights = entries.map(function (e) { return e.weight; });
      var min = Math.min.apply(null, weights), max = Math.max.apply(null, weights);
      var span = (max - min) || 1;

      listEl.innerHTML = entries.slice().reverse().map(function (e, i) {
        var idx = entries.length - 1 - i;
        var pct = 12 + ((e.weight - min) / span) * 88;
        return '<li class="tool__log-item">' +
          "<span>" + escapeHtml(e.date) + "</span>" +
          '<span class="tool__spark" style="width:' + pct + '%"></span>' +
          "<b>" + num1(e.weight) + T(" كجم", " kg") +
            (e.waist ? " · " + num1(e.waist) + T(" سم", " cm") : "") + "</b>" +
          '<button type="button" class="tool__del" data-i="' + idx + '" aria-label="' +
            T("حذف قياس", "Remove entry") + " " + escapeHtml(e.date) + '">&times;</button>' +
          "</li>";
      }).join("");

      out(root,
        '<div class="tool__row">' +
          figure((dW > 0 ? "+" : "") + num1(dW) + T(" كجم", " kg"), T("التغيير في الوزن", "Change in weight")) +
          (dC !== null ? figure((dC > 0 ? "+" : "") + num1(dC) + T(" سم", " cm"), T("التغيير في محيط الخصر", "Change in waist")) : "") +
          figure(String(entries.length), T("عدد القياسات", "Entries logged")) +
        "</div>" +
        '<p class="u-sm u-muted" style="margin-top:1rem">' +
          T("الوزن لوحده مش المؤشر الكامل. محيط الخصر بيتغيّر أحياناً والميزان ثابت، وده معناه إن التركيب الجسمي بيتحسّن.",
            "Weight alone is not the full picture. The waist often changes while the scale stays still، which means body composition is improving.") +
        "</p>"
      );
      store("progress", entries);
    }

    var form = root.querySelector("[data-add]");
    form && form.addEventListener("submit", function (e) {
      e.preventDefault();
      var date = val(root, "date") || new Date().toISOString().slice(0, 10);
      var weight = numVal(root, "weight");
      var waist = numVal(root, "waist");
      if (!weight) return;
      entries = entries.filter(function (x) { return x.date !== date; });
      entries.push({ date: date, weight: weight, waist: waist || null });
      form.reset();
      render();
    });

    listEl && listEl.addEventListener("click", function (e) {
      var b = e.target.closest(".tool__del");
      if (!b) return;
      entries.splice(parseInt(b.getAttribute("data-i"), 10), 1);
      render();
    });

    render();
  }

  /* ======================================================================
     6. PREP CHECKLIST، persists ticks
     ====================================================================== */
  function prep(root) {
    var saved = recall("prep", {});
    root.querySelectorAll('input[type="checkbox"][name]').forEach(function (box) {
      var k = box.getAttribute("name");
      box.checked = !!saved[k];
      box.addEventListener("change", function () {
        saved[k] = box.checked;
        store("prep", saved);
        update();
      });
    });

    function update() {
      var boxes = root.querySelectorAll('input[type="checkbox"][name]');
      var done = 0;
      boxes.forEach(function (b) { if (b.checked) done++; });
      var barFill = root.querySelector(".tool__bar-fill");
      if (barFill) barFill.style.width = boxes.length ? (done / boxes.length) * 100 + "%" : "0%";
      var t = root.querySelector("[data-total]");
      if (t) t.textContent = num(done) + " / " + num(boxes.length);
    }
    update();

    var reset = root.querySelector("[data-clear]");
    reset && reset.addEventListener("click", function () {
      root.querySelectorAll('input[type="checkbox"][name]').forEach(function (b) { b.checked = false; });
      store("prep", {});
      update();
    });
  }

  /* ---- utils ------------------------------------------------------------ */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---- wire up ---------------------------------------------------------- */
  var CALCULATORS = { calorie: calorie, bmi: bmi, water: water };
  var STATEFUL = { "calorie-tracker": tracker, progress: progress, prep: prep };

  document.querySelectorAll("[data-tool]").forEach(function (root) {
    var kind = root.getAttribute("data-tool");

    if (CALCULATORS[kind]) {
      var run = function () { CALCULATORS[kind](root); };
      var form = root.querySelector(".tool__form") || root.querySelector("form");
      if (form) {
        form.addEventListener("submit", function (e) { e.preventDefault(); run(); });
        // live recalculation once a result has been shown
        form.addEventListener("input", function () {
          var box = root.querySelector(".tool__result");
          if (box && !box.hidden) run();
        });
      }
      var reset = root.querySelector("[data-clear]");
      reset && reset.addEventListener("click", function () {
        form && form.reset();
        var box = root.querySelector(".tool__result");
        if (box) box.hidden = true;
      });
      // restore previous inputs where we saved them
      if (kind === "calorie") {
        var prev = recall("calorie.inputs", null);
        if (prev && form) {
          Object.keys(prev).forEach(function (k) {
            var el = form.querySelector('[name="' + k + '"]');
            if (el && prev[k] != null) el.value = prev[k];
          });
        }
      }
    }

    if (STATEFUL[kind]) STATEFUL[kind](root);
  });
})();
