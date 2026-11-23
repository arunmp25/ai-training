# AI Training: Building with AI

Interactive HTML training that teaches a whole team, technical and non-technical, the concepts behind modern AI systems: the jargon, prompts, context, RAG, embeddings, vector databases, tools, MCP, agents, harnesses and safety. The aim is understanding, not coding. Every topic is a self-contained slide deck in plain HTML/CSS/JS with interactive widgets. There is no build step.

Repository: https://github.com/arunmp25/ai-training (branch `main`).

## Read these next
- `v4/CLAUDE.md`: how version 4 is built (deck engine, widget API, slide template, sequence diagrams, code walkthroughs, Behind the scenes JSON, speaker notes, EY theme) and the checklist for changing it. `v3/CLAUDE.md` describes v3, which v4 was copied from.
- `docs/HISTORY.md`: what was built so far, in order, and every piece of feedback the user gave. Read it before proposing content or tone changes.

## Layout
```
index.html            Version picker (links to v1, v2, v3, v4). Uses v2/assets for styling.
v1/                   ARCHIVED. Two delivery options (A layer by layer, B big picture first). Do not edit.
v2/                   STABLE. One path, deep RAG and tools content. Do not edit.
v3/                   PREVIOUS. Story version with sequence diagrams and JSON. Do not edit.
v4/                   LATEST. Copy of v3 in the EY theme, plus prompt structure and Python tool-call slides. Actively worked on.
  code/*.py           Runnable Python samples shown on the code walkthrough slides.
  index.html          Course page: sessions, topic cards, help.
  assets/course.js    window.COURSE: topic ids, numbers, titles, sessions, minutes.
  assets/deck.js      Slide engine (keys, bar, notes panel, timings, events).
  assets/widgets.js   Widget library `W` (tabs, flips, quiz, stepper, seq, bts, ...).
  assets/style.css    Theme tokens, layout, bar, notes panel.
  assets/widgets.css  Widget styles.
  assets/story.css    Behind the scenes drawer, JSON colours, sequence diagrams, speaker notes, v4 code walkthroughs.
  topics/*.html       One file per topic (17 in v3, 19 in v4).
AI-Training-v3.zip    Standalone package of v3.
AI-Training-v4.zip    Standalone package of v4 (rebuild it after v4 changes, see below).
.claude/launch.json   Preview server: `python3 -m http.server 8765` from the repo root.
docs/HISTORY.md       Project history and user feedback.
```

## Ground rules
- **Work in v4 only.** v1, v2 and v3 are kept as they are. When making a new version, copy the latest folder (as v4 was copied from v3), then plan with the user before building.
- **Never lose content.** Every v2 slide still exists in v3, and every v3 slide in v4. Rework or re-skin slides, but do not drop them without the user's agreement.
- **Tone (user feedback):** professional, not dramatic. Relatable or lightly funny references are welcome (the “[Your Name]” email, the King prawn curry in the royal search, the pirate claim). No characters, no dialogue scenes, no named cast.
- **Structure words:** say “Session 1–4” and “Topic 1–19” (v4; v3 has Sessions 1–3 and Topics 1–17). Never “Day” or “Episode”.
- **Running example:** a fictional insurer, HarborShield, appears only inside example prompts and JSON. Rating engine quote for policy MTR-55120: ₹18,400 → ₹44,750 when adding an 18-year-old driver.
- **Theme (v4):** EY style. EY Yellow `#FFE600` on EY dark grey (`#2E2E38`, `#1A1A24`), greys `#747480` `#C4C4CD` `#F6F6FA`, Arial-family font. Dark is the default; light must keep working. Do not draw the EY logo.
- **Audience is technical enough for real JSON.** Show the real request/response shapes (Anthropic Messages API, MCP JSON-RPC, Claude Code settings) via Behind the scenes drawers, sequence diagrams and Python code walkthroughs. Use `claude-sonnet-5-5` as the model id in examples.
- **Timings are hidden** by default; the presenter presses D to show them. Every slide has speaker notes (N key).
- Plain English, short sentences, British spelling (“customise”, “organisation”).

## Topic ids versus topic numbers (common trap)
File ids are the old v2 ids; the audience sees `n` from `course.js`. Always write cross-references with the **new number**.

| id | n | Topic | id | n | Topic |
|---|---|---|---|---|---|
| 00 | 1 | Decoding the jargon | 08 | 11 | Tools and function calling |
| 01 | 2 | Talking to AI | 08b | 12 | Tools deep dive |
| 02 | 3 | How AI generates text | 09 | 13 | MCP |
| 03 | 4 | Attention | 10 | 14 | The agentic loop |
| 04 | 5 | The context window | 10b | 15 | AI agents: from prompt to agent (v4 only) |
| 05 | 6 | Anatomy of a prompt | 10c | 16 | Agent design patterns (v4 only) |
| 06 | 7 | Context engineering | 11 | 17 | Agent harnesses (Topic 15 in v3) |
| 07 | 8 | RAG | 12 | 18 | Customising the harness (Topic 16 in v3) |
| 07b | 9 | Embeddings and similarity | 13 | 19 | Safety, trust and evals (Topic 17 in v3) |
| 07c | 10 | Vector databases |  |  |  |

Sessions (v4): 1 = topics 1–7, 2 = topics 8–13, 3 = topics 14–19.

## Run and check
- Start the preview server (`.claude/launch.json`, name `ai-training`) and open `http://localhost:8765/v4/index.html`. v4 also works from `file://`.
- Test at **1280×720** (projector size). Slides should not need scrolling; a few long v2 slides still do (Topic 15 landscape and “Which harness?”, Topic 16 “Which one?”).
- Browsers cache aggressively. Asset links carry `?v=4.3` in v4; bump the number in every v4 page when you change files in `v4/assets/`, or force reload with `fetch(url, {cache: "reload"})` while testing.
- Before finishing, load every v4 topic and check: no script errors, every slide has a `.say` note, every `.seq` renders arrows, `data-bts` buttons have a matching `W.BTS` key.

## Packaging and git
- Rebuild the zip after v4 changes: copy `v4/` to a staging folder named `AI-Training-v4` (excluding `.DS_Store`) and zip that folder to `AI-Training-v4.zip` at the repo root. v4 has no links outside its own folder, so it works unzipped from `file://`.
- Commit author email is the GitHub no-reply address set in the local repo config; do not put the user's private email in commits.
