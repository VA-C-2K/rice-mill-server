import express from "express";
import { fetchEmployee, createEmployee, updateEmployee, deleteEmployee } from "../controllers/employeeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createEmployeeSchemaValidation, updateEmployeeSchemaValidation } from "../validations/employee-validation.js";

const router = express.Router();

router.route("/:id?").get(protect, fetchEmployee);
router.route("/").post(protect, createEmployeeSchemaValidation, createEmployee);
router.route("/:id").put(protect, updateEmployeeSchemaValidation, updateEmployee);
router.route("/:id").delete(protect, deleteEmployee);

export default router;
