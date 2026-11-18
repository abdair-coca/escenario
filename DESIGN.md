# Design

Every presentation uses one look, taken from [Abdair Coca's GitHub profile](https://github.com/abdair-coca):
a cheerful, hand-made cartoon style. White paper, blue panels, thick black outlines, hard shadows,
round shapes and a rounded font. It reads like a sticker sheet, not like a corporate slide.

The tokens live in [`library/shared/brand.css`](library/shared/brand.css). This file says how to use them.
It extends the scene rules in [`.claude/skills/presentation/rules.md`](.claude/skills/presentation/rules.md);
where both speak, the rules win (text size, safe area, motion timing).

## Apply it

A presentation's `theme.css` imports the brand and adds only what that topic needs:

```css
@import url("../../library/shared/brand.css");

:root {
  /* topic extras only, for example a colour for one kind of object */
}
```

Do not redefine the brand colours or fonts per presentation. The summary's **Look** section points
here and lists only the extras.

## Colour

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FFFFFF` | canvas, cards, inner fills |
| `--ink` | `#111318` | text, every outline, every shadow |
| `--accent` | `#2563EB` | the thing in focus now; big panels and title bands |
| `--accent-2` | `#93C5FD` | fill of secondary shapes, highlights, the second of a pair |
| `--accent-3` | `#1E3A8A` | navy: ground strips, deep bands, a third fill |
| `--blue-mid` | `#3B82F6` | small details: bars inside cards, dots, cheeks |
| `--slate` | `#334155` | secondary text that must still be read |
| `--muted` | `#94A3B8` | discarded, not in focus |
| `--ok` · `--block` | `#16A34A` · `#DC2626` | only right/wrong, pass/fail; never decoration |

- The palette is blue on white. One blue (`--accent`) carries the focus; the other blues are supporting fills.
- White text goes only on `--accent` or `--accent-3`, always with an ink stroke (see *Sticker text*).
- No gradients, no glows, no transparency effects other than the dot texture and soft ground shadows.

## Type

| Role | Font | Weight | Sizes on 1920×1080 |
|---|---|---|---|
| Titles, labels | Fredoka | 700 | 72 · 96 · 160 |
| Body, captions | Fredoka | 500–600 | 40 · 56 |
| Code, numbers in code | JetBrains Mono | 400 · 700 | 40 · 44 |

- 40 px is the minimum for anything meant to be read.
- Titles are short (one line, two at most) and sentence case.
- Labels sit on or next to the shape they name, never in a legend.

## Shape

Every visible object is drawn as a flat sticker:

- **Outline:** `--ink`, 6 px on panels and big shapes, 4 px on small ones (≤ 80 px). Round joins and caps.
- **Corners:** `--radius` (32 px) on panels and cards; pills and badges are fully round (`rx = height / 2`).
- **Hard shadow:** a copy of the shape in `--ink`, offset 10 px right and 10 px down (6 px on small shapes),
  drawn *behind* the shape. Never blurred. In HTML use `box-shadow: var(--shadow)`.
- **Fills:** flat `--paper`, `--accent`, `--accent-2` or `--accent-3`.
- **Tilt:** badges, stickers and step numbers may sit rotated −6° to +6°. Panels and diagrams stay straight.

### Recipes

**Panel** — a rounded white card with an ink outline and hard shadow. A title band across its top in
`--accent` with a 6 px ink line under it, like a window bar. Optional three round "window dots"
(white, `--accent-2`, `--accent-3`, 4 px outline) at the band's left.

**Pill / badge** — rounded rectangle `rx = h/2`, `--accent` fill, ink outline and hard shadow,
white Fredoka 700 text. Use for tags, step numbers (`#1`, `#2`), short status.

**Sticker text** — for titles on blue and for big words that must pop:

```svg
<!-- shadow copy, then the face; both stroked with ink behind the fill -->
<text x="86" y="166" fill="#111318" stroke="#111318" stroke-width="10"
      paint-order="stroke" stroke-linejoin="round">Title</text>
<text x="80" y="160" fill="#FFFFFF" stroke="#111318" stroke-width="10"
      paint-order="stroke" stroke-linejoin="round">Title</text>
```

**Arrow / link** — 6 px ink stroke with round caps, or a dotted path (`stroke-dasharray="2 14"`, round caps)
for something that travels. A small circle in `--accent-2` with an ink outline is the "thing moving" along it.

**Code panel** — a Panel whose band reads the file name; code in JetBrains Mono on white,
the line in focus on an `--accent-2` bar.

## Texture and decoration

- **Paper:** faint blue dot grid (already on `.scene-host` through the brand).
- **Blue panels:** white dots at 16 % on `--accent` (`--dots-on-blue`), 22–36 px spacing.
- **Decoration:** cartoon clouds (white circles with an ink outline merged into one shape), a starburst,
  small four-point sparkles in `--accent-2`, a ground strip in `--accent-3`. Mark them `data-decor`.
  At most two decorations per scene, kept at the edges, never behind text.
- **Mascot (optional):** a round blob in `--accent-2` with big white eyes, ink pupils and a small smile,
  outlined in ink. It can point at, react to or carry the running example. One per presentation at most.

## Motion

The profile's SVGs loop forever; scenes cannot (`repeat: -1` and CSS animations are banned by the contract).
Translate the same personality into timeline tweens:

- Arrivals pop: scale from 0.6–0.8 with `back.out(1.6)` or `expo.out`, or drop in from above with a short
  squash (`scaleY` 0.9 → 1) on landing. Mix with draws (`drawSVG`) for lines and outlines.
- A shape in focus can **press**: move 6 px toward its shadow (shadow shrinks) and back, 0.3 s.
- Decorations do not move once they arrive. Titles stay still once they arrive.
- Follow the rules for eases, stagger and transition variety. The default `wipe` uses `--accent`.

## Avoid

- Dark backgrounds, neon, glows, particles, blurred shadows, gradients.
- Thin 1–2 px strokes or outline-less shapes: everything has its ink outline.
- Sharp corners on panels and cards.
- Three equal cards in a row, bullet lists, everything entering with fade + slide up.
- Colours outside the table above.
