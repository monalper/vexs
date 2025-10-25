import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { fetchPublishedArticles, fetchAllTags } from "@/lib/supabaseClient";

export const revalidate = 120; // revalidate home every 2 minutes

export default async function HomePage() {
  const [articles, tags] = await Promise.all([
    fetchPublishedArticles({ limit: 20 }),
    fetchAllTags()
  ]);

  return (
    <>
      <Header />
      <main className="container" role="main">
        <h1 className="visually-hidden">vexs — News and Analysis</h1>

        {/* Ticker: latest headlines */}
        {articles.length > 0 && (
          <section className="ticker" aria-label="Headlines">
            <div className="ticker-track" aria-live="polite">
              {[...articles].slice(0, 8).map((a) => (
                <a className="ticker-item" key={`t1-${a.id}`} href={`/articles/${a.slug}`}>{a.title}</a>
              ))}
              {[...articles].slice(0, 8).map((a) => (
                <a className="ticker-item" key={`t2-${a.id}`} href={`/articles/${a.slug}`}>{a.title}</a>
              ))}
            </div>
          </section>
        )}

        {/* Content */}
        {articles.length > 0 ? (
          (() => {
            const [lead, ...rest] = articles;
            const secondary = rest.slice(0, 4);
            const latest = rest.slice(4);
            return (
              <>
                {/* Top: lead story + secondary list */}
                <section className="home-top" aria-label="Top stories">
                  {/* Lead story */}
                  <article className="home-hero-card">
                    <a href={`/articles/${lead.slug}`} className="home-hero-media" aria-label={lead.title}>
                      <div className="home-hero-media-inner with-overlay">
                        {lead.thumbnail_url && (
                          <Image src={lead.thumbnail_url} alt={lead.title} fill sizes="(max-width: 900px) 100vw, 760px" style={{ objectFit: 'cover' }} />
                        )}
                      </div>
                    </a>
                    <div className="home-hero-content">
                      {lead.tag && (<a className="article-chip" href={`/tag/${lead.tag.slug}`}>#{lead.tag.name}</a>)}
                      <h2 className="home-hero-title"><a href={`/articles/${lead.slug}`}>{lead.title}</a></h2>
                      {lead.excerpt && <p className="home-hero-excerpt">{lead.excerpt}</p>}
                      <div className="home-hero-meta">
                        {lead.published_at && (<time dateTime={lead.published_at}>{new Date(lead.published_at).toLocaleDateString('en-US')}</time>)}
                      </div>
                    </div>
                  </article>

                  {/* Secondary list */}
                  <div className="home-secondary">
                    {secondary.map((a) => (
                      <article className="home-secondary-item" key={a.id}>
                        <a href={`/articles/${a.slug}`} className="thumb" aria-label={a.title}>
                          <div className="thumb-inner">
                            {a.thumbnail_url && (
                              <Image src={a.thumbnail_url} alt={a.title} fill sizes="180px" style={{ objectFit: 'cover' }} />
                            )}
                          </div>
                        </a>
                        <div className="content">
                          <h3><a href={`/articles/${a.slug}`}>{a.title}</a></h3>
                          <div className="muted">{a.published_at && (<time dateTime={a.published_at}>{new Date(a.published_at).toLocaleDateString('en-US')}</time>)}</div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* Latest grid */}
                {latest.length > 0 && (
                  <section aria-labelledby="latest" className="home-grid home-section">
                    <div className="section-head">
                      <h2 id="latest" className="section-title">Latest News</h2>
                      <a href="/search">See all</a>
                    </div>
                    <div className="home-grid-wrap">
                      {latest.map((a) => (
                        <article key={a.id} className="home-grid-card">
                          <a href={`/articles/${a.slug}`} className="media" aria-label={a.title}>
                            <div className="media-inner">
                              {a.thumbnail_url && (
                                <Image src={a.thumbnail_url} alt={a.title} fill sizes="360px" style={{ objectFit: 'cover' }} />
                              )}
                            </div>
                          </a>
                          <h3 className="title"><a href={`/articles/${a.slug}`}>{a.title}</a></h3>
                          {a.excerpt && <p className="muted excerpt">{a.excerpt}</p>}
                          <div className="muted meta">
                            {a.tag && (<a href={`/tag/${a.tag.slug}`} className="muted">#{a.tag.name}</a>)}
                            {a.published_at && <span> · {new Date(a.published_at).toLocaleDateString('en-US')}</span>}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {/* CTA / Newsletter & RSS */}
                <section className="cta-card home-section" aria-label="Newsletter and RSS">
                  <div className="cta-content">
                    <h2 className="cta-title">Don’t miss the headlines</h2>
                    <p className="cta-sub">Follow us for trusted news and analysis. Subscribe to RSS or quickly find what you’re looking for.</p>
                  </div>
                  <div className="cta-actions">
                    <a className="btn" href="/rss.xml">Subscribe via RSS</a>
                    <a className="btn btn-outline" href="/search">Search News</a>
                  </div>
                </section>
              </>
            );
          })()
        ) : (
          <p className="muted">No content yet.</p>
        )}

        {/* Explore tags */}
        {tags.length > 0 && (
          <section aria-labelledby="tags" className="home-section">
            <h2 id="tags" className="section-title">Tags</h2>
            <div className="tags-wrap">
              {tags.map((t) => (
                <a key={t.id} href={`/tag/${t.slug}`} className="tag-chip">#{t.name}</a>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

