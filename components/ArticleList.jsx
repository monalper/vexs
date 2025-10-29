import ArticleCard from "./ArticleCard";
import Image from "next/image";
import { formatDateLong } from "@/lib/date";

export default function ArticleList({ articles = [], layout = "list" }) {
  if (!articles.length) return <p className="muted">No content yet.</p>;
  
  if (layout === "grid") {
    return (
      <div className="home-grid-wrap">
        {articles.map((a) => (
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
            <div className="meta muted">
              {a.tag && (<a className="chip" href={`/tag/${a.tag.slug}`}>#{a.tag.name}</a>)}
              {a.tag && a.published_at && <span> · </span>}
              {a.published_at && (<time dateTime={a.published_at}>{a.date_str ?? formatDateLong(a.published_at)}</time>)}
            </div>
          </article>
        ))}
      </div>
    );
  }
  
  return (
    <div>
      {articles.map((a) => (
        <ArticleCard key={a.id} article={a} />
      ))}
    </div>
  );
}
