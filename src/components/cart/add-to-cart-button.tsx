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
      <div className="grid gap-3 min-[390px]:grid-cols-[auto_1fr]">
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <button
          className="min-h-12 rounded-full bg-primary px-5 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-primary-foreground shadow-lift transition-colors hover:bg-[#002D2F] disabled:cursor-not-allowed disabled:opacity-60 sm:tracking-[0.1em]"
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
