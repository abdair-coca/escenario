// Player entry point: loads a presentation, mounts the stage and wires keys, URL and presenter.

import { parseUrlState, formatUrlState, MODES } from "./shared/url-state.js";
import { loadPresentation } from "./shared/presentation.js";
import { openChannel } from "./shared/channel.js";
import { loadSceneFile } from "./scenes/loader.js";
import { mergeProps, resolveSteps } from "./scenes/definition.js";
import { createStage } from "./stage/stage.js";
import { createController } from "./navigation/controller.js";
import { presenterSnapshot } from "./shared/snapshot.js";
import { createHud } from "./ui/hud.js";
import { createSceneIndex } from "./ui/scene-index.js";
import { bindKeyboard } from "./ui/keyboard.js";
import { createErrorPanel } from "./ui/error-panel.js";

const errors = createErrorPanel(document.getElementById("errors"));
const urlState = parseUrlState(location.search);
let mode = urlState.mode;

const api = { ready: false, errors: errors.messages };
window.escenario = api;

boot().catch((error) => errors.report(error));

async function boot() {
  applyMode();
  const presentation = await loadPresentation(urlState.slug);
  document.title = presentation.title;
  document.documentElement.lang = presentation.lang;
  if (presentation.themeUrl) await linkStylesheet(presentation.themeUrl);
  const scenes = await loadScenes(presentation.entries);
  await document.fonts.ready;

  const stage = createStage(document.getElementById("stage"));
  const hud = createHud(document.getElementById("hud"));
  const counts = scenes.map((scene) => scene.steps.length);
  const channel = mode === MODES.preview ? null : openChannel(presentation.slug, onPresenterMessage);

  const controller = createController({
    stage,
    scenes,
    onError: (error) => errors.report(error),
    onChange(position) {
      if (mode !== MODES.preview) history.replaceState(null, "", formatUrlState({ slug: presentation.slug, mode, ...position }));
      hud.show(hudInfo(position));
      channel?.send(snapshot(position));
    },
  });

  function hudInfo({ scene, step }) {
    return {
      sceneNumber: scene + 1,
      sceneTotal: scenes.length,
      stepNumber: step + 1,
      stepTotal: counts[scene],
      title: scenes[scene].title,
    };
  }

  const snapshot = (position) => presenterSnapshot(presentation.title, scenes, position);

  function onPresenterMessage(message) {
    if (message.type === "hello" && controller.position) channel.send(snapshot(controller.position));
    if (message.type === "command" && message.command === "advance") controller.advance();
    if (message.type === "command" && message.command === "back") controller.back();
  }

  const sceneIndex = createSceneIndex(document.getElementById("scene-index"), {
    scenes,
    onPick: (scene) => controller.goTo({ scene, step: 0 }),
  });

  if (mode !== MODES.preview) {
    bindKeyboard(
      {
        advance: controller.advance,
        back: controller.back,
        index: () => sceneIndex.open(controller.position.scene),
        presenter: () => openPresenter(presentation.slug),
        record: toggleRecording,
        fullscreen: toggleFullscreen,
      },
      { sceneIndex },
    );
  }

  Object.assign(api, {
    goTo: (position) => controller.goTo(position),
    advance: () => controller.advance(),
    back: () => controller.back(),
    whenIdle: () => controller.whenIdle(),
    outline: () => scenes.map((scene) => ({ id: scene.id, title: scene.title, steps: scene.steps })),
    position: () => controller.position,
    busy: () => controller.busy,
    audit: async () => (await import("./review/audit.js")).auditStage(stage.element),
  });

  await controller.goTo({ scene: urlState.scene, step: urlState.step });
  api.ready = true;
}

async function loadScenes(entries) {
  const loaded = await Promise.all(entries.map((entry) => loadSceneFile(entry.url)));
  return entries.map((entry, index) => {
    const { definition } = loaded[index];
    const { props, unknownKeys } = mergeProps(definition.props, entry.props);
    if (unknownKeys.length) {
      errors.report(`scenes[${index}] (${definition.id}): unknown props ${unknownKeys.join(", ")}`);
    }
    return {
      ...entry,
      id: definition.id,
      title: entry.title ?? definition.id,
      steps: resolveSteps(definition, props),
      props,
      loaded: loaded[index],
    };
  });
}

function linkStylesheet(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = resolve;
    link.onerror = () => reject(new Error(`Theme not found: ${new URL(href).pathname}`));
    document.head.append(link);
  });
}

function applyMode() {
  document.body.dataset.mode = mode;
}

function toggleRecording() {
  mode = mode === MODES.record ? MODES.live : MODES.record;
  applyMode();
  const url = new URL(location.href);
  if (mode === MODES.record) url.searchParams.set("mode", mode);
  else url.searchParams.delete("mode");
  history.replaceState(null, "", url);
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen();
}

function openPresenter(slug) {
  const url = new URL("presenter.html", location.href);
  url.search = new URLSearchParams({ p: slug }).toString();
  window.open(url, `escenario-presenter-${slug}`, "width=1280,height=800");
}
