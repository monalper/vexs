import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Image from "next/image";
import { fetchArticleBySlug, fetchArticleSlugs } from "@/lib/supabaseClient";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { newsArticleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { sanitizeHtml } from "@/lib/sanitize";

export const revalidate = 300; // 5 minutes

export async function generateStaticParams() {
  // Pre-generate some article pages (best-effort)
  try {
    const slugs = await fetchArticleSlugs(100);
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const article = await fetchArticleBySlug(params.slug);
  if (!article) return { title: "Not found" };
  const url = `https://vexs.space/articles/${article.slug}`;
  const description = article.content ? article.content.replace(/<[^>]+>/g, " ").slice(0, 160) : undefined;
  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description,
      images: article.thumbnail_url ? [{ url: article.thumbnail_url, width: 1200, height: 630 }] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: article.thumbnail_url ? [article.thumbnail_url] : undefined
    }
  };
}

export default async function ArticlePage({ params }) {
  const article = await fetchArticleBySlug(params.slug);
  if (!article) {
    return (
      <div className="container" style={{ padding: 24 }}>
        <h1>Content not found</h1>
        <p className="muted">The article you are looking for may not be published or may have been removed.</p>
      </div>
    );
  }

  const crumbs = [
    { label: 'Home', href: '/' },
    article.tag ? { label: article.tag.name, href: `/tag/${article.tag.slug}` } : null,
    { label: article.title, href: `/articles/${article.slug}` }
  ].filter(Boolean);

  const plain = article.content ? article.content.replace(/<[^>]+>/g, ' ') : '';
  const words = plain.trim() ? plain.trim().split(/\s+/).length : 0;
  const readMin = Math.max(1, Math.round(words / 200));
  const pageUrl = `https://vexs.space/articles/${article.slug}`;

  return (
    <>
      <Header />
      <main className="container" role="main">
        <div className="article-wrap">
          <Breadcrumbs items={crumbs} />
          {article.tag && (
            <a href={`/tag/${article.tag.slug}`} className="article-chip" aria-label={`Tag: ${article.tag.name}`}>#{article.tag.name}</a>
          )}
          <article>
            <h1 className="article-title">{article.title}</h1>
            <div className="article-meta">
              {article.author?.name && <span>Author: {article.author.name}</span>}
              {article.published_at && (<>
                <span aria-hidden> · </span>
                <time dateTime={article.published_at}>{new Date(article.published_at).toLocaleString('en-US')}</time>
              </>)}
              <span aria-hidden> · </span>
              <span>{readMin} min read</span>
            </div>

            {article.thumbnail_url && (
              <div className="article-hero">
                <Image src={article.thumbnail_url} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="100vw" />
              </div>
            )}

            <div className="article-share" aria-label="Share">
              <a aria-label="Share on X" title="Share on X" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer"><FaXTwitter size={18} aria-hidden /></a>
              <a aria-label="Share on Facebook" title="Share on Facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer"><FaFacebookF size={18} aria-hidden /></a>
              <a aria-label="Share on LinkedIn" title="Share on LinkedIn" href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer"><FaLinkedinIn size={18} aria-hidden /></a>
            </div>

            <div className="article-body" dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }} />
          </article>
        </div>
      </main>
      <Footer />
      <JsonLd data={newsArticleJsonLd({ article })} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}

