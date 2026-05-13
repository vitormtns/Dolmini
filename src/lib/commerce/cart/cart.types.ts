export type CartInputItem = {
  productId: string;
  variantId?: string;
  quantity: number;
};

export type ValidatedCartItem = {
  productId: string;
  variantId: string | null;
  name: string;
  variantName: string | null;
  variantSnapshot: {
    variantId: string;
    size: string | null;
    color: string | null;
    sku: string | null;
  } | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl: string | null;
};

export type ValidatedCart = {
  items: ValidatedCartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};
