export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="site-title" aria-label="vexs">vexs.space</div>
            <p className="muted footer-desc">
              Trusted, fast and independent news. Stay up to date with curated coverage of technology, science and current affairs.
            </p>
          </div>
          <div className="footer-col">
            <strong>Company</strong>
            <ul className="footer-list">
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="#">Advertising</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <strong>Quick Links</strong>
            <ul className="footer-list">
              <li><a href="/search">Search</a></li>
              <li><a href="/rss.xml">RSS</a></li>
              <li><a href="/sitemap.xml">Sitemap</a></li>
              <li><a href="/robots.txt">Robots.txt</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <strong>Legal</strong>
            <ul className="footer-list">
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Use</a></li>
              <li><a href="/cookies">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="muted">© {year} vexs — All rights reserved.</p>
          <div className="muted footer-locale">
            <span>EN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

