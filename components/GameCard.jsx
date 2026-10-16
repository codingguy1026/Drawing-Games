export default function GameCard({ game }) {
  return (
    <article className="game-card game-card-hover">
      <div className={"game-art " + game.artwork} aria-hidden="true">
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
        <button className="btn btn-disabled" type="button" disabled>
          아직 플레이할 수 없어요
        </button>
      </div>
    </article>
  );
}
