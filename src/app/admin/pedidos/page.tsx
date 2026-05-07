import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { EmptyState } from "@/components/admin/empty-state";
import { OrdersTable } from "@/components/admin/orders-table";
import { createCommerceCore } from "@/lib/commerce/factory";
import type { Order } from "@/lib/commerce/orders/order.types";
import { cn } from "@/lib/utils";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const filters = [
  { key: "todos", label: "Todos" },
  { key: "pagamento-pendente", label: "Pagamento pendente" },
  { key: "pago", label: "Pago" },
  { key: "processing", label: "Em processamento" },
  { key: "shipped", label: "Enviado" },
  { key: "delivered", label: "Entregue" },
  { key: "cancelled", label: "Cancelado" }
];

type Props = {
  searchParams?: Promise<{ filtro?: string }>;
};

function filterOrders(orders: Order[], filter: string) {
  if (filter === "pagamento-pendente") return orders.filter((order) => order.paymentStatus === "pending");
  if (filter === "pago") return orders.filter((order) => order.paymentStatus === "approved");
  if (["processing", "shipped", "delivered", "cancelled"].includes(filter)) {
    return orders.filter((order) => order.status === filter);
  }
  return orders;
}

export default async function OrdersPage({ searchParams }: Props) {
  const currentFilter = (await searchParams)?.filtro ?? "todos";
  const commerce = createCommerceCore(createSupabaseAdminClient());
  const orders = filterOrders(await commerce.orders.listAdmin(), currentFilter);

  return (
    <>
      <AdminHeader
        title="Pedidos"
        description="Acompanhe pagamentos e avance apenas status operacional."
      />
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <Link
            className={cn(
              "whitespace-nowrap rounded-full border bg-white px-3 py-2 text-sm font-medium text-muted-foreground",
              currentFilter === filter.key && "bg-primary text-primary-foreground"
            )}
            href={filter.key === "todos" ? "/admin/pedidos" : `/admin/pedidos?filtro=${filter.key}`}
            key={filter.key}
          >
            {filter.label}
          </Link>
        ))}
      </div>
      {orders.length > 0 ? (
        <OrdersTable orders={orders} />
      ) : (
        <EmptyState title="Nenhum pedido encontrado" description="Os pedidos aparecerão aqui quando o checkout começar a receber vendas." />
      )}
    </>
  );
}
