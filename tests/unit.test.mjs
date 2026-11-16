import { test } from "node:test";
import assert from "node:assert/strict";
import { nextPosition, previousPosition, clampPosition } from "../player/src/navigation/cursor.js";
import { parseUrlState, formatUrlState } from "../player/src/shared/url-state.js";
import { validateDefinition, mergeProps, readStepTimes, resolveSteps } from "../player/src/scenes/definition.js";
import { normalizePresentation, resolveSceneUrl } from "../player/src/shared/presentation.js";
import { presenterSnapshot } from "../player/src/shared/snapshot.js";
import { formatElapsed } from "../player/src/presenter/timer.js";

const counts = [2, 3];

test("next position walks steps, then scenes, then stops", () => {
  assert.deepEqual(nextPosition({ scene: 0, step: 0 }, counts), { scene: 0, step: 1 });
  assert.deepEqual(nextPosition({ scene: 0, step: 1 }, counts), { scene: 1, step: 0 });
  assert.equal(nextPosition({ scene: 1, step: 2 }, counts), null);
});

test("previous position lands on the last step of the previous scene", () => {
  assert.deepEqual(previousPosition({ scene: 1, step: 0 }, counts), { scene: 0, step: 1 });
  assert.equal(previousPosition({ scene: 0, step: 0 }, counts), null);
});

test("positions from the URL are clamped to what exists", () => {
  assert.deepEqual(clampPosition({ scene: 9, step: 9 }, counts), { scene: 1, step: 2 });
  assert.deepEqual(clampPosition({ scene: -1, step: -1 }, counts), { scene: 0, step: 0 });
});

test("URL state is 1-based and round-trips", () => {
  const state = parseUrlState("?p=binary-trees&s=3&k=2&mode=record");
  assert.deepEqual(state, { slug: "binary-trees", scene: 2, step: 1, mode: "record" });
  assert.deepEqual(parseUrlState(formatUrlState(state)), state);
  assert.equal(formatUrlState({ slug: "x", scene: 0, step: 0, mode: "live" }), "?p=x&s=1&k=1");
  assert.deepEqual(parseUrlState("?p=x&s=abc&mode=weird"), { slug: "x", scene: 0, step: 0, mode: "live" });
});

test("scene definitions are validated", () => {
  const valid = { id: "title-card", props: {}, steps: ["in"], build() {} };
  assert.deepEqual(validateDefinition(valid), []);
  assert.ok(validateDefinition({ ...valid, id: "Title Card" }).length);
  assert.ok(validateDefinition({ ...valid, steps: [] }).length);
  assert.ok(validateDefinition({ ...valid, steps: ["a", "a"] }).length);
  assert.ok(validateDefinition({ ...valid, build: null }).length);
});

test("steps can be a function of the props", () => {
  const definition = { id: "walk", steps: (props) => props.path.map((v) => `at-${v}`), build() {} };
  assert.deepEqual(validateDefinition(definition), []);
  assert.deepEqual(resolveSteps(definition, { path: [50, 70] }), ["at-50", "at-70"]);
  assert.throws(() => resolveSteps(definition, { path: [] }), /at least one step/);
});

test("props merge over defaults and unknown keys are reported", () => {
  const { props, unknownKeys } = mergeProps({ title: "a", size: 1 }, { title: "b", colour: "red" });
  assert.deepEqual(props, { title: "b", size: 1, colour: "red" });
  assert.deepEqual(unknownKeys, ["colour"]);
});

test("timeline labels become step times in order", () => {
  assert.deepEqual(readStepTimes({ a: 0.5, b: 1.5 }, ["a", "b"]), { times: [0.5, 1.5], errors: [] });
  assert.equal(readStepTimes({ a: 0.5 }, ["a", "b"]).errors.length, 1);
  assert.equal(readStepTimes({ a: 2, b: 1 }, ["a", "b"]).errors.length, 1);
});

test("scene references resolve to the library or to the presentation folder", () => {
  const where = { baseUrl: "http://x/presentations/demo/", siteRoot: "http://x/" };
  assert.equal(resolveSceneUrl("library/title-card", where), "http://x/library/title-card.html");
  assert.equal(resolveSceneUrl("scenes/intro", where), "http://x/presentations/demo/scenes/intro.html");
  const presentation = normalizePresentation(
    { scenes: [{ scene: "library/a" }, { scene: "scenes/b", transition: "wipe" }] },
    { slug: "demo", ...where },
  );
  assert.deepEqual(presentation.entries[0].transition, { type: "cut" });
  assert.deepEqual(presentation.entries[1].transition, { type: "wipe" });
  assert.throws(() => normalizePresentation({ scenes: [] }, { slug: "demo", ...where }));
});

test("presenter snapshot carries notes of the current and next step", () => {
  const scenes = [
    { title: "One", steps: ["a", "b"], notes: { a: "say A", b: "say B" } },
    { title: "Two", steps: ["c"], notes: {} },
  ];
  const now = presenterSnapshot("Deck", scenes, { scene: 0, step: 1 });
  assert.equal(now.step.note, "say B");
  assert.deepEqual(now.next, { scene: 1, step: 0 });
  assert.equal(now.upcoming.title, "Two");
  assert.equal(presenterSnapshot("Deck", scenes, { scene: 1, step: 0 }).upcoming, null);
});

test("elapsed time formats as mm:ss and h:mm:ss", () => {
  assert.equal(formatElapsed(0), "00:00");
  assert.equal(formatElapsed(65_400), "01:05");
  assert.equal(formatElapsed(3_725_000), "1:02:05");
});
