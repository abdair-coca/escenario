# Final review: OOP and data structures

- **Slug:** `repaso-poo` · **On-screen language:** Spanish (es) · **Code language:** Python
- **Audience:** students who already took the whole course. This is the review before the exam: they know the words, but mix them up (overloading vs overriding, abstract class vs interface, stack vs queue). The goal is to put every concept in its place with one picture each.
- **Duration:** ~15 min · 17 scenes · 62 steps (≈ 15 s per step)

## The one idea

> "Las clases son planos para crear objetos que guardan sus datos y saben hacer cosas; las estructuras de datos deciden en qué orden guardo y saco esos datos."

On screen, at the end, in short: «Clases para modelar, estructuras para organizar».

## The running example

**La heladería de los robots.** A small ice-cream shop run by robots. The same characters appear from the first scene to the last:

- **Robi**, a `RobotHeladero` that serves ice cream, and **Caja**, a `RobotCajero` that charges. Both are built from the `Robot` class.
- The **menu** of flavours (vainilla, fresa, chocolate, then arándano).
- The **cone**, where scoops pile up.
- The **line** of customers: Ana, Beto, Caro, then Dani.
- The **orders** (numbered tickets) that Robi keeps in a tree to find them fast.

| Scene | Where the example shows up |
|---|---|
| 1 | The shop front: Robi and Caja behind the counter, the menu, a cone, the order board, the line |
| 2–5 | The `Robot` class: its blueprint, its parts, how Robi is built, its locked battery |
| 6–10 | Robi and Caja as a family of classes: inheritance, `trabajar()`, `servir()`, abstract `Robot`, `Cobrable` |
| 11 | The menu as a list |
| 12 | The cone as a stack |
| 13 | The customers as a queue |
| 14 | Counting the scoops of a cone with recursion |
| 15–16 | The orders in a binary search tree; Robi looks for order 60 |
| 17 | The shop front again, every concept stuck on the part it explains |

## Look

Brand look from `DESIGN.md` (`library/shared/brand.css`). Two extras, only for ice-cream scoops, so flavours read at a glance without labels on them:

| Role | Hex | Used for |
|---|---|---|
| `--fresa` | `#F9A8D4` | strawberry scoops and the «fresa» tub |
| `--chocolate` | `#8B5E3C` | chocolate scoops and the «chocolate» tub |

Vainilla is `--paper`, arándano is `--accent-2`. Every scoop still carries its ink outline and hard shadow, and its name sits next to it the first time it appears.

- **Robot sticker:** a rounded rectangle body with a round head, an antenna with a ball, a screen face (two white eyes), a battery bar on the chest in `--blue-mid` with its number, and a name pill. `Robot` in a blueprint is white lines on `--accent-3`; Robi is `--accent-2`; Caja is `--accent` with white details.
- **Code** uses the shared code panel (`library/shared/code-panel.js`), JetBrains Mono 40 px, the line in focus on an `--accent-2` bar. Never more than 8 lines on screen.
- **Right / wrong** (`TypeError`, rejected values, the green tick) use `--ok` / `--block` only.
- **Decoration and mascot:**
  - Decorations: a striped awning and a ground strip in `--accent-3` in scenes 1 and 17; two sparkles at the top edges of scene 2 (the blueprint). None elsewhere, so the diagrams use the whole canvas.
  - Mascot: no. The robots are the characters; customers are simple round heads in the brand blues with name pills.

## Scenes

### Part 1 — Programación orientada a objetos

### 1. The robot shop — new: own

- **Idea:** everything today happens in one place; OOP builds the robots, data structures organise the shop.
- **On screen:** headline «Repaso final: POO» with the subtitle «en la heladería de los robots». Below, the shop front: awning, counter, Robi and Caja behind it, the menu board on the wall, a cone on the counter, an order board («Pedidos») with a small tree, three customers waiting.
- **Enters with:** `cut` (first scene).
- **Steps:**
  1. `titulo` — the headline and subtitle write in · *Cue:* último repaso antes del examen. Hoy vamos a recorrer todo el curso en un solo lugar.
  2. `tienda` — the shop pops in piece by piece: awning, counter, robots, menu, cone, customers · *Cue:* una heladería atendida por robots. Todo lo que vimos en el semestre está aquí dentro.
  3. `partes` — two pills with arrows: «Parte 1 · POO» pointing at the robots, «Parte 2 · Estructuras de datos» pointing at the menu, the cone and the line · *Cue:* primero, cómo se construyen los robots. Después, cómo se organizan los sabores, los clientes y los pedidos.

### 2. Class and object — new: own

- **Idea:** a class is a blueprint; objects are the real robots built from it, each with its own data.
- **On screen:** headline «Clase y objeto». Left: a navy blueprint panel «class Robot» with a robot outline in white dashed lines and empty slots «nombre: ?», «batería: ?». Right: the robots that come out of it.
- **Enters with:** `zoom` into Robi in scene 1 (`.robot-robi`): we go inside a robot to see what it was made from.
- **Steps:**
  1. `plano` — the blueprint draws itself, slots empty · *Cue:* la clase es el plano. Dice qué tiene y qué hace un robot, pero no es ningún robot.
  2. `objetos` — an arrow, then Robi and Caja pop out, each with its code line under it: `robi = Robot("Robi")`, `caja = Robot("Caja")` · *Cue:* con un plano fabrico todos los robots que quiera. Cada uno es un objeto, una instancia.
  3. `independientes` — Caja's battery drops from 100 to 40; Robi's stays at 100 · *Cue:* cada objeto tiene sus propios datos. Si Caja gasta batería, Robi no se entera.

### 3. Attributes and methods — new: own

- **Idea:** attributes are what an object has; methods are what it does.
- **On screen:** headline «Atributos y métodos». Robi big on the left; the `Robot` class code on the right (6 lines).
- **Enters with:** `reveal` from Robi in scene 2 (`.made-robi`): the small Robi grows into the big one.
- **Steps:**
  1. `atributos` — labels with leader lines on the name pill and the battery: «nombre», «bateria» · «lo que tiene»; the matching `self.` lines highlight · *Cue:* los atributos son los datos del objeto. Lo que tiene.
  2. `metodos` — two buttons appear on Robi's chest: `trabajar()` and `cargar()` · «lo que hace»; the `def` lines highlight · *Cue:* los métodos son funciones que viven dentro de la clase. Lo que sabe hacer.
  3. `llamada` — `robi.trabajar()` writes under Robi, the button presses, the battery goes 100 → 90 · *Cue:* llamo a un método con el punto. Y el método cambia los atributos de ese objeto.

### 4. The constructor — new: own

- **Idea:** `__init__` runs when the object is created and fills its attributes; `self` is "this object being built".
- **On screen:** headline «El constructor: `__init__`». Left: a robot factory machine with a slot on top. Right: the code of `__init__` (3 lines).
- **Enters with:** `push` left: the camera moves to the factory next door.
- **Steps:**
  1. `llamada` — a pill `Robot("Robi")` drops onto the machine's slot · *Cue:* cuando escribo Robot con paréntesis, Python llama solo al constructor.
  2. `self` — an empty robot appears inside the machine with a tag «self» · *Cue:* self es el objeto que se está armando. "Este robot".
  3. `rellena` — the two `self.` lines highlight one by one and fill the robot's slots: «Robi», «100» · *Cue:* el constructor llena los atributos: self.nombre es "el nombre de este robot".
  4. `sale` — Robi rolls out of the machine; a tag `robi` points at it · *Cue:* sale listo y la variable robi lo apunta.

### 5. Encapsulation — new: own

- **Idea:** the object protects its data; outside code changes it only through methods that check the values.
- **On screen:** headline «Encapsulamiento». Robi on the left with its battery behind a little door with a padlock. Right: code with `self.__bateria` and `cargar(cantidad)` with an `if`.
- **Enters with:** `zoom` into Robi's battery (`.battery` in scene 4).
- **Steps:**
  1. `privado` — the padlock closes on the battery; the `__bateria` line highlights; a row of three small pills: `nombre` público · `_nombre` protegido · `__nombre` privado · *Cue:* en Python el guion bajo es la convención: uno es "protegido", dos es "privado".
  2. `directo` — `robi.__bateria` from outside bumps against the padlock: red ✗ `AttributeError` · *Cue:* desde afuera no puedo leerla así.
  3. `metodo` — `robi.cargar(20)` goes through a slot in the door: battery 100 → 120, green ✓ · *Cue:* para tocarla uso un método. El objeto decide cómo.
  4. `valida` — `robi.cargar(-50)` hits the `if` line and bounces back: red ✗, battery stays 120 · *Cue:* y el método puede rechazar valores malos. Eso es encapsular: proteger los datos.

### 6. Inheritance — new: own

- **Idea:** a child class reuses everything from its parent and adds its own; "a heladero IS A robot".
- **On screen:** headline «Herencia». A class diagram: `Robot` card on top; `RobotHeladero` and `RobotCajero` below, with arrows pointing up to the parent. Code on the right (4 lines).
- **Enters with:** `wipe` in `--accent`: a clean break, from one robot to a family of robots.
- **Steps:**
  1. `padre` — the `Robot` card: `nombre`, `bateria`, `cargar()` · *Cue:* esta es la clase padre, lo común a todos los robots.
  2. `hijos` — the two child cards and their arrows; the parent's items slide down into them in `--muted` with the tag «heredado» · *Cue:* las hijas heredan todo sin escribirlo otra vez.
  3. `propio` — each child adds its own in ink: Heladero `sabores`, `servir()`; Cajero `caja`, `cobrar()` · *Cue:* y cada una agrega lo suyo.
  4. `super` — code `class RobotHeladero(Robot):` and `super().__init__(nombre)` highlight; a pill «es un» on the arrow · *Cue:* super llama al constructor del padre. Prueba de oro: un heladero ES UN robot.

### 7. Polymorphism — new: own

- **Idea:** each child rewrites `trabajar()` (overriding); calling the same method on different objects gives different results.
- **On screen:** headline «Polimorfismo». Left: the two child classes, each with its own `trabajar()`, and a loop under them. Right: Robi and Caja.
- **Enters with:** `push` left: the camera moves from the class diagram to the robots that run it.
- **Steps:**
  1. `sobrescribir` — the two classes type in; both `def trabajar` lines light up · *Cue:* las dos hijas reescriben trabajar(). Mismo nombre, otro comportamiento.
  2. `bucle` — code `for r in [robi, caja]:` / `print(r.trabajar())`; a pointer `r` sits under Robi · *Cue:* el bucle no sabe ni le importa qué tipo de robot es.
  3. `respuestas` — Robi's bubble «¡Sirvo un helado!», the pointer moves to Caja, Caja's bubble «Cobro $3»; each `return` line lights up in turn · *Cue:* el mismo mensaje y cada uno responde a su manera.
  4. `idea` — a pill «mismo mensaje, distinta respuesta» · *Cue:* eso es polimorfismo: muchas formas detrás de una sola llamada.

### 8. Overriding vs overloading — new: own

- **Idea:** overriding = a child replaces a parent's method with the same signature; overloading = same name, different parameters. Python fakes overloading with default values.
- **On screen:** headline «Sobrescritura vs sobrecarga». Two halves split by a dashed line. Left: parent `trabajar()` → child `trabajar()`. Right: `servir(sabor)` and `servir(sabor, bolas)` in the same class, then the cones they produce.
- **Enters with:** `push` left.
- **Steps:**
  1. `override` — left half: parent and child cards with the same `trabajar()`; the child's covers the parent's. Pill «entre padre e hija» · *Cue:* sobrescribir: la hija reemplaza el método del padre. Misma firma.
  2. `overload` — right half: two `servir` signatures side by side in one class card. Pill «en la misma clase» · *Cue:* sobrecargar: mismo nombre, distintos parámetros. Así se hace en Java o C#.
  3. `python` — the two signatures merge into `def servir(self, sabor, bolas=1)`; two calls produce two cones: `servir("fresa")` → 1 scoop, `servir("fresa", 3)` → 3 scoops · *Cue:* Python no tiene sobrecarga real: usamos valores por defecto.
  4. `trampa` — two `def servir` stacked; the first is crossed out in red, the second gets the pill «gana la última» · *Cue:* ojo en el examen: si definen dos veces el mismo método en Python, la segunda borra a la primera.

### 9. Abstraction and abstract classes — new: own

- **Idea:** abstraction shows what matters and hides the details; an abstract class is a blueprint you cannot build directly, and it forces its children to implement its abstract methods.
- **On screen:** headline «Abstracción». Left: Robi with a control panel of two buttons; behind a lid, gears. Right: code with `ABC` and `@abstractmethod` (5 lines).
- **Enters with:** `reveal` from the parent card of scene 8 (`.override-parent`): the parent becomes the abstract class.
- **Steps:**
  1. `ocultar` — the lid lifts to show the gears, then closes; only the two buttons stay · *Cue:* para usar a Robi aprieto "trabajar". No necesito saber cómo gira cada engranaje.
  2. `abstracta` — the code types in; a `Robot` card turns dashed with the pill «abstracta» · *Cue:* ¿tiene sentido un robot genérico que no sabe hacer nada? No. Robot se vuelve una clase abstracta.
  3. `error` — `Robot("X")` hits the dashed card: red ✗ `TypeError` · *Cue:* no se puede crear un objeto de una clase abstracta.
  4. `obliga` — Heladero and Cajero cards with a green ✓ next to their `trabajar()` · *Cue:* y obliga a las hijas a implementar trabajar(). Si no, tampoco se pueden crear.

### 10. Interfaces — new: own

- **Idea:** an interface is a contract of "what you can do", shared by classes that are not family. Python writes it as an ABC with only abstract methods.
- **On screen:** headline «Interfaces». In the middle, a contract card «Cobrable» with `cobrar(monto)`. Left: Caja (a robot). Right: a coin machine (not a robot). Code below (4 lines).
- **Enters with:** `push` left.
- **Steps:**
  1. `contrato` — the «Cobrable» card with `cobrar(monto)` · *Cue:* una interfaz es un contrato: quien la firme se compromete a tener estos métodos.
  2. `firmantes` — Caja and the coin machine connect to it with arrows; code `class RobotCajero(Robot, Cobrable)` and `class Maquina(Cobrable)` · *Cue:* un robot y una máquina de monedas no son familia, pero los dos pueden cobrar.
  3. `uso` — `def pagar(cosa): cosa.cobrar(3)`: a coin travels to Caja, then to the machine; both ✓ · *Cue:* la función solo pide que sepa cobrar. Polimorfismo otra vez.
  4. `diferencia` — two pills: «herencia: es un» · «interfaz: puede hacer» · *Cue:* herencia es lo que eres; interfaz es lo que sabes hacer. Y una clase puede firmar varias.

### Part 2 — Estructuras de datos

### 11. Lists — new: own

- **Idea:** a list keeps items in order and you reach any of them by its position, starting at 0.
- **On screen:** headline «Listas». The menu board: three flavour tubs in a row (vainilla, fresa, chocolate), each with an index tag `0`, `1`, `2` under it. Code on the right.
- **Enters with:** `wipe` in `--accent-3`: Part 2 starts.
- **Steps:**
  1. `lista` — tubs and index tags pop in; code `sabores = ["vainilla", "fresa", "chocolate"]` · *Cue:* la lista guarda en orden. Cada lugar tiene un número: el índice.
  2. `indice` — `sabores[1]` lights up «fresa»; a pill «empieza en 0» · *Cue:* el primero es el cero. Clásico error de examen.
  3. `agregar` — `sabores.append("arándano")`: a new tub slides in at index `3`; `len(sabores)` → `4` · *Cue:* append agrega al final, y len cuenta cuántos hay.

### 12. Stacks — new: own

- **Idea:** a stack only adds and removes at the top: the last one in is the first one out (LIFO).
- **On screen:** headline «Pilas». A big cone in the middle-left; code on the right (`cono = []`, `append`, `pop`).
- **Enters with:** `reveal` from the chocolate tub of scene 11 (`.tub-chocolate`): a scoop leaves the menu and lands on a cone.
- **Steps:**
  1. `apilar` — three scoops drop onto the cone one after another (vainilla, fresa, chocolate) as three `append` lines type in; a «cima» arrow follows the top · *Cue:* cada bola nueva va arriba. Siempre arriba.
  2. `sacar` — `cono.pop()`: the chocolate scoop lifts off, the result `"chocolate"` appears · *Cue:* y para sacar, solo puedo quitar la de arriba. La última que entró.
  3. `lifo` — pill «LIFO: último en entrar, primero en salir» and two small examples: «Ctrl+Z», «botón atrás» · *Cue:* así funciona deshacer: lo último que hiciste es lo primero que se deshace.

### 13. Queues — new: own

- **Idea:** a queue adds at the back and removes from the front: first in, first out (FIFO).
- **On screen:** headline «Colas». Robi behind the counter on the left; the line of customers to its right. Code under them (`deque`, `append`, `popleft`).
- **Enters with:** `push` left: the camera moves to the line beside the counter.
- **Steps:**
  1. `fila` — Ana, Beto, Caro pop in, in order; code `fila = deque(["Ana", "Beto", "Caro"])`; labels «frente» and «final» · *Cue:* en una cola se entra por atrás y se sale por adelante.
  2. `llega` — Dani joins at the back: `fila.append("Dani")` · *Cue:* el que llega se pone al final.
  3. `atiende` — `fila.popleft()`: Robi hands Ana a cone, Ana leaves, the rest step forward · *Cue:* y se atiende al primero que llegó.
  4. `fifo` — pill «FIFO: primero en entrar, primero en salir», with a small cone icon «pila = LIFO» next to it for contrast · *Cue:* la pila saca el último; la cola, el primero. Ese es todo el truco.

### 14. Recursion — new: own

- **Idea:** a recursive function calls itself with a smaller problem until it reaches a base case; the pending calls pile up like a stack.
- **On screen:** headline «Recursividad». Left: Ana's cone with three scoops. Middle-right: the calls piling up as cards. Code at the bottom right (4 lines).
- **Enters with:** `zoom` into the cone Robi gave Ana in scene 13 (`.served-cone`).
- **Steps:**
  1. `definicion` — the code types in; the last line `return 1 + contar(cono[:-1])` highlights · *Cue:* contar las bolas: una, más las bolas del resto del cono. La función se llama a sí misma.
  2. `baja` — three call cards stack up one by one; each call, the cone loses its top scoop (shown faded): `contar([v, f, c])` → `contar([f, c])` → `contar([c])` · *Cue:* cada llamada recibe un cono más pequeño.
  3. `base` — a fourth card `contar([])` → `0`, outlined in green; the `if not cono` line highlights · *Cue:* cono vacío: cero. Es el caso base. Sin él, la función no termina nunca.
  4. `sube` — the cards resolve from the top down: 0 → 1 → 2 → 3; the result `3` lands on the cone · *Cue:* y de regreso, cada una suma uno.
  5. `pila` — a bracket around the cards with the pill «pila de llamadas» · *Cue:* ¿se dieron cuenta? La computadora guarda las llamadas en una pila.

### 15. Binary trees — new: own

- **Idea:** a node is an object with a value and two links; a binary search tree keeps smaller values left and bigger ones right.
- **On screen:** headline «Árboles binarios». First one node (50) with tags `valor = 50`, `izq = None`, `der = None` and the `Nodo` class under it. That node becomes the root of the orders tree: 50; 30, 70; 20, 40, 60, 80. Tags «raíz», «hijo», «hoja» on their nodes.
- **Enters with:** `wipe` in `--accent`.
- **Steps:**
  1. `nodo` — the node, its three tags and its 5-line class · *Cue:* un nodo es un objeto: guarda un pedido y dos enlaces, izquierda y derecha. POO otra vez.
  2. `arbol` — the tree grows from the root down, one level at a time; labels «raíz» on 50, «hoja» on 20 · *Cue:* arriba la raíz, cada nodo tiene hasta dos hijos, y los de abajo del todo son hojas.
  3. `regla` — the tags leave; the root and its children are written in order under the tree: «30 < 50 < 70» (the same line `bst-walk` starts from, so the cut does not jump) · *Cue:* la regla del árbol de búsqueda: menores a la izquierda, mayores a la derecha, en cada nodo.

### 16. Finding order 60 — library `bst-walk` (props: `mode: "search"`, `values: [50, 30, 70, 20, 40, 60, 80]`, `target: 60`, token «60», recursive `buscar` code, `previousTitle` from scene 15)

- **Idea:** with the rule, Robi finds an order by discarding half of the tree at each step, and the search is recursive.
- **On screen:** the same tree, which slides left; the recursive `buscar` code on the right; the «60» token walking down.
- **Enters with:** `cut`: it continues the tree of scene 15.
- **Steps:**
  1. `codigo` — the code types in: `buscar(nodo, valor)` with its base case and two recursive calls · *Cue:* buscar también es recursivo: si no está aquí, busco en un solo lado.
  2. `comparar-50` — 60 > 50: go right · *Cue:* sesenta es mayor que cincuenta: toda la izquierda queda descartada.
  3. `comparar-70` — 60 < 70: go left · *Cue:* menor que setenta: a la izquierda.
  4. `encontrado` — found 60 · *Cue:* tres comparaciones y no siete. Por eso los árboles son rápidos.

### 17. Everything in its place — new: own

- **Idea:** every concept of the course has a place in the shop.
- **On screen:** the shop front of scene 1, now with stickers stuck on its parts. Headline «Todo en su lugar».
- **Enters with:** `reveal` from the found node of scene 16.
- **Steps:**
  1. `poo` — stickers on the robots: «clase · objeto», «encapsulamiento» on the battery, «herencia · polimorfismo» between Robi and Caja, «interfaz» on Caja's coin slot · *Cue:* los robots: clases, objetos, herencia, polimorfismo, interfaces.
  2. `estructuras` — stickers on the menu «lista», the cone «pila», the line «cola», the order tickets «árbol», and a small «recursividad» on the cone · *Cue:* y la tienda: lista, pila, cola y árbol. Y la recursividad que los recorre.
  3. `idea` — the closing line writes in across the bottom: «Clases para modelar, estructuras para organizar» · *Cue:* si recuerdan una sola frase para el examen, que sea esta.

## Accuracy notes

- **Private attributes in Python** are a convention. `__bateria` is renamed by Python to `_Robot__bateria` (name mangling), so `robi.__bateria` from outside raises `AttributeError` when *read*. Assigning `robi.__bateria = -50` from outside does not fail: it silently creates a new, different attribute. Scene 5 shows the read on purpose. `_nombre` ("protected") is only a hint for programmers.
- **Overloading:** Python has no method overloading by signature: a second `def` with the same name replaces the first. The usual tools are default values, `*args`, or `functools.singledispatchmethod`. Only default values are shown.
- **Interfaces:** Python has no `interface` keyword. An ABC with only abstract methods plays that role; `typing.Protocol` is the other common choice (structural, no inheritance needed). Multiple inheritance is what lets `RobotCajero(Robot, Cobrable)` sign the contract.
- **Abstract classes:** instantiating a class that still has abstract methods raises `TypeError: Can't instantiate abstract class …`. A child that does not implement every abstract method is also abstract.
- **Queues:** `deque.popleft()` is O(1); `list.pop(0)` works but is O(n) because every item shifts. That is why the scene uses `deque`.
- **Stacks:** `list.append` and `list.pop()` are both O(1) at the end of the list.
- **Recursion:** `cono[:-1]` (everything but the top scoop) makes a new, shorter list each call; fine for teaching. Python stops at about 1000 nested calls (`RecursionError`), which is what "no base case" looks like in practice.
- **BST search** takes about log₂(n) comparisons when the tree is balanced; a tree built from sorted data degrades into a list (n comparisons). Not told on screen; a good answer if someone asks.
- The scene 3 `Robot` has a concrete `trabajar()` that spends battery; scene 9 turns it abstract on purpose ("does a generic robot make sense?"). The narration says so.

## Reuse

- **Library scenes:** `bst-walk` (scene 16) in search mode, entering with `previousTitle` like in `arboles-binarios`. `pipeline` and `result-grid` do not fit (no pipeline, no table).
- **New scenes:** 1–15 and 17 stay in `presentations/repaso-poo/scenes/`. They share the robot, the scoop, the cone, the customer and the shop front through a helper in the presentation folder (`scenes/kit.js`). Scene 15 draws its tree with `library/shared/bst-tree.js` so the cut to `bst-walk` does not jump. Scenes 1 and 17 share the same shop layout.
- **Shared helpers:** `scene-kit.js`, `sticker-kit.js` (pills, arrows, sparkles, sticker text), `code-panel.js` (Python), `bst-tree.js`. The DrawSVG plugin already in `player/vendor/gsap/`. No new browser library.
- **Fonts:** Fredoka and JetBrains Mono from the brand.
- **Transitions:** cut (1, 16) · zoom (2 into Robi, 5 into the battery, 14 into the cone) · reveal (3 from Robi, 9 from the parent card, 12 from the chocolate tub, 17 from the found node) · push left (4, 7, 8, 10, 13) · wipe (6 `--accent`, 11 `--accent-3`, 15 `--accent`). Five types, each caused by something on screen.
