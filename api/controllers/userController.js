import { users } from "../data/users.js";

import { sendSuccess } from "../helper/response.js";

export const getAllUsers = (req, res) => {
  return sendSuccess(res, users, "Users retrieved successfully", 200);
};
