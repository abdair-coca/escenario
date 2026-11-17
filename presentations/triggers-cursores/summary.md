# Triggers and cursors for denormalization

- **Slug:** `triggers-cursores` · **On-screen language:** Español (`lang: "es"`) · **Code language:** T-SQL on SQL Server, shown in SSMS
- **On-screen title:** «Triggers y cursores para desnormalizar»
- **Audience:** developers who already write T-SQL (SELECT, JOIN, GROUP BY, INSERT/UPDATE/DELETE) but have not put triggers or cursors into production.
- **Duration:** ~12 min · 12 scenes · 51 steps

On-screen text and presenter cues are written in Spanish below, as they will appear. The rest of this file is in English.

## The one idea

> «Denormalizar guarda la respuesta. El trigger la mantiene al día por conjunto; el cursor sólo cuando ninguna sentencia de conjunto sirve.»

English: *Denormalization stores the answer. A set-based trigger keeps it right, in the same transaction; a cursor is only for work no set-based statement can do.*

## Concepts the deck must make clear

1. **Denormalization:** a redundant copy (a total, a count, a name) stored so reads skip a join or an aggregate. The price is write work and the risk of drift.
2. **Trigger:** code SQL Server runs by itself after a change (`AFTER INSERT, UPDATE, DELETE`), or in place of it (`INSTEAD OF`). It runs **once per statement, not once per row**. It runs in the statement's transaction, so if it fails the statement is undone.
3. **`inserted` and `deleted`:** pseudo-tables with every affected row of the statement. An UPDATE fills both: the old image in `deleted`, the new one in `inserted`.
4. **Set-based recalculation:** collect the affected parent keys from both pseudo-tables, then recalculate those parents with one UPDATE.
5. **Cursor:** `DECLARE` / `OPEN` / `FETCH` in a loop on `@@FETCH_STATUS` / `CLOSE` / `DEALLOCATE`. One statement per row. Right for per-row procedures and admin backfills; wrong inside a trigger.
6. **Presenter-only pitfalls (cues, not scenes):** `SET NOCOUNT ON` hides the trigger's own "(n rows affected)" message; `UPDATE(col)` returns 0 inside a DELETE trigger, so it cannot be the only guard; nested triggers run up to 32 levels deep.

## The running example

A shop with two tables that matter here: `dbo.Orders` (with a denormalized `Total`) and `dbo.OrderLines`. `Total` must equal the sum of `Qty * UnitPrice` over the order's lines.

Order **1042** starts with three lines:

| Line | Product | Qty × price | Subtotal |
|---|---|---|---|
| 1 | Café | 2 × 4 | 8 |
| 2 | Tostada | 1 × 3 | 3 |
| 3 | Zumo | 3 × 5 | 15 |

`Orders.Total` = **26**. The same numbers run through the deck:

- INSERT Croissant, 2 × 3 = 6 → **32**
- DELETE Tostada (−3) → **29**
- UPDATE Zumo, qty 3 → 2 (−5) → **24**

Final check: remaining lines 8 + 6 + 10 = 24. ✓

Race example (scene 10): order 1042 starts at 26. Session A adds Croissant (+6). Session B adds Té 1 × 4 (+4). Correct final total: **36**. Under RCSI with a recalculation that reads before the other session commits: **30**.

## Look — «hoja de resultados»

Light grey paper with cell lines, like the results grid of SSMS, and a header band. Blue marks what is in focus now. Orange marks the trigger and what it fires. Green marks inserted rows and the right path; red marks deleted rows, the cursor path and wrong results. Violet is used only for SQL keywords.

| Role | Hex | Used for |
|---|---|---|
| Paper `--paper` · ink `--ink` | `#F3F4F6` · `#16191F` | Background with cell lines `#D5D9DF` and a header band `#E4E7EC`; text, code, borders |
| Muted `--muted` | `#8B93A0` | Rows and lines not in focus |
| Blue `--accent` | `#1F5FD1` | The row or statement in focus now |
| Orange `--accent-2` | `#C2570C` | The trigger and what it fires |
| Green `--ok` · red `--block` | `#1E7A46` · `#B3261E` | Inserted rows, right path · deleted rows, cursor path, wrong result |
| Violet `--accent-3` | `#6B3FA0` | SQL keywords in the code panel |

- **Fonts:** *Bricolage Grotesque* (headlines 700, labels 500) and *JetBrains Mono* (code, table values, Messages text). The four files are already in `player/vendor/fonts/`. No new files, no new dependency.
- **Size scale (px on 1920×1080):** 40 table text, labels and code · 56 sentences · 72 totals · 96 headlines. 40 is the minimum. Code lines are kept to about 62 characters so they fit at 40 px.
- **Avoids the default look:**
  - *Dark background with floating things:* light grid paper; everything sits in cells, on the code's lines, or joined by an arrow.
  - *Glows and particles:* none.
  - *Three cards in a row:* the tables are rows in a grid; the decision in scene 9 is a vertical flow; the closing decision table is a grid (scene 12).
  - *Fade + slide up:* rows and cells are written in or drawn; code types in line by line; counters change by step, not by fading in.

## Scenes

### 1. Un dato, dos sitios — library `pipeline` (pieces: OrderLines, SUM, Orders.Total; one pin)

- **Idea:** a denormalized column stores an answer the database would otherwise recompute on every read.
- **On screen:** order 1042's three lines → SUM → Orders.Total «26».
- **Enters with:** cut (first scene).
- **Steps:**
  1. `lines` — the three lines of order 1042 · *Cue:* «Para saber el total sumamos tres filas. Cada listado de pedidos haría esa suma otra vez.»
  2. `sum` — the arrow to SUM and the result 26 · *Cue:* «Leer es caro cuando la respuesta sale de una suma.»
  3. `copy` — 26 is stored in Orders.Total · *Cue:* «Desnormalizar: guardamos la respuesta junto al pedido. Leer ya no suma nada.»
  4. `drift` — pin on the stored 26: «se borra una línea» / «el total sigue en 26» · *Cue:* «Ahora el mismo dato está en dos sitios. El precio de la copia es mantenerla al día.»

### 2. Un trigger en SSMS — new: own

- **Idea:** a trigger is code stored on the table. It runs after a change, in the same transaction.
- **On screen:** Object Explorer on the left: Tables › dbo.OrderLines › Triggers › `trg_OrderLines_RecalcTotal` (orange). On the right, a query window with `INSERT INTO dbo.OrderLines …`. An orange arrow goes from the statement to the trigger. A box: «misma transacción: si el trigger falla, el INSERT se deshace».
- **Enters with:** wipe (the topic changes from the copy to the code that keeps it).
- **Steps:**
  1. `tree` — the trigger under OrderLines in Object Explorer · *Cue:* «Así lo encuentras en SSMS: dentro de la tabla, en Triggers.»
  2. `insert` — the INSERT runs in the query window · *Cue:* «Cualquier INSERT, UPDATE o DELETE sobre OrderLines.»
  3. `fires` — the orange arrow; the trigger box lights up · *Cue:* «SQL Server lo ejecuta solo. Nadie lo llama.»
  4. `tx` — the same-transaction box · *Cue:* «La línea y el total se guardan juntos, o no se guarda ninguno.»
  5. `kinds` — two options: «AFTER: después del cambio» / «INSTEAD OF: en lugar del cambio» · *Cue:* «Usamos AFTER: el cambio ya está hecho y el trigger corrige el total.»

### 3. Una vez por sentencia — library `result-grid` (props: fan of three runs, one run, `inserted` grid with three green rows)

- **Idea:** a trigger runs once per statement, and `inserted` holds every row of that statement.
- **On screen:** one INSERT with three rows (lines of a new order 1043) enters one trigger box. A red fan of three runs is crossed out «no por fila». Below, the `inserted` grid with three green rows.
- **Enters with:** push left (from the trigger to the rows it receives).
- **Steps:**
  1. `statement` — one INSERT, three rows · *Cue:* «Una sentencia, tres filas.»
  2. `fan` — the red fan of three runs, crossed out «no por fila» · *Cue:* «Muchos esperan un disparo por fila. En SQL Server no hay FOR EACH ROW.»
  3. `once` — one trigger run; the rows go in together · *Cue:* «Un solo disparo por sentencia.»
  4. `inserted` — the grid `inserted` with three green rows · *Cue:* «inserted es una tabla con todas las filas. El código la trata como conjunto, no como una fila.»

### 4. Un UPDATE tiene dos imágenes — library `result-grid` (props: one red row, one green row, a delta, the total)

- **Idea:** an UPDATE gives the trigger both images: the old row in `deleted`, the new one in `inserted`.
- **On screen:** line 3 (Zumo). Red row in `deleted`: qty 3 · subtotal 15. Green row in `inserted`: qty 2 · subtotal 10. Blue delta «10 − 15 = −5». Orders.Total «29 → 24».
- **Enters with:** zoom into the `inserted` grid of scene 3 (target `.grid-inserted`).
- **Steps:**
  1. `deleted` — the old row in red · *Cue:* «Antes del cambio, la imagen vieja está en deleted.»
  2. `inserted` — the new row in green · *Cue:* «Después, la imagen nueva está en inserted. Las dos vienen en la misma sentencia.»
  3. `delta` — the difference and the total 29 → 24 · *Cue:* «Puedes aplicar la diferencia o recalcular. La siguiente escena recalcula: sirve también para DELETE y para varias filas a la vez.»

### 5. El trigger de recálculo — new: own (code panel, `sql`)

- **Idea:** the trigger collects the affected orders from both pseudo-tables and recalculates each of them with one UPDATE.
- **On screen:** the full trigger, about 16 lines, in the code panel. A blue bar marks the active block. In step 1 a small set «afectados: {1042}» appears.

  ```sql
  CREATE OR ALTER TRIGGER dbo.trg_OrderLines_RecalcTotal
  ON dbo.OrderLines AFTER INSERT, UPDATE, DELETE
  AS
  BEGIN
      SET NOCOUNT ON;

      WITH affected AS (              -- orders this statement touched
          SELECT OrderId FROM inserted
          UNION
          SELECT OrderId FROM deleted
      )
      UPDATE o
      SET    o.Total = (SELECT ISNULL(SUM(l.Qty * l.UnitPrice), 0)
                        FROM   dbo.OrderLines AS l
                        WHERE  l.OrderId = o.OrderId)
      FROM   dbo.Orders AS o
      WHERE  o.OrderId IN (SELECT OrderId FROM affected);
  END;
  ```

  (Exact line count and wrapping are set when the scene is built; the code above is what gets verified.)
- **Enters with:** push up (from the grid of scene 4; the code sits below it).
- **Steps:**
  1. `affected` — the CTE block · *Cue:* «Los pedidos que tocó esta sentencia: los de inserted y los de deleted. Así un DELETE también entra.»
  2. `sum` — the correlated SUM(Qty × UnitPrice) for each affected order · *Cue:* «Recalculamos en lugar de sumar la diferencia: el resultado es el mismo aunque cambien varias filas a la vez.»
  3. `update` — the UPDATE on dbo.Orders · *Cue:* «Un UPDATE para todos los pedidos afectados, no uno por fila.»
  4. `result` — «Orders.Total = 32» after the Croissant INSERT · *Cue:* «Lo probamos en SSMS en la siguiente escena.»

### 6. Probarlo en SSMS — new: own (simplified SSMS query window)

- **Idea:** the same numbers in SSMS. The results grid shows the total after each statement; Messages shows only the statement you wrote.
- **On screen:** a simplified SSMS window: tab «Pedidos.sql»; editor with three statements (INSERT Croissant, DELETE Tostada, UPDATE Zumo); results grid with the Orders row of 1042; Messages tab.
- **Enters with:** push left (from the code of scene 5 to the window beside it).
- **Steps:**
  1. `insert` — the INSERT runs · Total 26 → 32 · Messages shows one «(1 row affected)» · *Cue:* «Sólo un mensaje. El UPDATE del trigger no aparece porque el trigger tiene SET NOCOUNT ON.»
  2. `delete` — DELETE Tostada · 32 → 29 · *Cue:* «Un DELETE también dispara el trigger: la fila vieja está en deleted y el total baja.»
  3. `update` — UPDATE Zumo, qty 3 → 2 · 29 → 24 · *Cue:* «Tres sentencias, un solo trigger.»
  4. `check` — a check query: Orders.Total 24 and SUM of the lines 24, «24 = 24» · *Cue:* «Comprobación: el total guardado y la suma de las líneas deben ser iguales. Si no lo son, la copia se desvió.»

### 7. El cursor, fila a fila — new: own (code panel, `sql`, loop arrows)

- **Idea:** a cursor visits a result set one row at a time: it declares, opens, fetches in a loop and closes.
- **On screen:** a cursor backfill of every order's total, 16 lines in the code panel. On the right, a loop of arrows: FETCH → UPDATE → FETCH, with a counter «1 UPDATE por pedido».

  ```sql
  DECLARE @OrderId int;
  DECLARE c CURSOR LOCAL FAST_FORWARD FOR
      SELECT OrderId FROM dbo.Orders;
  OPEN c;
  FETCH NEXT FROM c INTO @OrderId;
  WHILE @@FETCH_STATUS = 0
  BEGIN
      UPDATE dbo.Orders
      SET    Total = (SELECT ISNULL(SUM(Qty * UnitPrice), 0)
                      FROM dbo.OrderLines
                      WHERE OrderId = @OrderId)
      WHERE  OrderId = @OrderId;
      FETCH NEXT FROM c INTO @OrderId;
  END;
  CLOSE c;
  DEALLOCATE c;
  ```
- **Enters with:** wipe (a clean break from the trigger to the cursor).
- **Steps:**
  1. `declare` — DECLARE, the CURSOR and its SELECT · *Cue:* «Un cursor es una consulta cuyas filas visitas una por una.»
  2. `fetch` — OPEN and the first FETCH; @OrderId = 1042 · *Cue:* «FETCH avanza a la siguiente fila y copia sus valores a variables.»
  3. `loop` — WHILE @@FETCH_STATUS = 0 and the arrow back to FETCH · *Cue:* «@@FETCH_STATUS = 0 quiere decir que la última lectura trajo una fila.»
  4. `body` — the UPDATE inside the loop; counter «1 UPDATE por pedido» · *Cue:* «Una sentencia por fila. Con 10 000 pedidos, 10 000 UPDATE.»
  5. `close` — CLOSE and DEALLOCATE · *Cue:* «CLOSE suelta las filas; DEALLOCATE libera el cursor. Hay que hacer los dos.»

### 8. Cursor dentro del trigger: el error — new: own

- **Idea:** a cursor inside a trigger repeats the work. The trigger already runs once per statement; the cursor then recalculates the same order once per row.
- **On screen:** three lines of order 1042 arrive in one INSERT. Top lane, red: the cursor visits each line; the counter reads «recálculos: 1 · 2 · 3». Bottom lane, green: one recalculation, counter «1».
- **Enters with:** zoom into the loop block of scene 7 (target `.loop`).
- **Steps:**
  1. `rows` — three lines of 1042 arrive in one INSERT · *Cue:* «Una sentencia, tres filas, un pedido.»
  2. `cursor` — the red lane; the counter goes 1, 2, 3 · *Cue:* «Un cursor dentro del trigger recalcula 1042 tres veces. Con mil líneas, mil sumas del mismo pedido.»
  3. `set` — the green lane; the counter stays at 1 · *Cue:* «El mismo resultado con una sola sentencia.»
  4. `rule` — the text «Dentro de un trigger, primero conjuntos» · *Cue:* «inserted y deleted ya son tablas: úsalas en un JOIN o en un IN.»

### 9. Datos existentes: lotes, no cursor — new: own (decision flow, batch code)

- **Idea:** for rows that already exist, use one set-based UPDATE. For a large table, use batches. Use a cursor only for per-row work that a join cannot express.
- **On screen:** a vertical decision flow.
  - «¿Una sola sentencia UPDATE lo resuelve?» → sí: set-based (green).
  - no → «¿Tabla grande, con bloqueos largos?» → sí: batches (blue), with the batch code on the right.
  - no → «¿Cada fila llama a un procedimiento o a un servicio?» → sí: cursor `LOCAL FAST_FORWARD`.

  Batch code:

  ```sql
  WHILE 1 = 1
  BEGIN
      UPDATE TOP (5000) o
      SET    o.Total = ISNULL(x.Total, 0)
      FROM   dbo.Orders AS o
      CROSS APPLY (SELECT SUM(l.Qty * l.UnitPrice) AS Total
                   FROM dbo.OrderLines AS l
                   WHERE l.OrderId = o.OrderId) AS x
      WHERE  o.Total <> ISNULL(x.Total, 0);
      IF @@ROWCOUNT = 0 BREAK;
  END;
  ```
- **Enters with:** push down (from the trigger and cursor problems of scene 8 to what to do instead).
- **Steps:**
  1. `set` — the first question and the set-based UPDATE · *Cue:* «La primera opción siempre. Un UPDATE con un agregado suele bastar.»
  2. `batch` — the second question and the batch loop · *Cue:* «Cada lote se confirma por separado: los bloqueos duran poco y puedes parar y reanudar.»
  3. `cursor` — the third question and the cursor · *Cue:* «El cursor es para trabajo por fila que no es un JOIN: llamar un procedimiento o una API por cada fila.»
  4. `rule` — «Trigger: conjuntos · Datos existentes: conjuntos o lotes · Cursor: último recurso» · *Cue:* «Antes de escribir un cursor, pregunta si cabe en un JOIN.»

### 10. Dos sesiones a la vez — new: own (two lanes, race)

- **Idea:** two sessions can recalculate from the same starting total. The last write wins and one line disappears from the total. This happens under RCSI.
- **On screen:** two lanes. «Sesión A: + Croissant 6» and «Sesión B: + Té 4». Both start at Total 26. A's trigger writes 32. B's trigger writes 30. Final: «30» in red, with a dashed «debería ser 36». A green box: «bloquear el pedido antes de recalcular (UPDLOCK) o SET Total = Total + 4» → 36.
- **Enters with:** wipe.
- **Steps:**
  1. `start` — both lanes start from Total 26 · *Cue:* «Dos cajas añaden una línea al mismo pedido al mismo tiempo.»
  2. `a` — A writes 32 · *Cue:* «El trigger de A suma su línea, que todavía no está confirmada, y escribe 32.»
  3. `b` — B reads 30 · *Cue:* «Con RCSI, B lee la última versión confirmada y no ve la línea de A. Con lectura bloqueante, B esperaría.»
  4. `lost` — final 30, expected 36 · *Cue:* «Gana la última escritura y una línea desaparece del total.»
  5. `fix` — the fix box; final 36 in green · *Cue:* «Bloquea el pedido antes de sumar, o aplica la diferencia con un UPDATE atómico.»

### 11. Alternativa: vista indexada — library `pipeline` (pieces: OrderLines → vOrderTotals; checks; one pin)

- **Idea:** for a plain aggregate, an indexed view lets SQL Server keep the sum itself. No trigger code.
- **On screen:** OrderLines → sheet «vOrderTotals» (OrderId, Total, Lines) with the label «índice agrupado único». Checks: ☐ WITH SCHEMABINDING · ☐ COUNT_BIG(*) · ☐ columnas NOT NULL · ☐ sin OUTER JOIN ni subconsultas. Pin: «es una vista, no una columna de Orders».
- **Enters with:** push left (from the race of scene 10 to a simpler option).
- **Steps:**
  1. `lines` — OrderLines feeds the view · *Cue:* «Aquí no hay código de trigger.»
  2. `view` — the indexed view and its unique clustered index · *Cue:* «SQL Server guarda el resultado y lo mantiene al día en cada escritura.»
  3. `rules` — the checks · *Cue:* «Si una regla falla, CREATE VIEW da error. Hay que escribirla con esas reglas desde el principio.»
  4. `limit` — the pin «es una vista, no una columna de Orders» · *Cue:* «Si otras consultas necesitan Orders.Total como columna, el trigger sigue siendo la herramienta. Además, cada escritura bloquea la fila del resumen.»

### 12. Cuándo cada herramienta — library `result-grid` (props: four rows of situation and tool, ticked one by one)

- **Idea:** keep an exact copy in the same transaction with a set-based trigger or an indexed view. Backfill in batches. Use a cursor only for per-row work outside a trigger. Close on the one idea.
- **On screen:** a grid with two columns, «Situación» and «Herramienta». Rows are ticked one by one. The one idea appears under the grid.
- **Enters with:** push left (from the view of scene 11 to the decision grid).
- **Steps:**
  1. `row1` — «Copia exacta, en la misma transacción» → «Trigger set-based o vista indexada» (green) · *Cue:* «Lo más común: la copia tiene que estar bien al confirmar.»
  2. `row2` — «Backfill de muchas filas» → «UPDATE por lotes» (blue) · *Cue:* «Los datos viejos se rellenan en lotes.»
  3. `row3` — «Trabajo por fila que no es un JOIN» → «Cursor LOCAL FAST_FORWARD, fuera del trigger» · *Cue:* «El cursor queda para trabajo por fila que un JOIN no expresa.»
  4. `row4` — «Dentro de un trigger, por fila» → «Nunca: usa conjuntos» (red) · *Cue:* «Lo que no hacer: un cursor sobre inserted.»
  5. `idea` — the one idea in Spanish, under the grid · *Cue:* «Cerramos con la idea.»

## Reuse

- **Library `pipeline`** (existing, `library/pipeline.html`) is used twice with different props: scene 1 (three pieces and a pin) and scene 11 (view, checks and a pin).
- **New library scene `result-grid`** (proposed, `library/result-grid.html`): a generic table with row tones (inserted, deleted, none), highlighted cells, a delta caption, and a row-tick mode. Used by scenes 3, 4 and 12 with different props. It is generic enough for the library because any SQL deck needs to show table state.
- **Shared helper change:** `library/shared/code-panel.js` gets a `sql` language: uppercase keywords, `NULL` as a constant, and `--` line comments. The change is additive; the `python`, `js` and `xml` paths stay the same. Used by scenes 5, 7 and 9. This touches shared code, so it needs your approval.
- **New scenes in `presentations/triggers-cursores/scenes/`:** 2, 5, 6, 7, 8, 9 and 10. The SSMS window (scene 6) and the Object Explorer tree (scene 2) stay in the presentation until a second SQL deck needs them.
- **Fonts:** reused from `player/vendor/fonts/`. No new browser library and no new npm dependency.

## Verification plan

- The local SQL Server instance (`MSSQLSERVER`, running) and `sqlcmd` are available. Every T-SQL block in the deck runs there, in a scratch database called `TriggersDemo` that I create for this work and drop when the review is done.
- Checks: the totals must read 26 → 32 → 29 → 24. The cursor backfill must match the set-based UPDATE on the same data. The race must give 30 under RCSI and 36 under the default locking reads; the fix must give 36 under RCSI. Scene 10 shows the RCSI case and says so.
- If the instance cannot be reached at review time, I will say so in REVIEW.md and will not claim the numbers were tested.

## Choices I made (to confirm with the approval)

1. The example is a shop with `Orders` and `OrderLines`, and `Orders.Total` is the denormalized column.
2. The look is a light SSMS-style results grid, not the dark look.
3. 12 scenes and 51 steps, for about 12 minutes.
4. Code is shown in T-SQL. Identifiers stay in English (`Orders`, `OrderLines`). Comments inside the code are on screen, so they are in Spanish.
5. The race in scene 10 is shown under RCSI and labelled as such, because under default locking the race does not occur.
6. One shared change (`code-panel.js`, `sql` language) and one new library scene (`result-grid`).

Approval needed before any scene is written: items 1–6 above, plus the scene list.
