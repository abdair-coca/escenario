// Loads a scene file: an HTML document with one <template> and scripts that call registerScene.
// Scenes load one at a time so each registerScene call is attributed to the right file.

import { validateDefinition } from "./definition.js";

const REGISTRATION_TIMEOUT_MS = 5000;
const definitions = new Map();
const externalScripts = new Map();
let queue = Promise.resolve();
let pending = null;

window.registerScene = function registerScene(definition) {
  if (!pending) throw new Error("registerScene can only run while the player loads a scene file");
  const errors = validateDefinition(definition);
  if (errors.length) pending.reject(new Error(`${pending.label}: ${errors.join("; ")}`));
  else pending.resolve(definition);
};

export function loadSceneFile(url) {
  if (!definitions.has(url)) {
    const loaded = queue.then(() => fetchAndRun(url));
    queue = loaded.catch(() => {});
    definitions.set(url, loaded);
  }
  return definitions.get(url);
}

async function fetchAndRun(url) {
  const label = new URL(url).pathname;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Scene file not found: ${label} (${response.status})`);
  const doc = new DOMParser().parseFromString(await response.text(), "text/html");
  const template = doc.querySelector("template");
  if (!template) throw new Error(`${label}: a scene needs a <template> with its markup and styles`);

  const registration = waitForRegistration(label);
  try {
    for (const script of doc.querySelectorAll("script")) await runScript(script, url);
    const definition = await registration.promise;
    return { definition, template: document.importNode(template.content, true) };
  } finally {
    registration.dispose();
  }
}

function waitForRegistration(label) {
  let timer;
  const onError = (event) => pending?.reject(new Error(`${label}: ${event.message}`));
  const promise = new Promise((resolve, reject) => {
    pending = { label, resolve, reject };
    timer = setTimeout(
      () => reject(new Error(`${label}: the scene never called registerScene`)),
      REGISTRATION_TIMEOUT_MS,
    );
  });
  window.addEventListener("error", onError);
  return {
    promise,
    dispose() {
      clearTimeout(timer);
      window.removeEventListener("error", onError);
      pending = null;
    },
  };
}

function runScript(source, sceneUrl) {
  const src = source.getAttribute("src");
  if (src) return loadExternalScript(new URL(src, sceneUrl).href);
  const script = document.createElement("script");
  if (source.type) script.type = source.type;
  script.textContent = source.textContent;
  document.head.append(script);
  script.remove();
  return Promise.resolve();
}

// Libraries (d3, KaTeX, gsap plugins…) load once even if many scenes ask for them.
function loadExternalScript(href) {
  if (!externalScripts.has(href)) {
    const loaded = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = href;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Could not load script ${new URL(href).pathname}`));
      document.head.append(script);
    });
    externalScripts.set(href, loaded);
  }
  return externalScripts.get(href);
}
