/* ===== Course map: every topic + both delivery options =====
   Topic pages are shared. A track only decides the order and which day a topic falls on.
   Minutes are per track (the same topic can be shorter in Option B's deep-dive days). */
window.COURSE = {
  topics: {
    "01": { file: "01-interacting-with-ai.html",      title: "Talking to AI",                       l: "context",   blurb: "The new-colleague mindset, vague vs specific, what AI is good and bad at, the jargon map" },
    "02": { file: "02-how-ai-generates-text.html",    title: "How AI generates text",               l: "model",     blurb: "Tokens, next-token prediction, temperature, the transformer at a glance" },
    "03": { file: "03-attention.html",                title: "Attention",                           l: "model",     blurb: "How words look at each other, and why it changes how you write prompts" },
    "04": { file: "04-context-window.html",           title: "The context window",                  l: "context",   blurb: "The AI’s desk: what fills it, what falls off, memory, cost" },
    "05": { file: "05-anatomy-of-a-prompt.html",      title: "Anatomy of a prompt",                 l: "context",   blurb: "Role, task, context, examples, format, constraints: build one live" },
    "06": { file: "06-context-engineering.html",      title: "Context engineering",                 l: "context",   blurb: "From the right words to the right information: write, select, compress, isolate" },
    "07": { file: "07-rag.html",                      title: "RAG: grounding AI in your data",      l: "knowledge", blurb: "Chunking, embeddings, retrieval, citations; RAG vs fine-tuning" },
    "08": { file: "08-tools.html",                    title: "Tools and function calling",          l: "action",    blurb: "How AI takes actions, tool descriptions, read vs write risk" },
    "09": { file: "09-mcp.html",                      title: "MCP: the universal connector",        l: "action",    blurb: "Hosts, clients, servers: plug systems into any AI app" },
    "10": { file: "10-agentic-loop.html",             title: "The agentic loop",                    l: "autonomy",  blurb: "Plan, act, observe, repeat. Workflows vs agents, the autonomy dial" },
    "11": { file: "11-agent-harnesses.html",          title: "Agent harnesses",                     l: "autonomy",  blurb: "The car around the engine: anatomy, the harness landscape, choosing one" },
    "12": { file: "12-customizing-the-harness.html",  title: "Customizing the harness",             l: "autonomy",  blurb: "Instruction files, skills, subagents, hooks, commands, MCP, plugins, permissions" },
    "13": { file: "13-safety-and-evals.html",         title: "Safety, trust and evals",             l: "trust",     blurb: "Prompt injection, the lethal trifecta, guardrails, evals, tracing" },
    "B1": { file: "b1-the-full-journey.html",         title: "The full journey: from chat to agent", l: "autonomy", blurb: "Every concept once, lightly: prompt to harness in one hour" },
    "00": { file: "00-decoding-ai-jargon.html",       title: "Jargon dictionary and practice",      l: "model",     blurb: "Searchable dictionary, sort game, quiz. A reference for any day" },
  },
  tracks: {
    a: {
      short: "Option A", name: "Build up layer by layer",
      desc: "Each day adds one layer of the car. Slower start, deeper understanding, nothing is repeated.",
      days: [
        { d: "Day 1", theme: "How AI thinks and how to talk to it", items: [["01", 10], ["02", 12], ["03", 12], ["04", 10], ["05", 14]] },
        { d: "Day 2", theme: "Context, knowledge and hands",         items: [["06", 10], ["07", 20], ["08", 12], ["09", 15]] },
        { d: "Day 3", theme: "Agents and the harness",               items: [["10", 12], ["11", 15], ["12", 23], ["13", 10]] },
      ],
    },
    b: {
      short: "Option B", name: "Big picture first",
      desc: "Day 1 is a guided tour of the whole journey; Days 2–3 go deep. Great if some people only attend Day 1.",
      days: [
        { d: "Day 1", theme: "The whole journey in one hour",            items: [["B1", 60]] },
        { d: "Day 2", theme: "Deep dive: inside the model and the prompt", items: [["02", 8], ["03", 8], ["04", 7], ["05", 12], ["06", 7], ["07", 18]] },
        { d: "Day 3", theme: "Deep dive: tools, agents and harnesses",    items: [["08", 7], ["09", 8], ["10", 8], ["11", 12], ["12", 17], ["13", 8]] },
      ],
    },
  },
  appendix: ["00"],
};
