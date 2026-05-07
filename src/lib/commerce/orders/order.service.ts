import { CartService } from "@/lib/commerce/cart/cart.service";
import { CommerceError } from "@/lib/commerce/shared/errors";
import { OrderRepository } from "@/lib/commerce/orders/order.repository";
import type { CheckoutCreateInput, OrderAdminUpdateInput, OrderOperationalUpdateInput } from "@/lib/commerce/orders/order.schema";

export class OrderService {
  constructor(
    private readonly orders: OrderRepository,
    private readonly cart: CartService
  ) {}

  listAdmin() {
    return this.orders.list();
  }

  async getAdminById(id: string) {
    const order = await this.orders.findById(id);
    if (!order) throw new CommerceError("Pedido não encontrado.", "order_not_found", 404);
    return order;
  }

  async createPendingPayment(input: CheckoutCreateInput) {
    const validatedCart = await this.cart.validate(input.cart);
    const order = await this.orders.createPendingPayment(input.customer, validatedCart);

    if (!order) {
      throw new CommerceError("Não foi possível criar o pedido.", "order_create_failed", 500);
    }

    return order;
  }

  async updateAdmin(input: OrderAdminUpdateInput) {
    await this.orders.updatePaymentState(input.id, {
      status: input.status,
      paymentStatus: input.paymentStatus
    });
    return this.orders.findById(input.id);
  }

  async updateOperationalStatus(input: OrderOperationalUpdateInput) {
    await this.orders.updatePaymentState(input.id, {
      status: input.status
    });
    return this.getAdminById(input.id);
  }
}
