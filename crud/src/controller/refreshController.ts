import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import fsPromises from "fs/promises";
import { usersFile } from "../schemas/utils/file";

export const handleRefresh = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  let users: any[] = [];
  try {
    users = JSON.parse(await fsPromises.readFile(usersFile, "utf8"));
  } catch (error: any) {
    if (error.code !== "ENOENT") throw error;
  }

  const foundUser = users.find((user) => user.refreshToken === refreshToken);
  if (!foundUser) return res.sendStatus(403);

  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshTokenSecret) return res.sendStatus(500);

  jwt.verify(
    refreshToken,
    refreshTokenSecret,
    (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err || foundUser.email !== decoded.email) return res.sendStatus(403);

      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
      if (!accessTokenSecret) return res.sendStatus(500);

      const accessToken = jwt.sign(
        { name: foundUser.name, email: foundUser.email },
        accessTokenSecret,
        { expiresIn: "1m" }
      );

      return res.json({ accessToken });
    }
  );
};
