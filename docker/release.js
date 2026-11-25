/* Participant release (Docker image): no presenter notes or timings; topics that are not open show "Coming soon".
   window.RELEASE is written at build time from release.conf (assets/release-sessions.js). */
(() => {
  const C = window.COURSE, R = window.RELEASE || {}, root = document.documentElement;

  // ---- presenter features off ----
  root.classList.remove("show-time");
  try { localStorage.setItem("aitrain-showtime", "0"); localStorage.removeItem("aitrain-notes"); } catch (e) {}
  window.addEventListener("keydown", (e) => {
    if (/^[nNdD]$/.test(e.key) && !e.target.matches?.("input, textarea, select") && !e.target.isContentEditable) e.stopImmediatePropagation();
  }, true);

  // ---- what is closed ----
  const closed = new Set(R.closed || []);
  const openDays = new Set(R.openDays || []);
  const isLocked = (href) => {
    if (!href || /^(https?:|mailto:|#)/.test(href)) return false;
    const clean = href.split(/[?#]/)[0];
    return closed.has(clean.split("/").pop()) || (/(^|\/)M365\//.test(clean) && !R.m365Open);
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest?.("a[href]");
    if (a && isLocked(a.getAttribute("href"))) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);
  const mark = () => document.querySelectorAll("a[href]").forEach((a) => {
    if (isLocked(a.getAttribute("href"))) { a.classList.add("rel-locked"); a.title = "Coming soon"; a.setAttribute("aria-disabled", "true"); a.removeAttribute("href"); }
  });
  const soon = () => { const b = document.createElement("div"); b.className = "rel-soon"; b.textContent = "🔒 Coming soon"; return b; };

  // the roadmap is built from the full course order, before release-nav.js trims it
  const days = (C?.tracks?.a || Object.values(C?.tracks || {})[0])?.days || [];
  const order = days.map((d) => d.items.map(([id]) => id));

  document.addEventListener("DOMContentLoaded", () => {
    // course page
    const body = document.getElementById("optBody");
    if (body) {
      const dayEls = body.querySelectorAll(".day");
      if (R.m365 > 0 && dayEls[R.m365 - 1]) {
        const a = document.createElement("a");
        a.className = "topic rel-m365"; a.href = "M365/index.html"; a.style.setProperty("--c", "var(--brand)");
        a.innerHTML = '<div class="n">HANDS-ON · MICROSOFT 365</div><b>Copilot Chat quick wins</b><div class="meta">Twelve short exercises in Copilot Chat, with sample files to download and prompts to copy.</div>';
        dayEls[R.m365 - 1].appendChild(a);
      }
      dayEls.forEach((el, i) => {
        if (openDays.has(i + 1)) return;
        el.classList.add("rel-day-locked");
        el.querySelector(".tot")?.replaceWith(soon());
      });
      if (R.banner) {
        const b = document.createElement("div");
        b.className = "rel-banner"; b.innerHTML = R.banner;
        document.querySelector(".hero")?.after(b);
      }
    }
    // Topic 1 roadmap
    document.querySelectorAll("#road .day").forEach((el, i) => {
      if (!openDays.has(i + 1)) { el.classList.add("rel-day-locked"); el.querySelector(".theme")?.after(soon()); return; }
      el.querySelectorAll(".tcard").forEach((c, j) => { if (closed.has(C.topics[order[i]?.[j]]?.file)) { c.classList.add("rel-locked"); c.title = "Coming soon"; } });
    });
    mark();
  });
  document.addEventListener("slide:enter", mark);
})();
