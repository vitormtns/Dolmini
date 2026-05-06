import { z } from "zod";

export const productStatusSchema = z.enum([
  "active",
  "draft",
  "archived",
  "out_of_stock"
]);

export const productImageInputSchema = z.object({
  storagePath: z.string().min(1),
  url: z.string().url().nullable().optional(),
  altText: z.string().max(160).nullable().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0)
});

export const productVariantInputSchema = z.object({
  id: z.string().uuid().optional(),
  sku: z.string().max(80).nullable().optional(),
  name: z.string().min(1).max(120),
  optionValues: z.record(z.string().min(1), z.string().min(1)).default({}),
  priceAdjustment: z.coerce.number().default(0),
  stockQuantity: z.coerce.number().int().min(0).default(0),
  status: productStatusSchema.default("active")
});

const productBaseSchema = z.object({
  categoryId: z.string().uuid().nullable().optional(),
  name: z.string().min(2).max(160),
  slug: z.string().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortDescription: z.string().max(280).nullable().optional(),
  description: z.string().nullable().optional(),
  price: z.coerce.number().positive(),
  salePrice: z.coerce.number().positive().nullable().optional(),
  stockQuantity: z.coerce.number().int().min(0).default(0),
  status: productStatusSchema.default("draft"),
  isFeatured: z.coerce.boolean().default(false),
  isPromotion: z.coerce.boolean().default(false),
  seoTitle: z.string().max(180).nullable().optional(),
  seoDescription: z.string().max(280).nullable().optional(),
  images: z.array(productImageInputSchema).default([]),
  variants: z.array(productVariantInputSchema).default([])
});

export const productCreateSchema = productBaseSchema.superRefine((input, context) => {
  if (input.salePrice != null && input.salePrice >= input.price) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["salePrice"],
      message: "Preco promocional deve ser menor que o preco normal."
    });
  }

  if (input.status === "active" && !input.categoryId) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["categoryId"],
      message: "Categoria e obrigatoria para publicar produto."
    });
  }
});

export const productUpdateSchema = productBaseSchema.partial().extend({
  id: z.string().uuid()
}).superRefine((input, context) => {
  if (input.salePrice != null && input.price != null && input.salePrice >= input.price) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["salePrice"],
      message: "Preco promocional deve ser menor que o preco normal."
    });
  }

  if (input.status === "active" && input.categoryId === null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["categoryId"],
      message: "Categoria e obrigatoria para publicar produto."
    });
  }
});

export const productListQuerySchema = z.object({
  categorySlug: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  search: z.string().optional(),
  status: productStatusSchema.optional(),
  includeInactive: z.coerce.boolean().default(false)
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
