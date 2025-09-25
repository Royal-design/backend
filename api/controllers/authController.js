import { users } from "../data/users.js";
import jwt from "jsonwebtoken";
import { sendError, sendSuccess } from "../helper/response.js";
import bcrypt from "bcrypt";
import * as fsPromises from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleLogin = async (req, res) => {
  const { pwd, user } = req.body;
  if (!user || !pwd)
    return sendError(res, "Username and Password are required", 400);

  const foundUser = users.find((u) => u.user === user);
  if (!foundUser) return sendError(res, "Unauthorized user", 401);

  const isMatched = await bcrypt.compare(pwd, foundUser.pwd);

  if (!isMatched) {
    return sendError(res, "Unauthorized user", 401);
  }

  // Generate tokens
  const accessToken = jwt.sign(
    { user: foundUser.user },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1m" }
  );

  const refreshToken = jwt.sign(
    { user: foundUser.user },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  foundUser.refreshToken = refreshToken;

  // Save to file
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(users, null, 2)
  );

  // Set secure cookie
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return sendSuccess(res, { accessToken }, "User logged in successfully", 200);
};
