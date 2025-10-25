import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About",
  description: "About vexs"
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="container" role="main">
        <h1 className="section-title">About</h1>
        <div className="article-wrap">
          <p>
            vexs produces in‑depth coverage across science, technology and current affairs with a trusted, fast and independent approach. Our aim is to deliver verified information and a clean reading experience.
          </p>
          <p>
            Our editorial principles are accuracy, transparency and public interest. We clearly distinguish between opinion, analysis and news; and we cite our sources whenever possible.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

