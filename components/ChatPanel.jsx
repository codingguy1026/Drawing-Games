export default function ChatPanel() {
  return (
    <section className="panel chat-panel" aria-labelledby="chat-heading">
      <div className="panel-header">
        <h2 id="chat-heading">채팅</h2>
        <span className="subtle-tag">미구현</span>
      </div>
      <div className="chat-messages" aria-live="off">
        <p className="chat-empty">채팅 메시지가 표시될 자리예요.</p>
      </div>
      <div className="chat-input-row">
        <input aria-label="채팅 메시지" placeholder="메시지 입력 (준비 중)" disabled />
        <button className="btn btn-primary" type="button" disabled>전송</button>
      </div>
    </section>
  );
}
