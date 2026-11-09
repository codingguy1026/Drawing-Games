import test from "node:test";
import assert from "node:assert/strict";
import { RULESETS, RuleError, createGame, neighbors, getGroup, play, pass, resign, undo, resume, markGroup, markNeutral, score, approveScore, approveRepetition, coordinate, exportRecord } from "./engine.js";

function fixture({ size = 9, ruleset = "korean", koRule, black = [], white = [], toPlay = "black", komi = 0 } = {}) {
  const state = createGame({ size, ruleset, koRule, komi });
  black.forEach((point) => { state.board[point] = "black"; });
  white.forEach((point) => { state.board[point] = "white"; });
  state.toPlay = toPlay;
  state.positions = [{ key: state.board.map((color) => color === "black" ? "B" : color === "white" ? "W" : ".").join(""), toPlay }];
  return state;
}

function errorCode(operation, code) {
  assert.throws(operation, (error) => error instanceof RuleError && error.code === code);
}

function koFixture(koRule = "simple", ruleset = "korean") {
  return fixture({ koRule, ruleset, black: [10, 18, 28], white: [19, 11, 21, 29] });
}

function tripleKo(koRule = "simple", ruleset = "korean") {
  const size = 19;
  const black = [];
  const white = [];
  for (const [column, reversed] of [[2, false], [8, true], [14, false]]) {
    const center = 2 * size + column;
    const own = reversed ? white : black;
    const opponent = reversed ? black : white;
    own.push(center - 1, center - size, center + size);
    opponent.push(center, center + 1 - size, center + 2, center + 1 + size);
  }
  return fixture({ size, koRule, ruleset, black, white });
}

for (const size of [9, 13, 19]) {
  test(`${size}: empty board, corners, turn, undo and coordinates`, () => {
    const state = createGame({ size });
    assert.equal(state.board.length, size * size);
    assert.equal(neighbors(size, 0).length, 2);
    assert.equal(neighbors(size, size - 1).includes(size), false);
    assert.equal(getGroup(play(state, 0).board, size, 0).liberties.length, 2);
    assert.equal(coordinate(size, 0), `A${size}`);
    assert.equal(coordinate(size, size * size - 1), `${size === 9 ? "J" : size === 13 ? "N" : "T"}1`);
    const played = play(state, size * size - 1);
    assert.equal(played.toPlay, "white");
    assert.deepEqual(undo(played), state);
  });
}

test("presets and validated settings", () => {
  for (const ruleset of Object.keys(RULESETS)) {
    const game = createGame({ ruleset });
    assert.equal(game.komi, ruleset === "chinese" ? 7.5 : 6.5);
    assert.equal(game.koRule, ruleset === "chinese" ? "positional" : "simple");
  }
  errorCode(() => createGame({ size: 5 }), "SIZE");
  errorCode(() => createGame({ ruleset: "__proto__" }), "RULESET");
  errorCode(() => createGame({ koRule: "none" }), "KO_RULE");
  for (const komi of [NaN, Infinity, 0.25, 101, -101]) errorCode(() => createGame({ komi }), "KOMI");
  assert.equal(createGame({ komi: -0.5 }).komi, -0.5);
});

test("orthogonal connection and unique shared liberties; diagonals do not connect", () => {
  const state = fixture({ black: [10, 11, 19, 30] });
  const group = getGroup(state.board, 9, 10);
  assert.deepEqual([...group.stones].sort((first, second) => first - second), [10, 11, 19]);
  assert.deepEqual([...group.liberties].sort((first, second) => first - second), [1, 2, 9, 12, 18, 20, 28]);
  assert.equal(getGroup(state.board, 9, 30).stones.length, 1);
  assert.deepEqual(getGroup(state.board, 9, 0), { stones: [], liberties: [] });
});

test("illegal move is atomic and does not consume a turn or history", () => {
  const state = play(createGame({ size: 9 }), 0);
  const saved = structuredClone(state);
  for (const point of [-1, 81, 1.5, NaN]) errorCode(() => play(state, point), "BOUNDS");
  errorCode(() => play(state, 0), "OCCUPIED");
  assert.deepEqual(state, saved);
});

test("capture a whole connected group, credit once and undo every change", () => {
  const state = fixture({ black: [1, 9, 18, 20, 28], white: [10, 19] });
  const saved = structuredClone(state);
  const next = play(state, 11);
  assert.equal(next.board[10], null);
  assert.equal(next.board[19], null);
  assert.equal(next.captures.black, 2);
  assert.deepEqual(next.moves.at(-1).captured.sort((first, second) => first - second), [10, 19]);
  assert.deepEqual(undo(next), state);
  assert.deepEqual(state, saved);
});

test("capture multiple distinct adjacent groups simultaneously", () => {
  const state = fixture({ black: [1, 3, 9, 13, 19, 21], white: [10, 12] });
  const next = play(state, 11);
  assert.equal(next.captures.black, 2);
  assert.equal(next.board[10], null);
  assert.equal(next.board[12], null);
});

test("one captured group touching a move twice is credited only once", () => {
  const state = fixture({ black: [1, 2, 9, 12, 18, 28], white: [10, 11, 19] });
  const next = play(state, 20);
  assert.equal(next.captures.black, 3);
  assert.equal(next.moves.at(-1).captured.length, 3);
});

for (const ruleset of Object.keys(RULESETS)) {
  test(`${ruleset}: single-stone and connected-group suicide prohibited`, () => {
    const state = fixture({ ruleset, white: [1, 9] });
    errorCode(() => play(state, 0), "SUICIDE");
    const connected = fixture({ ruleset, black: [0], white: [2, 9, 10] });
    errorCode(() => play(connected, 1), "SUICIDE");
  });
}

test("capture before suicide check permits a surrounded capturing move", () => {
  const state = fixture({ black: [2, 10, 18], white: [1, 9] });
  const next = play(state, 0);
  assert.equal(next.board[0], "black");
  assert.equal(next.captures.black, 2);
});

test("simple ko forbids immediate recapture, allows intervening threats", () => {
  const initial = koFixture();
  const captured = play(initial, 20);
  assert.equal(captured.koPoint, 19);
  errorCode(() => play(captured, 19), "KO");
  const threat = play(captured, 70);
  const answer = play(threat, 72);
  const recaptured = play(answer, 19);
  assert.equal(recaptured.board[20], null);
  assert.equal(recaptured.captures.white, 1);
  assert.equal(recaptured.koPoint, 20);
  assert.deepEqual(undo(captured), initial);
});

test("snapback recapture of a larger group is legal, not ko", () => {
  const initial = fixture({ black: [12, 13, 20, 23, 30, 32, 40], white: [21, 22, 29, 39], toPlay: "white" });
  initial.board.forEach((color, point) => {
    if (color) assert.ok(getGroup(initial.board, 9, point).liberties.length > 0);
  });
  const captured = play(initial, 31);
  assert.equal(captured.captures.white, 1);
  assert.equal(captured.koPoint, null);
  const snapback = play(captured, 30);
  assert.equal(snapback.captures.black, 3);
  assert.equal(snapback.board[21], null);
  assert.equal(snapback.board[22], null);
  assert.equal(snapback.board[31], null);
});

test("actual triple-ko cycle is allowed and flagged under simple ko", () => {
  const state = tripleKo();
  const next = [41, 47, 53, 40, 46, 52].reduce(play, state);
  assert.deepEqual(next.board, state.board);
  assert.equal(next.toPlay, state.toPlay);
  assert.equal(next.repetitionDetected, true);
  assert.equal(next.captures.black, 3);
  assert.equal(next.captures.white, 3);
});

for (const koRule of ["positional", "situational"]) {
  test(`${koRule}: actual triple-ko final repetition is rejected`, () => {
    const state = [41, 47, 53, 40, 46].reduce(play, tripleKo(koRule));
    const snapshot = structuredClone(state);
    errorCode(() => play(state, 52), "SUPERKO");
    assert.deepEqual(state, snapshot);
  });
}

test("SSK distinguishes the next player while PSK ignores it", () => {
  const game = createGame({ size: 9, koRule: "situational" });
  const next = play(game, 10);
  const historicalPosition = { key: next.positions.at(-1).key, toPlay: "black" };
  const history = [...game.positions, historicalPosition];
  assert.equal(play({ ...game, positions: history }, 10).board[10], "black");
  errorCode(() => play({ ...game, koRule: "positional", positions: history }, 10), "SUPERKO");
  errorCode(() => play({ ...game, positions: [...game.positions, { ...historicalPosition, toPlay: "white" }] }, 10), "SUPERKO");
});

test("simple-ko board repetition is only flagged for review, regardless of next player", () => {
  const game = createGame({ size: 9 });
  const key = play(game, 10).positions.at(-1).key;
  const next = play({ ...game, positions: [...game.positions, { key, toPlay: "black" }] }, 10);
  assert.equal(next.repetitionDetected, true);
  assert.equal(next.phase, "playing");
});

for (const ruleset of ["korean", "japanese"]) {
  test(`${ruleset}: repetition needs two separate approvals, undo restores it`, () => {
    const state = [41, 47, 53, 40, 46, 52].reduce(play, tripleKo("simple", ruleset));
    const first = approveRepetition(state, "black");
    assert.equal(first.phase, "playing");
    errorCode(() => approveRepetition(first, "black"), "APPROVED");
    const finished = approveRepetition(first, "white");
    assert.equal(finished.result.reason, ruleset === "korean" ? "repetition-draw" : "no-result");
    assert.equal(finished.result.winner, null);
    errorCode(() => play(finished, 200), "PHASE");
    assert.deepEqual(undo(finished), first);
    assert.equal(play(first, 200).repetitionApprovals.length, 0);
  });
}

test("undo discards future positions so replay and a new variation are legal under superko", () => {
  const initial = createGame({ size: 9, koRule: "positional" });
  const first = play(initial, 10);
  const second = play(first, 20);
  const undone = undo(second);
  assert.deepEqual(play(undone, 20), second);
  const variation = play(undone, 21);
  assert.equal(variation.positions.length, 3);
  assert.equal(variation.positions.some((position) => position.key === second.positions.at(-1).key), false);
});

for (const koRule of ["simple", "positional", "situational"]) {
  test(`${koRule}: passes bypass superko, two enter scoring, no pass prisoners`, () => {
    const state = createGame({ size: 9, koRule });
    const first = pass(state);
    assert.equal(first.consecutivePasses, 1);
    assert.equal(first.toPlay, "white");
    const second = pass(first);
    assert.equal(second.phase, "scoring");
    assert.deepEqual(second.captures, { black: 0, white: 0 });
    assert.equal(second.positions.length, 3);
    errorCode(() => play(second, 10), "PHASE");
    errorCode(() => pass(second), "PHASE");
    assert.deepEqual(undo(second), first);
    assert.equal(play(first, 10).consecutivePasses, 0);
  });
}

test("pass clears immediate ko; a later recapture that repeats the board is still superko", () => {
  const captured = play(koFixture("positional"), 20);
  const afterPass = pass(captured);
  assert.equal(afterPass.koPoint, null);
  const resumed = resume(pass(afterPass), "white");
  errorCode(() => play(resumed, 19), "SUPERKO");
});

test("scoring requires two approvals; edits revoke approval and finished games block play", () => {
  const state = pass(pass(fixture({ black: [1, 9], white: [80] })));
  const approved = approveScore(state, "black");
  assert.equal(approved.phase, "scoring");
  errorCode(() => approveScore(approved, "black"), "APPROVED");
  assert.deepEqual(markGroup(approved, 1, "seki").approvals, []);
  assert.deepEqual(markNeutral(approved, 0).approvals, []);
  const finished = approveScore(approved, "white");
  assert.equal(finished.phase, "finished");
  assert.equal(finished.result.reason, "score");
  errorCode(() => play(finished, 10), "PHASE");
  errorCode(() => resign(finished), "PHASE");
  errorCode(() => markGroup(finished, 1), "PHASE");
  assert.deepEqual(undo(finished), approved);
});

test("empty board has no territory, zero komi produces jigo", () => {
  const state = pass(pass(createGame({ size: 9, komi: 0 })));
  const tally = score(state);
  assert.deepEqual(tally.totals, { black: 0, white: 0 });
  assert.equal(tally.neutralPoints, 81);
  assert.equal(tally.winner, null);
  assert.equal(approveScore(approveScore(state, "white"), "black").result.margin, 0);
});

for (const ruleset of Object.keys(RULESETS)) {
  test(`${ruleset}: known corner territory, dead prisoner counted once, komi`, () => {
    let state = pass(pass(fixture({ ruleset, komi: 6.5, black: [2, 10, 18], white: [0, 80] })));
    state = { ...state, captures: { black: 1, white: 3 } };
    state = markGroup(state, 0);
    const before = structuredClone(state);
    const tally = score(state);
    assert.equal(tally.territory.black, 3);
    assert.equal(tally.prisoners.black, 2);
    assert.equal(tally.deadPrisoners.black, 1);
    assert.equal(tally.neutralPoints, 74);
    assert.equal(tally.totals.black, ruleset === "chinese" ? 6 : 5);
    assert.equal(tally.totals.white, ruleset === "chinese" ? 7.5 : 9.5);
    assert.deepEqual(score(state), tally);
    assert.deepEqual(state, before);
    const unmarked = markGroup(state, 0);
    assert.deepEqual(unmarked.dead, []);
    assert.equal(score(unmarked).prisoners.black, 1);
  });
}

test("dead and seki toggle entire connected groups and are mutually exclusive", () => {
  const state = pass(pass(fixture({ black: [10, 11], white: [80] })));
  const dead = markGroup(state, 10);
  assert.deepEqual([...dead.dead].sort((first, second) => first - second), [10, 11]);
  const seki = markGroup(dead, 11, "seki");
  assert.deepEqual(seki.dead, []);
  assert.equal(seki.seki.length, 2);
  assert.deepEqual(markGroup(seki, 10, "seki").seki, []);
  errorCode(() => markGroup(state, 0), "EMPTY");
  errorCode(() => markGroup(state, 10, "alive"), "MARK");
});

for (const ruleset of Object.keys(RULESETS)) {
  test(`${ruleset}: manually marked seki excludes eyes only in territory scoring`, () => {
    const state = pass(pass(fixture({ ruleset, black: [1, 9], white: [80] })));
    const marked = markGroup(markGroup(state, 1, "seki"), 9, "seki");
    const tally = score(marked);
    assert.equal(tally.territory.black, ruleset === "chinese" ? 1 : 0);
    assert.equal(tally.stones.black, 2);
    const excluded = markNeutral(marked, 0);
    assert.equal(score(excluded).territory.black, 0);
    assert.equal(score(markNeutral(excluded, 0)).territory.black, ruleset === "chinese" ? 1 : 0);
  });
}

test("neutral selection follows empty regions and resets when dead topology changes", () => {
  let state = pass(pass(fixture({ black: [2, 10, 18], white: [0, 80] })));
  errorCode(() => markNeutral(state, 0), "OCCUPIED");
  state = markGroup(state, 0);
  state = markNeutral(state, 0);
  assert.deepEqual([...state.neutral].sort((first, second) => first - second), [0, 1, 9]);
  assert.equal(score(state).territory.black, 0);
  assert.deepEqual(markGroup(state, 0).neutral, []);
});

test("resume uses explicit agreed first player, preserves real captures and history, clears review", () => {
  let state = pass(pass(play(koFixture(), 20)));
  state = approveScore(markGroup(state, 10, "seki"), "black");
  const resumed = resume(state, "white");
  assert.equal(resumed.phase, "playing");
  assert.equal(resumed.toPlay, "white");
  assert.deepEqual(resumed.captures, state.captures);
  assert.deepEqual(resumed.board, state.board);
  for (const property of ["dead", "seki", "neutral", "approvals"]) assert.deepEqual(resumed[property], []);
  assert.equal(resumed.consecutivePasses, 0);
  assert.equal(resumed.moves.at(-1).type, "resume");
  assert.deepEqual(undo(resumed), state);
  errorCode(() => resume(state, "red"), "COLOR");
});

test("resign records winner and undo restores both play and scoring", () => {
  const initial = play(createGame({ size: 9 }), 10);
  const finished = resign(initial);
  assert.equal(finished.result.winner, "black");
  assert.equal(finished.result.reason, "resignation");
  assert.equal(finished.moves.at(-1).color, "white");
  assert.deepEqual(undo(finished), initial);
  const scoring = pass(pass(initial));
  assert.deepEqual(undo(resign(scoring)), scoring);
});

test("records include configuration, captures, passes, agreed review and result", () => {
  let state = play(koFixture(), 20);
  state = pass(pass(state));
  state = approveScore(approveScore(markGroup(state, 10, "seki"), "black"), "white");
  const record = JSON.parse(JSON.stringify(exportRecord(state)));
  assert.equal(record.format, "baduk-park-v1");
  assert.equal(record.koRule, "simple");
  assert.deepEqual(record.moves.map((move) => move.type), ["play", "pass", "pass"]);
  assert.deepEqual(record.moves[0].captured, [19]);
  assert.deepEqual(record.seki, [10]);
  assert.equal(record.result.reason, "score");
  assert.deepEqual(record.board, state.board);
});

test("wrong phase, empty history and invalid approval colors are rejected", () => {
  const state = createGame({ size: 9 });
  errorCode(() => undo(state), "HISTORY");
  errorCode(() => score(state), "PHASE");
  errorCode(() => approveScore(state, "black"), "PHASE");
  errorCode(() => approveRepetition(state, "black"), "REPETITION");
  errorCode(() => approveScore(pass(pass(state)), "red"), "COLOR");
});

test("deterministic legal playouts conserve stones and prisoners; undo/replay is exact", () => {
  let seed = 104729;
  for (const ruleset of Object.keys(RULESETS)) {
    let state = createGame({ size: 9, ruleset });
    const placed = { black: 0, white: 0 };
    for (let attempt = 0; attempt < 350; attempt++) {
      seed = (seed * 16807) % 2147483647;
      const point = seed % 81;
      const previous = state;
      try {
        state = play(state, point);
      } catch (error) {
        assert.ok(["OCCUPIED", "SUICIDE", "KO", "SUPERKO"].includes(error.code));
        continue;
      }
      placed[previous.toPlay]++;
      assert.deepEqual(undo(state), previous);
      assert.deepEqual(play(undo(state), point), state);
      for (const color of ["black", "white"]) {
        const count = state.board.filter((stone) => stone === color).length;
        assert.equal(count + state.captures[color === "black" ? "white" : "black"], placed[color]);
      }
      state.board.forEach((color, stone) => {
        if (color) assert.ok(getGroup(state.board, state.size, stone).liberties.length > 0);
      });
    }
  }
});
