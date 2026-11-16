# escenario

Animated presentations that look like an explainer video, narrated live (or recorded with OBS) in your
own voice. Scenes are HTML/CSS/SVG + GSAP, reusable across presentations through props.

## Open a presentation

```sh
npm install
npm start
```

Then open `http://localhost:3000/player/index.html?p=<slug>` — `<slug>` is a folder in `presentations/`.
The demo: `http://localhost:3000/player/index.html?p=arboles-binarios` (binary search trees with Python, in Spanish).
The URL keeps the scene and step (`&s=3&k=2`), so reloading resumes where you were.

## Shortcuts

| Key | Action |
|---|---|
| → · Space · PageDown | play to the next step (finishes the current animation if one is running) |
| ← · PageUp | jump to the previous step's resting state |
| I | scene index (click, ↑/↓ + Enter, or the scene number) |
| P | presenter window: notes, next-step preview, timer (T start/pause, R reset) |
| G | recording mode: no controls, hidden cursor — capture this window in OBS |
| F | full screen |

## Ask for a new presentation

In Claude Code, inside this folder: *"Make a presentation about <topic> for <audience>"*.
The `presentation` skill (`.claude/skills/presentation/`) writes `presentations/<slug>/summary.md` first
and waits for your approval; then it builds the scenes and reviews them with screenshots.

## Layout

```
player/            the player (no build step) and player/vendor/ libraries
library/           reusable scenes
presentations/     one folder per presentation: summary.md, presentation.json, theme.css, scenes/
screenshots/       PNGs from `npm run screenshots <slug>` (not committed)
```

## Checks

```sh
npm run check                 # syntax of every script + unit and browser tests
npm run screenshots <slug>    # one PNG per step + audit of text size and safe area
```

Browser tests and screenshots use the installed Google Chrome (Playwright falls back to its own Chromium).
