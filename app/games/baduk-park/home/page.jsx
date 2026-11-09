import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "바둑공원 홈 | Drawing Games",
  description: "2023년에 시작된 바둑공원. 9·13·19줄 로컬 대국과 계가를 즐겨보세요.",
};

const stones = [
  [1, 1, "black"], [2, 1, "white"], [3, 1, "black"],
  [1, 2, "white"], [2, 2, "black"], [3, 2, "white"],
  [2, 3, "white"], [3, 3, "black"], [4, 3, "black"],
  [1, 4, "black"], [4, 4, "white"],
];

export default function BadukParkHome() {
  return (
    <main className={styles.home}>
      <div className={styles.wrap}>
        <nav className={styles.nav} aria-label="바둑공원 메뉴">
          <Link className={styles.brand} href="/games/baduk-park/home"><span aria-hidden="true">● ○</span> 바둑공원</Link>
          <Link href="/games">드게임으로 돌아가기 ↗</Link>
        </nav>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={styles.copy}>
            <span className={styles.eyebrow}>EST. 2023 · REBORN 2026</span>
            <h1 id="home-title">한 수의 여유,<br /><em>바둑공원.</em></h1>
            <p>작은 바둑판에서 시작된 오래된 프로젝트가 다시 문을 열었어요. 흑과 백, 그리고 당신의 다음 한 수.</p>
            <div className={styles.actions}>
              <Link className={styles.primary} href="/games/baduk-park">⚫ 로컬 대국 시작 <span aria-hidden="true">↗</span></Link>
              <a className={styles.secondary} href="#guide">바둑공원 둘러보기 ↓</a>
            </div>
            <p className={styles.small}>한 기기에서 두 사람이 번갈아 두는 대국을 지원합니다.</p>
          </div>
          <div className={styles.art} aria-label="흑백 바둑돌이 놓인 나무 바둑판 장식" role="img">
            <div className={styles.board}>
              {Array.from({ length: 25 }, (_, index) => {
                const x = index % 5;
                const y = Math.floor(index / 5);
                const stone = stones.find(([sx, sy]) => sx === x && sy === y);
                return <span key={index} className={styles.intersection}>{stone && <span className={stone[2] === "black" ? styles.black : styles.white} />}</span>;
              })}
            </div>
            <span className={styles.artCaption}>THE NEXT MOVE IS YOURS.</span>
          </div>
        </section>
        <section className={styles.section} id="guide" aria-labelledby="guide-title">
          <div className={styles.heading}><span className={styles.eyebrow}>WELCOME TO THE PARK</span><h2 id="guide-title">어떤 대국을 시작할까요?</h2></div>
          <div className={styles.cards}>
            <article className={styles.card}>
              <span className={styles.cardIcon} aria-hidden="true">⚫⚪</span>
              <span className={styles.tag}>지금 플레이 가능</span>
              <h3>로컬 대국</h3>
              <p>9·13·19줄 바둑판, 따내기와 패 규칙, 패스 후 합의 계가까지. 한 화면에서 마주 앉아 두세요.</p>
              <Link href="/games/baduk-park">대국실 입장 ↗</Link>
            </article>
            <article className={styles.card}>
              <span className={styles.cardIcon} aria-hidden="true">🌐</span>
              <span className={styles.tagMuted}>개발 중</span>
              <h3>온라인 대국</h3>
              <p>서로 다른 기기에서 함께 두는 실시간 대국을 준비하고 있어요. 준비되면 이곳에서 안내할게요.</p>
              <span className={styles.unavailable}>아직 입장할 수 없어요</span>
            </article>
            <article className={styles.card}>
              <span className={styles.cardIcon} aria-hidden="true">🌳</span>
              <span className={styles.tagMuted}>바둑공원 이야기</span>
              <h3>2023년부터</h3>
              <p>처음 만들었던 바둑공원의 초록빛을 간직한 채, 더 편리한 대국실로 조금씩 자라고 있어요.</p>
              <a href="#about">프로젝트 소개 ↓</a>
            </article>
          </div>
        </section>
        <section className={styles.about} id="about">
          <span className={styles.eyebrow}>A LITTLE HISTORY</span>
          <h2>오래된 이름, 새로운 바둑판.</h2>
          <p>바둑공원은 2023년에 시작된 프로젝트를 되살린 공간입니다. 현재는 로컬 대국을 즐길 수 있으며, 온라인 기능은 별도로 개발하고 있어요.</p>
          <Link href="/games/baduk-park">바둑 한 판 두러 가기 ↗</Link>
        </section>
        <footer className={styles.footer}><span>© Drawing Games · 바둑공원</span><Link href="/games">전체 게임 보기</Link></footer>
      </div>
    </main>
  );
}
