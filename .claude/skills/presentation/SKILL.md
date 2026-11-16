---
name: presentation
description: Builds an animated presentation for the escenario player that the user narrates live with their own voice — summary, approval, scenes, screenshot review. Use when the user asks for a new presentation or explainer on a topic, or to change, reuse or review scenes of an existing one.
---

# Presentation workflow

Run the phases in order. Each one ends with a check; do not start the next phase until it passes.

## 1. Summary

Write `presentations/<slug>/summary.md` following [summary-template.md](summary-template.md).
Ask (quiz with options) for anything the request leaves open: audience, duration, on-screen language, programming language of any code.
Before planning new scenes, list `library/` and reuse what fits.

Done when the summary is written and you have **stopped**: tell the user it is ready and wait.
Write scenes only after the user explicitly approves (for example "go on", "sigue", "aprobado").
If they ask for changes, edit the summary and wait again.

## 2. Scenes

1. Follow [contract.md](contract.md) for scene files, `presentation.json` and `theme.css`.
2. Follow [rules.md](rules.md) for clarity and motion.
3. A scene that could serve another topic goes to `library/<id>.html` with its content in props.
   A scene tied to this topic goes to `presentations/<slug>/scenes/<id>.html`.
4. A new browser library: `npm install` it, add its files to `scripts/vendor.mjs`, run `npm run vendor`,
   and load it from the scene with `<script src="/player/vendor/...">`. Tell the user before adding it.
5. Fonts go in `presentations/<slug>/fonts/` (or `player/vendor/fonts/` when shared) with `@font-face` in `theme.css`.

Done when `npm run check` passes and `http://localhost:3000/player/index.html?p=<slug>` (after `npm start`)
opens without the red error panel.

## 3. Review

1. Run `npm run screenshots <slug>`. It jumps straight to every step in recording mode, saves
   `screenshots/<slug>/sNN-kNN-<scene>-<step>.png`, and audits text size and the safe area into `audit.json`.
2. Open every PNG with the Read tool and check it against the list in [rules.md](rules.md#review-checklist).
3. Fix, rerun, look again, until the script exits 0 and every image passes.
4. Write `presentations/<slug>/REVIEW.md`: what you found per scene, what you changed, what remains.

Done when the script exits 0, you have looked at every PNG of the last run, and REVIEW.md is written.

## 4. Hand over

Tell the user: the URL to open, the number of scenes and steps, the transitions used, and anything in
REVIEW.md that still needs their decision.
