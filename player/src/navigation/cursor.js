// Pure step arithmetic. `counts[i]` is the number of steps of scene i.

export function nextPosition(position, counts) {
  if (position.step + 1 < counts[position.scene]) {
    return { scene: position.scene, step: position.step + 1 };
  }
  if (position.scene + 1 < counts.length) return { scene: position.scene + 1, step: 0 };
  return null;
}

export function previousPosition(position, counts) {
  if (position.step > 0) return { scene: position.scene, step: position.step - 1 };
  if (position.scene > 0) {
    const scene = position.scene - 1;
    return { scene, step: counts[scene] - 1 };
  }
  return null;
}

export function clampPosition(position, counts) {
  const scene = clamp(position.scene, 0, counts.length - 1);
  return { scene, step: clamp(position.step, 0, counts[scene] - 1) };
}

export function samePosition(a, b) {
  return Boolean(a && b) && a.scene === b.scene && a.step === b.step;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
