import { Request, Response } from "express";
import { sendError } from "../utils/response";
import { User } from "../model/User";

export const handleLogout = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true });
      return res.sendStatus(204);
    }

    foundUser.refreshToken = "";
    await foundUser.save();

    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  } catch (error) {
    return sendError(
      res,
      500,
      "Internal server error. Please try again later."
    );
  }
};
