# Why the sky is blue

- **Slug:** `cielo-azul` · **On-screen language:** Spanish (es) · **Code language:** none
- **Audience:** general audience, curious people with no special background. They know the sky is blue and the sun is bright. They do not know what light is made of or what happens in the air.
- **Duration:** ~5 min · 6 scenes · 21 steps

## The one idea

> "El aire desvía la luz azul mucho más que la roja, así que el cielo se ve azul."

Written in Spanish on purpose: it is also the closing line on screen.

## The running example

One sunbeam at midday, from the Sun to a person's eye, through a column of air. The column is illustrative, not to scale.

| Scene | Where the example shows up |
|---|---|
| 1 | The beam looks white; inside it, a short blue wave and a long orange wave |
| 2 | The beam's path: Sol → Aire → Ojo |
| 3 | Inside the air column, the beam hits molecules and changes direction |
| 4 | One molecule: the blue wave bounces many times more than the orange one |
| 5 | Blue from every part of the sky reaches the same eye; the sun's direct beam hardly bounces |
| 6 | At sunset the beam crosses more air: the blue leaves it on the way, the orange reaches the eye |

## Look

Brand look from `DESIGN.md` (`library/shared/brand.css`). This topic adds one extra:

| Role | Hex | Used for |
|---|---|---|
| `--warm` (orange) | `#EA580C` | long waves: the orange end of sunlight (scenes 1, 4, 6) and the light that reaches the eye at sunset (scene 6). Never for right or wrong |

- **Decoration and mascot:** Decorations: cartoon clouds at the top edge in scenes 1 and 5; a ground strip in `--accent-3` at the bottom in scenes 5 and 6 (the horizon). The sun is a starburst sticker (paper fill, ink outline); it is part of the diagram, not a decoration. The mascot appears in two scenes: in scene 1 (bottom-left, looks up at the sun) and in scene 5 (bottom-centre, under the dome; the beams end at its eyes). It is absent from 2, 3, 4 and 6 so the diagrams stay clean.

## Scenes

### 1. Sunlight is a mix of colours — new: own

- **Idea:** sunlight looks white, but it holds waves of every length: the short ones look blue, the long ones orange.
- **On screen:** headline «¿Por qué el cielo es azul?». A starburst sun with a white beam. Inside the beam, a dense blue wave labelled «onda corta: azul» and a wide orange wave labelled «onda larga: naranja», with «y todos los colores entre medias». The mascot sits bottom-left and looks up at the sun. One cloud at the top right.
- **Enters with:** `cut` (first scene, nothing before it).
- **Entrance (before step 1):** paper, the mascot, the cloud.
- **Steps:**
  1. `pregunta` — the headline writes in · *Cue:* casi todos hemos visto el cielo azul sin preguntarnos por qué.
  2. `sol` — the sun and its white beam · *Cue:* la luz del sol parece blanca.
  3. `ondas` — the two labelled waves appear inside the beam · *Cue:* pero esa luz blanca es una mezcla de ondas de todos los tamaños. Las cortas se ven azules; las largas, naranjas o rojas.

### 2. The path of the light — library `pipeline` (props: three pieces, two links, one packet)

- **Idea:** the light travels from the Sun to your eye through the air, and the air in the middle changes its colour.
- **On screen:** headline «El camino de la luz». Three boxes in a row: «Sol» → «Aire» → «Ojo». The link Sol → Aire is labelled «luz blanca», the link Aire → Ojo «luz». The Aire box has the caption «moléculas de aire». A packet (the beam) travels along the path.
- **Enters with:** `push` left: the beam of scene 1 leaves to the left and the path comes in from the right, as the light moves on.
- **Steps:**
  1. `sol` — the piece «Sol» · *Cue:* el rayo sale del sol.
  2. `aire` — the piece «Aire» and the link «luz blanca» from Sol · *Cue:* antes de llegar a ti, la luz atraviesa el aire.
  3. `ojo` — the piece «Ojo» and the link «luz» to it · *Cue:* esa capa de aire es la que cambia el color.
  4. `rayo` — the packet travels from Sol to Ojo · *Cue:* sigamos el rayo y veamos qué pasa dentro del aire.

### 3. Bounces in the air — new: own

- **Idea:** light does not pass straight through air. It hits molecules and leaves in another direction.
- **On screen:** headline «Choques en el aire». The Aire box (`.piece-aire` in scene 2) grows into a tall column of small molecules: ink-outlined circles in `--accent-2`, captioned «moléculas de aire». The white beam enters at the top. At a molecule, short ink arrows leave in several directions.
- **Enters with:** `zoom` into the Aire box of scene 2 until it fills the screen and becomes the column.
- **Steps:**
  1. `columna` — the molecules appear inside the column · *Cue:* el aire parece vacío, pero está lleno de moléculas, diminutas comparadas con una onda de luz.
  2. `rayo` — the white beam enters at the top · *Cue:* al principio, la luz avanza en línea recta.
  3. `choque` — at a molecule the beam scatters: short arrows leave in every direction · *Cue:* cada choque la envía en otra dirección. A esto se le llama dispersión.

### 4. Blue bounces more — new: own

- **Idea:** short waves are scattered far more than long ones. Blue is scattered about 5 times as much as orange (approximate: about 450 nm against 700 nm), so the scattered light is mostly blue.
  Accuracy note for Q&A: violet scatters even more, but sunlight carries less violet and the eye responds less to it, so the sky looks blue, not violet.
- **On screen:** headline «El azul rebota más». One molecule in the centre. An orange wave passes almost straight through, with a few arrows. A blue wave hits the molecule and scatters in many directions. Below, two bars: «azul» long, «naranja» short, with the label «azul ≈ 5 × naranja (aprox.)».
- **Enters with:** `wipe`: a blue wipe (`--accent`) crosses from the air column of scene 3 to this molecule. The wipe is the blue light we are now following.
- **Steps:**
  1. `molecula` — one molecule in the centre · *Cue:* vamos a comparar dos colores en la misma molécula.
  2. `naranja` — the orange wave passes almost straight through · *Cue:* la onda larga casi no se desvía.
  3. `azul` — the blue wave scatters in many directions · *Cue:* la onda corta choca y se desvía muchas más veces.
  4. `barras` — the two bars and «azul ≈ 5 × naranja (aprox.)» · *Cue:* el número es aproximado; lo importante es la diferencia.

### 5. Blue from every part of the sky — new: own

- **Idea:** every part of the sky sends blue light toward you, because there is air above you in every direction. The exception is right next to the sun, which is much brighter than the scattered light.
- **On screen:** headline «Azul desde todo el cielo». A dome of air (paper fill, ink outline) labelled «aire». Blue arrows (`--accent`) reach the mascot's eyes from many points along the dome. The sun, a starburst, sits at the top right with a straight white beam to the eyes, labelled «luz directa». Ground strip at the bottom.
- **Enters with:** `reveal`: the dome opens out of the blue arrow of scene 4. The blue scattering from one molecule grows into the sky.
- **Entrance (before step 1):** the mascot (bottom-centre), the ground strip, one cloud at the top left.
- **Steps:**
  1. `cupula` — the dome, labelled «aire» · *Cue:* el aire te rodea por todas partes, como una cúpula.
  2. `azul` — blue arrows reach the eyes from many points on the dome · *Cue:* desde cualquier punto del cielo llega luz azul hasta tus ojos.
  3. `sol` — the sun and its direct beam, labelled «luz directa» · *Cue:* la luz directa del sol casi no rebota; el azul viene del aire.

### 6. At sunset — new: own

- **Idea:** at sunset the beam crosses much more air. On the way the blue is scattered out of the beam, so what reaches the eye is orange.
- **On screen:** headline «Al atardecer». An eye sticker at the right, the same eye as the end of the beam. A long, slanted band of air labelled «más aire» across the middle. A ground strip at the bottom. The sun, a starburst, sits low on the horizon at the left, its beam slanting through the band to the eye. Blue arrows drop out of the beam along the way, labelled «azul fuera del rayo». The orange wave reaches the eye, labelled «naranja».
- **Enters with:** `push` down: the dome of scene 5 slides down and away, and the view moves to the horizon as the sun sinks.
- **Entrance (before step 1):** the eye, the band of air «más aire», the ground strip.
- **Steps:**
  1. `sol` — the sun on the horizon and its beam to the eye · *Cue:* al atardecer, la luz atraviesa mucho más aire.
  2. `azul` — blue arrows leave the beam along the way · *Cue:* por el camino, el azul sale del rayo.
  3. `naranja` — the orange wave reaches the eye · *Cue:* lo que llega al ojo es naranja o rojo: por eso el atardecer se ve cálido.
  4. `idea` — the one idea writes in under the scene · *Cue:* cerramos con la idea.

## Reuse

- **Library `pipeline`** (existing, `library/pipeline.html`) is used once, in scene 2, with three pieces («Sol», «Aire», «Ojo»), two labelled links and one packet. Its geometry is generic; the packet is the beam.
- **New scenes:** 1, 3, 4, 5, 6 stay in `presentations/cielo-azul/scenes/`. None is generic enough for `library/` yet. The two-bar comparison in scene 4 could be promoted later if another deck needs it.
- **Shared helpers:** none beyond `library/shared/scene-kit.js`. The waves are drawn with the DrawSVG plugin already in `player/vendor/gsap/`. No new browser library.
- **Fonts:** Fredoka from the brand. No code font is needed.
- **Transitions:** cut (1) · push (2) · zoom (3) · wipe (4) · reveal (5) · push (6). Five types, each caused by something on screen.
