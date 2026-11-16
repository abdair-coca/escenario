// Keyboard map. PageDown/PageUp are included because presentation clickers send them.

const ACTIONS = {
  ArrowRight: "advance",
  " ": "advance",
  PageDown: "advance",
  ArrowLeft: "back",
  PageUp: "back",
  p: "presenter",
  g: "record",
  i: "index",
  f: "fullscreen",
};

export function actionForKey(key) {
  return ACTIONS[key.length === 1 ? key.toLowerCase() : key] ?? null;
}

export function bindKeyboard(handlers, { sceneIndex }) {
  window.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (sceneIndex?.handleKey(event)) {
      event.preventDefault();
      return;
    }
    const action = actionForKey(event.key);
    if (!action || event.repeat) return;
    event.preventDefault();
    handlers[action]?.();
  });
}
