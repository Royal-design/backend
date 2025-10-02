import { z } from "zod";

export const loginSchema = z.strictObject({
  email: z.email("Invalid email address"),

  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password is too long"),
});

export type LoginInput = z.infer<typeof loginSchema>;
