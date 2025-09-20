import { users } from "../data/users.js";

import { sendError, sendSuccess } from "../helper/response.js";
import bcrypt from "bcrypt";

export const handleLogin = async (req, res) => {
  const { pwd, user } = req.body;
  if (!user || !pwd)
    return sendError(res, "Username and Password are required", 400);

  const foundUser = users.find((u) => u.user === user);
  if (!foundUser) return sendError(res, "Unauthorized user", 401);

  const isMatched = await bcrypt.compare(pwd, foundUser.pwd);
  if (isMatched) {
    return sendSuccess(
      res,
      { id: foundUser.id, user: foundUser.user },
      "User logged in successfully",
      200
    );
  } else {
    return sendError(res, "Unauthorized user", 401);
  }
};
