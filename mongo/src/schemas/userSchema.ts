import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    roles: z.array(z.enum(["admin", "user", "moderator"])),
  })
  .partial();
