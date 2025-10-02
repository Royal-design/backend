import express from "express";
import { validate } from "../middleware/validate";
import { handleRegister } from "../controllers/registerController";
import { registerSchema } from "../schemas/registerSchema";

const router = express.Router();

router.post("/", validate(registerSchema), handleRegister);

export default router;
