// Python printed on the paper: a tiny highlighter (keywords, constants, numbers), typing-in
// and a highlighter-pen bar behind the active lines. Exposes window.pythonCode.
(function () {
  const KEYWORDS = new Set(["def", "class", "if", "elif", "else", "return", "is", "not", "and", "or", "while", "for", "in"]);
  const CONSTANTS = new Set(["None", "True", "False"]);
  const TOKEN = /(\s+)|([A-Za-z_]\w*)|(\d+)|(.)/g;

  function tokenize(line) {
    const tokens = [];
    for (const [, space, word, number, other] of line.matchAll(TOKEN)) {
      if (space) tokens.push({ text: space, kind: "space" });
      else if (word) tokens.push({ text: word, kind: KEYWORDS.has(word) ? "kw" : CONSTANTS.has(word) ? "const" : "name" });
      else if (number) tokens.push({ text: number, kind: "num" });
      else tokens.push({ text: other, kind: "punct" });
    }
    return tokens;
  }

  // Renders `lines` at canvas position (x, y). Returns line elements and geometry helpers.
  function render(root, lines, { x, y, fontSize = 40, lineHeight = 60, className = "" }) {
    const block = document.createElement("div");
    block.className = `py ${className}`.trim();
    Object.assign(block.style, { left: `${x}px`, top: `${y}px`, fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` });
    const bars = document.createElement("div");
    bars.className = "py__bars";
    block.append(bars);
    const lineEls = lines.map((line) => {
      const el = document.createElement("div");
      el.className = "py__line";
      for (const token of tokenize(line)) {
        const span = document.createElement("span");
        span.className = `py__${token.kind}`;
        span.textContent = token.text;
        el.append(span);
      }
      if (line === "") el.textContent = " ";
      block.append(el);
      return el;
    });
    root.append(block);
    const probe = document.createElement("span");
    probe.textContent = "0".repeat(20);
    lineEls[0].append(probe);
    const charWidth = probe.offsetWidth / 20;
    probe.remove();

    // Canvas box of a column range on a line (for leader lines).
    function spanBox(lineIndex, fromColumn, toColumn) {
      return {
        x: x + fromColumn * charWidth,
        y: y + lineIndex * lineHeight,
        width: (toColumn - fromColumn) * charWidth,
        height: lineHeight,
      };
    }

    // A highlighter bar behind lines [first..last]; hidden until animated in.
    function bar(indexes) {
      const first = Math.min(...indexes);
      const last = Math.max(...indexes);
      const longest = Math.max(...indexes.map((i) => lines[i].length));
      const indent = Math.min(...indexes.map((i) => lines[i].length - lines[i].trimStart().length));
      const el = document.createElement("div");
      el.className = "py__bar";
      Object.assign(el.style, {
        left: `${indent * charWidth - 14}px`,
        top: `${first * lineHeight + 4}px`,
        width: `${(longest - indent) * charWidth + 28}px`,
        height: `${(last - first + 1) * lineHeight - 8}px`,
      });
      bars.append(el);
      gsap.set(el, { scaleX: 0, transformOrigin: "0% 50%" });
      return el;
    }

    return { block, lineEls, charWidth, spanBox, bar, lines };
  }

  // Lines type in left to right; each starts when the previous one is about 40% done.
  // `position` is a time in seconds on `tl`.
  function typeIn(tl, lineEls, position, { perChar = 0.012 } = {}) {
    let at = position;
    lineEls.forEach((el) => {
      const length = el.textContent.trimEnd().length;
      const duration = Math.min(0.2 + length * perChar, 0.6);
      tl.fromTo(el, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration, ease: "power2.out" }, at);
      at += length > 0 ? duration * 0.4 : 0;
    });
    return tl;
  }

  const swipeIn = (tl, bar, position) =>
    tl.to(bar, { scaleX: 1, transformOrigin: "0% 50%", duration: 0.45, ease: "expo.out" }, position);
  const swipeOut = (tl, bar, position) =>
    tl.to(bar, { scaleX: 0, transformOrigin: "100% 50%", duration: 0.25, ease: "power3.in" }, position);

  const CSS = `
    .py { position: absolute; font-family: var(--font-code); white-space: pre; color: var(--ink); letter-spacing: -0.03em; }
    .py__bars { position: absolute; inset: 0; }
    .py__bar { position: absolute; background: var(--accent-2); border-radius: 6px; }
    .py__line { position: relative; }
    .py__kw { color: var(--accent-3); font-weight: 700; }
    .py__const { color: var(--accent-3); }
    .py__num { color: var(--accent); font-weight: 700; }
  `;

  window.pythonCode = { tokenize, render, typeIn, swipeIn, swipeOut, CSS };
})();
