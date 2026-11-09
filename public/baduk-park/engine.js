export const RULESETS = Object.freeze({
  korean: Object.freeze({ name: "한국", scoring: "territory", komi: 6.5, koRule: "simple" }),
  japanese: Object.freeze({ name: "일본", scoring: "territory", komi: 6.5, koRule: "simple" }),
  chinese: Object.freeze({ name: "중국", scoring: "area", komi: 7.5, koRule: "positional" }),
});

export class RuleError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "RuleError";
    this.code = code;
  }
}

const other = (color) => color === "black" ? "white" : "black";
const boardKey = (board) => board.map((color) => color === "black" ? "B" : color === "white" ? "W" : ".").join("");
const fail = (code, message) => { throw new RuleError(code, message); };

function requireColor(color) {
  if (!["black", "white"].includes(color)) fail("COLOR", "흑 또는 백을 선택하세요.");
}

function requirePhase(state, phase) {
  if (state.phase !== phase) fail("PHASE", "현재 단계에서 사용할 수 없는 기능입니다.");
}

function requirePoint(size, point) {
  if (!Number.isInteger(point) || point < 0 || point >= size * size) fail("BOUNDS", "바둑판 밖에는 둘 수 없습니다.");
}

export function neighbors(size, point) {
  requirePoint(size, point);
  const adjacent = [];
  if (point % size > 0) adjacent.push(point - 1);
  if (point % size < size - 1) adjacent.push(point + 1);
  if (point >= size) adjacent.push(point - size);
  if (point < size * (size - 1)) adjacent.push(point + size);
  return adjacent;
}

export function getGroup(board, size, point) {
  requirePoint(size, point);
  if (!board[point]) return { stones: [], liberties: [] };
  const stones = new Set([point]);
  const liberties = new Set();
  const pending = [point];
  while (pending.length) {
    const current = pending.pop();
    for (const adjacent of neighbors(size, current)) {
      if (!board[adjacent]) liberties.add(adjacent);
      else if (board[adjacent] === board[point] && !stones.has(adjacent)) {
        stones.add(adjacent);
        pending.push(adjacent);
      }
    }
  }
  return { stones: [...stones], liberties: [...liberties] };
}

export function createGame({ size = 19, ruleset = "korean", komi, koRule } = {}) {
  if (![9, 13, 19].includes(size)) fail("SIZE", "9·13·19줄만 지원합니다.");
  if (!Object.hasOwn(RULESETS, ruleset)) fail("RULESET", "지원하지 않는 규칙입니다.");
  const preset = RULESETS[ruleset];
  komi ??= preset.komi;
  koRule ??= preset.koRule;
  if (!Number.isFinite(komi) || Math.abs(komi) > 100 || !Number.isInteger(komi * 2)) fail("KOMI", "덤은 -100~100 사이의 0.5 단위여야 합니다.");
  if (!["simple", "positional", "situational"].includes(koRule)) fail("KO_RULE", "지원하지 않는 반복 규칙입니다.");
  const board = Array(size * size).fill(null);
  return {
    size, ruleset, komi, koRule, board, toPlay: "black", phase: "playing",
    captures: { black: 0, white: 0 }, consecutivePasses: 0, koPoint: null,
    positions: [{ key: boardKey(board), toPlay: "black" }], moves: [], history: [],
    dead: [], seki: [], neutral: [], approvals: [], repetitionApprovals: [],
    repetitionDetected: false, result: null,
  };
}

function advance(state, changes) {
  const { history, ...snapshot } = state;
  return { ...state, ...changes, history: [...history, snapshot] };
}

export function play(state, point) {
  requirePhase(state, "playing");
  requirePoint(state.size, point);
  if (state.board[point]) fail("OCCUPIED", "이미 돌이 있는 자리입니다.");
  if (state.koPoint === point) fail("KO", "패를 즉시 되따낼 수 없습니다. 다른 수를 먼저 두세요.");
  const board = [...state.board];
  const color = state.toPlay;
  board[point] = color;
  const captured = new Set();
  for (const adjacent of neighbors(state.size, point)) {
    if (board[adjacent] === other(color)) {
      const group = getGroup(board, state.size, adjacent);
      if (group.liberties.length === 0) group.stones.forEach((stone) => captured.add(stone));
    }
  }
  for (const stone of captured) board[stone] = null;
  const ownGroup = getGroup(board, state.size, point);
  if (ownGroup.liberties.length === 0) fail("SUICIDE", "자살수는 둘 수 없습니다. 상대 돌을 따내 활로가 생기는 수는 가능합니다.");
  const key = boardKey(board);
  const toPlay = other(color);
  if (state.koRule !== "simple" && state.positions.some((position) => position.key === key && (state.koRule === "positional" || position.toPlay === toPlay))) {
    fail("SUPERKO", state.koRule === "positional" ? "이전의 전체 판 모양을 되풀이하는 슈퍼코입니다." : "판 모양과 다음 차례가 모두 같은 이전 국면입니다.");
  }
  const repetitionDetected = state.koRule === "simple" && state.positions.some((position) => position.key === key);
  const koPoint = captured.size === 1 && ownGroup.stones.length === 1 && ownGroup.liberties.length === 1 ? [...captured][0] : null;
  return advance(state, {
    board, toPlay, koPoint, consecutivePasses: 0, repetitionDetected, repetitionApprovals: [],
    captures: { ...state.captures, [color]: state.captures[color] + captured.size },
    positions: [...state.positions, { key, toPlay }],
    moves: [...state.moves, { type: "play", color, point, captured: [...captured] }],
  });
}

export function pass(state) {
  requirePhase(state, "playing");
  const toPlay = other(state.toPlay);
  const consecutivePasses = state.consecutivePasses + 1;
  return advance(state, {
    toPlay, consecutivePasses, koPoint: null, repetitionDetected: false, repetitionApprovals: [],
    phase: consecutivePasses === 2 ? "scoring" : "playing",
    dead: [], seki: [], neutral: [], approvals: [],
    positions: [...state.positions, { key: boardKey(state.board), toPlay }],
    moves: [...state.moves, { type: "pass", color: state.toPlay }],
  });
}

export function resign(state) {
  if (state.phase === "finished") fail("PHASE", "이미 끝난 대국입니다.");
  return advance(state, {
    phase: "finished", result: { winner: other(state.toPlay), reason: "resignation", margin: null },
    moves: [...state.moves, { type: "resign", color: state.toPlay }],
  });
}

export function undo(state) {
  if (state.history.length === 0) fail("HISTORY", "무를 기록이 없습니다.");
  return { ...state.history.at(-1), history: state.history.slice(0, -1) };
}

export function resume(state, firstPlayer) {
  requirePhase(state, "scoring");
  requireColor(firstPlayer);
  return advance(state, {
    phase: "playing", toPlay: firstPlayer, consecutivePasses: 0, koPoint: null,
    dead: [], seki: [], neutral: [], approvals: [], repetitionApprovals: [], repetitionDetected: false,
    positions: [...state.positions, { key: boardKey(state.board), toPlay: firstPlayer }],
    moves: [...state.moves, { type: "resume", color: firstPlayer }],
  });
}

function emptyRegion(board, size, start) {
  const points = new Set([start]);
  const boundary = new Set();
  const pending = [start];
  while (pending.length) {
    for (const adjacent of neighbors(size, pending.pop())) {
      if (board[adjacent]) boundary.add(adjacent);
      else if (!points.has(adjacent)) {
        points.add(adjacent);
        pending.push(adjacent);
      }
    }
  }
  return { points: [...points], boundary: [...boundary] };
}

export function markGroup(state, point, kind = "dead") {
  requirePhase(state, "scoring");
  requirePoint(state.size, point);
  if (!["dead", "seki"].includes(kind)) fail("MARK", "사석 또는 빅을 선택하세요.");
  if (!state.board[point]) fail("EMPTY", "돌을 선택하세요.");
  const group = getGroup(state.board, state.size, point).stones;
  const selection = new Set(state[kind]);
  const remove = selection.has(point);
  for (const stone of group) {
    if (remove) selection.delete(stone);
    else selection.add(stone);
  }
  const oppositeKind = kind === "dead" ? "seki" : "dead";
  return advance(state, {
    [kind]: [...selection], [oppositeKind]: state[oppositeKind].filter((stone) => !group.includes(stone)),
    neutral: [], approvals: [],
  });
}

export function markNeutral(state, point) {
  requirePhase(state, "scoring");
  requirePoint(state.size, point);
  const board = state.board.map((color, index) => state.dead.includes(index) ? null : color);
  if (board[point]) fail("OCCUPIED", "사석 제거 후 빈 영역을 선택하세요.");
  const region = emptyRegion(board, state.size, point).points;
  const selection = new Set(state.neutral);
  const remove = selection.has(point);
  for (const empty of region) {
    if (remove) selection.delete(empty);
    else selection.add(empty);
  }
  return advance(state, { neutral: [...selection], approvals: [] });
}

export function score(state) {
  if (state.phase !== "scoring" && !(state.phase === "finished" && state.result?.reason === "score")) fail("PHASE", "연속 패스 후 계가할 수 있습니다.");
  const dead = new Set(state.dead);
  const seki = new Set(state.seki);
  const neutral = new Set(state.neutral);
  const board = state.board.map((color, point) => dead.has(point) ? null : color);
  const territory = { black: 0, white: 0 };
  const stones = { black: 0, white: 0 };
  const deadPrisoners = { black: 0, white: 0 };
  const ownership = Array(board.length).fill(null);
  const visited = new Set();
  const areaScoring = RULESETS[state.ruleset].scoring === "area";
  let neutralPoints = 0;
  for (let point = 0; point < board.length; point++) {
    if (dead.has(point)) deadPrisoners[other(state.board[point])]++;
    if (board[point]) {
      stones[board[point]]++;
      continue;
    }
    if (visited.has(point)) continue;
    const region = emptyRegion(board, state.size, point);
    region.points.forEach((empty) => visited.add(empty));
    const colors = new Set(region.boundary.map((stone) => board[stone]));
    const excluded = region.points.some((empty) => neutral.has(empty)) || (!areaScoring && region.boundary.some((stone) => seki.has(stone)));
    if (colors.size === 1 && !excluded) {
      const owner = [...colors][0];
      territory[owner] += region.points.length;
      region.points.forEach((empty) => { ownership[empty] = owner; });
    } else neutralPoints += region.points.length;
  }
  const prisoners = {
    black: state.captures.black + deadPrisoners.black,
    white: state.captures.white + deadPrisoners.white,
  };
  const totals = {
    black: territory.black + (areaScoring ? stones.black : prisoners.black),
    white: territory.white + (areaScoring ? stones.white : prisoners.white) + state.komi,
  };
  const difference = totals.black - totals.white;
  return {
    territory, stones, prisoners, deadPrisoners, totals, ownership, neutralPoints,
    winner: difference === 0 ? null : difference > 0 ? "black" : "white", margin: Math.abs(difference),
  };
}

export function approveScore(state, color) {
  requirePhase(state, "scoring");
  requireColor(color);
  if (state.approvals.includes(color)) fail("APPROVED", "이미 확인했습니다.");
  const approvals = [...state.approvals, color];
  const tally = score(state);
  return advance(state, {
    approvals, phase: approvals.length === 2 ? "finished" : "scoring",
    result: approvals.length === 2 ? { reason: "score", ...tally } : null,
  });
}

export function approveRepetition(state, color) {
  requirePhase(state, "playing");
  requireColor(color);
  if (!state.repetitionDetected || state.koRule !== "simple") fail("REPETITION", "검토할 장기 반복 국면이 없습니다.");
  if (state.repetitionApprovals.includes(color)) fail("APPROVED", "이미 확인했습니다.");
  const repetitionApprovals = [...state.repetitionApprovals, color];
  return advance(state, {
    repetitionApprovals, phase: repetitionApprovals.length === 2 ? "finished" : "playing",
    result: repetitionApprovals.length === 2 ? { winner: null, margin: null, reason: state.ruleset === "korean" ? "repetition-draw" : "no-result" } : null,
  });
}

export function coordinate(size, point) {
  requirePoint(size, point);
  return `${"ABCDEFGHJKLMNOPQRST"[point % size]}${size - Math.floor(point / size)}`;
}

export function exportRecord(state) {
  return {
    format: "baduk-park-v1", size: state.size, ruleset: state.ruleset, komi: state.komi, koRule: state.koRule,
    moves: state.moves.map((move) => ({ ...move, ...(move.captured ? { captured: [...move.captured] } : {}) })),
    phase: state.phase, toPlay: state.toPlay, board: [...state.board], captures: { ...state.captures },
    dead: [...state.dead], seki: [...state.seki], neutral: [...state.neutral], approvals: [...state.approvals],
    repetitionApprovals: [...state.repetitionApprovals], result: state.result,
  };
}
