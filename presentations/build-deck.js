// Builds presentations/agentic-harness-mcp-guidewire.pptx
// Run with: PPTX_SKILL=<pptx skill dir> NODE_PATH=<dir with pptxgenjs> node build-deck.js [out.pptx]
// Then run add-animations.py on the output to add click animations and fade transitions.
// Any shape whose objectName starts with "a<N>-" appears on click N of its slide.
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");

const OUT = process.argv[2] || path.join(__dirname, "agentic-harness-mcp-guidewire.pptx");

// EY-style palette (approximation: EY yellow, EY dark grey, EY greys and support colours)
const THEME = {
  name: "EY style",
  headFontFace: "Arial",
  bodyFontFace: "Arial",
  colors: {
    dk1: "2E2E38", lt1: "FFFFFF", dk2: "1A1A24", lt2: "F6F6FA",
    accent1: "FFE600", accent2: "747480", accent3: "188CE5",
    accent4: "2DB757", accent5: "FF6D00", accent6: "C4C4CD",
    hlink: "188CE5", folHlink: "747480",
  },
};
const HEX = THEME.colors;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "Agentic harnesses, MCP and the Guidewire Developer Assistant";
const C = pres.SchemeColor;
const FOOT = "Agentic harnesses, MCP and the Guidewire Developer Assistant";

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: "TITLE_DARK",
  background: { color: HEX.dk1 },
  objects: [
    { rect: { x: 0.6, y: 2.05, w: 0.55, h: 0.55, fill: { color: C.accent1 } } },
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 2.85, w: 11.5, h: 1.9, fontSize: 44, bold: true, color: C.background1, valign: "top", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 4.85, w: 11.0, h: 1.0, fontSize: 20, color: C.accent6, valign: "top", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: HEX.lt1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.35, w: 12.1, h: 0.75, fontSize: 32, bold: true, color: C.text1, valign: "middle", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 1.08, w: 12.1, h: 0.45, fontSize: 16, color: C.accent2, valign: "top", margin: 0 }, text: "" } },
    { text: { text: FOOT, options: { x: 0.6, y: 7.05, w: 9, h: 0.3, fontSize: 10, color: C.accent2, margin: 0 } } },
  ],
  slideNumber: { x: 12.2, y: 7.05, w: 0.5, h: 0.3, fontSize: 10, color: C.accent2, align: "right" },
});

// ---------- Helpers ----------
let uid = 0;
const nm = (a, base) => (a ? `a${a}-${base || "s"}${++uid}` : `${base || "s"}${++uid}`);
function box(s, o) {
  s.addText(o.text, {
    shape: o.shape || pres.shapes.ROUNDED_RECTANGLE, rectRadius: o.shape ? undefined : 0.06,
    x: o.x, y: o.y, w: o.w, h: o.h,
    fill: { color: o.fill || C.background2 },
    line: o.line ? { color: o.line, width: o.lineW || 1, dashType: o.dash || "solid" } : { type: "none" },
    color: o.color || C.text1, fontSize: o.size || 14, bold: !!o.bold,
    align: o.align || "center", valign: o.valign || "middle",
    margin: Math.round((o.margin === undefined ? 0.08 : o.margin) * 72), isTextBox: true, objectName: nm(o.a, "box"),
  });
}
function label(s, text, x, y, w, h, o = {}) {
  s.addText(text, { x, y, w, h, fontSize: o.size || 12, color: o.color || C.text1, bold: !!o.bold, italic: !!o.italic,
    align: o.align || "left", valign: o.valign || "middle", margin: 0, isTextBox: true, objectName: nm(o.a, "lbl") });
}
function arrow(s, x1, y1, x2, y2, o = {}) {
  s.addShape(pres.shapes.LINE, {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipH: x2 < x1, flipV: y2 < y1, objectName: nm(o.a, "arr"),
    line: { color: o.color || C.text1, width: o.width || 1.5, dashType: o.dash || "solid",
      endArrowType: o.noHead ? undefined : "triangle" },
  });
}
function panel(s, x, y, w, h, o = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, objectName: nm(o.a, "pnl"),
    fill: { color: o.fill || C.background2 }, line: o.line ? { color: o.line, width: o.lineW || 1, dashType: o.dash || "solid" } : { type: "none" } });
}
function content(title, sub, section) {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  s.addText(title, { placeholder: "title" });
  if (sub) s.addText(sub, { placeholder: "body" });
  return s;
}
function numDot(s, n, x, y, o = {}) {
  s.addText(String(n), { shape: pres.shapes.OVAL, x, y, w: o.d || 0.42, h: o.d || 0.42, fill: { color: o.fill || C.accent1 },
    line: { type: "none" }, color: o.color || C.text1, fontSize: o.size || 13, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm(o.a, "dot") });
}

// Sequence diagram engine. Colour = protocol, dashed = response, each message = one click.
// lanes: [{id,name,x,w,fill,color}]; msgs: [{from,to,text,kind:"mcp"|"api"|"local",ret}]
function sequence(s, lanes, msgs, o) {
  const KIND = { mcp: C.text1, api: C.accent3, local: C.accent2 };
  lanes.forEach((ln) => {
    box(s, { x: ln.x - ln.w / 2, y: o.top, w: ln.w, h: 0.5, text: ln.name, fill: ln.fill, color: ln.color, bold: true, size: 12 });
  });
  (o.frames || []).forEach((f) => {
    const y1 = o.y(f.from) - 0.27, y2 = o.y(f.to) + 0.08;
    s.addShape(pres.shapes.RECTANGLE, { x: f.x1, y: y1, w: f.x2 - f.x1, h: y2 - y1, fill: { color: C.accent5, transparency: 94 },
      line: { color: C.accent5, width: 1.5 }, objectName: nm(f.a, "frm") });
    label(s, f.text, f.x2 - 3.6, y1 + 0.02, 3.5, 0.22, { size: 10, bold: true, color: C.accent5, align: "right", a: f.a });
  });
  lanes.forEach((ln) => s.addShape(pres.shapes.LINE, { x: ln.x, y: o.top + 0.5, w: 0, h: o.bottom - o.top - 0.5,
    line: { color: C.accent6, width: 1, dashType: "dash" }, objectName: nm(0, "life") }));
  (o.tags || []).forEach((t) => {
    box(s, { x: 0.6, y: o.y(t.at) - 0.27, w: o.tagW || 1.05, h: 0.3, text: t.text, fill: t.fill || C.background2, size: 10, bold: true, margin: 0.02, a: t.a });
  });
  const X = Object.fromEntries(lanes.map((l) => [l.id, l.x]));
  msgs.forEach((m, i) => {
    const y = o.y(i);
    const a = (o.firstClick || 1) + i;
    const x1 = X[m.from], x2 = X[m.to];
    const num = `${i + 1}. `;
    if (m.from === m.to) {
      box(s, { x: x1 - 1.0, y: y - 0.21, w: 2.0, h: 0.23, text: num + m.text, fill: C.accent1, size: 10, bold: true, margin: 0.02, a });
      return;
    }
    const col = KIND[m.kind || "mcp"];
    arrow(s, x1, y, x2, y, { color: col, dash: m.ret ? "dash" : "solid", width: 1.25, a });
    const lx = Math.min(x1, x2) + 0.08, lw = Math.abs(x2 - x1) - 0.16;
    label(s, num + m.text, lx, y - (o.labelH + 0.02), lw, o.labelH, { size: o.size, align: x2 > x1 ? "left" : "right", color: col, a });
  });
}

// ===================== 1: Title =====================
pres.addSection({ title: "Harness and MCP" });
let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "Harness and MCP" });
s.addText("From chat to agentic harness to MCP, and how the Guidewire Developer Assistant plugs in", { placeholder: "title" });
s.addText("How agents run the loop, call tools and RAG, connect to MCP servers, and use Guidewire cookbooks and knowledge", { placeholder: "body" });
s.addNotes("Today we follow one idea from start to finish. First, how an agent harness differs from a chat assistant. Then the agentic loop, with tool calls and RAG lookups. Then what MCP is, how a harness connects to MCP servers, and the message sequence. Finally, how Guidewire uses MCP to deliver its Developer Assistants: cookbooks and a knowledge base built on embeddings. Most slides build on click.");

// ===================== 2: Chat vs harness =====================
s = content("Chat-based agents vs agentic harness", "The model can be the same. The difference is who runs the loop: you, or the harness.", "Harness and MCP");
// Left: chat (click 1)
panel(s, 0.6, 1.75, 5.9, 2.95, { a: 1 });
label(s, "Chat-based agent: you are the loop", 0.85, 1.85, 5.4, 0.4, { size: 15, bold: true, a: 1 });
box(s, { x: 0.85, y: 2.4, w: 1.9, h: 0.7, text: "You ask a question", fill: C.background1, line: C.accent6, size: 12, a: 1 });
box(s, { x: 4.35, y: 2.4, w: 1.9, h: 0.7, text: "Chat model", fill: C.accent6, bold: true, size: 13, a: 1 });
box(s, { x: 4.35, y: 3.5, w: 1.9, h: 0.7, text: "Text answer or code", fill: C.background1, line: C.accent6, size: 12, a: 1 });
box(s, { x: 0.85, y: 3.5, w: 1.9, h: 0.7, text: "You copy, paste, run and check", fill: C.background1, line: C.accent6, size: 12, a: 1 });
arrow(s, 2.75, 2.75, 4.35, 2.75, { a: 1 });
arrow(s, 5.3, 3.1, 5.3, 3.5, { a: 1 });
arrow(s, 4.35, 3.85, 2.75, 3.85, { a: 1 });
arrow(s, 1.8, 3.5, 1.8, 3.1, { a: 1, color: C.accent5 });
label(s, "next message, by hand", 1.9, 3.15, 2.3, 0.3, { size: 11, color: C.accent5, italic: true, a: 1 });
label(s, "e.g. Claude.ai or ChatGPT in a browser tab", 0.85, 4.3, 5.4, 0.3, { size: 11, color: C.accent2, a: 1 });
// Right: harness (click 2)
panel(s, 6.8, 1.75, 5.9, 2.95, { a: 2, fill: C.background1, line: C.text1, lineW: 1.25 });
label(s, "Agentic harness: the harness runs the loop", 7.05, 1.85, 5.4, 0.4, { size: 15, bold: true, a: 2 });
box(s, { x: 7.05, y: 2.4, w: 1.55, h: 0.7, text: "You give a goal", fill: C.background2, size: 12, a: 2 });
box(s, { x: 7.05, y: 3.5, w: 1.55, h: 0.7, text: "Result for your review", fill: C.accent4, color: C.background1, bold: true, size: 12, a: 2 });
panel(s, 8.95, 2.35, 3.5, 1.9, { a: 2, fill: C.accent1 });
label(s, "Harness", 9.1, 2.42, 1.5, 0.3, { size: 12, bold: true, a: 2 });
box(s, { x: 9.15, y: 2.8, w: 1.3, h: 0.6, text: "Model", fill: C.text1, color: C.background1, bold: true, size: 12, a: 2 });
box(s, { x: 10.95, y: 2.8, w: 1.3, h: 0.6, text: "Tools · RAG · MCP", fill: C.background1, size: 11, bold: true, margin: 0.03, a: 2 });
arrow(s, 10.45, 2.95, 10.95, 2.95, { a: 2, width: 1.25 });
arrow(s, 10.95, 3.25, 10.45, 3.25, { a: 2, width: 1.25, dash: "dash" });
label(s, "repeats until the task is done", 9.15, 3.55, 3.1, 0.3, { size: 11, italic: true, a: 2 });
label(s, "permissions on every action", 9.15, 3.85, 3.1, 0.3, { size: 11, italic: true, a: 2 });
arrow(s, 8.6, 2.75, 8.95, 2.75, { a: 2 });
arrow(s, 8.95, 3.85, 8.6, 3.85, { a: 2 });
label(s, "e.g. Claude Code, Agent SDK, Copilot agent mode", 7.05, 4.3, 5.4, 0.3, { size: 11, color: C.accent2, a: 2 });
// Table (click 3)
const hdr = (t, fill) => ({ text: t, options: { bold: true, fill: { color: fill }, color: C.text1, fontSize: 14 } });
const cell = (t, b) => ({ text: t, options: { bold: !!b, fontSize: 14, color: C.text1 } });
s.addTable([
  [hdr("", C.background1), hdr("Chat-based agent", C.accent6), hdr("Agentic harness", C.accent1)],
  [cell("Actions", true), cell("Suggests; you copy, paste and run"), cell("Runs tools itself: files, APIs, shell, RAG, MCP")],
  [cell("Context", true), cell("Only what you paste in"), cell("Fetches what it needs and manages its own context")],
  [cell("Memory", true), cell("The conversation"), cell("Project instructions and memory files (e.g. CLAUDE.md)")],
  [cell("Guard rails", true), cell("You check every reply"), cell("Permissions, approvals, hooks, sandbox")],
], { x: 0.6, y: 4.9, w: 12.1, colW: [1.9, 4.6, 5.6], rowH: 0.4, fontFace: "Arial", objectName: nm(3, "tbl"),
  border: { type: "solid", pt: 0.75, color: HEX.accent6 }, fill: { color: HEX.lt1 }, valign: "middle", margin: 0.06 });
s.addNotes("Click 1: the chat model. You ask, it answers with text or code, and you copy, paste, run and check it yourself. You are the loop, and you are the safety gate. Click 2: the agentic harness. You give a goal. The harness calls the model, runs the tools it asks for (files, APIs, RAG search, MCP servers), feeds the results back and repeats until the task is done, applying permissions on every action. You get a result to review. Click 3: the differences in one table. Same model, different car: the harness adds the steering, the brakes and the tools.");

// ===================== 3: Agentic loop (from v3 Topic 14) =====================
s = content("Plan → Act → Observe → Done? → repeat", "One task takes many runs of the loop. Each run is one model call; the tool or RAG result changes the next step.", "Harness and MCP");
// cycle (click 1)
const node = (t, sub, x, y, fill, color) => box(s, { x, y, w: 1.8, h: 0.8, fill, color, a: 1,
  text: [{ text: t, options: { bold: true, fontSize: 15, breakLine: true } }, { text: sub, options: { fontSize: 10 } }] });
node("Plan", "model decides next step", 2.5, 1.8, C.accent1, C.text1);
node("Act", "tool call · RAG · MCP", 4.5, 3.35, C.text1, C.background1);
node("Observe", "result added to context", 2.5, 4.9, C.background2, C.text1);
node("Done?", "any tool_use left?", 0.5, 3.35, C.accent4, C.background1);
arrow(s, 4.3, 2.4, 5.2, 3.35, { a: 1, width: 2 });
arrow(s, 5.2, 4.15, 4.3, 5.0, { a: 1, width: 2 });
arrow(s, 2.5, 5.3, 1.4, 4.15, { a: 1, width: 2 });
arrow(s, 1.4, 3.35, 2.5, 2.2, { a: 1, width: 2, color: C.accent5 });
label(s, "No → repeat", 0.6, 2.45, 1.6, 0.3, { size: 11, bold: true, color: C.accent5, a: 1 });
label(s, "The harness keeps going while the model asks for a tool", 2.35, 3.4, 2.1, 0.75, { size: 11, italic: true, align: "center", color: C.accent2, a: 1 });
box(s, { x: 0.6, y: 5.95, w: 5.7, h: 0.8, align: "left", size: 12, fill: C.background2, margin: 0.12, a: 1,
  text: [{ text: "Yes → stop. ", options: { bold: true } }, { text: "The reply has no tool_use (stop_reason: end_turn), or the harness hits a turn, time or cost limit." }] });
// trace (clicks 2..7)
label(s, [{ text: "Task: ", options: { bold: true } }, { text: "drivers aged exactly 25 are charged the under-25 surcharge. Find and fix it." }],
  6.75, 1.75, 5.95, 0.5, { size: 13, valign: "top", a: 0 });
const loops = [
  ["Tool", "grep(\"UNDER_25\", path: \"rating/\")", "Found in driver_factors.py, line 88", C.background2, C.text1],
  ["RAG", "search_guidelines(\"under-25 surcharge\")", "Manual §4.2: applies to drivers under 25", C.accent3, C.background1],
  ["Tool", "read_file(\"driver_factors.py\")", "if driver.age <= 25: 25-year-olds included", C.background2, C.text1],
  ["Tool", "edit test, run pytest", "1 failed: a 25-year-old got the surcharge", C.background2, C.text1],
  ["Approve", "edit_file: change <= to <", "Harness asks; the developer approves", C.accent5, C.background1],
  ["Done", "run(\"pytest -q\")", "312 passed → end_turn with a summary", C.accent4, C.background1],
];
loops.forEach((r, i) => {
  const y = 2.35 + i * 0.74, a = 2 + i;
  numDot(s, i + 1, 6.75, y + 0.1, { a });
  box(s, { x: 7.3, y: y + 0.08, w: 0.95, h: 0.46, text: r[0], fill: r[3], color: r[4], bold: true, size: 11, margin: 0.02, a });
  label(s, [{ text: r[1], options: { bold: true, breakLine: true, fontFace: "Courier New" } }, { text: "→ " + r[2], options: { color: C.accent2 } }],
    8.4, y, 4.3, 0.64, { size: 12, a });
});
s.addNotes("This is the loop from Topic 14 of the course. Click 1: the cycle. The model plans the next step, the harness acts on it by running a tool, a RAG lookup or an MCP call, the result goes back into the context, and the model checks whether it is done. If the reply still asks for a tool, round it goes again. Clicks 2 to 7: one task, six runs. Run 1 searches the code. Run 2 is a RAG lookup: it searches the underwriting guidelines and finds the rule says under 25, not 25 and under. Run 3 reads the code and finds the off-by-one. Run 4 proves it with a failing test. Run 5 needs approval to edit a file: the harness enforces that. Run 6 runs the full test suite and, with nothing left to do, the model replies with end_turn. Notice the agent did not know the plan in advance. Each observation changed the next step.");

// ===================== 4: What is MCP =====================
s = content("What is MCP?", "The Model Context Protocol is an open standard for connecting AI apps to tools and data. Think of it as USB-C for AI.", "Harness and MCP");
const apps = ["Claude Code", "Copilot", "Your own app"], syss = ["Policy admin", "Rating engine", "Guidelines"];
const ys = [2.4, 3.25, 4.1];
// Without (click 1)
label(s, "Without a standard: N × M", 0.6, 1.8, 3.9, 0.4, { size: 15, bold: true, a: 1 });
ys.forEach((y, i) => {
  box(s, { x: 0.6, y, w: 1.3, h: 0.6, text: apps[i], fill: C.background2, size: 11, bold: true, margin: 0.03, a: 1 });
  box(s, { x: 3.1, y, w: 1.3, h: 0.6, text: syss[i], fill: C.background1, line: C.accent6, size: 11, margin: 0.03, a: 1 });
});
ys.forEach((y1) => ys.forEach((y2) => arrow(s, 1.9, y1 + 0.3, 3.1, y2 + 0.3, { a: 1, noHead: true, color: C.accent5, width: 1 })));
label(s, "3 × 3 = 9 custom integrations to build and maintain", 0.6, 4.85, 3.8, 0.5, { size: 12, color: C.accent5, bold: true, valign: "top", a: 1 });
// With (click 2)
label(s, "With MCP: N + M", 4.8, 1.8, 3.9, 0.4, { size: 15, bold: true, a: 2 });
ys.forEach((y, i) => {
  box(s, { x: 4.8, y, w: 1.3, h: 0.6, text: apps[i], fill: C.background2, size: 11, bold: true, margin: 0.03, a: 2 });
  box(s, { x: 7.3, y, w: 1.3, h: 0.6, text: syss[i], fill: C.background1, line: C.accent6, size: 11, margin: 0.03, a: 2 });
  arrow(s, 6.1, y + 0.3, 6.35, y + 0.3, { a: 2, noHead: true, width: 1.5 });
  arrow(s, 7.05, y + 0.3, 7.3, y + 0.3, { a: 2, noHead: true, width: 1.5 });
});
box(s, { x: 6.35, y: 2.4, w: 0.7, h: 2.3, text: "MCP", fill: C.accent1, bold: true, size: 14, margin: 0.02, a: 2 });
label(s, "3 + 3 = 6 standard connectors. Build once, use anywhere.", 4.8, 4.85, 3.8, 0.5, { size: 12, color: C.accent4, bold: true, valign: "top", a: 2 });
// Primitives (click 3)
label(s, "What a server offers", 9.0, 1.8, 3.7, 0.4, { size: 15, bold: true, a: 3 });
[["Tools", "Actions the model can call, e.g. get_quote", C.accent1, C.text1],
 ["Resources", "Data the app can read, e.g. a policy document", C.background2, C.text1],
 ["Prompts", "Ready-made templates, e.g. “explain a quote”", C.background2, C.text1]].forEach(([t, d, f, c], i) => {
  box(s, { x: 9.0, y: 2.4 + i * 0.85, w: 3.7, h: 0.72, align: "left", margin: 0.12, fill: f, color: c, a: 3,
    text: [{ text: t, options: { bold: true, fontSize: 14, breakLine: true } }, { text: d, options: { fontSize: 11 } }] });
});
label(s, "Tools are by far the most used.", 9.0, 4.95, 3.7, 0.3, { size: 11, italic: true, color: C.accent2, a: 3 });
// Roles (click 4)
const roles = [["Host", "the AI app or harness, e.g. Claude Code"], ["Client", "one connection per server, inside the host"], ["Server", "the connector that exposes a system"], ["Wire", "JSON-RPC 2.0 over stdio (local) or HTTP (remote)"]];
roles.forEach(([t, d], i) => {
  box(s, { x: 0.6 + i * 3.08, y: 5.6, w: 2.9, h: 1.15, align: "left", valign: "top", margin: 0.12, fill: i === 0 ? C.text1 : C.background2, color: i === 0 ? C.background1 : C.text1, a: 4,
    text: [{ text: t, options: { bold: true, fontSize: 15, breakLine: true } }, { text: d, options: { fontSize: 12 } }] });
});
s.addNotes("MCP, the Model Context Protocol, is an open standard introduced by Anthropic in late 2024 and now supported across many AI apps. Click 1: without a standard, every AI app needs a custom integration with every system. Three apps and three systems means nine integrations to build and maintain. Click 2: with MCP, each app speaks MCP once and each system gets one MCP server. Three plus three, six connectors. This is why Guidewire chose MCP for its Developer Assistant. Click 3: a server can offer tools (actions), resources (data) and prompts (templates). Tools are by far the most used. Click 4: the vocabulary. The host is the AI app or harness. Inside it, one client per server. The server is the connector. Messages are JSON-RPC 2.0, over stdio for a local server or HTTP for a remote one.");

// ===================== 4b: Why not just REST? =====================
s = content("Why not just give the model our REST endpoints?", "You can: function calling works with any endpoint. It stops scaling with many AI apps, many systems and many endpoints.", "Harness and MCP");
const WHY = [
  ["Glue code in every app", "each AI app (your chatbot, Claude Code, Copilot) writes its own tool schemas, HTTP calls, auth and error handling for every endpoint.", "written once in the server; every MCP host reuses it with one line of config."],
  ["Hard-coded tool lists", "the tools are baked into each app, so a new or changed endpoint means a code change and a redeploy everywhere.", "the harness asks tools/list when it connects, and a server can announce changes."],
  ["Endpoints aren’t model-friendly", "hundreds of fine-grained endpoints, big OpenAPI specs, paging and raw IDs flood the context and confuse tool choice.", "a few task-level tools (get_quote) with clear descriptions and trimmed results."],
  ["Security and control", "your app holds every API key, and the model can reach whatever you wired up.", "auth sits with each server (OAuth for remote ones), and the harness allows, asks or denies per tool."],
];
WHY.forEach(([t, rest, mcp], i) => {
  const x = 0.6 + (i % 2) * 6.15, y = 1.75 + Math.floor(i / 2) * 1.75, a = i + 1;
  panel(s, x, y, 5.95, 1.6, { a });
  numDot(s, i + 1, x + 0.15, y + 0.15, { a });
  label(s, [
    { text: t, options: { bold: true, fontSize: 15, breakLine: true } },
    { text: "With raw REST: ", options: { bold: true, color: C.accent5 } }, { text: rest, options: { breakLine: true } },
    { text: "With MCP: ", options: { bold: true, color: C.accent4 } }, { text: mcp },
  ], x + 0.7, y + 0.12, 5.1, 1.38, { size: 12, valign: "top", a });
});
box(s, { x: 0.6, y: 5.35, w: 5.95, h: 1.5, align: "left", valign: "top", size: 13, fill: C.background1, line: C.accent6, margin: 0.16, a: 5,
  text: [{ text: "Plain function calling over REST is fine when", options: { bold: true, breakLine: true } },
    { text: "you have one app and a handful of endpoints, and you own both sides." }] });
box(s, { x: 6.75, y: 5.35, w: 5.95, h: 1.5, align: "left", valign: "top", size: 13, fill: C.accent1, margin: 0.16, a: 5,
  text: [{ text: "MCP pays off when", options: { bold: true, breakLine: true } },
    { text: "several AI tools need the same systems, there are many systems, or a vendor ships the tools for you, like the Guidewire Developer Assistant." }] });
s.addNotes("A fair question: why not describe each REST endpoint as a tool and give the list to the model? You can. Function calling works with any endpoint. Clicks 1 to 4 show where it stops scaling. One: glue code. Every AI app has to write its own tool schemas, HTTP calls, auth and error handling for every endpoint, and the next app writes it all again. An MCP server writes it once. Two: the tool list is hard-coded in each app, so every API change means a redeploy everywhere. With MCP the harness asks tools/list when it connects. Three: raw endpoints are built for programs, not models. Hundreds of endpoints, big specs and paged, ID-heavy responses fill the context and lead to wrong tool choices. A good MCP server offers a few task-level tools with clear descriptions. Four: security. With raw REST your app holds every key. With MCP, auth sits with each server and the harness can allow, ask or deny each tool. Click 5: so it is a judgement. One app and a few endpoints you own: plain function calling is fine. Many AI tools, many systems, or a vendor supplying the tools, as Guidewire does: MCP pays off.");

// ===================== 4c: MCP vs API for developers =====================
s = content("MCP vs API for developers", "MCP does not replace your APIs. An MCP server is a thin adapter that makes them discoverable and callable by AI agents.", "Harness and MCP");
box(s, { x: 2.55, y: 1.7, w: 5.0, h: 0.4, text: "API (REST, GraphQL, gRPC)", fill: C.accent6, bold: true, size: 14, align: "left", margin: 0.1 });
box(s, { x: 7.6, y: 1.7, w: 5.1, h: 0.4, text: "MCP (Model Context Protocol)", fill: C.accent1, bold: true, size: 14, align: "left", margin: 0.1 });
const devRows = [
  ["What it is", "An interface a service offers to programs", "A standard protocol for offering tools and data to AI apps"],
  ["Who calls it", "Your code, written in advance for that one API", "The harness, when the model asks for a tool at run time"],
  ["Discovery", "Read the docs, generate an SDK, hard-code endpoints", "tools/list returns names, descriptions and JSON Schemas"],
  ["Contract", "Different per API: paths, auth, paging, errors", "Same for every server: JSON-RPC 2.0, initialize, tools/call"],
  ["Transport, auth", "Whatever the API chose: HTTPS, API keys, OAuth", "stdio locally; Streamable HTTP with OAuth remotely"],
  ["Integration effort", "N apps × M APIs, each a custom client", "Wrap each API once; every MCP host can use it"],
];
devRows.forEach((r, i) => {
  const y = 2.15 + i * 0.48, a = i + 1;
  box(s, { x: 0.6, y, w: 1.9, h: 0.44, text: r[0], fill: C.text1, color: C.background1, bold: true, size: 12, align: "left", margin: 0.1, a });
  box(s, { x: 2.55, y, w: 5.0, h: 0.44, text: r[1], fill: C.background2, size: 12, align: "left", margin: 0.1, a });
  box(s, { x: 7.6, y, w: 5.1, h: 0.44, text: r[2], fill: C.background1, line: C.accent1, lineW: 1.5, size: 12, align: "left", margin: 0.1, a });
});
// adapter diagram (click 7)
box(s, { x: 0.6, y: 5.2, w: 2.6, h: 0.6, text: "Harness (MCP client)", fill: C.accent1, bold: true, size: 12, a: 7 });
box(s, { x: 5.25, y: 5.2, w: 2.85, h: 0.6, text: "MCP server = thin adapter", fill: C.text1, color: C.background1, bold: true, size: 12, a: 7 });
box(s, { x: 10.1, y: 5.2, w: 2.6, h: 0.6, text: "Rating engine API", fill: C.background1, line: C.text1, bold: true, size: 12, a: 7 });
arrow(s, 3.2, 5.5, 5.25, 5.5, { a: 7 });
arrow(s, 8.1, 5.5, 10.1, 5.5, { a: 7 });
label(s, "MCP: tools/call get_quote", 3.25, 5.53, 2.0, 0.28, { size: 10, align: "center", color: C.text1, a: 7 });
label(s, "REST: POST /v1/quotes", 8.15, 5.53, 1.95, 0.28, { size: 10, align: "center", color: C.accent3, a: 7 });
// when to use (click 8)
box(s, { x: 0.6, y: 6.0, w: 5.95, h: 0.85, align: "left", valign: "middle", size: 12, fill: C.background2, margin: 0.14, a: 8,
  text: [{ text: "Call the API directly ", options: { bold: true } }, { text: "when your own code knows exactly what to call: an app backend, a batch job, an integration." }] });
box(s, { x: 6.75, y: 6.0, w: 5.95, h: 0.85, align: "left", valign: "middle", size: 12, fill: C.accent1, margin: 0.14, a: 8,
  text: [{ text: "Use MCP ", options: { bold: true } }, { text: "when an AI agent should decide what to call, across many systems, from any MCP-capable tool." }] });
s.addNotes("Clicks 1 to 6 compare the two row by row. An API is an interface a service offers to programs; you write code against it in advance. MCP is a protocol for offering tools and data to AI apps; the harness calls it at run time because the model asked. With an API you discover what it does by reading docs or generating an SDK; with MCP, tools/list returns every tool with a description and a JSON Schema the model can read. Every API has its own contract; every MCP server has the same one, JSON-RPC 2.0 with initialize, tools/list and tools/call. Transport is stdio for a local server or Streamable HTTP with OAuth for a remote one. And instead of N apps times M APIs, you wrap each API once. Click 7: in practice an MCP server is a thin adapter. tools/call get_quote becomes POST /v1/quotes on the existing rating API. Click 8: so it is not either-or. Call the API directly when your own code knows exactly what to call. Use MCP when an AI agent should choose.");

// ===================== 5: Harness ↔ MCP servers =====================
s = content("The harness connects to MCP servers", "One line of config per server. At start-up the harness starts one client per server and learns its tools.", "Harness and MCP");
panel(s, 0.6, 1.75, 5.85, 4.55, { a: 1, line: C.accent6 });
label(s, "Agent harness (MCP host), e.g. Claude Code", 0.85, 1.85, 5.4, 0.4, { size: 14, bold: true, a: 1 });
box(s, { x: 0.85, y: 2.4, w: 2.6, h: 1.1, text: "Agentic loop\ncalls the model (Claude API)", fill: C.accent1, bold: true, size: 13, a: 1 });
box(s, { x: 0.85, y: 3.75, w: 2.6, h: 1.0, text: "Permissions\nallow · ask · deny", fill: C.background1, line: C.accent6, size: 13, a: 1 });
box(s, { x: 0.85, y: 5.0, w: 2.6, h: 1.0, text: "Built-in tools\nread, edit, run", fill: C.background1, line: C.accent6, size: 13, a: 1 });
[["Policy admin server", "local process · stdio", 2.4], ["Rating engine server", "remote · HTTP + login", 3.75], ["Knowledge base server", "RAG search over guidelines", 5.0]].forEach(([n, t, y], i) => {
  const a = 2 + i;
  box(s, { x: 3.75, y, w: 2.45, h: 1.0, text: "MCP client", fill: C.text1, color: C.background1, bold: true, size: 13, a });
  box(s, { x: 8.0, y, w: 4.7, h: 1.0, align: "left", margin: 0.15, fill: C.background1, line: C.text1, a,
    text: [{ text: n, options: { bold: true, fontSize: 14, breakLine: true } }, { text: t + "  ·  tools, resources, prompts", options: { fontSize: 12, color: C.accent2 } }] });
  arrow(s, 6.2, y + 0.5, 8.0, y + 0.5, { a });
  label(s, "JSON-RPC", 6.3, y + 0.15, 1.6, 0.3, { size: 11, color: C.accent2, align: "center", a });
});
box(s, { x: 0.6, y: 6.45, w: 12.1, h: 0.5, align: "left", size: 13, fill: C.accent1, margin: 0.15, a: 5,
  text: "The model never talks to a server. The harness finds the tools at start-up, then checks permissions on every call." });
s.addNotes("Click 1: the harness, the MCP host. It runs the loop, holds the permissions and has its own built-in tools. Clicks 2 to 4: each MCP server it is configured with, for example in a .mcp.json file, gets its own MCP client. A local server runs as a process on your machine over stdio. A remote server is a URL behind a login over HTTP. A knowledge base server can offer RAG search as a tool. Click 5: the server's tools appear to the model next to the built-in ones. The model never talks to a server directly; the harness is always in the middle and applies the same permissions.");

// ===================== 6: MCP sequence =====================
s = content("How the MCP integration works, step by step", "Dark: MCP JSON-RPC.  Blue: Claude Messages API.  Dashed: a response.  Steps 7 to 12 repeat on every run of the loop.", "Harness and MCP");
const lanesA = [
  { id: "U", name: "User", x: 2.6, w: 1.6, fill: C.background2 },
  { id: "H", name: "Harness (MCP client)", x: 5.3, w: 2.4, fill: C.accent1 },
  { id: "S", name: "Rating MCP server", x: 8.45, w: 2.3, fill: C.text1, color: C.background1 },
  { id: "M", name: "Model (Claude API)", x: 11.45, w: 2.3, fill: C.accent3, color: C.background1 },
];
const msgsA = [
  { from: "H", to: "S", text: "initialize (protocolVersion, capabilities)" },
  { from: "S", to: "H", text: "serverInfo, capabilities", ret: true },
  { from: "H", to: "S", text: "notifications/initialized" },
  { from: "H", to: "S", text: "tools/list" },
  { from: "S", to: "H", text: "tools: get_quote, get_policy (+ schemas)", ret: true },
  { from: "U", to: "H", text: "“Add a driver aged 18”", kind: "local" },
  { from: "H", to: "M", text: "messages + tool definitions", kind: "api" },
  { from: "M", to: "H", text: "tool_use: get_quote {driver_age: 18}", kind: "api", ret: true },
  { from: "H", to: "H", text: "permission check" },
  { from: "H", to: "S", text: "tools/call get_quote" },
  { from: "S", to: "H", text: "result: premium ₹44,750", ret: true },
  { from: "H", to: "M", text: "tool_result", kind: "api" },
  { from: "M", to: "H", text: "end_turn: answer text", kind: "api", ret: true },
  { from: "H", to: "U", text: "“₹44,750, was ₹18,400”", kind: "local", ret: true },
];
const yA = (i) => (i < 5 ? 2.6 + i * 0.3 : 4.3 + (i - 5) * 0.3 + (i >= 6 ? 0.08 : 0) + (i >= 12 ? 0.08 : 0));
sequence(s, lanesA, msgsA, {
  top: 1.7, bottom: 6.9, y: yA, labelH: 0.22, size: 11,
  frames: [{ from: 6, to: 11, x1: 3.9, x2: 12.7, text: "loop · while stop_reason = tool_use", a: 7 }],
  tags: [{ at: 0, text: "Connect", fill: C.accent1, a: 1 }, { at: 5, text: "Use", fill: C.background2, a: 6 }],
});
s.addNotes("Each click adds one message. Steps 1 to 5 are the connection, once, at start-up: initialize agrees the protocol version and capabilities, the harness confirms with notifications/initialized, then tools/list fetches every tool with its JSON schema. Step 6: the user asks. Step 7: the harness sends the message and the tool definitions to the model. Step 8: the model replies with tool_use. Step 9: the harness checks permissions. Steps 10 and 11: tools/call to the MCP server and the result. Step 12: the harness sends it back to the model as tool_result. The orange frame is the loop: steps 7 to 12 repeat for every tool the model asks for. Step 13: no more tools, end_turn, and step 14 the answer goes to the user. The harness is the translator between the two protocols.");

// ===================== 7: Section divider =====================
pres.addSection({ title: "Guidewire Developer Assistant" });
s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "Guidewire Developer Assistant" });
s.addText("Guidewire Developer Assistant", { placeholder: "title" });
s.addText("Guidewire’s product knowledge, delivered to your agentic harness as MCP servers", { placeholder: "body" });
s.addNotes("Now we apply everything to Guidewire. Guidewire did not build another chat window. It packaged its product knowledge as MCP servers, so the agentic coding tool your developers already use can call it whenever a task touches Guidewire code, configuration or APIs.");

// ===================== 8: What it provides =====================
s = content("What the Developer Assistant gives your harness", "Read-only access to curated Guidewire knowledge, through an MCP server, from the agentic coding tool you already use.", "Guidewire Developer Assistant");
label(s, "Assistants by area", 0.6, 1.75, 5.5, 0.4, { size: 16, bold: true, a: 1 });
[["Gosu", "InsuranceSuite code, entities, PCF pages, display keys, tests"], ["Integrations", "Integration Gateway routes, mappings and Java classes"],
 ["Jutro", "Digital experiences with the right design-system components"], ["Functions", "Serverless extensions"]].forEach(([n, d], i) => {
  box(s, { x: 0.6 + (i % 2) * 2.85, y: 2.25 + Math.floor(i / 2) * 1.75, w: 2.65, h: 1.55, align: "left", valign: "top", margin: 0.15, fill: C.background2, a: 1,
    text: [{ text: n, options: { bold: true, fontSize: 16, breakLine: true } }, { text: d, options: { fontSize: 13 } }] });
});
label(s, "Two kinds of knowledge", 6.6, 1.75, 6.1, 0.4, { size: 16, bold: true, a: 2 });
box(s, { x: 6.6, y: 2.25, w: 6.1, h: 1.55, align: "left", valign: "top", margin: 0.15, fill: C.accent1, a: 2,
  text: [{ text: "Cookbooks", options: { bold: true, fontSize: 16, breakLine: true } },
    { text: "Proven recipes for implementing Guidewire components step by step, matched to your release. The agent gets the right pattern in one call instead of by trial and error.", options: { fontSize: 13 } }] });
box(s, { x: 6.6, y: 4.0, w: 6.1, h: 1.55, align: "left", valign: "top", margin: 0.15, fill: C.text1, color: C.background1, a: 3,
  text: [{ text: "Knowledge base as embeddings", options: { bold: true, fontSize: 16, breakLine: true } },
    { text: "Guidewire docs, best practices and patterns stored as curated embeddings. The agent searches by meaning (RAG) and gets the closest passages back.", options: { fontSize: 13 } }] });
[["41%", "faster on Gosu tasks in Guidewire’s own tests, using cookbook patterns"], ["Read-only", "it returns knowledge; your harness makes every edit"], ["Your AI", "runs on your own AI credentials, in your harness"]].forEach(([big, small], i) => {
  const x = 0.6 + i * 4.1;
  label(s, big, x, 5.8, 1.6, 0.9, { size: big.length > 4 ? 20 : 32, bold: true, a: 4 });
  label(s, small, x + 1.65, 5.8, 2.3, 0.9, { size: 12, color: C.accent2, a: 4 });
});
s.addNotes("Click 1: Guidewire offers Developer Assistants by area: Gosu, Integrations and Jutro, plus one for Functions. Each one is grounded in Guidewire's own material, not public web data. Click 2: cookbooks are step-by-step recipes for implementing Guidewire components the right way for your release. Click 3: the knowledge base is Guidewire documentation, best practices and patterns stored as curated embeddings and searched by meaning. That is RAG, exactly as in the loop slide. Click 4: the 41 per cent figure is Guidewire's own benchmark, so treat it as a vendor claim and measure it on our own tasks. The interface is read-only and uses your own AI credentials.");

// ===================== 9: Architecture =====================
s = content("How the harness connects to the Developer Assistant", "A local MCP server on the developer’s workstation, backed by the Developer Assistant service on Guidewire Cloud Platform.", "Guidewire Developer Assistant");
panel(s, 0.6, 1.75, 6.3, 4.65, { line: C.accent6 });
label(s, "Developer workstation", 0.85, 1.85, 4, 0.35, { size: 14, bold: true });
box(s, { x: 0.85, y: 2.3, w: 2.6, h: 0.9, text: "Model API\nyour AI credentials", fill: C.background1, line: C.accent3, dash: "dash", size: 12, a: 1 });
box(s, { x: 4.05, y: 2.3, w: 2.6, h: 0.9, text: "Developer + IDE\none prompt with the intent", fill: C.background1, line: C.accent6, size: 12, a: 1 });
box(s, { x: 0.85, y: 3.65, w: 2.6, h: 1.1, text: "Agent harness\ne.g. Claude Code", fill: C.accent1, bold: true, size: 14, a: 1 });
box(s, { x: 0.85, y: 5.2, w: 2.6, h: 0.95, text: "Your project\nInsuranceSuite config", fill: C.background1, line: C.accent6, size: 12, a: 1 });
arrow(s, 2.15, 3.65, 2.15, 3.2, { a: 1 });
label(s, "Messages API", 2.25, 3.25, 1.5, 0.35, { size: 10, color: C.accent3, a: 1 });
arrow(s, 4.6, 3.2, 3.2, 3.65, { a: 1 });
arrow(s, 2.15, 4.75, 2.15, 5.2, { a: 1 });
label(s, "edits locally", 2.25, 4.8, 1.3, 0.35, { size: 10, color: C.accent2, a: 1 });
box(s, { x: 4.05, y: 3.65, w: 2.6, h: 1.1, text: "Guidewire MCP server\n(local)", fill: C.text1, color: C.background1, bold: true, size: 14, a: 2 });
box(s, { x: 4.05, y: 5.2, w: 2.6, h: 0.95, text: "IntelliJ / Studio plugin\n(optional)", fill: C.background1, line: C.accent6, size: 12, a: 2 });
arrow(s, 3.45, 4.2, 4.05, 4.2, { a: 2 });
arrow(s, 5.35, 4.75, 5.35, 5.2, { a: 2 });
panel(s, 8.3, 1.75, 4.4, 4.65, { a: 3, fill: C.background1, line: C.text1, lineW: 1.25 });
label(s, "Guidewire Cloud Platform", 8.55, 1.85, 4, 0.35, { size: 14, bold: true, a: 3 });
box(s, { x: 8.55, y: 2.3, w: 3.9, h: 0.9, text: "Developer Assistant service\nversion-aware", fill: C.text1, color: C.background1, bold: true, size: 13, a: 3 });
arrow(s, 6.65, 4.2, 8.3, 2.75, { width: 2, a: 3 });
label(s, "HTTPS · authenticated · read-only", 6.8, 4.3, 1.45, 0.6, { size: 10, color: C.accent2, a: 3 });
box(s, { x: 8.55, y: 3.5, w: 3.9, h: 0.8, text: "Cookbooks: recipes for Guidewire components", fill: C.accent1, size: 12, bold: true, a: 4 });
box(s, { x: 8.55, y: 4.45, w: 3.9, h: 0.8, text: "Knowledge base: curated embeddings", fill: C.background2, line: C.accent3, size: 12, bold: true, a: 4 });
box(s, { x: 8.55, y: 5.4, w: 3.9, h: 0.8, text: "Docs, best practices, patterns", fill: C.background2, line: C.accent6, size: 12, a: 4 });
box(s, { x: 0.6, y: 6.5, w: 12.1, h: 0.45, align: "left", size: 13, fill: C.accent1, margin: 0.15, a: 5,
  text: "You keep the harness, the model and the guard rails. Guidewire maintains the knowledge." });
s.addNotes("Click 1: on the workstation is everything you already own: the developer, the agent harness, model access through your own AI credentials, and your project, which the harness edits locally. Click 2: Guidewire adds a local MCP server, configured in the harness like any other MCP server, plus an optional IntelliJ or Guidewire Studio plugin. Click 3: the local server talks to the Developer Assistant service on Guidewire Cloud Platform. Click 4: behind it are the cookbooks, the knowledge base of curated embeddings, and documentation and best practice. Click 5: the interface is read-only. It returns knowledge, and the harness makes every edit to your code.");

// ===================== 10: GW sequence =====================
s = content("A Gosu change with the Developer Assistant", "“Add a policy number field to claim search.”  Dark: MCP · Blue: Messages API · Grey: local · Dashed: response", "Guidewire Developer Assistant");
const lanesB = [
  { id: "D", name: "Developer", x: 2.45, w: 1.4, fill: C.background2 },
  { id: "H", name: "Agent harness", x: 4.55, w: 1.8, fill: C.accent1 },
  { id: "G", name: "GW MCP (local)", x: 6.8, w: 1.8, fill: C.text1, color: C.background1 },
  { id: "W", name: "GW DA service", x: 9.05, w: 1.8, fill: C.accent2, color: C.background1 },
  { id: "M", name: "Model", x: 11.6, w: 1.5, fill: C.accent3, color: C.background1 },
];
const msgsB = [
  { from: "H", to: "G", text: "initialize · tools/list" },
  { from: "G", to: "W", text: "authenticate" },
  { from: "G", to: "H", text: "tools: cookbook + KB search", ret: true },
  { from: "D", to: "H", text: "“Add policy no. field”", kind: "local" },
  { from: "H", to: "M", text: "goal + tool list", kind: "api" },
  { from: "M", to: "H", text: "tool_use: read, grep project files", kind: "api", ret: true },
  { from: "H", to: "M", text: "tool_result: matching files", kind: "api" },
  { from: "M", to: "H", text: "tool_use: search_cookbooks", kind: "api", ret: true },
  { from: "H", to: "G", text: "tools/call" },
  { from: "G", to: "W", text: "cookbook lookup" },
  { from: "W", to: "G", text: "recipe for your release", ret: true },
  { from: "G", to: "H", text: "recipe: entity, PCF, keys", ret: true },
  { from: "H", to: "M", text: "tool_result: recipe", kind: "api" },
  { from: "M", to: "H", text: "tool_use: search_knowledge", kind: "api", ret: true },
  { from: "H", to: "G", text: "tools/call" },
  { from: "G", to: "W", text: "vector search (embeddings)" },
  { from: "W", to: "G", text: "top-k passages", ret: true },
  { from: "G", to: "H", text: "passages", ret: true },
  { from: "H", to: "M", text: "tool_result: passages", kind: "api" },
  { from: "M", to: "H", text: "Runs 4–6: edit, build, test, then end_turn", kind: "api", ret: true },
  { from: "H", to: "D", text: "change set for review", kind: "local", ret: true },
];
const yB = (i) => 2.45 + i * 0.2 + (i >= 3 ? 0.1 : 0) + (i >= 4 ? 0.1 : 0) + (i >= 20 ? 0.1 : 0);
sequence(s, lanesB, msgsB, {
  top: 1.65, bottom: 6.92, y: yB, labelH: 0.18, size: 10, tagW: 1.0,
  frames: [{ from: 4, to: 19, x1: 3.95, x2: 12.7, text: "loop · repeats until end_turn", a: 5 }],
  tags: [{ at: 0, text: "Connect", fill: C.accent1, a: 1 }, { at: 4, text: "Run 1", a: 5 }, { at: 6, text: "Run 2", a: 7 },
    { at: 12, text: "Run 3", a: 13 }, { at: 18, text: "Runs 4–6", a: 19 }],
});
label(s, "Tool names are illustrative", 9.7, 6.72, 3.0, 0.25, { size: 10, italic: true, color: C.accent2, align: "right" });
s.addNotes("Each click adds one message. Connect: the harness starts the local Guidewire MCP server and lists its tools; the local server authenticates to the Developer Assistant service. The developer gives one intent. Run 1: the model asks to read and search the project with built-in tools. Run 2: the model asks for the cookbook recipe. The call goes harness to local MCP server to the cloud service, and the recipe for your release comes back. Run 3: the model searches the knowledge base: a vector search over curated embeddings returns the closest passages. Runs 4 to 6: the model edits the entity, PCF and display keys locally, builds and runs the tests, with permission prompts, then replies with end_turn. The developer reviews one coherent change set. Tool names are illustrative; use the names your harness lists after it connects.");

// ===================== 11: Takeaways =====================
s = content("What to remember", null, "Guidewire Developer Assistant");
[["Harness, not chat", "The harness runs the loop many times: model call, tool or RAG lookup, result, repeat, until end_turn."],
 ["MCP is the plug", "Initialize, list tools, then call them. The harness sits in the middle and applies your permissions."],
 ["Guidewire brings the know-how", "The Developer Assistant supplies cookbooks and an embeddings knowledge base over MCP. You keep your tools and governance."]].forEach(([h, d], i) => {
  const x = 0.6 + i * 4.1, a = i + 1;
  numDot(s, i + 1, x, 1.5, { a });
  label(s, h, x, 2.05, 3.8, 0.5, { size: 18, bold: true, valign: "top", a });
  label(s, d, x, 2.6, 3.8, 1.6, { size: 15, valign: "top", a });
});
box(s, { x: 0.6, y: 4.9, w: 12.1, h: 1.75, align: "left", valign: "top", margin: 0.18, fill: C.background2, size: 12,
  text: [
    { text: "Sources", options: { bold: true, fontSize: 13, breakLine: true } },
    { text: "Guidewire blog: Accelerating P&C delivery with Developer Assistants from Guidewire", options: { bullet: true, breakLine: true, hyperlink: { url: "https://www.guidewire.com/resources/blog/developers/accelerating-p-c-delivery-with-developer-assistants-from-guidewire" } } },
    { text: "Guidewire Cloud Platform, What’s new in Qusar (release highlights)", options: { bullet: true, breakLine: true, hyperlink: { url: "https://docs.guidewire.com/cloud/qusar/whatsnew/topics/gwcp-release_highlights.html" } } },
    { text: "Guidewire: Insurance AI from Guidewire", options: { bullet: true, breakLine: true, hyperlink: { url: "https://www.guidewire.com/products/technology/insurance-ai-from-guidewire" } } },
    { text: "Model Context Protocol specification: modelcontextprotocol.io", options: { bullet: true, hyperlink: { url: "https://modelcontextprotocol.io" } } },
  ] });
s.addNotes("Three things to take away. The harness runs the loop many times for one task. MCP is the standard plug: connect, list tools, call them, with the harness in the middle. And the Guidewire Developer Assistant is Guidewire's knowledge on that plug: cookbooks and an embeddings knowledge base. Detailed setup steps and exact tool names are in Guidewire's Developer Assistant documentation, which needs a Guidewire login. A good next step is to connect it in a sandbox project and try one real backlog task.");

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("Wrote " + OUT);
})();
