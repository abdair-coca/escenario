# Review — explicador

Final run: `npm run screenshots explicador` → 42 screenshots, 0 audit issues (text ≥ 40 px, 90% safe
area), 0 player errors. Every PNG of the last run was checked by eye (contact sheets of four, plus full
size for the scenes that changed last). `npm run check`: 22 tests pass. `arboles-binarios` was re-shot
after the shared code helper changed: 26 screenshots, 0 issues, code scenes look the same.

## Found and fixed

| Scene | Problem in the screenshots | Cause | Fix |
|---|---|---|---|
| 1 Diagrama | The tab hid the grid and seven of the eight paragraph lines on step `parrafo` | paper-filled panels are visible before their outline is drawn | every drawn outline also fades its fill in (`fillOpacity: 0` in the same tween), in all scenes |
| 2 Piezas | «SSE» squeezed between Servidor and Puente | 80 px gap | label removed; the narration names SSE |
| 2 → pipeline | Link to a piece added in the same step failed to build | link ends resolved from drawn pieces | link ends resolved from the element list |
| 3 Referencias | Green check over `'hex'` on line 18 | placed at the card corner | check moved beside line 19 (`}`) |
| 3 Referencias | `</script>` inside the scene's script ended it | HTML parsing | written as `<\/script>` |
| 4 Primera vez | Status pills sat 24 px below their call line; `.explicador/index/` ran into the rail and gate 2 | pill anchored by its top | pills share their row's baseline; index pill moved left |
| 4 Primera vez | Grey lamps visible before the gates were drawn | lamp not in the entrance | lamp enters with its badge |
| 4, 5 | Lamps and outlines changing colour through `var(--…)` would not tween | gsap cannot interpolate CSS variables | coloured copies fade in over the ink ones |
| 6 Clic | Orange dot visible from step 1 | a round line cap of the hidden pin leader | the whole pin group fades in at its step |
| 6 Clic | Packet «respuesta» covered «Visor»; `answer_question` touched the box | packet parked at the link end | `stop` (fraction of the path) for packets; label below the line |
| 7 127.0.0.1 | «solo lo que Claude Code ya envía» crossed the machine boundary; badges overlapped it | right-aligned label | label in three lines outside; export moved under Claude Code |
| 7 127.0.0.1 | Tick touched `src/auth/password.js` | tick drawn to the right of its x | tick shifted left |
| 8 Medición | Blind-spot drawing collided with the column labels; scribble left its box | layout | own column at the right; scribble kept inside its box |
| 9 Riesgos | «Chromium/Windows» past the safe area | line too long | three shorter lines |
| 9 Riesgos | Every piece outlined in blue | entrance pieces kept their focus outline | entrance draws without focus |

## Changes outside this presentation

- `library/shared/python-code.js` became `library/shared/code-panel.js` (`window.codePanel`), with modes
  for Python (default, unchanged), JS/TS and XML/EXL, string colouring and an optional line-number gutter.
  `bst-walk` and `arboles-binarios/node-anatomy` now load it.
- New library scene `library/pipeline.html`, used three times here (scenes 2, 6, 9).

## Checked and fine

- Code on screen is quoted from `../explicador`: `login.exl.md`, `password.js:14-19`,
  `server/src/cache/index.ts:25-28`. Hashes are the real SHA-256 of `examples/shop` (before and after
  changing `KEY_LENGTH` to `32` on line 17). The two warnings in scene 4 paraphrase real messages from
  `server/src/rules.ts`.
- Transition targets exist in their outgoing scenes: `.piece-exl` (2→3), `.gate-4` (4→5),
  `.piece-puente` (6→7).
- No banned look: light graph paper, flat signal colours, pieces joined by arrows, entrances are strokes,
  typing, stamps and packets moving along links.

## Open

- Mid-transition frames were not captured; only the rest state of each step.
- Not timed with real narration; ~9 min is the summary's estimate.
- Scene 4's headline is «La primera vez» (the summary's title did not fit at 96 px).
- Figures in scene 8 (304, 204, 61, 50; 2,4 → 4,9) come from the analysis text, not re-measured in the repo.
