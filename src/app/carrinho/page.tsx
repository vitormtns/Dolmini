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
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-10 rounded-[2rem] border border-primary/10 bg-white p-7 shadow-soft">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-accent">Carrinho</p>
          <h1 className="mt-3 text-5xl font-extrabold leading-[1.02] tracking-tight text-primary sm:text-6xl">Revise sua compra</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            O resumo e a disponibilidade s&atilde;o recalculados no servidor antes de seguir para o checkout.
          </p>
        </div>
        <CartPageContent />
      </main>
    </StorefrontShell>
  );
}
