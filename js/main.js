(() => {
  const { models, groups, rows, tiers, mosaic, tileImg, byKey } = window.ASTRA;
  const $ = (s, el = document) => el.querySelector(s);
  const h = (tag, attrs = {}, html = "") => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "style") el.style.cssText = v;
      else el.setAttribute(k, v);
    }
    el.innerHTML = html;
    return el;
  };

  const tierColor = { exceeds: "var(--t-exceeds)", at: "var(--t-at)", near: "var(--t-near)", gap: "var(--t-gap)" };
  const tierShort = { exceeds: "Exceeds", at: "At reference", near: "Approaching", gap: "Gap" };

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
    tools: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3.5 17.3a1.8 1.8 0 0 0 2.6 2.6l5.8-5.8a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.3-.4-.4-2.3z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5M12 14v4M8.5 21h7M9.5 18h5"/>',
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

  const fmt = (v) => (typeof v !== "number" ? v : Math.abs(v) < 10 && v % 1 !== 0 ? v.toFixed(2) : v.toFixed(1));

  if (new URLSearchParams(location.search).has("static")) document.documentElement.classList.add("no-anim");

  /* Header, reveal, count-up ------------------------------------------------ */
  const header = $("[data-header]");
  const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
      if (e.target.matches(".stats")) countUp(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  function countUp(root) {
    if (document.documentElement.classList.contains("no-anim")) return;
    root.querySelectorAll("[data-count]").forEach((el) => {
      const end = +el.dataset.count;
      const t0 = performance.now();
      const dur = 1100;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  // Active nav link
  const navLinks = [...document.querySelectorAll(".site-nav a, .side-nav a")];
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.dataset.nav || e.target.id;
      navLinks.forEach((a) => a.classList.toggle("is-active", a.hash === "#" + id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => navIO.observe(s));

  /* Model strip ------------------------------------------------------------- */
  const strip = $("[data-model-strip]");
  models.forEach((m) => strip.append(h("li", {}, `<img src="${m.logo}" alt="">${m.name}`)));

  /* Tooltip ----------------------------------------------------------------- */
  const tip = $("[data-tip]");

  function tipHTML(r) {
    const nums = r.scores.filter((s) => typeof s === "number");
    const all = [...nums, r.specialist, r.human].filter((v) => v != null);
    const scale = (v) => r.lower ? Math.min(...all) / v : v / Math.max(...all);
    const refMark = (v, c) => v == null ? "" : `<b style="left:calc(${scale(v) * 100}% - 1px);background:${c}"></b>`;
    const marks = refMark(r.specialist, "var(--ref-S)") + refMark(r.human, "var(--ref-H)");
    const modelRows = models.map((m, i) => {
      const v = r.scores[i];
      if (typeof v !== "number") {
        return `<div class="tip-row"><img src="${m.logo}" alt=""><span class="nm">${m.name}</span>
          <span class="bar">${marks}</span><span class="v na">${v === "ns" ? "n/s" : "–"}</span></div>`;
      }
      return `<div class="tip-row${v === r.best ? " best" : ""}"><img src="${m.logo}" alt=""><span class="nm">${m.name}</span>
        <span class="bar"><i style="width:${scale(v) * 100}%"></i>${marks}</span><span class="v">${fmt(v)}</span></div>`;
    }).join("");
    const refs = [
      r.specialist != null && `<span><i style="background:var(--ref-S)"></i>Specialist ${fmt(r.specialist)}</span>`,
      r.human != null && `<span><i style="background:var(--ref-H)"></i>Human ${fmt(r.human)}</span>`,
    ].filter(Boolean).join("");
    const pill = r.tier
      ? `<span class="tier-pill" style="background:${tierColor[r.tier]}">${Math.round(r.pct)}% · ${tierShort[r.tier]}</span>`
      : `<span>no reference</span>`;
    return `<h4>${r.name}</h4>
      <div class="tip-meta"><span>${r.metric}${r.lower ? " ↓" : ""}</span>${pill}</div>
      <div class="tip-rows">${modelRows}</div>
      ${refs ? `<div class="tip-refs">${refs}</div>` : ""}`;
  }

  function showTip(r, anchor) {
    tip.innerHTML = tipHTML(r);
    tip.hidden = false;
    const a = anchor.getBoundingClientRect();
    const t = tip.getBoundingClientRect();
    let x = a.left + a.width / 2 - t.width / 2;
    x = Math.max(12, Math.min(x, innerWidth - t.width - 12));
    let y = a.top - t.height - 10;
    if (y < 72) y = a.bottom + 10;
    tip.style.left = x + "px";
    tip.style.top = y + "px";
    requestAnimationFrame(() => tip.classList.add("show"));
  }
  function hideTip() { tip.classList.remove("show"); }
  addEventListener("scroll", hideTip, { passive: true });

  function bindTip(el, r, anchor = el) {
    el.addEventListener("mouseenter", () => showTip(r, anchor));
    el.addEventListener("mouseleave", hideTip);
    el.addEventListener("focus", () => showTip(r, anchor));
    el.addEventListener("blur", hideTip);
  }

  /* Hero mosaic ------------------------------------------------------------- */
  const mosaicEl = $("[data-mosaic]");
  let idx = 0;
  mosaic.forEach(({ group, tiles }) => {
    const g = groups.find((x) => x.id === group);
    const card = h("div", { class: "group", style: `--n:${tiles.length};--c:var(--${group})` },
      `<div class="group-head">${icon(g.icon)}<span>${g.name}</span></div><div class="group-tiles"></div>`);
    const wrap = $(".group-tiles", card);
    tiles.forEach(([key, label]) => {
      const r = byKey[key];
      const tile = h("div", { class: "tile", tabindex: "0", style: `--i:${idx++};--tier-c:${tierColor[r.tier] || "transparent"}` },
        `<div class="tile-label">${label}</div>
         <div class="tile-media"><img src="assets/tiles/${tileImg[key]}.jpg" alt="${r.name} example">
         ${r.tier ? `<span class="tier-badge">${Math.round(r.pct)}%</span>` : ""}</div>`);
      bindTip(tile, r, $(".tile-media", tile));
      wrap.append(tile);
    });
    mosaicEl.append(card);
  });
  io.observe(mosaicEl);

  const legend = $("[data-tier-legend]");
  tiers.forEach((t) => legend.append(h("li", {}, `<span class="dot" style="background:${tierColor[t.id]}"></span>${t.name}`)));
  const tierToggle = $("[data-tier-toggle]");
  const applyTiers = () => {
    mosaicEl.classList.toggle("show-tiers", tierToggle.checked);
    legend.classList.toggle("on", tierToggle.checked);
  };
  tierToggle.addEventListener("change", applyTiers);
  applyTiers();

  /* Tier chart -------------------------------------------------------------- */
  const LO = 20, HI = 132;
  const x = (p) => ((p - LO) / (HI - LO)) * 100;
  const chart = $("[data-tier-chart]");
  const card = chart.closest(".tier-card");
  const ranked = rows.filter((r) => r.tier);
  let i = 0;

  tiers.forEach((t) => {
    const items = ranked.filter((r) => r.tier === t.id).sort((a, b) => b.pct - a.pct);
    const band = h("div", { class: "band", "data-tier": t.id, style: `--tc:${tierColor[t.id]}` },
      `<div class="band-head"><span class="dot"></span>${t.name}</div>`);
    items.forEach((r) => {
      const pos = r.pct >= 100;
      const left = pos ? x(100) : x(r.pct);
      const width = Math.max(0.6, Math.abs(x(r.pct) - x(100)));
      const grid = [25, 50, 75, 125].map((g) => `<span class="grid" style="left:${x(g)}%"></span>`).join("");
      const val = pos
        ? `<span class="bar-val" style="left:calc(${x(r.pct)}% + 8px)">${Math.round(r.pct)}%</span>`
        : `<span class="bar-val" style="left:calc(${x(r.pct)}% - 8px);transform:translateX(-100%)">${Math.round(r.pct)}%</span>`;
      const row = h("div", { class: "trow", "data-tier": t.id, style: `--i:${i++}` },
        `<span class="lbl" title="${r.name}">${r.name}</span>
         <div class="track" style="--x100:${x(100)}%">${grid}
           <span class="bar-fill ${pos ? "pos" : "neg"}" style="left:${left}%;width:${width}%"></span>${val}
         </div>
         <span class="ref"><span class="ref-chip ref-${r.ref.kind}" title="${r.ref.kind === "S" ? "Specialist" : "Human"} reference">${r.ref.kind}</span></span>`);
      const track = $(".track", row);
      bindTip(track, r, $(".bar-fill", row));
      band.append(row);
    });
    chart.append(band);
  });
  io.observe(card);

  const axis = $("[data-tier-axis]");
  axis.innerHTML = `<span></span><div class="ticks">${[25, 50, 75, 100, 125]
    .map((t) => `<span class="${t === 100 ? "ref100" : ""}" style="left:${x(t)}%">${t}%</span>`).join("")}</div><span></span>`;

  // Filter chips
  const filter = $("[data-tier-filter]");
  const chips = [{ id: "all", name: "All capabilities" }, ...tiers];
  chips.forEach((c) => {
    const b = h("button", { class: "chip", type: "button", "aria-pressed": String(c.id === "all") },
      `${c.id !== "all" ? `<span class="dot" style="background:${tierColor[c.id]}"></span>` : ""}${c.name}`);
    b.addEventListener("click", () => {
      filter.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      chart.classList.toggle("filtered", c.id !== "all");
      chart.querySelectorAll(".trow, .band").forEach((el) => el.classList.toggle("dim", c.id !== "all" && el.dataset.tier !== c.id));
    });
    filter.append(b);
  });

  document.querySelectorAll(".reveal, .stats").forEach((el) => io.observe(el));

  // Shared helpers for sections.js
  window.UI = { $, h, io, icon, fmt, tierColor, tierShort, bindTip, hideTip };

  // ?static renders the final state immediately (used for screenshots).
  if (new URLSearchParams(location.search).has("static")) {
    document.documentElement.classList.add("no-anim");
    document.querySelectorAll(".reveal, .stats, [data-mosaic], .tier-card").forEach((el) => el.classList.add("in"));
  }
})();
