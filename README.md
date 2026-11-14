# Algo Buster

A small installable PWA for discovering popular recent YouTube videos beyond a personalized home feed. Real thumbnails, views and publication dates. Videos open directly on YouTube.

## What it does

- Picks 12 videos across nine topics, balancing channels and popularity/recency.
- Bust my algorithm / Shuffle another mix draws a different batch.
- Category buttons narrow the mix.
- Keeps track of opened videos locally and avoids them when alternatives exist.
- Install button, ordinary and maskable icons, offline shell and last feed.
- Uses public channel RSS feeds. No API key, YouTube sign-in or AI calls.

The selection comes from the curated channels in channels.json. It is not a site-wide YouTube trending ranking. View counts are snapshots. Shorts URLs are excluded. The pool contains uploads from the last 90 days, limited to each channel's current public RSS entries.

## Refresh behaviour

The hosted Worker caches a shared source pool for five minutes. The app checks every five minutes while visible, and when reopened after five minutes. A stale server pool is refreshed before a successful response. Failed sources retain the last good pool when too few respond. Fresh uploads join as YouTube exposes them in its public feeds. Feed refreshes keep your current cards in place; use shuffle to draw from the refreshed pool. Shuffle also tracks displayed videos for the current session, reducing repeats until the available pool runs out.

New videos depend on creators uploading and YouTube publishing them. The app cannot guarantee a newly published video every five minutes.

## GitHub Pages

Upload the ZIP contents to the root of a repository with a main branch. This ZIP includes a root index.html for ordinary branch-based GitHub Pages, plus web/ and a scheduled Actions workflow for automatic feed updates.

For automatic fresh feeds: in repository Settings > Pages, choose GitHub Actions as the source. Enable Actions, then run Refresh and publish Algo Buster once from the Actions tab. The workflow refreshes the public feeds and deploys web/ on pushes and a five-minute schedule. GitHub schedules are best effort, may run late, and do not guarantee five-minute delivery. Public-repository scheduled workflows may be disabled after extended repository inactivity; re-enable or run manually as needed. No secrets are required.

If you instead use Deploy from a branch, the root app works with the bundled feed snapshot. That mode does not update itself. For a manual refresh run python3 scripts/refresh-feed.py, copy web/feed.json to feed.json, and commit the result.

## Worker hosting / source

worker/index.js is a bundled Cloudflare-compatible Worker that serves every app asset plus a live /feed.json endpoint. No external dependencies, environment variables, D1 or R2 are needed. The bundled Worker has live server-side refresh; the GitHub Pages app uses the Actions-deployed JSON feed.

Edit files in web/, channels.json and worker/feed.js / worker/runtime.txt. Then run:

    node scripts/bundle.mjs
    bash scripts/build.sh
    node scripts/validate-artifact.mjs

For a local Worker preview: node scripts/dev.mjs --port 4173. Open http://localhost:4173. For static-only preview, python3 -m http.server 8080 in the extracted root.

## Privacy and offline use

No watch-history access. Opened video IDs and the last feed stay in this browser on this device. Opening videos or thumbnails connects to YouTube. YouTube viewing can influence that account's recommendations; Algo Buster does not reset or modify your account.

Open once online to cache the app. The last feed and previously cached thumbnails are available offline. Playback requires internet and opens on YouTube. Private hosted previews require your ChatGPT login. Clear browser storage to clear local opened history.

## Checks

Verified real RSS parsing/view counts, a nine-topic mix, duplicate prevention, category filtering, shuffle exclusions, Worker page/feed responses, actual thumbnails, outbound video URLs, desktop and phone layout. Physical-device installation and airplane-mode launch have not been verified.
