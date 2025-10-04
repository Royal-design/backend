import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return sendError(res, 401, "User is not authorized");
  const token = authHeader.split(" ")[1];

  const accessToken = process.env.ACCESS_TOKEN_SECRET;
  if (!accessToken) return res.sendStatus(500);

  jwt.verify(token, accessToken, (err, decoded) => {
    if (err) return res.sendStatus(403);
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
