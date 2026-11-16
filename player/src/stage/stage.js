// A fixed 1920x1080 canvas scaled to fit the window; the leftover space shows black bands.

import { CANVAS } from "../paths.js";

export function createStage(element) {
  const fit = () => {
    const scale = Math.min(window.innerWidth / CANVAS.width, window.innerHeight / CANVAS.height);
    element.style.transform = `translate(-50%, -50%) scale(${scale})`;
  };
  fit();
  window.addEventListener("resize", fit);
  return { element };
}
