import { CommerceError } from "@/lib/commerce/shared/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new CommerceError("Sessão obrigatória.", "unauthorized", 401);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    throw new CommerceError("Acesso restrito a administradores.", "forbidden", 403);
  }

  return { supabase, user, profile };
}
