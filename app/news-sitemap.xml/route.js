import { NextResponse } from "next/server";
import { fetchPublishedArticles } from "@/lib/supabaseClient";
import { SITE } from "@/lib/seo";

export const revalidate = 300;

export async function GET() {
  const items = await fetchPublishedArticles({ limit: 100 });
  const withinTwoDays = items.filter((a) => {
    if (!a.published_at) return false;
    const d = new Date(a.published_at).getTime();
    return Date.now() - d < 2 * 24 * 60 * 60 * 1000;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${withinTwoDays
  .map((a) => {
    const url = `${SITE.url}/articles/${a.slug}`;
    const pub = a.published_at ? new Date(a.published_at).toISOString() : new Date().toISOString();
    const title = a.title.replace(/&/g, '&amp;');
    return `<url>
      <loc>${url}</loc>
      <news:news>
        <news:publication>
          <news:name>${SITE.name}</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${pub}</news:publication_date>
        <news:title>${title}</news:title>
      </news:news>
    </url>`;
  })
  .join('\n')}
</urlset>`;
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml; charset=UTF-8' } });
}
