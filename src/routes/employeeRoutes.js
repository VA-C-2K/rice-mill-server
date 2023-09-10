import express from "express";
import { fetchEmployee, createEmployee, updateEmployee, deleteEmployee } from "../controllers/employeeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, fetchEmployee);
router.route("/create").post(protect, createEmployee);
router.route("/update").put(protect, updateEmployee);
router.route("/delete").delete(protect, deleteEmployee);

export default router;
