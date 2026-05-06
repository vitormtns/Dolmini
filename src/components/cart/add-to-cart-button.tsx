"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { QuantityStepper } from "@/components/cart/quantity-stepper";

export function AddToCartButton({
  productId,
  disabled = false
}: {
  productId: string;
  disabled?: boolean;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function add() {
    addItem({ productId, quantity });
    setAdded(true);
  }

  return (
    <div className="grid gap-3 sm:max-w-md">
      <div className="flex gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <button
          className="min-h-12 flex-1 rounded-full bg-primary px-5 py-3 text-sm font-extrabold uppercase tracking-[0.1em] text-primary-foreground shadow-lift transition-colors hover:bg-[#002D2F] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          onClick={add}
          type="button"
        >
          {disabled ? "Indispon\u00edvel" : "Adicionar ao carrinho"}
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
