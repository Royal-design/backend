import { users } from "../data/users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendError, sendSuccess } from "../helper/response.js";
import bcrypt from "bcrypt";
import * as fsPromises from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export const handleLogin = async (req, res) => {
  const { pwd, user } = req.body;
  if (!user || !pwd)
    return sendError(res, "Username and Password are required", 400);

  const userIndex = users.findIndex((u) => u.user === user);
  if (userIndex === -1) return sendError(res, "Unauthorized user", 401);

  const foundUser = users[userIndex];
  const isMatched = await bcrypt.compare(pwd, foundUser.pwd);

  if (!isMatched) {
    return sendError(res, "Unauthorized user", 401);
  }

  // Generate tokens
  const accessToken = jwt.sign(
    { user: foundUser.user },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "305" }
  );

  const refreshToken = jwt.sign(
    { user: foundUser.user },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  // Update existing user instead of creating duplicate
  users[userIndex].refreshToken = refreshToken;

  // Save to file
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(users)
  );

  // Set secure cookie
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    // sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });

  return sendSuccess(res, { accessToken }, "User logged in successfully", 200);
};
