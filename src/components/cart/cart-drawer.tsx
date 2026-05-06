"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

export function CartLink() {
  const { count } = useCart();

  return (
    <Link className="relative inline-flex items-center gap-2 hover:text-foreground" href="/carrinho">
      <ShoppingBag className="h-4 w-4" />
      <span>Carrinho</span>
      {count > 0 ? (
        <span className="inline-flex min-w-5 justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
