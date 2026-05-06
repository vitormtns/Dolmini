import type { Metadata } from "next";
import { CheckoutStatusCard } from "@/components/checkout/checkout-status-card";
import { StorefrontShell } from "@/components/storefront/storefront-shell";

export const metadata: Metadata = {
  title: "Pagamento pendente | Dolmini Model"
};

export default function CheckoutPendingPage() {
  return (
    <StorefrontShell>
      <main className="px-4 py-16">
        <CheckoutStatusCard
          tone="warning"
          title="Pagamento pendente"
          description="Seu pedido foi iniciado e esta aguardando a confirmacao do Mercado Pago. Nao aproveitamos pagamento pela pagina de retorno."
        />
      </main>
    </StorefrontShell>
  );
}
