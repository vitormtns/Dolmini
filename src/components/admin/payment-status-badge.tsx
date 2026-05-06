import type { PaymentStatus } from "@/lib/commerce/orders/order.types";
import { cn } from "@/lib/utils";

const labels: Record<PaymentStatus, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Recusado",
  cancelled: "Cancelado",
  refunded: "Reembolsado"
};

const styles: Partial<Record<PaymentStatus, string>> = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  cancelled: "border-zinc-200 bg-zinc-100 text-zinc-700",
  refunded: "border-amber-200 bg-amber-50 text-amber-700"
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-medium", styles[status] ?? "border-amber-200 bg-amber-50 text-amber-700")}>
      {labels[status]}
    </span>
  );
}
