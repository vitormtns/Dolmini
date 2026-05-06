import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { EmptyState } from "@/components/admin/empty-state";
import { ProductsTable } from "@/components/admin/products-table";
import { createCommerceCore } from "@/lib/commerce/factory";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function ProductsPage() {
  const commerce = createCommerceCore(createSupabaseAdminClient());
  const products = await commerce.products.listAdmin();

  return (
    <>
      <AdminHeader
        title="Produtos"
        description="Catalogo, estoque, preco, promocao e status."
        action={<Link className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" href="/admin/produtos/novo">Novo produto</Link>}
      />
      {products.length > 0 ? (
        <ProductsTable products={products} />
      ) : (
        <EmptyState title="Nenhum produto cadastrado" description="Comece criando o primeiro produto vendavel da Dolmini Model." actionHref="/admin/produtos/novo" actionLabel="Criar produto" />
      )}
    </>
  );
}
