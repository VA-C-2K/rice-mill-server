import express from "express";
import { fetchProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, fetchProduct);
router.route("/create").post(protect, createProduct);
router.route("/update").put(protect, updateProduct);
router.route("/delete").delete(protect, deleteProduct);

export default router;
