import { MercadoPagoService } from "@/lib/commerce/payments/mercado-pago/mercado-pago.service";
import type { Order } from "@/lib/commerce/orders/order.types";

export class PaymentService {
  constructor(private readonly mercadoPago: MercadoPagoService) {}

  createCheckout(order: Order) {
    return this.mercadoPago.createPreference(order);
  }
}
