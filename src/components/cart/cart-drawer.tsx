"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

export function CartLink() {
  const { count } = useCart();

  return (
    <Link className="relative inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/10 bg-white px-4 py-2 font-bold text-primary shadow-soft transition-colors hover:bg-primary hover:text-white" href="/carrinho">
      <ShoppingBag className="h-4 w-4" />
      <span className="hidden sm:inline">Carrinho</span>
      {count > 0 ? (
        <span className="inline-flex min-w-5 justify-center rounded-full bg-accent px-1.5 py-0.5 text-xs font-extrabold text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
