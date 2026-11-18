# escenario

Animated presentations that look like an explainer video, narrated live (or recorded with OBS) in your
own voice. Each click plays the next animation; you talk over it. Scenes are HTML/CSS/SVG + GSAP,
reusable across presentations through props, and Claude Code builds them for you from a one-line request.

- **No build step.** Static files and a browser. Libraries and fonts are vendored, so it runs offline.
- **One look.** Every deck follows [DESIGN.md](DESIGN.md): white paper, blue panels, thick ink outlines,
  hard shadows, Fredoka.
- **Made for talking.** Presenter window with notes per step, next-step preview and a timer;
  a recording mode with no controls for OBS.
- **Reviewed by screenshots.** A script captures every step and audits text size and the safe area.

## Presentations

| Slug | Topic | Language |
|---|---|---|
| `arboles-binarios` | Binary search trees with Python | Spanish |
| `explicador` | How the *explicador* plugin explains a codebase | Spanish |
| `rag` | How RAG works: embeddings, cosine, retrieval | English |
| `triggers-cursores` | SQL Server triggers and cursors | Spanish |

## Open a presentation

```sh
npm install
npm start
```

Then open `http://localhost:3000/player/index.html?p=<slug>` — `<slug>` is a folder in `presentations/`.
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
and waits for your approval; then it builds the scenes in the [DESIGN.md](DESIGN.md) style and reviews
them with screenshots.

## Layout

```
DESIGN.md          the visual standard every presentation follows
player/            the player (no build step) and player/vendor/ libraries and fonts
library/           reusable scenes; library/shared/brand.css holds the design tokens
presentations/     one folder per presentation: summary.md, presentation.json, theme.css, scenes/
scripts/           vendoring, syntax check, screenshots
tests/             unit and browser tests
screenshots/       PNGs from `npm run screenshots <slug>` (not committed)
```

## Checks

```sh
npm run check                 # syntax of every script + unit and browser tests
npm run screenshots <slug>    # one PNG per step + audit of text size and safe area
```

Browser tests and screenshots use the installed Google Chrome (Playwright falls back to its own Chromium).

## Built with

[GSAP](https://gsap.com) for animation · [Fredoka](https://fonts.google.com/specimen/Fredoka),
[Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) and
[JetBrains Mono](https://www.jetbrains.com/lp/mono/) via Fontsource · [Playwright](https://playwright.dev)
for tests and screenshots · [Claude Code](https://claude.com/claude-code) for writing the scenes.
