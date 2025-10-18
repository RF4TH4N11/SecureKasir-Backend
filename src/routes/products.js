import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getProductsByCategory,
  updateProductStock,
} from "../controllers/productController.js";

const router = express.Router();

// Get all categories
router.get("/categories", getCategories);

// Get products by category
router.get("/category/:category", getProductsByCategory);

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);

// Create product
router.post("/", createProduct);

// Update product
router.put("/:id", updateProduct);

// Update product stock
router.patch("/:id/stock", updateProductStock);

// Delete product
router.delete("/:id", deleteProduct);

export default router;
