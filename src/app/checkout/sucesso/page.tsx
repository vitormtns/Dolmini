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
          description="Recebemos o retorno do Mercado Pago. A confirmação final do pagamento é feita com segurança pelo webhook."
          secondaryDescription="Assim que o pagamento for confirmado, o pedido será atualizado automaticamente."
        />
      </main>
    </StorefrontShell>
  );
}
