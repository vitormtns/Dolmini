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
    <div className="grid gap-3 sm:max-w-sm">
      <div className="flex gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <button
          className="flex-1 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          onClick={add}
          type="button"
        >
          {disabled ? "Indisponivel" : "Adicionar ao carrinho"}
        </button>
      </div>
      {added ? (
        <Link className="text-sm font-medium text-emerald-700" href="/carrinho">
          Produto adicionado. Ver carrinho
        </Link>
      ) : null}
    </div>
  );
}
