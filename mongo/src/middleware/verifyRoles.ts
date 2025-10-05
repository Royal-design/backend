import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import type { Role } from "../types/user";

export const verifyRoles =
  (...allowedRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.user?.roles;

    if (!userRoles) {
      return sendError(res, 401, "Authentication required. Please log in.");
    }

    const hasAllowedRole = userRoles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasAllowedRole) {
      return sendError(
        res,
        403,
        `Access denied. Required role(s): ${allowedRoles.join(", ")}`
      );
    }

    next();
  };
