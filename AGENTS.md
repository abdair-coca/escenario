# AGENTS.md

- Code, docs and commits are in English. On-screen text and presenter notes use each presentation's own
  language (`lang` in `presentation.json`).
- Presentations are built with the `presentation` skill in `.claude/skills/presentation/`: summary first,
  then stop for the user's approval before writing any scene.
- Every presentation follows `DESIGN.md`: its `theme.css` imports `library/shared/brand.css`.
- The player has no build step and is served as static files. Browser libraries are copied from
  `node_modules` to `player/vendor/` by `scripts/vendor.mjs`; commit the copied files so it runs offline.
- gsap timelines are thenables: never `await` one or return one from an `async` function.
