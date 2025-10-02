import { ZodError, type ZodType } from "zod";
import { Request, Response, type NextFunction } from "express";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          errors: error.issues.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
