// Benchmark-level scores (benchmarl_level_results.csv; fractional scores shown as %).
// "ns" = output type not supported.
(() => {
  const { models, groups } = window.ASTRA;
  const $ = (s, el = document) => el.querySelector(s);
  const staticMode = new URLSearchParams(location.search).has("static");
  if (staticMode) document.documentElement.classList.add("no-anim");

  const header = $("[data-header]");
  const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const ns = "ns";
  // [area, task, benchmark, metric, lowerIsBetter, scores[6]] in the model order of data.js
  const rows = [
    ["g1", "Visual counting",          "PixMo-Count",            "Accuracy",      false, [91.8, 74.3, 89.7, 90.0, 87.8, 87.7]],
    ["g1", "Visual counting",          "CountQA",                "Accuracy",      false, [83.6, 63.1, 63.4, 72.8, 82.4, 70.8]],
    ["g1", "Visual counting",          "VLMsAreBiased",          "Accuracy",      false, [94.6, 61.2, 50.2, 74.1, 88.3, 92.6]],
    ["g1", "Visual question answering","MMStar",                 "Accuracy",      false, [85.3, 80.5, 82.3, 84.0, 85.9, 82.4]],
    ["g1", "Visual question answering","BabyVision (w/o tools)", "Accuracy",      false, [88.1, 42.5, 52.3, 55.9, 82.0, 53.9]],
    ["g1", "Visual question answering","BabyVision (with tools)","Accuracy",      false, [93.8, 90.5, 85.7, 68.3, 91.3, 82.7]],
    ["g1", "Visual question answering","BLINK (val)",            "Accuracy",      false, [92.1, 82.9, 83.6, 82.3, 87.2, 85.5]],
    ["g1", "Visual question answering","V*Bench",                "Accuracy",      false, [98.4, 91.6, 90.1, 86.8, 94.8, 94.2]],
    ["g1", "Visual question answering","PerceptionBench",        "Accuracy",      false, [75.7, 57.2, 58.5, 56.2, 63.5, 57.2]],
    ["g1", "Visual question answering","WorldVQA",               "Accuracy",      false, [55.8, 53.5, 54.1, 54.0, 53.2, 51.4]],
    ["g1", "Visual question answering","RealWorldQA",            "Accuracy",      false, [91.3, 85.9, 82.1, 83.5, 88.0, 84.7]],
    ["g1", "Visual question answering","BlindTest",              "Accuracy",      false, [99.9, 77.6, 97.6, 97.5, 99.3, 98.3]],
    ["g1", "Document & chart QA",      "InfoVQA (val)",          "Accuracy",      false, [98.1, 97.6, 96.3, 93.7, 94.8, 96.3]],
    ["g1", "Document & chart QA",      "CharXiv (RQ)",           "Accuracy",      false, [89.6, 87.9, 84.8, 84.4, 88.4, 84.4]],
    ["g2", "Reasoning & problem solving","MMMU-Pro",             "Accuracy",      false, [86.8, 81.2, 81.6, 80.5, 82.3, 81.2]],
    ["g2", "Reasoning & problem solving","VisualPuzzles",        "Accuracy",      false, [90.2, 70.7, 75.2, 73.5, 65.3, 71.7]],
    ["g2", "Reasoning & problem solving","ZeroBench",            "Pass@5",        false, [47.0, 20.0, 24.0, 17.0, 24.0, 18.0]],
    ["g2", "Visual math",              "MathVista",              "Accuracy",      false, [90.6, 89.7, 89.7, 91.2, 90.4, 87.8]],
    ["g2", "Visual math",              "MathVision",             "Accuracy",      false, [98.1, 98.6, 97.8, 95.7, 97.7, 96.5]],
    ["g3", "Spatial & 3D QA",          "MindCube-Tiny",          "Accuracy",      false, [96.9, 92.9, 88.4, 70.9, 89.5, 88.8]],
    ["g3", "Spatial & 3D QA",          "OmniSpatial",            "Accuracy",      false, [84.0, 72.1, 71.9, 72.5, 72.8, 72.3]],
    ["g3", "Spatial & 3D QA",          "VisFactor",              "Accuracy",      false, [84.9, 54.5, 47.9, 54.0, 60.8, 35.1]],
    ["g4", "Object detection",         "Dense200",               "F1@IoU=0.5",    false, [89.1, 31.1, 67.7, 69.7, 87.0, 46.5]],
    ["g4", "GUI grounding",            "ScreenSpot-Pro",         "Accuracy",      false, [92.7, 87.3, 69.5, 68.1, 84.5, 73.4]],
    ["g4", "Reasoning segmentation",   "ReasonSeg (val)",        "gIoU",          false, [81.3, 70.9, 41.3, 56.6, 68.0, 47.3]],
    ["g4", "Pose estimation",          "OCHuman",                "OKS AP",        false, [75.9, 19.7, 44.6, 32.1, 53.4, 38.3]],
    ["g5", "3D visual grounding",      "Anywhere3D-v2",          "Acc@IoU0.25",   false, [73.8, 63.1, 55.8, 59.4, 48.1, 62.1]],
    ["g5", "Depth estimation",         "DIODE",                  "AbsRel",        true,  [0.63, 0.89, 1.00, 1.19, 1.29, 0.82]],
    ["g5", "3D reconstruction",        "ETH3D",                  "Error (m)",     true,  [1.40, 1.85, 1.96, 1.81, 1.72, 1.89]],
    ["g5", "3D object detection",      "Omni3D (mini)",          "AP3D",          false, [17.3, 13.8, 8.0, 6.6, 7.1, 7.9]],
    ["g6", "Video QA",                 "MMVU (val)",             "Accuracy",      false, [82.6, 72.0, 82.1, 77.9, 82.4, 83.2]],
    ["g6", "Video QA",                 "VSI-Bench (tiny)",       "Accuracy",      false, [70.0, 44.8, 52.9, 38.1, 62.7, 62.5]],
    ["g6", "Temporal localization",    "ActivityNet",            "R@1 IoU=0.7",   false, [38.6, 23.7, 24.6, 22.6, 28.6, 25.3]],
    ["g7", "Image quality assessment", "Q-Bench2",               "Accuracy",      false, [88.3, ns, 85.4, 86.1, 88.0, 85.4]],
    ["g7", "Image quality assessment", "UniPercept",             "Accuracy",      false, [74.1, ns, 73.6, 74.2, 73.3, 71.4]],
    ["g7", "Image restoration",        "All-in-One (5 degradations)", "PSNR (dB)", false, [17.7, ns, 17.3, 17.5, 17.4, 17.2]],
    ["g7", "Text-to-image generation", "GenEval2",               "Soft-TIFA GM",  false, [96.2, ns, ns, 67.4, 92.1, 92.4]],
    ["g7", "Instruction-guided editing","ImgEdit-Bench",         "Score (1–5)",   false, [4.80, ns, ns, 4.20, 4.67, 4.40]],
    ["g8", "Driving-scene QA",         "LingoQA",                "Judge acc.",    false, [79.4, 77.4, 78.6, 66.8, 84.8, 80.4]],
    ["g8", "Driving-scene QA",         "DrivingVQA",             "Exam score",    false, [82.1, 74.3, 64.5, 75.5, 69.3, 72.6]],
    ["g8", "Embodied reasoning",       "ERQA",                   "Accuracy",      false, [82.3, 70.0, 65.2, 68.0, 77.8, 76.5]],
    ["g8", "Embodied reasoning",       "MMSI-Bench",             "Accuracy",      false, [81.2, 53.4, 54.4, 54.0, 56.7, 55.8]],
    ["g8", "Robotic navigation",       "EB-Navigation",          "Success rate",  false, [78.0, 64.0, 48.0, 60.0, 70.0, 67.0]],
    ["g9", "Medical QA",               "MedXpertQA-MM",          "Accuracy",      false, [88.7, 80.0, 73.3, 80.7, 80.4, 80.8]],
    ["g9", "Medical QA",               "MMMU-Pro (Medical)",     "Accuracy",      false, [83.2, 79.4, 74.5, 75.9, 75.8, 75.9]],
    ["g9", "2D medical grounding",     "MS-CXR",                 "mAP@0.5",       false, [61.5, 35.9, 20.8, 35.0, 58.2, 37.8]],
    ["g9", "3D medical grounding",     "M3D-Bench REC",          "mIoU",          false, [73.9, 38.0, 38.4, 24.4, 46.0, 43.8]],
    ["g9", "Microscopy & pathology",   "PUMA",                   "Macro-F1",      false, [23.8, 22.1, 16.7, 14.1, 21.4, 23.1]],
    ["g9", "Remote-sensing QA",        "VLRS-Bench (VQA)",       "Accuracy",      false, [46.3, 42.7, 39.7, 50.0, 48.2, 45.8]],
    ["g9", "Remote-sensing grounding", "RefSegRS",               "oIoU",          false, [37.8, 27.9, 29.0, 14.2, 29.7, 25.7]],
  ].map(([group, task, name, metric, lower, scores]) => {
    const nums = scores.filter((s) => typeof s === "number");
    const best = lower ? Math.min(...nums) : Math.max(...nums);
    return { group, task, name, metric, lower, scores, best };
  });

  const ICONS = {
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    bulb: '<path d="M9 18h6M10 21.5h4"/><path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.5.4.8 1 .8 1.6V16h6v-.1c0-.6.3-1.2.8-1.6A6.5 6.5 0 0 0 12 2.5z"/>',
    cube: '<path d="M12 2.5l8.5 4.8v9.4L12 21.5l-8.5-4.8V7.3z"/><path d="M12 21.5V12M20.5 7.3 12 12 3.5 7.3"/>',
    frame: '<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5"/><rect x="8" y="8" width="8" height="8" rx="1"/>',
    axes: '<path d="M12 13V3M12 13l8.5 5M12 13l-8.5 5"/><path d="M9.5 5.5 12 3l2.5 2.5"/>',
    play: '<circle cx="12" cy="12" r="9.5"/><path d="M10 8.5 15.5 12 10 15.5z"/>',
    palette: '<path d="M12 2.5a9.5 9.5 0 1 0 0 19c1.3 0 2-1 1.6-2.2-.4-1.1.3-2.3 1.5-2.3H18a3.5 3.5 0 0 0 3.5-3.5c0-6-4.3-11-9.5-11z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    robot: '<rect x="4.5" y="8" width="15" height="11" rx="3"/><path d="M12 8V4.5M9.5 13v1M14.5 13v1M2 12.5v2.5M22 12.5v2.5"/><circle cx="12" cy="3.5" r="1"/>',
    microscope: '<path d="M6 18h8M3 21.5h18M14 21.5a7 7 0 0 0 0-14h-1"/><path d="M9 14h2M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2z"/><path d="M12 6V3.5a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1V6"/>',
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

  // Same color scale and area colors as Table 1 on the project page (js/sections.js).
  const STOPS = [[244, 179, 162], [247, 223, 169], [214, 236, 208], [159, 212, 196], [108, 192, 176]];
  const heat = (t) => {
    t = Math.max(0, Math.min(1, t)) * (STOPS.length - 1);
    const i = Math.min(STOPS.length - 2, Math.floor(t)), f = t - i;
    const c = STOPS[i].map((v, k) => Math.round(v + (STOPS[i + 1][k] - v) * f));
    return `rgb(${c.join(",")})`;
  };
  const FLOOR = 30;
  const GRP_COLOR = { g1: "#1F8AFF", g2: "#986BF6", g3: "#D152BB", g4: "#EC4764", g5: "#FF8506", g6: "#F2CB04", g7: "#59AA03", g8: "#00B89A", g9: "#06B1CE" };
  const HEAD = { gpt: "GPT-6<br>Astra", fable: "Fable 5", kimi: "Kimi K3", gemini: "Gemini<br>3.1 Pro", qwen: "Qwen<br>3.8 Max", muse: "Muse<br>Spark 1.3" };
  const DP2 = new Set(["DIODE", "ETH3D", "ImgEdit-Bench"]);
  const fmt = (r, v) => (typeof v === "number" ? v.toFixed(DP2.has(r.name) ? 2 : 1) : v);

  const table = $("[data-bench]");
  table.innerHTML = `<thead><tr><th class="grp">Area</th><th class="cap">Benchmark</th><th class="task">Task</th>${models.map((m) =>
    `<th><span class="mh"><img src="../${m.logo}" alt=""><span class="mt">${HEAD[m.id] || m.name}</span></span></th>`).join("")}</tr></thead><tbody></tbody>`;
  const tbody = $("tbody", table);

  function cell(r, v, ci) {
    if (v === ns) return `<td class="na"><span>n/s</span></td>`;
    if (v == null) return `<td class="na"><span>–</span></td>`;
    const rel = (r.lower ? r.best / v : v / r.best) * 100;
    const best = v === r.best ? " best" : "";
    return `<td class="score${best}" style="--heat:${heat((rel - FLOOR) / (100 - FLOOR))};--d:${ci * 45}ms"><span>${fmt(r, v)}</span></td>`;
  }

  let areaFilter = "all";
  function render() {
    let html = "";
    groups.forEach((g) => {
      if (areaFilter !== "all" && areaFilter !== g.id) return;
      const gr = rows.filter((r) => r.group === g.id);
      const grpCell = `<td class="grp" rowspan="${gr.length}"><span>${icon(g.icon)}${g.name}</span></td>`;
      html += gr.map((r, i) => {
        const pos = (i === 0 ? " grp-start" : "") + (i === gr.length - 1 ? " grp-end" : "");
        // Task spans its consecutive benchmarks.
        const first = i === 0 || gr[i - 1].task !== r.task;
        let span = 1;
        while (first && gr[i + span]?.task === r.task) span++;
        const taskCell = first ? `<td class="task" rowspan="${span}">${r.task}</td>` : "";
        return `<tr class="data${pos}" style="--tc:${GRP_COLOR[g.id]}">${i === 0 ? grpCell : ""}<td class="cap">${r.name}<small>${r.metric}${r.lower ? " ↓" : ""}</small></td>${taskCell}${r.scores.map((v, ci) => cell(r, v, ci)).join("")}</tr>`;
      }).join("");
    });
    tbody.innerHTML = html;
  }

  const chips = $("[data-area-filter]");
  const shortName = { g1: "Recognition", g2: "Reasoning", g3: "Spatial", g4: "2D localization", g5: "3D", g6: "Video", g7: "Generation", g8: "Robotics", g9: "Expert domains" };
  [{ id: "all" }, ...groups].forEach((g) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = g.id === "all" ? "chip" : "chip area";
    b.setAttribute("aria-pressed", String(g.id === "all"));
    if (g.id !== "all") b.style.setProperty("--tc", GRP_COLOR[g.id]);
    const n = g.id === "all" ? rows.length : rows.filter((r) => r.group === g.id).length;
    b.innerHTML = `${g.id === "all" ? "All areas" : shortName[g.id]} <span class="count">${n}</span>`;
    b.addEventListener("click", () => {
      areaFilter = g.id;
      chips.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      render();
    });
    chips.append(b);
  });

  $("[data-heat-toggle]").addEventListener("change", (e) => table.classList.toggle("heat", e.target.checked));
  table.classList.add("heat");
  render();

  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
  }), { threshold: 0.05 });
  document.querySelectorAll(".reveal, [data-bench]").forEach((el) => (staticMode ? el.classList.add("in") : io.observe(el)));
})();
