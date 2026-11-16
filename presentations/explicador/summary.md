# Explicador: cómo funciona por dentro

- **Slug:** `explicador` · **On-screen language:** Spanish · **Code language:** EXL (the scene format) and
  TypeScript/JavaScript, quoted from the real repo at `../explicador` (no invented code)
- **Audience:** the technical team that will work on the plugin. They know Claude Code, MCP, Node and
  React; they have not read Explicador's code.
- **Duration:** ~9 min · 9 scenes · 42 steps

## The one idea

> «Claude escribe un guion con referencias, no código; el servidor solo deja pasar lo que existe en tus
> archivos, lo guarda con el hash de cada archivo y lo vuelve a usar mientras no cambien.»

## The running example

**`/explicador:explain login` on the demo shop** (`examples/shop`): Ada logs in, and the scene explains
`verifyPassword` in `src/auth/password.js:14-19`. The same login, the same file and the same lines appear
in every scene.

| Scene | Where the login shows up |
|---|---|
| 1 | The command is typed; the answer becomes a diagram of the login in a browser tab |
| 2 | That request travels through the pieces, from Claude to the tab |
| 3 | `ref="src/auth/password.js:14-19"` is copied by the server; `password.js:40-45` is rejected |
| 4 | First run: `show_scene("login")` → `missing` → `render_scene` saves `login.json` |
| 5 | Second run: `fresh`. Someone edits `password.js` → `stale`, and only that file is re-read |
| 6 | A click on the «Scrypt key» box goes back to Claude and comes back as an answer |
| 7 | The tab's URL `127.0.0.1:PORT/?t=TOKEN` and the `.env` next to `password.js` |
| 8 | The tests and benchmarks that cover this flow |
| 9 | The same pieces from scene 2, now with the risks pinned on them |

Left out to fit 9 minutes: notebook lessons (4.6), the code tour `explain_code` (4.5), the product
metrics and the business questions beyond the four open decisions. Each one could be its own scene.

## Look — «plano de sala de control»

Light graph paper with a faint grid, ink lines, and three signal lights that mean the same thing in every
scene: green passes, amber must be re-read, red is blocked. Flat and drawn — nothing glows.

| Role | Hex | Used for |
|---|---|---|
| Papel `--paper` | `#EEF1EC` | background, with a 48 px grid in `#DCE2DA` |
| Tinta `--ink` | `#16202A` | text, pieces, arrows |
| Lápiz `--muted` | `#8D978F` | what is not in focus, discarded paths |
| Cobalto `--accent` | `#2D5BD7` | references and data travelling (`ref=`, SSE events, the click) |
| Verde `--ok` | `#2E8B57` | `fresh`, a check that passes |
| Ámbar `--warn` | `#E39B1B` | `stale`, warnings, risks |
| Rojo `--block` | `#D2452F` | `missing`, a rejected ref, a blocked request |

- **Fonts:** *Bricolage Grotesque* (headlines 700, labels 500) and *JetBrains Mono* (code, file paths,
  status words). Both are already in `player/vendor/fonts/`; no new files.
- **Size scale (px on 1920×1080):** 40 code and labels · 56 piece names and status words · 72 sub-headlines ·
  96 headlines.
- **Avoids the default look:**
  - *Dark background with floating things:* light paper; every element sits on the grid and is connected.
  - *Glows and particles:* the only light is a flat signal dot that changes colour.
  - *Three cards in a row:* pieces are joined by arrows into a path; scene 8 stacks bars, scene 9 pins
    notes on the diagram.
  - *Fade + slide up:* pieces are drawn (outline stroke, then label); arrows grow along their path; code
    is typed or highlighted line by line; status words stamp in.

## Scenes

### 1. Un diagrama en vez de un párrafo — new: own

- **Idea:** Explicador answers «¿cómo funciona X?» with an animated scene instead of text.
- **On screen:** a terminal line, a grey paragraph, a browser tab with a four-box diagram of the login.
- **Enters with:** cut (first scene).
- **Steps:**
  1. `pregunta` — `/explicador:explain login` types into a terminal line · *Cue:* what we ask Claude.
  2. `parrafo` — a usual answer: eight grey lines of text · *Cue:* this is what you normally get.
  3. `escena` — the lines fold into a tab at `127.0.0.1` with form → API → `password.js` → cookie ·
     *Cue:* Explicador gives you this instead.
  4. `plugin` — the tab gets the label «plugin de Claude Code» and a notebook icon «también notebooks» ·
     *Cue:* it is a plugin; it also turns notebooks into lessons.

### 2. Las piezas — library `pipeline` (new: library)

- **Idea:** five pieces in a line, and one way back.
- **On screen:** a path that grows left to right, one piece per step, each with its analogy under it.
- **Enters with:** `push` down — we go below the tab to see what produces it.
- **Steps:**
  1. `claude` — box «Claude + skill explicador», under it «guionista» · *Cue:* Claude writes the scene.
  2. `exl` — an arrow grows to a sheet «EXL», under it «guion» · *Cue:* a closed tag catalogue, no JS.
  3. `servidor` — box «Servidor MCP · 8 herramientas», under it «productor», a folder `.explicador/` drops
     below it · *Cue:* it checks, caches and publishes; state lives in your project.
  4. `puente` — box «Puente HTTP · 127.0.0.1», the arrow labelled «SSE» · *Cue:* one token per run.
  5. `visor` — box «Visor React · ELK · GSAP · KaTeX», under it «proyector» · *Cue:* lays out and animates.
  6. `monitor` — an arrow curves back from the viewer through «Monitor» to Claude · *Cue:* clicks come
     back to Claude without launch flags.

### 3. Claude no escribe el código que ves — new: own

- **Idea:** the scene holds references; the server copies the real lines, so invented code cannot
  reach the viewer.
- **On screen:** left, the EXL of the login scene; right, the real `password.js`; between them, the server.
- **Enters with:** `zoom` into the «EXL» sheet of scene 2.
- **Steps:**
  1. `exl` — five real lines from `examples/scenes/login.exl.md` type in, ending in
     `<concept term="Scrypt key" ref="src/auth/password.js:14-19">` · *Cue:* this is what Claude writes.
  2. `ref` — the `ref` is highlighted cobalt; `password.js` appears with lines 14–19 marked ·
     *Cue:* a file and a line range, nothing else.
  3. `copia` — those six lines slide through the server into a viewer card under «Scrypt key», with a green
     check · *Cue:* the server copies them at render time.
  4. `inventada` — the ref changes to `password.js:40-45`; the file ends at line 19; red stamp
     «no existe · no llega al visor» · *Cue:* a made-up range is blocked.
  5. `catalogo` — a `<script>` tag tries to enter the EXL and bounces off with «etiqueta fuera del
     catálogo» · *Cue:* no raw JS or HTML, so any model produces the same kind of output.

### 4. Primera vez: de `missing` a una pestaña — new: own

- **Idea:** the first run, and the five checks `render_scene` makes in order.
- **On screen:** a vertical timeline on the left (tool calls), a row of five gates on the right that the
  scene document passes through.
- **Enters with:** `push` left — the next moment in time.
- **Steps:**
  1. `missing` — `show_scene("login")` → red `missing` · *Cue:* nothing cached yet.
  2. `plan` — `ensure_index` draws a small file tree; a question bubble «¿audiencia, longitud, foco?» and
     an «OK» · *Cue:* reads the index first, asks, shows the plan, waits.
  3. `parsea` — the EXL sheet goes through gates 1 «parsea» and 2 «refs existen», both green ·
     *Cue:* errors here block and nothing is saved.
  4. `avisos` — gate 3 «avisos» turns amber with two real warning texts (brief, término sin definir) ·
     *Cue:* they do not block, but Claude must fix them.
  5. `publica` — gates 4 «guarda `login.json` + SHA-256» and 5 «publica por SSE»; the tab opens ·
     *Cue:* Claude answers in 3–6 sentences with the URL.

### 5. La caché: `fresh`, `stale`, `missing` — new: own

- **Idea:** a scene is reused while the hashes of the files it cites still match.
- **On screen:** the `login.json` card with one row per cited file and its hash.
- **Enters with:** `zoom` into `login.json` in scene 4.
- **Steps:**
  1. `hashes` — rows `src/auth/password.js` and `src/api/auth-routes.js`, each with the first characters of
     its real SHA-256 (computed from `examples/shop` when the scene is built) ·
     *Cue:* one SHA-256 per file the scene cites.
  2. `fresh` — second `show_scene("login")`: every row checks against the disk, green light `fresh`;
     «0 archivos leídos» · *Cue:* the model only writes a short answer.
  3. `stale` — line 17 of `password.js` is edited; its hash changes; amber `stale`; only that file
     goes back to Claude · *Cue:* re-read what changed, render again.
  4. `codigo` — the real `Lookup` type from `server/src/cache/index.ts` with the three statuses lit in
     their colours · *Cue:* that is all the cache decides.

### 6. Un clic vuelve a Claude — library `pipeline` (props: a loop)

- **Idea:** a click is free until you ask for more; then it travels back to Claude through the Monitor.
- **On screen:** the scene 2 pieces bent into a loop, with the viewer at the top.
- **Enters with:** `push` left.
- **Steps:**
  1. `clic` — a cursor clicks «Scrypt key» in the viewer · *Cue:* the box opens.
  2. `panel` — a local panel: description, key code, question field; label «sin Claude» ·
     *Cue:* this costs nothing.
  3. `profundo` — «Ir más profundo» sends `POST /api/click` to the bridge, which writes one line to the
     clicks stream · *Cue:* now we need Claude.
  4. `monitor` — the Monitor prints the line to stdout; Claude Code hands it to Claude ·
     *Cue:* a process the plugin starts with the session.
  5. `respuesta` — `answer_question` comes back with text and cited lines; an amber note
     «no funciona con `claude -p`» · *Cue:* monitors only run in interactive sessions.

### 7. Todo se queda en 127.0.0.1 — new: own

- **Idea:** the bridge is local and locked, and the viewer only serves the project.
- **On screen:** a boundary line around «tu máquina»; the tab's URL; the project folder.
- **Enters with:** `reveal` out of the «Puente · 127.0.0.1» box in scene 6.
- **Steps:**
  1. `frontera` — the boundary is drawn; only one arrow crosses it, labelled «lo que Claude Code ya envía» ·
     *Cue:* the server calls no external service.
  2. `token` — the URL `127.0.0.1:PORT/?t=TOKEN` with three checks pinned: token per run, `Origin` on POST,
     `Host` against DNS rebinding · *Cue:* another page in your browser cannot use it.
  3. `archivos` — the project folder: `password.js` passes green; `.env`, `.git`, `../otro` and a symlink
     going out are blocked red · *Cue:* the viewer serves only the project.
  4. `export` — an exported HTML file with «0 peticiones de red» and a strict CSP badge ·
     *Cue:* the exported scene works offline.

### 8. Cómo sabemos que funciona — new: own

- **Idea:** many deterministic checks; comprehension measured by facts, not by clarity.
- **On screen:** a stack of test bars, then one comparison bar, then the blind spot.
- **Enters with:** `wipe` — a clean break from architecture to measurement.
- **Steps:**
  1. `pruebas` — bars stack: servidor 304 · visor 204 · evals 50 · navegador 61 (Chromium) ·
     *Cue:* Firefox and WebKit only run in CI.
  2. `bench` — Haiku without a scene 2,4/5 → with a scene 4,9/5 (F22), 5,0/5 in F30 ·
     *Cue:* one run per condition.
  3. `punto-ciego` — a confusing tangle of arrows still gets «5/5» · *Cue:* the bench only checks that
     the text contains the facts.
  4. `personas` — `docs/prueba-humana.md` with an empty results box «sin resultados» ·
     *Cue:* the human protocol exists; nobody has run it yet.

### 9. Riesgos y decisiones abiertas — library `pipeline` (props: pins)

- **Idea:** each risk sits on the piece it affects; four decisions are still open.
- **On screen:** the scene 2 pipeline, small, with amber pins added one per step; then a checklist.
- **Enters with:** `push` up.
- **Steps:**
  1. `plataforma` — pin on «Monitor»: experimental manifest key; pin on the whole line: «todo dentro de
     Claude Code» · *Cue:* if plugins change, we change.
  2. `modelo` — pin on «Claude»: quality depends on the model; evals do not measure clarity.
  3. `madurez` — pins on «Visor»: only Chromium on real Windows, UI only in English.
  4. `f11` — a dashed piece «F11 · ejecutar celdas» appears next to the server, red outline: it starts
     processes on the user's machine · *Cue:* needs its own security design before starting.
  5. `decisiones` — four empty boxes tick in: licencia · público · distribución · modelo de negocio; then
     the one idea fades in under the diagram · *Cue:* close on the one idea.

## Reuse

- **New library scene `library/pipeline`:** pieces joined by arrows that grow one per step, with optional
  captions under each piece, a return arrow, a loop layout and amber pins. Used 3 times with different
  props (scenes 2, 6, 9). Nothing in `library/` fits yet (`bst-walk` is for trees).
- **Shared helper:** `library/shared/python-code.js` becomes `library/shared/code-panel.js`, a general code panel for EXL/XML, TypeScript
  and JavaScript (scenes 3 and 5), keeping the Python mode for `arboles-binarios`.
- **Fonts:** reused from `player/vendor/fonts/`.
