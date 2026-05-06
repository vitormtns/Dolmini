import { NextResponse } from "next/server";
import { createCommerceCore } from "@/lib/commerce/factory";
import { apiSuccess, toApiError } from "@/lib/commerce/shared/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const commerce = createCommerceCore(await createSupabaseServerClient());
    const categories = await commerce.categories.listPublic();

    return NextResponse.json(apiSuccess({ categories }));
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}
