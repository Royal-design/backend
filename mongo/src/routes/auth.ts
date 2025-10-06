import express from "express";
import { validate } from "../middleware/validate";
import { loginSchema } from "../schemas/loginSchema";
import { handleLogin } from "../controllers/authController";
import passport from "../config/passport";
import { handleGoogleLogin } from "../controllers/googleController";

const router = express.Router();

// google oauth;
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  handleGoogleLogin
);

router.post("/", validate(loginSchema), handleLogin);

export default router;
