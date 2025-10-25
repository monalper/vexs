import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleList from "@/components/ArticleList";
import { getPublicClient } from "@/lib/supabaseClient";
import { FiSearch } from "react-icons/fi";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Search",
  description: "Search news and articles"
};

async function searchArticles(q) {
  if (!q) return [];
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('articles')
    .select(`id, title, slug, content, thumbnail_url, published_at, status, tag:tags!articles_tag_id_fkey(id, name, slug)`) 
    .eq('status', 'published')
    .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
    .order('published_at', { ascending: false })
    .limit(50);
  if (error) return [];
  return (data || []).map((a) => ({
    ...a,
    excerpt: a.content ? a.content.replace(/<[^>]+>/g, " ").slice(0, 160) + (a.content.length > 160 ? "…" : "") : null,
    date_str: a.published_at ? new Date(a.published_at).toLocaleDateString('en-US', { timeZone: 'UTC' }) : null
  }));
}

export default async function SearchPage({ searchParams }) {
  const q = (searchParams?.q || '').toString();
  const articles = await searchArticles(q);
  return (
    <>
      <Header />
      <main className="container" role="main">
        <h1 className="section-title">Search</h1>
        <form action="/search" method="get" className="search-bar">
          <input
            className="search-input"
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by keyword or title"
            aria-label="Search"
          />
          <button className="search-submit" type="submit" aria-label="Search">
            <FiSearch aria-hidden size={18} />
          </button>
        </form>
        {q ? <p className="muted">Search: "{q}"</p> : <p className="muted">Enter a search term.</p>}
        <ArticleList articles={articles} />
      </main>
      <Footer />
    </>
  );
}

