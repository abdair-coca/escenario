// Shared parts of the robot ice-cream shop deck: robots, customers, scoops, cones, tubs, class cards,
// tags, marks, speech bubbles and the shop front used by the first and last scenes.
// Load after sticker-kit.js and code-panel.js: <script src="kit.js"></script>; exposes window.shop.
// Everything is drawn in canvas pixels (1920x1080).
(function () {
  const { svg, text, writeIn, block } = window.sceneKit;
  const sk = window.stickerKit;
  const { codePanel } = window;

  const CSS = `
    .rb { stroke: var(--ink); stroke-width: 6; stroke-linejoin: round; stroke-linecap: round; }
    .rb--soft { fill: var(--accent-2); }
    .rb--blue { fill: var(--accent); }
    .rb--navy { fill: var(--accent-3); }
    .rb--paper { fill: var(--paper); }
    .rb--plan { fill: none; stroke: var(--paper); stroke-dasharray: 16 12; }
    .eye { fill: var(--paper); }
    .eye--plan { fill: none; stroke: var(--paper); stroke-width: 5; }
    .mouth { fill: none; stroke: var(--paper); stroke-width: 6; stroke-linecap: round; }
    .battery-level { fill: var(--accent-2); }
    .bat-num { font-weight: 700; fill: var(--ink); font-variant-numeric: tabular-nums; }
    .scoop { stroke: var(--ink); stroke-width: 5; }
    .scoop--vainilla { fill: var(--paper); }
    .scoop--fresa { fill: var(--fresa); }
    .scoop--chocolate { fill: var(--chocolate); }
    .scoop--arandano { fill: var(--accent-2); }
    .hatch { stroke: var(--accent-2); stroke-width: 6; stroke-linecap: round; }
    .row-text { font-family: var(--font-code); font-size: 40px; fill: var(--ink); letter-spacing: -0.03em; }
    .row--muted .row-text { fill: var(--muted); }
    .row--accent .row-text { fill: var(--accent); font-weight: 700; }
    .tag-text { font-weight: 700; fill: var(--ink); }
    .tag-text--mono { font-family: var(--font-code); font-weight: 700; letter-spacing: -0.03em; }
    .tag-text--ok { fill: var(--ok); }
    .tag-text--block { fill: var(--block); }
    .tag-text--accent { fill: var(--accent); }
    .mark-line { fill: none; stroke: var(--paper); stroke-width: 8; stroke-linecap: round; stroke-linejoin: round; }
    .dash-outline { fill: none; stroke: var(--ink); stroke-width: 6; stroke-dasharray: 22 14; stroke-linejoin: round; }
    .leader { fill: none; stroke: var(--ink); stroke-width: 5; stroke-linecap: round; }
    .leader--dots { stroke-dasharray: 2 14; stroke-width: 6; }
    .strike { stroke: var(--block); stroke-width: 10; stroke-linecap: round; }
  `;

  function setup(root) {
    sk.setup(root);
    const style = document.createElement("style");
    style.textContent = CSS + codePanel.CSS;
    root.prepend(style);
  }

  // Headline at the top left, written in like ink.
  function headline(tl, root, content, at = 0) {
    const el = block(root, content, { x: 160, y: 96, className: "t96" });
    writeIn(tl, el, at, 0.6);
    return el;
  }

  // Pop in from a smaller size around (x, y), with a short overshoot.
  function pop(tl, el, x, y, at, { from = 0.6, duration = 0.5 } = {}) {
    return tl.from(el, { scale: from, opacity: 0, svgOrigin: `${x} ${y}`, duration, ease: "back.out(1.6)" }, at);
  }

  // A shape in focus presses toward its shadow and comes back (0.3 s).
  function press(tl, el, at) {
    tl.to(el, { x: 6, y: 6, duration: 0.15, ease: "power2.out" }, at);
    tl.to(el, { x: 0, y: 0, duration: 0.15, ease: "power2.in" }, at + 0.15);
  }

  // One value replaces another in the same place (numbers on a battery, results).
  function swap(tl, oldEl, newEl, at) {
    tl.to(oldEl, { opacity: 0, duration: 0.2, ease: "power3.in" }, at);
    tl.from(newEl, { opacity: 0, y: -16, duration: 0.4, ease: "expo.out" }, at + 0.15);
  }

  function measure(t, size, mono) {
    const len = t.getComputedTextLength();
    return len > 0 ? len : t.textContent.length * size * (mono ? 0.58 : 0.55);
  }

  // Robot sticker. (cx, cy) is the centre of its body; s scales it (1 is ~300 px wide, ~470 px tall).
  // tone: soft | blue | navy | paper | plan (white dashed lines, for a blueprint).
  // Returns { g, body, battery: { g, level, num }, at(lx, ly), screen }.
  function robot(parent, cx, cy, { s = 1, tone = "soft", name = null, battery = "100", level = 1, cls = "" } = {}) {
    const g = svg("g", { class: `robot ${cls}`.trim() }, parent);
    const body = svg("g", { transform: `translate(${cx} ${cy}) scale(${s})` }, g);
    const plan = tone === "plan";
    const part = (tag, attrs, fill = tone) =>
      plan ? svg(tag, { ...attrs, class: "rb rb--plan" }, body) : sk.sticker(body, tag, attrs, `rb rb--${fill}`, 10)[1];

    svg("line", { x1: 0, y1: -250, x2: 0, y2: -290, class: plan ? "rb rb--plan" : "rb" }, body);
    part("circle", { cx: 0, cy: -302, r: 16 }, plan ? tone : "blue");
    for (const side of [-1, 1]) part("rect", { x: side < 0 ? -152 : 116, y: -72, width: 36, height: 124, rx: 18 });
    for (const side of [-1, 1]) part("circle", { cx: side * 62, cy: 118, r: 34 }, plan ? tone : "navy");
    part("rect", { x: -24, y: -124, width: 48, height: 30, rx: 8 }, plan ? tone : "navy");
    part("rect", { x: -118, y: -100, width: 236, height: 212, rx: 44 });
    part("rect", { x: -100, y: -252, width: 200, height: 132, rx: 40 });
    const screen = plan
      ? svg("rect", { x: -76, y: -232, width: 152, height: 92, rx: 24, class: "rb rb--plan" }, body)
      : svg("rect", { x: -76, y: -232, width: 152, height: 92, rx: 24, class: "rb rb--navy" }, body);
    for (const side of [-1, 1]) svg("circle", { cx: side * 32, cy: -194, r: 15, class: plan ? "eye--plan" : "eye" }, body);
    if (!plan) svg("path", { d: "M-22,-166 Q0,-150 22,-166", class: "mouth" }, body);

    const bat = svg("g", { class: "battery" }, body);
    if (plan) svg("rect", { x: -70, y: -70, width: 140, height: 64, rx: 14, class: "rb rb--plan" }, bat);
    else sk.sticker(bat, "rect", { x: -70, y: -70, width: 140, height: 64, rx: 14 }, "rb rb--paper", 6);
    const levelRect = svg("rect", { x: -62, y: -62, width: 124, height: 48, rx: 8, class: "battery-level" }, bat);
    gsap.set(levelRect, { scaleX: level, svgOrigin: "-62 0" });
    if (plan) levelRect.remove();
    svg("rect", { x: 70, y: -50, width: 14, height: 24, rx: 4, class: plan ? "rb rb--plan" : "shade" }, bat);
    const num = plan
      ? null
      : text(bat, battery, { x: 0, y: -36, class: "bat-num", "text-anchor": "middle", "dominant-baseline": "central", style: `font-size:${Math.max(40, 40 / s)}px` });

    let tag = null;
    if (name) {
      const w = name.length * 24 + 60;
      tag = sk.pill(g, name, cx, cy + 152 * s + 44, w, 68, { tone: "navy", size: 40 });
    }
    const at = (lx, ly) => ({ x: cx + lx * s, y: cy + ly * s });
    return { g, body, screen, tag, battery: { g: bat, level: levelRect, num }, at, s, cx, cy };
  }

  // A second number on a robot's battery, hidden, to swap in later.
  function batteryNumber(robotHandle, value) {
    const { s } = robotHandle;
    return text(robotHandle.battery.g, value, {
      x: 0, y: -36, class: "bat-num", "text-anchor": "middle", "dominant-baseline": "central",
      style: `font-size:${Math.max(40, 40 / s)}px`,
    });
  }

  // Customer: a round head on round shoulders, eyes looking along `look` (-1 left, 1 right), name tag below.
  function customer(parent, cx, cy, { name = null, tone = "soft", look = -1, cls = "" } = {}) {
    const g = svg("g", { class: `customer ${cls}`.trim() }, parent);
    sk.sticker(g, "rect", { x: cx - 64, y: cy - 8, width: 128, height: 100, rx: 50 }, `rb rb--${tone}`, 8);
    sk.sticker(g, "circle", { cx, cy: cy - 62, r: 50 }, `rb rb--${tone}`, 8);
    for (const side of [-1, 1]) {
      svg("circle", { cx: cx + side * 18, cy: cy - 72, r: 13, class: "eye", stroke: "var(--ink)", "stroke-width": 4 }, g);
      svg("circle", { cx: cx + side * 18 + look * 5, cy: cy - 72, r: 6, fill: "var(--ink)" }, g);
    }
    svg("path", { d: `M${cx - 14},${cy - 44} Q${cx},${cy - 34} ${cx + 14},${cy - 44}`, class: "leader" }, g);
    if (name) tag(g, name, cx, cy + 132);
    return g;
  }

  // Ice-cream scoop: flavour is vainilla | fresa | chocolate | arandano.
  function scoop(parent, cx, cy, r, flavor, cls = "") {
    const g = svg("g", { class: `scoop-g ${cls}`.trim() }, parent);
    sk.sticker(g, "circle", { cx, cy, r }, `scoop scoop--${flavor}`, r <= 40 ? 6 : 10);
    return g;
  }

  let clipCount = 0;
  // Waffle cone pointing down; `top` is the y of its open edge. scoopY(i, r) is where scoop i sits.
  function cone(parent, cx, top, { w = 130, h = 200, cls = "" } = {}) {
    const g = svg("g", { class: `cone ${cls}`.trim() }, parent);
    const points = `${cx - w / 2},${top} ${cx + w / 2},${top} ${cx},${top + h}`;
    svg("polygon", { points, class: "shade", transform: "translate(8 8)" }, g);
    svg("polygon", { points, class: "rb rb--paper" }, g);
    clipCount += 1;
    const id = `cone-clip-${clipCount}`;
    const clip = svg("clipPath", { id }, g);
    svg("polygon", { points }, clip);
    const hatch = svg("g", { "clip-path": `url(#${id})`, "data-decor": "" }, g);
    for (let k = -3; k <= 3; k += 1) {
      const x = cx + k * (w / 4);
      svg("line", { x1: x - h, y1: top + h, x2: x + h * 0.4, y2: top - h * 0.4 + 0, class: "hatch" }, hatch);
      svg("line", { x1: x + h, y1: top + h, x2: x - h * 0.4, y2: top - h * 0.4, class: "hatch" }, hatch);
    }
    svg("polygon", { points, class: "rb", fill: "none" }, g);
    const scoopY = (i, r) => top - r * 0.5 - i * r * 1.45;
    return { g, cx, top, w, h, scoopY };
  }

  // Flavour tub on a menu: a white tub with a scoop dome of the flavour on top. (cx, cy) is the tub's top edge.
  function tub(parent, cx, cy, flavor, cls = "") {
    const g = svg("g", { class: `tub ${cls}`.trim() }, parent);
    const dome = `M${cx - 78},${cy} A78,70 0 0 1 ${cx + 78},${cy} Z`;
    sk.sticker(g, "path", { d: dome }, `scoop scoop--${flavor}`, 8);
    const body = `M${cx - 92},${cy} L${cx + 92},${cy} L${cx + 74},${cy + 120} L${cx - 74},${cy + 120} Z`;
    sk.sticker(g, "path", { d: body }, "rb rb--paper", 8);
    svg("line", { x1: cx - 84, y1: cy + 28, x2: cx + 84, y2: cy + 28, class: "rb" }, g);
    return g;
  }

  // Class card (UML-like): a white panel with a title band and one code row per member.
  // rows: strings or { text, tone: "muted" | "accent" }. Returns { g, rows: [{ g, t }], h, rowY(i) }.
  function card(parent, x, y, w, title, rows, { tone = "blue", dashed = false, cls = "", height = null, band: BAND = 84, row: ROW = 62 } = {}) {
    const h = height ?? BAND + Math.max(rows.length, 1) * ROW + 24;
    const g = svg("g", { class: `card ${cls}`.trim() }, parent);
    const shade = svg("rect", { x, y, width: w, height: h, rx: 32, class: "shade", transform: "translate(10 10)" }, g);
    const bg = svg("rect", { x, y, width: w, height: h, rx: 32, fill: "var(--paper)" }, g);
    const r = 32;
    const band = svg("path", {
      d: `M${x},${y + BAND} V${y + r} A${r},${r} 0 0 1 ${x + r},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + BAND} Z`,
      class: `rb--${tone}`,
    }, g);
    svg("line", { x1: x, y1: y + BAND, x2: x + w, y2: y + BAND, class: "band-line" }, g);
    const outline = svg("rect", { x, y, width: w, height: h, rx: 32, class: dashed ? "dash-outline" : "outline" }, g);
    if (dashed) shade.setAttribute("opacity", 0);
    const titleG = sk.stickerText(g, title, x + w / 2, y + BAND / 2 + 2, 48);
    const rowY = (i) => y + BAND + 10 + i * ROW + ROW / 2;
    const rowHandles = rows.map((row, i) => {
      const spec = typeof row === "string" ? { text: row } : row;
      const rg = svg("g", { class: `row ${spec.tone ? `row--${spec.tone}` : ""}`.trim() }, g);
      const t = text(rg, spec.text, { x: x + 28, y: rowY(i), class: "row-text", "dominant-baseline": "central" });
      return { g: rg, t };
    });
    return { g, rows: rowHandles, h, w, x, y, rowY, band, outline, shade, bg, titleG };
  }

  // Pill-shaped tag with text. tone: paper (ink text) | blue | navy (white sticker text) | ok | block (coloured text).
  function tag(parent, content, cx, cy, { size = 40, rot = 0, tone = "paper", mono = false, cls = "" } = {}) {
    const g = svg("g", { class: `tag ${cls}`.trim() }, parent);
    const tilted = svg("g", { transform: `rotate(${rot} ${cx} ${cy})` }, g);
    const h = Math.round(size * 1.6);
    const shade = svg("rect", { class: "shade", height: h, y: cy - h / 2, rx: h / 2, transform: "translate(6 6)" }, tilted);
    const fill = tone === "blue" || tone === "navy" ? `rb rb--${tone}` : "rb rb--paper";
    const rect = svg("rect", { class: fill, height: h, y: cy - h / 2, rx: h / 2, "stroke-width": 5 }, tilted);
    let width;
    if (tone === "blue" || tone === "navy") {
      const st = sk.stickerText(tilted, content, cx, cy + 1, size);
      if (mono) st.querySelectorAll("text").forEach((t) => t.classList.add("tag-text--mono"));
      width = measure(st.lastChild, size, mono);
    } else {
      const t = text(tilted, content, {
        x: cx, y: cy + 2, "text-anchor": "middle", "dominant-baseline": "central",
        class: `tag-text ${mono ? "tag-text--mono" : ""} ${tone === "ok" || tone === "block" || tone === "accent" ? `tag-text--${tone}` : ""}`.trim(),
        style: `font-size:${size}px`,
      });
      width = measure(t, size, mono);
    }
    const w = width + size * 1.2;
    for (const el of [shade, rect]) {
      el.setAttribute("x", cx - w / 2);
      el.setAttribute("width", w);
    }
    g.width = w;
    return g;
  }

  // Right / wrong mark: a green tick or a red cross in a circle.
  function mark(parent, cx, cy, ok, r = 34) {
    const g = svg("g", { class: "mark" }, parent);
    sk.sticker(g, "circle", { cx, cy, r }, ok ? "face-ok" : "face-block", 6);
    const k = r * 0.4;
    if (ok) svg("path", { d: `M${cx - k},${cy + 2} L${cx - k * 0.25},${cy + k * 0.8} L${cx + k},${cy - k * 0.7}`, class: "mark-line" }, g);
    else svg("path", { d: `M${cx - k},${cy - k} L${cx + k},${cy + k} M${cx + k},${cy - k} L${cx - k},${cy + k}`, class: "mark-line" }, g);
    return g;
  }

  // Speech bubble centred on (cx, cy) with a tail that points at `tail`.
  function bubble(parent, cx, cy, content, tail, { size = 40, mono = false } = {}) {
    const g = svg("g", { class: "bubble" }, parent);
    const h = 96;
    const t = text(g, content, {
      x: cx, y: cy + 2, "text-anchor": "middle", "dominant-baseline": "central",
      class: `tag-text ${mono ? "tag-text--mono" : ""}`, style: `font-size:${size}px`,
    });
    const w = measure(t, size, mono) + 64;
    const baseY = tail.y < cy ? cy - h / 2 : cy + h / 2;
    const bx = Math.max(cx - w / 2 + 40, Math.min(cx + w / 2 - 80, tail.x));
    const tri = `${bx},${baseY} ${bx + 40},${baseY} ${tail.x},${tail.y}`;
    const shapes = svg("g", {}, g);
    g.insertBefore(shapes, t);
    svg("polygon", { points: tri, class: "shade", transform: "translate(6 6)" }, shapes);
    svg("rect", { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 36, class: "shade", transform: "translate(6 6)" }, shapes);
    svg("polygon", { points: tri, class: "rb rb--paper" }, shapes);
    svg("rect", { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 36, class: "rb rb--paper" }, shapes);
    svg("polygon", { points: `${bx + 4},${baseY + (tail.y < cy ? 4 : -4)} ${bx + 36},${baseY + (tail.y < cy ? 4 : -4)} ${(bx + 20 + tail.x) / 2},${(baseY + tail.y) / 2}`, fill: "var(--paper)" }, shapes);
    return g;
  }

  // Code printed on the paper (JetBrains Mono 40 px), hidden until typed in.
  function code(root, lines, x, y) {
    return codePanel.render(root, lines, { x, y });
  }

  // Thin wrapper so scenes do not need codePanel directly.
  const typeIn = (tl, lineEls, at) => codePanel.typeIn(tl, lineEls, at);
  const barIn = (tl, codeHandle, indexes, at) => {
    const bar = codeHandle.bar(indexes);
    codePanel.swipeIn(tl, bar, at);
    return bar;
  };
  const barOut = (tl, bar, at) => codePanel.swipeOut(tl, bar, at);

  // Line with optional dotted style from p to q.
  function leader(parent, p, q, { dots = false } = {}) {
    return svg("line", { x1: p.x, y1: p.y, x2: q.x, y2: q.y, class: `leader ${dots ? "leader--dots" : ""}`.trim() }, parent);
  }

  // Inheritance arrow (UML): a line from the child to the parent with a hollow triangle at the parent.
  function inherits(parent, from, to) {
    const g = svg("g", { class: "inherits" }, parent);
    const len = Math.hypot(to.x - from.x, to.y - from.y);
    const ux = (to.x - from.x) / len;
    const uy = (to.y - from.y) / len;
    const base = { x: to.x - ux * 40, y: to.y - uy * 40 };
    const line = svg("line", { x1: from.x, y1: from.y, x2: base.x, y2: base.y, class: "leader", "stroke-width": 6 }, g);
    const head = svg("polygon", {
      points: `${to.x},${to.y} ${base.x - uy * 26},${base.y + ux * 26} ${base.x + uy * 26},${base.y - ux * 26}`,
      class: "rb rb--paper",
    }, g);
    return { g, line, head };
  }

  // The shop front of the first and last scenes. Returns every part, so a scene can animate or label them.
  const FRONT = {
    robi: { x: 380, y: 760 },
    caja: { x: 820, y: 760 },
    cone: { x: 600, top: 720 },
    board: { x: 1200, y: 290, w: 560, h: 300 },
    menu: { x: 300, y: 436, w: 620, h: 96 },
    customers: [
      { x: 1300, name: "Ana", tone: "soft" },
      { x: 1480, name: "Beto", tone: "blue" },
      { x: 1660, name: "Caro", tone: "navy" },
    ],
    customerY: 850,
  };

  function shopFront(parent) {
    const parts = {};
    parts.ground = svg("rect", { x: 0, y: 1000, width: 1920, height: 80, class: "ground", "data-decor": "", "data-bleed": "" }, parent);

    parts.wall = svg("g", { "data-decor": "" }, parent);
    sk.sticker(parts.wall, "rect", { x: 140, y: 376, width: 940, height: 624 }, "panel", 10);

    parts.menu = svg("g", { class: "menu-board" }, parent);
    const m = FRONT.menu;
    sk.sticker(parts.menu, "rect", { x: m.x, y: m.y, width: m.w, height: m.h, rx: 24 }, "panel-navy", 8);
    sk.stickerText(parts.menu, "Menú", m.x + 110, m.y + m.h / 2, 48);
    ["vainilla", "fresa", "chocolate", "arandano"].forEach((flavor, i) => {
      scoop(parts.menu, m.x + 290 + i * 90, m.y + m.h / 2, 28, flavor);
    });

    parts.robi = robot(parent, FRONT.robi.x, FRONT.robi.y, { s: 0.7, tone: "soft", cls: "robot-robi" });
    parts.caja = robot(parent, FRONT.caja.x, FRONT.caja.y, { s: 0.7, tone: "blue", cls: "robot-caja" });

    parts.counter = svg("g", { "data-decor": "" }, parent);
    sk.sticker(parts.counter, "rect", { x: 140, y: 840, width: 940, height: 160 }, "panel-navy", 10);

    parts.cone = svg("g", { class: "front-cone" }, parent);
    const c = cone(parts.cone, FRONT.cone.x, FRONT.cone.top, { w: 76, h: 120 });
    ["vainilla", "fresa", "chocolate"].forEach((flavor, i) => scoop(parts.cone, FRONT.cone.x, c.scoopY(i, 30), 30, flavor));

    parts.awning = svg("g", { "data-decor": "" }, parent);
    for (let i = 0; i < 7; i += 1) {
      const x = 120 + i * 140;
      const d = `M${x},320 h140 v56 a70,40 0 0 1 -140,0 z`;
      svg("path", { d, class: "shade", transform: "translate(8 8)" }, parts.awning);
    }
    for (let i = 0; i < 7; i += 1) {
      const x = 120 + i * 140;
      const d = `M${x},320 h140 v56 a70,40 0 0 1 -140,0 z`;
      svg("path", { d, class: i % 2 ? "rb rb--paper" : "rb rb--blue" }, parts.awning);
    }

    parts.board = svg("g", { class: "order-board" }, parent);
    const b = FRONT.board;
    card(parts.board, b.x, b.y, b.w, "Pedidos", [], { tone: "blue", height: b.h });
    const treeG = svg("g", { "data-decor": "" }, parts.board);
    const nodes = [[1480, 430], [1370, 500], [1590, 500], [1310, 560], [1430, 560], [1530, 560], [1650, 560]];
    const links = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
    for (const [a, z] of links) svg("line", { x1: nodes[a][0], y1: nodes[a][1], x2: nodes[z][0], y2: nodes[z][1], class: "rb" }, treeG);
    nodes.forEach(([x, y], i) => sk.sticker(treeG, "circle", { cx: x, cy: y, r: 22 }, i === 0 ? "face-soft" : "face-paper", 5));

    parts.customers = FRONT.customers.map((spec) =>
      customer(parent, spec.x, FRONT.customerY, { name: spec.name, tone: spec.tone, look: -1 }),
    );
    return parts;
  }

  window.shop = {
    setup, headline, pop, press, swap, robot, batteryNumber, customer, scoop, cone, tub, card, tag, mark,
    bubble, code, typeIn, barIn, barOut, leader, inherits, shopFront, FRONT,
  };
})();
