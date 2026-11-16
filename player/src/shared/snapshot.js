// What the presenter window needs to know about a position: notes, next step, counters.

import { nextPosition } from "../navigation/cursor.js";

export function presenterSnapshot(presentationTitle, scenes, position) {
  const counts = scenes.map((scene) => scene.steps.length);
  const next = nextPosition(position, counts);
  return {
    type: "state",
    title: presentationTitle,
    position,
    next,
    scene: {
      number: position.scene + 1,
      total: scenes.length,
      title: scenes[position.scene].title,
      steps: scenes[position.scene].steps,
    },
    step: describeStep(scenes, position),
    upcoming: next ? { title: scenes[next.scene].title, ...describeStep(scenes, next) } : null,
  };
}

function describeStep(scenes, { scene, step }) {
  const label = scenes[scene].steps[step];
  return { number: step + 1, label, note: scenes[scene].notes?.[label] ?? "" };
}
