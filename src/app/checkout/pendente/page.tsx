import type { Metadata } from "next";
import { CheckoutStatusCard } from "@/components/checkout/checkout-status-card";
import { StorefrontShell } from "@/components/storefront/storefront-shell";

export const metadata: Metadata = {
  title: "Pagamento pendente | Dolmini Model"
};

export default function CheckoutPendingPage() {
  return (
    <StorefrontShell>
      <main className="px-4 py-10 sm:py-16">
        <CheckoutStatusCard
          tone="warning"
          title="Pagamento pendente"
          description="Seu pedido foi iniciado e est\u00e1 aguardando a confirma\u00e7\u00e3o do Mercado Pago. N\u00e3o aprovamos pagamento pela p\u00e1gina de retorno."
        />
      </main>
    </StorefrontShell>
  );
}
