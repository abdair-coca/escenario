// Binary search tree model and drawing, shared by every tree scene so the tree lands on the
// same pixels across cuts. Load after scene-kit.js; exposes window.bstTree.
(function () {
  const { svg, text } = window.sceneKit;

  // "Side" layout: the tree on the left, room for code on the right.
  const LAYOUT = Object.freeze({ cx: 425, top: 380, width: 680, levelGap: 170, radius: 52 });
  // Transform that turns the side layout into the big centred tree.
  const CENTERED = Object.freeze({ x: 365, y: -232, scale: 1.4 });

  function build(values) {
    const nodes = new Map();
    let root = null;
    for (const value of values) {
      if (nodes.has(value)) continue;
      const spot = findSpot(nodes, root, value);
      const node = { value, ...spot, left: null, right: null };
      nodes.set(value, node);
      if (!spot.parent) root = node;
      else nodes.get(spot.parent)[spot.side] = node;
    }
    return { nodes, root };
  }

  // Where `value` would sit: walks from the root, smaller left, bigger right.
  function findSpot(nodes, root, value) {
    if (!root) return { parent: null, side: null, depth: 0, frac: 0.5 };
    let current = root;
    for (;;) {
      const side = value < current.value ? "left" : "right";
      const next = current[side];
      if (!next) {
        const offset = 0.25 / 2 ** current.depth;
        const frac = current.frac + (side === "left" ? -offset : offset);
        return { parent: current.value, side, depth: current.depth + 1, frac };
      }
      current = next;
    }
  }

  // The nodes compared on the way to `target`, and how the walk ends.
  function walk(values, target) {
    const tree = build(values);
    const compared = [];
    let current = tree.root;
    while (current && current.value !== target) {
      compared.push(current.value);
      current = target < current.value ? current.left : current.right;
    }
    return { compared, end: current ? "found" : "empty", spot: findSpot(tree.nodes, tree.root, target) };
  }

  function position(spot, layout = LAYOUT) {
    return { x: layout.cx + (spot.frac - 0.5) * layout.width, y: layout.top + spot.depth * layout.levelGap };
  }

  // Draws edges under nodes. Returns handles keyed by value; edges are keyed by the child value.
  function draw(group, values, { slot = null, layout = LAYOUT } = {}) {
    const tree = build(values);
    const edgeLayer = svg("g", { class: "edges" }, group);
    const nodeLayer = svg("g", { class: "nodes" }, group);
    const nodes = new Map();
    const edges = new Map();
    for (const node of tree.nodes.values()) {
      const at = position(node, layout);
      if (node.parent !== null) {
        const from = position(tree.nodes.get(node.parent), layout);
        edges.set(node.value, edge(edgeLayer, from, at));
      }
      nodes.set(node.value, { ...drawNode(nodeLayer, node.value, at, layout.radius), ...at, model: node });
    }
    let slotHandle = null;
    if (slot !== null) {
      const spot = findSpot(tree.nodes, tree.root, slot);
      const at = position(spot, layout);
      const from = position(tree.nodes.get(spot.parent), layout);
      slotHandle = {
        ...at,
        edge: edge(edgeLayer, from, at, "edge edge--slot"),
        circle: svg("circle", { class: "slot", cx: at.x, cy: at.y, r: layout.radius }, nodeLayer),
      };
    }
    return { tree, nodes, edges, slot: slotHandle, edgeLayer, nodeLayer };
  }

  function edge(layer, from, to, className = "edge") {
    return svg("line", { class: className, x1: from.x, y1: from.y, x2: to.x, y2: to.y }, layer);
  }

  function drawNode(layer, value, at, radius) {
    const g = svg("g", { class: `node node-${value}`, "data-value": value }, layer);
    gsap.set(g, { x: at.x, y: at.y });
    const circle = svg("circle", { class: "node__circle", r: radius }, g);
    const label = text(g, String(value), { class: "node__label t56 num mid", y: 2 });
    return { g, circle, label };
  }

  const toCentered = ({ x, y }) => ({ x: x * CENTERED.scale + CENTERED.x, y: y * CENTERED.scale + CENTERED.y });

  // Under the centred tree: the focus node and its children written in order ("20 < 30 < 40"),
  // each number on a drop line from its node, and a ring on the focus node.
  function drawOrder(layer, tree, focus, { y = 960 } = {}) {
    const node = tree.nodes.get(focus);
    const ring = svg("circle", { class: "order-ring", r: LAYOUT.radius }, node.g);
    const kids = [node.model.left, node.model, node.model.right].filter(Boolean);
    const radius = LAYOUT.radius * CENTERED.scale;
    const items = kids.map((kid, i) => {
      const at = toCentered(tree.nodes.get(kid.value));
      const line = svg("line", { class: "order-drop", x1: at.x, y1: at.y + radius + 10, x2: at.x, y2: y - 52 }, layer);
      const tone = kid.value === focus ? "order-focus" : "order";
      const number = text(layer, String(kid.value), { class: `t56 mid num ${tone}`, x: at.x, y });
      const next = kids[i + 1] && toCentered(tree.nodes.get(kids[i + 1].value));
      const sign = next ? text(layer, "<", { class: "t56 mid order", x: (at.x + next.x) / 2, y }) : null;
      return { line, number, sign };
    });
    const parts = [ring, ...items.flatMap((item) => [item.line, item.number, item.sign].filter(Boolean))];
    return { ring, items, parts };
  }

  // Subtree values under `value` (including it).
  function subtree(tree, value) {
    const out = [];
    const visit = (node) => {
      if (!node) return;
      out.push(node.value);
      visit(node.left);
      visit(node.right);
    };
    visit(tree.nodes.get(value));
    return out;
  }

  const CSS = `
    .edge { stroke: var(--ink); stroke-width: 5; stroke-linecap: round; }
    .edge--slot { stroke: var(--muted); stroke-dasharray: 2 14; }
    .node__circle { fill: var(--paper); stroke: var(--ink); stroke-width: 5; }
    .slot { fill: none; stroke: var(--muted); stroke-width: 4; stroke-dasharray: 14 12; }
    .order-ring { fill: none; stroke: var(--accent); stroke-width: 9; }
    .order-drop { stroke: var(--muted); stroke-width: 4; stroke-linecap: round; }
    .order { fill: var(--ink); }
    .order-focus { fill: var(--accent); }
  `;

  window.bstTree = { LAYOUT, CENTERED, toCentered, build, walk, position, draw, drawOrder, subtree, findSpot, CSS };
})();
