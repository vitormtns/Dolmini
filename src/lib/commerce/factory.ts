import { CartService } from "@/lib/commerce/cart/cart.service";
import { InventoryService } from "@/lib/commerce/inventory/inventory.service";
import { OrderRepository } from "@/lib/commerce/orders/order.repository";
import { OrderService } from "@/lib/commerce/orders/order.service";
import { PaymentService } from "@/lib/commerce/payments/payment.service";
import { MercadoPagoClient } from "@/lib/commerce/payments/mercado-pago/mercado-pago.client";
import { MercadoPagoService } from "@/lib/commerce/payments/mercado-pago/mercado-pago.service";
import { MercadoPagoWebhookService } from "@/lib/commerce/payments/mercado-pago/mercado-pago.webhook";
import { PricingService } from "@/lib/commerce/pricing/pricing.service";
import { ProductRepository } from "@/lib/commerce/products/product.repository";
import { ProductService } from "@/lib/commerce/products/product.service";
import { CategoryRepository } from "@/lib/commerce/categories/category.repository";
import { CategoryService } from "@/lib/commerce/categories/category.service";
import type { SupabaseClient } from "@supabase/supabase-js";

type Client = SupabaseClient<any, "public", any>;

export function createCommerceCore(supabase: Client) {
  const productRepository = new ProductRepository(supabase);
  const categoryRepository = new CategoryRepository(supabase);
  const orderRepository = new OrderRepository(supabase);
  const pricingService = new PricingService();
  const inventoryService = new InventoryService(supabase);
  const cartService = new CartService(productRepository, pricingService, inventoryService);
  const orderService = new OrderService(orderRepository, cartService);
  const mercadoPagoClient = new MercadoPagoClient();
  const mercadoPagoService = new MercadoPagoService(mercadoPagoClient, orderRepository);

  return {
    products: new ProductService(productRepository),
    categories: new CategoryService(categoryRepository),
    cart: cartService,
    orders: orderService,
    payments: new PaymentService(mercadoPagoService),
    mercadoPagoWebhook: new MercadoPagoWebhookService(
      supabase,
      mercadoPagoClient,
      orderRepository,
      inventoryService
    )
  };
}
