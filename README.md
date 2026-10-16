# Drawing Games 🎮

Formerly **모여!**. This repository will host the Drawing Games platform.

## Layout prototype (unstyled)

Open `index.html` in a browser. The three static layouts link to each other:

- `index.html`: game list, public rooms, room creation slot, profile slot.
- `room.html`: waiting room, participant list, voice/chat slots, ready/start controls.
- `play.html`: game area, game status, participants, voice/chat slots.
- `layout.css`: layout-only CSS for placement and responsive columns. No theme, typography, colors, backgrounds, borders or effects.

These are non-functional wireframes. Disabled controls are intentional. No server, real rooms, chat, voice, matchmaking or game engine is included. The preserved Baduk Park legacy snippets remain untouched.

## 🌳 바둑공원 (Baduk Park)

Original project: **바둑공원 with 서동 바둑학원** (2023).
Historical Replit address: `paduk-park.coolhanhee.repl.co` (may no longer work).

### Preservation status

Only two exact **code excerpts quoted in earlier ChatGPT messages** have been recovered so far. They are kept unmodified in `games/baduk-park/legacy/`.

- `2023-sidebar-snippet.js`: sidebar hover JavaScript quoted from an April 2023 conversation. **Excerpt only; provenance of the full original file is unverified.**
- `2023-jinja-board-snippet.html`: 19×19 Jinja2 template excerpt from a **later assistant-proposed example**, **not** part of the user's original April 28 HTML.

The user's original April 28 HTML had a `바둑판(개발중)` menu link, navigation dropdown behavior, and a `getNews()` function that loaded `news.json`. However, its complete verbatim HTML source is **not yet available** for upload. Missing HTML, CSS, images and server code have **not** been fabricated.

**These snippets are not a runnable website.** The historical files will be restored separately if their full source becomes available. Rebuilding or modernizing the game can then happen in `games/baduk-park/` without overwriting the archive.
