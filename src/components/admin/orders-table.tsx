import Link from "next/link";
import type { Order } from "@/lib/commerce/orders/order.types";
import { formatCurrency, formatDate } from "@/lib/format";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { PaymentStatusBadge } from "@/components/admin/payment-status-badge";

export function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Itens</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Pagamento</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                <td className="px-4 py-3">
                  <p>{order.customerSnapshot.name}</p>
                  <p className="text-xs text-muted-foreground">{order.customerSnapshot.email}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="grid gap-1">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={`${item.productId}-${item.variantId ?? "base"}`}>
                        <p className="font-medium">{item.name}</p>
                        {item.variantSnapshot ? (
                          <p className="text-xs text-muted-foreground">
                            {[item.variantSnapshot.size && `Tam. ${item.variantSnapshot.size}`, item.variantSnapshot.color && item.variantSnapshot.color]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        ) : null}
                      </div>
                    ))}
                    {order.items.length > 2 ? <p className="text-xs text-muted-foreground">+ {order.items.length - 2} item(ns)</p> : null}
                  </div>
                </td>
                <td className="px-4 py-3">{formatCurrency(order.total)}</td>
                <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                <td className="px-4 py-3"><PaymentStatusBadge status={order.paymentStatus} /></td>
                <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <Link className="rounded-md border px-3 py-2 text-xs font-medium" href={`/admin/pedidos/${order.id}`}>
                    Ver detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
