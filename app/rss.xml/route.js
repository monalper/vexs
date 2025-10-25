import { NextResponse } from "next/server";
import { fetchPublishedArticles } from "@/lib/supabaseClient";
import { SITE } from "@/lib/seo";

export const revalidate = 300;

export async function GET() {
  const items = await fetchPublishedArticles({ limit: 100 });
  const now = new Date().toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${SITE.name}]]></title>
    <link>${SITE.url}</link>
    <description><![CDATA[${SITE.name} — news and analysis]]></description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items
      .map((a) => {
        const url = `${SITE.url}/articles/${a.slug}`;
        const pub = a.published_at ? new Date(a.published_at).toUTCString() : now;
        return `<item>
          <title><![CDATA[${a.title}]]></title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <pubDate>${pub}</pubDate>
          ${a.excerpt ? `<description><![CDATA[${a.excerpt}]]></description>` : ''}
        </item>`;
      })
      .join('\n')}
  </channel>
</rss>`;
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=UTF-8' } });
}

