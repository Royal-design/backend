import { z } from "zod";

export const RoleEnum = z.enum(["user", "admin", "moderator"]);

export const RoleSchema = z.object({
  role: RoleEnum,
});

export const PartialRoleSchema = RoleSchema.partial();
