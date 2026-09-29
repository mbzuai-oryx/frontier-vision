(() => {
  const { models, byKey } = window.ASTRA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const staticMode = new URLSearchParams(location.search).has("static");
  if (staticMode) document.documentElement.classList.add("no-anim");

  const header = $("[data-header]");
  const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Tooltip (same cards as the project page) */
  const tip = $("[data-tip]");
  const isNum = (v) => typeof v === "number";
  const fmt = (v) => (!isNum(v) ? v : Math.abs(v) < 10 && v % 1 !== 0 ? v.toFixed(2) : v.toFixed(1));
  const pct1 = (v) => `${Math.round(v)}%`;
  const logo = (m) => `../${m.logo}`;
  const refName = (kind) => (kind === "S" ? "specialist" : "human");
  const REF_C = { S: "#e8914a", H: "#4f9fd8" };
  const tierColor = { exceeds: "#127c8a", at: "#58b9a6", near: "#e2a94f", gap: "#e0705f" };
  const tierShort = { exceeds: "Exceeds", at: "At reference", near: "Approaching", gap: "Gap" };
  function placeTip(anchor) {
    const a = anchor.getBoundingClientRect();
    const t = tip.getBoundingClientRect();
    const x = Math.max(12, Math.min(a.left + a.width / 2 - t.width / 2, innerWidth - t.width - 12));
    let y = a.top - t.height - 10;
    if (y < 64) y = a.bottom + 10;
    tip.style.left = x + "px";
    tip.style.top = y + "px";
  }
  function showTip(html, anchor) {
    tip.innerHTML = html;
    tip.hidden = false;
    placeTip(anchor);
    requestAnimationFrame(() => tip.classList.add("show"));
  }
  const hideTip = () => tip.classList.remove("show");
  addEventListener("scroll", hideTip, { passive: true });
  function bindTip(el, html, anchor = el) {
    const on = () => showTip(typeof html === "function" ? html() : html, anchor);
    el.addEventListener("mouseenter", on);
    el.addEventListener("focus", on);
    el.addEventListener("mouseleave", hideTip);
    el.addEventListener("blur", hideTip);
  }
  function capTip(r) {
    const nums = r.scores.filter(isNum);
    const all = [...nums, r.specialist, r.human].filter((v) => v != null);
    const scale = (v) => (r.lower ? Math.min(...all) / v : v / Math.max(...all));
    const refMark = (v, c) => (v == null ? "" : `<b style="left:calc(${scale(v) * 100}% - 1px);background:${c}"></b>`);
    const marks = refMark(r.specialist, "var(--ref-S)") + refMark(r.human, "var(--ref-H)");
    const modelRows = models.map((m, i) => {
      const v = r.scores[i];
      if (!isNum(v)) {
        return `<div class="tip-row"><img src="${logo(m)}" alt=""><span class="nm">${m.name}</span>
          <span class="bar">${marks}</span><span class="v na">${v === "ns" ? "n/s" : "–"}</span></div>`;
      }
      return `<div class="tip-row${v === r.best ? " best" : ""}"><img src="${logo(m)}" alt=""><span class="nm">${m.name}</span>
        <span class="bar"><i style="width:${scale(v) * 100}%"></i>${marks}</span><span class="v">${fmt(v)}</span></div>`;
    }).join("");
    const refs = [
      r.specialist != null && `<span><i style="background:var(--ref-S)"></i>Specialist ${fmt(r.specialist)}</span>`,
      r.human != null && `<span><i style="background:var(--ref-H)"></i>Human ${fmt(r.human)}</span>`,
    ].filter(Boolean).join("");
    const pill = r.tier
      ? `<span class="tier-pill" style="background:${tierColor[r.tier]}">${pct1(r.pct)} · ${tierShort[r.tier]}</span>`
      : `<span>no reference</span>`;
    return `<h4>${r.name}</h4>
      <div class="tip-meta"><span>${r.metric}${r.lower ? " ↓" : ""}</span>${pill}</div>
      <div class="tip-rows">${modelRows}</div>
      ${refs ? `<div class="tip-refs">${refs}</div>` : ""}`;
  }
  const smallTip = (title, lines) => `<h4>${title}</h4><div class="tip-meta" style="display:block;margin-top:6px;color:var(--ink-2)">${lines.map((l) => `<div>${l}</div>`).join("")}</div>`;

  /* Established strengths: one bar panel per capability, six bars + reference lines (from blogv1) */
  const scoreCell = (v) => (isNum(v) ? fmt(v) : v === "ns" ? "n/s" : "–");
  // Two-word names break onto two lines to match the other panel titles
  const PANEL_NAME = { recognition: "Visual <br>Recognition", scientific: "Scientific <br>Reasoning" };
  const BARS = {
    established: ["recognition", "ocr", "documents", "scientific", "math"],
    emerging: ["detection", "segmentation", "grounding3d", "logical", "pose2d", "videoseg", "medground3d", "spatial2d"],
  };
  Object.entries(BARS).forEach(([id, keys]) => keys.forEach((k) => {
    const r = byKey[k];
    const refs = [r.specialist != null && { kind: "S", v: r.specialist }, r.human != null && { kind: "H", v: r.human }].filter(Boolean);
    const max = Math.max(...r.scores.filter(isNum), ...refs.map((x) => x.v)) * 1.04;
    const Y = (v) => (v / max) * 100;
    const panel = document.createElement("div");
    panel.className = "bpanel";
    panel.innerHTML = `<div class="bp-head"><b tabindex="0">${PANEL_NAME[k] || r.name}</b></div>
      <div class="bp-hplot">
        ${models.map((m, i) => {
          const v = r.scores[i];
          return `<div class="hrow${m.id === "gpt" ? " astra" : ""}${isNum(v) ? "" : " na"}" data-i="${i}" tabindex="0"><img src="${logo(m)}" alt="${m.name}" title="${m.name}"><div class="track"><i style="--w:${isNum(v) ? Y(v) : 0}%"></i></div><span class="v">${scoreCell(v)}</span></div>`;
        }).join("")}
        <div class="rlines">${refs.map((x) => {
          // With two reference lines, mark which is lower so narrow layouts can anchor the labels apart
          const side = refs.length === 2 ? (x.v === Math.min(...refs.map((y) => y.v)) ? " lo" : " hi") : "";
          return `<div class="hrline${side}" style="--x:${Y(x.v)}%;--c:${REF_C[x.kind]}"><span>${x.kind} ${fmt(x.v)}</span></div>`;
        }).join("")}</div>
      </div>
      <div class="bp-metric">${r.metric}${r.lower ? " ↓" : ""}</div>`;
    $$(".hrow", panel).forEach((b) => {
      const i = +b.dataset.i;
      bindTip(b, smallTip(models[i].name, [`${r.name}: <b>${fmt(r.scores[i])}</b> ${r.metric}`, ...refs.map((x) => `${refName(x.kind)} reference ${fmt(x.v)}`)]));
    });
    bindTip($(".bp-head b", panel), () => capTip(r));
    $(`[data-bars="${id}"]`).append(panel);
  }));

  /* Detection boxes and segmentation masks, with a Ground truth / GPT-6 Astra / Both switch (from blogv1) */
  const SVGNS = "http://www.w3.org/2000/svg";
  const boxFigs = $$("[data-boxes]");
  const boxSvgs = boxFigs.map((fig) => {
    const img = $("img", fig);
    const wrap = document.createElement("div");
    wrap.className = "media";
    img.replaceWith(wrap);
    wrap.append(img);
    const svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("class", "overlay");
    // The image is cropped to 4:3 (object-fit: cover); "slice" crops the overlay the same way,
    // once the viewBox matches the image's own aspect ratio.
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.style.height = "100%";
    const g = document.createElementNS(SVGNS, "g");
    svg.append(g);
    wrap.append(svg);
    const fit = () => {
      const a = img.naturalWidth / img.naturalHeight || 1;
      svg.setAttribute("viewBox", `0 0 ${a} 1`);
      g.setAttribute("transform", `scale(${a} 1)`);
    };
    img.complete ? fit() : img.addEventListener("load", fit);
    let n = 0;
    const data = window.BOXES[fig.dataset.boxes];
    ["gt", "pred"].forEach((kind) => data[kind].forEach(([x, y, w, hh]) => {
      const r = document.createElementNS(SVGNS, "rect");
      Object.entries({ x, y, width: w, height: hh, class: kind, pathLength: 400 }).forEach(([k, v]) => r.setAttribute(k, v));
      r.style.setProperty("--d", (n++ % 150) * 6 + "ms");
      g.append(r);
    }));
    return svg;
  });
  const drawBoxes = () => boxSvgs.forEach((svg) => $$("rect", svg).forEach((el) => {
    el.classList.remove("draw");
    void el.getBoundingClientRect();
    if (!staticMode) el.classList.add("draw");
  }));
  const boxGrid = $('[data-fig="boxes"] .grid3');
  const bio = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { drawBoxes(); bio.disconnect(); }
  }), { threshold: 0.25 });
  bio.observe(boxGrid);
  $$("[data-box-mode] button").forEach((b, _, all) => b.addEventListener("click", () => {
    all.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    boxGrid.dataset.modeShow = b.dataset.mode;
    drawBoxes();
  }));

  /* Pathology: ground-truth boundaries on the left of the slider, GPT-6 Astra's on the right.
     The polygon file is ~260 KB, so it loads when the figure comes near the viewport. */
  const puma = $("[data-puma]");
  const pumaLayer = (host, kind, pts) => {
    const svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("class", "overlay poly");
    svg.setAttribute("viewBox", "0 0 1000 1000");
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.innerHTML = pts.map((p) => `<polygon class="${kind}" points="${p}"/>`).join("");
    host.append(svg);
  };
  const pio = new IntersectionObserver((es) => {
    if (!es.some((e) => e.isIntersecting)) return;
    pio.disconnect();
    const s = document.createElement("script");
    s.src = "../js/puma.js";
    s.onload = () => {
      const data = window.PUMA[puma.dataset.puma];
      const top = $(".c-top", puma);
      pumaLayer(top, "gt", data.gt);
      const base = document.createElement("div");
      base.className = "c-base";
      pumaLayer(base, "pred", data.pred);
      puma.insertBefore(base, top);
    };
    document.body.append(s);
  }, { rootMargin: "400px 0px" });
  pio.observe(puma);

  /* Compare sliders */
  document.querySelectorAll("[data-compare]").forEach((el) => {
    const range = $(".c-range", el);
    const set = () => el.style.setProperty("--pos", range.value + "%");
    range.addEventListener("input", set);
    set();
  });

  /* Reveal on scroll */
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
  }), { threshold: 0.2, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach((el) => (staticMode ? el.classList.add("in") : io.observe(el)));
})();
