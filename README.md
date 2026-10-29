# Drawing Games 🎮

Formerly **모여!**. Drawing Games is a planned multi-game party platform, not a single game.

## Local development

Requires Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000 (or port 3000's forwarded preview in GitHub Codespaces).

## Project PLAYGROUND

The first redesign pass adds a richer, responsive homepage and navigation inspired by Drawing Verse's glass surfaces, but with its own arcade identity. It uses the existing official DG logo and CSS-built lobby illustration.

Routes:
- `/`: redesigned home with featured *planned* game concepts, room/play previews, and a roadmap.
- `/games`: expandable game catalog sourced from `lib/catalog.js`.
- `/room`: waiting-room UI **preview**.
- `/play`: play-stage UI **preview**.

**Important:** These routes are visual prototypes, not a working gaming platform. There are currently no playable games, live rooms, real-time multiplayer, voice channels or game chat. The account interface exists separately; do not mistake it for game session support. Game concepts in the catalog have not been shipped. The old wireframes remain in `wireframes/`.

The redesign's scoped styles are in `app/playground.css`, added after the existing global styles so the room and play previews continue using their earlier structures.

## 🌳 바둑공원 (Baduk Park)

Original project: **바둑공원 with 서동 바둑학원** (2023).
Historical Replit address: `paduk-park.coolhanhee.repl.co` (may no longer work).

Only two historical code excerpts are preserved in `games/baduk-park/legacy/`:
- `2023-sidebar-snippet.js`: sidebar hover code quoted in an April 2023 conversation.
- `2023-jinja-board-snippet.html`: Jinja2 example from a later assistant proposal, not an original April 28 file.

These snippets are **not a runnable game**; the complete original HTML, CSS, image assets and server code have not been recovered. Do not overwrite the historical snippets when rebuilding.

## Branding

The official Drawing Games logo is `public/branding/drawing-games-logo.svg`.
