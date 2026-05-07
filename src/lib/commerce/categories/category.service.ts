import { CategoryRepository } from "@/lib/commerce/categories/category.repository";
import type { CategoryCreateInput, CategoryUpdateInput } from "@/lib/commerce/categories/category.schema";
import { CommerceError } from "@/lib/commerce/shared/errors";

export class CategoryService {
  constructor(private readonly categories: CategoryRepository) {}

  listPublic() {
    return this.categories.list(false);
  }

  async getPublicBySlug(slug: string) {
    const category = await this.categories.findBySlug(slug);
    if (!category || category.status !== "active") {
      throw new CommerceError("Categoria não encontrada.", "category_not_found", 404);
    }

    return category;
  }

  listAdmin() {
    return this.categories.list(true);
  }

  async create(input: CategoryCreateInput) {
    const existing = await this.categories.findBySlug(input.slug);
    if (existing) {
      throw new CommerceError("Ja existe uma categoria com este slug.", "category_slug_exists", 409);
    }

    return this.categories.create(input);
  }

  async update(input: CategoryUpdateInput) {
    if (input.slug) {
      const existing = await this.categories.findBySlug(input.slug);
      if (existing && existing.id !== input.id) {
        throw new CommerceError("Ja existe uma categoria com este slug.", "category_slug_exists", 409);
      }
    }

    return this.categories.update(input);
  }
}
