# Review — arboles-binarios

Final run: `npm run screenshots arboles-binarios` → 26 screenshots, 0 audit issues (text ≥ 40 px,
90% safe area), 0 player errors. Every PNG of the last run was checked by eye, plus mid-transition
captures of zoom (1→2), reveal (2→3), the two cuts (3→4, 4→5) and push (5→6).

## Found and fixed

| Scene | Problem in the screenshots | Cause | Fix |
|---|---|---|---|
| 1 Adivina | Pins 50/60/70 visible on step `regla`, before any question; 60 covered «Mayor» | the head's entrance moved it but never hid it | entrance also fades it in |
| 1 Adivina | «¡Sí!» had no mustard background | `.bubble rect` outranked `.yes-bg` | `.bubble .yes-bg` |
| 1, 2, 3, 6 | Coloured SVG text came out black («mayor/menor» blue, `None` mono blue, `30` vermilion, bar label invisible black-on-black) | shared `.canvas text` rule outranked scene classes | shared default wrapped in `:where()` (in `scene-kit.js`) |
| 1 Adivina | Final tree off-centre to the right | layout | tree moved 100 px left |
| 2 Nodo | Dots of later leader lines visible from the first step | only the path was hidden | dots enter with their line |
| 2 Nodo | `None` overflowed the small node's compartments | wrong font (see above) + 108 px cells | mono font + 124 px cells |
| 3 Regla | Empty slot, outlines and drop lines almost invisible | `drawSVG` rewrites dashed strokes | outlines/drops solid; slot fades/scales in |
| 2→3 | Reveal showed the old scene with holes | scene hosts were transparent | hosts get the paper background (player) |
| 2→3 | Reveal opened onto an empty page | incoming entrance started at 60% | `handoff` per transition (reveal 0.15) and 1.3 s for this one |
| 3→4 | The tree jumped ~130 px at the cut | SVG `transformOrigin` depends on the bbox, which differed between scenes | `svgOrigin: "0 0"` in both tree scenes |
| 5 Buscar | Token `¿60?` covered the found node's ring | token stayed beside the node | token merges into the node |
| 6 Millón | Chain edges drawn over the node numbers | edge appended after the previous node | edges in their own layer below nodes |
| player | A content drawn from `onUpdate` would be wrong after a direct jump | seeks suppressed callbacks | seeks fire `onUpdate`; covered by a new test |
| 6 Millón | Half of «Lista, uno por uno…» showed on step `mitades` | its tween started at `">"`, before the hold | starts at `tl.duration()`; the player now rejects any animation that crosses a hold (unit test + verified by reintroducing the bug) |
| 6 Millón | 10 visible rows vs «unas 20» in the counter | rows past 10 are under 2 px | a last line «… tras 20 mitades: queda 1 número» (author's choice) |
| 3→4 | At the cut the title and «20 < 30 < 40» vanished, the new title came 0.3 s later | bst-walk started empty | bst-walk takes `previousTitle` and `previousFocus`, starts with them on screen and removes them fast (author's choice); both scenes draw the line with the shared `bstTree.drawOrder`, and every headline is now the same 96 px block |

## Checked and fine

- Every step reached by jumping directly (that is how the screenshots are taken) matches the summary.
- Cuts 3→4 and 4→5 are seamless: the frame right after the key press matches the previous step.
- No banned look: light paper, no glows/particles, no card rows; entrances are pen strokes, drops, typing,
  highlighter swipes, folding ruler segments and a camera push.
- Code lines (40 px mono) end at x ≤ 1803, inside the safe area.

## Open

- The demo has not been timed with real narration; the ~7 min estimate comes from the summary.
