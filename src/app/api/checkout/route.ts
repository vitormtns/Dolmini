import { NextResponse } from "next/server";
import { checkoutCreateSchema } from "@/lib/commerce/orders/order.schema";
import { apiSuccess, CommerceError, toApiError } from "@/lib/commerce/shared/errors";
import { createCommerceCore } from "@/lib/commerce/factory";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.cart?.items?.length) throw new CommerceError("Carrinho vazio.", "CART_EMPTY", 400);
    if (!env.MERCADO_PAGO_ACCESS_TOKEN) {
      throw new CommerceError(
        "Checkout temporariamente indisponivel. Tente novamente mais tarde.",
        "PAYMENT_PROVIDER_NOT_CONFIGURED",
        503
      );
    }

    const input = checkoutCreateSchema.parse(body);
    const commerce = createCommerceCore(createSupabaseAdminClient());
    const order = await commerce.orders.createPendingPayment(input);

    // Pagamento real: configure MERCADO_PAGO_ACCESS_TOKEN antes de usar esta chamada em producao.
    const checkout = await commerce.payments.createCheckout(order);

    return NextResponse.json(apiSuccess({ order, checkout }), { status: 201 });
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}
