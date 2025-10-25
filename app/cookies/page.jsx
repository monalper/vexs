import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Cookies",
  description: "Cookie usage and preferences"
};

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="container" role="main">
        <h1 className="section-title">Cookies</h1>
        <div className="article-wrap">
          <p>
            We may use cookies to improve your experience and analyse site traffic.
          </p>
          <h2>Cookie Types</h2>
          <ul>
            <li>Session cookies (necessary functions)</li>
            <li>Analytics cookies (performance and usage statistics)</li>
          </ul>
          <h2>Preferences</h2>
          <p>
            You can manage or delete cookies from your browser settings.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

