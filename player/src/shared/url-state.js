// The URL keeps presentation, scene and step so a reload resumes in the same place.
// Scene and step are 1-based in the URL (human readable) and 0-based in code.

export const MODES = Object.freeze({ live: "live", record: "record", preview: "preview" });

export function parseUrlState(search) {
  const params = new URLSearchParams(search);
  const mode = Object.values(MODES).includes(params.get("mode")) ? params.get("mode") : MODES.live;
  return {
    slug: params.get("p") ?? "",
    scene: toIndex(params.get("s")),
    step: toIndex(params.get("k")),
    mode,
  };
}

export function formatUrlState({ slug, scene, step, mode }) {
  const params = new URLSearchParams({ p: slug, s: String(scene + 1), k: String(step + 1) });
  if (mode && mode !== MODES.live) params.set("mode", mode);
  return `?${params}`;
}

function toIndex(value) {
  const number = Number.parseInt(value ?? "", 10);
  return Number.isFinite(number) && number > 0 ? number - 1 : 0;
}
