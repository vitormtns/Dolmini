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
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-10 rounded-[2rem] border border-primary/10 bg-white p-7 shadow-soft">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-accent">Checkout seguro</p>
          <h1 className="mt-3 text-5xl font-extrabold leading-[1.02] tracking-tight text-primary sm:text-6xl">Dados para finalizar</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            O pedido ser&aacute; criado como pagamento pendente. A confirma&ccedil;&atilde;o final depende do Mercado Pago e do webhook.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <CheckoutForm />
          <CheckoutSummary />
        </div>
      </main>
    </StorefrontShell>
  );
}
