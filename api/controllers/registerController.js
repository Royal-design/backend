import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import path from "path";
import * as fsPromises from "fs/promises";
import { sendError, sendSuccess } from "../helper/response.js";
import { users } from "../data/users.js";

const __fileName = fileURLToPath(import.meta.url);
const __baseName = path.dirname(__fileName);

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
    users.push(newUser);

    // await fsPromises.mkdir(path.join(__baseName, "..", "model"), {
    //   recursive: true,
    // });

    // await fsPromises.writeFile(
    //   path.join(__baseName, "..", "model", "users.json"),
    //   JSON.stringify(users)
    // );

    console.log(users);
    return sendSuccess(res, newUser, "New user added", 201);
  } catch (error) {
    return sendError(res, error.message || "Server error", 500);
  }
};
