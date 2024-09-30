import express from "express";
import { fetchProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createProductSchemaValidation, updateProductSchemaValidation } from "../validations/product-validation..js";

const router = express.Router();

router.route("/:id?").get(protect, fetchProduct);
router.route("/").post(protect, createProductSchemaValidation ,createProduct);
router.route("/:id").put(protect, updateProductSchemaValidation, updateProduct);
router.route("/:id").delete(protect, deleteProduct);

export default router;
