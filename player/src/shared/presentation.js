// Reads presentations/<slug>/presentation.json and resolves every scene reference.

import { SITE_ROOT } from "../paths.js";

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const LIBRARY_PREFIX = "library/";

export async function loadPresentation(slug) {
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`Invalid presentation "${slug}". Open the player with ?p=<slug>.`);
  }
  const baseUrl = new URL(`presentations/${slug}/`, SITE_ROOT);
  const response = await fetch(new URL("presentation.json", baseUrl));
  if (!response.ok) throw new Error(`presentations/${slug}/presentation.json not found`);
  return normalizePresentation(await response.json(), { slug, baseUrl, siteRoot: SITE_ROOT });
}

export function normalizePresentation(json, { slug, baseUrl, siteRoot }) {
  if (!Array.isArray(json?.scenes) || json.scenes.length === 0) {
    throw new Error(`${slug}: presentation.json needs a non-empty "scenes" array`);
  }
  return {
    slug,
    title: json.title ?? slug,
    lang: json.lang ?? "en",
    themeUrl: json.theme ? new URL(json.theme, baseUrl).href : null,
    entries: json.scenes.map((entry, index) => normalizeEntry(entry, index, { baseUrl, siteRoot })),
  };
}

function normalizeEntry(entry, index, { baseUrl, siteRoot }) {
  if (typeof entry?.scene !== "string" || entry.scene === "") {
    throw new Error(`scenes[${index}] needs a "scene" reference such as "library/title-card"`);
  }
  return {
    index,
    ref: entry.scene,
    url: resolveSceneUrl(entry.scene, { baseUrl, siteRoot }),
    title: entry.title ?? null,
    props: entry.props ?? {},
    notes: entry.notes ?? {},
    transition: normalizeTransition(entry.transition),
  };
}

export function resolveSceneUrl(ref, { baseUrl, siteRoot }) {
  const file = ref.endsWith(".html") ? ref : `${ref}.html`;
  return ref.startsWith(LIBRARY_PREFIX) ? new URL(file, siteRoot).href : new URL(file, baseUrl).href;
}

function normalizeTransition(transition) {
  if (!transition) return { type: "cut" };
  if (typeof transition === "string") return { type: transition };
  return { type: "cut", ...transition };
}
