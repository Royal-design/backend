import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { Role } from "../model/Role";

export const getRoles = async (_req: Request, res: Response) => {
  try {
    const roles = await Role.find()
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(res, 200, roles, "Roles retrieved successfully!");
  } catch (error) {
    console.error("Get Roles Error:", error);
    return sendError(
      res,
      500,
      "Internal server error. Please try again later."
    );
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;

    // if (!role || typeof role !== "string") {
    //   return sendError(res, 400, "Role is required and must be a string.");
    // }

    const isExisting = await Role.findOne({ role });
    if (isExisting) return sendError(res, 409, "Role exists");

    await Role.create({ role });
    return sendSuccess(res, 201, role, "Role created successfully!");
  } catch (error) {
    console.error(error);
    return sendError(
      res,
      500,
      "Internal server error. Please try again later."
    );
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!id) return sendError(res, 400, "Role ID is required.");
    // if (!role || typeof role !== "string") {
    //   return sendError(res, 400, "Role is required and must be a string.");
    // }

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!updatedRole) {
      return sendError(res, 404, "Role not found.");
    }
    const { role: returnRole } = updatedRole;
    return sendSuccess(res, 200, returnRole, "Role updated successfully!");
  } catch (error) {
    console.error("Update Role Error:", error);
    return sendError(
      res,
      500,
      "Internal server error. Please try again later."
    );
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(res, 400, "Role ID is required.");
    }

    const deletedRole = await Role.findByIdAndDelete(id);

    if (!deletedRole) {
      return sendError(res, 404, "Role not found.");
    }

    const { role: returnRole } = deletedRole;

    return sendSuccess(res, 200, returnRole, "Role deleted successfully!");
  } catch (error) {
    console.error("Delete Role Error:", error);
    return sendError(
      res,
      500,
      "Internal server error. Please try again later."
    );
  }
};
