// Shared helpers of the fridge deck: sticker shapes, a measurable route for tubes, the milk carton,
// the mascot and the zone panels. Load with <script src="kit.js"></script>; exposes window.nevera.
// Every scene of this deck draws its own picture with these parts, in canvas pixels (1920x1080).
(function () {
  const { svg, text, addStyles } = window.sceneKit;
  const RAD = Math.PI / 180;
  const f = (n) => Number(n.toFixed(1));

  const CSS = `
    .shade { fill: var(--ink); stroke: var(--ink); stroke-width: 6; stroke-linejoin: round; stroke-linecap: round; }
    .panel { fill: var(--paper); stroke: var(--ink); stroke-width: 6; stroke-linejoin: round; }
    .panel-blue { fill: var(--accent-2); stroke: var(--ink); stroke-width: 6; stroke-linejoin: round; }
    .panel-navy { fill: var(--accent-3); stroke: var(--ink); stroke-width: 6; stroke-linejoin: round; }
    .face-blue { fill: var(--accent); stroke: var(--ink); stroke-width: 4; stroke-linejoin: round; }
    .face-warm { fill: var(--warm); stroke: var(--ink); stroke-width: 4; stroke-linejoin: round; }
    .face-soft { fill: var(--accent-2); stroke: var(--ink); stroke-width: 4; stroke-linejoin: round; }
    .face-paper { fill: var(--paper); stroke: var(--ink); stroke-width: 4; stroke-linejoin: round; }
    .band { fill: var(--accent); }
    .band-line { fill: none; stroke: var(--ink); stroke-width: 6; stroke-linecap: round; }
    .outline { fill: none; stroke: var(--ink); stroke-width: 6; stroke-linejoin: round; }
    .t-shade { fill: none; stroke: var(--ink); stroke-linecap: round; stroke-linejoin: round; }
    .t-ink { fill: none; stroke: var(--ink); stroke-linecap: round; stroke-linejoin: round; }
    .t-core { fill: none; stroke: var(--paper); stroke-linecap: round; stroke-linejoin: round; }
    .fluid-blue { fill: none; stroke: var(--accent); stroke-linecap: round; stroke-linejoin: round; }
    .fluid-warm { fill: none; stroke: var(--warm); stroke-linecap: round; stroke-linejoin: round; }
    .ink-line { fill: none; stroke: var(--ink); stroke-linecap: round; stroke-linejoin: round; }
    .warm-line { fill: none; stroke: var(--warm); stroke-linecap: round; stroke-linejoin: round; }
    .blue-line { fill: none; stroke: var(--accent); stroke-linecap: round; stroke-linejoin: round; }
    .warm-head { fill: var(--warm); stroke: var(--ink); stroke-width: 4; stroke-linejoin: round; }
    .blue-head { fill: var(--accent); stroke: var(--ink); stroke-width: 4; stroke-linejoin: round; }
    .mascot { fill: var(--accent-2); stroke: var(--ink); stroke-width: 6; }
    .mascot-eye { fill: var(--paper); stroke: var(--ink); stroke-width: 4; }
    .pupil { fill: var(--ink); }
    .smile { fill: none; stroke: var(--ink); stroke-width: 6; stroke-linecap: round; }
    .cheek { fill: var(--blue-mid); }
    .ground { fill: var(--accent-3); }
    .edge { fill: none; stroke: var(--ink); stroke-width: 6; }
    .sticker { font-weight: 700; stroke-linejoin: round; paint-order: stroke; stroke: var(--ink); stroke-width: 10; }
    .sticker--face { fill: var(--paper); }
    .sticker--shadow { fill: var(--ink); }
    .sticker--warm { fill: var(--warm); }
    .carton-word { font-size: 40px; font-weight: 700; }
    .t56b { font-size: 56px; font-weight: 700; }
    .t56m { font-size: 56px; font-weight: 500; }
  `;

  function setup(root) {
    addStyles(root);
    addStyles(root, CSS);
  }

  // Hard shadow: a copy of the shape in ink, offset right and down, drawn first. Returns both parts.
  function sticker(parent, tag, attrs, cls, offset = 10) {
    const shade = svg(tag, { ...attrs, class: "shade", transform: `translate(${offset} ${offset})` }, parent);
    const body = svg(tag, { ...attrs, class: cls }, parent);
    return [shade, body];
  }

  function label(parent, content, x, y, cls = "t40", anchor = "start") {
    return text(parent, content, { class: cls, x, y, "text-anchor": anchor, "dominant-baseline": "central" });
  }

  // Sticker text: an ink shadow copy and a face, both outlined in ink. Returns the group.
  function stickerText(parent, content, x, y, size, { anchor = "middle", tone = "face" } = {}) {
    const g = svg("g", {}, parent);
    const base = { "text-anchor": anchor, "dominant-baseline": "central", style: `font-size:${size}px` };
    text(g, content, { ...base, class: "sticker sticker--shadow", x: x + 5, y: y + 5 });
    text(g, content, { ...base, class: `sticker sticker--${tone}`, x, y });
    return g;
  }

  // Pill / badge: rounded rectangle, ink outline, hard shadow, sticker text. `face` is the part that presses.
  function pill(parent, content, cx, cy, w, h, { rot = 0, tone = "blue", size = 40 } = {}) {
    const outer = svg("g", {}, parent);
    const tilted = svg("g", { transform: `rotate(${rot} ${cx} ${cy})` }, outer);
    const rect = { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: h / 2 };
    svg("rect", { ...rect, class: "shade", transform: "translate(6 6)" }, tilted);
    const face = svg("g", {}, tilted);
    svg("rect", { ...rect, class: `face-${tone}` }, face);
    stickerText(face, content, cx, cy + 1, size, { tone: "face" });
    return { g: outer, face };
  }

  // Mascot: a round blob with big eyes that look along `look`, a small smile, and (hidden) cheeks and a big smile.
  function mascot(parent, cx, cy, r, look) {
    const g = svg("g", { "data-decor": "" }, parent);
    svg("circle", { cx: cx + 10, cy: cy + 10, r, class: "shade" }, g);
    svg("circle", { cx, cy, r, class: "mascot" }, g);
    for (const side of [-1, 1]) {
      const ex = cx + side * 0.36 * r;
      const ey = cy - 0.18 * r;
      const er = 0.26 * r;
      svg("circle", { cx: ex, cy: ey, r: er, class: "mascot-eye" }, g);
      svg("circle", { cx: ex + look[0] * er * 0.45, cy: ey + look[1] * er * 0.45, r: er * 0.5, class: "pupil" }, g);
    }
    const cheeks = [-1, 1].map((side) =>
      svg("circle", { cx: cx + side * 0.62 * r, cy: cy + 0.22 * r, r: 0.14 * r, class: "cheek", opacity: 0 }, g),
    );
    const smile = svg("path", { class: "smile", d: `M${cx - 0.3 * r},${cy + 0.28 * r} Q${cx},${cy + 0.56 * r} ${cx + 0.3 * r},${cy + 0.28 * r}` }, g);
    const bigSmile = svg("path", { class: "smile", opacity: 0, d: `M${cx - 0.38 * r},${cy + 0.24 * r} Q${cx},${cy + 0.82 * r} ${cx + 0.38 * r},${cy + 0.24 * r}` }, g);
    return { g, smile, bigSmile, cheeks };
  }

  // A fat arrow from p to q: ink outline under a colour line, with a head.
  function arrow(parent, p, q, { tone = "warm", w = 16 } = {}) {
    const g = svg("g", {}, parent);
    const len = Math.hypot(q.x - p.x, q.y - p.y);
    const ux = (q.x - p.x) / len;
    const uy = (q.y - p.y) / len;
    const hl = w * 2.6; // head length
    const hw = w * 1.5; // head half width
    const neck = { x: q.x - ux * (hl * 0.8), y: q.y - uy * (hl * 0.8) };
    const base = { x: q.x - ux * hl, y: q.y - uy * hl };
    const head = `${q.x},${q.y} ${base.x - uy * hw},${base.y + ux * hw} ${base.x + uy * hw},${base.y - ux * hw}`;
    const line = { x1: p.x, y1: p.y, x2: neck.x, y2: neck.y };
    svg("line", { ...line, class: "ink-line", "stroke-width": w + 12 }, g);
    svg("line", { ...line, class: `${tone}-line`, "stroke-width": w }, g);
    svg("polygon", { points: head, class: `${tone}-head` }, g);
    return g;
  }

  // Four-point sparkle in --accent-2 (decoration, cold).
  function sparkle(parent, cx, cy, r) {
    const g = svg("g", { "data-decor": "" }, parent);
    const k = 0.3 * r;
    const points = `${cx},${cy - r} ${cx + k},${cy - k} ${cx + r},${cy} ${cx + k},${cy + k} ${cx},${cy + r} ${cx - k},${cy + k} ${cx - r},${cy} ${cx - k},${cy - k}`;
    svg("polygon", { points, class: "shade", transform: "translate(6 6)" }, g);
    svg("polygon", { points, class: "face-soft" }, g);
    return g;
  }

  // The milk carton: gable roof, blue band with LECHE, a drop above. (cx, base) is the bottom centre.
  // Keep s >= 0.85 so the word stays at 40 px or more. Returns the group.
  function carton(parent, cx, base, s = 1) {
    const w = 200 * s;
    const h = 230 * s;
    const rh = 64 * s;
    const fin = 18 * s;
    const l = cx - w / 2;
    const r = cx + w / 2;
    const top = base - h;
    const g = svg("g", {}, parent);
    const bodyAttrs = { x: l, y: top, width: w, height: h, rx: 10 * s };
    const roof = `${l},${top} ${l + 0.12 * w},${top - rh} ${r - 0.12 * w},${top - rh} ${r},${top}`;
    const finAttrs = { x: cx - 0.3 * w, y: top - rh - fin, width: 0.6 * w, height: fin, rx: 5 * s };
    svg("rect", { ...bodyAttrs, class: "shade", transform: "translate(8 8)" }, g);
    svg("polygon", { points: roof, class: "shade", transform: "translate(8 8)" }, g);
    svg("rect", { ...finAttrs, class: "shade", transform: "translate(8 8)" }, g);
    svg("rect", { ...finAttrs, class: "face-blue" }, g);
    svg("polygon", { points: roof, class: "face-blue" }, g);
    svg("rect", { ...bodyAttrs, class: "panel" }, g);
    // drop symbol above the band
    const dy = top + 0.17 * h;
    svg("path", { d: `M${cx},${dy - 30 * s} Q${cx + 26 * s},${dy + 4 * s} ${cx + 18 * s},${dy + 18 * s} A${19 * s},${19 * s} 0 1 1 ${cx - 18 * s},${dy + 18 * s} Q${cx - 26 * s},${dy + 4 * s} ${cx},${dy - 30 * s} Z`, class: "face-soft" }, g);
    // band with the word
    const by = top + 0.4 * h;
    svg("rect", { x: l, y: by, width: w, height: 0.3 * h, class: "face-blue", "stroke-width": 4 }, g);
    stickerText(g, "LECHE", cx, by + 0.15 * h, 40, { tone: "face" });
    svg("rect", { ...bodyAttrs, class: "outline" }, g);
    return g;
  }

  // A route is a chain of lines and circular arcs we can both draw and measure, so a drop can travel
  // along it and fluid can be drawn over any part of it. Angles in degrees, screen coordinates:
  // an increasing angle turns clockwise on screen.
  function route(x, y) {
    const segs = [];
    const marks = {};
    let total = 0;
    let cx = x;
    let cy = y;
    const api = {
      line(x1, y1) {
        const len = Math.hypot(x1 - cx, y1 - cy);
        segs.push({ k: "l", x0: cx, y0: cy, x1, y1, len });
        total += len;
        cx = x1;
        cy = y1;
        return api;
      },
      arc(ox, oy, r, a0, a1) {
        const len = r * Math.abs(a1 - a0) * RAD;
        segs.push({ k: "a", ox, oy, r, a0, a1, len });
        total += len;
        cx = ox + r * Math.cos(a1 * RAD);
        cy = oy + r * Math.sin(a1 * RAD);
        return api;
      },
      mark(name) {
        marks[name] = total;
        return api;
      },
      marks,
      get length() {
        return total;
      },
      pointAt(s) {
        const target = Math.min(Math.max(s, 0), total);
        let pos = 0;
        for (const g of segs) {
          if (target <= pos + g.len + 1e-6) return pointOn(g, (target - pos) / g.len);
          pos += g.len;
        }
        return pointOn(segs[segs.length - 1], 1);
      },
      // SVG path data for the part of the route between two distances.
      d(s0 = 0, s1 = total) {
        const p = api.pointAt(s0);
        let out = `M${f(p.x)},${f(p.y)}`;
        let pos = 0;
        for (const g of segs) {
          const a = Math.max(s0, pos);
          const b = Math.min(s1, pos + g.len);
          if (b - a > 1e-6) {
            const u0 = (a - pos) / g.len;
            const u1 = (b - pos) / g.len;
            const end = pointOn(g, u1);
            if (g.k === "l") out += `L${f(end.x)},${f(end.y)}`;
            else {
              const sweepAngle = Math.abs((g.a1 - g.a0) * (u1 - u0));
              out += `A${g.r},${g.r} 0 ${sweepAngle > 180 ? 1 : 0} ${g.a1 > g.a0 ? 1 : 0} ${f(end.x)},${f(end.y)}`;
            }
          }
          pos += g.len;
        }
        return out;
      },
    };
    return api;
  }

  function pointOn(g, u) {
    if (g.k === "l") return { x: g.x0 + (g.x1 - g.x0) * u, y: g.y0 + (g.y1 - g.y0) * u };
    const a = (g.a0 + (g.a1 - g.a0) * u) * RAD;
    return { x: g.ox + g.r * Math.cos(a), y: g.oy + g.r * Math.sin(a) };
  }

  // Three stacked layers of one tube: the hard shadow, the ink wall and the white core.
  // `layers` is { shadow, ink, core } (groups, so tubes cross cleanly). Returns the three paths.
  function tube(layers, d, width) {
    return [
      svg("path", { d, class: "t-shade", "stroke-width": width + 12, transform: "translate(6 6)" }, layers.shadow),
      svg("path", { d, class: "t-ink", "stroke-width": width + 12 }, layers.ink),
      svg("path", { d, class: "t-core", "stroke-width": width }, layers.core),
    ];
  }

  function tubeLayers(stage) {
    return { shadow: svg("g", {}, stage), ink: svg("g", {}, stage), core: svg("g", {}, stage) };
  }

  // Moves `node` (a circle) along a route as the tween runs; the position is a pure function of progress.
  function follow(tl, node, path, at, duration, ease = "power1.inOut", from = 0, to = path.length) {
    const state = { s: from };
    const place = () => {
      const p = path.pointAt(state.s);
      node.setAttribute("cx", f(p.x));
      node.setAttribute("cy", f(p.y));
    };
    place();
    tl.fromTo(state, { s: from }, { s: to, duration, ease, onUpdate: place }, at);
    return state;
  }

  // The two zones of the loop scenes: «dentro» (blue) and «cocina» (white), each with a title band.
  const ZONES = {
    inside: { x: 100, y: 236, w: 790, h: 604, name: "dentro", body: "panel-blue" },
    kitchen: { x: 930, y: 236, w: 884, h: 604, name: "cocina", body: "panel" },
  };

  function zone(parent, spec) {
    const { x, y, w, h, name, body } = spec;
    const r = 32;
    const bh = 70;
    const g = svg("g", {}, parent);
    svg("rect", { x: x + 10, y: y + 10, width: w, height: h, rx: r, class: "shade" }, g);
    svg("rect", { x, y, width: w, height: h, rx: r, class: body }, g);
    svg("path", { d: `M${x},${y + bh} V${y + r} A${r},${r} 0 0 1 ${x + r},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + bh} Z`, class: "band" }, g);
    svg("line", { x1: x, y1: y + bh, x2: x + w, y2: y + bh, class: "band-line" }, g);
    svg("rect", { x, y, width: w, height: h, rx: r, class: "outline" }, g);
    ["face-paper", "face-soft", "panel-navy"].forEach((cls, i) =>
      svg("circle", { cx: x + 44 + i * 44, cy: y + bh / 2, r: 12, class: cls, "stroke-width": 4 }, g),
    );
    const title = stickerText(g, name, x + 190, y + bh / 2 + 2, 56, { anchor: "start" });
    return { g, title };
  }

  // The loop of scenes 2 and 6. Left side: coil inside; top: pump; right side: coil in the kitchen;
  // bottom: valve gap. The route runs clockwise from the coil's inlet.
  const T = 410;
  const B = 770;
  function loopRoute() {
    return route(250, 700)
      .line(250, 680).line(330, 680).arc(330, 640, 40, 90, -90)
      .line(190, 600).arc(190, 560, 40, 90, 270)
      .line(250, 520).line(250, 480).arc(320, 480, 70, 180, 270)
      .line(1130, T).mark("compIn").line(1330, T).mark("compOut").line(1600, T)
      .arc(1600, 480, 70, -90, 0)
      .line(1670, 520).line(1590, 520).arc(1590, 560, 40, -90, -270)
      .line(1730, 600).arc(1730, 640, 40, -90, 90)
      .line(1670, 680).line(1670, 700).arc(1600, 700, 70, 0, 90)
      .line(1100, B).mark("gapStart").line(900, B).mark("gapEnd").line(320, B)
      .arc(320, 700, 70, 90, 180);
  }

  // Writes a caption in the bottom slot; the previous one (if any) goes out first.
  function captions(tl, parent, writeIn) {
    let previous = null;
    return function show(content, at) {
      if (previous) tl.to(previous, { opacity: 0, duration: 0.25, ease: "power3.in" }, at);
      const node = label(parent, content, 160, 930, "t56b");
      writeIn(tl, node, at + 0.2, 0.6);
      previous = node;
      return node;
    };
  }

  window.nevera = {
    setup, sticker, label, stickerText, pill, mascot, arrow, sparkle, carton,
    route, tube, tubeLayers, follow, ZONES, zone, loopRoute, captions, T, B,
  };
})();
