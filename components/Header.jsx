"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 720 && open) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  // Close menu when route changes
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className="site-header">
      <div className="container header-bar">
        <Link href="/" className="site-title" aria-label="vexs homepage">
          <img src="/logo.svg" alt="vexs logo" className="site-logo" />
        </Link>
        <button
          className="mobile-nav-toggle"
          aria-label="Toggle menu"
          aria-controls="site-nav"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="hamburger" aria-hidden="true"></span>
        </button>
        <nav id="site-nav" className={`nav ${open ? "is-open" : ""}`} aria-label="Main navigation">
          <Link href="/" prefetch>Latest News</Link>
          <Link href="/search" prefetch>Search</Link>
        </nav>
      </div>
    </header>
  );
}
