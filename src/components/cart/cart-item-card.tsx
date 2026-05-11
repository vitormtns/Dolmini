"use client";

import { useCart } from "@/components/cart/cart-provider";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { formatCurrency } from "@/lib/format";

export function CartItemCard({
  productId,
  variantId
}: {
  productId: string;
  variantId?: string;
}) {
  const { items, validatedCart, updateQuantity, removeItem } = useCart();
  const rawItem = items.find(
    (item) => item.productId === productId && (item.variantId ?? null) === (variantId ?? null)
  );
  const validatedItem = validatedCart?.items.find(
    (item) => item.productId === productId && (item.variantId ?? null) === (variantId ?? null)
  );

  if (!rawItem) return null;

  return (
    <div className="grid grid-cols-[84px_1fr] gap-3 rounded-[1rem] border border-[rgba(0,62,64,0.12)] bg-white p-3 shadow-soft sm:flex sm:gap-4 sm:rounded-[1.2rem] sm:p-4">
      <div className="h-28 w-[84px] shrink-0 overflow-hidden rounded-[0.8rem] bg-[#EFE7DC] sm:h-32 sm:w-28 sm:rounded-[0.9rem]">
        {validatedItem?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt={validatedItem.name} className="h-full w-full object-cover" src={validatedItem.imageUrl} />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="font-extrabold tracking-tight text-primary">{validatedItem?.name ?? "Produto no carrinho"}</h2>
        {validatedItem?.variantName ? <p className="text-sm text-muted-foreground">{validatedItem.variantName}</p> : null}
        <p className="mt-2 text-sm text-muted-foreground">
          {validatedItem ? formatCurrency(validatedItem.unitPrice) : "Pre\u00e7o ser\u00e1 recalculado no servidor"}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
          <QuantityStepper value={rawItem.quantity} onChange={(quantity) => updateQuantity(productId, variantId, quantity)} />
          <button className="min-h-11 text-sm font-semibold text-red-700" onClick={() => removeItem(productId, variantId)} type="button">
            Remover
          </button>
        </div>
      </div>
      <strong className="col-span-2 border-t border-primary/10 pt-2 text-right text-sm font-extrabold text-primary sm:border-0 sm:pt-0 sm:text-base">{validatedItem ? formatCurrency(validatedItem.subtotal) : ""}</strong>
    </div>
  );
}
