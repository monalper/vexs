import { fetchTagsByCategory } from "@/lib/supabaseClient";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";

export default async function Footer() {
  const grouped = await fetchTagsByCategory();
  const categories = Object.keys(grouped).sort((a, b) => a.localeCompare(b));
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Category columns (BBC/Guardian-style multi-column) */}
        {categories.length > 0 && (
          <div className="footer-categories" aria-label="Tag categories">
            {categories.map((cat) => (
              <div key={cat} className="footer-cat">
                <div className="footer-cat-title">{cat.toUpperCase()}</div>
                <ul className="footer-cat-list">
                  {grouped[cat].map((t) => (
                    <li key={t.id}><a href={`/tag/${t.slug}`}>{t.name}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Bottom bar: brand • links • social */}
        <div className="footer-end">
          <a href="/" className="footer-brand" aria-label="vexsnews homepage">
            <img src="/footerlogo.svg" alt="vexsnews" className="footer-logo" />
          </a>
          <div className="footer-endlinks" role="navigation" aria-label="Footer links">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/search">Search</a>
            <a href="/rss.xml">RSS</a>
            <a href="/sitemap.xml">Sitemap</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
            <a href="/cookies">Cookies</a>
          </div>
          <div className="footer-social" aria-label="Sosyal medya">
            <a
              href="https://x.com/TheVexsSpace"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              title="X"
            >
              <FaXTwitter aria-hidden />
            </a>
            <a
              href="https://www.instagram.com/vexsnews/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <FaInstagram aria-hidden />
            </a>
          </div>
        </div>

        {/* Legal line */}
        <div className="footer-legal" role="contentinfo">
          © {year} Vexs Space. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
