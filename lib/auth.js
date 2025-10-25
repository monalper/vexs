import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServiceClient } from "@/lib/supabaseServer";
import { getPublicClient } from "@/lib/supabaseClient";

const AT = "vexs-at";
const RT = "vexs-rt";

export function readAuthCookies() {
  const store = cookies();
  const access = store.get(AT)?.value || null;
  const refresh = store.get(RT)?.value || null;
  return { access, refresh };
}

export async function getAuthUser() {
  const { access } = readAuthCookies();
  if (!access) return null;
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase.auth.getUser(access);
    if (error) return null;
    return data?.user ?? null;
  } catch {
    return null;
  }
}

export async function getEditorFromSession() {
  const authUser = await getAuthUser();
  if (!authUser?.email) return null;
  const svc = getServiceClient();
  const { data, error } = await svc
    .from("users")
    .select("id, name, email, profile_image_url")
    .eq("email", authUser.email)
    .single();
  if (error) return null;
  return data;
}

export async function requireEditor() {
  const editor = await getEditorFromSession();
  if (!editor) redirect("/admin/login");
  return editor;
}

export function cookieOptions() {
  const prod = process.env.NODE_ENV === 'production';
  return { httpOnly: true, sameSite: 'lax', secure: prod, path: '/' };
}

