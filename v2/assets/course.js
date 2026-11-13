/* ===== Course map: every topic + Option A =====
   Topic pages are shared. A track only decides the order and which day a topic falls on.
   Minutes are hidden by default; press D (or the ⏱ button) to show them. */
window.COURSE = {
  topics: {
    "01": { file: "01-interacting-with-ai.html",      title: "Talking to AI",                       l: "context",   blurb: "The new-colleague mindset, vague vs specific, what AI is good and bad at, the jargon map" },
    "02": { file: "02-how-ai-generates-text.html",    title: "How AI generates text",               l: "model",     blurb: "Tokens, next-token prediction, temperature, the transformer at a glance" },
    "03": { file: "03-attention.html",                title: "Attention",                           l: "model",     blurb: "How words look at each other, and why it changes how you write prompts" },
    "04": { file: "04-context-window.html",           title: "The context window",                  l: "context",   blurb: "The AI’s desk: what fills it, what falls off, memory, cost" },
    "05": { file: "05-anatomy-of-a-prompt.html",      title: "Anatomy of a prompt",                 l: "context",   blurb: "Role, task, context, examples, format, constraints: build one live" },
    "06": { file: "06-context-engineering.html",      title: "Context engineering",                 l: "context",   blurb: "From the right words to the right information: write, select, compress, isolate" },
    "07": { file: "07-rag.html",                      title: "RAG: grounding AI in your data",      l: "knowledge", blurb: "Why RAG, the two-phase pipeline, chunking strategies, RAG vs fine-tuning" },
    "07b":{ file: "07b-embeddings-and-similarity.html", title: "Embeddings and cosine similarity",  l: "knowledge", blurb: "Text as vectors, dimensions, cosine vs dot vs distance, worked example" },
    "07c":{ file: "07c-vector-databases.html",        title: "Vector databases and retrieval",      l: "knowledge", blurb: "What a vector DB stores, ANN indexes, top-k, filters, hybrid search, re-ranking" },
    "08": { file: "08-tools.html",                    title: "Tools and function calling",          l: "action",    blurb: "How AI takes actions, tool descriptions, read vs write risk" },
    "08b":{ file: "08b-tools-deep-dive.html",         title: "Tools deep dive",                     l: "action",    blurb: "Tool schemas, the message exchange, parallel calls, tool choice, errors, designing good tools" },
    "09": { file: "09-mcp.html",                      title: "MCP: the universal connector",        l: "action",    blurb: "Hosts, clients, servers: plug systems into any AI app" },
    "10": { file: "10-agentic-loop.html",             title: "The agentic loop",                    l: "autonomy",  blurb: "Plan, act, observe, repeat. Workflows vs agents, the autonomy dial" },
    "11": { file: "11-agent-harnesses.html",          title: "Agent harnesses",                     l: "autonomy",  blurb: "The car around the engine: anatomy, the harness landscape, choosing one" },
    "12": { file: "12-customizing-the-harness.html",  title: "Customizing the harness",             l: "autonomy",  blurb: "Instruction files, skills, subagents, hooks, commands, MCP, plugins, permissions" },
    "13": { file: "13-safety-and-evals.html",         title: "Safety, trust and evals",             l: "trust",     blurb: "Prompt injection, the lethal trifecta, guardrails, evals, tracing" },
    "00": { file: "00-decoding-ai-jargon.html",       title: "Jargon dictionary and practice",      l: "model",     blurb: "Searchable dictionary, sort game, quiz. A reference for any day" },
  },
  tracks: {
    a: {
      short: "", name: "Build up layer by layer",
      desc: "Each day adds one layer. Nothing is repeated, and every concept builds on the last.",
      days: [
        { d: "Day 1", theme: "How AI thinks and how to talk to it", items: [["01", 10], ["02", 12], ["03", 12], ["04", 10], ["05", 14]] },
        { d: "Day 2", theme: "Context, knowledge and hands",         items: [["06", 8], ["07", 10], ["07b", 14], ["07c", 14], ["08", 8], ["08b", 12]] },
        { d: "Day 3", theme: "Connectors, agents and the harness",   items: [["09", 10], ["10", 10], ["11", 12], ["12", 18], ["13", 10]] },
      ],
    },
  },
  appendix: ["00"],
};
