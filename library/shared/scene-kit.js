// Small helpers shared by library scenes: SVG creation and common type sizes.
// Load with <script src="/library/shared/scene-kit.js"></script>; exposes window.sceneKit.
(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";

  function svg(tag, attrs = {}, parent = null) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attrs)) {
      if (value !== null && value !== undefined) node.setAttribute(name, value);
    }
    parent?.append(node);
    return node;
  }

  function text(parent, content, attrs = {}) {
    const node = svg("text", attrs, parent);
    node.textContent = content;
    return node;
  }

  // Canvas-wide <svg> in canvas pixels, so scene coordinates are 1920x1080 pixels.
  function canvas(root) {
    return svg("svg", { class: "canvas", viewBox: "0 0 1920 1080", width: 1920, height: 1080 }, root);
  }

  // Shared type styles; each scene adds its own on top.
  const CSS = `
    .canvas { position: absolute; inset: 0; overflow: visible; }
    /* :where keeps this default weaker than any scene class that colours text. */
    :where(.canvas text) { font-family: var(--font-display); fill: var(--ink); }
    .t40 { font-size: 40px; font-weight: 500; }
    .t56 { font-size: 56px; font-weight: 700; }
    .t72 { font-size: 72px; font-weight: 700; }
    .t96 { font-size: 96px; font-weight: 700; letter-spacing: -0.01em; }
    .t200 { font-size: 200px; font-weight: 700; letter-spacing: -0.02em; }
    .num { font-variant-numeric: tabular-nums; }
    .mid { text-anchor: middle; dominant-baseline: central; }
    .block { position: absolute; font-family: var(--font-display); color: var(--ink); line-height: 1.1; }
  `;

  function addStyles(root, css = CSS) {
    const style = document.createElement("style");
    style.textContent = css;
    root.prepend(style);
  }

  // Reveals an element left to right, like ink being written. Works on HTML and SVG.
  function writeIn(tl, element, position, duration = 0.6) {
    return tl.fromTo(
      element,
      { clipPath: "inset(-20% 100% -20% 0%)" },
      { clipPath: "inset(-20% 0% -20% 0%)", duration, ease: "power2.out" },
      position,
    );
  }

  // HTML text block at canvas position; `className` picks the type style.
  function block(root, content, { x, y, className = "", width = null }) {
    const el = document.createElement("div");
    el.className = `block ${className}`.trim();
    el.textContent = content;
    Object.assign(el.style, { left: `${x}px`, top: `${y}px` });
    if (width) el.style.width = `${width}px`;
    root.append(el);
    return el;
  }

  if (window.gsap && window.DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);

  window.sceneKit = { svg, text, canvas, addStyles, writeIn, block };
})();
