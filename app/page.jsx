import Link from "next/link";
import Image from "next/image";
import GameCard from "../components/GameCard";
import PreviewNotice from "../components/PreviewNotice";
import { games } from "../lib/catalog";

export default function HomePage() {
  return (
    <div className="page-stack">
      <section className="hero glass-panel">
        <div className="hero-content">
          <span className="eyebrow"><span className="eyebrow-dot" /> THE GAME HUB</span>
          <h1>게임이 모이는 곳,<br /><span>친구가 이어지는 곳.</span></h1>
          <p>여러 미니게임을 한 곳에서. 게임을 고르고, 친구들과 방에 모여 즐기는 Drawing Games를 준비하고 있어요.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/games">게임 둘러보기 <span aria-hidden="true">↗</span></Link>
            <Link className="btn btn-ghost" href="/room">대기실 미리보기</Link>
          </div>
          <span className="hero-caption">현재는 화면 디자인만 체험할 수 있어요.</span>
        </div>
        <div className="hero-art" aria-hidden="true">
          <Image className="hero-logo-image" src="/branding/drawing-games-logo.svg" alt="" width={320} height={195} priority />
        </div>
      </section>

      <PreviewNotice />

      <div className="content-layout">
        <div className="content-main">
          <section id="games" className="section-block">
            <div className="section-heading">
              <div>
                <p className="section-kicker">DISCOVER</p>
                <h2>게임 둘러보기</h2>
                <p className="section-description">새로운 게임이 이곳에 차곡차곡 추가될 예정이에요.</p>
              </div>
              <Link href="/games" className="section-more">전체 보기 ↗</Link>
            </div>
            <div className="game-grid">
              {games.slice(0, 2).map((game) => <GameCard key={game.id} game={game} />)}
            </div>
          </section>

          <section id="rooms" className="section-block">
            <div className="section-heading">
              <div>
                <p className="section-kicker">MULTIPLAYER</p>
                <h2>게임방</h2>
                <p className="section-description">친구들과 모일 수 있는 게임방 화면을 준비하고 있어요.</p>
              </div>
            </div>
            <article className="panel room-preview">
              <div className="room-symbol" aria-hidden="true">⌘</div>
              <div className="room-preview-info">
                <span className="status-pill">예시 화면</span>
                <h3>게임 대기실 미리보기</h3>
                <p>실제 공개 게임방이 아닙니다. 화면 배치를 확인해 보세요.</p>
              </div>
              <Link className="btn btn-outline" href="/room">미리보기 ↗</Link>
            </article>
          </section>
        </div>

        <aside className="sidebar" aria-label="게임방 및 계정 영역">
          <section className="panel sidebar-panel">
            <div className="panel-header"><h2>게임방 만들기</h2><span className="subtle-tag">준비 중</span></div>
            <p className="panel-description">원하는 게임을 골라 친구들을 초대하는 기능이 추가될 예정이에요.</p>
            <div className="field-stack">
              <label className="form-field">
                <span>방 이름</span>
                <input placeholder="게임방 이름을 입력하세요" disabled />
              </label>
              <label className="form-field">
                <span>게임 선택</span>
                <select disabled defaultValue=""><option value="">게임을 선택하세요</option></select>
              </label>
              <button className="btn btn-primary full-width" disabled type="button">＋ 방 만들기</button>
            </div>
          </section>
          <section className="panel sidebar-panel">
            <div className="panel-header"><h2>내 공간</h2><span className="subtle-tag">미구현</span></div>
            <div className="account-placeholder"><span aria-hidden="true">☺</span><div><strong>프로필 준비 중</strong><p>로그인 및 프로필 기능은 추후 추가됩니다.</p></div></div>
          </section>
          <section className="help-panel">
            <p className="section-kicker">COMING NEXT</p>
            <h3>하나의 플랫폼, 다양한 게임</h3>
            <p>게임마다 다른 재미를 담되, 로비와 대기실은 함께 사용할 수 있게 만들고 있어요.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
