import { AdminHeader } from "@/components/admin/admin-header";
import { ProductForm } from "@/components/admin/product-form";
import { createCommerceCore } from "@/lib/commerce/factory";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function NewProductPage() {
  const commerce = createCommerceCore(createSupabaseAdminClient());
  const categories = await commerce.categories.listAdmin();

  return (
    <>
      <AdminHeader
        title="Novo produto"
        description="Crie o produto primeiro; depois envie e organize as imagens."
      />
      <ProductForm categories={categories} />
    </>
  );
}
