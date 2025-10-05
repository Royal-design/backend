import express from "express";

import { getUsers, updateUser } from "../controllers/usersController";
import { upload } from "../config/multer";
import { validate } from "../middleware/validate";
import { updateUserSchema } from "../schemas/userSchema";
import { verifyRoles } from "../middleware/verifyRoles";

const router = express.Router();

router.get("/", getUsers);

router.put(
  "/:id",
  verifyRoles("admin"),
  upload.single("image"),
  validate(updateUserSchema),
  updateUser
);

export default router;
