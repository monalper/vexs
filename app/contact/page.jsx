import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact",
  description: "Contact vexs"
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="container" role="main">
        <h1 className="section-title">Contact</h1>
        <div className="article-wrap">
          <p>For feedback, suggestions and partnerships, reach us at:</p>
          <ul>
            <li>Email: <a href="mailto:iaercan@hotmail.com">iaercan@hotmail.com</a></li>
            <li>RSS: <a href="/rss.xml">/rss.xml</a></li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}

