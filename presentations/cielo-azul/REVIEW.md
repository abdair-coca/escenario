# Review: cielo-azul

Screenshots: `screenshots/cielo-azul/` (21 PNG). Last run of `npm run screenshots cielo-azul`: exit 0, 0 audit issues, 0 errors.
Every PNG was opened and checked against `rules.md` and the Avoid list in `DESIGN.md`.

## Per scene

1. **sunlight-mix** (3 steps): reads at once. The mascot looks up at the sun, the beam has one blue and one orange wave, and the labels are 40 px. No change.
2. **pipeline** (4 steps): the packets parked at the ends of the links and covered the labels "Aire" and "Ojo", and the link labels sat on the packet path. Changed in `presentation.json`: each packet stops at 0.8 of its link, and each link label moved below its line. Still open: the library draws 5 px outlines with no hard shadow (see Open).
3. **air-bounces** (3 steps): the column reads well. The beam looked like a pole, so a small arrowhead was added at its lower end to show the direction. Hits are in `--accent`, scatter arrows in ink.
4. **blue-bounces** (4 steps): reads well. The orange wave passes straight through the molecule and the blue wave scatters. The bars give blue about 5 times orange, labelled approximate.
5. **sky-dome** (3 steps): reads well. The arrows converge on the mascot's eyes, the sun sits on the rim, and "luz directa" is outside the dome.
6. **sunset** (4 steps): reads well. The closing idea sits below the horizon strip, so no decoration is behind text.

## Checklist (rules.md)

- A stranger understands each step without the narration: yes, except the scene 2 labels are small, and the packets are only readable after the fix above.
- Text at least 40 px, nothing outside the 90% area, no accidental overlap: audit reports 0 issues; checked visually too.
- Banned looks: no dark background, glows, particles, three cards in a row, or everything entering with fade and slide.
- The step matches the summary: yes, except the deviations below.

## Deviations from the approved summary

- Scene 2: the summary says the packet travels from Sol to Ojo. The library packet travels along one link and parks, so there are two packets, each stopping at 80% of its link.
- Scene 4: the summary says the orange wave has "a few arrows". Left out, so the blue scatter directions stay readable.

## Open (needs a decision)

- `library/pipeline` draws 5 px ink outlines with no hard shadow, while DESIGN.md asks for 6 px outlines on big shapes and a 10 px hard shadow on every shape. Fixing it means editing `library/pipeline.html`, which is outside `presentations/cielo-azul/`, so it was not changed. It would also change the look of the rag and triggers-cursores decks.
- Transitions and timing were not reviewed by eye. Screenshots only check each step's rest state.
- Presenter notes were not checked on screen.
