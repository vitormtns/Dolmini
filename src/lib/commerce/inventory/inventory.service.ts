import type { SupabaseClient } from "@supabase/supabase-js";
import { CommerceError } from "@/lib/commerce/shared/errors";
import type { Product, ProductVariant } from "@/lib/commerce/products/product.types";

type Client = SupabaseClient<any, "public", any>;

export class InventoryService {
  constructor(private readonly supabase?: Client) {}

  assertAvailable(product: Product, quantity: number, variant?: ProductVariant | null) {
    if (product.status !== "active") {
      throw new CommerceError(`Produto ${product.name} não está ativo.`, "PRODUCT_UNAVAILABLE");
    }

    const stock = variant ? variant.stockQuantity : product.stockQuantity;

    if (variant && !variant.isActive) {
      throw new CommerceError(`Variação indisponível para ${product.name}.`, "PRODUCT_UNAVAILABLE");
    }

    if (stock < quantity) {
      throw new CommerceError(
        `Estoque insuficiente para ${product.name}. Disponível: ${stock}.`,
        "OUT_OF_STOCK"
      );
    }
  }

  async decrementForOrder(orderId: string) {
    if (!this.supabase) {
      throw new CommerceError("Cliente de banco não configurado.", "database_not_configured", 500);
    }

    const { data: order, error: orderError } = await this.supabase
      .from("orders")
      .select("id, stock_deducted_at")
      .eq("id", orderId)
      .single();

    if (orderError || !order) throw new CommerceError("Pedido não encontrado.", "order_not_found", 404);
    if (order.stock_deducted_at) return;

    const { data: items, error: itemsError } = await this.supabase
      .from("order_items")
      .select("product_id, variant_id, quantity")
      .eq("order_id", orderId);

    if (itemsError) throw itemsError;

    for (const item of items ?? []) {
      if (item.variant_id) {
        const { error } = await this.supabase.rpc("decrement_variant_stock", {
          p_variant_id: item.variant_id,
          p_quantity: item.quantity
        });
        if (error) throw error;
      } else {
        const { error } = await this.supabase.rpc("decrement_product_stock", {
          p_product_id: item.product_id,
          p_quantity: item.quantity
        });
        if (error) throw error;
      }
    }

    const { error: updateError } = await this.supabase
      .from("orders")
      .update({ stock_deducted_at: new Date().toISOString() })
      .eq("id", orderId)
      .is("stock_deducted_at", null);

    if (updateError) throw updateError;
  }
}
