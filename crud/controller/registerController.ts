import { Request, Response } from "express";
import bcrypt from "bcrypt";
import type { RegisterInput } from "../schemas/registerSchema";
import fsPromises from "fs/promises";
import path from "path";
import { sendError, sendSuccess } from "../utils/status";
import { modelDir, usersFile } from "../utils/file";

export const registerController = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response
) => {
  const { password, ...other } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await fsPromises.mkdir(modelDir, { recursive: true });

  // 🔹 Step 1: Load existing users if file exists
  let existingUsers: any[] = [];
  try {
    const data = await fsPromises.readFile(usersFile, "utf8");
    existingUsers = JSON.parse(data);
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
  }

  const updatedUsers = [
    ...existingUsers,
    { ...other, password: hashedPassword },
  ];

  const isEmail = existingUsers.find((user) => user.email === req.body.email);
  if (isEmail) return sendError(res, 409, "Email exist");
  // 🔹 Step 3: Save back to file
  await fsPromises.writeFile(usersFile, JSON.stringify(updatedUsers, null, 2));

  return sendSuccess(res, 201, other, "User created successfully!");
};
