"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { formatCurrency } from "@/lib/format";

export function CartSummary({ checkoutHref = "/checkout" }: { checkoutHref?: string }) {
  const { validatedCart, validationError, validating, validateCart } = useCart();
  const canCheckout = Boolean(validatedCart && !validationError);

  return (
    <aside className="rounded-lg border bg-white p-5">
      <h2 className="font-semibold">Resumo</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Valores estimados visualmente. O checkout recalcula tudo no servidor.
      </p>
      <dl className="mt-5 grid gap-2 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatCurrency(validatedCart?.subtotal ?? 0)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Desconto</dt>
          <dd>{formatCurrency(validatedCart?.discount ?? 0)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Frete</dt>
          <dd>{formatCurrency(validatedCart?.shipping ?? 0)}</dd>
        </div>
        <div className="flex justify-between border-t pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatCurrency(validatedCart?.total ?? 0)}</dd>
        </div>
      </dl>
      {validationError ? <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{validationError}</p> : null}
      <button className="mt-5 w-full rounded-md border px-4 py-2 text-sm font-medium" onClick={validateCart} type="button">
        {validating ? "Validando..." : "Revalidar carrinho"}
      </button>
      {canCheckout ? (
        <Link className="mt-3 inline-flex w-full justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground" href={checkoutHref}>
          Ir para checkout
        </Link>
      ) : (
        <button className="mt-3 w-full rounded-md bg-primary/50 px-4 py-2.5 text-sm font-medium text-primary-foreground" disabled type="button">
          Valide o carrinho para continuar
        </button>
      )}
    </aside>
  );
}
