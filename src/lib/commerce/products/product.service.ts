import { CommerceError } from "@/lib/commerce/shared/errors";
import { ProductRepository } from "@/lib/commerce/products/product.repository";
import type { ProductCreateInput, ProductUpdateInput } from "@/lib/commerce/products/product.schema";
import type { ProductListFilters } from "@/lib/commerce/products/product.types";

export class ProductService {
  constructor(private readonly products: ProductRepository) {}

  listPublic(filters: ProductListFilters = {}) {
    return this.products.list({ ...filters, includeInactive: false });
  }

  listAdmin(filters: ProductListFilters = {}) {
    return this.products.list({ ...filters, includeInactive: true });
  }

  async getPublicBySlug(slug: string) {
    const product = await this.products.findBySlug(slug);
    if (!product || product.status !== "active") {
      throw new CommerceError("Produto nao encontrado.", "product_not_found", 404);
    }
    return product;
  }

  async getAdminById(id: string) {
    const product = await this.products.findById(id);
    if (!product) throw new CommerceError("Produto nao encontrado.", "product_not_found", 404);
    return product;
  }

  async create(input: ProductCreateInput) {
    const existing = await this.products.findBySlug(input.slug);
    if (existing) {
      throw new CommerceError("Ja existe um produto com este slug.", "product_slug_exists", 409);
    }

    return this.products.create(input);
  }

  async update(input: ProductUpdateInput) {
    if (input.slug) {
      const existing = await this.products.findBySlug(input.slug);
      if (existing && existing.id !== input.id) {
        throw new CommerceError("Ja existe um produto com este slug.", "product_slug_exists", 409);
      }
    }

    const product = await this.products.update(input);
    if (!product) throw new CommerceError("Produto nao encontrado.", "product_not_found", 404);
    return product;
  }

  archive(id: string) {
    return this.products.archive(id);
  }

  addImages(
    productId: string,
    images: Array<{
      storagePath: string;
      url: string | null;
      altText: string | null;
      sortOrder: number;
    }>
  ) {
    return this.products.addImages(productId, images);
  }

  removeImage(productId: string, imageId: string) {
    return this.products.removeImage(productId, imageId);
  }

  setPrimaryImage(productId: string, imageId: string) {
    return this.products.setPrimaryImage(productId, imageId);
  }
}
