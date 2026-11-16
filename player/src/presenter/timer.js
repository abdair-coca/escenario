// Stopwatch for the presenter. Starts on the first command; T pauses/resumes, R resets.

export function createTimer(display) {
  let startedAt = null;
  let elapsedBefore = 0;
  let listener = () => {};
  const elapsed = () => elapsedBefore + (startedAt === null ? 0 : performance.now() - startedAt);

  setInterval(() => display(formatElapsed(elapsed())), 250);
  display(formatElapsed(0));

  const timer = {
    get running() {
      return startedAt !== null;
    },
    start() {
      if (startedAt === null) startedAt = performance.now();
      listener(true);
    },
    pause() {
      elapsedBefore = elapsed();
      startedAt = null;
      listener(false);
    },
    toggle() {
      if (timer.running) timer.pause();
      else timer.start();
    },
    startIfIdle() {
      if (!timer.running && elapsedBefore === 0) timer.start();
    },
    reset() {
      elapsedBefore = 0;
      startedAt = null;
      display(formatElapsed(0));
      listener(false);
    },
    onChange(callback) {
      listener = callback;
      listener(false);
    },
  };
  return timer;
}

export function formatElapsed(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}
