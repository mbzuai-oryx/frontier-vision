(() => {
  const { models, groups, rows, byKey } = window.ASTRA;
  const { $, h, io, icon, fmt, bindTip } = window.UI;
  const staticMode = document.documentElement.classList.contains("no-anim");
  const observe = (el) => (staticMode ? el.classList.add("in") : io.observe(el));

  const DP2 = new Set(["depth", "reconstruction", "editing"]);
  const fmtRow = (r, v) => (typeof v === "number" ? v.toFixed(DP2.has(r.key) ? 2 : 1) : v);
  const isNum = (v) => typeof v === "number";

  /* ------------------------------------------------------------------------ */
  /* Table 1                                                                   */
  /* ------------------------------------------------------------------------ */
  // Per-row lower bound of the color scale (report_notes/choices.md).
  const FLOOR = { depth: 35, videoseg: 25, recognition: 20, finegrained: 20, medground3d: 20, pathology: 20, remoteground: 20, restoration: 15 };
  const STOPS = [[244, 179, 162], [247, 223, 169], [214, 236, 208], [159, 212, 196], [108, 192, 176]];
  const heat = (t) => {
    t = Math.max(0, Math.min(1, t)) * (STOPS.length - 1);
    const i = Math.min(STOPS.length - 2, Math.floor(t)), f = t - i;
    const c = STOPS[i].map((v, k) => Math.round(v + (STOPS[i + 1][k] - v) * f));
    return `rgb(${c.join(",")})`;
  };

  rows.forEach((r) => {
    const nums = r.scores.filter(isNum);
    const all = [...nums, r.specialist, r.human].filter((v) => v != null);
    r.rowBest = r.lower ? Math.min(...all) : Math.max(...all);
    r.rel = (v) => (isNum(v) ? (r.lower ? r.rowBest / v : v / r.rowBest) * 100 : null);
    const sorted = [...nums].sort((a, b) => (r.lower ? a - b : b - a));
    r.second = sorted.length > 1 ? Math.abs(sorted[0] - sorted[1]) : null;
    const ref = r.strongestRef;
    r.vsRef = ref ? (r.lower ? ref.value - r.best : r.best - ref.value) : null;
    r.trailsSpecialist = r.specialist != null && (r.lower ? r.best > r.specialist : r.best < r.specialist);
  });

  const table = $("[data-results]");
  // Header labels and icons follow the paper's Table 1.
  const HEAD = { gpt: "GPT-6<br>Astra", fable: "Fable 5", kimi: "Kimi K3", gemini: "Gemini<br>3.1 Pro", qwen: "Qwen<br>3.8 Max", muse: "Muse<br>Spark 1.3" };
  const hIcon = (name, color) => `<span class="hicon" style="color:${color}">${icon(name)}</span>`;
  const TOOLS = hIcon("tools", "#b30000"), USER = hIcon("user", "#00008c");
  const COLS = [
    ...models.map((m, i) => ({ id: m.id, icon: `<img src="${m.logo}" alt="">`, label: HEAD[m.id] || m.name, val: (r) => r.scores[i], })),
    { id: "spec", icon: TOOLS, label: "Reference<br>Model", val: (r) => r.specialist, sep: true, ref: true },
    { id: "human", icon: USER, label: "Human", val: (r) => r.human, ref: true },
    { id: "vsref", icon: `<span class="hicons">${TOOLS}${USER}</span>`, label: "Best model<br>vs ref.", val: (r) => r.vsRef, sep: true, gap: true },
    { id: "vs2", icon: hIcon("trophy", "#1c2b33"), label: "Best vs<br>2nd best", val: (r) => r.second, gap: true },
  ];

  let areaFilter = "all";

  table.innerHTML = `<thead><tr><th class="grp" data-col="grp">Capability Group</th><th class="cap" data-col="cap">Capability</th>${COLS.map((c) =>
    `<th data-col="${c.id}" class="${c.sep ? "sep" : ""}"><span class="mh">${c.icon}<span class="mt">${c.label}</span></span></th>`).join("")}</tr></thead><tbody></tbody>`;
  const tbody = $("tbody", table);

  function cell(r, c, ci) {
    const v = c.val(r);
    if (c.gap) {
      if (v == null) return `<td class="na${c.sep ? " sep" : ""}"><span>–</span></td>`;
      const txt = (v > 0 ? "+" : v < 0 ? "−" : "") + fmtRow(r, Math.abs(v));
      let cls = "";
      if (c.id === "vsref") cls = v >= 0 ? "gap-pos" : r.trailsSpecialist ? "gap-negS" : "gap-negH";
      else if (v >= 10 && !DP2.has(r.key)) cls = "gap-big";
      return `<td class="${cls}${c.sep ? " sep" : ""}">${txt}</td>`;
    }
    if (v === "ns") return `<td class="na${c.sep ? " sep" : ""}"><span>n/s</span></td>`;
    if (v == null) return `<td class="na${c.sep ? " sep" : ""}"><span>–</span></td>`;
    const floor = FLOOR[r.key] ?? 30;
    const t = (r.rel(v) - floor) / (100 - floor);
    const best = v === r.rowBest ? " best" : "";
    return `<td class="score${best}${c.ref ? " ref" : ""}${c.sep ? " sep" : ""}" style="--heat:${heat(t)};--d:${ci * 45}ms"><span>${fmtRow(r, v)}</span></td>`;
  }

  // Area colors from the paper's Table 1 (sections/tables/colors.tex).
  const GRP_COLOR = { g1: "#1F8AFF", g2: "#986BF6", g3: "#D152BB", g4: "#EC4764", g5: "#FF8506", g6: "#F2CB04", g7: "#59AA03", g8: "#00B89A", g9: "#06B1CE" };

  function rowHTML(r, grpCell = "", pos = "") {
    const metric = `<small>${r.metric}${r.lower ? " ↓" : ""}</small>`;
    return `<tr class="data${pos}" data-key="${r.key}" style="--tc:${GRP_COLOR[r.group]}">${grpCell}<td class="cap">${r.name}${metric}</td>${COLS.map((c, i) => cell(r, c, i)).join("")}</tr>`;
  }

  function renderTable() {
    const list = rows.filter((r) => areaFilter === "all" || r.group === areaFilter);
    let html = "";
    groups.forEach((g) => {
      const gr = list.filter((r) => r.group === g.id);
      if (!gr.length) return;
      const grpCell = `<td class="grp" rowspan="${gr.length}"><span>${icon(g.icon)}${g.name}</span></td>`;
      html += gr.map((r, i) => rowHTML(r, i === 0 ? grpCell : "",
        (i === 0 ? " grp-start" : "") + (i === gr.length - 1 ? " grp-end" : ""))).join("");
    });
    tbody.innerHTML = html;
  }

  const areaChips = $("[data-area-filter]");
  const shortName = { g1: "Recognition", g2: "Reasoning", g3: "Spatial", g4: "2D localization", g5: "3D", g6: "Video", g7: "Generation", g8: "Robotics", g9: "Expert domains" };
  [{ id: "all" }, ...groups].forEach((g) => {
    const attrs = { class: g.id === "all" ? "chip" : "chip area", type: "button", "aria-pressed": String(g.id === "all") };
    if (g.id !== "all") attrs.style = `--tc:${GRP_COLOR[g.id]}`;
    const b = h("button", attrs, g.id === "all" ? "All areas" : shortName[g.id]);
    b.addEventListener("click", () => {
      areaFilter = g.id;
      areaChips.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      renderTable();
    });
    areaChips.append(b);
  });

  $("[data-heat-toggle]").addEventListener("change", (e) => table.classList.toggle("heat", e.target.checked));
  table.classList.add("heat");
  renderTable();
  observe(table);

  /* ------------------------------------------------------------------------ */
  /* Q3                                                                        */
  /* ------------------------------------------------------------------------ */
  const GAPS = [
    { title: "Precise geometry", text: "Depth and multiview reconstruction stay sensitive to metric scale, local surface geometry, camera motion and alignment across views.", keys: ["depth", "reconstruction"], tab: "3d" },
    { title: "Faithful reconstruction", text: "Visually plausible improvement is not faithful recovery: fine textures and edges get altered or re-synthesized.", keys: ["restoration"], tab: "restoration" },
    { title: "Temporal consistency", text: "Precise boundaries, small structures and nearby instances must stay distinct consistently across frames.", keys: ["videoseg"], tab: "video" },
    { title: "Domain knowledge", text: "Fine-grained pathology recognition and remote-sensing grounding remain challenging despite strong domain understanding.", keys: ["pathology", "remoteground"], tab: "medical" },
  ];
  const gapGrid = $("[data-gap-grid]");
  GAPS.forEach((g, gi) => {
    const gauges = g.keys.map((k, i) => {
      const r = byKey[k];
      return `<div class="gauge"><div class="gauge-top"><span>${r.name}</span><b>${Math.round(r.pct)}%</b></div>
        <div class="gauge-track"><span class="gauge-fill" style="--w:${Math.min(100, r.pct)}%;--d:${gi * 0.12 + i * 0.15}s"></span></div>
        <div class="gauge-top" style="margin-top:4px;font-size:12px;color:var(--muted)"><span>best ${fmtRow(r, r.best)}</span><span>${r.ref.kind === "S" ? "specialist" : "human"} ${fmtRow(r, r.ref.value)}</span></div></div>`;
    }).join("");
    const card = h("article", { class: "gap-card reveal" },
      `<h4>${g.title}</h4><p>${g.text}</p>${gauges}<a class="more" href="#gallery" data-open-tab="${g.tab}">See examples →</a>`);
    gapGrid.append(card);
    observe(card);
  });

  // Explain what the Q3 bars mean
  gapGrid.insertAdjacentHTML("afterend", `<p class="gap-note reveal"><span class="gn-key"><span class="gn-bar"></span></span>
    <span>Each bar is the <b>best generalist score as a percentage of the strongest available reference</b> (specialist model or
    human), so the dark tick at the right end marks the reference level (100%). A shorter bar means a larger remaining gap.</span></p>`);

  /* ------------------------------------------------------------------------ */
  /* Q4 reasoning effort and tool use (numbers from report scripts/make_effort_tools_figure.py) */
  /* ------------------------------------------------------------------------ */
  const EFF = ["low", "medium", "high", "xhigh", "max"];
  const EFF_C = ["#d9e7f6", "#a8c8ec", "#6fa2dc", "#3a70bb", "#173e7a"];
  const TOOL_C = ["#9fb9e8", "#2b4bcb"];
  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  // 2D spatial = mean of V*Bench, BLINK spatial, VisualPuzzles spatial, OmniSpatial dynamic; cost summed (USD).
  const SP = [[95.81, 96.34, 94.24, 95.81, 97.38], [92.83, 91.81, 92.15, 93.17, 94.54], [91.96, 94.76, 92.31, 94.41, 97.90], [76.43, 76.90, 76.67, 78.10, 78.33]];
  const SPC = [[8.06, 8.10, 8.10, 8.42, 9.06], [1.46, 1.80, 2.43, 3.22, 5.11], [7.08, 10.87, 14.70, 23.38, 39.49], [8.47, 9.94, 15.62, 25.94, 53.66]];
  const EFFORT = [
    { name: "2D Spatial Reasoning", unit: "accuracy %", score: EFF.map((_, k) => mean(SP.map((b) => b[k]))), cost: EFF.map((_, k) => SPC.reduce((t, b) => t + b[k], 0)) },
    { name: "3D Object Detection", unit: "AP3D", score: [19.58, 24.02, 30.78, 30.05, 34.18], cost: [16.87, 41.50, 150.73, 222.97, 113.80] },
    { name: "Segmentation", unit: "gIoU %", score: [75.72, 79.32, 78.91, 79.41, 78.54], cost: [13.17, 23.35, 57.22, 84.92, 109.75] },
  ];
  // OCR = mean of CharXiv RQ and InfoVQA at xhigh; Counting has no USD telemetry, only a relative cost.
  const TOOL_RUNS = [
    { name: "OCR", unit: "accuracy %", score: [(89.50 + 76.77) / 2, (90.60 + 76.52) / 2], cost: [17.22 + 140.51, 18.72 + 144.81] },
    { name: "Counting", unit: "accuracy %", score: [82.60, 85.90], cost: null, relCost: [1.00, 1.20] },
  ];
  const effortCard = $("[data-effort]");
  const efGrid = $("[data-effort-grid]");
  const ratio = (a) => a.map((v) => v / a[0]);
  const x2 = (v) => v.toFixed(2) + "×";

  function efPanel(title, groups, baseLabel) {
    const vals = groups.flatMap((g) => ratio(g.score));
    let lo = Math.min(...vals, 1), hi = Math.max(...vals);
    const span = hi - lo || 0.01;
    lo -= span * 0.45; hi += span * 0.08;
    const y = (v) => ((v - lo) / (hi - lo)) * 100;
    let n = 0;
    const cols = groups.map((g) => {
      const sr = ratio(g.score), cr = g.relCost || (g.cost && ratio(g.cost));
      const bars = g.score.map((v, k) => {
        const lbl = g.levels[k];
        const tip = `${g.name} · ${lbl}: ${v.toFixed(1)} ${g.unit} (${x2(sr[k])} score) · cost ${g.cost ? "$" + g.cost[k].toFixed(2) + ", " : ""}${x2(cr[k])}`;
        return `<div class="ef-bar" title="${tip}" style="--h:${y(sr[k])}%;--c:${g.colors[k]};--d:${n++ * 60}ms">
          <span class="ef-lbl"><i>${x2(cr[k])}</i><b>${x2(sr[k])}</b></span></div>`;
      }).join("");
      return `<div class="ef-group">${bars}</div>`;
    }).join("");
    // Same box as the bars (below the label padding) so the 1.00× line meets the top of the baseline bar.
    const base = `<div class="ef-area"><span class="ef-base" style="bottom:${y(1)}%"><em>${baseLabel}</em></span></div>`;
    // Names sit below the bars, like x-axis labels in the paper's figure.
    const xl = `<div class="ef-x">${(groups.length > 1 ? groups.map((g) => g.name) : [title]).map((t) => `<span>${t}</span>`).join("")}</div>`;
    return `<div class="ef-panel${groups.length > 1 ? " tools" : ""}"><div class="ef-plot">${base}${cols}</div>${xl}</div>`;
  }
  function renderEffort() {
    efGrid.innerHTML =
      EFFORT.map((e) => efPanel(e.name, [{ ...e, levels: EFF, colors: EFF_C }], "low")).join("") +
      efPanel("Tool use", TOOL_RUNS.map((t) => ({ ...t, levels: ["w/o tools", "w/ tools"], colors: TOOL_C })), "w/o tools");
  }
  $("[data-effort-legend]").innerHTML =
    `<div class="ef-lg"><span class="ef-lg-t">Reasoning effort</span>${EFF.map((e, k) => `<span><i style="background:${EFF_C[k]}"></i>${e}</span>`).join("")}</div>` +
    `<div class="ef-lg"><span class="ef-lg-t">Tools</span>${["w/o", "w/"].map((e, k) => `<span><i style="background:${TOOL_C[k]}"></i>${e}</span>`).join("")}</div>`;
  renderEffort();
  observe(effortCard);

  /* ------------------------------------------------------------------------ */
  /* Gallery                                                                   */
  /* ------------------------------------------------------------------------ */
  const tabs = [...document.querySelectorAll("[data-tabs] [data-tab]")];
  const panels = [...document.querySelectorAll("[data-panel]")];
  const onOpen = {};
  function openTab(id) {
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === id)));
    panels.forEach((p) => (p.hidden = p.dataset.panel !== id));
    onOpen[id]?.();
  }
  tabs.forEach((t) => t.addEventListener("click", () => openTab(t.dataset.tab)));
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-open-tab]");
    if (a) openTab(a.dataset.openTab);
  });

  // Compare sliders
  function initCompare(el) {
    const range = $(".c-range", el);
    const set = () => el.style.setProperty("--pos", range.value + "%");
    range.addEventListener("input", set);
    set();
  }
  document.querySelectorAll("[data-compare]").forEach(initCompare);

  const segGroup = (root, attr, cb) => root.querySelectorAll("button").forEach((b, _, all) => b.addEventListener("click", () => {
    all.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    cb(b.dataset[attr]);
  }));

  // Detection boxes (SVG overlays that draw in)
  const SVGNS = "http://www.w3.org/2000/svg";
  function wrapMedia(fig) {
    const img = $("img", fig);
    const wrap = h("div", { style: "position:relative" });
    img.replaceWith(wrap);
    wrap.append(img);
    const svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("class", "overlay");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.style.height = "100%";
    wrap.append(svg);
    return svg;
  }
  const boxFigs = [...document.querySelectorAll("[data-boxes]")];
  boxFigs.forEach((fig) => {
    const svg = wrapMedia(fig);
    svg.setAttribute("viewBox", "0 0 1 1");
    const data = window.BOXES[fig.dataset.boxes];
    let i = 0;
    ["gt", "pred"].forEach((kind) => data[kind].forEach(([x, y, w, hh]) => {
      const r = document.createElementNS(SVGNS, "rect");
      Object.entries({ x, y, width: w, height: hh, class: kind, pathLength: 400 }).forEach(([k, v]) => r.setAttribute(k, v));
      r.style.setProperty("--d", (i++ % 150) * 6 + "ms");
      svg.append(r);
    }));
  });
  const drawBoxes = (root) => root.querySelectorAll(".overlay rect, .overlay polygon").forEach((r) => {
    r.classList.remove("draw");
    void r.getBoundingClientRect();
    if (!staticMode) r.classList.add("draw");
  });
  const detPanel = $('[data-panel="det"]');
  const detIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { drawBoxes(detPanel); detIO.disconnect(); }
  }), { threshold: 0.3 });
  detIO.observe(detPanel);
  segGroup($("[data-box-mode]"), "mode", (m) => { detPanel.dataset.modeShow = m; drawBoxes(detPanel); });
  onOpen.det = () => drawBoxes(detPanel);

  // Video: GT vs prediction sliders
  const CLIPS = [["gold-fish", "Gold-fish · 5 instances"], ["motocross-jump", "Motocross jump"], ["horsejump-high", "Horse jump"], ["scooter-black", "Scooter"]];
  $("[data-video-grid]").innerHTML = CLIPS.map(([id, label]) => `
    <figure class="vos"><div class="compare" data-compare>
      <img src="assets/gallery/vos_${id}_pred.jpg" alt="${label} prediction">
      <div class="c-top"><img src="assets/gallery/vos_${id}_gt.jpg" alt="${label} ground truth"></div>
      <span class="c-tag l">GT</span><span class="c-tag r">GPT-6 Astra</span>
      <input class="c-range" type="range" min="0" max="100" value="50" aria-label="Compare ${label}">
      <span class="c-handle" aria-hidden="true"></span></div><figcaption>${label}</figcaption></figure>`).join("");
  document.querySelectorAll("[data-video-grid] [data-compare]").forEach(initCompare);

  // Pathology polygons, loaded on first open (the data file is ~260 KB)
  const medPanel = $('[data-panel="medical"]');
  let pumaLoaded = false;
  onOpen.medical = () => {
    if (pumaLoaded) return drawBoxes(medPanel);
    pumaLoaded = true;
    const s = document.createElement("script");
    s.src = "js/puma.js";
    s.onload = () => {
      medPanel.querySelectorAll("[data-puma]").forEach((fig) => {
        const svg = wrapMedia(fig);
        svg.classList.add("poly");
        svg.setAttribute("viewBox", "0 0 1000 1000");
        const data = window.PUMA[fig.dataset.puma];
        let i = 0;
        ["gt", "pred"].forEach((kind) => data[kind].forEach((pts) => {
          const p = document.createElementNS(SVGNS, "polygon");
          p.setAttribute("points", pts);
          p.setAttribute("class", kind);
          p.setAttribute("pathLength", 400);
          p.style.setProperty("--d", (i++ % 200) * 4 + "ms");
          svg.append(p);
        }));
        if (fig.dataset.puma === "full") {
          const z = document.createElementNS(SVGNS, "rect");
          Object.entries({ x: 0, y: 375, width: 250, height: 250, class: "zoombox" }).forEach(([k, v]) => z.setAttribute(k, v));
          svg.append(z);
        }
      });
      drawBoxes(medPanel);
    };
    document.body.append(s);
  };
  segGroup($("[data-poly-mode]"), "mode", (m) => { medPanel.dataset.modeShow = m; drawBoxes(medPanel); });

  // Restoration comparison
  const REST = {
    enhance: { ar: 592 / 400, m: { input: [6.74, 0.185], astra_sunburst: [17.47, 0.742], mirage: [28.07, 0.909], gt: null } },
    denoise: { ar: 480 / 320, m: { input: [20.77, 0.487], astra_sunburst: [14.90, 0.669], mirage: [32.13, 0.946], gt: null } },
  };
  const LABEL = { input: "Degraded input", astra_sunburst: "GPT-6 Astra + image model", mirage: "MIRAGE (specialist)", gt: "Ground truth" };
  const restCmp = $("[data-rest-compare]");
  const selL = $("[data-rest-left]"), selR = $("[data-rest-right]");
  [selL, selR].forEach((s) => (s.innerHTML = Object.entries(LABEL).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")));
  selL.value = "astra_sunburst";
  selR.value = "gt";
  let restCase = "enhance";
  function renderRest() {
    const c = REST[restCase];
    restCmp.style.setProperty("--ar", c.ar);
    $(".c-top img", restCmp).src = `assets/gallery/rest_${restCase}_${selL.value}.png`;
    $(":scope > img", restCmp).src = `assets/gallery/rest_${restCase}_${selR.value}.png`;
    $(".c-tag.l", restCmp).textContent = LABEL[selL.value];
    $(".c-tag.r", restCmp).textContent = LABEL[selR.value];
    $("[data-rest-crops]").innerHTML = Object.keys(LABEL).map((k) => {
      const m = c.m[k];
      return `<figure class="crop"><img src="assets/gallery/rest_${restCase}_${k}_crop.png" alt="${LABEL[k]} crop">
        <figcaption><span>${LABEL[k]}</span><small>${m ? `${m[0].toFixed(1)} dB · ${m[1].toFixed(2)}` : "reference"}</small></figcaption></figure>`;
    }).join("");
  }
  selL.addEventListener("change", renderRest);
  selR.addEventListener("change", renderRest);
  segGroup($("[data-rest-case]"), "case", (c) => { restCase = c; renderRest(); });
  renderRest();

  /* Citation copy ------------------------------------------------------------ */
  const copyBtn = $("[data-copy]");
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("[data-bib]").textContent);
      copyBtn.textContent = "Copied";
    } catch {
      copyBtn.textContent = "Select and copy";
    }
    setTimeout(() => (copyBtn.textContent = "Copy"), 1600);
  });

  const startTab = new URLSearchParams(location.search).get("tab");
  if (startTab) openTab(startTab);

  document.querySelectorAll(".reveal:not(.in)").forEach(observe);
})();
