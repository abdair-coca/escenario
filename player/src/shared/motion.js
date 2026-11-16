// A motion is anything that animates and can be finished at once: { done, finish(), handoff }.
// `handoff` resolves when the next motion may start (overlap); it defaults to `done`.

export function settledMotion() {
  const done = Promise.resolve();
  return { done, handoff: done, finish() {} };
}

export function motionFromTween(tween, handoffProgress = 1) {
  let resolveDone;
  let resolveHandoff;
  const done = new Promise((resolve) => (resolveDone = resolve));
  const handoff = new Promise((resolve) => (resolveHandoff = resolve));
  // eventCallback replaces any callback the tween already had, so keep and call it.
  const ownUpdate = tween.eventCallback("onUpdate");
  const ownComplete = tween.eventCallback("onComplete");
  tween.eventCallback("onUpdate", () => {
    ownUpdate?.call(tween);
    if (tween.progress() >= handoffProgress) resolveHandoff();
  });
  tween.eventCallback("onComplete", () => {
    ownComplete?.call(tween);
    resolveHandoff();
    resolveDone();
  });
  return {
    done,
    handoff,
    finish() {
      tween.progress(1);
    },
  };
}

// Starts `startSecond()` when `first` hands off; finishing the sequence finishes both.
export function sequenceMotions(first, startSecond) {
  let second = null;
  let finishRequested = false;
  const start = () => {
    second ??= startSecond();
    if (finishRequested) second.finish();
    return second;
  };
  const done = first.handoff.then(() => Promise.all([first.done, start().done]));
  return {
    done: done.then(() => {}),
    handoff: done.then(() => {}),
    finish() {
      finishRequested = true;
      first.finish();
      start().finish();
    },
  };
}
