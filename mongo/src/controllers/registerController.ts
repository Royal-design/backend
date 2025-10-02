import { Request, Response } from "express";
import bcrypt from "bcrypt";
import type { RegisterInput } from "../schemas/registerSchema";
import { sendError, sendSuccess } from "../utils/response";
import { User } from "../model/User";

export const handleRegister = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response
) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return sendError(res, 409, "A user with this email already exists.");
    }

    const hashedPw = await bcrypt.hash(req.body.password, 10);

    const newUser = await User.create({
      ...req.body,
      password: hashedPw,
      refreshToken: "",
    });

    const { password, ...safeUser } = newUser.toObject();

    return sendSuccess(res, 201, safeUser, "User registered successfully.");
  } catch (error) {
    console.error("Registration Error:", error);
    return sendError(
      res,
      500,
      "Internal server error. Please try again later."
    );
  }
};
