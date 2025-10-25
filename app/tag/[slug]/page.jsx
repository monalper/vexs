import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleList from "@/components/ArticleList";
import { fetchPublishedArticles, fetchTagBySlug, fetchAllTags } from "@/lib/supabaseClient";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const tags = await fetchAllTags();
    return tags.map((t) => ({ slug: t.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const tag = await fetchTagBySlug(params.slug);
  if (!tag) return { title: 'Tag' };
  return {
    title: `${tag.name} News`,
    description: `Latest news and analysis about ${tag.name}.`,
    alternates: { canonical: `https://vexs.space/tag/${tag.slug}` }
  };
}

export default async function TagPage({ params }) {
  const tag = await fetchTagBySlug(params.slug);
  const articles = await fetchPublishedArticles({ limit: 30, tagSlug: params.slug });

  if (!tag) {
    return (
      <div className="container" style={{ padding: 24 }}>
        <h1>Tag not found</h1>
        <p className="muted">This tag or category does not exist.</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="container" role="main">
        <h1 className="section-title">#{tag.name} News</h1>
        <ArticleList articles={articles} />
      </main>
      <Footer />
    </>
  );
}

