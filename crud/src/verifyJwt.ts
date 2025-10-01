import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) return res.sendStatus(500);

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.sendStatus(403);
    if (typeof decoded === "object" && decoded !== null) {
      req.user = {
        name: decoded.name as string,
        email: decoded.email as string,
      };
    }
    next();
  });
};
