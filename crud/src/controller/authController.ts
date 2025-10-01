import jwt from "jsonwebtoken";
import express, { Response, Request } from "express";
import bcrypt from "bcrypt";
import { sendError, sendSuccess } from "../schemas/utils/status";
import fsPromises from "fs/promises";
import { usersFile } from "../schemas/utils/file";

export const authController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return sendError(res, 400, "Email and password are required!");
  let users: any[] = [];
  try {
    const data = await fsPromises.readFile(usersFile, "utf8");
    users = JSON.parse(data);
  } catch (error: any) {
    if (error.code !== "ENOENT") throw error;
  }

  const foundUser = users.find((user) => user.email === email);
  if (!foundUser) return sendError(res, 401, "Unauthorized user");

  const isMatched = await bcrypt.compare(password, foundUser.password);
  if (!isMatched) return sendError(res, 401, "Unauthorized user");

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!accessTokenSecret) {
    throw new Error(
      "ACCESS_TOKEN_SECRET is not defined in environment variables"
    );
  }
  if (!refreshTokenSecret) {
    throw new Error(
      "REFRESH_TOKEN_SECRET is not defined in environment variables"
    );
  }
  const accessToken = jwt.sign(
    { name: foundUser.name, email: foundUser.email },
    accessTokenSecret,
    { expiresIn: "1m" }
  );

  const refreshToken = jwt.sign(
    { name: foundUser.name, email: foundUser.email },
    refreshTokenSecret,
    { expiresIn: "1d" }
  );

  foundUser.refreshToken = refreshToken;
  await fsPromises.writeFile(usersFile, JSON.stringify(users, null, 2));
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

  const data = {
    accessToken,
    name: foundUser.name,
    phoneNumber: foundUser.phoneNumber,
    email: foundUser.email,
  };

  return sendSuccess(res, 200, data, "Logged in successfully!");
};
