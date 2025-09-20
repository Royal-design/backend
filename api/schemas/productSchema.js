import { z } from "zod";

// Full schema for creating a product, strict to forbid unknown keys
export const productSchema = z
  .object({
    name: z.string({ required_error: "Product name is required" }).min(1),
    price: z.number({ required_error: "Price is required" }).positive(),
    category: z.string({ required_error: "Category is required" }).min(1),
    inStock: z.boolean({ required_error: "inStock field is required" }),
  })
  .strict(); // ❌ this prevents extra fields

// Partial schema for updating a product, also strict
export const updateProductSchema = productSchema.partial().strict();
