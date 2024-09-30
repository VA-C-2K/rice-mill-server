import express from "express";
import { fetchSales, createSales, updateSales, deleteSales } from "../controllers/salesContoller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/:id?").get(protect, fetchSales);
router.route("/").post(protect, createSales);
router.route("/:id").put(protect, updateSales);
router.route("/:id").delete(protect, deleteSales);

export default router;
