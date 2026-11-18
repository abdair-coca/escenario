// Shared parts of the GPS deck: the satellite, the phone, the city map seen from above, distance rings,
// signals, pins and the blue dot. Load after sticker-kit.js: <script src="kit.js"></script>; exposes window.gps.
// Every scene of this deck draws its own picture with these parts, in canvas pixels (1920x1080).
(function () {
  const { svg, text } = window.sceneKit;
  const sk = window.stickerKit;

  const CSS = `
    .ring { fill: none; stroke: var(--ink); stroke-width: 6; }
    .ring--focus { stroke: var(--accent); stroke-width: 8; }
    .signal { fill: none; stroke: var(--ink); stroke-width: 6; stroke-linecap: round; stroke-dasharray: 2 14; }
    .city-block { fill: var(--paper); stroke: var(--accent-2); stroke-width: 6; }
    .park { fill: var(--accent-2); stroke: var(--ink); stroke-width: 4; }
    .tree { fill: var(--blue-mid); stroke: var(--ink); stroke-width: 4; }
    .street { fill: var(--accent-2); }
    .tag-text { font-weight: 700; fill: var(--ink); }
    .hand { fill: none; stroke: var(--ink); stroke-width: 8; stroke-linecap: round; }
  `;

  function setup(root) {
    sk.setup(root);
    const style = document.createElement("style");
    style.textContent = CSS;
    root.prepend(style);
  }

  // The running example on the map: the park, where the phone is, and the satellites above the city.
  const P = { x: 960, y: 730 };
  const SATS = {
    1: { x: 700, y: 650 },
    2: { x: 1060, y: 490 },
    3: { x: 1220, y: 720 },
    4: { x: 880, y: 450 },
  };
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const radius = (n) => dist(SATS[n], P);

  // The second point where the rings of satellites 1 and 2 cross (P is the first).
  function otherCrossing() {
    const a = SATS[1];
    const b = SATS[2];
    const len = dist(a, b);
    const u = { x: (b.x - a.x) / len, y: (b.y - a.y) / len };
    const along = (P.x - a.x) * u.x + (P.y - a.y) * u.y;
    const foot = { x: a.x + along * u.x, y: a.y + along * u.y };
    return { x: 2 * foot.x - P.x, y: 2 * foot.y - P.y };
  }

  // City blocks seen from above, on a grid; the block under P is the park, with three trees.
  // Returns the group. Not to scale: it only says "a city, and a park in it".
  function cityMap(parent) {
    const g = svg("g", { "data-decor": "" }, parent);
    for (let i = 0; i < 7; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        const x = 140 + i * 240;
        const y = 300 + j * 180;
        if (i === 3 && j === 2) continue;
        svg("rect", { x, y, width: 200, height: 140, rx: 18, class: "city-block" }, g);
      }
    }
    park(g, 860, 660, 200, 140);
    return g;
  }

  function park(parent, x, y, w, h) {
    svg("rect", { x, y, width: w, height: h, rx: 18, class: "park" }, parent);
    for (const [fx, fy] of [[0.2, 0.3], [0.8, 0.28], [0.22, 0.75], [0.8, 0.74]]) {
      svg("circle", { cx: x + fx * w, cy: y + fy * h, r: Math.min(w, h) * 0.13, class: "tree" }, parent);
    }
  }

  // Satellite sticker: a white body, two blue solar panels on rods and a small dish. s = 1 is 260 px wide.
  // With `num`, a tilted pill #n sits above its right panel. Returns { g, num }.
  function satellite(parent, cx, cy, s = 1, num = null) {
    const g = svg("g", {}, parent);
    const body = 64 * s;
    const pw = 84 * s;
    const ph = 46 * s;
    const gap = 14 * s;
    const off = s >= 0.8 ? 10 : 6;
    svg("line", { x1: cx - body / 2 - gap, y1: cy, x2: cx + body / 2 + gap, y2: cy, class: "ink-line", "stroke-width": 6 }, g);
    for (const side of [-1, 1]) {
      const x = side < 0 ? cx - body / 2 - gap - pw : cx + body / 2 + gap;
      sk.sticker(g, "rect", { x, y: cy - ph / 2, width: pw, height: ph, rx: 6 * s }, "face-blue", off);
      svg("line", { x1: x + pw / 2, y1: cy - ph / 2, x2: x + pw / 2, y2: cy + ph / 2, class: "ink-line", "stroke-width": 4 }, g);
    }
    svg("path", { d: `M${cx - 22 * s},${cy + body / 2 + 4 * s} Q${cx},${cy + body / 2 + 30 * s} ${cx + 22 * s},${cy + body / 2 + 4 * s} Z`, class: "face-soft" }, g);
    sk.sticker(g, "rect", { x: cx - body / 2, y: cy - body / 2, width: body, height: body, rx: 12 * s }, "face-paper", off);
    svg("circle", { cx, cy, r: 9 * s, class: "face-soft" }, g);
    let badge = null;
    if (num !== null) badge = sk.pill(g, `#${num}`, cx + 74 * s + 20, cy - 54 * s - 30, 96, 60, { rot: 6, tone: "navy", size: 40 });
    return { g, badge };
  }

  // Phone sticker centred on (cx, cy). The screen (class phone-screen) is light blue; returns its box too.
  function phone(parent, cx, cy, w, h) {
    const g = svg("g", {}, parent);
    const x = cx - w / 2;
    const y = cy - h / 2;
    const small = w <= 120;
    sk.sticker(g, "rect", { x, y, width: w, height: h, rx: w * 0.16 }, "panel", small ? 6 : 10);
    const inset = w * 0.09;
    const top = h * 0.1;
    const box = { x: x + inset, y: y + top, w: w - 2 * inset, h: h - 2 * top };
    const screen = svg("rect", { x: box.x, y: box.y, width: box.w, height: box.h, rx: w * 0.06, class: "face-soft phone-screen" }, g);
    svg("line", { x1: cx - w * 0.14, y1: y + top / 2, x2: cx + w * 0.14, y2: y + top / 2, class: "ink-line", "stroke-width": 4 }, g);
    return { g, screen, box };
  }

  // Blue location dot: a white ring with an ink outline, a blue centre and a hard shadow.
  function blueDot(parent, cx, cy, r = 26) {
    const g = svg("g", {}, parent);
    svg("circle", { cx: cx + 6, cy: cy + 6, r: r + 10, class: "shade" }, g);
    svg("circle", { cx, cy, r: r + 10, class: "face-paper" }, g);
    svg("circle", { cx, cy, r, class: "face-blue" }, g);
    return g;
  }

  // Map pin whose tip is (x, y), with a short word on its head ("?"). Returns { g, head }.
  function pin(parent, x, y, word = "?") {
    const g = svg("g", {}, parent);
    const d = `M${x},${y} L${x - 30},${y - 60} A38,38 0 1 1 ${x + 30},${y - 60} Z`;
    svg("path", { d, class: "shade", transform: "translate(6 6)" }, g);
    const head = svg("path", { d, class: "face-paper" }, g);
    text(g, word, { x, y: y - 82, class: "tag-text", "text-anchor": "middle", "dominant-baseline": "central", style: "font-size:44px" });
    return { g, head };
  }

  // Paper tag with ink text and a hard shadow, centred on (cx, cy). Width follows the text length.
  function tag(parent, content, cx, cy, { size = 40, rot = 0 } = {}) {
    const g = svg("g", {}, parent);
    const tilted = svg("g", { transform: `rotate(${rot} ${cx} ${cy})` }, g);
    const w = content.length * size * 0.56 + size * 1.1;
    const h = size * 1.6;
    sk.sticker(tilted, "rect", { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: h / 2 }, "face-paper", 6);
    text(tilted, content, { x: cx, y: cy + 2, class: "tag-text", "text-anchor": "middle", "dominant-baseline": "central", style: `font-size:${size}px` });
    return g;
  }

  // Dotted signal from p to q, and a light-blue dot that travels it (hidden until moved).
  function signal(parent, p, q) {
    const line = svg("line", { x1: p.x, y1: p.y, x2: q.x, y2: q.y, class: "signal" }, parent);
    const dot = svg("circle", { cx: p.x, cy: p.y, r: 14, class: "face-soft", opacity: 0 }, parent);
    return { line, dot };
  }

  // Moves a circle from p to q while the tween runs; its position is a pure function of progress.
  function travel(tl, node, p, q, at, duration, ease = "power1.inOut") {
    const state = { u: 0 };
    const place = () => {
      node.setAttribute("cx", (p.x + (q.x - p.x) * state.u).toFixed(1));
      node.setAttribute("cy", (p.y + (q.y - p.y) * state.u).toFixed(1));
    };
    tl.set(node, { opacity: 1 }, at);
    tl.fromTo(state, { u: 0 }, { u: 1, duration, ease, onUpdate: place }, at);
    tl.set(node, { opacity: 0 }, at + duration);
    return state;
  }

  // Ring around a satellite; drawn from its top so it grows like a clock hand.
  function ring(parent, centre, r, focus = false) {
    return svg("circle", {
      cx: centre.x, cy: centre.y, r, class: focus ? "ring ring--focus" : "ring",
      transform: `rotate(-90 ${centre.x} ${centre.y})`,
    }, parent);
  }

  window.gps = { setup, P, SATS, radius, otherCrossing, cityMap, park, satellite, phone, blueDot, pin, tag, signal, travel, ring };
})();
