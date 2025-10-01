import express from "express";

import { getUsers } from "../controller/userController";
import { verifyJwt } from "../verifyJwt";

const router = express.Router();

router.get("/", verifyJwt, getUsers);

export default router;
