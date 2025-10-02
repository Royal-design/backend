import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  status: number,
  data: T,
  message = "Success"
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  status: number,
  message = "Error",
  errors?: any
) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};
