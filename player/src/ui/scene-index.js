// Scene index (I): jump to any scene with click, ↑/↓ + Enter, or its number.

export function createSceneIndex(element, { scenes, onPick }) {
  let selected = 0;
  const list = document.createElement("ol");
  list.className = "scene-index__list";
  const items = scenes.map((scene, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "scene-index__item";
    button.innerHTML = `<span class="scene-index__number"></span><span class="scene-index__title"></span><span class="scene-index__steps"></span>`;
    button.children[0].textContent = String(index + 1);
    button.children[1].textContent = scene.title;
    button.children[2].textContent = `${scene.steps.length} steps`;
    button.addEventListener("click", () => pick(index));
    item.append(button);
    return button;
  });
  list.append(...items.map((button) => button.parentElement));
  const heading = document.createElement("h2");
  heading.className = "scene-index__heading";
  heading.textContent = "Scenes";
  element.replaceChildren(heading, list);

  function pick(index) {
    close();
    onPick(index);
  }

  function highlight(index) {
    selected = (index + items.length) % items.length;
    items.forEach((button, i) => button.classList.toggle("is-selected", i === selected));
    items[selected].focus();
  }

  function open(currentScene) {
    element.hidden = false;
    highlight(currentScene);
  }

  function close() {
    element.hidden = true;
  }

  // Returns true when the key was used by the open index.
  function handleKey(event) {
    if (element.hidden) return false;
    const digit = Number.parseInt(event.key, 10);
    if (event.key === "Escape" || event.key === "i" || event.key === "I") close();
    else if (event.key === "ArrowDown") highlight(selected + 1);
    else if (event.key === "ArrowUp") highlight(selected - 1);
    else if (event.key === "Enter" || event.key === " ") pick(selected);
    else if (digit >= 1 && digit <= items.length) pick(digit - 1);
    return true;
  }

  return { open, close, handleKey, get isOpen() { return !element.hidden; } };
}
