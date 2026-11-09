import Link from "next/link";

export default function GameCard({ game }) {
  return (
    <article className="game-card game-card-hover">
      <div className={"game-art " + game.artwork} aria-hidden="true">
        <span className="game-art-badge">{game.id === "baduk-park" ? "LOCAL PLAY" : "COMING SOON"}</span>
        <span className="game-art-symbol">{game.icon}</span>
        <span className="game-art-label">DRAWING GAMES</span>
      </div>
      <div className="game-card-body">
        <div className="game-card-meta">
          <span>{game.category}</span>
          <span className="status-pill">{game.status}</span>
        </div>
        <h3>{game.title}</h3>
        <p>{game.description}</p>
        {game.id === "baduk-park" ? (
          <Link href="/games/baduk-park" className="pg-game-coming" aria-label="바둑공원 로컬 대국 열기">⚫ 바둑판 열기 ↗</Link>
        ) : (
          <div className="pg-game-coming" aria-label="아직 플레이할 수 없는 게임입니다.">
            <span aria-hidden="true">◷</span> 출시 준비 중
          </div>
        )}
      </div>
    </article>
  );
}
