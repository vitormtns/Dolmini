import { NextResponse } from "next/server";
import { z } from "zod";
import { apiSuccess, CommerceError, toApiError } from "@/lib/commerce/shared/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword(input);

    if (error || !data.user) {
      throw new CommerceError("E-mail ou senha inválidos.", "invalid_credentials", 401);
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      await supabase.auth.signOut();
      throw new CommerceError("Usuário sem permissão administrativa.", "admin_permission_required", 403);
    }

    return NextResponse.json(apiSuccess({ redirectTo: "/admin" }));
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}
