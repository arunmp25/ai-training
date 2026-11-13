/* ===== AI Training – shared deck engine =====
   <body class="deck" data-id="03">  (id from assets/course.js)
   Each slide: <section class="slide" data-title="..."> ... <aside class="notes">...</aside></section>
   Keys: ← → / PageUp PageDown (clicker), Home/End, N notes, D timings, F full screen, T theme.
   Fires document event "slide:enter" with {index, slide}.
   The track (Option A / B) comes from ?track= or the last one used, and decides prev/next topic.
*/
(function () {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("aitrain-theme");
  if (savedTheme) root.dataset.theme = savedTheme;
  // timings are hidden unless the presenter turns them on (D key or ⏱ button)
  let showTime = localStorage.getItem("aitrain-showtime") === "1";
  root.classList.toggle("show-time", showTime);

  const body = document.body;
  const slides = Array.from(document.querySelectorAll(".slide"));
  if (!slides.length) return;

  // ---- course / track navigation ----
  const C = window.COURSE;
  const id = body.dataset.id;
  let track = new URLSearchParams(location.search).get("track") || localStorage.getItem("aitrain-track") || "a";
  let home = "../index.html", prevTopic = null, nextTopic = null, label = "", mins = "";
  const topic = C && id ? C.topics[id] : null;
  if (C) {
    if (!C.tracks[track]) track = "a";
    const locate = (t) => {
      const flat = C.tracks[t].days.flatMap((d) => d.items.map(([tid, min]) => ({ tid, min, day: d.d })));
      const k = flat.findIndex((x) => x.tid === id);
      return k < 0 ? null : { flat, k };
    };
    let f = id ? locate(track) : null;
    if (id && !f) {
      const other = Object.keys(C.tracks).find((t) => locate(t));
      if (other) { track = other; f = locate(other); }
    }
    home = "../index.html#" + track;
    if (f) {
      localStorage.setItem("aitrain-track", track);
      const p = f.flat[f.k - 1], n = f.flat[f.k + 1], cur = f.flat[f.k];
      if (p) prevTopic = { href: C.topics[p.tid].file + "?track=" + track, title: C.topics[p.tid].title };
      if (n) nextTopic = { href: C.topics[n.tid].file + "?track=" + track, title: C.topics[n.tid].title };
      label = [C.tracks[track].short, cur.day].filter(Boolean).join(" · ");
      mins = `~${cur.min} min`;
    } else if (topic) {
      label = "Reference";
    }
  }
  const topicName = topic ? `Topic ${id} · ${topic.title}` : document.title;

  // ---- UI ----
  const progress = document.createElement("div");
  progress.className = "progress";
  body.appendChild(progress);

  const bar = document.createElement("nav");
  bar.className = "bar";
  bar.innerHTML = `
    <a class="btn ghost" href="${home}" title="Course home">⌂ Home</a>
    ${prevTopic ? `<a class="btn ghost" href="${prevTopic.href}" title="Previous topic: ${prevTopic.title}">⟨ Prev topic</a>` : ""}
    <span class="bar-title"></span>
    <button class="btn ghost" data-act="prev" title="Previous slide (←)">←</button>
    <span class="counter"></span>
    <button class="btn ghost" data-act="next" title="Next slide (→)">→</button>
    <button class="btn ghost" data-act="notes" title="Presenter notes (N)">📝</button>
    <button class="btn ghost" data-act="time" title="Show / hide timings (D)">⏱</button>
    <button class="btn ghost" data-act="theme" title="Light / dark (T)">◐</button>
    <button class="btn ghost" data-act="full" title="Full screen (F)">⛶</button>
    ${nextTopic ? `<a class="btn ghost" href="${nextTopic.href}" title="Next topic: ${nextTopic.title}">Next topic ⟩</a>` : ""}`;
  body.appendChild(bar);

  // "next topic" buttons placed on the last slide
  document.querySelectorAll("[data-nexttopic]").forEach((a) => {
    if (nextTopic) { a.href = nextTopic.href; a.textContent = `Next: ${nextTopic.title} →`; }
    else { a.href = home; a.textContent = "⌂ Back to course home"; }
  });

  const notesPanel = document.createElement("aside");
  notesPanel.className = "notes-panel";
  body.appendChild(notesPanel);

  bar.querySelector('[data-act="time"]').classList.toggle("on", showTime);
  const counter = bar.querySelector(".counter");
  const barTitle = bar.querySelector(".bar-title");
  let index = -1;

  function go(n) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    if (n === index) return;
    if (index >= 0) slides[index].classList.remove("active");
    index = n;
    const s = slides[index];
    s.classList.add("active");
    s.scrollTop = 0;
    progress.style.width = ((index + 1) / slides.length) * 100 + "%";
    counter.textContent = `${index + 1} / ${slides.length}`;
    setTitle();
    history.replaceState(null, "", location.search + "#" + (index + 1));
    renderNotes();
    document.dispatchEvent(new CustomEvent("slide:enter", { detail: { index, slide: s } }));
  }

  function setTitle() {
    barTitle.textContent = [label, showTime && mins, topicName, slides[index].dataset.title].filter(Boolean).join("  ·  ");
  }
  function toggleTime() {
    showTime = !showTime;
    localStorage.setItem("aitrain-showtime", showTime ? "1" : "0");
    root.classList.toggle("show-time", showTime);
    bar.querySelector('[data-act="time"]').classList.toggle("on", showTime);
    setTitle();
  }
  function renderNotes() {
    const n = slides[index].querySelector(".notes");
    notesPanel.innerHTML = `<h4>Presenter notes · slide ${index + 1}</h4>
      ${n ? n.innerHTML : '<p class="muted">No notes for this slide.</p>'}
      <div class="keys"><kbd>←</kbd> <kbd>→</kbd> navigate &nbsp; <kbd>N</kbd> notes &nbsp; <kbd>D</kbd> timings &nbsp; <kbd>F</kbd> full screen &nbsp; <kbd>T</kbd> theme</div>`;
  }
  function toggleTheme() {
    const t = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = t;
    localStorage.setItem("aitrain-theme", t);
    document.dispatchEvent(new CustomEvent("theme:change"));
  }
  function toggleFull() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  bar.addEventListener("click", (e) => {
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (act === "prev") go(index - 1);
    if (act === "next") go(index + 1);
    if (act === "notes") notesPanel.classList.toggle("open");
    if (act === "theme") toggleTheme();
    if (act === "time") toggleTime();
    if (act === "full") toggleFull();
  });

  document.addEventListener("keydown", (e) => {
    const t = e.target;
    if (t.matches?.("input, textarea, select") || t.isContentEditable) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case "ArrowRight": case "PageDown": e.preventDefault(); go(index + 1); break;
      case "ArrowLeft": case "PageUp": e.preventDefault(); go(index - 1); break;
      case "Home": go(0); break;
      case "End": go(slides.length - 1); break;
      case "n": case "N": notesPanel.classList.toggle("open"); break;
      case "t": case "T": toggleTheme(); break;
      case "d": case "D": toggleTime(); break;
      case "f": case "F": toggleFull(); break;
    }
  });

  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-goto]");
    if (g) go(parseInt(g.dataset.goto, 10) - 1);
  });

  window.Deck = { go, next: () => go(index + 1), prev: () => go(index - 1), get index() { return index; }, track };

  window.addEventListener("hashchange", () => { const h = parseInt(location.hash.slice(1), 10); if (!isNaN(h)) go(h - 1); });
  const start = parseInt(location.hash.slice(1), 10);
  const boot = () => go(isNaN(start) ? 0 : start - 1);
  if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
