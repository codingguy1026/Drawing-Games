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
        <p>Drawing Games의 게임들이 모일 공간이에요. 현재 등록된 항목은 모두 준비 중입니다.</p>
      </div>
      <PreviewNotice>게임 카탈로그 UI를 미리 보여주는 페이지입니다. 아직 실제 플레이는 지원하지 않습니다.</PreviewNotice>
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
