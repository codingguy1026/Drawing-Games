import Script from "next/script";
import "./globals.css";
import "./liquid-refraction.css";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: {
    default: "Drawing Games | 함께 즐기는 게임",
    template: "%s | Drawing Games",
  },
  description: "다양한 미니게임을 함께 즐기는 Drawing Games 플랫폼. 현재는 UI 미리보기 단계입니다.",
  icons: { icon: "/branding/drawing-games-logo.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <div className="app-shell">
          <SiteHeader />
          <main id="main-content" className="site-container site-main">
            {children}
          </main>
          <SiteFooter />
        </div>
        <Script src="/liquid-refraction.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
