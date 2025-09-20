import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/products.js";
import { validate } from "../middleware/validate.js";
import {
  productSchema,
  updateProductSchema,
} from "../schemas/productSchema.js";

const router = express.Router();

// Get all products
router.get("/", getAllProducts);

// Create product (validate full schema)
router.post("/create", validate(productSchema), createProduct);

// Update product (validate partial schema)
router.put("/update/:id", validate(updateProductSchema), updateProduct);

// Delete product
router.delete("/delete/:id", deleteProduct);

// Get single product by id
router.get("/:id", getProductById);

export default router;
