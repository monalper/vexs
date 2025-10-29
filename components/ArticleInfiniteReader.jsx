"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { fetchArticleBySlug } from "@/lib/supabaseClient";
import { sanitizeHtml } from "@/lib/sanitize";
import { formatDateLong } from "@/lib/date";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

// Lazy-loads and appends next articles in order when user reaches the end.
export default function ArticleInfiniteReader({ initialSlug, nextSlugs = [] }) {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState([]);
  const [error, setError] = useState(null);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  const hasMore = index < nextSlugs.length;

  const loadNext = useCallback(async () => {
    if (loading) return;
    if (!hasMore) return;
    const slug = nextSlugs[index];
    setLoading(true);
    setError(null);
    try {
      const article = await fetchArticleBySlug(slug);
      if (article) {
        setLoaded((prev) => [...prev, article]);
        setIndex((prev) => prev + 1);
        // Re-run Twitter widgets parsing if available
        if (typeof window !== "undefined" && window.twttr?.widgets?.load) {
          try { window.twttr.widgets.load(); } catch {}
        }
      } else {
        // skip if not found
        setIndex((prev) => prev + 1);
      }
    } catch (e) {
      setError("Yükleme sırasında bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [index, nextSlugs, loading, hasMore]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    observerRef.current?.disconnect();
    const ob = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          loadNext();
        }
      },
      { root: null, rootMargin: "600px 0px 600px 0px", threshold: 0.01 }
    );
    observerRef.current = ob;
    ob.observe(sentinelRef.current);
    return () => ob.disconnect();
  }, [loadNext]);

  if (!nextSlugs?.length) return null;

  return (
    <div aria-live="polite">
      {loaded.map((a, i) => {
        const pageUrl = `https://vexs.space/articles/${a.slug}`;
        const readMin = (() => {
          const plain = a.content ? a.content.replace(/<[^>]+>/g, " ") : "";
          const words = plain.trim() ? plain.trim().split(/\s+/).length : 0;
          return Math.max(1, Math.round(words / 200));
        })();
        return (
          <div key={a.slug} className="article-wrap" style={{ marginTop: 32 }}>
            {i === 0 ? <hr className="article-divider" /> : <hr className="article-divider" />}
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumbs" className="breadcrumbs">
              <span>
                <a href="/">Home</a>
              </span>
              {a.tag && (
                <span>
                  <span aria-hidden="true"> / </span>
                  <a href={`/tag/${a.tag.slug}`}>{a.tag.name}</a>
                </span>
              )}
              <span>
                <span aria-hidden="true"> / </span>
                <span>{a.title}</span>
              </span>
            </nav>
            <article>
              <h2 className="article-title">{a.title}</h2>
              {/* Tag chip + share icons inline */}
              {a.tag && (
                <div className="article-chip-row">
                  <a
                    href={`/tag/${a.tag.slug}`}
                    className="article-chip"
                    aria-label={`Tag: ${a.tag.name}`}
                  >
                    #{a.tag.name}
                  </a>

                  <div className="article-share-inline">
                    <a
                      aria-label="Share on X"
                      title="Share on X"
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(a.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaSquareXTwitter size={17} aria-hidden />
                    </a>
                    <a
                      aria-label="Share on Facebook"
                      title="Share on Facebook"
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebook size={17} aria-hidden />
                    </a>
                    <a
                      aria-label="Share on LinkedIn"
                      title="Share on LinkedIn"
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(a.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin size={17} aria-hidden />
                    </a>
                  </div>
                </div>
              )}

              <div className="article-meta">
                {a.author?.name && <span>Author: {a.author.name}</span>}
                {a.published_at && (
                  <>
                    <span aria-hidden> • </span>
                    <time dateTime={a.published_at}>{formatDateLong(a.published_at)}</time>
                  </>
                )}
                <span aria-hidden> • </span>
                <span>{readMin} min read</span>
              </div>

              {a.thumbnail_url && (
                <div>
                  <div className="article-hero">
                    <Image
                      src={a.thumbnail_url}
                      alt={a.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="100vw"
                    />
                  </div>
                  {a.thumbnail_source && (
                    <p className="article-hero-caption">Photo Source: {a.thumbnail_source}</p>
                  )}
                </div>
              )}

              <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(a.content) }}
              />
            </article>
          </div>
        );
      })}

      <div ref={sentinelRef} />
      <p className="muted" style={{ textAlign: "center", padding: "12px 0" }}>
        {loading ? "Yükleniyor..." : (hasMore ? "" : "Daha fazla içerik yok.")}
      </p>
      {error && (
        <p className="muted" role="alert" style={{ textAlign: "center" }}>
          {error}
        </p>
      )}
    </div>
  );
}
