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
