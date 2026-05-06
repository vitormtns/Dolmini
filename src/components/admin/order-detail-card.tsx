"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Order, OrderStatus } from "@/lib/commerce/orders/order.types";
import { formatCurrency, formatDate } from "@/lib/format";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { PaymentStatusBadge } from "@/components/admin/payment-status-badge";

const operationalStatuses: Array<{ value: OrderStatus; label: string }> = [
  { value: "processing", label: "Preparando" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregue" },
  { value: "cancelled", label: "Cancelado" }
];

export function OrderDetailCard({ order }: { order: Order }) {
  const router = useRouter();
  const initialStatus = operationalStatuses.some((item) => item.value === order.status)
    ? order.status
    : "processing";
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus() {
    setSaving(true);
    setError(null);
    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, status })
    });
    const body = await response.json();
    setSaving(false);

    if (!response.ok || !body.success) {
      setError(body.error ?? "Nao foi possivel atualizar pedido.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
      <section className="rounded-lg border bg-white p-5">
        <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">{order.orderNumber}</h2>
            <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {order.items.map((item) => (
            <div className="flex justify-between gap-4 rounded-md border p-3" key={`${item.productId}-${item.variantId ?? "base"}`}>
              <div>
                <p className="font-medium">{item.name}</p>
                {item.variantName ? <p className="text-sm text-muted-foreground">{item.variantName}</p> : null}
                <p className="text-sm text-muted-foreground">Qtd. {item.quantity}</p>
              </div>
              <p className="font-medium">{formatCurrency(item.subtotal)}</p>
            </div>
          ))}
        </div>

        <dl className="mt-5 grid gap-2 border-t pt-4 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatCurrency(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Desconto</dt><dd>{formatCurrency(order.discount)}</dd></div>
          <div className="flex justify-between"><dt>Frete</dt><dd>{formatCurrency(order.shipping)}</dd></div>
          <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd>{formatCurrency(order.total)}</dd></div>
        </dl>
      </section>

      <aside className="grid gap-5">
        <section className="rounded-lg border bg-white p-5">
          <h2 className="font-semibold">Cliente</h2>
          <div className="mt-4 space-y-1 text-sm">
            <p>{order.customerSnapshot.name}</p>
            <p className="text-muted-foreground">{order.customerSnapshot.email}</p>
            <p className="text-muted-foreground">{order.customerSnapshot.phone ?? "Sem telefone"}</p>
            <p className="pt-3 text-muted-foreground">
              {order.customerSnapshot.address.line1}<br />
              {order.customerSnapshot.address.city}, {order.customerSnapshot.address.state}<br />
              {order.customerSnapshot.address.postalCode}
            </p>
          </div>
        </section>

        <section className="rounded-lg border bg-white p-5">
          <h2 className="font-semibold">Operacao</h2>
          {error ? <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          <label className="mt-4 grid gap-2 text-sm font-medium">
            Status do pedido
            <select className="rounded-md border px-3 py-2" value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)}>
              {operationalStatuses.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
          <button className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60" disabled={saving} onClick={updateStatus} type="button">
            {saving ? "Atualizando..." : "Atualizar status"}
          </button>
          <div className="mt-5 space-y-1 border-t pt-4 text-xs text-muted-foreground">
            <p>Pagamento: {order.paymentStatus}</p>
            <p>Mercado Pago payment id: {order.mercadoPagoPaymentId ?? "Nao informado"}</p>
            <p>Estoque baixado: {order.stockDeductedAt ? formatDate(order.stockDeductedAt) : "Nao"}</p>
          </div>
        </section>
      </aside>
    </div>
  );
}
