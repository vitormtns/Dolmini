export type ProductStatus = "active" | "draft" | "archived" | "out_of_stock";

export type ProductImage = {
  id: string;
  productId: string;
  storagePath: string;
  url: string | null;
  altText: string | null;
  sortOrder: number;
};

export type ProductVariant = {
  id: string;
  productId: string;
  sku: string | null;
  name: string;
  optionValues: Record<string, string>;
  priceAdjustment: number;
  stockQuantity: number;
  status: ProductStatus;
};

export type Product = {
  id: string;
  categoryId: string | null;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  price: number;
  salePrice: number | null;
  stockQuantity: number;
  status: ProductStatus;
  isFeatured: boolean;
  isPromotion: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
};

export type ProductListFilters = {
  includeInactive?: boolean;
  categorySlug?: string;
  categoryId?: string;
  search?: string;
  status?: ProductStatus;
};
