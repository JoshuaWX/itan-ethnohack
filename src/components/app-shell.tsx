"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { BookOpen, Compass, Leaf, Search } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  const nav = [
    { href: "/", label: "Discover", icon: Compass },
    { href: "/plants", label: "Plants", icon: Leaf },
    { href: "/awareness", label: "Awareness", icon: BookOpen },
  ];
  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" || pathname.startsWith("/products/") : pathname.startsWith(href);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="header">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="Itan home">
            <span className="brand-symbol">
              <Leaf size={20} />
            </span>
            <span>
              ìtàn<span className="brand-dot">.</span>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                className={
                  isCurrent(href)
                    ? "active"
                    : ""
                }
                href={href}
                aria-current={isCurrent(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link className="header-search" href="/#explore">
            <Search size={17} />
            <span>Explore the guide</span>
          </Link>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <Link className="footer-brand" href="/">
              ìtàn<span>.</span>
            </Link>
            <p>A clearer view of plant knowledge.</p>
          </div>
          <div className="footer-note">
            <strong>Made for curiosity, grounded in evidence.</strong>
            <p>
              Research prototype · Nigeria
              <br />
              Information here is not medical advice.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>EthnoHack 2026 · Track 4</span>
          <span>Sources are linked throughout.</span>
        </div>
      </footer>
      <nav className="mobile-nav" aria-label="Main navigation">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            className={
              isCurrent(href)
                ? "active"
                : ""
            }
            href={href}
            aria-current={isCurrent(href) ? "page" : undefined}
          >
            <Icon size={19} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
