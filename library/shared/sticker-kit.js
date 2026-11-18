// Brand sticker parts shared by scenes (DESIGN.md recipes): hard-shadow shapes, sticker text, pills,
// the mascot, arrows and decorations, in canvas pixels (1920x1080).
// Load after scene-kit.js: <script src="/library/shared/sticker-kit.js"></script>; exposes window.stickerKit.
(function () {
  const { svg, text, addStyles } = window.sceneKit;

  const CSS = `
    .shade { fill: var(--ink); stroke: var(--ink); stroke-width: 6; stroke-linejoin: round; stroke-linecap: round; }
    .panel { fill: var(--paper); stroke: var(--ink); stroke-width: 6; stroke-linejoin: round; }
    .panel-blue { fill: var(--accent-2); stroke: var(--ink); stroke-width: 6; stroke-linejoin: round; }
    .panel-navy { fill: var(--accent-3); stroke: var(--ink); stroke-width: 6; stroke-linejoin: round; }
    .face-blue { fill: var(--accent); stroke: var(--ink); stroke-width: 4; stroke-linejoin: round; }
    .face-soft { fill: var(--accent-2); stroke: var(--ink); stroke-width: 4; stroke-linejoin: round; }
    .face-paper { fill: var(--paper); stroke: var(--ink); stroke-width: 4; stroke-linejoin: round; }
    .face-navy { fill: var(--accent-3); stroke: var(--ink); stroke-width: 4; stroke-linejoin: round; }
    .face-muted { fill: var(--muted); stroke: var(--ink); stroke-width: 4; stroke-linejoin: round; }
    .face-ok { fill: var(--ok); stroke: var(--ink); stroke-width: 4; stroke-linejoin: round; }
    .face-block { fill: var(--block); stroke: var(--ink); stroke-width: 4; stroke-linejoin: round; }
    .band { fill: var(--accent); }
    .band-line { fill: none; stroke: var(--ink); stroke-width: 6; stroke-linecap: round; }
    .outline { fill: none; stroke: var(--ink); stroke-width: 6; stroke-linejoin: round; }
    .ink-line { fill: none; stroke: var(--ink); stroke-linecap: round; stroke-linejoin: round; }
    .blue-line { fill: none; stroke: var(--accent); stroke-linecap: round; stroke-linejoin: round; }
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
    .sticker--blue { fill: var(--accent); }
    .t56b { font-size: 56px; font-weight: 700; }
    .t56m { font-size: 56px; font-weight: 500; }
  `;

  // Adds the scene-kit type styles and the sticker styles to a scene root.
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

  // Pill / badge: rounded rectangle, ink outline, hard shadow, sticker text. `face` is the part that presses;
  // `rect` is the coloured shape, so a scene can recolour it.
  function pill(parent, content, cx, cy, w, h, { rot = 0, tone = "blue", size = 40 } = {}) {
    const outer = svg("g", {}, parent);
    const tilted = svg("g", { transform: `rotate(${rot} ${cx} ${cy})` }, outer);
    const box = { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: h / 2 };
    svg("rect", { ...box, class: "shade", transform: "translate(6 6)" }, tilted);
    const face = svg("g", {}, tilted);
    const rect = svg("rect", { ...box, class: `face-${tone}` }, face);
    stickerText(face, content, cx, cy + 1, size, { tone: "face" });
    return { g: outer, face, rect };
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

  // A fat arrow from p to q: ink outline under a colour line (`tone`: blue | ink), with a head.
  function arrow(parent, p, q, { tone = "blue", w = 16 } = {}) {
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
    svg("polygon", { points: head, class: tone === "ink" ? "shade" : `${tone}-head` }, g);
    return g;
  }

  // Four-point sparkle in --accent-2 (decoration).
  function sparkle(parent, cx, cy, r) {
    const g = svg("g", { "data-decor": "" }, parent);
    const k = 0.3 * r;
    const points = `${cx},${cy - r} ${cx + k},${cy - k} ${cx + r},${cy} ${cx + k},${cy + k} ${cx},${cy + r} ${cx - k},${cy + k} ${cx - r},${cy} ${cx - k},${cy - k}`;
    svg("polygon", { points, class: "shade", transform: "translate(6 6)" }, g);
    svg("polygon", { points, class: "face-soft" }, g);
    return g;
  }

  // Cartoon cloud: white circles merged into one shape with an ink outline (decoration). s = 1 is ~260 px wide.
  function cloud(parent, cx, cy, s = 1) {
    const g = svg("g", { "data-decor": "" }, parent);
    const bumps = [[-80, 10, 50], [-30, -24, 62], [40, -14, 56], [88, 14, 42]].map(([x, y, r]) => [cx + x * s, cy + y * s, r * s]);
    const base = { x: cx - 120 * s, y: cy, width: 240 * s, height: 56 * s, rx: 28 * s };
    const layer = (cls, dx, extra) => {
      const part = svg("g", { transform: `translate(${dx} ${dx})` }, g);
      for (const [x, y, r] of bumps) svg("circle", { cx: x, cy: y, r: r + extra, class: cls }, part);
      svg("rect", { x: base.x - extra, y: base.y - extra, width: base.width + 2 * extra, height: base.height + 2 * extra, rx: base.rx + extra, class: cls }, part);
    };
    layer("shade", 8, 5); // shadow
    layer("shade", 0, 5); // outline: an ink copy 5 px larger
    for (const [x, y, r] of bumps) svg("circle", { cx: x, cy: y, r, fill: "var(--paper)" }, g);
    svg("rect", { ...base, fill: "var(--paper)" }, g);
    return g;
  }

  window.stickerKit = { CSS, setup, sticker, label, stickerText, pill, mascot, arrow, sparkle, cloud };
})();
