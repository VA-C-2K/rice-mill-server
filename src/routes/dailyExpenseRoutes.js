import express from "express";
import { fetchDailyExpense, createDailyExpense, updateDailyExpense, deleteDailyExpense } from "../controllers/dailyExpenseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createDailyExpenseSchemaValidation, updateDailyExpenseSchemaValidation } from "../validations/daily-expences-validation.js";

const router = express.Router();

router.route("/:id?").get(protect, fetchDailyExpense);
router.route("/").post(protect, createDailyExpenseSchemaValidation, createDailyExpense);
router.route("/:id").put(protect, updateDailyExpenseSchemaValidation, updateDailyExpense);
router.route("/:id").delete(protect, deleteDailyExpense);

export default router;
