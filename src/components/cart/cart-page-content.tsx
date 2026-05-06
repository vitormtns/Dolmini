"use client";

import { useEffect } from "react";
import { CartItemCard } from "@/components/cart/cart-item-card";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { useCart } from "@/components/cart/cart-provider";

export function CartPageContent() {
  const { items, clearCart, validateCart, validating, validationError } = useCart();

  useEffect(() => {
    if (items.length > 0) void validateCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {validating
              ? "Validando disponibilidade..."
              : validationError
                ? "Algum item precisa de revisao antes do checkout."
                : "Revise os itens antes de finalizar."}
          </p>
          <button className="text-sm font-medium text-red-700" onClick={clearCart} type="button">
            Limpar carrinho
          </button>
        </div>
        {items.map((item) => (
          <CartItemCard
            key={`${item.productId}-${item.variantId ?? "base"}`}
            productId={item.productId}
            variantId={item.variantId}
          />
        ))}
      </section>
      <CartSummary />
    </div>
  );
}
