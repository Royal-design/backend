import { Response, Request } from "express";
import { sendError } from "../utils/response";
import { User } from "../model/User";
import jwt, { type VerifyErrors } from "jsonwebtoken";

export const handleRefresh = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies?.jwt;
    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) return res.sendStatus(403);
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!refreshTokenSecret) return res.sendStatus(500);

    jwt.verify(
      refreshToken,
      refreshTokenSecret,
      (err: VerifyErrors | null, decoded: any) => {
        if (err || foundUser.id !== decoded.id) return res.sendStatus(500);

        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        if (!accessTokenSecret) return res.sendStatus(500);

        const accessToken = jwt.sign(
          { id: foundUser.id, name: foundUser.name, email: foundUser.email },
          accessTokenSecret,
          { expiresIn: "1m" }
        );
        return res.json({ accessToken });
      }
    );
  } catch (error) {
    return sendError(
      res,
      500,
      "Internal server error. Please try again later."
    );
  }
};
