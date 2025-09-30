import { Response, Request } from "express";
import fsPromises from "fs/promises";
import { usersFile } from "../utils/file";
import { sendSuccess, sendError } from "../utils/status";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const data = await fsPromises.readFile(usersFile, "utf8");
    const users = JSON.parse(data);
    return sendSuccess(res, 200, users, "Users fetched successfully!");
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // File not found = no users yet
      return sendSuccess(res, 200, [], "No users found yet");
    }
    return sendError(res, 500, "Failed to fetch users");
  }
};
