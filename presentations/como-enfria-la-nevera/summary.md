# How a fridge cools

- **Slug:** `como-enfria-la-nevera` · **On-screen language:** Spanish (es) · **Code language:** none
- **Audience:** general audience, curious people with no special background. They use a fridge every day. They do not know that cold is only the absence of heat, nor that a fluid can boil at a very low temperature.
- **Duration:** ~5 min · 6 scenes · 21 steps

## The one idea

> "Una nevera no fabrica frío: un líquido da vueltas por un tubo y se lleva el calor de dentro hacia fuera."

Written in Spanish on purpose: it is also the closing line on screen.

## The running example

One carton of milk, just back from the shop at about 25 °C, put on a shelf of the fridge. The same carton, the same fridge and the same tube appear in every scene. The temperatures are round numbers (see the accuracy notes).

| Scene | Where the example shows up |
|---|---|
| 1 | The warm carton inside the fridge; its heat leaves through the wall into the kitchen |
| 2 | The carton sits in the «dentro» zone of the loop; the tube joins the inside and the kitchen |
| 3 | The carton's heat reaches the coil and boils the cold liquid |
| 4 | The gas that left the coil is squeezed and gets hotter than the kitchen |
| 5 | The hot gas gives its heat to the kitchen air and becomes liquid again |
| 6 | The loop closes with the valve; the carton's badge falls from 25 °C to 4 °C |

## Look

Brand look from `DESIGN.md` (`library/shared/brand.css`). This topic adds one extra:

| Role | Hex | Used for |
|---|---|---|
| `--warm` (orange) | `#EA580C` | heat and hot things: heat arrows, hot gas, the warm side of the loop (scenes 1, 3, 4, 5, 6). Never for right or wrong |

Cold is the brand blue: `--accent` for the fluid in focus, `--accent-2` for the inside zone and cold droplets.

- **Decoration and mascot:**
  - Decorations: a ground strip in `--accent-3` at the bottom of scene 1 (the fridge stands on the floor) and a small four-point sparkle in `--accent-2` at the top-right edge of scenes 3 and 6 (cold). Never more than two per scene, never behind text.
  - Mascot: two scenes. Scene 1: bottom-right, in its own reserved corner (x 1500–1800, y 800–1010), looks at the carton. Scene 6: the same corner, smiling after the carton is cold. Nothing else is drawn in that corner, and no arrow or line enters it. It is absent from 2–5 so the diagrams use the whole canvas.
  - The kitchen is shown as a paper-white zone with a dotted floor line, not as a decoration.

## Scenes

### 1. Moving heat, not making cold — new: own

- **Idea:** a fridge does not create cold. It takes the heat of what is inside and sends it outside.
- **On screen:** headline «¿Cómo enfría una nevera?» at the top left. A big cutaway fridge on the left (x 160–1020, y 220–960): a paper-white inner wall with an `--accent-2` interior and two shelves. On the middle shelf, the milk carton with a warm badge «25 °C». To the right of the fridge, the open kitchen zone (x 1100–1820), empty at first. The ground strip runs along the bottom under the fridge.
- **Enters with:** `cut` (first scene, nothing before it).
- **Entrance (before step 1):** paper, ground strip, the mascot in its corner.
- **Steps:**
  1. `pregunta` — the headline writes in · *Cue:* todos usamos la nevera, pero ¿cómo es que enfría?
  2. `nevera` — the fridge pops in with the carton and its badge «25 °C» · *Cue:* metemos una leche recién comprada, tibia.
  3. `calor` — three big orange arrows leave the carton, cross the wall and end in the kitchen zone, labelled «calor» · *Cue:* la nevera no inventa frío: saca el calor de la leche y lo tira a la cocina.
  4. `idea` — a pill sticker in the kitchen zone: «Mueve calor» · *Cue:* su trabajo es mover calor de dentro hacia fuera. ¿Cómo lo hace? Con un tubo.

### 2. A closed loop — new: own

- **Idea:** a sealed tube runs in a circle between the inside of the fridge and the kitchen, carrying a fluid that never leaves it.
- **On screen:** headline «Un circuito cerrado». The canvas is split in two big zones with an ink line between them: «dentro» on the left (`--accent-2` panel with the carton, smaller) and «cocina» on the right (paper). A rectangular loop of tube (a thick ink-outlined tube with a white core) runs through both zones, filling the canvas from x 260 to x 1660 and y 260 to y 860. A drop of fluid, drawn as a blue circle with an ink outline, travels around it. The label «refrigerante» sits on the tube.
- **Enters with:** `zoom` into the fridge's back wall (`.fridge-back` in scene 1): we go behind the wall and find the tube.
- **Steps:**
  1. `zonas` — the two zones and their labels «dentro» and «cocina», with the carton in the left one · *Cue:* separamos lo de dentro de la nevera y la cocina.
  2. `tubo` — the tube draws itself round the loop, crossing both zones · *Cue:* un tubo cerrado, que va y viene entre los dos sitios.
  3. `liquido` — the tube fills with blue fluid and a drop makes one full turn, clockwise, labelled «refrigerante» · *Cue:* por el tubo da vueltas un líquido especial, el refrigerante. Nunca sale: siempre es el mismo.

### 3. Inside: the liquid boils — new: own

- **Idea:** inside, the very cold liquid boils and, to boil, it takes heat from the milk. Boiling does not always mean hot: it depends on the pressure.
- **On screen:** headline «Dentro: el líquido hierve». The «dentro» zone fills the screen. The carton with its badge «25 °C» sits at the left. In the middle, a big zig-zag coil of tube (the evaporator) with six or seven turns, 90 px thick. Small blue droplets enter at the bottom of the coil. A small sparkle at the top-right edge.
- **Enters with:** `reveal`: the scene grows out of the coil (`.coil-in` in scene 2), the way the tube widens into the real coil.
- **Steps:**
  1. `bobina` — the coil and the small blue droplets entering at its bottom, labelled «líquido muy frío» · *Cue:* en el interior, el tubo se enrolla en una bobina. El líquido llega muy frío, bajo cero.
  2. `calor` — three orange arrows go from the carton to the coil · *Cue:* la leche está más caliente que el líquido, así que su calor pasa hacia él.
  3. `hierve` — as the arrows arrive, the droplets grow into big white bubbles that fill the upper turns, labelled «hierve» · *Cue:* con ese calor el líquido hierve y se convierte en gas. Hervir a esta temperatura es posible porque la presión es baja.
  4. `gas` — the coil's exit tube, now full of bubbles, leaves to the right with a label «gas, con el calor de la leche» · *Cue:* ese gas se va con el calor dentro. Y la leche queda un poco más fría.

### 4. The pump squeezes and heats — new: own

- **Idea:** the compressor squeezes the gas, and squeezing a gas heats it. Now it is hotter than the kitchen, so its heat can flow out.
- **On screen:** headline «La bomba aprieta y calienta». A big cylinder with a piston across the centre (x 380–1540, y 300–800), like a bike pump. On the left, eight round bubbles in `--accent-2` spread out inside. On the right of the piston, the same eight bubbles end up packed into a small corner and turn orange. Labels: «gas frío» on the left, «gas caliente» on the right with «más que la cocina». No sparkle, no mascot.
- **Enters with:** `push` left: the camera follows the gas as it leaves the coil to the right, along the top of the loop.
- **Steps:**
  1. `gas` — the cylinder and the eight spread-out bubbles, labelled «gas frío» · *Cue:* el gas llega a la bomba, el compresor.
  2. `aprieta` — the piston moves right and the bubbles pack tight, labelled «apretado» · *Cue:* el compresor lo aprieta en un espacio mucho menor. Es como la bomba de una bici.
  3. `caliente` — the bubbles turn orange, label «gas caliente · ≈ 60 °C» · *Cue:* al apretar un gas, se calienta, como el tubo de la bomba de bici. Ahora está más caliente que la cocina.

### 5. Behind: the heat leaves — new: own

- **Idea:** the hot gas is hotter than the kitchen, so it gives its heat to the room and turns back into liquid. This is why the back of a fridge is warm.
- **On screen:** headline «Detrás: sale el calor». The «cocina» zone fills the screen, with a dotted floor line. A big coil (the condenser) with six or seven turns on the right two thirds. Orange bubbles enter at the top. On the far left, a sticker «cocina · 22 °C» as the reference. No sparkle, no mascot.
- **Enters with:** `wipe` in `--warm` (orange) from the top: the hot gas from the pump runs into the condenser, so the wipe is that gas.
- **Steps:**
  1. `bobina` — the coil with orange bubbles entering at the top, labelled «gas caliente» · *Cue:* el gas caliente pasa por otra bobina, esta vez fuera, detrás de la nevera.
  2. `calor` — big orange arrows leave the coil into the room, labelled «calor a la cocina» · *Cue:* como está más caliente que la cocina, su calor sale al aire. Por eso la parte de atrás de una nevera está tibia.
  3. `liquido` — the orange bubbles turn into blue droplets towards the bottom of the coil, labelled «otra vez líquido» · *Cue:* al soltar el calor, el gas se vuelve líquido.

### 6. The loop never stops — new: own

- **Idea:** one last narrow part, the valve, lowers the pressure and makes the liquid very cold again, so the loop starts over and the milk keeps cooling.
- **On screen:** headline «Un viaje sin fin». The loop of scene 2 comes back with the three stations already seen as sticker badges on it, numbered with tilted pills: `#1` coil inside (blue), `#2` pump (orange), `#3` coil behind (orange). The bottom of the loop has a gap. The zones «dentro» and «cocina» are as in scene 2, with the carton and its badge in the left one. A small sparkle at the top-right edge. The mascot is in its corner; the loop keeps clear of it (the loop's lower side stays above y 800).
- **Enters with:** `push` up: the camera slides down from the condenser along the loop to the bottom, where the valve goes.
- **Entrance (before step 1):** the loop with the three stations, the gap at the bottom, the carton with «25 °C», the mascot in its corner.
- **Steps:**
  1. `valvula` — the narrow valve appears in the gap, with the pill `#4` and the label «válvula: baja la presión»; the liquid after it turns blue again · *Cue:* falta una pieza: una válvula estrecha por donde el líquido pasa con menos presión, y se enfría mucho.
  2. `giro` — a blue drop runs the whole loop once, passing `#1` to `#4` in order, each pill pressing as it passes · *Cue:* y vuelta a empezar: hierve dentro, se aprieta, suelta el calor fuera y se enfría en la válvula.
  3. `leche` — the carton's badge falls «25 °C» → «4 °C» and the mascot smiles · *Cue:* cada vuelta saca un poco más de calor de la leche, hasta que queda fría.
  4. `idea` — the one idea writes in across the bottom, left of the mascot's corner · *Cue:* así que una nevera no fabrica frío: se lleva el calor.

## Accuracy notes

- «Frío» is only little heat. Heat always flows from hot to cold. That is why the liquid must be colder than the milk (scene 3) and the gas hotter than the kitchen (scene 5): heat would not flow otherwise.
- The temperatures are rounded and depend on the fluid and the model: the liquid in the coil is about −20 °C, the hot gas about 60 °C, a fridge is set at about 4 °C. Say «aproximadamente».
- Boiling at a very low temperature is not magic: for the same fluid, lower pressure means a lower boiling point. The pump (scene 4) raises the pressure and the valve (scene 6) lowers it. Water works the same way: it boils at less than 100 °C on a high mountain.
- Simplification in scene 3: the coil does not touch the milk. In a real fridge the coil sits behind the inner wall and the cold air carries the heat from the carton to it. The orange arrows stand for that path.
- Simplification in scene 4: a real fridge compressor is a sealed motor with a small piston or rotor, not a bike pump. It is drawn as a pump only to show what squeezing does.
- The kitchen as a whole does not get colder: the fridge sends out the heat of the milk plus the energy used by the motor. Leaving the door open does not cool the room; it warms it a little.
- The drawing is a cartoon, not to scale: the real tube is much longer and thinner.

## Reuse

- **Library scenes:** none fits. `bst-walk` is a tree with code, `result-grid` is a table, and `pipeline` is boxes joined by arrows (not DESIGN.md compliant yet). A loop that closes and changes state is clearer as own scenes, so `pipeline` is not used.
- **New scenes:** 1–6 stay in `presentations/como-enfria-la-nevera/scenes/`. Scenes 3 and 5 share a coil with bubbles that change state, and scenes 2 and 6 share the loop geometry; they can share a small helper in the presentation's own folder. If another deck needs a closed loop with a moving drop, the loop from scene 2 could be promoted to `library/` later.
- **Shared helpers:** `library/shared/scene-kit.js` only. Tubes and arrows are drawn with the DrawSVG plugin already in `player/vendor/gsap/`. No new browser library.
- **Fonts:** Fredoka from the brand. No code font is needed.
- **Transitions:** cut (1) · zoom (2) · reveal (3) · push left (4) · wipe in `--warm` (5) · push up (6). Five types, each caused by something on screen.
