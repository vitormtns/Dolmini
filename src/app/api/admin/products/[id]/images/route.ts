import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createCommerceCore } from "@/lib/commerce/factory";
import { apiSuccess, CommerceError, toApiError } from "@/lib/commerce/shared/errors";
import { requireAdmin } from "@/lib/commerce/shared/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const bucket = "product-images";
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageSize = 5 * 1024 * 1024;

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id: productId } = await context.params;
    const supabase = createSupabaseAdminClient();
    const commerce = createCommerceCore(supabase);
    const product = await commerce.products.getAdminById(productId);
    const formData = await request.formData();
    const files = formData.getAll("files").filter((value): value is File => value instanceof File);

    if (files.length === 0) {
      throw new CommerceError("Envie ao menos uma imagem.", "missing_images", 400);
    }

    const uploadedImages = [];
    const baseSortOrder = product.images.length;

    for (const [index, file] of files.entries()) {
      if (!allowedTypes.has(file.type)) {
        throw new CommerceError("Tipo de imagem não permitido.", "invalid_image_type", 400);
      }

      if (file.size > maxImageSize) {
        throw new CommerceError("Imagem excede 5MB.", "image_too_large", 400);
      }

      const extension = file.type.split("/").at(-1) ?? "jpg";
      const storagePath = `${productId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        throw new CommerceError(
          "Não foi possível enviar a imagem para o Storage.",
          "image_upload_failed",
          502
        );
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
      uploadedImages.push({
        storagePath,
        url: data.publicUrl,
        altText: product.name,
        sortOrder: baseSortOrder + index
      });
    }

    const updatedProduct = await commerce.products.addImages(productId, uploadedImages);
    return NextResponse.json(apiSuccess({ product: updatedProduct }), { status: 201 });
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}

export async function PATCH(request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id: productId } = await context.params;
    const { imageId } = await request.json();
    if (!imageId) throw new CommerceError("Informe a imagem.", "missing_image_id", 400);

    const commerce = createCommerceCore(createSupabaseAdminClient());
    const product = await commerce.products.setPrimaryImage(productId, imageId);

    return NextResponse.json(apiSuccess({ product }));
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}

export async function DELETE(request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id: productId } = await context.params;
    const { imageId } = await request.json();
    if (!imageId) throw new CommerceError("Informe a imagem.", "missing_image_id", 400);

    const supabase = createSupabaseAdminClient();
    const commerce = createCommerceCore(supabase);
    const storagePath = await commerce.products.removeImage(productId, imageId);

    if (storagePath) {
      const { error: removeError } = await supabase.storage.from(bucket).remove([storagePath]);
      if (removeError) {
        throw new CommerceError(
          "A imagem foi removida do produto, mas não foi possível remover o arquivo do Storage.",
          "image_storage_remove_failed",
          502
        );
      }
    }

    const product = await commerce.products.getAdminById(productId);
    return NextResponse.json(apiSuccess({ product }));
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json(apiError.body, { status: apiError.status });
  }
}
