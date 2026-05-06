import type { OrderStatus } from "@/lib/commerce/orders/order.types";
import { cn } from "@/lib/utils";

const labels: Record<OrderStatus, string> = {
  draft: "Rascunho",
  pending_payment: "Aguardando pagamento",
  paid: "Pago",
  processing: "Preparando",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refunded: "Reembolsado"
};

const styles: Partial<Record<OrderStatus, string>> = {
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  processing: "border-blue-200 bg-blue-50 text-blue-700",
  shipped: "border-indigo-200 bg-indigo-50 text-indigo-700",
  delivered: "border-zinc-200 bg-zinc-100 text-zinc-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
  refunded: "border-amber-200 bg-amber-50 text-amber-700"
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-medium", styles[status] ?? "border-amber-200 bg-amber-50 text-amber-700")}>
      {labels[status]}
    </span>
  );
}
