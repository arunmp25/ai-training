# Hand-off: AI Training v4 (23 Nov 2026)

For a Claude Code session in the terminal. Start in the repo folder:

```
cd "/Users/arunmp/projects/claude_workspace/AI Training"
claude
```

Then say: "Read docs/HANDOFF.md and docs/HISTORY.md, then continue."
`CLAUDE.md` (root) and `v4/CLAUDE.md` load automatically and hold the ground rules.

## Where things stand
- Repo: github.com/arunmp25/ai-training, branch `main`. Last pushed commit **81ae20a**. The worked examples and the Topic 5 context-bar fix are committed on top of it (see `git log`). Check `git status -sb` to see whether they have been pushed.
- Work only in `v4/`. Asset version is `?v=4.6`. If you change `v4/assets/`, bump it to 4.7 in every v4 page.
- v4 has 240 slides. All 20 topics load at 1280×720 with no script errors, and every slide has a speaker note.

## Course layout (v4)
| Session | Topics | File ids |
|---|---|---|
| 1: How AI works, models, prompts and context | 1–8 | 00, 01, 02, 03, 04, **04b (new: Choosing a model)**, 05, 06 |
| 2: Knowledge, tools and MCP | 9–14 | 07, 07b, 07c, 08, 08b, 09 |
| 3: Agents, harnesses and safety | 15–20 (19–20 optional) | 10, 11, 12, 13, 10b, 10c |

File ids are not topic numbers. The mapping lives in `v4/assets/course.js` and the table in the root `CLAUDE.md`.

## Done since the last hand-off
- The Topic 5 context-bar fix and the seven worked-example slides (Topics 3, 4, 7, 8, 10, 16 and 17) were reviewed, checked in a headless browser in dark and light themes, and committed. Details are in `docs/HISTORY.md`.

## Ground rules (summary; full list in CLAUDE.md)
- Never drop slides. Every slide needs a `.say` speaker note.
- Say "Session" and "Topic", never "Day" or "Episode". Use British spelling and a professional tone with no characters.
- Use `claude-sonnet-5-5` in code examples.
- After any change, open every changed topic at 1280×720 and check for no console errors and no slide scroll. Then rebuild `AI-Training-v4.zip` (from `v4/` into an `AI-Training-v4/` folder, excluding `.DS_Store` and `.pyc`).
- Commits use the GitHub no-reply email from the local git config. Never force-push. Stage by explicit path when other work is pending in the tree.

## Known loose ends
- These slides still scroll slightly at 1280×720, all from earlier versions:
  - Topic 15 "The loop in action" (+32px)
  - Topic 16 "The landscape" (+198px) and "Which harness?" (+14px)
  - Topic 17 "Which one?" (+121px)
  - The jargon dictionary scrolls by design.
- Model names and prices on the Topic 6 slides are Anthropic list prices as of November 2026. Re-check them before presenting.
- See the end of `docs/HISTORY.md` for the rest.
