import { AdminHeader } from "@/components/admin/admin-header";
import { ProductForm } from "@/components/admin/product-form";
import { ProductImageUploader } from "@/components/admin/product-image-uploader";
import { createCommerceCore } from "@/lib/commerce/factory";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const commerce = createCommerceCore(createSupabaseAdminClient());
  const [product, categories] = await Promise.all([
    commerce.products.getAdminById(id),
    commerce.categories.listAdmin()
  ]);

  return (
    <>
      <AdminHeader
        title="Editar produto"
        description={product.name}
      />
      <div className="grid gap-6">
        <ProductForm categories={categories} product={product} />
        <ProductImageUploader product={product} />
      </div>
    </>
  );
}
