import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Use",
  description: "vexs service terms"
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="container" role="main">
        <h1 className="section-title">Terms of Use</h1>
        <div className="article-wrap">
          <p>
            All content on this site is provided for informational purposes only. Use of content is subject to copyright, attribution and fair-use principles. Unauthorised copying, commercial reproduction or republication is prohibited.
          </p>

          <h2>Disclaimer</h2>
          <p>
            The articles, analyses and opinions published here reflect the authors’ personal views. Any interpretation and conclusions drawn from the content are entirely the reader’s responsibility.
          </p>
          <p>
            Nothing on this site constitutes legal, financial, medical or professional advice. Readers should interpret the content critically and independently.
          </p>
          <p>
            vexs cannot be held responsible for misunderstandings, misjudgements or outcomes arising directly or indirectly from the site’s content. Authors are not liable for any direct or indirect damages resulting from reading, sharing or interpreting any content.
          </p>
          <p>
            Links are provided for informational purposes only. vexs is not responsible for the content or opinions expressed on external sites.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

