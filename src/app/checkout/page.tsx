import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { StorefrontShell } from "@/components/storefront/storefront-shell";

export const metadata: Metadata = {
  title: "Checkout | Dolmini Model",
  description: "Finalize sua compra com pagamento seguro."
};

export default function CheckoutPage() {
  return (
    <StorefrontShell>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Checkout</p>
          <h1 className="mt-2 text-3xl font-semibold">Dados para finalizar</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            O pedido sera criado como pagamento pendente. A confirmacao final depende do Mercado Pago e do webhook.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <CheckoutForm />
          <CheckoutSummary />
        </div>
      </main>
    </StorefrontShell>
  );
}
