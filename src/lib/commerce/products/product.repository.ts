import type { SupabaseClient } from "@supabase/supabase-js";
import type { Product, ProductListFilters } from "@/lib/commerce/products/product.types";
import type { ProductCreateInput, ProductUpdateInput } from "@/lib/commerce/products/product.schema";

type Client = SupabaseClient<any, "public", any>;

function mapProduct(row: any): Product {
  const productPrice = Number(row.sale_price ?? row.price);
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    price: Number(row.price),
    salePrice: row.sale_price == null ? null : Number(row.sale_price),
    stockQuantity: row.stock_quantity,
    status: row.status,
    isFeatured: Boolean(row.is_featured),
    isPromotion: Boolean(row.is_promotion),
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    images: (row.product_images ?? []).map((image: any) => ({
      id: image.id,
      productId: image.product_id,
      storagePath: image.storage_path,
      url: image.url,
      altText: image.alt_text,
      sortOrder: image.sort_order
    })),
    variants: (row.product_variants ?? []).map((variant: any) => ({
      id: variant.id,
      productId: variant.product_id,
      sku: variant.sku,
      size: variant.size ?? variant.option_values?.size ?? variant.option_values?.tamanho ?? null,
      color: variant.color ?? variant.option_values?.color ?? variant.option_values?.cor ?? null,
      name: buildVariantName({
        size: variant.size ?? variant.option_values?.size ?? variant.option_values?.tamanho ?? null,
        color: variant.color ?? variant.option_values?.color ?? variant.option_values?.cor ?? null,
        fallback: variant.name
      }),
      price: variant.price_cents == null
        ? (variant.price_adjustment ? Number(productPrice + Number(variant.price_adjustment)) : null)
        : Number(variant.price_cents) / 100,
      priceCents: variant.price_cents == null
        ? (variant.price_adjustment ? Math.round((productPrice + Number(variant.price_adjustment)) * 100) : null)
        : Number(variant.price_cents),
      stockQuantity: variant.stock_quantity,
      isActive: variant.is_active ?? variant.status === "active"
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

const productSelect = `
  *,
  product_images(*),
  product_variants(*)
`;

export class ProductRepository {
  constructor(private readonly supabase: Client) {}

  async list(filters: ProductListFilters = {}) {
    let query = this.supabase
      .from("products")
      .select(productSelect)
      .order("created_at", { ascending: false });

    if (!filters.includeInactive) {
      query = query.eq("status", "active");
    }

    if (filters.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.categoryId) {
      query = query.eq("category_id", filters.categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapProduct);
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from("products")
      .select(productSelect)
      .eq("id", id)
      .single();

    if (error) return null;
    return mapProduct(data);
  }

  async findManyByIds(ids: string[]) {
    if (ids.length === 0) return [];

    const { data, error } = await this.supabase
      .from("products")
      .select(productSelect)
      .in("id", ids);

    if (error) throw error;
    return (data ?? []).map(mapProduct);
  }

  async findBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from("products")
      .select(productSelect)
      .eq("slug", slug)
      .single();

    if (error) return null;
    return mapProduct(data);
  }

  async create(input: ProductCreateInput) {
    const { images, variants, ...product } = input;
    const { data, error } = await this.supabase
      .from("products")
      .insert({
        category_id: product.categoryId ?? null,
        name: product.name,
        slug: product.slug,
        short_description: product.shortDescription ?? null,
        description: product.description ?? null,
        price: product.price,
        sale_price: product.salePrice ?? null,
        stock_quantity: product.stockQuantity,
        status: product.status,
        is_featured: product.isFeatured,
        is_promotion: product.isPromotion,
        seo_title: product.seoTitle ?? null,
        seo_description: product.seoDescription ?? null
      })
      .select("id")
      .single();

    if (error) throw error;

    await this.replaceRelations(data.id, images, variants);
    return this.findById(data.id);
  }

  async update(input: ProductUpdateInput) {
    const { id, images, variants, ...product } = input;

    const payload: Record<string, unknown> = {};
    if (product.categoryId !== undefined) payload.category_id = product.categoryId;
    if (product.name !== undefined) payload.name = product.name;
    if (product.slug !== undefined) payload.slug = product.slug;
    if (product.shortDescription !== undefined) payload.short_description = product.shortDescription;
    if (product.description !== undefined) payload.description = product.description;
    if (product.price !== undefined) payload.price = product.price;
    if (product.salePrice !== undefined) payload.sale_price = product.salePrice;
    if (product.stockQuantity !== undefined) payload.stock_quantity = product.stockQuantity;
    if (product.status !== undefined) payload.status = product.status;
    if (product.isFeatured !== undefined) payload.is_featured = product.isFeatured;
    if (product.isPromotion !== undefined) payload.is_promotion = product.isPromotion;
    if (product.seoTitle !== undefined) payload.seo_title = product.seoTitle;
    if (product.seoDescription !== undefined) payload.seo_description = product.seoDescription;

    if (Object.keys(payload).length > 0) {
      const { error } = await this.supabase.from("products").update(payload).eq("id", id);
      if (error) throw error;
    }

    if (images || variants) {
      await this.replaceRelations(id, images, variants);
    }

    return this.findById(id);
  }

  async archive(id: string) {
    const { error } = await this.supabase
      .from("products")
      .update({ status: "archived" })
      .eq("id", id);

    if (error) throw error;
  }

  async addImages(
    productId: string,
    images: Array<{
      storagePath: string;
      url: string | null;
      altText: string | null;
      sortOrder: number;
    }>
  ) {
    const { error } = await this.supabase.from("product_images").insert(
      images.map((image) => ({
        product_id: productId,
        storage_path: image.storagePath,
        url: image.url,
        alt_text: image.altText,
        sort_order: image.sortOrder
      }))
    );

    if (error) throw error;
    return this.findById(productId);
  }

  async removeImage(productId: string, imageId: string) {
    const { data, error } = await this.supabase
      .from("product_images")
      .delete()
      .eq("id", imageId)
      .eq("product_id", productId)
      .select("storage_path")
      .single();

    if (error) throw error;
    return data?.storage_path as string | undefined;
  }

  async setPrimaryImage(productId: string, imageId: string) {
    const product = await this.findById(productId);
    if (!product) return null;

    const results = await Promise.all(
      product.images.map((image) =>
        this.supabase
          .from("product_images")
          .update({ sort_order: image.id === imageId ? 0 : image.sortOrder + 1 })
          .eq("id", image.id)
          .eq("product_id", productId)
      )
    );
    const error = results.find((result) => result.error)?.error;
    if (error) throw error;

    return this.findById(productId);
  }

  private async replaceRelations(
    productId: string,
    images: ProductCreateInput["images"] | undefined,
    variants: ProductCreateInput["variants"] | undefined
  ) {
    if (images) {
      await this.supabase.from("product_images").delete().eq("product_id", productId);
    }
    if (variants) {
      await this.supabase.from("product_variants").delete().eq("product_id", productId);
    }

    if (images && images.length > 0) {
      const { error } = await this.supabase.from("product_images").insert(
        images.map((image) => ({
          product_id: productId,
          storage_path: image.storagePath,
          url: image.url ?? null,
          alt_text: image.altText ?? null,
          sort_order: image.sortOrder
        }))
      );
      if (error) throw error;
    }

    if (variants && variants.length > 0) {
      const { error } = await this.supabase.from("product_variants").insert(
        variants.map((variant) => ({
          product_id: productId,
          sku: variant.sku ?? null,
          size: variant.size?.trim() || null,
          color: variant.color?.trim() || null,
          name: buildVariantName({ size: variant.size, color: variant.color }),
          option_values: {
            ...(variant.size?.trim() ? { size: variant.size.trim() } : {}),
            ...(variant.color?.trim() ? { color: variant.color.trim() } : {})
          },
          price_cents: variant.price == null ? null : Math.round(variant.price * 100),
          price_adjustment: 0,
          stock_quantity: variant.stockQuantity,
          is_active: variant.isActive,
          status: variant.isActive ? "active" : "archived"
        }))
      );
      if (error) throw error;
    }
  }
}

function buildVariantName(input: {
  size?: string | null;
  color?: string | null;
  fallback?: string | null;
}) {
  const parts = [input.size, input.color].filter(Boolean);
  if (parts.length > 0) return parts.join(" · ");
  return input.fallback ?? "Variação";
}


