import express from "express";
import { fetchCustomer, createCustomer, updateCustomer, deleteCustomer } from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, fetchCustomer);
router.route("/create").post(protect, createCustomer);
router.route("/update").put(protect, updateCustomer);
router.route("/delete").delete(protect, deleteCustomer);

export default router;