export const metadata = {
  title: "바둑공원 | Drawing Games",
  description: "2023년 바둑공원의 복원판에서 19×19 바둑판을 체험해 보세요.",
};

export default function BadukParkPage() {
  return (
    <main style={{ minHeight: "100vh", width: "100%" }}>
      <iframe
        title="바둑공원 19×19 바둑판"
        src="/baduk-park/index.html"
        style={{ display: "block", width: "100%", height: "min(1100px, 145vh)", minHeight: 780, border: 0 }}
        loading="eager"
      />
    </main>
  );
}
