// A scene instance: the template mounted inside a shadow root plus its paused timeline.
// Everything visible depends on the timeline time, so any step can be shown by seeking.

import { readStepTimes } from "./definition.js";
import { CANVAS } from "../paths.js";
import { motionFromTween, settledMotion } from "../shared/motion.js";

const BASE_CSS = `
  :host { position: absolute; inset: 0; overflow: hidden; }
  *, *::before, *::after { box-sizing: border-box; }
  .root {
    position: absolute; left: 0; top: 0;
    width: ${CANVAS.width}px; height: ${CANVAS.height}px;
    font-family: var(--font-body, system-ui, sans-serif);
    color: var(--ink, #111);
  }
`;

export async function createSceneInstance({ definition, template }, { props, steps }, parent) {
  const host = document.createElement("div");
  host.className = "scene-host";
  host.dataset.scene = definition.id;
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = BASE_CSS;
  const root = document.createElement("div");
  root.className = "root";
  root.append(template.cloneNode(true));
  shadow.append(style, root);
  parent.append(host);

  try {
    const { timeline } = await runBuild(definition, root, props);
    return wrapTimeline({ definition, steps, host, root, timeline });
  } catch (error) {
    host.remove();
    throw new Error(`${definition.id}: ${error.message}`, { cause: error });
  }
}

// gsap timelines are thenables (they resolve when they finish), so a paused timeline must never
// be awaited. build() returns the timeline directly, or a Promise of { timeline } when it needs
// to load something first.
async function runBuild(definition, root, props) {
  const result = definition.build(root, structuredClone(props), window.gsap);
  if (result instanceof Promise) return { timeline: (await result)?.timeline };
  return { timeline: result };
}

function wrapTimeline({ definition, steps, host, root, timeline }) {
  if (!timeline || typeof timeline.tweenFromTo !== "function") {
    throw new Error("build() must return a gsap timeline");
  }
  timeline.pause();
  const { times, errors } = readStepTimes(timeline.labels, steps);
  if (errors.length) throw new Error(errors.join("; "));
  timeline.seek(0, true);

  return {
    id: definition.id,
    steps,
    host,
    root,
    showStart() {
      timeline.seek(0, true);
    },
    rest(step) {
      timeline.seek(times[step], true);
    },
    // Plays the animation that leads into `step`, from the rest state of the step before it.
    playStep(step) {
      const from = step === 0 ? 0 : times[step - 1];
      const to = times[step];
      timeline.seek(from, true);
      if (to <= from) {
        timeline.seek(to, true);
        return settledMotion();
      }
      return motionFromTween(timeline.tweenFromTo(from, to, { ease: "none" }));
    },
    destroy() {
      timeline.kill();
      definition.destroy?.(root);
      host.remove();
    },
  };
}
