"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartInputItem, ValidatedCart } from "@/lib/commerce/cart/cart.types";

type CartContextValue = {
  items: CartInputItem[];
  count: number;
  validatedCart: ValidatedCart | null;
  validationError: string | null;
  validating: boolean;
  addItem: (item: CartInputItem) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  validateCart: () => Promise<ValidatedCart | null>;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "dolmini-cart-v1";

function sameItem(a: CartInputItem, b: CartInputItem) {
  return a.productId === b.productId && (a.variantId ?? null) === (b.variantId ?? null);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartInputItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [validatedCart, setValidatedCart] = useState<ValidatedCart | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [hydrated, items]);

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  function addItem(item: CartInputItem) {
    setItems((current) => {
      const existing = current.find((candidate) => sameItem(candidate, item));
      if (!existing) return [...current, item];
      return current.map((candidate) =>
        sameItem(candidate, item)
          ? { ...candidate, quantity: candidate.quantity + item.quantity }
          : candidate
      );
    });
  }

  function updateQuantity(productId: string, variantId: string | undefined, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.productId === productId && (item.variantId ?? null) === (variantId ?? null)
          ? { ...item, quantity }
          : item
      )
    );
  }

  function removeItem(productId: string, variantId?: string) {
    setItems((current) =>
      current.filter(
        (item) => !(item.productId === productId && (item.variantId ?? null) === (variantId ?? null))
      )
    );
  }

  function clearCart() {
    setItems([]);
    setValidatedCart(null);
    setValidationError(null);
  }

  async function validateCart() {
    if (items.length === 0) {
      setValidatedCart(null);
      setValidationError("Carrinho vazio.");
      return null;
    }

    setValidating(true);
    setValidationError(null);
    const response = await fetch("/api/cart/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    });
    const body = await response.json();
    setValidating(false);

    if (!response.ok || !body.success) {
      setValidatedCart(null);
      setValidationError(body.error ?? "Revise os itens do carrinho.");
      return null;
    }

    setValidatedCart(body.data.cart);
    return body.data.cart as ValidatedCart;
  }

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        validatedCart,
        validationError,
        validating,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        validateCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider.");
  return context;
}
