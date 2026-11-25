// Docker build step: reads release.conf and turns a course version folder (v7, v8, ...) into a participant site.
// Usage: node prepare.mjs <repo-dir> <out-dir>   → <out>/site (files to serve) and <out>/release.txt (summary)
import fs from "fs";
import path from "path";
import vm from "vm";

const [repo, out] = process.argv.slice(2);
const dockerDir = path.join(repo, "docker");
const site = path.join(out, "site");
const fail = (m) => { console.error("\nrelease.conf: " + m + "\n"); process.exit(1); };
const skip = (p) => /(^|\/)(\.DS_Store|CLAUDE\.md|README\.md|\..*)$/.test(p);

// ---- release.conf ----
const conf = {};
const confPath = path.join(repo, "release.conf");
if (fs.existsSync(confPath)) {
  for (const line of fs.readFileSync(confPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) conf[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const isCourse = (d) => ["index.html", "assets/course.js", "assets/deck.js"].every((f) => fs.existsSync(path.join(repo, d, f)));
let V = conf.VERSION || "newest";
if (/^(newest|latest)$/i.test(V)) {
  V = fs.readdirSync(repo).filter((d) => /^v\d+$/.test(d) && isCourse(d)).sort((a, b) => a.slice(1) - b.slice(1)).pop();
  if (!V) fail("no course folder (v4 or later) found");
} else if (!isCourse(V)) fail(`VERSION=${V}: folder not found or not a course (needs index.html, assets/course.js, assets/deck.js)`);
const src = path.join(repo, V);

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(src, site, { recursive: true, filter: (p) => !skip(path.relative(src, p)) });

// ---- course map ----
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(site, "assets/course.js"), "utf8"), ctx);
const C = ctx.window.COURSE;
const days = (C?.tracks?.a || Object.values(C?.tracks || {})[0])?.days;
if (!days?.length) fail(`${V}/assets/course.js has no sessions`);
const allIds = days.flatMap((d) => d.items.map(([id]) => id));
const byN = Object.fromEntries(allIds.map((id) => [C.topics[id].n, id]));
const nums = (s, what) => s.split(/[\s,;]+/).filter(Boolean).flatMap((t) => {
  const m = t.match(/^(\d+)(?:-(\d+))?$/);
  if (!m) fail(`${what}: “${t}” is not a number or range`);
  const a = +m[1], b = m[2] ? +m[2] : a;
  return Array.from({ length: Math.abs(b - a) + 1 }, (_, i) => Math.min(a, b) + i);
});

// ---- what is open ----
const T = (conf.TOPICS || "").trim(), S = (conf.SESSIONS || "all").trim();
let open;
if (T) {
  open = new Set(nums(T, "TOPICS").map((n) => byN[n] || fail(`TOPICS: Topic ${n} is not in ${V} (topics are ${Object.keys(byN).sort((a, b) => a - b).join(", ")})`)));
} else if (/^all$/i.test(S)) {
  open = new Set(allIds);
} else {
  const ss = nums(S, "SESSIONS");
  ss.forEach((s) => (s < 1 || s > days.length) && fail(`SESSIONS: Session ${s} does not exist (${V} has ${days.length})`));
  open = new Set(ss.flatMap((s) => days[s - 1].items.map(([id]) => id)));
}
const closed = allIds.filter((id) => !open.has(id));
closed.forEach((id) => fs.rmSync(path.join(site, "topics", C.topics[id].file)));
const openDays = days.map((d, i) => (d.items.some(([id]) => open.has(id)) ? i + 1 : 0)).filter(Boolean);

const m365 = +(conf.M365_SESSION ?? 2) || 0;
const hasM365 = m365 > 0 && m365 <= days.length && fs.existsSync(path.join(repo, "M365/index.html"));
const m365Open = hasM365 && openDays.includes(m365);

// banner text, e.g. "Session 1" or "Session 1 (Topics 1–5)"
const ranges = (ns) => ns.sort((a, b) => a - b).reduce((r, n) => { const l = r[r.length - 1]; if (l && n === l[1] + 1) l[1] = n; else r.push([n, n]); return r; }, [])
  .map(([a, b]) => (a === b ? `${a}` : `${a}–${b}`)).join(", ");
const join = (a) => (a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]);
const openNames = openDays.map((i) => {
  const d = days[i - 1], ids = d.items.map(([id]) => id), on = ids.filter((id) => open.has(id));
  return on.length === ids.length ? d.d : `${d.d} (Topic${on.length > 1 ? "s" : ""} ${ranges(on.map((id) => C.topics[id].n))})`;
});
const shut = days.filter((_, i) => !openDays.includes(i + 1)).map((d) => d.d);
const banner = closed.length
  ? `<b>Now open:</b> ${join(openNames)}.${shut.length ? ` <span class="muted">${join(shut)} ${shut.length > 1 ? "are" : "is"} coming soon.</span>` : ` <span class="muted">More topics are coming soon.</span>`}`
  : "<b>All sessions are open.</b>";

// ---- release assets ----
for (const f of ["release.js", "release-nav.js", "release.css"]) fs.copyFileSync(path.join(dockerDir, f), path.join(site, "assets", f));
fs.copyFileSync(path.join(dockerDir, "404.html"), path.join(site, "404.html"));
const R = { total: days.length, openDays, closed: closed.map((id) => C.topics[id].file), closedIds: closed, m365: hasM365 ? m365 : 0, m365Open, banner };
fs.writeFileSync(path.join(site, "assets/release-sessions.js"), `window.RELEASE = ${JSON.stringify(R)};\n`);

// ---- every page: strip presenter notes, add the release scripts ----
const stamp = Date.now().toString(36);
let notes = 0;
const pages = ["index.html", ...fs.readdirSync(path.join(site, "topics")).filter((f) => f.endsWith(".html")).map((f) => "topics/" + f)];
for (const rel of pages) {
  const p = path.join(site, rel);
  let s = fs.readFileSync(p, "utf8");
  const pre = rel.startsWith("topics/") ? "../" : "";
  notes += (s.match(/<aside class="notes"/g) || []).length;
  s = s.replace(/[ \t]*<aside class="notes">[\s\S]*?<\/aside>\n?/g, "");
  if (/<aside class="notes"/.test(s) || /class="say"/.test(s)) fail(`${rel}: speaker notes left after stripping`);
  const courseTag = /<script src="(?:\.\.\/)?assets\/course\.js[^"]*"><\/script>/;
  if (!courseTag.test(s)) fail(`${rel}: no course.js script tag`);
  s = s.replace(courseTag, (m) => `${m}\n<script src="${pre}assets/release-sessions.js?r=${stamp}"></script>\n<script src="${pre}assets/release.js?r=${stamp}"></script>`);
  s = s.replace("</head>", `<link rel="stylesheet" href="${pre}assets/release.css?r=${stamp}">\n</head>`);
  if (rel.startsWith("topics/")) {
    const deckTag = /<script src="\.\.\/assets\/deck\.js[^"]*"><\/script>/;
    if (!deckTag.test(s)) fail(`${rel}: no deck.js script tag`);
    s = s.replace(deckTag, (m) => `<script src="../assets/release-nav.js?r=${stamp}"></script>\n${m}`);
  }
  if (rel === "index.html") {
    s = s.replace(/\s*<div class="card"><kbd>[ND]<\/kbd>.*?<\/div>/g, "");
    s = s.replace("<h2>Presenting</h2>", "<h2>Using the slides</h2>");
  }
  fs.writeFileSync(p, s);
}

// ---- Microsoft 365 quick wins ----
if (m365Open) {
  const m = path.join(repo, "M365");
  fs.cpSync(m, path.join(site, "M365"), { recursive: true, filter: (p) => !skip(path.relative(m, p)) });
  const p = path.join(site, "M365/index.html");
  let s = fs.readFileSync(p, "utf8");
  s = s.replace('<span class="tag plain">⏱ ${w.min} min</span>', "");
  s = s.replace('<div style="display:flex;gap:8px">', '<div style="display:flex;gap:8px"><a class="btn" href="../index.html" style="text-decoration:none">⌂ Course home</a>');
  fs.writeFileSync(p, s);
}

const summary = [
  `Course: ${V}`,
  `Open: ${openNames.join(", ") || "nothing"}`,
  `Topics in the image: ${allIds.filter((id) => open.has(id)).map((id) => C.topics[id].n).sort((a, b) => a - b).join(", ")}`,
  `M365 quick wins: ${m365Open ? "included" : hasM365 ? `coming soon (Session ${m365})` : "left out"}`,
  `Speaker notes removed: ${notes}`,
].join("\n");
fs.writeFileSync(path.join(out, "release.txt"), summary + "\n");
console.log("\n" + summary + "\n");
