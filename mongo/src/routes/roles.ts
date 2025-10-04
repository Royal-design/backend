import express from "express";
import {
  deleteRole,
  createRole,
  getRoles,
  updateRole,
} from "../controllers/roleController";
import { verifyRoles } from "../middleware/verifyRoles";
import { validate } from "../middleware/validate";
import { PartialRoleSchema, RoleSchema } from "../schemas/roleSchema";

const router = express.Router();

router.get("/", verifyRoles("admin"), getRoles);
router.post("/", validate(RoleSchema), verifyRoles("admin"), createRole);
router.put(
  "/:id",
  validate(PartialRoleSchema),
  verifyRoles("admin"),
  updateRole
);
router.delete("/:id", verifyRoles("admin"), deleteRole);

export default router;
