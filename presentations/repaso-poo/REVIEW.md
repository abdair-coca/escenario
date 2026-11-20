# Review — repaso-poo

Last run: `npm run screenshots repaso-poo` → 62 screenshots, 0 audit issues, 0 errors.
Every step was opened and checked against the review checklist in `rules.md`; the steps changed after a
fix were opened again in the last run.

## Per scene

### 1. shop-front
- Found: the customers' name tags reached y 1030 (outside the safe area). **Changed:** the line moved up 10 px.
- Added: an order board («Pedidos») with a small tree, so scene 17 has something to stick «árbol» on. The summary says so.

### 2. class-object
- Found: the blueprint robot's antenna touched the «class Robot» title, and the two `robot = Robot(...)` lines almost touched. **Changed:** the blueprint robot moved down; Robi and Caja moved apart.

### 3. attributes-methods
- Found: the method tags covered Robi's right arm. **Changed:** tags moved 40 px right.
- Note: the leader lines to the chest buttons cross the arm; they still read clearly.

### 4. constructor
- Found: at the `llamada` hold the call pill had already vanished into the slot, so the step showed an empty machine. **Changed:** `Robot("Robi")` now drops onto the slot and stays there.
- Found: after rolling out, Robi's antenna touched the code. **Changed:** it stops 40 px lower.

### 5. encapsulation
- Found: the `__bateria` highlight stayed on through every step, so two bars were lit at `valida`. **Changed:** it goes out when the next call starts.
- Found: the «privado» convention tag used white sticker text in a monospaced font, which looked broken. **Changed:** white tag with blue text.

### 6. inheritance
- Found: the «es un» pill was far from the arrows. **Changed:** it now sits on the left arrow.

### 7. polymorphism
- **Changed from the summary:** the scene no longer continues scene 6's diagram (`cut`). The cards were too tall to fit a fifth row, so it shows the two `trabajar()` overrides as code next to Robi and Caja, and enters with `push`. The summary was updated.

### 8. override-overload
- Found: the leader lines from the calls to the cones crossed each other. **Changed:** each cone now sits right under its call; no leaders.
- Found: «en la misma clase» overlapped the card's shadow. **Changed:** moved 25 px down.
- Note: `servir("fresa", 3)` ends at x ≈ 1810, close to the safe-area edge but inside it.

### 9. abstraction
- Found: `from`, `import` and `pass` were not highlighted as keywords. **Changed:** added to the Python keywords in `library/shared/code-panel.js` (affects every deck, only for those three words).
- Note: at the `ocultar` hold the lid is closed again; the gears are visible only while the step plays.

### 10. interfaces
- Found: Caja's tick covered the word `class`. **Changed:** it moved next to Caja's head.

### 11. lists
- Found: the `--accent` highlight around «fresa» did not stand out on the navy board. **Changed:** it uses `--accent-2`.
- Found: the result `"fresa"` was far from `sabores[1]`. **Changed:** it now sits next to that line; «empieza en 0» sits level with the indexes.

### 12. stacks
- Found: nothing to fix.

### 13. queues
- Found: the result `"Ana"` covered the end of `fila.append("Dani")` and then went past the bottom edge. **Changed:** it sits next to `fila.popleft()`, inside the safe area.

### 14. recursion
- Uses `cono[:-1]` (drops the last scoop, the top one), so the picture matches the code: each call loses the top scoop. The summary said `cono[1:]`; the code and the accuracy notes now agree with `[:-1]`.
- Found: `])` touched the right edge of the three-scoop card. **Changed:** the cards are 40 px wider.

### 15. tree-parts
- **Changed from the summary:** `regla` writes «30 < 50 < 70» under the tree instead of tinting the subtrees. This is exactly what `bst-walk` draws at its start with `previousFocus`, so the cut to scene 16 does not jump. The summary was updated.

### 16. bst-walk (library)
- Found: nothing to fix. Search for 60: 50 → 70 → 60, three comparisons, recursive `buscar`.

### 17. everything
- Found: «árbol» covered the «Pedidos» title, «pila» covered the top scoop, «cola» covered Beto's face and «encapsulamiento» covered Caja's face. **Changed:** all four moved (árbol to the board's corner, pila onto the cone, cola above the heads, encapsulamiento onto the counter).

## Remains (your decision)

- Scene 7 now enters with `push` instead of `cut` (see above).
- The `code-panel.js` keyword change touches the shared library; other decks only gain colour on `from`, `import` and `pass`.
