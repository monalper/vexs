import { SITE } from "@/lib/seo";
import { fetchArticleSlugs, fetchAllTags } from "@/lib/supabaseClient";

export default async function sitemap() {
  const base = SITE.url;
  const staticRoutes = [
    '',
    '/search'
  ].map((p) => ({ url: `${base}${p}`, changeFrequency: 'daily', priority: 0.8 }));

  let articleRoutes = [];
  let tagRoutes = [];
  try {
    const [slugs, tags] = await Promise.all([fetchArticleSlugs(1000), fetchAllTags()]);
    articleRoutes = slugs.map((slug) => ({ url: `${base}/articles/${slug}`, changeFrequency: 'hourly', priority: 0.9 }));
    tagRoutes = tags.map((t) => ({ url: `${base}/tag/${t.slug}`, changeFrequency: 'daily', priority: 0.6 }));
  } catch {}

  return [...staticRoutes, ...articleRoutes, ...tagRoutes];
}

