"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", title: "홈" },
  { href: "/games", title: "게임 목록" },
  { href: "/room", title: "대기실 미리보기" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header glass-panel">
      <div className="site-container header-inner">
        <Link className="brand" href="/" aria-label="Drawing Games 홈">
          <Image className="brand-logo-image" src="/branding/drawing-games-logo.png" alt="" width={54} height={33} priority />
          <span className="brand-name">Drawing<span>Games</span></span>
          <span className="brand-beta">PREVIEW</span>
        </Link>
        <nav className="nav-links" aria-label="주 메뉴">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "nav-link current" : "nav-link"}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <span className="header-status">● UI 개발 중</span>
      </div>
    </header>
  );
}
