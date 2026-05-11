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
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
        <div className="mb-6 rounded-[1.2rem] border border-primary/10 bg-white p-5 shadow-soft sm:mb-10 sm:rounded-[2rem] sm:p-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent sm:tracking-[0.24em]">Checkout seguro</p>
          <h1 className="mt-3 text-[clamp(2.25rem,10vw,3rem)] font-extrabold leading-[1.04] tracking-tight text-primary sm:text-6xl">Dados para finalizar</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            O pedido será criado como pagamento pendente. A confirmação final depende do Mercado Pago e do webhook.
          </p>
        </div>
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1fr_400px]">
          <CheckoutForm />
          <CheckoutSummary />
        </div>
      </main>
    </StorefrontShell>
  );
}
