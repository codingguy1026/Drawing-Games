import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-inner">
        <div>
          <strong>Drawing Games</strong>
          <p>게임은 여럿, 즐거움은 함께.</p>
        </div>
        <div className="footer-links">
          <Link href="/games">게임 목록</Link>
          <Link href="/room">대기실 미리보기</Link>
          <span>현재 프론트엔드 미리보기 단계</span>
        </div>
      </div>
    </footer>
  );
}
