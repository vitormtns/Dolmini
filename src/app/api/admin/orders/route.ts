import { NextResponse } from "next/server";
import { createCommerceCore } from "@/lib/commerce/factory";
import { orderOperationalUpdateSchema } from "@/lib/commerce/orders/order.schema";
import { requireAdmin } from "@/lib/commerce/shared/auth";
import { apiSuccess, toApiError } from "@/lib/commerce/shared/errors";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    await requireAdmin();
    const commerce = createCommerceCore(createSupabaseAdminClient());
    const orders = await commerce.orders.listAdmin();

    return NextResponse.json(apiSuccess({ orders }));
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const input = orderOperationalUpdateSchema.parse(await request.json());
    const commerce = createCommerceCore(createSupabaseAdminClient());
    const order = await commerce.orders.updateOperationalStatus(input);

    return NextResponse.json(apiSuccess({ order }));
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}
