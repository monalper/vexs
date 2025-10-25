import { NextResponse } from "next/server";
import { getPublicClient } from "@/lib/supabaseClient";
import { getServiceClient } from "@/lib/supabaseServer";
import { cookieOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    const { access_token, refresh_token } = await request.json();
    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: 'Eksik token' }, { status: 400 });
    }

    const supabase = getPublicClient();
    const { data, error } = await supabase.auth.getUser(access_token);
    if (error || !data?.user?.email) {
      return NextResponse.json({ error: 'Geçersiz oturum' }, { status: 401 });
    }

    const svc = getServiceClient();
    const { data: editor } = await svc
      .from('users')
      .select('id')
      .eq('email', data.user.email)
      .single();
    if (!editor) {
      return NextResponse.json({ error: 'Yetki yok' }, { status: 403 });
    }

    const res = NextResponse.json({ ok: true });
    const opts = cookieOptions();
    res.cookies.set('vexs-at', access_token, { ...opts, maxAge: 60 * 60 * 4 }); // 4h
    res.cookies.set('vexs-rt', refresh_token, { ...opts, maxAge: 60 * 60 * 24 * 7 }); // 7d
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

