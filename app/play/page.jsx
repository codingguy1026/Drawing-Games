import Link from "next/link";
import ChatPanel from "../../components/ChatPanel";
import PreviewNotice from "../../components/PreviewNotice";

export const metadata = { title: "플레이 화면 미리보기" };

export default function PlayPage() {
  return (
    <div className="page-stack">
      <div className="breadcrumb"><Link href="/">홈</Link><span>/</span><Link href="/room">게임 대기실</Link><span>/</span><span>플레이</span></div>
      <div className="page-heading compact">
        <p className="section-kicker">GAME PREVIEW</p>
        <h1>게임 플레이 <span className="status-pill">예시 화면</span></h1>
        <p>실제 게임을 실행하는 화면이 아닌 플레이 영역의 레이아웃 미리보기입니다.</p>
      </div>
      <PreviewNotice>게임 엔진, 점수 계산, 실시간 참가자 연결은 아직 구현되지 않았습니다.</PreviewNotice>
      <div className="content-layout">
        <div className="content-main">
          <section className="panel stage-panel">
            <div className="stage-toolbar">
              <div><span className="section-kicker">GAME STATUS</span><strong>게임 미선택</strong></div>
              <div className="stage-tags"><span className="status-pill">상태: 미구현</span><span className="status-pill">시간: --:--</span></div>
            </div>
            <div className="game-stage" id="drawingCanvas">
              <div className="stage-placeholder">
                <span className="stage-placeholder-icon" aria-hidden="true">◈</span>
                <h2>게임 화면이 들어올 자리</h2>
                <p>선택한 게임에 따라 이 공간의 내용이 바뀌게 됩니다.</p>
              </div>
            </div>
            <div className="stage-controls">
              <div className="control-info">게임별 조작 도구 자리</div>
              <div className="room-actions">
                <button className="btn btn-outline" disabled type="button">일시정지</button>
                <Link className="btn btn-ghost" href="/room">대기실로 돌아가기 ↗</Link>
              </div>
            </div>
          </section>
        </div>
        <aside className="sidebar">
          <section className="panel sidebar-panel">
            <div className="panel-header"><h2>참가자</h2><span className="subtle-tag">예시</span></div>
            <div className="member-item"><span className="member-avatar" aria-hidden="true">☺</span><div><strong>참가자 1</strong><p>점수: 미구현</p></div></div>
            <div className="member-item"><span className="member-avatar" aria-hidden="true">＋</span><div><strong>빈자리</strong><p>참가자 대기</p></div></div>
          </section>
          <section className="panel sidebar-panel">
            <div className="panel-header"><h2>음성방</h2><span className="subtle-tag">미구현</span></div>
            <p className="panel-description">마이크와 음성 연결 상태를 표시할 자리예요.</p>
            <button className="btn btn-outline full-width" disabled type="button">마이크 설정</button>
          </section>
          <ChatPanel />
        </aside>
      </div>
    </div>
  );
}
