import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchPageClient from "@/components/SearchPageClient";
import { getPublicClient } from "@/lib/supabaseClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Search",
  description: "Search news and articles"
};

async function getInitialArticles(q) {
  // Only fetch initial articles if there's a search query
  // Otherwise, let the client component handle fetching all articles
  if (!q) return [];
  
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('articles')
    .select(`id, title, slug, content, thumbnail_url, thumbnail_source, published_at, status, tag:tags!articles_tag_id_fkey(id, name, slug)`) 
    .eq('status', 'published')
    .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
    .order('published_at', { ascending: false })
    .limit(10);
  
  if (error) return [];
  
  return (data || []).map((a) => ({
    ...a,
    excerpt: a.content ? a.content.replace(/<[^>]+>/g, " ").slice(0, 160) + (a.content.length > 160 ? "…" : "") : null,
    date_str: a.published_at ? new Date(a.published_at).toLocaleDateString('en-US', { timeZone: 'UTC' }) : null
  }));
}

export default async function SearchPage({ searchParams }) {
  const q = (searchParams?.q || '').toString();
  const initialArticles = await getInitialArticles(q);
  
  return (
    <>
      <Header />
      <main className="container" role="main">
        <h1 className="section-title">Search</h1>
        <SearchPageClient initialArticles={initialArticles} initialQuery={q} />
      </main>
      <Footer />
    </>
  );
}

