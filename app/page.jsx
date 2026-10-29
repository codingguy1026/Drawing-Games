import Link from "next/link";
import Image from "next/image";
import GameCard from "../components/GameCard";
import PreviewNotice from "../components/PreviewNotice";
import { games } from "../lib/catalog";

const steps = [
  { number: "01", icon: "▦", title: "게임을 고르고", description: "마음에 드는 게임을 발견해요." },
  { number: "02", icon: "◎", title: "친구들과 모여", description: "같은 대기실에서 함께 준비해요." },
  { number: "03", icon: "✦", title: "한 판 즐기기", description: "서로 다른 게임을 하나의 공간에서." },
];

export default function HomePage() {
  return (
    <div className="page-stack playground-home">
      <section className="pg-hero" aria-labelledby="pg-hero-title">
        <div className="pg-hero-copy">
          <span className="pg-overline"><span className="pg-signal" /> PROJECT PLAYGROUND · UI PREVIEW</span>
          <h1 id="pg-hero-title">한 판 할래?<br /><span>모이면 더 재밌어.</span></h1>
          <p>게임을 발견하고, 친구들과 한자리에 모이고, 함께 플레이하는 공간. Drawing Games가 새로운 모습으로 준비 중이에요.</p>
          <div className="pg-hero-actions">
            <Link className="pg-button pg-button-primary" href="/games">게임 둘러보기 <span aria-hidden="true">↗</span></Link>
            <Link className="pg-button pg-button-secondary" href="/room">대기실 미리보기 <span aria-hidden="true">→</span></Link>
          </div>
          <div className="pg-hero-notes" aria-label="서비스 준비 상태">
            <span><span className="pg-note-icon" aria-hidden="true">✓</span> 게임 카탈로그 미리보기</span>
            <span><span className="pg-note-icon" aria-hidden="true">⌁</span> 멀티플레이 개발 예정</span>
          </div>
        </div>

        <div className="pg-showcase" aria-label="미래 게임 대기실의 디자인 예시">
          <span className="pg-halo pg-halo-one" aria-hidden="true" />
          <span className="pg-halo pg-halo-two" aria-hidden="true" />
          <div className="pg-floating-star pg-star-left" aria-hidden="true">✳</div>
          <div className="pg-floating-star pg-star-right" aria-hidden="true">✦</div>
          <div className="pg-showcase-card">
            <div className="pg-showcase-bar">
              <span className="pg-showcase-dots" aria-hidden="true"><i /><i /><i /></span>
              <span>PLAYGROUND / ROOM</span>
              <span className="pg-showcase-tag">목업</span>
            </div>
            <div className="pg-showcase-body">
              <div className="pg-showcase-heading">
                <Image src="/branding/drawing-games-logo.svg" alt="" width={72} height={44} priority />
                <div><span>DRAWING GAMES</span><strong>함께하는 공간</strong></div>
              </div>
              <div className="pg-party-visual" aria-hidden="true">
                <span className="pg-party-orbit" />
                <span className="pg-party-center">DG</span>
                <span className="pg-party-member pg-party-member-a">✦</span>
                <span className="pg-party-member pg-party-member-b">●</span>
                <span className="pg-party-member pg-party-member-c">◆</span>
                <span className="pg-party-member pg-party-member-d">★</span>
              </div>
              <div className="pg-showcase-bottom">
                <div><span>다음 목표</span><strong>게임방에서 친구 만나기</strong></div>
                <span className="pg-sample-pill">화면 예시</span>
              </div>
            </div>
          </div>
          <div className="pg-float-chip pg-chip-top" aria-hidden="true">✦ PARTY MODE</div>
          <div className="pg-float-chip pg-chip-bottom" aria-hidden="true">🎮 PLAY TOGETHER</div>
        </div>
        <span className="pg-hero-grid" aria-hidden="true" />
      </section>

      <PreviewNotice>Project PLAYGROUND는 디자인 개편 중입니다. 게임 플레이, 실시간 방, 음성 채팅은 아직 제공되지 않으며 아래 화면은 미리보기입니다.</PreviewNotice>

      <section className="pg-feature-section section-block" id="games" aria-labelledby="pg-games-title">
        <div className="section-heading">
          <div>
            <p className="section-kicker">EXPLORE THE ARCADE</p>
            <h2 id="pg-games-title">어떤 게임부터 해볼까?</h2>
            <p className="section-description">준비 중인 게임들을 먼저 만나보세요.</p>
          </div>
          <Link href="/games" className="pg-text-link">게임 전체 보기 <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="game-grid pg-featured-grid">
          {games.slice(0, 3).map((game) => <GameCard key={game.id} game={game} />)}
        </div>
      </section>

      <section className="pg-experience-section section-block" aria-labelledby="pg-experience-title">
        <div className="section-heading">
          <div>
            <p className="section-kicker">ONE PLACE, MORE FUN</p>
            <h2 id="pg-experience-title">게임 그 이상, 함께하는 경험</h2>
            <p className="section-description">게임을 고른 다음의 경험도 차근차근 만들어가고 있어요.</p>
          </div>
        </div>
        <div className="pg-experience-grid">
          <Link href="/room" className="pg-experience-card pg-experience-room">
            <span className="pg-experience-icon" aria-hidden="true">▦</span>
            <span className="pg-experience-copy">
              <span className="pg-experience-label">LOBBY · 미리보기</span>
              <strong>친구와 모이는 대기실</strong>
              <span>참가자 자리와 방 정보가 어떻게 보일지 살펴보세요.</span>
              <span className="pg-experience-link">화면 살펴보기 ↗</span>
            </span>
            <span className="pg-experience-decor" aria-hidden="true">✳</span>
          </Link>
          <Link href="/play" className="pg-experience-card pg-experience-play">
            <span className="pg-experience-icon" aria-hidden="true">◈</span>
            <span className="pg-experience-copy">
              <span className="pg-experience-label">GAME STAGE · 미리보기</span>
              <strong>플레이 화면 디자인</strong>
              <span>게임이 실행될 무대와 조작 영역을 미리 확인해 보세요.</span>
              <span className="pg-experience-link">화면 살펴보기 ↗</span>
            </span>
            <span className="pg-experience-decor" aria-hidden="true">◇</span>
          </Link>
        </div>
      </section>

      <section className="pg-steps-section" aria-labelledby="pg-steps-title">
        <div className="pg-steps-intro">
          <p className="section-kicker">HOW IT WILL WORK</p>
          <h2 id="pg-steps-title">플레이가 시작되는 방법</h2>
          <p>정식 서비스에서 제공하고 싶은 흐름을 미리 소개해요.</p>
        </div>
        <div className="pg-steps">
          {steps.map((step) => (
            <div className="pg-step" key={step.number}>
              <div className="pg-step-top"><span>{step.number}</span><span className="pg-step-icon" aria-hidden="true">{step.icon}</span></div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pg-bottom-banner" aria-labelledby="pg-bottom-title">
        <div>
          <span className="pg-overline">BUILDING SOMETHING FUN</span>
          <h2 id="pg-bottom-title">즐거운 순간이 모이는 곳.</h2>
          <p>지금은 준비 중이지만, 드게임의 다음 장면은 여기서 시작돼요.</p>
        </div>
        <Link href="/games" className="pg-button pg-button-primary">게임 목록 보기 <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  );
}
