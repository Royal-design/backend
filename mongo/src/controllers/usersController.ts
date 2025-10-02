import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { User } from "../model/User";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    const totalUsers = await User.countDocuments();

    // Fetch paginated users
    const users = await User.find()
      .skip(skip)
      .limit(pageSize)
      .select("-password -refreshToken -__v")
      .lean();

    const totalPages = Math.ceil(totalUsers / pageSize);

    return sendSuccess(
      res,
      200,
      {
        users,
        totalPages,
        totalUsers,
        pageSize,
        currentPage: page,
      },
      "Users fetched successfully."
    );
  } catch (error) {
    console.error("Get Users Error:", error);
    return sendError(
      res,
      500,
      "Internal server error. Please try again later."
    );
  }
};
