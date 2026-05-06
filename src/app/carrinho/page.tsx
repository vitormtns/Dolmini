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
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Carrinho</p>
          <h1 className="mt-2 text-3xl font-semibold">Revise sua compra</h1>
        </div>
        <CartPageContent />
      </main>
    </StorefrontShell>
  );
}
