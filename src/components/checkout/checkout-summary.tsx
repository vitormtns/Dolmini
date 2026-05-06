"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { formatCurrency } from "@/lib/format";

export function CheckoutSummary() {
  const { items, validatedCart, validationError, validating, validateCart } = useCart();

  useEffect(() => {
    if (items.length > 0) void validateCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  return (
    <aside className="rounded-[1.5rem] border border-primary/10 bg-white p-6 shadow-lift lg:sticky lg:top-32 lg:self-start">
      <h2 className="text-3xl font-extrabold tracking-tight text-primary">Resumo do pedido</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Recalculado pelo servidor antes do pagamento.
      </p>
      <div className="mt-5 grid gap-3">
        {validatedCart?.items.map((item) => (
          <div className="flex justify-between gap-4 text-sm" key={`${item.productId}-${item.variantId ?? "base"}`}>
            <div>
            <p className="font-bold text-primary">{item.name}</p>
              <p className="text-muted-foreground">Qtd. {item.quantity}</p>
            </div>
            <p className="font-extrabold text-primary">{formatCurrency(item.subtotal)}</p>
          </div>
        ))}
      </div>
      <dl className="mt-5 grid gap-2 border-t pt-4 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatCurrency(validatedCart?.subtotal ?? 0)}</dd></div>
        <div className="flex justify-between"><dt>Desconto</dt><dd>{formatCurrency(validatedCart?.discount ?? 0)}</dd></div>
        <div className="flex justify-between"><dt>Frete</dt><dd>{formatCurrency(validatedCart?.shipping ?? 0)}</dd></div>
        <div className="flex justify-between text-lg font-extrabold text-primary"><dt>Total</dt><dd>{formatCurrency(validatedCart?.total ?? 0)}</dd></div>
      </dl>
      {validationError ? <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{validationError}</p> : null}
      {validating ? <p className="mt-4 text-sm text-muted-foreground">Validando carrinho...</p> : null}
      <div className="mt-5 rounded-xl bg-[#F8F4EF] p-4 text-xs leading-5 text-[#6B7A7C]">
        Compra segura, estoque validado e pagamento confirmado apenas pelo provedor.
      </div>
    </aside>
  );
}
