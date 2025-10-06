import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return sendError(res, 401, "User is not authorized");
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return sendError(res, 401, "Access token expired");
      }
      return sendError(res, 403, "Invalid token");
    }

    if (typeof decoded === "object" && decoded !== null) {
      req.user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        roles: decoded.roles,
      };
    }
    next();
  });
};
