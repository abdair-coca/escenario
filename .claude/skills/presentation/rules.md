# Rules

## Clarity

- One idea per scene. Show it as a picture that changes, never as a list of bullets.
- A diagram grows one part per step, the part the narrator is naming. Never the whole diagram at once.
- Each step grows out of the previous one when possible: a point becomes a population, a bar becomes an axis.
- Labels sit on the part they name, with a leader line when needed. No legends.
- All content inside the central 90% of the canvas (x 96–1824, y 54–1026).
- Text meant to be read is at least 40 px on the 1920×1080 canvas.

## Motion

- Arrivals: long-tail ease-out (`expo.out`, `power4.out`).
- Camera moves: `power2.inOut`.
- Exits accelerate (`power3.in`) and last 40–50% less than the matching entrance.
- The next element starts when the previous one is 30–50% done.
  Stagger 60–120 ms between words, 40–80 ms between list items.
- A quick move lasts 0.3–0.6 s.
- A title that has arrived stays still: no floating, breathing or slow scaling.
- Vary entrances: scenes do not all enter the same way. Use 3–5 transition types per presentation,
  each one caused by something on screen.

## Review checklist

For every screenshot:

- A stranger understands the step without the narration. If an object needs explaining to be recognised,
  that is a serious error: redraw it.
- Text is at least 40 px; nothing is cut off or outside the 90% area; nothing overlaps by accident.
- None of the banned looks: dark background with floating things · glows and particles ·
  three cards in a row · everything entering with fade + slide up.
- The step matches the summary: what appears on that click is what the summary promised.
