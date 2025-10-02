import express from "express";
import { validate } from "../middleware/validate";
import { loginSchema } from "../schemas/loginSchema";
import { handleLogin } from "../controllers/authController";

const router = express.Router();

router.post("/", validate(loginSchema), handleLogin);

export default router;
