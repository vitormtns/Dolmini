import type { Metadata } from "next";
import { CheckoutStatusCard } from "@/components/checkout/checkout-status-card";
import { StorefrontShell } from "@/components/storefront/storefront-shell";

export const metadata: Metadata = {
  title: "Pedido recebido | Dolmini Model"
};

export default function CheckoutSuccessPage() {
  return (
    <StorefrontShell>
      <main className="px-4 py-16">
        <CheckoutStatusCard
          tone="success"
          title="Pedido recebido"
          description="O Mercado Pago retornou sucesso, mas a aprovacao final do pedido depende da confirmacao via webhook. Voce recebera a atualizacao assim que o pagamento for confirmado."
        />
      </main>
    </StorefrontShell>
  );
}
