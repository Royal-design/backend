import express from "express";
import { validate } from "../middleware/validate";
import { registerSchema } from "../schemas/registerSchema";
import { registerController } from "../controller/registerController";

const router = express.Router();

router.post("/", validate(registerSchema), registerController);

export default router;
