/* ===== Course map (v4) =====
   Topic pages keep their file ids; "n" is the topic number shown to the audience.
   Minutes are hidden by default; press D (or the ⏱ button) to show them. */
window.COURSE = {
  topics: {
    "00":  { n: 1, file: "00-decoding-ai-jargon.html", title: "Decoding the jargon", l: "model", blurb: "Every AI buzzword gets a home in one of six layers. Self-check, sort game, dictionary." },
    "01":  { n: 2, file: "01-interacting-with-ai.html", title: "Talking to AI", l: "context", blurb: "The “[Your Name]” email: the new-colleague mindset, vague vs specific, the parts of a request, and the same request in Python." },
    "02":  { n: 3, file: "02-how-ai-generates-text.html", title: "How AI generates text", l: "model", blurb: "Why the same question gets two answers: tokens, next-token prediction, temperature." },
    "03":  { n: 4, file: "03-attention.html", title: "Attention", l: "model", blurb: "Who is “he”? How words look at each other, and what that means for writing prompts." },
    "04":  { n: 5, file: "04-context-window.html", title: "The context window", l: "context", blurb: "Why a long chat forgets the morning: the desk, statelessness, memory, cost." },
    "04b": { n: 6, file: "04b-model-selection.html", title: "Choosing a model", l: "model", blurb: "Big, medium or small? Quality, speed, cost per token and context size. A cost calculator, routing to the right model, and testing on your own examples." },
    "05":  { n: 7, file: "05-anatomy-of-a-prompt.html", title: "Anatomy of a prompt", l: "context", blurb: "Role, task, context, examples, format, constraints. A prompt is a brief." },
    "06":  { n: 8, file: "06-context-engineering.html", title: "Context engineering", l: "context", blurb: "Can you paste a 20,000-page manual? Do the maths, then select, compress, write, isolate." },
    "07":  { n: 9, file: "07-rag.html", title: "RAG: grounding AI in your data", l: "knowledge", blurb: "The open-book exam: chunking, overlap, the augmented prompt, RAG vs fine-tuning." },
    "07b": { n: 10, file: "07b-embeddings-and-similarity.html", title: "Embeddings and similarity search", l: "knowledge", blurb: "Why a keyword search for the King misses the Queen: embeddings, cosine similarity, top-k." },
    "07c": { n: 11, file: "07c-vector-databases.html", title: "Vector databases and retrieval", l: "knowledge", blurb: "HNSW, permission filters, hybrid search, re-ranking, measuring retrieval." },
    "08":  { n: 12, file: "08-tools.html", title: "Tools and function calling", l: "action", blurb: "Live prices from a rating engine: how a model asks for tools and your app acts. The whole tool call as a Python program." },
    "08b": { n: 13, file: "08b-tools-deep-dive.html", title: "Tools deep dive", l: "action", blurb: "Schemas, the message exchange, parallel calls, tool choice, errors, tool design. The tool loop in Python." },
    "09":  { n: 14, file: "09-mcp.html", title: "MCP: the universal connector", l: "action", blurb: "One rating server, every AI app: hosts, clients, servers, tool call vs MCP, API vs MCP, local vs remote, trust." },
    "10":  { n: 15, file: "10-agentic-loop.html", title: "The agentic loop", l: "autonomy", blurb: "A coding agent fixes an off-by-one bug. Plan, act, observe, repeat. The autonomy dial. A multi-agent application, end to end." },
    "10b": { n: 19, file: "10b-ai-agents.html", title: "AI agents: from prompt to agent", l: "autonomy", blurb: "Prompt, chain or agent? The six parts of an agent, and the same agent built with LangChain and LangGraph." },
    "10c": { n: 20, file: "10c-agent-patterns.html", title: "Agent design patterns", l: "autonomy", blurb: "Chaining, routing, parallel calls, orchestrator–workers, evaluator–optimiser, ReAct, multi-agent and human approval, all animated." },
    "11":  { n: 16, file: "11-agent-harnesses.html", title: "Agent harnesses", l: "autonomy", blurb: "Claude Code, GitHub Copilot and others: same engine, different car." },
    "12":  { n: 17, file: "12-customizing-the-harness.html", title: "Customising the harness", l: "autonomy", blurb: "Instruction files, skills, subagents, hooks, permissions, plugins: house rules for agents." },
    "13":  { n: 18, file: "13-safety-and-evals.html", title: "Safety, trust and evals", l: "trust", blurb: "The pirate claim: prompt injection, the lethal trifecta, defences, evals, tracing." },
  },
  tracks: {
    a: {
      short: "", name: "Building with AI",
      desc: "Three sessions plus two optional topics. Each topic adds one layer, using everyday examples from an insurance business.",
      days: [
        { d: "Session 1", theme: "How AI works, models, prompts and context", items: [["00", 14], ["01", 16], ["02", 14], ["03", 15], ["04", 10], ["04b", 16], ["05", 17], ["06", 15]] },
        { d: "Session 2", theme: "Knowledge, tools and MCP",                  items: [["07", 12], ["07b", 19], ["07c", 16], ["08", 17], ["08b", 19], ["09", 16]] },
        { d: "Session 3", theme: "Agents, harnesses and safety",              items: [["10", 17], ["11", 15], ["12", 22], ["13", 16]] },
        { d: "Optional", theme: "Building agents in code",                    items: [["10b", 22], ["10c", 26]] },
      ],
    },
  },
  appendix: [],
};
