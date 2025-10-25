import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container" style={{ padding: 24 }}>
        <h1>Page not found</h1>
        <p className="muted">The page you are looking for may have moved or no longer exists.</p>
      </main>
      <Footer />
    </>
  );
}

