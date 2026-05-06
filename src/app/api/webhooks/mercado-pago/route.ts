import { NextResponse } from "next/server";
import { createCommerceCore } from "@/lib/commerce/factory";
import { apiSuccess, toApiError } from "@/lib/commerce/shared/errors";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const commerce = createCommerceCore(createSupabaseAdminClient());
    const result = await commerce.mercadoPagoWebhook.handle(
      rawBody,
      request.headers,
      request.url
    );

    return NextResponse.json(apiSuccess(result), { status: 200 });
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}
