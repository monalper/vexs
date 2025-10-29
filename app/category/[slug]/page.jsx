import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleList from "@/components/ArticleList";
import { fetchTagsByCategory, getPublicClient } from "@/lib/supabaseClient";
import { slugify } from "@/lib/slug";
import { formatDateLong } from "@/lib/date";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const grouped = await fetchTagsByCategory();
    const cats = Object.keys(grouped || {});
    return cats.map((c) => ({ slug: slugify(c) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const grouped = await fetchTagsByCategory();
  const cats = Object.keys(grouped || {});
  const catName = cats.find((c) => slugify(c) === params.slug) || "Category";
  return {
    title: `${catName} – Vexs News`,
    description: `Latest news in ${catName}`,
  };
}

async function fetchArticlesForCategorySlug(slug) {
  const grouped = await fetchTagsByCategory();
  const cats = Object.keys(grouped || {});
  const catName = cats.find((c) => slugify(c) === slug);
  if (!catName) return { catName: null, tags: [], articles: [] };
  const tags = grouped[catName] || [];
  const tagIds = tags.map((t) => t.id);
  if (tagIds.length === 0) return { catName, tags, articles: [] };

  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('articles')
    .select(`id, title, slug, content, thumbnail_url, thumbnail_source, published_at, status, tag:tags!articles_tag_id_fkey(id, name, slug)`)
    .eq('status', 'published')
    .in('tag_id', tagIds)
    .order('published_at', { ascending: false })
    .limit(60);
  if (error) return { catName, tags, articles: [] };

  const articles = (data || []).map((a) => ({
    ...a,
    excerpt: a.content ? a.content.replace(/<[^>]+>/g, " ").slice(0, 160) + (a.content.length > 160 ? "…" : "") : null,
    date_str: a.published_at ? formatDateLong(a.published_at) : null
  }));
  return { catName, tags, articles };
}

export default async function CategoryPage({ params }) {
  const { catName, tags, articles } = await fetchArticlesForCategorySlug(params.slug);

  return (
    <>
      <Header />
      <main className="container" role="main">
        {!catName ? (
          <>
            <h1 className="section-title">Category</h1>
            <p className="muted">Category not found.</p>
          </>
        ) : (
          <>
            <h1 className="section-title">{catName}</h1>
            {tags.length > 0 && (
              <div className="tags-wrap" style={{ marginBottom: 12 }}>
                {tags.map((t) => (
                  <a key={t.id} className="tag-chip" href={`/tag/${t.slug}`}>#{t.name}</a>
                ))}
              </div>
            )}
            {articles.length > 0 ? (
              <ArticleList articles={articles} layout="grid" />
            ) : (
              <p className="muted">No articles yet.</p>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

