import { NextResponse } from "next/server";
import { productCreateSchema, productListQuerySchema, productUpdateSchema } from "@/lib/commerce/products/product.schema";
import { createCommerceCore } from "@/lib/commerce/factory";
import { apiSuccess, CommerceError, toApiError } from "@/lib/commerce/shared/errors";
import { requireAdmin } from "@/lib/commerce/shared/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const query = productListQuerySchema.parse(Object.fromEntries(url.searchParams));
    const commerce = createCommerceCore(createSupabaseAdminClient());
    const products = await commerce.products.listAdmin(query);

    return NextResponse.json(apiSuccess({ products }));
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const input = productCreateSchema.parse(await request.json());
    const commerce = createCommerceCore(createSupabaseAdminClient());
    const product = await commerce.products.create(input);

    return NextResponse.json(apiSuccess({ product }), { status: 201 });
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const input = productUpdateSchema.parse(await request.json());
    const commerce = createCommerceCore(createSupabaseAdminClient());
    const product = await commerce.products.update(input);

    return NextResponse.json(apiSuccess({ product }));
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      throw new CommerceError("Informe o id do produto.", "missing_product_id", 400);
    }

    const commerce = createCommerceCore(createSupabaseAdminClient());
    await commerce.products.archive(id);

    return NextResponse.json(apiSuccess({ ok: true }));
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}
