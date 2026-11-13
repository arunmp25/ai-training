# Version 3: how it is built

Read the root `CLAUDE.md` first (ground rules, tone, topic id/number table). This file covers the v3 engine and how to add or change slides.

## A topic page
```html
<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Topic 11 · Tools and function calling</title>
<link rel="stylesheet" href="../assets/style.css?v=3.2">
<link rel="stylesheet" href="../assets/widgets.css?v=3.2">
<link rel="stylesheet" href="../assets/story.css?v=3.2">
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

<script src="../assets/course.js?v=3.2"></script>
<script src="../assets/widgets.js?v=3.2"></script>
<script> /* page script: W.* calls, W.BTS entries */ </script>
<script src="../assets/deck.js?v=3.2"></script>   <!-- always last -->
</body></html>
```
- Title slide eyebrow is always `Session S · Topic N`; `<title>` is `Topic N · Title`.
- Each topic ends with “Did it click?” (`W.quiz`) and “What to remember”, and usually a closing question that bridges to the next topic.
- Every slide has `<aside class="notes">` with: a time tag (hidden unless D is on), a `<p class="say">` talk track of two or three spoken sentences, then a `<ul>` of tips. The notes panel (N key or 📝 Notes) shows them and labels the list “Tips”.
- Slide index in the URL hash is 1-based (`topic.html#4`). Inserting a slide shifts later indexes, so check any `href="...html#N"` links (the course page and Topic 17 link to `00-decoding-ai-jargon.html#2` and `#8`).

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
Used for every multi-step flow (10 slides, `data-title` starts with “Sequence:”, class `seq-slide`).
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
- Existing diagrams: Topic 2 (pressing Enter), 5 (re-sent history), 8 (RAG indexing and query), 10 (hybrid search and re-ranking), 11 (tool call), 12 (parallel calls and a failure), 13 (MCP session), 14 (agent loop), 16 (permissions and hooks), 17 (injection defences).

### Behind the scenes drawer: `W.BTS`
A button `<button class="btn bts-btn" data-bts="quote">🎬 Behind the scenes</button>` opens a side drawer with real JSON. Define the content in the page script:
```js
W.BTS.quote = { title: "...", sub: "...", parts: [
  { label: "Request", c: "accent", json: `{ "model": "claude-sonnet-5-5" // comments allowed }`, note: "Optional caption" },
]};
```
`W.hl` colours the JSON and supports `//` comments. Existing keys: firstchat (T2), stream (T3), stateless (T5), sysuser (T6), augmented (T8), royal (T9), quote (T11), mcp (T13), loop (T14), rules (T16), inject (T17).

### Unused leftovers
`W.scene`, `W.CAST`, `W.castCards` and the `.scene`/`.cast`/`.storyline` styles are from the dropped character-story version. Nothing uses them; leave them or delete them, but do not bring characters back.

## Checklist after changing v3
1. Bump `?v=3.2` in all v3 pages if you changed anything in `assets/`.
2. Open every changed topic at 1280×720: no console errors, no slide scroll, widgets work with → and clicks.
3. Every slide still has a `.say` note; cross-references use the new topic numbers.
4. Rebuild `AI-Training-v3.zip` (see root `CLAUDE.md`) and commit.
