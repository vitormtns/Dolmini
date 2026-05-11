"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { formatCurrency } from "@/lib/format";

export function CartSummary({ checkoutHref = "/checkout" }: { checkoutHref?: string }) {
  const { validatedCart, validationError, validating, validateCart } = useCart();
  const canCheckout = Boolean(validatedCart && !validationError);

  return (
    <aside className="rounded-[1.1rem] border border-primary/10 bg-white p-5 shadow-lift sm:rounded-[1.5rem] sm:p-6 lg:sticky lg:top-32 lg:self-start">
      <h2 className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">Resumo</h2>
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
      <button className="mt-5 min-h-11 w-full rounded-full border border-primary/15 px-4 py-2 text-sm font-extrabold uppercase tracking-[0.1em] text-primary transition-colors hover:bg-muted" onClick={validateCart} type="button">
        {validating ? "Validando..." : "Revalidar carrinho"}
      </button>
      {canCheckout ? (
        <Link className="mt-3 inline-flex min-h-11 w-full justify-center rounded-full bg-primary px-4 py-3 text-sm font-extrabold uppercase tracking-[0.1em] text-primary-foreground shadow-lift transition-colors hover:bg-[#002D2F]" href={checkoutHref}>
          Finalizar compra
        </Link>
      ) : (
        <button className="mt-3 min-h-11 w-full rounded-full bg-primary/50 px-4 py-3 text-sm font-extrabold uppercase tracking-[0.1em] text-primary-foreground" disabled type="button">
          Valide o carrinho para continuar
        </button>
      )}
    </aside>
  );
}
