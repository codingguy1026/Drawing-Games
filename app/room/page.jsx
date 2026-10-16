import Link from "next/link";
import ChatPanel from "../../components/ChatPanel";
import PreviewNotice from "../../components/PreviewNotice";

export const metadata = { title: "게임 대기실 미리보기" };

const seats = [
  { name: "참가자 1", note: "방장 (예시)", occupied: true },
  { name: "빈자리", note: "참가자 대기", occupied: false },
  { name: "빈자리", note: "참가자 대기", occupied: false },
  { name: "빈자리", note: "참가자 대기", occupied: false },
];

export default function RoomPage() {
  return (
    <div className="page-stack">
      <div className="breadcrumb"><Link href="/">홈</Link><span>/</span><span>게임 대기실</span></div>
      <div className="page-heading compact">
        <p className="section-kicker">ROOM PREVIEW</p>
        <h1>게임 대기실 <span className="status-pill">예시 화면</span></h1>
        <p>게임: 미선택 · 실제 참가자나 연결된 방은 없어요.</p>
      </div>
      <PreviewNotice>이 화면은 가상 대기실 미리보기입니다. 입장, 준비, 게임 시작, 채팅, 음성 통신은 아직 지원하지 않습니다.</PreviewNotice>
      <div className="content-layout">
        <div className="content-main">
          <section className="panel room-main">
            <div className="panel-header"><h2>참가자 <span className="count-muted">1 / 4 (예시)</span></h2><span className="subtle-tag">미리보기</span></div>
            <div className="seats-grid">
              {seats.map((seat, index) => (
                <article className={seat.occupied ? "seat seat-filled" : "seat"} key={index}>
                  <div className="seat-avatar" aria-hidden="true">{seat.occupied ? "☺" : "＋"}</div>
                  <div><strong>{seat.name}</strong><span>{seat.note}</span></div>
                </article>
              ))}
            </div>
            <div className="room-actions">
              <button className="btn btn-outline" disabled type="button">준비하기</button>
              <button className="btn btn-primary" disabled type="button">게임 시작</button>
              <Link className="btn btn-ghost" href="/play">플레이 화면 미리보기 ↗</Link>
            </div>
          </section>
          <section className="panel info-panel">
            <h2>방 정보</h2>
            <div className="info-grid">
              <div><span>방 이름</span><strong>예시 게임방</strong></div>
              <div><span>선택한 게임</span><strong>미정</strong></div>
              <div><span>공개 여부</span><strong>예시</strong></div>
              <div><span>준비 상태</span><strong>미구현</strong></div>
            </div>
          </section>
        </div>
        <aside className="sidebar">
          <section className="panel sidebar-panel">
            <div className="panel-header"><h2>음성방</h2><span className="subtle-tag">미구현</span></div>
            <div className="voice-placeholder"><span className="voice-icon" aria-hidden="true">♪</span><strong>음성 연결 전</strong><p>친구들과 이야기할 수 있는 공간이 될 거예요.</p></div>
            <button className="btn btn-outline full-width" disabled type="button">마이크 설정</button>
          </section>
          <ChatPanel />
        </aside>
      </div>
    </div>
  );
}
