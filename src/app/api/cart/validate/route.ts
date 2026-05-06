import { NextResponse } from "next/server";
import { cartSchema } from "@/lib/commerce/cart/cart.schema";
import { apiSuccess, CommerceError, toApiError } from "@/lib/commerce/shared/errors";
import { createCommerceCore } from "@/lib/commerce/factory";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.items?.length) throw new CommerceError("Carrinho vazio.", "CART_EMPTY", 400);
    const input = cartSchema.parse(body);
    const commerce = createCommerceCore(createSupabaseAdminClient());
    const cart = await commerce.cart.validate(input);

    return NextResponse.json(apiSuccess({ cart }));
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}
