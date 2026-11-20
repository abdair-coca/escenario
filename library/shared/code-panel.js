// Code printed on the paper: a tiny highlighter, typing-in and a highlighter-pen bar behind the
// active lines. Languages: "python" (default), "js" (JavaScript/TypeScript), "xml" (EXL, HTML) and
// "sql" (T-SQL: keywords in UPPERCASE, `--` comments).
// Load with <script src="/library/shared/code-panel.js"></script>; exposes window.codePanel.
(function () {
  const WORDS = {
    python: {
      kw: ["def", "class", "if", "elif", "else", "return", "is", "not", "and", "or", "while", "for", "in", "from", "import", "pass"],
      const: ["None", "True", "False"],
    },
    js: {
      kw: ["export", "import", "from", "async", "await", "function", "const", "let", "return", "if", "else",
        "type", "interface", "new", "of", "for"],
      const: ["true", "false", "null", "undefined"],
    },
    sql: {
      kw: ["SELECT", "FROM", "WHERE", "JOIN", "LEFT", "CROSS", "APPLY", "ON", "AS", "WITH", "UNION", "GROUP", "BY",
        "IN", "AND", "NOT", "INSERT", "UPDATE", "DELETE", "SET", "INTO", "VALUES", "CREATE", "OR", "ALTER", "TRIGGER",
        "AFTER", "INSTEAD", "OF", "BEGIN", "END", "IF", "BREAK", "WHILE", "RETURN", "DECLARE", "CURSOR", "LOCAL",
        "FAST_FORWARD", "FOR", "OPEN", "FETCH", "NEXT", "CLOSE", "DEALLOCATE", "TOP", "UPDLOCK", "ROWLOCK"],
      const: ["NULL"],
    },
  };
  const WORD_TOKEN = /(\s+)|('[^']*'|"[^"]*"|`[^`]*`)|([A-Za-z_$][\w$]*)|(\d+)|(.)/g;
  // SQL: same groups as WORD_TOKEN; group 2 also takes `--` line comments, and @variables are names.
  const SQL_TOKEN = /(\s+)|('[^']*'|--[^\n]*)|(@{0,2}[A-Za-z_]\w*)|(\d+)|(.)/g;
  // EXL/HTML: tag names, attribute names, quoted values, plain text.
  const XML_TOKEN = /(\s+)|(<\/?[\w-]+|\/?>)|([\w-]+)(?==)|("[^"]*")|([^<>"\s=]+|=)/g;

  function tokenize(line, lang = "python") {
    const tokens = [];
    if (lang === "xml") {
      for (const [, space, tag, attr, value, other] of line.matchAll(XML_TOKEN)) {
        if (space) tokens.push({ text: space, kind: "space" });
        else if (tag) tokens.push({ text: tag, kind: "kw" });
        else if (attr) tokens.push({ text: attr, kind: "attr" });
        else if (value) tokens.push({ text: value, kind: "str" });
        else tokens.push({ text: other, kind: "name" });
      }
      return tokens;
    }
    const words = WORDS[lang];
    const pattern = lang === "sql" ? SQL_TOKEN : WORD_TOKEN;
    for (const [, space, string, word, number, other] of line.matchAll(pattern)) {
      if (space) tokens.push({ text: space, kind: "space" });
      else if (string) tokens.push({ text: string, kind: string.startsWith("--") ? "comment" : "str" });
      else if (word) tokens.push({ text: word, kind: words.kw.includes(word) ? "kw" : words.const.includes(word) ? "const" : "name" });
      else if (number) tokens.push({ text: number, kind: "num" });
      else tokens.push({ text: other, kind: "punct" });
    }
    return tokens;
  }

  // Renders `lines` at canvas position (x, y). Returns line elements and geometry helpers.
  // `numbers`: first line number to print in a gutter on the left (null for no gutter).
  function render(root, lines, { x, y, fontSize = 40, lineHeight = 60, className = "", lang = "python", numbers = null }) {
    const block = document.createElement("div");
    block.className = `code ${className}`.trim();
    Object.assign(block.style, { left: `${x}px`, top: `${y}px`, fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` });
    const bars = document.createElement("div");
    bars.className = "code__bars";
    block.append(bars);
    const gutter = numbers === null ? 0 : String(numbers + lines.length - 1).length + 1;
    const lineEls = lines.map((line, i) => {
      const el = document.createElement("div");
      el.className = "code__line";
      if (gutter) {
        const number = document.createElement("span");
        number.className = "code__number";
        number.textContent = String(numbers + i).padStart(gutter - 1) + " ";
        el.append(number);
      }
      for (const token of tokenize(line, lang)) {
        const span = document.createElement("span");
        span.className = `code__${token.kind}`;
        span.textContent = token.text;
        el.append(span);
      }
      if (line === "" && !gutter) el.textContent = " ";
      block.append(el);
      return el;
    });
    root.append(block);
    const probe = document.createElement("span");
    probe.textContent = "0".repeat(20);
    lineEls[0].append(probe);
    const charWidth = probe.offsetWidth / 20;
    probe.remove();

    // Canvas box of a column range on a line (for leader lines). Columns count from the code, not the gutter.
    function spanBox(lineIndex, fromColumn, toColumn) {
      return {
        x: x + (gutter + fromColumn) * charWidth,
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
      el.className = "code__bar";
      Object.assign(el.style, {
        left: `${(gutter + indent) * charWidth - 14}px`,
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
    .code { position: absolute; font-family: var(--font-code); white-space: pre; color: var(--ink); letter-spacing: -0.03em; }
    .code__bars { position: absolute; inset: 0; }
    .code__bar { position: absolute; background: var(--accent-2); border-radius: 6px; }
    .code__line { position: relative; }
    .code__number { color: var(--muted); }
    .code__kw { color: var(--accent-3); font-weight: 700; }
    .code__const { color: var(--accent-3); }
    .code__num { color: var(--accent); font-weight: 700; }
    .code__attr { color: var(--accent); }
    .code__str { color: var(--accent); }
    .code__comment { color: var(--muted); font-style: italic; }
  `;

  window.codePanel = { tokenize, render, typeIn, swipeIn, swipeOut, CSS };
})();
