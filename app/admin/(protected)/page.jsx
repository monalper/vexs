import { getServiceClient } from "@/lib/supabaseServer";
import { requireEditor } from "@/lib/auth";
import Link from "next/link";
import { formatDateLong } from "@/lib/date";

export default async function AdminHome() {
  const editor = await requireEditor();
  const svc = getServiceClient();
  const { data: articles } = await svc
    .from('articles')
    .select('id, title, slug, status, published_at, updated_at')
    .eq('author_id', editor.id)
    .order('updated_at', { ascending: false })
    .limit(20);

  return (
    <div>
      <h1 className="section-title">Dashboard</h1>
      <p className="muted">Welcome, {editor.name || editor.email}</p>
      <div style={{ margin: '12px 0 16px' }}>
        <Link className="btn" href="/admin/articles/new">+ New Article</Link>
      </div>
      <h2 className="section-title">Your Recent Articles</h2>
      <div>
        {(articles || []).map((a) => (
          <div key={a.id} className="card" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
              <div>
                <strong>{a.title}</strong>
                <div className="muted">{a.status} {a.published_at ? `• ${formatDateLong(a.published_at)}` : ''}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link href={`/admin/articles/${a.id}/edit`}>Edit</Link>
                <Link href={`/articles/${a.slug}`}>View</Link>
              </div>
            </div>
          </div>
        ))}
        {(!articles || articles.length === 0) && (
          <p className="muted">You don’t have any articles yet.</p>
        )}
      </div>
    </div>
  );
}


