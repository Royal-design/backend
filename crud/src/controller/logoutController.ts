import { Request, Response } from "express";
import fsPromises from "fs/promises";
import { usersFile } from "../schemas/utils/file";

export const handleLogout = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies?.jwt;
  let users: any[] = [];
  try {
    users = JSON.parse(await fsPromises.readFile(usersFile, "utf8"));
  } catch (error: any) {
    if (error.code !== "ENOENT") throw error;
  }
  const foundUser = users.find((user) => user.refreshToken === refreshToken);
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    res.sendStatus(204);
  }

  const otherUsers = users.filter((user) => user.refreshToken !== refreshToken);
  const currentUser = { ...foundUser, refreshToken: "" };
  const updatedUsers = [...otherUsers, currentUser];

  await fsPromises.writeFile(usersFile, JSON.stringify(updatedUsers, null, 2));
  res.clearCookie("jwt", { httpOnly: true, sameSite: "strict", secure: true });
  res.sendStatus(204);
};
