import type { Order } from "@/lib/commerce/orders/order.types";
import { OrderRepository } from "@/lib/commerce/orders/order.repository";
import { env } from "@/lib/env";
import type { CreateCheckoutResult } from "@/lib/commerce/payments/payment.types";
import { MercadoPagoClient } from "@/lib/commerce/payments/mercado-pago/mercado-pago.client";

export class MercadoPagoService {
  constructor(
    private readonly client: MercadoPagoClient,
    private readonly orders: OrderRepository
  ) {}

  async createPreference(order: Order): Promise<CreateCheckoutResult> {
    const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    // Credenciais Mercado Pago entram somente no servidor via MERCADO_PAGO_ACCESS_TOKEN.
    const preference = await this.client.createPreference({
      items: order.items.map((item) => ({
        id: item.variantId ?? item.productId,
        title: item.variantName ? `${item.name} - ${item.variantName}` : item.name,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        currency_id: "BRL"
      })),
      payer: {
        name: order.customerSnapshot.name,
        email: order.customerSnapshot.email,
        phone: order.customerSnapshot.phone
          ? { number: order.customerSnapshot.phone }
          : undefined
      },
      external_reference: order.orderNumber,
      notification_url: `${siteUrl}/api/webhooks/mercado-pago`,
      back_urls: {
        success: `${siteUrl}/checkout/sucesso?order=${order.orderNumber}`,
        failure: `${siteUrl}/checkout/erro?order=${order.orderNumber}`,
        pending: `${siteUrl}/checkout/pendente?order=${order.orderNumber}`
      },
      payment_methods: {
        default_payment_method_id: "pix"
      },
      auto_return: "approved"
    });

    await this.orders.attachMercadoPagoPreference(order.id, preference.id);

    return {
      provider: "mercado_pago",
      orderId: order.id,
      orderNumber: order.orderNumber,
      preferenceId: preference.id,
      checkoutUrl: preference.init_point
    };
  }
}
