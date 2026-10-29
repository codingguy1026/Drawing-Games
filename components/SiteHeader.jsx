"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", title: "홈" },
  { href: "/games", title: "게임 탐색" },
  { href: "/room", title: "대기실" },
  { href: "/play", title: "플레이 화면" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="site-header glass-panel">
      <div className="site-container header-inner pg-header-inner">
        <Link className="brand pg-brand" href="/" aria-label="Drawing Games 홈">
          <span className="pg-brand-icon">
            <Image className="brand-logo-image" src="/branding/drawing-games-logo.svg" alt="" width={48} height={32} priority />
          </span>
          <span className="pg-brand-copy"><span className="brand-name">Drawing <span>Games</span></span><span className="pg-brand-caption">PLAY TOGETHER</span></span>
        </Link>
        <nav className="nav-links pg-nav-links" aria-label="주 메뉴">
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
        <span className="pg-header-badge"><span className="pg-signal" /> PREVIEW</span>
      </div>
    </header>
  );
}
