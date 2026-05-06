import { z } from "zod";
import { cartSchema } from "@/lib/commerce/cart/cart.schema";

export const orderStatusSchema = z.enum([
  "draft",
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded"
]);

export const paymentStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "cancelled",
  "refunded"
]);

export const customerSnapshotSchema = z.object({
  name: z.string().min(2).max(160),
  email: z.string().email(),
  phone: z.string().max(40).nullable().default(null),
  document: z.string().max(40).nullable().default(null),
  address: z.object({
    line1: z.string().min(3).max(180),
    line2: z.string().max(180).nullable().optional(),
    neighborhood: z.string().max(120).nullable().optional(),
    city: z.string().min(2).max(120),
    state: z.string().min(2).max(80),
    postalCode: z.string().min(5).max(20),
    country: z.string().min(2).max(80).default("BR")
  })
});

export const checkoutCreateSchema = z.object({
  cart: cartSchema,
  customer: customerSnapshotSchema
});

export const orderAdminUpdateSchema = z.object({
  id: z.string().uuid(),
  status: orderStatusSchema.optional(),
  paymentStatus: paymentStatusSchema.optional()
});

export const operationalOrderStatusSchema = z.enum([
  "processing",
  "shipped",
  "delivered",
  "cancelled"
]);

export const orderOperationalUpdateSchema = z.object({
  id: z.string().uuid(),
  status: operationalOrderStatusSchema
});

export type CheckoutCreateInput = z.infer<typeof checkoutCreateSchema>;
export type OrderAdminUpdateInput = z.infer<typeof orderAdminUpdateSchema>;
export type OrderOperationalUpdateInput = z.infer<typeof orderOperationalUpdateSchema>;
