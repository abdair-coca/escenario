# How GPS knows where you are

- **Slug:** `como-funciona-el-gps` · **On-screen language:** Spanish (es) · **Code language:** none
- **Audience:** general audience, curious people with no special background. They use the blue dot on their phone's map every day. They think the satellites "see" or "track" the phone, and do not know that the phone only listens and measures time.
- **Duration:** ~5 min · 6 scenes · 19 steps

## The one idea

> "El GPS no te ve: tu teléfono escucha la hora que mandan los satélites, la convierte en distancias y estás donde esas distancias se cruzan."

Written in Spanish on purpose: it is also the closing line on screen.

## The running example

One phone, held by the mascot, lost in the middle of a park in a city. The same phone, the same park and the same satellites appear in every scene. Numbers are round (see the accuracy notes).

| Scene | Where the example shows up |
|---|---|
| 1 | The mascot holds the phone in the park and asks where it is; satellites appear high above |
| 2 | Satellite `#1` sends its time to the phone; it arrives 0,07 s later → 21 000 km |
| 3 | That distance becomes a circle around satellite `#1`; the phone is somewhere on it |
| 4 | Satellites `#2` and `#3` add their circles; the three meet on the phone |
| 5 | The phone's cheap clock is a little wrong, so the circles miss; satellite `#4` fixes it |
| 6 | We go inside the phone's screen: the blue dot lands on the park |

## Look

Brand look from `DESIGN.md` (`library/shared/brand.css`). No extra colours.

- Satellites are drawn as one sticker: a white box body with two `--accent` solar panels (white dots texture), ink outline and hard shadow, with a pill number `#1`…`#4`.
- Signals are the brand *Arrow / link* recipe: dotted paths (`stroke-dasharray="2 14"`) with a small `--accent-2` circle travelling along them, always from satellite to phone, never back.
- Distance circles are 6 px ink outlines with no fill; the one in focus is `--accent`.
- The park is a rounded `--accent-2` patch with two simple cartoon trees; the city is a few white blocks with ink outlines.
- **Decoration and mascot:**
  - Decorations: a ground strip in `--accent-3` and one cartoon cloud at the top-left edge in scene 1; two small four-point sparkles in `--accent-2` at the top edges of scene 2 (space). None in 3–5 so the circles use the whole canvas. One cloud at the top-right edge in scene 6.
  - Mascot: scenes 1 and 6, bottom-right corner (x 1500–1800, y 780–1010), holding the phone. Scene 1: looks up, puzzled. Scene 6: smiles when the dot lands. Nothing else is drawn in that corner.

## Scenes

### 1. Nobody is watching you — new: own

- **Idea:** satellites do not see or track the phone. They only send; the phone only listens.
- **On screen:** headline «¿Cómo sabe el GPS dónde estás?» at the top left. The ground strip along the bottom, the park drawn on it, the mascot with the phone in its corner. High above, three satellites spread across the top third.
- **Enters with:** `cut` (first scene).
- **Entrance (before step 1):** paper, ground strip, cloud, the mascot holding the phone.
- **Steps:**
  1. `pregunta` — the headline writes in · *Cue:* abrimos el mapa y aparece el puntito azul. ¿Cómo lo sabe?
  2. `satelites` — the three satellites pop in, one after another · *Cue:* hay unos treinta satélites GPS dando vueltas a la Tierra, a unos 20 000 km.
  3. `senal` — dotted signals run from each satellite down to the phone; a small arrow back from the phone appears and is crossed out · *Cue:* ellos hablan y el teléfono escucha. El teléfono no les contesta nada.
  4. `idea` — a pill sticker next to the phone: «Solo escucha» · *Cue:* así que el satélite no te ve. Entonces, ¿qué está escuchando?

### 2. A message with the time — new: own

- **Idea:** each satellite keeps sending its number and the exact time. The delay of that message tells the distance, like counting seconds after a lightning bolt.
- **On screen:** headline «Un mensaje con la hora». Left third: a small storm panel (a cloud, a lightning bolt, a «3 s» badge, «≈ 1 km»). Right two thirds: satellite `#1` at the top, the phone at the bottom, a long dotted path between them. Two sparkles at the top edges.
- **Enters with:** `push` towards the sky: the camera rises from the phone to satellite `#1`.
- **Steps:**
  1. `trueno` — the storm panel: the bolt flashes, then a «3 s» badge counts up and «≈ 1 km» appears · *Cue:* ¿cuentan los segundos entre el rayo y el trueno? Tres segundos, un kilómetro. El tiempo de viaje da la distancia.
  2. `mensaje` — satellite `#1` sends a speech-bubble sticker «Soy el #1 · son las 12:00:00,000» that travels down the dotted path · *Cue:* el satélite hace lo mismo: manda su nombre y la hora exacta, sin parar.
  3. `llega` — the bubble reaches the phone; a phone clock badge reads «12:00:00,070», then a big sticker «0,07 s → 21 000 km» · *Cue:* llegó 7 centésimas tarde. La señal viaja a la velocidad de la luz, así que eso son unos 21 000 km.

### 3. One distance is not enough — new: own

- **Idea:** one distance only says "you are somewhere on this circle".
- **On screen:** headline «Una distancia no basta». A top-down map of the city with the park, filling the canvas. Satellite `#1` above the map at the left, its distance circle drawn around the point under it.
- **Enters with:** `reveal`: the scene grows out of the «21 000 km» sticker (`.distance` in scene 2): that number becomes a circle.
- **Steps:**
  1. `circulo` — the circle around satellite `#1` draws itself, labelled «21 000 km» on its edge · *Cue:* sé que estoy a 21 000 km del satélite 1. Pero eso es toda una circunferencia.
  2. `dudas` — four question-mark pins pop on different points of the circle, one of them in the park · *Cue:* podría estar aquí, aquí, o aquí. Cualquier punto del borde cumple.
  3. `falta` — the pins shake once and a pill «¿cuál?» appears · *Cue:* con un solo satélite no alcanza. Necesito más.

### 4. Three circles, one point — new: own

- **Idea:** two circles cross in two points; a third circle picks one. That point is the phone.
- **On screen:** the same map and circle `#1` as at the end of scene 3, with the pins gone. Satellites `#2` and `#3` join at the top and right. Headline «Tres círculos, un punto».
- **Enters with:** `cut`: it continues exactly where scene 3 ends (same map, same circle).
- **Steps:**
  1. `dos` — satellite `#2` and its circle; the two crossing points get two pins · *Cue:* con un segundo satélite, solo quedan dos puntos posibles.
  2. `tres` — satellite `#3` and its circle; it passes through only one of the two pins, the other one turns `--muted` · *Cue:* el tercero decide: solo uno de los dos puntos está a la distancia correcta de los tres.
  3. `aqui` — the remaining pin turns into the phone's blue dot, labelled «¡aquí!» · *Cue:* donde se cruzan las tres, ahí estás. A esto se le llama trilateración.

### 5. Clocks that cannot fail — new: own

- **Idea:** a tiny clock error is a huge distance error. Satellites carry atomic clocks; the phone's cheap clock is corrected with a fourth satellite.
- **On screen:** headline «Relojes que no pueden fallar». Left: a big stopwatch reading «0,001 s», an arrow, and a big sticker «300 km». Right: the three circles of scene 4, small, that miss each other and leave a small triangle.
- **Enters with:** `wipe` in `--accent-3` (navy): a clean break, from geometry to time.
- **Steps:**
  1. `error` — the stopwatch, the arrow and «300 km»; on the right the three circles shift and leave a triangle labelled «no se cruzan» · *Cue:* si el reloj se equivoca una milésima de segundo, el error son 300 km. Y los círculos ya no coinciden.
  2. `atomico` — the satellite sticker gets a badge «reloj atómico» and a tick · *Cue:* por eso cada satélite lleva relojes atómicos, carísimos, que casi no se equivocan.
  3. `cuarto` — the phone with a badge «reloj barato ?»; satellite `#4` pops in, its circle joins, and the triangle closes into one point · *Cue:* tu teléfono no tiene uno. Por eso escucha a un cuarto satélite: con él corrige su propio reloj y los círculos vuelven a cruzarse.

### 6. Inside the phone — new: own

- **Idea:** everything we saw happens in a fraction of a second, every second, and the result is the blue dot.
- **On screen:** headline «Y aparece el puntito». A big phone screen in the middle-left shows the city map with the park. Above it, four numbered pills in a row that read as the recipe: `#1` «escucha», `#2` «mide el tiempo», `#3` «calcula distancias», `#4` «cruza círculos». The mascot in its corner, the cloud at the top-right.
- **Enters with:** `zoom` into the phone's screen (`.phone-screen` in scene 5): we go inside the phone.
- **Entrance (before step 1):** the phone screen with the map, the mascot in its corner.
- **Steps:**
  1. `receta` — the four pills pop in one after another, each pressing as it lands · *Cue:* repasemos: escucha, mide el tiempo, lo convierte en distancia y cruza los círculos.
  2. `punto` — the blue dot drops onto the park with a squash, and the mascot smiles · *Cue:* y lo repite cada segundo. Por eso el puntito te sigue cuando caminas.
  3. `idea` — the one idea writes in across the bottom, left of the mascot's corner · *Cue:* el GPS no te ve: tu teléfono escucha la hora y calcula dónde estás.

## Accuracy notes

- The signal is a radio wave and travels at the speed of light, about 300 000 km/s. So 1 millisecond is 300 km and 1 microsecond is 300 m.
- GPS satellites orbit at about 20 200 km above the ground; the distance to a phone is between about 20 000 and 26 000 km, so the delay is about 0,067–0,086 s. Scene 2 uses 0,07 s → 21 000 km, «aproximadamente».
- The real message is not a clock reading in plain text: it is a coded signal from which the receiver works out when it was sent. The speech bubble is a simplification.
- Scenes 3–5 are drawn flat, with circles on a map. In reality the distances are spheres in 3D. The idea is the same.
- In reality the phone solves position and clock error together with at least four satellites. Scene 5 tells it as "three for the point, a fourth for the clock" to keep it simple.
- GPS has about 31 working satellites. Phones also listen to other systems (Galileo, GLONASS, BeiDou), which is why they often see many more than four.
- Satellite clocks are corrected for relativity (about 38 microseconds per day). Not told on screen; a good answer if someone asks.
- The phone never sends anything to the satellites, and GPS works without internet. The internet only helps to download the map and to find the satellites faster (A-GPS).
- The thunder rule: sound travels about 340 m/s, so 3 s ≈ 1 km.

## Reuse

- **Library scenes:** none fits. `bst-walk` is a tree with code, `result-grid` is a table, and `pipeline` is boxes joined by arrows; a map with circles that cross is clearer as own scenes.
- **New scenes:** 1–6 stay in `presentations/como-funciona-el-gps/scenes/`. Scenes 3, 4 and 5 share the map, the satellite sticker and the circle geometry, so they share a small helper in the presentation's own folder (`scenes/kit.js`). Scenes 1, 2 and 5 share the satellite and the phone. If another deck needs a satellite or a map, they could be promoted to `library/` later.
- **Shared helpers:** `library/shared/scene-kit.js`, plus a new `library/shared/sticker-kit.js` with the DESIGN.md recipes (hard-shadow shapes, sticker text, pills, mascot, arrow, sparkle, cloud) so future decks can reuse them instead of copying them. Circles and signals are drawn with the DrawSVG plugin already in `player/vendor/gsap/`. No new browser library.
- **Fonts:** Fredoka from the brand. No code font is needed.
- **Transitions:** cut (1) · push towards the sky (2) · reveal from the distance (3) · cut (4) · wipe in `--accent-3` (5) · zoom into the phone screen (6). Five types, each caused by something on screen.
