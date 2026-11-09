export const metadata = {
  title: "바둑공원 | Drawing Games",
  description: "9·13·19줄 로컬 바둑. 포획·패·슈퍼코와 한국·일본·중국 방식의 합의 계가를 지원합니다.",
};

export default function BadukParkPage() {
  return (
    <main style={{ minHeight: "100vh", width: "100%" }}>
      <iframe
        title="바둑공원 로컬 대국과 합의 계가"
        src="/baduk-park/index.html"
        style={{ display: "block", width: "100%", height: "min(1100px, 145vh)", minHeight: 780, border: 0 }}
        loading="eager"
      />
    </main>
  );
}
