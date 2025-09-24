import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/", verifyJWT, getAllUsers);

export default router;
