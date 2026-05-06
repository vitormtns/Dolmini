import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { StatCard } from "@/components/admin/stat-card";
import { createCommerceCore } from "@/lib/commerce/factory";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function AdminPage() {
  const commerce = createCommerceCore(createSupabaseAdminClient());
  const [products, orders] = await Promise.all([
    commerce.products.listAdmin(),
    commerce.orders.listAdmin()
  ]);
  const activeProducts = products.filter((product) => product.status === "active").length;
  const pendingOrders = orders.filter((order) => order.paymentStatus === "pending").length;
  const recentPaidOrders = orders.filter((order) => order.paymentStatus === "approved").slice(0, 10).length;

  return (
    <>
      <AdminHeader
        title="Painel admin"
        description="Controle minimo de catalogo e pedidos da Dolmini Model."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total de produtos" value={products.length} />
        <StatCard label="Produtos ativos" value={activeProducts} />
        <StatCard label="Pedidos pendentes" value={pendingOrders} />
        <StatCard label="Pedidos pagos recentes" value={recentPaidOrders} />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link className="rounded-lg border bg-white p-5 transition-colors hover:bg-muted/60" href="/admin/produtos/novo">
          <strong>Novo produto</strong>
          <p className="mt-1 text-sm text-muted-foreground">Cadastrar item, estoque, preco e imagens.</p>
        </Link>
        <Link className="rounded-lg border bg-white p-5 transition-colors hover:bg-muted/60" href="/admin/pedidos">
          <strong>Ver pedidos</strong>
          <p className="mt-1 text-sm text-muted-foreground">Acompanhar pagamentos e operacao.</p>
        </Link>
      </div>
    </>
  );
}
