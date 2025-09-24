import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import path from "path";
import * as fsPromises from "fs/promises";
import { sendError, sendSuccess } from "../helper/response.js";
import { users } from "../data/users.js";

const __fileName = fileURLToPath(import.meta.url);
const __baseName = path.dirname(__fileName);
const usersFilePath = path.join(__baseName, "..", "model", "users.json");

export const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  const bodyKeys = Object.keys(req.body);
  const allowedKeys = ["user", "pwd"];

  if (!pwd || !user) {
    return sendError(res, "Username and Password are required!", 400);
  }

  for (const key of bodyKeys) {
    if (!allowedKeys.includes(key)) {
      return sendError(res, `Invalid field provided: ${key}`, 400);
    }
  }

  const duplicate = users.find((u) => u.user === user);
  if (duplicate) {
    return sendError(res, `User '${user}' already exists!`, 409);
  }

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = { id: users.length + 1, user, pwd: hashedPwd };

    // Add to in-memory array
    users.push(newUser);

    // // Save full array to JSON file
    // await fsPromises.mkdir(path.join(__baseName, "..", "model"), {
    //   recursive: true,
    // });
    // await fsPromises.writeFile(usersFilePath, JSON.stringify(users, null, 2));

    // console.log("Users after adding new:", users);
    return sendSuccess(res, newUser, "New user added", 201);
  } catch (error) {
    return sendError(res, error.message || "Server error", 500);
  }
};
