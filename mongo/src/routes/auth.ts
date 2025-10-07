import express from "express";
import { validate } from "../middleware/validate";
import { loginSchema } from "../schemas/loginSchema";
import { handleLogin, handleSocialLogin } from "../controllers/authController";
import passport from "../config/passport";

const router = express.Router();

// google oauth;
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  handleSocialLogin
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  handleSocialLogin
);

router.post("/", validate(loginSchema), handleLogin);

export default router;
