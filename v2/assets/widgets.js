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
    model:     { name: "Model",     icon: "🧠", car: "The engine",         q: "What is the AI?",            topics: "Topics 02–03",
                 desc: "Powerful, but on its own it goes nowhere. It reads text and predicts text, using only what it learned in training." },
    context:   { name: "Context",   icon: "📋", car: "The trip briefing",  q: "What does it see right now?", topics: "Topics 01, 04–06",
                 desc: "Everything you hand the model for this job: instructions, examples, history. It can only use what’s in front of it." },
    knowledge: { name: "Knowledge", icon: "📚", car: "The map / GPS",      q: "What does it know about us?", topics: "Topic 07",
                 desc: "Your company’s own roads. Instead of guessing, it looks things up in your documents before answering." },
    action:    { name: "Action",    icon: "🔧", car: "Wheels & steering",  q: "What can it actually do?",    topics: "Topics 08–09",
                 desc: "Lets it move: query systems, send messages, update records. MCP is the standard fitting, so any wheel fits any car." },
    autonomy:  { name: "Autonomy",  icon: "🤖", car: "Driver & chassis",   q: "Who’s driving?",              topics: "Topics 10–12",
                 desc: "A workflow follows a fixed route; an agent chooses its own turns. The harness is the car body that wires everything together." },
    trust:     { name: "Trust",     icon: "🛡️", car: "Brakes & seatbelts", q: "Is it safe and is it good?",  topics: "Topic 13",
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
        return (inside ? `<div class="ctx-seg" style="--c:${cv(p.c)};width:${(inside / capacity) * 100}%" title="${p.label}">${p.label}</div>` : "") +
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
})();
