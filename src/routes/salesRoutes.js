import express from "express";
import { fetchSales, createSales, updateSales, deleteSales } from "../controllers/salesContoller.js";
import { protect } from "../middleware/authMiddleware.js";
import { createSalesSchemaValidation, updateSaleslSchemaValidation } from "../validations/sales-validation..js";

const router = express.Router();

router.route("/:id?").get(protect, fetchSales);
router.route("/").post(protect, createSalesSchemaValidation, createSales);
router.route("/:id").put(protect, updateSaleslSchemaValidation, updateSales);
router.route("/:id").delete(protect, deleteSales);

export default router;
