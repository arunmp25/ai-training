# Project history

What has been built so far, why, and the feedback that shaped it. Newest at the bottom. Read this before changing content or tone.

## Goal
AI-architect style training for a whole team on concepts (RAG, tools, MCP, agents, the agent harness), not code. Delivered as interactive HTML: one file per topic, plus an index. Presented live on a projector with a clicker, and usable by people on their own laptops.

## Version 1 (archived, `v1/`)
- Topic decks 00–13 and a “full journey” deck (`b1`).
- Two delivery options: **A** builds up layer by layer; **B** shows the big picture first. The course page compares them.
- Timings shown on every slide. Lighter RAG and tools content.

## Version 2 (stable, `v2/`)
- Option A only.
- Timings hidden by default (D key to show).
- RAG split into three topics: RAG (07), embeddings and similarity (07b), vector databases and retrieval (07c): chunking and overlap, cosine similarity by hand, HNSW, filters, hybrid search, re-ranking, retrieval metrics.
- Tools split into two: tools (08) and a deep dive (08b): schemas, the message exchange, parallel calls, tool choice, errors, structured output, tool design.
- User verdict: “good but becomes dry very easily”.

## Version 3 (previous, `v3/`)
### The request
- Start session 1 by decoding AI jargon and layering it out.
- Give it a story line the audience can follow, with humour. Agents like Claude Code and GitHub Copilot as one line; building with APIs as another.
- After prompts, someone asks “can I send a 20,000-page document in the prompt?”, which leads into RAG.
- A funny RAG example: keyword search for things belonging to the King misses the Queen’s items; vector search finds them.
- Someone asks how to get real-time insurance rating data, which leads into tools and a rating engine.
- Show the JSON “behind the scenes” wherever it applies. Reduce topics if needed.
- Create a new version first, then plan before building.

### Decisions
- v3 started as a copy of v2. The user asked whether content had been lost; the rule since then is that **every v2 slide is kept**.
- Built a story version with a cast of characters, dialogue scenes, cliffhangers and Day 1/2/3 labels.

### Feedback: “keep it professional, don’t make it dramatic”
The user asked for relatable or funny references only, no Day labels (sessions only), and no characters. So:
- Removed the cast, all dialogue scenes and storyline badges. Character names became “the customer”, “your app”, “the assistant”.
- Structure is Session 1–3 with Topics 1–17 (numbers shown to the audience; file ids unchanged).
- Kept short neutral example slides: the “[Your Name]” email (T2), same question two answers and tokens sold by the slice (T3), who is “he” (T4), the forgetful chat (T5), the 20,000-page question (end of T6) and cost calculator (T7), the royal inventory search with the King prawn curry and king − man + woman (T9), POL-88812 vs POL-88821 (T10), the ₹9,999 stale-rate answer that leads into tools (end of T10), four apps needing one rating engine and the drawer of chargers that leads into MCP (end of T12), Ferrari or tractor (T15), the overnight run with `pricing_v2_final_FINAL` (T16), the pirate claim prompt injection (T17), and a final recap matching each example to its concept.
- 🎬 Behind the scenes drawers with real JSON on 11 slides.

### Feedback: “people are technical, add sequence diagrams for multi-step processes”
- Added `W.seq`, a step-through SVG sequence diagram with a side panel that shows the real message for each step.
- Ten diagrams: pressing Enter (T2), re-sent history (T5), RAG indexing and query (T8), hybrid search and re-ranking (T10), tool call (T11), parallel calls and a failure (T12), MCP session (T13), agent loop (T14), permissions and hooks (T16), injection defences (T17).

### Feedback: “the MCP diagram was not displaying”, “add speaker notes that can be hidden”, “zip version 3”
- Diagrams started blank until → was pressed, which looked broken. They now show the whole flow faintly from the start. Added a minimum height and `?v=3.2` cache-busting on asset links.
- Added a spoken 🎤 Say talk track to all 187 slides, above the existing tips. Notes are hidden by default; N or the 📝 Notes button toggles them and the choice is remembered.
- Fixed 57 cross-references that still used old v2 topic numbers, and a leftover “Three days” slide title.
- Packaged `AI-Training-v3.zip` (v3 only, self-contained).

### Git
- Repository initialised and pushed to https://github.com/arunmp25/ai-training on `main` (first commit 2026-11-13).

## Version 4 (latest, `v4/`)
### The request (2026-11-21)
- In the opening section on how AI interaction works, add a slide on prompt structure: system prompt, user prompt and so on.
- Add sample Python programs for tool calls, each with its sequence diagram and the request that is sent.
- Create v4 as a copy of v3 and make the changes there. Use the EY official theme, keeping light and dark.

### What was built
- `v4/` copied from v3; every v3 slide kept (188 → 194 slides).
- **EY theme:** EY Yellow on EY dark grey in dark mode, white and light grey in light mode, EY secondary colours for the six layers, Arial-family font, square corners, yellow progress bar, eyebrow blocks and a slanted yellow beam on title slides. The EY logo is not used.
- **Topic 2:** “The parts of a request” (click each part: settings, system prompt, tools, user turn, assistant turn, latest message, response, plus an annotated Behind the scenes drawer) and “Python: the same request in code” (a code walkthrough of `first_call.py`).
- **Topic 11:** “Python: a tool call in code” (`tool_call.py`, 7 steps with both requests and responses in full) and “Sequence: The Python program, request by request”.
- **Topic 12:** “Python: the tool loop” (`tool_loop.py`: two parallel tool calls, one fails with `is_error`, the model retries) and “Sequence: The Python loop, request by request”.
- New widget `W.codeWalk` and Python colouring `W.py`. Runnable samples in `v4/code/`.
- Topic minutes: Topic 2 10 → 16, Topic 11 10 → 17, Topic 12 12 → 19.
- Root picker lists v4 as latest. `AI-Training-v4.zip` packaged.

### Follow-up: MCP comparisons (2026-11-21)
- The user asked for a slide on the difference between a regular tool call and MCP, and asked whether any slide compared API and MCP (none in the course did; only the Guidewire deck in `presentations/`).
- **Topic 13** gained “Tool call vs MCP” (a side-by-side table, and the same call on the wire both ways: steps 2 and 4 are identical) and “API vs MCP” (a side-by-side table, a ten-line FastMCP server wrapping the rating engine API, and “Why not just REST?”). Two quiz questions added. Topic 13 minutes 10 → 16. Asset links bumped to `?v=4.1`. v4 now has 196 slides.

### Follow-up: agents and agent patterns (2026-11-21)
- The user asked for a section on AI agents before the harness topic: how an agent differs from prompting, examples in LangChain and LangGraph, and agent patterns (orchestrator, workflow and others). “Animations are a must.”
- **New Topic 15 “AI agents: from prompt to agent”** (`10b-ai-agents.html`, 12 slides): animated prompt vs chain vs agent (`W.arch`, three flows), a comparison table, the six parts of an agent, frameworks, a LangChain `create_agent` walkthrough with a sequence diagram, the LangGraph graph animated, the LangGraph code walkthrough, and when to use which.
- **New Topic 16 “Agent design patterns”** (`10c-agent-patterns.html`, 14 slides): the workflow-to-agent map, then eight animated patterns with the claims example: prompt chaining, routing, parallelisation (sectioning and voting), orchestrator–workers, evaluator–optimiser, ReAct and plan-and-execute, multi-agent (supervisor and handoff), human in the loop. LangGraph code tabs (conditional edges, `Send`, `interrupt`), a “which pattern?” exercise and a quiz.
- Harness, customising and safety moved from Topics 15–17 to 17–19 and into a new **Session 4** (“Harnesses, customisation and safety”). Session 3 is now “Connectors and agents” (Topics 13–16). All cross-references renumbered; the roadmap in Topic 1 now says four sessions (and “TOPIC” instead of a leftover “EPISODE”); the final recap in Topic 19 includes the two new topics.
- `W.arch` gained an upward edge (`"u"`). New sample programs `code/langchain_agent.py` and `code/langgraph_agent.py` (syntax-checked, not run against the API). v4 now has 222 slides.

### Three sessions (v4)
- The user asked for Topics 1–7 on day 1, 8–13 on day 2 and the rest on day 3 (written as Sessions, per the course rules).
- Session 1 “How AI works, prompts and context” = Topics 1–7; Session 2 “Knowledge, tools and MCP” = Topics 8–13; Session 3 “Agents, harnesses and safety” = Topics 14–19. Session 4 is gone.
- Eyebrows, the roadmap (back to three columns), session hand-off notes (end of Session 1 now on Topic 7, end of Session 2 on Topic 13) and the jargon quiz text updated. Topic 17’s eyebrow wrongly said Topic 19; fixed. Assets `?v=4.3`.

### Model selection topic + three-session re-order (v4)
- New **Topic 6 “Choosing a model”** (`04b-model-selection.html`, 11 slides) in Session 1, after The context window: big/medium/small tiers with Anthropic list prices, a five-point checklist, an animated cost calculator, an animated router (route the request to the cheapest model that fits, with an escalation flow), the effort/thinking dial, an animated “test on your own examples” table with a 95% bar, a which-size exercise and a quiz. Uses Opus/Sonnet/Haiku 5.x model names.
- Session 3 re-ordered to The agentic loop → Agent harnesses → Customising the harness → Safety and evals (Topics 15–18). The two code-heavy topics, **AI agents** and **Agent design patterns**, moved to the end as **optional Topics 19–20** (files 10b/10c kept, not deleted); their eyebrows now read “Optional”.
- Everything renumbered (file ids unchanged; audience numbers shifted): Session 1 = Topics 1–8, Session 2 = 9–14, Session 3 = 15–18, optional 19–20. All cross-references, the roadmap (four columns: three sessions + Optional), the course page, the jargon recap and the docs updated. Assets `?v=4.4`.

### Worked examples and a context-bar fix (v4, 23 Nov 2026)
- Seven **Worked example** slides set in the team’s own world (Guidewire PolicyCenter, motor and home insurance), one per topic where a concept benefits from a real task:
  - Topic 3 “A confident wrong answer”: an invented deductible and an invented Gosu method, each with its fix. The tokenizer presets gained **Gosu**, and Numbers now uses MTR-55120.
  - Topic 4 “The buried instruction”: an FNOL summary that misses a buried delivery-use rule, then the same prompt with the task first, tagged data and the rule repeated.
  - Topic 7 “Prompts for your role”: three tabbed prompts (business analyst, developer, tester) for a young-driver surcharge, with the component highlighting.
  - Topic 8 “A developer’s desk”: what goes in context for “add Roadside Assistance coverage”, each item tagged select, compress, write or isolate.
  - Topic 10 “The burst pipe”: keyword search versus search by meaning over home policy clauses (“burst pipe” versus “escape of water”), interactive.
  - Topic 16 “One task, three harnesses”: one failing GUnit test handled by a terminal, IDE and cloud agent.
  - Topic 17 “AGENTS.md up close”: a complete AGENTS.md for a PolicyCenter repo, stepped through section by section with →. The file explorer now shows the same Guidewire repo (AGENTS.md, a one-line CLAUDE.md importing it, `/story-to-gunit`, an `add-coverage` skill, a `gosu-reviewer` subagent, a deny rule on rate tables). The comparison table examples match.
- Topic 5 context bar: thin segments no longer show cramped labels (label only when the block is at least 9% wide; hover title kept).
- Course page hero says “visual, demo-led” instead of “hands-on”.
- Topic minutes raised to match: T3 12 → 14, T4 12 → 15, T7 14 → 17, T8 12 → 15, T10 16 → 19, T16 12 → 15, T17 18 → 22. Fixed a stale “Topic 13” reference in Topic 8 (memory files and subagents are Topic 17). Assets `?v=4.5`. v4 now has 240 slides.

### Optional topics moved into Session 3 (v4, 23 Nov 2026)
- The user wants three sessions only, keeping the optional idea. The separate “Optional” group is gone: Session 3 now holds Topics 15–20, with 19 (AI agents) and 20 (agent design patterns) marked optional.
- `course.js` gives optional topics `opt: 1`. The course page shows “4 TOPICS + 2 OPTIONAL” for Session 3 (with separate minute totals) and “TOPIC 19 · OPTIONAL” on the cards; the Topic 1 roadmap is back to three columns with the same label. Eyebrows read “Session 3 · Topic 19 · Optional”, and the deck bar now says Session 3. Assets `?v=4.6`. Speaker notes at the end of Topic 1’s roadmap, Topic 18, Topic 19 and Topic 20 updated to match.

### The lion-makers (Topic 1, v4, 23 Nov 2026)
- The user asked for the Panchatantra fable of the four scholars who brought a lion to life, adapted as the storyline of the course: the LLM, then knowledge through RAG, hands and legs through tools, and guardrails before it “eats us”, so the lion is put to good use. The user approved the plan first and chose all six stages and the position before “The big picture”.
- New slide 3 in Topic 1, “The lion-makers”: the original story (stage 0), then six stages on → (bones = Model, eyes and ears = Context, our world = Knowledge/RAG, hands and legs = Action/tools and MCP, the breath of life = Autonomy, the fourth friend = Trust/guardrails), each with its topic numbers. Two meters, “What it can do” and “Risk if unchecked”; risk turns red at the agent stage and drops to green when the guardrails arrive. Narrated, no dialogue.
- Later Topic 1 slides shift by one: the jargon dictionary is now `#9` (course page, Topic 18 wrap-up and the Topic 1 takeaways button updated). Topic 1 minutes 14 → 16. Assets `?v=4.7`. v4 now has 241 slides.

## Known loose ends
- These slides still scroll slightly at 1280×720: Topic 15 “The loop in action” (+32px), Topic 16 “The landscape” (+198px) and “Which harness?” (+14px), Topic 17 “Which one?” (+121px). The jargon dictionary scrolls by design.
- Four sequence diagrams scroll inside their box at projector size (RAG, tool retry, MCP, agent loop). The user was offered tighter rows; no answer yet.
- HarborShield, Mrs Patel’s son, the King’s horse Biscuit and a sign-off name in a Topic 2 makeover remain in examples; the user was told and can ask for removal.
- `W.scene`, `W.CAST`, `W.castCards` and their styles are unused leftovers from the character version.
- Product names in Topic 15 (the harness landscape) change quickly; re-check before presenting.
