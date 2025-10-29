import { createClient } from "@supabase/supabase-js";
import { formatDateLong } from "@/lib/date";

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
    excerpt: a.content ? a.content.replace(/<[^>]+>/g, " ").slice(0, 160) + (a.content.length > 160 ? "…" : "") : null,
    date_str: a.published_at ? formatDateLong(a.published_at) : null
  }));
  return articles;
}

export async function fetchArticleBySlug(slug) {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("articles")
    .select(
      `id, title, slug, content, thumbnail_url, thumbnail_source, published_at, status,
       tag:tags!articles_tag_id_fkey(id, name, slug, category),
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
    .select("id, name, slug, category")
    .order("name");
  if (error) throw error;
  return data || [];
}

// Group tags by their text category for footer/navigation use
export async function fetchTagsByCategory() {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("tags")
    .select("id, name, slug, category")
    .order("category", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;

  const grouped = {};
  for (const t of data || []) {
    const key = (t.category && t.category.trim()) ? t.category.trim() : "Other";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({ id: t.id, name: t.name, slug: t.slug });
  }
  return grouped; // { [category]: Array<{id,name,slug}> }
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

// Fetch latest published articles where their tag belongs to a given category
export async function fetchPublishedArticlesByTagCategory(category, { limit = 6, offset = 0 } = {}) {
  const supabase = getPublicClient();

  // Determine tag ids for this category
  let tagIds = [];
  if (!category) return [];

  // Special handling: our UI groups missing/blank categories as "Other"
  // For "Other", include tags whose category is NULL or an empty string
  if (category === 'Other') {
    const { data: nullCats, error: errNull } = await supabase
      .from('tags')
      .select('id, category')
      .is('category', null);
    if (errNull) throw errNull;
    const { data: emptyCats, error: errEmpty } = await supabase
      .from('tags')
      .select('id, category')
      .eq('category', '');
    if (errEmpty) throw errEmpty;
    tagIds = [...(nullCats || []), ...(emptyCats || [])].map((t) => t.id).filter(Boolean);
  } else {
    const { data: tagRows, error: tagErr } = await supabase
      .from('tags')
      .select('id')
      .eq('category', category);
    if (tagErr) throw tagErr;
    tagIds = (tagRows || []).map((t) => t.id).filter(Boolean);
  }

  if (!tagIds.length) return [];

  const { data, error } = await supabase
    .from('articles')
    .select(
      `id, title, slug, content, thumbnail_url, thumbnail_source, published_at, status,
       tag:tags!articles_tag_id_fkey(id, name, slug, category)`
    )
    .eq('status', 'published')
    .in('tag_id', tagIds)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;

  return (data || []).map((a) => ({
    ...a,
    excerpt: a.content ? a.content.replace(/<[^>]+>/g, ' ').slice(0, 160) + (a.content.length > 160 ? '…' : '') : null,
    date_str: a.published_at ? formatDateLong(a.published_at) : null,
  }));
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

// Return slugs of published articles that match a specific tag id
export async function fetchArticleSlugsByTagId(tagId, { excludeSlug, limit = 100 } = {}) {
  if (!tagId) return [];
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("articles")
    .select("slug, published_at")
    .eq("status", "published")
    .eq("tag_id", tagId)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  let slugs = (data || []).map((r) => r.slug);
  if (excludeSlug) slugs = slugs.filter((s) => s !== excludeSlug);
  return slugs;
}

// Return slugs of published articles whose tag is in a given category
export async function fetchArticleSlugsByTagCategory(category, { excludeSlug, excludeTagId, limit = 200 } = {}) {
  if (!category) return [];
  const supabase = getPublicClient();
  // First, find all tag ids in this category
  const { data: tagRows, error: tagErr } = await supabase
    .from("tags")
    .select("id")
    .eq("category", category);
  if (tagErr) throw tagErr;
  const tagIds = (tagRows || []).map((t) => t.id).filter(Boolean);
  if (!tagIds.length) return [];

  const idsToUse = excludeTagId ? tagIds.filter((id) => id !== excludeTagId) : tagIds;
  if (!idsToUse.length) return [];

  const { data, error } = await supabase
    .from("articles")
    .select("slug, tag_id, published_at")
    .eq("status", "published")
    .in("tag_id", idsToUse)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  let slugs = (data || []).map((r) => r.slug);
  if (excludeSlug) slugs = slugs.filter((s) => s !== excludeSlug);
  return slugs;
}
