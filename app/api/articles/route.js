import { getPublicClient } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;

  const supabase = getPublicClient();
  
  let query = supabase
    .from('articles')
    .select(`id, title, slug, content, thumbnail_url, thumbnail_source, published_at, status, tag:tags!articles_tag_id_fkey(id, name, slug)`, { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // If there's a search query, filter by title or content
  if (q) {
    query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const articles = (data || []).map((a) => ({
    ...a,
    excerpt: a.content ? a.content.replace(/<[^>]+>/g, " ").slice(0, 160) + (a.content.length > 160 ? "…" : "") : null,
    date_str: a.published_at ? new Date(a.published_at).toLocaleDateString('en-US', { timeZone: 'UTC' }) : null
  }));

  return NextResponse.json({
    articles,
    total: count,
    page,
    hasMore: offset + limit < count
  });
}
