import type { Metadata } from "next";
import { CheckoutStatusCard } from "@/components/checkout/checkout-status-card";
import { StorefrontShell } from "@/components/storefront/storefront-shell";

export const metadata: Metadata = {
  title: "Pagamento não concluído | Dolmini Model"
};

export default function CheckoutErrorPage() {
  return (
    <StorefrontShell>
      <main className="px-4 py-10 sm:py-16">
        <CheckoutStatusCard
          tone="danger"
          title="Pagamento não concluído"
          description="O pagamento foi recusado, cancelado ou não pôde ser finalizado."
          secondaryDescription="Você pode voltar ao carrinho, revisar seus itens e tentar novamente."
        />
      </main>
    </StorefrontShell>
  );
}
