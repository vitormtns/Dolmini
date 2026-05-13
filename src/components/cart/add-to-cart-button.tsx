"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import type { ProductVariant } from "@/lib/commerce/products/product.types";
import { formatCurrency } from "@/lib/format";

export function AddToCartButton({
  productId,
  disabled = false,
  variants = [],
  basePrice
}: {
  productId: string;
  disabled?: boolean;
  variants?: ProductVariant[];
  basePrice?: number;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeVariants = useMemo(
    () => variants.filter((variant) => variant.isActive),
    [variants]
  );
  const hasVariants = activeVariants.length > 0;
  const selectedVariant = activeVariants.find((variant) => variant.id === selectedVariantId) ?? null;
  const selectedStock = selectedVariant?.stockQuantity;
  const buttonDisabled = disabled || (hasVariants && selectedVariant?.stockQuantity === 0);

  function add() {
    setError(null);

    if (hasVariants && !selectedVariant) {
      setError("Escolha uma variação antes de adicionar ao carrinho.");
      return;
    }

    if (selectedVariant && selectedVariant.stockQuantity <= 0) {
      setError("Esta variação está indisponível no momento.");
      return;
    }

    addItem({ productId, variantId: selectedVariant?.id, quantity });
    setAdded(true);
  }

  return (
    <div className="grid gap-3 sm:max-w-md">
      {hasVariants ? (
        <div className="grid gap-2">
          <p className="text-sm font-extrabold text-primary">Escolha a variação</p>
          <div className="grid gap-2">
            {activeVariants.map((variant) => {
              const unavailable = variant.stockQuantity <= 0;
              const selected = variant.id === selectedVariantId;
              return (
                <button
                  className={`min-h-14 rounded-[0.9rem] border px-4 py-3 text-left text-sm transition-colors ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : unavailable
                        ? "border-zinc-200 bg-zinc-50 text-zinc-400"
                        : "border-primary/15 bg-white text-primary hover:bg-[#F8F4EF]"
                  }`}
                  disabled={unavailable}
                  key={variant.id}
                  type="button"
                  onClick={() => {
                    setSelectedVariantId(variant.id);
                    setError(null);
                  }}
                >
                  <span className="block font-extrabold">{variant.name}</span>
                  <span className="mt-1 block text-xs opacity-80">
                    {unavailable ? "Indisponível" : `${variant.stockQuantity} em estoque`}
                    {variant.price != null && variant.price !== basePrice ? ` · ${formatCurrency(variant.price)}` : ""}
                  </span>
                </button>
              );
            })}
          </div>
          {selectedStock != null ? (
            <p className="text-xs font-medium text-muted-foreground">Estoque da opção selecionada: {selectedStock}</p>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{error}</p> : null}

      <div className="grid gap-3 min-[390px]:grid-cols-[auto_1fr]">
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <button
          className="min-h-12 rounded-full bg-primary px-5 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-primary-foreground shadow-lift transition-colors hover:bg-[#002D2F] disabled:cursor-not-allowed disabled:opacity-60 sm:tracking-[0.1em]"
          disabled={buttonDisabled}
          onClick={add}
          type="button"
        >
          {buttonDisabled ? "Indisponível" : "Adicionar ao carrinho"}
        </button>
      </div>
      {added ? (
        <Link className="text-sm font-semibold text-primary underline-offset-4 hover:underline" href="/carrinho">
          Produto adicionado. Ver carrinho
        </Link>
      ) : null}
    </div>
  );
}
