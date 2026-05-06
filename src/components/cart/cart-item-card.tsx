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
    <div className="flex gap-4 rounded-[1.2rem] border border-[rgba(0,62,64,0.12)] bg-white p-4 shadow-soft">
      <div className="h-32 w-24 shrink-0 overflow-hidden rounded-[0.9rem] bg-[#EFE7DC] sm:w-28">
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
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <QuantityStepper value={rawItem.quantity} onChange={(quantity) => updateQuantity(productId, variantId, quantity)} />
          <button className="min-h-11 text-sm font-semibold text-red-700" onClick={() => removeItem(productId, variantId)} type="button">
            Remover
          </button>
        </div>
      </div>
      <strong className="text-right text-sm font-extrabold text-primary sm:text-base">{validatedItem ? formatCurrency(validatedItem.subtotal) : ""}</strong>
    </div>
  );
}
