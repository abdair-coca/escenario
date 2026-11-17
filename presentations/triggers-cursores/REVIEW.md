# Review: triggers-cursores

## Checks run

- `npm run screenshots triggers-cursores`: 52 steps captured, 0 audit issues (text at least 40 px, everything inside the 90% area), 0 errors. All 52 PNGs were opened and checked against `rules.md`. The screenshots folder is git-ignored.
- `npm run check`: syntax ok, 22 of 22 tests pass.
- T-SQL shown on screen: extracted from the scene files (the `CODE` and `BATCH` arrays) and run on the local SQL Server 2022 RTM (Developer Edition, `us_english`) with `sqlcmd -I`, so QUOTED_IDENTIFIER is on, as in SSMS. The scratch database `TriggersDemo` was dropped at the end of the tests.

## Found and changed, per scene

| # | Scene | Found in review | Changed |
|---|---|---|---|
| 1 | Un dato, dos sitios | The label "guardado" was cut by the boxes | Label moved above the link |
| 2 | Un trigger en SSMS | The outline cut through the trigger name and the "Triggers" label; arrow misaligned | Outline and arrow fitted to the text |
| 3 | Una vez por sentencia | The last row touched the table border | Rows spaced 55 px apart |
| 4 | Un UPDATE tiene dos imágenes | None | None |
| 5 | El trigger de recálculo | Violet keywords unreadable on the solid orange highlight | Highlight at 25% opacity (scenes 5, 7 and 9) |
| 6 | Probarlo en SSMS | None after the fixes; totals and messages correct | Added a `start` step (see deviations) |
| 7 | El cursor, fila a fila | The word "UPDATE" showed before its box | The whole loop group fades in together |
| 8 | Cursor en el trigger | None | None |
| 9 | Datos existentes: lotes, no cursor | The `DECLARE` lines and the closing sentence never appeared | Removed from the opacity-0 list (writeIn already hides them); the "no" arrow head no longer touches the next box |
| 10 | Dos sesiones a la vez | None on screen; the cue overstated the conditions | Cue states the conditions (see decision 1) |
| 11 | Alternativa: vista indexada | The pin leader crossed the caption | Caption became check 5; pin moved; cue corrected |
| 12 | Cuándo cada herramienta | None | Cell text shortened to fit the table |

Engine and library fixes:

- `library/result-grid.html`: each step's label was placed before its tweens finished, so the player refused the scene ("an animation runs across the hold"). The label now sits at the end of the step's tweens.
- `library/shared/code-panel.js`: `sql` language added (UPPERCASE keywords, `--` comments in italic, `NULL`). The `python`, `js` and `xml` paths are unchanged.

## Verification on SQL Server

| Claim on screen | Result |
|---|---|
| Trigger: 26 → 32 → 29 → 24, and the check gives 24 = 24 | Confirmed with the code shown |
| One "(1 row affected)" per INSERT with `SET NOCOUNT ON`; two without it | Confirmed |
| Cursor backfill gives the same totals as the set-based version | Confirmed: 26 with the code shown |
| Batch loop over 12,000 orders: 12,000 wrong before, 0 after, in batches of 5000, 5000 and 2000 | Confirmed with the code shown |
| Cursor inside the trigger: 3 recalculations for 3 lines, total 29 | Confirmed with test code of the same logic (scene 8 shows no code) |
| Without `COUNT_BIG(*)` the view fails; the valid view gives order 1042, total 26, 3 lines | Confirmed. The error (10138) comes from the unique clustered index, not from `CREATE VIEW` |
| Race in scene 10 | Differs from the approved summary; see decision 1 |

Race results (scene 10), final total of order 1042 (correct value 36):

| Setup | Final total |
|---|---|
| Single-statement trigger (the one in scene 5), RCSI, no foreign key | 36 |
| Single-statement trigger, RCSI, with foreign key | 36 |
| Read then write (sum in one statement, UPDATE in another), no foreign key, default locking | 36 |
| Read then write, no foreign key, RCSI | **30** (a line is lost) |
| Read then write, with foreign key, RCSI | 36 |
| Read then write with `UPDLOCK` on the order row first, RCSI | 36 |
| Delta `SET Total = Total + 4`, RCSI | 36 |

## Decision for you: scene 10

The approved summary said the race happens "under RCSI". The tests show it needs three things together: RCSI, no foreign key, and the total read in one statement and written in another. The single-statement trigger from scene 5 lost no line in any test. The scene now shows the read-then-write case, and the conditions appear only in the presenter cue.

Options:
- (a) Keep it as built.
- (b) Put the conditions on screen, for example a small label "sin clave foránea · RCSI".
- (c) Drop the scene.

Nothing has been changed beyond the current state.

## Deviations from the approved summary

1. Scene 3 is drawn on its own, not with `result-grid`: the fan of three runs cannot be expressed as a table. `result-grid` is used in scenes 4 and 12.
2. Scene 6 has a `start` step, so the 26 is seen before the first INSERT: 5 steps there. The deck has 52 steps, not 51.
3. Scene 11: the caption "índice agrupado único" was removed from the view (the pin leader crossed it) and became the fifth check.
4. Scene 12: cell text shortened to "Trabajo por fila, sin JOIN" and "Cursor, fuera del trigger" to fit the table width.
5. Scene 11 cue: "CREATE VIEW da error" corrected. The error comes from creating the unique clustered index.
6. The code on screen in scenes 5, 7 and 9 is the version that was executed. Its layout differs from the sample in the summary; the statements are the same.

## Still open

- Decision for scene 10 (above).
- Nothing else pending.
