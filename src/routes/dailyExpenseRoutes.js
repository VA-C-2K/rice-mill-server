import express from "express";
import { fetchDailyExpense, createDailyExpense, updateDailyExpense, deleteDailyExpense } from "../controllers/dailyExpenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, fetchDailyExpense);
router.route("/create").post(protect, createDailyExpense);
router.route("/update").put(protect, updateDailyExpense);
router.route("/delete").delete(protect, deleteDailyExpense);

export default router;
