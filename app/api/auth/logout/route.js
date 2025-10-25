import { NextResponse } from "next/server";
import { cookieOptions } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const opts = cookieOptions();
  res.cookies.set('vexs-at', '', { ...opts, maxAge: 0 });
  res.cookies.set('vexs-rt', '', { ...opts, maxAge: 0 });
  return res;
}

