export type PaymentProvider = "mercado_pago";

export type CreateCheckoutResult = {
  provider: PaymentProvider;
  orderId: string;
  orderNumber: string;
  checkoutUrl: string;
  preferenceId: string;
};
