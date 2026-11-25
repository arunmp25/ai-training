# AI Training: Docker image for participants

**To change what participants see, edit `release.conf` at the repo root, commit and push.** The pipeline only needs to run:

```bash
docker build -t ai-training .
docker run -d -p 8080:80 ai-training      # → http://localhost:8080
```

All the logic runs inside the Docker build (`Dockerfile` → `docker/prepare.mjs`), so the pipeline needs no options or variables.

## release.conf
```ini
VERSION=newest      # newest = highest vN folder (v8 is picked up automatically), or e.g. v7
SESSIONS=1          # all, 1, or 1,2
TOPICS=             # optional: topic numbers instead of sessions, e.g. 1-5 or 1-7,9 (SESSIONS is then ignored)
M365_SESSION=2      # session that includes the M365 quick wins (0 = leave out)
```

| You want | Set |
|---|---|
| Session 1 only | `SESSIONS=1` |
| Sessions 1 and 2 | `SESSIONS=1,2` |
| Session 2 only | `SESSIONS=2` |
| Everything | `SESSIONS=all` |
| Only Topics 1–5 today | `TOPICS=1-5` |

A wrong value (for example `SESSIONS=5` or `TOPICS=30`) stops the build with a clear message, so a bad commit never ships. The build log, and `/release.txt` inside the image, say what is included:

```
Course: v7
Open: Session 1
Topics in the image: 1, 2, 3, 4, 5, 6, 7, 8
M365 quick wins: coming soon (Session 2)
Speaker notes removed: 106
```

## What participants get
- **No presenter material.** Speaker notes and timings are removed from every page; the N and D keys do nothing.
- **Only the listed topics are in the image.** Everything else shows **🔒 Coming soon** on the course page and the Topic 1 roadmap (titles visible, not clickable). Its files are not in the image, so guessing a URL gives “Not available yet”.
- **Prev/Next topic** stop at what is open; the last open topic's button goes back to the course home.
- **M365 quick wins** come with Session 2: a card on the course page and the sample files.
- The completion criteria popup, Behind the scenes and all interactive slides work as normal.

## Hosting notes
- The image is a plain nginx web server on port 80. Run it on a company server, Azure Container Apps or App Service (container).
- It has no sign-in of its own: put it behind company sign-in (for example Microsoft Entra ID on Azure).
- A SharePoint page can show it with the Embed web part once it has a company URL (the domain must be allowed in the site's HTML field security settings).

## Files
| File | What it does |
|---|---|
| `release.conf` (repo root) | What to include. |
| `Dockerfile` (repo root) | Node runs `prepare.mjs`, then nginx serves the result. |
| `.dockerignore` (repo root) | Leaves out git, zips, docs, the quiz and v1–v3. |
| `docker/prepare.mjs` | Reads `release.conf`, copies the version folder, removes closed topics, speaker notes and internal notes files, adds the release scripts, copies M365 if its session is open. |
| `docker/release.js`, `release.css` | In the browser: hide notes and timings, block N and D, lock closed topics, add the “Now open” banner and the M365 card. |
| `docker/release-nav.js` | Runs just before `deck.js` so Prev/Next topic skip closed topics. |
| `docker/nginx.conf`, `docker/404.html` | Server settings and the “Not available yet” page. |
