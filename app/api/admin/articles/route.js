import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServer";
import { getEditorFromSession } from "@/lib/auth";
import { uniqueSlug } from "@/lib/slug";

export async function POST(request) {
  const editor = await getEditorFromSession();
  if (!editor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const { title, content, tag_id, thumbnail_url, publish } = body || {};
    if (!title || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const svc = getServiceClient();

    const slug = await uniqueSlug(title, async (s) => {
      const { data } = await svc.from('articles').select('id').eq('slug', s).maybeSingle();
      return !!data;
    });

    const now = new Date().toISOString();
    const { data, error } = await svc.from('articles').insert({
      title,
      slug,
      content,
      author_id: editor.id,
      tag_id: tag_id || null,
      thumbnail_url: thumbnail_url || null,
      status: publish ? 'published' : 'draft',
      published_at: publish ? now : null
    }).select('slug').single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ slug: data.slug }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

