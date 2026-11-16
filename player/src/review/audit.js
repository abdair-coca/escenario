// Automatic checks for the review: readable text size and the 90% safe area.
// Elements marked [data-decor] skip both checks; [data-bleed] may go to the canvas edge.

import { CANVAS } from "../paths.js";

const MIN_TEXT_PX = 40;
const TOLERANCE_PX = 0.5;
const SAFE_AREA = {
  left: CANVAS.width * 0.05,
  top: CANVAS.height * 0.05,
  right: CANVAS.width * 0.95,
  bottom: CANVAS.height * 0.95,
};
const SHAPES = new Set(["path", "circle", "rect", "line", "polyline", "polygon", "ellipse", "image", "use", "text"]);
const MEDIA = new Set(["IMG", "CANVAS", "VIDEO"]);

export function auditStage(stage) {
  const stageRect = stage.getBoundingClientRect();
  const scale = stageRect.width / CANVAS.width;
  const issues = [];
  for (const root of sceneRoots(stage)) {
    for (const element of root.querySelectorAll("*")) {
      if (element.closest("[data-decor]")) continue;
      const box = canvasBox(element.getBoundingClientRect(), stageRect, scale);
      if (!isVisible(element, root, box)) continue;
      if (hasOwnText(element)) {
        const size = effectiveFontSize(element, scale);
        if (size < MIN_TEXT_PX - TOLERANCE_PX) issues.push(issue("small-text", element, box, { size: round(size) }));
      }
      if (paints(element) && !element.closest("[data-bleed]") && !insideSafeArea(box)) {
        issues.push(issue("outside-safe-area", element, box));
      }
    }
  }
  return issues;
}

function sceneRoots(stage) {
  return [...stage.querySelectorAll(".scene-host")]
    .map((host) => host.shadowRoot?.querySelector(".root"))
    .filter(Boolean);
}

function canvasBox(rect, stageRect, scale) {
  return {
    left: (rect.left - stageRect.left) / scale,
    top: (rect.top - stageRect.top) / scale,
    right: (rect.right - stageRect.left) / scale,
    bottom: (rect.bottom - stageRect.top) / scale,
  };
}

function isVisible(element, root, box) {
  if (box.right - box.left < 1 && box.bottom - box.top < 1) return false;
  if (box.right <= 0 || box.bottom <= 0 || box.left >= CANVAS.width || box.top >= CANVAS.height) return false;
  let opacity = 1;
  for (let node = element; node && node !== root; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") return false;
    opacity *= Number.parseFloat(style.opacity);
  }
  return opacity > 0.05;
}

function hasOwnText(element) {
  return [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "");
}

// Font size as it lands on the 1920x1080 canvas, after every CSS/SVG transform.
function effectiveFontSize(element, scale) {
  const fontSize = Number.parseFloat(getComputedStyle(element).fontSize);
  const rect = element.getBoundingClientRect();
  let ratio = scale;
  if (element instanceof SVGGraphicsElement) {
    const bbox = element.getBBox();
    if (bbox.height > 0) ratio = rect.height / bbox.height;
  } else if (element.offsetHeight > 0) {
    ratio = rect.height / element.offsetHeight;
  }
  return (fontSize * ratio) / scale;
}

function paints(element) {
  if (hasOwnText(element) || MEDIA.has(element.tagName)) return true;
  if (element instanceof SVGElement) return SHAPES.has(element.tagName);
  const style = getComputedStyle(element);
  const hasBackground = style.backgroundColor !== "rgba(0, 0, 0, 0)" || style.backgroundImage !== "none";
  const hasBorder = Number.parseFloat(style.borderTopWidth) > 0 || Number.parseFloat(style.borderLeftWidth) > 0;
  return hasBackground || hasBorder;
}

function insideSafeArea(box) {
  return (
    box.left >= SAFE_AREA.left - TOLERANCE_PX &&
    box.top >= SAFE_AREA.top - TOLERANCE_PX &&
    box.right <= SAFE_AREA.right + TOLERANCE_PX &&
    box.bottom <= SAFE_AREA.bottom + TOLERANCE_PX
  );
}

function issue(kind, element, box, extra = {}) {
  const name = element.id ? `#${element.id}` : element.classList[0] ? `.${element.classList[0]}` : "";
  const text = element.textContent.trim().replace(/\s+/g, " ").slice(0, 40);
  return {
    kind,
    element: `${element.tagName.toLowerCase()}${name}`,
    text,
    box: Object.fromEntries(Object.entries(box).map(([key, value]) => [key, round(value)])),
    ...extra,
  };
}

function round(value) {
  return Math.round(value * 10) / 10;
}
