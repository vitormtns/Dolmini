import { NextResponse } from "next/server";
import { createCommerceCore } from "@/lib/commerce/factory";
import { productListQuerySchema } from "@/lib/commerce/products/product.schema";
import { apiSuccess, toApiError } from "@/lib/commerce/shared/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = productListQuerySchema.parse(Object.fromEntries(url.searchParams));
    const commerce = createCommerceCore(await createSupabaseServerClient());
    const products = await commerce.products.listPublic(query);

    return NextResponse.json(apiSuccess({ products }));
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}
