import EditArticleForm from "@/components/EditArticleForm";
import { fetchAllTags } from "@/lib/supabaseClient";
import { requireEditor } from "@/lib/auth";
import { getServiceClient } from "@/lib/supabaseServer";

export const metadata = { title: 'Yazıyı Düzenle' };

export default async function EditArticlePage({ params }) {
  const editor = await requireEditor();
  const svc = getServiceClient();

  const { data: article, error } = await svc
    .from('articles')
    .select('id, title, slug, content, tag_id, thumbnail_url, status, published_at')
    .eq('id', params.id)
    .eq('author_id', editor.id)
    .single();

  if (error) {
    return (
      <div>
        <h1 className="section-title">Yazıyı Düzenle</h1>
        <p className="muted">Yazı bulunamadı veya erişim yetkiniz yok.</p>
      </div>
    );
  }

  const tags = await fetchAllTags();

  return (
    <div>
      <h1 className="section-title">Yazıyı Düzenle</h1>
      <EditArticleForm article={article} tags={tags} />
    </div>
  );
}

