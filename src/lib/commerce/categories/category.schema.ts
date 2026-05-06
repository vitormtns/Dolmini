import { z } from "zod";

export const categoryStatusSchema = z.enum(["active", "draft", "archived"]);

export const categoryCreateSchema = z.object({
  parentId: z.string().uuid().nullable().optional(),
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().nullable().optional(),
  status: categoryStatusSchema.default("draft"),
  sortOrder: z.coerce.number().int().min(0).default(0)
});

export const categoryUpdateSchema = categoryCreateSchema.partial().extend({
  id: z.string().uuid()
});

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
