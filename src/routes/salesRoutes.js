import express from "express";
import { fetchSales, createSales, updateSales, deleteSales } from "../controllers/salesContoller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, fetchSales);
router.route("/create").post(protect, createSales);
router.route("/update").put(protect, updateSales);
router.route("/delete").delete(protect, deleteSales);

export default router;
