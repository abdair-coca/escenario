// Scene-to-scene transitions. Each one should be caused by something on screen:
// zoom into an element, a reveal born from an element, a camera push, a wipe, or a cut.
// Camera moves use power2.inOut; exits accelerate (power3.in) and are shorter than arrivals.

import { CANVAS } from "../paths.js";
import { motionFromTween, settledMotion } from "../shared/motion.js";

const HANDOFF = 0.6;

const TRANSITIONS = { cut, push, zoom, reveal, wipe };

export const TRANSITION_TYPES = Object.keys(TRANSITIONS);

export function runTransition(options, { from, to, stage }) {
  const transition = TRANSITIONS[options.type];
  if (!transition) throw new Error(`Unknown transition "${options.type}". Use: ${TRANSITION_TYPES.join(", ")}`);
  if (!from) return cut({}, { from, to });
  return transition(options, { from, to, stage });
}

function cut(_options, { from }) {
  from?.destroy();
  return settledMotion();
}

const PUSH_VECTORS = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };

// Camera pan: the new scene sits next to the old one and the camera slides over.
function push({ direction = "left", duration = 1 }, { from, to }) {
  const [dx, dy] = PUSH_VECTORS[direction] ?? PUSH_VECTORS.left;
  const offset = { x: -dx * CANVAS.width, y: -dy * CANVAS.height };
  const tl = gsap.timeline({ onComplete: () => finishSwap(from, to) });
  tl.fromTo(to.host, { x: offset.x, y: offset.y }, { x: 0, y: 0, duration, ease: "power2.inOut" }, 0);
  tl.to(from.host, { x: -offset.x, y: -offset.y, duration, ease: "power2.inOut" }, 0);
  return motionFromTween(tl, HANDOFF);
}

// The camera dives into `target` (a selector inside the outgoing scene) and the new scene is behind it.
function zoom({ target, duration = 0.9 }, { from, to }) {
  const box = targetBox(from, target);
  const scale = Math.min(CANVAS.width / box.width, CANVAS.height / box.height) * 1.2;
  from.host.style.zIndex = "1";
  gsap.set(from.host, { transformOrigin: `${box.cx}px ${box.cy}px` });
  const tl = gsap.timeline({ onComplete: () => finishSwap(from, to) });
  tl.to(from.host, { scale, duration, ease: "power2.inOut" }, 0);
  tl.to(from.host, { opacity: 0, duration: duration * 0.3, ease: "power3.in" }, duration * 0.7);
  tl.fromTo(to.host, { scale: 0.94 }, { scale: 1, duration: duration * 0.5, ease: "expo.out" }, duration * 0.5);
  return motionFromTween(tl, HANDOFF);
}

// The new scene grows out of `target` in the outgoing scene, as a circle.
function reveal({ target, duration = 0.9 }, { from, to }) {
  const box = targetBox(from, target);
  const radius = Math.hypot(CANVAS.width, CANVAS.height);
  const start = Math.max(box.width, box.height) / 2;
  to.host.style.zIndex = "1";
  const tl = gsap.timeline({ onComplete: () => finishSwap(from, to) });
  tl.fromTo(
    to.host,
    { clipPath: `circle(${start}px at ${box.cx}px ${box.cy}px)` },
    { clipPath: `circle(${radius}px at ${box.cx}px ${box.cy}px)`, duration, ease: "power3.inOut" },
  );
  return motionFromTween(tl, HANDOFF);
}

// A solid panel crosses the stage: it covers the old scene fast and uncovers the new one slowly.
function wipe({ color = "var(--wipe, #111)", direction = "left", duration = 1 }, { from, to, stage }) {
  const [dx] = PUSH_VECTORS[direction] ?? PUSH_VECTORS.left;
  const panel = document.createElement("div");
  panel.className = "transition-panel";
  panel.style.background = color;
  stage.append(panel);
  const cover = duration * 0.36;
  to.host.style.visibility = "hidden";
  const tl = gsap.timeline({
    onComplete: () => {
      panel.remove();
      finishSwap(from, to);
    },
  });
  tl.fromTo(panel, { xPercent: -dx * 100 }, { xPercent: 0, duration: cover, ease: "power3.in" });
  tl.add(() => {
    to.host.style.visibility = "";
    from.host.style.visibility = "hidden";
  });
  tl.to(panel, { xPercent: dx * 100, duration: duration - cover, ease: "expo.out" });
  return motionFromTween(tl, HANDOFF);
}

function finishSwap(from, to) {
  from.destroy();
  gsap.set(to.host, { clearProps: "transform,clipPath,zIndex,visibility,opacity" });
}

function targetBox(instance, selector) {
  const element = selector ? instance.root.querySelector(selector) : null;
  if (!element) return { cx: CANVAS.width / 2, cy: CANVAS.height / 2, width: 160, height: 160 };
  const rootRect = instance.root.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  const scale = rootRect.width / CANVAS.width;
  const width = Math.max(rect.width / scale, 1);
  const height = Math.max(rect.height / scale, 1);
  return {
    cx: (rect.left - rootRect.left) / scale + width / 2,
    cy: (rect.top - rootRect.top) / scale + height / 2,
    width,
    height,
  };
}
