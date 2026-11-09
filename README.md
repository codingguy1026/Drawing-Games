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

**Important:** Baduk Park supports local shared-device play with the rule scope below. Other games, live rooms, real-time multiplayer, voice channels and game chat remain previews or plans. The account interface exists separately; do not mistake it for game session support. The old wireframes remain in `wireframes/`.

The redesign's scoped styles are in `app/playground.css`, added after the existing global styles so the room and play previews continue using their earlier structures.

## 🌳 바둑공원 (Baduk Park)

Original project: **바둑공원 with 서동 바둑학원** (2023).
Historical Replit address: `paduk-park.coolhanhee.repl.co` (may no longer work).

Only two historical code excerpts are preserved in `games/baduk-park/legacy/`:
- `2023-sidebar-snippet.js`: sidebar hover code quoted in an April 2023 conversation.
- `2023-jinja-board-snippet.html`: Jinja2 example from a later assistant proposal, not an original April 28 file.

These snippets are **not a runnable game**; the complete original HTML, CSS, image assets and server code have not been recovered. Do not overwrite the historical snippets when rebuilding.

### Local rules implementation

Open `/games/baduk-park` (the existing Next.js route) or `/baduk-park/index.html`.
The browser-independent rules engine is `games/baduk-park/engine.js`; UI and styling
are separate modules. Canonical assets live in `games/baduk-park/`. The four runtime
files are mirrored to `public/baduk-park/`, without copying or changing `legacy/`.

```bash
npm run baduk:sync
npm test
npm run build
```

Tests and the prebuild check reject stale public copies. Engine tests use Node's
built-in runner and need no extra test dependency.

| Preset | White komi | Scoring | Default repetition policy |
| --- | --- | --- | --- |
| Korean | 6.5 | Territory + captures + agreed dead prisoners; seki eyes excluded | Simple ko; detected long cycles require both players' agreement for a repetition draw |
| Japanese | 6.5 | Territory + captures + agreed dead prisoners; seki eyes excluded | Simple ko; both players can agree to no result (not jigo) after a detected long cycle |
| Chinese | 7.5 | Living stones + surrounded empty points; prisoners do not add points | Positional superko (PSK), following the whole-board repetition prohibition principle |

All presets prohibit suicide after removing captured opponent groups. Orthogonal
groups have deduplicated liberties; simultaneous captures, snapback, immediate ko,
PSK and situational superko (SSK) are supported. PSK compares the whole board; SSK
also compares the next player. Initial and post-pass positions are retained; passes
are exempt from repetition rejection. The simple-ko cycle notification compares
the board alone and is a review prompt, not a proof of a formal cycle.
Changing repetition policy away from a preset is explicitly a custom variant.
Chinese tournament-specific exceptions to repetition adjudication are not modeled.

Two consecutive passes enter review, not automatic final adjudication. Players
mark whole dead groups, whole seki groups, and optionally neutral empty regions.
Dead stones are removed virtually and credited once to the opponent's prisoners.
Territory calculation floods empty regions and excludes mixed-color boundaries and
regions touching marked seki stones. Under area scoring, seki stones and exclusively
surrounded eyes still count. All surviving unmarked stones are assumed alive by
agreement, not by an automated life-and-death solver. Any review edit clears both
approvals; only two distinct approvals finalize the result. Komi is configurable
in half-point increments; a tied score is jigo. Chinese margins use full point
differences, twice the single-side zi margin. Shared neutral points are omitted
from both totals, which preserves the difference obtained by splitting them equally.

Play, pass, resignation, resumption and capture coordinates are recorded. JSON
export also includes configuration, final board, review marks, confirmations and
result; importing JSON/SGF and SGF export are not implemented. Undo is a local
practice convenience, requiring players' agreement in the UI. It restores all
state, including prisoners, ko, repetition history, review and results, and drops
the abandoned future. It can undo even final confirmation or resignation, which
is **not** a formal tournament right. Refreshing the page loses the session.

### Deliberate limits

- No automatic seki, bent-four, eternal-life, triple-ko, double-ko or other special
  life-and-death adjudication. Players must mark all relevant seki groups manually.
  Flood-fill territory is only a candidate on an unfinished or disputed board.
- No Japanese 1989 hypothetical confirmation, per-ko pass rights, Korean isolated
  local life-and-death confirmation, referee rulings, double losses or illegal-move
  forfeits. Illegal UI moves are rejected without losing a turn.
- Resumption is an **agreed practice continuation on the actual board**. Players
  explicitly choose the first player (Japan: opponent of requester; China death
  dispute: player claiming the stones are dead). Actual resumed stones and prisoners
  affect scoring, so it is not a substitute for formal territory-scoring dispute
  resolution. Existing superko history remains active.
- 9/13 boards reuse the 19-board preset komi as a configurable practice default,
  not a claim about official small-board tournaments. No handicap setup or automatic
  handicap komi, clocks, overtime, AI, online multiplayer or server persistence.

References checked for this implementation:
[Korean rules](https://baduk.or.kr/story/badukRule.asp),
[Korean competition regulations](https://baduk.or.kr/story/gameRule.asp),
[Japanese 1989 rules](https://www.nihonkiin.or.jp/match/kiyaku/zenbun.html),
[Chinese 2002 rules, Guo Juan translation](https://weiqi.org.sg/wp-content/uploads/2025/09/The-Chinese-Rules-of-Weiqi.pdf).
These references do not imply complete conformance with every competition rule.

## Branding

The official Drawing Games logo is `public/branding/drawing-games-logo.svg`.
