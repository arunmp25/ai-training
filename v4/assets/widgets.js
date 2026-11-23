/* ===== Shared interactive widgets + course vocabulary =====
   Load before page scripts:  <script src="../assets/widgets.js"></script>
*/
(function () {
  const W = (window.W = {});
  W.$ = (s, r = document) => r.querySelector(s);
  W.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const SPECIAL = { good: "--good", bad: "--bad", warn: "--warn", accent: "--accent", muted: "--muted" };
  W.cv = (l) => `var(${SPECIAL[l] || "--c-" + (l || "model")})`;
  W.shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const cv = W.cv, $ = W.$, $$ = W.$$;

  /* ---------- redraw hooks (for widgets that measure positions) ---------- */
  const redraws = [];
  W.onRedraw = (fn) => redraws.push(fn);
  const redrawAll = () => requestAnimationFrame(() => redraws.forEach((f) => f()));
  document.addEventListener("slide:enter", redrawAll);
  window.addEventListener("resize", redrawAll);

  /* ---------- the six layers ---------- */
  W.ORDER = ["model", "context", "knowledge", "action", "autonomy", "trust"];
  W.LAYERS = {
    model:     { name: "Model",     icon: "🧠", car: "The engine",         q: "What is the AI?",            topics: "Topics 3–4, 6",
                 desc: "Powerful, but on its own it goes nowhere. It reads text and predicts text, using only what it learned in training." },
    context:   { name: "Context",   icon: "📋", car: "The trip briefing",  q: "What does it see right now?", topics: "Topics 2, 5, 7–8",
                 desc: "Everything you hand the model for this job: instructions, examples, history. It can only use what’s in front of it." },
    knowledge: { name: "Knowledge", icon: "📚", car: "The map / GPS",      q: "What does it know about us?", topics: "Topics 9–11",
                 desc: "Your company’s own roads. Instead of guessing, it looks things up in your documents before answering." },
    action:    { name: "Action",    icon: "🔧", car: "Wheels & steering",  q: "What can it actually do?",    topics: "Topics 12–14",
                 desc: "Lets it move: query systems, send messages, update records. MCP is the standard fitting, so any wheel fits any car." },
    autonomy:  { name: "Autonomy",  icon: "🤖", car: "Driver & chassis",   q: "Who’s driving?",              topics: "Topics 15–17, 19–20",
                 desc: "A workflow follows a fixed route; an agent chooses its own turns. The harness is the car body that wires everything together." },
    trust:     { name: "Trust",     icon: "🛡️", car: "Brakes & seatbelts", q: "Is it safe and is it good?",  topics: "Topic 18",
                 desc: "Brakes, seatbelts and a dashboard. Without them, the faster the car, the worse the crash." },
  };

  W.TERMS = [
    // MODEL
    { t: "LLM", l: "model", plain: "Large Language Model: the AI “brain” that reads text and writes text back.", an: "The engine of the car." },
    { t: "Foundation model", l: "model", plain: "A big general-purpose model (Claude, GPT, Gemini…) that products are built on.", an: "A factory engine fitted into many different cars." },
    { t: "Token", l: "model", plain: "The small chunks of text a model reads and writes, roughly ¾ of a word. Cost and limits are counted in tokens.", an: "The meter ticking in a taxi." },
    { t: "Next-token prediction", l: "model", plain: "What an LLM actually does: look at all the text so far and predict the most likely next token, over and over.", an: "Autocomplete on your phone, with a PhD." },
    { t: "Transformer", l: "model", plain: "The design behind modern LLMs. Its key trick is attention: every word can look at every other word.", an: "The engine’s blueprint." },
    { t: "Attention", l: "model", plain: "How the model decides which earlier words matter most for understanding each word.", an: "A spotlight that lights up the relevant words." },
    { t: "Context window", l: "model", plain: "How much text the model can “see” at once. Its working memory for this conversation.", an: "The size of the desk you can spread papers on." },
    { t: "Temperature", l: "model", plain: "A setting for how predictable or how creative the answers are.", an: "A dial from “by the book” to “brainstorm”." },
    { t: "Hallucination", l: "model", plain: "When the model states something false, confidently.", an: "A confident tour guide making up history." },
    { t: "Knowledge cutoff", l: "model", plain: "The date after which the model learned nothing new.", an: "An encyclopedia printed on a certain date." },
    { t: "Inference", l: "model", plain: "Running the model to get an answer (as opposed to training it).", an: "Driving the car, not building it." },
    { t: "Multimodal", l: "model", plain: "A model that can handle images, audio or files, not just text.", an: "Someone who can read, look and listen." },
    { t: "Reasoning", l: "model", plain: "The model working through a problem step by step before it answers (also called “thinking”).", an: "Showing your working on a maths test." },
    // CONTEXT
    { t: "Prompt", l: "context", plain: "The instruction or question you give the model.", an: "The brief you hand to a contractor." },
    { t: "System prompt", l: "context", plain: "Standing instructions that set the model’s role and rules for the whole conversation.", an: "The job description on day one." },
    { t: "Few-shot examples", l: "context", plain: "Showing the model a few examples of what good output looks like.", an: "“Here are three letters we liked. Write one like these.”" },
    { t: "Context engineering", l: "context", plain: "Deciding exactly what goes into the context window, and what stays out.", an: "Packing the right papers into your briefcase before a meeting." },
    { t: "Structured output", l: "context", plain: "Asking for answers in a fixed format (JSON, a table) so software can use them.", an: "Filling in a form instead of writing an essay." },
    { t: "Memory", l: "context", plain: "Facts saved from earlier conversations and fed back in later. The model itself remembers nothing.", an: "A notebook the assistant re-reads every morning." },
    { t: "Compaction", l: "context", plain: "Summarising a long conversation so it fits back into the context window.", an: "Replacing a pile of meeting notes with a one-page summary." },
    // KNOWLEDGE
    { t: "RAG", l: "knowledge", plain: "Retrieval-Augmented Generation: find the relevant bits of your documents, add them to the prompt, then answer.", an: "An open-book exam." },
    { t: "Embedding", l: "knowledge", plain: "Turning text into numbers that capture its meaning, so similar ideas sit close together.", an: "GPS coordinates for meaning." },
    { t: "Vector database", l: "knowledge", plain: "A database that searches by meaning (using embeddings), not by exact keywords.", an: "A librarian who finds books about your topic, not just ones with the word in the title." },
    { t: "Chunking", l: "knowledge", plain: "Splitting documents into small pieces so the right piece can be found.", an: "Cutting a cookbook into recipe cards." },
    { t: "Grounding", l: "knowledge", plain: "Making the model answer from the sources you give it, and cite them, instead of from memory.", an: "“Show me where it says that.”" },
    { t: "Fine-tuning", l: "knowledge", plain: "Extra training on your examples to change a model’s style or behaviour. Usually not the best way to add facts.", an: "Sending the engine back to the factory for a re-tune." },
    // ACTION
    { t: "Tool", l: "action", plain: "A capability the AI can ask to use: search, calculator, database lookup, send email.", an: "The apps on a phone." },
    { t: "Function calling", l: "action", plain: "How tools work: the model says “run tool X with these inputs”, your system runs it and hands back the result.", an: "A surgeon says “scalpel” and the nurse hands it over." },
    { t: "MCP", l: "action", plain: "Model Context Protocol: an open standard for plugging AI apps into tools and data.", an: "USB-C for AI: one plug, many devices." },
    { t: "MCP server", l: "action", plain: "A connector that exposes one system (GitHub, Slack, a database) to any MCP-compatible AI app.", an: "A device with a USB-C port." },
    { t: "API", l: "action", plain: "A way for one piece of software to talk to another. Tools usually wrap an API.", an: "A restaurant menu for programs." },
    // AUTONOMY
    { t: "Agent", l: "autonomy", plain: "An AI that decides its own next steps, using tools in a loop until a goal is met.", an: "Giving an assistant a goal instead of a checklist." },
    { t: "Agent loop", l: "autonomy", plain: "The cycle agents run: plan → act → observe → repeat.", an: "A chef tasting and adjusting until the dish is right." },
    { t: "Workflow", l: "autonomy", plain: "A fixed sequence of AI steps designed by a person. Predictable, less flexible.", an: "An assembly line." },
    { t: "Agent harness", l: "autonomy", plain: "The software around the model that runs the loop, executes tools, and manages context, memory and permissions. E.g. Claude Code.", an: "The car itself: chassis, controls and wiring around the engine." },
    { t: "Instruction file", l: "autonomy", plain: "A file such as CLAUDE.md or AGENTS.md that the harness loads every session with project rules and conventions.", an: "The house rules pinned on the office wall." },
    { t: "Subagent", l: "autonomy", plain: "A helper agent that the main agent hands a sub-task to, with its own fresh context.", an: "A manager delegating research to a colleague." },
    { t: "Skill", l: "autonomy", plain: "A packaged set of instructions (and files) the agent loads only when a task needs it.", an: "A recipe card you pull out only when cooking that dish." },
    { t: "Hook", l: "autonomy", plain: "A rule the harness always runs at a set moment (e.g. run tests after every edit), with no AI judgement involved.", an: "The car beeping every time you forget your seatbelt." },
    { t: "Slash command", l: "autonomy", plain: "A saved prompt you trigger by name, like /review or /release-notes.", an: "A speed-dial button." },
    { t: "Plugin", l: "autonomy", plain: "A bundle of skills, commands, subagents, hooks and MCP servers you can install in one go and share with a team.", an: "An app-store package for your harness." },
    { t: "Orchestration", l: "autonomy", plain: "Coordinating several models, agents or steps to finish a bigger job.", an: "A conductor and an orchestra." },
    // TRUST
    { t: "Guardrails", l: "trust", plain: "Rules and checks that stop the AI doing or saying things it shouldn’t.", an: "Crash barriers on a mountain road." },
    { t: "Prompt injection", l: "trust", plain: "Hidden instructions in content the AI reads (an email, a web page) that try to hijack it.", an: "A forged note slipped into the boss’s inbox." },
    { t: "Human-in-the-loop", l: "trust", plain: "A person approves important or irreversible actions before they happen.", an: "A manager’s sign-off on a purchase order." },
    { t: "Permissions", l: "trust", plain: "What the agent may do without asking. Best practice: least privilege.", an: "Giving the intern a key to the office, not to the safe." },
    { t: "Sandbox", l: "trust", plain: "An isolated environment where the agent can act without being able to damage anything outside it.", an: "A flight simulator instead of a real plane." },
    { t: "Evals", l: "trust", plain: "Repeatable tests that measure whether the AI’s output is good.", an: "Exams for the AI, re-sat after every change." },
    { t: "Observability", l: "trust", plain: "Logging and tracing what the AI saw and did, so you can debug and audit it.", an: "An aircraft’s black-box flight recorder." },
  ];
  W.TERM = Object.fromEntries(W.TERMS.map((x) => [x.t, x]));
  W.chip = (t, extra = "") => {
    const x = W.TERM[t];
    return `<span class="chip" style="--c:${cv(x ? x.l : "model")}" ${x ? `title="${x.plain.replace(/"/g, "&quot;")}"` : ""} ${extra}>${t}</span>`;
  };

  /* ---------- tabs / segmented control ---------- */
  W.tabs = (el, tabs, { onChange, start = 0 } = {}) => {
    el.innerHTML = `<div class="seg">${tabs.map((t, i) => `<button data-i="${i}">${t.label}</button>`).join("")}</div><div class="tab-body"></div>`;
    const body = el.querySelector(".tab-body");
    const show = (i) => {
      $$(".seg button", el).forEach((b) => b.classList.toggle("on", +b.dataset.i === i));
      if (tabs[i].html != null) { body.innerHTML = tabs[i].html; body.firstElementChild?.classList.add("fade-in"); }
      onChange && onChange(i, body);
    };
    el.querySelector(".seg").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) show(+b.dataset.i); });
    show(start);
    return { show };
  };

  /* ---------- flip cards ---------- */
  W.flips = (el, cards, cols = 3) => {
    el.classList.add("flips");
    el.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    el.innerHTML = cards.map((c) => `
      <div class="flip"><div class="flip-inner">
        <div class="face front">${c.front}<small>${c.hint || "Click to flip"}</small></div>
        <div class="face back" style="--c:${cv(c.c || "accent")}">${c.back}</div>
      </div></div>`).join("");
    $$(".flip", el).forEach((f) => (f.onclick = () => f.classList.toggle("flipped")));
  };

  /* ---------- stepper (step-through timeline) ---------- */
  // steps: [{who, c, html, raw?, onEnter?}]   raw: append html as-is (e.g. chat bubbles)
  W.stepper = ({ ctrl, log, steps, intro = "", onStep, onReset, interval = 3000 }) => {
    ctrl.classList.add("row", "st-ctrl");
    ctrl.innerHTML = `<button class="btn primary">▶ Next step</button><button class="btn">⏯ Auto-play</button><button class="btn ghost">↺ Reset</button><span class="muted"></span>`;
    log.classList.add("st-log");
    const [bNext, bPlay, bReset, count] = ctrl.children;
    let i = 0, timer = null;
    const update = () => { count.textContent = `Step ${i} of ${steps.length}`; bNext.disabled = i >= steps.length; };
    const stop = () => { clearInterval(timer); timer = null; bPlay.textContent = "⏯ Auto-play"; };
    const reset = () => { stop(); i = 0; log.innerHTML = intro; onReset && onReset(); update(); };
    const step = () => {
      if (i >= steps.length) return stop();
      const s = steps[i++];
      if (s.raw) log.insertAdjacentHTML("beforeend", s.html);
      else log.insertAdjacentHTML("beforeend", `<div class="step" style="--c:${cv(s.c || "accent")}"><div class="who">Step ${i}${s.who ? " · " + s.who : ""}</div>${s.html}</div>`);
      if (s.after) log.insertAdjacentHTML("beforeend", s.after);
      log.scrollTop = log.scrollHeight;
      s.onEnter && s.onEnter();
      onStep && onStep(i - 1, s);
      update();
      if (i >= steps.length) stop();
    };
    bNext.onclick = () => { stop(); step(); };
    bReset.onclick = reset;
    bPlay.onclick = () => {
      if (timer) return stop();
      if (i >= steps.length) reset();
      bPlay.textContent = "⏸ Pause"; step(); timer = setInterval(step, interval);
    };
    reset();
    return { reset, step, get i() { return i; } };
  };

  /* ---------- classify: scenarios → pick the right answer ---------- */
  // items: [{text, a, why}]  options: [{label, c}]
  W.classify = (el, items, options, { cols = 1 } = {}) => {
    el.classList.add("classify");
    el.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    let right = 0, done = 0;
    const score = document.createElement("div");
    score.className = "cl-score";
    const upd = () => (score.innerHTML = done ? `Score: ${right} / ${done} answered (of ${items.length}) ${done === items.length && right === items.length ? "🎉" : ""}` : `<span class="muted">${items.length} to answer. Pick one option per card.</span>`);
    el.innerHTML = items.map((it, k) => `
      <div class="cl-item" data-k="${k}">
        <div class="cl-text">${it.text}</div>
        <div class="cl-btns">${options.map((o, j) => `<button data-j="${j}" style="--c:${cv(o.c || "accent")}">${o.label}</button>`).join("")}</div>
        <div class="cl-why"></div>
      </div>`).join("");
    el.prepend(score);
    if (cols > 1) score.style.gridColumn = `1 / -1`;
    $$(".cl-item", el).forEach((card) => {
      const it = items[+card.dataset.k];
      card.querySelector(".cl-btns").addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b || card.dataset.done) return;
        card.dataset.done = 1; done++;
        const ok = +b.dataset.j === it.a;
        if (ok) right++;
        card.classList.add(ok ? "right" : "wrong");
        $$("button", card).forEach((x) => { x.disabled = true; if (+x.dataset.j === it.a) x.classList.add("answer"); });
        b.classList.add("picked");
        const why = card.querySelector(".cl-why");
        why.innerHTML = (ok ? "✅ " : "❌ ") + (it.why || "");
        why.classList.add("show");
        upd();
      });
    });
    upd();
  };

  /* ---------- click-info: clickable cards + detail panel ---------- */
  // items: [{icon, title, sub, c, html}]  layout: "grid" | "flow"   side: detail on the right
  W.clickInfo = (el, items, { layout = "grid", cols = 3, side = false, start = 0, onShow } = {}) => {
    el.classList.add("ci");
    if (side) el.classList.add("side");
    const itemsHtml = items.map((it, i) => `
      ${layout === "flow" && i ? '<div class="ci-arrow">→</div>' : ""}
      <div class="ci-card" data-i="${i}" style="--c:${cv(it.c || "accent")}">
        ${it.icon ? `<div class="ico">${it.icon}</div>` : ""}<h3>${it.title}</h3>${it.sub ? `<div class="s">${it.sub}</div>` : ""}
      </div>`).join("");
    el.innerHTML = `<div class="ci-items ${layout === "flow" ? "flow" : ""}" style="${layout === "grid" ? `grid-template-columns:repeat(${cols},1fr)` : ""}">${itemsHtml}</div><div class="card ci-detail"></div>`;
    const detail = el.querySelector(".ci-detail");
    const show = (i) => {
      $$(".ci-card", el).forEach((c) => c.classList.toggle("on", +c.dataset.i === i));
      const it = items[i];
      detail.style.setProperty("--c", cv(it.c || "accent"));
      detail.innerHTML = `<h3>${it.icon ? it.icon + " " : ""}${it.title}</h3>${it.html}`;
      onShow && onShow(i);
    };
    $$(".ci-card", el).forEach((c) => (c.onclick = () => show(+c.dataset.i)));
    if (start != null) show(start);
    return { show };
  };

  /* ---------- the six-layer jargon map ---------- */
  W.layerMap = (el, opts = {}) =>
    W.clickInfo(el, W.ORDER.map((l, i) => {
      const L = W.LAYERS[l];
      return {
        icon: L.icon, title: `${i + 1}. ${L.name}`, sub: `${L.car} · ${L.q}`, c: l,
        html: `<div class="tag" style="--c:${cv(l)}">${L.topics}</div><p class="lead" style="font-size:17px">${L.desc}</p>
               <div class="label">Jargon that lives here</div><div class="pill-row">${W.TERMS.filter((x) => x.l === l).map((x) => W.chip(x.t)).join("")}</div>`,
      };
    }), { cols: 3, side: true, ...opts });

  /* ---------- quiz ---------- */
  // Q: [{q, o:[], a, e}]
  W.quiz = (box, Q) => {
    box.classList.add("quiz", "card");
    let i = 0, results = [];
    const dots = () => `<div class="dots">${Q.map((_, k) => `<i class="${results[k] === true ? "r" : results[k] === false ? "w" : k === i ? "cur" : ""}"></i>`).join("")}</div>`;
    function render() {
      if (i >= Q.length) {
        const s = results.filter(Boolean).length;
        box.innerHTML = `${dots()}<h3>You scored ${s} / ${Q.length} ${s === Q.length ? "🏆" : s >= Q.length * 0.6 ? "🎉" : "👍"}</h3>
          <p class="muted">${s === Q.length ? "Perfect!" : "Have another go, or ask about the ones you missed."}</p>
          <button class="btn primary">↺ Try again</button>`;
        box.querySelector("button").onclick = () => { i = 0; results = []; render(); };
        return;
      }
      const q = Q[i];
      box.innerHTML = `${dots()}<div class="qnum">Question ${i + 1} of ${Q.length}</div><h3>${q.q}</h3>
        <div class="opts">${q.o.map((o, k) => `<button class="opt" data-k="${k}">${String.fromCharCode(65 + k)}. ${o}</button>`).join("")}</div>
        <div class="explain"></div>
        <div class="row" style="margin-top:14px"><button class="btn primary q-next hidden">${i === Q.length - 1 ? "See score →" : "Next question →"}</button></div>`;
      $$(".opt", box).forEach((b) => (b.onclick = () => {
        const k = +b.dataset.k, ok = k === q.a;
        results[i] = ok;
        $$(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.k === q.a) x.classList.add("right"); });
        if (!ok) b.classList.add("wrong");
        const ex = box.querySelector(".explain");
        ex.innerHTML = (ok ? "✅ Correct! " : "❌ Not quite. ") + q.e;
        ex.classList.add("show");
        box.querySelector(".q-next").classList.remove("hidden");
        box.querySelector(".dots").outerHTML = dots();
      }));
      box.querySelector(".q-next").onclick = () => { i++; render(); };
    }
    render();
  };

  /* ---------- probability bars helper ---------- */
  W.bars = (el, cands, { topIdx = 0 } = {}) => {
    el.classList.add("bars");
    el.innerHTML = cands.map(([tok, p], k) => `
      <div class="bar-row ${k === topIdx ? "top" : ""}"><span class="tok">${tok}</span>
        <span class="track"><span class="fill" style="width:${(p * 100).toFixed(1)}%;display:block"></span></span>
        <span class="pct">${(p * 100).toFixed(1)}%</span></div>`).join("");
  };
  W.applyTemp = (cands, T) => {
    const w = cands.map(([, p]) => Math.pow(p, 1 / T));
    const s = w.reduce((a, b) => a + b, 0);
    return cands.map(([t], k) => [t, w[k] / s]);
  };
  W.sample = (dist) => { let r = Math.random(), k = 0; for (; k < dist.length - 1; k++) { r -= dist[k][1]; if (r <= 0) break; } return k; };

  /* ---------- next-token predictor with temperature ---------- */
  // prompts: [{text, cands:[[tok,p]...]}]
  W.nextToken = (el, prompts) => {
    el.innerHTML = `
      <div class="seg nt-prompts">${prompts.map((p, i) => `<button data-i="${i}">${p.label || "Prompt " + (i + 1)}</button>`).join("")}</div>
      <div class="gen-text nt-text" style="margin:14px 0"></div>
      <div class="split" style="align-items:start">
        <div><div class="label">What the model thinks comes next</div><div class="nt-bars"></div></div>
        <div>
          <div class="label">Temperature: <span class="nt-tlabel"></span></div>
          <input type="range" class="nt-temp" min="0.1" max="2" step="0.1" value="1">
          <div class="row" style="justify-content:space-between;font-size:13px;color:var(--muted)"><span>🧊 predictable</span><span>🔥 creative / random</span></div>
          <div class="row" style="margin-top:14px"><button class="btn primary nt-one">🎲 Pick next word</button><button class="btn nt-many">Run it 20 times</button></div>
          <div class="nt-tally muted" style="margin-top:12px;font-size:14px"></div>
        </div>
      </div>`;
    let cur = 0;
    const temp = el.querySelector(".nt-temp");
    const render = (picked) => {
      const p = prompts[cur];
      const T = +temp.value;
      const dist = W.applyTemp(p.cands, T);
      el.querySelector(".nt-tlabel").textContent = T.toFixed(1) + (T < 0.5 ? " (very predictable)" : T > 1.4 ? " (wild)" : "");
      W.bars(el.querySelector(".nt-bars"), dist);
      el.querySelector(".nt-text").innerHTML = p.text + " " + (picked != null ? `<span class="new">${p.cands[picked][0]}</span>` : '<span class="cursor"></span>');
      $$(".nt-prompts button", el).forEach((b) => b.classList.toggle("on", +b.dataset.i === cur));
      return dist;
    };
    el.querySelector(".nt-prompts").onclick = (e) => { const b = e.target.closest("button"); if (b) { cur = +b.dataset.i; el.querySelector(".nt-tally").textContent = ""; render(); } };
    temp.oninput = () => render();
    el.querySelector(".nt-one").onclick = () => { const d = render(); render(W.sample(d)); };
    el.querySelector(".nt-many").onclick = () => {
      const d = render(), tally = {};
      for (let k = 0; k < 20; k++) { const t = d[W.sample(d)][0]; tally[t] = (tally[t] || 0) + 1; }
      el.querySelector(".nt-tally").innerHTML = "20 runs, same prompt: " + Object.entries(tally).sort((a, b) => b[1] - a[1]).map(([t, n]) => `<b>${t}</b> ×${n}`).join(", ");
    };
    render();
  };

  /* ---------- autoregressive generation ---------- */
  // start: "Once upon a", steps: [[[tok,p],...], ...] (first candidate is chosen)
  W.generate = (el, start, steps, { interval = 1400 } = {}) => {
    el.innerHTML = `
      <div class="row st-ctrl"><button class="btn primary g-next">▶ Predict next token</button><button class="btn g-play">⏯ Auto-play</button><button class="btn ghost g-reset">↺ Reset</button><span class="muted g-count"></span></div>
      <div class="gen-text g-text"></div>
      <div class="split" style="margin-top:16px;align-items:start">
        <div><div class="label">Candidates for the next token</div><div class="g-bars"></div></div>
        <div class="callout g-note" style="--c:var(--c-model)"></div>
      </div>`;
    let i = 0, timer = null, words = [];
    const txt = el.querySelector(".g-text"), bars = el.querySelector(".g-bars"), note = el.querySelector(".g-note");
    const render = () => {
      txt.innerHTML = start + words.map((w, k) => (k === words.length - 1 ? `<span class="new">${w}</span>` : w)).join("") + '<span class="cursor"></span>';
      if (i < steps.length) W.bars(bars, steps[i]); else bars.innerHTML = '<p class="muted">Model predicted an end-of-text token. Done!</p>';
      note.innerHTML = i === 0 ? "The model reads <b>all</b> the text so far and scores every possible next token. Click <b>Predict</b>."
        : i < steps.length ? `Token ${i} added. Now the <b>whole sentence, including the new word</b>, goes back in to predict the next one.`
        : `That’s it: <b>${i} predictions in a row</b>. Every answer you’ve ever had from an AI was built like this, one token at a time.`;
      el.querySelector(".g-count").textContent = `${i} / ${steps.length} tokens`;
      el.querySelector(".g-next").disabled = i >= steps.length;
    };
    const stop = () => { clearInterval(timer); timer = null; el.querySelector(".g-play").textContent = "⏯ Auto-play"; };
    const next = () => { if (i >= steps.length) return stop(); words.push(steps[i][0][0]); i++; render(); if (i >= steps.length) stop(); };
    el.querySelector(".g-next").onclick = () => { stop(); next(); };
    el.querySelector(".g-reset").onclick = () => { stop(); i = 0; words = []; render(); };
    el.querySelector(".g-play").onclick = () => {
      if (timer) return stop();
      if (i >= steps.length) { i = 0; words = []; }
      el.querySelector(".g-play").textContent = "⏸ Pause"; next(); timer = setInterval(next, interval);
    };
    render();
  };

  /* ---------- attention visualiser ---------- */
  // variants: [{label, tokens:[...], focus, weights:{i:{j:w}}, note:(i)=>html | string}]
  W.attention = (el, variants, { title = "" } = {}) => {
    el.innerHTML = `${variants.length > 1 ? `<div class="seg a-vars">${variants.map((v, i) => `<button data-i="${i}">${v.label}</button>`).join("")}</div>` : ""}
      <div class="att"><svg></svg><div class="att-tokens"></div></div>
      <div class="att-legend"></div>`;
    let vi = 0, sel = variants[0].focus ?? 0;
    const svg = el.querySelector("svg"), row = el.querySelector(".att-tokens"), legend = el.querySelector(".att-legend");
    const weightsFor = (v, i) => {
      const n = v.tokens.length;
      let w;
      if (v.weights && v.weights[i]) { w = Array(n).fill(0.01); Object.entries(v.weights[i]).forEach(([j, x]) => (w[+j] = x)); }
      else { w = v.tokens.map((_, j) => (j === i ? 0.35 : Math.abs(j - i) === 1 ? 0.18 : 0.03)); }
      const s = w.reduce((a, b) => a + b, 0);
      return w.map((x) => x / s);
    };
    const draw = () => {
      const v = variants[vi];
      if (!row.offsetWidth) return;
      const w = weightsFor(v, sel);
      const toks = $$(".att-tok", row);
      const base = el.querySelector(".att").getBoundingClientRect();
      const pos = toks.map((t) => { const r = t.getBoundingClientRect(); return r.left - base.left + r.width / 2; });
      const y = 128;
      const max = Math.max(...w.filter((_, j) => j !== sel));
      let paths = "";
      w.forEach((x, j) => {
        if (j === sel || x < 0.02) return;
        const rel = x / max;
        const x1 = pos[sel], x2 = pos[j], h = Math.min(120, 30 + Math.abs(x2 - x1) * 0.35);
        paths += `<path d="M${x1},${y} Q${(x1 + x2) / 2},${y - h * 1.6} ${x2},${y}" fill="none" stroke="var(--accent)" stroke-width="${1 + rel * 9}" stroke-opacity="${0.15 + rel * 0.85}" stroke-linecap="round"/>`;
      });
      svg.innerHTML = paths;
      toks.forEach((t, j) => {
        t.classList.toggle("sel", j === sel);
        t.style.background = j === sel ? "" : `color-mix(in srgb, var(--accent) ${Math.round((w[j] / max) * 45)}%, var(--card))`;
      });
      const top = w.map((x, j) => [j, x]).filter(([j]) => j !== sel).sort((a, b) => b[1] - a[1]).slice(0, 3);
      legend.innerHTML = `<div class="label">When reading “${v.tokens[sel]}”, the model pays most attention to:</div>` +
        top.map(([j, x]) => `<div class="bar-row top"><span class="tok">${v.tokens[j]}</span><span class="track"><span class="fill" style="display:block;width:${(x / top[0][1]) * 100}%"></span></span><span class="pct">${Math.round(x * 100)}%</span></div>`).join("") +
        (v.note ? `<div class="callout" style="margin-top:10px">${typeof v.note === "function" ? v.note(sel) : v.note}</div>` : "");
    };
    const build = () => {
      const v = variants[vi];
      row.innerHTML = v.tokens.map((t, j) => `<span class="att-tok" data-j="${j}">${t}</span>`).join("");
      $$(".a-vars button", el).forEach((b) => b.classList.toggle("on", +b.dataset.i === vi));
      $$(".att-tok", row).forEach((t) => (t.onclick = () => { sel = +t.dataset.j; draw(); }));
      requestAnimationFrame(draw);
    };
    el.querySelector(".a-vars")?.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      vi = +b.dataset.i; sel = variants[vi].focus ?? sel; build();
    });
    W.onRedraw(draw);
    build();
  };

  /* ---------- context-window bar ---------- */
  // parts: [{label, tokens, c, on}]  capacity: number
  W.contextBar = (el, parts, { capacity = 10000, onChange } = {}) => {
    el.innerHTML = `<div class="ctx-toggles">${parts.map((p, i) => `<label style="--c:${cv(p.c)}"><input type="checkbox" data-i="${i}" ${p.on ? "checked" : ""}>${p.label} <span class="muted">${p.tokens.toLocaleString()}</span></label>`).join("")}</div>
      <div class="ctx-frame"></div><div class="ctx-meta"><span class="ctx-used"></span><span>Window size: ${capacity.toLocaleString()} tokens</span></div>`;
    const frame = el.querySelector(".ctx-frame");
    const render = () => {
      const on = parts.filter((p) => p.on);
      const total = on.reduce((a, p) => a + p.tokens, 0);
      let acc = 0;
      frame.innerHTML = on.map((p) => {
        const start = acc; acc += p.tokens;
        const inside = Math.max(0, Math.min(acc, capacity) - start), over = p.tokens - inside;
        const pct = (inside / capacity) * 100;
        // Only label blocks wide enough to read; thin ones keep the colour and a hover title.
        return (inside ? `<div class="ctx-seg" style="--c:${cv(p.c)};width:${pct}%" title="${p.label}">${pct >= 9 ? `<span>${p.label}</span>` : ""}</div>` : "") +
               (over ? `<div class="ctx-seg over" style="width:${Math.min(40, (over / capacity) * 100)}%" title="${p.label} (does not fit)"></div>` : "");
      }).join("");
      el.querySelector(".ctx-used").innerHTML = total > capacity
        ? `<span class="ctx-warn">⚠ ${total.toLocaleString()} tokens: over the limit by ${(total - capacity).toLocaleString()}. Something must be dropped or summarised.</span>`
        : `${total.toLocaleString()} tokens used (${Math.round((total / capacity) * 100)}%)`;
      onChange && onChange(total);
    };
    $$("input", el).forEach((c) => (c.onchange = () => { parts[+c.dataset.i].on = c.checked; render(); }));
    render();
  };

  /* ---------- agent loop ---------- */
  // iterations: [{plan, act, observe, check, done?}]
  W.loop = (el, task, iterations, { interval = 2200 } = {}) => {
    const P = ["plan", "act", "observe", "check"];
    const LBL = { plan: "🧠 Plan", act: "🔧 Act", observe: "👀 Observe", check: "✅ Done?" };
    const pts = { plan: [150, 40], act: [260, 150], observe: [150, 260], check: [40, 150] };
    el.innerHTML = `
      <div class="callout" style="--c:var(--c-autonomy);margin-bottom:14px"><b>Goal:</b> ${task}</div>
      <div class="loop-wrap">
        <div><svg class="loop-svg" viewBox="0 0 300 300">
          <circle class="ring" cx="150" cy="150" r="110"/>
          ${P.map((p) => `<g class="node" data-p="${p}"><circle cx="${pts[p][0]}" cy="${pts[p][1]}" r="36"/><text x="${pts[p][0]}" y="${pts[p][1] + 5}">${LBL[p]}</text></g>`).join("")}
          <text class="center l-iter" x="150" y="145">Loop 0</text><text x="150" y="168" style="fill:var(--muted);font:600 12px var(--font);text-anchor:middle" class="l-sub">ready</text>
        </svg><div class="l-ctrl"></div></div>
        <div class="l-log" style="max-height:420px"></div>
      </div>`;
    const flat = iterations.flatMap((it, k) => P.map((p) => ({ p, k, text: it[p], done: p === "check" && it.done })));
    const nodes = $$(".node", el);
    W.stepper({
      ctrl: el.querySelector(".l-ctrl"), log: el.querySelector(".l-log"), interval,
      steps: flat.map((s) => ({ who: `Loop ${s.k + 1} · ${LBL[s.p]}`, c: s.done ? "good" : s.p === "act" ? "action" : s.p === "observe" ? "knowledge" : "autonomy", html: s.text })),
      onStep: (i) => {
        const s = flat[i];
        nodes.forEach((n) => n.classList.toggle("on", n.dataset.p === s.p));
        el.querySelector(".l-iter").textContent = `Loop ${s.k + 1}`;
        el.querySelector(".l-sub").textContent = s.done ? "goal reached 🎉" : s.p;
      },
      onReset: () => { nodes.forEach((n) => n.classList.remove("on")); el.querySelector(".l-iter").textContent = "Loop 0"; el.querySelector(".l-sub").textContent = "ready"; },
    });
  };

  /* ---------- prompt builder ---------- */
  // parts: [{id, label, c, text, on}]  output(on:Set) → html
  W.promptBuilder = (el, parts, output) => {
    el.classList.add("pb");
    el.innerHTML = `<div><div class="label">Prompt components</div><div class="pb-parts">${parts.map((p) => `<label style="--c:${cv(p.c)}"><input type="checkbox" data-id="${p.id}" ${p.on ? "checked" : ""}>${p.label}</label>`).join("")}</div>
        <div class="label" style="margin-top:14px">Prompt quality</div><div class="meter2"><i></i></div><div class="pb-q muted" style="font-size:14px"></div></div>
      <div><div class="label">The prompt you send</div><div class="pb-prompt"></div></div>
      <div><div class="label">What you get back</div><div class="pb-out"></div></div>`;
    const render = () => {
      const on = new Set(parts.filter((p) => p.on).map((p) => p.id));
      el.querySelector(".pb-prompt").innerHTML = parts.filter((p) => p.on).map((p) => `<span style="--c:${cv(p.c)}">${p.text}</span>`).join("") || '<span class="muted">(empty)</span>';
      el.querySelector(".pb-out").innerHTML = output(on);
      const q = on.size / parts.length;
      el.querySelector(".meter2 i").style.width = q * 100 + "%";
      el.querySelector(".pb-q").textContent = q < 0.35 ? "Vague: the AI has to guess." : q < 0.7 ? "Better: some guesswork left." : q < 1 ? "Strong." : "Excellent: nothing left to guess.";
    };
    $$("input", el).forEach((c) => (c.onchange = () => { parts.find((p) => p.id === c.dataset.id).on = c.checked; render(); }));
    render();
  };

  /* ---------- simple on/off switch ---------- */
  W.switch = (el, on, onChange) => {
    el.classList.add("switch");
    el.classList.toggle("on", !!on);
    el.setAttribute("role", "switch");
    el.onclick = () => { el.classList.toggle("on"); onChange(el.classList.contains("on")); };
  };

  /* =================== STORY KIT (v3) =================== */
  W.CAST = {};

  /* scene: a comic-strip conversation that builds line by line.
     → / clicker / click reveals the next line before moving to the next slide. */
  W.scene = (el, lines, { start = 1 } = {}) => {
    el.classList.add("scene");
    if (lines.length >= 8) el.classList.add("compact");
    el.innerHTML = lines.map((l) => {
      if (l.narr) return `<div class="sc-line narr"><span>${l.narr}</span></div>`;
      if (l.html) return `<div class="sc-line raw">${l.html}</div>`;
      const p = W.CAST[l.who] || { name: l.who, av: "💬", c: "accent", role: "" };
      return `<div class="sc-line${l.right ? " right" : ""}" style="--c:${cv(p.c)}">
        <div class="sc-av" title="${p.role}">${l.av || p.av}</div>
        <div class="sc-say"><div class="sc-name">${p.name}${l.aside ? ` <i>${l.aside}</i>` : ""}</div><div class="sc-t">${l.t}</div></div></div>`;
    }).join("") + `<div class="sc-hint">▸ press → or click for the next line</div>`;
    const ls = $$(".sc-line", el), hint = $(".sc-hint", el);
    let shown = 0;
    const show = (n) => {
      const grew = n > shown;
      shown = Math.min(n, ls.length); ls.forEach((x, i) => x.classList.toggle("in", i < shown)); hint.classList.toggle("hidden", shown >= ls.length); el.classList.toggle("done", shown >= ls.length);
      // like a chat window: keep the newest line in view when the strip outgrows the slide
      const sl = el.closest(".slide");
      if (sl && grew && sl.classList.contains("active")) requestAnimationFrame(() => sl.scrollTo({ top: sl.scrollHeight, behavior: "smooth" }));
    };
    show(start);
    el.addEventListener("click", (e) => { if (!e.target.closest("a,button,input")) show(shown + 1); });
    document.addEventListener("slide:enter", (e) => { if (e.detail.slide.contains(el)) show(e.detail.back ? ls.length : start); });
    document.addEventListener("slide:advance", (e) => {
      if (!e.detail.slide.contains(el) || shown >= ls.length) return;
      // only the first unfinished scene on the slide handles it
      const first = $$(".scene:not(.done)", e.detail.slide)[0];
      if (first !== el) return;
      e.preventDefault(); show(shown + 1);
    });
  };

  /* behind the scenes: a button that opens a drawer showing the real JSON */
  const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  W.hl = (src) => esc(src).split("\n").map((ln) => {
    const c = ln.indexOf("//");
    let code = c >= 0 && !/https?:$/.test(ln.slice(0, c)) ? ln.slice(0, c) : ln, com = code === ln ? "" : ln.slice(c);
    code = code.replace(/("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\b\d+(?:\.\d+)?\b)/g, (m, str, colon, kw, num) =>
      str ? (colon ? `<span class="j-k">${str}</span>${colon}` : `<span class="j-s">${str}</span>`) : kw ? `<span class="j-b">${kw}</span>` : `<span class="j-n">${num}</span>`);
    return code + (com ? `<span class="j-c">${com}</span>` : "");
  }).join("\n");
  let drawer;
  const openDrawer = (title, sub, parts) => {
    if (!drawer) {
      drawer = document.createElement("div");
      drawer.className = "bts-drawer";
      document.body.appendChild(drawer);
      drawer.addEventListener("click", (e) => { if (e.target === drawer || e.target.closest(".bts-x")) drawer.classList.remove("open"); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") drawer.classList.remove("open"); });
      document.addEventListener("slide:enter", () => drawer.classList.remove("open"));
    }
    drawer.innerHTML = `<div class="bts-panel"><button class="btn ghost bts-x">✕ Close</button>
      <div class="eyebrow">🎬 Behind the scenes</div><h3>${title}</h3>${sub ? `<p class="muted">${sub}</p>` : ""}
      ${parts.map((p) => `${p.label ? `<div class="bts-label" style="--c:${cv(p.c || "accent")}">${p.label}</div>` : ""}<pre class="code bts-code">${W.hl(p.json.trim())}</pre>${p.note ? `<p class="bts-note">${p.note}</p>` : ""}`).join("")}</div>`;
    requestAnimationFrame(() => drawer.classList.add("open"));
  };
  W.bts = (el, { title, sub = "", parts, label = "Behind the scenes" }) => {
    el.classList.add("bts-btn", "btn");
    el.innerHTML = `🎬 ${label}`;
    el.onclick = () => openDrawer(title, sub, parts);
  };
  /* declarative: <button data-bts="key"> + W.BTS[key] = {title, parts} */
  W.BTS = {};
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-bts]");
    if (b && W.BTS[b.dataset.bts]) { const d = W.BTS[b.dataset.bts]; openDrawer(d.title, d.sub || "", d.parts); }
  });
  document.addEventListener("DOMContentLoaded", () => $$("[data-bts]").forEach((b) => { b.classList.add("btn", "bts-btn"); if (!b.textContent.trim()) b.textContent = "🎬 Behind the scenes"; }));


  /* ---------- seq: step-through sequence diagram ----------
     W.seq(el, { actors:[{id,name,icon,c}], steps:[{from,to,label,note,code,ret} | {sep:"text"}], frames:[{from,to,label,c}] })
     frames use 0-based message indices. → on the clicker reveals the next message before leaving the slide. */
  W.seq = (el, { actors, steps, frames = [], intro = "Press <b>→</b> or <b>Next</b> to send the first message." }) => {
    el.classList.add("seq");
    const VW = 900, HEAD = 58, RH = 42, SELF = 52, n = actors.length, colW = (VW - 20) / n, X = {}, A = {};
    actors.forEach((a, i) => { X[a.id] = 10 + colW * (i + 0.5); A[a.id] = a; });
    let y = HEAD + 34, k = 0; const msgs = [], seps = [];
    steps.forEach((s) => {
      if (s.sep) { seps.push({ ...s, y: y - 8, k }); y += 30; return; }
      msgs.push({ ...s, y, k: k++ }); y += s.from === s.to ? SELF : RH;
    });
    const H = y + 6, col = (id) => cv(A[id].c || "accent");
    const head = actors.map((a) => `<g class="sq-a" data-a="${a.id}" style="--c:${col(a.id)}">
      <line x1="${X[a.id]}" y1="${HEAD}" x2="${X[a.id]}" y2="${H}" class="sq-life"/>
      <rect x="${X[a.id] - colW / 2 + 8}" y="4" width="${colW - 16}" height="${HEAD - 10}" rx="10" class="sq-box"/>
      <text x="${X[a.id]}" y="${HEAD / 2 + 5}" text-anchor="middle" class="sq-h"${(a.name.length + 3) * 9.6 > colW - 22 ? ` style="font-size:${Math.max(12, Math.floor((colW - 22) / ((a.name.length + 3) * 0.6)))}px"` : ""}>${a.icon ? a.icon + " " : ""}${a.name}</text></g>`).join("");
    const fr = frames.map((f, i) => {
      const y1 = msgs[f.from].y - 28, y2 = msgs[f.to].y + (msgs[f.to].from === msgs[f.to].to ? 30 : 12);
      return `<g class="sq-f off" data-f="${i}" style="--c:${cv(f.c || "warn")}"><rect x="4" y="${y1}" width="${VW - 8}" height="${y2 - y1}" rx="8" class="sq-fr"/>
        <rect x="4" y="${y1}" width="${f.label.length * 7.2 + 18}" height="19" rx="6" class="sq-ft"/><text x="13" y="${y1 + 13.5}" class="sq-fl">${f.label}</text></g>`;
    }).join("");
    const sp = seps.map((s) => `<g class="sq-s off" data-k="${s.k}"><line x1="4" x2="${VW - 4}" y1="${s.y}" y2="${s.y}"/><text x="${VW / 2}" y="${s.y + 4}" text-anchor="middle">${s.sep}</text></g>`).join("");
    const mg = msgs.map((m) => {
      const x1 = X[m.from], x2 = X[m.to], c = col(m.from), lbl = `${m.k + 1} · ${m.label}`;
      let body;
      if (m.from === m.to) {
        body = `<path d="M${x1} ${m.y - 6} h44 v20 h-36" class="sq-ln"/><polygon points="${x1 + 2},${m.y + 14} ${x1 + 12},${m.y + 9} ${x1 + 12},${m.y + 19}" class="sq-hd"/>
          ${x1 + 60 + lbl.length * 8.4 > VW ? `<text x="${x1 - 10}" y="${m.y + 9}" text-anchor="end" class="sq-l">${lbl}</text>` : `<text x="${x1 + 52}" y="${m.y + 9}" class="sq-l">${lbl}</text>`}`;
      } else {
        const d = x2 > x1 ? 1 : -1, tip = x2 - d * 3;
        body = `<line x1="${x1}" y1="${m.y}" x2="${tip - d * 8}" y2="${m.y}" class="sq-ln${m.ret ? " ret" : ""}"/>
          <polygon points="${tip},${m.y} ${tip - d * 11},${m.y - 6} ${tip - d * 11},${m.y + 6}" class="sq-hd"/>
          <text x="${(x1 + x2) / 2}" y="${m.y - 8}" text-anchor="middle" class="sq-l">${lbl}</text>`;
      }
      return `<g class="sq-m off" data-k="${m.k}" style="--c:${c}"><rect x="0" y="${m.y - 26}" width="${VW}" height="${m.from === m.to ? SELF : RH}" class="sq-hit"/>${body}</g>`;
    }).join("");
    const heads = head.replace(/<line [^>]*class="sq-life"\/>/g, ""), lives = actors.map((a) => `<line x1="${X[a.id]}" y1="${HEAD}" x2="${X[a.id]}" y2="${H}" class="sq-life"/>`).join("");
    el.innerHTML = `<div class="seq-dia"><svg class="seq-head" viewBox="0 0 ${VW} ${HEAD}">${heads}</svg><div class="seq-body"><svg viewBox="0 ${HEAD} ${VW} ${H - HEAD}" role="img" aria-label="Sequence diagram">${lives}${fr}${sp}${mg}</svg></div></div>
      <div class="seq-side"><div class="seq-panel"></div><div class="row seq-ctrl"><button class="btn primary">▶ Next</button><button class="btn">Show all</button><button class="btn ghost">↺ Reset</button><span class="muted"></span></div></div>`;
    const panel = $(".seq-panel", el), [bNext, bAll, bReset, cnt] = $(".seq-ctrl", el).children;
    const G = $$(".sq-m", el), S = $$(".sq-s", el), F = $$(".sq-f", el), AH = $$(".sq-a", el);
    let shown = 0;
    const show = (t) => {
      shown = Math.max(0, Math.min(t, msgs.length));
      G.forEach((g, i) => { g.classList.toggle("off", i >= shown); g.classList.toggle("cur", i === shown - 1); });
      S.forEach((g) => g.classList.toggle("off", +g.dataset.k >= shown));
      F.forEach((g, i) => g.classList.toggle("off", frames[i].from >= shown));
      const m = msgs[shown - 1];
      AH.forEach((g) => g.classList.toggle("lit", !!m && (g.dataset.a === m.from || g.dataset.a === m.to)));
      panel.innerHTML = m
        ? `<div class="seq-who" style="--c:${col(m.from)}">Step ${shown} · ${A[m.from].name}${m.from === m.to ? "" : " → " + A[m.to].name}</div><div class="seq-t">${m.label}</div>${m.note ? `<p>${m.note}</p>` : ""}${m.code ? `<pre class="code">${W.hl(m.code.trim())}</pre>` : ""}`
        : `<div class="seq-who">Sequence diagram</div><p>${intro}</p><p class="muted" style="font-size:13px">The faint arrows are the whole flow. Each step lights up as you go. Solid arrows are requests, dashed arrows are replies. Click any arrow to jump to it.</p>`;
      const body = $(".seq-body", el), cur = G[shown - 1];
      if (body.scrollHeight > body.clientHeight + 4) {
        if (!cur) body.scrollTo({ top: 0, behavior: "smooth" });
        else { const br = body.getBoundingClientRect(), r = cur.getBoundingClientRect();
          if (r.bottom > br.bottom - 30 || r.top < br.top + 10) body.scrollTo({ top: body.scrollTop + (r.top - br.top) - body.clientHeight * 0.55, behavior: "smooth" }); }
      }
      cnt.textContent = `${shown} / ${msgs.length}`;
      bNext.disabled = shown >= msgs.length;
      el.classList.toggle("done", shown >= msgs.length);
    };
    bNext.onclick = () => show(shown + 1);
    bAll.onclick = () => show(msgs.length);
    bReset.onclick = () => show(0);
    G.forEach((g, i) => g.addEventListener("click", () => show(i + 1)));
    show(0);
    document.addEventListener("slide:enter", (e) => { if (e.detail.slide.contains(el)) show(e.detail.back ? msgs.length : 0); });
    document.addEventListener("slide:advance", (e) => {
      if (!e.detail.slide.contains(el) || shown >= msgs.length) return;
      if ($$(".seq:not(.done)", e.detail.slide)[0] !== el) return;
      e.preventDefault(); show(shown + 1);
    });
    return { show };
  };

  /* ---------- py: Python syntax colouring (v4) ---------- */
  const PYK = "def|return|if|elif|else|for|in|while|import|from|as|not|and|or|None|True|False|try|except|finally|with|lambda|break|continue|class|raise|pass|is";
  const PYRE = new RegExp(`(#.*$)|("""[\\s\\S]*?"""|f?"(?:[^"\\\\\\n]|\\\\.)*"|f?'(?:[^'\\\\\\n]|\\\\.)*')|\\b(${PYK})\\b|\\b(\\d+(?:\\.\\d+)?)\\b|\\b([A-Za-z_]\\w*)(?=\\()`, "gm");
  W.py = (src) => esc(src).replace(PYRE, (m, com, str, kw, num, fn) =>
    com ? `<span class="j-c">${com}</span>` : str ? `<span class="j-s">${str}</span>` : kw ? `<span class="py-k">${kw}</span>` : num ? `<span class="j-n">${num}</span>` : `<span class="py-f">${fn}</span>`);

  /* ---------- codeWalk: step through a program, line by line (v4) ----------
     W.codeWalk(el, { code, file, intro, steps:[{ lines:[from,to], t, note, label, json, c }] })
     Left: the whole program, the current lines highlighted. Right: what those lines do, and the JSON they send or receive.
     → on the clicker moves to the next step before leaving the slide, like W.seq. */
  W.codeWalk = (el, { code, file = "", intro = "Press <b>→</b> or <b>Next</b> to walk through the program.", steps }) => {
    el.classList.add("cw");
    const lines = W.py(code.replace(/^\n/, "").replace(/\s+$/, "")).split("\n");
    el.innerHTML = `<div class="cw-code"><div class="cw-file">🐍 ${file}</div><pre class="code cw-pre">${lines.map((l, i) => `<span class="cw-l" data-n="${i + 1}"><i>${i + 1}</i>${l || " "}</span>`).join("")}</pre></div>
      <div class="seq-side"><div class="seq-panel cw-panel"></div><div class="row seq-ctrl"><button class="btn primary">▶ Next</button><button class="btn ghost">↺ Reset</button><span class="muted"></span></div></div>`;
    const L = $$(".cw-l", el), pre = $(".cw-pre", el), panel = $(".cw-panel", el), [bNext, bReset, cnt] = $(".seq-ctrl", el).children;
    let at = 0;
    const show = (t) => {
      at = Math.max(0, Math.min(t, steps.length));
      const s = steps[at - 1], [a, b] = s ? (s.lines.length > 1 ? s.lines : [s.lines[0], s.lines[0]]) : [0, -1];
      L.forEach((l, i) => { const on = i + 1 >= a && i + 1 <= b; l.classList.toggle("on", on); l.classList.toggle("dim", !!s && !on); });
      panel.innerHTML = s
        ? `<div class="seq-who" style="--c:${cv(s.c || "accent")}">Step ${at} · line${b > a ? "s" : ""} ${a}${b > a ? "–" + b : ""}</div><div class="seq-t">${s.t}</div>${s.note ? `<p>${s.note}</p>` : ""}${s.json ? `${s.label ? `<div class="bts-label" style="--c:${cv(s.c || "accent")}">${s.label}</div>` : ""}<pre class="code">${W.hl(s.json.trim())}</pre>` : ""}`
        : `<div class="seq-who">Code walkthrough</div><p>${intro}</p><p class="muted" style="font-size:13px">Each step highlights a few lines on the left and shows, on the right, the real request or response those lines produce.</p>`;
      const first = L[a - 1];
      if (first) {
        const pr = pre.getBoundingClientRect(), r = first.getBoundingClientRect(), rb = L[b - 1].getBoundingClientRect();
        if (r.top < pr.top + 8 || rb.bottom > pr.bottom - 8) pre.scrollTo({ top: pre.scrollTop + (r.top - pr.top) - 40, behavior: "smooth" });
      } else pre.scrollTo({ top: 0, behavior: "smooth" });
      cnt.textContent = `${at} / ${steps.length}`;
      bNext.disabled = at >= steps.length;
      el.classList.toggle("done", at >= steps.length);
    };
    bNext.onclick = () => show(at + 1);
    bReset.onclick = () => show(0);
    L.forEach((l, i) => l.addEventListener("click", () => { const k = steps.findIndex((s) => i + 1 >= s.lines[0] && i + 1 <= (s.lines[1] || s.lines[0])); if (k >= 0) show(k + 1); }));
    show(0);
    document.addEventListener("slide:enter", (e) => { if (e.detail.slide.contains(el)) show(e.detail.back ? steps.length : 0); });
    document.addEventListener("slide:advance", (e) => {
      if (!e.detail.slide.contains(el) || at >= steps.length) return;
      if ($$(".cw:not(.done)", e.detail.slide)[0] !== el) return;
      e.preventDefault(); show(at + 1);
    });
    return { show };
  };

  /* ---------- arch: animated architecture diagram ----------
     W.arch(el, { vb:[w,h], cols:[[x,"Label"]], nodes:{id:{x,y,w,h,c,tag,t,s:[lines],d}}, edges:{id:[from,to,"h"|"v"|"u",offset]},
                  obs:"Observability label", flows:[{ name, intro, steps:[{ who, t, on:[ids], think:[ids], bad:[ids],
                  p:[{ e:edgeId, r:1 reply, d:delay in hops, x:1 blocked }], note, code, log }] }] })
     Dots travel along the edges: accent = request, green = reply, red = blocked. → reveals the next step before leaving the slide. */
  W.arch = (el, { vb = [1160, 640], cols = [], nodes, edges, flows, obs = "" }) => {
    el.classList.add("arch");
    const NS = "http://www.w3.org/2000/svg", SPEED = 900, [VW, VH] = vb, OY = obs ? VH - 82 : VH;
    const mk = (tag, a, p) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
    el.innerHTML = `<div class="arch-dia"><svg viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Architecture diagram"></svg></div>
      <div class="arch-side">${flows.length > 1 ? `<div class="row arch-flows">${flows.map((f, i) => `<button class="btn${i ? "" : " sel"}">${f.name}</button>`).join("")}</div>` : ""}
      <div class="arch-panel"></div>
      <div class="arch-legend"><span><i style="background:var(--accent)"></i>Request</span><span><i style="background:var(--good)"></i>Reply</span><span><i style="background:var(--bad)"></i>Blocked</span></div>
      <div class="row arch-ctrl"><button class="btn primary">▶ Next</button><button class="btn">⏵ Play</button><button class="btn ghost">↺ Reset</button><span class="muted"></span></div></div>`;
    const svg = $("svg", el), panel = $(".arch-panel", el), [bNext, bPlay, bReset, cnt] = $(".arch-ctrl", el).children;
    cols.forEach(([x, t]) => { mk("text", { x, y: 30, class: "ar-col", "text-anchor": "middle" }, svg).textContent = t; });
    const gE = mk("g", {}, svg), gN = mk("g", {}, svg), gP = mk("g", {}, svg), PATH = {}, NODE = {};
    for (const id in edges) {
      const [f, t, dir, oy = 0] = edges[id], a = nodes[f], b = nodes[t];
      let d;
      if (dir === "v") d = `M${a.x + a.w / 2} ${a.y + a.h} L${b.x + b.w / 2} ${b.y}`;
      else if (dir === "u") d = `M${a.x + a.w / 2 + oy} ${a.y} L${b.x + b.w / 2 + oy} ${b.y + b.h}`;   // v4: bottom box up to top box
      else { const x1 = a.x + a.w, y1 = a.y + a.h / 2 + oy, x2 = b.x, y2 = b.y + b.h / 2, dx = (x2 - x1) / 2; d = `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`; }
      PATH[id] = mk("path", { d, class: "ar-e" }, gE);
    }
    for (const id in nodes) {
      const n = nodes[id], g = mk("g", { class: "ar-n", style: `--c:${cv(n.c)}` }, gN);
      mk("rect", { class: "ar-box", x: n.x, y: n.y, width: n.w, height: n.h, rx: 12 }, g);
      mk("rect", { class: "ar-bar", x: n.x, y: n.y + 10, width: 4, height: n.h - 20, rx: 2 }, g);
      mk("text", { class: "ar-tag", x: n.x + 16, y: n.y + 21 }, g).textContent = n.tag;
      mk("text", { class: "ar-t", x: n.x + 16, y: n.y + 42 }, g).textContent = n.t;
      (n.s || []).forEach((s, i) => { mk("text", { class: "ar-s", x: n.x + 16, y: n.y + 61 + i * 16 }, g).textContent = s; });
      g.addEventListener("click", () => { stop(); panel.innerHTML = `<div class="seq-who" style="--c:${cv(n.c)}">${n.tag}</div><div class="seq-t">${n.t}</div><p>${n.d}</p><p class="muted" style="font-size:13px">Press → to continue the flow.</p>`; });
      NODE[id] = g;
    }
    let LOG = [], gO;
    if (obs) {
      gO = mk("g", { class: "ar-obs" }, svg);
      mk("rect", { x: 10, y: OY + 8, width: VW - 20, height: 70, rx: 12 }, gO);
      mk("text", { class: "ar-ol", x: 28, y: OY + 31 }, gO).textContent = obs;
      LOG = [0, 1].map((i) => mk("text", { class: "ar-log", x: 28, y: OY + 51 + i * 18 }, gO));
    }
    let flow = flows[0], step = -1, tok = 0, timer = null;
    const fire = (list) => {
      const my = ++tok; gP.innerHTML = "";
      list.forEach((p) => {
        const path = PATH[p.e], L = path.getTotalLength(), c = p.x ? "var(--bad)" : p.r ? "var(--good)" : "var(--accent)";
        const dots = [7, 5, 3.5].map((r, i) => mk("circle", { r, class: i ? "ar-tr" : "ar-dot", style: `fill:${c};--c:${c}`, opacity: i ? 0.5 - i * 0.12 : 1, visibility: "hidden" }, gP));
        const t0 = performance.now() + (p.d || 0) * SPEED;
        (function tick(now) {
          if (my !== tok) return;
          const k = (now - t0) / SPEED;
          if (k >= 0) dots.forEach((dot, i) => {
            let u = Math.min(1, Math.max(0, k - i * 0.05)); u = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
            const pt = path.getPointAtLength((p.r ? 1 - u : u) * L);
            dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y); dot.setAttribute("visibility", "visible");
          });
          if (k < 1.6) requestAnimationFrame(tick); else dots.forEach((d) => d.remove());
        })(performance.now());
      });
    };
    const show = (t, animate) => {
      const S = flow.steps; step = Math.max(-1, Math.min(t, S.length - 1));
      Object.values(PATH).forEach((p) => p.setAttribute("class", "ar-e"));
      Object.values(NODE).forEach((g) => g.classList.remove("on", "bad", "think"));
      for (let i = 0; i < step; i++) S[i].p.forEach((p) => PATH[p.e].classList.add("seen"));
      svg.classList.toggle("dim", step >= 0);
      const s = S[step];
      if (!s) {
        panel.innerHTML = `<div class="seq-who">${flow.name}</div>${flow.intro}<p class="muted" style="font-size:13px">Press <b>→</b> or <b>Next</b>. Click any box to read what it does.</p>`;
        LOG.forEach((l, i) => (l.textContent = i ? "" : "waiting for a request…"));
      } else {
        s.p.forEach((p) => PATH[p.e].classList.add("on", ...(p.x ? ["x"] : p.r ? ["r"] : [])));
        ["on", "bad", "think"].forEach((k) => (s[k] || []).forEach((n) => NODE[n].classList.add(k)));
        panel.innerHTML = `<div class="seq-who">Step ${step + 1} · ${s.who}</div><div class="seq-t">${s.t}</div><p>${s.note}</p>${s.code ? `<pre class="code">${W.hl(s.code.trim())}</pre>` : ""}`;
        const logs = S.slice(Math.max(0, step - 1), step + 1).map((x) => `${String(S.indexOf(x) + 1).padStart(2, "0")}  ${x.log || ""}`);
        LOG.forEach((l, i) => (l.textContent = logs[i] || ""));
        if (gO) { gO.classList.remove("flash"); void gO.getBBox(); gO.classList.add("flash"); }
      }
      if (animate && s) fire(s.p); else { tok++; gP.innerHTML = ""; }
      cnt.textContent = `${step + 1} / ${S.length}`;
      bNext.disabled = step >= S.length - 1;
      el.classList.toggle("done", step >= S.length - 1);
    };
    const hopTime = () => { const s = flow.steps[step]; return s ? (Math.max(0, ...s.p.map((p) => p.d || 0)) + 1) * SPEED + 1600 : 600; };
    const stop = () => { clearTimeout(timer); timer = null; bPlay.textContent = "⏵ Play"; };
    const play = () => {
      if (timer) return stop();
      if (step >= flow.steps.length - 1) show(-1);
      bPlay.textContent = "⏸ Pause";
      const loop = () => { show(step + 1, true); if (step < flow.steps.length - 1) timer = setTimeout(loop, hopTime()); else stop(); };
      timer = setTimeout(loop, 10);
    };
    bNext.onclick = () => { stop(); show(step + 1, true); };
    bPlay.onclick = play;
    bReset.onclick = () => { stop(); show(-1); };
    $$(".arch-flows .btn", el).forEach((b, i) => (b.onclick = () => {
      stop(); flow = flows[i]; $$(".arch-flows .btn", el).forEach((x) => x.classList.toggle("sel", x === b)); show(-1);
    }));
    show(-1);
    document.addEventListener("slide:enter", (e) => { if (e.detail.slide.contains(el)) { stop(); show(e.detail.back ? flow.steps.length - 1 : -1); } else stop(); });
    document.addEventListener("slide:advance", (e) => {
      if (!e.detail.slide.contains(el) || step >= flow.steps.length - 1) return;
      e.preventDefault(); stop(); show(step + 1, true);
    });
    return { show };
  };

  /* cast cards */
  W.castCards = (el, keys) => {
    el.classList.add("cast");
    el.innerHTML = keys.map(([k, line, tag]) => { const p = W.CAST[k]; return `<div class="cast-card" style="--c:${cv(p.c)}"><div class="sc-av">${p.av}</div><b>${p.name}</b><span class="muted">${p.role}</span><p>${line}</p>${tag ? `<span class="tag">${tag}</span>` : ""}</div>`; }).join("");
  };
})();
