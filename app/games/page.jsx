import GameCard from "../../components/GameCard";
import PreviewNotice from "../../components/PreviewNotice";
import { games } from "../../lib/catalog";

export const metadata = { title: "게임 목록" };

export default function GamesPage() {
  return (
    <div className="page-stack">
      <div className="page-heading">
        <p className="section-kicker">GAME LIBRARY</p>
        <h1>모든 게임</h1>
        <p>Drawing Games의 게임들이 모일 공간이에요. 바둑공원 체험판을 먼저 플레이할 수 있어요. 다른 게임들은 준비 중입니다.</p>
      </div>
      <PreviewNotice>바둑공원은 로컬 19×19 연습판을 체험할 수 있어요. 온라인 대국과 다른 게임은 아직 준비 중입니다.</PreviewNotice>
      <section className="section-block" aria-label="게임 카탈로그">
        <div className="game-grid catalog-grid">
          {games.map((game) => <GameCard key={game.id} game={game} />)}
        </div>
      </section>
      <section className="panel bottom-note">
        <h2>앞으로 게임이 더 많아질 거예요.</h2>
        <p>게임이 추가되면 이 목록에서 선택할 수 있도록 만들 예정입니다.</p>
      </section>
    </div>
  );
}
