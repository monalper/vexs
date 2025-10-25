import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServer";
import { getEditorFromSession } from "@/lib/auth";

export const maxDuration = 60; // edge hint

export async function POST(request) {
  const editor = await getEditorFromSession();
  if (!editor) return NextResponse.json({ error: 'Yetki yok' }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Dosya yok' }, { status: 400 });
    }

    const bucket = 'media';
    const svc = getServiceClient();
    const name = file.name || 'upload.bin';
    const ts = Date.now();
    const key = `articles/${ts}-${name}`;

    const { error } = await svc.storage.from(bucket).upload(key, file, {
      contentType: file.type || 'application/octet-stream',
      upsert: true,
      cacheControl: '3600'
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const { data: pub } = svc.storage.from(bucket).getPublicUrl(key);
    return NextResponse.json({ key, url: pub.publicUrl });
  } catch (e) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

