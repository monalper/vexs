import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy",
  description: "How we handle personal data and privacy"
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="container" role="main">
        <h1 className="section-title">Privacy Policy</h1>
        <div className="article-wrap">
          <p>
            Your privacy matters to us. This policy explains what data we collect, how we use it, and your rights.
          </p>
          <h2>Data Collected</h2>
          <p>
            We may collect visit statistics, device/browser information and contact details voluntarily shared (e.g., email).
          </p>
          <h2>Use of Data</h2>
          <p>
            Data may be processed to improve service quality, for security, statistics and communications purposes.
          </p>
          <h2>Your Rights</h2>
          <p>
            To exercise your access, rectification or deletion rights, please <a href="/contact">contact us</a>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

