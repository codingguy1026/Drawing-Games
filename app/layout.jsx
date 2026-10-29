import Script from "next/script";
import "./globals.css";
import "./drawing-id.css";
import "./liquid-refraction.css";
import "./playground.css";
import DrawingIdAuth from "../components/DrawingIdAuth";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: {
    default: "Drawing Games | 함께 즐기는 게임",
    template: "%s | Drawing Games",
  },
  description: "다양한 파티 게임이 모이는 Drawing Games. Project PLAYGROUND 디자인 미리보기 단계입니다.",
  icons: { icon: "/branding/drawing-games-logo.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <div className="app-shell">
          <SiteHeader />
          <main id="main-content" className="site-container site-main">
            {children}<DrawingIdAuth />
          </main>
          <SiteFooter />
        </div>
        <Script src="/liquid-refraction.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
