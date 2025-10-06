import { Request, Response } from "express";
import type { LoginInput } from "../schemas/loginSchema";
import { User } from "../model/User";
import { sendError, sendSuccess } from "../utils/response";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const handleLogin = async (
  req: Request<{}, {}, LoginInput>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email: email });
    if (!foundUser) return sendError(res, 401, "Invalid email or password.");

    if (!foundUser.password)
      return sendError(res, 401, "Invalid email or password.");
    const isMatched = await bcrypt.compare(password, foundUser.password);
    if (!isMatched) return sendError(res, 401, "Invalid email or password.");

    const accessToken = jwt.sign(
      {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        roles: foundUser.roles,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "5m" }
    );
    const refreshToken = jwt.sign(
      { id: foundUser.id },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    const returnUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      roles: foundUser.roles,
      accessToken,
    };
    foundUser.refreshToken = refreshToken;
    await foundUser.save();
    return sendSuccess(res, 200, returnUser, "User logged in successfully!");
  } catch (error) {
    console.error("Registration Error:", error);
    return sendError(
      res,
      500,
      "Internal server error. Please try again later."
    );
  }
};
