import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServer";
import { getEditorFromSession } from "@/lib/auth";

export async function GET(request, { params }) {
  const editor = await getEditorFromSession();
  if (!editor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = params || {};
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const svc = getServiceClient();
  const { data, error } = await svc
    .from('articles')
    .select('id, title, slug, content, tag_id, thumbnail_url, status, published_at')
    .eq('id', id)
    .eq('author_id', editor.id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ article: data });
}

export async function PUT(request, { params }) {
  const editor = await getEditorFromSession();
  if (!editor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = params || {};
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const body = await request.json();
    const { title, content, tag_id, thumbnail_url, publish, status } = body || {};

    const svc = getServiceClient();

    // Ensure article belongs to this editor
    const { data: existing, error: exErr } = await svc
      .from('articles')
      .select('id, status, published_at')
      .eq('id', id)
      .eq('author_id', editor.id)
      .maybeSingle();
    if (exErr) return NextResponse.json({ error: exErr.message }, { status: 400 });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const update = {};
    if (typeof title === 'string' && title.trim()) update.title = title;
    if (typeof content === 'string') update.content = content;
    if (Object.prototype.hasOwnProperty.call(body, 'tag_id')) update.tag_id = tag_id || null;
    if (Object.prototype.hasOwnProperty.call(body, 'thumbnail_url')) update.thumbnail_url = thumbnail_url || null;

    // Handle publish/unpublish
    const now = new Date().toISOString();
    if (typeof publish === 'boolean') {
      if (publish) {
        update.status = 'published';
        if (!existing.published_at) update.published_at = now;
      } else {
        update.status = 'draft';
        update.published_at = null;
      }
    } else if (typeof status === 'string' && (status === 'published' || status === 'draft')) {
      update.status = status;
      if (status === 'published' && !existing.published_at) update.published_at = now;
      if (status === 'draft') update.published_at = null;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const { data, error } = await svc
      .from('articles')
      .update(update)
      .eq('id', id)
      .eq('author_id', editor.id)
      .select('slug, status')
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ slug: data.slug, status: data.status });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

