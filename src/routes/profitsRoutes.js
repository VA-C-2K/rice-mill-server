import express from "express";
import { fetchProfit } from "../controllers/profitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, fetchProfit);

export default router;
