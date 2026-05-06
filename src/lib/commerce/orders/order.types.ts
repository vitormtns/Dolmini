import type { ValidatedCartItem } from "@/lib/commerce/cart/cart.types";

export type OrderStatus =
  | "draft"
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "refunded";

export type CustomerSnapshot = {
  name: string;
  email: string;
  phone: string | null;
  document: string | null;
  address: {
    line1: string;
    line2?: string | null;
    neighborhood?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};

export type Order = {
  id: string;
  orderNumber: string;
  customerId: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  totalCents: number;
  currency: string;
  customerSnapshot: CustomerSnapshot;
  mercadoPagoPreferenceId: string | null;
  mercadoPagoPaymentId: string | null;
  stockDeductedAt: string | null;
  items: ValidatedCartItem[];
  createdAt: string;
  updatedAt: string;
};
