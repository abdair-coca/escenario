# How RAG works

- **Slug:** `rag` · **On-screen language:** English · **Code language:** none
- **Audience:** a technical team that already uses LLMs (prompts, tokens, embeddings by name) but has not
  built retrieval. They want the mechanics, the cosine score, and where it fails, not a product pitch.
- **Duration:** ~12 min · 12 scenes · 50 steps

## The one idea

> "RAG finds the passages closest to the question, by cosine, and hands them to the model, which answers from them."

## Concepts the deck must make clear

1. **Chunk:** a piece of a document, small enough to fit in a prompt and meaningful on its own.
2. **Embedding (vector):** a list of numbers that stands for the meaning of a text.
3. **Cosine similarity:** the cosine of the angle between two vectors. It depends on the direction only, not the
   length: 1 means same direction, 0 means unrelated (right angle), −1 means opposite. It is the score retrieval uses.
4. **Retrieval:** compare the question's vector with every chunk vector, rank by cosine, keep the top k.
5. **Generation:** the top k chunks go into the prompt with the instruction and the question; the LLM writes the answer.

## The running example

A question to a team bot that reads a company handbook (fictional, 60 pages):
**"How many weeks of parental leave do we get?"** Section 4.2 says 16 weeks, paid. The model alone answers
"12 weeks", fluently and wrongly.

The math uses two numbers per vector, for drawing only (real embeddings have hundreds):

| Vector | Value | Length |
|---|---|---|
| question `q` | (4, 3) | 5 |
| chunk 4.2 "Parental leave" `a` | (3, 4) | 5 |
| chunk 4.5 "Paternity leave" | (2, 3) | √13 ≈ 3.61 |
| chunk 4.3 "Return to work" | (4, 1) | √17 ≈ 4.12 |
| chunk 7.1 "Parking" | (3, −4) | 5 |

Cosine scores, computed from those vectors: 4.2 → 24 / (5 · 5) = **0.96**; 4.5 → 17 / (5 · 3.61) = **0.94**;
4.3 → 19 / (5 · 4.12) = **0.92**; 7.1 → 0 / 25 = **0.00**.

| Scene | Where the example shows up |
|---|---|
| 1 | The question is typed; the model answers "12 weeks" with no source |
| 2 | The handbook is indexed once; the question is searched; the answer comes back |
| 3 | Section 4.2 sits inside chunk 2 |
| 4 | The chunks and the question become points; the question lands next to 4.2 |
| 5 | The question and 4.2 point almost the same way: the angle is 16°, cosine 0.96 |
| 6 | The formula with these numbers: 24 / (5 · 5) = 0.96; parking gives 0 |
| 7 | 4.2, 4.5 and 4.3 are the top 3 (k = 3); parking at 0.00 is cut |
| 8 | The three passages go into the prompt; the LLM answers "16 weeks, paid · §4.2" |
| 9 | The whole path once more, with these values |
| 10 | The 16-week row of the leave table is split across two chunks; a code like "HR-17" misses; k = 3 drops a passage; the model guesses |
| 11 | A test set has "parental leave → 4.2" among its ten questions |
| 12 | Back to the question: when RAG is the right tool |

## Look — «index card»

Warm paper with faint ruled lines, like an index card, and a thin vermilion margin line. Ink lines.
Vermilion marks what was retrieved and is moving; teal marks notes; the signal colours mean the same thing in every scene.

| Role | Hex | Used for |
|---|---|---|
| Paper `--paper` | `#F4EFE4` | background, with ruled lines `#E2DACA` every 56 px |
| Ink `--ink` | `#1E1B18` | text, pieces, arrows, axes |
| Pencil `--muted` | `#9C9385` | what is not in focus, the discarded chunks, the axes |
| Vermilion `--accent` | `#D8552B` | the question and what was retrieved (the match, the top k, the packets) |
| Teal `--accent-2` | `#1D6F73` | pins and notes |
| Green `--ok` | `#2F7D4F` | passes: the chunk has the answer, the citation matches |
| Red `--block` | `#B8322A` | fails: no source, a chunk that is missing, a citation not in the passage |

- **Fonts:** *Bricolage Grotesque* (headlines 700, labels 500) and *JetBrains Mono* (vectors, scores, section
  numbers, formulas). The four files are already in `player/vendor/fonts/`; no new files.
- **Size scale (px on 1920×1080):** 40 labels and mono · 56 sentences and formula lines · 72 formula result ·
  96 headlines. 40 is the minimum.
- **Avoids the default look:**
  - *Dark background with floating things:* warm paper with ruled lines; every element sits on the lines, or is
    joined by an arrow or a bracket.
  - *Glows and particles:* none. Scores are bars; points are flat.
  - *Three cards in a row:* chunks are a page cut by brackets (scene 3); the field is a plane (4, 5); the top k is
    a ranked list (7); the prompt is one sheet (8).
  - *Fade + slide up:* pieces are drawn (outline, then label); arrows grow; bars grow; points appear where they belong;
    the formula is written in step by step.

## Scenes

### 1. The model never read it — new: own

- **Idea:** a model answers from what it learned. Your handbook is not in it, and it still sounds sure.
- **On screen:** the question; a confident answer "12 weeks of paid leave" in a box; a red stamp «no source»;
  a handbook page with «16 weeks, paid» and a broken dashed link to the answer.
- **Enters with:** cut (first scene).
- **Steps:**
  1. `question` — the question writes in · *Cue:* this is the question a team bot gets every day.
  2. `guess` — the answer box draws, and «12 weeks of paid leave» writes in · *Cue:* fluent is not the same as right.
  3. `stamp` — the red stamp «no source» · *Cue:* it cites nothing, because it never saw the handbook.
  4. `handbook` — the page with section 4.2 opens; «16 weeks, paid» is highlighted; the link stays broken ·
     *Cue:* the fact exists. The model cannot see it.

### 2. Two phases, one flow — library `pipeline` (props: two lanes)

- **Idea:** RAG has an offline phase (index once) and an online phase (every question). They meet at the search.
- **On screen:** top lane «Index · built once»: Handbook → Chunks → Vectors → Index. Bottom lane «Each question»:
  Query → Search → Prompt → LLM → Answer. A dashed line carries the stored vectors from the Index down into Search.
- **Enters with:** `push` down: we go below the handbook to see what it becomes.
- **Steps:**
  1. `index` — the top lane draws · *Cue:* offline, once; again only when the handbook changes.
  2. `query` — the bottom lane starts with Query · *Cue:* every question starts here.
  3. `search` — Query → Search, and the stored vectors arrive along the dashed line · *Cue:* the two lanes meet at
     the search.
  4. `prompt` — Search → Prompt · *Cue:* the best passages are copied into a prompt.
  5. `llm` — Prompt → LLM · *Cue:* the LLM reads the prompt and writes; it does not search your files.
  6. `answer` — LLM → Answer «16 weeks · §4.2» · *Cue:* the answer comes with its section, so a person can check it.

### 3. Chunks: cut the handbook — new: own

- **Idea:** a document is cut into chunks, small enough for a prompt and meaningful on their own.
- **On screen:** a page of grey lines (about 20 lines). Brackets cut it into three chunks that overlap; chunk 2 is
  in vermilion and holds section 4.2. A panel on the right shows chunk 2's text with its section range.
- **Enters with:** `zoom` into the Handbook piece of scene 2.
- **Steps:**
  1. `page` — the page of text · *Cue:* one long document. Nobody can put 60 pages in a prompt, and one vector
     for 60 pages would blur every topic.
  2. `cut` — three brackets, chunk 2 in vermilion · *Cue:* where the cut falls decides what can be found.
  3. `overlap` — the lines shared by two chunks are shaded · *Cue:* neighbours overlap a little, so a sentence split
     by a cut still appears whole in one chunk.
  4. `chunk` — the panel: chunk 2's text with «4.1–4.3» and the 16-week line · *Cue:* this is what the search sees.
     Too big and the answer gets lost; too small and the context is gone.

### 4. Meaning as position — new: own

- **Idea:** an embedding turns text into a vector; texts with similar meaning point to nearby places.
- **On screen:** a plane with two axes (labelled as an illustration: two numbers, real vectors have hundreds).
  Chunks are points, in three groups: «leave», «payroll», «remote work»; parking sits alone. The question arrives
  as a vermilion point. The panel on the right shows the numbers: 4.2 → [3, 4], question → [4, 3].
- **Enters with:** `reveal` out of the chunk-2 panel of scene 3.
- **Steps:**
  1. `chunks` — the points appear with their labels (4.2, 4.5, 4.3, 7.1) · *Cue:* each chunk becomes a vector, a list of numbers.
  2. `clusters` — the groups get their names · *Cue:* chunks about the same topic end up close together. Closeness
     means meaning, not shared words.
  3. `question` — the question arrives as a point beside 4.2 · *Cue:* the question goes through the same step.
  4. `numbers` — the panel shows [3, 4] and [4, 3] · *Cue:* a vector is a list of numbers. Next: how to measure how
     close two of them point.

### 5. Cosine measures direction — new: own

- **Idea:** cosine compares the angle between two vectors, not their lengths.
- **On screen:** the origin with arrows. The question (vermilion) and chunk 4.2 (ink) with a small arc: the angle is
  16°, cosine 0.96. On the right, a scale from −1 to +1.
- **Enters with:** `wipe`: a clean break from the points to the angle.
- **Steps:**
  1. `angle` — the two arrows and the arc · *Cue:* the score is the cosine of the angle between two arrows.
  2. `length` — a longer copy of 4.2 grows along the same direction · *Cue:* length does not count. A long chunk and a
     short one pointing the same way get the same score.
  3. `scale` — the scale fills in: +1 same direction, 0 right angle (unrelated), −1 opposite; 4.2 sits at 0.96,
     parking's arrow is at a right angle, 0.00 · *Cue:* the score runs from −1 to +1. Unrelated text sits near 0.

### 6. The formula, with numbers — new: own

- **Idea:** cosine is a dot product divided by the two lengths, and the numbers can be worked out by hand.
- **On screen:** the formula at the top, then the working, written line by line.
- **Enters with:** `zoom` into the arc of scene 5.
- **Steps:**
  1. `dot` — q · a = 4·3 + 3·4 = 24 · *Cue:* the dot product multiplies matching numbers and adds them.
  2. `lengths` — ‖q‖ = √(4² + 3²) = 5 and ‖a‖ = √(3² + 4²) = 5 · *Cue:* the lengths are Pythagoras on each vector.
     Dividing by them throws away the length of the text.
  3. `score` — cos θ = 24 / (5 · 5) = **0.96** · *Cue:* almost the same direction: this is the score for 4.2.
  4. `zero` — parking: q · a = 4·3 + 3·(−4) = 0, so cos θ = **0.00** · *Cue:* zero means perpendicular, unrelated.
     Right angles give zero, whatever the lengths.

### 7. Retrieval: the closest few — new: own

- **Idea:** the question is compared with every chunk; the scores are ranked; the top k come back as text.
- **On screen:** the question on the left, a bus line to four chunk rows (4.2, 4.5, 4.3, 7.1), each with a score bar.
  A dashed cut line after the third row, «k = 3». A note: «1,236 more chunks, not shown».
- **Enters with:** `push` left: from the formula to the ranked list.
- **Steps:**
  1. `compare` — the bus connects the question to every row · *Cue:* one cosine per chunk. The handbook is not read again.
  2. `score` — the bars grow: 0.96, 0.94, 0.92, 0.00 · *Cue:* each chunk gets a score.
  3. `top-k` — the top three turn vermilion, the cut line appears, parking is grey · *Cue:* k is a setting you choose.
     Large indexes use an approximate search instead of comparing every chunk.
  4. `text` — the three chunks leave as text with their section numbers · *Cue:* what comes back is text and its source,
     not vectors. That text is what the model will read.

### 8. Prompt and answer — new: own

- **Idea:** the prompt is plain text: an instruction, the passages, and the question. The LLM writes the answer word by word.
- **On screen:** one sheet on the left with three parts. An arrow to a box «LLM» on the right. Below it, the answer
  appears word by word, then a green check with «Source: §4.2».
- **Enters with:** `reveal` out of the top-k group of scene 7.
- **Steps:**
  1. `instructions` — the sheet with the instruction «Answer only from these passages. Cite the section.» ·
     *Cue:* the prompt is plain text. The instruction is part of the design.
  2. `passages` — the three passages slide onto the sheet, each with its section · *Cue:* the model sees only these.
  3. `llm` — the question joins the sheet; the sheet goes to the LLM · *Cue:* the LLM does not search. It reads what you gave it.
  4. `answer` — «16 weeks, paid.» writes word by word, then «Source: §4.2» with a green check ·
     *Cue:* it predicts each word from the prompt. The citation lets you check it against the passage.

### 9. One question, end to end — library `pipeline` (props: one path, values on the links)

- **Idea:** the whole path once more, with the real values of this question.
- **On screen:** the question sentence above the path: Query «[4, 3]» → Search (caption «0.96 · 0.94 · 0.92 · 0.00») →
  Prompt «3 chunks» → LLM «writes» → Answer «16 weeks» (caption «§4.2»). Each link carries its value above it.
- **Enters with:** `cut`: the answer of scene 8 is the start of this path.
- **Steps:**
  1. `query` — the question sentence and the Query piece · *Cue:* the question, as the vector [4, 3].
  2. `search` — the link «[4, 3]» and the Search piece with its three scores · *Cue:* compared with every chunk.
  3. `prompt` — the link «top 3» and the Prompt piece · *Cue:* the three best chunks join the instruction and the question.
  4. `llm` — the LLM piece · *Cue:* the LLM writes the answer.
  5. `answer` — the link and the Answer piece «16 weeks», caption «§4.2» · *Cue:* from question to answer, in five hops,
     each one checkable.

### 10. Where it breaks — library `pipeline` (props: pins)

- **Idea:** most failures happen before the LLM writes anything: the right chunk never reached the prompt.
- **On screen:** the flow with Handbook and Chunks at the top and the online lane below, with teal pins added one per
  step where each failure happens. The pins are shown from the start, one per step.
- **Enters with:** `push` up: from the path to the places where it goes wrong.
- **Steps:**
  1. `split` — pin on Chunks: «cut splits the table» / «16-week row is lost» · *Cue:* a cut through a table can hide the answer.
  2. `codes` — pin on Search: «codes like HR-17» / «match poorly» · *Cue:* exact terms may need keyword search as well.
  3. `k` — pin on Prompt: «k = 3: the 16-week» / «passage ranks 4th» · *Cue:* a larger k adds context and noise.
  4. `guess` — pin on LLM: «no passage has it?» / «it still answers» · *Cue:* allow «not in the handbook» as an answer.

### 11. Measure each stage — new: own

- **Idea:** test retrieval and answers separately. A fluent answer looks the same whether it is right or wrong.
- **On screen:** ten squares for ten test questions. Totals on the right: «8 / 10» retrieval, «7 / 8» answers supported.
  Numbers are illustrative.
- **Enters with:** `wipe`: a clean break from the pipeline to measurement.
- **Steps:**
  1. `set` — ten squares, the first labelled «parental leave → 4.2» · *Cue:* a small set with known sources is enough to start.
  2. `retrieval` — eight squares turn green (the right section is in the top 3), two red · *Cue:* if the section is not
     retrieved, no model can save the answer.
  3. `answer` — of the eight, seven get a green check; one red «stated without source» · *Cue:* a fluent wrong answer
     looks like a right one.
  4. `fix` — the two retrieval misses point at chunks or k; the unsupported answer points at the prompt ·
     *Cue:* change one stage, then run the set again.

### 12. When RAG is the right tool — new: own

- **Idea:** RAG adds facts at question time, with sources. Style and behaviour need another tool. Close on the one idea.
- **On screen:** three check boxes, ticked one by one; then the one idea under them.
- **Enters with:** `push` left: from measurement to the decision.
- **Steps:**
  1. `facts` — ☐ «facts that change, or need a source → RAG» · *Cue:* re-indexing updates the answers without retraining.
  2. `style` — ☐ «style, format or behaviour → fine-tuning» · *Cue:* RAG does not change how the model writes.
  3. `small` — ☐ «it fits in the prompt → paste it» · *Cue:* no index needed.
  4. `idea` — the one idea writes in under the boxes · *Cue:* close on the one idea.

## Reuse

- **Library `pipeline`** (existing, `library/pipeline.html`) is used three times with different props: scene 2 (two
  lanes, offline and online), scene 9 (one path with values on the links), scene 10 (a shorter flow with pins).
- **New scenes:** 1, 3, 4, 5, 6, 7, 8, 11, 12 stay in `presentations/rag/scenes/`. None is generic enough for `library/` yet.
- **Shared helpers:** none. No new browser library.
- **Fonts:** reused from `player/vendor/fonts/`.
