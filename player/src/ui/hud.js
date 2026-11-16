// Small status line (scene, step, shortcuts). Fades out after a moment; hidden while recording.

const VISIBLE_MS = 2500;

export function createHud(element) {
  let timer;
  return {
    show({ sceneNumber, sceneTotal, stepNumber, stepTotal, title }) {
      element.replaceChildren(
        span("hud__where", `scene ${sceneNumber}/${sceneTotal} · step ${stepNumber}/${stepTotal}`),
        span("hud__title", title),
        span("hud__keys", "→ next · ← back · I index · P presenter · G record"),
      );
      element.classList.add("is-visible");
      clearTimeout(timer);
      timer = setTimeout(() => element.classList.remove("is-visible"), VISIBLE_MS);
    },
  };
}

function span(className, text) {
  const node = document.createElement("span");
  node.className = className;
  node.textContent = text;
  return node;
}
