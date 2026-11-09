import { RULESETS, RuleError, createGame, getGroup, play, pass, resign, undo, resume, markGroup, markNeutral, score, approveScore, approveRepetition, coordinate, exportRecord } from "./engine.js";

const element = (id) => document.getElementById(id);
const colorName = (color) => color === "black" ? "흑" : "백";
const koName = { simple: "단순패 + 장기 반복 합의", positional: "PSK", situational: "SSK" };
let state = createGame();
let points = [];

function action(operation) {
  try {
    state = operation(state);
    element("error").textContent = "";
    render();
  } catch (error) {
    element("error").textContent = error instanceof RuleError ? error.message : "처리 중 오류가 발생했습니다.";
    if (!(error instanceof RuleError)) console.error(error);
  }
}

function inspect(point) {
  for (const button of points) button.classList.remove("group", "liberty");
  if (!state.board[point]) return;
  const group = getGroup(state.board, state.size, point);
  group.stones.forEach((stone) => points[stone].classList.add("group"));
  group.liberties.forEach((liberty) => points[liberty].classList.add("liberty"));
  element("group-info").textContent = `${coordinate(state.size, point)} · ${colorName(state.board[point])} 연결된 돌 ${group.stones.length}개 · 활로 ${group.liberties.length}개`;
}

function buildBoard() {
  const board = element("goban");
  board.replaceChildren();
  board.style.gridTemplateColumns = `repeat(${state.size}, minmax(0, 1fr))`;
  board.style.gridTemplateRows = `repeat(${state.size}, minmax(0, 1fr))`;
  board.setAttribute("aria-label", `${state.size}×${state.size} 바둑판. 방향키로 이동, Enter 또는 Space로 선택.`);
  const starAxis = state.size === 19 ? [3, 9, 15] : state.size === 13 ? [3, 6, 9] : [2, 4, 6];
  points = state.board.map((_, point) => {
    const button = document.createElement("button");
    const column = point % state.size;
    const row = Math.floor(point / state.size);
    button.type = "button";
    button.className = "point";
    if (column === 0) button.classList.add("left");
    if (column === state.size - 1) button.classList.add("right");
    if (row === 0) button.classList.add("top");
    if (row === state.size - 1) button.classList.add("bottom");
    if (starAxis.includes(column) && starAxis.includes(row) && (state.size === 19 || column === row || column + row === state.size - 1)) button.classList.add("star");
    button.addEventListener("click", () => {
      if (state.phase === "scoring") {
        const mode = element("mark-mode").value;
        action((game) => mode === "neutral" ? markNeutral(game, point) : markGroup(game, point, mode));
      } else action((game) => play(game, point));
    });
    button.addEventListener("pointerenter", () => inspect(point));
    button.addEventListener("focus", () => {
      points.forEach((candidate) => { candidate.tabIndex = -1; });
      button.tabIndex = 0;
      inspect(point);
    });
    button.addEventListener("keydown", (event) => {
      const destinations = {
        ArrowLeft: column > 0 ? point - 1 : point,
        ArrowRight: column < state.size - 1 ? point + 1 : point,
        ArrowUp: row > 0 ? point - state.size : point,
        ArrowDown: row < state.size - 1 ? point + state.size : point,
        Home: row * state.size,
        End: (row + 1) * state.size - 1,
      };
      if (Object.hasOwn(destinations, event.key)) {
        event.preventDefault();
        points[destinations[event.key]].focus();
      }
    });
    button.tabIndex = point === 0 ? 0 : -1;
    board.appendChild(button);
    return button;
  });
}

function resultText(result) {
  if (result.reason === "resignation") return `${colorName(result.winner)} 불계승 (상대 기권)`;
  if (result.reason === "no-result") return "무효 대국 (無勝負) · 장기 반복 양측 합의 · 승패 없음";
  if (result.reason === "repetition-draw") return "무승부 · 장기 반복 양측 합의";
  return result.winner ? `${colorName(result.winner)} ${result.margin}집/점 승` : "지고(持碁) · 동점";
}

function render() {
  if (points.length !== state.board.length) buildBoard();
  const preset = RULESETS[state.ruleset];
  const variant = preset.koRule !== state.koRule ? " · 사용자 반복 규칙 변형" : "";
  element("config-summary").textContent = `현재 대국: ${state.size}줄 · ${preset.name} · 백 덤 ${state.komi} · ${koName[state.koRule]}${variant}`;
  element("status").textContent = state.phase === "finished" ? `종료: ${resultText(state.result)}` : state.phase === "scoring" ? "연속 패스 · 사석·빅·영역을 검토한 후 양측이 확인하세요." : `차례: ${colorName(state.toPlay)} · 연속 패스 ${state.consecutivePasses}회`;
  element("captures").textContent = `잡은 돌: 흑 ${state.captures.black}개 / 백 ${state.captures.white}개`;
  element("group-info").textContent = "돌을 가리키거나 키보드로 선택하면 무리와 활로가 표시됩니다. 마지막 착수는 빨간 테두리입니다.";
  const tally = state.phase === "scoring" || state.result?.reason === "score" ? score(state) : null;
  const lastMove = state.moves.at(-1);
  points.forEach((button, point) => {
    const color = state.board[point];
    button.classList.remove("occupied", "dead", "seki", "last", "territory-black", "territory-white", "group", "liberty");
    if (color) button.classList.add("occupied");
    if (state.dead.includes(point)) button.classList.add("dead");
    if (state.seki.includes(point)) button.classList.add("seki");
    if (lastMove?.type === "play" && lastMove.point === point) button.classList.add("last");
    if (tally?.ownership[point]) button.classList.add(`territory-${tally.ownership[point]}`);
    button.replaceChildren();
    const dot = document.createElement("span");
    dot.className = "dot";
    button.appendChild(dot);
    if (color) {
      const stone = document.createElement("span");
      stone.className = `stone ${color}`;
      button.appendChild(stone);
    }
    const mark = state.dead.includes(point) ? "×" : state.seki.includes(point) ? "S" : state.neutral.includes(point) ? "·" : state.koPoint === point ? "패" : "";
    if (mark) {
      const label = document.createElement("span");
      label.className = "mark";
      label.textContent = mark;
      button.appendChild(label);
    }
    button.setAttribute("aria-label", `${coordinate(state.size, point)}, ${color ? `${colorName(color)}돌` : "빈 점"}${state.dead.includes(point) ? ", 사석" : ""}${state.seki.includes(point) ? ", 빅" : ""}${state.neutral.includes(point) ? ", 계가 제외" : ""}${state.koPoint === point ? ", 즉시 패 되따내기 금지" : ""}`);
    button.setAttribute("aria-disabled", String(state.phase === "finished"));
  });
  element("pass").disabled = state.phase !== "playing";
  element("resign").disabled = state.phase === "finished";
  element("undo").disabled = state.history.length === 0;
  element("scoring-panel").hidden = state.phase !== "scoring";
  element("repetition-panel").hidden = !state.repetitionDetected || state.phase !== "playing";
  for (const color of ["black", "white"]) {
    element(`approve-${color}`).disabled = state.approvals.includes(color);
    element(`repeat-${color}`).disabled = state.repetitionApprovals.includes(color);
  }
  if (tally) {
    const basis = preset.scoring === "area" ? `돌 흑 ${tally.stones.black} / 백 ${tally.stones.white} (포로 가산 없음)` : `포로+사석 흑 ${tally.prisoners.black} / 백 ${tally.prisoners.white}`;
    element("score-preview").textContent = `집 후보 흑 ${tally.territory.black} / 백 ${tally.territory.white} · ${basis} · 공배/제외 ${tally.neutralPoints} · 백 덤 ${state.komi} → 합계 흑 ${tally.totals.black} / 백 ${tally.totals.white} · ${resultText({ reason: "score", ...tally })}`;
  }
  element("move-count").textContent = `(${state.moves.filter((move) => move.type === "play" || move.type === "pass").length}수)`;
  element("move-list").replaceChildren(...state.moves.map((move) => {
    const item = document.createElement("li");
    const detail = move.type === "play" ? `${coordinate(state.size, move.point)}${move.captured.length ? ` · ${move.captured.length}개 포획` : ""}` : move.type === "pass" ? "패스" : move.type === "resume" ? "합의 재개 · 선착" : "기권";
    item.textContent = `${colorName(move.color)} ${detail}`;
    return item;
  }));
}

element("ruleset").addEventListener("change", () => {
  const preset = RULESETS[element("ruleset").value];
  element("komi").value = preset.komi;
  element("ko-rule").value = preset.koRule;
});
element("settings").addEventListener("submit", (event) => {
  event.preventDefault();
  if (state.history.length && !window.confirm("현재 대국과 기록을 지우고 새 대국을 시작할까요? 필요하면 먼저 기보를 저장하세요.")) return;
  action(() => createGame({ size: Number(element("size").value), ruleset: element("ruleset").value, komi: Number(element("komi").value), koRule: element("ko-rule").value }));
});
element("pass").addEventListener("click", () => action(pass));
element("resign").addEventListener("click", () => {
  if (window.confirm(`${colorName(state.toPlay)}이 기권할까요?`)) action(resign);
});
element("undo").addEventListener("click", () => {
  if (window.confirm("양측 합의로 마지막 한 단계(착수·패스·계가 표시·확인 등)를 무를까요?")) action(undo);
});
element("resume").addEventListener("click", () => {
  if (window.confirm("실제 판에서 대국을 재개합니다. 집 계가에 영향을 줄 수 있습니다. 양측이 동의했나요?")) action((game) => resume(game, element("resume-color").value));
});
for (const color of ["black", "white"]) {
  element(`approve-${color}`).addEventListener("click", () => action((game) => approveScore(game, color)));
  element(`repeat-${color}`).addEventListener("click", () => action((game) => approveRepetition(game, color)));
}
element("download").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(exportRecord(state), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `baduk-park-${state.size}-${state.ruleset}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
render();
