"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchTagsByCategory } from "@/lib/supabaseClient";
import { slugify } from "@/lib/slug";
import { FiSearch } from "react-icons/fi";

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

  // Prevent page scroll when mobile nav is open
  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [open]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const grouped = await fetchTagsByCategory();
        const cats = Object.keys(grouped || {})
          .filter((c) => c && c.toLowerCase() !== "other")
          .map((c) => ({ name: c, slug: slugify(c) }));
        if (mounted) setCategories(cats);
      } catch {
        // fail silently; keep base links
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <header className={`site-header ${open ? 'is-open' : ''}`}>
      <div className="container header-bar">
        <Link href="/" className="site-title" aria-label="vexs homepage">
          <img src="/logo.svg" alt="vexs logo" className="site-logo" />
        </Link>
        <button
          className={`mobile-nav-toggle ${open ? 'is-open' : ''}`}
          aria-label="Toggle menu"
          aria-controls="site-nav"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="hamburger" aria-hidden="true"></span>
        </button>
        <nav id="site-nav" className={`nav ${open ? "is-open" : ""}`} aria-label="Main navigation">
          <Link href="/" prefetch>Latest</Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} prefetch>{c.name}</Link>
          ))}
          <Link href="/search" prefetch>Search</Link>
          {/* Minimal mobile search (news) */}
          <div className="mobile-search">
            <form className="mobile-search-form" action="/search" role="search">
              <FiSearch className="mobile-search-icon" aria-hidden />
              <input
                className="mobile-search-input"
                type="search"
                name="q"
                placeholder="Haberlerde ara"
                aria-label="Ara"
                autoComplete="off"
                spellCheck={false}
              />
            </form>
          </div>
        </nav>
      </div>
    </header>
  );
}
