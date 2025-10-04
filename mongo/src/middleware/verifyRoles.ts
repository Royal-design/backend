import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import type { Role } from "../types/user";

export const verifyRoles =
  (...allowedRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.user?.roles;
    if (!userRoles) return sendError(res, 401, "User is not authenticated");

    const hasAllowedRole = userRoles.some((role) =>
      allowedRoles.includes(role)
    );
    if (!hasAllowedRole) return sendError(res, 403, "User is not authorized");
    next();
  };
