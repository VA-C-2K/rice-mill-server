import express from "express";
import { fetchEmployee, createEmployee, updateEmployee, deleteEmployee } from "../controllers/employeeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createEmployeeSchema, updateEmployeeSchema } from "../validations/employee-validation-schema.js";
import { validatePayload } from "../validations/index.js";

const router = express.Router();

router.route("/:id?")
  .get(protect, fetchEmployee)
  .post(protect, validatePayload(createEmployeeSchema),createEmployee);

router.route("/:id")
  .put(protect, validatePayload(updateEmployeeSchema), updateEmployee)
  .delete(protect, deleteEmployee);

export default router;