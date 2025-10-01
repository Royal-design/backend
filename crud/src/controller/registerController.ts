// import { Request, Response } from "express";
// import bcrypt from "bcrypt";
// import type { RegisterInput } from "../schemas/registerSchema";
// import fsPromises from "fs/promises";
// import { sendError, sendSuccess } from "../schemas/utils/status";
// import { modelDir, usersFile } from "../schemas/utils/file";

// export const registerController = async (
//   req: Request<{}, {}, RegisterInput>,
//   res: Response
// ) => {
//   const { password, ...other } = req.body;

//   const hashedPassword = await bcrypt.hash(password, 10);

//   await fsPromises.mkdir(modelDir, { recursive: true });

//   let existingUsers: any[] = [];
//   try {
//     const data = await fsPromises.readFile(usersFile, "utf8");
//     existingUsers = JSON.parse(data);
//   } catch (err: any) {
//     if (err.code !== "ENOENT") throw err;
//   }

//   const newUser = { ...other, password: hashedPassword, refreshToken: "" };

//   const isEmail = existingUsers.find((user) => user.email === req.body.email);
//   if (isEmail) return sendError(res, 409, "Email exist");

//   const updatedUsers = [...existingUsers, newUser];

//   await fsPromises.writeFile(usersFile, JSON.stringify(updatedUsers, null, 2));

//   const { password: _, ...userWithoutPassword } = req.body;

//   return sendSuccess(
//     res,
//     201,
//     userWithoutPassword,
//     "User created successfully!"
//   );
// };

// With db

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import type { RegisterInput } from "../schemas/registerSchema";
import fsPromises from "fs/promises";
import { sendError, sendSuccess } from "../schemas/utils/status";
import { modelDir, usersFile } from "../schemas/utils/file";
import { User } from "../model/User";

export const registerController = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response
) => {
  try {
    const { password, ...other } = req.body;

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return sendError(res, 409, "User exists!");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      ...other,
      password: hashedPassword,
      refreshToken: "",
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return sendSuccess(
      res,
      201,
      userWithoutPassword,
      "User created successfully!"
    );
  } catch (error: any) {
    return sendError(res, 500, error.message || "Server error");
  }
};
