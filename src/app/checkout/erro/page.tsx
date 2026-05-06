import type { Metadata } from "next";
import { CheckoutStatusCard } from "@/components/checkout/checkout-status-card";
import { StorefrontShell } from "@/components/storefront/storefront-shell";

export const metadata: Metadata = {
  title: "Pagamento nao concluido | Dolmini Model"
};

export default function CheckoutErrorPage() {
  return (
    <StorefrontShell>
      <main className="px-4 py-16">
        <CheckoutStatusCard
          tone="danger"
          title="Pagamento nao concluido"
          description="O pagamento foi recusado, cancelado ou nao pode ser finalizado. Voce pode voltar aos produtos e tentar novamente."
        />
      </main>
    </StorefrontShell>
  );
}
