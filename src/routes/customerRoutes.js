import express from "express";
import { fetchCustomer, createCustomer, updateCustomer, deleteCustomer } from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createCustomerSchemaValidation, updateCustomerSchemaValidation } from "../validations/customer-validation.js";

const router = express.Router();

router.route("/:id?").get(protect, fetchCustomer);
router.route("/").post(protect, createCustomerSchemaValidation, createCustomer);
router.route("/:id").put(protect, updateCustomerSchemaValidation, updateCustomer);
router.route("/:id").delete(protect, deleteCustomer);

export default router;
