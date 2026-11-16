// Pure rules of the scene contract: what registerScene accepts, how props merge
// and how timeline labels map to steps.

export function validateDefinition(definition) {
  const errors = [];
  if (!definition || typeof definition !== "object") return ["registerScene needs an object"];
  const { id, props = {}, steps, build } = definition;
  if (typeof id !== "string" || !/^[a-z0-9-]+$/.test(id)) {
    errors.push("id must be kebab-case (a-z, 0-9, -)");
  }
  if (typeof props !== "object" || props === null || Array.isArray(props)) {
    errors.push("props must be an object of default values");
  }
  if (typeof steps !== "function") errors.push(...validateSteps(steps));
  if (typeof build !== "function") errors.push("build(root, props, gsap) must be a function");
  return errors;
}

function validateSteps(steps) {
  if (!Array.isArray(steps) || steps.length === 0) return ["steps must list at least one step label"];
  const errors = [];
  if (steps.some((step) => typeof step !== "string" || step === "")) {
    errors.push("every step label must be a non-empty string");
  }
  if (new Set(steps).size !== steps.length) errors.push("step labels must be unique");
  return errors;
}

// `steps` is a fixed list, or a function of the props when the number of holds depends on
// the content (for example, one step per node on a path).
export function resolveSteps(definition, props) {
  const steps = typeof definition.steps === "function" ? definition.steps(props) : definition.steps;
  const errors = validateSteps(steps);
  if (errors.length) throw new Error(`${definition.id}: ${errors.join("; ")}`);
  return steps;
}

export function mergeProps(defaults = {}, overrides = {}) {
  const unknownKeys = Object.keys(overrides).filter((key) => !(key in defaults));
  return { props: { ...defaults, ...overrides }, unknownKeys };
}

// Each label is a hold point: the timeline state at that label is the rest state of the step.
export function readStepTimes(labels, steps) {
  const errors = [];
  const times = steps.map((step) => {
    if (!(step in labels)) errors.push(`missing timeline label "${step}"`);
    return labels[step] ?? 0;
  });
  if (errors.length) return { times, errors };
  times.forEach((time, index) => {
    if (index > 0 && time < times[index - 1]) {
      errors.push(`label "${steps[index]}" comes before "${steps[index - 1]}"`);
    }
  });
  return { times, errors };
}
