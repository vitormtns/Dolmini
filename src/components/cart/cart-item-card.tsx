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
    <div className="flex gap-4 rounded-lg border bg-white p-4">
      <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
        {validatedItem?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt={validatedItem.name} className="h-full w-full object-cover" src={validatedItem.imageUrl} />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="font-medium">{validatedItem?.name ?? "Produto no carrinho"}</h2>
        {validatedItem?.variantName ? <p className="text-sm text-muted-foreground">{validatedItem.variantName}</p> : null}
        <p className="mt-2 text-sm text-muted-foreground">
          {validatedItem ? formatCurrency(validatedItem.unitPrice) : "Preco sera recalculado no servidor"}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <QuantityStepper value={rawItem.quantity} onChange={(quantity) => updateQuantity(productId, variantId, quantity)} />
          <button className="text-sm font-medium text-red-700" onClick={() => removeItem(productId, variantId)} type="button">
            Remover
          </button>
        </div>
      </div>
      <strong className="text-sm">{validatedItem ? formatCurrency(validatedItem.subtotal) : ""}</strong>
    </div>
  );
}
