# Version 7: how it is built

v7 is a copy of v6 (25 Nov 2026). Everything below about v6, v5 and v4 applies; read the paths as `v7/`, the zip as `AI-Training-v7.zip` and asset links as `?v=7.0`.

## What is new in v7
- **Session 1 reordered.** Topic 6 is now Anatomy of a prompt (`05`), Topic 7 Context engineering (`06`), and Choosing a model (`04b`) is optional Topic 8 at the end of Session 1. Every cross-reference was renumbered. Older notes in this file that say “Topic 6 Route to the right model” mean Topic 8 now.
- **`deck.js`: optional topics are skipped by Prev/Next** when you are on a core topic and a core topic lies that way (Topic 7 → Topic 9 RAG). From Topic 18, Next still goes to optional Topic 19. Topic 7’s last slide links to optional Topic 8.
- **Topic 6 (18 slides):** new “Are XML tags good practice?” (→ wraps each part in a tag and adds a rule), “A full prompt with tags” (claims triage prompt stepped block by block, answer in tags, `W.BTS.triage`), “Prompt library” (eight tasks, weak vs strong, colour-coded), “Prompt patterns” (eight, `W.clickInfo`), “Ten best practices” (→ reveals each), “Myths” (flips), “Did it click?” (quiz). Makeovers has six cards.
- **Topic 7 (16 slides):** new “Long chats go stale” (chat fills up, focus meter, three fixes), “Standing context” (custom instructions, agent instructions, projects, instruction files, system prompts), “What Copilot Chat puts on the desk” (layers build up), “Fix the context” (`W.classify` on the four moves), “Context checklist” (seven ticks), two more quiz questions, and an optional deep dive “Order for caching” (`W.BTS.cache` with `cache_control`).
- Both topics use the `stepSlide` helper in their page scripts.

---

# Version 6

v6 is a copy of v5 (24 Nov 2026). Everything below about v5 and v4 applies; read the paths as `v6/`, the zip as `AI-Training-v6.zip` and asset links as `?v=6.0`.

## What is new in v6
- **Completion criteria popup** (`assets/criteria.js`, self-contained CSS). Any element with `data-criteria` opens it; ✕, Got it, Esc, Enter or a click outside closes it. While open it swallows keys so → does not move the slides. Loaded on the course page (yellow “Completion criteria” button) and in Topic 1. Edit the four criteria (attendance, evaluation, questions, feedback after each session) in the `CRIT` array.
- **Topic 1 slide 1 “Before we start”** opens the popup. Every later Topic 1 slide moved up by one: the dictionary is `#10` and the self-check `#3` (course page and Topic 18 links updated).
- Crisper text: `-webkit-font-smoothing: auto` (was `antialiased`, which thins light text on dark), code line numbers at `.85` opacity.
- **Contrast pass (asset version 6.1).** Unrevealed or dimmed states have a floor of about 50% opacity (were 15–40%); sequence diagram upcoming steps 32%, past steps 75%. Dark layer colours slightly brighter (`--c-model` #4FB3F2, `--c-context` #B8A0EC, `--c-autonomy` #FF7BAC, `--bad` #FF6B6B); light green, teal, orange and warn slightly darker. Tags 13px, code panes 12–12.5px, no text under 12px in topic pages. Topic 4 step pills use `--muted` text when inactive. Text below 4.5:1 dropped from 1,083 to 523 elements, and what is left is mostly the deliberately dimmed “pending” states.
- Keep new faded states at 0.5 opacity or more, and text at 12px or more.
---

# Version 5

v5 is a copy of v4 (23 Nov 2026) with a practical Session 2. The engine, widgets and theme are unchanged, so everything below about v4 applies to v5; read `v4/` paths as `v5/` and the zip as `AI-Training-v5.zip`.

## What is new in v5
- **Optional deep dives.** Technical slides that are not needed on the main path sit after a topic’s Takeaways, behind a “Deep dive” divider slide (eyebrow `Optional · Deep dive`, `data-goto` links to each slide, a `data-nexttopic` skip button). Their eyebrows start with “Deep dive · ”. Topic 10 has six (vectors, king − man + woman, real embeddings, cosine, by hand, metrics); Topic 11 has three (brute force, HNSW, more techniques). Course minutes count the main path only.
- **`stepSlide(title, max, go)`** (page script in Topics 10 and 11): → steps a slide through states 0…max before leaving, like `W.seq`; arriving with ← shows the last state.
- Topic 10 new slides: “Where you’d use it” (six uses on an animated meaning map), “What does it cost?” (slider; embedding vs a month of answers), model families on “Choosing an embedding model”.
- Topic 11 new slides: “Nine RAG patterns” (animated flows with a retry loop), “Which pattern?” (`W.classify`), “Start simple” (ladder with meters), “Which vector database?” (four questions → a recommendation), “Build or buy?” (use it / configure it / build it).
- Product names on those slides are as of November 2026; re-check before presenting.

---

Read the root `CLAUDE.md` first (ground rules, tone, topic id/number table). This file covers the v4 engine and how to add or change slides. v4 is a copy of v3 with the EY theme, a prompt structure slide and Python code walkthroughs; everything below about v3 still applies.

## A topic page
```html
<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Topic 11 · Tools and function calling</title>
<link rel="stylesheet" href="../assets/style.css?v=5.0">
<link rel="stylesheet" href="../assets/widgets.css?v=5.0">
<link rel="stylesheet" href="../assets/story.css?v=5.0">
</head>
<body class="deck" data-id="08">            <!-- id = key in course.js -->

<section class="slide title-slide" data-title="Welcome">
  <div class="big-emoji">🔧</div>
  <div class="eyebrow">Session 2 · Topic 11</div>
  <h1>Tools: giving AI hands</h1>
  <p class="sub">One-line promise of the topic.</p>
  <aside class="notes"><span class="tag time">⏱ 30 sec</span><p class="say"><b>🎤 Say</b> Spoken talk track.</p><ul><li>Tip for the presenter.</li></ul></aside>
</section>

<section class="slide" data-title="Short bar title">
  <div class="eyebrow">Walkthrough</div>
  <h2>Headline that states the point</h2>
  <p class="sub">What to do on this slide.</p>
  <div id="myWidget"></div>
  <aside class="notes">...</aside>
</section>

<script src="../assets/course.js?v=5.0"></script>
<script src="../assets/widgets.js?v=5.0"></script>
<script> /* page script: W.* calls, W.BTS entries */ </script>
<script src="../assets/deck.js?v=5.0"></script>   <!-- always last -->
</body></html>
```
- Title slide eyebrow is always `Session S · Topic N`; `<title>` is `Topic N · Title`.
- Each topic ends with “Did it click?” (`W.quiz`) and “What to remember”, and usually a closing question that bridges to the next topic.
- Every slide has `<aside class="notes">` with: a time tag (hidden unless D is on), a `<p class="say">` talk track of two or three spoken sentences, then a `<ul>` of tips. The notes panel (N key or 📝 Notes) shows them and labels the list “Tips”.
- Slide index in the URL hash is 1-based (`topic.html#4`). Inserting a slide shifts later indexes, so check any `href="...html#N"` links (the course page and the Topic 18 wrap-up link to `00-decoding-ai-jargon.html#2` and `#9`).

## Deck engine (`assets/deck.js`)
- Keys: ← → PageUp PageDown (clicker), Home/End, N notes, D timings, F full screen, T theme.
- Events on `document`:
  - `slide:enter` `{index, slide, back}` after a slide is shown (`back` is true when arriving with ←).
  - `slide:advance` `{index, slide}` is **cancelable** and fires before → moves on. Widgets call `preventDefault()` to consume the key press (sequence diagrams use this to reveal the next arrow).
- localStorage: `aitrain-theme`, `aitrain-track`, `aitrain-showtime`, `aitrain-notes` (notes panel open).
- The bar label is `Session N · Topic N · Title · slide title`, built from `course.js`.

## Widgets (`assets/widgets.js`, global `W`)
General: `tabs`, `flips`, `stepper`, `classify`, `clickInfo`, `quiz`, `switch`, `chip`, `layerMap`, plus topic-specific ones (`nextToken`, `generate`, `attention`, `contextBar`, `loop`, `promptBuilder`, `bars`). Read the source for options; most take `(el, items, opts)`. Colours come from layer names via `W.cv("model" | "context" | "knowledge" | "action" | "autonomy" | "trust" | "good" | "bad" | "warn" | "accent")`.

### Sequence diagrams: `W.seq`
Used for every multi-step flow (13 slides, `data-title` starts with “Sequence:”, class `seq-slide`).
```js
W.seq(document.getElementById("seqTool"), {
  actors: [{ id: "user", name: "Customer", icon: "🙋", c: "accent" }, { id: "app", name: "Your app", icon: "🖥️", c: "autonomy" }, ...],
  steps: [
    { sep: "At start-up" },                                   // labelled divider
    { from: "app", to: "model", label: "Request 1", note: "Shown in the side panel", code: `{ "json": true }` },
    { from: "model", to: "app", label: "tool_use", ret: true },  // ret = dashed reply arrow
    { from: "app", to: "app", label: "Validate" },               // self-call
  ],
  frames: [{ from: 2, to: 9, label: "loop · until end_turn", c: "warn" }], // 0-based message indexes
});
```
- Upcoming steps show faintly; → or Next lights them up one by one, then → leaves the slide. Clicking an arrow jumps to it.
- Labels go into SVG text: escape `<` as `&lt;`. Keep labels under about 28 characters; 3–5 actors work best.
- Long diagrams scroll inside their box with a fixed header and follow the current step.
- Existing diagrams: Topic 2 (pressing Enter), 5 (re-sent history), 8 (RAG indexing and query), 10 (hybrid search and re-ranking), 11 (tool call; the Python program request by request), 12 (parallel calls and a failure; the Python loop request by request), 13 (MCP session), 14 (agent loop), 15 (what create_agent does), 18 (permissions and hooks), 19 (injection defences).

### Architecture diagrams: `W.arch`
Boxes and arrows with animated dots that travel along the arrows (accent = request, green = reply, red = blocked). Several named flows can share one diagram. Used in Topic 6 “Route to the right model”, Topic 15 “Architecture: A multi-agent application”, optional Topic 19 (prompt, chain or agent; the LangGraph graph) and all eight pattern slides in optional Topic 20 (class `seq-slide arch-slide`, data in the page script as `AN`, `AE`, `AF`). A standalone copy lives at `samples/architecture-demo.html`.
```js
W.arch(el, {
  vb: [1160, 640],                                     // SVG viewBox; boxes use these units
  cols: [[90, "Client"], ...],                         // column headings (x centre)
  nodes: { app: { x, y, w, h, c: "accent", tag: "Backend", t: "App", s: ["sub line"], d: "Shown when clicked" } },
  edges: { "app-orch": ["app", "orch", "h", 0] },      // "h" right side→left side (optional y offset), "v" bottom→top, "u" top→bottom (v4)
  obs: "Observability · traces, cost, evals",          // optional log strip along the bottom
  flows: [{ name, intro, steps: [{ who, t, note, code, log,
    on: ["app"], think: ["orch"], bad: ["guard"],       // glowing / pulsing / red boxes
    p: [{ e: "app-orch" }, { e: "app-orch", r: 1, d: 1 }, { e: "...", x: 1 }] }] }], // r reply, d delay in hops, x blocked
});
```
→ reveals the next step, then leaves the slide. Play runs the flow automatically.

### Behind the scenes drawer: `W.BTS`
A button `<button class="btn bts-btn" data-bts="quote">🎬 Behind the scenes</button>` opens a side drawer with real JSON. Define the content in the page script:
```js
W.BTS.quote = { title: "...", sub: "...", parts: [
  { label: "Request", c: "accent", json: `{ "model": "claude-sonnet-5-5" // comments allowed }`, note: "Optional caption" },
]};
```
`W.hl` colours the JSON and supports `//` comments. Existing keys: firstchat, anatomy (T2), stream (T3), stateless (T5), sysuser (T6), augmented (T8), royal (T9), quote (T11), mcp (T13), loop (T14), rules (T18), inject (T19).

### Code walkthroughs: `W.codeWalk` and `W.py` (v4)
Shows a whole Python program on the left; → or Next highlights a few lines at a time and shows, on the right, what they do and the exact JSON they send or receive. Behaves like `W.seq` with the clicker. Slides use class `seq-slide`, `data-title` starts with “Python:”.
```js
W.codeWalk(el, { file: "code/tool_call.py", code: `...the file's text...`, steps: [
  { lines: [34, 39], c: "accent", t: "Request 1", note: "HTML", label: "Request 1 → POST /v1/messages", json: `{ ... }` },
]});
```
- Optional Topic 19 also walks through `langchain_agent.py` and `langgraph_agent.py` (LangChain `create_agent`; LangGraph `StateGraph` with `ToolNode`, `tools_condition`, `InMemorySaver`). Optional Topic 20 shows LangGraph snippets for routing, `Send` and `interrupt` in tabs.
- The program text is embedded in the page script because `fetch` does not work from `file://`. The same programs live in `v4/code/` (`first_call.py` T2, `tool_call.py` T11, `tool_loop.py` T12) and are linked for download. **If you change a .py file, update the embedded copy and the line numbers in its steps.**
- The samples use the official `anthropic` SDK and `claude-sonnet-5-5`. They were checked against a mocked client; they need `ANTHROPIC_API_KEY` to run for real.
- `W.py(src)` colours Python (keywords, strings, comments, numbers, calls). `W.hl` still does JSON.
- Topic 2 “The parts of a request” uses a page-level script (classes `.anat-*` in `story.css`): clickable parts of a request (settings, system, tools, user, assistant, latest message, response) with a detail card.

### EY theme (v4)
- Tokens are in `assets/style.css` `:root` (dark, the default) and `[data-theme="light"]`. `--brand` is EY Yellow for fills, bars and highlights; `--on-brand` is the text colour on yellow. `--accent` is yellow in dark and EY dark grey in light, because yellow text is unreadable on white. In light, `.accent` text gets a yellow highlighter underline instead.
- Use `--on-fill` (not `#fff`) for text on a layer-coloured fill, and `--brand`/`--on-brand` for anything that should be yellow in both themes.
- Brand details live at the end of `style.css`: yellow progress bar and bar border, a yellow block before each eyebrow, a slanted yellow “beam” and underline on title slides, small corner radii (6px).

### Unused leftovers
`W.scene`, `W.CAST`, `W.castCards` and the `.scene`/`.cast`/`.storyline` styles are from the dropped character-story version. Nothing uses them; leave them or delete them, but do not bring characters back.

## Checklist after changing v4
1. Bump `?v=5.0` in all v4 pages if you changed anything in `assets/`.
2. Open every changed topic at 1280×720: no console errors, no slide scroll, widgets work with → and clicks.
3. Every slide still has a `.say` note; cross-references use the new topic numbers.
4. Rebuild `AI-Training-v4.zip` (see root `CLAUDE.md`) and commit.
