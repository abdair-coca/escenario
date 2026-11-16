# Review: How RAG works

`npm run screenshots rag` exits 0: 50 screenshots in `screenshots/rag/`, 0 audit issues (text ≥ 40 px, inside the
90% area), 0 player errors. Every PNG of the last run was opened and checked against `rules.md`.

## What the review found, and what changed

| Scene | Found | Change |
|---|---|---|
| 1 `no-handbook` | The answer card's paper fill hid the ruled lines before the card was drawn | The fill fades in with the stroke (`fillOpacity`) |
| 2 `pipeline` (two lanes) | «Handbook» wider than its box | Box width 300 → 340 |
| 3 `chunks` | Nothing | — |
| 4 `embeddings` | The dashed «leave» ring cut through labels 4.2 and 4.3 and through «question» | Ring radius 150 → 180; point labels and «question» get a paper halo (`paint-order: stroke`) |
| 5 `cosine-angle` | «16°» touched the question arrow; the longer copy of 4.2 covered the arrowhead of 4.2; «cos θ» sat right under «longer, same direction» | «16°» moved below the question arrow; the longer copy is drawn first, under the others, in grey; caption moved down |
| 6 `cosine-formula` | The parking line (the zero case) was grey and hard to read | Line in ink; caption stays grey |
| 7 `retrieval` | Nothing | — |
| 8 `prompt-answer` | The arrowhead to the LLM showed before its step; the answer words, drawn in paper colour, erased the ruled lines | The arrowhead fades in with its own step; words fade by `fillOpacity` |
| 9 `pipeline` (end to end) | Nothing | — |
| 10 `pipeline` (where it breaks) | The «guess» leader ran close to the «k» pin text; «Handbook» overflowed its box (as in scene 2) | Pin moved right; box width as in scene 2 |
| 11 `measure` | The label of Q6 turned paper colour with its tile, so it was unreadable once the tile became an outline | Q6 label turns red with its outline |
| 12 `when-to-use` | The empty checkboxes were filled in paper colour and hid the ruled lines | Boxes fade in their fill with `fillOpacity` |

The last run was compared byte by byte with the run before it: only the changed scenes differed, and those were
opened again.

## Left for your decision

1. **Glyphs and fonts.** Some characters used here (`θ`, `√`, `‖`, `→`) may not be in the Latin subsets of the
   fonts in `player/vendor/fonts/`. If they are not, the browser uses a system font for them. I did not check which
   glyphs fall back. Fixing it means a font with those glyphs: a new dependency, so it needs your approval.
2. **Numbers are a teaching model.** Vectors have two dimensions, and the scores (0.96, 0.94, 0.92, 0.00) are computed
   from them. Real embeddings have many more dimensions, and real scores differ. Scene 4 says «Real embeddings use
   hundreds.», which is an understatement; say if you want «hundreds to thousands».
3. **Timing.** The ~12 minutes and 50 steps are an estimate. Nothing here has been timed or narrated. The audit
   loads every step in a headless browser; it does not check pace or the presenter window.
