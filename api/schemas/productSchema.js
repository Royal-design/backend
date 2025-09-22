import { z } from "zod";

export const productSchema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    price: z.number().positive("Price must be a positive number"),
    category: z.string().min(1, "Category is required"),
    inStock: z.boolean(),
  })
  .strict();

export const updateProductSchema = productSchema.partial().strict();
