import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/products.js";

const router = express.Router();
router.get("/", getAllProducts);
router.post("/create", createProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
