import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { User } from "../model/User";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;
    const search = (req.query.search as string) || "";

    const searchRegex = new RegExp(search, "i");

    let query = User.find()
      .select("-password -refreshToken -__v")
      .skip(skip)
      .limit(pageSize);

    let countQuery = User.find();

    if (search.trim() !== "") {
      query = query.or([
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ]);

      countQuery = countQuery.or([
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ]);
    }

    const [users, totalUsers] = await Promise.all([
      query.lean(),
      countQuery.countDocuments(),
    ]);

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
