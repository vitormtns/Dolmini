import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/cart-page-content";
import { StorefrontShell } from "@/components/storefront/storefront-shell";

export const metadata: Metadata = {
  title: "Carrinho | Dolmini Model",
  description: "Revise seus produtos antes do checkout."
};

export default function CartPage() {
  return (
    <StorefrontShell>
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
        <div className="mb-6 rounded-[1.2rem] border border-primary/10 bg-white p-5 shadow-soft sm:mb-10 sm:rounded-[2rem] sm:p-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent sm:tracking-[0.24em]">Carrinho</p>
          <h1 className="mt-3 text-[clamp(2.25rem,10vw,3rem)] font-extrabold leading-[1.04] tracking-tight text-primary sm:text-6xl">Revise sua compra</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            O resumo e a disponibilidade são recalculados no servidor antes de seguir para o checkout.
          </p>
        </div>
        <CartPageContent />
      </main>
    </StorefrontShell>
  );
}
