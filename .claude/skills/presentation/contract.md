# Scene contract

## Scene file

One HTML file: a `<template>` with the markup and its styles, then a script that calls `registerScene`.
The template is mounted in a shadow root, so its styles only touch this scene.

```html
<template>
  <style>
    .title { position: absolute; left: 160px; top: 140px; font: 700 96px/1.1 var(--font-display); }
  </style>
  <h1 class="title"></h1>
</template>
<script src="/player/vendor/gsap/DrawSVGPlugin.min.js"></script>
<script>
  registerScene({
    id: "title-card",               // kebab-case, same as the file name
    props: {
      title: "Title",               // headline text
      color: "var(--accent)",       // underline colour
    },
    steps: ["title", "underline"],  // or (props) => [...] when the count depends on props
    build(root, props, gsap) {
      const q = gsap.utils.selector(root);
      q(".title")[0].textContent = props.title;
      return gsap.timeline()
        .from(q(".title"), { yPercent: 40, opacity: 0, duration: 0.6, ease: "expo.out" })
        .addLabel("title")
        // …
        .addLabel("underline");
    },
  });
</script>
```

- `root` is the 1920×1080 scene element. Query inside it with `root.querySelector`; build selectors with
  `gsap.utils.selector(root)` (plain string selectors in gsap search the whole document, not the scene).
- `props` holds the defaults. Comment every prop on its line. `presentation.json` overrides them per use
  (shallow merge); an unknown prop shows up as an error.
- `build` returns one gsap timeline. The player pauses it. Return it directly — never `await` a timeline
  (timelines are thenables and a paused one never resolves). When something must load first, make
  `build` async and resolve to `{ timeline }`.
- Optional `destroy(root)` releases what the timeline cannot (WebGL contexts, workers).

## Steps and labels

- Every step has a timeline label with the same name, in the same order.
- A label is a **hold**: the timeline state at the label is that step's rest state.
- → plays from the previous label to the next one. Tweens before the first label are the scene's entrance.
- ← and the URL **seek** straight to a label, so every step must look right when reached by seeking:
  the scene is a pure function of timeline time.
  - Build the timeline from tweens and `set`; keep side effects out of `call()`. No `Date.now()`, `setTimeout`, `setInterval`,
    `requestAnimationFrame` loops, unseeded `Math.random()`, CSS animations/transitions, or `repeat: -1`.
  - Canvas/WebGL: draw in an `onUpdate` of a tween on the timeline, from the tween's progress.
  - Random layouts: use a seeded generator written in the scene.

## Pitfalls found in review

- DrawSVG rewrites `stroke-dasharray`: animate dashed strokes with opacity or scale, never `drawSVG`.
- In SVG, `transformOrigin` is measured from the element's bounding box, which changes as content is added.
  For layout transforms use `svgOrigin` (user-space coordinates).
- A scene default such as `.canvas text { fill }` outranks single-class colour rules; wrap shared defaults
  in `:where()` so scene classes win.
- `gsap.from` on an element that must stay hidden until its step needs `opacity: 0` (or a draw/clip) as well
  as the movement; otherwise it sits visible in its start position.

## Theme

`presentations/<slug>/theme.css` is linked at document level. Custom properties cross the shadow root,
so library scenes read the look from these names:

| Variable | Meaning |
|---|---|
| `--paper` | canvas background |
| `--ink` | main text and lines |
| `--muted` | discarded / secondary |
| `--accent` | the thing being talked about now |
| `--accent-2`, `--accent-3` | second and third emphasis colours |
| `--font-display`, `--font-body`, `--font-code` | font stacks |
| `--wipe` | panel colour of the `wipe` transition |

`@font-face` must live in `theme.css` (fonts declared inside a shadow root do not load).

## Review markers

- `data-decor` on an element skips the text-size and safe-area audit for it and its children
  (textures, guide marks that are not meant to be read).
- `data-bleed` lets a shape reach the canvas edge (full backgrounds). Content stays inside the 90% area.

## presentation.json

```json
{
  "title": "Árboles binarios",
  "lang": "es",
  "theme": "theme.css",
  "scenes": [
    {
      "scene": "library/title-card",
      "title": "Portada",
      "props": { "title": "Árboles binarios" },
      "transition": { "type": "cut" },
      "notes": { "title": "Pregunta al público…", "underline": "…" }
    },
    { "scene": "scenes/guessing-game", "transition": { "type": "zoom", "target": ".node-50" } }
  ]
}
```

- `scene`: `library/<id>` resolves to `library/<id>.html`; anything else is relative to the presentation folder.
- `title`: name in the index and presenter (defaults to the scene id).
- `notes`: cue per step label, shown in the presenter window.
- The same scene may appear many times with different `props`.

## Transitions

Set on the scene that is **entering**. Pick the one that something on screen motivates.

| `type` | Options | Use when |
|---|---|---|
| `cut` | — | the next scene starts exactly where this one ends (continuity) |
| `push` | `direction`: left · right · up · down, `duration` | the camera moves to something beside this |
| `zoom` | `target`: selector in the outgoing scene, `duration` | we go inside an element |
| `reveal` | `target`: selector in the outgoing scene, `duration` | the new scene grows out of an element |
| `wipe` | `color`, `direction`, `duration` | a clean break to a new topic |

Every transition except `cut` also takes `handoff` (0–1): how far it runs before the incoming scene
starts its entrance (default 0.6; `reveal` 0.15, so the new scene grows inside the opening circle).

← never plays a transition; it cuts to the previous step's rest state.
