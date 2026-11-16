// Drives playback: → plays to the next hold, ← jumps to the rest state of the previous step,
// and crossing a scene boundary runs the incoming scene's transition.

import { nextPosition, previousPosition, clampPosition } from "./cursor.js";
import { createSceneInstance } from "../scenes/instance.js";
import { runTransition } from "../transitions/transitions.js";
import { sequenceMotions } from "../shared/motion.js";

export function createController({ stage, scenes, onChange, onError }) {
  const counts = scenes.map((scene) => scene.steps.length);
  let position = null;
  let current = null;
  let motion = null;
  let queue = Promise.resolve();

  // Commands run in order; animations are not awaited so a key press can finish them.
  function enqueue(command) {
    const run = queue.then(command);
    queue = run.catch(onError);
    return run;
  }

  function setMotion(next) {
    motion = next;
    next.done.then(() => {
      if (motion === next) motion = null;
    });
  }

  function finishMotion() {
    if (!motion) return false;
    motion.finish();
    motion = null;
    return true;
  }

  async function mount(sceneIndex) {
    const scene = scenes[sceneIndex];
    return createSceneInstance(scene.loaded, scene, stage.element);
  }

  async function jumpTo(target) {
    finishMotion();
    const next = clampPosition(target, counts);
    if (!current || next.scene !== position.scene) {
      const incoming = await mount(next.scene);
      current?.destroy();
      current = incoming;
    }
    current.rest(next.step);
    position = next;
    onChange(position);
  }

  function goTo(target) {
    return enqueue(() => jumpTo(target));
  }

  // Like a slide deck: pressing → during an animation completes it instead of skipping ahead.
  function advance() {
    return enqueue(async () => {
      if (finishMotion()) return;
      const next = nextPosition(position, counts);
      if (!next) return;
      if (next.scene === position.scene) {
        setMotion(current.playStep(next.step));
      } else {
        await enterScene(next.scene);
      }
      position = next;
      onChange(position);
    });
  }

  async function enterScene(sceneIndex) {
    const incoming = await mount(sceneIndex);
    incoming.showStart();
    const outgoing = current;
    current = incoming;
    const transition = runTransition(scenes[sceneIndex].transition, {
      from: outgoing,
      to: incoming,
      stage: stage.element,
    });
    setMotion(sequenceMotions(transition, () => incoming.playStep(0)));
  }

  function back() {
    return enqueue(async () => {
      finishMotion();
      const previous = previousPosition(position, counts);
      if (previous) await jumpTo(previous);
    });
  }

  return {
    goTo,
    advance,
    back,
    get position() {
      return position;
    },
    get busy() {
      return motion !== null;
    },
    whenIdle: () => queue,
  };
}
