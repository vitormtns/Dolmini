import { NextResponse } from "next/server";
import { createCommerceCore } from "@/lib/commerce/factory";
import { categoryCreateSchema, categoryUpdateSchema } from "@/lib/commerce/categories/category.schema";
import { apiSuccess, toApiError } from "@/lib/commerce/shared/errors";
import { requireAdmin } from "@/lib/commerce/shared/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    await requireAdmin();
    const commerce = createCommerceCore(createSupabaseAdminClient());
    const categories = await commerce.categories.listAdmin();

    return NextResponse.json(apiSuccess({ categories }));
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const input = categoryCreateSchema.parse(await request.json());
    const commerce = createCommerceCore(createSupabaseAdminClient());
    const category = await commerce.categories.create(input);

    return NextResponse.json(apiSuccess({ category }), { status: 201 });
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const input = categoryUpdateSchema.parse(await request.json());
    const commerce = createCommerceCore(createSupabaseAdminClient());
    const category = await commerce.categories.update(input);

    return NextResponse.json(apiSuccess({ category }));
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}
