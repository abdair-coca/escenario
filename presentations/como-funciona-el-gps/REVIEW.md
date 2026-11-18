# Review — como-funciona-el-gps

Last run: `npm run screenshots como-funciona-el-gps` → 19 screenshots, 0 audit issues, 0 errors.
Every PNG of the last run was opened and checked against the review checklist in `rules.md`.

## Per scene

### 1. nobody-watching
- Found: nothing to fix. Satellites, dotted signals into the phone, the crossed-out reply arrow and «Solo escucha» all read without narration.
- Note: the reply arrow and its red cross sit just above the mascot, at the top edge of its corner. Nothing overlaps the mascot itself.

### 2. time-message
- Found: the bolt faded to 25 % during the counter, which left a grey half-transparent bolt (DESIGN.md bans transparency effects). **Changed:** the bolt now stays solid.
- Found: the result read in the wrong order: «tardó 0,07 s» → «21 000 km» on top, and the arrival time below them, although the arrival time appears first. **Changed:** it now reads top-down: «llegó a las 12:00:00,070», «tardó 0,07 s», arrow, «21 000 km».

### 3. one-circle
- Found: nothing to fix. Ring, «21 000 km» tag, four «?» pins (one in the park) and «¿cuál?» are clear.

### 4. three-circles
- Found: the discarded pin was scaled to 0.85, so its «?» fell under 40 px (audit), and it was half transparent. **Changed:** it now only turns `--muted` grey, at full size and fully opaque.
- Found: ring #2 had already turned ink at the `dos` hold, because the un-focus was set exactly on the label. **Changed:** the un-focus now happens 0.05 s after the hold, so each new ring is blue in its own step.

### 5. clocks
- Found: ring #4 used `drawSVG`, but its radius changes while the clock error shrinks, which would leave a gap in the circle. **Changed:** ring #4 pops in with a scale instead.
- Remains: the «no se cruzan» triangle is small (the three rings miss each other by a few pixels near the dot). The leader line points at it and the narration covers it. If it should be more obvious, raise `ERROR` in `clocks.html` (now 70).

### 6. blue-dot
- Found: the four recipe pills touched each other because of their tilt. **Changed:** spacing 125 → 140 px and tilt ±3° → ±1°.
- Note: the closing line takes three lines at 56 px (y 836–1020), still inside the safe area and left of the mascot's corner.

## Shared code

- New `library/shared/sticker-kit.js`: the DESIGN.md recipes (hard-shadow shapes, sticker text, pills, mascot, arrow, sparkle, cloud), taken from the fridge deck's kit so other decks can reuse them. The fridge deck still uses its own copy. Moving it to the shared kit is a possible follow-up, not done here.
- `scenes/kit.js` (this deck): satellite, phone, city map, rings, signals, pins, blue dot.

## Transitions

cut (1) · push down, so the camera rises to the sky (2) · reveal from «21 000 km» (3) · cut, a seamless continuation (4) · wipe in `--accent-3` (5) · zoom into the phone screen (6).
Screenshots show rest states only. The transitions were not checked visually.
