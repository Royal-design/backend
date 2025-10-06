import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../model/User";

export const handleGoogleLogin = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "1d" }
    );

    await User.findByIdAndUpdate(user.id, { refreshToken });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // res.redirect(
    //   `http://localhost:3000/social-auth-success?token=${accessToken}`
    // );

    res.redirect(`/profile?token=${accessToken}`);
  } catch (error) {}
};
