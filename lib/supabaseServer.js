import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getServiceClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase servis anahtarı eksik: SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
}

export function getAuthorizedPublicClient(accessToken) {
  if (!supabaseUrl) throw new Error("Supabase URL eksik");
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const client = createClient(supabaseUrl, anon, {
    auth: { persistSession: false },
    global: { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} }
  });
  return client;
}

