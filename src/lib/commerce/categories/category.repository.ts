import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category } from "@/lib/commerce/categories/category.types";
import type { CategoryCreateInput, CategoryUpdateInput } from "@/lib/commerce/categories/category.schema";

type Client = SupabaseClient<any, "public", any>;

function mapCategory(row: any): Category {
  return {
    id: row.id,
    parentId: row.parent_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    status: row.status,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export class CategoryRepository {
  constructor(private readonly supabase: Client) {}

  async list(includeInactive = false) {
    let query = this.supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!includeInactive) query = query.eq("status", "active");

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapCategory);
  }

  async findBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) return null;
    return mapCategory(data);
  }

  async create(input: CategoryCreateInput) {
    const { data, error } = await this.supabase
      .from("categories")
      .insert({
        parent_id: input.parentId ?? null,
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        status: input.status,
        sort_order: input.sortOrder
      })
      .select("*")
      .single();

    if (error) throw error;
    return mapCategory(data);
  }

  async update(input: CategoryUpdateInput) {
    const { id, ...category } = input;
    const payload: Record<string, unknown> = {};
    if (category.parentId !== undefined) payload.parent_id = category.parentId;
    if (category.name !== undefined) payload.name = category.name;
    if (category.slug !== undefined) payload.slug = category.slug;
    if (category.description !== undefined) payload.description = category.description;
    if (category.status !== undefined) payload.status = category.status;
    if (category.sortOrder !== undefined) payload.sort_order = category.sortOrder;

    const { data, error } = await this.supabase
      .from("categories")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return mapCategory(data);
  }
}
