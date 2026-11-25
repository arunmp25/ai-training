/* Runs just before deck.js, after the page scripts: drop closed topics from the course order,
   so Prev topic / Next topic skip them (the last open topic's Next becomes "Back to course home"). */
(() => {
  const C = window.COURSE, R = window.RELEASE;
  if (!C || !R || !R.closedIds) return;
  const closed = new Set(R.closedIds);
  Object.values(C.tracks).forEach((t) => t.days.forEach((d) => { d.items = d.items.filter(([id]) => !closed.has(id)); }));
})();
