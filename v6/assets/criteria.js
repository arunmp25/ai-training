/* ===== Course criteria popup (v6) =====
   Any element with [data-criteria] opens it. Closes with ✕, Esc, the button or a click outside.
   While it is open, arrow keys do not move the slides. */
(function () {
  const CRIT = [
    { ic: "🗓️", c: "var(--c-model)", big: "90%", t: "Attendance", d: "Attend at least <b>90%</b> of the training sessions." },
    { ic: "📝", c: "var(--c-trust)", big: "80%+", t: "Evaluation", d: "An MCQ evaluation at the end. Score <b>more than 80%</b> to complete the course." },
    { ic: "💬", c: "var(--c-action)", big: "Chat", t: "Questions", d: "Ask any questions in the <b>chat</b>. We will pick them up during the session." },
  ];
  const ov = document.createElement("div");
  ov.className = "crit-ov";
  ov.setAttribute("role", "dialog");
  ov.setAttribute("aria-modal", "true");
  ov.innerHTML = `<div class="crit-box">
    <button class="crit-x" aria-label="Close">✕</button>
    <div class="crit-eye">Before we start</div>
    <h2>Course completion criteria</h2>
    <div class="crit-grid">${CRIT.map((x, i) => `<div class="crit-card" style="--c:${x.c};--d:${0.12 + i * 0.14}s">
      <div class="crit-ic">${x.ic}</div><div class="crit-big">${x.big}</div><b>${x.t}</b><p>${x.d}</p></div>`).join("")}</div>
    <div class="crit-foot"><button class="btn primary crit-ok">Got it</button></div>
  </div>`;
  const css = document.createElement("style");
  css.textContent = `
  .crit-ov { position: fixed; inset: 0; z-index: 100; display: none; align-items: center; justify-content: center; padding: 24px;
    background: rgba(10, 10, 16, .72); }
  .crit-ov.open { display: flex; animation: critFade .25s ease; }
  .crit-box { position: relative; width: min(980px, 100%); background: var(--bg2); border: 1px solid var(--line); border-top: 6px solid var(--brand);
    border-radius: var(--radius); padding: 34px 38px 28px; box-shadow: 0 30px 80px rgba(0,0,0,.45); animation: critUp .35s ease; }
  .crit-box h2 { font-size: 36px; margin: 0 0 24px; }
  .crit-eye { text-transform: uppercase; letter-spacing: .14em; font-size: 13px; font-weight: 800; color: var(--accent); margin-bottom: 8px;
    display: flex; align-items: center; gap: 10px; }
  .crit-eye::before { content: ""; width: 26px; height: 6px; background: var(--brand); }
  .crit-x { position: absolute; top: 14px; right: 14px; width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--line);
    background: var(--card); color: var(--text); font-size: 18px; cursor: pointer; }
  .crit-x:hover { border-color: var(--accent); }
  .crit-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  .crit-card { background: var(--card); border: 1px solid var(--line); border-top: 5px solid var(--c); border-radius: var(--radius);
    padding: 22px 20px; opacity: 0; animation: critUp .45s ease var(--d) forwards; }
  .crit-ic { font-size: 34px; }
  .crit-big { font-size: 48px; font-weight: 800; color: var(--c); line-height: 1.1; margin: 6px 0 4px; }
  .crit-card > b { font-size: 20px; display: block; margin-bottom: 6px; }
  .crit-card p b { color: var(--c); }
  .crit-card p { margin: 0; font-size: 17px; line-height: 1.45; color: var(--text); }
  .crit-foot { display: flex; justify-content: flex-end; margin-top: 24px; }
  .crit-foot .btn { font-size: 16px; padding: 11px 26px; }
  @keyframes critFade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes critUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
  @media (max-width: 800px) { .crit-grid { grid-template-columns: 1fr; } }`;
  document.head.appendChild(css);
  const mount = () => document.body.appendChild(ov);
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  const open = () => { ov.classList.remove("open"); void ov.offsetWidth; ov.classList.add("open"); ov.querySelector(".crit-ok").focus(); };
  const close = () => ov.classList.remove("open");
  window.Criteria = { open, close };
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-criteria]")) { e.preventDefault(); open(); return; }
    if (!ov.classList.contains("open")) return;
    if (e.target === ov || e.target.closest(".crit-x, .crit-ok")) close();
  });
  // capture phase: runs before the deck's key handler
  window.addEventListener("keydown", (e) => {
    if (!ov.classList.contains("open")) return;
    if (e.key === "Escape" || e.key === "Enter") { e.preventDefault(); close(); }
    e.stopImmediatePropagation();
  }, true);
})();
