import type { Metadata } from "next";
import { CheckoutStatusCard } from "@/components/checkout/checkout-status-card";
import { StorefrontShell } from "@/components/storefront/storefront-shell";

export const metadata: Metadata = {
  title: "Pagamento n\u00e3o conclu\u00eddo | Dolmini Model"
};

export default function CheckoutErrorPage() {
  return (
    <StorefrontShell>
      <main className="px-4 py-16">
        <CheckoutStatusCard
          tone="danger"
          title="Pagamento n\u00e3o conclu\u00eddo"
          description="O pagamento foi recusado, cancelado ou n\u00e3o pode ser finalizado. Voc\u00ea pode voltar aos produtos e tentar novamente."
        />
      </main>
    </StorefrontShell>
  );
}
