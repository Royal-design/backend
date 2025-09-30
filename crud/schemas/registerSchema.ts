import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password is too long"),

    email: z.email("Invalid email address"),

    phoneNumber: z
      .string()
      .regex(/^[0-9]{10,15}$/, "Phone number must be between 10 and 15 digits"),
  })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;
