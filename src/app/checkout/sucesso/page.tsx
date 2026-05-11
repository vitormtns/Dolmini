import type { Metadata } from "next";
import { CheckoutStatusCard } from "@/components/checkout/checkout-status-card";
import { StorefrontShell } from "@/components/storefront/storefront-shell";

export const metadata: Metadata = {
  title: "Pedido recebido | Dolmini Model"
};

export default function CheckoutSuccessPage() {
  return (
    <StorefrontShell>
      <main className="px-4 py-10 sm:py-16">
        <CheckoutStatusCard
          tone="success"
          title="Pedido recebido"
          description="O Mercado Pago retornou sucesso, mas a aprova\u00e7\u00e3o final do pedido depende da confirma\u00e7\u00e3o via webhook. Voc\u00ea receber\u00e1 a atualiza\u00e7\u00e3o assim que o pagamento for confirmado."
        />
      </main>
    </StorefrontShell>
  );
}
