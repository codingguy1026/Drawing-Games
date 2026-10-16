# Drawing Games 🎮

Formerly **모여!**. Drawing Games is a multi-game party platform, not a single game.

## Start the Next.js project

Requirements: Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). In GitHub Codespaces, open the forwarded port 3000 instead.

The Next.js **App Router** pages are:

- `/`: homepage, game teasers, room preview and future room-creation controls.
- `/games`: expandable game catalog, sourced from `lib/catalog.js`.
- `/room`: waiting room UI preview.
- `/play`: play-area UI preview.

Shared components live under `components/`. Styles live in `app/globals.css`, using the Pretendard and dark indigo CSS concept provided for this project.

**UI only:** No login, functioning rooms, multiplayer, audio, chat or games have been implemented. All unfinished actions are disabled, and preview links are explicitly labeled. The old HTML/CSS-only layout was moved into `wireframes/` for reference.

## 🌳 바둑공원 (Baduk Park)

Original project: **바둑공원 with 서동 바둑학원** (2023).
Historical Replit address: `paduk-park.coolhanhee.repl.co` (may no longer work).

### Preservation status

Only two exact **code excerpts quoted in earlier ChatGPT messages** have been recovered so far. They are kept unmodified in `games/baduk-park/legacy/`.

- `2023-sidebar-snippet.js`: sidebar hover JavaScript quoted from an April 2023 conversation. **Excerpt only; provenance of the full original file is unverified.**
- `2023-jinja-board-snippet.html`: 19×19 Jinja2 template excerpt from a **later assistant-proposed example**, **not** part of the user's original April 28 HTML.

The user's original April 28 HTML had a `바둑판(개발중)` menu link, navigation dropdown behavior, and a `getNews()` function that loaded `news.json`. However, its complete verbatim HTML source is **not yet available** for upload. Missing HTML, CSS, images and server code have **not** been fabricated.

**These snippets are not a runnable website.** The historical files will be restored separately if their full source becomes available. Rebuilding or modernizing the game can then happen in `games/baduk-park/` without overwriting the archive.

## Branding

The official DG gaming logo is stored at `public/branding/drawing-games-logo.svg` (transparent, resolution-independent SVG recreation). `SiteHeader` and the home hero both use it; the old placeholder logo and decorative orbit rings are no longer shown.
