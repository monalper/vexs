import NewArticleForm from "@/components/NewArticleForm";
import { fetchAllTags } from "@/lib/supabaseClient";
import { requireEditor } from "@/lib/auth";

export const metadata = { title: 'Yeni Yazı' };

export default async function NewArticlePage() {
  await requireEditor();
  const tags = await fetchAllTags();
  return (
    <div>
      <h1 className="section-title">Yeni Yazı</h1>
      <NewArticleForm tags={tags} />
    </div>
  );
}

