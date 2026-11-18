# Review: como-enfria-la-nevera

Screenshots: `screenshots/como-enfria-la-nevera/` (21 PNG). Last run of `npm run screenshots como-enfria-la-nevera`: exit 0, 0 audit issues, 0 errors.
`npm run check`: syntax ok, 22 tests pass. Every PNG was opened and checked against `rules.md` and the Avoid list in `DESIGN.md`.
Besides the per-step screenshots, the whole deck was played with the arrow key in the real player (all five transitions, 21 steps):
no page errors, no audit issues at the end.

## Per scene

1. **heat-out** (4 steps): reads at once. The fridge (shelves, drawers, handle), the carton (gable roof, LECHE, drop) and the three orange arrows crossing the wall are recognisable without narration. The mascot sits in its own corner and nothing enters it. Found and fixed: with the fridge appearing at step 2, step 1 was a headline over an empty page; the fridge now pops in with the entrance, so step 1 asks the question over the fridge and step 2 drops in the carton.
2. **closed-loop** (3 steps): the two zones and the sealed tube fill the canvas. Found and fixed: the coils touched the panel edges (x 104 and x 1816); both coils were moved inward. Step 1 shows two zones with the carton and the air pill and the tube still missing, which is the build-up on purpose.
3. **inside-boil** (4 steps): reads well. Blue droplets in the lower turns, white bubbles in the upper turns, orange arrows from the carton to the coil. Found and fixed: the bubbles on the exit tube were spaced twice as wide as in the coil; the spacing is now even.
4. **pump-squeeze** (3 steps): the syringe-like barrel with plunger, eight bubbles that pack tight, and a temperature scale split at the kitchen's 22 °C. Found and fixed: the group sat too far right, leaving the left empty; moved left. The marker's label overlapped the marker; moved up. «−20 °C» uses a real minus sign (renders in Fredoka).
5. **heat-leaves** (3 steps): the coil behind the fridge, orange gas turning into blue droplets, five orange arrows into the room. Found and fixed: the entry tube touched the title band, the label «gas caliente» sat on the tube, and the top-left arrow did not touch the coil. The air pill now appears in step 1 so the right side is not empty.
6. **loop-closes** (4 steps): reads well. The loop is the one from scene 2 with the pump, the valve and four numbered pills. The mascot's corner stays clear; the loop's lower side is at y 796. Found and fixed: the pills #1 and #3 touched the title bands; they are now smaller and straighter.

## Checklist (rules.md)

- A stranger understands each step without the narration: yes for the carton, fridge, tube, coil, pump, valve and thermometer scale. The numbered pills carry a verb (`#1 hierve`, `#2 bomba`, `#3 suelta calor`, `#4 válvula`) so the parts are named on the part.
- Text at least 40 px, nothing outside the 90% area, no accidental overlap: audit reports 0 issues; checked visually too.
- Banned looks: no dark background, glows, particles, three cards in a row, or everything entering with fade and slide up. Entrances are pops (`back.out`), draws (`drawSVG`), drops and scale-from-tail arrows. No `repeat: -1`, CSS animation, `setTimeout` or `Math.random`.
- The step matches the summary: yes, except the deviations below.
- The cielo-azul problems: no half-empty diagram at rest (scene 4 and scene 5 step 1 keep some empty space on one side, see Open); no beam covers the mascot; no shape reads as a pole (arrows have heads, tubes are closed loops with outlines).

## Deviations from the approved summary

- Scene 1: the fridge appears in the entrance, and step 2 `nevera` adds the carton and its badge (summary: the fridge and carton pop in at step 2). Reason: step 1 was an empty page.
- Scenes 2 and 6: a caption in the bottom band changes with each step (the summary lists captions only for the idea in scene 6). It fills the band under the zones and carries the sentence of each step.
- Scene 2: the right zone also has an `aire 22 °C` pill; the label `refrigerante` is placed inside the loop with a leader to the tube, not on the tube.
- Scene 3: the sparkle is at the bottom-right of the zone (the top-right is the title band).
- Scene 5: the wipe is `direction: "right"` in `--warm` (the transition only moves sideways, so the top-down wipe of the summary is not possible).
- Scene 6: pills #1 and #3 sit above the coils, #2 below the pump and #4 above the valve, and the badge swap `25 °C` to `4 °C` is a drop-in of a blue badge.
- Scene 6: the sparkle sits at the top-right of the canvas (not inside a zone).

## Open (needs a decision)

- Transitions were played in the real player (no errors), but their timing and look were not reviewed frame by frame. Screenshots only check each step's rest state.
- Presenter notes were not checked on screen.
- Scene 4 keeps empty space at the top left and bottom left (the plunger handle and the scale are the only things there). It reads clearly, but a wider barrel or a bigger scale would use it.
- Scene 5 step 1 has the left third empty until the arrows arrive in step 2.
- The coil in scene 2 (`.coil-in`) is only a zig-zag of the tube; the reveal into scene 3 grows out of an invisible box over it.
- `library/pipeline` was not used (it does not follow DESIGN.md yet), so the open note in cielo-azul about it does not apply here.
