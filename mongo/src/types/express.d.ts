import "express-serve-static-core";
import type { Role } from "./user";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      name: string;
      email: string;
      roles: Role[];
    };
  }
}
