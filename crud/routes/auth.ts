import express from "express";

import { authController } from "../controller/authController";

const router = express.Router();

router.post("/", authController);

export default router;
