# Árboles binarios de búsqueda, con código

- **Slug:** `arboles-binarios` · **On-screen language:** Spanish · **Code language:** Python (Spanish identifiers: `Nodo`, `valor`, `izq`, `der`, `insertar`, `buscar`)
- **Audience:** beginner programmers. They know variables, `if`, functions and a basic class; they have never seen a tree.
- **Duration:** ~7 min · 6 scenes · 26 steps

## The one idea

> «En cada nodo los menores van a la izquierda y los mayores a la derecha, así que para buscar o insertar
> bajo por un solo camino y en cada paso descarto la mitad.»

## The running example

**The secret number is 60.** The same seven numbers — 50, 30, 70, 20, 40, 60, 80 — appear in every scene.

| Scene | Where 60 shows up |
|---|---|
| 1 | A guessing game: «¿Es 50?» mayor · «¿Es 70?» menor · «¿Es 60?» ¡sí! — 3 questions |
| 2 | Node 50 opens up; linking `raiz.der = Nodo(70)` repeats the game's first answer |
| 3 | The tree 50, 30, 70, 20, 40, 80 is built; the empty spot left of 70 is waiting |
| 4 | `insertar(raiz, 60)` walks 50 → 70 → the empty spot: the same path as the game |
| 5 | `buscar(raiz, 60)` walks the same path and finds it in 3 comparisons |
| 6 | 3 comparisons for 7 numbers becomes ~20 for a million |

## Look — «cuaderno de ingeniería»

Warm paper, ink strokes, a highlighter on the code. Light, flat and drawn — nothing glows.

| Role | Hex | Used for |
|---|---|---|
| Papel `--paper` | `#F3EEE3` | background |
| Tinta `--ink` | `#1E1C19` | text, node outlines, edges |
| Lápiz `--muted` | `#A49D90` | discarded numbers and branches |
| Bermellón `--accent` | `#E0492A` | what we compare right now: the travelling token, «60 > 50» |
| Mostaza `--accent-2` | `#F2B33D` | new or found node; highlighter stroke behind the active code line |
| Azul `--accent-3` | `#2F5D9E` | links and `None`; Python keywords |

- **Fonts:** *Bricolage Grotesque* (headlines 700, labels 500, node values 700 with tabular figures) and
  *JetBrains Mono* (code). Both copied as `.woff2` files so the deck works offline.
- **Size scale (px on 1920×1080):** 40 code and labels · 56 comparisons and node values · 72 sub-headlines ·
  96 headlines · 200 hero numbers. Nothing to be read under 40.
- **Code layout:** at 40 px a line of 44 characters takes ~1060 px, so code sits on the right half
  (~1060 px) and the tree on the left (~620 px) — both inside the 90% area.
- **How it avoids the default look:**
  - Dark background with floating things → light paper; every object is anchored to the tree or the ruler.
  - Glows and particles → none; emphasis is colour, a highlighter swipe and ink weight.
  - Three cards in a row → no cards; code is printed on the paper, not in a box.
  - Everything entering with fade + slide up → edges draw like pen strokes, nodes drop onto their spot,
    code types in left to right, the ruler folds away its discarded half, the token slides along the edges.

## Scenes

### 1. Adivina mi número — new: own (`scenes/guessing-game`)

- **Idea:** Each «mayor / menor» answer throws away half of the numbers that are left.
- **On screen:** a ruler 1–100 across the canvas; pins with question bubbles; at the end the pins become a small tree.
- **Enters with:** cut (first scene).
- **Steps:**
  1. `regla` — the ruler draws itself left to right (ticks 1 · 25 · 50 · 75 · 100); headline «Pensé un número del 1 al 100».
     *Cue:* invite them to guess; promise few questions.
  2. `pregunta-50` — a pin drops on 50 with «¿Es 50?»; the answer «Mayor» stamps on it; 1–49 turns pencil-grey and folds away.
     *Cue:* one question, half the numbers gone.
  3. `pregunta-70` — pin on 70 «¿Es 70?» → «Menor»; 71–100 folds away; 51–69 stays inked.
     *Cue:* only 19 numbers left.
  4. `pregunta-60` — pin on 60 «¿Es 60?» → «¡Sí!» in mustard; a counter writes «3 preguntas».
     *Cue:* three questions, not sixty.
  5. `arbol` — the three pins lift off the ruler and settle top-down: 50, then 70 down-right, then 60 down-left of 70;
     edges draw between them with the labels «mayor» and «menor» on each edge; the ruler exits. Caption «Las preguntas forman un árbol».
     *Cue:* name it: a binary search tree.

### 2. Un nodo por dentro — new: own (`scenes/node-anatomy`)

- **Idea:** A node is a value plus two links; in Python it is a three-line class.
- **On screen:** node 50 drawn big on the left as a box with three compartments `izq | 50 | der`; Python on the right.
- **Enters with:** `zoom` into node 50 of scene 1 — we go inside the node.
- **Steps:**
  1. `valor` — the big node 50; `class Nodo:`, `def __init__(self, valor):` and `self.valor = valor` type in;
     a leader line joins `valor` to the 50. *Cue:* every question is a node; it keeps a value.
  2. `izq` — the left compartment outlines in blue and shows `None`; `self.izq = None` types in with its leader line.
     *Cue:* smaller numbers will hang here; empty for now.
  3. `der` — same for the right compartment and `self.der = None`. *Cue:* bigger ones here.
  4. `enlazar` — `raiz = Nodo(50)` and `raiz.der = Nodo(70)` type in under the class; node 70 drops in down-right
     and the right `None` turns into an arrow to it. *Cue:* linking is storing one node inside another — the game's «mayor».

### 3. La regla — new: own (`scenes/bst-rule`)

- **Idea:** At every node, everything on the left is smaller and everything on the right is bigger.
- **On screen:** the tree 50, 30, 70, 20, 40, 80, centred, with a dashed empty spot left of 70.
- **Enters with:** `reveal` growing out of node 70 of scene 2 — the whole tree grows from the node we just linked.
- **Steps:**
  1. `arbol` — nodes arrive in insertion order 50, 30, 70, 20, 40, 80: each edge draws like a pen stroke, then its node drops on.
     *Cue:* these numbers went in in this order.
  2. `izquierda` — a pencil outline wraps 30, 20, 40 with the label «todos < 50» on it. *Cue:* everything left of 50 is smaller.
  3. `derecha` — an outline wraps 70, 80 and the empty spot, label «todos > 50». *Cue:* everything right is bigger.
  4. `cada-nodo` — both outlines shrink onto node 30 and become «20 < 30 < 40». *Cue:* the rule repeats in every node.

### 4. Insertar 60 — library `bst-walk` (mode `insert`, target 60)

- **Idea:** To insert, walk down comparing — smaller left, bigger right — until you reach an empty spot.
- **On screen:** the tree on the left, `insertar()` on the right, a vermilion token «60» that travels along the edges.
- **Enters with:** cut — the tree stays exactly where scene 3 left it (the outlines are dropped).
- **Steps:**
  1. `codigo` — the camera slides the tree to the left; `insertar()` types in on the right line by line; the token «60» appears above the root.
     *Cue:* we want to put 60 in.
  2. `comparar-50` — the token lands on 50; «60 > 50» is written beside it; the highlighter marks `nodo.der = insertar(nodo.der, valor)`;
     the token slides down the right edge. *Cue:* bigger → right.
  3. `comparar-70` — «60 < 70»; the highlighter marks `nodo.izq = insertar(nodo.izq, valor)`; the token slides to the empty spot.
     *Cue:* smaller → left.
  4. `hueco` — the highlighter marks `if nodo is None: return Nodo(valor)`; the token turns into a mustard node 60 and its edge draws.
     *Cue:* an empty spot is where it lives — the same path as the game.

### 5. Buscar 60 — library `bst-walk` again (mode `search`, target 60, different code and title)

- **Idea:** Searching is the same walk, and it is exactly the guessing game.
- **On screen:** the same tree, now with 60; `buscar()` on the right; the token «¿60?».
- **Enters with:** cut — the tree does not move; only the code changes.
- **Steps:**
  1. `codigo` — `insertar()` leaves (lines exit upward, fast) and `buscar()` types in; the token «¿60?» appears above the root.
     *Cue:* now let's find it.
  2. `comparar-50` — «60 > 50»; highlighter on `return buscar(nodo.der, valor)`; the whole left branch of 50 turns pencil-grey.
     *Cue:* half the tree discarded, like «mayor» in the game.
  3. `comparar-70` — «60 < 70»; highlighter on `return buscar(nodo.izq, valor)`; 80 turns grey.
  4. `encontrado` — «60 == 60»; highlighter on `return True`; node 60 gets a mustard ring; «3 comparaciones» is written beside it.
     *Cue:* three questions again.

### 6. ¿Y con un millón? — new: own (`scenes/how-many-questions`)

- **Idea:** Each comparison halves what is left, so a million numbers need about 20 comparisons — if the tree is balanced.
- **On screen:** one long bar = a million numbers, then a staircase of halves; at the end a small warning tree.
- **Enters with:** `push` left — the camera moves to the right, where the bigger case is waiting.
- **Steps:**
  1. `millon` — a bar draws across almost the whole width, label on it «1.000.000 números».
     *Cue:* same game, a million numbers.
  2. `mitades` — the bar halves again and again into a staircase of shorter bars under it; a counter ticks to «20 comparaciones» at the end of the stair.
     *Cue:* each comparison cuts in half.
  3. `lista` — the original bar gets a second label «lista: revisar uno por uno → hasta 1.000.000» next to «árbol → ~20».
     *Cue:* compare with checking one by one.
  4. `ojo` — a small tree built from 10, 20, 30, 40 inserted in order draws as a diagonal chain, label «si insertas en orden, se vuelve una lista».
     *Cue:* honest caveat; balanced trees exist — a topic for another day.
  5. `idea` — the closing sentence types in: «Menores a la izquierda, mayores a la derecha: buscar es bajar por un solo camino.»
     *Cue:* close by going back to the secret number 60.

## Reuse

- **New library scene `bst-walk`:** a binary search tree with code beside it and a token that walks down comparing.
  Props: `values` (insertion order), `target`, `mode` (`insert` | `search`), `code` (Python lines),
  `lines` (which code line each moment highlights), `title`. Its steps come from the props
  (`codigo`, one `comparar-<n>` per node on the path, then `hueco` or `encontrado`).
  It is used **twice** here (scenes 4 and 5) with different props, and fits any future tree talk (delete, height, other values).
- **Shared helper `library/shared/bst-tree.js`:** tree layout and drawing used by `bst-rule` and `bst-walk`,
  so the tree sits on the same pixels across the cuts between scenes 3, 4 and 5.
- **Shared helper `library/shared/python-code.js`:** prints Python with a small built-in highlighter
  (keywords, numbers, strings) and the line highlighter — no extra library.
- Transitions used: `zoom` (1→2), `reveal` (2→3), `cut` (3→4 and 4→5, for continuity), `push` (5→6).

## Needs your approval

1. This summary (scenes, steps, look).
2. Two new dev dependencies to copy the fonts offline: `@fontsource/bricolage-grotesque` and `@fontsource/jetbrains-mono`.
