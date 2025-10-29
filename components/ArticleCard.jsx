import Image from "next/image";
import Link from "next/link";
import { formatDateLong } from "@/lib/date";

export default function ArticleCard({ article }) {
  const href = `/articles/${article.slug}`;
  return (
    <article className="card">
      <Link href={href} style={{ position: 'relative', width: 200, height: 120, background: '#eee', borderRadius: 8, overflow: 'hidden' }}>
        {article.thumbnail_url ? (
          <Image src={article.thumbnail_url} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="200px" />
        ) : (
          <div style={{ width: '100%', height: '100%' }} />
        )}
      </Link>
      <div>
        <Link href={href}><h3>{article.title}</h3></Link>
        <div className="muted" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {article.tag && (
            <Link href={`/tag/${article.tag.slug}`} className="muted">#{article.tag.name}</Link>
          )}
          <span aria-hidden="true">·</span>
          {article.published_at && (
            <time dateTime={article.published_at}>{article.date_str ?? formatDateLong(article.published_at)}</time>
          )}
        </div>
        {article.excerpt && (
          <p className="muted" style={{ marginTop: 6 }}>{article.excerpt}</p>
        )}
      </div>
    </article>
  );
}
