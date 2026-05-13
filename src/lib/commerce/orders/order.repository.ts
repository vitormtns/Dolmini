import type { SupabaseClient } from "@supabase/supabase-js";
import type { ValidatedCart } from "@/lib/commerce/cart/cart.types";
import type { CustomerSnapshot, Order, OrderStatus, PaymentStatus } from "@/lib/commerce/orders/order.types";

type Client = SupabaseClient<any, "public", any>;

function mapOrder(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerId: row.customer_id,
    status: row.status,
    paymentStatus: row.payment_status,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    shipping: Number(row.shipping),
    total: Number(row.total),
    totalCents: Number(row.total_cents),
    currency: row.currency,
    customerSnapshot: row.customer_snapshot,
    mercadoPagoPreferenceId: row.mercado_pago_preference_id,
    mercadoPagoPaymentId: row.mercado_pago_payment_id,
    stockDeductedAt: row.stock_deducted_at,
    items: (row.order_items ?? []).map((item: any) => ({
      productId: item.product_id,
      variantId: item.variant_id,
      name: item.product_name,
      variantName: item.variant_name,
      variantSnapshot: item.selected_variant_json ?? null,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price),
      subtotal: Number(item.subtotal),
      imageUrl: item.image_url
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

const orderSelect = "*, order_items(*)";

export class OrderRepository {
  constructor(private readonly supabase: Client) {}

  async list() {
    const { data, error } = await this.supabase
      .from("orders")
      .select(orderSelect)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(mapOrder);
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from("orders")
      .select(orderSelect)
      .eq("id", id)
      .single();

    if (error) return null;
    return mapOrder(data);
  }

  async findByOrderNumber(orderNumber: string) {
    const { data, error } = await this.supabase
      .from("orders")
      .select(orderSelect)
      .eq("order_number", orderNumber)
      .single();

    if (error) return null;
    return mapOrder(data);
  }

  async createPendingPayment(customer: CustomerSnapshot, cart: ValidatedCart) {
    const orderNumber = this.generateOrderNumber();

    const { data: customerRow, error: customerError } = await this.supabase
      .from("customers")
      .upsert(
        {
          email: customer.email,
          name: customer.name,
          phone: customer.phone ?? null,
          document: customer.document ?? null
        },
        { onConflict: "email" }
      )
      .select("id")
      .single();

    if (customerError) throw customerError;

    const { data: order, error } = await this.supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_id: customerRow.id,
        status: "pending_payment",
        payment_status: "pending",
        subtotal: cart.subtotal,
        discount: cart.discount,
        shipping: cart.shipping,
        total: cart.total,
        currency: "BRL",
        customer_snapshot: customer
      })
      .select("id")
      .single();

    if (error) throw error;

    const { error: itemError } = await this.supabase.from("order_items").insert(
      cart.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId,
        product_name: item.name,
        variant_name: item.variantName,
        selected_variant_json: item.variantSnapshot,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: item.subtotal,
        image_url: item.imageUrl
      }))
    );

    if (itemError) throw itemError;

    return this.findById(order.id);
  }

  async attachMercadoPagoPreference(orderId: string, preferenceId: string) {
    const { error } = await this.supabase
      .from("orders")
      .update({ mercado_pago_preference_id: preferenceId })
      .eq("id", orderId);

    if (error) throw error;
  }

  async updatePaymentState(
    orderId: string,
    input: {
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
      mercadoPagoPaymentId?: string;
    }
  ) {
    const { error } = await this.supabase
      .from("orders")
      .update({
        status: input.status,
        payment_status: input.paymentStatus,
        mercado_pago_payment_id: input.mercadoPagoPaymentId
      })
      .eq("id", orderId);

    if (error) throw error;
  }

  private generateOrderNumber() {
    const date = new Date();
    const stamp = date.toISOString().slice(0, 10).replaceAll("-", "");
    const entropy = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `DM-${stamp}-${entropy}`;
  }
}
