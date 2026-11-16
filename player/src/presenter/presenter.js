// Presenter window (P): notes, preview of the next step and a timer, synced over BroadcastChannel.
// Keys here drive the player window too, so the presenter can stay on this screen.

import { openChannel } from "../shared/channel.js";
import { parseUrlState, formatUrlState, MODES } from "../shared/url-state.js";
import { actionForKey } from "../ui/keyboard.js";
import { createTimer } from "./timer.js";

const { slug } = parseUrlState(location.search);
const $ = (id) => document.getElementById(id);
const timer = createTimer((text) => ($("timer").textContent = text));
const preview = $("preview");
let latest = null;

const channel = openChannel(slug, (message) => {
  if (message.type === "state") render(message);
});

preview.src = `index.html${formatUrlState({ slug, scene: 0, step: 0, mode: MODES.preview })}`;
preview.addEventListener("load", () => latest && showPreview(latest.next));
channel.send({ type: "hello" });

function command(name) {
  channel.send({ type: "command", command: name });
  timer.startIfIdle();
}

$("advance").addEventListener("click", () => command("advance"));
$("back").addEventListener("click", () => command("back"));
$("timer-toggle").addEventListener("click", () => timer.toggle());
$("timer-reset").addEventListener("click", () => timer.reset());
timer.onChange((running) => ($("timer-toggle").textContent = running ? "Pause (T)" : "Start (T)"));

window.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
  const key = event.key.toLowerCase();
  if (key === "t") timer.toggle();
  else if (key === "r") timer.reset();
  else {
    const action = actionForKey(event.key);
    if (action !== "advance" && action !== "back") return;
    command(action);
  }
  event.preventDefault();
});

function render(state) {
  latest = state;
  document.title = `Presenter · ${state.title}`;
  $("where").textContent = `${state.title} — scene ${state.scene.number}/${state.scene.total}`;
  $("now-title").textContent = state.scene.title;
  $("now-step").textContent = `Step ${state.step.number}/${state.scene.steps.length}: ${state.step.label}`;
  $("now-note").textContent = state.step.note || "(no notes for this step)";
  $("steps").replaceChildren(
    ...state.scene.steps.map((label, index) => {
      const item = document.createElement("li");
      item.textContent = label;
      item.classList.toggle("is-current", index === state.step.number - 1);
      item.classList.toggle("is-done", index < state.step.number - 1);
      return item;
    }),
  );
  $("next-label").textContent = state.upcoming ? `${state.upcoming.title} · ${state.upcoming.label}` : "";
  $("next-note").textContent = state.upcoming?.note ?? "";
  showPreview(state.next);
}

function showPreview(position) {
  $("the-end").hidden = Boolean(position);
  preview.hidden = !position;
  const player = preview.contentWindow?.escenario;
  if (position && player?.goTo) player.goTo(position);
  else if (position) setTimeout(() => showPreview(latest.next), 200);
}
