import express from "express";
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  updateStudent,
} from "../controllers/students.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = express.Router();
router.get("/", verifyJWT, getAllStudents);
router.post("/create", createStudent);
router.put("/update/:id", updateStudent);
router.delete("/delete/:id", deleteStudent);

export default router;
