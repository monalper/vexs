import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getPublicClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase ortam değişkenleri eksik: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
}

// Server-side service client moved to lib/supabaseServer.js

export async function fetchPublishedArticles({ limit = 20, offset = 0, tagSlug } = {}) {
  const supabase = getPublicClient();

  let tagFilterId = null;
  if (tagSlug) {
    const { data: t } = await supabase.from('tags').select('id,slug').eq('slug', tagSlug).single();
    tagFilterId = t?.id ?? null;
  }

  let query = supabase
    .from("articles")
    .select(
      `id, title, slug, content, thumbnail_url, thumbnail_source, published_at, status,
       tag:tags!articles_tag_id_fkey(id, name, slug)`
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (tagFilterId) {
    query = query.eq('tag_id', tagFilterId);
  }

  const { data, error } = await query;
  if (error) throw error;

  // compute excerpt safely (first 160 chars of content without tags)
  const articles = (data || []).map((a) => ({
    ...a,
    excerpt: a.content ? a.content.replace(/<[^>]+>/g, " ").slice(0, 160) + (a.content.length > 160 ? "…" : "") : null
  }));
  return articles;
}

export async function fetchArticleBySlug(slug) {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("articles")
    .select(
      `id, title, slug, content, thumbnail_url, thumbnail_source, published_at, status,
       tag:tags!articles_tag_id_fkey(id, name, slug),
       author:users!articles_author_id_fkey(id, name)`
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error) return null;
  return data;
}

export async function fetchAllTags() {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("tags")
    .select("id, name, slug")
    .order("name");
  if (error) throw error;
  return data || [];
}

export async function fetchTagBySlug(slug) {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("tags")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function fetchArticleSlugs(limit = 1000) {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("articles")
    .select("slug")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []).map((r) => r.slug);
}
