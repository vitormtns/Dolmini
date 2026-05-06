import { AdminHeader } from "@/components/admin/admin-header";
import { CategoriesTable } from "@/components/admin/categories-table";
import { CategoryForm } from "@/components/admin/category-form";
import { EmptyState } from "@/components/admin/empty-state";
import { createCommerceCore } from "@/lib/commerce/factory";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function CategoriesPage() {
  const commerce = createCommerceCore(createSupabaseAdminClient());
  const categories = await commerce.categories.listAdmin();

  return (
    <>
      <AdminHeader
        title="Categorias"
        description="Organize o catalogo sem quebrar produtos existentes."
      />
      <div className="grid gap-6">
        <CategoryForm />
        {categories.length > 0 ? (
          <CategoriesTable categories={categories} />
        ) : (
          <EmptyState title="Nenhuma categoria" description="Crie categorias para publicar produtos ativos." />
        )}
      </div>
    </>
  );
}
