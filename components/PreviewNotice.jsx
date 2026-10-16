export default function PreviewNotice({ children }) {
  return (
    <div className="preview-notice" role="note">
      <span className="notice-icon" aria-hidden="true">ⓘ</span>
      <span>{children || "현재 화면은 UI 미리보기입니다. 실제 멀티플레이 기능은 아직 구현되지 않았어요."}</span>
    </div>
  );
}
