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
  size: z.string().trim().max(40).nullable().optional(),
  color: z.string().trim().max(80).nullable().optional(),
  sku: z.string().trim().max(80).nullable().optional(),
  price: z.coerce.number().positive().nullable().optional(),
  stockQuantity: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true)
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
      message: "Preço promocional deve ser menor que o preço normal."
    });
  }

  if (input.status === "active" && !input.categoryId) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["categoryId"],
      message: "Categoria é obrigatória para publicar o produto."
    });
  }

  validateVariants(input.variants, context);
});

export const productUpdateSchema = productBaseSchema.partial().extend({
  id: z.string().uuid()
}).superRefine((input, context) => {
  if (input.salePrice != null && input.price != null && input.salePrice >= input.price) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["salePrice"],
      message: "Preço promocional deve ser menor que o preço normal."
    });
  }

  if (input.status === "active" && input.categoryId === null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["categoryId"],
      message: "Categoria é obrigatória para publicar o produto."
    });
  }

  if (input.variants) validateVariants(input.variants, context);
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

function validateVariants(
  variants: Array<z.infer<typeof productVariantInputSchema>>,
  context: z.RefinementCtx
) {
  const seen = new Set<string>();

  variants.forEach((variant, index) => {
    const size = variant.size?.trim() ?? "";
    const color = variant.color?.trim() ?? "";

    if (!size && !color) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["variants", index],
        message: "Informe tamanho, cor ou ambos para a variação."
      });
    }

    const key = `${size.toLocaleLowerCase("pt-BR")}::${color.toLocaleLowerCase("pt-BR")}`;
    if (seen.has(key)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["variants", index],
        message: "Já existe uma variação com o mesmo tamanho e cor."
      });
    }
    seen.add(key);
  });
}

